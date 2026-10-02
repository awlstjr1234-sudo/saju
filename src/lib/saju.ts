// 사주팔자(四柱八字) 계산 로직.
// 전통 만세력 계산을 근사 구현한 것으로, 절기 기준일은 연도별로 최대 하루 정도
// 오차가 있을 수 있고 음력 생일 · 자시 경계 등 세부 규칙은 단순화되어 있습니다.

export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export const STEM_KR = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
export const STEM_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const STEM_EL: Element[] = [
  'wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water',
];

export const BRANCH_KR = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;
export const BRANCH_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export const BRANCH_EL: Element[] = [
  'water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water',
];

export const EL_LABEL: Record<Element, string> = {
  wood: '목(木)',
  fire: '화(火)',
  earth: '토(土)',
  metal: '금(金)',
  water: '수(水)',
};
export const EL_ORDER: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];

export const DAYMASTER_TEXT: Record<number, string> = {
  0: '큰 나무와 같은 갑목(甲木) 일간이에요. 곧고 진취적인 리더십을 지녀 남 앞에 서는 것을 두려워하지 않고, 위로 뻗어나가려는 성장 욕구가 강해 한번 목표를 정하면 흔들림 없이 밀고 나가는 뚝심이 있어요. 다만 자존심이 강해 남에게 굽히는 것을 어려워하고, 주변의 조언을 놓치면 고집스럽게 비칠 수 있으니 때로는 유연하게 방향을 조율하는 연습이 필요해요. 그럼에도 주변 사람들에게는 믿고 기댈 수 있는 든든한 기둥 같은 존재로 기억되는 편이에요.',
  1: '유연한 넝쿨과 화초 같은 을목(乙木) 일간이에요. 부드럽고 섬세한 감성으로 주변 환경에 잘 적응하며, 어떤 자리에서도 끈기 있게 뿌리를 내리고 결국 자신을 성장시켜내는 생존력이 뛰어나요. 겉으로는 온순해 보여도 속으로는 하고자 하는 바를 놓지 않는 뚝심이 있고, 사람 사이의 미묘한 감정을 잘 읽어 관계를 부드럽게 이끄는 재주가 있어요. 다만 자기주장을 분명히 하지 않으면 손해를 보기 쉬우니, 필요한 순간엔 의사표현을 확실히 하는 게 좋아요.',
  2: '태양처럼 뜨거운 병화(丙火) 일간이에요. 밝고 열정적인 에너지로 주변을 환하게 비추고, 사교성과 표현력이 뛰어나 사람들 사이에서 자연스럽게 중심에 서는 타입이에요. 감정 표현이 솔직하고 화끈해서 함께 있으면 활력을 얻는다는 말을 자주 듣지만, 그만큼 기분의 기복이 겉으로 잘 드러나기도 해요. 열정이 앞서 성급하게 판단하기보다, 잠시 숨을 고르고 움직이면 타고난 매력을 더 오래 지속시킬 수 있어요.',
  3: '은은한 촛불과 달빛 같은 정화(丁火) 일간이에요. 따뜻하고 섬세한 배려심을 지녔고, 겉으로 크게 드러내지 않아도 은은하게 사람의 마음을 끄는 확실한 카리스마가 있어요. 소수의 사람과 깊은 관계를 맺는 것을 좋아하고, 한번 마음을 준 상대에게는 오래도록 정성을 다하는 편이에요. 다만 속내를 잘 드러내지 않아 오해를 사기도 하니, 가까운 사람에게는 마음을 조금 더 표현해보는 것이 관계를 풍성하게 만들어줘요.',
  4: '높은 산과 같은 무토(戊土) 일간이에요. 묵직하고 신뢰감 있는 포용력으로 주변 사람과 상황을 든든하게 품어주는 편이라, 힘든 일이 생기면 자연스럽게 사람들이 찾아와 기대게 되는 존재예요. 웬만한 일에는 크게 흔들리지 않는 안정감이 큰 장점이지만, 그만큼 변화에 대응하는 속도가 느리고 고집스러워질 수 있어요. 가끔은 익숙한 틀을 벗어나 새로운 시도를 해보는 유연함이 더해지면 한층 균형 잡힌 모습이 될 거예요.',
  5: '기름진 논밭 같은 기토(己土) 일간이에요. 온화하고 실용적인 감각으로 사람 사이를 매끄럽게 조율하고, 이상보다는 현실적인 판단을 우선하는 균형 감각이 뛰어나요. 남을 챙기는 세심함 덕분에 주변에서 편하게 의지하는 사람이 많지만, 정작 자기 자신을 돌보는 데는 소홀해지기 쉬워요. 다른 사람을 챙기는 만큼 스스로를 위한 시간과 보상도 잊지 않고 챙기는 것이 필요해요.',
  6: '단단한 무쇠와 도끼 같은 경금(庚金) 일간이에요. 강단 있고 결단력 있는 추진력으로 한번 정한 목표를 향해 곧게 나아가는 힘이 있고, 맺고 끊는 것이 분명해 위기 상황에서 오히려 빛을 발하는 타입이에요. 옳고 그름에 대한 기준이 확고해 신뢰를 주지만, 그 기준이 지나치게 엄격하면 주변과 마찰을 일으키기도 해요. 강함 속에 여유와 융통성을 조금 더 섞으면 사람들과의 관계가 한결 부드러워져요.',
  7: '정교하게 다듬어진 보석과 같은 신금(辛金) 일간이에요. 예리하고 세련된 완벽주의로 작은 디테일도 놓치지 않고 원칙을 철저히 지키는 편이라, 맡은 일에서 높은 완성도를 보여줘요. 자기 관리에 엄격한 만큼 스스로에게도 남에게도 기준이 높아 쉽게 만족하지 못하는 경향이 있어요. 완벽을 추구하는 마음은 강점이지만, 가끔은 스스로에게 관대해지는 여유도 필요해요.',
  8: '넓은 바다와 큰 강 같은 임수(壬水) 일간이에요. 지혜롭고 유연한 통찰력을 지녔고, 큰 그릇처럼 다양한 사람과 상황을 담아내는 포용력이 있어 어디서나 스케일이 큰 사람이라는 인상을 줘요. 상황 판단이 빠르고 응용력이 뛰어나지만, 감정과 생각의 물결이 커서 한번 흔들리면 걷잡을 수 없이 커지기도 해요. 넘치는 에너지를 한 방향으로 모아주는 목표와 원칙을 세워두면 그 힘을 더 크게 쓸 수 있어요.',
  9: '맑은 이슬과 빗물 같은 계수(癸水) 일간이에요. 섬세하고 순수한 감수성과 직관력으로 남들이 미처 보지 못하는 부분까지 읽어내는 예민한 감각을 지녔어요. 작은 변화에도 민감하게 반응할 수 있어 배려심 깊은 사람으로 통하지만, 그만큼 마음의 동요도 쉽게 겪는 편이에요. 스스로를 다독이는 시간을 충분히 가지면 타고난 직관을 훨씬 안정적으로 발휘할 수 있어요.',
};

