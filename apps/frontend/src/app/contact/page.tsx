'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, User, Phone, MapPin, AlertCircle } from 'lucide-react'

const contactSchema = z.object({
  name: z.string()
    .min(2, 'பெயர் குறைந்தது 2 எழுத்துக்கள் வேண்டும் / Name must be at least 2 characters')
    .max(50, 'பெயர் 50 எழுத்துக்களுக்கு மேல் இருக்கக்கூடாது / Name must not exceed 50 characters'),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'சரியான மொபைல் எண் கொடுக்கவும் / Please enter a valid mobile number'),
  address: z.string()
    .min(20, 'முகவரியை விரிவாக எழுதுங்கள் / Please provide complete address (minimum 20 characters)')
    .max(200, 'முகவரி 200 எழுத்துக்களுக்கு மேல் இருக்கக்கூடாது / Address must not exceed 200 characters')
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<string>('')
  const [isEmergency, setIsEmergency] = useState(false)
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    const checkPreviousData = () => {
      try {
        // Check for service and description (required from previous steps)
        const service = sessionStorage.getItem('selectedService')
        const emergency = sessionStorage.getItem('isEmergency') === 'true'
        const desc = sessionStorage.getItem('problemDescription')
        
        console.log('Contact page - checking data:', { service, emergency, desc })
        
        // Only redirect if missing data from previous steps
        if (!service || !desc) {
          console.log('Missing previous step data, redirecting to services')
          router.push('/services')
          return
        }
        
        setSelectedService(service)
        setIsEmergency(emergency)
        setDescription(desc)
        setIsLoading(false)
        
        console.log('Previous step data loaded successfully')
      } catch (error) {
        console.error('Error accessing sessionStorage:', error)
        router.push('/services')
      }
    }

    const timer = setTimeout(checkPreviousData, 100)
    return () => clearTimeout(timer)
  }, [router])

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Store contact info in sessionStorage
      const contactInfo = {
        name: data.name,
        phone: data.phone,
        address: data.address
      }
      
      sessionStorage.setItem('contactInfo', JSON.stringify(contactInfo))
      console.log('Contact info stored:', contactInfo)
      
      // Navigate to schedule page
      router.push('/schedule')
    } catch (error) {
      console.error('Error storing contact info:', error)
      alert('Error saving contact information. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">தொடர்பு விவரங்கள்</h1>
              <p className="text-sm text-gray-600">Contact Information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Service Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              selectedService === 'electrical' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}>
              <span className="text-white">
                {selectedService === 'electrical' ? '⚡' : '🔧'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800">
                {selectedService === 'electrical' ? 'மின்சார சேவை' : 'குழாய் சேவை'} • 
                {selectedService === 'electrical' ? ' Electrical Service' : ' Plumbing Service'}
              </h3>
              <p className="text-blue-600 text-sm mt-1">{description}</p>
            </div>
            {isEmergency && (
              <div className="bg-red-100 px-3 py-1 rounded-full">
                <span className="text-red-800 text-xs font-semibold">அவசரம் • Emergency</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            உங்கள் தொடர்பு விவரங்கள் • Your Contact Details
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>பெயர் • Full Name *</span>
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="உங்கள் முழு பெயரை எழுதுங்கள் / Enter your full name"
                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name.message}</span>
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                <span>மொபைல் எண் • Mobile Number *</span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="மொபைல் எண் / Mobile number (10 digits)"
                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.phone.message}</span>
                </p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                <span>முகவரி • Complete Address *</span>
              </label>
              <textarea
                {...register('address')}
                rows={3}
                placeholder="வீட்டு எண், தெரு, பகுதி, நகரம், பின் கோட் / House no, Street, Area, City, Pincode"
                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.address.message}</span>
                </p>
              )}
            </div>

          

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              அடுத்த படி • Next Step
            </button>
          </form>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 உங்கள் தகவல்கள் பாதுகாப்பாக வைக்கப்படும் • Your information is kept secure
          </p>
        </div>
      </div>
    </div>
  )
}