import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Filter,
  CheckCircle,
  Clock,
  User,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Layers,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { useBookLoop } from '../context/BookLoopContext';
import { ExchangeLocation, Book } from '../types';

export const ExchangeMapView: React.FC = () => {
  const { locations, books, setSelectedBook, setActiveModal } = useBookLoop();

  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [keyword, setKeyword] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [radius, setRadius] = useState('5');
  const [selectedLocationId, setSelectedLocationId] = useState<string>(locations[0].id);

  // Filter locations
  const filteredLocations = locations.filter((loc) => {
    const matchesKeyword =
      loc.name.toLowerCase().includes(keyword.toLowerCase()) ||
      loc.address.toLowerCase().includes(keyword.toLowerCase()) ||
      loc.area.toLowerCase().includes(keyword.toLowerCase());
    const matchesZone = zoneFilter === 'All' || loc.area === zoneFilter;
    return matchesKeyword && matchesZone;
  });

  const selectedLoc = locations.find((l) => l.id === selectedLocationId) || locations[0];

  // Books present at this selected location
  const locationBooks = books.filter((b) => b.exchangeLocationId === selectedLoc.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Filter Card (Screenshot 1 "Book Corners" Design) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Explore Campus Collection Points
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified drop-off locations to securely exchange books without sharing personal home addresses.
          </p>
        </div>

        {/* Filter Form Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Keywords
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Library, Kiosk, Hostel..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Campus Zone
            </label>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
            >
              <option value="All">All Campus Zones</option>
              <option value="North Campus">North Campus</option>
              <option value="Tech Quadrangle">Tech Quadrangle</option>
              <option value="South Wing">South Wing</option>
              <option value="Student Residences">Student Residences</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Radius
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
            >
              <option value="1">Within 1 km (Walking)</option>
              <option value="5">Within 5 km (Campus Zone)</option>
              <option value="10">Within 10 km (Inter-College)</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                setKeyword('');
                setZoneFilter('All');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Clear
            </button>
            <div className="flex-1 text-right text-xs text-slate-400 self-center">
              Showing {filteredLocations.length} locations
            </div>
          </div>
        </div>

        {/* View Mode Segmented Switch (Screenshot 1: Map | List | Split) */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>All 4 campus hubs verified by Dean of Student Affairs</span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Split View
            </button>
          </div>
        </div>
      </div>

      {/* Main Map & Location Cards Layout */}
      <div
        className={`grid gap-6 ${
          viewMode === 'split'
            ? 'grid-cols-1 lg:grid-cols-12'
            : viewMode === 'map'
            ? 'grid-cols-1'
            : 'grid-cols-1'
        }`}
      >
        {/* Interactive Campus SVG Map */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div
            className={`bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm flex flex-col ${
              viewMode === 'split' ? 'lg:col-span-7 h-[600px]' : 'h-[650px]'
            }`}
          >
            {/* Map Canvas with Stylized University Layout */}
            <div className="relative flex-1 bg-slate-100 overflow-hidden select-none">
              {/* Campus Grounds Background Vector */}
              <svg
                viewBox="0 0 800 600"
                className="w-full h-full object-cover"
                style={{ background: '#EEF2F6' }}
              >
                {/* Campus Greenery Zones */}
                <path
                  d="M 50 80 Q 250 40 450 120 T 750 90 L 780 250 Q 550 290 350 240 Z"
                  fill="#E2E8F0"
                  opacity="0.7"
                />
                <path
                  d="M 100 350 Q 300 300 550 380 T 780 420 L 750 560 L 50 580 Z"
                  fill="#E2E8F0"
                  opacity="0.8"
                />

                {/* Campus Quadrangle Paths / Roads */}
                <path
                  d="M 120 0 L 120 600 M 420 0 L 420 600 M 0 280 L 800 280 M 0 450 L 800 450"
                  stroke="#CBD5E1"
                  strokeWidth="8"
                  fill="none"
                />
                <circle cx="420" cy="280" r="45" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="4" />

                {/* Campus Zones Text Markers */}
                <text x="420" y="285" textAnchor="middle" fill="#4338CA" fontSize="11" fontWeight="bold">
                  Central Quad
                </text>
                <text x="200" y="140" fill="#64748B" fontSize="12" fontWeight="600">
                  Academic & Science Wing
                </text>
                <text x="560" y="160" fill="#64748B" fontSize="12" fontWeight="600">
                  Engineering Block & Labs
                </text>
                <text x="250" y="520" fill="#64748B" fontSize="12" fontWeight="600">
                  Student Hostels & Residences
                </text>

                {/* Location Pin 1: Central Library */}
                <g
                  onClick={() => setSelectedLocationId('loc-1')}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <circle cx="420" cy="240" r="24" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="3" />
                  <text x="420" y="244" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    142
                  </text>
                  <text x="420" y="210" textAnchor="middle" fill="#1E1B4B" fontSize="10" fontWeight="bold">
                    Central Library
                  </text>
                </g>

                {/* Location Pin 2: Engineering Kiosk */}
                <g
                  onClick={() => setSelectedLocationId('loc-2')}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <circle cx="620" cy="200" r="22" fill="#059669" stroke="#FFFFFF" strokeWidth="3" />
                  <text x="620" y="204" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    88
                  </text>
                  <text x="620" y="172" textAnchor="middle" fill="#064E3B" fontSize="10" fontWeight="bold">
                    Tech Kiosk
                  </text>
                </g>

                {/* Location Pin 3: Bio-Sciences Lounge */}
                <g
                  onClick={() => setSelectedLocationId('loc-3')}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <circle cx="220" cy="190" r="20" fill="#D97706" stroke="#FFFFFF" strokeWidth="3" />
                  <text x="220" y="194" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                    64
                  </text>
                  <text x="220" y="162" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="bold">
                    Bio Lounge
                  </text>
                </g>

                {/* Location Pin 4: Hostel Hub */}
                <g
                  onClick={() => setSelectedLocationId('loc-4')}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <circle cx="340" cy="480" r="19" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="3" />
                  <text x="340" y="484" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                    52
                  </text>
                  <text x="340" y="515" textAnchor="middle" fill="#4C1D95" fontSize="10" fontWeight="bold">
                    Hostel Hub
                  </text>
                </g>
              </svg>

              {/* Map Floating Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 text-xs shadow-sm space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">
                  Campus Hub Indicators
                </span>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span>Central Hub (&gt;100 books)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>24/7 Outdoor Kiosk</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Details Panel / List View */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div
            className={`space-y-6 ${
              viewMode === 'split' ? 'lg:col-span-5 h-[600px] overflow-y-auto pr-1' : ''
            }`}
          >
            {/* Selected Location Card with Kiosk Artwork (Screenshot 1 Design) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
              <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-slate-100">
                <img
                  src="/src/assets/images/kiosk_book_corner_1791878926387.jpg"
                  alt="Campus Book Exchange Station"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Approved Handover Zone</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                    {selectedLoc.category} · {selectedLoc.area}
                  </span>
                  <span className="font-mono-numbers text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedLoc.booksCount} Books
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedLoc.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedLoc.address}
                </p>
              </div>

              {/* Verified Features */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{selectedLoc.timings}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{selectedLoc.coordinator}</span>
                </div>
              </div>

              {/* Location Books List */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Available at this Hub
                  </span>
                  <span className="text-xs text-slate-400">
                    {locationBooks.length} titles ready
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {locationBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => {
                        setSelectedBook(book);
                        setActiveModal('book-details');
                      }}
                      className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200/70 transition-colors cursor-pointer group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                          {book.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {book.author} · {book.condition}
                        </div>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800 shrink-0 p-1">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {locationBooks.length === 0 && (
                    <p className="text-xs text-slate-500 italic py-2">
                      No books currently reserved at this hub. Other campus stations have copies.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* List of other locations in area */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                All Campus Drop Points
              </span>
              {filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocationId(loc.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedLocationId === loc.id
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900">
                      {loc.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {loc.area} · {loc.timings}
                    </div>
                  </div>
                  <span className="font-mono-numbers text-xs font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded">
                    {loc.booksCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
