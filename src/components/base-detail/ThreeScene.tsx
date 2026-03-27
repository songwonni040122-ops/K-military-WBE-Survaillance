import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import BaseModel from './BaseModel';
import type { MilitaryBase } from '../../types';

interface ThreeSceneProps {
  base: MilitaryBase;
}

export default function ThreeScene({ base }: ThreeSceneProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#070710' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[20, 18, 20]} fov={45} />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={10}
          maxDistance={50}
        />

        <ambientLight intensity={0.15} />
        <directionalLight position={[10, 15, 10]} intensity={0.6} color="#d0e0ff" castShadow />
        <pointLight position={[0, 8, 0]} intensity={0.3} color="#00e5ff" />

        <BaseModel base={base} />

        {/* Ground grid */}
        <gridHelper
          args={[60, 60, '#1a1a2e', '#0d0d15']}
          position={[0, -0.01, 0]}
        />
      </Canvas>
    </div>
  );
}
