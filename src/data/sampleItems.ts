import { EWasteItemAnalysis } from '../types';

export const PRESET_SAMPLE_ITEMS: Record<string, EWasteItemAnalysis> = {
  'samsung-phone': {
    id: 'item-samsung-s9',
    detectedName: 'Samsung Galaxy S9 (SM-G960F)',
    category: 'Mobile Phones',
    condition: 'Reusable',
    conditionDescription: 'Aesthetic surface scratches, intact AMOLED display, operational logic board, lithium battery degraded (~70% health).',
    confidenceScore: 94,
    likelyComponents: [
      '3000mAh Lithium-Ion Battery',
      'High-Density Logic Board (Gold, Palladium, Copper)',
      '5.8" Super AMOLED Display & Digitizer',
      'Anodized Aluminum Frame (6000 Series)',
      'Neodymium Vibration & Speaker Magnets',
      'Camera Sensor Module (Sapphire/Glass Optics)'
    ],
    materialsBreakdown: [
      { material: 'Plastics & Polymers', percentage: 38, description: 'Polycarbonate internal brackets and casing' },
      { material: 'Copper & Alloy Wiring', percentage: 24, description: 'Trace circuitry, RF shielding, internal coils' },
      { material: 'Aluminum Chassis', percentage: 20, description: 'Structural frame recyclable infinitely' },
      { material: 'Lithium / Cobalt / Nickel', percentage: 12, description: 'Battery active cathode materials', isHazardous: true },
      { material: 'Precious Metals (Au, Ag, Pd)', percentage: 0.8, description: 'Gold contact pins and micro-wire bonding', isPreciousOrRare: true },
      { material: 'Silica Glass', percentage: 5.2, description: 'Corning Gorilla Glass face & rear' },
    ],
    estimatedWeightKg: 0.163,
    hazardLevel: 'medium',
    hazardWarning: 'Contains an embedded lithium-ion cell. NEVER puncture, incinerate, or crush in general domestic trash bins.',
    safetyInstructions: [
      'Keep battery charge below 30% if storing for drop-off.',
      'Perform a factory reset or wipe data before physical handover.',
      'Store in a dry room temperature environment away from direct sunlight.'
    ],
    recommendationHierarchy: {
      reuse: {
        possible: true,
        tip: 'Can be repurposed as a dedicated offline music player, security webcam, or digital clock.'
      },
      repair: {
        possible: true,
        estimatedCostRangeInInr: '₹700 – ₹1,200',
        typicalFixes: ['Battery replacement', 'USB-C charging port cleanup'],
        tip: 'A quick battery replacement at a local Gwalior repair hub (e.g. Maharaj Bada or Thatipur) can extend life by 2+ years.'
      },
      donate: {
        possible: true,
        tip: 'Can be donated to educational initiatives or community digital learning centers.'
      },
      recycle: {
        action: 'Hand over to Karo Sambhav / Namo E-Waste Gwalior hub for zero-landfill material recovery.',
        environmentalBenefit: 'Prevents 163g of toxic heavy metals from contaminating local soil and groundwater.'
      }
    },
    recyclingChannels: ['Karo Sambhav Gwalior Hub', 'Namo E-Waste Collection Point', 'GMC Swachh Drop Center']
  },
  'swollen-battery': {
    id: 'item-swollen-li-ion',
    detectedName: 'Swollen 3-Cell Lithium-Polymer Laptop Battery',
    category: 'Batteries & Power',
    condition: 'Hazardous / Damaged',
    conditionDescription: 'Electrolyte gas expansion detected causing severe pouch swelling. High thermal runaway risk if punctured.',
    confidenceScore: 96,
    likelyComponents: [
      'Pressurized Lithium Cobalt Oxide (LiCoO2) Cathode',
      'Graphite Anode Layer',
      'Flammable Organic Carbonate Electrolyte',
      'Integrated Battery Management Circuit (BMS)',
      'Nickel-Plated Copper Busbars'
    ],
    materialsBreakdown: [
      { material: 'Lithium Cobalt Oxide', percentage: 35, description: 'High-energy cathode powder', isHazardous: true, isPreciousOrRare: true },
      { material: 'Organic Solvents & Electrolyte', percentage: 25, description: 'Flammable vapor risk under puncture', isHazardous: true },
      { material: 'Graphite / Carbon', percentage: 20, description: 'Anode structure' },
      { material: 'Copper & Nickel Foils', percentage: 15, description: 'Current collectors' },
      { material: 'Plastic Polymer Pouch', percentage: 5, description: 'Expanded barrier film' }
    ],
    estimatedWeightKg: 0.320,
    hazardLevel: 'critical',
    hazardWarning: 'CRITICAL SAFETY HAZARD: Do NOT press, drop, charge, or throw into standard municipal garbage. Flammable runaway risk!',
    safetyInstructions: [
      'Tape over external copper terminal connectors with electrical insulation tape.',
      'Place inside a non-conductive, fire-retardant container (e.g. metal box lined with sand or dry baking soda).',
      'Do NOT attempt to discharge or charge.',
      'Transport immediately to an MPPCB-authorized hazardous e-waste collection center.'
    ],
    recommendationHierarchy: {
      reuse: {
        possible: false,
        tip: 'Unsafe for any reuse. Cell structure is chemically unstable.'
      },
      repair: {
        possible: false,
        tip: 'Lithium battery swelling cannot be repaired and requires hazardous recycling.'
      },
      donate: {
        possible: false,
        tip: 'Cannot be accepted for donation due to fire safety compliance.'
      },
      recycle: {
        action: 'Mandatory MPPCB-authorized hazardous battery reclamation facility dispatch (Greenscape / Karo Sambhav).',
        environmentalBenefit: 'Recovers pure Cobalt and Lithium while eliminating severe municipal landfill fire hazard.'
      }
    },
    recyclingChannels: ['Greenscape Eco Management (Malanpur)', 'Karo Sambhav Maharajpura Hub']
  },
  'dell-laptop': {
    id: 'item-dell-inspiron',
    detectedName: 'Dell Inspiron 15 (Core i3, Defunct Screen)',
    category: 'Laptops & Computers',
    condition: 'Repairable',
    conditionDescription: 'Display backlight failed, motherboard functional, 500GB HDD intact, RAM modules undamaged.',
    confidenceScore: 91,
    likelyComponents: [
      'Multi-Layer FR-4 Motherboard with SMT Components',
      '15.6" WLED TN Panel',
      '45W AC Adapter & Internal Wiring Harness',
      '4GB DDR4 SO-DIMM RAM',
      '500GB 2.5" SATA Magnetic Hard Drive',
      'Copper Heat Pipe & Blower Fan'
    ],
    materialsBreakdown: [
      { material: 'Flame-Retardant ABS & PC Plastics', percentage: 42, description: 'Chassis and keyboard deck' },
      { material: 'Aluminum & Steel Internals', percentage: 26, description: 'Brackets, hinges, shielding' },
      { material: 'Fiberglass & Copper PCB', percentage: 18, description: 'Motherboard and daughterboards' },
      { material: 'Rare Earth Elements & Gold', percentage: 1.5, description: 'HDD voice coil, solder balls, contact fingers', isPreciousOrRare: true },
      { material: 'Liquid Crystal Glass & Diffuser', percentage: 12.5, description: 'Display sandwich' }
    ],
    estimatedWeightKg: 2.15,
    hazardLevel: 'medium',
    hazardWarning: 'Contains halogenated flame retardants and internal lithium CMOS coin cell.',
    safetyInstructions: [
      'Wipe private files or remove hard drive if confidential personal records exist.',
      'Do not break the LCD glass panel to avoid exposure to micro-glass shards.'
    ],
    recommendationHierarchy: {
      reuse: {
        possible: true,
        tip: 'Can be connected to any TV or external monitor via HDMI to function as a desktop workstation or student PC.'
      },
      repair: {
        possible: true,
        estimatedCostRangeInInr: '₹1,500 – ₹2,400',
        typicalFixes: ['LCD ribbon cable / replacement screen', 'Thermal paste repaste'],
        tip: 'Local repair at Thatipur or Lashkar computer markets can restore screen functionality.'
      },
      donate: {
        possible: true,
        tip: 'Can be donated to educational institutes for student digital literacy programs.'
      },
      recycle: {
        action: 'Hand over to authorized recyclers for systematic dismantling, PCB smelting, and precious metal refining.',
        environmentalBenefit: 'Saves 2.15kg of electronic scrap and recovers 0.05g gold, 0.4g silver, and 120g copper.'
      }
    },
    recyclingChannels: ['Attero EPR Partner (Thatipur)', 'Namo E-Waste Gwalior', 'Greenscape MP']
  },
  'crt-tv': {
    id: 'item-broken-crt',
    detectedName: 'Old 21-Inch CRT (Cathode Ray Tube) Television',
    category: 'Appliances & Consumer Tech',
    condition: 'Recyclable Only',
    conditionDescription: 'Non-functional analog circuitry, heavy leaded glass tube, flyback transformer intact.',
    confidenceScore: 95,
    likelyComponents: [
      'High-Lead Funnel Glass & Barium-Strontium Faceplate',
      'Copper Deflection Yoke Coil (~0.8kg Copper)',
      'Flyback Transformer & High-Voltage Capacitors',
      'Bakelite / HIPS Rear Enclosure',
      'Shadow Mask Steel Grid'
    ],
    materialsBreakdown: [
      { material: 'Leaded Silicate Glass', percentage: 60, description: 'Contains 1.5kg - 2.5kg of bound toxic lead oxide', isHazardous: true },
      { material: 'High-Impact Polystyrene (HIPS)', percentage: 22, description: 'Outer housing with flame retardant' },
      { material: 'Pure Copper Wire', percentage: 10, description: 'Yoke and degaussing coils', isPreciousOrRare: true },
      { material: 'Ferrous Metals & Steel', percentage: 7, description: 'Chassis bracket and shadow mask' },
      { material: 'Phosphor Powder Coating', percentage: 1, description: 'Internal toxic fluorescent chemical layer', isHazardous: true }
    ],
    estimatedWeightKg: 18.5,
    hazardLevel: 'critical',
    hazardWarning: 'EXTREME HAZARD: High concentration of lead and toxic internal vacuum. NEVER break CRT glass or sell to informal scrap burners.',
    safetyInstructions: [
      'Handle with care — do not strike or scratch the glass neck.',
      'Never break glass outdoors as phosphor powder and lead dust are respirable neurotoxins.',
      'Must be handed directly to an MPPCB-licensed e-waste dismantling facility with glass-leaching recovery capabilities.'
    ],
    recommendationHierarchy: {
      reuse: {
        possible: false,
        tip: 'Obsolete analog broadcast receiver with extreme energy consumption.'
      },
      repair: {
        possible: false,
        tip: 'Repair parts obsolete and economically unviable.'
      },
      donate: {
        possible: false,
        tip: 'Not recommended due to bulk lead hazards and lack of digital tuner.'
      },
      recycle: {
        action: 'Mandatory licensed recycler processing (Greenscape Malanpur / Greeniva Morar).',
        environmentalBenefit: 'Isolates and safely extracts ~2kg of toxic lead, preventing chronic groundwater poisoning.'
      }
    },
    recyclingChannels: ['Greenscape Eco Management (Malanpur)', 'Greeniva MP Collection Unit (Morar)']
  },
  'cables-chargers': {
    id: 'item-cables-bundle',
    detectedName: 'Bundle of Tangled USB Cables & Wall Adapters',
    category: 'Cables & Chargers',
    condition: 'Recyclable Only',
    conditionDescription: 'Frayed insulation, oxidized micro-USB & Lightning connectors, defective transformer coils.',
    confidenceScore: 89,
    likelyComponents: [
      'High-Purity Multi-Strand Copper Wiring',
      'Polyvinyl Chloride (PVC) Insulation Jacket',
      'Ferrite Choke Beads',
      'Gold/Nickel-Plated USB Terminals',
      'Small PCB Power Adapter Circuit'
    ],
    materialsBreakdown: [
      { material: 'High-Grade Electrolytic Copper', percentage: 55, description: 'Easily recyclable pure copper conductor', isPreciousOrRare: true },
      { material: 'PVC & TPE Polymer', percentage: 40, description: 'Insulating sheath' },
      { material: 'Brass / Nickel Plating', percentage: 5, description: 'Connector pins' }
    ],
    estimatedWeightKg: 0.450,
    hazardLevel: 'low',
    hazardWarning: 'Open-air burning by informal scrap dealers releases carcinogenic dioxins and furans. Only recycle via authorized shredders.',
    safetyInstructions: [
      'Tie neatly with rubber bands or string.',
      'Drop off in any authorized school collection bin or municipal drop point.'
    ],
    recommendationHierarchy: {
      reuse: {
        possible: false,
        tip: 'Frayed wires present short-circuit and smartphone battery damage risks.'
      },
      repair: {
        possible: false,
        tip: 'Low unit value makes rewiring uneconomical.'
      },
      donate: {
        possible: false,
        tip: 'Only fully functional, undamaged cables should be donated.'
      },
      recycle: {
        action: 'Drop in an authorized e-waste collection bin or GMC Maharaj Bada drop center.',
        environmentalBenefit: 'High copper recovery efficiency (98%) without harmful PVC open-air burning.'
      }
    },
    recyclingChannels: ['GMC Drop Center (Maharaj Bada)', 'Namo E-Waste', 'Karo Sambhav Gwalior']
  }
};
