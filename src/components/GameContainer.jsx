import './GameContainer.css'
import backgroundImage from '../assets/background.png'

function GameContainer() {
  return (
    <div 
      className="game-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    />
  )
}

export default GameContainer
