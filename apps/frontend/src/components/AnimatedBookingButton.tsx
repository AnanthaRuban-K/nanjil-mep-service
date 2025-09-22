// File: components/AnimatedBookingButton.tsx - Eye-catching Animated Button
'use client'
import React, { useState, useEffect } from 'react'
import { Phone, Calendar, Zap } from 'lucide-react'

interface AnimatedBookingButtonProps {
  language?: 'ta' | 'en'
}

export function AnimatedBookingButton({ language = 'ta' }: AnimatedBookingButtonProps) {
  const [isVisible, setIsVisible] = useState(true)

  // Get text based on language
  const getText = (ta: string, en: string) => language === 'ta' ? ta : en

  // Hide button when user scrolls to contact section
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer')
      if (footer) {
        const footerTop = footer.offsetTop
        const scrollPosition = window.scrollY + window.innerHeight
        setIsVisible(scrollPosition < footerTop + 200)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Floating Call Button - Right Side */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50">
        <div className="relative">
          {/* Pulsing rings */}
          <div className="absolute inset-0 animate-ping">
            <div className="w-16 h-16 bg-green-400 rounded-full opacity-75"></div>
          </div>
          <div className="absolute inset-0 animate-pulse delay-75">
            <div className="w-16 h-16 bg-green-300 rounded-full opacity-50"></div>
          </div>
          
          {/* Main button */}
          <a
            href="tel:1800-NANJIL"
            className="relative flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group"
          >
            <Phone className="w-8 h-8 animate-bounce" />
            
            {/* Tooltip */}
            <div className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {getText('உடனே அழையுங்கள்!', 'Call Now!')}
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </a>
        </div>
      </div>

      {/* Floating Book Service Button - Bottom */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">

        <div className="relative">
          {/* Glowing effect */}
          <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
          
          {/* Main booking button */}
          <button
            onClick={() => window.location.href = '/services'}
            className="relative flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
          >
            {/* Animated icon */}
            <div className="relative">
              <Calendar className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            
            {/* Text with typing animation */}
            <div className="text-lg font-bold">
              <span className="block">
                {getText('சேவை பதிவு செய்யுங்கள்', 'Book Service Now')}
              </span>
              <span className="block text-sm opacity-90">
                {getText('₹300 முதல்', 'Starting ₹300')}
              </span>
            </div>
            
            {/* Animated arrow */}
            <div className="transform group-hover:translate-x-1 transition-transform duration-300">
              <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
          </button>
        </div>
      </div>

      {/* Emergency Banner - Top (appears after 3 seconds) */}
      <EmergencyBanner language={language} />
    </>
  )
}

// Emergency notification banner
function EmergencyBanner({ language }: { language: 'ta' | 'en' }) {
  const [showBanner, setShowBanner] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const getText = (ta: string, en: string) => language === 'ta' ? ta : en

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true)
    }, 3000) // Show after 3 seconds

    return () => clearTimeout(timer)
  }, [])

  if (!showBanner || isDismissed) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-sm mx-auto">
      <div className="relative">
        {/* Sliding banner */}
       
      </div>
    </div>
  )
}

// Add these CSS animations to your global styles
export const animationStyles = `
@keyframes slideInFromTop {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-slideInFromTop {
  animation: slideInFromTop 0.5s ease-out;
}
`

export default AnimatedBookingButton