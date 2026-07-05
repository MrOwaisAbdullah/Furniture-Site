import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/30 bg-gold/10">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A24B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>

      <h1 className="mt-5 font-heading font-black text-ink" style={{ fontSize: "24px" }}>
        You&apos;re offline
      </h1>

      <p className="mt-2 max-w-sm text-[14px] leading-[1.6] text-slate">
        Check your internet connection and try again. Some pages may still be available from your cache.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-6 rounded-[10px] bg-forest px-6 py-3 font-heading font-bold text-[14px] text-bone transition-colors hover:bg-forest-700"
      >
        Try again
      </button>

      <Link
        href="/"
        className="mt-3 font-heading font-bold text-[13px] text-gold-700 transition-colors hover:text-forest"
      >
        Go to homepage
      </Link>
    </div>
  )
}
