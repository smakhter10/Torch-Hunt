import { useMemo } from 'react'
import './TorchLayer.css'

function TorchLayer({ position, radius, isOn, gameCompleted, torchState, recoveryFlash = false, gamePhase, isHeartbeatMode, secretMode }) {
  const maskStyle = useMemo(() => {
    if (gameCompleted && !secretMode) {
      return {
        background: 'transparent'
      }
    }
    
    if (gamePhase === 'intro' || gamePhase === 'fake-completion' || !isOn || torchState === 'off') {
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

    if (secretMode) {
      // Secret Mode: Sinister red/orange hues
      return {
        background: `radial-gradient(circle ${radius}px at ${position.x}px ${position.y}px, rgba(255,50,0,0.1) 0%, rgba(255,20,0,0.1) ${radius * 0.5}px, rgba(150,0,0,0.4) ${radius * 0.8}px, rgba(50,0,0,0.95) ${radius}px, #000 ${radius * 1.2}px)`
      }
    }
    
    // Base torch radial gradient
    return {
      background: `radial-gradient(circle ${radius}px at ${position.x}px ${position.y}px, transparent 0%, transparent ${radius * 0.6}px, rgba(0,0,0,0.3) ${radius * 0.8}px, rgba(0,0,0,0.95) ${radius}px, #000 ${radius * 1.2}px)`
    }
  }, [position.x, position.y, radius, isOn, gameCompleted, torchState, recoveryFlash, gamePhase, secretMode])

  let classNames = 'torch-layer'
  if (torchState === 'warning') classNames += ' warning-flicker'
  
  if (isHeartbeatMode && torchState !== 'warning') classNames += ' heartbeat-flicker'
  if (secretMode) classNames += ' secret-mode-torch'

  return <div className={classNames} style={maskStyle} />
}

export default TorchLayer
