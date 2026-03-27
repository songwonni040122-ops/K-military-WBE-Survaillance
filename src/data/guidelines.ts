import type { PreventionGuideline } from '../types';

export const guidelineTemplates: PreventionGuideline[] = [
  // Norovirus
  {
    id: 'g-noro-01', pathogenId: 'norovirus', severity: 'warning', priority: 1,
    title: '손 위생 강화 프로토콜 발령',
    description: '노로바이러스 검출 수준 상승에 따른 즉각 조치',
    actions: [
      '전 식당 입구 손세정제 비치 확인 및 보충',
      '30초 이상 손씻기 의무화 안내문 게시',
      '화장실 청소 주기를 1일 2회 → 4회로 상향',
      '식당 종사자 건강상태 일일 점검 실시',
    ],
    applicableSeasons: ['winter', 'autumn'], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  {
    id: 'g-noro-02', pathogenId: 'norovirus', severity: 'critical', priority: 1,
    title: '집단감염 선제대응 체계 가동',
    description: '노로바이러스 위험 수준 돌파 - 즉각 격리 및 역학조사 준비',
    actions: [
      '의무실 유증상자 능동 스크리닝 즉시 개시',
      '구역간 인원 이동 최소화',
      '식당 개별 배식 전환 (뷔페식 중단)',
      '공용 시설(샤워실, 화장실) 차아염소산 소독 강화',
      '상급부대 방역지원 요청 검토',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: ['high_density'],
  },
  // Influenza A
  {
    id: 'g-flu-a-01', pathogenId: 'influenza_a', severity: 'warning', priority: 2,
    title: '호흡기 감염 예방 강화',
    description: '인플루엔자 A 검출 상승에 따른 호흡기 위생 강화',
    actions: [
      '실내 집합시 마스크 착용 권고',
      '생활관 환기 주기 확대 (1일 3회 이상, 회당 15분)',
      '발열 장병 즉시 의무실 방문 안내',
      '밀집 훈련(연병장 집합 등) 규모 축소 검토',
    ],
    applicableSeasons: ['winter'], applicableBaseTypes: ['infantry'], applicableCharacteristics: [],
  },
  {
    id: 'g-flu-a-02', pathogenId: 'influenza_a', severity: 'caution', priority: 3,
    title: '인플루엔자 모니터링 강화',
    description: '기저선 대비 상승 추세 관찰',
    actions: [
      '일일 발열 감시 보고체계 점검',
      '예방접종 미접종자 파악 및 접종 독려',
      '생활관 온도·습도 관리 강화 (18-22°C, 40-60%)',
    ],
    applicableSeasons: ['winter', 'autumn'], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  // Influenza B
  {
    id: 'g-flu-b-01', pathogenId: 'influenza_b', severity: 'warning', priority: 2,
    title: '인플루엔자 B형 확산 방지',
    description: '인플루엔자 B 검출 상승 - 교차감염 차단',
    actions: [
      '유증상자 별도 생활관 격리 배정',
      '공용 물품(리모컨, 전화기 등) 소독 강화',
      '접촉자 추적을 위한 생활관별 명단 관리',
    ],
    applicableSeasons: ['winter', 'spring'], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  // SARS-CoV-2
  {
    id: 'g-covid-01', pathogenId: 'sars_cov_2', severity: 'warning', priority: 1,
    title: 'COVID-19 방역 체계 격상',
    description: 'SARS-CoV-2 검출 상승 - 기본 방역수칙 강화',
    actions: [
      '전 장병 마스크 착용 의무화 (실내)',
      '생활관별 코호트 분리 운영',
      '외출·외박 제한 검토',
      '급식시 좌석 간격 확보 (1m 이상)',
      '신속항원검사 키트 확보 및 유증상자 즉시 검사',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  {
    id: 'g-covid-02', pathogenId: 'sars_cov_2', severity: 'critical', priority: 1,
    title: 'COVID-19 비상 방역 가동',
    description: '위험 수준 도달 - 전투력 보존을 위한 비상 조치',
    actions: [
      '부대 출입 통제 강화',
      '비필수 집합교육 전면 중단',
      '격리 공간 사전 확보 (최소 인원의 10%)',
      '상급부대 의료지원 요청',
      '전 인원 PCR 검사 실시 검토',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: ['high_density'],
  },
  // Adenovirus
  {
    id: 'g-adeno-01', pathogenId: 'adenovirus', severity: 'warning', priority: 2,
    title: '아데노바이러스 확산 방지',
    description: '아데노바이러스 검출 상승 - 위생 관리 강화',
    actions: [
      '수건, 세면도구 등 개인물품 공유 금지 안내',
      '생활관 침구류 세탁 주기 단축 (주 1회 → 주 2회)',
      '체육활동 시 개인 물통 사용 의무화',
      '눈병 증상자 즉시 의무실 방문 안내',
    ],
    applicableSeasons: ['summer', 'spring'], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  {
    id: 'g-adeno-02', pathogenId: 'adenovirus', severity: 'caution', priority: 3,
    title: '수인성 감염 주의',
    description: '여름철 아데노바이러스 감시',
    actions: [
      '급수시설 수질 점검 실시',
      '수영장·워터쿨러 등 수인성 감염 경로 점검',
    ],
    applicableSeasons: ['summer'], applicableBaseTypes: [], applicableCharacteristics: ['coastal'],
  },
  // Rotavirus
  {
    id: 'g-rota-01', pathogenId: 'rotavirus', severity: 'warning', priority: 2,
    title: '로타바이러스 방역 강화',
    description: '로타바이러스 검출 상승 - 수인성·식품매개 감염 예방',
    actions: [
      '음용수 수질 긴급 점검',
      '식자재 위생관리 강화 (생식 제한)',
      '설사 증상자 즉시 격리 및 의무실 방문',
      '화장실·급수시설 소독 주기 2배 상향',
    ],
    applicableSeasons: ['spring', 'winter'], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  {
    id: 'g-rota-02', pathogenId: 'rotavirus', severity: 'critical', priority: 1,
    title: '로타바이러스 비상 방역',
    description: '위험 수준 - 집단 설사 발생 가능성 대비',
    actions: [
      '식당 운영 방식 전면 재검토 (개별 포장 배식)',
      '전 장병 수분 보충 및 탈수 예방 교육',
      '격리 병상 확보 및 경구보충액 비축',
      '상급부대 역학조사관 파견 요청',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  // Seasonal / Geographic specific
  {
    id: 'g-cold-01', pathogenId: 'influenza_a', severity: 'caution', priority: 4,
    title: '한랭기 생활관 관리',
    description: '추운 기후 환경에서의 감염병 예방',
    actions: [
      '생활관 난방 적정 온도 유지 (18-22°C)',
      '건조 방지를 위한 가습기 가동',
      '야외 훈련 후 체온 회복 조치',
    ],
    applicableSeasons: ['winter'], applicableBaseTypes: [], applicableCharacteristics: ['cold_climate', 'mountainous'],
  },
  {
    id: 'g-mountain-01', pathogenId: 'norovirus', severity: 'caution', priority: 4,
    title: '산악지역 급수 위생',
    description: '산악지역 특수 환경에서의 수인성 감염 예방',
    actions: [
      '지하수/계곡수 사용 금지 재확인',
      '정수시설 필터 점검 및 교체 주기 확인',
      '보급수 위생 상태 일일 점검',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: ['mountainous', 'remote'],
  },
];
