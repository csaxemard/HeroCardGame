import type { PlayerType } from "@/types";
import { createContext } from "react";

type MatchContextType = {
    actionsPassedToZones: {
        showModal: (cardId: number) => void,
        drawOnClickDeck: () => void,
    }
    canDrawCard: boolean,
};


export const MatchContext = createContext<MatchContextType | null>(null);