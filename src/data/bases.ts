import type { MilitaryBase } from '../types';

/**
 * 폴리곤 설계 원칙:
 * - 부대 전체를 하나의 외곽 경계로 감싸고, 내부를 구역으로 분할
 * - 인접 구역은 공유 변(shared edge)을 가져 빈틈 없음
 * - 분할선은 지그재그/곡선으로 자연스럽게
 * - 부대 유형별 형태 차별화 (산악/도시/공군 등)
 * - 위도 0.001 ≈ 111m, 경도 0.001 ≈ 89m (한국 위도 기준)
 */

export const bases: MilitaryBase[] = [
  // ──────────────────────────────────────────────────
  // base-01: 제1보병사단 (파주, 8500명, 산악/전방, 3구역)
  //   전체 약 600m × 500m, 능선 따라 불규칙, 남쪽으로 하수 흐름
  // ──────────────────────────────────────────────────
  {
    id: 'base-01',
    name: '제1보병사단',
    type: 'infantry',
    location: { lat: 37.9015, lng: 126.9490 },
    region: '경기도 파주시',
    personnelCount: 8500,
    zoneCount: 3,
    characteristics: ['mountainous', 'near_border', 'high_density'],
    zones: [
      { id: 'b01-z1', baseId: 'base-01', name: 'A구역 - 생활관 북측', confluencePoint: '북측 합류지점 (생활관 1~3동)', currentAlertLevel: 'normal' },
      { id: 'b01-z2', baseId: 'base-01', name: 'B구역 - 생활관 남측', confluencePoint: '남측 합류지점 (생활관 4~6동, 체력단련장)', currentAlertLevel: 'warning' },
      { id: 'b01-z3', baseId: 'base-01', name: 'C구역 - 본부/식당', confluencePoint: '중앙 합류지점 (본부, 식당, 의무실)', currentAlertLevel: 'normal' },
    ],
    layout: {
      grounds: { width: 30, depth: 24 },
      buildings: [
        { position: [-8, 1.5, -6], size: [4, 3, 6], label: '생활관 1동', zoneId: 'b01-z1' },
        { position: [-8, 1.5, 2], size: [4, 3, 6], label: '생활관 2동', zoneId: 'b01-z1' },
        { position: [0, 1.5, -6], size: [4, 3, 6], label: '생활관 4동', zoneId: 'b01-z2' },
        { position: [0, 1.5, 2], size: [4, 3, 6], label: '생활관 5동', zoneId: 'b01-z2' },
        { position: [8, 1, -2], size: [6, 2, 4], label: '본부', zoneId: 'b01-z3' },
        { position: [8, 1, 4], size: [5, 2, 3], label: '식당', zoneId: 'b01-z3' },
        { position: [8, 0.8, -7], size: [3, 1.6, 3], label: '의무실', zoneId: 'b01-z3' },
      ],
      zones: (() => {
        // 공유 경계선 정의 (A-B 경계, B-C 경계)
        const AB_BORDER: [number, number][] = [
          [37.9040, 126.9480], [37.9035, 126.9485], [37.9028, 126.9482],
          [37.9022, 126.9486], [37.9015, 126.9483],
        ];
        const BC_BORDER: [number, number][] = [
          [37.9040, 126.9500], [37.9034, 126.9496], [37.9028, 126.9498],
          [37.9020, 126.9494], [37.9012, 126.9497],
        ];
        return [
          {
            id: 'b01-z1', color: '#00e5ff',
            area: { x: -12, z: -10, width: 8, depth: 20 },
            // 서쪽 외곽 → AB 경계(역순)
            polygon: [
              [37.9045, 126.9458], [37.9042, 126.9468], [37.9038, 126.9475],
              ...AB_BORDER,
              [37.9010, 126.9478], [37.9005, 126.9470], [37.9008, 126.9458],
              [37.9015, 126.9450], [37.9028, 126.9448], [37.9038, 126.9452],
            ],
          },
          {
            id: 'b01-z2', color: '#e040fb',
            area: { x: -3, z: -10, width: 8, depth: 20 },
            // AB 경계 → BC 경계(역순)
            polygon: [
              ...AB_BORDER,
              [37.9012, 126.9497],
              [37.9020, 126.9494], [37.9028, 126.9498], [37.9034, 126.9496],
              [37.9040, 126.9500],
            ],
          },
          {
            id: 'b01-z3', color: '#ffab00',
            area: { x: 5, z: -10, width: 10, depth: 20 },
            // BC 경계 → 동쪽 외곽
            polygon: [
              ...BC_BORDER,
              [37.9008, 126.9505], [37.9003, 126.9515], [37.9005, 126.9528],
              [37.9012, 126.9535], [37.9025, 126.9538], [37.9035, 126.9532],
              [37.9042, 126.9520], [37.9045, 126.9508],
            ],
          },
        ];
      })(),
      confluencePoints: [
        { position: [-8, 0.1, 8], zoneId: 'b01-z1', geoPosition: { lat: 37.9008, lng: 126.9465 } },
        { position: [0, 0.1, 8], zoneId: 'b01-z2', geoPosition: { lat: 37.9015, lng: 126.9490 } },
        { position: [8, 0.1, 8], zoneId: 'b01-z3', geoPosition: { lat: 37.9005, lng: 126.9518 } },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // base-02: 제3기갑여단 (의정부, 3200명, 도시인접/차량, 2구역)
  //   약 400m × 350m, 도로 따라 비교적 각진 형태
  // ──────────────────────────────────────────────────
  {
    id: 'base-02',
    name: '제3기갑여단',
    type: 'armored',
    location: { lat: 37.7515, lng: 127.0505 },
    region: '경기도 의정부시',
    personnelCount: 3200,
    zoneCount: 2,
    characteristics: ['urban_adjacent', 'vehicle_depot'],
    zones: [
      { id: 'b02-z1', baseId: 'base-02', name: 'A구역 - 병영', confluencePoint: '서측 합류지점 (병영, 체력단련장)', currentAlertLevel: 'caution' },
      { id: 'b02-z2', baseId: 'base-02', name: 'B구역 - 차량정비/본부', confluencePoint: '동측 합류지점 (정비창, 본부)', currentAlertLevel: 'normal' },
    ],
    layout: {
      grounds: { width: 26, depth: 20 },
      buildings: [
        { position: [-6, 1.5, -4], size: [5, 3, 5], label: '병영 1동', zoneId: 'b02-z1' },
        { position: [-6, 1.5, 4], size: [5, 3, 5], label: '병영 2동', zoneId: 'b02-z1' },
        { position: [5, 1, -4], size: [8, 2, 4], label: '정비창', zoneId: 'b02-z2' },
        { position: [5, 1, 3], size: [5, 2, 3], label: '본부', zoneId: 'b02-z2' },
      ],
      zones: (() => {
        // A-B 공유 경계 (부대 내 도로를 따라 남북으로)
        const AB_BORDER: [number, number][] = [
          [37.7532, 127.0505], [37.7526, 127.0502], [37.7520, 127.0506],
          [37.7514, 127.0503], [37.7508, 127.0507], [37.7500, 127.0504],
        ];
        return [
          {
            id: 'b02-z1', color: '#00e5ff',
            area: { x: -10, z: -8, width: 10, depth: 16 },
            polygon: [
              [37.7535, 127.0478], [37.7533, 127.0488], [37.7535, 127.0498],
              ...AB_BORDER,
              [37.7498, 127.0495], [37.7496, 127.0485], [37.7500, 127.0475],
              [37.7508, 127.0470], [37.7518, 127.0468], [37.7528, 127.0472],
            ],
          },
          {
            id: 'b02-z2', color: '#e040fb',
            area: { x: 0, z: -8, width: 12, depth: 16 },
            polygon: [
              ...AB_BORDER,
              [37.7498, 127.0512], [37.7496, 127.0522], [37.7500, 127.0535],
              [37.7508, 127.0542], [37.7518, 127.0545], [37.7528, 127.0540],
              [37.7534, 127.0530], [37.7536, 127.0518], [37.7534, 127.0508],
            ],
          },
        ];
      })(),
      confluencePoints: [
        { position: [-6, 0.1, 8], zoneId: 'b02-z1', geoPosition: { lat: 37.7498, lng: 127.0485 } },
        { position: [5, 0.1, 8], zoneId: 'b02-z2', geoPosition: { lat: 37.7498, lng: 127.0525 } },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // base-03: 수도군단사령부 (서울, 1500명, 도시형, 2구역)
  //   약 300m × 250m, 담장/도로 따라 정돈된 형태
  // ──────────────────────────────────────────────────
  {
    id: 'base-03',
    name: '수도군단사령부',
    type: 'headquarters',
    location: { lat: 37.4808, lng: 127.0398 },
    region: '서울특별시',
    personnelCount: 1500,
    zoneCount: 2,
    characteristics: ['urban', 'high_security', 'office_dominant'],
    zones: [
      { id: 'b03-z1', baseId: 'base-03', name: 'A구역 - 사령부 본관', confluencePoint: '북측 합류지점 (본관, 회의실)', currentAlertLevel: 'normal' },
      { id: 'b03-z2', baseId: 'base-03', name: 'B구역 - 지원시설', confluencePoint: '남측 합류지점 (식당, 생활관, 체육관)', currentAlertLevel: 'normal' },
    ],
    layout: {
      grounds: { width: 22, depth: 18 },
      buildings: [
        { position: [0, 2, -4], size: [8, 4, 5], label: '사령부 본관', zoneId: 'b03-z1' },
        { position: [-5, 1, 4], size: [4, 2, 3], label: '식당', zoneId: 'b03-z2' },
        { position: [4, 1.5, 4], size: [5, 3, 4], label: '생활관', zoneId: 'b03-z2' },
      ],
      zones: (() => {
        // A-B 공유 경계 (동서 방향 - 부대 중앙 도로)
        const AB_BORDER: [number, number][] = [
          [37.4810, 127.0380], [37.4808, 127.0388], [37.4810, 127.0396],
          [37.4807, 127.0404], [37.4809, 127.0412], [37.4808, 127.0418],
        ];
        return [
          {
            id: 'b03-z1', color: '#00e5ff',
            area: { x: -6, z: -8, width: 14, depth: 8 },
            // 북측 본관 구역
            polygon: [
              [37.4822, 127.0382], [37.4820, 127.0392], [37.4822, 127.0403],
              [37.4820, 127.0414], [37.4818, 127.0420],
              ...([...AB_BORDER].reverse() as [number, number][]),
            ],
          },
          {
            id: 'b03-z2', color: '#e040fb',
            area: { x: -8, z: 0, width: 18, depth: 8 },
            // 남측 지원시설
            polygon: [
              ...AB_BORDER,
              [37.4805, 127.0422], [37.4800, 127.0418], [37.4796, 127.0410],
              [37.4794, 127.0400], [37.4795, 127.0390], [37.4798, 127.0382],
              [37.4802, 127.0376],
            ],
          },
        ];
      })(),
      confluencePoints: [
        { position: [0, 0.1, -7], zoneId: 'b03-z1', geoPosition: { lat: 37.4818, lng: 127.0400 } },
        { position: [0, 0.1, 7], zoneId: 'b03-z2', geoPosition: { lat: 37.4796, lng: 127.0400 } },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // base-04: 제8보병사단 (인제, 9200명, 산악/전방, 3구역)
  //   약 700m × 550m, 산 능선 따라 매우 불규칙, 가장 큰 부대
  // ──────────────────────────────────────────────────
  {
    id: 'base-04',
    name: '제8보병사단',
    type: 'infantry',
    location: { lat: 38.1025, lng: 127.7510 },
    region: '강원도 인제군',
    personnelCount: 9200,
    zoneCount: 3,
    characteristics: ['mountainous', 'near_border', 'cold_climate', 'remote'],
    zones: [
      { id: 'b04-z1', baseId: 'base-04', name: 'A구역 - 1대대 생활관', confluencePoint: '서측 합류지점', currentAlertLevel: 'critical' },
      { id: 'b04-z2', baseId: 'base-04', name: 'B구역 - 2대대 생활관', confluencePoint: '중앙 합류지점', currentAlertLevel: 'warning' },
      { id: 'b04-z3', baseId: 'base-04', name: 'C구역 - 본부/지원', confluencePoint: '동측 합류지점', currentAlertLevel: 'caution' },
    ],
    layout: {
      grounds: { width: 32, depth: 26 },
      buildings: [
        { position: [-10, 1.5, -5], size: [4, 3, 6], label: '1대대 1동', zoneId: 'b04-z1' },
        { position: [-10, 1.5, 4], size: [4, 3, 6], label: '1대대 2동', zoneId: 'b04-z1' },
        { position: [0, 1.5, -5], size: [4, 3, 6], label: '2대대 1동', zoneId: 'b04-z2' },
        { position: [0, 1.5, 4], size: [4, 3, 6], label: '2대대 2동', zoneId: 'b04-z2' },
        { position: [10, 1.2, -2], size: [6, 2.4, 5], label: '본부', zoneId: 'b04-z3' },
        { position: [10, 1, 5], size: [5, 2, 3], label: '식당', zoneId: 'b04-z3' },
      ],
      zones: (() => {
        // 산악 능선 따라 지그재그 분할선
        const AB_BORDER: [number, number][] = [
          [38.1050, 127.7495], [38.1044, 127.7492], [38.1038, 127.7498],
          [38.1030, 127.7494], [38.1022, 127.7500], [38.1015, 127.7496],
          [38.1008, 127.7502], [38.1000, 127.7498],
        ];
        const BC_BORDER: [number, number][] = [
          [38.1050, 127.7522], [38.1042, 127.7518], [38.1035, 127.7524],
          [38.1028, 127.7520], [38.1020, 127.7526], [38.1012, 127.7522],
          [38.1005, 127.7528], [38.1000, 127.7525],
        ];
        return [
          {
            id: 'b04-z1', color: '#00e5ff',
            area: { x: -14, z: -10, width: 9, depth: 22 },
            polygon: [
              [38.1055, 127.7460], [38.1052, 127.7472], [38.1048, 127.7482],
              ...AB_BORDER,
              [38.0998, 127.7490], [38.0995, 127.7480], [38.0998, 127.7465],
              [38.1005, 127.7455], [38.1018, 127.7448], [38.1035, 127.7450],
              [38.1048, 127.7455],
            ],
          },
          {
            id: 'b04-z2', color: '#e040fb',
            area: { x: -4, z: -10, width: 9, depth: 22 },
            polygon: [
              ...AB_BORDER,
              [38.1000, 127.7525],
              [38.1005, 127.7528], [38.1012, 127.7522], [38.1020, 127.7526],
              [38.1028, 127.7520], [38.1035, 127.7524], [38.1042, 127.7518],
              [38.1050, 127.7522],
            ],
          },
          {
            id: 'b04-z3', color: '#ffab00',
            area: { x: 6, z: -10, width: 10, depth: 22 },
            polygon: [
              ...BC_BORDER,
              [38.0998, 127.7535], [38.0995, 127.7548], [38.1000, 127.7562],
              [38.1010, 127.7572], [38.1025, 127.7578], [38.1040, 127.7570],
              [38.1050, 127.7555], [38.1054, 127.7540], [38.1052, 127.7528],
            ],
          },
        ];
      })(),
      confluencePoints: [
        { position: [-10, 0.1, 10], zoneId: 'b04-z1', geoPosition: { lat: 38.0998, lng: 127.7475 } },
        { position: [0, 0.1, 10], zoneId: 'b04-z2', geoPosition: { lat: 38.1000, lng: 127.7510 } },
        { position: [10, 0.1, 10], zoneId: 'b04-z3', geoPosition: { lat: 38.0998, lng: 127.7548 } },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // base-05: 군수사령부 (대전, 2800명, 도시형/창고, 2구역)
  //   약 400m × 300m, 도로/담장 따라 비교적 정돈
  // ──────────────────────────────────────────────────
  {
    id: 'base-05',
    name: '군수사령부',
    type: 'logistics',
    location: { lat: 36.3510, lng: 127.3810 },
    region: '대전광역시',
    personnelCount: 2800,
    zoneCount: 2,
    characteristics: ['urban_adjacent', 'warehouse_dominant', 'low_density'],
    zones: [
      { id: 'b05-z1', baseId: 'base-05', name: 'A구역 - 관리동', confluencePoint: '북측 합류지점 (관리동, 식당)', currentAlertLevel: 'normal' },
      { id: 'b05-z2', baseId: 'base-05', name: 'B구역 - 창고/생활관', confluencePoint: '남측 합류지점 (창고, 생활관)', currentAlertLevel: 'caution' },
    ],
    layout: {
      grounds: { width: 28, depth: 20 },
      buildings: [
        { position: [-4, 1.5, -5], size: [7, 3, 4], label: '관리동', zoneId: 'b05-z1' },
        { position: [-4, 0.8, 0], size: [4, 1.6, 3], label: '식당', zoneId: 'b05-z1' },
        { position: [6, 1, -5], size: [10, 2, 5], label: '창고', zoneId: 'b05-z2' },
        { position: [6, 1.5, 3], size: [5, 3, 4], label: '생활관', zoneId: 'b05-z2' },
      ],
      zones: (() => {
        // 도로 따라 동서 분할 (약간 각진 형태)
        const AB_BORDER: [number, number][] = [
          [36.3525, 127.3810], [36.3520, 127.3808], [36.3515, 127.3812],
          [36.3510, 127.3809], [36.3505, 127.3813], [36.3498, 127.3810],
        ];
        return [
          {
            id: 'b05-z1', color: '#00e5ff',
            area: { x: -10, z: -8, width: 12, depth: 16 },
            polygon: [
              [36.3528, 127.3785], [36.3526, 127.3795], [36.3528, 127.3805],
              ...AB_BORDER,
              [36.3496, 127.3802], [36.3494, 127.3792], [36.3498, 127.3782],
              [36.3506, 127.3775], [36.3518, 127.3778],
            ],
          },
          {
            id: 'b05-z2', color: '#e040fb',
            area: { x: 1, z: -8, width: 14, depth: 16 },
            polygon: [
              ...AB_BORDER,
              [36.3496, 127.3818], [36.3494, 127.3828], [36.3498, 127.3840],
              [36.3506, 127.3848], [36.3516, 127.3850], [36.3524, 127.3845],
              [36.3530, 127.3835], [36.3530, 127.3822], [36.3528, 127.3815],
            ],
          },
        ];
      })(),
      confluencePoints: [
        { position: [-4, 0.1, 7], zoneId: 'b05-z1', geoPosition: { lat: 36.3496, lng: 127.3795 } },
        { position: [6, 0.1, 7], zoneId: 'b05-z2', geoPosition: { lat: 36.3496, lng: 127.3830 } },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // base-06: 제11공수여단 (김해, 2400명, 공군/해안, 2구역)
  //   약 450m × 300m, 활주로 축 따라 길쭉한 형태
  // ──────────────────────────────────────────────────
  {
    id: 'base-06',
    name: '제11공수여단',
    type: 'airforce',
    location: { lat: 35.1510, lng: 128.9305 },
    region: '경상남도 김해시',
    personnelCount: 2400,
    zoneCount: 2,
    characteristics: ['coastal', 'airfield_adjacent', 'high_fitness'],
    zones: [
      { id: 'b06-z1', baseId: 'base-06', name: 'A구역 - 병영/훈련장', confluencePoint: '서측 합류지점 (병영, 훈련장)', currentAlertLevel: 'normal' },
      { id: 'b06-z2', baseId: 'base-06', name: 'B구역 - 활주로/지원', confluencePoint: '동측 합류지점 (격납고, 지원시설)', currentAlertLevel: 'normal' },
    ],
    layout: {
      grounds: { width: 30, depth: 20 },
      buildings: [
        { position: [-8, 1.5, -3], size: [5, 3, 5], label: '병영', zoneId: 'b06-z1' },
        { position: [-8, 0.8, 4], size: [6, 1.6, 4], label: '훈련장', zoneId: 'b06-z1' },
        { position: [6, 1.5, -3], size: [8, 3, 5], label: '격납고', zoneId: 'b06-z2' },
        { position: [6, 1, 4], size: [5, 2, 3], label: '지원시설', zoneId: 'b06-z2' },
      ],
      zones: (() => {
        // 활주로 평행 분할 - 약간 대각선
        const AB_BORDER: [number, number][] = [
          [35.1528, 128.9303], [35.1522, 128.9300], [35.1516, 128.9305],
          [35.1510, 128.9302], [35.1504, 128.9306], [35.1498, 128.9303],
          [35.1492, 128.9306],
        ];
        return [
          {
            id: 'b06-z1', color: '#00e5ff',
            area: { x: -12, z: -8, width: 12, depth: 16 },
            polygon: [
              [35.1530, 128.9275], [35.1528, 128.9288], [35.1530, 128.9298],
              ...AB_BORDER,
              [35.1490, 128.9298], [35.1488, 128.9288], [35.1492, 128.9278],
              [35.1500, 128.9270], [35.1512, 128.9268], [35.1524, 128.9272],
            ],
          },
          {
            id: 'b06-z2', color: '#e040fb',
            area: { x: 1, z: -8, width: 14, depth: 16 },
            // 격납고 쪽 - 좀 더 넓고 길쭉
            polygon: [
              ...AB_BORDER,
              [35.1490, 128.9315], [35.1488, 128.9328], [35.1492, 128.9340],
              [35.1500, 128.9348], [35.1512, 128.9350], [35.1524, 128.9345],
              [35.1530, 128.9335], [35.1532, 128.9320], [35.1530, 128.9310],
            ],
          },
        ];
      })(),
      confluencePoints: [
        { position: [-8, 0.1, 8], zoneId: 'b06-z1', geoPosition: { lat: 35.1490, lng: 128.9288 } },
        { position: [6, 0.1, 8], zoneId: 'b06-z2', geoPosition: { lat: 35.1490, lng: 128.9330 } },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // base-07: 제2포병여단 (원주, 3600명, 산악/분산, 3구역)
  //   약 500m × 400m, 산기슭 분산 배치
  // ──────────────────────────────────────────────────
  {
    id: 'base-07',
    name: '제2포병여단',
    type: 'artillery',
    location: { lat: 37.3515, lng: 127.9520 },
    region: '강원도 원주시',
    personnelCount: 3600,
    zoneCount: 3,
    characteristics: ['mountainous', 'dispersed', 'ammunition_storage'],
    zones: [
      { id: 'b07-z1', baseId: 'base-07', name: 'A구역 - 1포대', confluencePoint: '서측 합류지점 (1포대 병영)', currentAlertLevel: 'normal' },
      { id: 'b07-z2', baseId: 'base-07', name: 'B구역 - 2포대', confluencePoint: '중앙 합류지점 (2포대 병영, 식당)', currentAlertLevel: 'warning' },
      { id: 'b07-z3', baseId: 'base-07', name: 'C구역 - 본부/탄약고', confluencePoint: '동측 합류지점 (본부, 지원시설)', currentAlertLevel: 'normal' },
    ],
    layout: {
      grounds: { width: 30, depth: 22 },
      buildings: [
        { position: [-9, 1.5, -3], size: [4, 3, 5], label: '1포대 병영', zoneId: 'b07-z1' },
        { position: [0, 1.5, -3], size: [4, 3, 5], label: '2포대 병영', zoneId: 'b07-z2' },
        { position: [0, 0.8, 4], size: [4, 1.6, 3], label: '식당', zoneId: 'b07-z2' },
        { position: [9, 1.2, -3], size: [5, 2.4, 4], label: '본부', zoneId: 'b07-z3' },
        { position: [9, 0.8, 4], size: [4, 1.6, 3], label: '탄약고', zoneId: 'b07-z3' },
      ],
      zones: (() => {
        // 산기슭 도로 따라 분할
        const AB_BORDER: [number, number][] = [
          [37.3538, 127.9508], [37.3532, 127.9505], [37.3525, 127.9510],
          [37.3518, 127.9506], [37.3512, 127.9512], [37.3505, 127.9508],
          [37.3498, 127.9512],
        ];
        const BC_BORDER: [number, number][] = [
          [37.3538, 127.9535], [37.3530, 127.9530], [37.3524, 127.9536],
          [37.3518, 127.9532], [37.3510, 127.9538], [37.3504, 127.9534],
          [37.3498, 127.9538],
        ];
        return [
          {
            id: 'b07-z1', color: '#00e5ff',
            area: { x: -13, z: -9, width: 9, depth: 18 },
            polygon: [
              [37.3542, 127.9478], [37.3540, 127.9490], [37.3542, 127.9502],
              ...AB_BORDER,
              [37.3496, 127.9505], [37.3494, 127.9492], [37.3498, 127.9480],
              [37.3508, 127.9472], [37.3520, 127.9470], [37.3534, 127.9474],
            ],
          },
          {
            id: 'b07-z2', color: '#e040fb',
            area: { x: -3, z: -9, width: 9, depth: 18 },
            polygon: [
              ...AB_BORDER,
              [37.3498, 127.9538],
              [37.3504, 127.9534], [37.3510, 127.9538], [37.3518, 127.9532],
              [37.3524, 127.9536], [37.3530, 127.9530], [37.3538, 127.9535],
            ],
          },
          {
            id: 'b07-z3', color: '#ffab00',
            area: { x: 6, z: -9, width: 10, depth: 18 },
            polygon: [
              ...BC_BORDER,
              [37.3496, 127.9545], [37.3494, 127.9558], [37.3498, 127.9570],
              [37.3508, 127.9578], [37.3520, 127.9580], [37.3532, 127.9575],
              [37.3540, 127.9562], [37.3542, 127.9548], [37.3540, 127.9538],
            ],
          },
        ];
      })(),
      confluencePoints: [
        { position: [-9, 0.1, 8], zoneId: 'b07-z1', geoPosition: { lat: 37.3496, lng: 127.9490 } },
        { position: [0, 0.1, 8], zoneId: 'b07-z2', geoPosition: { lat: 37.3498, lng: 127.9522 } },
        { position: [9, 0.1, 8], zoneId: 'b07-z3', geoPosition: { lat: 37.3496, lng: 127.9558 } },
      ],
    },
  },
];

export const baseMap = Object.fromEntries(
  bases.map(b => [b.id, b])
) as Record<string, MilitaryBase>;
