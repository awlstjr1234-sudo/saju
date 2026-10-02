'use client';

import { useEffect, useState } from 'react';
import type { DrawnCard } from '@/lib/tarot';

/** autoReveal: 카드가 순서대로 하나씩 뒤집히는 연출을 넣을지 여부 (실시간 뽑기용). */
export default function TarotCards({ cards, autoReveal = true }: { cards: DrawnCard[]; autoReveal?: boolean }) {
  const [revealed, setRevealed] = useState<boolean[]>(() => cards.map(() => !autoReveal));

  useEffect(() => {
    setRevealed(cards.map(() => !autoReveal));
    if (!autoReveal) return;
    const timers = cards.map((_, i) =>
      setTimeout(() => {
        setRevealed((prev) => {
          const next = prev.slice();
          next[i] = true;
          return next;
        });
      }, 260 + i * 220),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  function toggle(i: number) {
    setRevealed((prev) => {
      const next = prev.slice();
      next[i] = !next[i];
      return next;
    });
  }

  return (
    <div className="cards-row">
      {cards.map((item, i) => (
        <div
          key={`${item.card.id}-${i}`}
          className={`card${revealed[i] ? ' revealed' : ''}`}
          onClick={() => toggle(i)}
        >
          <div className="card-inner">
            <div className="card-face card-back">占</div>
            <div className="card-face card-front">
              <div className="card-pos">{item.position}</div>
              <div
                className="card-badge"
                style={{
                  background: `var(${item.card.colorVar})`,
                  color: item.card.colorVar === '--navy' ? 'var(--navy-contrast)' : 'var(--accent-contrast)',
                }}
              >
                {item.card.badge}
              </div>
              <div className="card-title">{item.card.title}</div>
              <div className="card-orient">{item.reversed ? '역방향' : '정방향'}</div>
              <p className="card-meaning">{item.reversed ? item.card.rev : item.card.up}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
