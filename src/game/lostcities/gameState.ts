/**
 * Lost Cities Game State Manager
 */

import { GameState, GamePhase, TurnPhase, Player, Suit, ExpeditionLane, DiscardPile, Card } from './types';
import { createDeck, shuffleDeck, dealCards, canPlayCard } from './deckUtils';

export class LostCitiesGame {
  private state: GameState;
  private listeners: Array<(state: GameState) => void> = [];

  constructor() {
    this.state = this.initializeGame();
  }

  /**
   * Initialize a new game
   */
  private initializeGame(): GameState {
    // Create and shuffle deck
    const fullDeck = createDeck();
    const shuffledDeck = shuffleDeck(fullDeck);

    // Deal 8 cards to each player
    const { dealtCards: player1Cards, remainingDeck: afterPlayer1 } = dealCards(shuffledDeck, 8);
    const { dealtCards: player2Cards, remainingDeck: finalDeck } = dealCards(afterPlayer1, 8);

    // Initialize players
    const players: Player[] = [
      {
        id: 'player1',
        name: 'Player 1',
        hand: player1Cards
      },
      {
        id: 'player2',
        name: 'Player 2',
        hand: player2Cards
      }
    ];

    // Initialize discard piles (one for each suit)
    const discardPiles: DiscardPile[] = Object.values(Suit).map(suit => ({
      suit,
      cards: []
    }));

    // Initialize expedition lanes (one for each suit per player)
    const player1Expeditions: ExpeditionLane[] = Object.values(Suit).map(suit => ({
      suit,
      cards: []
    }));

    const player2Expeditions: ExpeditionLane[] = Object.values(Suit).map(suit => ({
      suit,
      cards: []
    }));

    return {
      phase: GamePhase.PLAYING,
      turnPhase: TurnPhase.PLAY_OR_DISCARD,
      currentPlayerIndex: 0,
      players,
      deck: finalDeck,
      discardPiles,
      expeditions: {
        player1: player1Expeditions,
        player2: player2Expeditions
      }
    };
  }

  /**
   * Get current game state
   */
  public getState(): GameState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  public subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  /**
   * Get current player
   */
  public getCurrentPlayer(): Player {
    return this.state.players[this.state.currentPlayerIndex];
  }

  /**
   * Get expedition lanes for a specific player
   */
  public getPlayerExpeditions(playerId: string): ExpeditionLane[] {
    if (playerId === 'player1') {
      return this.state.expeditions.player1;
    }
    return this.state.expeditions.player2;
  }

  /**
   * Play a card to an expedition lane
   */
  public playCardToExpedition(card: Card): boolean {
    if (this.state.turnPhase !== TurnPhase.PLAY_OR_DISCARD) {
      return false;
    }

    const currentPlayer = this.getCurrentPlayer();
    const expeditions = this.getPlayerExpeditions(currentPlayer.id);
    const expedition = expeditions.find(exp => exp.suit === card.suit);

    if (!expedition) {
      return false;
    }

    // Validate card is in player's hand
    const cardIndex = currentPlayer.hand.findIndex(c => c.id === card.id);
    if (cardIndex === -1) {
      return false;
    }

    // Validate the card can be played (ascending order, investments first)
    if (!canPlayCard(card, expedition.cards)) {
      return false;
    }

    // Remove card from hand and add to expedition
    currentPlayer.hand.splice(cardIndex, 1);
    expedition.cards.push(card);

    // Move to draw phase
    this.state.turnPhase = TurnPhase.DRAW;
    this.notifyListeners();
    return true;
  }

  /**
   * Discard a card to a discard pile
   */
  public discardCard(card: Card): boolean {
    if (this.state.turnPhase !== TurnPhase.PLAY_OR_DISCARD) {
      return false;
    }

    const currentPlayer = this.getCurrentPlayer();
    const discardPile = this.state.discardPiles.find(pile => pile.suit === card.suit);

    if (!discardPile) {
      return false;
    }

    // Remove card from hand
    const cardIndex = currentPlayer.hand.findIndex(c => c.id === card.id);
    if (cardIndex === -1) {
      return false;
    }

    currentPlayer.hand.splice(cardIndex, 1);
    discardPile.cards.push(card);

    // Move to draw phase
    this.state.turnPhase = TurnPhase.DRAW;
    this.notifyListeners();
    return true;
  }

  /**
   * Draw a card from the main deck
   */
  public drawFromDeck(): boolean {
    if (this.state.turnPhase !== TurnPhase.DRAW) {
      return false;
    }

    if (this.state.deck.length === 0) {
      // Game over
      this.state.phase = GamePhase.GAME_OVER;
      this.notifyListeners();
      return false;
    }

    const currentPlayer = this.getCurrentPlayer();
    const card = this.state.deck.shift();
    
    if (card) {
      currentPlayer.hand.push(card);
      this.endTurn();
      return true;
    }

    return false;
  }

  /**
   * Draw a card from a discard pile
   */
  public drawFromDiscard(suit: Suit): boolean {
    if (this.state.turnPhase !== TurnPhase.DRAW) {
      return false;
    }

    const discardPile = this.state.discardPiles.find(pile => pile.suit === suit);
    
    if (!discardPile || discardPile.cards.length === 0) {
      return false;
    }

    const currentPlayer = this.getCurrentPlayer();
    const card = discardPile.cards.pop();
    
    if (card) {
      currentPlayer.hand.push(card);
      this.endTurn();
      return true;
    }

    return false;
  }

  /**
   * End the current turn and switch to the next player
   */
  private endTurn(): void {
    // Check if deck is empty
    if (this.state.deck.length === 0) {
      this.state.phase = GamePhase.GAME_OVER;
    } else {
      // Switch to next player
      this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % this.state.players.length;
      this.state.turnPhase = TurnPhase.PLAY_OR_DISCARD;
    }
    
    this.notifyListeners();
  }

  /**
   * Reset the game
   */
  public resetGame(): void {
    this.state = this.initializeGame();
    this.notifyListeners();
  }
}
