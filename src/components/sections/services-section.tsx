import { Droplets, Fan, Gauge, Headphones, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { ServiceRowCard } from "@/components/cards/service-row-card";

const services = [
  {
    title: "Engine Diagnostics & Fault Finding",
    description: "Accurate fault finding with modern diagnostic tools.",
    image: "services-1-4.jpg",
    icon: Gauge,
  },
  {
    title: "Oil Change & Lubrication",
    description: "Premium oil and lubrication for smoother performance.",
    image: "services-oil-change-fresh.jpg",
    icon: Droplets,
  },
  {
    title: "General Repairs & Servicing",
    description: "Dependable repairs and scheduled vehicle servicing.",
    image: "services-1-2.jpg",
    icon: Wrench,
  },
  {
    title: "Cooling System Repairs",
    description: "Cooling-system checks, leak repairs and maintenance.",
    image: "services-1-5.jpg",
    icon: Fan,
  },
  {
    title: "24/7 Mobile Service",
    description: "Fast mechanical support delivered to your location.",
    image: "services-1-1.jpg",
    icon: Headphones,
  },
];

export function ServicesSection() {
  return (
    <section className="section services services-reference" id="services">
      <div className="container">
        <SectionHeading eyebrow="WHAT WE OFFER" title={<>Comprehensive Car Solutions</>} center />
        <div className="service-list">
          {services.map(({ title, description, image, icon }, index) => (
            <ServiceRowCard
              key={title}
              title={title}
              description={description}
              image={image}
              icon={icon}
              index={index}
              hideDescription
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export const Services = ServicesSection;
