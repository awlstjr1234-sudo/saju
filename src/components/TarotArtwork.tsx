import Image from 'next/image';
import type { DeckCard } from '@/lib/tarot';

const MAJOR_COUNT = 22;
const MINOR_RANK_IMAGES: Record<string, string> = {
  에이스: 'ace',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  '10': 'ten',
  페이지: 'page',
  기사: 'knight',
  여왕: 'queen',
  왕: 'king',
};

function getImagePath(card: DeckCard): string {
  const majorMatch = /^major-(\d+)$/.exec(card.id);
  if (majorMatch) {
    const number = Number(majorMatch[1]);
    if (Number.isInteger(number) && number >= 0 && number < MAJOR_COUNT) {
      return `/tarot/major-${String(number).padStart(2, '0')}.webp`;
    }
  }

  const minorMatch = /^(wands|cups|swords|pentacles)-(.+)$/.exec(card.id);
  if (minorMatch) {
    const [, suit, rank] = minorMatch;
    const imageRank = MINOR_RANK_IMAGES[rank];
    if (imageRank) return `/tarot/${suit}-${imageRank}.webp`;
  }

  throw new Error(`Unsupported tarot card id: ${card.id}`);
}

export default function TarotArtwork({ card, reversed = false }: { card: DeckCard; reversed?: boolean }) {
  const title = card.title.replace(/^\d+\.\s*/, '');

  return (
    <Image
      className={`tarot-art${reversed ? ' tarot-art-reversed' : ''}`}
      src={getImagePath(card)}
      alt={`${title} 라이더-웨이트 타로 카드`}
      width={520}
      height={892}
    />
  );
}
