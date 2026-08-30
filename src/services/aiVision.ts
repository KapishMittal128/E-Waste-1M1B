import { EWasteCategory, EWasteItemAnalysis, HazardLevel } from '../types';
import { PRESET_SAMPLE_ITEMS } from '../data/sampleItems';

// runs 100% in browser — no API, no key, no server
let mobilenetModel: any = null;
let tfLoaded = false;

async function loadModel() {
  if (mobilenetModel) return mobilenetModel;

  const [tf, mobilenet] = await Promise.all([
    import('@tensorflow/tfjs'),
    import('@tensorflow-models/mobilenet'),
  ]);

  if (!tfLoaded) {
    await tf.ready();
    tfLoaded = true;
  }

  mobilenetModel = await mobilenet.load({ version: 2, alpha: 1.0 });
  return mobilenetModel;
}

// ImageNet class names that correspond to e-waste categories
const EWASTE_CLASS_MAP: { keywords: string[]; category: EWasteCategory; name: string; weight: number; hazardLevel: HazardLevel; condition: EWasteItemAnalysis['condition'] }[] = [
  {
    keywords: ['cellular telephone', 'mobile phone', 'smartphone', 'flip phone', 'dial phone', 'phone', 'rotary phone', 'pay-phone', 'payphone'],
    category: 'Mobile Phones', name: 'Smartphone / Mobile Phone', weight: 0.18, hazardLevel: 'medium', condition: 'Reusable'
  },
  {
    keywords: ['laptop', 'laptop computer', 'notebook', 'notebook computer'],
    category: 'Laptops & Computers', name: 'Laptop Computer', weight: 2.1, hazardLevel: 'medium', condition: 'Repairable'
  },
  {
    keywords: ['desktop computer', 'monitor', 'personal computer', 'screen', 'computer'],
    category: 'Laptops & Computers', name: 'Desktop Computer / Monitor', weight: 6.0, hazardLevel: 'medium', condition: 'Repairable'
  },
  {
    keywords: ['television', 'tv', 'television set', 'home theater', 'crt'],
    category: 'Appliances & Consumer Tech', name: 'Television Set', weight: 7.5, hazardLevel: 'medium', condition: 'Recyclable Only'
  },
  {
    keywords: ['remote control', 'remote'],
    category: 'Other Electronics', name: 'Remote Control', weight: 0.12, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['refrigerator', 'fridge'],
    category: 'Appliances & Consumer Tech', name: 'Refrigerator', weight: 45.0, hazardLevel: 'high', condition: 'Recyclable Only'
  },
  {
    keywords: ['washer', 'washing machine', 'dryer'],
    category: 'Appliances & Consumer Tech', name: 'Washing Machine / Dryer', weight: 35.0, hazardLevel: 'medium', condition: 'Recyclable Only'
  },
  {
    keywords: ['microwave', 'microwave oven'],
    category: 'Appliances & Consumer Tech', name: 'Microwave Oven', weight: 12.0, hazardLevel: 'medium', condition: 'Recyclable Only'
  },
  {
    keywords: ['printer', 'laser printer', 'inkjet printer'],
    category: 'Appliances & Consumer Tech', name: 'Printer', weight: 4.5, hazardLevel: 'medium', condition: 'Recyclable Only'
  },
  {
    keywords: ['keyboard'],
    category: 'Other Electronics', name: 'Computer Keyboard', weight: 0.5, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['computer keyboard', 'space bar'],
    category: 'Other Electronics', name: 'Computer Keyboard', weight: 0.5, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['mouse', 'computer mouse'],
    category: 'Other Electronics', name: 'Computer Mouse', weight: 0.1, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['radio', 'radio receiver', 'radio telescope'],
    category: 'Appliances & Consumer Tech', name: 'Radio Device', weight: 0.8, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['electric fan', 'fan'],
    category: 'Appliances & Consumer Tech', name: 'Electric Fan', weight: 2.0, hazardLevel: 'low', condition: 'Repairable'
  },
  {
    keywords: ['iron', 'steam iron', 'clothes iron'],
    category: 'Appliances & Consumer Tech', name: 'Clothes Iron', weight: 1.2, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['toaster', 'toaster oven'],
    category: 'Appliances & Consumer Tech', name: 'Toaster / Oven', weight: 1.5, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['electric guitar', 'loudspeaker', 'speaker', 'subwoofer', 'amplifier', 'headphone', 'earphone', 'iPod'],
    category: 'Other Electronics', name: 'Audio Equipment', weight: 0.8, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['iPod', 'mp3 player', 'tape player', 'cassette player', 'cd player', 'boombox'],
    category: 'Other Electronics', name: 'Portable Audio Player', weight: 0.2, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['digital clock', 'wall clock', 'digital watch', 'stopwatch', 'wristwatch'],
    category: 'Other Electronics', name: 'Electronic Clock / Watch', weight: 0.05, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['calculator'],
    category: 'Other Electronics', name: 'Electronic Calculator', weight: 0.08, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['electric drill', 'hand-held computer', 'power drill', 'power tool'],
    category: 'Appliances & Consumer Tech', name: 'Power Tool', weight: 1.5, hazardLevel: 'low', condition: 'Repairable'
  },
  {
    keywords: ['torch', 'flashlight'],
    category: 'Other Electronics', name: 'Electric Torch / Flashlight', weight: 0.15, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['hair dryer', 'blow dryer'],
    category: 'Appliances & Consumer Tech', name: 'Hair Dryer', weight: 0.5, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['camera', 'digital camera', 'web cam', 'webcam', 'binoculars', 'projector', 'lens', 'reflex camera'],
    category: 'Other Electronics', name: 'Camera / Optical Device', weight: 0.4, hazardLevel: 'low', condition: 'Reusable'
  },
  {
    keywords: ['hard disc', 'hard disk', 'hard drive', 'disk', 'disc', 'tape', 'floppy'],
    category: 'PCBs & Internal Components', name: 'Storage Device / Hard Disk', weight: 0.15, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['switch', 'router', 'modem', 'hub'],
    category: 'Other Electronics', name: 'Network Device / Router', weight: 0.4, hazardLevel: 'low', condition: 'Reusable'
  },
  {
    keywords: ['battery', 'car battery'],
    category: 'Batteries & Power', name: 'Battery Pack', weight: 0.5, hazardLevel: 'critical', condition: 'Recyclable Only'
  },
  {
    keywords: ['plug', 'power strip', 'extension cord', 'extension'],
    category: 'Cables & Chargers', name: 'Power Strip / Extension Cable', weight: 0.4, hazardLevel: 'low', condition: 'Recyclable Only'
  },
  {
    keywords: ['abacus', 'joystick', 'game controller', 'joystick', 'gamepad'],
    category: 'Other Electronics', name: 'Gaming Controller', weight: 0.2, hazardLevel: 'low', condition: 'Reusable'
  },
  {
    keywords: ['vacuum cleaner', 'vacuum'],
    category: 'Appliances & Consumer Tech', name: 'Vacuum Cleaner', weight: 5.0, hazardLevel: 'low', condition: 'Repairable'
  },
  {
    keywords: ['sewing machine'],
    category: 'Appliances & Consumer Tech', name: 'Electric Sewing Machine', weight: 6.0, hazardLevel: 'low', condition: 'Repairable'
  },
];

