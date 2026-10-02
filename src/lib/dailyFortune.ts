// 띠(12지신) + 오늘 일진(日辰)의 합·충·형 관계를 바탕으로 한 오늘의 운세.
// 같은 띠는 같은 날짜엔 항상 같은 결과가 나오도록 시드 기반 난수를 사용합니다.

import { STEM_KR, STEM_HANJA, BRANCH_KR, BRANCH_HANJA, dayPillar, yearPillar } from './saju';
import { pick, pickInt, seedRng } from './random';

export const ANIMAL_KR = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
export const ANIMAL_EMOJI = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐑', '🐒', '🐓', '🐕', '🐖'];

const YUKHAP: Record<number, number> = { 0: 1, 1: 0, 2: 11, 11: 2, 3: 10, 10: 3, 4: 9, 9: 4, 5: 8, 8: 5, 6: 7, 7: 6 };
const SAMHAP_GROUPS = [
  [8, 0, 4],
  [5, 9, 1],
  [2, 6, 10],
  [11, 3, 7],
];
const CHUNG: Record<number, number> = { 0: 6, 6: 0, 1: 7, 7: 1, 2: 8, 8: 2, 3: 9, 9: 3, 4: 10, 10: 4, 5: 11, 11: 5 };
const HYEONG_GROUPS = [
  [2, 5, 8],
  [1, 10, 7],
];
const HYEONG_PAIR = [0, 3];
const JAHYEONG_SELF = [4, 6, 9, 11];

export type Relation = 'samhap' | 'yukhap' | 'bihwa' | 'pyeong' | 'chung' | 'hyeong';

export function branchRelation(a: number, b: number): Relation {
  if (a === b) return JAHYEONG_SELF.indexOf(a) >= 0 ? 'hyeong' : 'bihwa';
  if (CHUNG[a] === b) return 'chung';
  for (const grp of SAMHAP_GROUPS) {
    if (grp.indexOf(a) >= 0 && grp.indexOf(b) >= 0) return 'samhap';
  }
  if (YUKHAP[a] === b) return 'yukhap';
  for (const g2 of HYEONG_GROUPS) {
    if (g2.indexOf(a) >= 0 && g2.indexOf(b) >= 0) return 'hyeong';
  }
  if ((a === HYEONG_PAIR[0] && b === HYEONG_PAIR[1]) || (a === HYEONG_PAIR[1] && b === HYEONG_PAIR[0])) {
    return 'hyeong';
  }
  return 'pyeong';
}

type Tier = 'high' | 'mid' | 'low';

export const RELATION_INFO: Record<Relation, { label: string; tier: Tier; desc: string[] }> = {
  samhap: {
    label: '삼합',
    tier: 'high',
    desc: [
      '오늘의 일진과 삼합을 이루는 날이에요. 여러 기운이 하나로 뭉쳐 큰 힘을 내는 흐름이라 협업과 확장에 좋아요.',
      '삼합의 기운이 강하게 작용하는 하루예요. 혼자보다 함께할 때 결과가 더 커질 수 있어요.',
    ],
  },
  yukhap: {
    label: '육합',
    tier: 'high',
    desc: [
      '오늘의 일진과 육합을 이루는 날이에요. 사람 사이의 조화가 잘 맞아 관계와 협상에 유리해요.',
      '육합운이 들어오는 하루라 주변과의 호흡이 유난히 잘 맞을 수 있어요.',
    ],
  },
  bihwa: {
    label: '비화',
    tier: 'mid',
    desc: [
      '오늘의 일진이 띠와 같은 기운(비화)이라 안정적이지만 큰 변화는 적은 하루예요.',
      '본인과 같은 기운이 겹치는 날이라 페이스를 유지하기엔 좋지만 고집은 조심하세요.',
    ],
  },
  pyeong: {
    label: '평운',
    tier: 'mid',
    desc: [
      '오늘의 일진과 특별한 합충 관계가 없는 평이한 하루예요. 평소 페이스를 유지하면 충분해요.',
      '크게 부딪히지도, 크게 당기지도 않는 잔잔한 흐름의 하루예요.',
    ],
  },
  chung: {
    label: '충',
    tier: 'low',
    desc: [
      '오늘의 일진과 충을 이루는 날이에요. 갑작스러운 변수나 마찰이 생기기 쉬우니 여유를 가지세요.',
      '충의 기운이 들어와 계획이 틀어지기 쉬운 하루예요. 중요한 결정은 신중하게 미뤄보세요.',
    ],
  },
  hyeong: {
    label: '형',
    tier: 'low',
    desc: [
      '오늘의 일진과 형을 이루는 날이에요. 사소한 갈등이나 구설이 생기기 쉬우니 말과 행동에 신경 쓰세요.',
      '형의 기운이 있는 날이라 평소보다 신중하게 관계를 다뤄야 해요.',
    ],
  },
};
const RELATION_SCORE_RANGE: Record<Tier, [number, number]> = {
  high: [72, 96],
  mid: [46, 71],
  low: [22, 48],
};

