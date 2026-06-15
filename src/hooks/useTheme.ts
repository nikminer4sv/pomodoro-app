import { useEffect } from 'react'
import { useTimerStore } from '../store/useTimerStore'
import { PALETTES, applyPalette } from '../utils/palettes'

export function useTheme() {
  const paletteId = useTimerStore((s) => s.settings.paletteId)

  useEffect(() => {
    const palette = PALETTES[paletteId] ?? PALETTES.cosmic
    applyPalette(palette)
  }, [paletteId])
}

// Call this before React renders to avoid flash (used in main.tsx)
export function applyInitialTheme() {
  try {
    const raw = localStorage.getItem('pomodoro-store')
    if (raw) {
      const parsed = JSON.parse(raw)
      const id = parsed?.state?.settings?.paletteId
      if (id && PALETTES[id as keyof typeof PALETTES]) {
        applyPalette(PALETTES[id as keyof typeof PALETTES])
        return
      }
    }
  } catch {
    // ignore
  }
  applyPalette(PALETTES.cosmic)
}
