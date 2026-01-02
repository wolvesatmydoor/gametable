/**
 * Lost Cities Deck Utilities
 */

import { Card, Suit, CardType } from './types';

/**
 * Creates a full deck of 60 Lost Cities cards
 * - 5 suits (colors)
 * - Each suit has: 3 investment cards + 9 number cards (2-10)
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  const suits = Object.values(Suit);
  
  suits.forEach((suit) => {
    // Add 3 investment cards per suit
    for (let i = 0; i < 3; i++) {
      deck.push({
        id: `${suit}-investment-${i}`,
        suit,
        type: CardType.INVESTMENT,
        value: 0
      });
    }
    
    // Add number cards 2-10 per suit
    for (let value = 2; value <= 10; value++) {
      deck.push({
        id: `${suit}-${value}`,
        suit,
        type: CardType.NUMBER,
        value
      });
    }
  });
  
  return deck;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Deals cards from the deck
 */
export function dealCards(deck: Card[], count: number): { dealtCards: Card[], remainingDeck: Card[] } {
  const dealtCards = deck.slice(0, count);
  const remainingDeck = deck.slice(count);
  
  return { dealtCards, remainingDeck };
}

/**
 * Validates if a card can be played on an expedition lane
 * Rules: 
 * - Investment cards must be played before any number cards
 * - Number cards must be played in ascending order
 */
export function canPlayCard(card: Card, laneCards: Card[]): boolean {
  // Empty lane - any card can be played
  if (laneCards.length === 0) {
    return true;
  }
  
  const lastCard = laneCards[laneCards.length - 1];
  
  // If trying to play an investment card
  if (card.type === CardType.INVESTMENT) {
    // Investment cards can only be played if no number cards have been played yet
    return !laneCards.some(c => c.type === CardType.NUMBER);
  }
  
  // If trying to play a number card
  if (card.type === CardType.NUMBER) {
    // Can play if last card is investment or a lower number
    if (lastCard.type === CardType.INVESTMENT) {
      return true;
    }
    return card.value > lastCard.value;
  }
  
  return false;
}
