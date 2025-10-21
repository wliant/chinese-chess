# Chinese Chess (象棋) - Web Application

A beautiful web-based Chinese Chess (Xiangqi) game built with modern web technologies.

## Features

- **Beautiful 3D Graphics**: WebGL-powered board using Three.js and React Three Fiber
- **Session-Based Multiplayer**: Create or join games using a 6-character game code
- **Complete Game Engine**: Full implementation of Chinese Chess rules including:
  - All piece movements (General, Advisor, Elephant, Horse, Chariot, Cannon, Soldier)
  - Move validation and legal move highlighting
  - Game state management
  - Win condition detection
- **Modern UI**: Clean, responsive interface with gradient backgrounds and smooth animations
- **Interactive 3D Board**: Rotate and zoom the board for better viewing angles

## Tech Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **3D Graphics**: Three.js with React Three Fiber and Drei
- **State Management**: Zustand
- **Routing**: React Router
- **Styling**: Tailwind CSS

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Play

1. **Create a Game**: Click "Create New Game" on the landing page to start a new game session
2. **Share the Code**: A 6-character game code will be generated - share this with your opponent
3. **Join a Game**: Your opponent can click "Join Game" and enter the code
4. **Play**: Click on a piece to select it (valid moves will be highlighted in green)
5. **Move**: Click on a highlighted position to move your piece
6. **Rotate View**: Drag to rotate the board, scroll to zoom in/out

## Game Rules

Chinese Chess (Xiangqi) is played on a 9x10 board with pieces positioned on line intersections. The objective is to checkmate the opponent's General.

### Pieces

- **General (帥/將)**: Moves one point orthogonally within the palace
- **Advisor (仕/士)**: Moves one point diagonally within the palace
- **Elephant (相/象)**: Moves two points diagonally, cannot cross the river
- **Horse (傌/馬)**: Moves in an L-shape (like Western chess knight), can be blocked
- **Chariot (俥/車)**: Moves any distance orthogonally (like Western chess rook)
- **Cannon (炮/砲)**: Moves like a chariot but must jump over exactly one piece to capture
- **Soldier (兵/卒)**: Moves forward one point, can move sideways after crossing the river

## Project Structure

```
src/
├── components/
│   └── GameBoard.tsx       # 3D board renderer with Three.js
├── engine/
│   └── ChineseChess.ts     # Game engine and rules
├── pages/
│   ├── Landing.tsx         # Home page with create/join options
│   └── Game.tsx            # Game page with board and controls
├── store/
│   └── gameStore.ts        # Zustand state management
├── App.tsx                 # Main app with routing
└── main.tsx               # Entry point
```

## License

MIT
