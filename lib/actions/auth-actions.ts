"use server"

import { signOut, auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { put, del } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function signOutAction() {
  await signOut({ redirectTo: "/auth/login" })
}

export async function uploadProfileImage(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const file = formData.get("file") as File | null
  if (!file) return { error: "No file provided" }

  const blob = await put(`avatars/${session.user.id}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    allowOverwrite: true,
  })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: blob.url },
  })

  revalidatePath("/home/profile")
  return { url: blob.url }
}

export async function removeProfileImage() {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.image) {
    try {
      await del(user.image, { token: process.env.BLOB_READ_WRITE_TOKEN })
    } catch {}
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: null },
  })

  revalidatePath("/home/profile")
  return { success: true }
}