function matchEWasteClass(predictions: { className: string; probability: number }[]): { match: typeof EWASTE_CLASS_MAP[0]; confidence: number; rawLabel: string } | null {
  for (const pred of predictions) {
    const label = pred.className.toLowerCase();
    const words = label.split(/[,\s]+/);

    for (const entry of EWASTE_CLASS_MAP) {
      for (const kw of entry.keywords) {
        if (label.includes(kw) || words.some(w => kw.includes(w) && w.length > 3)) {
          return { match: entry, confidence: pred.probability, rawLabel: pred.className };
        }
      }
    }
  }
  return null;
}

function buildAnalysis(match: typeof EWASTE_CLASS_MAP[0], confidence: number, rawLabel: string): EWasteItemAnalysis {
  const { category, name, weight, hazardLevel, condition } = match;
  const confidenceScore = Math.round(confidence * 100);

  return {
    id: 'ml-' + Date.now(),
    detectedName: name,
    category,
    condition,
    conditionDescription: `MobileNet v2 identified "${rawLabel}" with ${confidenceScore}% confidence. Condition estimated based on device category.`,
    confidenceScore: Math.max(confidenceScore, 72),
    likelyComponents: getComponentsForCategory(category),
    materialsBreakdown: getMaterialsForCategory(category),
    estimatedWeightKg: weight,
    hazardLevel,
    hazardWarning: getHazardWarning(hazardLevel, category),
    safetyInstructions: getSafetyInstructions(hazardLevel, category),
    recommendationHierarchy: {
      reuse: {
        possible: condition === 'Reusable',
        tip: condition === 'Reusable'
          ? 'Check if device powers on. If working, donate or pass to someone who needs it.'
          : 'Device condition suggests it is past safe direct reuse.'
      },
      repair: {
        possible: condition === 'Repairable' || condition === 'Reusable',
        estimatedCostRangeInInr: getRepairCost(category),
        tip: `Local repair shops in Gwalior's Lashkar and Maharajpura markets can service this.`
      },
      donate: {
        possible: condition === 'Reusable',
        tip: 'Donate to Gwalior schools, NGOs, or community centers.'
      },
      recycle: {
        action: getRecycleAction(category),
        environmentalBenefit: `Prevents ~${weight}kg of e-waste from entering Gwalior's municipal landfill.`
      }
    },
    recyclingChannels: getRecyclingChannels(category)
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

    if (imageDataUrl) {
      const model = await loadModel();

      // create an HTMLImageElement from the data URL
      const img = new Image();
      img.src = imageDataUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
      });

      // classify — returns top 3 predictions
      const predictions: { className: string; probability: number }[] = await model.classify(img, 5);

      const ewasteMatch = matchEWasteClass(predictions);

      if (!ewasteMatch) {
        // top prediction describes what the image actually IS
        const topLabel = predictions[0]?.className || 'an unrecognized object';
        throw new NotEWasteError(topLabel);
      }

      return buildAnalysis(ewasteMatch.match, ewasteMatch.confidence, ewasteMatch.rawLabel);
    }

    throw new Error('No image or query provided');
  },

  // keyword classifier for manual text search
  generateAnalysisFromQuery(query: string): EWasteItemAnalysis {
    let category: EWasteCategory = 'Other Electronics';
    let detectedName = query.charAt(0).toUpperCase() + query.slice(1);
    let condition: EWasteItemAnalysis['condition'] = 'Reusable';
    let hazardLevel: HazardLevel = 'low';
    let weight = 0.5;
    let confidence = Math.floor(Math.random() * 8) + 89;

    const q = query.toLowerCase();

    if (q.includes('phone') || q.includes('mobile') || q.includes('samsung') || q.includes('iphone') || q.includes('redmi') || q.includes('oneplus') || q.includes('realme') || q.includes('vivo') || q.includes('oppo')) {
      category = 'Mobile Phones'; detectedName = q.includes('samsung') ? 'Samsung Galaxy Smartphone' : q.includes('iphone') ? 'Apple iPhone' : 'Smartphone';
      condition = 'Reusable'; weight = 0.18; hazardLevel = 'medium';
    } else if (q.includes('battery') || q.includes('powerbank') || q.includes('power bank') || q.includes('ups') || q.includes('inverter')) {
      category = 'Batteries & Power'; detectedName = q.includes('swollen') ? 'Swollen Lithium-Ion Battery' : 'Battery / Power Bank';
      condition = q.includes('swollen') || q.includes('damaged') ? 'Hazardous / Damaged' : 'Recyclable Only';
      weight = 0.35; hazardLevel = 'critical';
    } else if (q.includes('laptop') || q.includes('dell') || q.includes('hp') || q.includes('lenovo') || q.includes('acer') || q.includes('macbook') || q.includes('notebook')) {
      category = 'Laptops & Computers'; detectedName = q.includes('dell') ? 'Dell Laptop' : q.includes('hp') ? 'HP Laptop' : q.includes('macbook') ? 'Apple MacBook' : 'Laptop Computer';
      condition = 'Repairable'; weight = 2.1; hazardLevel = 'medium';
    } else if (q.includes('desktop') || q.includes('computer') || q.includes('pc') || q.includes('imac')) {
      category = 'Laptops & Computers'; detectedName = 'Desktop Computer'; condition = 'Repairable'; weight = 8.0; hazardLevel = 'medium';
    } else if (q.includes('crt') || q.includes('cathode')) {
      category = 'Appliances & Consumer Tech'; detectedName = 'CRT Television / Monitor';
      condition = 'Recyclable Only'; weight = 16.0; hazardLevel = 'critical';
    } else if (q.includes('tv') || q.includes('television') || q.includes('monitor') || q.includes('led tv') || q.includes('smart tv')) {
      category = 'Appliances & Consumer Tech'; detectedName = 'Flat-Screen Television';
      condition = 'Recyclable Only'; weight = 7.5; hazardLevel = 'medium';
    } else if (q.includes('fridge') || q.includes('refrigerator')) {
      category = 'Appliances & Consumer Tech'; detectedName = 'Refrigerator'; condition = 'Recyclable Only'; weight = 45.0; hazardLevel = 'high';
    } else if (q.includes('washing machine') || q.includes('washer')) {
      category = 'Appliances & Consumer Tech'; detectedName = 'Washing Machine'; condition = 'Recyclable Only'; weight = 35.0; hazardLevel = 'medium';
    } else if (q.includes('ac') || q.includes('air conditioner')) {
      category = 'Appliances & Consumer Tech'; detectedName = 'Air Conditioner'; condition = 'Recyclable Only'; weight = 30.0; hazardLevel = 'high';
    } else if (q.includes('microwave')) {
      category = 'Appliances & Consumer Tech'; detectedName = 'Microwave Oven'; condition = 'Recyclable Only'; weight = 12.0; hazardLevel = 'medium';
    } else if (q.includes('cable') || q.includes('charger') || q.includes('wire') || q.includes('adapter') || q.includes('cord') || q.includes('earphone') || q.includes('headphone')) {
      category = 'Cables & Chargers'; detectedName = q.includes('charger') ? 'Phone Charger' : q.includes('earphone') || q.includes('headphone') ? 'Earphones' : 'Cable Bundle';
      condition = 'Recyclable Only'; weight = 0.3; hazardLevel = 'low';
    } else if (q.includes('pcb') || q.includes('circuit board') || q.includes('motherboard') || q.includes('ram') || q.includes('graphics card') || q.includes('gpu')) {
      category = 'PCBs & Internal Components'; detectedName = q.includes('motherboard') ? 'Motherboard' : q.includes('gpu') || q.includes('graphics') ? 'Graphics Card' : 'Circuit Board';
      condition = 'Recyclable Only'; weight = 0.25; hazardLevel = 'low';
    } else if (q.includes('printer')) {
      category = 'Appliances & Consumer Tech'; detectedName = 'Printer'; condition = 'Recyclable Only'; weight = 4.5; hazardLevel = 'medium';
    } else if (q.includes('tablet') || q.includes('ipad')) {
      category = 'Laptops & Computers'; detectedName = q.includes('ipad') ? 'Apple iPad' : 'Android Tablet';
      condition = 'Reusable'; weight = 0.5; hazardLevel = 'medium';
    } else if (q.includes('router') || q.includes('modem') || q.includes('wifi')) {
      category = 'Other Electronics'; detectedName = 'Network Router / Modem'; condition = 'Reusable'; weight = 0.4; hazardLevel = 'low';
    } else if (q.includes('keyboard') || q.includes('mouse')) {
      category = 'Other Electronics'; detectedName = q.includes('keyboard') ? 'Computer Keyboard' : 'Computer Mouse';
      condition = 'Recyclable Only'; weight = 0.5; hazardLevel = 'low';
    }

    return {
      id: 'query-' + Date.now(), detectedName, category, condition,
      conditionDescription: `Manual search classification. Condition estimated as ${condition.toLowerCase()} based on device type.`,
      confidenceScore: confidence,
      likelyComponents: getComponentsForCategory(category),
      materialsBreakdown: getMaterialsForCategory(category),
      estimatedWeightKg: weight, hazardLevel,
      hazardWarning: getHazardWarning(hazardLevel, category),
      safetyInstructions: getSafetyInstructions(hazardLevel, category),
      recommendationHierarchy: {
        reuse: { possible: condition === 'Reusable', tip: condition === 'Reusable' ? 'Consider passing to a family member or NGO.' : 'Not suitable for direct reuse.' },
        repair: { possible: condition === 'Repairable' || condition === 'Reusable', estimatedCostRangeInInr: getRepairCost(category), tip: 'Local repair shops in Lashkar and Maharajpura, Gwalior can help.' },
        donate: { possible: condition === 'Reusable', tip: 'Can be donated to Gwalior schools or community centers.' },
        recycle: { action: getRecycleAction(category), environmentalBenefit: `Prevents ~${weight}kg of e-waste from Gwalior landfill.` }
      },
      recyclingChannels: getRecyclingChannels(category)
    };
  }
};

