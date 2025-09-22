'use client'
import React, { useState } from 'react'
import { 
  Settings, 
  Save, 
  RefreshCw,
  Bell,
  DollarSign,
  Clock,
  Shield,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { 
  AdminSettings, 
  GeneralSettings, 
  PricingSettings, 
  NotificationSettings, 
  BusinessSettings 
} from '@/lib/types/admin'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('general')
  const [settings, setSettings] = useState<AdminSettings>({
    general: {
      companyName: 'நாஞ்சில் MEP Services',
      companyNameEn: 'Nanjil MEP Services',
      email: 'info@nanjilmepservice.com',
      phone: '1800-NANJIL',
      address: 'Nagercoil, Tamil Nadu, India',
      website: 'https://nanjilmepservice.com',
      workingHours: '24/7 Available'
    },
    pricing: {
      electricalBaseRate: 300,
      plumbingBaseRate: 350,
      emergencyMultiplier: 1.5,
      urgentMultiplier: 1.2,
      travelCharge: 50,
      minimumCharge: 200
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      newBookingAlert: true,
      statusUpdateAlert: true,
      reminderNotifications: true
    },
    business: {
      autoConfirmBookings: false,
      requirePaymentAdvance: false,
      allowCancellation: true,
      cancellationWindow: 2,
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      holidayMode: false
    }
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSave = async (): Promise<void> => {
    setIsLoading(true)
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('அமைப்புகள் சேமிக்கப்பட்டன • Settings saved successfully')
    } catch (error) {
      toast.error('அமைப்புகளை சேமிக்க முடியவில்லை • Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'general', name: 'பொது • General', icon: Settings },
    { id: 'pricing', name: 'விலை • Pricing', icon: DollarSign },
    { id: 'notifications', name: 'அறிவிப்புகள் • Notifications', icon: Bell },
    { id: 'business', name: 'வணிகம் • Business', icon: Clock }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            அமைப்புகள் • Settings
          </h1>
          <p className="text-gray-600">
            பயன்பாட்டு அமைப்புகளை நிர்வகிக்கவும் • Manage application settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isLoading ? 'Saving...' : 'சேமிக்க • Save'}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <GeneralSettingsComponent 
              settings={settings.general} 
              onChange={(newSettings: GeneralSettings) => 
                setSettings(prev => ({ ...prev, general: newSettings }))
              } 
            />
          )}
          
          {activeTab === 'pricing' && (
            <PricingSettingsComponent 
              settings={settings.pricing} 
              onChange={(newSettings: PricingSettings) => 
                setSettings(prev => ({ ...prev, pricing: newSettings }))
              } 
            />
          )}
          
          {activeTab === 'notifications' && (
            <NotificationSettingsComponent 
              settings={settings.notifications} 
              onChange={(newSettings: NotificationSettings) => 
                setSettings(prev => ({ ...prev, notifications: newSettings }))
              } 
            />
          )}
          
          {activeTab === 'business' && (
            <BusinessSettingsComponent 
              settings={settings.business} 
              onChange={(newSettings: BusinessSettings) => 
                setSettings(prev => ({ ...prev, business: newSettings }))
              } 
            />
          )}
        </div>
      </div>
    </div>
  )
}

// General Settings Component with proper types
interface GeneralSettingsProps {
  settings: GeneralSettings
  onChange: (settings: GeneralSettings) => void
}

