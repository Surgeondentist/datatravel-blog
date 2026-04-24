import Image from "next/image";

/** Visible heights (transparent PNG; no background box). */
const sizeClass = {
  sm: "h-9 w-auto max-w-[180px] sm:h-10 sm:max-w-[200px]",
  md: "h-10 w-auto max-w-[220px] sm:h-11 sm:max-w-[260px]",
  lg: "h-16 w-auto max-w-[min(92vw,340px)] sm:h-20 sm:max-w-[400px] md:h-24 md:max-w-[460px]",
} as const;

type BrandLogoProps = {
  size?: keyof typeof sizeClass;
  className?: string;
  priority?: boolean;
};

/** Brand logo (`/redshell-logo.png`, transparent PNG). */
export default function BrandLogo({ size = "md", className = "", priority = false }: BrandLogoProps) {
  return (
    <span className={`inline-flex shrink-0 items-center ${className}`}>
      <Image
        src="/redshell-logo.png"
        alt="Redshell — Turn on cybersecurity"
        width={1024}
        height={724}
        className={`${sizeClass[size]} object-contain object-left`}
        sizes="(max-width: 640px) 200px, (max-width: 1024px) 280px, 460px"
        priority={priority}
      />
    </span>
  );
}
