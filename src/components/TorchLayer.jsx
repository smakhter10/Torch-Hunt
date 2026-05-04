import { useMemo } from 'react'
import './TorchLayer.css'

function TorchLayer({ position, radius, isOn, gameCompleted, torchState, recoveryFlash = false }) {
  const maskStyle = useMemo(() => {
    if (gameCompleted) {
      return {
        background: 'transparent'
      }
    }
    
    if (!isOn || torchState === 'off') {
      return {
        background: '#000'
      }
    }
    
    // Recovery flash overrides with a bright burst
    if (recoveryFlash) {
      return {
        background: `radial-gradient(circle ${radius}px at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.8) 0%, rgba(255, 215, 0, 0.5) ${radius * 0.5}px, transparent ${radius}px)`
      }
    }
    
    // Base torch radial gradient
    return {
      background: `radial-gradient(circle ${radius}px at ${position.x}px ${position.y}px, transparent 0%, transparent ${radius * 0.6}px, rgba(0,0,0,0.3) ${radius * 0.8}px, rgba(0,0,0,0.95) ${radius}px, #000 ${radius * 1.2}px)`
    }
  }, [position.x, position.y, radius, isOn, gameCompleted, torchState, recoveryFlash])

  const classNames = `torch-layer ${torchState === 'warning' ? 'warning-flicker' : ''}`

  return <div className={classNames} style={maskStyle} />
}

export default TorchLayer
