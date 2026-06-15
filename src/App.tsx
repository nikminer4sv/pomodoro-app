import { useState } from 'react'
import { useTimer } from './hooks/useTimer'
import { useTheme } from './hooks/useTheme'
import { useTimerStore } from './store/useTimerStore'
import { Background } from './components/Background/Background'
import { TimerRing } from './components/Timer/TimerRing'
import { ModeSelector } from './components/ModeSelector/ModeSelector'
import { Controls } from './components/Controls/Controls'
import { Stats } from './components/Stats/Stats'
import { Settings } from './components/Settings/Settings'

function App() {
  useTimer()
  useTheme()


  const [settingsOpen, setSettingsOpen] = useState(false)
  const { settings, updateSettings } = useTimerStore()

  return (
    <div
      className="relative flex flex-col items-center justify-between"
      style={{
        minHeight: '100dvh',
        padding: 'env(safe-area-inset-top, 0) 0 env(safe-area-inset-bottom, 0)',
      }}
    >
      {/* Animated background — z-0 */}
      <Background />

      {/* All content sits above bg */}
      <header
        className="relative z-10 w-full flex items-center justify-between px-5 pt-4"
        style={{ maxWidth: 480, margin: '0 auto' }}
      >
        <div
          className="text-sm font-semibold tracking-[0.18em] uppercase"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}
        >
          focus
        </div>

        <div className="flex items-center gap-2">
          <TopBarButton
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            label={settings.soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {settings.soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
          </TopBarButton>
          <TopBarButton onClick={() => setSettingsOpen(true)} label="Open settings">
            <SettingsIcon />
          </TopBarButton>
        </div>
      </header>

      <main
        className="relative z-10 flex flex-col items-center gap-8 flex-1 justify-center px-4"
        style={{ maxWidth: 480, width: '100%', margin: '0 auto' }}
      >
        <ModeSelector />

        <div className="relative">
          {/* Ambient glow — large enough so blur(48px) never hits edges */}
          <div
            aria-hidden
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 600, height: 600,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 45%)',
              filter: 'blur(48px)',
              transition: 'background 0.8s ease',
              zIndex: -1,
            }}
          />
          <TimerRing />
        </div>

        <Controls />
        <Stats />
      </main>

      <div className="relative z-10 h-8" />

      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

function TopBarButton({ onClick, label, children }: {
  onClick: () => void; label: string; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="cursor-pointer flex items-center justify-center rounded-full transition-all duration-150"
      style={{
        width: 36, height: 36,
        color: 'var(--color-text-muted)',
        background: 'transparent',
        border: '1px solid var(--color-border)',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)'
        ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-surface)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'
        ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )
}

function SoundOnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}
function SoundOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export default App
