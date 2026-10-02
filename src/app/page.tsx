'use client';

import { useState } from 'react';
import SajuPanel from '@/components/SajuPanel';
import DailyPanel from '@/components/DailyPanel';
import TarotPanel from '@/components/TarotPanel';

type TabKey = 'saju' | 'daily' | 'tarot';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'saju', label: '四柱 사주풀이' },
  { key: 'daily', label: '今日 오늘의 운세' },
  { key: 'tarot', label: '占 타로' },
];

export default function HomePage() {
  const [active, setActive] = useState<TabKey>('saju');

  return (
    <div className="wrap">
      <header className="masthead">
        <div className="seal">運</div>
        <h1>사주 · 타로 · 오늘의 운세</h1>
        <p>생년월일로 사주팔자를 풀이하고, 타로와 오늘의 운세까지 한 자리에서</p>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <div
            key={t.key}
            className="tab"
            role="tab"
            tabIndex={0}
            aria-selected={active === t.key}
            onClick={() => setActive(t.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setActive(t.key);
            }}
          >
            {t.label}
          </div>
        ))}
      </div>

      <main className="panel">
        {active === 'saju' && <SajuPanel />}
        {active === 'daily' && <DailyPanel />}
        {active === 'tarot' && <TarotPanel />}
      </main>

      <p className="footnote">
        본 결과는 전통 만세력 계산법을 근사 구현한 오락용 콘텐츠예요. 절기 기준일은 연도별로 최대 하루
        정도 오차가 있을 수 있고, 음력 생일·자시 경계 등 세부 규칙은 단순화되어 있어요.
      </p>
    </div>
  );
}
