// File: components/CustomerHeader.tsx - Enhanced with Language Toggle
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Wrench, 
  LogOut, 
  User as UserIcon, 
  Calendar,
  Phone,
  Menu,
  X,
  LogIn,
  UserPlus,
  Globe,
  Shield
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Image from "next/image";
interface CustomerHeaderProps {
  title?: string
  subtitle?: string
}

export default function CustomerHeader({ 
  title = "நாஞ்சில் MEP Services", 
  subtitle = "Electrical & Plumbing Services" 
}: CustomerHeaderProps) {
  const router = useRouter()
  const { user, isSignedIn, logout, login, isLoggingOut } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [language, setLanguage] = useState<'ta' | 'en'>('ta')

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ta' | 'en'
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Language toggle handler
  const toggleLanguage = () => {
    const newLanguage = language === 'ta' ? 'en' : 'ta'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    
    // Dispatch custom event for homepage to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLanguage }))
  }

  const handleLogout = async () => {
    const confirmMessage = language === 'ta' 
      ? 'நீங்கள் நிச்சயமாக வெளியேற விரும்புகிறீர்களா?'
      : 'Are you sure you want to logout?'
    
    if (window.confirm(confirmMessage)) {
      await logout('/')
    }
  }

  // Navigation items with bilingual support
  const navigationItems = [
    {
      name: language === 'ta' ? 'சேவைகள்' : 'Services',
      href: '/services',
      icon: Wrench
    },
    {
      name: language === 'ta' ? 'என் பதிவுகள்' : 'My Bookings',
      href: '/bookings',
      icon: Calendar,
      requiresAuth: true
    },
    {
      name: language === 'ta' ? 'தொடர்பு' : 'Contact',
      href: '/contact-us',
      icon: Phone
    }
  ]

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  // Get text based on language
  const getText = (ta: string, en: string) => language === 'ta' ? ta : en

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo & Title */}
            <div className="flex items-center space-x-4">
  {/* Company Logo */}
  <div className="flex-shrink-0">
  <Image
    src="/nanjil-logo.jpg"
    alt="Company Logo"
    width={200}
    height={200}
    className="h-12 w-auto"  // smaller size
  />
</div>


  

  {/* Mobile menu button */}
  <button
    onClick={() => setShowMobileMenu(!showMobileMenu)}
    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
  >
    {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
  </button>
</div>


            {/* Center - Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                // Skip auth-required items if not signed in
                if (item.requiresAuth && !isSignedIn) return null
                
                const Icon = item.icon
                const isActive = currentPath === item.href
                
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                )
              })}
            </nav>

            {/* Right side - Language Toggle + User Actions */}
            <div className="flex items-center space-x-3">
              {/* Language Toggle Button */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title={getText('மொழி மாற்று', 'Change Language')}
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {language === 'ta' ? 'EN' : 'தமிழ்'}
                </span>
              </button>

              {/* Emergency Phone (Desktop) */}
              <a
                href="tel:9384851596-NANJIL"
                className="hidden xl:flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                title={getText('அவசர சேவை', 'Emergency Service')}
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">9384851596-NANJIL</span>
              </a>

              {isSignedIn ? (
                <>
                  {/* User info - Desktop only */}
                  <div className="hidden md:flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="bg-green-100 p-1 rounded-full">
                      <UserIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {user?.name || getText('வாடிக்கையாளர்', 'Customer')}
                      </p>
                      <p className="text-gray-500 text-xs capitalize">
                        {user?.role || 'customer'}
                      </p>
                    </div>
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={getText('வெளியேறு', 'Logout')}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:block text-sm">
                      {isLoggingOut 
                        ? getText('வெளியேறுகிறது...', 'Logging out...') 
                        : getText('வெளியேறு', 'Logout')
                      }
                    </span>
                  </button>
                </>
              ) : (
                /* Login/Register buttons for non-authenticated users */
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => login()}
                    className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:block text-sm">
                      {getText('உள்நுழை', 'Login')}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => router.push('/sign-up')}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:block text-sm">
                      {getText('பதிவு', 'Register')}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {/* Emergency Phone - Mobile */}
              <a
                href="tel:9384851596-NANJIL"
                className="flex items-center space-x-3 px-3 py-2 bg-red-500 text-white rounded-lg mb-3"
                onClick={() => setShowMobileMenu(false)}
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">
                  {getText('அவசர சேவை: 9384851596-NANJIL', 'Emergency: 9384851596-NANJIL')}
                </span>
              </a>

              {/* User info - Mobile (if signed in) */}
              {isSignedIn && user && (
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2 mb-3">
                  <div className="bg-green-100 p-1 rounded-full">
                    <UserIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Navigation items - Mobile */}
              {navigationItems.map((item) => {
                // Skip auth-required items if not signed in
                if (item.requiresAuth && !isSignedIn) return null
                
                const Icon = item.icon
                const isActive = currentPath === item.href
                
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href)
                      setShowMobileMenu(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                )
              })}

              {/* Mobile auth actions */}
              <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
                {isSignedIn ? (
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>
                      {isLoggingOut 
                        ? getText('வெளியேறுகிறது...', 'Logging out...') 
                        : getText('வெளியேறு', 'Logout')
                      }
                    </span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        login()
                        setShowMobileMenu(false)
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>{getText('உள்நுழை', 'Login')}</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        router.push('/sign-up')
                        setShowMobileMenu(false)
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>{getText('பதிவு', 'Register')}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}