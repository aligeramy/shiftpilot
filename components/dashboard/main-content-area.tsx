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
      className="flex-1 min-h-[400px] flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: 0.2,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children || (
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <motion.h2 
              className="text-3xl font-bold text-slate-800 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              key={title} // Animate when title changes
            >
              {title}
            </motion.h2>
            <motion.p 
              className="text-slate-600 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              key={subtitle} // Animate when subtitle changes
            >
              {subtitle}
            </motion.p>
          </div>

          {/* MVP Demo Navigation Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <motion.a
              href="/preferences" 
              className="group bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div className="text-center space-y-3">
                <div className="text-4xl">👥</div>
                <h3 className="text-xl font-semibold text-slate-800">Vacation Preferences</h3>
                <p className="text-slate-600 text-sm">Manage vacation preferences for all 39 radiologists. Auto-generate or manually set preferences.</p>
                <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700">View Preferences →</div>
              </div>
            </motion.a>

            <motion.a
              href="/schedule" 
              className="group bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <div className="text-center space-y-3">
                <div className="text-4xl">📅</div>
                <h3 className="text-xl font-semibold text-slate-800">Schedule Calendar</h3>
                <p className="text-slate-600 text-sm">View generated schedules with interactive FullCalendar. 529 shifts with 100% coverage!</p>
                <div className="text-green-600 text-sm font-medium group-hover:text-green-700">View Schedule →</div>
              </div>
            </motion.a>
          </div>

          {/* MVP Status */}
          <div className="bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">🎉 MVP Demo Status</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-700">✅ 39 Real radiologists with realistic FTE</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-700">✅ 7 Subspecialties (NEURO, MSK, BODY, IR, etc.)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-700">✅ 23 Shift types with complex eligibility</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-700">✅ 529 Monthly shifts with 100% coverage</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-700">✅ Interactive vacation preference system</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-700">✅ Professional FullCalendar integration</span>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">🚀 Quick Start Guide</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center font-semibold">1</div>
                <div>
                  <h4 className="font-medium text-slate-800">Generate Vacation Preferences</h4>
                  <p className="text-slate-600 text-sm">Go to <strong>Vacation Preferences</strong> and click &quot;🎲 Auto-Generate All Preferences&quot; to create vacation picks for all 39 radiologists.</p>
                </div>  
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white text-sm rounded-full flex items-center justify-center font-semibold">2</div>
                <div>
                  <h4 className="font-medium text-slate-800">View Generated Schedule</h4>
                  <p className="text-slate-600 text-sm">Go to <strong>Schedule Calendar</strong> to see the interactive calendar with all 529 shift assignments, color-coded by subspecialty.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white text-sm rounded-full flex items-center justify-center font-semibold">3</div>
                <div>
                  <h4 className="font-medium text-slate-800">Test Filtering & Interaction</h4>
                  <p className="text-slate-600 text-sm">Use the filters to show specific subspecialties or individual radiologists. Click events to see details.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">⚙️ Technical Implementation</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Backend</h4>
                <ul className="text-slate-600 text-sm space-y-1">
                  <li>• Next.js 15 API routes</li>
                  <li>• PostgreSQL with Prisma ORM</li>
                  <li>• Constraint programming engine</li>
                  <li>• 100% schedule coverage algorithm</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Frontend</h4>
                <ul className="text-slate-600 text-sm space-y-1">
                  <li>• React with TypeScript</li>
                  <li>• FullCalendar.js integration</li>
                  <li>• Glassmorphic UI design</li>
                  <li>• Real-time preference management</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-slate-500 text-sm py-8">
            ShiftPilot MVP Demo - Radiology Scheduling Platform<br/>
            Built with Next.js 15, PostgreSQL, and FullCalendar.js
          </div>
        </div>
      )}
    </motion.div>
  )
}