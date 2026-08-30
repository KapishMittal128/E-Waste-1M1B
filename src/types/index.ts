export type EWasteCategory = 
  | 'Mobile Phones'
  | 'Laptops & Computers'
  | 'Batteries & Power'
  | 'Appliances & Consumer Tech'
  | 'Cables & Chargers'
  | 'PCBs & Internal Components'
  | 'Other Electronics';

export type ConditionAssessment = 'Reusable' | 'Repairable' | 'Recyclable Only' | 'Hazardous / Damaged';

export type HazardLevel = 'low' | 'medium' | 'high' | 'critical';

export interface EWasteItemAnalysis {
  id: string;
  detectedName: string;
  category: EWasteCategory;
  condition: ConditionAssessment;
  conditionDescription: string;
  confidenceScore: number; // e.g. 92%
  likelyComponents: string[];
  materialsBreakdown: {
    material: string;
    percentage: number;
    description: string;
    isPreciousOrRare?: boolean;
    isHazardous?: boolean;
  }[];
  estimatedWeightKg: number;
  hazardLevel: HazardLevel;
  hazardWarning?: string;
  safetyInstructions: string[];
  recommendationHierarchy: {
    reuse: {
      possible: boolean;
      tip: string;
    };
    repair: {
      possible: boolean;
      estimatedCostRangeInInr?: string;
      typicalFixes?: string[];
      tip: string;
    };
    donate: {
      possible: boolean;
      tip: string;
    };
    recycle: {
      action: string;
      environmentalBenefit: string;
    };
  };
  recyclingChannels: string[];
}

export type RecyclerAuthorizationTier = 
  | 'MPPCB Authorized Recycler'
  | 'CPCB Registered PRO / EPR Partner'
  | 'GMC Municipal E-Waste Drop Point'
  | 'Verified Facility Collection Hub';

export interface Recycler {
  id: string;
  name: string;
  authorizationTier: RecyclerAuthorizationTier;
  registrationNumber: string;
  isGovernmentAuthorized: boolean;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  alternatePhone?: string;
  email?: string;
  whatsapp?: string;
  openingHours: string;
  daysOpen: string;
  acceptedCategories: EWasteCategory[];
  acceptedItemsSummary: string[];
  providesDoorstepPickup: boolean;
  minWeightForPickupKg?: number;
  paysForScrapOrIncentive: boolean;
  incentiveNote?: string;
  verificationSource: string;
  sourceUrl?: string;
  lastVerifiedDate: string;
  verifiedBy: string;
  rating: number;
  distanceKm?: number;
}

export interface PersonalDisposalRecord {
  id: string;
  itemName: string;
  category: EWasteCategory;
  quantity: number;
  estimatedWeightKg: number;
  previousDestination: 'Trash / Mixed Waste' | 'Informal Scrap Dealer' | 'Stored in Drawer / Clutter' | 'Terrace / Balcony';
  newDestination: 'MPPCB Authorized Recycler' | 'Repaired & Kept' | 'Donated / Reused' | 'School Collection Bin';
  recyclerName?: string;
  date: string;
  notes?: string;
}

export interface BinPlacementRequest {
  id: string;
  schoolName: string;
  principalName: string;
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail?: string;
  schoolAddress: string;
  approxStudentStrength: number;
  preferredBinLocation: string;
  pledgeAccepted: boolean;
  status: 'Pending Review' | 'Approved by Recycler' | 'Installed';
  requestDate: string;
}
