// File: components/AnimatedBookingButton.tsx - Mobile Responsive Eye-catching Animated Button
'use client'
import React, { useState, useEffect } from 'react'
import { Phone, Calendar, Zap, X } from 'lucide-react'

interface AnimatedBookingButtonProps {
  language?: 'ta' | 'en'
}

export function AnimatedBookingButton({ language = 'ta' }: AnimatedBookingButtonProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Get text based on language
  const getText = (ta: string, en: string) => language === 'ta' ? ta : en

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      {/* Mobile Layout */}
      {isMobile ? (
        <>
          {/* Mobile Call Button - Bottom Right */}
          <div className="fixed bottom-20 right-4 z-50">
            <div className="relative">
              {/* Pulsing rings - smaller for mobile */}
              <div className="absolute inset-0 animate-ping">
                <div className="w-12 h-12 bg-green-400 rounded-full opacity-75"></div>
              </div>
              <div className="absolute inset-0 animate-pulse delay-75">
                <div className="w-12 h-12 bg-green-300 rounded-full opacity-50"></div>
              </div>
              
              {/* Main call button */}
              <a
                href="tel:9384851596-NANJIL"
                className="relative flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
              >
                <Phone className="w-5 h-5 animate-bounce" />
              </a>
            </div>
          </div>

          {/* Mobile Book Service Button - Bottom Center */}
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="relative">
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-blue-400 rounded-xl blur-lg opacity-60 animate-pulse"></div>
              
              {/* Main booking button */}
              <button
                onClick={() => window.location.href = '/services'}
                className="relative flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 text-white px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <div className="text-sm font-bold">
                  <span className="block">
                    {getText('சேவை பதிவு', 'Book Now')}
                  </span>
                </div>
                <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Desktop Layout */
        <>
          {/* Desktop Call Button - Right Side */}
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
                href="tel:9384851596-NANJIL"
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

          {/* Desktop Book Service Button - Left Side */}
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
        </>
      )}

      {/* Emergency Banner - Responsive */}
      <EmergencyBanner language={language} isMobile={isMobile} />
    </>
  )
}

// Emergency notification banner
function EmergencyBanner({ language, isMobile }: { language: 'ta' | 'en', isMobile: boolean }) {
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
    <div className={`fixed ${isMobile ? 'top-4 left-2 right-2' : 'top-20 left-1/2 transform -translate-x-1/2'} z-40 ${!isMobile && 'max-w-sm mx-auto'}`}>
      <div className="relative">
        {/* Sliding banner */}
        
      </div>
    </div>
  )
}

// Updated CSS animations with mobile considerations
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

/* Mobile specific styles */
@media (max-width: 768px) {
  .fixed {
    /* Ensure buttons don't interfere with mobile navigation */
    z-index: 40;
  }
  
  /* Reduce animation intensity on mobile for better performance */
  .animate-bounce {
    animation-duration: 2s;
  }
  
  .animate-pulse {
    animation-duration: 3s;
  }
  
  .animate-ping {
    animation-duration: 2s;
  }
}

/* Touch-friendly hover states */
@media (hover: none) {
  .hover\\:scale-110:hover {
    transform: scale(1.05);
  }
  
  .hover\\:bg-green-600:hover {
    background-color: rgb(22 163 74);
  }
  
  .hover\\:bg-blue-700:hover {
    background-color: rgb(29 78 216);
  }
}
`

export default AnimatedBookingButton