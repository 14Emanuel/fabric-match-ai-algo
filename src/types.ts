export interface FabricSpec {
  fiberComposition: Record<string, number>; // e.g. { "cotton": 95, "elastane": 5 }
  fiberCategory: 'natural' | 'synthetic' | 'blend' | 'semi-synthetic';
  weightGsm: number; // e.g. 180 GSM
  weightCategory: 'lightweight' | 'midweight' | 'heavyweight';
  weaveType: string; // e.g. 'Poplin', 'Chiffon', 'Jersey'
  opacityScore: number; // 1 (sheer) to 10 (opaque)
  sheernessDescription: string;
  lining: 'none' | 'bodice_only' | 'half_lined' | 'fully_lined';
  liningMaterial?: string;
  stretchLevel: 'none' | 'mechanical' | 'medium' | 'high';
  stretchPercent: number; // 0 - 25%
  breathability: number; // 1 - 10
  careType: 'machine_washable' | 'hand_wash' | 'dry_clean_only';
  wrinkleResistance: 'low' | 'moderate' | 'high';
}

export interface Garment {
  id: string;
  title: string;
  brand: string;
  price: number;
  category: string;
  imageUrl: string;
  backImageUrl?: string;
  fabricDetailImageUrl?: string;
  lengthDetails?: string;
  mobilityDetails?: string;
  description: string;
  fabric: FabricSpec;
  constructionHighlights: string[];
}

export interface UserPreferenceProfile {
  id: string;
  name: string;
  personaTitle: string;
  avatar: string;
  description: string;
  restrictedFibers: string[]; // e.g. ['polyester', 'wool']
  preferNaturalFibers: boolean;
  minOpacity: number; // 1 to 10
  requireLining: 'any' | 'partial_or_full' | 'fully_lined';
  minBreathability: number; // 1 to 10
  minStretch: 'none' | 'mechanical' | 'medium' | 'high';
  allowedCare: ('machine_washable' | 'hand_wash' | 'dry_clean_only')[];
  importanceWeights: {
    fiberComposition: number;
    breathability: number;
    opacity: number;
    lining: number;
    stretch: number;
    care: number;
  };
}

export interface CriterionMatch {
  criterion: string;
  score: number; // 0 to 100
  weight: number;
  userRequirement: string;
  garmentActual: string;
  status: 'pass' | 'warning' | 'fail';
  detail: string;
}

export interface MatchEvaluation {
  garmentId: string;
  totalScore: number; // 0 to 100
  grade: 'Perfect Match' | 'Good Fit' | 'Borderline' | 'Not Recommended' | 'Incompatible';
  hardViolations: string[];
  criteria: CriterionMatch[];
  transparencyBadge: string;
  verdictReason: string;
}
