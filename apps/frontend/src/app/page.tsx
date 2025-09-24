// File: app/page.tsx - Bilingual Homepage with Animated Booking Button
'use client'
import React, { useState, useEffect } from 'react'
import CustomerHeader from '@/components/CustomerHeader'
import { AnimatedBookingButton } from '@/components/AnimatedBookingButton'
import { 
  Phone, 
  MessageCircle, 
  Zap, 
  Wrench,
  CheckCircle,
  Star,
  Clock,
  MapPin
} from 'lucide-react'

// Language content
const content = {
  ta: {
    emergencyService: "அவசர சேவை",
    homeProblem: "🏠 மின்சாரம் அல்லது பிளம்பிங் பிரச்சனை இருக்கிறதா?",
    callImmediately: "உடனே அழையுங்கள் - நாங்கள் வந்து சரி செய்கிறோம்!",
    electrical: "மின்சாரம்",
    electricalDesc: "விசிறி, விளக்கு, ஸ்விட்ச்",
    plumbing: "குழாய்",
    plumbingDesc: "கசிவு, கழிவறை, தண்ணீர்",
    clickToCall: "📞 அழைக்க இங்கே அழுத்துங்கள்",
    whatsappMsg: "💬 WhatsApp மெசேஜ்",
    instantReply: "உடனே பதில்",
    whyChooseUs: "⭐ எங்களை ஏன் தேர்வு செய்ய வேண்டும்?",
    service247: "24/7 சேவை",
    service247Desc: "எந்த நேரமும் கிடைக்கிறோம்",
    reliableService: "நம்பகமான சேவை",
    reliableServiceDesc: "500+ மக்கள் நம்பிக்கை",
    nagercoilArea: "நாகர்கோவில் முழுவதும்",
    nagercoilAreaDesc: "எங்கு வேண்டுமானாலும் வருவோம்",
    whatWeFix: "🔧 நாங்கள் என்ன சரி செய்கிறோம்?",
    electricalProblems: "மின்சார பிரச்சனைகள்",
    plumbingProblems: "குழாய் பிரச்சனைகள்",
    fanNotWorking: "⚡ விசிறி வேலை செய்யலை",
    lightNotWorking: "💡 விளக்கு எரியலை",
    switchBroken: "🔌 ஸ்விட்ச் கெட்டுப் போச்சு",
    noPower: "⚡ கரண்ட் இல்லை",
    shortCircuit: "🔥 ஷார்ட் சர்க்யூட்",
    pipeLeak: "💧 குழாய் லீக் ஆகுது",
    noWater: "🚿 தண்ணீர் வரலை",
    toiletFlush: "🚽 டாய்லெட் ஃப்ளஷ் வேலை செய்யலை",
    heaterProblem: "🔥 ஹீட்டர் ஜடாவாய் இருக்கு",
    drainBlock: "🕳️ ட்ரைன் ப்ளாக் ஆகுது",
    priceFrom: "💰 ₹300 முதல் - என்ன பிரச்சனை என்று பார்த்து சொல்வோம்",
    plumbingPriceFrom: "💰 ₹350 முதல் - என்ன பிரச்சனை என்று பார்த்து சொல்வோம்",
    whatPeopleSay: "😊 மக்கள் என்ன சொல்றாங்க?",
    review1: "சூப்பர் சர்வீஸ்! விசிறி கெட்டுப் போனது, ஒரே நாள்ல வந்து சரி செஞ்சுட்டாங்க.",
    review2: "குழாய் லீக் ஆகிது, இவங்க வந்து உடனே சரி செஞ்சுட்டாங்க. நல்ல விலை.",
    review3: "நைட் டைம்ல கூட வந்துட்டாங்க. எமெர்ஜென்சி சர்வீஸ் ரொம்ப நல்லா இருக்கு.",
    emergencyServiceNeeded: "🚨 அவசர சேவை வேணுமா?",
    callNow24x7: "இப்பவே அழையுங்கள் - 24 மணி நேரமும் கிடைக்கிறோம்!",
    when: "⏰ எப்போ?",
    anytime: "24/7 - எந்த நேரமும்",
    where: "📍 எங்கே?",
    nagercoilSurrounding: "நாகர்கோவில் & சுற்றுப்புறம்",
    howFast: "⚡ எவ்வளவு சீக்கிரம்?",
    within2Hours: "2 மணி நேரத்தில்",
    footerDesc: "நாகர்கோவில்ல நம்பகமான மின்சாரம் & குழாய் சேவை",
    allRightsReserved: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளன."
  },
  en: {
    emergencyService: "Emergency Service",
    homeProblem: "🏠 Do you have an electrical or plumbing problem?",
    callImmediately: "Call us immediately - We'll come and fix it!",
    electrical: "Electrical",
    electricalDesc: "Fan, Light, Switch",
    plumbing: "Plumbing",
    plumbingDesc: "Leak, Toilet, Water",
    clickToCall: "📞 Click Here to Call",
    whatsappMsg: "💬 WhatsApp Message",
    instantReply: "Instant Reply",
    whyChooseUs: "⭐ Why Choose Us?",
    service247: "24/7 Service",
    service247Desc: "Available anytime",
    reliableService: "Reliable Service",
    reliableServiceDesc: "500+ people trust us",
    nagercoilArea: "All of Nagercoil",
    nagercoilAreaDesc: "We'll come anywhere",
    whatWeFix: "🔧 What Do We Fix?",
    electricalProblems: "Electrical Problems",
    plumbingProblems: "Plumbing Problems",
    fanNotWorking: "⚡ Fan not working",
    lightNotWorking: "💡 Light not working",
    switchBroken: "🔌 Switch broken",
    noPower: "⚡ No power",
    shortCircuit: "🔥 Short circuit",
    pipeLeak: "💧 Pipe leaking",
    noWater: "🚿 No water",
    toiletFlush: "🚽 Toilet flush not working",
    heaterProblem: "🔥 Water heater problem",
    drainBlock: "🕳️ Drain blocked",
    priceFrom: "💰 From ₹300 - We'll check and tell you the exact cost",
    plumbingPriceFrom: "💰 From ₹350 - We'll check and tell you the exact cost",
    whatPeopleSay: "😊 What People Say?",
    review1: "Super service! Fan was broken, they came and fixed it in one day.",
    review2: "Pipe was leaking, they came and fixed it immediately. Good price.",
    review3: "They came even at night time. Emergency service is very good.",
    emergencyServiceNeeded: "🚨 Need Emergency Service?",
    callNow24x7: "Call now - Available 24 hours!",
    when: "⏰ When?",
    anytime: "24/7 - Anytime",
    where: "📍 Where?",
    nagercoilSurrounding: "Nagercoil & Surrounding",
    howFast: "⚡ How Fast?",
    within2Hours: "Within 2 hours",
    footerDesc: "Trusted electrical & plumbing service in Nagercoil",
    allRightsReserved: "All rights reserved."
  }
}

