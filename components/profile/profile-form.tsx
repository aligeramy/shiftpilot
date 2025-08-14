"use client"

import { useState, useEffect } from "react"
import { uploadProfileImage, removeProfileImage } from "@/lib/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { compressImage, formatFileSize } from "@/lib/image-utils"
import { toast } from "sonner"

export function ProfileForm({
  name,
  email,
  imageUrl,
}: {
  name: string
  email: string
  imageUrl?: string
}) {
  const [preview, setPreview] = useState<string | undefined>(imageUrl)
  const [isLoading, setIsLoading] = useState(false)

  // Sync preview with imageUrl prop changes
  useEffect(() => {
    setPreview(imageUrl)
  }, [imageUrl])

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      e.target.value = '' // Clear the input
      return
    }

    const fileSizeKB = file.size / 1024
    const fileSizeMB = fileSizeKB / 1024

    // Check file size limits
    if (fileSizeMB > 10) {
      toast.error(`File too large (${formatFileSize(file.size)}). Maximum size is 10MB.`)
      e.target.value = '' // Clear the input
      return
    }

    setIsLoading(true)
    try {
      let processedFile = file

      // Compress if file is between 1MB and 10MB
      if (fileSizeMB > 1) {
        toast.info('Compressing image...')
        try {
          processedFile = await compressImage(file, 1024) // Compress to under 1MB
          toast.success(`Image compressed from ${formatFileSize(file.size)} to ${formatFileSize(processedFile.size)}`)
        } catch {
          toast.error('Failed to compress image. Please try a smaller file.')
          e.target.value = '' // Clear the input
          return
        }
      }

      const formData = new FormData()
      formData.append("file", processedFile)
      const res = await uploadProfileImage(formData)
      if (res && 'url' in res) {
        // Add cache-busting parameter to force browser to reload image
        const cacheBustUrl = `${res.url}?t=${Date.now()}`
        setPreview(cacheBustUrl)
        toast.success('Profile picture updated successfully!')
        e.target.value = '' // Clear the input
        
        // Refresh the page to ensure all instances of the profile picture are updated
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else if (res && 'error' in res) {
        toast.error(res.error)
        e.target.value = '' // Clear the input
      }
    } catch {
      toast.error('Failed to upload image. Please try again.')
      e.target.value = '' // Clear the input
    } finally {
      setIsLoading(false)
    }
  }

  async function onRemove() {
    setIsLoading(true)
    try {
      const res = await removeProfileImage()
      if (res && 'success' in res) {
        setPreview(undefined)
        toast.success('Profile picture removed successfully!')
        
        // Refresh the page to ensure all instances of the profile picture are updated
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else if (res && 'error' in res) {
        toast.error(res.error)
      }
    } catch {
      toast.error('Failed to remove profile picture. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-background/10 backdrop-blur-sm border border-border/10 ring-1 ring-foreground/3">
      <div className="flex items-start gap-6">
        <div className="h-24 w-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={preview} 
              alt="Avatar" 
              className="h-full w-full object-cover"
              key={preview} // Force re-render when URL changes
            />
          ) : (
            <span className="text-sm text-muted-foreground">No image</span>
          )}
        </div>
        <div className="space-y-3">
          <div className="text-sm">
            <div className="font-medium">{name || email}</div>
            <div className="text-muted-foreground">{email}</div>
          </div>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="sr-only" onChange={onUpload} />
              <Button disabled={isLoading} type="button" variant="secondary" asChild>
                <span>Upload</span>
              </Button>
            </label>
            <Button disabled={isLoading} type="button" variant="destructive" onClick={onRemove}>
              Remove
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}


