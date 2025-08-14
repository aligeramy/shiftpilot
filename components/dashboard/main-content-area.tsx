"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

interface MainContentAreaProps {
  children?: ReactNode
  title?: string
  subtitle?: string
}

export function MainContentArea({ 
  children, 
  title = "Welcome to ShiftPilot!",
  subtitle = "Your radiology scheduling management system is ready to use."
}: MainContentAreaProps) {
  return (
    <motion.div 
      className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: 0.2,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children || (
        <div className="text-center">
          <motion.h2 
            className="text-2xl font-semibold text-foreground mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            key={title} // Animate when title changes
          >
            {title}
          </motion.h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            key={subtitle} // Animate when subtitle changes
          >
            {subtitle}
          </motion.p>
        </div>
      )}
    </motion.div>
  )
}