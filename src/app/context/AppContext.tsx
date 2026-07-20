import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "sme" | "bank" | "sbp" | null;

export interface Business {
  id: string;
  name: string;
  nature: string;
  ntn: string;
  address: string;
  status: string;
  ownerCnic?: string;
  contactPerson?: string;
  cellLandline?: string;
  email?: string;
  yearEstablished?: string;
  annualSales?: string;
  employees?: string;
  premise?: string;
  businessStatus?: string;
  registration?: string;
  registrationNumber?: string;
  registrationAuthority?: string;
  description?: string;
  bank?: string;
  iban?: string;
}

export interface Application {
  id: string;
  caseId: string;
  businessName: string;
  scheme: string;
  amount: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "disbursed";
  bank: string;
  submittedDate: string;
  stage: number;
}

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  user: { name: string; email: string } | null;
  setUser: (u: { name: string; email: string } | null) => void;
  businesses: Business[];
  selectedBusiness: Business | null;
  setSelectedBusiness: (b: Business) => void;
  addBusiness: (b: Business) => void;
  applications: Application[];
  selectedApplication: Application | null;
  setSelectedApplication: (a: Application | null) => void;
}

const AppContext = createContext<AppState | null>(null);

const SAMPLE_BUSINESSES: Business[] = [
  {
    id: "b1", name: "ABC Traders", nature: "Trading", ntn: "1234567-8",
    address: "Plot 45, SITE Industrial Area, Karachi", status: "Active",
    ownerCnic: "42101-1234567-1", contactPerson: "Ahmed Khan", cellLandline: "+92 300 0000000",
    email: "ahmed.khan@abctraders.com", yearEstablished: "2018", annualSales: "18,500,000", employees: "25",
    premise: "Rented", businessStatus: "Proprietorship", registration: "No", description: "Wholesale trading of textile goods.",
  },
  {
    id: "b2", name: "XYZ Foods Pvt. Ltd.", nature: "Manufacturing", ntn: "9876543-2",
    address: "F-6 Industrial Estate, Lahore", status: "Active",
    ownerCnic: "35201-7654321-9", contactPerson: "Sara Malik", cellLandline: "+92 321 0000000",
    email: "sara.malik@xyzfoods.com", yearEstablished: "2015", annualSales: "42,000,000", employees: "60",
    premise: "Owned", businessStatus: "Private Limited Company", registration: "Yes",
    registrationNumber: "0071523", registrationAuthority: "SECP", description: "Packaged food manufacturing and distribution.",
  },
];

const SAMPLE_APPS: Application[] = [
  { id: "a1", caseId: "SBP-SME-2025-00142", businessName: "ABC Traders", scheme: "SME Asaan Finance (SAAF)", amount: "PKR 8,500,000", status: "under_review", bank: "HBL", submittedDate: "2025-06-12", stage: 3 },
  { id: "a2", caseId: "SBP-SME-2025-00098", businessName: "XYZ Foods Pvt. Ltd.", scheme: "Refinance Facility for SMEs", amount: "PKR 15,000,000", status: "approved", bank: "MCB Bank", submittedDate: "2025-05-28", stage: 5 },
  { id: "a3", caseId: "SBP-SME-2025-00071", businessName: "ABC Traders", scheme: "Technology Upgrade Scheme", amount: "PKR 22,000,000", status: "disbursed", bank: "UBL", submittedDate: "2025-04-10", stage: 6 },
  { id: "a4", caseId: "SBP-SME-2025-00183", businessName: "XYZ Foods Pvt. Ltd.", scheme: "SME Asaan Finance (SAAF)", amount: "PKR 5,000,000", status: "draft", bank: "—", submittedDate: "—", stage: 0 },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>(SAMPLE_BUSINESSES);
  const [selectedBusiness, setSelectedBusiness] = useState<Business>(SAMPLE_BUSINESSES[0]);
  const [applications] = useState<Application[]>(SAMPLE_APPS);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const addBusiness = (b: Business) => {
    setBusinesses(prev => [...prev, b]);
    setSelectedBusiness(b);
  };

  return (
    <AppContext.Provider value={{
      role, setRole,
      user, setUser,
      businesses, selectedBusiness, setSelectedBusiness, addBusiness,
      applications, selectedApplication, setSelectedApplication,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
