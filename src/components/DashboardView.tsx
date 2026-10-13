import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  ArrowRight,
  QrCode,
  Heart,
  MapPin,
  CheckCircle,
  HelpCircle,
  Users,
  Compass,
  GraduationCap,
  Layers,
  Filter,
} from 'lucide-react';
import { useBookLoop } from '../context/BookLoopContext';
import { Book } from '../types';

export const DashboardView: React.FC = () => {
  const {
    books,
    setSelectedBook,
    setActiveModal,
    setActiveTab,
    toggleWishlist,
    user,
  } = useBookLoop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Engineering Mathematics',
    'Computer Science',
    'Cellular Biology',
    'Economics & Finance',
    'Physics',
    'Electronics & Comm.',
  ];

  // Filter books based on search & category
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || book.subject === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Top books for the prominent numbered carousel (books 1 to 4)
  const topBooks = books.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Mac-Style Window Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Mac Window Header Bar */}
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mac OS Window Dots */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block border border-rose-500/30" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block border border-amber-500/30" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block border border-emerald-500/30" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Campus Knowledge Dashboard
            </h1>
          </div>

          {/* Search Input Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search book titles, authors, course codes (e.g. MATH-201)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Header Status: Active community lenders */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span className="font-medium text-emerald-800">42 Students Active</span>
            </div>
            {/* Quick Action: Smart Book Match Trigger */}
            <button
              onClick={() => setActiveModal('smart-match')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Smart Book Match</span>
            </button>
          </div>
        </div>

        {/* Dashboard Main Body */}
        <div className="p-6 lg:p-8 space-y-10">
          {/* Top 4 Textbooks Carousel with Big Number Typography (Screenshot 3 Design) */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Most Circulated in Campus This Month
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified textbook handovers across engineering, sciences and economics
                </p>
              </div>
              <button
                onClick={() => setActiveModal('smart-match')}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Find by Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Overlapping Numbered Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topBooks.map((book, idx) => (
                <div
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                    setActiveModal('book-details');
                  }}
                  className="group relative bg-slate-50/70 hover:bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  {/* Huge Editorial Number Behind / Beside Book Cover */}
                  <div className="flex items-start justify-between">
                    <span className="font-editorial text-5xl font-bold text-slate-200 group-hover:text-indigo-200 select-none transition-colors">
                      {idx + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(book.title);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors"
                      title="Save to wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          user.wishlist.includes(book.title)
                            ? 'fill-rose-500 text-rose-500'
                            : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Textbook Cover Thumbnail */}
                  <div className="relative my-3 aspect-[3/4] max-h-52 w-full rounded-xl overflow-hidden shadow-md group-hover:scale-[1.02] transition-transform bg-slate-100">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-slate-900/80 text-white font-mono-numbers text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                      {book.totalLoops} loops
                    </div>
                  </div>

                  {/* Book Metadata */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                      {book.courseCode} · {book.edition}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {book.author}
                    </p>
                  </div>

                  {/* Footer status & location */}
                  <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 truncate max-w-[130px]">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{book.exchangeLocationName}</span>
                    </span>
                    <span className="font-mono-numbers text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      {book.status === 'available' ? 'Available' : 'Reserved'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Split Grid: Categories & Peer Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Category Filters & Book Loop Catalog */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category Segmented Control */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Browse Academic Fields
                  </h3>
                  <span className="text-xs text-slate-400">
                    Showing {filteredBooks.length} titles
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => {
                      setSelectedBook(book);
                      setActiveModal('book-details');
                    }}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer flex gap-4"
                  >
                    <div className="w-20 h-28 rounded-lg overflow-hidden bg-slate-100 shrink-0 shadow-sm">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">
                            {book.courseCode}
                          </span>
                          <span>·</span>
                          <span>{book.condition}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 mt-0.5">
                          {book.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {book.author}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-indigo-600 font-semibold font-mono-numbers">
                          {book.syllabusMatch}% match
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBook(book);
                            setActiveModal('passport');
                          }}
                          className="flex items-center gap-1 text-slate-600 hover:text-indigo-600"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QR Passport</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredBooks.length === 0 && (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">
                    No books match "{searchQuery}" in {selectedCategory}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try another search term or click Smart Book Match to find syllabus alternatives.
                  </p>
                </div>
              )}
            </div>

            {/* Right 1 Col: Friends' Recommendations & Academic Need Pathway */}
            <div className="space-y-6">
              {/* Friends' Recommendations Panel (Screenshot 3 Design) */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Peer Recommendations
                  </h3>
                  <span className="font-mono-numbers text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                    3 Active
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Higher Engineering Mathematics
                      </span>
                      <span className="text-[10px] font-mono-numbers text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Sem 3 Core
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      "Cleared Differential Equations on first attempt using this copy. Formula tables in Chapter 7 are a lifesaver."
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Reviewed by Aditya R. (CS Dept)</span>
                      <span className="text-indigo-600 font-medium">Reused 3x</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        General Biology & Genetics
                      </span>
                      <span className="text-[10px] font-mono-numbers text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Sem 1 Foundation
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      "Clean textbook without tears. Saved ₹1,200 instead of ordering online."
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Reviewed by Tanvi M. (Biotech)</span>
                      <span className="text-indigo-600 font-medium">Reused 2x</span>
                    </div>
                  </div>
                </div>

                {/* Motivational Quote Callout (Screenshot 3 Style) */}
                <div className="mt-4 p-3.5 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl border border-indigo-100 text-center">
                  <p className="font-editorial text-sm italic text-slate-800">
                    "Knowledge increases by sharing, not by saving."
                  </p>
                  <p className="text-[10px] uppercase font-semibold text-indigo-700 tracking-wider mt-1">
                    BookLoop Circular Community
                  </p>
                </div>
              </div>

              {/* Need-Based Book Access Card (Feature 7) */}
              <div className="p-5 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl text-white space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-indigo-300">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Need-Based Book Access
                  </span>
                </div>
                <h4 className="text-sm font-bold">
                  Struggling with textbook costs this semester?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Confidential textbook allocation partnered with campus faculty coordinators. No public labels, fair academic criteria.
                </p>
                <button
                  onClick={() => setActiveModal('need-based')}
                  className="w-full py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Apply Confidentially
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