export const EL_TRAIT: Record<Element, { strong: string; weak: string }> = {
  wood: {
    strong: '목(木) 기운이 두드러져서 성장하고 확장하려는 추진력이 강하고, 새로운 일을 벌이는 데 거침이 없어요. 다만 너무 앞서 나가다 보면 마무리가 약해질 수 있으니 속도 조절이 필요해요.',
    weak: '목(木) 기운이 부족해 새로운 시작이나 도전 앞에서 다소 신중하거나 주저하는 편일 수 있어요. 계획만 세우고 그치기보다 작은 실행부터 시도해보는 습관이 도움이 돼요.',
  },
  fire: {
    strong: '화(火) 기운이 강해 표현력과 열정이 넘치고, 사람들 앞에서 에너지를 발산할 때 특히 빛나는 타입이에요. 다만 감정이 급하게 타오르는 만큼 식는 것도 빨라 꾸준함을 관리할 필요가 있어요.',
    weak: '화(火) 기운이 약해 자신을 적극적으로 드러내는 데 에너지가 덜 실릴 수 있어요. 작은 성취라도 스스로 표현하고 알리는 연습이 자신감을 키우는 데 도움이 돼요.',
  },
  earth: {
    strong: '토(土) 기운이 두터워 안정감과 신뢰를 주는 사람이고, 맡은 일을 묵묵히 끝까지 책임지는 힘이 있어요. 다만 변화를 받아들이는 속도가 느릴 수 있어 새로운 시도에는 의식적인 노력이 필요해요.',
    weak: '토(土) 기운이 약해 중심을 잡고 꾸준히 버티는 힘이 다소 부족하게 느껴질 수 있어요. 루틴을 만들고 작은 약속부터 지켜나가는 것이 안정감을 채우는 데 좋아요.',
  },
  metal: {
    strong: '금(金) 기운이 강해 원칙과 기준이 뚜렷하고, 맺고 끊는 것이 분명한 결단력을 지녔어요. 다만 지나치게 날카로운 잣대는 주변과의 마찰로 이어질 수 있으니 유연함도 함께 챙기면 좋아요.',
    weak: '금(金) 기운이 약해 결단을 내리거나 선을 긋는 상황에서 망설임이 생기기 쉬워요. 기준을 미리 정해두면 중요한 순간에 흔들리지 않는 데 도움이 돼요.',
  },
  water: {
    strong: '수(水) 기운이 풍부해 지혜롭고 유연한 사고로 다양한 상황에 잘 적응하는 편이에요. 다만 생각이 너무 많아지면 결정이 늦어질 수 있으니 적당한 선에서 매듭짓는 연습이 필요해요.',
    weak: '수(水) 기운이 약해 유연하게 생각을 전환하거나 새로운 정보를 받아들이는 힘이 다소 약할 수 있어요. 다양한 관점을 접하고 배우는 시간을 의식적으로 늘려보는 게 좋아요.',
  },
};

