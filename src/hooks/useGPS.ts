import { useState, useCallback } from 'react'

interface GPSPosition {
  lat: number
  lng: number
  accuracy: number
}

interface UseGPSResult {
  position: GPSPosition | null
  isLoading: boolean
  error: string | null
  capture: () => Promise<GPSPosition | null>
}

export function useGPS(): UseGPSResult {
  const [position, setPosition] = useState<GPSPosition | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const capture = useCallback(async (): Promise<GPSPosition | null> => {
    if (!navigator.geolocation) {
      setError('خدمة الموقع غير مدعومة على هذا الجهاز')
      return null
    }

    setIsLoading(true)
    setError(null)

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const result: GPSPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          }
          setPosition(result)
          setIsLoading(false)
          resolve(result)
        },
        (err) => {
          const msg =
            err.code === err.PERMISSION_DENIED
              ? 'تم رفض الوصول إلى الموقع'
              : 'تعذر تحديد الموقع'
          setError(msg)
          setIsLoading(false)
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    })
  }, [])

  return { position, isLoading, error, capture }
}
