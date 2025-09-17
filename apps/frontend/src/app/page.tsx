'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Wrench, Phone, MapPin, Star, Clock, Shield, Globe } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter()
  const [language, setLanguage] = useState<'ta' | 'en'>('ta') // Default to Tamil

  const handleBookService = () => {
    router.push('/services')
  }

  const handleEmergencyCall = () => {
    window.location.href = 'tel:+919384851596'
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ta' ? 'en' : 'ta')
  }

  // Content in both languages
  const content = {
    ta: {
      header: {
        title: 'நாஞ்சில் MEP சேவை',
        subtitle: 'Nanjil MEP Service',
        emergency: 'அவசரம்'
      },
      hero: {
        title: 'மின்சாரம் • குழாய் • அவசர சேவை',
        subtitle: 'Electrical • Plumbing • Emergency Service',
        description: 'வீட்டு மின்சாரம் மற்றும் குழாய் பிரச்சனைகளுக்கு நம்பகமான சேவை'
      },
      services: {
        electrical: {
          title: 'மின்சாரம்',
          subtitle: 'Electrical',
          items: [
            'விசிறி சரி செய்தல் (Fan Repair)',
            'விளக்கு பொருத்துதல் (Light Fitting)',
            'சுவிட்ச் மாற்றுதல் (Switch Replacement)',
            'வயரிங் சரிசெய்தல் (Wiring Fix)'
          ]
        },
        plumbing: {
          title: 'குழாய்',
          subtitle: 'Plumbing',
          items: [
            'குழாய் லீக்கேஜ் (Pipe Leakage)',
            'கழிவறை சரிசெய்தல் (Toilet Repair)',
            'டேப் மாற்றுதல் (Tap Replacement)',
            'வாட்டர் டேங்க் (Water Tank Service)'
          ]
        },
        emergency: {
          title: 'அவசரம்',
          subtitle: 'Emergency',
          items: [
            '24 மணி நேரம் (24 Hours)',
            'உடனடி சேவை (Immediate)',
            'பவர் கட் (Power Cut)',
            'வாட்டர் லீக்கேஜ் (Water Leakage)'
          ]
        }
      },
      bookButton: {
        main: '🏠 சேவை பதிவு செய்யுங்கள்',
        sub: 'Book Service'
      },
      features: [
        { title: 'விரைவான சேவை', subtitle: 'Quick Service' },
        { title: 'தரமான வேலை', subtitle: 'Quality Work' },
        { title: 'உள்ளூர் சேவை', subtitle: 'Local Service' }
      ],
      emergency: {
        title: 'அவசர சேவைக்கு உடனே அழைக்கவும்',
        subtitle: 'For Emergency Service Call Immediately'
      },
      footer: {
        main: 'நாஞ்சில் MEP சேவை - நம்பகமான வீட்டு சேவைகள்',
        sub: 'Nanjil MEP Service - Trusted Home Services'
      }
    },
    en: {
      header: {
        title: 'Nanjil MEP Service',
        subtitle: 'நாஞ்சில் MEP சேவை',
        emergency: 'Emergency'
      },
      hero: {
        title: 'Electrical • Plumbing • Emergency Service',
        subtitle: 'மின்சாரம் • குழாய் • அவசர சேவை',
        description: 'Reliable home electrical and plumbing services you can trust'
      },
      services: {
        electrical: {
          title: 'Electrical',
          subtitle: 'மின்சாரம்',
          items: [
            'Fan Repair (விசிறி சரி செய்தல்)',
            'Light Fitting (விளக்கு பொருத்துதல்)',
            'Switch Replacement (சுவிட்ச் மாற்றுதல்)',
            'Wiring Fix (வயரிங் சரிசெய்தல்)'
          ]
        },
        plumbing: {
          title: 'Plumbing',
          subtitle: 'குழாய்',
          items: [
            'Pipe Leakage (குழாய் லீக்கேஜ்)',
            'Toilet Repair (கழிவறை சரிசெய்தல்)',
            'Tap Replacement (டேப் மாற்றுதல்)',
            'Water Tank Service (வாட்டர் டேங்க்)'
          ]
        },
        emergency: {
          title: 'Emergency',
          subtitle: 'அவசரம்',
          items: [
            '24 Hours (24 மணி நேரம்)',
            'Immediate (உடனடி சேவை)',
            'Power Cut (பவர் கட்)',
            'Water Leakage (வாட்டர் லீக்கேஜ்)'
          ]
        }
      },
      bookButton: {
        main: '🏠 Book Service',
        sub: 'சேவை பதிவு செய்யுங்கள்'
      },
      features: [
        { title: 'Quick Service', subtitle: 'விரைவான சேவை' },
        { title: 'Quality Work', subtitle: 'தரமான வேலை' },
        { title: 'Local Service', subtitle: 'உள்ளூர் சேவை' }
      ],
      emergency: {
        title: 'For Emergency Service Call Immediately',
        subtitle: 'அவசர சேவைக்கு உடனே அழைக்கவும்'
      },
      footer: {
        main: 'Nanjil MEP Service - Trusted Home Services',
        sub: 'நாஞ்சில் MEP சேவை - நம்பகமான வீட்டு சேவைகள்'
      }
    }
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/nanjil-logo.jpg"
                alt="Nanjil MEP Logo"
                width={100}
                height={100}
                className="object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800">{currentContent.header.title}</h1>
                <p className="text-sm text-gray-600">{currentContent.header.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Language Toggle Button */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                title="Switch Language"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {language === 'ta' ? 'EN' : 'தமிழ்'}
                </span>
              </button>

              {/* Emergency Button */}
              <button
                onClick={handleEmergencyCall}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium animate-pulse"
              >
                <Phone className="w-4 h-4 inline mr-2" />
                <div className="inline-flex flex-col items-start">
                  <span className="text-sm font-bold">{currentContent.header.emergency}</span>
                  <span className="text-xs opacity-90">9384851596</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {currentContent.hero.title}
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            {currentContent.hero.subtitle}
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {currentContent.hero.description}
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Electrical Service */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-yellow-100">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2 text-gray-800">
              {currentContent.services.electrical.title}
            </h3>
            <p className="text-center text-gray-600 text-sm mb-4">
              {currentContent.services.electrical.subtitle}
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              {currentContent.services.electrical.items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Plumbing Service */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2 text-gray-800">
              {currentContent.services.plumbing.title}
            </h3>
            <p className="text-center text-gray-600 text-sm mb-4">
              {currentContent.services.plumbing.subtitle}
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              {currentContent.services.plumbing.items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Emergency Service */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-red-100">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2 text-gray-800">
              {currentContent.services.emergency.title}
            </h3>
            <p className="text-center text-gray-600 text-sm mb-4">
              {currentContent.services.emergency.subtitle}
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              {currentContent.services.emergency.items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Action Button */}
        <div className="text-center mb-12">
          <button
            onClick={handleBookService}
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-h-[60px]"
          >
            {currentContent.bookButton.main}
            <div className="text-sm font-normal">{currentContent.bookButton.sub}</div>
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800">{currentContent.features[0].title}</h4>
            <p className="text-sm text-gray-600">{currentContent.features[0].subtitle}</p>
          </div>
          <div className="text-center">
            <Star className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800">{currentContent.features[1].title}</h4>
            <p className="text-sm text-gray-600">{currentContent.features[1].subtitle}</p>
          </div>
          <div className="text-center">
            <MapPin className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800">{currentContent.features[2].title}</h4>
            <p className="text-sm text-gray-600">{currentContent.features[2].subtitle}</p>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-red-800 mb-2">
            {currentContent.emergency.title}
          </h3>
          <p className="text-red-600 mb-4">{currentContent.emergency.subtitle}</p>
          <button
            onClick={handleEmergencyCall}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl inline-flex items-center space-x-2"
          >
            <Phone className="w-5 h-5" />
            <span>9384851596</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            {currentContent.footer.main}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {currentContent.footer.sub}
          </p>
        </div>
      </div>
    </div>
  )
}