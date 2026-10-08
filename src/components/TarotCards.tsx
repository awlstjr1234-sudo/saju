import { getCardEssence, type DrawnCard } from '@/lib/tarot';
import TarotArtwork from './TarotArtwork';

export default function TarotCards({ cards }: { cards: DrawnCard[] }) {
  return (
    <div className="tarot-results">
      {cards.map((item, i) => (
        <article className="tarot-result" key={`${item.card.id}-${i}`}>
          <div className="tarot-image-wrap">
            <TarotArtwork card={item.card} reversed={item.reversed} />
          </div>
          <p className="tarot-result-position">{item.position}</p>
          <h3 className="tarot-result-title">{item.card.title}</h3>
          <p className="card-orient">{item.reversed ? '역방향' : '정방향'}</p>
          <div className="tarot-explanation">
            <h4>카드의 상징</h4>
            <p>{getCardEssence(item.card)}</p>
            <h4>이번 카드의 해석</h4>
            <p>{item.reversed ? item.card.rev : item.card.up}</p>
            {item.reversed && (
              <>
                <h4>살펴볼 점</h4>
                <p>이 카드의 에너지가 막히거나 안으로 향하는 모습일 수 있어요. 서두르기보다 준비가 덜 된 부분과 반복되는 습관을 확인해보세요.</p>
              </>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
