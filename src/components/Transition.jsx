export default function Transition({ onPlay }) {
    return (
        <div className="transition-overlay active">
            <div className="transition-content">
                <div className="big-heart-burst">❤️</div>
                <h2 className="transition-text">The wait is over...</h2>
                <p className="transition-sub">But first, a little game for you 💕</p>
                <button className="play-btn" onClick={onPlay}>
                    Let&apos;s Play! 🎮
                </button>
            </div>
        </div>
    )
}
