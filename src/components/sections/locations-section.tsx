import { Mail, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { LocationCard } from "@/components/cards/location-card";
import { EMAIL, GOOGLE_MAPS_EMBED, GOOGLE_MAPS_URL, PHONE } from "@/constants";

export function LocationsSection() {
  return (
    <section className="section locations" id="location">
      <div className="container">
        <SectionHeading light eyebrow="OUR LOCATION" title={<>Find <em>APV Mobile Mechanics</em></>} center />
        <div className="location-info-strip">
          <LocationCard
            variant="dark"
            icon={MapPin}
            label="Service Area / Location"
            value="We Come To You"
            href={GOOGLE_MAPS_URL}
          />
          <LocationCard
            variant="dark"
            icon={Phone}
            label="Call Anytime"
            value={PHONE}
            href={`tel:${PHONE.replace(/\s+/g, "")}`}
          />
          <LocationCard
            variant="dark"
            icon={Mail}
            label="Email Us"
            value={EMAIL}
            href={`mailto:${EMAIL}`}
          />
        </div>
        <div className="location-map-embed">
          <iframe
            title="APV Mobile Mechanics location"
            src={GOOGLE_MAPS_EMBED}
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

export const Locations = LocationsSection;
