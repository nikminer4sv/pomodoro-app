import { useTimerStore } from '../store/useTimerStore'
import { playSound, resumeAudio } from '../utils/audio'

export function useSound() {
  const { settings } = useTimerStore()

  const play = async (type: 'tick' | 'start' | 'end') => {
    if (!settings.soundEnabled) return
    await resumeAudio()
    playSound(settings.soundTheme, type)
  }

  return { play }
}
