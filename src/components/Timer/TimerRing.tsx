import { useTimerStore, type Mode } from '../../store/useTimerStore'

const SIZE = 280
const STROKE = 6
const R = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * R

// CSS var names — resolved at runtime so they respond to palette changes
const MODE_VARS: Record<Mode, { stroke: string; glow: string; text: string }> = {
  focus: {
    stroke: 'var(--color-mode-focus)',
    glow:   'var(--color-mode-focus-glow)',
    text:   'var(--color-mode-focus)',
  },
  short: {
    stroke: 'var(--color-mode-short)',
    glow:   'var(--color-mode-short-glow)',
    text:   'var(--color-mode-short)',
  },
  long: {
    stroke: 'var(--color-mode-long)',
    glow:   'var(--color-mode-long-glow)',
    text:   'var(--color-mode-long)',
  },
}

export function TimerRing() {
  const { secondsLeft, settings, mode, isRunning } = useTimerStore()
  const total = settings.durations[mode]
  const progress = total > 0 ? secondsLeft / total : 0
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  const vars = MODE_VARS[mode]
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  const glowId = `glow-${mode}`

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        overflow="visible"
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden
      >
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track — becomes the full accent ring when at 100% to avoid rounded-cap seam */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          stroke={progress >= 0.999 ? vars.stroke : 'rgba(255,255,255,0.05)'}
          strokeWidth={STROKE}
          filter={progress >= 0.999 ? `url(#${glowId})` : undefined}
          style={{ transition: 'stroke 0.6s ease' }}
        />

        {/* Progress arc — only when partially filled (avoids cap overlap at 0%/100%) */}
        {progress > 0.005 && progress < 0.999 && (
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none"
            stroke={vars.stroke}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            filter={`url(#${glowId})`}
            style={{
              transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1), stroke 0.6s ease',
              willChange: 'stroke-dashoffset',
            }}
          />
        )}

        {/* Moving dot — always in DOM, fades in/out via opacity to avoid abrupt mount */}
        <DotAtAngle progress={progress} r={R} color={vars.stroke} size={SIZE} show={progress < 0.999} />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="tabular-nums leading-none font-bold tracking-tight"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(52px, 14vw, 72px)',
            color: vars.text,
            textShadow: isRunning
              ? `0 0 24px ${vars.glow}, 0 0 48px ${vars.glow}`
              : 'none',
            transition: 'text-shadow 0.5s ease, color 0.6s ease',
          }}
          aria-live="polite"
          aria-atomic
        >
          {mm}
          <span
            className="opacity-70"
            style={{ animation: isRunning ? 'pulse-colon 1s step-start infinite' : 'none' }}
          >
            :
          </span>
          {ss}
        </div>

        <div
          className="mt-2 uppercase tracking-[0.25em] text-xs font-medium"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', transition: 'color 0.6s ease' }}
        >
          {mode === 'focus' ? 'Focus' : mode === 'short' ? 'Short Break' : 'Long Break'}
        </div>
      </div>

      <style>{`
        @keyframes pulse-colon {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  )
}

function DotAtAngle({ progress, r, color, size, show }: {
  progress: number; r: number; color: string; size: number; show: boolean
}) {
  // SVG is CSS-rotated -90deg, so no math offset needed — the rotation handles clock-start
  const angle = 2 * Math.PI * progress
  const cx = size / 2 + r * Math.cos(angle)
  const cy = size / 2 + r * Math.sin(angle)

  return (
    <circle
      cx={cx} cy={cy} r={5}
      fill={color}
      style={{
        filter: `drop-shadow(0 0 6px ${color})`,
        opacity: show ? 1 : 0,
        transition: 'opacity 0.7s ease, cx 0.9s cubic-bezier(0.4,0,0.2,1), cy 0.9s cubic-bezier(0.4,0,0.2,1)',
      }}
    />
  )
}
