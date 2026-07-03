import { cn } from "@/lib/utils"

const BedMark = ({ size = 18, color = "#C9A24B" }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={Math.round(size * 0.88)}
    viewBox="0 0 110 100"
    fill="none"
    stroke={color}
    strokeWidth="7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 52 L22 38 C22 30 30 26 40 26 L70 26 C80 26 88 30 88 38 L88 52" />
    <path d="M40 33 L40 48" />
    <path d="M55 33 L55 48" />
    <path d="M70 33 L70 48" />
    <path d="M14 52 L96 52 C99 52 100 54 100 57 L100 62 L10 62 L10 57 C10 54 11 52 14 52 Z" />
    <path d="M16 62 L16 70" />
    <path d="M94 62 L94 70" />
  </svg>
)

interface LogoProps {
  variant?: "compact" | "stacked" | "symbol-only"
  on?: "forest" | "white"
  className?: string
}

export function Logo({ variant = "compact", on = "forest", className }: LogoProps) {
  const isOnForest = on === "forest"
  const wordmarkColor = isOnForest ? "#F2EEE6" : "#16352A"
  const goldColor = "#C9A24B"
  const ringColor = goldColor
  const bedColor = goldColor

  if (variant === "symbol-only") {
    return (
      <div
        className={cn("inline-flex items-center justify-center rounded-full border", className)}
        style={{ borderColor: ringColor, width: 30, height: 30 }}
        aria-label="Yousuf Living"
      >
        <BedMark size={18} color={bedColor} />
      </div>
    )
  }

  if (variant === "stacked") {
    return (
      <div className={cn("inline-flex flex-col items-center", className)} aria-label="Yousuf Living">
        <BedMark size={40} color={bedColor} />
        <div className="mt-3 text-center" style={{ lineHeight: 1 }}>
          <div
            className="font-heading font-black"
            style={{ fontSize: 42, letterSpacing: "-1.2px", color: wordmarkColor }}
          >
            YOUSUF
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-px flex-1" style={{ background: goldColor }} />
            <div
              className="rounded-full"
              style={{ width: 4, height: 4, background: goldColor }}
            />
            <div className="h-px flex-1" style={{ background: goldColor }} />
          </div>
          <div
            className="font-heading font-semibold mt-2"
            style={{ fontSize: 15, letterSpacing: "14px", color: goldColor }}
          >
            LIVING
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("inline-flex items-center gap-2.5", className)} aria-label="Yousuf Living">
      <div
        className="inline-flex shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: ringColor, width: 30, height: 30 }}
      >
        <BedMark size={18} color={bedColor} />
      </div>
      <div style={{ lineHeight: 1 }}>
        <div
          className="font-heading font-black"
          style={{ fontSize: 14, letterSpacing: "-0.2px", color: wordmarkColor }}
        >
          YOUSUF
        </div>
        <div
          className="font-heading font-semibold mt-0.5"
          style={{ fontSize: 6.5, letterSpacing: "5px", color: goldColor }}
        >
          LIVING
        </div>
      </div>
    </div>
  )
}

export function LogoFooter({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)} aria-label="Yousuf Living">
      <div
        className="inline-flex shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: "#C9A24B", width: 34, height: 34 }}
      >
        <BedMark size={20} color="#C9A24B" />
      </div>
      <div style={{ lineHeight: 1 }}>
        <div className="font-heading font-black" style={{ fontSize: 16, color: "#F2EEE6" }}>
          YOUSUF
        </div>
        <div
          className="font-heading font-semibold mt-0.5"
          style={{ fontSize: 7.5, letterSpacing: "6px", color: "#C9A24B" }}
        >
          LIVING
        </div>
      </div>
    </div>
  )
}
