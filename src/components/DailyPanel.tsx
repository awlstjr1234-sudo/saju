'use client';

import { useEffect, useRef, useState } from 'react';
import { buildDailyFortune, type DailyFortuneInput, type DailyFortuneResult } from '@/lib/dailyFortune';
import { parseCalendarDate } from '@/lib/calendar';
import type { SajuProfile } from '@/lib/profiles';
import DailyResultView from './DailyResultView';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function DailyPanel({ profile, specificDate = false }: { profile: SajuProfile; specificDate?: boolean }) {
  const [result, setResult] = useState<DailyFortuneResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const dateInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedDate(todayISO());
  }, []);

  function handleRun() {
    const solarDate = parseCalendarDate(profile.date, profile.calendarType ?? 'solar', profile.leapMonth ?? false);
    if (!solarDate) {
      setError('프로필의 생년월일을 확인해주세요.');
      return;
    }
    const fortuneDate = specificDate ? selectedDate : todayISO();
    if (!fortuneDate) {
      setError('달력에서 날짜를 지정해주세요.');
      return;
    }
    setError(null);
    const nextInput: DailyFortuneInput = {
      name: profile.profileName || '당신',
      birthYear: solarDate.year,
      birthMonth: solarDate.month,
      birthDay: solarDate.day,
      todayISO: fortuneDate,
    };
    setResult(buildDailyFortune(nextInput));
  }

  return (
    <section>
      <fieldset>
        {specificDate && (
          <div className="field-row">
            <div className="field">
              <label htmlFor="fortune-date">운세를 볼 날짜</label>
              <input
                id="fortune-date"
                ref={dateInput}
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </div>
            <div className="field date-action">
              <span className="label-spacer" aria-hidden="true">&nbsp;</span>
              <button type="button" className="ghost" onClick={() => dateInput.current?.showPicker()}>
                날짜 지정
              </button>
            </div>
          </div>
        )}
        <div className="actions">
          <button type="button" onClick={handleRun} disabled={specificDate && !selectedDate}>
            {specificDate ? '지정일 운세 보기' : '오늘의 운세 보기'}
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
