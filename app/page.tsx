import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"

export default async function RootPage() {
  const session = await auth()
  
  if (session) {
    redirect("/home")
  }
  
  redirect("/auth/login")
}
