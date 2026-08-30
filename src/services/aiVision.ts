import { EWasteCategory, EWasteItemAnalysis, HazardLevel } from '../types';
import { PRESET_SAMPLE_ITEMS } from '../data/sampleItems';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const getApiKey = () =>
  (import.meta as any).env?.VITE_GEMINI_API_KEY ||
  localStorage.getItem('ewaste_gemini_api_key') ||
  '';

const EWASTE_PROMPT = `You are an expert e-waste classification system for EWaste Off, an environmental app in Gwalior, India.

Analyze the image and determine if it shows an electronic/electrical device or component.

If the image does NOT contain any electronic device, component, cable, battery, or electrical equipment, respond ONLY with this exact JSON:
{"not_ewaste": true, "description": "brief description of what is actually in the image"}

If the image DOES contain e-waste or electronics, respond with this exact JSON structure (no markdown, no code blocks, raw JSON only):
{
  "detectedName": "specific device name with brand/model if visible",
  "category": one of ["Mobile Phones", "Laptops & Computers", "Batteries & Power", "Appliances & Consumer Tech", "Cables & Chargers", "PCBs & Internal Components", "Other Electronics"],
  "condition": one of ["Reusable", "Repairable", "Recyclable Only", "Hazardous / Damaged"],
  "conditionDescription": "1-2 sentence description of visible condition",
  "confidenceScore": number between 70-98,
  "likelyComponents": ["component1", "component2", "component3", "component4"],
  "materialsBreakdown": [
    {"material": "name", "percentage": number, "description": "short desc", "isPreciousOrRare": boolean, "isHazardous": boolean}
  ],
  "estimatedWeightKg": number,
  "hazardLevel": one of ["low", "medium", "high", "critical"],
  "hazardWarning": "specific hazard warning if applicable, or null",
  "safetyInstructions": ["instruction1", "instruction2", "instruction3"],
  "reuse_possible": boolean,
  "reuse_tip": "specific tip",
  "repair_possible": boolean,
  "repair_cost_inr": "cost range or null",
  "repair_tip": "specific repair tip",
  "donate_possible": boolean,
  "donate_tip": "specific donation tip",
  "recycle_action": "specific recycling action for Gwalior, mention Karo Sambhav/Greenscape/Namo E-Waste where relevant",
  "recycle_benefit": "environmental benefit",
  "recyclingChannels": ["channel1", "channel2"]
}

Be specific about what you see. If it's a phone, name the brand. If it's a damaged battery, say so. Context is Gwalior, MP, India.`;

