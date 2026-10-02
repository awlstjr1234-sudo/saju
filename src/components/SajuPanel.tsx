'use client';

import { useState } from 'react';
import { buildSajuReading, type SajuInput, type SajuResult } from '@/lib/saju';
import { parseCalendarDate } from '@/lib/calendar';
import type { SajuProfile } from '@/lib/profiles';
import SajuResultView from './SajuResultView';

export default function SajuPanel({ profile }: { profile: SajuProfile }) {
  const [result, setResult] = useState<SajuResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleRun() {
    const solarDate = parseCalendarDate(profile.date, profile.calendarType ?? 'solar', profile.leapMonth ?? false);
    if (!solarDate) {
      setError('프로필의 생년월일을 확인해주세요.');
      return;
    }
    const hour = profile.noTime || !profile.time ? null : Number(profile.time.split(':')[0]);
    const input: SajuInput = {
      name: profile.profileName,
      year: solarDate.year,
      month: solarDate.month,
      day: solarDate.day,
      hour,
    };
    setError(null);
    setResult(buildSajuReading(input));
}

  return (
    <section>
      <div className="actions">
        <button type="button" onClick={handleRun}>사주팔자 풀이하기</button>
      </div>
      {error && <p className="hint" style={{ color: 'var(--accent)' }}>{error}</p>}

      {result && (
        <>
          <hr className="divider" />
          <SajuResultView result={result} />
        </>
      )}
    </section>
  );
}
