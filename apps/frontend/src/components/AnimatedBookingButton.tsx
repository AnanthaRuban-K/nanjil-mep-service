// Enhanced AnimatedBookingButton.tsx - More User-Friendly & Responsive
import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Zap, X, MessageCircle } from 'lucide-react';

interface AnimatedBookingButtonProps {
  language?: 'ta' | 'en';
}

export function AnimatedBookingButton({ language = 'ta' }: AnimatedBookingButtonProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const getText = (ta: string, en: string) => language === 'ta' ? ta : en;

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show promotional banner after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setShowBanner(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  // Hide button when user scrolls to footer
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const footerTop = footer.offsetTop;
        const scrollPosition = window.scrollY + window.innerHeight;
        setIsVisible(scrollPosition < footerTop + 200);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Layout */}
      {isMobile ? (
        <>
          {/* Mobile - Bottom Fixed Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl px-2 py-3">
            <div className="flex items-center justify-between gap-2 max-w-screen-xl mx-auto">
              {/* Call Button */}
              <a
                href="tel:9384851596"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3.5 rounded-xl shadow-lg transition-all duration-300 active:scale-95 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity"></div>
                <Phone className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-sm">
                  {getText('அழைக்க', 'Call')}
                </span>
              </a>

              {/* Book Service Button - More Prominent */}
              <button
                onClick={() => window.location.href = '/services'}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3.5 rounded-xl shadow-lg transition-all duration-300 active:scale-95 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity"></div>
                <Calendar className="w-5 h-5" />
                <span className="font-bold text-sm">
                  {getText('பதிவு', 'Book')}
                </span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              </button>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/919384851596"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-3.5 rounded-xl shadow-lg transition-all duration-300 active:scale-95 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity"></div>
                <MessageCircle className="w-5 h-5" />
                <span className="font-bold text-sm">
                  {getText('சாட்', 'Chat')}
                </span>
              </a>
            </div>
          </div>

          {/* Floating Quick Book Button - Enhanced */}
          <div className="fixed bottom-24 right-4 z-40">
            <div className="relative group">
              {/* Multiple pulsing rings for more attention */}
              <div className="absolute inset-0 animate-ping">
                <div className="w-16 h-16 bg-blue-400 rounded-full opacity-75"></div>
              </div>
              <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.5s' }}>
                <div className="w-16 h-16 bg-blue-300 rounded-full opacity-60"></div>
              </div>
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              
              {/* Main floating button */}
              <button
                onClick={() => window.location.href = '/services'}
                className="relative flex flex-col items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white rounded-full shadow-2xl transition-all duration-300 transform active:scale-90"
              >
                <Calendar className="w-6 h-6 mb-0.5" />
                <span className="text-[9px] font-bold leading-tight">
                  {getText('பதிவு', 'BOOK')}
                </span>
                {/* Notification badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  !
                </div>
              </button>

              {/* Tooltip */}
              <div className="absolute right-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shadow-xl">
                  {getText('சேவை பதிவு செய்யுங்கள்!', 'Book Service Now!')}
                  <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Desktop Layout - Enhanced */
        <>
          {/* Desktop - Floating Action Buttons Group */}
          <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-4">
            {/* Call Button */}
            <div className="relative group">
              <div className="absolute inset-0 animate-ping">
                <div className="w-16 h-16 bg-green-400 rounded-full opacity-75"></div>
              </div>
              <a
                href="tel:9384851596"
                className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110"
              >
                <Phone className="w-8 h-8" />
              </a>
              
              {/* Enhanced Tooltip */}
              <div className="absolute right-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl">
                  📞 {getText('உடனே அழையுங்கள்!', 'Call Now!')}
                  <div className="text-xs opacity-75 mt-1">9384851596</div>
                  <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <div className="relative group">
              <a
                href="https://wa.me/919384851596"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110"
              >
                <MessageCircle className="w-8 h-8" />
              </a>
              
              <div className="absolute right-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl">
                  💬 {getText('WhatsApp செய்யுங்கள்', 'WhatsApp Us')}
                  <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop - Enhanced Book Service Button (Left Side) */}
          <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50">
            <div className="relative group">
              {/* Glowing effect - Enhanced */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-lg opacity-50 animate-ping"></div>
              
              {/* Main booking button - More prominent */}
              <button
                onClick={() => window.location.href = '/services'}
                className="relative flex items-center gap-3 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white px-8 py-5 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                {/* Animated icon with badge */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"></div>
                  <Calendar className="w-7 h-7 relative z-10" />
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                    !
                  </div>
                </div>
                
                {/* Text content */}
                <div className="text-left">
                  <span className="block text-lg font-bold leading-tight">
                    {getText('சேவை பதிவு செய்யுங்கள்', 'Book Service Now')}
                  </span>
                  <span className="block text-sm opacity-90 font-semibold">
                    {getText('₹300 முதல் | 24/7', 'From ₹300 | 24/7')}
                  </span>
                </div>
                
                {/* Animated arrow */}
                <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
              </button>
            </div>
          </div>
        </>
      )}

      

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: ${isMobile ? 'translateY(-100%)' : 'translate(-50%, -100%)'};
            opacity: 0;
          }
          to {
            transform: ${isMobile ? 'translateY(0)' : 'translate(-50%, 0)'};
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -10px, 0);
          }
          70% {
            transform: translate3d(0, -5px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .animate-ping {
            animation-duration: 2s;
          }
          
          .animate-pulse {
            animation-duration: 3s;
          }
        }
      `}</style>
    </>
  );
}

export default AnimatedBookingButton;