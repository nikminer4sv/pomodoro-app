import { useTimerStore } from '../../store/useTimerStore'

export function Stats() {
  const { pomodorosToday, sessionIndex } = useTimerStore()

  // Reset if stale date
  const today = new Date().toISOString().split('T')[0]
  const count = pomodorosToday.date === today ? pomodorosToday.count : 0

  // Progress in current 4-session cycle (0–3)
  const cyclePos = sessionIndex % 4

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Session cycle dots */}
      <div className="flex items-center gap-2" aria-label={`${cyclePos} of 4 sessions in current cycle`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: i < cyclePos ? 20 : 8,
              height: 6,
              background: i < cyclePos
                ? 'var(--color-accent)'
                : 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              boxShadow: i < cyclePos ? 'var(--shadow-glow-sm)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Today's count */}
      <div
        className="text-xs font-medium tracking-wide"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}
      >
        {count === 0
          ? 'No sessions yet today'
          : `${count} session${count === 1 ? '' : 's'} today`}
      </div>
    </div>
  )
}
