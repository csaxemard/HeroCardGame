import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { CardComponent } from './Card';
import { DroppableZone } from './Zone';
import type { Card, ZoneId } from './cards';
import { ALL_CARDS, getStartingHand } from './cards';
import styles from './App.module.css';

interface Zones {
  hand: Card[];
  'field-player': Card[];
  'field-enemy': Card[];
  graveyard: Card[];
}

const ZONE_LABELS: Record<ZoneId, string> = {
  hand: 'Main',
  'field-player': 'Champ de Bataille — Joueur',
  'field-enemy': 'Champ de Bataille — Ennemi',
  graveyard: 'Cimetière',
};

const ZONE_MAX: Record<ZoneId, number> = {
  hand: 10,
  'field-player': 6,
  'field-enemy': 6,
  graveyard: 99,
};

function buildEnemyField(): Card[] {
  const pool = [...ALL_CARDS].sort(() => Math.random() - 0.5);
  return pool.slice(0, 4).map(c => ({ ...c, id: 'enemy-' + c.id }));
}

function findCardZone(zones: Zones, cardId: string): ZoneId | null {
  for (const [zoneId, cards] of Object.entries(zones)) {
    if (cards.find(c => c.id === cardId)) return zoneId as ZoneId;
  }
  return null;
}

export default function App() {
  const [zones, setZones] = useState<Zones>({
    hand: getStartingHand(),
    'field-player': [],
    'field-enemy': buildEnemyField(),
    graveyard: [],
  });
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [playerHP, setPlayerHP] = useState(30);
  const [enemyHP, setEnemyHP] = useState(30);
  const [mana, setMana] = useState(3);
  const [maxMana, setMaxMana] = useState(3);
  const [log, setLog] = useState<string[]>(['⚔️  La bataille commence !', '🃏  Piochez vos cartes et formez votre stratégie.']);
  const [turn, setTurn] = useState(1);

  const addLog = useCallback((msg: string) => {
    setLog(prev => [msg, ...prev].slice(0, 8));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    const zoneId = findCardZone(zones, active.id as string);
    if (!zoneId) return;
    const card = zones[zoneId].find(c => c.id === active.id) ?? null;
    setActiveCard(card);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const activeZone = findCardZone(zones, active.id as string);
    const overZone = findCardZone(zones, over.id as string) ?? (over.id as ZoneId);
    if (!activeZone || !overZone || activeZone === overZone) return;

    setZones(prev => {
      const src = [...prev[activeZone]];
      const dst = [...prev[overZone]];
      const cardIdx = src.findIndex(c => c.id === active.id);
      if (cardIdx === -1) return prev;
      const [card] = src.splice(cardIdx, 1);

      const overItemIdx = dst.findIndex(c => c.id === over.id);
      if (overItemIdx >= 0) dst.splice(overItemIdx, 0, card);
      else dst.push(card);

      return { ...prev, [activeZone]: src, [overZone]: dst };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null);
    if (!over) return;

    const activeZone = findCardZone(zones, active.id as string);
    const overZone = findCardZone(zones, over.id as string) ?? (over.id as ZoneId);
    if (!activeZone || !overZone) return;

    const card = zones[activeZone].find(c => c.id === active.id);
    if (!card) return;

    // Log move
    if (activeZone !== overZone) {
      if (overZone === 'field-player') addLog(`🃏  ${card.name} invoqué sur le champ !`);
      else if (overZone === 'graveyard') addLog(`💀  ${card.name} envoyé au cimetière.`);
      else if (overZone === 'hand') addLog(`↩️  ${card.name} retourne en main.`);
    } else {
      // Reorder within same zone
      setZones(prev => {
        const arr = [...prev[activeZone]];
        const oldIdx = arr.findIndex(c => c.id === active.id);
        const newIdx = arr.findIndex(c => c.id === over.id);
        if (oldIdx !== -1 && newIdx !== -1) {
          return { ...prev, [activeZone]: arrayMove(arr, oldIdx, newIdx) };
        }
        return prev;
      });
    }
  };

  const handleAttack = () => {
    const attackers = zones['field-player'];
    const defenders = zones['field-enemy'];
    if (attackers.length === 0) { addLog('⚠️  Pas de cartes sur le champ pour attaquer !'); return; }

    const totalAtk = attackers.reduce((s, c) => s + c.attack, 0);
    const totalDef = defenders.reduce((s, c) => s + c.defense, 0);
    const dmg = Math.max(0, totalAtk - Math.floor(totalDef * 0.4));

    setEnemyHP(h => Math.max(0, h - dmg));
    addLog(`⚔️  Attaque ! ${totalAtk} ATK vs ${totalDef} DEF → ${dmg} dégâts !`);

    if (dmg > 0 && defenders.length > 0) {
      // Remove the weakest enemy card
      const sorted = [...defenders].sort((a, b) => a.defense - b.defense);
      const victim = sorted[0];
      setZones(prev => ({
        ...prev,
        'field-enemy': prev['field-enemy'].filter(c => c.id !== victim.id),
      }));
      addLog(`💀  ${victim.name} est détruit !`);
    }
  };

  const handleEndTurn = () => {
    setTurn(t => t + 1);
    const newMax = Math.min(maxMana + 1, 10);
    setMaxMana(newMax);
    setMana(newMax);
    // Enemy attacks back
    const enemyCards = zones['field-enemy'];
    if (enemyCards.length > 0) {
      const atkTotal = enemyCards.reduce((s, c) => s + c.attack, 0);
      const playerDef = zones['field-player'].reduce((s, c) => s + c.defense, 0);
      const dmg = Math.max(1, atkTotal - Math.floor(playerDef * 0.3));
      setPlayerHP(h => Math.max(0, h - dmg));
      addLog(`👹  L'ennemi attaque ! ${dmg} dégâts !`);
    }
    // Draw a card
    const remaining = ALL_CARDS.filter(c => !Object.values(zones).flat().find(z => z.id === c.id));
    if (remaining.length > 0) {
      const draw = remaining[Math.floor(Math.random() * remaining.length)];
      setZones(prev => ({ ...prev, hand: [...prev.hand, draw] }));
      addLog(`🃏  Tour ${turn + 1} — Carte piochée : ${draw.name}`);
    } else {
      addLog(`🃏  Tour ${turn + 1} — Pioche vide !`);
    }
  };

  const isGameOver = playerHP <= 0 || enemyHP <= 0;

  const resetGame = () => {
    setZones({ hand: getStartingHand(), 'field-player': [], 'field-enemy': buildEnemyField(), graveyard: [] });
    setPlayerHP(30); setEnemyHP(30); setMana(3); setMaxMana(3); setTurn(1);
    setLog(['⚔️  Nouvelle partie !', '🃏  Piochez vos cartes et formez votre stratégie.']);
  };

  return (
    <div className={styles.app}>
      {/* Background texture */}
      <div className={styles.bgTexture} />
      <div className={styles.bgVignette} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>⚔ Card Duel ⚔</h1>
            <span className={styles.turnBadge}>Tour {turn}</span>
          </div>
          <div className={styles.manaRow}>
            {Array.from({ length: maxMana }).map((_, i) => (
              <div key={i} className={[styles.manaCrystal, i < mana ? styles.manaCrystalFull : ''].join(' ')} />
            ))}
          </div>
        </header>

        {/* Game board */}
        <main className={styles.board}>

          {/* Enemy status */}
          <div className={styles.statusBar}>
            <span className={styles.playerLabel}>👹 Ennemi</span>
            <div className={styles.hpBar}>
              <div className={styles.hpFill} style={{ width: `${(enemyHP / 30) * 100}%`, background: 'linear-gradient(90deg, #8b1a1a, #c0392b)' }} />
              <span className={styles.hpText}>{enemyHP} / 30</span>
            </div>
          </div>

          {/* Enemy field */}
          <DroppableZone
            id="field-enemy"
            label={ZONE_LABELS['field-enemy']}
            cards={zones['field-enemy']}
            maxCards={ZONE_MAX['field-enemy']}
            isEnemy
          />

          {/* Divider */}
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <div className={styles.dividerOrb} />
            <div className={styles.dividerLine} />
          </div>

          {/* Player field */}
          <DroppableZone
            id="field-player"
            label={ZONE_LABELS['field-player']}
            cards={zones['field-player']}
            maxCards={ZONE_MAX['field-player']}
            highlight
          />

          {/* Player status */}
          <div className={styles.statusBar}>
            <span className={styles.playerLabel}>🧙 Vous</span>
            <div className={styles.hpBar}>
              <div className={styles.hpFill} style={{ width: `${(playerHP / 30) * 100}%`, background: 'linear-gradient(90deg, #1a5c2e, #27ae60)' }} />
              <span className={styles.hpText}>{playerHP} / 30</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.actions}>
            <button className={[styles.btn, styles.btnAttack].join(' ')} onClick={handleAttack} disabled={isGameOver}>
              ⚔ Attaquer
            </button>
            <button className={[styles.btn, styles.btnEnd].join(' ')} onClick={handleEndTurn} disabled={isGameOver}>
              ↪ Fin de Tour
            </button>
            <button className={[styles.btn, styles.btnReset].join(' ')} onClick={resetGame}>
              ↺ Nouvelle Partie
            </button>
          </div>

          {/* Graveyard */}
          <details className={styles.graveyardDetails}>
            <summary className={styles.graveyardSummary}>💀 Cimetière ({zones.graveyard.length})</summary>
            <DroppableZone
              id="graveyard"
              label={ZONE_LABELS.graveyard}
              cards={zones.graveyard}
              maxCards={ZONE_MAX.graveyard}
            />
          </details>

          {/* Hand */}
          <div className={styles.handSection}>
            <DroppableZone
              id="hand"
              label={`${ZONE_LABELS.hand} (${zones.hand.length} cartes)`}
              cards={zones.hand}
              maxCards={ZONE_MAX.hand}
            />
          </div>
        </main>

        {/* Log */}
        <aside className={styles.log}>
          {log.map((entry, i) => (
            <div key={i} className={styles.logEntry} style={{ opacity: 1 - i * 0.1 }}>{entry}</div>
          ))}
        </aside>

        {/* Game over overlay */}
        {isGameOver && (
          <div className={styles.gameOver}>
            <div className={styles.gameOverPanel}>
              <h2 className={styles.gameOverTitle}>
                {playerHP <= 0 ? '💀 Défaite' : '🏆 Victoire !'}
              </h2>
              <p className={styles.gameOverSub}>
                {playerHP <= 0 ? 'Vos forces sont épuisées.' : 'L\'ennemi est vaincu !'}
              </p>
              <button className={[styles.btn, styles.btnReset].join(' ')} onClick={resetGame}>
                ↺ Rejouer
              </button>
            </div>
          </div>
        )}

        <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeCard && <CardComponent card={activeCard} isOverlay />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
