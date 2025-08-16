// Shared API types for the application

export interface UserWithProfile {
  id: string
  name: string | null
  email: string
  radiologistProfile?: {
    subspecialty: {
      id: string
      code: string
      name: string
    } | null
  } | null
}

export interface ShiftTypeDetails {
  id: string
  code: string
  name: string
  startTime: string
  endTime: string
  isAllDay: boolean
  requiredSubspecialtyId: string | null
  allowAny: boolean
  namedAllowlist: string | null
}

export interface ScheduleAssignmentWithDetails {
  id: string
  instanceId: string
  userId: string
  assignmentType: string
  createdAt: Date
  updatedAt: Date
  instance: {
    id: string
    date: Date
    startTime: Date
    endTime: Date
    shiftType: ShiftTypeDetails
  }
  user: UserWithProfile
}

export interface TimeConflict {
  assignmentId: string
  shiftName: string
  startTime: string
  endTime: string
}

export interface EligibilityPartner {
  assignment: ScheduleAssignmentWithDetails
  swapType: 'SAME_TYPE' | 'EQUIVALENT_TYPE'
  canSwap: boolean
  conflicts: {
    requester: TimeConflict[]
    target: TimeConflict[]
  }
  eligibilityChecks: {
    canRequesterWorkTarget: boolean
    canTargetWorkRequester: boolean
    isSameShiftType: boolean
    isInEquivalenceSet: boolean
  }
}

export interface EligiblePartnersResponse {
  originalAssignment: ScheduleAssignmentWithDetails
  eligiblePartners: EligibilityPartner[]
  totalFound: number
}

export interface SwapOfferRequest {
  swapRequestId: string
  targetUserId: string
  targetAssignmentId?: string
  response?: string
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

// Calendar export types
export interface ScheduleInstanceForExport {
  id: string
  date: Date
  shiftType: {
    id: string
    code: string
    name: string
    startTime: string
    endTime: string
    isAllDay: boolean
    allowAny: boolean
    requiredSubspecialtyId: string | null
    namedAllowlist: string | null
  }
  assignments: {
    id: string
    userId: string
    assignmentType: string
    user: {
      id: string
      name: string | null
      email: string
    }
  }[]
}

export interface UserForExport {
  id: string
  name: string | null
  email: string
  radiologistProfile?: {
    subspecialty: {
      id: string
      code: string
      name: string
    } | null
  } | null
}

export interface ShiftTypeForExport {
  id: string
  code: string
  name: string
  startTime: string
  endTime: string
  isAllDay: boolean
  allowAny: boolean
  requiredSubspecialtyId: string | null
  namedAllowlist: string | null
}

// Schedule calendar types
export interface RawScheduleItem {
  date: string
  shiftCode: string
  shiftName: string
  shiftTime: string
  assignedTo: {
    name: string
    email: string
    subspecialty: string
  }[]
}

export interface ScheduleApiResponse {
  data?: {
    rawSchedule?: RawScheduleItem[]
  }
}

// Fairness types
export interface FairnessResult {
  ytdPoints: number
  name: string
  email: string
}

export interface FairnessApiResponse {
  results?: FairnessResult[]
}

// Organization overview types
export interface ShiftRecurrence {
  mon: boolean
  tue: boolean
  wed: boolean
  thu: boolean
  fri: boolean
  sat: boolean
  sun: boolean
}

export interface ShiftEligibility {
  requiredSubspecialty?: { code: string; name: string }
  allowAny: boolean
  namedAllowlist: string[]
}

export interface ShiftTypeWithDetails {
  id: string
  code: string
  name: string
  startTime: string
  endTime: string
  isAllDay: boolean
  recurrence: ShiftRecurrence
  eligibility: ShiftEligibility
}

// Vacation preference types
export interface VacationPreference {
  id: string
  rank: number
  weekNumber: number
  weekStartDate: string | Date
  weekEndDate: string | Date
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface RadiologistForPreferences {
  id: string
  name: string
  email: string
  radiologistProfile?: {
    subspecialty?: {
      name: string
    }
  }
  vacationPreferences?: VacationPreference[]
}

// Settings form types
export interface SubspecialtyFormData {
  code: string
  name: string
}

export interface ShiftTypeFormData {
  code: string
  name: string
  startTime: string
  endTime: string
  isAllDay: boolean
  mon?: boolean
  tue?: boolean
  wed?: boolean
  thu?: boolean
  fri?: boolean
  sat?: boolean
  sun?: boolean
  eligibilityType: 'any' | 'subspecialty' | 'named'
  requiredSubspecialtyId?: string
  namedAllowlist?: string
}

export interface StaffFormData {
  name: string
  email: string
  subspecialtyId: string
  ftePercent: number
}

export type EditableItem = {
  id: string
  [key: string]: unknown
}

// Swap manager types
export interface SwapConflict {
  assignmentId: string
  shiftName: string
  startTime: string
  endTime: string
}

export interface EligiblePartnerForSwap {
  assignment: ScheduleAssignmentWithDetails
  swapType: 'SAME_TYPE' | 'EQUIVALENT_TYPE'
  canSwap: boolean
  conflicts: {
    requester: SwapConflict[]
    target: SwapConflict[]
  }
  eligibilityChecks: {
    canRequesterWorkTarget: boolean
    canTargetWorkRequester: boolean
    isSameShiftType: boolean
    isInEquivalenceSet: boolean
  }
}

// Swap requests list types
export interface SwapRequestFromApi {
  id: string
  status: string
  notes: string | null
  createdAt: string
  requester: {
    id: string
    name: string
    email: string
  }
  assignment: {
    id: string
    instance: {
      date: string
      shiftType: {
        name: string
        startTime: string
        endTime: string
        requiredSubspecialtyId: string | null
      }
    }
  }
  offers: Array<{
    id: string
    status: string
    notes: string | null
    targetUser: {
      id: string
      name: string
      email: string
    }
    targetAssignment?: {
      id: string
      instance: {
        date: string
        shiftType: {
          name: string
          startTime: string
          endTime: string
        }
      }
    }
  }>
}