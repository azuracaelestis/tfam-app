'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import type { UseAudioReturn } from './useAudio'

const MOCK_DURATION = 300 // 5:00

export function useMockAudio(): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  // Ref holds authoritative time so interval never has a stale closure,
  // and seek/skipForward/replay can update it synchronously.
  const currentTimeRef = useRef(0)

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => {
      const next = Math.min(currentTimeRef.current + 0.1, MOCK_DURATION)
      currentTimeRef.current = next
      setCurrentTime(next)
      if (next >= MOCK_DURATION) setIsPlaying(false)
    }, 100)
    return () => clearInterval(id)
  }, [isPlaying])

  const play = useCallback(() => setIsPlaying(true), [])
  const pause = useCallback(() => setIsPlaying(false), [])

  const seek = useCallback((t: number) => {
    const clamped = Math.max(0, Math.min(t, MOCK_DURATION))
    currentTimeRef.current = clamped
    setCurrentTime(clamped)
  }, [])

  const replay = useCallback(() => {
    currentTimeRef.current = 0
    setCurrentTime(0)
    setIsPlaying(true)
  }, [])

  const skipForward = useCallback((secs = 15) => {
    const next = Math.min(currentTimeRef.current + secs, MOCK_DURATION)
    currentTimeRef.current = next
    setCurrentTime(next)
  }, [])

  return { isPlaying, currentTime, duration: MOCK_DURATION, play, pause, seek, replay, skipForward }
}
