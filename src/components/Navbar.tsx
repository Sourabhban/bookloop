import React from 'react';
import { BookOpen, Camera, Award, Sparkles, Play, ShieldAlert } from 'lucide-react';
import { useBookLoop } from '../context/BookLoopContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setActiveModal,
    user,
    liveDemoStep,
    nextLiveDemoStep,
  } = useBookLoop();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left text-slate-900 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
                BookLoop <span className="text-indigo-600 font-semibold text-sm">2.0</span>
              </span>
            </div>
          </button>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-indigo-600 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Book Shelf
            </button>
            <button
              onClick={() => setActiveTab('explore-map')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'explore-map'
                  ? 'text-indigo-600 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Exchange Map & Points
            </button>
            <button
              onClick={() => setActiveTab('looppoints')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'looppoints'
                  ? 'text-indigo-600 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>LoopPoints & Rewards</span>
              <span className="font-mono-numbers text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                {user.points} pts
              </span>
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'impact'
                  ? 'text-indigo-600 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              CEP Impact Report
            </button>
          </nav>

          {/* Zone 3: 1 primary action + Presentation Mode Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={nextLiveDemoStep}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                liveDemoStep > 0
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Step-by-step presentation scenario for college judges & faculty"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{liveDemoStep > 0 ? `Demo Step ${liveDemoStep}/5` : 'Live Faculty Demo'}</span>
            </button>

            <button
              onClick={() => setActiveModal('scanner')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>AI Book Scanner</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