export const FORTUNE_CATS = [
  { key: 'total', label: '총운' },
  { key: 'love', label: '애정운' },
  { key: 'money', label: '재물운' },
  { key: 'health', label: '건강운' },
  { key: 'work', label: '직장·학업운' },
] as const;
export type FortuneKey = (typeof FORTUNE_CATS)[number]['key'];

const MSG: Record<FortuneKey, Record<Tier, string[]>> = {
  total: {
    high: ['운의 흐름이 가장 좋은 하루예요. 하고 싶었던 일을 미루지 마세요.', '전체적으로 순조롭게 풀리는 하루, 자신감 있게 움직여도 좋아요.', '예상보다 좋은 소식이 들려올 수 있는 흐름이에요.', '마음먹은 대로 흘러가는 편안한 하루가 될 거예요.'],
    mid: ['크게 나쁘지도 좋지도 않은, 무난하게 흘러가는 하루예요.', '평소 하던 대로만 해도 중간은 가는 하루입니다.', '작은 변수는 있지만 전체적인 균형은 잘 잡혀 있어요.', '서두르지 않으면 무난하게 넘어갈 수 있는 하루예요.'],
    low: ['평소보다 신중함이 필요한 하루, 급한 결정은 미뤄두세요.', '작은 실수가 생기기 쉬우니 한 번 더 확인하는 게 좋아요.', '컨디션 난조가 느껴질 수 있으니 무리하지 마세요.', '오늘은 버티는 날, 내일을 위해 힘을 아껴두세요.'],
  },
  love: {
    high: ['설레는 대화나 좋은 인연의 신호가 있을 수 있어요.', '마음을 표현하기 좋은 타이밍이에요.', '연인과의 관계가 한층 더 가까워질 수 있어요.', '오래 마음에 담아둔 이야기를 꺼내기 좋은 날이에요.'],
    mid: ['특별한 사건은 없지만 평온한 관계가 이어져요.', '작은 배려 하나가 관계를 부드럽게 만들어줘요.', '서로에게 조금 더 귀 기울이면 좋은 하루예요.', '무난한 흐름 속에서 소소한 다정함을 챙겨보세요.'],
    low: ['오해가 생기기 쉬우니 말투에 신경 써보세요.', '혼자만의 시간이 더 필요하게 느껴질 수 있어요.', '성급한 결론보다 잠시 거리를 두는 편이 나아요.', '작은 감정싸움은 시간을 두고 풀어가는 게 좋아요.'],
  },
  money: {
    high: ['생각지 못한 이득이나 좋은 제안이 들어올 수 있어요.', '투자나 재테크에 관심을 가지기 좋은 흐름이에요.', '절약한 만큼 통장이 든든해지는 걸 느끼는 하루예요.', '금전 관련 협상에서 유리한 결과를 얻을 수 있어요.'],
    mid: ['들어오고 나가는 것이 균형을 이루는 하루예요.', '계획한 지출 안에서는 무리 없이 지나가요.', '큰 변화는 없지만 안정적인 흐름이 유지돼요.', '충동구매만 조심하면 무난한 하루가 될 거예요.'],
    low: ['예상치 못한 지출이 생길 수 있으니 여유자금을 챙겨두세요.', '큰 결정이나 계약은 오늘보다 다음으로 미루는 게 좋아요.', '작은 손해에 너무 마음 쓰지 않아도 괜찮아요.', '금전 거래는 한 번 더 꼼꼼히 확인하세요.'],
  },
  health: {
    high: ['컨디션이 가볍고 몸도 마음도 개운한 하루예요.', '평소보다 활력이 넘쳐 운동하기에도 좋아요.', '숙면을 취하고 나면 하루가 훨씬 가볍게 느껴져요.', '몸이 보내는 좋은 신호에 맞춰 움직여보세요.'],
    mid: ['특별한 이상은 없지만 무리하지 않는 게 좋아요.', '가벼운 스트레칭 정도로 컨디션을 관리해보세요.', '평소 루틴을 유지하면 큰 문제 없이 지나가요.', '수분 섭취와 휴식만 챙겨도 충분한 하루예요.'],
    low: ['피로가 누적되기 쉬우니 일찍 쉬는 게 좋아요.', '작은 통증이나 컨디션 저하가 느껴질 수 있어요.', '과식이나 과음은 특히 조심하는 게 좋아요.', '몸이 보내는 신호를 무시하지 말고 챙겨주세요.'],
  },
  work: {
    high: ['성과가 눈에 띄게 드러나는 하루가 될 수 있어요.', '새로운 아이디어가 좋은 평가를 받을 수 있어요.', '중요한 발표나 시험에 좋은 흐름이 따라와요.', '협업이 유난히 잘 풀리는 하루예요.'],
    mid: ['맡은 일을 차분히 처리하면 무난하게 지나가요.', '큰 이슈 없이 계획한 만큼 진행되는 하루예요.', '서두르지 않고 순서대로 처리하면 충분해요.', '평소 페이스를 유지하는 게 가장 좋은 전략이에요.'],
    low: ['사소한 실수가 생기기 쉬우니 재확인이 필요해요.', '예상치 못한 일정 변경이 생길 수 있어요.', '무리한 욕심보다 오늘은 페이스 조절이 우선이에요.', '동료와의 의견 차이는 감정적으로 대응하지 마세요.'],
  },
};

