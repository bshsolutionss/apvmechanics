import type { Metadata } from "next";

// admin/page.tsx is a client component ("use client"), so it can't export
// `metadata` itself — this layout carries the noindex directive instead.
// robots.txt already disallows /admin/, this is defense-in-depth so the
// panel never appears in search results even if a crawler ignores that.
export const metadata: Metadata = {
  title: "Admin Portal | APV Mobile Mechanics",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
