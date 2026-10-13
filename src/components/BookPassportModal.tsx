import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Repeat,
  MapPin,
  UserCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useBookLoop } from '../context/BookLoopContext';
import { Book } from '../types';

export const BookPassportModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedBook,
    verifyHandover,
    locations,
  } = useBookLoop();

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showHandoverForm, setShowHandoverForm] = useState(false);
  const [recipientName, setRecipientName] = useState('Priya Patel');
  const [recipientDept, setRecipientDept] = useState('Mechanical Engineering');
  const [selectedLocationId, setSelectedLocationId] = useState(
    selectedBook?.exchangeLocationId || 'loc-2'
  );
  const [handoverSuccess, setHandoverSuccess] = useState(false);

  useEffect(() => {
    if (selectedBook) {
      // Generate clean QR code data URL representing book passport
      const passportUrl = `https://bookloop.campus/passport/${selectedBook.qrCode}`;
      QRCode.toDataURL(passportUrl, {
        width: 220,
        margin: 2,
        color: {
          dark: '#1E1B4B',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [selectedBook]);

  if (activeModal !== 'passport' || !selectedBook) return null;

  const handleCompleteHandover = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyHandover(
      selectedBook.id,
      recipientName,
      recipientDept,
      selectedLocationId
    );
    if (success) {
      setHandoverSuccess(true);
      setTimeout(() => {
        setHandoverSuccess(false);
        setShowHandoverForm(false);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Official Book Passport & Lineage
              </h3>
              <p className="text-[11px] text-slate-500">
                Unique Physical Tracking Code: {selectedBook.qrCode}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Top Passport Card with QR & Metadata */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row items-center gap-6 shadow-md">
            {/* Real QR Matrix */}
            <div className="p-2 bg-white rounded-xl shrink-0 shadow-sm">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR for ${selectedBook.title}`}
                  className="w-32 h-32 md:w-36 md:h-36 rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Passport Identity */}
            <div className="space-y-2 text-center md:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {selectedBook.courseCode} · {selectedBook.edition}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  Circulating Asset
                </span>
              </div>

              <h4 className="text-base font-bold text-white leading-snug">
                {selectedBook.title}
              </h4>
              <p className="text-xs text-slate-300">
                Author: {selectedBook.author}
              </p>

              <div className="pt-2 flex items-center justify-center md:justify-start gap-4 text-xs font-mono-numbers text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Repeat className="w-4 h-4" />
                  <span>Reused {selectedBook.totalLoops} times</span>
                </span>
                <span>·</span>
                <span>Condition: {selectedBook.condition}</span>
              </div>
            </div>
          </div>

          {/* Privacy & Handover Principles Note */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">
                Privacy Protection Enabled:
              </span>{' '}
              Student personal phone numbers, grades, and private notes are redacted from the public passport. Only verified academic milestones appear.
            </div>
          </div>

          {/* Circulation History / Milestones Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Circulation Journey ({selectedBook.milestones.length} Milestones)
            </h4>

            <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {selectedBook.milestones.map((m, idx) => (
                <div key={m.id || idx} className="relative text-xs space-y-1">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="font-semibold text-slate-800">
                      {m.holderName}
                    </span>
                    <span className="font-mono-numbers">{m.date}</span>
                  </div>
                  <div className="text-slate-600 flex items-center gap-2">
                    <span className="text-indigo-600 font-medium capitalize">
                      {m.type}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{m.handoverPoint}</span>
                    </span>
                  </div>
                  {m.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{m.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Record Handover Action (Live Interactive Simulation for Faculty) */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            {!showHandoverForm ? (
              <div className="flex items-center justify-between p-4 bg-indigo-50/60 rounded-xl border border-indigo-200">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    Live Handover Demonstration
                  </h5>
                  <p className="text-[11px] text-slate-600">
                    Simulate a physical QR scan & verified exchange between students at an approved kiosk.
                  </p>
                </div>
                <button
                  onClick={() => setShowHandoverForm(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
                >
                  Record Handover
                </button>
              </div>
            ) : (
              <form onSubmit={handleCompleteHandover} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span>Verify Dual QR Handshake</span>
                  </h5>
                  <button
                    type="button"
                    onClick={() => setShowHandoverForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Recipient Student Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={recipientDept}
                      onChange={(e) => setRecipientDept(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Verified Drop Location
                  </label>
                  <select
                    value={selectedLocationId}
                    onChange={(e) => setSelectedLocationId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.area})
                      </option>
                    ))}
                  </select>
                </div>

                {handoverSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Handover verified! +50 LoopPoints awarded to user account.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={handoverSuccess}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Confirm Physical Handover & Loop Increment
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
