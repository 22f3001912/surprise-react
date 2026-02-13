import { useState, useEffect } from 'react'
import FloatingHearts from './components/FloatingHearts'
import Countdown from './components/Countdown'
import Transition from './components/Transition'
import Game from './components/Game'
import Reveal from './components/Reveal'
import './App.css'

// PHASES: countdown → transition → game → reveal
const PHASES = {
  COUNTDOWN: 'countdown',
  TRANSITION: 'transition',
  GAME: 'game',
  REVEAL: 'reveal',
}

// Target Date: February 14, 2026 (Tomorrow!)
const TARGET_DATE = new Date('February 14, 2026 00:00:00').getTime()

function App() {
  const [phase, setPhase] = useState(() => {
    // If target date already passed, skip to transition
    const isPast = Date.now() >= TARGET_DATE
    console.log('Target Date:', new Date(TARGET_DATE).toLocaleString())
    console.log('Current Date:', new Date().toLocaleString())
    console.log('Is Past:', isPast)
    return isPast ? PHASES.TRANSITION : PHASES.COUNTDOWN
  })

  useEffect(() => {
    console.log('Current Phase:', phase)
  }, [phase])

  return (
    <>
      <div style={{ position: 'fixed', bottom: 0, left: 0, padding: 5, fontSize: 10, color: 'rgba(255,255,255,0.5)', zIndex: 9999 }}>
        Debug Phase: {phase}
      </div>

      {phase === PHASES.COUNTDOWN && <FloatingHearts />}

      {phase === PHASES.COUNTDOWN && (
        <Countdown
          targetDate={TARGET_DATE}
          onComplete={() => setPhase(PHASES.TRANSITION)}
        />
      )}

      {phase === PHASES.TRANSITION && (
        <Transition onPlay={() => setPhase(PHASES.GAME)} />
      )}

      {phase === PHASES.GAME && (
        <Game onWin={() => setPhase(PHASES.REVEAL)} />
      )}

      {phase === PHASES.REVEAL && <Reveal />}
    </>
  )
}

export default App
