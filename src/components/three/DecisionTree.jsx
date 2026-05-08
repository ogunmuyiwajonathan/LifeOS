import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

function Branch({ start, end, delay = 0 }) {
  const ref = useRef()
  const progress = useRef(0)

  useFrame((state) => {
    if (state.clock.elapsedTime > delay) {
      progress.current = Math.min(progress.current + 0.01, 1)
    }
    if (ref.current) {
      const currentEnd = new THREE.Vector3().lerpVectors(start, end, progress.current)
      ref.current.geometry.setFromPoints([start, currentEnd])
    }
  })

  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="#7C3AED" linewidth={2} />
    </line>
  )
}

function TreeNode({ position, label, color = '#7C3AED', delay = 0 }) {
  const ref = useRef()
  const scale = useRef(0)

  useFrame((state) => {
    if (state.clock.elapsedTime > delay) {
      scale.current = Math.min(scale.current + 0.02, 1)
    }
    if (ref.current) {
      ref.current.scale.setScalar(scale.current)
    }
  })

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function Tree() {
  const trunkStart = new THREE.Vector3(0, -2, 0)
  const trunkEnd = new THREE.Vector3(0, 0, 0)
  const leftBranch = new THREE.Vector3(-2, 1.5, 0)
  const rightBranch = new THREE.Vector3(2, 1.5, 0)
  const centerBranch = new THREE.Vector3(0, 2.5, 0)

  return (
    <group>
      <Branch start={trunkStart} end={trunkEnd} delay={0} />
      <Branch start={trunkEnd} end={leftBranch} delay={1} />
      <Branch start={trunkEnd} end={rightBranch} delay={1.2} />
      <Branch start={trunkEnd} end={centerBranch} delay={1.5} />
      
      <TreeNode position={[0, 0, 0]} delay={0.5} color="#7C3AED" />
      <TreeNode position={[-2, 1.5, 0]} delay={2} color="#10B981" />
      <TreeNode position={[2, 1.5, 0]} delay={2.2} color="#EF4444" />
      <TreeNode position={[0, 2.5, 0]} delay={2.5} color="#3B82F6" />
    </group>
  )
}

export default function DecisionTree() {
  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <Tree />
      </Canvas>
    </div>
  )
}
