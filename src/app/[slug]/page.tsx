import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailsContent } from "@/features/services";
import { services } from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (service) {
    return {
      title: service.metaTitle,
      description: service.metaDescription,
    };
  }
  const title = slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  return { title: `${title} | APV Mobile Mechanics` };
}

export default async function ServiceRoute({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (service) {
    return <ServiceDetailsContent slug={slug} />;
  }
  notFound();
}