function GeneralSettingsComponent({ settings, onChange }: GeneralSettingsProps) {
  const handleChange = (field: keyof GeneralSettings, value: string): void => {
    onChange({ ...settings, [field]: value })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">பொது அமைப்புகள் • General Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            நிறுவன பெயர் (தமிழ்) • Company Name (Tamil)
          </label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name (English)
          </label>
          <input
            type="text"
            value={settings.companyNameEn}
            onChange={(e) => handleChange('companyNameEn', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            மின்னஞ்சல் • Email
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            தொலைபேசி • Phone
          </label>
          <input
            type="tel"
            value={settings.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            முகவரி • Address
          </label>
          <textarea
            value={settings.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-1" />
            வலைத்தளம் • Website
          </label>
          <input
            type="url"
            value={settings.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

// Pricing Settings Component
interface PricingSettingsProps {
  settings: PricingSettings
  onChange: (settings: PricingSettings) => void
}

function PricingSettingsComponent({ settings, onChange }: PricingSettingsProps) {
  const handleChange = (field: keyof PricingSettings, value: number): void => {
    onChange({ ...settings, [field]: value })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">விலை அமைப்புகள் • Pricing Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            மின்சார அடிப்படை விலை • Electrical Base Rate (₹)
          </label>
          <input
            type="number"
            value={settings.electricalBaseRate}
            onChange={(e) => handleChange('electricalBaseRate', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            குழாய் அடிப்படை விலை • Plumbing Base Rate (₹)
          </label>
          <input
            type="number"
            value={settings.plumbingBaseRate}
            onChange={(e) => handleChange('plumbingBaseRate', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            அவசர கட்டணம் (Multiplier)
          </label>
          <input
            type="number"
            step="0.1"
            value={settings.emergencyMultiplier}
            onChange={(e) => handleChange('emergencyMultiplier', parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            பயண கட்டணம் • Travel Charge (₹)
          </label>
          <input
            type="number"
            value={settings.travelCharge}
            onChange={(e) => handleChange('travelCharge', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

// Notification Settings Component
interface NotificationSettingsProps {
  settings: NotificationSettings
  onChange: (settings: NotificationSettings) => void
}

function NotificationSettingsComponent({ settings, onChange }: NotificationSettingsProps) {
  const handleToggle = (field: keyof NotificationSettings): void => {
    onChange({ ...settings, [field]: !settings[field] })
  }

  const notificationLabels: Record<keyof NotificationSettings, string> = {
    emailNotifications: 'மின்னஞ்சல் அறிவிப்புகள் • Email Notifications',
    smsNotifications: 'SMS அறிவிப்புகள் • SMS Notifications',
    pushNotifications: 'புஷ் அறிவிப்புகள் • Push Notifications',
    newBookingAlert: 'புதிய பதிவு எச்சரிக்கை • New Booking Alert',
    statusUpdateAlert: 'நிலை புதுப்பிப்பு எச்சரிக்கை • Status Update Alert',
    reminderNotifications: 'நினைவூட்டல் அறிவிப்புகள் • Reminder Notifications'
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">அறிவிப்பு அமைப்புகள் • Notification Settings</h3>
      
      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                {notificationLabels[key as keyof NotificationSettings]}
              </h4>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={() => handleToggle(key as keyof NotificationSettings)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

// Business Settings Component
interface BusinessSettingsProps {
  settings: BusinessSettings
  onChange: (settings: BusinessSettings) => void
}

function BusinessSettingsComponent({ settings, onChange }: BusinessSettingsProps) {
  const handleToggle = (field: keyof BusinessSettings): void => {
    if (typeof settings[field] === 'boolean') {
      onChange({ ...settings, [field]: !settings[field] })
    }
  }

  const handleChange = (field: keyof BusinessSettings, value: any): void => {
    onChange({ ...settings, [field]: value })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">வணிக அமைப்புகள் • Business Settings</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">தானியங்கு உறுதிப்படுத்தல் • Auto Confirm Bookings</h4>
            <p className="text-sm text-gray-500">Automatically confirm new bookings</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoConfirmBookings}
              onChange={() => handleToggle('autoConfirmBookings')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ரத்து நேர வரம்பு • Cancellation Window (hours)
          </label>
          <input
            type="number"
            value={settings.cancellationWindow}
            onChange={(e) => handleChange('cancellationWindow', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            வேலை நாட்கள் • Working Days
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.workingDays.includes(day.toLowerCase())}
                  onChange={(e) => {
                    const dayLower = day.toLowerCase()
                    if (e.target.checked) {
                      handleChange('workingDays', [...settings.workingDays, dayLower])
                    } else {
                      handleChange('workingDays', settings.workingDays.filter((d: string) => d !== dayLower))
                    }
                  }}
                  className="mr-2"
                />
                {day}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}