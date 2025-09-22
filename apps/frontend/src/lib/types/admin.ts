// src/lib/types/admin.ts

export interface Booking {
  id: number;
  bookingNumber: string;
  serviceType: 'electrical' | 'plumbing';
  priority: 'normal' | 'urgent' | 'emergency';
  description: string;
  contactInfo: {
    name: string;
    phone: string;
    address: string;
  };
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  totalCost: string;
  actualCost?: string;
  rating?: number;
}

export interface DashboardStats {
  today: {
    bookings: number;
    completed: number;
    pending: number;
    inProgress: number;
    revenue: number;
  };
  overall: {
    totalBookings: number;
    completedJobs: number;
    pendingJobs: number;
    emergencyJobs: number;
    totalRevenue: number;
  };
}

// API Response interfaces
export interface BookingsResponse {
  success: boolean;
  bookings: Booking[];
  count?: number;
  error?: string;
}

export interface DashboardStatsResponse {
  success: boolean;
  metrics: DashboardStats;
  error?: string;
}

export interface UpdateBookingStatusRequest {
  status: string;
  notes?: string;
}

export interface UpdateBookingStatusResponse {
  success: boolean;
  message: string;
  status: string;
  notes?: string;
  error?: string;
}

// Query parameters
export interface BookingsQueryParams {
  limit?: number;
  offset?: number;
  status?: string;
}

export interface GeneralSettings {
  companyName: string
  companyNameEn: string
  email: string
  phone: string
  address: string
  website: string
  workingHours: string
}

export interface PricingSettings {
  electricalBaseRate: number
  plumbingBaseRate: number
  emergencyMultiplier: number
  urgentMultiplier: number
  travelCharge: number
  minimumCharge: number
}

export interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  newBookingAlert: boolean
  statusUpdateAlert: boolean
  reminderNotifications: boolean
}

export interface BusinessSettings {
  autoConfirmBookings: boolean
  requirePaymentAdvance: boolean
  allowCancellation: boolean
  cancellationWindow: number
  workingDays: string[]
  holidayMode: boolean
}

export interface AdminSettings {
  general: GeneralSettings
  pricing: PricingSettings
  notifications: NotificationSettings
  business: BusinessSettings
}