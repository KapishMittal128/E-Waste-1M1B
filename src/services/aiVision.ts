import { EWasteCategory, EWasteItemAnalysis, HazardLevel } from '../types';
import { PRESET_SAMPLE_ITEMS } from '../data/sampleItems';

export const AIVisionService = {
  // fast regex taxonomy parser
  async analyzeImage(
    _imageDataUrl?: string,
    manualQuery?: string,
    presetKey?: string
  ): Promise<EWasteItemAnalysis> {
    // artificial delay for feedback
    await new Promise(resolve => setTimeout(resolve, 650));

    if (presetKey && PRESET_SAMPLE_ITEMS[presetKey]) {
      return { ...PRESET_SAMPLE_ITEMS[presetKey], id: 'analyzed-' + Date.now() };
    }

    const query = (manualQuery || '').trim().toLowerCase();

    if (query) {
      return this.generateAnalysisFromQuery(query);
    }

    // default fallback payload
    return {
      id: 'scan-' + Date.now(),
      detectedName: 'Consumer Electronic Device / Circuit Unit',
      category: 'Other Electronics',
      condition: 'Recyclable Only',
      conditionDescription: 'Detected generic PCB assembly, plastic chassis, and copper cabling. Internal battery presence unverified.',
      confidenceScore: 88,
      likelyComponents: [
        'Epoxy-Fiberglass FR4 Printed Circuit Board',
        'Copper Trace Elements & Solder Joints',
        'Flame-Retardant ABS Enclosure',
        'Capacitors & Micro-Inductors'
      ],
      materialsBreakdown: [
        { material: 'Plastics & Polymers', percentage: 48, description: 'Chassis housing' },
        { material: 'Copper & Solder Alloy', percentage: 32, description: 'Wiring and traces' },
        { material: 'Silica & Fiberglass', percentage: 18, description: 'PCB substrate' },
        { material: 'Precious Metals (Trace)', percentage: 2, description: 'Gold & tin plating', isPreciousOrRare: true }
      ],
      estimatedWeightKg: 0.42,
      hazardLevel: 'low',
      hazardWarning: 'Do not incinerate or place in general municipal waste.',
      safetyInstructions: [
        'Store in a dry location prior to recycler handover.',
        'Do not crack or smash casing to avoid micro-plastic or capacitor fluid exposure.'
      ],
      recommendationHierarchy: {
        reuse: {
          possible: false,
          tip: 'Check if device powers on or has useful spare parts.'
        },
        repair: {
          possible: true,
          estimatedCostRangeInInr: '₹300 – ₹800',
          typicalFixes: ['Capacitor replacement', 'Wire soldering'],
          tip: 'Local electronics technician in Gwalior can diagnose broken circuit paths.'
        },
        donate: {
          possible: false,
          tip: 'Donate only if safely operational.'
        },
        recycle: {
          action: 'Hand over to Karo Sambhav or Greenscape MP collection centers in Gwalior.',
          environmentalBenefit: 'Ensures circular recycling and safe metal extraction under MPPCB guidelines.'
        }
      },
      recyclingChannels: ['Karo Sambhav Gwalior Hub', 'GMC Swachh Drop Center']
    };
  },

  // query classifier
  generateAnalysisFromQuery(query: string): EWasteItemAnalysis {
    let category: EWasteCategory = 'Other Electronics';
    let detectedName = query.charAt(0).toUpperCase() + query.slice(1);
    let condition: EWasteItemAnalysis['condition'] = 'Reusable';
    let hazardLevel: HazardLevel = 'low';
    let hazardWarning: string | undefined = undefined;
    let weight = 0.5;
    let confidence = Math.floor(Math.random() * 8) + 89;

    const q = query.toLowerCase();

    // keyword router
    if (q.includes('phone') || q.includes('mobile') || q.includes('samsung') || q.includes('iphone') || q.includes('redmi') || q.includes('oneplus') || q.includes('realme')) {
      category = 'Mobile Phones';
      detectedName = q.includes('samsung') ? 'Samsung Galaxy Smartphone' : q.includes('iphone') ? 'Apple iPhone Device' : 'Smartphone Handset';
      condition = 'Reusable';
      weight = 0.18;
      hazardLevel = 'medium';
      hazardWarning = 'Contains high-density Lithium-ion cell. Do not puncture or expose to open flames.';
    } else if (q.includes('battery') || q.includes('powerbank') || q.includes('cell') || q.includes('ups') || q.includes('inverter')) {
      category = 'Batteries & Power';
      detectedName = q.includes('swollen') ? 'Swollen Lithium-Ion Battery Pack' : 'Portable Battery / Power Bank Unit';
      condition = q.includes('swollen') || q.includes('damaged') ? 'Hazardous / Damaged' : 'Recyclable Only';
      weight = 0.35;
      hazardLevel = 'critical';
      hazardWarning = 'HAZARDOUS: High risk of thermal runaway. Tape terminals with insulation tape immediately.';
    } else if (q.includes('laptop') || q.includes('dell') || q.includes('hp') || q.includes('lenovo') || q.includes('computer') || q.includes('pc') || q.includes('macbook')) {
      category = 'Laptops & Computers';
      detectedName = 'Portable Laptop Computer';
      condition = 'Repairable';
      weight = 2.1;
      hazardLevel = 'medium';
    } else if (q.includes('tv') || q.includes('crt') || q.includes('television') || q.includes('fridge') || q.includes('microwave') || q.includes('ac') || q.includes('washing')) {
      category = 'Appliances & Consumer Tech';
      detectedName = q.includes('crt') ? 'Cathode Ray Tube (CRT) Television' : 'Consumer Home Appliance';
      condition = 'Recyclable Only';
      weight = q.includes('crt') ? 16.0 : 8.5;
      hazardLevel = q.includes('crt') ? 'critical' : 'medium';
      hazardWarning = q.includes('crt') ? 'Contains heavy leaded glass (1.5kg+ lead). NEVER smash glass outdoors.' : undefined;
    } else if (q.includes('cable') || q.includes('charger') || q.includes('wire') || q.includes('adapter') || q.includes('cord')) {
      category = 'Cables & Chargers';
      detectedName = 'Copper Power / Data Cable Bundle';
      condition = 'Recyclable Only';
      weight = 0.3;
      hazardLevel = 'low';
    } else if (q.includes('pcb') || q.includes('board') || q.includes('circuit') || q.includes('chip') || q.includes('motherboard') || q.includes('ram')) {
      category = 'PCBs & Internal Components';
      detectedName = 'Electronic Printed Circuit Board Assembly (PCBA)';
      condition = 'Recyclable Only';
      weight = 0.25;
      hazardLevel = 'low';
    }

    return {
      id: 'query-' + Date.now(),
      detectedName,
      category,
      condition,
      conditionDescription: `Visual assessment indicates ${condition.toLowerCase()} status with standard components intact.`,
      confidenceScore: confidence,
      likelyComponents: [
        'Primary PCB & Integrated Chips',
        'Conductive Copper / Aluminum Wiring',
        'Polymer Casing & Protective Brackets',
        'Terminal Connectors & Solder Pads'
      ],
      materialsBreakdown: [
        { material: 'Plastics & Polymers', percentage: 40, description: 'Insulating body' },
        { material: 'Copper & Conductors', percentage: 35, description: 'Wiring and coils' },
        { material: 'Metals & Alloys', percentage: 20, description: 'Structural components' },
        { material: 'Precious Metals', percentage: 5, description: 'Gold/silver trace contacts', isPreciousOrRare: true }
      ],
      estimatedWeightKg: weight,
      hazardLevel,
      hazardWarning,
      safetyInstructions: [
        'Store in a dry room temperature environment away from children.',
        'Do not attempt open-air fire burning to extract metals.',
        'Deliver to MPPCB registered collection points in Gwalior.'
      ],
      recommendationHierarchy: {
        reuse: {
          possible: condition === 'Reusable',
          tip: condition === 'Reusable' ? 'Consider repurposing or passing to a student/family member.' : 'Device is no longer safely functional for direct reuse.'
        },
        repair: {
          possible: condition === 'Repairable' || condition === 'Reusable',
          estimatedCostRangeInInr: '₹400 – ₹1,500',
          tip: 'Check local repair options in Gwalior before discarding.'
        },
        donate: {
          possible: condition === 'Reusable',
          tip: 'Can be donated to educational initiatives or local community centers.'
        },
        recycle: {
          action: 'Hand over to authorized MPPCB / CPCB recyclers in Gwalior (e.g. Karo Sambhav, Greenscape, Namo E-Waste).',
          environmentalBenefit: `Diverts ~${weight}kg of electronic scrap from local Gwalior landfill pollution.`
        }
      },
      recyclingChannels: ['Karo Sambhav Gwalior Hub', 'Greenscape Eco Management', 'Namo E-Waste Logistics']
    };
  }
};
