/**
 * Lost Cities Game Type Definitions
 */

export enum Suit {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
  WHITE = 'white'
}

export enum CardType {
  INVESTMENT = 'investment',
  NUMBER = 'number'
}

export interface Card {
  id: string;
  suit: Suit;
  type: CardType;
  value: number; // 0 for investment cards, 2-10 for number cards
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
}

export interface ExpeditionLane {
  suit: Suit;
  cards: Card[];
}

export interface DiscardPile {
  suit: Suit;
  cards: Card[];
}

export enum GamePhase {
  SETUP = 'setup',
  PLAYING = 'playing',
  GAME_OVER = 'game_over'
}

export enum TurnPhase {
  PLAY_OR_DISCARD = 'play_or_discard',
  DRAW = 'draw'
}

export interface GameState {
  phase: GamePhase;
  turnPhase: TurnPhase;
  currentPlayerIndex: number;
  players: Player[];
  deck: Card[];
  discardPiles: DiscardPile[];
  expeditions: {
    player1: ExpeditionLane[];
    player2: ExpeditionLane[];
  };
}

export interface DragData {
  card: Card;
  sourceType: 'hand' | 'expedition' | 'discard';
  sourceIndex?: number;
}
