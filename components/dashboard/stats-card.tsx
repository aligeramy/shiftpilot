"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

interface StatsCardProps {
  title: string
  value: string | number
  className?: string
  icon?: ReactNode
}

export function StatsCard({ title, value, className = "", icon }: StatsCardProps) {
  return (
    <motion.div 
      className={`bg-muted/10 aspect-video rounded-xl flex items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      <div className="text-center">
        {icon && (
          <motion.div 
            className="mb-2 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        <motion.h3 
          className="font-semibold text-2xl tracking-tight "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.2 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-md text-f  border mt-2 ring-1 ring-foreground/10 inline-block px-4 rounded-full py-0.5"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          key={value} // This will animate when value changes
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  )
}