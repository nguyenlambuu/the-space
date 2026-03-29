// app/components/3d/CollectionRoom.tsx
'use client'

import React, { Suspense } from 'react'
import { Text, useTexture } from '@react-three/drei'
import type { Collection, Look } from '@/app/lib/types'

interface CollectionRoomProps {
  collection: Collection
  looks: Look[]
  onLookSelect: (look: Look) => void
  onBackToLobby: () => void
}

// Loads and displays a real image texture. Suspends while loading.
function TexturedImage({ url, hovered }: { url: string; hovered: boolean }) {
  const texture = useTexture(url)
  return (
    <meshStandardMaterial
      map={texture}
      emissive={hovered ? '#3A3530' : '#000000'}
      emissiveIntensity={hovered ? 0.25 : 0}
    />
  )
}

// Error boundary to catch failed texture loads
class TextureErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackColor: string },
  { error: boolean }
> {
  constructor(props: { children: React.ReactNode; fallbackColor: string }) {
    super(props)
    this.state = { error: false }
  }
  static getDerivedStateFromError() {
    return { error: true }
  }
  render() {
    if (this.state.error) {
      return <meshStandardMaterial color={this.props.fallbackColor} />
    }
    return this.props.children
  }
}

function LookPanel({
  look,
  position,
  rotation,
  onClick,
}: {
  look: Look
  position: [number, number, number]
  rotation: [number, number, number]
  onClick: () => void
}) {
  const [hovered, setHovered] = React.useState(false)

  React.useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'default'
    return () => { document.body.style.cursor = 'default' }
  }, [hovered])

  return (
    <group position={position} rotation={rotation}>
      {/* White mat frame */}
      <mesh>
        <planeGeometry args={[1.76, 2.26]} />
        <meshStandardMaterial color="#F2F0EA" />
      </mesh>

      {/* Image panel */}
      <mesh
        position={[0, 0, 0.01]}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <planeGeometry args={[1.5, 2.0]} />
        {look.image_url ? (
          <TextureErrorBoundary fallbackColor="#D8D4CE">
            <Suspense fallback={<meshStandardMaterial color="#D8D4CE" />}>
              <TexturedImage url={look.image_url} hovered={hovered} />
            </Suspense>
          </TextureErrorBoundary>
        ) : (
          <meshStandardMaterial
            color="#D8D4CE"
            emissive={hovered ? '#3A3530' : '#000000'}
            emissiveIntensity={hovered ? 0.2 : 0}
          />
        )}
      </mesh>

      {/* Look name label */}
      <Text
        position={[0, -1.25, 0.02]}
        fontSize={0.13}
        color="#3A3530"
        anchorX="center"
        maxWidth={1.7}
      >
        {look.name}
      </Text>
    </group>
  )
}

// Distribute looks across front wall (up to 8), right wall (up to 6), left wall (rest)
function getWallLayout(index: number): {
  position: [number, number, number]
  rotation: [number, number, number]
} {
  const V = 2.4   // vertical spacing
  const Y1 = 3.2  // top row
  const Y2 = Y1 - V  // bottom row

  // Front wall: 4 columns × 2 rows = 8 slots (indices 0–7)
  if (index < 8) {
    const col = index % 4
    const row = Math.floor(index / 4)
    const xs = [-3.75, -1.25, 1.25, 3.75]
    return {
      position: [xs[col], row === 0 ? Y1 : Y2, -5.85],
      rotation: [0, 0, 0],
    }
  }

  // Right wall: 3 columns × 2 rows = 6 slots (indices 8–13)
  const ri = index - 8
  if (ri < 6) {
    const col = ri % 3
    const row = Math.floor(ri / 3)
    const zs = [-2.5, 0, 2.5]
    return {
      position: [5.85, row === 0 ? Y1 : Y2, zs[col]],
      rotation: [0, -Math.PI / 2, 0],
    }
  }

  // Left wall: 3 columns × 2 rows = 6 slots (indices 14–19)
  const li = index - 14
  const col = li % 3
  const row = Math.floor(li / 3)
  const zs = [-2.5, 0, 2.5]
  return {
    position: [-5.85, row === 0 ? Y1 : Y2, zs[col]],
    rotation: [0, Math.PI / 2, 0],
  }
}

export default function CollectionRoom({
  collection,
  looks,
  onLookSelect,
}: CollectionRoomProps) {
  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#EAE9E4" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#F5F4F0" />
      </mesh>

      {/* Front wall */}
      <mesh receiveShadow position={[0, 2.5, -6]}>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#EEECE6" roughness={0.95} />
      </mesh>

      {/* Right wall */}
      <mesh receiveShadow rotation={[0, -Math.PI / 2, 0]} position={[6, 2.5, 0]}>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#EDEAE4" roughness={0.95} />
      </mesh>

      {/* Left wall */}
      <mesh receiveShadow rotation={[0, Math.PI / 2, 0]} position={[-6, 2.5, 0]}>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#EDEAE4" roughness={0.95} />
      </mesh>

      {/* Back wall */}
      <mesh receiveShadow rotation={[0, Math.PI, 0]} position={[0, 2.5, 6]}>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#EDEAE4" roughness={0.95} />
      </mesh>

      {/* Ceiling gallery lights */}
      <pointLight position={[-3, 4.8, -3]} intensity={0.8} color="#FFF8EE" distance={8} />
      <pointLight position={[3, 4.8, -3]} intensity={0.8} color="#FFF8EE" distance={8} />
      <pointLight position={[0, 4.8, 2]} intensity={0.6} color="#FFF8EE" distance={8} />

      {/* Collection title on front wall */}
      <Text
        position={[0, 4.55, -5.8]}
        fontSize={0.32}
        color="#2A2820"
        anchorX="center"
        letterSpacing={0.05}
      >
        {collection.name}
      </Text>

      {/* Looks */}
      {looks.map((look, index) => {
        const layout = getWallLayout(index)
        return (
          <LookPanel
            key={look.id}
            look={look}
            position={layout.position}
            rotation={layout.rotation}
            onClick={() => onLookSelect(look)}
          />
        )
      })}
    </group>
  )
}