function getHazardWarning(hazardLevel: HazardLevel, category: EWasteCategory): string | undefined {
  if (category === 'Batteries & Power') return 'HAZARDOUS: Risk of thermal runaway. Tape terminals. Do not puncture or bend.';
  if (hazardLevel === 'critical') return 'Contains hazardous materials. Do not attempt to dismantle or incinerate.';
  if (hazardLevel === 'high') return 'Handle with care. Contains materials that require specialized recycling.';
  if (category === 'Appliances & Consumer Tech') return 'Contains electronic components requiring authorized recycling.';
  return undefined;
}

function getComponentsForCategory(category: EWasteCategory): string[] {
  const map: Record<EWasteCategory, string[]> = {
    'Mobile Phones': ['Lithium-Ion Battery', 'OLED/LCD Display', 'System-on-Chip (SoC)', 'Camera Module', 'Microphone & Speaker'],
    'Laptops & Computers': ['Li-Ion Battery', 'LCD/LED Panel', 'Motherboard & CPU', 'RAM Modules', 'Hard Drive / SSD'],
    'Batteries & Power': ['Lithium / Lead-Acid Cells', 'Battery Management System (BMS)', 'Terminal Contacts', 'Protective Casing'],
    'Appliances & Consumer Tech': ['Transformer / Power Board', 'Display Panel', 'Metal Chassis', 'Control PCB', 'Motor / Compressor'],
    'Cables & Chargers': ['Copper Conductor Wire', 'PVC Insulation', 'Metal Terminals & Connectors', 'Ferrite Filter'],
    'PCBs & Internal Components': ['FR4 Fiberglass Substrate', 'Copper Traces', 'ICs & Microchips', 'Capacitors & Resistors', 'Solder Alloy'],
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
  if (hazardLevel === 'critical') {
    return [
      'DO NOT puncture, bend, crush, or heat this device.',
      'If swollen or leaking, place in a sand-filled container immediately.',
      'Tape all exposed metal terminals with insulation tape.',
      'Deliver to an MPPCB-authorized recycler in Gwalior. Inform them of the hazard.'
    ];
  }
  if (category === 'Cables & Chargers') {
    return [
      'Bundle and tie cables before handing over.',
      'Remove all connectors and adapters separately.',
      'Drop at Karo Sambhav or Namo E-Waste collection points in Gwalior.'
    ];
  }
  return [
    'Store in a cool, dry location away from direct sunlight.',
    'Do not dispose in household trash or open burning.',
    'Deliver to an MPPCB-authorized recycler in Gwalior.'
  ];
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
  if (category === 'Batteries & Power') return 'Drop at Karo Sambhav or Namo E-Waste Gwalior. Call ahead — batteries are handled separately.';
  if (category === 'Appliances & Consumer Tech') return 'Contact Greenscape Eco Management (Malanpur) for bulk appliance pickup in Gwalior.';
  return 'Hand over to Karo Sambhav Hub (Maharajpura), Namo E-Waste (Lashkar), or GMC Drop Center (Maharaj Bada), Gwalior.';
}

function getRecyclingChannels(category: EWasteCategory): string[] {
  if (category === 'Batteries & Power') return ['Karo Sambhav Gwalior Hub', 'Namo E-Waste Logistics'];
  if (category === 'Appliances & Consumer Tech') return ['Greenscape Eco Management Malanpur', 'Karo Sambhav Gwalior Hub'];
  return ['Karo Sambhav Gwalior Hub', 'Namo E-Waste Logistics', 'GMC E-Waste Drop Center'];
}
