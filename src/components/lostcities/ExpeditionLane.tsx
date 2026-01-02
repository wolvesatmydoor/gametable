import React from 'react';
import { ExpeditionLane as ExpeditionLaneType, Card as CardType } from '../../game/lostcities/types';
import Card from './Card';
import './ExpeditionLane.css';

interface ExpeditionLaneProps {
  expedition: ExpeditionLaneType;
  onDrop?: (card: CardType, suit: string) => void;
  isCurrentPlayer?: boolean;
}

const ExpeditionLane: React.FC<ExpeditionLaneProps> = ({ 
  expedition, 
  onDrop,
  isCurrentPlayer = false
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
    
    if (onDrop && isCurrentPlayer) {
      // The card data is handled by the parent component
      // This just signals that a drop occurred on this lane
    }
  };

  return (
    <div 
      className={`expedition-lane expedition-lane-${expedition.suit} ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-suit={expedition.suit}
    >
      <div className="expedition-header">
        <span className="expedition-suit">{expedition.suit.toUpperCase()}</span>
      </div>
      <div className="expedition-cards">
        {expedition.cards.length === 0 ? (
          <div className="expedition-empty">Empty</div>
        ) : (
          expedition.cards.map((card) => (
            <Card key={card.id} card={card} draggable={false} />
          ))
        )}
      </div>
    </div>
  );
};

export default ExpeditionLane;
