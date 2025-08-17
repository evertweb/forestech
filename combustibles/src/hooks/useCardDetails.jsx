/**
 * useCardDetails.js - Hook para manejar detalles de cards
 */

import React from 'react';
import CardDetails from '../components/shared/CardDetails';

// Hook para manejar cards con modal de detalles
export const useCardDetails = () => {
  const [selectedCard, setSelectedCard] = React.useState(null);

  const openCardDetails = (card) => {
    if (card.details) {
      setSelectedCard(card);
    }
  };

  const closeCardDetails = () => {
    setSelectedCard(null);
  };

  const CardDetailsModal = selectedCard ? (
    <CardDetails card={selectedCard} onClose={closeCardDetails} />
  ) : null;

  return {
    openCardDetails,
    closeCardDetails,
    CardDetailsModal,
    selectedCard,
  };
};

export default useCardDetails;
