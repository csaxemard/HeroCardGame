import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType } from './cards';
import { SUITS } from './cards';
import styles from './Card.module.css';

interface CardProps {
  card: CardType;
  isOverlay?: boolean;
  isInField?: boolean;
  isEnemy?: boolean;
  onClick?: () => void;
}

const RARITY_LABELS: Record<string, string> = {
  common: 'Commune',
  rare: 'Rare',
  legendary: 'Légendaire',
};

export function CardComponent({ card, isOverlay = false, isInField = false, isEnemy = false, onClick }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    disabled: isEnemy,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : isOverlay ? 1000 : 1,
  };

  const suit = SUITS[card.suit];
  const isLegendary = card.rarity === 'legendary';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEnemy ? {} : { ...attributes, ...listeners })}
      className={[
        styles.card,
        styles[card.suit],
        styles[card.rarity],
        isOverlay ? styles.overlay : '',
        isInField ? styles.inField : '',
        isEnemy ? styles.enemy : '',
      ].join(' ')}
      onClick={onClick}
      title={card.description}
    >
      {/* Holo shimmer for legendary */}
      {isLegendary && <div className={styles.holoShimmer} />}

      {/* Top row: mana + suit */}
      <div className={styles.topRow}>
        <div className={styles.mana} style={{ '--suit-glow': suit.glow } as React.CSSProperties}>
          <span className={styles.manaIcon}>◆</span>
          <span>{card.mana}</span>
        </div>
        <span className={styles.suitEmoji}>{suit.emoji}</span>
      </div>

      {/* Art zone */}
      <div className={styles.artZone} style={{ '--suit-color': suit.color, '--suit-glow': suit.glow } as React.CSSProperties}>
        <div className={styles.artSymbol}>{suit.emoji}</div>
        {isLegendary && <div className={styles.legendaryRing} />}
      </div>

      {/* Name */}
      <div className={styles.nameRow}>
        <span className={styles.cardName}>{card.name}</span>
        {card.rarity !== 'common' && (
          <span className={styles.rarityBadge} style={{ '--suit-color': suit.color } as React.CSSProperties}>
            {RARITY_LABELS[card.rarity]}
          </span>
        )}
      </div>

      {/* Description / power */}
      <div className={styles.descRow}>
        {card.power && <span className={styles.power} style={{ '--suit-glow': suit.glow } as React.CSSProperties}>⚡ {card.power}</span>}
        <p className={styles.desc}>{card.description}</p>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.stat} title="Attaque">
          <span className={styles.statIcon}>⚔</span>
          <span>{card.attack}</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat} title="Défense">
          <span className={styles.statIcon}>🛡</span>
          <span>{card.defense}</span>
        </div>
      </div>

      {/* Corner ornaments */}
      <div className={styles.cornerTL} />
      <div className={styles.cornerBR} />
    </div>
  );
}
