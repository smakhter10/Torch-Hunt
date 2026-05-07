import { useMemo, useCallback, useState } from 'react'
import './Treasure.css'

function Treasure({ treasure, torchPosition, torchRadius, torchOn, onCollect, isHeartbeatMode, isMobile }) {
  const [isCollecting, setIsCollecting] = useState(false)
  
  // Random static scale for mobile variation
  const mobileScale = useMemo(() => {
    return 0.65 + Math.random() * 0.15 // Random scale between 0.65 and 0.8
  }, [])

  // Calculate if treasure is visible in torch light
  const isVisible = useMemo(() => {
    if (!torchOn) return false
    
    const dx = torchPosition.x - (treasure.x + treasure.size / 2)
    const dy = torchPosition.y - (treasure.y + treasure.size / 2)
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    const detectionRadius = isMobile ? torchRadius * 1.2 : torchRadius
    
    // More forgiving check: if any part of the treasure circle touches the torch
    return distance < detectionRadius + treasure.size / 2
  }, [torchPosition, torchRadius, torchOn, treasure, isMobile])

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    if (isVisible && !treasure.found && !isCollecting) {
      setIsCollecting(true)
      setTimeout(() => {
        onCollect(treasure.id)
      }, 250)
    }
  }, [isVisible, treasure.found, treasure.id, onCollect, isCollecting])

  if (treasure.found) {
    return null
  }

  let classNames = `treasure ${isVisible ? 'visible' : ''} ${isCollecting ? 'collecting' : ''}`
  if (isHeartbeatMode && isVisible) classNames += ' heartbeat-proximity'

  return (
    <div
      className={classNames}
      style={{
        left: `${treasure.x - (isMobile ? 15 : 0)}px`,
        top: `${treasure.y - (isMobile ? 15 : 0)}px`,
        width: `${treasure.size + (isMobile ? 30 : 0)}px`,
        height: `${treasure.size + (isMobile ? 30 : 0)}px`,
      }}
      onClick={handleClick}
      onTouchEnd={handleClick}
    >
      <div 
        className="treasure-scale-wrapper" 
        style={isMobile ? { transform: `scale(${mobileScale})` } : {}}
      >
        <img 
          src={treasure.image} 
          alt="treasure" 
          draggable="false"
        />
      </div>
    </div>
  )
}

export default Treasure
