"use client"

import { useEffect, useRef } from "react"

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.dataset.visible = "true"
          observer.unobserve(node)
        }
      },
      { threshold: 0.16 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={[
        "translate-y-3 opacity-0 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  )
}