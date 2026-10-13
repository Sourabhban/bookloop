import React, { useState } from 'react';
import {
  X,
  BookOpen,
  QrCode,
  MapPin,
  CheckCircle2,
  Heart,
  Repeat,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useBookLoop } from '../context/BookLoopContext';
import { Book } from '../types';

export const BookDetailModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedBook,
    requestBook,
    locations,
    toggleWishlist,
    user,
  } = useBookLoop();

  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    selectedBook?.exchangeLocationId || 'loc-2'
  );
  const [requestConfirmed, setRequestConfirmed] = useState(false);

  if (activeModal !== 'book-details' || !selectedBook) return null;

  const handleRequest = () => {
    requestBook(selectedBook.id, selectedLocationId);
    setRequestConfirmed(true);
    setTimeout(() => {
      setRequestConfirmed(false);
    }, 2500);
  };

  const isWishlisted = user.wishlist.includes(selectedBook.title);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {selectedBook.courseCode} · {selectedBook.edition}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono-numbers">
              {selectedBook.qrCode}
            </span>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable details */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Book Cover */}
            <div className="md:col-span-4 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
              <img
                src={selectedBook.coverImage}
                alt={selectedBook.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Book Details */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedBook.title}
                </h3>
                <button
                  onClick={() => toggleWishlist(selectedBook.title)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Authored by <strong className="text-slate-700">{selectedBook.author}</strong> · Registered on {selectedBook.registeredDate}
              </p>

              {/* Badges / Stats Bar */}
              <div className="flex items-center gap-2 text-xs flex-wrap pt-1">
                <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                  {selectedBook.condition} Condition
                </span>
                <span className="bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 font-mono-numbers">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Reused {selectedBook.totalLoops}x</span>
                </span>
                <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-200 font-mono-numbers">
                  {selectedBook.syllabusMatch}% Syllabus Match
                </span>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-600 leading-relaxed pt-2">
                {selectedBook.summary}
              </p>

              {/* Syllabus topics tags */}
              <div className="pt-2">
                <span className="text-[10px] font-semibold uppercase text-slate-500 block mb-1">
                  Key Topics Covered:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBook.keyTopics.map((topic) => (
                    <span
                      key={topic}
                      className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Donor note if available */}
              {selectedBook.donorNotes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 italic">
                  "{selectedBook.donorNotes}"
                </div>
              )}
            </div>
          </div>

          {/* Handover & Location Selection */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Preferred Handover Collection Point</span>
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">
                Privacy Guaranteed
              </span>
            </div>

            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} — {l.timings}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setActiveModal('passport')}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>View QR Passport</span>
              </button>

              <button
                onClick={handleRequest}
                disabled={requestConfirmed || selectedBook.status === 'borrowed'}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-60"
              >
                {requestConfirmed
                  ? 'Reservation Confirmed at Collection Hub!'
                  : selectedBook.status === 'requested'
                  ? 'Already Requested (Awaiting Pickup)'
                  : selectedBook.status === 'borrowed'
                  ? 'Currently in Circulation'
                  : 'Request Book for Pickup'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
