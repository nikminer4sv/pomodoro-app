import { useTimerStore, type Mode } from '../../store/useTimerStore'
import { resumeAudio } from '../../utils/audio'

const MODE_VAR: Record<Mode, string> = {
  focus: 'var(--color-mode-focus)',
  short: 'var(--color-mode-short)',
  long:  'var(--color-mode-long)',
}
const MODE_GLOW_VAR: Record<Mode, string> = {
  focus: 'var(--color-mode-focus-glow)',
  short: 'var(--color-mode-short-glow)',
  long:  'var(--color-mode-long-glow)',
}

export function Controls() {
  const { isRunning, mode, start, pause, reset } = useTimerStore()
  const accent = MODE_VAR[mode]
  const glow   = MODE_GLOW_VAR[mode]

  const handlePlayPause = async () => {
    await resumeAudio()
    isRunning ? pause() : start()
  }

  return (
    <div className="flex items-center gap-4">
      <IconButton onClick={reset} label="Reset timer" accent={accent}>
        <ResetIcon />
      </IconButton>

      {/* Play / Pause */}
      <button
        onClick={handlePlayPause}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        className="cursor-pointer flex items-center justify-center rounded-full transition-all duration-200 active:scale-95"
        style={{
          width: 64, height: 64,
          background: `linear-gradient(135deg, ${accent}22, ${accent}11)`,
          border: `1.5px solid ${accent}50`,
          boxShadow: isRunning
            ? `0 0 28px ${glow}, 0 0 60px ${glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
            : '0 0 0 0 transparent',
          color: accent,
          transition: 'box-shadow 0.4s ease, border-color 0.4s ease, color 0.4s ease',
        }}
      >
        {isRunning ? <PauseIcon /> : <PlayIcon />}
      </button>

      <IconButton
        onClick={() => useTimerStore.getState().completeSession()}
        label="Skip to next session"
        accent={accent}
      >
        <SkipIcon />
      </IconButton>
    </div>
  )
}

function IconButton({ onClick, label, children, accent }: {
  onClick: () => void; label: string; children: React.ReactNode; accent: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="cursor-pointer flex items-center justify-center rounded-full transition-all duration-200 active:scale-90"
      style={{
        width: 44, height: 44,
        background: 'transparent',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-muted)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.color = accent
        el.style.borderColor = `${accent}40`
        el.style.background = `${accent}10`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.color = 'var(--color-text-muted)'
        el.style.borderColor = 'var(--color-border)'
        el.style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )
}

function PlayIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
}
function PauseIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
}
function ResetIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
}
function SkipIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18V6l8.5 6L6 18zm8.5 0V6H17v12h-2.5z" /></svg>
}
