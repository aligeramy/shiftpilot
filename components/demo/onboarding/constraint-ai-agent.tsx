"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, Loader2, CheckCircle2, User, Bot } from "lucide-react"

interface Message {
  role: 'user' | 'assistant'
  content: string
  constraint?: {
    id: string
    type: 'coverage' | 'fairness' | 'eligibility' | 'custom'
    title: string
    description: string
    formula?: string
  }
}

const exampleRequests = [
  "No radiologist should work more than 2 weekend calls per month",
  "NEURO radiologists should have balanced distribution of late shifts",
  "Ensure at least 3 BODY radiologists are available during weekdays",
  "Limit consecutive night shifts to maximum 3 in a row"
]

export function ConstraintAIAgent({ onConstraintAdded }: { onConstraintAdded: (constraint: any) => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [currentRequest, setCurrentRequest] = useState("")

  const simulateAIResponse = async (userRequest: string) => {
    setIsThinking(true)
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 2000))

    let constraint
    let response = ""

    // Parse the request and create appropriate constraint
    if (userRequest.toLowerCase().includes('weekend call')) {
      constraint = {
        id: `c${Date.now()}`,
        type: 'coverage' as const,
        title: '≤2 Weekend Calls per month',
        description: 'Maximum 2 weekend call shifts per radiologist per month',
        formula: 'count(WEEKEND_CALL, user, month) ≤ 2',
        active: true,
        category: 'Coverage Guardrails'
      }
      response = "I've created a coverage constraint that limits weekend call assignments to 2 per radiologist per month. This ensures fair distribution of weekend coverage across the team."
    } else if (userRequest.toLowerCase().includes('late shift')) {
      constraint = {
        id: `c${Date.now()}`,
        type: 'fairness' as const,
        title: 'Balanced late shift distribution',
        description: 'NEURO late shifts distributed evenly among NEURO radiologists',
        formula: 'balance(NEURO_LATE_SHIFTS, NEURO_POOL) variance ≤ 2',
        active: true,
        category: 'Fairness Ledger'
      }
      response = "I've created a fairness constraint that ensures late shifts for NEURO radiologists are distributed evenly. The variance between assignments will be kept within 2 shifts per month."
    } else if (userRequest.toLowerCase().includes('body radiologists')) {
      constraint = {
        id: `c${Date.now()}`,
        type: 'coverage' as const,
        title: '≥3 BODY rads weekday availability',
        description: 'Minimum 3 BODY radiologists available during weekdays',
        formula: 'available(BODY, weekday) ≥ 3',
        active: true,
        category: 'Coverage Guardrails'
      }
      response = "I've created a coverage constraint ensuring at least 3 BODY subspecialty radiologists are available on weekdays. This maintains adequate coverage for body imaging services."
    } else {
      constraint = {
        id: `c${Date.now()}`,
        type: 'custom' as const,
        title: '≤3 Consecutive night shifts',
        description: 'Maximum 3 consecutive night shifts to prevent burnout',
        formula: 'consecutive(NIGHT_SHIFTS, user) ≤ 3',
        active: true,
        category: 'Coverage Guardrails'
      }
      response = "I've created a custom constraint limiting consecutive night shifts to a maximum of 3. This helps prevent radiologist burnout while maintaining coverage."
    }

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response,
      constraint
    }])

    setIsThinking(false)

    // Add constraint after brief delay
    setTimeout(() => {
      onConstraintAdded(constraint)
    }, 500)
  }

  const handleSendMessage = async () => {
    if (!currentRequest.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: currentRequest
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentRequest("")
    
    await simulateAIResponse(currentRequest)
  }

  const useExampleRequest = async (request: string) => {
    const userMessage: Message = {
      role: 'user',
      content: request
    }

    setMessages(prev => [...prev, userMessage])
    await simulateAIResponse(request)
  }

  return (
    <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#007bff]" />
          AI Rule Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Example Prompts */}
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Try these example requests:</p>
            <div className="grid gap-2">
              {exampleRequests.map((request, index) => (
                <motion.button
                  key={request}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => useExampleRequest(request)}
                  className="text-left p-3 rounded-lg border border-[#c9e7f6] dark:border-[#007bff]/40 bg-[#c9e7f6]/10 dark:bg-[#007bff]/5 hover:bg-[#c9e7f6]/30 dark:hover:bg-[#007bff]/10 transition-colors text-sm"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-[#007bff] flex-shrink-0 mt-0.5" />
                    <span>{request}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation */}
        {messages.length > 0 && (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#007bff] to-[#65c1f4] flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`flex-1 max-w-[80%] space-y-2`}>
                    <div className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-[#007bff] text-white ml-auto'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    
                    {message.constraint && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">
                              {message.constraint.title}
                            </p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                              {message.constraint.description}
                            </p>
                          </div>
                          <Badge className="bg-emerald-500 text-white text-xs">
                            Added
                          </Badge>
                        </div>
                        {message.constraint.formula && (
                          <div className="rounded bg-slate-900 dark:bg-slate-950 p-2 mt-2">
                            <p className="text-xs font-mono text-emerald-400">
                              {message.constraint.formula}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#007bff] to-[#65c1f4] flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#007bff]" />
                    <p className="text-sm text-muted-foreground">Analyzing request and creating constraint...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Input */}
        {messages.length > 0 && (
          <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <input
              type="text"
              placeholder="Describe your constraint rule..."
              value={currentRequest}
              onChange={(e) => setCurrentRequest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isThinking) {
                  handleSendMessage()
                }
              }}
              disabled={isThinking}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#007bff] disabled:opacity-50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isThinking || !currentRequest.trim()}
              size="sm"
              className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] hover:from-[#0069d9] hover:to-[#5ab8f0]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

