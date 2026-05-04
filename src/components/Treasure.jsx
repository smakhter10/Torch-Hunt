import { useMemo, useCallback } from 'react'
import './Treasure.css'

function Treasure({ treasure, torchPosition, torchRadius, torchOn, onCollect }) {
  // Calculate if treasure is visible in torch light
  const isVisible = useMemo(() => {
    if (!torchOn) return false
    
    const dx = torchPosition.x - (treasure.x + treasure.size / 2)
    const dy = torchPosition.y - (treasure.y + treasure.size / 2)
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // More forgiving check: if any part of the treasure circle touches the torch
    return distance < torchRadius + treasure.size / 2
  }, [torchPosition, torchRadius, torchOn, treasure])

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    if (isVisible && !treasure.found) {
      onCollect(treasure.id)
    }
  }, [isVisible, treasure.found, treasure.id, onCollect])

  if (treasure.found) {
    return null
  }

  return (
    <div
      className={`treasure ${isVisible ? 'visible' : ''}`}
      style={{
        left: `${treasure.x}px`,
        top: `${treasure.y}px`,
        width: `${treasure.size}px`,
        height: `${treasure.size}px`,
      }}
      onClick={handleClick}
      onTouchEnd={handleClick}
    >
      <img 
        src={treasure.image} 
        alt="treasure" 
        draggable="false"
      />
    </div>
  )
}

export default Treasure
