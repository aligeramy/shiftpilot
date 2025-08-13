import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tighter text-gray-900 dark:text-white">
              ShiftPilot
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <ThemeToggle />
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/auth/login" })
                }}
              >
                <Button type="submit" variant="outline">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Welcome to your dashboard!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This is where your radiology scheduling system will live.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
