import { useTimerStore, type Mode } from '../../store/useTimerStore'

const MODES: { id: Mode; label: string }[] = [
  { id: 'focus', label: 'Focus' },
  { id: 'short', label: 'Short' },
  { id: 'long',  label: 'Long' },
]

const MODE_VAR: Record<Mode, string> = {
  focus: 'var(--color-mode-focus)',
  short: 'var(--color-mode-short)',
  long:  'var(--color-mode-long)',
}

export function ModeSelector() {
  const { mode, setMode } = useTimerStore()

  return (
    <div
      role="tablist"
      aria-label="Timer mode"
      className="flex items-center gap-1 rounded-full p-1"
      style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
    >
      {MODES.map(({ id, label }) => {
        const isActive = mode === id
        const color = MODE_VAR[id]
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => setMode(id)}
            className="relative cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300"
            style={{
              fontFamily: 'var(--font-sans)',
              color: isActive ? color : 'var(--color-text-muted)',
              background: isActive ? 'var(--color-bg-elevated)' : 'transparent',
              boxShadow: isActive ? `0 0 12px ${color}25, inset 0 1px 0 rgba(255,255,255,0.06)` : 'none',
              border: isActive ? `1px solid ${color}30` : '1px solid transparent',
              transform: isActive ? 'scale(1)' : 'scale(0.97)',
              letterSpacing: '0.02em',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
