export type LeadStatus = "new" | "contacted" | "completed";

export interface ContactLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  suburb?: string;
  service: string;
  message: string;
  createdAt: string;
  status: LeadStatus;
}

export interface NewsletterLead {
  id: string;
  email: string;
  createdAt: string;
  status: "subscribed" | "unsubscribed";
}

export interface LeadStats {
  totalEnquiries: number;
  totalNewsletters: number;
  newLeadsToday: number;
  contactedRate: number;
}
