import type { DailyFortuneResult } from '@/lib/dailyFortune';
import { ANIMAL_KR, ANIMAL_EMOJI } from '@/lib/dailyFortune';

export default function DailyResultView({ result }: { result: DailyFortuneResult }) {
  return (
    <div>
      <div className="fortune-head">
        <h2>{result.name}님의 오늘의 운세</h2>
        <span className="fortune-date">{result.todayLabel}</span>
      </div>
      <p className="zodiac-line">
        {ANIMAL_EMOJI[result.zodiacBranch]} <strong>{ANIMAL_KR[result.zodiacBranch]}띠</strong> · 오늘의
        일진과 <strong>{result.relationLabel}</strong> 관계
      </p>
      <p className="fortune-lead">{result.leadText}</p>

      <div className="meters">
        {result.meters.map((m) => (
          <div className="meter-row" key={m.key}>
            <div className="top">
              <span>{m.label}</span>
              <span className="score">{m.score}</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${m.score}%` }} />
            </div>
            <p className="meter-msg">{m.message}</p>
          </div>
        ))}
      </div>

      <div className="lucky-row">
        <div className="lucky-chip">
          <div className="k">행운의 색</div>
          <div className="v">{result.lucky.color}</div>
        </div>
        <div className="lucky-chip">
          <div className="k">행운의 숫자</div>
          <div className="v">{result.lucky.number}</div>
        </div>
        <div className="lucky-chip">
          <div className="k">행운의 아이템</div>
          <div className="v">{result.lucky.item}</div>
        </div>
      </div>
    </div>
  );
}
