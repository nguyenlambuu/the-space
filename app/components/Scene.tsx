// app/components/Scene.tsx
'use client'

import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import type { Collection, Look, ViewState } from '@/app/lib/types'
import Lobby from './3d/Lobby'
import CollectionRoom from './3d/CollectionRoom'

interface SceneProps {
  currentView: ViewState
  selectedCollection: Collection | null
  looks: Look[]
  onCollectionSelect: (collection: Collection) => void
  onLookSelect: (look: Look) => void
  onBackToLobby: () => void
}

export default function Scene({
  currentView,
  selectedCollection,
  looks,
  onCollectionSelect,
  onLookSelect,
  onBackToLobby,
}: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 8], fov: 50 }}
      className="w-full h-full"
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 1.6, 8]} fov={50} />
        <OrbitControls
          autoRotate={currentView === 'lobby'}
          autoRotateSpeed={1}
          enableZoom={true}
          enablePan={true}
          minDistance={5}
          maxDistance={15}
        />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, 10, -10]} intensity={0.4} />

        {/* Environment */}
        <Environment preset="studio" />

        {/* Scenes */}
        {currentView === 'lobby' && <Lobby onCollectionSelect={onCollectionSelect} />}

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
