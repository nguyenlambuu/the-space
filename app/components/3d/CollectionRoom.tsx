// app/components/3d/CollectionRoom.tsx
'use client'

import React from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import type { Collection, Look } from '@/app/lib/types'

interface CollectionRoomProps {
  collection: Collection
  looks: Look[]
  onLookSelect: (look: Look) => void
  onBackToLobby: () => void
}

function WallImage({
  position,
  rotation,
  imageUrl,
  look,
  onClick,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  imageUrl: string
  look: Look
  onClick: () => void
}) {
  const meshRef = React.useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = React.useState(false)

  const handleImageLoad = (texture: THREE.Texture) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      material.map = texture
      material.needsUpdate = true
    }
  }

  // For now, use a placeholder. In production, load from imageUrl
  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
      >
        <planeGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          color={hovered ? '#D5D3CC' : '#E2E0DA'}
          metalness={0}
          roughness={0.8}
          emissive={hovered ? '#C8B89A' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Look name label */}
      <Text
        position={[0, -1.2, 0.1]}
        fontSize={0.2}
        color="#1A1A18"
        anchorX="center"
        maxWidth={1.4}
      >
        {look.name}
      </Text>
    </group>
  )
}

export default function CollectionRoom({
  collection,
  looks,
  onLookSelect,
  onBackToLobby,
}: CollectionRoomProps) {
  // Arrange looks on walls in a grid
  const getWallLayout = (index: number, total: number) => {
    const perWall = Math.ceil(total / 4)
    const wallIndex = Math.floor(index / perWall)
    const positionInWall = index % perWall

    const spacing = 2.5
    const verticalStart = 2
    const x = -3 + (positionInWall % 3) * spacing
    const y = verticalStart - Math.floor(positionInWall / 3) * spacing

    switch (wallIndex) {
      case 0: // Front wall
        return { position: [x, y, -4.5] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] }
      case 1: // Right wall
        return { position: [4.5, y, x] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] }
      case 2: // Back wall
        return { position: [x, y, 4.5] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number] }
      case 3: // Left wall
        return { position: [-4.5, y, x] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] }
      default:
        return { position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] }
    }
  }

  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#F8F7F4" />
      </mesh>

      {/* Walls */}
      <mesh receiveShadow position={[0, 0, -5]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#F0EFE9" />
      </mesh>

      <mesh receiveShadow position={[5, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#F0EFE9" />
      </mesh>

      <mesh receiveShadow position={[0, 0, 5]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#F0EFE9" />
      </mesh>

      <mesh receiveShadow position={[-5, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#F0EFE9" />
      </mesh>

      {/* Ceiling */}
      <mesh receiveShadow position={[0, 3, 0]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#F8F7F4" />
      </mesh>

      {/* Collection title */}
      <Text position={[0, 2.5, -4.4]} fontSize={0.4} color="#1A1A18" anchorX="center">
        {collection.name}
      </Text>

      {/* Looks on walls */}
      {looks.map((look, index) => {
        const layout = getWallLayout(index, looks.length)
        return (
          <WallImage
            key={look.id}
            position={layout.position}
            rotation={layout.rotation}
            imageUrl={look.image_url}
            look={look}
            onClick={() => onLookSelect(look)}
          />
        )
      })}
    </group>
  )
}
