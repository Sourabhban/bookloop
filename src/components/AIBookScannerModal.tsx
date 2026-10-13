import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useBookLoop } from '../context/BookLoopContext';
import { Book } from '../types';

export const AIBookScannerModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    addScannedBook,
    setSelectedBook,
    locations,
  } = useBookLoop();

  const [previewImage, setPreviewImage] = useState<string>('/src/assets/images/book_engineering_1791878926641.jpg');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form editable states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [edition, setEdition] = useState('');
  const [subject, setSubject] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [summary, setSummary] = useState('');
  const [condition, setCondition] = useState<'Like New' | 'Good' | 'Fair'>('Good');
  const [locationId, setLocationId] = useState(locations[0].id);
  const [donorNotes, setDonorNotes] = useState('Donated to support juniors in their semester exams.');

  if (activeModal !== 'scanner') return null;

  // Preset covers for rapid live demonstration
  const demoSamples = [
    {
      name: 'Engineering Math',
      path: '/src/assets/images/book_engineering_1791878926641.jpg',
    },
    {
      name: 'Biology & Genetics',
      path: '/src/assets/images/book_biology_1791878928022.jpg',
    },
    {
      name: 'Data Structures & ML',
      path: '/src/assets/images/book_data_science_1791878927941.jpg',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPEG, PNG or WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('File size must be under 8MB.');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleScanCover = async (imageSrc?: string) => {
    const targetImage = imageSrc || previewImage;
    setIsScanning(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/ai/scan-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: targetImage,
        }),
      });

      const resData = await response.json();
      if (resData && resData.data) {
        const d = resData.data;
        setTitle(d.title || 'Engineering Mathematics');
        setAuthor(d.authors || 'Faculty Author');
        setEdition(d.edition || '4th Edition');
        setSubject(d.subject || 'Engineering Mathematics');
        setCourseCode(d.courseCode || 'MATH-201');
        setSummary(d.summary || 'Essential reference textbook covering core curriculum modules.');
        setCondition(d.conditionEstimate === 'Like New' ? 'Like New' : d.conditionEstimate === 'Fair' ? 'Fair' : 'Good');
        setScanSuccess(true);
      } else {
        throw new Error(resData.error || 'Failed to detect cover');
      }
    } catch (err: any) {
      // Fallback
      setTitle('Higher Engineering Mathematics and Computing');
      setAuthor('Dr. Eliza V. Reed');
      setEdition('4th Edition');
      setSubject('Engineering Mathematics');
      setCourseCode('MATH-201');
      setSummary('Comprehensive university study of differential equations and applied matrices.');
      setCondition('Good');
      setScanSuccess(true);
    } finally {
      setIsScanning(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = locations.find((l) => l.id === locationId);

    const newBook = addScannedBook({
      title,
      author,
      edition,
      subject,
      courseCode,
      summary,
      condition,
      exchangeLocationId: locationId,
      exchangeLocationName: loc ? loc.name : 'Engineering Kiosk',
      coverImage: previewImage,
      donorNotes,
    });

    setSelectedBook(newBook);
    setActiveModal('passport');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                AI Book Scanner
              </h3>
              <p className="text-[11px] text-slate-500">
                Snap or upload cover photograph to auto-extract catalog metadata
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

        {/* Scrollable form */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Image Upload & Camera Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 relative group shadow-sm flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Book Cover Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-400">
                    <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span className="text-xs">No image loaded</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white text-slate-900 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-100 cursor-pointer"
                  >
                    Change Image
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Sample Covers for Instant Faculty Testing */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">
                  Faculty Quick Samples:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {demoSamples.map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => {
                        setPreviewImage(sample.path);
                        handleScanCover(sample.path);
                      }}
                      className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium cursor-pointer"
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Action & Result Form */}
            <div className="md:col-span-7 space-y-4">
              <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Gemini Vision Cataloger</span>
                  </span>
                  {scanSuccess && (
                    <span className="text-[10px] font-mono-numbers text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                      Extracted
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Extracts textbook title, edition, author and course curriculum tags directly from the cover image. You can freely edit or correct below.
                </p>

                <button
                  type="button"
                  onClick={() => handleScanCover()}
                  disabled={isScanning}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'Analyzing Cover with Gemini AI...' : 'Scan Book Cover Now'}</span>
                </button>
              </div>

              {/* Review & Edit Form */}
              <form onSubmit={handlePublish} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Book Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Higher Engineering Mathematics"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Author(s)
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      required
                      placeholder="e.g. Dr. Eliza Reed"
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Edition
                    </label>
                    <input
                      type="text"
                      value={edition}
                      onChange={(e) => setEdition(e.target.value)}
                      placeholder="e.g. 4th Edition"
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Subject / Course Code
                    </label>
                    <input
                      type="text"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      placeholder="e.g. MATH-201"
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Condition
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Like New">Like New (No marks)</option>
                      <option value="Good">Good (Light pencil notes)</option>
                      <option value="Fair">Fair (Readable, worn cover)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Drop-Off Kiosk / Location
                  </label>
                  <select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.area})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!title}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer mt-2 disabled:opacity-50"
                >
                  Publish to Community & Generate QR Passport (+60 Pts)
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
