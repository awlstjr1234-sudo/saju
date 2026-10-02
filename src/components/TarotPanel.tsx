'use client';

import { useState } from 'react';
import { drawDailyCard, drawSpread, type DrawnCard } from '@/lib/tarot';
import TarotCards from './TarotCards';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function TarotPanel() {
  const [cards, setCards] = useState<DrawnCard[] | null>(null);

  function run(mode: 'daily' | 'spread') {
    const seedKey = 'guest';
    const today = todayISO();
    const drawn = mode === 'daily' ? [drawDailyCard(seedKey, today)] : drawSpread(seedKey, today);
    setCards(drawn);
  }

  return (
    <section>
      <p className="hint" style={{ marginTop: 0 }}>
        오늘의 카드와 3장 스프레드를 뽑아보세요. 같은 날 다시 뽑아도 같은 카드가 나와요.
      </p>
      <div className="tarot-modes">
        <button type="button" onClick={() => run('daily')}>
          오늘의 카드 뽑기
        </button>
        <button type="button" className="ghost" onClick={() => run('spread')}>
          과거·현재·미래 3장 스프레드
        </button>
      </div>

      {cards && <TarotCards cards={cards} autoReveal />}
    </section>
  );
}
