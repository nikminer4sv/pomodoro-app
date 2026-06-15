import { useEffect, useRef } from 'react'
import { useTimerStore } from '../store/useTimerStore'
import { playSound } from '../utils/audio'
import { useNotifications } from './useNotifications'

export function useTimer() {
  const {
    isRunning, mode, secondsLeft, settings,
    completeSession, incrementPomodoro,
  } = useTimerStore()

  const { notify } = useNotifications()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Track previous secondsLeft to detect completion
  const prevSecondsRef = useRef(secondsLeft)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        useTimerStore.getState().tick()
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  // Detect when timer reaches zero
  useEffect(() => {
    const prev = prevSecondsRef.current
    prevSecondsRef.current = secondsLeft

    if (prev > 0 && secondsLeft === 0 && isRunning) {
      // Play end sound
      if (settings.soundEnabled) {
        playSound(settings.soundTheme, 'end')
      }

      // Count completed focus sessions
      if (mode === 'focus') {
        incrementPomodoro()
        notify('Focus session complete!', { body: 'Time for a break.' })
      } else {
        notify('Break over!', { body: 'Ready to focus again?' })
      }

      // Auto-advance
      completeSession()
    }
  }, [secondsLeft])

  // Update document title
  useEffect(() => {
    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
    const ss = String(secondsLeft % 60).padStart(2, '0')
    const label = mode === 'focus' ? '🎯' : '☕'
    document.title = isRunning ? `${label} ${mm}:${ss} — Focus` : 'Focus'
    return () => { document.title = 'Focus' }
  }, [secondsLeft, isRunning, mode])

  // Play start sound when timer starts
  const prevRunningRef = useRef(isRunning)
  useEffect(() => {
    if (isRunning && !prevRunningRef.current && settings.soundEnabled) {
      playSound(settings.soundTheme, 'start')
    }
    prevRunningRef.current = isRunning
  }, [isRunning])
}
