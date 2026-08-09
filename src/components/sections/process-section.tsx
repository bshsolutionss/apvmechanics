import { CircleGauge, Gauge, SearchCheck, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { ProcessStepCard } from "@/components/cards/process-step-card";

const processItems = [
  { num: "01", title: "Quick & Trusted Repairs", icon: SearchCheck, desc: "We diagnose fast and accurately, getting you back on the road with confidence." },
  { num: "02", title: "Performance Perfected", icon: Gauge, desc: "Every system is tuned and tested to manufacturer spec for peak performance." },
  { num: "03", title: "Premium Care Experience", icon: Wrench, desc: "Professional workmanship with clear communication at every stage of the repair." },
  { num: "04", title: "Attention To Detail", icon: CircleGauge, desc: "A thorough finish on every vehicle we touch, because detail matters." },
];

export function ProcessSection({ id = "pages" }: { id?: string }) {
  return (
    <section className="section process process-reference" id={id}>
      <div className="container">
        <SectionHeading eyebrow="OUR WORK PROCESS" title={<>Step-by-Step Car Repair Process</>} animatedText="Step-by-Step Car Repair Process" center />
        <div className="process-grid">
          {processItems.map(({ num, title, icon, desc }, index) => (
            <ProcessStepCard
              key={num}
              number={num}
              title={title}
              description={desc}
              icon={icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export const Process = ProcessSection;
