'use client';

import { useEffect, useState } from 'react';
import { buildDailyFortune, type DailyFortuneInput, type DailyFortuneResult } from '@/lib/dailyFortune';
import { loadProfiles, type SajuProfile } from '@/lib/profiles';
import DailyResultView from './DailyResultView';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function DailyPanel() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [profiles, setProfiles] = useState<SajuProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [result, setResult] = useState<DailyFortuneResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProfiles(loadProfiles());
  }, []);

  function handleProfileChange(profileId: string) {
    setSelectedProfileId(profileId);
    const profile = profiles.find((item) => item.id === profileId);
    if (!profile) return;
    setName(profile.name);
    setDate(profile.date);
    setResult(null);
    setError(null);
  }

  function handleRun() {
    if (!date) {
      setError('생년월일을 입력해주세요.');
      return;
    }
    setError(null);
    const [y, m, d] = date.split('-').map(Number);
    const nextInput: DailyFortuneInput = {
      name: name.trim() || '당신',
      birthYear: y,
      birthMonth: m,
      birthDay: d,
      todayISO: todayISO(),
    };
    setResult(buildDailyFortune(nextInput));
  }

  const maxDate = todayISO();

  return (
    <section>
      <fieldset>
        <div className="profile-bar">
          <div className="field">
            <label htmlFor="d-profile">저장된 프로필</label>
            <select id="d-profile" value={selectedProfileId} onChange={(e) => handleProfileChange(e.target.value)}>
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
            <label htmlFor="d-name">이름 (선택)</label>
            <input id="d-name" type="text" placeholder="예: 홍길동" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="d-date">생년월일</label>
            <input id="d-date" type="date" max={maxDate} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div className="actions">
          <button type="button" onClick={handleRun}>
            오늘의 운세 보기
          </button>
        </div>
        <p className="hint">
          생년월일로 띠를 확인하고, 오늘의 일진(日辰)과 합·충·형 관계를 따져 운세를 풀이해요. 같은 띠라면 같은
          날엔 같은 운세가 나와요.
        </p>
        {error && <p className="hint" style={{ color: 'var(--accent)' }}>{error}</p>}
      </fieldset>

      {result && (
        <>
          <hr className="divider" />
          <DailyResultView result={result} />
        </>
      )}
    </section>
  );
}
