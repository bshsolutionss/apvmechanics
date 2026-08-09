import Image from "next/image";
import Link from "next/link";
import { ChevronsRight, LucideIcon } from "lucide-react";

const ASSET_PREFIX = "/assets/images";

export interface ServiceRowCardProps {
  title: string;
  description: string;
  image: string;
  icon?: LucideIcon;
  index: number;
  slug?: string;
  compactTitle?: boolean;
  hideDescription?: boolean;
}

export function ServiceRowCard({
  title,
  description,
  image,
  icon: Icon,
  index,
  slug,
  compactTitle = false,
  hideDescription = false,
}: ServiceRowCardProps) {
  const formattedNumber = String(index + 1).padStart(2, "0");
  const href = slug ? `/${slug}` : "/services";
  const imagePath = image.startsWith("/") ? image : `${ASSET_PREFIX}/services/${image}`;
  const isCompact = compactTitle || title.length > 25;

  return (
    <article
      className={`service-row${hideDescription ? " service-row--no-description" : ""}`}
      data-reveal-delay={index * 110}
    >
      <div className={`service-row__main ${isCompact ? "service-row__main--compact" : ""}`}>
        {Icon && (
          <i className="service-row__icon">
            <Icon />
          </i>
        )}
        <div className={`service-row__title ${isCompact ? "service-row__title--compact" : ""}`}>
          <span className="service-row__number">{formattedNumber} /</span>
          <h3>{title}</h3>
        </div>
      </div>
      {!hideDescription && <p>{description}</p>}
      <Link href={href} aria-label={`View details for ${title}`}>
        <span>View Details</span>
        <ChevronsRight />
      </Link>
      <div className="service-row__image">
        <Image src={imagePath} alt="" fill sizes="240px" />
      </div>
    </article>
  );
}
