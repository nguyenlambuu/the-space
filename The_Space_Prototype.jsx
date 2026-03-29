import React, { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';

export default function TheSpacePrototype() {
  const [currentView, setCurrentView] = useState('lobby');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedLook, setSelectedLook] = useState(null);

  const collections = [
    {
      id: 1,
      name: 'Ethereal Metamorphosis',
      description: 'A journey through transformation and silence.',
      looks: 28
    },
    {
      id: 2,
      name: 'Threads of Time',
      description: 'Where past whispers to future in fabric.',
      looks: 32
    },
    {
      id: 3,
      name: 'Nocturne',
      description: 'The elegance of darkness, the poetry of night.',
      looks: 25
    }
  ];

  const mockLooks = [
    {
      id: 1,
      name: 'Soliloquy',
      materials: 'Silk charmeuse, organza, hand-stitched lace',
      inspiration: 'In the stillness of midnight, a soul speaks to itself through fabric. Each fold is a confession, each stitch a heartbeat.'
    },
    {
      id: 2,
      name: 'Reverie',
      materials: 'Linen, natural indigo, bone beads',
      inspiration: 'Inspired by the wanderings of the mind when it escapes the bounds of reason.'
    },
    {
      id: 3,
      name: 'Tempest',
      materials: 'Wool, silk, hand-dyed with madder root',
      inspiration: 'The violent beauty of storms, the raw power of nature untempered.'
    }
  ];

  const openCollection = (collection) => {
    setSelectedCollection(collection);
    setCurrentView('collection');
  };

  const openLookDetail = (look) => {
    setSelectedLook(look);
    setCurrentView('detail');
  };

  const backToLobby = () => {
    setCurrentView('lobby');
    setSelectedCollection(null);
    setSelectedLook(null);
  };

  const backToCollection = () => {
    setCurrentView('collection');
    setSelectedLook(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-[#F0EFE9] text-[#1A1A18] font-serif">
      {/* LOBBY VIEW */}
      {currentView === 'lobby' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-20">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                The Space
              </h1>
              <p className="text-xl text-[#6B6B67] font-light italic">
                Enter the museum. Choose thy chamber.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => openCollection(collection)}
                  className="group relative overflow-hidden bg-white border-2 border-[#E2E0DA] rounded p-8 hover:border-[#C8B89A] transition-all duration-300 hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F8F7F4] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 opacity-60 group-hover:opacity-100 transition-opacity">🚪</div>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-[#C8B89A] transition-colors">
                      {collection.name}
                    </h2>
                    <p className="text-[#6B6B67] mb-4 text-sm italic">
                      {collection.description}
                    </p>
                    <p className="text-xs text-[#6B6B67] opacity-75">
                      {collection.looks} looks
                    </p>
                  </div>

                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#C8B89A]">
                    →
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center mt-16 text-[#6B6B67] text-sm italic">
              Click a door to enter that collection
            </div>
          </div>
        </div>
      )}

      {/* COLLECTION VIEW */}
      {currentView === 'collection' && (
        <div className="min-h-screen p-6 md:p-12">
          <div className="max-w-6xl mx-auto mb-12">
            <button
              onClick={backToLobby}
              className="flex items-center gap-2 text-[#C8B89A] hover:text-[#1A1A18] transition-colors mb-8"
            >
              <ChevronLeft size={20} />
              Return to Lobby
            </button>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {selectedCollection?.name}
            </h1>
            <p className="text-lg text-[#6B6B67] italic max-w-2xl">
              {selectedCollection?.description}
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {mockLooks.map((look, idx) => (
              <button
                key={idx}
                onClick={() => openLookDetail(look)}
                className="group relative aspect-[3/4] bg-gradient-to-br from-[#E2E0DA] to-[#D5D3CC] rounded border border-[#E2E0DA] overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="w-full h-full flex items-center justify-center text-4xl opacity-30 group-hover:opacity-50 transition-opacity">
                  👗
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A18] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white">
                    <p className="font-bold text-sm">{look.name}</p>
                    <p className="text-xs opacity-75">{look.materials.split(',')[0]}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="max-w-6xl mx-auto text-center mt-12 text-[#6B6B67] text-sm italic">
            Click any garment to reveal its story
          </div>
        </div>
      )}

      {/* DETAIL POPUP */}
      {currentView === 'detail' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded border-2 border-[#E2E0DA] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-8 border-b border-[#E2E0DA]">
              <h2 className="text-3xl font-bold">{selectedLook?.name}</h2>
              <button
                onClick={backToCollection}
                className="text-[#6B6B67] hover:text-[#1A1A18] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="aspect-[3/4] bg-gradient-to-br from-[#F8F7F4] to-[#E2E0DA] rounded mb-8 flex items-center justify-center text-6xl">
                👗
              </div>

              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-widest text-[#6B6B67] mb-2">Materials</h3>
                <p className="text-base text-[#1A1A18]">
                  {selectedLook?.materials}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-widest text-[#6B6B67] mb-2">The Story</h3>
                <p className="text-lg italic text-[#1A1A18] leading-relaxed font-light">
                  "{selectedLook?.inspiration}"
                </p>
              </div>

              <div className="pt-6 border-t border-[#E2E0DA]">
                <p className="text-sm text-[#6B6B67]">
                  Interested in this piece? Reach out to Trinh on Instagram or via email.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-8 border-t border-[#E2E0DA] bg-[#F8F7F4]">
              <button
                onClick={backToCollection}
                className="flex-1 py-3 px-6 border-2 border-[#E2E0DA] text-[#1A1A18] rounded hover:border-[#C8B89A] transition-colors font-semibold"
              >
                Back to Gallery
              </button>
              <button
                className="flex-1 py-3 px-6 bg-[#C8B89A] text-white rounded hover:bg-[#B39F87] transition-colors font-semibold"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
