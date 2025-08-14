"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { OrganizationOverview } from "./organization-overview"

interface MainContentAreaProps {
  children?: ReactNode
  title?: string
  subtitle?: string
}

export function MainContentArea({ 
  children
}: MainContentAreaProps) {
  return (
    <motion.div 
      className="flex-1 min-h-[400px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: 0.2,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children || <OrganizationOverview />}
    </motion.div>
  )
}