import { useState, useEffect } from 'react'

const LOVE_QUOTES = [
    "You're the reason I believe in love 💕",
    "My heart beats only for you 💓",
    "Every love story is beautiful, but ours is my favorite 🥰",
    "You had me at hello ✨",
    "I fall in love with you more every day 🌹",
    "You're my today and all of my tomorrows 💫",
    "In a sea of people, my eyes will always search for you 👀💗",
    "You make my heart skip a beat 💘",
    "I love you to the moon and back 🌙",
    "You're the missing piece I've been looking for 🧩❤️",
]

export default function Countdown({ targetDate, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(() => calcTime(targetDate))
    const [quoteIndex, setQuoteIndex] = useState(0)
    const [quoteFade, setQuoteFade] = useState(true)

    function calcTime(target) {
        const gap = target - Date.now()
        if (gap <= 0) return null
        const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24
        return {
            days: String(Math.floor(gap / day)).padStart(2, '0'),
            hours: String(Math.floor((gap % day) / hour)).padStart(2, '0'),
            minutes: String(Math.floor((gap % hour) / minute)).padStart(2, '0'),
            seconds: String(Math.floor((gap % minute) / second)).padStart(2, '0'),
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const t = calcTime(targetDate)
            if (!t) {
                clearInterval(interval)
                onComplete()
                return
            }
            setTimeLeft(t)
        }, 1000)
        return () => clearInterval(interval)
    }, [targetDate, onComplete])

    // Rotate quotes every 4 seconds with fade
    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteFade(false)
            setTimeout(() => {
                setQuoteIndex(prev => (prev + 1) % LOVE_QUOTES.length)
                setQuoteFade(true)
            }, 500)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    if (!timeLeft) return null

    return (
        <div className="container">
            <div className="love-emoji-float">💑</div>
            <h1>A Little Surprise for You</h1>
            <p className="subtitle">Until February 14, 2026</p>
            <div className="countdown">
                {[
                    { value: timeLeft.days, label: 'Days' },
                    { value: timeLeft.hours, label: 'Hours' },
                    { value: timeLeft.minutes, label: 'Minutes' },
                    { value: timeLeft.seconds, label: 'Seconds' },
                ].map(({ value, label }) => (
                    <div className="time-block" key={label}>
                        <span>{value}</span>
                        <span className="label">{label}</span>
                    </div>
                ))}
            </div>
            <p className="message">Every second brings me closer to you ❤️</p>
            <div className={`love-quote ${quoteFade ? 'visible' : ''}`}>
                {LOVE_QUOTES[quoteIndex]}
            </div>
        </div>
    )
}
