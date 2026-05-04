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
    setTreasures(generateTreasurePositions())
    setFoundCount(0)
    setElapsedTime(0)
    setGameStarted(false)
    setGameCompleted(false)
    setTorchOn(true)
    
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

  // Start timer on first interaction
  const startGame = useCallback(() => {
    if (!gameStarted && !gameCompleted) {
      setGameStarted(true)
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 10)
      }, 10)
    }
  }, [gameStarted, gameCompleted])

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
      }, 800)
      
    }, delay)

    return () => {
      if (failureTimerRef.current) clearTimeout(failureTimerRef.current)
    }
  }, [gameStarted, gameCompleted, torchState, failureCount])

  // Handle mouse/touch movement
  const handleMove = useCallback((e) => {
    startGame()
    
    const updatePosition = (clientX, clientY) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        setTorchPosition({ x: clientX, y: clientY })
      })
    }

    if (e.type === 'mousemove') {
      updatePosition(e.clientX, e.clientY)
    } else if (e.type === 'touchmove') {
      const touch = e.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    }
  }, [startGame])

  // Handle clicks on the main container
  const handleContainerClick = useCallback((e) => {
    if (torchState === 'off' || torchState === 'recovering') {
      // Recovery logic
      if (torchState === 'off') setTorchState('recovering')
      
      setRecoveryFlash(true)
      setTimeout(() => setRecoveryFlash(false), 150)
      
      setRecoveryClicks(prev => {
        const next = prev + 1
        // Randomize between 3 and 4 clicks for recovery as requested
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
    setTorchOn(prev => !prev)
  }, [torchState])

  // Handle treasure collection
  const collectTreasure = useCallback((id) => {
    setTreasures(prev => {
      const updated = prev.map(t => 
        t.id === id ? { ...t, found: true } : t
      )
      
      const newFoundCount = updated.filter(t => t.found).length
      setFoundCount(newFoundCount)
      
      // Check if game is complete
      if (newFoundCount === 10) {
        clearInterval(timerRef.current)
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
      
      {/* Treasures */}
      {treasures.map(treasure => (
        <Treasure
          key={treasure.id}
          treasure={treasure}
          torchPosition={torchPosition}
          torchRadius={torchRadius}
          torchOn={torchOn}
          onCollect={collectTreasure}
        />
      ))}
      
      {/* Torch overlay */}
      <TorchLayer
        position={torchPosition}
        radius={torchRadius}
        isOn={torchOn}
        gameCompleted={gameCompleted}
        torchState={torchState}
        recoveryFlash={recoveryFlash}
      />
      
      {/* HUD */}
      <HUD
        elapsedTime={elapsedTime}
        foundCount={foundCount}
        totalCount={10}
        torchRadius={torchRadius}
        onRadiusChange={setTorchRadius}
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