const LUCKY_COLORS = ['빨강', '주황', '노랑', '초록', '파랑', '남색', '보라', '하양', '검정', '금색'];
const LUCKY_ITEMS = ['손수건', '만년필', '동전 하나', '작은 향초', '좋아하는 책', '목걸이', '우산', '작은 거울', '열쇠고리', '따뜻한 차 한 잔'];

export interface DailyFortuneInput {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  /** 결과가 계산된 기준일 (YYYY-MM-DD). 공유 링크로 다시 봐도 같은 날짜 기준으로 보이도록 저장해둡니다. */
  todayISO: string;
}

export interface DailyFortuneResult {
  name: string;
  zodiacBranch: number;
  todayLabel: string; // "2026년 9월 16일 · 갑자일 甲子日"
  relationLabel: string;
  leadText: string;
  meters: { key: FortuneKey; label: string; score: number; message: string }[];
  lucky: { color: string; number: number; item: string };
}

export function buildDailyFortune(input: DailyFortuneInput): DailyFortuneResult {
  const zodiacBranch = yearPillar(input.birthYear, input.birthMonth, input.birthDay).branch;

  const [ty, tm, td] = input.todayISO.split('-').map(Number);
  const dp = dayPillar(ty, tm, td);
  const todayStem = dp.stem;
  const todayBranch = dp.branch;

  const rel = branchRelation(zodiacBranch, todayBranch);
  const relInfo = RELATION_INFO[rel];
  const range = RELATION_SCORE_RANGE[relInfo.tier];

  const reasonRng = seedRng(`zodiac-reason|${zodiacBranch}|${todayBranch}`);
  const leadText = pick(reasonRng, relInfo.desc);

  const todayLabel = `${ty}년 ${tm}월 ${td}일 · ${STEM_KR[todayStem]}${BRANCH_KR[todayBranch]}${STEM_HANJA[todayStem]}${BRANCH_HANJA[todayBranch]}일`;

  const meters = FORTUNE_CATS.map((c) => {
    const scoreRng = seedRng(`fortune-score|${zodiacBranch}|${todayBranch}|${c.key}`);
    const score = pickInt(scoreRng, range[0], range[1]);
    const tier: Tier = score >= 70 ? 'high' : score >= 45 ? 'mid' : 'low';
    const msgRng = seedRng(`fortune-msg|${zodiacBranch}|${todayBranch}|${c.key}`);
    const message = pick(msgRng, MSG[c.key][tier]);
    return { key: c.key, label: c.label, score, message };
  });

  const luckyRng = seedRng(`lucky|${zodiacBranch}|${todayBranch}`);
  const lucky = {
    color: pick(luckyRng, LUCKY_COLORS),
    number: pickInt(luckyRng, 1, 9),
    item: pick(luckyRng, LUCKY_ITEMS),
  };

  return {
    name: input.name,
    zodiacBranch,
    todayLabel,
    relationLabel: relInfo.label,
    leadText,
    meters,
    lucky,
  };
}
