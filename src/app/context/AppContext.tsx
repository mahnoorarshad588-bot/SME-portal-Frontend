import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "sme" | "bank" | "sbp" | null;

export interface Shareholder {
  name: string;
  cnic: string;
  phone: string;
  email: string;
  share: string;
  role: string;
}

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
  shareholders?: Shareholder[];
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

export interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  dot: string;
  read: boolean;
}

export interface OfferDocument {
  fileName: string;
  fileUrl: string;
  business: string;
  caseId: string;
  bank: string;
  uploadedAt: string;
}

export interface BankApplication {
  id: string;
  caseId: string;
  business: string;
  scheme: string;
  amount: string;
  status: string;
  submitted: string;
  risk: string;
}

export interface ApplicationDoc {
  label: string;
  fileName: string;
  fileUrl: string;
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
  addApplication: (a: { businessName: string; scheme: string; amount: string; bank: string; documents?: ApplicationDoc[] }) => string;
  applicationDocuments: Record<string, ApplicationDoc[]>;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "read">) => void;
  markNotificationsRead: () => void;
  offerDocument: OfferDocument | null;
  setOfferDocument: (o: OfferDocument | null) => void;
  bankApplications: BankApplication[];
  updateBankApplicationStatus: (id: string, status: string) => void;
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

const SAMPLE_BANK_APPLICATIONS: BankApplication[] = [
  { id: "A001", caseId: "SBP-SME-2025-00142", business: "ABC Traders", scheme: "SAAF", amount: "PKR 8.5M", submitted: "Jun 12", status: "under_review", risk: "Low" },
  { id: "A002", caseId: "SBP-SME-2025-00139", business: "Karachi Steel Works", scheme: "Tech Upgrade", amount: "PKR 22M", submitted: "Jun 10", status: "pending", risk: "Medium" },
  { id: "A003", caseId: "SBP-SME-2025-00131", business: "Fresh Farm Exports", scheme: "Agri-SME", amount: "PKR 12M", submitted: "Jun 8", status: "pending", risk: "Low" },
  { id: "A004", caseId: "SBP-SME-2025-00128", business: "TechSoft Solutions", scheme: "SAAF", amount: "PKR 6M", submitted: "Jun 5", status: "offer_issued", risk: "Low" },
  { id: "A005", caseId: "SBP-SME-2025-00119", business: "Lahore Textile Mills", scheme: "Refinance", amount: "PKR 18M", submitted: "Jun 2", status: "approved", risk: "High" },
];

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Application Under Review", desc: "SBP-SME-2025-00142 is being reviewed by HBL", time: "2h ago", dot: "#2563EB", read: false },
  { id: "n2", title: "Offer Received", desc: "MCB Bank has issued a conditional offer for XYZ Foods", time: "Yesterday", dot: "#006838", read: false },
  { id: "n3", title: "Document Required", desc: "Additional documents requested for ABC Traders application", time: "2 days ago", dot: "#EA580C", read: false },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>(SAMPLE_BUSINESSES);
  const [selectedBusiness, setSelectedBusiness] = useState<Business>(SAMPLE_BUSINESSES[0]);
  const [applications, setApplications] = useState<Application[]>(SAMPLE_APPS);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [offerDocument, setOfferDocument] = useState<OfferDocument | null>(null);
  const [bankApplications, setBankApplications] = useState<BankApplication[]>(SAMPLE_BANK_APPLICATIONS);
  const [applicationDocuments, setApplicationDocuments] = useState<Record<string, ApplicationDoc[]>>({});

  const addBusiness = (b: Business) => {
    setBusinesses(prev => [...prev, b]);
    setSelectedBusiness(b);
  };

  const addApplication = (a: { businessName: string; scheme: string; amount: string; bank: string; documents?: ApplicationDoc[] }) => {
    const now = new Date();
    const caseId = `SBP-SME-${now.getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    const id = `a${Date.now()}`;
    const isoDate = now.toISOString().slice(0, 10);
    const shortDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    setApplications(prev => [
      { id, caseId, businessName: a.businessName, scheme: a.scheme, amount: a.amount, status: "submitted", bank: a.bank, submittedDate: isoDate, stage: 1 },
      ...prev,
    ]);
    setBankApplications(prev => [
      { id, caseId, business: a.businessName, scheme: a.scheme, amount: a.amount, status: "pending", submitted: shortDate, risk: "Low" },
      ...prev,
    ]);
    if (a.documents?.length) {
      setApplicationDocuments(prev => ({ ...prev, [id]: a.documents! }));
    }

    return caseId;
  };

  const addNotification = (n: Omit<Notification, "id" | "read">) => {
    setNotifications(prev => [{ ...n, id: `n${Date.now()}`, read: false }, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateBankApplicationStatus = (id: string, status: string) => {
    setBankApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <AppContext.Provider value={{
      role, setRole,
      user, setUser,
      businesses, selectedBusiness, setSelectedBusiness, addBusiness,
      applications, selectedApplication, setSelectedApplication, addApplication, applicationDocuments,
      notifications, addNotification, markNotificationsRead,
      offerDocument, setOfferDocument,
      bankApplications, updateBankApplicationStatus,
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
