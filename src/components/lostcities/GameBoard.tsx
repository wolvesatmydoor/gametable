import React, { useEffect, useState, useRef } from 'react';
import { LostCitiesGame } from '../../game/lostcities/gameState';
import { GameState, TurnPhase, Suit, Card as CardType } from '../../game/lostcities/types';
import { canPlayCard } from '../../game/lostcities/deckUtils';
import PlayerHand from './PlayerHand';
import ExpeditionLane from './ExpeditionLane';
import DiscardPile from './DiscardPile';
import './GameBoard.css';
import { gsap } from 'gsap';

const GameBoard: React.FC = () => {
  const gameRef = useRef<LostCitiesGame>(new LostCitiesGame());
  const [gameState, setGameState] = useState<GameState>(gameRef.current.getState());
  const [draggedCard, setDraggedCard] = useState<CardType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const unsubscribe = gameRef.current.subscribe((state) => {
      setGameState(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleCardDragStart = (card: CardType) => {
    setDraggedCard(card);
  };

  const handleExpeditionDrop = (suit: Suit) => {
    if (!draggedCard || gameState.turnPhase !== TurnPhase.PLAY_OR_DISCARD) {
      return;
    }

    // Check if the card matches the expedition suit
    if (draggedCard.suit !== suit) {
      showError(`Cannot play ${draggedCard.suit} card on ${suit} expedition`);
      setDraggedCard(null);
      return;
    }

    const currentPlayer = gameRef.current.getCurrentPlayer();
    const expeditions = gameRef.current.getPlayerExpeditions(currentPlayer.id);
    const expedition = expeditions.find(exp => exp.suit === suit);

    if (!expedition) {
      setDraggedCard(null);
      return;
    }

    // Validate the move
    if (!canPlayCard(draggedCard, expedition.cards)) {
      showError('Invalid move: cards must be played in ascending order');
      setDraggedCard(null);
      return;
    }

    const success = gameRef.current.playCardToExpedition(draggedCard);
    if (success) {
      animateCardPlay();
    } else {
      showError('Failed to play card');
    }
    
    setDraggedCard(null);
  };

  const handleDiscardDrop = (suit: Suit) => {
    if (!draggedCard || gameState.turnPhase !== TurnPhase.PLAY_OR_DISCARD) {
      return;
    }

    // Check if the card matches the discard pile suit
    if (draggedCard.suit !== suit) {
      showError(`Cannot discard ${draggedCard.suit} card to ${suit} pile`);
      setDraggedCard(null);
      return;
    }

    const success = gameRef.current.discardCard(draggedCard);
    if (success) {
      animateCardPlay();
    } else {
      showError('Failed to discard card');
    }
    
    setDraggedCard(null);
  };

  const handleDrawFromDeck = () => {
    if (gameState.turnPhase !== TurnPhase.DRAW) {
      showError('You must play or discard a card first');
      return;
    }

    const success = gameRef.current.drawFromDeck();
    if (success) {
      animateCardDraw();
    } else {
      showError('Failed to draw from deck');
    }
  };

  const handleDrawFromDiscard = (suit: Suit) => {
    if (gameState.turnPhase !== TurnPhase.DRAW) {
      showError('You must play or discard a card first');
      return;
    }

    const success = gameRef.current.drawFromDiscard(suit);
    if (success) {
      animateCardDraw();
    } else {
      showError('Failed to draw from discard pile');
    }
  };

  const handleResetGame = () => {
    gameRef.current.resetGame();
  };

  const animateCardPlay = () => {
    gsap.from('.expedition-cards .card:last-child, .discard-pile-content .card', {
      scale: 0,
      duration: 0.3,
      ease: 'back.out(1.7)'
    });
  };

  const animateCardDraw = () => {
    gsap.from('.player-hand-cards .card:last-child', {
      x: -100,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  // Setup drag and drop event listeners
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      const expeditionLane = target.closest('.expedition-lane');
      const discardPile = target.closest('.discard-pile');

      if (expeditionLane) {
        const suit = expeditionLane.getAttribute('data-suit') as Suit;
        if (suit) {
          handleExpeditionDrop(suit);
        }
      } else if (discardPile) {
        const suit = discardPile.getAttribute('data-suit') as Suit;
        if (suit) {
          handleDiscardDrop(suit);
        }
      }
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [draggedCard, gameState.turnPhase]);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const otherPlayer = gameState.players[(gameState.currentPlayerIndex + 1) % 2];
  const currentPlayerExpeditions = gameRef.current.getPlayerExpeditions(currentPlayer.id);
  const otherPlayerExpeditions = gameRef.current.getPlayerExpeditions(otherPlayer.id);

  return (
    <div className="game-board">
      <div className="game-header">
        <h1>Lost Cities</h1>
        <button className="reset-button" onClick={handleResetGame}>
          New Game
        </button>
      </div>

      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}

      <div className="game-info">
        <div className="info-item">
          <span className="info-label">Cards in Deck:</span>
          <span className="info-value">{gameState.deck.length}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Turn Phase:</span>
          <span className="info-value">
            {gameState.turnPhase === TurnPhase.PLAY_OR_DISCARD 
              ? 'Play or Discard' 
              : 'Draw a Card'}
          </span>
        </div>
        {gameState.turnPhase === TurnPhase.DRAW && (
          <button className="draw-button" onClick={handleDrawFromDeck}>
            Draw from Deck
          </button>
        )}
      </div>

      {/* Other Player's Expeditions */}
      <div className="expeditions-section opponent">
        <h2>{otherPlayer.name}'s Expeditions</h2>
        <div className="expeditions-container">
          {otherPlayerExpeditions.map((expedition) => (
            <ExpeditionLane
              key={expedition.suit}
              expedition={expedition}
              isCurrentPlayer={false}
            />
          ))}
        </div>
      </div>

      {/* Discard Piles */}
      <div className="discard-section">
        <h2>Discard Piles</h2>
        <div className="discard-container">
          {gameState.discardPiles.map((pile) => (
            <DiscardPile
              key={pile.suit}
              discardPile={pile}
              onDrawFromDiscard={handleDrawFromDiscard}
              isCurrentPlayer={true}
              canDraw={gameState.turnPhase === TurnPhase.DRAW}
            />
          ))}
        </div>
      </div>

      {/* Current Player's Expeditions */}
      <div className="expeditions-section current-player">
        <h2>{currentPlayer.name}'s Expeditions</h2>
        <div className="expeditions-container">
          {currentPlayerExpeditions.map((expedition) => (
            <ExpeditionLane
              key={expedition.suit}
              expedition={expedition}
              isCurrentPlayer={true}
            />
          ))}
        </div>
      </div>

      {/* Player Hands */}
      <div className="hands-section">
        <PlayerHand
          cards={currentPlayer.hand}
          playerName={currentPlayer.name}
          isCurrentPlayer={true}
          onCardDragStart={handleCardDragStart}
        />
        <PlayerHand
          cards={otherPlayer.hand}
          playerName={otherPlayer.name}
          isCurrentPlayer={false}
        />
      </div>

      {/* Game Over Screen */}
      {gameState.phase === 'game_over' && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>Game Over!</h2>
            <p>The deck is empty. Time to calculate scores!</p>
            <button className="reset-button" onClick={handleResetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
