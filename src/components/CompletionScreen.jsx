import { useMemo } from 'react'
import './CompletionScreen.css'

function CompletionScreen({ elapsedTime, onPlayAgain }) {
  const formattedTimeParts = useMemo(() => {
    const totalMs = elapsedTime
    const minutes = Math.floor(totalMs / 60000)
    const seconds = Math.floor((totalMs % 60000) / 1000)
    const milliseconds = Math.floor((totalMs % 1000) / 10)
    
    return {
      min: String(minutes).padStart(2, '0'),
      sec: String(seconds).padStart(2, '0'),
      ms: String(milliseconds).padStart(2, '0')
    }
  }, [elapsedTime])

  const handlePlayAgain = (e) => {
    e.stopPropagation()
    onPlayAgain()
  }

  return (
    <div className="completion-screen">
      <div className="retro-terminal">
        <div className="system-status">
          <span className="status-box">SYSTEM_STATUS: COMPLETE</span>
        </div>

        <h1 className="completion-title">TREASURE FOUND</h1>
        
        <div className="chrono-container">
          <div className="chrono-label">RUN_TIME_CHRONO</div>
          <div className="chrono-box">
            <span className="bracket">[</span>
            <span className="time-unit">{formattedTimeParts.min}</span>
            <span className="separator">:</span>
            <span className="time-unit">{formattedTimeParts.sec}</span>
            <span className="separator">:</span>
            <span className="time-unit">{formattedTimeParts.ms}</span>
            <span className="bracket">]</span>
          </div>
        </div>

        <div className="vault-status">VAULT CLEARED.</div>

        <div className="action-buttons">
          <button className="btn-search-again" onClick={handlePlayAgain}>
            SEARCH AGAIN
          </button>
          <button className="btn-retry-faster" onClick={handlePlayAgain}>
            RETRY_FASTER
          </button>
        </div>

        <div className="stats-footer">
          <div className="stat-item">
            <div className="stat-label">ITEMS</div>
            <div className="stat-value">10/10</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">XP_GET</div>
            <div className="stat-value">+2,400</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompletionScreen
