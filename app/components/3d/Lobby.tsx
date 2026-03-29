// app/components/3d/Lobby.tsx
'use client'

import React from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { Collection } from '@/app/lib/types'

interface LobbyProps {
  onCollectionSelect: (collection: Collection) => void
}

// Mock collections for 3D doors
const COLLECTION_DOORS = [
  {
    id: '1',
    name: 'Ethereal Metamorphosis',
    description: 'A journey through transformation and silence.',
    slug: 'ethereal',
    order: 1,
    position: [-4, 0, 0] as [number, number, number],
    color: '#D4C4B0',
  },
  {
    id: '2',
    name: 'Threads of Time',
    description: 'Where past whispers to future in fabric.',
    slug: 'threads',
    order: 2,
    position: [0, 0, 0] as [number, number, number],
    color: '#C8B89A',
  },
  {
    id: '3',
    name: 'Nocturne',
    description: 'The elegance of darkness, the poetry of night.',
    slug: 'nocturne',
    order: 3,
    position: [4, 0, 0] as [number, number, number],
    color: '#B8A890',
  },
]

function Door({
  name,
  position,
  color,
  onClick,
}: {
  name: string
  position: [number, number, number]
  color: string
  onClick: () => void
}) {
  const groupRef = React.useRef<THREE.Group>(null)
  const [hovered, setHovered] = React.useState(false)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y += (hovered ? 0.05 : 0) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Door frame */}
      <mesh
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
      >
        <planeGeometry args={[2.5, 3.5]} />
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.8}
          emissive={hovered ? '#E2D5C5' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Door handle accent */}
      <mesh position={[0.8, 0.3, 0.1]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#8B8680"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Door label */}
      <Text
        position={[0, 1.4, 0.2]}
        fontSize={0.35}
        color="#1A1A18"
        anchorX="center"
        anchorY="top"
        maxWidth={2}
      >
        {name}
      </Text>
    </group>
  )
}

export default function Lobby({ onCollectionSelect }: LobbyProps) {
  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#F8F7F4" />
      </mesh>

      {/* Back wall */}
      <mesh receiveShadow position={[0, 0, -5]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#F0EFE9" />
      </mesh>

      {/* Left wall */}
      <mesh receiveShadow position={[-6, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#F0EFE9" />
      </mesh>

      {/* Right wall */}
      <mesh receiveShadow position={[6, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#F0EFE9" />
      </mesh>

      {/* Doors */}
      {COLLECTION_DOORS.map((door) => (
        <Door
          key={door.id}
          name={door.name}
          position={door.position}
          color={door.color}
          onClick={() => onCollectionSelect(door as Collection)}
        />
      ))}

      {/* Ceiling accent light */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[8, 8, 0.1, 32]} />
        <meshStandardMaterial color="#E2E0DA" emissive="#E2E0DA" emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}
