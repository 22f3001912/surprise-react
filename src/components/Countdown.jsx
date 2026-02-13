import { useState, useEffect } from 'react'

export default function Countdown({ targetDate, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(() => calcTime(targetDate))

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

    if (!timeLeft) return null

    return (
        <div className="container">
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
        </div>
    )
}
