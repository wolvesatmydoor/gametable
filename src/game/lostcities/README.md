# Lost Cities Card Game

A web-based implementation of the Lost Cities card game using React, TypeScript, and GSAP animations.

## Game Overview

Lost Cities is a two-player card game where players compete to lead profitable expeditions. The game uses a deck of 60 cards divided into 5 suits (colors), with each suit containing:
- 3 Investment cards (multiplier cards)
- 9 Number cards (values 2-10)

## Features Implemented

### 1. Deck and Card System
- ✅ 60-card deck with 5 suits (Red, Green, Blue, Yellow, White)
- ✅ Each suit has 3 investment cards and 9 number cards (2-10)
- ✅ Shuffle and deal 8 cards to each player at game start
- ✅ Card validation for legal plays

### 2. Game Board Layout
- ✅ 5 expedition lanes per player (one for each suit)
- ✅ 5 discard piles (one for each suit)
- ✅ Visual display of player hands
- ✅ Draw deck counter
- ✅ Current turn and phase indicators

### 3. Player Turn Logic
- ✅ Drag and drop cards from hand
- ✅ Play cards to expedition lanes (ascending order, investments first)
- ✅ Discard cards to appropriate suit discard pile
- ✅ Draw from main deck or any discard pile
- ✅ Turn validation ensuring legal moves

### 4. Game Flow
- ✅ Two-player turn alternation
- ✅ Two-phase turns: Play/Discard → Draw
- ✅ Game ends when deck runs out
- ✅ Game over screen with replay option

### 5. Animations and UX
- ✅ GSAP animations for card dealing and drawing
- ✅ Drag and drop visual feedback
- ✅ Valid/invalid placement indicators
- ✅ Error messages for illegal moves
- ✅ Hover effects and transitions
- ✅ Responsive design

### 6. Folder Structure
```
src/
├── game/
│   └── lostcities/
│       ├── types.ts           # Type definitions
│       ├── deckUtils.ts       # Deck creation and validation
│       ├── gameState.ts       # Game state management
│       └── index.ts           # Main exports
├── components/
│   └── lostcities/
│       ├── GameBoard.tsx      # Main game component
│       ├── GameBoard.css
│       ├── Card.tsx           # Card component
│       ├── Card.css
│       ├── PlayerHand.tsx     # Player hand display
│       ├── PlayerHand.css
│       ├── ExpeditionLane.tsx # Expedition lane component
│       ├── ExpeditionLane.css
│       ├── DiscardPile.tsx    # Discard pile component
│       └── DiscardPile.css
└── styles/
    └── global.css             # Global styles
```

## How to Play

1. **Starting the Game**: Each player is dealt 8 cards
2. **On Your Turn**:
   - Phase 1: Play or discard one card
     - Play to expedition lane: Must match suit and be higher than previous card
     - Investment cards must be played before number cards
     - Discard to appropriate suit pile
   - Phase 2: Draw one card
     - Draw from main deck or take top card from any discard pile
3. **Game End**: Game ends when the draw deck is empty

## Game Rules (Implemented)

- Cards in expedition lanes must be played in ascending order
- Investment cards (multipliers) must be played before any number cards
- Once a card is played to an expedition, it cannot be moved
- Players must play/discard exactly one card, then draw one card per turn
- Cards can only be discarded to their matching suit pile

## Installation and Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **GSAP**: Animation library
- **PixiJS**: Game rendering (available for future enhancements)
- **Howler**: Audio library (available for future enhancements)
- **CSS3**: Styling with gradients and animations

## Future Enhancements

- Scoring system calculation
- AI opponent
- Sound effects using Howler
- Advanced animations using PixiJS
- Multiplayer online support
- Game statistics and history
- Different difficulty levels
- Tutorial mode

## Game State Management

The game uses a centralized state manager (`LostCitiesGame` class) with:
- Observable pattern for state updates
- Immutable state updates
- Turn validation
- Phase management
- Card movement tracking

## Component Architecture

- **GameBoard**: Main container, manages game flow and drag-drop
- **Card**: Reusable card display with drag support
- **PlayerHand**: Displays and manages player cards
- **ExpeditionLane**: Drop zone for playing cards
- **DiscardPile**: Drop zone for discarding and source for drawing

## Development Notes

- All game logic is separated from UI components
- Type-safe implementation using TypeScript
- Modular CSS for easy theming
- Drag-and-drop using native HTML5 APIs
- Responsive design for various screen sizes
