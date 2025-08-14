"use client"

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"
import { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

interface ProvidersProps {
  children: ReactNode
  session: Session | null
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session}>
        {children}
        <Toaster />
      </SessionProvider>
    </ThemeProvider>
  )
}
