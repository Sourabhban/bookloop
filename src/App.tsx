import React from 'react';
import { BookLoopProvider, useBookLoop } from './context/BookLoopContext';
import { Navbar } from './components/Navbar';
import { LiveScenarioWalkthrough } from './components/LiveScenarioWalkthrough';
import { DashboardView } from './components/DashboardView';
import { ExchangeMapView } from './components/ExchangeMapView';
import { LoopPointsView } from './components/LoopPointsView';
import { ImpactDashboardView } from './components/ImpactDashboardView';
import { SmartBookMatchModal } from './components/SmartBookMatchModal';
import { BookPassportModal } from './components/BookPassportModal';
import { AIBookScannerModal } from './components/AIBookScannerModal';
import { NeedBasedAccessModal } from './components/NeedBasedAccessModal';
import { BookDetailModal } from './components/BookDetailModal';
import { ShieldCheck, BookOpen } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useBookLoop();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800">
      {/* Top Navbar */}
      <Navbar />

      {/* Live Faculty Demo Storyline Walkthrough Banner */}
      <LiveScenarioWalkthrough />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'explore-map' && <ExchangeMapView />}
        {activeTab === 'looppoints' && <LoopPointsView />}
        {activeTab === 'impact' && <ImpactDashboardView />}
      </main>

      {/* Modals */}
      <SmartBookMatchModal />
      <BookPassportModal />
      <AIBookScannerModal />
      <NeedBasedAccessModal />
      <BookDetailModal />

      {/* Clean Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
              BL
            </div>
            <span className="font-semibold text-slate-800">
              BookLoop 2.0 · Smart Community Knowledge-Sharing Ecosystem
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>Community Engagement Project (CEP)</span>
            <span>·</span>
            <span>Zero-Stigma Academic Access</span>
            <span>·</span>
            <span>Verified Campus Circulation</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Lead: Anjum Sheikh & Campus Academic Council
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BookLoopProvider>
      <AppContent />
    </BookLoopProvider>
  );
}
