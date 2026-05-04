import { useMemo } from 'react'
import './CompletionScreen.css'

function CompletionScreen({ elapsedTime, onPlayAgain }) {
  const formattedTime = useMemo(() => {
    const totalMs = elapsedTime
    const minutes = Math.floor(totalMs / 60000)
    const seconds = Math.floor((totalMs % 60000) / 1000)
    const milliseconds = Math.floor((totalMs % 1000) / 10)
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`
  }, [elapsedTime])

  const handlePlayAgain = (e) => {
    e.stopPropagation()
    onPlayAgain()
  }

  return (
    <div className="completion-screen">
      <div className="completion-content">
        <h1 className="completion-title">🎉 Congratulations! 🎉</h1>
        <p className="completion-message">You found all the treasures!</p>
        
        <div className="final-time">
          <span className="time-label">Final Time:</span>
          <span className="time-value">{formattedTime}</span>
        </div>
        
        <button 
          className="play-again-btn"
          onClick={handlePlayAgain}
        >
          ⚓ Play Again
        </button>
      </div>
    </div>
  )
}

export default CompletionScreen
