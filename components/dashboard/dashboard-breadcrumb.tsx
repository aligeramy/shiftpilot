"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface DashboardBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function DashboardBreadcrumb({ items }: DashboardBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0
          
          return (
            <div key={index} className="flex items-center gap-2">
              <BreadcrumbItem className={isFirst ? "hidden md:block" : ""}>
                {isLast ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={item.label} // Only the last item animates
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ 
                        duration: 0.2,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                    >
                      <BreadcrumbPage>
                        {item.label}
                      </BreadcrumbPage>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  // Static items don't animate - just use regular div
                  <BreadcrumbLink asChild className="transition-colors hover:text-foreground">
                    <Link href={item.href!}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className={isFirst ? "hidden md:block" : ""} />
              )}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}