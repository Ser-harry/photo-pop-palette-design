
import { College, Branch, CutoffData } from "@/types/college";

export const mockColleges: College[] = [
  {
    id: "1",
    name: "Anna University - College of Engineering Guindy",
    location: "Chennai",
    district: "Chennai",
    type: "government",
    naacGrade: "A++",
    established: 1794,
    facilities: ["Library", "Hostels", "Sports Complex", "Research Labs"]
  },
  {
    id: "2", 
    name: "PSG College of Technology",
    location: "Coimbatore",
    district: "Coimbatore",
    type: "self-financing",
    naacGrade: "A",
    established: 1951,
    facilities: ["Library", "Computer Labs", "Sports Facilities", "Placement Cell"]
  },
  {
    id: "3",
    name: "Thiagarajar College of Engineering",
    location: "Madurai",
    district: "Madurai", 
    type: "aided",
    naacGrade: "A",
    established: 1957,
    facilities: ["Central Library", "Hostels", "Research Centers", "Innovation Hub"]
  }
];

export const mockBranches: Branch[] = [
  { id: "1", name: "Computer Science Engineering", code: "CSE", duration: "4 years" },
  { id: "2", name: "Electronics and Communication Engineering", code: "ECE", duration: "4 years" },
  { id: "3", name: "Mechanical Engineering", code: "MECH", duration: "4 years" },
  { id: "4", name: "Civil Engineering", code: "CIVIL", duration: "4 years" },
  { id: "5", name: "Electrical and Electronics Engineering", code: "EEE", duration: "4 years" },
  { id: "6", name: "Information Technology", code: "IT", duration: "4 years" }
];

export const mockCutoffData: CutoffData[] = [
  // Anna University CEG - CSE
  { id: "1", collegeId: "1", branchId: "1", year: 2023, category: "OC", cutoffMark: 199.5, openingRank: 1, closingRank: 150 },
  { id: "2", collegeId: "1", branchId: "1", year: 2022, category: "OC", cutoffMark: 198.8, openingRank: 1, closingRank: 145 },
  { id: "3", collegeId: "1", branchId: "1", year: 2021, category: "OC", cutoffMark: 198.2, openingRank: 1, closingRank: 140 },
  
  // PSG - CSE
  { id: "4", collegeId: "2", branchId: "1", year: 2023, category: "OC", cutoffMark: 192.3, openingRank: 200, closingRank: 800 },
  { id: "5", collegeId: "2", branchId: "1", year: 2022, category: "OC", cutoffMark: 191.8, openingRank: 195, closingRank: 790 },
  
  // TCE - CSE  
  { id: "6", collegeId: "3", branchId: "1", year: 2023, category: "OC", cutoffMark: 187.8, openingRank: 400, closingRank: 1200 },
  { id: "7", collegeId: "3", branchId: "1", year: 2022, category: "OC", cutoffMark: 186.5, openingRank: 380, closingRank: 1150 }
];

export const tamilNaduDistricts = [
  "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli",
  "Vellore", "Erode", "Thanjavur", "Dindigul", "Cuddalore", "Kanchipuram",
  "Karur", "Nagapattinam", "Namakkal", "Perambalur", "Pudukkottai", "Ramanathapuram",
  "Sivaganga", "Tenkasi", "Theni", "Thiruvallur", "Thiruvannamalai", "Thiruvarur",
  "Tuticorin", "Udagamandalam", "Villupuram", "Virudhunagar"
];

export const categories = ["OC", "BC", "BCM", "MBC", "SC", "ST"];
