import { useMemo } from 'react'
import './TorchLayer.css'

function TorchLayer({ position, radius, isOn, gameCompleted }) {
  const maskStyle = useMemo(() => {
    if (gameCompleted) {
      return {
        background: 'transparent'
      }
    }
    
    if (!isOn) {
      return {
        background: '#000'
      }
    }
    
    return {
      background: `radial-gradient(circle ${radius}px at ${position.x}px ${position.y}px, transparent 0%, transparent ${radius * 0.6}px, rgba(0,0,0,0.3) ${radius * 0.8}px, rgba(0,0,0,0.95) ${radius}px, #000 ${radius * 1.2}px)`
    }
  }, [position.x, position.y, radius, isOn, gameCompleted])

  return <div className="torch-layer" style={maskStyle} />
}

export default TorchLayer
