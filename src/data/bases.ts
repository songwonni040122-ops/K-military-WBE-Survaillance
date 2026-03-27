import type { MilitaryBase } from '../types';

export const bases: MilitaryBase[] = [
  {
    id: 'base-01',
    name: '제1보병사단',
    type: 'infantry',
    location: { lat: 37.90, lng: 126.95 },
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
      zones: [
        { id: 'b01-z1', color: '#00e5ff', area: { x: -12, z: -10, width: 8, depth: 20 } },
        { id: 'b01-z2', color: '#e040fb', area: { x: -3, z: -10, width: 8, depth: 20 } },
        { id: 'b01-z3', color: '#ffab00', area: { x: 5, z: -10, width: 10, depth: 20 } },
      ],
      confluencePoints: [
        { position: [-8, 0.1, 8], zoneId: 'b01-z1' },
        { position: [0, 0.1, 8], zoneId: 'b01-z2' },
        { position: [8, 0.1, 8], zoneId: 'b01-z3' },
      ],
    },
  },
  {
    id: 'base-02',
    name: '제3기갑여단',
    type: 'armored',
    location: { lat: 37.75, lng: 127.05 },
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
      zones: [
        { id: 'b02-z1', color: '#00e5ff', area: { x: -10, z: -8, width: 10, depth: 16 } },
        { id: 'b02-z2', color: '#e040fb', area: { x: 0, z: -8, width: 12, depth: 16 } },
      ],
      confluencePoints: [
        { position: [-6, 0.1, 8], zoneId: 'b02-z1' },
        { position: [5, 0.1, 8], zoneId: 'b02-z2' },
      ],
    },
  },
  {
    id: 'base-03',
    name: '수도군단사령부',
    type: 'headquarters',
    location: { lat: 37.48, lng: 127.04 },
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
      zones: [
        { id: 'b03-z1', color: '#00e5ff', area: { x: -6, z: -8, width: 14, depth: 8 } },
        { id: 'b03-z2', color: '#e040fb', area: { x: -8, z: 0, width: 18, depth: 8 } },
      ],
      confluencePoints: [
        { position: [0, 0.1, -7], zoneId: 'b03-z1' },
        { position: [0, 0.1, 7], zoneId: 'b03-z2' },
      ],
    },
  },
  {
    id: 'base-04',
    name: '제8보병사단',
    type: 'infantry',
    location: { lat: 38.10, lng: 127.75 },
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
      zones: [
        { id: 'b04-z1', color: '#00e5ff', area: { x: -14, z: -10, width: 9, depth: 22 } },
        { id: 'b04-z2', color: '#e040fb', area: { x: -4, z: -10, width: 9, depth: 22 } },
        { id: 'b04-z3', color: '#ffab00', area: { x: 6, z: -10, width: 10, depth: 22 } },
      ],
      confluencePoints: [
        { position: [-10, 0.1, 10], zoneId: 'b04-z1' },
        { position: [0, 0.1, 10], zoneId: 'b04-z2' },
        { position: [10, 0.1, 10], zoneId: 'b04-z3' },
      ],
    },
  },
  {
    id: 'base-05',
    name: '군수사령부',
    type: 'logistics',
    location: { lat: 36.35, lng: 127.38 },
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
      zones: [
        { id: 'b05-z1', color: '#00e5ff', area: { x: -10, z: -8, width: 12, depth: 16 } },
        { id: 'b05-z2', color: '#e040fb', area: { x: 1, z: -8, width: 14, depth: 16 } },
      ],
      confluencePoints: [
        { position: [-4, 0.1, 7], zoneId: 'b05-z1' },
        { position: [6, 0.1, 7], zoneId: 'b05-z2' },
      ],
    },
  },
  {
    id: 'base-06',
    name: '제11공수여단',
    type: 'airforce',
    location: { lat: 35.15, lng: 128.93 },
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
      zones: [
        { id: 'b06-z1', color: '#00e5ff', area: { x: -12, z: -8, width: 12, depth: 16 } },
        { id: 'b06-z2', color: '#e040fb', area: { x: 1, z: -8, width: 14, depth: 16 } },
      ],
      confluencePoints: [
        { position: [-8, 0.1, 8], zoneId: 'b06-z1' },
        { position: [6, 0.1, 8], zoneId: 'b06-z2' },
      ],
    },
  },
  {
    id: 'base-07',
    name: '제2포병여단',
    type: 'artillery',
    location: { lat: 37.35, lng: 127.95 },
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
      zones: [
        { id: 'b07-z1', color: '#00e5ff', area: { x: -13, z: -9, width: 9, depth: 18 } },
        { id: 'b07-z2', color: '#e040fb', area: { x: -3, z: -9, width: 9, depth: 18 } },
        { id: 'b07-z3', color: '#ffab00', area: { x: 6, z: -9, width: 10, depth: 18 } },
      ],
      confluencePoints: [
        { position: [-9, 0.1, 8], zoneId: 'b07-z1' },
        { position: [0, 0.1, 8], zoneId: 'b07-z2' },
        { position: [9, 0.1, 8], zoneId: 'b07-z3' },
      ],
    },
  },
];

export const baseMap = Object.fromEntries(
  bases.map(b => [b.id, b])
) as Record<string, MilitaryBase>;
