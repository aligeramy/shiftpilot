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
      className={`bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg aspect-video flex items-center justify-center hover:shadow-xl transition-shadow ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      <div className="text-center p-4">
        {icon && (
          <motion.div 
            className="mb-3 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        <motion.h3 
          className="font-semibold text-lg tracking-tight text-slate-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.2 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-2xl font-bold text-slate-900 mt-2"
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