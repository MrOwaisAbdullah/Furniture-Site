// Plain (non "use client") module so both server components (e.g. the
// dashboard's status chart) and client components (kanban/table views) can
// import this constant directly — a Server Component importing a data
// export from a "use client" module doesn't reliably cross that boundary.
export const ORDER_PIPELINE = [
  { key: "payment_pending",   label: "Pending Payment" },
  { key: "payment_confirmed", label: "Payment Confirmed" },
  { key: "building",          label: "Workshop Building" },
  { key: "polishing",         label: "Polishing / Deco" },
  { key: "finishing",         label: "Final Finishing" },
  { key: "ready",             label: "Ready for Delivery" },
  { key: "delivered",         label: "Delivered" },
]
