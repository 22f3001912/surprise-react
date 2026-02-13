import { useState, useEffect, useRef, useCallback } from 'react'

const GAME_DURATION = 30
const TARGET_SCORE = 15
const HEART_EMOJIS = ['❤️', '💖', '💗', '💕', '💓', '🩷', '💘']
const DECOY_EMOJIS = ['💔', '🖤', '🩶']

let nextId = 0

export default function Game({ onWin }) {
    const [score, setScore] = useState(0)
    const [timer, setTimer] = useState(GAME_DURATION)
    const [items, setItems] = useState([])
    const [popups, setPopups] = useState([])
    const [gameOver, setGameOver] = useState(false)
    const arenaRef = useRef(null)
    const gameActiveRef = useRef(true)
    const scoreRef = useRef(0)

    // Keep scoreRef in sync
    useEffect(() => { scoreRef.current = score }, [score])

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
            const isHeart = Math.random() > 0.25
            const emoji = isHeart
                ? HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)]
                : DECOY_EMOJIS[Math.floor(Math.random() * DECOY_EMOJIS.length)]

            const arenaWidth = arenaRef.current?.clientWidth || 400
            const left = Math.random() * (arenaWidth - 50)

            setItems(prev => [...prev, {
                id: nextId++,
                emoji,
                isHeart,
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

        // Remove the clicked item
        setItems(prev => prev.filter(i => i.id !== item.id))

        if (item.isHeart) {
            setScore(prev => {
                const newScore = prev + 1
                if (newScore >= TARGET_SCORE) {
                    gameActiveRef.current = false
                    setTimeout(() => onWin(), 600)
                }
                return newScore
            })
            setPopups(prev => [...prev, {
                id: nextId++,
                text: '+1 💖',
                color: '#ffd700',
                left: rect.left - arenaRect.left,
                top: rect.top - arenaRect.top,
                createdAt: Date.now(),
            }])
        } else {
            setScore(prev => Math.max(0, prev - 1))
            setPopups(prev => [...prev, {
                id: nextId++,
                text: '-1 💔',
                color: '#ff4444',
                left: rect.left - arenaRect.left,
                top: rect.top - arenaRect.top,
                createdAt: Date.now(),
            }])
        }
    }, [onWin])

    const retryGame = useCallback(() => {
        setScore(0)
        setTimer(GAME_DURATION)
        setItems([])
        setPopups([])
        setGameOver(false)
        gameActiveRef.current = true
        scoreRef.current = 0
    }, [])

    const progress = Math.min((score / TARGET_SCORE) * 100, 100)

    return (
        <div className="game-section active">
            <div className="game-header">
                <div className="game-title-area">
                    <h2 className="game-title">Catch My Love</h2>
                    <p className="game-instruction">Click the falling hearts to collect love!</p>
                </div>
                <div className="game-stats">
                    <div className="score-display">
                        <span className="score-icon">💖</span>
                        <span>{score}</span>
                        <span className="score-total">/ {TARGET_SCORE}</span>
                    </div>
                    <div className="timer-display">
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
                        className="score-popup"
                        style={{ left: popup.left, top: popup.top, color: popup.color }}
                    >
                        {popup.text}
                    </div>
                ))}

                {gameOver && (
                    <div className="game-over-screen">
                        <h2 className="game-over-title">Almost there! 💕</h2>
                        <p className="game-over-text">You collected {score} hearts! Try once more...</p>
                        <button className="retry-btn" onClick={retryGame}>Try Again 💪</button>
                    </div>
                )}
            </div>
        </div>
    )
}

// Falling item with animation using requestAnimationFrame
function FallingItem({ item, arenaRef, onClick }) {
    const ref = useRef(null)
    const animRef = useRef(null)

    useEffect(() => {
        const el = ref.current
        const arena = arenaRef.current
        if (!el || !arena) return

        const fallDuration = 3000 + Math.random() * 2000
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

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current)
        }
    }, [arenaRef])

    return (
        <div
            ref={ref}
            className={item.isHeart ? 'game-heart' : 'game-decoy'}
            style={{ left: item.left, top: -60, position: 'absolute' }}
            onClick={(e) => onClick(item, e)}
        >
            {item.emoji}
        </div>
    )
}
