'use client';

import { useEffect, useState } from 'react';
import { buildSajuReading, type SajuInput, type SajuResult } from '@/lib/saju';
import { loadProfiles, saveProfiles as persistProfiles, type SajuProfile } from '@/lib/profiles';
import SajuResultView from './SajuResultView';

function newProfileId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function SajuPanel() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [noTime, setNoTime] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profiles, setProfiles] = useState<SajuProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [result, setResult] = useState<SajuResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProfiles(loadProfiles());
  }, []);

  function saveProfiles(nextProfiles: SajuProfile[]) {
    setProfiles(nextProfiles);
    persistProfiles(nextProfiles);
  }

  function resetForm() {
    setSelectedProfileId('');
    setProfileName('');
    setName('');
    setDate('');
    setTime('');
    setNoTime(false);
    setResult(null);
    setError(null);
  }

  function handleProfileChange(profileId: string) {
    if (!profileId) {
      resetForm();
      return;
    }
    const profile = profiles.find((item) => item.id === profileId);
    if (!profile) return;
    setSelectedProfileId(profile.id);
    setProfileName(profile.profileName);
    setName(profile.name);
    setDate(profile.date);
    setTime(profile.time);
    setNoTime(profile.noTime);
    setResult(null);
    setError(null);
  }

  function handleDeleteProfile() {
    if (!selectedProfileId) return;
    const nextProfiles = profiles.filter((profile) => profile.id !== selectedProfileId);
    saveProfiles(nextProfiles);
    resetForm();
  }

  function handleRun() {
    if (!date) {
      setError('생년월일을 입력해주세요.');
      return;
    }
    setError(null);
    const [y, m, d] = date.split('-').map(Number);
    const hasHour = !noTime && !!time;
    const hour = hasHour ? Number(time.split(':')[0]) : null;

    const nextInput: SajuInput = { name: name.trim(), year: y, month: m, day: d, hour };
    const profile: SajuProfile = {
      id: selectedProfileId || newProfileId(),
      profileName: profileName.trim() || name.trim() || `프로필 ${profiles.length + 1}`,
      name: name.trim(),
      date,
      time: hasHour ? time : '',
      noTime,
    };
    saveProfiles([...profiles.filter((item) => item.id !== profile.id), profile]);
    setSelectedProfileId(profile.id);
    setProfileName(profile.profileName);
    setResult(buildSajuReading(nextInput));
  }

  const today = new Date();
  const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate(),
  ).padStart(2, '0')}`;

  return (
    <section>
      <fieldset>
        <div className="profile-bar">
          <div className="field">
            <label htmlFor="s-profile">저장된 프로필</label>
            <select id="s-profile" value={selectedProfileId} onChange={(e) => handleProfileChange(e.target.value)}>
              <option value="">새 프로필</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.profileName}
                </option>
              ))}
            </select>
          </div>
          <div className="profile-actions">
            <button type="button" className="ghost" onClick={resetForm}>
              새 프로필
            </button>
            <button type="button" className="ghost" onClick={handleDeleteProfile} disabled={!selectedProfileId}>
              프로필 삭제
            </button>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="s-profile-name">프로필 이름</label>
            <input
              id="s-profile-name"
              type="text"
              placeholder="예: 나, 엄마, 친구"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="s-name">이름 (선택)</label>
            <input id="s-name" type="text" placeholder="예: 홍길동" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="s-date">생년월일 (양력)</label>
            <input id="s-date" type="date" max={maxDate} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="s-time">태어난 시간</label>
            <input
              id="s-time"
              type="time"
              value={time}
              disabled={noTime}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        <div className="check-row">
          <input id="s-notime" type="checkbox" checked={noTime} onChange={(e) => setNoTime(e.target.checked)} />
          <label htmlFor="s-notime" style={{ margin: 0, textTransform: 'none', letterSpacing: 'normal', fontSize: 13.5 }}>
            태어난 시간을 몰라요 (시주 제외)
          </label>
        </div>
        <div className="actions">
          <button type="button" onClick={handleRun}>
            사주팔자 풀이하기
          </button>
        </div>
        {error && <p className="hint" style={{ color: 'var(--accent)' }}>{error}</p>}
      </fieldset>

      {result && (
        <>
          <hr className="divider" />
          <SajuResultView result={result} />
        </>
      )}
    </section>
  );
}
