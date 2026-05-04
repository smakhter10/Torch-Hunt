import { useMemo } from 'react'
import './HUD.css'

function HUD({ elapsedTime, foundCount, totalCount, torchRadius, onRadiusChange }) {
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
    <div className="hud">
      <div className="hud-item timer">
        <span className="icon">⏱</span>
        <span className="value">{formattedTime}</span>
      </div>
      
      <div className="hud-item progress">
        <span className="icon">💰</span>
        <span className="value">{foundCount} / {totalCount}</span>
      </div>
      
      <div className="hud-item torch-control" onClick={handleSliderClick}>
        <span className="label">Torch Size</span>
        <input
          type="range"
          min="60"
          max="280"
          value={torchRadius}
          onChange={handleSliderChange}
          onClick={handleSliderClick}
          className="torch-slider"
        />
        <span className="radius-value">{torchRadius}px</span>
      </div>
    </div>
  )
}

export default HUD
