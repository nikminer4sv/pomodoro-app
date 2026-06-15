import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PaletteId, BgStyle } from '../utils/palettes'

export type Mode = 'focus' | 'short' | 'long'
export type SoundTheme = 'zen' | 'retro' | 'minimal'

export interface Settings {
  durations: Record<Mode, number>
  soundTheme: SoundTheme
  soundEnabled: boolean
  autoStart: boolean
  paletteId: PaletteId
  bgStyle: BgStyle
}

interface Stats {
  count: number
  date: string
}

interface TimerState {
  mode: Mode
  secondsLeft: number
  isRunning: boolean
  sessionIndex: number
  pomodorosToday: Stats
  settings: Settings

  setMode: (mode: Mode) => void
  tick: () => void
  start: () => void
  pause: () => void
  reset: () => void
  completeSession: () => void
  incrementPomodoro: () => void
  updateSettings: (patch: Partial<Settings>) => void
}

const DEFAULT_SETTINGS: Settings = {
  durations: { focus: 25 * 60, short: 5 * 60, long: 15 * 60 },
  soundTheme: 'zen',
  soundEnabled: true,
  autoStart: false,
  paletteId: 'cosmic',
  bgStyle: 'aurora',
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      mode: 'focus',
      secondsLeft: DEFAULT_SETTINGS.durations.focus,
      isRunning: false,
      sessionIndex: 0,
      pomodorosToday: { count: 0, date: todayISO() },
      settings: DEFAULT_SETTINGS,

      setMode: (mode) => {
        const { settings } = get()
        set({ mode, secondsLeft: settings.durations[mode], isRunning: false })
      },

      tick: () => {
        const { secondsLeft } = get()
        if (secondsLeft > 0) set({ secondsLeft: secondsLeft - 1 })
      },

      start: () => set({ isRunning: true }),
      pause: () => set({ isRunning: false }),

      reset: () => {
        const { mode, settings } = get()
        set({ secondsLeft: settings.durations[mode], isRunning: false })
      },

      completeSession: () => {
        const { mode, sessionIndex, settings } = get()
        let nextMode: Mode
        let nextSessionIndex = sessionIndex

        if (mode === 'focus') {
          nextSessionIndex = sessionIndex + 1
          nextMode = nextSessionIndex % 4 === 0 ? 'long' : 'short'
        } else {
          nextMode = 'focus'
        }

        set({
          mode: nextMode,
          sessionIndex: nextSessionIndex,
          secondsLeft: settings.durations[nextMode],
          isRunning: settings.autoStart,
        })
      },

      incrementPomodoro: () => {
        const { pomodorosToday } = get()
        const today = todayISO()
        const current = pomodorosToday.date === today ? pomodorosToday.count : 0
        set({ pomodorosToday: { count: current + 1, date: today } })
      },

      updateSettings: (patch) => {
        const { settings, mode } = get()
        const next = { ...settings, ...patch }
        if (patch.durations) {
          next.durations = { ...settings.durations, ...patch.durations }
        }
        // Only reset the timer when the current mode's duration actually changes
        const durationChanged = patch.durations?.[mode] !== undefined
        set({
          settings: next,
          ...(durationChanged && {
            secondsLeft: patch.durations![mode] as number,
            isRunning: false,
          }),
        })
      },
    }),
    {
      name: 'pomodoro-store',
      partialize: (state) => ({
        settings: state.settings,
        pomodorosToday: state.pomodorosToday,
        sessionIndex: state.sessionIndex,
      }),
      // Migrate old persisted data that may be missing paletteId / bgStyle
      merge: (persisted, current) => {
        const p = persisted as Partial<TimerState>
        return {
          ...current,
          ...p,
          settings: {
            ...DEFAULT_SETTINGS,
            ...(p.settings ?? {}),
          },
        }
      },
    }
  )
)