export interface Pillar {
  stem: number;
  branch: number;
}

export interface SajuPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
}

export interface SajuInput {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number | null; // null이면 시주 제외
}

export interface SajuResult {
  name: string;
  pillars: SajuPillars;
  daymasterText: string;
  elementCounts: Record<Element, number>;
  elementalInsight: {
    strongLabel: string;
    strongText: string;
    weakLabel: string | null;
    weakText: string | null;
    balanced: boolean;
  };
}

function toJDN(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * m2 + 2) / 5) +
    365 * y2 +
    Math.floor(y2 / 4) -
    Math.floor(y2 / 100) +
    Math.floor(y2 / 400) -
    32045
  );
}
const DAY_ANCHOR_JDN = toJDN(1900, 1, 31); // 1900-01-31 = 갑자일(근사 기준)

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function monthBranchIndex(month: number, day: number): number {
  const v = month * 100 + day;
  if (v >= 204 && v < 306) return 2;
  if (v >= 306 && v < 405) return 3;
  if (v >= 405 && v < 506) return 4;
  if (v >= 506 && v < 606) return 5;
  if (v >= 606 && v < 707) return 6;
  if (v >= 707 && v < 808) return 7;
  if (v >= 808 && v < 908) return 8;
  if (v >= 908 && v < 1008) return 9;
  if (v >= 1008 && v < 1107) return 10;
  if (v >= 1107 && v < 1207) return 11;
  if (v >= 1207 || v < 106) return 0;
  return 1; // 106 - 204
}

export function yearPillar(y: number, m: number, d: number): Pillar {
  const beforeIpchun = m * 100 + d < 204;
  const sajuYear = beforeIpchun ? y - 1 : y;
  return { stem: mod(sajuYear - 4, 10), branch: mod(sajuYear - 4, 12) };
}

export function dayPillar(y: number, m: number, d: number): Pillar {
  const jdn = toJDN(y, m, d);
  const dayDiff = jdn - DAY_ANCHOR_JDN;
  return { stem: mod(dayDiff, 10), branch: mod(dayDiff, 12) };
}

export function computeSajuPillars(
  y: number,
  m: number,
  d: number,
  hour: number | null,
): SajuPillars {
  const yp = yearPillar(y, m, d);
  const monthBranch = monthBranchIndex(m, d);
  const monthBase = [2, 4, 6, 8, 0][mod(yp.stem, 5)];
  const monthPos = mod(monthBranch - 2, 12);
  const monthStem = mod(monthBase + monthPos, 10);

  const dp = dayPillar(y, m, d);

  const result: SajuPillars = {
    year: yp,
    month: { stem: monthStem, branch: monthBranch },
    day: dp,
    hour: null,
  };

  if (hour !== null) {
    const hourBranch = mod(Math.floor((hour + 1) / 2), 12);
    const hourBase = [0, 2, 4, 6, 8][mod(dp.stem, 5)];
    const hourStem = mod(hourBase + hourBranch, 10);
    result.hour = { stem: hourStem, branch: hourBranch };
  }
  return result;
}

export function elementTally(pillars: SajuPillars): Record<Element, number> {
  const counts: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const list = [pillars.year, pillars.month, pillars.day, pillars.hour].filter(
    (p): p is Pillar => p !== null,
  );
  list.forEach((p) => {
    counts[STEM_EL[p.stem]]++;
    counts[BRANCH_EL[p.branch]]++;
  });
  return counts;
}

function elementalInsight(counts: Record<Element, number>): SajuResult['elementalInsight'] {
  let max = -1;
  let maxKeys: Element[] = [];
  EL_ORDER.forEach((k) => {
    if (counts[k] > max) {
      max = counts[k];
      maxKeys = [k];
    } else if (counts[k] === max) {
      maxKeys.push(k);
    }
  });
  const minKeys = EL_ORDER.filter((k) => counts[k] === 0);

  const strongLabel = maxKeys.map((k) => EL_LABEL[k]).join(', ');
  const strongText = EL_TRAIT[maxKeys[0]].strong;

  if (minKeys.length === 0) {
    return { strongLabel, strongText, weakLabel: null, weakText: null, balanced: true };
  }
  const weakLabel = minKeys.map((k) => EL_LABEL[k]).join(', ');
  const weakText = EL_TRAIT[minKeys[0]].weak;
  return { strongLabel, strongText, weakLabel, weakText, balanced: false };
}

export function buildSajuReading(input: SajuInput): SajuResult {
  const pillars = computeSajuPillars(input.year, input.month, input.day, input.hour);
  const counts = elementTally(pillars);
  return {
    name: input.name,
    pillars,
    daymasterText: DAYMASTER_TEXT[pillars.day.stem],
    elementCounts: counts,
    elementalInsight: elementalInsight(counts),
  };
}
