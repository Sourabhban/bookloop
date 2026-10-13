import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Lock,
  UserCheck,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useBookLoop } from '../context/BookLoopContext';

export const NeedBasedAccessModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    needRequests,
    submitNeedRequest,
    approveNeedRequest,
    user,
  } = useBookLoop();

  const [activeTab, setActiveTab] = useState<'request' | 'coordinator'>('request');
  const [courseName, setCourseName] = useState('MATH-201 Engineering Mathematics');
  const [bookTitle, setBookTitle] = useState('Higher Engineering Mathematics');
  const [urgency, setUrgency] = useState<'urgent' | 'moderate'>('urgent');
  const [semester, setSemester] = useState('Semester 3');
  const [department, setDepartment] = useState('Mechanical Engineering');
  const [submitted, setSubmitted] = useState(false);

  // Coordinator decision note input
  const [coordinatorNote, setCoordinatorNote] = useState('');

  if (activeModal !== 'need-based') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitNeedRequest({
      courseName,
      bookTitle,
      urgency,
      semester,
      department,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveTab('coordinator');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Confidential Need-Based Book Access
              </h3>
              <p className="text-[11px] text-slate-500">
                Dignified, anonymized assistance supported by faculty coordinators
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

        {/* Tab switch between Student Request & Coordinator Review */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('request')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'request'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Confidential Application
          </button>
          <button
            onClick={() => setActiveTab('coordinator')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'coordinator'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Coordinator Evaluation Panel</span>
            <span className="font-mono-numbers text-[10px] bg-slate-100 px-1.5 py-0.2 rounded font-bold">
              {needRequests.length}
            </span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {activeTab === 'request' ? (
            <div className="space-y-4">
              {/* Privacy Notice */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Strict Dignity & Privacy Policy</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Your identity is protected by an anonymous voucher code (e.g. <code>STUDENT-AID-982</code>). Neither public users nor donors see financial information. Books are collected discreetly at the Central Library desk.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Required Course & Subject
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Book Title / Preferred Edition
                  </label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Enrolled Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                      <option value="Semester 3">Semester 3</option>
                      <option value="Semester 4">Semester 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Urgency
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="urgent">Urgent (Upcoming exams)</option>
                      <option value="moderate">Moderate (Standard term)</option>
                    </select>
                  </div>
                </div>

                {submitted && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Application securely filed with coordinator. Anonymized voucher created.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Submit Confidential Request
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  Pending & Approved Academic Applications
                </span>
                <span className="text-slate-400">
                  Coordinator: Dr. S. K. Raman
                </span>
              </div>

              <div className="space-y-3">
                {needRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-numbers font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {req.studentAnonId}
                      </span>
                      <span
                        className={`font-semibold capitalize px-2 py-0.5 rounded text-[11px] ${
                          req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-900">{req.bookTitle}</h5>
                      <p className="text-slate-600 text-[11px]">
                        {req.courseName} · {req.semester} ({req.department})
                      </p>
                    </div>

                    {req.decisionNotes && (
                      <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                        Coordinator Decision: "{req.decisionNotes}"
                      </p>
                    )}

                    {req.status === 'pending' && (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() =>
                            approveNeedRequest(
                              req.id,
                              'Verified syllabus eligibility. Reserved from Central Library reserve stock.'
                            )
                          }
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Approve Textbook Allocation
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
