import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useAppStore } from '../../stores/appStore';
import type { MilitaryBase } from '../../types';
import * as THREE from 'three';

interface BaseModelProps {
  base: MilitaryBase;
}

function ConflPoint({ position, color }: { position: [number, number, number]; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
      ringRef.current.scale.set(scale, scale, 1);
      (ringRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.5 - Math.sin(clock.getElapsedTime() * 2) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Base cylinder */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.6, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Pulsing ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Point light */}
      <pointLight position={[0, 1, 0]} intensity={0.5} color={color} distance={5} />
      {/* Label */}
      <Html position={[0, 1.2, 0]} center>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: '#00e5ff',
            background: 'rgba(0,0,0,0.7)',
            padding: '2px 6px',
            borderRadius: 2,
            whiteSpace: 'nowrap',
            border: '1px solid rgba(0,229,255,0.3)',
          }}
        >
          CONFLUENCE
        </div>
      </Html>
    </group>
  );
}

export default function BaseModel({ base }: BaseModelProps) {
  const selectZone = useAppStore((s) => s.selectZone);
  const selectedZoneId = useAppStore((s) => s.selectedZoneId);
  const { layout } = base;

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[layout.grounds.width, layout.grounds.depth]} />
        <meshStandardMaterial color="#0d0d15" />
      </mesh>

      {/* Zone areas */}
      {layout.zones.map((zone) => {
        const isSelected = selectedZoneId === zone.id;
        return (
          <group key={zone.id}>
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[zone.area.x + zone.area.width / 2, 0.02, zone.area.z + zone.area.depth / 2]}
              onClick={(e) => { e.stopPropagation(); selectZone(zone.id); }}
            >
              <planeGeometry args={[zone.area.width, zone.area.depth]} />
              <meshStandardMaterial
                color={zone.color}
                transparent
                opacity={isSelected ? 0.15 : 0.06}
              />
            </mesh>
            {/* Zone border */}
            <lineSegments position={[zone.area.x + zone.area.width / 2, 0.03, zone.area.z + zone.area.depth / 2]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(zone.area.width, zone.area.depth)]} />
              <lineBasicMaterial color={zone.color} transparent opacity={isSelected ? 0.6 : 0.2} />
            </lineSegments>
          </group>
        );
      })}

      {/* Buildings */}
      {layout.buildings.map((building, i) => {
        const zone = layout.zones.find(z => z.id === building.zoneId);
        const color = zone?.color || '#444';
        const isZoneSelected = selectedZoneId === building.zoneId;

        return (
          <group key={i} position={building.position}>
            <mesh
              castShadow
              receiveShadow
              onClick={(e) => { e.stopPropagation(); selectZone(building.zoneId); }}
            >
              <boxGeometry args={building.size} />
              <meshStandardMaterial
                color={color}
                transparent
                opacity={isZoneSelected ? 0.85 : 0.5}
                emissive={color}
                emissiveIntensity={isZoneSelected ? 0.15 : 0.05}
              />
            </mesh>
            {/* Building edges */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(...building.size)]} />
              <lineBasicMaterial color={color} transparent opacity={isZoneSelected ? 0.8 : 0.3} />
            </lineSegments>
            {/* Label */}
            <Html position={[0, building.size[1] / 2 + 0.5, 0]} center>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  color: 'var(--text-secondary)',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '1px 4px',
                  borderRadius: 1,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                {building.label}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Confluence points */}
      {layout.confluencePoints.map((cp, i) => {
        const zone = layout.zones.find(z => z.id === cp.zoneId);
        return (
          <ConflPoint key={i} position={cp.position} color={zone?.color || '#00e5ff'} />
        );
      })}
    </group>
  );
}
