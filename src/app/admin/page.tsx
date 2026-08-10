"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Filter,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase";
import type { ContactLead, LeadStatus, NewsletterLead } from "@/types/lead.types";

export default function AdminPage() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [authenticated, setAuthenticated] = useState(false);
  const [supabaseUserEmail, setSupabaseUserEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"mechanic" | "rental" | "newsletter" | "settings">("mechanic");
  const [loading, setLoading] = useState(true);

  const [enquiries, setEnquiries] = useState<ContactLead[]>([]);
  const [newsletters, setNewsletters] = useState<NewsletterLead[]>([]);

  const [openingHoursInput, setOpeningHoursInput] = useState("8:00 AM to 5:00 PM (Monday to Friday)");
  const [termsConditionsInput, setTermsConditionsInput] = useState(
    "The $70 call-out fee covers travel to your location and an initial inspection. The fee applies whether or not you proceed with repairs. Additional charges may apply for further diagnosis, labour, repairs or parts. All additional work will be discussed before proceeding."
  );
  const [savingHours, setSavingHours] = useState(false);
  const [hoursSavedSuccess, setHoursSavedSuccess] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");

  const [selectedMessage, setSelectedMessage] = useState<ContactLead | null>(null);

  // Helper to identify rental leads vs mechanic service leads
  const isRentalLead = (item: ContactLead) =>
    item.service === "Car Rental Enquiry" ||
    item.service.toLowerCase().includes("rental") ||
    item.service.toLowerCase().includes("rent a car") ||
    item.service.toLowerCase().includes("car rent");

  const mechanicEnquiries = enquiries.filter((item) => !isRentalLead(item));
  const rentalEnquiries = enquiries.filter((item) => isRentalLead(item));

  // Check active Supabase Auth session on mount
  useEffect(() => {
    if (!supabaseBrowser) return;

    // Fetch initial session
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthenticated(true);
        setSupabaseUserEmail(session.user.email ?? "Admin User");
      }
    });

    // Listen for auth state updates
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthenticated(true);
        setSupabaseUserEmail(session.user.email ?? "Admin User");
      } else {
        setAuthenticated(false);
        setSupabaseUserEmail(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Read leads from server API & local storage backup
  const fetchLeads = async (showLoadingState = false) => {
    if (showLoadingState) setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();

      const serverEnquiries: ContactLead[] = data.enquiries || [];
      const serverNewsletters: NewsletterLead[] = data.newsletter || [];

      // Merge local storage backup enquiries
      try {
        const localEnquiriesStr = window.localStorage.getItem("apv-enquiries");
        if (localEnquiriesStr) {
          const localEnquiries = JSON.parse(localEnquiriesStr);
          localEnquiries.forEach((item: Partial<ContactLead>, idx: number) => {
            if (!serverEnquiries.some((e) => e.email === item.email && e.message === item.message)) {
              serverEnquiries.push({
                id: "local_enq_" + idx,
                name: item.name || "Customer",
                email: item.email || "",
                phone: item.phone || "N/A",
                service: item.service || "General Care",
                message: item.message || "",
                createdAt: item.createdAt || new Date().toISOString(),
                status: "new",
              });
            }
          });
        }

        const localNewsStr = window.localStorage.getItem("apv-newsletter-leads");
        if (localNewsStr) {
          const localNews = JSON.parse(localNewsStr);
          localNews.forEach((item: Partial<NewsletterLead>, idx: number) => {
            if (!serverNewsletters.some((n) => n.email === item.email)) {
              serverNewsletters.push({
                id: "local_news_" + idx,
                email: item.email || "",
                createdAt: item.createdAt || new Date().toISOString(),
                status: "subscribed",
              });
            }
          });
        }
      } catch { }

      setEnquiries(serverEnquiries);
      setNewsletters(serverNewsletters);
    } catch (err) {
      console.error("Failed to fetch admin leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.openingHours) {
        setOpeningHoursInput(data.openingHours);
      }
      if (data.termsConditions) {
        setTermsConditionsInput(data.termsConditions);
      }
    } catch { }
  };

  useEffect(() => {
    if (!authenticated) return;

    const timerId = setTimeout(() => {
      void fetchLeads(false);
      void fetchSettings();
    }, 0);

    return () => clearTimeout(timerId);
  }, [authenticated]);

  const handleSaveOpeningHours = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHours(true);
    setHoursSavedSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          openingHours: openingHoursInput,
          termsConditions: termsConditionsInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.openingHours) {
          setOpeningHoursInput(data.openingHours);
          try {
            window.localStorage.setItem("apv-opening-hours", data.openingHours);
          } catch { }
        }
        if (data.termsConditions) {
          setTermsConditionsInput(data.termsConditions);
          try {
            window.localStorage.setItem("apv-terms-conditions", data.termsConditions);
          } catch { }
        }
        setHoursSavedSuccess(true);
        setTimeout(() => setHoursSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Failed to save site settings:", err);
    } finally {
      setSavingHours(false);
    }
  };

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!supabaseBrowser) {
      setAuthError("Supabase client is not initialised. Use PIN passcode fallback.");
      return;
    }

    setAuthLoading(true);

    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });

      if (error) {
        setAuthError(error.message);
      } else if (data.user) {
        setAuthenticated(true);
        setSupabaseUserEmail(data.user.email ?? "Admin User");
      }
    } catch (err: unknown) {
      setAuthError((err as Error)?.message || "Supabase authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (supabaseBrowser) {
      await supabaseBrowser.auth.signOut().catch(() => { });
    }
    setAuthenticated(false);
    setSupabaseUserEmail(null);
  };

  const handleUpdateStatus = async (id: string, newStatus: LeadStatus) => {
    setEnquiries((current) =>
      current.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    }).catch(() => { });
  };

  const handleDeleteLead = async (id: string, type: "enquiry" | "newsletter") => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    if (type === "enquiry") {
      setEnquiries((current) => current.filter((item) => item.id !== id));
    } else {
      setNewsletters((current) => current.filter((item) => item.id !== id));
    }

    await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" }).catch(() => { });
  };

  const handleExportCSV = () => {
    let csvContent = "";
    if (activeTab === "mechanic") {
      csvContent = "Name,Email,Phone,Suburb,Service,Status,Date,Message\n";
      mechanicEnquiries.forEach((e) => {
        const cleanMsg = (e.message || "").replace(/"/g, '""');
        csvContent += `"${e.name}","${e.email}","${e.phone}","${e.suburb || "N/A"}","${e.service}","${e.status}","${e.createdAt}","${cleanMsg}"\n`;
      });
    } else if (activeTab === "rental") {
      csvContent = "Name,Email,Phone,Suburb,Service,Status,Date,Message\n";
      rentalEnquiries.forEach((e) => {
        const cleanMsg = (e.message || "").replace(/"/g, '""');
        csvContent += `"${e.name}","${e.email}","${e.phone}","${e.suburb || "N/A"}","${e.service}","${e.status}","${e.createdAt}","${cleanMsg}"\n`;
      });
    } else {
      csvContent = "Email,Status,Subscription Date\n";
      newsletters.forEach((n) => {
        csvContent += `"${n.email}","${n.status}","${n.createdAt}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `apv-${activeTab}-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered lists
  const filteredMechanicEnquiries = mechanicEnquiries.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.suburb && item.suburb.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRentalEnquiries = rentalEnquiries.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.suburb && item.suburb.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredNewsletters = newsletters.filter((item) =>
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render Login screen if unauthenticated
  if (!authenticated) {
    return (
      <main style={{ minHeight: "85vh", display: "grid", placeItems: "center", padding: "40px 20px", background: "#0a0a0a" }}>
        <div style={{ maxWidth: "440px", width: "100%", background: "#ffffff", padding: "36px 28px", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", border: "1px solid #e9ecef" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ display: "inline-block", marginBottom: "12px" }}>
              <Image
                src="/assets/images/resources/apv-bear-logo-black.png"
                alt="APV Mobile Mechanics Logo"
                width={110}
                height={110}
                style={{ objectFit: "contain", margin: "0 auto" }}
                priority
              />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 4px 0" }}>APV Admin Portal</h1>
            <p style={{ fontSize: "14px", color: "#6c757d", margin: 0 }}>Supabase Authenticated Lead Dashboard</p>
          </div>

          {authError && (
            <div style={{ padding: "10px 14px", borderRadius: "6px", background: "#ffe6e6", border: "1px solid #ffc9c9", color: "#ed1c24", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleSupabaseLogin}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "6px" }}>Admin Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#adb5bd" }} />
                <input
                  type="email"
                  placeholder="apvmobilemechanics@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  style={{ width: "100%", padding: "12px 14px 12px 40px", borderRadius: "8px", border: "1px solid #ced4da", fontSize: "14px" }}
                  autoFocus
                />
              </div>
            </div>

            <div style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "6px" }}>Supabase Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#adb5bd" }} />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  style={{ width: "100%", padding: "12px 14px 12px 40px", borderRadius: "8px", border: "1px solid #ced4da", fontSize: "14px" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              style={{ width: "100%", padding: "14px", background: "#ed1c24", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "15px", cursor: authLoading ? "wait" : "pointer", opacity: authLoading ? 0.7 : 1 }}
            >
              {authLoading ? "Verifying Credentials with Supabase..." : "Sign In with Supabase Auth"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link href="/" style={{ fontSize: "13px", color: "#6c757d", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <ArrowLeft size={14} /> Back to Website
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const newCount = enquiries.filter((e) => e.status === "new").length;
  const contactedCount = enquiries.filter((e) => e.status === "contacted").length;

  return (
    <main style={{ padding: "30px 0 60px 0", background: "#f4f5f7", minHeight: "100vh" }}>
      <div className="container">
        {/* Dedicated Admin Header Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "30px", background: "#fff", padding: "16px 24px", borderRadius: "12px", border: "1px solid #e9ecef", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Image
              src="/assets/images/resources/apv-bear-logo-black.png"
              alt="APV Mobile Mechanics Logo"
              width={64}
              height={64}
              style={{ objectFit: "contain", borderRadius: "8px" }}
              priority
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: 0 }}>APV Admin Portal</h1>
                <span style={{ padding: "4px 10px", background: "#e8f5e9", color: "#2e7d32", fontSize: "12px", borderRadius: "20px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <ShieldCheck size={14} /> Supabase Auth Connected
                </span>
              </div>
              <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#6c757d" }}>
                APV Mobile Mechanics — Customer Leads &amp; Newsletter Subscriptions
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            {supabaseUserEmail && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 12px", background: "#f1f3f5", color: "#333", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>
                <User size={14} style={{ color: "#ed1c24" }} /> {supabaseUserEmail}
              </span>
            )}

            <button
              onClick={() => fetchLeads(true)}
              disabled={loading}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 14px", background: "#fff", border: "1px solid #ced4da", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
            </button>

            <button
              onClick={handleExportCSV}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 14px", background: "#111", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
            >
              <Download size={15} /> Export CSV
            </button>

            <button
              onClick={handleSignOut}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 14px", background: "#fee2e2", color: "#ed1c24", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
            >
              <LogOut size={15} /> Sign Out
            </button>

            <Link href="/" style={{ padding: "9px 14px", background: "#e9ecef", color: "#333", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "13px" }}>
              View Site
            </Link>
          </div>
        </div>

        {/* Analytics Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e9ecef", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", background: "#fee2e2", color: "#ed1c24", borderRadius: "10px", display: "grid", placeItems: "center" }}>
              <Wrench size={24} />
            </div>
            <div>
              <span style={{ fontSize: "13px", color: "#6c757d", fontWeight: "600" }}>Mechanic Service Leads</span>
              <h2 style={{ fontSize: "26px", fontWeight: "800", margin: "2px 0 0 0", color: "#111" }}>{mechanicEnquiries.length}</h2>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e9ecef", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", background: "#e0f2fe", color: "#0284c7", borderRadius: "10px", display: "grid", placeItems: "center" }}>
              <Car size={24} />
            </div>
            <div>
              <span style={{ fontSize: "13px", color: "#6c757d", fontWeight: "600" }}>Rent A Car Leads</span>
              <h2 style={{ fontSize: "26px", fontWeight: "800", margin: "2px 0 0 0", color: "#111" }}>{rentalEnquiries.length}</h2>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e9ecef", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", background: "#fff3cd", color: "#856404", borderRadius: "10px", display: "grid", placeItems: "center" }}>
              <Clock size={24} />
            </div>
            <div>
              <span style={{ fontSize: "13px", color: "#6c757d", fontWeight: "600" }}>New Unactioned Leads</span>
              <h2 style={{ fontSize: "26px", fontWeight: "800", margin: "2px 0 0 0", color: "#111" }}>{newCount}</h2>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e9ecef", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", background: "#e8f5e9", color: "#2e7d32", borderRadius: "10px", display: "grid", placeItems: "center" }}>
              <Users size={24} />
            </div>
            <div>
              <span style={{ fontSize: "13px", color: "#6c757d", fontWeight: "600" }}>Newsletter Subscribers</span>
              <h2 style={{ fontSize: "26px", fontWeight: "800", margin: "2px 0 0 0", color: "#111" }}>{newsletters.length}</h2>
            </div>
          </div>
        </div>

        {/* Controls & Tabs Bar */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e9ecef", overflow: "hidden" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e9ecef", gap: "16px" }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => setActiveTab("mechanic")}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: activeTab === "mechanic" ? "#ed1c24" : "#f1f3f5",
                  color: activeTab === "mechanic" ? "#fff" : "#495057",
                }}
              >
                <Wrench size={15} /> Mechanic Leads ({mechanicEnquiries.length})
              </button>

              <button
                onClick={() => setActiveTab("rental")}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: activeTab === "rental" ? "#ed1c24" : "#f1f3f5",
                  color: activeTab === "rental" ? "#fff" : "#495057",
                }}
              >
                <Car size={15} /> Rent A Car Leads ({rentalEnquiries.length})
              </button>

              <button
                onClick={() => setActiveTab("newsletter")}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "newsletter" ? "#ed1c24" : "#f1f3f5",
                  color: activeTab === "newsletter" ? "#fff" : "#495057",
                }}
              >
                Newsletter Subscribers ({newsletters.length})
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "settings" ? "#ed1c24" : "#f1f3f5",
                  color: activeTab === "settings" ? "#fff" : "#495057",
                }}
              >
                Business Hours Settings
              </button>
            </div>

            {/* Search & Status Filters */}
            {activeTab !== "settings" && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ position: "relative", width: "240px" }}>
                  <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#adb5bd" }} />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "6px", border: "1px solid #ced4da", fontSize: "14px" }}
                  />
                </div>

                {(activeTab === "mechanic" || activeTab === "rental") && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Filter size={14} style={{ color: "#6c757d" }} />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as "all" | LeadStatus)}
                      style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ced4da", fontSize: "14px", background: "#fff" }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New Only</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Table or Settings Container */}
          <div style={{ overflowX: "auto" }}>
            {activeTab === "settings" ? (
              <div style={{ padding: "32px 24px", maxWidth: "680px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#111", margin: "0 0 6px 0" }}>
                    Website Business &amp; Site Settings
                  </h3>
                  <p style={{ fontSize: "14px", color: "#6c757d", margin: 0 }}>
                    Changes made here update your business hours and Terms &amp; Conditions note across the website in real time.
                  </p>
                </div>

                {hoursSavedSuccess && (
                  <div style={{ padding: "12px 16px", borderRadius: "8px", background: "#e8f5e9", border: "1px solid #c8e6c9", color: "#2e7d32", fontSize: "14px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={18} /> Site settings updated &amp; saved to Supabase successfully!
                  </div>
                )}

                <form onSubmit={handleSaveOpeningHours}>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#333", marginBottom: "8px" }}>
                      Opening Hours Display Text
                    </label>
                    <div style={{ position: "relative" }}>
                      <Clock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#adb5bd" }} />
                      <input
                        type="text"
                        placeholder="e.g. 8:00 AM to 5:00 PM (Monday to Friday)"
                        value={openingHoursInput}
                        onChange={(e) => setOpeningHoursInput(e.target.value)}
                        required
                        style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "8px", border: "1px solid #ced4da", fontSize: "15px", fontWeight: "600", color: "#111" }}
                      />
                    </div>
                    <span style={{ fontSize: "12px", color: "#6c757d", marginTop: "6px", display: "block" }}>
                      Default: 8:00 AM to 5:00 PM (Monday to Friday)
                    </span>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#333", marginBottom: "8px" }}>
                      Terms &amp; Conditions Note Display Text
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Write Terms &amp; Conditions note..."
                      value={termsConditionsInput}
                      onChange={(e) => setTermsConditionsInput(e.target.value)}
                      required
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #ced4da", fontSize: "14px", fontWeight: "500", color: "#111", resize: "vertical" }}
                    />
                    <span style={{ fontSize: "12px", color: "#6c757d", marginTop: "6px", display: "block" }}>
                      Appears inside form callouts and terms notices across the website.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={savingHours}
                    style={{ padding: "12px 24px", background: "#ed1c24", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "15px", cursor: savingHours ? "wait" : "pointer", opacity: savingHours ? 0.7 : 1 }}
                  >
                    {savingHours ? "Saving Settings to Supabase..." : "Save Site Settings"}
                  </button>
                </form>
              </div>
            ) : activeTab === "mechanic" || activeTab === "rental" ? (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e9ecef", color: "#495057" }}>
                    <th style={{ padding: "14px 20px" }}>Customer</th>
                    <th style={{ padding: "14px 20px" }}>Phone &amp; Email</th>
                    <th style={{ padding: "14px 20px" }}>Suburb</th>
                    <th style={{ padding: "14px 20px" }}>Service Requested</th>
                    <th style={{ padding: "14px 20px" }}>Date</th>
                    <th style={{ padding: "14px 20px" }}>Status</th>
                    <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === "mechanic" ? filteredMechanicEnquiries : filteredRentalEnquiries).length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#6c757d" }}>
                        {activeTab === "mechanic" ? "No mechanic quote enquiries found." : "No rent a car enquiries found."}
                      </td>
                    </tr>
                  ) : (
                    (activeTab === "mechanic" ? filteredMechanicEnquiries : filteredRentalEnquiries).map((item) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #f1f3f5" }}>
                        <td style={{ padding: "16px 20px", fontWeight: "700", color: "#111" }}>{item.name}</td>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <a href={`tel:${item.phone.replace(/\s+/g, "")}`} style={{ color: "#ed1c24", textDecoration: "none", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <Phone size={13} /> {item.phone}
                            </a>
                            <a href={`mailto:${item.email}`} style={{ color: "#6c757d", textDecoration: "none", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <Mail size={13} /> {item.email}
                            </a>
                          </div>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ padding: "4px 10px", background: "#f8f9fa", border: "1px solid #e9ecef", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: "#333" }}>
                            {item.suburb || "N/A"}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ padding: "4px 10px", background: activeTab === "rental" ? "#e0f2fe" : "#f1f3f5", color: activeTab === "rental" ? "#0284c7" : "#333", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}>
                            {item.service}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", color: "#6c757d", fontSize: "13px" }}>
                          {new Date(item.createdAt).toLocaleDateString("en-AU", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              background: item.status === "new" ? "#fff3cd" : item.status === "contacted" ? "#e0f2fe" : "#e8f5e9",
                              color: item.status === "new" ? "#856404" : item.status === "contacted" ? "#0284c7" : "#2e7d32",
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                            <button
                              onClick={() => setSelectedMessage(item)}
                              title="View Message"
                              style={{ padding: "6px 10px", background: "#f1f3f5", border: "none", borderRadius: "6px", cursor: "pointer", color: "#333" }}
                            >
                              <Eye size={15} />
                            </button>

                            {item.status === "new" && (
                              <button
                                onClick={() => handleUpdateStatus(item.id, "contacted")}
                                style={{ padding: "6px 10px", background: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                              >
                                Mark Contacted
                              </button>
                            )}

                            {item.status === "contacted" && (
                              <button
                                onClick={() => handleUpdateStatus(item.id, "completed")}
                                style={{ padding: "6px 10px", background: "#2e7d32", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                              >
                                Mark Done
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteLead(item.id, "enquiry")}
                              title="Delete Lead"
                              style={{ padding: "6px 10px", background: "#fee2e2", color: "#ed1c24", border: "none", borderRadius: "6px", cursor: "pointer" }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e9ecef", color: "#495057" }}>
                    <th style={{ padding: "14px 20px" }}>Subscriber Email</th>
                    <th style={{ padding: "14px 20px" }}>Subscribed Date</th>
                    <th style={{ padding: "14px 20px" }}>Status</th>
                    <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNewsletters.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#6c757d" }}>
                        No newsletter subscribers found.
                      </td>
                    </tr>
                  ) : (
                    filteredNewsletters.map((item) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #f1f3f5" }}>
                        <td style={{ padding: "16px 20px", fontWeight: "700", color: "#111" }}>
                          <a href={`mailto:${item.email}`} style={{ color: "#ed1c24", textDecoration: "none" }}>
                            {item.email}
                          </a>
                        </td>
                        <td style={{ padding: "16px 20px", color: "#6c757d", fontSize: "13px" }}>
                          {new Date(item.createdAt).toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ padding: "4px 10px", background: "#e8f5e9", color: "#2e7d32", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                            Subscribed
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                          <button
                            onClick={() => handleDeleteLead(item.id, "newsletter")}
                            title="Delete Subscriber"
                            style={{ padding: "6px 10px", background: "#fee2e2", color: "#ed1c24", border: "none", borderRadius: "6px", cursor: "pointer" }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "grid", placeItems: "center", padding: "20px", zIndex: 1000 }}>
          <div style={{ maxWidth: "560px", width: "100%", background: "#fff", padding: "28px", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800" }}>Enquiry Details</h3>
              <button onClick={() => setSelectedMessage(null)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6c757d" }}>
                ✕
              </button>
            </div>

            <div style={{ background: "#f8f9fa", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
              <p style={{ margin: "0 0 6px 0" }}><strong>Customer:</strong> {selectedMessage.name}</p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Phone:</strong> <a href={`tel:${selectedMessage.phone}`} style={{ color: "#ed1c24" }}>{selectedMessage.phone}</a></p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Email:</strong> <a href={`mailto:${selectedMessage.email}`} style={{ color: "#ed1c24" }}>{selectedMessage.email}</a></p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Suburb:</strong> {selectedMessage.suburb || "N/A"}</p>
              <p style={{ margin: 0 }}><strong>Service:</strong> {selectedMessage.service}</p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#495057", marginBottom: "6px" }}>Customer Message:</label>
              <div style={{ padding: "14px", background: "#fff", border: "1px solid #ced4da", borderRadius: "8px", fontSize: "14px", color: "#333", whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                {selectedMessage.message}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setSelectedMessage(null)} style={{ padding: "10px 18px", background: "#111", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
