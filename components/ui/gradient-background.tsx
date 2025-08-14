import { ReactNode } from "react"

interface GradientBackgroundProps {
  children: ReactNode
}

export function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-brand-main to-brand-light p-4">
      {children}
    </div>
  )
}