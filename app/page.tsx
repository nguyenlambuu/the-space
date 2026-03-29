// app/page.tsx
'use client'

import React, { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Navigation from './components/UI/Navigation'
import LookDetail from './components/UI/LookDetail'
import LoadingScreen from './components/UI/LoadingScreen'
import { getCollections, getLooksByCollection } from './lib/supabase'
import type { Collection, Look, ViewState } from './lib/types'

// Dynamically import Scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import('./components/Scene'), {
  ssr: false,
  loading: () => <LoadingScreen />,
})

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>('lobby')
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [looks, setLooks] = useState<Look[]>([])
  const [selectedLook, setSelectedLook] = useState<Look | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch collections on mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections()
        setCollections(data)
      } catch (error) {
        console.error('Failed to fetch collections:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  // Fetch looks when collection is selected
  useEffect(() => {
    if (selectedCollection) {
      const fetchLooks = async () => {
        const data = await getLooksByCollection(selectedCollection.id)
        setLooks(data)
      }
      fetchLooks()
    }
  }, [selectedCollection])

  const handleCollectionSelect = (collection: Collection) => {
    setSelectedCollection(collection)
    setCurrentView('collection')
  }

  const handleLookSelect = (look: Look) => {
    setSelectedLook(look)
    setCurrentView('detail')
  }

  const handleBackToLobby = () => {
    setCurrentView('lobby')
    setSelectedCollection(null)
    setLooks([])
    setSelectedLook(null)
  }

  const handleBackToCollection = () => {
    setCurrentView('collection')
    setSelectedLook(null)
  }

  const handleShare = () => {
    if (navigator.share && selectedLook) {
      navigator.share({
        title: `${selectedLook.name} by Trinh Chau`,
        text: selectedLook.inspiration,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      const shareText = `Check out "${selectedLook?.name}" from The Space Project by Trinh Chau`
      navigator.clipboard.writeText(shareText)
      alert('Link copied to clipboard!')
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <main className="w-full h-screen overflow-hidden bg-bg-dark">
      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Suspense fallback={<LoadingScreen />}>
          <Scene
            currentView={currentView}
            collections={collections}
            selectedCollection={selectedCollection}
            looks={looks}
            onCollectionSelect={handleCollectionSelect}
            onLookSelect={handleLookSelect}
            onBackToLobby={handleBackToLobby}
          />
        </Suspense>
      </div>

      {/* UI Overlays */}
      <Navigation
        currentView={currentView}
        selectedCollection={selectedCollection}
        onBackToLobby={handleBackToLobby}
      />

      {currentView === 'detail' && (
        <LookDetail
          look={selectedLook}
          onClose={handleBackToCollection}
          onShare={handleShare}
        />
      )}

      {/* Mobile hint */}
      {currentView === 'lobby' && (
        <div className="fixed bottom-8 left-8 right-8 md:right-auto text-center md:text-left text-text-muted text-xs italic">
          <p>Drag to rotate • Scroll to zoom • Click a door to enter</p>
        </div>
      )}
    </main>
  )
}
