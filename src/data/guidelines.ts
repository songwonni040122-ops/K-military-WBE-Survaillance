import type { PreventionGuideline } from '../types';

export const guidelineTemplates: PreventionGuideline[] = [
  // ──── 정기 방역 지침 (Regular) ────
  {
    id: 'r-disinfect-01', pathogenId: 'norovirus', severity: 'normal', tier: 'regular', priority: 5,
    title: '정기 소독 스케줄 이행',
    description: '감염병 예방법 시행규칙에 따른 정기 소독 의무 이행. 공용시설 월 1회, 급식시설 주 2회 소독 실시.',
    actions: [
      '화장실·세면장: 주 2회 차아염소산나트륨(500ppm) 소독',
      '식당·조리시설: 주 2회 표면 소독 + 월 1회 전면 방역',
      '생활관 공용구역: 주 1회 환경 소독',
      '소독 완료 후 소독일지 기록 및 확인 서명',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  {
    id: 'r-water-01', pathogenId: 'rotavirus', severity: 'normal', tier: 'regular', priority: 5,
    title: '급수시설 정기 수질검사',
    description: '먹는물 수질기준에 따른 정기 수질검사 및 정수시설 점검.',
    actions: [
      '월 1회 잔류염소 농도 측정 (0.1~4.0mg/L 유지)',
      '분기 1회 수질검사 의뢰 (대장균, 탁도 등)',
      '급수탱크 반기 1회 청소 및 점검',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },

  // ──── 계절 예방 방역 지침 (Seasonal) ────
  {
    id: 's-winter-flu', pathogenId: 'influenza_a', severity: 'caution', tier: 'seasonal', priority: 3,
    title: '동절기 인플루엔자 예방 강화',
    description: '11월~3월 인플루엔자 유행 시기 선제적 방역 강화. KDCA 동절기 감염병 예방수칙 기반.',
    actions: [
      '생활관 환기 1일 3회 이상 (회당 15분)',
      '생활관 온·습도 관리 (18-22°C, 40-60%)',
      '인플루엔자 예방접종 미접종자 파악 및 접종 독려',
      '발열(37.5°C 이상) 장병 즉시 의무실 방문 체계 운영',
      '손 위생 교육 월 1회 실시',
    ],
    applicableSeasons: ['winter', 'autumn'], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  {
    id: 's-summer-noro', pathogenId: 'norovirus', severity: 'caution', tier: 'seasonal', priority: 3,
    title: '하절기 수인성 감염병 예방',
    description: '6월~9월 노로바이러스·로타바이러스 등 수인성 감염병 유행 대비. 식품위생 및 급수 관리 강화.',
    actions: [
      '식자재 냉장보관 철저 (5°C 이하)',
      '조리 후 2시간 이내 배식 원칙 준수',
      '음용수 수질 주 1회 점검',
      '설사·구토 증상자 즉시 조리업무 배제',
      '식당 종사자 건강상태 일일 점검',
    ],
    applicableSeasons: ['summer'], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  {
    id: 's-spring-adeno', pathogenId: 'adenovirus', severity: 'caution', tier: 'seasonal', priority: 3,
    title: '환절기 아데노바이러스 주의',
    description: '봄·가을 환절기 아데노바이러스(유행성 각결막염, 인두결막열) 예방.',
    actions: [
      '수건·세면도구 개인물품 공유 금지 안내',
      '생활관 침구류 세탁 주기 단축 (주 2회)',
      '눈병 증상자 즉시 의무실 방문 및 격리',
      '체육활동 후 손 위생 철저',
    ],
    applicableSeasons: ['spring', 'autumn'], applicableBaseTypes: [], applicableCharacteristics: [],
  },

  // ──── 긴급 방역 지침 (Emergency) ────
  // Norovirus
  {
    id: 'e-noro-01', pathogenId: 'norovirus', severity: 'warning', tier: 'emergency', priority: 1,
    title: '노로바이러스 긴급 방역 발령',
    description: '노로바이러스 검출 상승 확인. 차아염소산나트륨 1000ppm 농도로 오염 구역 즉시 소독. 접촉시간 10분 이상 확보.',
    actions: [
      '오염 구역 차아염소산나트륨(1000ppm) 즉시 소독',
      '해당 구역 동선 분리 (감염→비감염 이동 차단)',
      '식당 개별 배식 전환 및 뷔페식 중단',
      '유증상자 별도 격리 공간 배정',
      '군 의료체계에 역학조사 지원 요청',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  {
    id: 'e-noro-02', pathogenId: 'norovirus', severity: 'critical', tier: 'emergency', priority: 1,
    title: '노로바이러스 집단감염 비상 대응',
    description: '위험 수준 돌파. 전 구역 긴급 방역 + 격리 체계 가동. CDC 가이드라인 기반 접촉자 관리 시행.',
    actions: [
      '전 구역 긴급 소독 (차아염소산나트륨 5000ppm)',
      '구역간 인원 이동 전면 차단',
      '의무실 유증상자 능동 스크리닝 즉시 개시',
      '상급부대 방역지원단 파견 요청',
      '과거 유사 사례 기반 확산 예측 모델 적용',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  // Influenza A
  {
    id: 'e-flu-a-01', pathogenId: 'influenza_a', severity: 'warning', tier: 'emergency', priority: 2,
    title: '인플루엔자 A 긴급 방역',
    description: '인플루엔자 A 검출 상승. 호흡기 비말 차단 및 집합 제한 조치. 항바이러스제(오셀타미비르) 투여 대상 선별.',
    actions: [
      '실내 마스크 착용 의무화',
      '밀집 훈련·교육 규모 축소 또는 중단',
      '발열 장병 즉시 격리 및 신속검사',
      '생활관 환기 강화 (2시간 간격)',
      '의무실 항바이러스제 재고 확인',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  // Influenza B
  {
    id: 'e-flu-b-01', pathogenId: 'influenza_b', severity: 'warning', tier: 'emergency', priority: 2,
    title: '인플루엔자 B 확산 방지 긴급 조치',
    description: '인플루엔자 B 검출 상승. 교차감염 차단 및 접촉자 추적 실시.',
    actions: [
      '유증상자 별도 생활관 격리 배정',
      '공용 물품(리모컨, 전화기 등) 알코올 소독',
      '접촉자 추적을 위한 생활관별 명단 관리',
      '격리자 건강 모니터링 1일 2회',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  // SARS-CoV-2
  {
    id: 'e-covid-01', pathogenId: 'sars_cov_2', severity: 'warning', tier: 'emergency', priority: 1,
    title: 'COVID-19 긴급 방역 격상',
    description: 'SARS-CoV-2 검출 확인. 과산화수소(3%) 또는 4급 암모늄 소독제 사용. 접촉시간 1분.',
    actions: [
      '전 장병 마스크 착용 의무화',
      '생활관별 코호트 분리 운영',
      '외출·외박 전면 제한',
      '신속항원검사 전수 실시',
      '양성자 별도 격리시설 이송',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  {
    id: 'e-covid-02', pathogenId: 'sars_cov_2', severity: 'critical', tier: 'emergency', priority: 1,
    title: 'COVID-19 비상 방역 체계',
    description: '위험 수준 도달. 부대 봉쇄 및 상급 의료지원 요청. 격리 공간 인원의 10% 확보.',
    actions: [
      '부대 출입 전면 통제',
      '비필수 집합교육·훈련 전면 중단',
      '격리 공간 확보 (전체 인원 10% 수용 가능)',
      '상급부대 의료지원단 파견 요청',
      '전 인원 PCR 검사 실시',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  // Adenovirus
  {
    id: 'e-adeno-01', pathogenId: 'adenovirus', severity: 'warning', tier: 'emergency', priority: 2,
    title: '아데노바이러스 긴급 방역',
    description: '아데노바이러스 검출 상승. 70% 에탄올 또는 차아염소산나트륨(500ppm) 환경 소독.',
    actions: [
      '감염 구역 환경 소독 (70% 에탄올)',
      '개인 물품 공유 전면 금지',
      '체육활동 시 개인 물통 사용 의무화',
      '눈병 증상자 격리 및 안과 진료 연계',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  // Rotavirus
  {
    id: 'e-rota-01', pathogenId: 'rotavirus', severity: 'warning', tier: 'emergency', priority: 2,
    title: '로타바이러스 긴급 방역',
    description: '로타바이러스 검출 상승. 차아염소산나트륨(1000ppm) 소독. 수인성 경로 차단 우선.',
    actions: [
      '음용수 수질 긴급 점검',
      '식자재 위생관리 강화 (생식 전면 제한)',
      '설사 증상자 즉시 격리 및 의무실 방문',
      '화장실·급수시설 소독 주기 2배 상향',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },
  {
    id: 'e-rota-02', pathogenId: 'rotavirus', severity: 'critical', tier: 'emergency', priority: 1,
    title: '로타바이러스 집단설사 비상 대응',
    description: '위험 수준. 집단 탈수 가능성 대비. 경구보충액 비축 및 의료후송 체계 점검.',
    actions: [
      '식당 운영 전면 재검토 (개별 포장 배식)',
      '전 장병 수분 보충 및 탈수 예방 교육',
      '격리 병상 확보 및 경구보충액 비축',
      '상급부대 역학조사관 파견 요청',
    ],
    applicableSeasons: [], applicableBaseTypes: [], applicableCharacteristics: [],
  },
];
