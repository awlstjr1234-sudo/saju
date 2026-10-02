import type { SajuResult } from '@/lib/saju';
import { STEM_KR, STEM_HANJA, BRANCH_KR, BRANCH_HANJA, STEM_EL, BRANCH_EL, EL_LABEL, EL_ORDER } from '@/lib/saju';

function PillarCell({ head, stem, branch }: { head: string; stem: number; branch: number }) {
  return (
    <div className="pillar">
      <div className="head">{head}</div>
      <div className="cell" style={{ background: `var(--el-${STEM_EL[stem]})` }}>
        {STEM_HANJA[stem]}
        <small>{STEM_KR[stem]}</small>
      </div>
      <div className="cell branch" style={{ background: `var(--el-${BRANCH_EL[branch]})` }}>
        {BRANCH_HANJA[branch]}
        <small>{BRANCH_KR[branch]}</small>
      </div>
    </div>
  );
}

export default function SajuResultView({ result }: { result: SajuResult }) {
  const { pillars, elementCounts, elementalInsight, daymasterText } = result;
  const total = EL_ORDER.reduce((s, k) => s + elementCounts[k], 0);

  return (
    <div>
      <h2 style={{ fontSize: 20, marginBottom: 4 }}>
        {result.name ? `${result.name}님의 사주팔자` : '사주팔자'}
      </h2>

      <div className="pillars">
        <PillarCell head="년주" stem={pillars.year.stem} branch={pillars.year.branch} />
        <PillarCell head="월주" stem={pillars.month.stem} branch={pillars.month.branch} />
        <PillarCell head="일주" stem={pillars.day.stem} branch={pillars.day.branch} />
        {pillars.hour ? (
          <PillarCell head="시주" stem={pillars.hour.stem} branch={pillars.hour.branch} />
        ) : (
          <div className="pillar">
            <div className="head">시주</div>
            <div className="cell">?</div>
            <div className="cell branch">시간 모름</div>
          </div>
        )}
      </div>

      <div className="daymaster">
        <h3>
          일간(日干) · {STEM_KR[pillars.day.stem]}
          {STEM_HANJA[pillars.day.stem]} ({EL_LABEL[STEM_EL[pillars.day.stem]]})
        </h3>
        <p>{daymasterText}</p>
      </div>

      <div className="elbars">
        {EL_ORDER.map((k) => {
          const pct = total ? Math.round((elementCounts[k] / total) * 100) : 0;
          return (
            <div className="elbar-row" key={k}>
              <span>{EL_LABEL[k]}</span>
              <div className="elbar-track">
                <div className="elbar-fill" style={{ width: `${pct}%`, background: `var(--el-${k})` }} />
              </div>
              <span>{elementCounts[k]}</span>
            </div>
          );
        })}
      </div>

      <div className="daymaster" style={{ marginTop: 16 }}>
        <h3>오행(五行) 균형 해설</h3>
        <p>
          사주 여덟 글자 중 {elementalInsight.strongLabel} 기운이 가장 많이 나타나요. {elementalInsight.strongText}
        </p>
        {elementalInsight.balanced ? (
          <p>
            다섯 가지 오행이 고루 섞여 있어 어느 한쪽으로 치우치지 않는 균형 잡힌 사주예요. 상황에 따라 여러
            기운을 유연하게 꺼내 쓸 수 있는 것이 큰 장점이에요.
          </p>
        ) : (
          <p>
            {elementalInsight.weakLabel} 기운은 사주 원국에 드러나지 않아요. {elementalInsight.weakText}
          </p>
        )}
      </div>
    </div>
  );
}
