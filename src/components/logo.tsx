import Link from "next/link";

// Rwad Room leaf-mark logo — SVG recreation from brand guide
function RwadMark({ size = 32, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Leaf shape — rounded square with top-left organic curve */}
      <path
        d="M10 60C10 26.9 26.9 10 60 10H100C104.4 10 108 13.6 108 18V60C108 93.1 91.1 110 58 110H18C13.6 110 10 106.4 10 102V60Z"
        fill={color}
      />
      {/* Lowercase "r" letterform */}
      <path
        d="M52 82V58.5C52 52.5 55.5 48 62.5 48C64.5 48 66 48.3 67.5 49L67 56C65.8 55.3 64.2 55 62.5 55C58 55 56 58 56 62V82H52Z"
        fill="white"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="55" cy="42" r="4" fill="white" />
    </svg>
  );
}

function RwadWordmark({ height = 20, color = "currentColor" }: { height?: number; color?: string }) {
  const aspect = 3.2;
  return (
    <svg width={height * aspect} height={height} viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="78" fontFamily="'DM Sans', sans-serif" fontWeight="800" fontSize="82" letterSpacing="-2" fill={color}>
        RWAD
      </text>
    </svg>
  );
}

export function Logo({
  className,
  width = 160,
  variant = "full",
  color,
}: {
  className?: string;
  width?: number;
  variant?: "full" | "mark" | "wordmark";
  color?: string;
}) {
  const markSize = variant === "mark" ? width : Math.round(width * 0.22);
  const resolvedColor = color || "#1A3FC4";

  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className || ""}`}>
      {variant !== "wordmark" && <RwadMark size={markSize} color={resolvedColor} />}
      {variant !== "mark" && (
        <span
          style={{ color: resolvedColor, fontSize: markSize * 0.65, lineHeight: 1 }}
          className="font-extrabold tracking-tight leading-none"
        >
          RWAD<br />
          <span className="text-[0.72em]">ROOM</span>
        </span>
      )}
    </Link>
  );
}