import { useState, useEffect, useRef, useCallback } from 'react'
import GameContainer from './components/GameContainer'
import TorchLayer from './components/TorchLayer'
import Treasure from './components/Treasure'
import HUD from './components/HUD'
import CompletionScreen from './components/CompletionScreen'
import './App.css'

// Import all treasure images
import treasure1 from './assets/treasures/treasure-1.png'
import treasure2 from './assets/treasures/treasure-2.png'
import treasure3 from './assets/treasures/treasure-3.png'
import treasure4 from './assets/treasures/treasure-4.png'
import treasure5 from './assets/treasures/treasure-5.png'
import treasure6 from './assets/treasures/treasure-6.png'
import treasure7 from './assets/treasures/treasure-7.png'
import treasure8 from './assets/treasures/treasure-8.png'
import treasure9 from './assets/treasures/treasure-9.png'
import treasure10 from './assets/treasures/treasure-10.png'

const treasureImages = [
  treasure1, treasure2, treasure3, treasure4, treasure5,
  treasure6, treasure7, treasure8, treasure9, treasure10
]

const MARGIN = 50
const MIN_DISTANCE = 100

function App() {
  const [torchOn, setTorchOn] = useState(true)
  const [torchRadius, setTorchRadius] = useState(120)
  const [torchPosition, setTorchPosition] = useState({ x: 0, y: 0 })
  const [treasures, setTreasures] = useState([])
  const [foundCount, setFoundCount] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [gamePhase, setGamePhase] = useState('intro') // 'pre-intro' | 'intro' | 'playing' | 'completed'
  const [introTextVisible, setIntroTextVisible] = useState(false)
  const [targetTorchPosition, setTargetTorchPosition] = useState({ x: 0, y: 0 })
  
  const [torchState, setTorchState] = useState('stable') // 'stable' | 'warning' | 'off' | 'recovering'
  const [recoveryClicks, setRecoveryClicks] = useState(0)
  const [failureCount, setFailureCount] = useState(0)
  const [recoveryFlash, setRecoveryFlash] = useState(false)
  
  const timerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const failureTimerRef = useRef(null)

  // Generate random treasure positions without overlap
  const generateTreasurePositions = useCallback(() => {
    const positions = []
    const isMobile = window.innerWidth < 768
    const minSize = isMobile ? 65 : 55
    const maxSize = isMobile ? 80 : 65
    
    for (let i = 0; i < 10; i++) {
      let attempts = 0
      let position
      
      while (attempts < 100) {
        const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize
        const safeWidth = Math.max(0, window.innerWidth - size - 2 * MARGIN)
        const safeHeight = Math.max(0, window.innerHeight - size - 2 * MARGIN)
        
        const x = Math.random() * safeWidth + MARGIN
        const y = Math.random() * safeHeight + MARGIN
        
        // Check distance from all existing treasures
        const tooClose = positions.some(p => {
          const dx = x - p.x
          const dy = y - p.y
          return Math.sqrt(dx * dx + dy * dy) < MIN_DISTANCE
        })
        
        if (!tooClose) {
          // Use a globally unique ID so Treasure components unmount on replay, resetting local state
          position = { x, y, size, image: treasureImages[i], id: `${Date.now()}-${i}`, found: false }
          break
        }
        
        attempts++
      }
      
      if (position) {
        positions.push(position)
      }
    }
    
    return positions
  }, [])

  // Initialize game
  const initializeGame = useCallback(() => {
    const mobile = window.innerWidth < 768 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
    setIsMobile(mobile)

    setTreasures(generateTreasurePositions())
    setFoundCount(0)
    setElapsedTime(0)
    setGameStarted(false)
    setGameCompleted(false)
    setGamePhase(mobile ? 'pre-intro' : 'intro')
    setTorchOn(true)
    setTorchRadius(mobile ? 150 : 120)
    
    // Reset v2.1 states
    setTorchState('stable')
    setRecoveryClicks(0)
    setFailureCount(0)
    if (failureTimerRef.current) clearTimeout(failureTimerRef.current)
  }, [generateTreasurePositions])

  useEffect(() => {
    initializeGame()
    
    // Handle window resize to keep game responsive
    const handleResize = () => {
      setTreasures(prev => prev.map(t => {
        // Ensure treasures stay within bounds if window shrinks
        const newX = Math.min(t.x, window.innerWidth - t.size - MARGIN)
        const newY = Math.min(t.y, window.innerHeight - t.size - MARGIN)
        return { ...t, x: Math.max(MARGIN, newX), y: Math.max(MARGIN, newY) }
      }))
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [initializeGame])

  // Haptic feedback helper
  const vibrate = useCallback((pattern) => {
    if (isMobile && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }, [isMobile])

  // Smooth torch interpolation for mobile
  useEffect(() => {
    if (!isMobile) return
    let animationId
    const loop = () => {
      setTorchPosition(prev => {
        const dx = targetTorchPosition.x - prev.x
        const dy = targetTorchPosition.y - prev.y
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return targetTorchPosition
        return {
          x: prev.x + dx * 0.2,
          y: prev.y + dy * 0.2
        }
      })
      animationId = requestAnimationFrame(loop)
    }
    animationId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animationId)
  }, [targetTorchPosition, isMobile])

  // Intro Sequence
  useEffect(() => {
    if (gamePhase === 'intro') {
      const t1 = setTimeout(() => {
        setIntroTextVisible(true)
      }, 500)
      
      const t2 = setTimeout(() => {
        setIntroTextVisible(false)
      }, 2000)
      
      const t3 = setTimeout(() => {
        setGamePhase('playing')
      }, 2500)
      
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }
  }, [gamePhase])

  // Heartbeat Mode
  const remainingTreasures = 10 - foundCount
  const isHeartbeatMode = remainingTreasures <= 2 && gamePhase !== 'completed'

  // Start timer on first interaction
  const startGame = useCallback(() => {
    if (!gameStarted && gamePhase === 'playing') {
      setGameStarted(true)
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 10)
      }, 10)
    }
  }, [gameStarted, gamePhase])

  // Instability System
  useEffect(() => {
    if (!gameStarted || gameCompleted || torchState !== 'stable' || failureCount >= 3) {
      if (failureTimerRef.current) clearTimeout(failureTimerRef.current)
      return
    }

    // First failure: 8-12s, Subsequent: 10-15s
    const minDelay = failureCount === 0 ? 8000 : 10000
    const maxDelay = failureCount === 0 ? 12000 : 15000
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay

    failureTimerRef.current = setTimeout(() => {
      setTorchState('warning')
      
      // After warning, turn off completely
      setTimeout(() => {
        setTorchState('off')
        vibrate([200, 100, 200]) // Long pulse on failure
      }, 800)
      
    }, delay)

    return () => {
      if (failureTimerRef.current) clearTimeout(failureTimerRef.current)
    }
  }, [gameStarted, gameCompleted, torchState, failureCount, vibrate])

  // Handle mouse/touch movement
  const handleMove = useCallback((e) => {
    if (gamePhase === 'intro' || gamePhase === 'pre-intro') return
    startGame()
    
    const updatePosition = (clientX, clientY) => {
      if (isMobile) {
        setTargetTorchPosition({ x: clientX, y: clientY - 70 })
      } else {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = requestAnimationFrame(() => {
          setTorchPosition({ x: clientX, y: clientY })
        })
      }
    }

    if (e.type === 'mousemove') {
      updatePosition(e.clientX, e.clientY)
    } else if (e.type === 'touchmove') {
      const touch = e.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    }
  }, [startGame, gamePhase, isMobile])

  // Handle clicks on the main container
  const handleContainerClick = useCallback((e) => {
    if (gamePhase === 'intro' || gamePhase === 'pre-intro') return
    if (isMobile && (torchState === 'off' || torchState === 'recovering')) return // Handled by dedicated button

    if (torchState === 'off' || torchState === 'recovering') {
      // Recovery logic
      if (torchState === 'off') setTorchState('recovering')
      
      setRecoveryFlash(true)
      setTimeout(() => setRecoveryFlash(false), 150)
      vibrate(50)
      
      setRecoveryClicks(prev => {
        const next = prev + 1
        const targetClicks = Math.random() > 0.5 ? 4 : 3;
        if (next >= targetClicks) {
          setTorchState('stable')
          setFailureCount(f => f + 1)
          return 0
        }
        return next
      })
      return
    }

    // Normal torch toggle
    if (!isMobile) {
      setTorchOn(prev => !prev)
    }
  }, [torchState, gamePhase, isMobile, vibrate])

  const handleMobileTorchToggle = useCallback((e) => {
    e.stopPropagation()
    setTorchOn(prev => !prev)
  }, [])

  const handleMobileRecoveryClick = useCallback((e) => {
    e.stopPropagation()
    if (torchState === 'off') setTorchState('recovering')
      
    setRecoveryFlash(true)
    setTimeout(() => setRecoveryFlash(false), 150)
    vibrate(50)
    
    setRecoveryClicks(prev => {
      const next = prev + 1
      const targetClicks = Math.random() > 0.5 ? 4 : 3;
      if (next >= targetClicks) {
        setTorchState('stable')
        setFailureCount(f => f + 1)
        return 0
      }
      return next
    })
  }, [torchState, vibrate])

  // Handle treasure collection
  const collectTreasure = useCallback((id) => {
    setTreasures(prev => {
      const updated = prev.map(t => 
        t.id === id ? { ...t, found: true } : t
      )
      
      const newFoundCount = updated.filter(t => t.found).length
      vibrate(100) // Haptic feedback on collect
      setFoundCount(newFoundCount)
      
      // Check if game is complete
      if (newFoundCount === 10) {
        clearInterval(timerRef.current)
        setGamePhase('completed')
        setTimeout(() => setGameCompleted(true), 500)
      }
      
      return updated
    })
  }, [])

  // Handle wheel scroll for torch size (desktop) removed per request

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div 
      className="app"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onClick={handleContainerClick}
    >
      <GameContainer />
      
      {/* Mobile Pre-Intro */}
      {gamePhase === 'pre-intro' && (
        <div className="tap-to-begin-overlay" onClick={() => setGamePhase('intro')}>
          <h2>TAP TO BEGIN</h2>
        </div>
      )}

      {/* Intro Overlay */}
      {gamePhase === 'intro' && (
        <div className="intro-overlay">
          <h2 className={`intro-text ${introTextVisible ? 'visible' : ''}`}>
            Light is your only guide.
          </h2>
        </div>
      )}

      {/* Mobile Recovery UI */}
      {isMobile && (torchState === 'off' || torchState === 'recovering') && gamePhase === 'playing' && (
        <div className="mobile-recovery-ui">
          <button className="mobile-recovery-btn" onClick={handleMobileRecoveryClick}>
            TAP TO RELIGHT
          </button>
        </div>
      )}

      {/* Mobile Torch Toggle */}
      {isMobile && gamePhase === 'playing' && torchState === 'stable' && (
        <button className="mobile-torch-toggle" onClick={handleMobileTorchToggle}>
          🔦
        </button>
      )}

      {/* Heartbeat Overlay */}
      {isHeartbeatMode && <div className="heartbeat-overlay" />}
      
      {/* Treasures */}
      {treasures.map(treasure => (
        <Treasure
          key={treasure.id}
          treasure={treasure}
          torchPosition={torchPosition}
          torchRadius={torchRadius}
          torchOn={torchOn}
          onCollect={collectTreasure}
          isHeartbeatMode={isHeartbeatMode}
          isMobile={isMobile}
          torchRadius={torchRadius}
        />
      ))}
      
      {/* Torch overlay */}
      <TorchLayer
        position={torchPosition}
        radius={torchRadius}
        isOn={torchOn}
        gameCompleted={gameCompleted}
        gamePhase={gamePhase}
        torchState={torchState}
        recoveryFlash={recoveryFlash}
        isHeartbeatMode={isHeartbeatMode}
      />
      
      {/* HUD */}
      <HUD
        elapsedTime={elapsedTime}
        foundCount={foundCount}
        totalCount={10}
        torchRadius={torchRadius}
        onRadiusChange={setTorchRadius}
        gamePhase={gamePhase}
        isHeartbeatMode={isHeartbeatMode}
      />
      
      {/* Completion screen */}
      {gameCompleted && (
        <CompletionScreen
          elapsedTime={elapsedTime}
          onPlayAgain={initializeGame}
        />
      )}
    </div>
  )
}

export default App
