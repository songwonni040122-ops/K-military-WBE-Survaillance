import type { MilitaryBase } from '../types';

/**
 * 경계 데이터: OSM landuse=military 영역의 형태를 트레이싱하여
 * 가상 산지 좌표에 배치. 실제 부대 위치와 무관.
 *
 * 가상 위치 선정 기준: 남한 내 산지/임야 지역
 */

export const bases: MilitaryBase[] = [
  // ──────────────────────────────────────────────────
  // #1 제A기갑여단 (경계 출처: 대형 복합 기지)
  // 가상 위치: 충북 보은군 속리산 인근 산지
  // ──────────────────────────────────────────────────
  {
    id: 'base-01',
    name: '제A기갑여단',
    type: 'armored',
    location: { lat: 36.555, lng: 127.875 },
    region: '충북 보은군',
    personnelCount: 8500,
    zoneCount: 3,
    characteristics: ['mountainous', 'high_density', 'vehicle_depot'],
    boundary: [
      [36.5610, 127.8680], [36.5605, 127.8720], [36.5590, 127.8745],
      [36.5570, 127.8760], [36.5550, 127.8770], [36.5535, 127.8775],
      [36.5515, 127.8768], [36.5500, 127.8755], [36.5490, 127.8735],
      [36.5485, 127.8710], [36.5488, 127.8685], [36.5495, 127.8665],
      [36.5510, 127.8650], [36.5530, 127.8640], [36.5548, 127.8638],
      [36.5565, 127.8642], [36.5582, 127.8650], [36.5598, 127.8665],
    ],
    zones: [
      { id: 'b01-z1', baseId: 'base-01', name: 'A구역 - 병영지대', confluencePoint: '서측 합류지점 (생활관 1~4동)', currentAlertLevel: 'normal' },
      { id: 'b01-z2', baseId: 'base-01', name: 'B구역 - 정비/차량', confluencePoint: '중앙 합류지점 (정비창, 차량고)', currentAlertLevel: 'warning' },
      { id: 'b01-z3', baseId: 'base-01', name: 'C구역 - 본부/지원', confluencePoint: '동측 합류지점 (본부, 식당, 의무실)', currentAlertLevel: 'normal' },
    ],
    layout: {
      grounds: { width: 40, depth: 35 },
      buildings: [
        { position: [-12, 1.5, -8], size: [4, 3, 7], label: '생활관 1동', zoneId: 'b01-z1' },
        { position: [-12, 1.5, 0], size: [4, 3, 7], label: '생활관 2동', zoneId: 'b01-z1' },
        { position: [-12, 1.5, 8], size: [4, 3, 7], label: '생활관 3동', zoneId: 'b01-z1' },
        { position: [-5, 1.5, -8], size: [4, 3, 7], label: '생활관 4동', zoneId: 'b01-z1' },
        { position: [2, 1.2, -6], size: [8, 2.4, 5], label: '정비창', zoneId: 'b01-z2' },
        { position: [2, 1, 3], size: [10, 2, 6], label: '차량고', zoneId: 'b01-z2' },
        { position: [12, 1.5, -4], size: [6, 3, 5], label: '본부', zoneId: 'b01-z3' },
        { position: [12, 1, 4], size: [5, 2, 4], label: '식당', zoneId: 'b01-z3' },
        { position: [12, 1, 9], size: [3, 2, 3], label: '의무실', zoneId: 'b01-z3' },
      ],
      zones: [
        { id: 'b01-z1', color: '#00e5ff', area: { x: -16, z: -14, width: 14, depth: 28 }, polygon: [] },
        { id: 'b01-z2', color: '#e040fb', area: { x: -2, z: -14, width: 14, depth: 28 }, polygon: [] },
        { id: 'b01-z3', color: '#ffab00', area: { x: 8, z: -14, width: 12, depth: 28 }, polygon: [] },
      ],
      confluencePoints: [
        { position: [-10, 0.1, 13], zoneId: 'b01-z1', geoPosition: { lat: 36.550, lng: 127.870 } },
        { position: [2, 0.1, 13], zoneId: 'b01-z2', geoPosition: { lat: 36.550, lng: 127.875 } },
        { position: [12, 0.1, 13], zoneId: 'b01-z3', geoPosition: { lat: 36.550, lng: 127.880 } },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // #2 제B전차대대 (경계 출처: 소형 기지)
  // 가상 위치: 경북 영주시 소백산 인근
  // ──────────────────────────────────────────────────
  {
    id: 'base-02',
    name: '제B전차대대',
    type: 'armored',
    location: { lat: 36.935, lng: 128.685 },
    region: '경북 영주시',
    personnelCount: 3200,
    zoneCount: 2,
    characteristics: ['mountainous', 'vehicle_depot', 'near_road'],
    boundary: [
      [36.9385, 128.6810], [36.9380, 128.6835], [36.9372, 128.6855],
      [36.9360, 128.6868], [36.9345, 128.6875], [36.9330, 128.6870],
      [36.9320, 128.6855], [36.9315, 128.6835], [36.9318, 128.6815],
      [36.9325, 128.6800], [36.9340, 128.6790], [36.9355, 128.6788],
      [36.9370, 128.6795], [36.9380, 128.6805],
    ],
    zones: [
      { id: 'b02-z1', baseId: 'base-02', name: 'A구역 - 병영', confluencePoint: '북측 합류지점 (병영, 체력단련장)', currentAlertLevel: 'caution' },
      { id: 'b02-z2', baseId: 'base-02', name: 'B구역 - 차량/본부', confluencePoint: '남측 합류지점 (정비창, 본부)', currentAlertLevel: 'normal' },
    ],
    layout: {
      grounds: { width: 26, depth: 22 },
      buildings: [
        { position: [-5, 1.5, -5], size: [5, 3, 5], label: '병영 1동', zoneId: 'b02-z1' },
        { position: [-5, 1.5, 3], size: [5, 3, 5], label: '병영 2동', zoneId: 'b02-z1' },
        { position: [5, 1.2, -4], size: [8, 2.4, 5], label: '정비창', zoneId: 'b02-z2' },
        { position: [5, 1, 4], size: [5, 2, 3], label: '본부', zoneId: 'b02-z2' },
      ],
      zones: [
        { id: 'b02-z1', color: '#00e5ff', area: { x: -10, z: -9, width: 10, depth: 18 }, polygon: [] },
        { id: 'b02-z2', color: '#e040fb', area: { x: 0, z: -9, width: 12, depth: 18 }, polygon: [] },
      ],
      confluencePoints: [
        { position: [-5, 0.1, 9], zoneId: 'b02-z1', geoPosition: { lat: 36.932, lng: 128.683 } },
        { position: [5, 0.1, 9], zoneId: 'b02-z2', geoPosition: { lat: 36.932, lng: 128.687 } },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // #3 제C사단사령부 (경계 출처: 대형 도시인접 기지)
  // 가상 위치: 강원 횡성군 산지
  // ──────────────────────────────────────────────────
  {
    id: 'base-03',
    name: '제C사단사령부',
    type: 'headquarters',
    location: { lat: 37.465, lng: 127.985 },
    region: '강원 횡성군',
    personnelCount: 1500,
    zoneCount: 2,
    characteristics: ['mountainous', 'high_security', 'office_dominant'],
    boundary: [
      [37.4695, 127.9800], [37.4690, 127.9825], [37.4685, 127.9850],
      [37.4675, 127.9870], [37.4665, 127.9885], [37.4650, 127.9895],
      [37.4635, 127.9890], [37.4620, 127.9878], [37.4610, 127.9860],
      [37.4608, 127.9840], [37.4612, 127.9818], [37.4620, 127.9800],
      [37.4632, 127.9785], [37.4648, 127.9778], [37.4665, 127.9780],
      [37.4680, 127.9788],
    ],
    zones: [
      { id: 'b03-z1', baseId: 'base-03', name: 'A구역 - 사령부 본관', confluencePoint: '북측 합류지점 (본관, 회의실)', currentAlertLevel: 'normal' },
      { id: 'b03-z2', baseId: 'base-03', name: 'B구역 - 지원시설', confluencePoint: '남측 합류지점 (식당, 생활관, 체육관)', currentAlertLevel: 'normal' },
    ],
    layout: {
      grounds: { width: 28, depth: 24 },
      buildings: [
        { position: [0, 2, -6], size: [8, 4, 5], label: '사령부 본관', zoneId: 'b03-z1' },
        { position: [-6, 1, -3], size: [4, 2, 3], label: '회의실', zoneId: 'b03-z1' },
        { position: [-5, 1, 5], size: [5, 2, 4], label: '식당', zoneId: 'b03-z2' },
        { position: [5, 1.5, 5], size: [5, 3, 4], label: '생활관', zoneId: 'b03-z2' },
        { position: [0, 1, 9], size: [8, 2, 5], label: '체육관', zoneId: 'b03-z2' },
      ],
      zones: [
        { id: 'b03-z1', color: '#00e5ff', area: { x: -10, z: -10, width: 22, depth: 10 }, polygon: [] },
        { id: 'b03-z2', color: '#e040fb', area: { x: -10, z: 0, width: 22, depth: 14 }, polygon: [] },
      ],
      confluencePoints: [
        { position: [0, 0.1, -10], zoneId: 'b03-z1', geoPosition: { lat: 37.469, lng: 127.985 } },
        { position: [0, 0.1, 12], zoneId: 'b03-z2', geoPosition: { lat: 37.461, lng: 127.985 } },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // #4 제D보병사단 (경계 출처: 대형 산악 비대칭 기지)
  // 가상 위치: 전북 무주군 덕유산 인근
  // ──────────────────────────────────────────────────
  {
    id: 'base-04',
    name: '제D보병사단',
    type: 'infantry',
    location: { lat: 35.885, lng: 127.745 },
    region: '전북 무주군',
    personnelCount: 9200,
    zoneCount: 3,
    characteristics: ['mountainous', 'cold_climate', 'high_density', 'remote'],
    boundary: [
      [35.8920, 127.7380], [35.8915, 127.7410], [35.8905, 127.7435],
      [35.8890, 127.7455], [35.8870, 127.7470], [35.8850, 127.7478],
      [35.8830, 127.7480], [35.8810, 127.7475], [35.8795, 127.7462],
      [35.8782, 127.7442], [35.8775, 127.7415], [35.8778, 127.7390],
      [35.8785, 127.7368], [35.8800, 127.7350], [35.8818, 127.7340],
      [35.8840, 127.7335], [35.8858, 127.7338], [35.8875, 127.7348],
      [35.8892, 127.7358], [35.8905, 127.7370],
    ],
    zones: [
      { id: 'b04-z1', baseId: 'base-04', name: 'A구역 - 1대대 생활관', confluencePoint: '서측 합류지점', currentAlertLevel: 'critical' },
      { id: 'b04-z2', baseId: 'base-04', name: 'B구역 - 2대대 생활관', confluencePoint: '중앙 합류지점', currentAlertLevel: 'warning' },
      { id: 'b04-z3', baseId: 'base-04', name: 'C구역 - 본부/지원', confluencePoint: '동측 합류지점', currentAlertLevel: 'caution' },
    ],
    layout: {
      grounds: { width: 38, depth: 32 },
      buildings: [
        { position: [-12, 1.5, -8], size: [4, 3, 7], label: '1대대 1동', zoneId: 'b04-z1' },
        { position: [-12, 1.5, 2], size: [4, 3, 7], label: '1대대 2동', zoneId: 'b04-z1' },
        { position: [-5, 1.5, -8], size: [4, 3, 7], label: '1대대 3동', zoneId: 'b04-z1' },
        { position: [2, 1.5, -8], size: [4, 3, 7], label: '2대대 1동', zoneId: 'b04-z2' },
        { position: [2, 1.5, 2], size: [4, 3, 7], label: '2대대 2동', zoneId: 'b04-z2' },
        { position: [12, 1.5, -4], size: [7, 3, 5], label: '본부', zoneId: 'b04-z3' },
        { position: [12, 1, 4], size: [6, 2, 4], label: '식당', zoneId: 'b04-z3' },
        { position: [12, 1, 9], size: [4, 2, 3], label: '의무실', zoneId: 'b04-z3' },
      ],
      zones: [
        { id: 'b04-z1', color: '#00e5ff', area: { x: -16, z: -14, width: 13, depth: 28 }, polygon: [] },
        { id: 'b04-z2', color: '#e040fb', area: { x: -3, z: -14, width: 10, depth: 28 }, polygon: [] },
        { id: 'b04-z3', color: '#ffab00', area: { x: 7, z: -14, width: 13, depth: 28 }, polygon: [] },
      ],
      confluencePoints: [
        { position: [-10, 0.1, 14], zoneId: 'b04-z1', geoPosition: { lat: 35.878, lng: 127.740 } },
        { position: [2, 0.1, 14], zoneId: 'b04-z2', geoPosition: { lat: 35.878, lng: 127.745 } },
        { position: [12, 0.1, 14], zoneId: 'b04-z3', geoPosition: { lat: 35.878, lng: 127.750 } },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // #5 제E군수지원단 (경계 출처: 중형 기지)
  // 가상 위치: 경남 함양군 지리산 인근
  // ──────────────────────────────────────────────────
  {
    id: 'base-05',
    name: '제E군수지원단',
    type: 'logistics',
    location: { lat: 35.525, lng: 127.725 },
    region: '경남 함양군',
    personnelCount: 2800,
    zoneCount: 2,
    characteristics: ['mountainous', 'warehouse_dominant', 'near_road'],
    boundary: [
      [35.5290, 127.7205], [35.5285, 127.7225], [35.5278, 127.7245],
      [35.5268, 127.7260], [35.5255, 127.7268], [35.5240, 127.7270],
      [35.5225, 127.7265], [35.5215, 127.7252], [35.5210, 127.7235],
      [35.5212, 127.7215], [35.5218, 127.7198], [35.5230, 127.7185],
      [35.5245, 127.7180], [35.5260, 127.7183], [35.5275, 127.7192],
    ],
    zones: [
      { id: 'b05-z1', baseId: 'base-05', name: 'A구역 - 관리동', confluencePoint: '북측 합류지점 (관리동, 식당)', currentAlertLevel: 'normal' },
      { id: 'b05-z2', baseId: 'base-05', name: 'B구역 - 창고/생활관', confluencePoint: '남측 합류지점 (창고, 생활관)', currentAlertLevel: 'caution' },
    ],
    layout: {
      grounds: { width: 26, depth: 22 },
      buildings: [
        { position: [-4, 1.5, -6], size: [7, 3, 4], label: '관리동', zoneId: 'b05-z1' },
        { position: [-4, 0.8, 0], size: [4, 1.6, 3], label: '식당', zoneId: 'b05-z1' },
        { position: [6, 1, -6], size: [10, 2, 5], label: '창고', zoneId: 'b05-z2' },
        { position: [6, 1.5, 3], size: [5, 3, 4], label: '생활관', zoneId: 'b05-z2' },
      ],
      zones: [
        { id: 'b05-z1', color: '#00e5ff', area: { x: -10, z: -9, width: 12, depth: 18 }, polygon: [] },
        { id: 'b05-z2', color: '#e040fb', area: { x: 1, z: -9, width: 12, depth: 18 }, polygon: [] },
      ],
      confluencePoints: [
        { position: [-4, 0.1, 9], zoneId: 'b05-z1', geoPosition: { lat: 35.521, lng: 127.722 } },
        { position: [6, 0.1, 9], zoneId: 'b05-z2', geoPosition: { lat: 35.521, lng: 127.728 } },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // #6 제F공수여단 (경계 출처: 대형 산악 기지)
  // 가상 위치: 경북 봉화군 태백산 인근
  // ──────────────────────────────────────────────────
  {
    id: 'base-06',
    name: '제F공수여단',
    type: 'airforce',
    location: { lat: 36.895, lng: 128.925 },
    region: '경북 봉화군',
    personnelCount: 2400,
    zoneCount: 2,
    characteristics: ['mountainous', 'high_fitness', 'dispersed'],
    boundary: [
      [36.9010, 128.9190], [36.9005, 128.9215], [36.8995, 128.9240],
      [36.8980, 128.9258], [36.8965, 128.9270], [36.8948, 128.9275],
      [36.8930, 128.9272], [36.8918, 128.9260], [36.8908, 128.9242],
      [36.8902, 128.9218], [36.8905, 128.9195], [36.8912, 128.9175],
      [36.8925, 128.9162], [36.8942, 128.9155], [36.8960, 128.9158],
      [36.8975, 128.9165], [36.8990, 128.9178],
    ],
    zones: [
      { id: 'b06-z1', baseId: 'base-06', name: 'A구역 - 병영/훈련장', confluencePoint: '서측 합류지점 (병영, 훈련장)', currentAlertLevel: 'normal' },
      { id: 'b06-z2', baseId: 'base-06', name: 'B구역 - 지원시설', confluencePoint: '동측 합류지점 (본부, 지원시설)', currentAlertLevel: 'normal' },
    ],
    layout: {
      grounds: { width: 28, depth: 22 },
      buildings: [
        { position: [-7, 1.5, -4], size: [5, 3, 5], label: '병영', zoneId: 'b06-z1' },
        { position: [-7, 0.8, 4], size: [6, 1.6, 4], label: '훈련장', zoneId: 'b06-z1' },
        { position: [6, 1.5, -4], size: [6, 3, 4], label: '본부', zoneId: 'b06-z2' },
        { position: [6, 1, 4], size: [5, 2, 3], label: '지원시설', zoneId: 'b06-z2' },
      ],
      zones: [
        { id: 'b06-z1', color: '#00e5ff', area: { x: -12, z: -9, width: 12, depth: 18 }, polygon: [] },
        { id: 'b06-z2', color: '#e040fb', area: { x: 1, z: -9, width: 12, depth: 18 }, polygon: [] },
      ],
      confluencePoints: [
        { position: [-7, 0.1, 9], zoneId: 'b06-z1', geoPosition: { lat: 36.890, lng: 128.922 } },
        { position: [6, 0.1, 9], zoneId: 'b06-z2', geoPosition: { lat: 36.890, lng: 128.928 } },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // #7 제G포병여단 (경계 출처: 중형 하천인접 기지)
  // 가상 위치: 충남 금산군 산지
  // ──────────────────────────────────────────────────
  {
    id: 'base-07',
    name: '제G포병여단',
    type: 'artillery',
    location: { lat: 36.115, lng: 127.485 },
    region: '충남 금산군',
    personnelCount: 3600,
    zoneCount: 3,
    characteristics: ['mountainous', 'near_river', 'ammunition_storage'],
    boundary: [
      [36.1200, 127.4800], [36.1195, 127.4825], [36.1185, 127.4848],
      [36.1172, 127.4865], [36.1155, 127.4875], [36.1138, 127.4880],
      [36.1120, 127.4876], [36.1105, 127.4862], [36.1095, 127.4842],
      [36.1092, 127.4818], [36.1095, 127.4795], [36.1105, 127.4775],
      [36.1120, 127.4762], [36.1138, 127.4755], [36.1155, 127.4758],
      [36.1172, 127.4768], [36.1188, 127.4782],
    ],
    zones: [
      { id: 'b07-z1', baseId: 'base-07', name: 'A구역 - 1포대', confluencePoint: '서측 합류지점 (1포대 병영)', currentAlertLevel: 'normal' },
      { id: 'b07-z2', baseId: 'base-07', name: 'B구역 - 2포대', confluencePoint: '중앙 합류지점 (2포대 병영, 식당)', currentAlertLevel: 'warning' },
      { id: 'b07-z3', baseId: 'base-07', name: 'C구역 - 본부/탄약고', confluencePoint: '동측 합류지점 (본부, 지원시설)', currentAlertLevel: 'normal' },
    ],
    layout: {
      grounds: { width: 30, depth: 24 },
      buildings: [
        { position: [-9, 1.5, -4], size: [4, 3, 5], label: '1포대 병영', zoneId: 'b07-z1' },
        { position: [0, 1.5, -4], size: [4, 3, 5], label: '2포대 병영', zoneId: 'b07-z2' },
        { position: [0, 0.8, 4], size: [4, 1.6, 3], label: '식당', zoneId: 'b07-z2' },
        { position: [9, 1.2, -4], size: [5, 2.4, 4], label: '본부', zoneId: 'b07-z3' },
        { position: [9, 0.8, 4], size: [4, 1.6, 3], label: '탄약고', zoneId: 'b07-z3' },
      ],
      zones: [
        { id: 'b07-z1', color: '#00e5ff', area: { x: -13, z: -10, width: 9, depth: 20 }, polygon: [] },
        { id: 'b07-z2', color: '#e040fb', area: { x: -4, z: -10, width: 9, depth: 20 }, polygon: [] },
        { id: 'b07-z3', color: '#ffab00', area: { x: 5, z: -10, width: 10, depth: 20 }, polygon: [] },
      ],
      confluencePoints: [
        { position: [-9, 0.1, 10], zoneId: 'b07-z1', geoPosition: { lat: 36.110, lng: 127.480 } },
        { position: [0, 0.1, 10], zoneId: 'b07-z2', geoPosition: { lat: 36.110, lng: 127.485 } },
        { position: [9, 0.1, 10], zoneId: 'b07-z3', geoPosition: { lat: 36.110, lng: 127.490 } },
      ],
    },
  },
];

export const baseMap = Object.fromEntries(
  bases.map(b => [b.id, b])
) as Record<string, MilitaryBase>;
