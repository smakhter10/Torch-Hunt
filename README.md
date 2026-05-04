# 🏴‍☠️ Torch Hunt - Hidden Treasure Game

A browser-based hidden object game where you search for 10 treasures in a dark pirate room using a torch!

## 🎮 Game Features

- **Torch System**: Follow your mouse/finger with a realistic spotlight effect
- **10 Hidden Treasures**: Randomly placed each game
- **Stopwatch Timer**: Track how fast you can find all treasures
- **Adjustable Torch**: Use mouse wheel or slider to change torch size
- **Mobile Responsive**: Full touch support for phones and tablets
- **Smooth Performance**: Optimized for 60fps gameplay

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd torch-hunt

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:5173`

## 🎯 How to Play

1. **Move your mouse/finger** - The torch follows your cursor
2. **Click anywhere** - Toggle torch ON/OFF
3. **Mouse wheel / Slider** - Adjust torch size (60px - 280px)
4. **Click/tap treasures** - Collect them when visible in torch light
5. **Find all 10 treasures** - Complete the game as fast as possible!

## 🎨 Game Controls

### Desktop
- **Mouse movement**: Control torch position
- **Click**: Toggle torch ON/OFF
- **Mouse wheel**: Adjust torch radius
- **Click treasures**: Collect them

### Mobile
- **Touch and drag**: Control torch position
- **Tap**: Toggle torch ON/OFF
- **Slider**: Adjust torch radius (in HUD)
- **Tap treasures**: Collect them

## 📁 Project Structure

```
torch-hunt/
├── src/
│   ├── assets/
│   │   ├── background.png          # Game background
│   │   └── treasures/              # Individual treasure images
│   │       ├── treasure-1.png
│   │       ├── treasure-2.png
│   │       └── ... (10 total)
│   ├── components/
│   │   ├── GameContainer.jsx       # Background container
│   │   ├── TorchLayer.jsx          # Dark overlay with torch effect
│   │   ├── Treasure.jsx            # Individual treasure component
│   │   ├── HUD.jsx                 # Timer and progress display
│   │   └── CompletionScreen.jsx    # Victory screen
│   ├── App.jsx                     # Main game logic
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🛠️ Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## 🎲 Game Mechanics

### Treasure Placement
- Random positions each game
- Safe 50px margin from edges
- Minimum 100px distance between treasures
- No overlapping

### Treasure Sizes
- **Desktop**: 55-65px (randomized)
- **Mobile**: 65-80px (randomized)

### Torch Settings
- **Default radius**: 120px
- **Minimum radius**: 60px
- **Maximum radius**: 280px
- Soft, blurred edges for realism

### Timer
- Starts on first movement
- Format: MM:SS:MS (e.g., 01:24:35)
- Stops when all treasures collected

## 🏆 Victory Condition

When all 10 treasures are found:
1. Timer stops
2. Darkness fades away
3. Full background revealed
4. Completion screen shows final time
5. "Play Again" button to restart

## 🎨 Asset Extraction

The treasures were automatically extracted from a sprite sheet using the included Python script:

```bash
python extract_treasures.py
```

This script:
- Detects treasure boundaries
- Crops each treasure individually
- Removes excess transparency
- Saves as separate PNG files

## 📱 Mobile Optimization

- Touch-friendly controls
- Larger treasure sizes on mobile
- On-screen slider for torch adjustment
- Optimized performance for phones/tablets
- No hover-only interactions

## ⚡ Performance Features

- `requestAnimationFrame` for smooth torch movement
- Memoized calculations to prevent unnecessary re-renders
- Optimized CSS with GPU acceleration
- Efficient state management with React hooks

## 🔧 Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool
- **CSS3** - Styling and animations
- **JavaScript ES6+** - Game logic

## 📝 License

This is a demo project created for educational purposes.

## 🎉 Enjoy the Hunt!

Find all the treasures as fast as you can! 🏴‍☠️💰
