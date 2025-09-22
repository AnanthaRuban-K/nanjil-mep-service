'use client'
import React, { useState } from 'react'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Zap,
  Wrench,
  Shield,
  Star,
  Menu,
  X,
  Home
} from 'lucide-react'

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    priority: 'normal',
    message: '',
    address: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState<'tamil' | 'english'>('tamil')

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tamil' ? 'english' : 'tamil')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call - replace with actual booking creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        phone: '',
        email: '',
        serviceType: '',
        priority: 'normal',
        message: '',
        address: ''
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Translation objects
  const t = {
    tamil: {
      companyName: 'நஞ்சில் MEP சேவை',
      companyTagline: 'மின் மற்றும் குழாய் சேவைகள்',
      emergencyCall: 'அவசர அழைப்பு',
      call: 'அழை',
      switchToEnglish: 'English',
      pageTitle: 'தொடர்பு கொள்ளுங்கள்',
      pageSubtitle: 'நாங்கள் உங்களுக்கு உதவ தயாராக உள்ளோம்',
      electrical: 'மின் வேலை',
      plumbing: 'குழாய் வேலை',
      service247: '24/7 சேவை',
      contactInfo: 'தொடர்பு விவரங்கள்',
      contactDescription: 'உங்கள் மின் மற்றும் குழாய் பிரச்சனைகளுக்கு உடனடி தீர்வு பெற எங்களை தொடர்பு கொள்ளுங்கள்',
      phoneCall: 'அழைப்பு',
      emergency247: '24/7 அவசர சேவை',
      immediateResponse: 'உடனடி பதில்',
      whatsapp: 'வாட்ஸ்ஆப்',
      quickService: 'விரைவு சேவை',
      instantReply: 'உடனடி பதில்',
      email: 'மின்னஞ்சல்',
      detailedInquiries: 'விரிவான விசாரணைகளுக்கு',
      reply24hours: '24 மணி நேரத்தில் பதில்',
      serviceArea: 'சேவை பகுதி',
      serviceAreaDesc: 'நாகர்கோவில் மற்றும் சுற்றுப்பகுதிகள்',
      serviceHours: 'சேவை நேரம்',
      regularService: 'சாதாரண சேவை',
      emergencyService: 'அவசர சேவை',
      holidays: 'விடுமுறை நாட்கள்',
      available: 'Available',
      serviceRequest: 'சேவை கோரிக்கை',
      successMessage: 'உங்கள் கோரிக்கை வெற்றிகரமாக அனுப்பப்பட்டது!',
      errorMessage: 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்',
      name: 'பெயர்',
      phone: 'தொலைபேசி',
      address: 'முகவரி',
      serviceType: 'சேவை வகை',
      selectService: 'தேர்ந்தெடுக்கவும்',
      priority: 'முன்னுரிமை',
      normal: 'சாதாரண',
      urgent: 'அவசர',
      emergency: 'அவசரமான',
      problemDescription: 'பிரச்சனை விவரங்கள்',
      submitRequest: 'சேவை கோரிக்கை அனுப்பு',
      sending: 'அனுப்புகிறோம்...',
      emergencyServiceNote: 'அவசர சேவைக்கு',
      emergencyNote: 'உடனடி உதவிக்கு +91 94866 12345 என்ற எண்ணை அழைக்கவும்',
      whyChooseUs: 'எங்களை ஏன் தேர்ந்தெடுக்க வேண்டும்?',
      alwaysAvailable: 'Always Available',
      reliableService: 'நம்பகமான சேவை',
      qualityGuarantee: 'உத்தரவாதம்',
      quickResponse: 'விரைவு பதில்',
      needHelp: 'உடனடி உதவி தேவையா?',
      emergencyCallUs: '24/7 அவசர சேவைக்கு எங்களை அழைக்கவும்',
      placeholderName: 'உங்கள் பெயர்',
      placeholderAddress: 'உங்கள் முகவரி',
      placeholderProblem: 'உங்கள் பிரச்சனையை விரிவாக விவரிக்கவும்'
    },
    english: {
      companyName: 'Nanjil MEP Service',
      companyTagline: 'Electrical & Plumbing Services',
      emergencyCall: 'Emergency',
      call: 'Call',
      switchToEnglish: 'தமிழ்',
      pageTitle: 'Contact Us',
      pageSubtitle: 'We\'re Here to Help You',
      electrical: 'Electrical',
      plumbing: 'Plumbing',
      service247: '24/7 Service',
      contactInfo: 'Contact Information',
      contactDescription: 'Get instant solutions for your electrical and plumbing problems by contacting us',
      phoneCall: 'Phone Call',
      emergency247: '24/7 Emergency Service',
      immediateResponse: 'Immediate Response',
      whatsapp: 'WhatsApp',
      quickService: 'Quick Service',
      instantReply: 'Instant Reply',
      email: 'Email',
      detailedInquiries: 'For Detailed Inquiries',
      reply24hours: 'Reply within 24 hours',
      serviceArea: 'Service Area',
      serviceAreaDesc: 'Nagercoil & Surrounding Areas',
      serviceHours: 'Service Hours',
      regularService: 'Regular Service',
      emergencyService: 'Emergency Service',
      holidays: 'Holidays',
      available: 'Available',
      serviceRequest: 'Service Request',
      successMessage: 'Your request has been submitted successfully!',
      errorMessage: 'Something went wrong. Please try again.',
      name: 'Name',
      phone: 'Phone',
      address: 'Address',
      serviceType: 'Service Type',
      selectService: 'Select Service',
      priority: 'Priority',
      normal: 'Normal',
      urgent: 'Urgent',
      emergency: 'Emergency',
      problemDescription: 'Problem Description',
      submitRequest: 'Submit Service Request',
      sending: 'Sending...',
      emergencyServiceNote: 'For Emergency Service',
      emergencyNote: 'Call +91 94866 12345 for immediate assistance',
      whyChooseUs: 'Why Choose Us?',
      alwaysAvailable: 'Always Available',
      reliableService: 'Reliable Service',
      qualityGuarantee: 'Quality Guarantee',
      quickResponse: 'Quick Response',
      needHelp: 'Need Immediate Help?',
      emergencyCallUs: 'Call us for 24/7 emergency service',
      placeholderName: 'Your name',
      placeholderAddress: 'Your address',
      placeholderProblem: 'Describe your problem in detail'
    }
  }

  // Get current translations
  const currentLang = t[language]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {currentLang.companyName}
                </h1>
                <p className="text-xs text-gray-600">
                  {currentLang.companyTagline}
                </p>
              </div>
            </div>

            {/* Language Toggle and Emergency Contact */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Language Toggle Button */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium">
                  {currentLang.switchToEnglish}
                </span>
              </button>

              {/* Emergency Contact */}
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {currentLang.emergencyCall}
                </p>
                <p className="text-sm font-bold text-blue-600">+91 94866 12345</p>
              </div>
              <a
                href="tel:+919486612345"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>{currentLang.call}</span>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
              {/* Mobile Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium">
                  {language === 'tamil' ? 'Switch to English' : 'தமிழில் மாற்று'}
                </span>
              </button>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">
                  {currentLang.emergencyCall}
                </p>
                <a
                  href="tel:+919486612345"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 w-fit"
                >
                  <Phone className="w-4 h-4" />
                  <span>+91 94866 12345</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {currentLang.pageTitle}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {currentLang.pageSubtitle}
            </p>
            <div className="flex items-center justify-center space-x-8 text-blue-100">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>{currentLang.electrical}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5" />
                <span>{currentLang.plumbing}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>{currentLang.service247}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {currentLang.contactInfo}
              </h2>
              <p className="text-gray-600 mb-8">
                {currentLang.contactDescription}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm border">
                <div className="bg-blue-100 rounded-lg p-3">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentLang.phoneCall}
                  </h3>
                  <p className="text-gray-600 mb-2">{currentLang.emergency247}</p>
                  <p className="text-2xl font-bold text-blue-600">+91 94866 12345</p>
                  <p className="text-gray-500 text-sm">{currentLang.immediateResponse}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm border">
                <div className="bg-green-100 rounded-lg p-3">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentLang.whatsapp}
                  </h3>
                  <p className="text-gray-600 mb-2">{currentLang.quickService}</p>
                  <p className="text-xl font-bold text-green-600">+91 94866 12345</p>
                  <p className="text-gray-500 text-sm">{currentLang.instantReply}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm border">
                <div className="bg-purple-100 rounded-lg p-3">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentLang.email}
                  </h3>
                  <p className="text-gray-600 mb-2">{currentLang.detailedInquiries}</p>
                  <p className="text-lg font-bold text-purple-600">info@nanjilmep.com</p>
                  <p className="text-gray-500 text-sm">{currentLang.reply24hours}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm border">
                <div className="bg-orange-100 rounded-lg p-3">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentLang.serviceArea}
                  </h3>
                  <p className="text-gray-600 mb-2">{currentLang.serviceAreaDesc}</p>
                  <div className="text-gray-700">
                    <p>• Nagercoil • Kanyakumari</p>
                    <p>• Colachel • Padmanabhapuram</p>
                    <p>• Thuckalay • Marthandam</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm border">
                <div className="bg-red-100 rounded-lg p-3">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentLang.serviceHours}
                  </h3>
                  <div className="text-gray-700 space-y-1">
                    <p><strong>{currentLang.regularService}:</strong> 8:00 AM - 8:00 PM</p>
                    <p><strong>{currentLang.emergencyService}:</strong> 24/7</p>
                    <p><strong>{currentLang.holidays}:</strong> {currentLang.available}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentLang.serviceRequest}
            </h2>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-green-800">
                    {currentLang.successMessage}
                  </p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-800">
                    {currentLang.errorMessage}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentLang.name} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={currentLang.placeholderName}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentLang.phone} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang.address} *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={currentLang.placeholderAddress}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentLang.serviceType} *
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{currentLang.selectService}</option>
                    <option value="electrical">{currentLang.electrical}</option>
                    <option value="plumbing">{currentLang.plumbing}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentLang.priority}
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="normal">{currentLang.normal}</option>
                    <option value="urgent">{currentLang.urgent}</option>
                    <option value="emergency">{currentLang.emergency}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang.problemDescription} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={currentLang.placeholderProblem}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{currentLang.sending}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{currentLang.submitRequest}</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">{currentLang.emergencyServiceNote}:</p>
                  <p>{currentLang.emergencyNote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {currentLang.whyChooseUs}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentLang.service247}</h3>
              <p className="text-gray-600">{currentLang.alwaysAvailable}</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentLang.reliableService}</h3>
              <p className="text-gray-600">Reliable Service</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentLang.qualityGuarantee}</h3>
              <p className="text-gray-600">Quality Guarantee</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentLang.quickResponse}</h3>
              <p className="text-gray-600">Quick Response</p>
            </div>
          </div>
        </div>

        {/* Quick Contact Actions */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              {currentLang.needHelp}
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {currentLang.emergencyCallUs}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:+919486612345"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>+91 94866 12345</span>
              </a>
              <a
                href="https://wa.me/919486612345"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}