export default function HomePage() {
  const [language, setLanguage] = useState<'ta' | 'en'>('ta')

  // Listen for language changes from CustomerHeader
  useEffect(() => {
    // Get initial language from localStorage
    const savedLanguage = localStorage.getItem('language') as 'ta' | 'en'
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // Listen for language changes from CustomerHeader
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail as 'ta' | 'en'
      setLanguage(newLanguage)
    }

    // Listen for the custom event dispatched by CustomerHeader
    window.addEventListener('languageChanged', handleLanguageChange as EventListener)

    // Also listen for storage changes as fallback
    const handleStorageChange = () => {
      const newLanguage = localStorage.getItem('language') as 'ta' | 'en'
      if (newLanguage && newLanguage !== language) {
        setLanguage(newLanguage)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [language])

  const t = content[language]

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced CustomerHeader with Language Toggle */}
      <CustomerHeader />

      {/* Animated Booking Button */}
      <AnimatedBookingButton language={language} />

      {/* Main Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Simple Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.homeProblem}
          </h1>
          <h2 className="text-xl md:text-2xl text-blue-600 font-semibold mb-8">
            {t.callImmediately}
          </h2>
          
          {/* What We Fix - Simple Icons */}
          <div className="grid grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
              <Zap className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t.electrical}</h3>
              <p className="text-sm text-gray-600">{t.electricalDesc}</p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
              <Wrench className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t.plumbing}</h3>
              <p className="text-sm text-gray-600">{t.plumbingDesc}</p>
            </div>
          </div>

          {/* Big Call Buttons */}
          <div className="space-y-4">
            <a
              href="tel:9384851596-NANJIL"
              className="block w-full max-w-md mx-auto bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {t.clickToCall}
              <div className="text-lg mt-1">9384851596-NANJIL</div>
            </a>
            
            <a
              href="https://wa.me/9384851596"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full max-w-md mx-auto bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {t.whatsappMsg}
              <div className="text-lg mt-1">{t.instantReply}</div>
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            {t.whyChooseUs}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">{t.service247}</h3>
              <p className="text-gray-600">{t.service247Desc}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">{t.reliableService}</h3>
              <p className="text-gray-600">{t.reliableServiceDesc}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <MapPin className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">{t.nagercoilArea}</h3>
              <p className="text-gray-600">{t.nagercoilAreaDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            {t.whatWeFix}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Electrical */}
            <div className="bg-yellow-50 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Zap className="w-8 h-8 text-yellow-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">{t.electricalProblems}</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t.fanNotWorking}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t.lightNotWorking}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t.switchBroken}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t.noPower}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t.shortCircuit}</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800">
                  {t.priceFrom}
                </p>
              </div>
            </div>

            {/* Plumbing */}
            <div className="bg-blue-50 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Wrench className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">{t.plumbingProblems}</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t.pipeLeak}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t.noWater}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t.toiletFlush}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t.heaterProblem}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t.drainBlock}</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-sm font-semibold text-blue-800">
                  {t.plumbingPriceFrom}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            {t.whatPeopleSay}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-lg">ர</span>
                </div>
                <div>
                  <h4 className="font-bold">ராஜா குமார்</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">"{t.review1}"</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-lg">ச</span>
                </div>
                <div>
                  <h4 className="font-bold">சுந்தரி அம்மாள்</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">"{t.review2}"</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold text-lg">ம</span>
                </div>
                <div>
                  <h4 className="font-bold">முருகன் சார்</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">"{t.review3}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t.emergencyServiceNeeded}
          </h2>
          <p className="text-xl mb-8">
            {t.callNow24x7}
          </p>
          
          <div className="space-y-4">
  <a
    href="tel:9384851596"
    className="inline-block bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-6 px-12 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 mr-4"
  >
    📞 9384851596-NANJIL
  </a>
  
  <a
    href="https://wa.me/919384851596" // Use full international format (91 for India)
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-green-600 hover:bg-green-700 text-white text-2xl font-bold py-6 px-12 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
  >
    💬 WhatsApp
  </a>
</div>


          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-bold text-xl mb-2">{t.when}</h4>
              <p className="opacity-90">{t.anytime}</p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2">{t.where}</h4>
              <p className="opacity-90">{t.nagercoilSurrounding}</p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2">{t.howFast}</h4>
              <p className="opacity-90">{t.within2Hours}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-4">நாஞ்சில் MEP சேவை</h3>
          <p className="text-gray-400 mb-4">
            {t.footerDesc}
          </p>
          <div className="space-y-2 text-gray-400">
            <p>📞 9384851596-NANJIL</p>
            <p>📧 sksenterprisesm@gmail.com</p>
            <p>📍 Peyodu Junction, Saral Post-629203</p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-500">&copy; 2026 நாஞ்சில் MEP Services. {t.allRightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}