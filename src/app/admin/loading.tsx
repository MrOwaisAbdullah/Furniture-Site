// Catches the initial load of the (protected) layout's own async session
// check — a loading.tsx only wraps its sibling page.tsx, not a layout at
// the same segment, so without this the suspension bubbles up to the root
// loading.tsx (the homepage hero skeleton) on first admin page load.
export default function AdminSectionLoading() {
  return (
    <div className="flex h-screen" style={{ background: "#EEEAE1" }}>
      <div className="hidden lg:block" style={{ width: 248, background: "#12281F" }} />
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-forest/20 border-t-forest" />
          <span className="font-mono text-[11px] uppercase tracking-[2px] text-sage">Loading admin</span>
        </div>
      </div>
    </div>
  )
}
