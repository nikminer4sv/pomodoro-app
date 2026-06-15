import { useEffect, useState } from 'react'
import { useTimerStore, type SoundTheme, type Mode } from '../../store/useTimerStore'
import { playSound, resumeAudio } from '../../utils/audio'
import { PalettePicker } from './PalettePicker'
import { BgStylePicker } from './BgStylePicker'
import type { PaletteId, BgStyle } from '../../utils/palettes'

interface SettingsProps {
  open: boolean
  onClose: () => void
}

const SOUND_THEMES: { id: SoundTheme; label: string; desc: string }[] = [
  { id: 'zen',     label: 'Zen',     desc: 'Singing bowls' },
  { id: 'retro',   label: 'Retro',   desc: 'Chiptune' },
  { id: 'minimal', label: 'Minimal', desc: 'Clean sine' },
]

export function Settings({ open, onClose }: SettingsProps) {
  const { settings, updateSettings } = useTimerStore()

  const toMin = (s: number) => Math.round(s / 60)
  const [focus, setFocus] = useState(toMin(settings.durations.focus))
  const [short, setShort] = useState(toMin(settings.durations.short))
  const [long,  setLong]  = useState(toMin(settings.durations.long))

  useEffect(() => {
    setFocus(toMin(settings.durations.focus))
    setShort(toMin(settings.durations.short))
    setLong(toMin(settings.durations.long))
  }, [settings.durations])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const saveDurations = () => {
    const durations: Record<Mode, number> = {
      focus: Math.max(1, Math.min(99, focus)) * 60,
      short: Math.max(1, Math.min(99, short)) * 60,
      long:  Math.max(1, Math.min(99, long))  * 60,
    }
    updateSettings({ durations })
  }

  const previewSound = (theme: SoundTheme) => {
    resumeAudio().then(() => playSound(theme, 'end'))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Side Drawer */}
      <div
        role="dialog"
        aria-modal
        aria-label="Settings"
        className="fixed top-0 right-0 bottom-0 z-50"
        style={{
          width: 'min(88vw, 360px)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          background: 'var(--color-bg-surface)',
          borderLeft: '1px solid var(--color-border)',
          borderRadius: '20px 0 0 20px',
          paddingTop: 'env(safe-area-inset-top, 0)',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        <div className="px-5 pb-8 overflow-y-auto h-full" style={{ overscrollBehavior: 'contain' }}>
          {/* Header */}
          <div className="flex items-center justify-between py-4">
            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}>
              Settings
            </h2>
            <CloseButton onClose={onClose} />
          </div>

          {/* ── Appearance ── */}
          <Section label="Palette">
            <PalettePicker
              value={settings.paletteId}
              onChange={(id: PaletteId) => updateSettings({ paletteId: id })}
            />
          </Section>

          <Section label="Background">
            <BgStylePicker
              value={settings.bgStyle}
              paletteId={settings.paletteId}
              onChange={(style: BgStyle) => updateSettings({ bgStyle: style })}
            />
          </Section>

          {/* Divider */}
          <div className="my-2" style={{ height: 1, background: 'var(--color-border)' }} />

          {/* ── Timer ── */}
          <Section label="Durations">
            <div className="grid grid-cols-3 gap-3">
              <DurationInput label="Focus" value={focus} onChange={setFocus} onBlur={saveDurations} accent="var(--color-accent)" />
              <DurationInput label="Short" value={short} onChange={setShort} onBlur={saveDurations} accent="#34d399" />
              <DurationInput label="Long"  value={long}  onChange={setLong}  onBlur={saveDurations} accent="#60a5fa" />
            </div>
          </Section>

          {/* ── Sound ── */}
          <Section label="Sound Theme">
            <div className="flex flex-col gap-2">
              {SOUND_THEMES.map((t) => {
                const active = settings.soundTheme === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => { updateSettings({ soundTheme: t.id }); previewSound(t.id) }}
                    className="cursor-pointer flex items-center justify-between w-full rounded-xl px-4 py-3 text-left"
                    style={{
                      background: active ? 'var(--color-bg-elevated)' : 'transparent',
                      border: '1px solid var(--color-border)',
                      boxShadow: active ? '0 0 0 1px var(--color-accent)' : 'none',
                      color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      outline: 'none',
                      transition: 'background-color 150ms ease, color 150ms ease, box-shadow 150ms ease',
                    }}
                  >
                    <div>
                      <div className="text-sm font-medium">{t.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{t.desc}</div>
                    </div>
                    {active && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* ── Behaviour ── */}
          <Section label="Behaviour">
            <div className="flex flex-col gap-3">
              <Toggle label="Sound" desc="Play sounds on start & finish" value={settings.soundEnabled} onChange={(v) => updateSettings({ soundEnabled: v })} />
              <Toggle label="Auto-start" desc="Automatically start next session" value={settings.autoStart} onChange={(v) => updateSettings({ autoStart: v })} />
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      aria-label="Close settings"
      className="cursor-pointer flex items-center justify-center rounded-full transition-colors duration-150"
      style={{ width: 32, height: 32, color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', background: 'transparent' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function DurationInput({ label, value, onChange, onBlur, accent }: {
  label: string; value: number; onChange: (v: number) => void; onBlur: () => void; accent: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl p-3" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
      <style>{`
        .dur-input::-webkit-inner-spin-button,
        .dur-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .dur-input { -moz-appearance: textfield; appearance: textfield; }
      `}</style>
      <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
      <input
        type="number" min={1} max={99} value={value}
        onChange={(e) => onChange(Math.max(1, Math.min(99, Number(e.target.value))))}
        onBlur={onBlur}
        className="dur-input w-full text-center rounded-lg px-2 py-1.5 text-lg font-bold tabular-nums outline-none"
        style={{
          fontFamily: 'var(--font-display)',
          color: accent,
          background: 'var(--color-bg-surface)',
          border: `1px solid ${accent}25`,
        }}
        aria-label={`${label} duration in minutes`}
      />
      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>min</span>
    </div>
  )
}

function Toggle({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{label}</div>
        <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-muted)' }}>{desc}</div>
      </div>
      <button
        role="switch" aria-checked={value} aria-label={label}
        onClick={() => onChange(!value)}
        className="cursor-pointer relative rounded-full transition-all duration-300 flex-shrink-0"
        style={{
          width: 44, height: 24,
          background: value ? 'var(--color-accent)' : 'var(--color-bg-overlay)',
          border: value ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
          boxShadow: value ? 'var(--shadow-glow-sm)' : 'none',
        }}
      >
        <span
          className="absolute top-0.5 rounded-full transition-all duration-300"
          style={{ width: 18, height: 18, background: '#fff', left: value ? 22 : 2, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
        />
      </button>
    </div>
  )
}
