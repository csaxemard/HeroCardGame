import { useState, useRef } from 'react';
import { MatchManager } from '@/Core/MatchManager';

export function useMatch(deckPlayer: string[], deckOpponent: string[]) {
    const [state, setState] = useState(() => {
        const manager = new MatchManager(deckPlayer, deckOpponent);
        return manager.getState();
    });

    const managerRef = useRef(new MatchManager(deckPlayer, deckOpponent));

    const update = () => {
        setState({ ...managerRef.current.getState() });
    };

    const playCard = (cardId: string, targetZone: string) => {
        managerRef.current.playCard(cardId, targetZone);
        update();
    };

    const endTurn = () => {
        managerRef.current.endTurn();
        update();
    };

    return { state, playCard, endTurn };
}