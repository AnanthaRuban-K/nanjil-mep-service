// apps/frontend/src/hooks/useRealtimeBookings.ts
import { useState, useEffect, useCallback } from 'react'

interface ContactInfo {
  name: string
  phone: string
  address: string
}

interface Booking {
  id: number
  bookingNumber: string
  serviceType: 'electrical' | 'plumbing'
  priority: 'normal' | 'urgent' | 'emergency'
  description: string
  contactInfo: ContactInfo
  scheduledTime: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
  totalCost: string
  location?: {
    lat: number
    lng: number
  }
}

interface DashboardStats {
  totalBookings: number
  todayBookings: number
  pendingBookings: number
  emergencyBookings: number
  completedToday: number
  revenue: number
}

interface Notification {
  id: number
  message: string
  time: Date
  type: 'info' | 'warning' | 'error' | 'success'
  bookingId?: number
}

export const useRealtimeBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    todayBookings: 0,
    pendingBookings: 0,
    emergencyBookings: 0,
    completedToday: 0,
    revenue: 0
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [ws, setWs] = useState<WebSocket | null>(null)

  // Calculate stats from bookings
  const calculateStats = useCallback((bookingList: Booking[]) => {
    const today = new Date().toDateString()
    
    return {
      totalBookings: bookingList.length,
      todayBookings: bookingList.filter(b => 
        new Date(b.createdAt).toDateString() === today
      ).length,
      pendingBookings: bookingList.filter(b => b.status === 'pending').length,
      emergencyBookings: bookingList.filter(b => b.priority === 'emergency').length,
      completedToday: bookingList.filter(b => 
        b.status === 'completed' && 
        new Date(b.createdAt).toDateString() === today
      ).length,
      revenue: bookingList
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + parseInt(b.totalCost), 0)
    }
  }, [])

  // Add new notification
  const addNotification = useCallback((message: string, type: 'info' | 'warning' | 'error' | 'success', bookingId?: number) => {
    const notification: Notification = {
      id: Date.now(),
      message,
      time: new Date(),
      type,
      bookingId
    }
    
    setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Keep last 10 notifications
  }, [])

  // Handle new booking
  const handleNewBooking = useCallback((booking: Booking) => {
    setBookings(prev => {
      const updated = [booking, ...prev]
      setStats(calculateStats(updated))
      return updated
    })

    // Add notification
    const priorityText = booking.priority === 'emergency' ? 'Emergency' : 
                        booking.priority === 'urgent' ? 'Urgent' : 'New'
    addNotification(
      `${priorityText} ${booking.serviceType} booking from ${booking.contactInfo.name}`,
      booking.priority === 'emergency' ? 'error' : 'info',
      booking.id
    )
  }, [calculateStats, addNotification])

  // Handle booking update
  const handleBookingUpdate = useCallback((updatedBooking: Booking) => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === updatedBooking.id ? updatedBooking : b)
      setStats(calculateStats(updated))
      return updated
    })

    addNotification(
      `Booking ${updatedBooking.bookingNumber} status updated to ${updatedBooking.status}`,
      'success',
      updatedBooking.id
    )
  }, [calculateStats, addNotification])

  // Initialize WebSocket connection
  useEffect(() => {
    // In production, replace with your WebSocket server URL
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://your-api-domain.com/ws' 
      : 'ws://localhost:3101/ws'

    // For demo purposes, we'll simulate WebSocket with mock data
    // Replace this with actual WebSocket connection in production
    const simulateWebSocket = () => {
      setIsConnected(true)
      
      // Load initial mock data
      const mockBookings: Booking[] = [
        {
          id: 1,
          bookingNumber: 'NMS240907001',
          serviceType: 'electrical',
          priority: 'emergency',
          description: 'மின்சாரம் போகுது, பெட்ரூம் ஃபான் ஓடவில்லை - Main power cut, bedroom fan not working, sparking from switch board',
          contactInfo: {
            name: 'ராஜேஷ் குமார்',
            phone: '9876543210',
            address: 'No.15/2A, காமராஜ் தெரு, தாமரைகுளம், நாகர்கோவில் - 629001'
          },
          scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          totalCost: '450',
          location: { lat: 8.1741, lng: 77.4036 }
        },
        {
          id: 2,
          bookingNumber: 'NMS240907002',
          serviceType: 'plumbing',
          priority: 'urgent',
          description: 'குளியலறை குழாய் நீர் கசிவு, தரையில் தண்ணீர் வந்து கொண்டிருக்கிறது - Bathroom pipe leakage, water flooding on floor',
          contactInfo: {
            name: 'சுமித்ரா தேவி',
            phone: '9876543211',
            address: 'No.28B, விவேகானந்த தெரு, வடக்கு நாகர்கோவில் - 629002'
          },
          scheduledTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          status: 'confirmed',
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          totalCost: '350'
        },
        {
          id: 3,
          bookingNumber: 'NMS240907003',
          serviceType: 'electrical',
          priority: 'normal',
          description: 'கிச்சன் லைட் ஓடவில்லை, சுவிட்ச் போர்ட் loose ஆக உள்ளது - Kitchen light not working, switch loose',
          contactInfo: {
            name: 'முருகன் பிள்ளை',
            phone: '9876543212',
            address: 'No.42/1, தியாகராஜர் தெரு, கோட்டார், நாகர்கோவில் - 629003'
          },
          scheduledTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          status: 'in_progress',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          totalCost: '250'
        }
      ]

      setBookings(mockBookings)
      setStats(calculateStats(mockBookings))

      // Simulate receiving new bookings every 30-60 seconds
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of new booking
          const newBooking: Booking = {
            id: Date.now(),
            bookingNumber: `NMS${Date.now().toString().slice(-8)}`,
            serviceType: Math.random() > 0.5 ? 'electrical' : 'plumbing',
            priority: Math.random() > 0.8 ? 'emergency' : Math.random() > 0.6 ? 'urgent' : 'normal',
            description: Math.random() > 0.5 
              ? 'மின்சாரம் சம்பந்தப்பட்ட பிரச்சினை - Electrical issue reported'
              : 'பிளம்பிங் பிரச்சினை - Plumbing issue reported',
            contactInfo: {
              name: ['ராம் குமார்', 'லக்ஷ்மி தேவி', 'கண்ணன் நாயர்', 'ப்ரியா ராஜ்', 'வெங்கடேஷ் ஐயர்'][Math.floor(Math.random() * 5)],
              phone: `98765432${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
              address: `No.${Math.floor(Math.random() * 100)}/A, ${['காமராஜ் தெரு', 'வி.வேகானந்த தெரு', 'தியாகராஜர் தெரு', 'மகாத்மா காந்தி தெரு'][Math.floor(Math.random() * 4)]}, நாகர்கோவில்`
            },
            scheduledTime: new Date(Date.now() + Math.random() * 8 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            totalCost: (Math.floor(Math.random() * 300) + 200).toString()
          }
          
          handleNewBooking(newBooking)
        }
      }, 30000) // Every 30 seconds

      return () => clearInterval(interval)
    }

    const cleanup = simulateWebSocket()

    // Uncomment this for actual WebSocket implementation:
    /*
    try {
      const websocket = new WebSocket(wsUrl)
      
      websocket.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setWs(websocket)
      }
      
      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          switch (data.type) {
            case 'new_booking':
              handleNewBooking(data.booking)
              break
            case 'booking_update':
              handleBookingUpdate(data.booking)
              break
            case 'initial_data':
              setBookings(data.bookings)
              setStats(calculateStats(data.bookings))
              break
            default:
              console.log('Unknown message type:', data.type)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      websocket.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        setWs(null)
      }
      
      websocket.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
      }
      
      return () => {
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.close()
        }
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setIsConnected(false)
    }
    */

    return cleanup
  }, [calculateStats, handleNewBooking, handleBookingUpdate])

  // Function to send updates (for when admin updates booking status)
  const updateBookingStatus = useCallback((bookingId: number, newStatus: string) => {
    // Update local state immediately (optimistic update)
    setBookings(prev => {
      const updated = prev.map(b => 
        b.id === bookingId 
          ? { ...b, status: newStatus as any }
          : b
      )
      setStats(calculateStats(updated))
      return updated
    })

    // In production, send update to server via WebSocket or API
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'update_booking_status',
        bookingId,
        status: newStatus
      }))
    } else {
      // Mock API call
      console.log(`Updated booking ${bookingId} status to ${newStatus}`)
    }
  }, [ws, calculateStats])

  return {
    bookings,
    stats,
    notifications,
    isConnected,
    updateBookingStatus,
    clearNotifications: () => setNotifications([])
  }
}