import { useMemo } from 'react'
import './HUD.css'

function HUD({ elapsedTime, foundCount, totalCount, torchRadius, onRadiusChange, gamePhase, isHeartbeatMode }) {
  const formattedTime = useMemo(() => {
    const totalMs = elapsedTime
    const minutes = Math.floor(totalMs / 60000)
    const seconds = Math.floor((totalMs % 60000) / 1000)
    const milliseconds = Math.floor((totalMs % 1000) / 10)
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`
  }, [elapsedTime])

  const handleSliderChange = (e) => {
    e.stopPropagation()
    onRadiusChange(Number(e.target.value))
  }

  const handleSliderClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div className={`hud ${gamePhase === 'intro' ? 'hud-hidden' : ''}`}>
      <div className={`hud-item timer ${isHeartbeatMode ? 'heartbeat-timer' : ''}`}>
        <span className="icon">⏱</span>
        <span className="value">{formattedTime}</span>
      </div>
      
      <div className="hud-item progress">
        <span className="icon">💰</span>
        <span className="value">{foundCount} / {totalCount} FOUND</span>
      </div>
    </div>
  )
}

export default HUD
