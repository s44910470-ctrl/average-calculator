'use client';

import { Canvas } from '@react-three/fiber';

function FloatingOrb() {
  return (
    <mesh>
      <sphereGeometry args={[1.4, 32, 32]} />
      <meshStandardMaterial emissive="#00e5ff" color="#09152d" />
    </mesh>
  );
}

export function MarketScene() {
  return (
    <div className="absolute inset-0 opacity-50 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 4]} intensity={2} />
        <FloatingOrb />
      </Canvas>
    </div>
  );
}
