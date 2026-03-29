// app/components/3d/Lobby.tsx
'use client'

import React from 'react'
import { Text } from '@react-three/drei'
import type { Collection } from '@/app/lib/types'

interface LobbyProps {
  collections: Collection[]
  onCollectionSelect: (collection: Collection) => void
}

const DOOR_COLORS = ['#C8B89A', '#D4C4B0', '#B8A88A', '#D8CCC0']

function Door({
  name,
  color,
  position,
  onClick,
}: {
  name: string
  color: string
  position: [number, number, number]
  onClick: () => void
}) {
  const [hovered, setHovered] = React.useState(false)

  React.useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'default'
    return () => { document.body.style.cursor = 'default' }
  }, [hovered])

  return (
    <group position={position}>
      {/* Outer frame */}
      <mesh castShadow>
        <boxGeometry args={[2.4, 3.8, 0.12]} />
        <meshStandardMaterial color="#28271F" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Door panel */}
      <mesh
        position={[0, 0, 0.08]}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[2.04, 3.44, 0.06]} />
        <meshStandardMaterial
          color={hovered ? '#DDD0BE' : color}
          roughness={0.7}
          emissive={hovered ? '#C8B89A' : '#000000'}
          emissiveIntensity={hovered ? 0.25 : 0}
        />
      </mesh>

      {/* Door knob */}
      <mesh position={[0.68, 0, 0.18]} castShadow>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#B0A070" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Collection name above door */}
      <Text
        position={[0, 2.3, 0.2]}
        fontSize={0.26}
        color={hovered ? '#8B7355' : '#2A2820'}
        anchorX="center"
        anchorY="bottom"
        maxWidth={2.2}
      >
        {name}
      </Text>

      {/* "Enter" hint on hover */}
      {hovered && (
        <Text
          position={[0, -2.2, 0.2]}
          fontSize={0.18}
          color="#8B7355"
          anchorX="center"
        >
          Enter
        </Text>
      )}
    </group>
  )
}

export default function Lobby({ collections, onCollectionSelect }: LobbyProps) {
  const count = collections.length
  const spacing = Math.min(4.5, 9 / Math.max(count, 1))
  const totalWidth = (count - 1) * spacing

  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#EAE9E4" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.5, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#F5F4F0" />
      </mesh>

      {/* Back wall (where doors are) */}
      <mesh receiveShadow position={[0, 2.75, -8]}>
        <planeGeometry args={[18, 5.5]} />
        <meshStandardMaterial color="#EEECE6" roughness={0.95} />
      </mesh>

      {/* Left wall */}
      <mesh receiveShadow rotation={[0, Math.PI / 2, 0]} position={[-9, 2.75, 0]}>
        <planeGeometry args={[16, 5.5]} />
        <meshStandardMaterial color="#EDEAE4" roughness={0.95} />
      </mesh>

      {/* Right wall */}
      <mesh receiveShadow rotation={[0, -Math.PI / 2, 0]} position={[9, 2.75, 0]}>
        <planeGeometry args={[16, 5.5]} />
        <meshStandardMaterial color="#EDEAE4" roughness={0.95} />
      </mesh>

      {/* Floor baseboard strip */}
      <mesh position={[0, 0.06, -7.95]}>
        <boxGeometry args={[18, 0.12, 0.04]} />
        <meshStandardMaterial color="#C8C4BC" />
      </mesh>

      {/* Ceiling cove light strip */}
      <mesh position={[0, 5.48, -6]}>
        <boxGeometry args={[14, 0.04, 0.1]} />
        <meshStandardMaterial color="#F8F6F0" emissive="#F8F6F0" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[0, 5.2, -5]} intensity={1.2} color="#FFF8EE" distance={12} />

      {/* Doors — y=1.9 means bottom at 1.9 - 3.8/2 = 0 (on the floor) */}
      {collections.map((collection, i) => {
        const x = count > 1 ? -totalWidth / 2 + i * spacing : 0
        return (
          <Door
            key={collection.id}
            name={collection.name}
            color={DOOR_COLORS[i % DOOR_COLORS.length]}
            position={[x, 1.9, -7.92]}
            onClick={() => onCollectionSelect(collection)}
          />
        )
      })}
    </group>
  )
}
