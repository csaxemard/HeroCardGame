import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CardComponent } from './Card';
import type { Card, ZoneId } from './cards';
import styles from './Zone.module.css';

interface ZoneProps {
  id: ZoneId;
  label: string;
  cards: Card[];
  maxCards: number;
  isEnemy?: boolean;
  highlight?: boolean;
}

export function DroppableZone({ id, label, cards, maxCards, isEnemy = false, highlight = false }: ZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: isEnemy });

  return (
    <div
      ref={setNodeRef}
      className={[
        styles.zone,
        isOver && !isEnemy ? styles.isOver : '',
        highlight ? styles.highlight : '',
        isEnemy ? styles.enemy : '',
        id === 'hand' ? styles.hand : '',
        id === 'graveyard' ? styles.graveyard : '',
      ].join(' ')}
    >
      <div className={styles.zoneHeader}>
        <span className={styles.zoneLabel}>{label}</span>
        <span className={styles.zoneCount}>{cards.length}/{maxCards}</span>
      </div>

      <SortableContext items={cards.map(c => c.id)} strategy={horizontalListSortingStrategy}>
        <div className={[styles.cardsRow, cards.length === 0 ? styles.empty : ''].join(' ')}>
          {cards.length === 0 && (
            <div className={styles.emptyHint}>
              {isEnemy ? '—' : 'Déposez des cartes ici'}
            </div>
          )}
          {cards.map(card => (
            <CardComponent
              key={card.id}
              card={card}
              isInField={id.startsWith('field')}
              isEnemy={isEnemy}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
