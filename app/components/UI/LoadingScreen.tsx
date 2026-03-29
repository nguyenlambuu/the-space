// app/components/UI/LoadingScreen.tsx
'use client'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-bg z-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">The Space</h1>
        <p className="text-text-muted italic mb-8">Opening the museum...</p>
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}
