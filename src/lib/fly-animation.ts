export function flyToTarget(
  fromEl: HTMLElement,
  targetSelector: string,
  color = "#C9A24B",
  onLand?: () => void
) {
  if (typeof window === "undefined") return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onLand?.()
    return
  }

  const targetEl = document.querySelector<HTMLElement>(targetSelector)
  if (!targetEl) {
    onLand?.()
    return
  }

  const fromRect = fromEl.getBoundingClientRect()
  const toRect = targetEl.getBoundingClientRect()

  const fx = fromRect.left + fromRect.width / 2
  const fy = fromRect.top + fromRect.height / 2
  const tx = toRect.left + toRect.width / 2
  const ty = toRect.top + toRect.height / 2

  const dx = tx - fx
  const dy = ty - fy

  // Peak 70px above the TARGET — ball overshoots, then falls into the basket
  const peakDy = ty - 70 - fy

  // Midpoint during fall
  const midFallDy = peakDy + (dy - peakDy) * 0.55

  const dot = document.createElement("div")
  Object.assign(dot.style, {
    position: "fixed",
    left: `${fx}px`,
    top: `${fy}px`,
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: color,
    boxShadow: `0 3px 10px ${color}80`,
    zIndex: "9999",
    pointerEvents: "none",
    willChange: "transform, opacity",
  })
  document.body.appendChild(dot)

  dot.animate(
    [
      { transform: "translate(-50%,-50%) scale(1)", opacity: "1", offset: 0 },
      {
        transform: `translate(calc(-50% + ${dx * 0.3}px), calc(-50% + ${peakDy * 0.55}px)) scale(0.95)`,
        opacity: "1",
        offset: 0.28,
      },
      {
        transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${peakDy}px)) scale(0.85)`,
        opacity: "1",
        offset: 0.48,
      },
      {
        transform: `translate(calc(-50% + ${dx * 0.78}px), calc(-50% + ${midFallDy}px)) scale(0.55)`,
        opacity: "0.85",
        offset: 0.77,
      },
      {
        transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.1)`,
        opacity: "0",
        offset: 1,
      },
    ],
    { duration: 560, easing: "linear", fill: "forwards" }
  ).onfinish = () => {
    dot.remove()

    // Bounce the target icon (basket receives the ball)
    const freshTarget = document.querySelector<HTMLElement>(targetSelector)
    freshTarget?.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.35)" },
        { transform: "scale(0.85)" },
        { transform: "scale(1.12)" },
        { transform: "scale(1)" },
      ],
      { duration: 380, easing: "ease-out" }
    )

    onLand?.()
  }
}
