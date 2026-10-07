import React, { useState, useMemo } from 'react';
import { Recycler, EWasteCategory } from '../../types';
import { VERIFIED_RECYCLERS, GWALIOR_LOCALITIES } from '../../data/recyclers';
import { RecyclerCard } from './RecyclerCard';
import { LeafletMapView } from '../map/LeafletMapView';
import { 
  Search, 
  Map, 
  List, 
  ShieldCheck, 
  Filter, 
  AlertTriangle, 
  CheckCircle2,
  Info
} from 'lucide-react';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { BlurText } from '../reactbits/BlurText';
import { HandwrittenNote } from '../annotations/HandwrittenNote';

interface RecyclerLocatorProps {
  selectedCategory?: EWasteCategory | 'All';
  highlightItemName?: string;
  selectedLocality: string;
  setSelectedLocality: (loc: string) => void;
  onCallRecycler: (recycler: Recycler) => void;
  onShareDetails: (recycler: Recycler) => void;
  onViewDetails: (recycler: Recycler) => void;
  onReportRecycler: (recycler: Recycler) => void;
}

// Haversine formula for kilometer distance
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const RecyclerLocator: React.FC<RecyclerLocatorProps> = ({
  selectedCategory: initialCategory = 'All',
  highlightItemName,
  selectedLocality,
  setSelectedLocality,
  onCallRecycler,
  onShareDetails,
  onViewDetails,
  onReportRecycler,
}) => {
  const [activeCategory, setActiveCategory] = useState<EWasteCategory | 'All'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const categories: (EWasteCategory | 'All')[] = [
    'All',
    'Mobile Phones',
    'Laptops & Computers',
    'Batteries & Power',
    'Appliances & Consumer Tech',
    'Cables & Chargers',
    'PCBs & Internal Components',
    'Other Electronics',
  ];

  const currentCoords = useMemo(() => {
    const found = GWALIOR_LOCALITIES.find((l) => l.name === selectedLocality);
    return found || GWALIOR_LOCALITIES[0];
  }, [selectedLocality]);

  const filteredRecyclers = useMemo(() => {
    return VERIFIED_RECYCLERS.map((rec) => {
      const distance = calculateDistanceKm(
        currentCoords.lat,
        currentCoords.lng,
        rec.coordinates.lat,
        rec.coordinates.lng
      );
      return { ...rec, distanceKm: distance };
    })
      .filter((rec) => {
        if (activeCategory !== 'All' && !rec.acceptedCategories.includes(activeCategory as EWasteCategory)) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = rec.name.toLowerCase().includes(q);
          const matchLocality = rec.locality.toLowerCase().includes(q);
          const matchAddress = rec.address.toLowerCase().includes(q);
          const matchItems = rec.acceptedItemsSummary.some((item) => item.toLowerCase().includes(q));
          if (!matchName && !matchLocality && !matchAddress && !matchItems) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [activeCategory, searchQuery, currentCoords]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner Card */}
      <SpotlightCard className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0c0c0e]/95 border border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900 text-[10px] font-mono font-bold uppercase text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MPPCB & CPCB REGULATORY COMPLIANCE DATASET</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-space text-white tracking-tight uppercase">
            <BlurText text="AUTHORIZED RECYCLER RADAR" delay={0.06} />
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans">
            Locating verified e-waste facilities & collection hubs in{' '}
            <strong className="text-white font-mono">Gwalior, Madhya Pradesh</strong>. Every depot is cross-audited against state pollution control authorizations.
          </p>

          <div className="pt-1">
            <HandwrittenNote
              arrow="left"
              text="MPPCB authorized e-waste facility — verified zero landfill leakage"
              color="orange"
              tilt={-2}
            />
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-[#111113] p-1.5 rounded-full border border-zinc-800 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase flex items-center gap-2 transition-all ${
              viewMode === 'list'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>LIST ({filteredRecyclers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase flex items-center gap-2 transition-all ${
              viewMode === 'map'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>MAP RADAR</span>
          </button>
        </div>
      </SpotlightCard>

      {/* Safety Notice Warning Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161214] border border-[#FF5722]/50 flex items-start gap-3.5 text-xs text-zinc-300">
        <AlertTriangle className="w-5 h-5 text-[#FF5722] flex-shrink-0 mt-0.5" />
        <div className="space-y-1 font-sans">
          <span className="font-bold text-[#FF5722] font-mono uppercase text-xs">
            WHY AUTHORIZED RECYCLING OVER INFORMAL SCRAP BURNING?
          </span>
          <p className="leading-relaxed text-zinc-300 text-xs">
            Informal burning and acid extraction of circuit boards releases deadly dioxins, lead aerosol, and mercury into Gwalior's air and groundwater. Authorized facilities use mechanical separation and closed-loop hydrometallurgical recovery.
          </p>
        </div>
      </div>

      {highlightItemName && (
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-200">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>
              DISPOSAL HUBS FILTERED FOR:{' '}
              <strong className="text-white">{highlightItemName.toUpperCase()}</strong>
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-black font-extrabold uppercase">
            ACTIVE FILTER
          </span>
        </div>
      )}

      {/* Search & Location Bar */}
      <div className="space-y-4 font-mono">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, locality (Lashkar, Maharajpura), or component..."
              className="w-full bg-[#111113] border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-white transition-all"
            />
          </div>

          <div className="relative">
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full px-4 py-3 bg-[#111113] border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-white transition-all appearance-none cursor-pointer"
            >
              {GWALIOR_LOCALITIES.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  RADIUS CENTER: {loc.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1 pl-1">
            <Filter className="w-3 h-3" />
            <span>FILTER:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black font-extrabold shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Map or List */}
      {viewMode === 'map' ? (
        <div className="space-y-2">
          <div className="flex justify-end px-2">
            <HandwrittenNote
              arrow="down"
              text="interactive radar with live facility coordinates"
              color="white"
              tilt={1.5}
            />
          </div>
          <LeafletMapView
            recyclers={filteredRecyclers}
            userLocation={currentCoords}
            onSelectRecycler={onViewDetails}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecyclers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3 font-mono">
              <Info className="w-8 h-8 text-zinc-500 mx-auto" />
              <h4 className="text-base font-bold text-zinc-200 uppercase">
                NO AUTHORIZED RECYCLERS MATCHED
              </h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto font-sans">
                No facilities matched the current filter. Try selecting "All" or adjusting your Gwalior radius center.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-lg bg-white text-black font-bold text-xs uppercase"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredRecyclers.map((recycler) => (
                <RecyclerCard
                  key={recycler.id}
                  recycler={recycler}
                  onCall={onCallRecycler}
                  onShareDetails={onShareDetails}
                  onViewDetails={onViewDetails}
                  onReport={onReportRecycler}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
