// apps/frontend/src/app/schedule/page.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Calendar as CalendarIcon } from 'lucide-react'

export default function SchedulePage() {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')

  useEffect(() => {
    // Check previous steps
    const service = sessionStorage.getItem('selectedService')
    const description = sessionStorage.getItem('problemDescription')
    const contactInfo = sessionStorage.getItem('contactInfo')
    
    if (!service || !description || !contactInfo) {
      router.push('/services')
      return
    }
    
    setSelectedService(service)
    
    // Set default date to today
    const today = new Date()
    setSelectedDate(today.toISOString().split('T')[0])
  }, [router])

  const handleTimeSelect = (timeSlot: string) => {
    setSelectedTime(timeSlot)
  }

  const handleNext = () => {
    if (!selectedTime) {
      alert('நேரம் தேர்வு செய்யவும் / Please select a time slot')
      return
    }
    
    const scheduledDateTime = `${selectedDate}T${selectedTime}`
    sessionStorage.setItem('scheduledTime', scheduledDateTime)
    router.push('/summary')
  }

  const handleBack = () => {
    router.back()
  }

  const timeSlots = [
    { time: '09:00', label: '9:00-11:00 AM', labelTa: 'காலை', available: true },
    { time: '11:00', label: '11:00 AM-1:00 PM', labelTa: 'முற்பகல்', available: true },
    { time: '14:00', label: '2:00-4:00 PM', labelTa: 'மதியம்', available: true },
    { time: '16:00', label: '4:00-6:00 PM', labelTa: 'மாலை', available: false },
  ]

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
              <h1 className="text-xl font-bold text-gray-800">எப்போது வேண்டும்?</h1>
              <p className="text-sm text-gray-600">When do you need service?</p>
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
              <span>சேவை</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
              <span>பிரச்சனை</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
              <span>தொடர்பு</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600 font-semibold">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
              <span>நேரம்</span>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                தேதி தேர்வு (Select Date)
              </h2>
            </div>
          </div>
          
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          />
        </div>

        {/* Time Slots */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                நேரம் தேர்வு (Select Time)
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && handleTimeSelect(slot.time)}
                disabled={!slot.available}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedTime === slot.time
                    ? 'border-green-500 bg-green-50'
                    : slot.available
                      ? 'border-gray-200 hover:border-green-300 bg-white hover:shadow-md'
                      : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold text-gray-800">{slot.label}</div>
                  <div className="text-sm text-gray-600">{slot.labelTa}</div>
                  <div className={`text-xs mt-1 ${slot.available ? 'text-green-600' : 'text-red-600'}`}>
                    {slot.available ? '✓ கிடைக்கிறது (Available)' : '✗ பிசி (Busy)'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <div className="text-center">
          <button
            onClick={handleNext}
            disabled={!selectedTime}
            className={`font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 min-w-[250px] ${
              selectedTime
                ? 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-xl transform hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            அடுத்தது: விபரங்களை பார்ப்பு →
            <div className="text-sm font-normal">Next: Review Details</div>
          </button>
        </div>
      </div>
    </div>
  )
}