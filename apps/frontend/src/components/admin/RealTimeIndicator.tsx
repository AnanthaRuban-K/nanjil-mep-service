'use client'
import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff, Activity } from 'lucide-react'

export function RealTimeIndicator() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    // Simulate WebSocket connection status
    const checkConnection = () => {
      // In real implementation, check actual WebSocket status
      setIsConnected(navigator.onLine)
      setLastUpdate(new Date())
    }

    checkConnection()
    const interval = setInterval(checkConnection, 10000) // Check every 10 seconds

    window.addEventListener('online', checkConnection)
    window.addEventListener('offline', checkConnection)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', checkConnection)
      window.removeEventListener('offline', checkConnection)
    }
  }, [])

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
        isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {isConnected ? (
          <>
            <Wifi className="w-3 h-3" />
            <span>Live</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            <span>Offline</span>
          </>
        )}
      </div>
      {lastUpdate && (
        <span className="text-gray-500 text-xs">
          Last update: {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}
