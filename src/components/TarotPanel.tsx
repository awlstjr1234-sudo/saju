'use client';

import { useEffect, useState } from 'react';
import { drawDailyCard, drawSpread, type DrawnCard } from '@/lib/tarot';
import { loadProfiles, type SajuProfile } from '@/lib/profiles';
import TarotCards from './TarotCards';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function TarotPanel() {
  const [date, setDate] = useState('');
  const [profiles, setProfiles] = useState<SajuProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [cards, setCards] = useState<DrawnCard[] | null>(null);

  useEffect(() => {
    setProfiles(loadProfiles());
  }, []);

  function handleProfileChange(profileId: string) {
    setSelectedProfileId(profileId);
    const profile = profiles.find((item) => item.id === profileId);
    if (!profile) return;
    setDate(profile.date);
    setCards(null);
  }

  function run(mode: 'daily' | 'spread') {
    const seedKey = date || 'guest';
    const today = todayISO();
    const drawn = mode === 'daily' ? [drawDailyCard(seedKey, today)] : drawSpread(seedKey, today);
    setCards(drawn);
  }

  const maxDate = todayISO();

  return (
    <section>
      <p className="hint" style={{ marginTop: 0 }}>
        오늘의 카드와 3장 스프레드 모두 78장 정식 타로 덱에서 생년월일 기준으로 하루에 한 번 정해져요. 같은
        날 다시 뽑아도 같은 카드가 나와요.
      </p>
      <div className="profile-bar">
        <div className="field">
          <label htmlFor="t-profile">저장된 프로필</label>
          <select id="t-profile" value={selectedProfileId} onChange={(e) => handleProfileChange(e.target.value)}>
            <option value="">직접 입력</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.profileName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="t-date">생년월일 (오늘의 카드용, 선택)</label>
          <input id="t-date" type="date" max={maxDate} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
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
