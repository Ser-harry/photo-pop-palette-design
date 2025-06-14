
export interface College {
  id: string;
  name: string;
  location: string;
  district: string;
  type: "government" | "aided" | "self-financing";
  naacGrade?: string;
  established: number;
  website?: string;
  facilities: string[];
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  duration: string;
}

export interface CutoffData {
  id: string;
  collegeId: string;
  branchId: string;
  year: number;
  category: string;
  cutoffMark: number;
  openingRank?: number;
  closingRank?: number;
}

export interface CollegeWithCutoff extends College {
  branch: Branch;
  cutoffData: CutoffData[];
  probability: "high" | "medium" | "low";
  probabilityScore: number;
  fees?: {
    tuition: number;
    hostel?: number;
    total: number;
  };
}

export interface PredictionFilters {
  marks: number;
  category: string;
  preferredDistrict?: string;
  collegeType?: string[];
  branches?: string[];
}
