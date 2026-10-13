import React from 'react';
import { useBookLoop } from '../context/BookLoopContext';
import { CheckCircle2, ChevronRight, RotateCcw, Sparkles, AlertCircle } from 'lucide-react';

export const LiveScenarioWalkthrough: React.FC = () => {
  const { liveDemoStep, nextLiveDemoStep, resetLiveDemo } = useBookLoop();

  if (liveDemoStep === 0) return null;

  const steps = [
    {
      num: 1,
      title: 'The Real Problem',
      problem: 'College students spend ₹4,000–₹8,000 every semester buying single-use textbooks that sit abandoned after final exams.',
      action: 'Click "Next" to run Smart Book Match for Engineering Mathematics.',
    },
    {
      num: 2,
      title: 'The Smart Discovery',
      problem: 'Instead of searching hundreds of irrelevant listings, Smart Match aligns the syllabus, detects verified copies, and explains why they match.',
      action: 'Review the match rationale and proceed to book request.',
    },
    {
      num: 3,
      title: 'The Trusted Transaction',
      problem: 'Students choose a secure campus collection point (like Central Library Desk or Engineering Kiosk) without revealing private home addresses.',
      action: 'Confirm the reservation and view the Book Passport.',
    },
    {
      num: 4,
      title: 'The QR Handover & Passport',
      problem: 'Physical books carry a unique QR Passport showing complete circulation lineage across semesters, without exposing personal identities.',
      action: 'Simulate the live handover scan to record the circular loop.',
    },
    {
      num: 5,
      title: 'The Verified Community Impact',
      problem: 'The Knowledge Impact Dashboard calculates actual circulations, unique students empowered, and circularity metrics for CEP reporting.',
      action: 'Faculty presentation scenario complete! Reset or explore freely.',
    },
  ];

  const current = steps[liveDemoStep - 1];

  return (
    <div className="bg-slate-900 text-white border-b border-indigo-500/30 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
            {current.num}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                Faculty Live Demo · Step {current.num} of 5
              </span>
              <span className="text-slate-400">·</span>
              <h4 className="text-sm font-semibold text-white">{current.title}</h4>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              {current.problem} <span className="text-indigo-300 font-medium">{current.action}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            onClick={resetLiveDemo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white rounded border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Story</span>
          </button>
          <button
            onClick={nextLiveDemoStep}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 rounded shadow-sm transition-colors cursor-pointer"
          >
            <span>{liveDemoStep === 5 ? 'Finish Presentation' : 'Continue Step ' + (liveDemoStep + 1)}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
