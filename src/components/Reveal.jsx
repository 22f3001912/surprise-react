import { useEffect, useRef } from 'react'

const CONFETTI_COLORS = ['#ff4d6d', '#ffd700', '#ff8fa3', '#ffffff', '#c9184a', '#ffaa00', '#ee9ca7']

export default function Reveal() {
    const confettiRef = useRef(null)

    useEffect(() => {
        const canvas = confettiRef.current
        if (!canvas) return

        function createConfettiPiece() {
            const piece = document.createElement('div')
            piece.className = 'confetti-piece'
            piece.style.left = Math.random() * 100 + 'vw'
            piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
            piece.style.width = Math.random() * 10 + 5 + 'px'
            piece.style.height = Math.random() * 10 + 5 + 'px'
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
            piece.style.animationDuration = Math.random() * 3 + 2 + 's'
            piece.style.animationDelay = Math.random() * 0.5 + 's'
            canvas.appendChild(piece)
            setTimeout(() => piece.remove(), 5500)
        }

        // Initial burst
        for (let i = 0; i < 60; i++) {
            setTimeout(() => createConfettiPiece(), i * 30)
        }

        // Continuous gentle confetti
        const interval = setInterval(() => {
            for (let i = 0; i < 5; i++) createConfettiPiece()
        }, 400)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="reveal-section active">
            <div className="confetti-canvas" ref={confettiRef} />
            <div className="reveal-container">
                <div className="sparkle-ring" />
                <h1 className="reveal-title">You Did It! 🎉</h1>
                <div className="reveal-card">
                    <div className="reveal-emoji">✈️🛕</div>
                    <h2 className="reveal-destination">We&apos;re going to</h2>
                    <h1 className="reveal-place">Ujjain!</h1>
                    <div className="reveal-date-box">
                        <span className="reveal-calendar">📅</span>
                        <span className="reveal-date">April 2nd, 2026</span>
                    </div>
                    <div className="reveal-divider" />
                    <p className="reveal-message">And the best part?</p>
                    <h2 className="reveal-coming">I&apos;m coming to meet you! 💕</h2>
                    <div className="reveal-hearts-row">
                        <span>💖</span><span>💗</span><span>💓</span><span>💞</span><span>💝</span>
                    </div>
                </div>
                <p className="reveal-footer">Can&apos;t wait to make memories with you ❤️</p>
            </div>
        </div>
    )
}
