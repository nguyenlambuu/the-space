// app/components/Scene.tsx
'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { Collection, Look, ViewState } from '@/app/lib/types'
import Lobby from './3d/Lobby'
import CollectionRoom from './3d/CollectionRoom'

interface SceneProps {
  currentView: ViewState
  collections: Collection[]
  selectedCollection: Collection | null
  looks: Look[]
  onCollectionSelect: (collection: Collection) => void
  onLookSelect: (look: Look) => void
  onBackToLobby: () => void
}

export default function Scene({
  currentView,
  collections,
  selectedCollection,
  looks,
  onCollectionSelect,
  onLookSelect,
  onBackToLobby,
}: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 9], fov: 50 }}
      className="w-full h-full"
      dpr={[1, 1.5]}
      shadows
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.0} castShadow />
        <pointLight position={[-5, 4, -5]} intensity={0.4} />
        <pointLight position={[5, 4, 5]} intensity={0.3} />

        <OrbitControls
          target={[0, 1.6, 0]}
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={12}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate={false}
        />

        {currentView === 'lobby' && (
          <Lobby collections={collections} onCollectionSelect={onCollectionSelect} />
        )}

        {currentView === 'collection' && selectedCollection && (
          <CollectionRoom
            collection={selectedCollection}
            looks={looks}
            onLookSelect={onLookSelect}
            onBackToLobby={onBackToLobby}
          />
        )}
      </Suspense>
    </Canvas>
  )
}
