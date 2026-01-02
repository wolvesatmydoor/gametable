import React from 'react';
import { Card as CardType } from '../../game/lostcities/types';
import Card from './Card';
import './PlayerHand.css';

interface PlayerHandProps {
  cards: CardType[];
  playerName: string;
  isCurrentPlayer: boolean;
  onCardDragStart?: (card: CardType) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ 
  cards, 
  playerName, 
  isCurrentPlayer,
  onCardDragStart 
}) => {
  // Sort cards by suit and value for better visualization
  const sortedCards = [...cards].sort((a, b) => {
    if (a.suit !== b.suit) {
      return a.suit.localeCompare(b.suit);
    }
    return a.value - b.value;
  });

  return (
    <div className={`player-hand ${isCurrentPlayer ? 'active' : ''}`}>
      <div className="player-hand-header">
        <h3>{playerName}</h3>
        {isCurrentPlayer && <span className="current-turn-indicator">Your Turn</span>}
      </div>
      <div className="player-hand-cards">
        {sortedCards.map((card) => (
          <Card
            key={card.id}
            card={card}
            draggable={isCurrentPlayer}
            onDragStart={onCardDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;
