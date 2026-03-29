// app/components/UI/LookDetail.tsx
'use client'

import React from 'react'
import { X } from 'lucide-react'
import type { Look } from '@/app/lib/types'

interface LookDetailProps {
  look: Look | null
  onClose: () => void
  onShare: () => void
}

export default function LookDetail({ look, onClose, onShare }: LookDetailProps) {
  if (!look) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-bg rounded border-2 border-border max-w-2xl w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-border sticky top-0 bg-bg">
          <h2 className="text-3xl font-bold text-text">{look.name}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Image placeholder */}
          <div className="aspect-[3/4] bg-gradient-to-br from-bg to-border rounded mb-8 flex items-center justify-center text-6xl">
            👗
          </div>

          {/* Materials */}
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-widest text-text-muted mb-3 font-semibold">
              Materials
            </h3>
            <p className="text-base text-text leading-relaxed">{look.materials}</p>
          </div>

          {/* Inspiration */}
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-widest text-text-muted mb-3 font-semibold">
              The Story
            </h3>
            <p className="text-lg italic text-text leading-relaxed font-light">
              "{look.inspiration}"
            </p>
          </div>

          {/* Contact */}
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-text-muted">
              Inspired by this piece? Reach out to Trinh on{' '}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-text font-medium"
              >
                Instagram
              </a>
              {' '}or via email.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-8 border-t border-border bg-gradient-to-r from-bg to-white">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 border-2 border-border text-text rounded hover:border-accent transition-colors font-semibold"
          >
            Back to Gallery
          </button>
          <button
            onClick={onShare}
            className="flex-1 py-3 px-6 bg-accent text-white rounded hover:bg-opacity-90 transition-colors font-semibold"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
