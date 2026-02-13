import { useEffect, useRef } from 'react'

export default function FloatingHearts() {
    const containerRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        function createHeart() {
            const heart = document.createElement('div')
            heart.classList.add('heart')
            heart.style.left = Math.random() * 100 + 'vw'
            const size = Math.random() * 20 + 10 + 'px'
            heart.style.width = size
            heart.style.height = size
            heart.style.animationDuration = Math.random() * 5 + 10 + 's'
            container.appendChild(heart)
            setTimeout(() => heart.remove(), 15000)
        }

        const interval = setInterval(createHeart, 500)
        return () => clearInterval(interval)
    }, [])

    return <div className="background-animation" ref={containerRef} />
}
