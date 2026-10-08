'use client';

import { useState } from 'react';
import { DECK, interpretSpread, type DeckCard, type DrawnCard } from '@/lib/tarot';
import { shuffle } from '@/lib/random';
import TarotCards from './TarotCards';

type ReadingMode = 'daily' | 'spread';
const PICK_COUNT = 12;

export default function TarotPanel() {
  const [mode, setMode] = useState<ReadingMode | null>(null);
  const [pool, setPool] = useState<DeckCard[]>([]);
  const [cards, setCards] = useState<DrawnCard[] | null>(null);

  function startReading(nextMode: ReadingMode) {
    setMode(nextMode);
    setPool(shuffle(DECK, Math.random).slice(0, PICK_COUNT));
    setCards([]);
  }

  function pickCard(card: DeckCard) {
    if (!mode || !cards || cards.length >= (mode === 'daily' ? 1 : 3)) return;
    const positions = mode === 'daily' ? ['오늘의 카드'] : ['과거', '현재', '미래'];
    setCards([...cards, {
      position: positions[cards.length],
      card,
      reversed: Math.random() < 0.5,
    }]);
  }

  function resetReading() {
    setMode(null);
    setPool([]);
    setCards(null);
  }

  return (
    <section>
      <p className="hint" style={{ marginTop: 0 }}>
        원하는 방식으로 펼친 카드 중 직접 골라보세요. 카드는 선택할 때까지 뒷면으로 가려져 있어요.
      </p>
      {!mode && (
        <div className="tarot-modes">
          <button type="button" onClick={() => startReading('daily')}>오늘의 카드 직접 뽑기</button>
          <button type="button" className="ghost" onClick={() => startReading('spread')}>과거·현재·미래 3장 직접 뽑기</button>
        </div>
      )}

      {mode && cards && cards.length < (mode === 'daily' ? 1 : 3) && (
        <div className="tarot-pick-area">
          <p className="tarot-pick-instruction">
            {mode === 'daily'
              ? '마음속으로 질문을 떠올린 뒤 카드 한 장을 선택하세요.'
              : `${cards.length + 1}번째 카드: ${['과거', '현재', '미래'][cards.length]} 위치의 카드를 선택하세요.`}
          </p>
          <div className="tarot-pick-grid">
            {pool.map((card, index) => {
              const selected = cards.some((picked) => picked.card.id === card.id);
              return (
                <button
                  className={`tarot-pick-card${selected ? ' selected' : ''}`}
                  type="button"
                  key={`${card.id}-${index}`}
                  disabled={selected}
                  onClick={() => pickCard(card)}
                  aria-label={selected ? `${card.title}, 이미 선택함` : `뒷면 카드 ${index + 1} 선택`}
                >
                  <span aria-hidden="true">✦</span>
                  <small>{selected ? '선택 완료' : '선택하기'}</small>
                </button>
              );
            })}
          </div>
          <button type="button" className="ghost" onClick={() => startReading(mode)}>다시 섞기</button>
        </div>
      )}

      {cards && cards.length > 0 && (
        <div className="tarot-reading">
          <h3 className="tarot-reading-heading">{mode === 'daily' ? '오늘의 카드' : '선택한 카드'}</h3>
          <TarotCards cards={cards} />
          {cards.length === 3 && (
            <div className="tarot-combination">
              <h3>세 카드의 조합</h3>
              <p>{interpretSpread(cards)}</p>
              <p>과거 카드는 지금까지 이어진 배경을, 현재 카드는 현재의 핵심 과제와 대응 방식을, 미래 카드는 지금의 흐름이 이어질 때 나타날 가능성을 보여줘요. 세 카드를 따로 보기보다 앞선 경험이 현재의 선택에 어떤 영향을 주고, 그 선택이 미래의 흐름을 어떻게 바꾸는지 함께 생각해보세요.</p>
            </div>
          )}
          {cards.length === (mode === 'daily' ? 1 : 3) ? (
            <button type="button" className="ghost" onClick={resetReading}>다른 카드 뽑기</button>
          ) : (
            <p className="tarot-picked-count" aria-live="polite">
              지금까지 {cards.length}장 선택했어요. 총 3장 중 {cards.length}장
            </p>
          )}
        </div>
      )}
    </section>
  );
}
