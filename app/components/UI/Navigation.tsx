// app/components/UI/Navigation.tsx
'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
import type { ViewState, Collection } from '@/app/lib/types'

interface NavigationProps {
  currentView: ViewState
  selectedCollection: Collection | null
  onBackToLobby: () => void
}

export default function Navigation({
  currentView,
  selectedCollection,
  onBackToLobby,
}: NavigationProps) {
  if (currentView === 'lobby') {
    return (
      <div className="fixed top-8 left-8 z-20">
        <h1 className="text-4xl md:text-5xl font-bold text-text">The Space</h1>
        <p className="text-text-muted italic text-sm mt-2">Enter the museum. Choose thy chamber.</p>
      </div>
    )
  }

  return (
    <div className="fixed top-8 left-8 z-20">
      <button
        onClick={onBackToLobby}
        className="flex items-center gap-2 text-accent hover:text-text transition-colors mb-8 font-medium"
      >
        <ChevronLeft size={20} />
        Return to Lobby
      </button>

      {selectedCollection && (
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text">{selectedCollection.name}</h1>
          <p className="text-text-muted italic text-sm mt-2 max-w-md">{selectedCollection.description}</p>
        </div>
      )}
    </div>
  )
}
