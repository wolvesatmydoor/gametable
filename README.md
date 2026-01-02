# Game Table

A modern web-based board and card game application. The project features Lost Cities as the first fully implemented game.

## Lost Cities Card Game

Lost Cities is a two-player card game of strategic exploration. Players compete to lead profitable expeditions across five different suits (colors).

### Quick Start

```bash
npm install
npm run dev
```

The game will open at `http://localhost:3000`

### Game Features

- **Complete Game Mechanics**: 60-card deck, card dealing, turn-based gameplay
- **Interactive UI**: Drag-and-drop cards, visual feedback, animations
- **Game Validation**: Legal move checking, turn phase management
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful Visuals**: Color-coded suits, smooth GSAP animations

### Project Structure

```
src/
├── game/
│   └── lostcities/          # Game logic and state management
│       ├── types.ts         # Type definitions
│       ├── deckUtils.ts     # Deck utilities and validation
│       ├── gameState.ts     # Game state manager
│       └── README.md        # Detailed game documentation
├── components/
│   └── lostcities/          # React UI components
│       ├── GameBoard.tsx    # Main game component
│       ├── Card.tsx         # Card display
│       ├── PlayerHand.tsx   # Player hand management
│       ├── ExpeditionLane.tsx  # Expedition display
│       └── DiscardPile.tsx  # Discard pile management
└── styles/
    └── global.css           # Global styles
```

### Technologies

- **React 18** with TypeScript
- **Vite** for fast development and building
- **GSAP** for smooth animations
- **PixiJS** (available for advanced graphics)
- **Howler** (available for audio)

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Game Rules

1. Each player starts with 8 cards from a 60-card deck
2. On your turn:
   - **Phase 1**: Play or discard one card
     - Play to your expedition lane (must be ascending order)
     - Investment cards must be played before number cards
     - Or discard to the appropriate discard pile
   - **Phase 2**: Draw one card
     - Draw from the main deck, or
     - Take the top card from any discard pile
3. Game ends when the draw deck is empty

### Future Enhancements

- Scoring system
- AI opponent
- Sound effects
- Online multiplayer
- Tutorial mode
- Game statistics

For detailed information about the Lost Cities implementation, see `src/game/lostcities/README.md`.