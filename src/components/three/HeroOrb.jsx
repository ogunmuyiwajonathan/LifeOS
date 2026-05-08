import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function Globe() {
  const meshRef = useRef()
  const wireRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = state.clock.elapsedTime * 0.2
      wireRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.05
    }
  })

  return (
    <Float speed={1.7} rotationIntensity={0.35} floatIntensity={1.2}>
      <group>
        {/* Inner glow sphere — transparent, only emissive light shows */}
        <Sphere ref={meshRef} args={[1.45, 64, 64]}>
          <meshStandardMaterial
            color="#059669"
            emissive="#059669"
            emissiveIntensity={0.6}
            roughness={0.28}
            metalness={0.56}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </Sphere>

        {/* Wireframe outline — stays visible */}
        <Sphere ref={wireRef} args={[1.52, 48, 48]}>
          <meshBasicMaterial 
            color="#FFFFFF" 
            wireframe 
            transparent 
            opacity={0.35} 
          />
        </Sphere>

        {/* Thin inner wireframe for extra structure */}
        <Sphere args={[1.48, 32, 32]}>
          <meshBasicMaterial 
            color="#34d399" 
            wireframe 
            transparent 
            opacity={0.12} 
          />
        </Sphere>

      </group>
    </Float>
  )
}

function GlowHalo() {
  return (
    <mesh scale={3.2}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial 
        color="#059669" 
        transparent 
        opacity={0.08} 
        side={THREE.BackSide} 
      />
    </mesh>
  )
}

export default function HeroOrb() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 3, 5]} intensity={1.2} color="#FFFFFF" />
        <pointLight position={[-3, -2, -4]} intensity={1.0} color="#059669" />
        <pointLight position={[3, 2, 2]} intensity={0.8} color="#34d399" />
        <GlowHalo />
        <Globe />
      </Canvas>
    </div>
  )
}