import React from 'react';
import { Card as CardType, CardType as CardTypeEnum } from '../../game/lostcities/types';
import './Card.css';

interface CardProps {
  card: CardType;
  draggable?: boolean;
  onDragStart?: (card: CardType) => void;
  onClick?: (card: CardType) => void;
}

const Card: React.FC<CardProps> = ({ card, draggable = false, onDragStart, onClick }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      onDragStart(card);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(card);
    }
  };

  const displayValue = card.type === CardTypeEnum.INVESTMENT ? 'I' : card.value.toString();
  
  return (
    <div
      className={`card card-${card.suit} ${draggable ? 'draggable' : ''}`}
      draggable={draggable}
      onDragStart={handleDragStart}
      onClick={handleClick}
      data-card-id={card.id}
    >
      <div className="card-value">{displayValue}</div>
      <div className="card-suit">{card.suit.toUpperCase()}</div>
    </div>
  );
};

export default Card;
