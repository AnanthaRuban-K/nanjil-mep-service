// apps/frontend/src/app/contact/page.tsx - SIMPLIFIED CONTACT INFO
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, User, Phone, MapPin, AlertCircle } from 'lucide-react'

// Simple validation schema
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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    // Check if user came from previous steps
    const service = sessionStorage.getItem('selectedService')
    const emergency = sessionStorage.getItem('isEmergency') === 'true'
    const description = sessionStorage.getItem('problemDescription')
    
    if (!service || !description) {
      router.push('/services')
      return
    }
    
    setSelectedService(service)
    setIsEmergency(emergency)
  }, [router])

  const handleBack = () => {
    router.back()
  }

  const onSubmit = (data: ContactFormData) => {
    // Store contact info and proceed to scheduling
    sessionStorage.setItem('contactInfo', JSON.stringify(data))
    router.push('/schedule')
  }

  // Watch form values for real-time validation feedback
  const watchedValues = watch()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">உங்கள் விபரங்கள்</h1>
              <p className="text-sm text-gray-600">Your Contact Details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
              <span>சேவை தேர்வு</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
              <span>பிரச்சனை</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600 font-semibold">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
              <span>தொடர்பு விவரம்</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">4</div>
              <span>நேரம்</span>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        {isEmergency && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center space-x-3 text-red-800">
              <AlertCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">அவசர சேவை தேர்வு செய்யப்பட்டது</p>
                <p className="text-sm">Emergency service selected - We will prioritize your request</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <div>
                <label className="text-lg font-semibold text-gray-800">
                  பெயர் (Name) *
                </label>
                <p className="text-sm text-gray-600">உங்கள் முழு பெயர் / Your full name</p>
              </div>
            </div>
            
            <input
              {...register('name')}
              type="text"
              placeholder="உங்கள் பெயர் எழுதுங்கள் / Enter your name"
              className={`w-full p-4 text-lg border-2 rounded-xl transition-colors ${
                errors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : watchedValues.name && watchedValues.name.length >= 2
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              } focus:ring-2 focus:outline-none`}
              style={{ fontFamily: 'Noto Sans Tamil, sans-serif' }}
            />
            
            {errors.name && (
              <p className="text-red-600 text-sm mt-2 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Phone className="w-6 h-6 text-green-600" />
              <div>
                <label className="text-lg font-semibold text-gray-800">
                  மொபைல் எண் (Mobile Number) *
                </label>
                <p className="text-sm text-gray-600">10 digit mobile number / 10 இலக்க மொபைல் எண்</p>
              </div>
            </div>
            
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                +91
              </span>
              <input
                {...register('phone')}
                type="tel"
                placeholder="98765 43210"
                maxLength={10}
                className={`w-full p-4 pl-16 text-lg border-2 rounded-xl transition-colors font-mono ${
                  errors.phone 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : watchedValues.phone && /^[6-9]\d{9}$/.test(watchedValues.phone)
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                } focus:ring-2 focus:outline-none`}
              />
            </div>
            
            {errors.phone && (
              <p className="text-red-600 text-sm mt-2 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.phone.message}</span>
              </p>
            )}
          </div>

          {/* Address Field */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
              <div>
                <label className="text-lg font-semibold text-gray-800">
                  முகவரி (Address) *
                </label>
                <p className="text-sm text-gray-600">வீட்டு முகவரி விரிவாக / Complete house address</p>
              </div>
            </div>
            
            <textarea
              {...register('address')}
              placeholder="வீட்டு எண், தெரு, பகுதி, நகரம், பின் கோட்
House number, street, area, city, pincode"
              rows={4}
              className={`w-full p-4 text-lg border-2 rounded-xl resize-none transition-colors ${
                errors.address 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : watchedValues.address && watchedValues.address.length >= 20
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              } focus:ring-2 focus:outline-none`}
              style={{ fontFamily: 'Noto Sans Tamil, sans-serif' }}
            />
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {watchedValues.address?.length || 0}/200 characters (minimum 20)
              </span>
              {watchedValues.address && (
                <span className={`text-sm ${watchedValues.address.length >= 20 ? 'text-green-600' : 'text-red-500'}`}>
                  {watchedValues.address.length >= 20 ? '✓ Complete' : '✗ Need more details'}
                </span>
              )}
            </div>
            
            {errors.address && (
              <p className="text-red-600 text-sm mt-2 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.address.message}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={!isValid}
              className={`font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 min-w-[250px] ${
                isValid
                  ? 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-xl transform hover:-translate-y-1'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              அடுத்தது: நேரம் தேர்வு →
              <div className="text-sm font-normal">Next: Select Time</div>
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            உங்கள் தகவல்கள் பாதுகாப்பானவை • Your information is secure
          </p>
        </div>
      </div>
    </div>
  )
}

// REMOVED COMPLEX FEATURES:
// - Location auto-detection with GPS
// - Address validation with Google Maps
// - Previous customer data pre-filling
// - Alternative contact methods
// - Verification via OTP
// - Social login integration