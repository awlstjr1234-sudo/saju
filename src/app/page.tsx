'use client';

import { useEffect, useState } from 'react';
import SajuPanel from '@/components/SajuPanel';
import DailyPanel from '@/components/DailyPanel';
import ProfileSetupPanel from '@/components/ProfileSetupPanel';
import TarotPanel from '@/components/TarotPanel';
import { loadActiveProfileId, loadProfiles, saveActiveProfileId, saveProfiles, type SajuProfile } from '@/lib/profiles';

type MainTab = 'profile' | 'tarot';
type ProfileTab = 'saju' | 'daily' | 'specific';
const MAIN_TABS: { key: MainTab; label: string }[] = [
  { key: 'profile', label: '프로필 생성' },
  { key: 'tarot', label: '타로' },
];
const PROFILE_TABS: { key: ProfileTab; label: string }[] = [
  { key: 'saju', label: '사주' },
  { key: 'daily', label: '오늘의 운세' },
  { key: 'specific', label: '지정일 운세' },
];

export default function HomePage() {
  const [activeMain, setActiveMain] = useState<MainTab>('profile');
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTab>('saju');
  const [profiles, setProfiles] = useState<SajuProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState('');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadedProfiles = loadProfiles();
    const storedId = loadActiveProfileId();
    const selected = loadedProfiles.find((profile) => profile.id === storedId) ?? loadedProfiles[0];
    setProfiles(loadedProfiles);
    setActiveProfileId(selected?.id ?? '');
    if (selected) saveActiveProfileId(selected.id);
    setReady(true);
  }, []);

  const activeProfile = profiles.find((profile) => profile.id === activeProfileId) ?? null;

  function handleSaveProfile(profile: SajuProfile) {
    const nextProfiles = [...profiles.filter((item) => item.id !== profile.id), profile];
    saveProfiles(nextProfiles);
    saveActiveProfileId(profile.id);
    setProfiles(nextProfiles);
    setActiveProfileId(profile.id);
    setShowProfileForm(false);
    setActiveProfileTab('saju');
  }

  function handleProfileChange(profileId: string) {
    setActiveProfileId(profileId);
    saveActiveProfileId(profileId);
    setActiveProfileTab('saju');
  }

  function handleDeleteProfile() {
    if (!activeProfile) return;
    const nextProfiles = profiles.filter((profile) => profile.id !== activeProfile.id);
    saveProfiles(nextProfiles);
    const nextActiveProfile = nextProfiles[0] ?? null;
    setProfiles(nextProfiles);
    setActiveProfileId(nextActiveProfile?.id ?? '');
    saveActiveProfileId(nextActiveProfile?.id ?? '');
  }

  return (
    <div className="wrap">
      <header className="masthead">
        <div className="seal">運</div>
        <h1>사주 · 타로 · 오늘의 운세</h1>
        <p>생년월일로 사주팔자를 풀이하고, 타로와 오늘의 운세까지 한 자리에서</p>
      </header>

      <div className="tabs" role="tablist" aria-label="주요 메뉴">
        {MAIN_TABS.map((t) => (
          <button
            key={t.key}
            className="tab"
            role="tab"
            aria-selected={activeMain === t.key}
            onClick={() => setActiveMain(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main className="panel">
        {activeMain === 'tarot' ? (
          <TarotPanel />
        ) : !ready ? null : showProfileForm || !activeProfile ? (
          <ProfileSetupPanel
            profileCount={profiles.length}
            onSave={handleSaveProfile}
            onCancel={activeProfile ? () => setShowProfileForm(false) : undefined}
          />
        ) : (
          <>
            <div className="profile-toolbar">
              <div className="field">
                <label htmlFor="active-profile">사용 중인 프로필</label>
                <select id="active-profile" value={activeProfile.id} onChange={(event) => handleProfileChange(event.target.value)}>
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>{profile.profileName}</option>
                  ))}
                </select>
              </div>
              <div className="profile-actions">
                <button type="button" className="ghost" onClick={() => setShowProfileForm(true)}>새 프로필</button>
                <button type="button" className="ghost" onClick={handleDeleteProfile}>프로필 삭제</button>
              </div>
            </div>
            <div className="tabs nested-tabs" role="tablist" aria-label="프로필 운세 메뉴">
              {PROFILE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className="tab"
                  role="tab"
                  aria-selected={activeProfileTab === tab.key}
                  onClick={() => setActiveProfileTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="profile-content">
              {activeProfileTab === 'saju' && <SajuPanel key={activeProfile.id} profile={activeProfile} />}
              {activeProfileTab === 'daily' && <DailyPanel key={activeProfile.id} profile={activeProfile} />}
              {activeProfileTab === 'specific' && <DailyPanel key={`${activeProfile.id}-specific`} profile={activeProfile} specificDate />}
            </div>
          </>
        )}
      </main>

      <p className="footnote">
        본 결과는 전통 만세력 계산법을 근사 구현한 오락용 콘텐츠예요. 절기 기준일은 연도별로 최대 하루
        정도 오차가 있을 수 있고, 음력 생일·자시 경계 등 세부 규칙은 단순화되어 있어요.
      </p>
    </div>
  );
}
