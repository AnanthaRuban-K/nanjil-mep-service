// File: components/AdminHeader.tsx - Enhanced Admin Header
'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, 
  LogOut, 
  User as UserIcon, 
  Home,
  Bell,
  Loader,
  BarChart3,
  Calendar,
  Users,
  Settings,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Image from "next/image";

interface AdminHeaderProps {
  title?: string
  subtitle?: string
}

export default function AdminHeader({ 
  title = "நாஞ்சில் MEP Admin Dashboard", 
  subtitle = "நிர்வாக பொரிவு" 
}: AdminHeaderProps) {
  const router = useRouter()
  const { user, logout, isLoggingOut } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = async () => {
    const confirm = window.confirm('Are you sure you want to logout? நீங்கள் நிச்சயமாக வெளியேற விரும்புகிறீர்களா?')
    if (confirm) {
      await logout('/')
    }
  }

  const navigationItems = [
    {
      name: 'Dashboard',
      nameTA: 'டாஷ்போர்ட்',
      href: '/admin/dashboard',
      icon: BarChart3
    },
    {
      name: 'Bookings',
      nameTA: 'பதிவுகள்',
      href: '/admin/bookings',
      icon: Calendar
    },
    {
      name: 'Customers',
      nameTA: 'வாடிக்கையாளர்கள்',
      href: '/admin/customers',
      icon: Users
    },
    {
      name: 'Settings',
      nameTA: 'அமைப்புகள்',
      href: '/admin/settings',
      icon: Settings
    }
  ]

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

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
  width={100}
  height={100}
  className="h-10 w-auto"
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


            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPath === item.href
                
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:block">{item.name}</span>
                    <span className="xl:hidden text-xs">{item.nameTA}</span>
                  </button>
                )
              })}
            </nav>

            {/* Right side - User info and actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications - Desktop only */}
              <button className="hidden md:flex p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User info - Desktop only */}
              <div className="hidden md:flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
                <div className="bg-blue-100 p-1 rounded-full">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-gray-500 text-xs capitalize">
                    {user?.role || 'admin'}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Go to Home"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden lg:block text-sm">Home</span>
                </button>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Logout"
                >
                  {isLoggingOut ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span className="hidden lg:block text-sm">
                    {isLoggingOut ? 'Logging out...' : 'வெளியேறு'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {/* User info - Mobile */}
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2 mb-3">
                <div className="bg-blue-100 p-1 rounded-full">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name || 'Admin'}</p>
                  <p className="text-gray-500 text-xs">{user?.email}</p>
                </div>
              </div>

              {/* Navigation items - Mobile */}
              {navigationItems.map((item) => {
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
                    <span>{item.nameTA} • {item.name}</span>
                  </button>
                )
              })}

              {/* Mobile actions */}
              <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
                <button
                  onClick={() => {
                    router.push('/')
                    setShowMobileMenu(false)
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span>Home • முகப்பு</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <LogOut className="w-5 h-5" />
                  )}
                  <span>{isLoggingOut ? 'Logging out...' : 'வெளியேறு • Logout'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}