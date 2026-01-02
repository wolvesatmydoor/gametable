import React from 'react';
import { DiscardPile as DiscardPileType, Suit } from '../../game/lostcities/types';
import Card from './Card';
import './DiscardPile.css';

interface DiscardPileProps {
  discardPile: DiscardPileType;
  onDrawFromDiscard?: (suit: Suit) => void;
  isCurrentPlayer?: boolean;
  canDraw?: boolean;
}

const DiscardPile: React.FC<DiscardPileProps> = ({ 
  discardPile, 
  onDrawFromDiscard,
  isCurrentPlayer = false,
  canDraw = false
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isCurrentPlayer) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    if (canDraw && onDrawFromDiscard && discardPile.cards.length > 0) {
      onDrawFromDiscard(discardPile.suit);
    }
  };

  const topCard = discardPile.cards.length > 0 
    ? discardPile.cards[discardPile.cards.length - 1] 
    : null;

  return (
    <div 
      className={`discard-pile discard-pile-${discardPile.suit} ${isDragOver ? 'drag-over' : ''} ${canDraw && topCard ? 'can-draw' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      data-suit={discardPile.suit}
    >
      <div className="discard-pile-header">
        <span className="discard-pile-suit">{discardPile.suit.toUpperCase()}</span>
        <span className="discard-pile-count">({discardPile.cards.length})</span>
      </div>
      <div className="discard-pile-content">
        {topCard ? (
          <Card card={topCard} draggable={false} />
        ) : (
          <div className="discard-pile-empty">Empty</div>
        )}
      </div>
    </div>
  );
};

export default DiscardPile;
