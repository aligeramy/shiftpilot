"use client"


import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  timezone: z.string(),
  weekStart: z.enum(['MONDAY', 'SUNDAY'])
})

type OrganizationFormData = z.infer<typeof organizationSchema>

interface OrganizationSetupProps {
  onComplete: (data: OrganizationFormData) => void
  isLoading?: boolean
}

// Common timezones for medical facilities
const TIMEZONES = [
  { value: 'America/Toronto', label: 'Eastern Time (Toronto)' },
  { value: 'America/New_York', label: 'Eastern Time (New York)' },
  { value: 'America/Chicago', label: 'Central Time (Chicago)' },
  { value: 'America/Denver', label: 'Mountain Time (Denver)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
  { value: 'America/Vancouver', label: 'Pacific Time (Vancouver)' },
]

export function OrganizationSetup({ onComplete, isLoading }: OrganizationSetupProps) {
  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      slug: '',
      timezone: 'America/Toronto',
      weekStart: 'MONDAY'
    }
  })

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    form.setValue('slug', slug)
  }

  const onSubmit = (data: OrganizationFormData) => {
    console.log('[OrganizationSetup] Submitting:', data)
    onComplete(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Main Radiology Group" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    handleNameChange(e.target.value)
                  }}
                />
              </FormControl>
              <FormDescription>
                The name of your radiology clinic or hospital
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Slug</FormLabel>
              <FormControl>
                <Input 
                  placeholder="main-radiology-group" 
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Unique identifier for your organization (auto-generated)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The timezone where your clinic operates
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weekStart"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Week Start Day</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select week start day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MONDAY">Monday</SelectItem>
                  <SelectItem value="SUNDAY">Sunday</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Which day your scheduling week begins
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  )
}