async function callGeminiVision(imageBase64: string, mimeType: string): Promise<any> {
  const body = {
    contents: [{
      parts: [
        { text: EWASTE_PROMPT },
        {
          inline_data: {
            mime_type: mimeType,
            data: imageBase64
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1024,
    }
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${getApiKey()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');

  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

function parseGeminiResponse(geminiData: any): EWasteItemAnalysis {
  return {
    id: 'gemini-' + Date.now(),
    detectedName: geminiData.detectedName,
    category: geminiData.category as EWasteCategory,
    condition: geminiData.condition,
    conditionDescription: geminiData.conditionDescription,
    confidenceScore: geminiData.confidenceScore,
    likelyComponents: geminiData.likelyComponents,
    materialsBreakdown: geminiData.materialsBreakdown,
    estimatedWeightKg: geminiData.estimatedWeightKg,
    hazardLevel: geminiData.hazardLevel as HazardLevel,
    hazardWarning: geminiData.hazardWarning || undefined,
    safetyInstructions: geminiData.safetyInstructions,
    recommendationHierarchy: {
      reuse: {
        possible: geminiData.reuse_possible,
        tip: geminiData.reuse_tip
      },
      repair: {
        possible: geminiData.repair_possible,
        estimatedCostRangeInInr: geminiData.repair_cost_inr || undefined,
        tip: geminiData.repair_tip
      },
      donate: {
        possible: geminiData.donate_possible,
        tip: geminiData.donate_tip
      },
      recycle: {
        action: geminiData.recycle_action,
        environmentalBenefit: geminiData.recycle_benefit
      }
    },
    recyclingChannels: geminiData.recyclingChannels
  };
}

export class NotEWasteError extends Error {
  description: string;
  constructor(description: string) {
    super('not_ewaste');
    this.description = description;
  }
}

export const AIVisionService = {
  async analyzeImage(
    imageDataUrl?: string,
    manualQuery?: string,
    presetKey?: string
  ): Promise<EWasteItemAnalysis> {

    if (presetKey && PRESET_SAMPLE_ITEMS[presetKey]) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { ...PRESET_SAMPLE_ITEMS[presetKey], id: 'analyzed-' + Date.now() };
    }

    const query = (manualQuery || '').trim().toLowerCase();
    if (query) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return this.generateAnalysisFromQuery(query);
    }

    // real image — use Gemini Vision
    if (imageDataUrl) {
      if (!getApiKey()) {
        throw new Error('NO_API_KEY');
      }

      // strip the data:image/...;base64, prefix
      const match = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) throw new Error('Invalid image data URL');
      const mimeType = match[1];
      const base64Data = match[2];

      const geminiData = await callGeminiVision(base64Data, mimeType);

      if (geminiData.not_ewaste) {
        throw new NotEWasteError(geminiData.description || 'Not an electronic device');
      }

      return parseGeminiResponse(geminiData);
    }

    throw new Error('No image or query provided');
  },

  // keyword classifier for manual text search
  generateAnalysisFromQuery(query: string): EWasteItemAnalysis {
    let category: EWasteCategory = 'Other Electronics';
    let detectedName = query.charAt(0).toUpperCase() + query.slice(1);
    let condition: EWasteItemAnalysis['condition'] = 'Reusable';
    let hazardLevel: HazardLevel = 'low';
    let hazardWarning: string | undefined = undefined;
    let weight = 0.5;
    let confidence = Math.floor(Math.random() * 8) + 89;

    const q = query.toLowerCase();

    if (q.includes('phone') || q.includes('mobile') || q.includes('samsung') || q.includes('iphone') || q.includes('redmi') || q.includes('oneplus') || q.includes('realme') || q.includes('vivo') || q.includes('oppo') || q.includes('xiaomi')) {
      category = 'Mobile Phones';
      detectedName = q.includes('samsung') ? 'Samsung Galaxy Smartphone' : q.includes('iphone') ? 'Apple iPhone' : q.includes('redmi') ? 'Redmi Smartphone' : 'Smartphone';
      condition = 'Reusable';
      weight = 0.18;
      hazardLevel = 'medium';
      hazardWarning = 'Contains Lithium-ion cell. Do not puncture or expose to flames.';
    } else if (q.includes('battery') || q.includes('powerbank') || q.includes('power bank') || q.includes('ups') || q.includes('inverter')) {
      category = 'Batteries & Power';
      detectedName = q.includes('swollen') ? 'Swollen Lithium-Ion Battery' : q.includes('powerbank') || q.includes('power bank') ? 'Portable Power Bank' : 'Battery / UPS Unit';
      condition = q.includes('swollen') || q.includes('damaged') || q.includes('dead') ? 'Hazardous / Damaged' : 'Recyclable Only';
      weight = 0.35;
      hazardLevel = 'critical';
      hazardWarning = 'HAZARDOUS: Risk of thermal runaway. Tape terminals with insulation tape immediately.';
    } else if (q.includes('laptop') || q.includes('dell') || q.includes('hp') || q.includes('lenovo') || q.includes('acer') || q.includes('asus laptop') || q.includes('macbook') || q.includes('notebook')) {
      category = 'Laptops & Computers';
      detectedName = q.includes('dell') ? 'Dell Laptop' : q.includes('hp') ? 'HP Laptop' : q.includes('lenovo') ? 'Lenovo Laptop' : q.includes('macbook') ? 'Apple MacBook' : 'Laptop Computer';
      condition = 'Repairable';
      weight = 2.1;
      hazardLevel = 'medium';
    } else if (q.includes('desktop') || q.includes('cpu') || q.includes('computer') || q.includes('imac') || q.includes('pc')) {
      category = 'Laptops & Computers';
      detectedName = 'Desktop Computer';
      condition = 'Repairable';
      weight = 8.0;
      hazardLevel = 'medium';
    } else if (q.includes('crt') || q.includes('cathode')) {
      category = 'Appliances & Consumer Tech';
      detectedName = 'CRT Television / Monitor';
      condition = 'Recyclable Only';
      weight = 16.0;
      hazardLevel = 'critical';
      hazardWarning = 'Contains leaded glass (1.5kg+ lead). NEVER smash. Handle with gloves.';
    } else if (q.includes('tv') || q.includes('television') || q.includes('monitor') || q.includes('led tv') || q.includes('lcd tv') || q.includes('smart tv')) {
      category = 'Appliances & Consumer Tech';
      detectedName = 'Flat-Screen Television';
      condition = 'Recyclable Only';
      weight = 7.5;
      hazardLevel = 'medium';
    } else if (q.includes('fridge') || q.includes('refrigerator')) {
      category = 'Appliances & Consumer Tech';
      detectedName = 'Refrigerator';
      condition = 'Recyclable Only';
      weight = 45.0;
      hazardLevel = 'high';
      hazardWarning = 'Contains refrigerant gas (CFC/HFC). Do not puncture compressor lines.';
    } else if (q.includes('washing machine') || q.includes('washer')) {
      category = 'Appliances & Consumer Tech';
      detectedName = 'Washing Machine';
      condition = 'Recyclable Only';
      weight = 35.0;
      hazardLevel = 'medium';
    } else if (q.includes('ac') || q.includes('air conditioner') || q.includes('air condition')) {
      category = 'Appliances & Consumer Tech';
      detectedName = 'Air Conditioner';
      condition = 'Recyclable Only';
      weight = 30.0;
      hazardLevel = 'high';
      hazardWarning = 'Contains refrigerant. Must be drained by certified technician before disposal.';
    } else if (q.includes('microwave')) {
      category = 'Appliances & Consumer Tech';
      detectedName = 'Microwave Oven';
      condition = 'Recyclable Only';
      weight = 12.0;
      hazardLevel = 'medium';
    } else if (q.includes('cable') || q.includes('charger') || q.includes('wire') || q.includes('adapter') || q.includes('cord') || q.includes('earphone') || q.includes('headphone')) {
      category = 'Cables & Chargers';
      detectedName = q.includes('charger') ? 'Phone Charger / Adapter' : q.includes('earphone') || q.includes('headphone') ? 'Audio Cable / Earphones' : 'Electrical Cable Bundle';
      condition = 'Recyclable Only';
      weight = 0.3;
      hazardLevel = 'low';
    } else if (q.includes('pcb') || q.includes('circuit board') || q.includes('motherboard') || q.includes('ram') || q.includes('graphics card') || q.includes('gpu') || q.includes('cpu chip') || q.includes('processor')) {
      category = 'PCBs & Internal Components';
      detectedName = q.includes('motherboard') ? 'Motherboard' : q.includes('gpu') || q.includes('graphics') ? 'Graphics Card' : q.includes('ram') ? 'RAM Module' : 'Circuit Board Assembly';
      condition = 'Recyclable Only';
      weight = 0.25;
      hazardLevel = 'low';
    } else if (q.includes('printer') || q.includes('scanner')) {
      category = 'Appliances & Consumer Tech';
      detectedName = q.includes('printer') ? 'Inkjet / Laser Printer' : 'Flatbed Scanner';
      condition = 'Recyclable Only';
      weight = 4.5;
      hazardLevel = 'medium';
    } else if (q.includes('tablet') || q.includes('ipad')) {
      category = 'Laptops & Computers';
      detectedName = q.includes('ipad') ? 'Apple iPad' : 'Android Tablet';
      condition = 'Reusable';
      weight = 0.5;
      hazardLevel = 'medium';
      hazardWarning = 'Contains Lithium-ion battery. Handle with care.';
    } else if (q.includes('router') || q.includes('modem') || q.includes('wifi')) {
      category = 'Other Electronics';
      detectedName = 'Network Router / Modem';
      condition = 'Reusable';
      weight = 0.4;
      hazardLevel = 'low';
    } else if (q.includes('keyboard') || q.includes('mouse')) {
      category = 'Other Electronics';
      detectedName = q.includes('keyboard') ? 'Computer Keyboard' : 'Computer Mouse';
      condition = 'Recyclable Only';
      weight = 0.5;
      hazardLevel = 'low';
    }

    return {
      id: 'query-' + Date.now(),
      detectedName,
      category,
      condition,
      conditionDescription: `Manual search classification. Condition estimated as ${condition.toLowerCase()} based on device type.`,
      confidenceScore: confidence,
      likelyComponents: getComponentsForCategory(category),
      materialsBreakdown: getMaterialsForCategory(category),
      estimatedWeightKg: weight,
      hazardLevel,
      hazardWarning,
      safetyInstructions: getSafetyInstructions(hazardLevel, category),
      recommendationHierarchy: {
        reuse: {
          possible: condition === 'Reusable',
          tip: condition === 'Reusable' ? 'Consider passing to a family member, student, or local NGO.' : 'Device condition is not suitable for safe direct reuse.'
        },
        repair: {
          possible: condition === 'Repairable' || condition === 'Reusable',
          estimatedCostRangeInInr: getRepairCost(category),
          tip: `Local repair shops in Gwalior's Lashkar and Maharajpura markets can service this device.`
        },
        donate: {
          possible: condition === 'Reusable',
          tip: 'Can be donated to Gwalior schools, coaching centers, or community organizations.'
        },
        recycle: {
          action: getRecycleAction(category),
          environmentalBenefit: `Prevents ~${weight}kg of e-waste from entering Gwalior's municipal landfill.`
        }
      },
      recyclingChannels: getRecyclingChannels(category)
    };
  }
};

function getComponentsForCategory(category: EWasteCategory): string[] {
  const map: Record<EWasteCategory, string[]> = {
    'Mobile Phones': ['Lithium-Ion Battery Pack', 'OLED/LCD Display Assembly', 'System-on-Chip (SoC)', 'Camera Module', 'Microphone & Speaker'],
    'Laptops & Computers': ['Li-Ion or Li-Po Battery', 'LCD/LED Display Panel', 'Motherboard & CPU', 'RAM Modules', 'Hard Drive / SSD'],
    'Batteries & Power': ['Lithium / Lead-Acid Cells', 'Battery Management System (BMS)', 'Terminal Contacts', 'Protective Housing'],
    'Appliances & Consumer Tech': ['Transformer / Power Board', 'Display Panel or Tube', 'Plastic & Metal Chassis', 'Control PCB', 'Motor / Compressor'],
    'Cables & Chargers': ['Copper Conductor Wire', 'PVC / Rubber Insulation', 'Metal Terminals & Connectors', 'Ferrite Filter Bead'],
    'PCBs & Internal Components': ['FR4 Fiberglass Substrate', 'Copper Traces', 'ICs & Microchips', 'Capacitors & Resistors', 'Solder (Tin-Lead Alloy)'],
    'Other Electronics': ['Printed Circuit Board', 'Copper Wiring', 'Plastic Enclosure', 'Electronic Components']
  };
  return map[category];
}

function getMaterialsForCategory(category: EWasteCategory): { material: string; percentage: number; description: string; isPreciousOrRare?: boolean; isHazardous?: boolean }[] {
  const map: Record<EWasteCategory, { material: string; percentage: number; description: string; isPreciousOrRare?: boolean; isHazardous?: boolean }[]> = {
    'Mobile Phones': [
      { material: 'Glass & Display', percentage: 32, description: 'Screen assembly' },
      { material: 'Plastics & Polymers', percentage: 28, description: 'Body & casing' },
      { material: 'Copper & Aluminum', percentage: 24, description: 'Conductors & heat sink' },
      { material: 'Gold & Rare Earth', percentage: 16, description: 'Contact plating & magnets', isPreciousOrRare: true }
    ],
    'Laptops & Computers': [
      { material: 'Aluminum / Magnesium', percentage: 35, description: 'Chassis & heat dissipation' },
      { material: 'Plastics', percentage: 28, description: 'Keyboard deck & base' },
      { material: 'Copper', percentage: 22, description: 'PCB traces & wiring' },
      { material: 'Gold & Palladium', percentage: 15, description: 'Connector plating', isPreciousOrRare: true }
    ],
    'Batteries & Power': [
      { material: 'Lithium Compounds', percentage: 40, description: 'Cell chemistry', isHazardous: true },
      { material: 'Cobalt Oxide', percentage: 30, description: 'Cathode material', isPreciousOrRare: true, isHazardous: true },
      { material: 'Aluminum Foil', percentage: 18, description: 'Electrode substrate' },
      { material: 'Polymer Casing', percentage: 12, description: 'Cell housing' }
    ],
    'Appliances & Consumer Tech': [
      { material: 'Steel & Iron', percentage: 48, description: 'Structural frame' },
      { material: 'Plastics', percentage: 28, description: 'Panels & housing' },
      { material: 'Copper', percentage: 18, description: 'Motors & wiring' },
      { material: 'Aluminum', percentage: 6, description: 'Heat exchanger' }
    ],
    'Cables & Chargers': [
      { material: 'Copper Wire', percentage: 55, description: 'Current conductor' },
      { material: 'PVC Insulation', percentage: 35, description: 'Outer sheath', isHazardous: true },
      { material: 'Tin & Solder', percentage: 10, description: 'Terminal plating' }
    ],
    'PCBs & Internal Components': [
      { material: 'Fiberglass (FR4)', percentage: 38, description: 'PCB substrate' },
      { material: 'Copper Traces', percentage: 30, description: 'Circuit pathways' },
      { material: 'Tin-Lead Solder', percentage: 18, description: 'Joint alloy', isHazardous: true },
      { material: 'Gold & Silver', percentage: 14, description: 'IC pad plating', isPreciousOrRare: true }
    ],
    'Other Electronics': [
      { material: 'Plastics & Polymers', percentage: 45, description: 'Enclosure' },
      { material: 'Copper & Metals', percentage: 35, description: 'Internal wiring' },
      { material: 'PCB & Silicon', percentage: 20, description: 'Circuit assembly' }
    ]
  };
  return map[category];
}

function getSafetyInstructions(hazardLevel: HazardLevel, category: EWasteCategory): string[] {
  const base = [
    'Store in a cool, dry place away from direct sunlight.',
    'Do not dispose in household trash or open burning.',
    'Deliver to an MPPCB-authorized recycler in Gwalior.'
  ];
  if (hazardLevel === 'critical') {
    return [
      'DO NOT puncture, bend, or heat.',
      'If swollen or leaking, place in sand-filled container immediately.',
      'Tape all exposed terminals with electrical insulation tape.',
      'Transport separately from other waste. Inform recycler of hazard.',
      ...base.slice(2)
    ];
  }
  if (hazardLevel === 'high') {
    return [
      'Handle with protective gloves.',
      'Do not attempt to dismantle yourself.',
      ...base
    ];
  }
  if (category === 'Cables & Chargers') {
    return [
      'Bundle and tie cables to prevent copper scrap contamination.',
      'Remove all connectors and adapters before handing over.',
      base[2]
    ];
  }
  return base;
}

function getRepairCost(category: EWasteCategory): string {
  const map: Partial<Record<EWasteCategory, string>> = {
    'Mobile Phones': '₹500 – ₹2,000',
    'Laptops & Computers': '₹800 – ₹4,000',
    'Appliances & Consumer Tech': '₹1,200 – ₹6,000',
    'Batteries & Power': '₹300 – ₹800',
    'PCBs & Internal Components': '₹400 – ₹1,500',
  };
  return map[category] || '₹300 – ₹1,500';
}

function getRecycleAction(category: EWasteCategory): string {
  if (category === 'Batteries & Power') {
    return 'Drop at Karo Sambhav or Namo E-Waste Gwalior. Call ahead — they accept batteries separately.';
  }
  if (category === 'Appliances & Consumer Tech') {
    return 'Contact Greenscape Eco Management (Malanpur) for bulk appliance pickup in Gwalior.';
  }
  return 'Hand over to Karo Sambhav Hub (Maharajpura), Namo E-Waste (Lashkar), or GMC Drop Center (Maharaj Bada), Gwalior.';
}

function getRecyclingChannels(category: EWasteCategory): string[] {
  if (category === 'Batteries & Power') {
    return ['Karo Sambhav Gwalior Hub', 'Namo E-Waste Logistics'];
  }
  if (category === 'Appliances & Consumer Tech') {
    return ['Greenscape Eco Management Malanpur', 'Karo Sambhav Gwalior Hub'];
  }
  return ['Karo Sambhav Gwalior Hub', 'Namo E-Waste Logistics', 'GMC E-Waste Drop Center'];
}
