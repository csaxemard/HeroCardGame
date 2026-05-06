import { createContext } from 'react';
import type { AppState } from '@/types';



type AppContextType = {
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<any>>;
    utils: any;
};

export const AppContext = createContext<AppContextType | null>(null);