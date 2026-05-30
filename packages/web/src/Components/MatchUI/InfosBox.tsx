import { useState, useRef, useEffect } from 'react';
import './InfosBox.css';

interface Message {
    id: number;
    text: string;
}






// Variable stockée en dehors du composant (global au module). Permet d'exposer une fonction que d'autres fichiers peuvent appeler
let addInfo_internal: ((text: string) => void) | null = null;

// Fonction wrapper exportée, qui appelle addInfo_internal
/**
 * Ajoute text à la InfosBox si elle existe
 */
export const addInfo = (text: string) => {
    if (addInfo_internal) {
        addInfo_internal(text); // appelle la vraie fonction qui modifie le state
    } else {
        console.warn("InfosBox non montée, message ignoré :", text);
    }
};



/**
 * --- Exemple d'utilisation dans un composant ---
 * ```
 * import InfosBox, { addInfo } from "@/Components/Game/InfosBox";
 * import { useEffect } from "react";
 * 
 * export default function Debug() {
 *     useEffect(() => {
 *         (window as any).a = addInfo
 *         addInfo("Début de la partie...");
 *         addInfo("Le joueur a choisi l'épée");
 *         addInfo("Monstre vaincu !");
 *     }, [])
 * 
 *     return (
 *         <div>
 *             <InfosBox />
 *         </div>
 *     )
 * }
 * ```
 */
export default function InfosBox() {
    const [messages, setMessages] = useState<Message[]>([]);   // messages: tableau des messages affichés;   setMessages: modifie le state et déclenche le re-render

    const nextIdRef = useRef(0);   // Ref qui persiste entre les rendus sans déclencher de re-render.   nextIdRef.current donne l'ID unique pour le prochain message
    const scrollContainerRef = useRef<HTMLDivElement>(null);   // Ref pour accéder directement au DOM du conteneur scrollable

    useEffect(() => {
        // On remplit addInfo_internal qui est externe avec une fonction qui modifie le state
        addInfo_internal = (text: string) => {
            setMessages(prev => [{ id: nextIdRef.current++, text }, ...prev]);
        };

        return () => {   // Le return contient un callback exécuté quand le composant est démonté
            addInfo_internal = null; // Évite les appels sur un composant disparu
        };
    }, []);    // S'exécute une seule fois au premier render du composant

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0; // Force le scroll tout en haut
        }
    }, [messages]);   // S'exécute à chaque fois que 'messages' change

    return (
        <div className="InfosBox">
            <div className="infos-header">Historique</div>
            <div className="infos-messages" ref={scrollContainerRef}>
                {/* ref={...} attache la variable DOM au conteneur pour le contrôler */}
                {messages.map(msg => (
                    <div key={msg.id} className="infos-message">
                        {msg.text}
                    </div>
                ))}
            </div>
        </div>
    );
}