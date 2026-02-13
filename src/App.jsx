import { useState } from 'react'
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

const TARGET_DATE = new Date('February 13, 2026 22:45:00').getTime()

function App() {
  const [phase, setPhase] = useState(() => {
    // If target date already passed, skip to transition
    return Date.now() >= TARGET_DATE ? PHASES.TRANSITION : PHASES.COUNTDOWN
  })

  return (
    <>
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
