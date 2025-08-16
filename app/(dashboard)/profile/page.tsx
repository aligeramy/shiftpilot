import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/db"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const session = await auth()
  const user = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null

  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: "Dashboard", href: "/home" },
        { label: "Profile" },
      ]}
    >
      <ProfileForm
        name={user?.name ?? ""}
        email={user?.email ?? ""}
        imageUrl={user?.image ?? undefined}
      />
    </DashboardPage>
  )
}


