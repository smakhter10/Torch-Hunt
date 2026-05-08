import './GameContainer.css'
import backgroundImage from '../assets/background.png'
import secretBackgroundImage from '../assets/secret background.png'

function GameContainer({ secretMode }) {
  return (
    <div 
      className="game-container"
      style={{ backgroundImage: `url(${secretMode ? secretBackgroundImage : backgroundImage})` }}
    />
  )
}

export default GameContainer
