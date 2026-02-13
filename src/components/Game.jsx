import { useState, useEffect, useRef, useCallback } from 'react'

const GAME_DURATION = 30
const TARGET_SCORE = 15
const HEART_EMOJIS = ['❤️', '💖', '💗', '💕', '💓', '🩷', '💘']
const DECOY_EMOJIS = ['💔', '🖤', '🩶']
const POWER_UP_EMOJI = '⭐'

const MILESTONE_MESSAGES = [
    { score: 3, text: "You're doing great babe! 🥰" },
    { score: 6, text: "So good at catching love! 💪💕" },
    { score: 9, text: "Almost halfway there! 🔥" },
    { score: 12, text: "You're unstoppable! 😍" },
    { score: 14, text: "One more! You got this! 🎯💖" },
]

const ENCOURAGEMENTS = [
    "Nice catch! 💖",
    "Love it! 😍",
    "Amazing! ✨",
    "You're a natural! 🌟",
    "Keep going! 💕",
    "So sweet! 🍬",
    "Perfect! 👏",
]

let nextId = 0

export default function Game({ onWin }) {
    const [score, setScore] = useState(0)
    const [timer, setTimer] = useState(GAME_DURATION)
    const [items, setItems] = useState([])
    const [popups, setPopups] = useState([])
    const [gameOver, setGameOver] = useState(false)
    const [milestoneMsg, setMilestoneMsg] = useState(null)
    const [screenFlash, setScreenFlash] = useState(null)
    const arenaRef = useRef(null)
    const gameActiveRef = useRef(true)
    const scoreRef = useRef(0)
    const shownMilestones = useRef(new Set())

    useEffect(() => { scoreRef.current = score }, [score])

    // Check milestones
    useEffect(() => {
        const milestone = MILESTONE_MESSAGES.find(
            m => m.score === score && !shownMilestones.current.has(m.score)
        )
        if (milestone) {
            shownMilestones.current.add(milestone.score)
            setMilestoneMsg(milestone.text)
            setTimeout(() => setMilestoneMsg(null), 2000)
        }
    }, [score])

    // Game timer
    useEffect(() => {
        if (gameOver) return
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    if (scoreRef.current < TARGET_SCORE) {
                        gameActiveRef.current = false
                        setGameOver(true)
                    }
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [gameOver])

    // Spawn items
    useEffect(() => {
        if (gameOver) return
        const interval = setInterval(() => {
            if (!gameActiveRef.current) return
            const rand = Math.random()
            // 10% power-up, 65% heart, 25% decoy
            let emoji, type
            if (rand < 0.10) {
                emoji = POWER_UP_EMOJI
                type = 'powerup'
            } else if (rand < 0.75) {
                emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)]
                type = 'heart'
            } else {
                emoji = DECOY_EMOJIS[Math.floor(Math.random() * DECOY_EMOJIS.length)]
                type = 'decoy'
            }

            const arenaWidth = arenaRef.current?.clientWidth || 400
            const left = Math.random() * (arenaWidth - 50)

            setItems(prev => [...prev, {
                id: nextId++,
                emoji,
                type,
                left,
                createdAt: Date.now(),
            }])
        }, 800)
        return () => clearInterval(interval)
    }, [gameOver])

    // Clean up fallen items
    useEffect(() => {
        const cleanup = setInterval(() => {
            setItems(prev => prev.filter(item => Date.now() - item.createdAt < 5000))
        }, 500)
        return () => clearInterval(cleanup)
    }, [])

    // Clean up popups
    useEffect(() => {
        const cleanup = setInterval(() => {
            setPopups(prev => prev.filter(p => Date.now() - p.createdAt < 800))
        }, 300)
        return () => clearInterval(cleanup)
    }, [])

    const handleClick = useCallback((item, e) => {
        if (!gameActiveRef.current) return

        const rect = e.currentTarget.getBoundingClientRect()
        const arenaRect = arenaRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
        const popupPos = {
            left: rect.left - arenaRect.left,
            top: rect.top - arenaRect.top,
        }

        setItems(prev => prev.filter(i => i.id !== item.id))

        if (item.type === 'heart') {
            setScore(prev => {
                const newScore = prev + 1
                if (newScore >= TARGET_SCORE) {
                    gameActiveRef.current = false
                    setTimeout(() => onWin(), 600)
                }
                return newScore
            })
            const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
            setPopups(prev => [...prev, {
                id: nextId++,
                text: `+1 ${msg}`,
                color: '#ffd700',
                ...popupPos,
                createdAt: Date.now(),
            }])
            setScreenFlash('pink')
            setTimeout(() => setScreenFlash(null), 200)
        } else if (item.type === 'powerup') {
            setScore(prev => {
                const newScore = Math.min(prev + 3, TARGET_SCORE)
                if (newScore >= TARGET_SCORE) {
                    gameActiveRef.current = false
                    setTimeout(() => onWin(), 600)
                }
                return newScore
            })
            setPopups(prev => [...prev, {
                id: nextId++,
                text: '+3 SUPER LOVE! ⭐✨',
                color: '#ffd700',
                ...popupPos,
                createdAt: Date.now(),
                isSuper: true,
            }])
            setScreenFlash('gold')
            setTimeout(() => setScreenFlash(null), 300)
        } else {
            setScore(prev => Math.max(0, prev - 1))
            setPopups(prev => [...prev, {
                id: nextId++,
                text: '-1 Oops! 💔',
                color: '#ff4444',
                ...popupPos,
                createdAt: Date.now(),
            }])
            setScreenFlash('red')
            setTimeout(() => setScreenFlash(null), 200)
        }
    }, [onWin])

    const retryGame = useCallback(() => {
        setScore(0)
        setTimer(GAME_DURATION)
        setItems([])
        setPopups([])
        setGameOver(false)
        setMilestoneMsg(null)
        gameActiveRef.current = true
        scoreRef.current = 0
        shownMilestones.current = new Set()
    }, [])

    const progress = Math.min((score / TARGET_SCORE) * 100, 100)

    return (
        <div className="game-section active">
            {/* Screen flash effect */}
            {screenFlash && (
                <div className={`screen-flash screen-flash-${screenFlash}`} />
            )}

            {/* Milestone message */}
            {milestoneMsg && (
                <div className="milestone-message">
                    {milestoneMsg}
                </div>
            )}

            <div className="game-header">
                <div className="game-title-area">
                    <h2 className="game-title">Catch My Love</h2>
                    <p className="game-instruction">
                        💖 = +1 &nbsp; ⭐ = +3 &nbsp; 💔 = -1
                    </p>
                </div>
                <div className="game-stats">
                    <div className="score-display">
                        <span className="score-icon">💖</span>
                        <span>{score}</span>
                        <span className="score-total">/ {TARGET_SCORE}</span>
                    </div>
                    <div className={`timer-display ${timer <= 10 ? 'timer-warning' : ''}`}>
                        <span className="timer-icon">⏰</span>
                        <span>{timer}</span>s
                    </div>
                </div>
            </div>

            <div className="love-progress-bar">
                <div className="love-progress-fill" style={{ width: `${progress}%` }} />
                <span className="progress-label">Love Meter</span>
            </div>

            <div className="game-arena" ref={arenaRef}>
                {!gameOver && items.map(item => (
                    <FallingItem key={item.id} item={item} arenaRef={arenaRef} onClick={handleClick} />
                ))}

                {popups.map(popup => (
                    <div
                        key={popup.id}
                        className={`score-popup ${popup.isSuper ? 'super-popup' : ''}`}
                        style={{ left: popup.left, top: popup.top, color: popup.color }}
                    >
                        {popup.text}
                    </div>
                ))}

                {gameOver && (
                    <div className="game-over-screen">
                        <div className="game-over-emoji">🥺💕</div>
                        <h2 className="game-over-title">Almost there!</h2>
                        <p className="game-over-text">
                            You collected {score} hearts!
                            <br />
                            <span className="game-over-encourage">I know you can do it babe! 💪</span>
                        </p>
                        <button className="retry-btn" onClick={retryGame}>
                            Try Again For Me? 🥹
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

function FallingItem({ item, arenaRef, onClick }) {
    const ref = useRef(null)
    const animRef = useRef(null)

    useEffect(() => {
        const el = ref.current
        const arena = arenaRef.current
        if (!el || !arena) return

        const fallDuration = item.type === 'powerup' ? 2500 : 3000 + Math.random() * 2000
        const startTime = Date.now()
        const arenaHeight = arena.clientHeight

        function animate() {
            const elapsed = Date.now() - startTime
            const progress = elapsed / fallDuration

            if (progress >= 1) {
                el.style.display = 'none'
                return
            }

            const sway = Math.sin(elapsed / 300) * 20
            el.style.top = (progress * arenaHeight) + 'px'
            el.style.transform = `translateX(${sway}px)`

            animRef.current = requestAnimationFrame(animate)
        }

        animRef.current = requestAnimationFrame(animate)
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
    }, [arenaRef, item.type])

    const className = item.type === 'powerup' ? 'game-powerup' : item.type === 'heart' ? 'game-heart' : 'game-decoy'

    return (
        <div
            ref={ref}
            className={className}
            style={{ left: item.left, top: -60, position: 'absolute' }}
            onClick={(e) => onClick(item, e)}
        >
            {item.emoji}
        </div>
    )
}
