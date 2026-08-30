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
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

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

// haversine formula for kilometer distance
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
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
  onReportRecycler
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
    'Other Electronics'
  ];

  const currentCoords = useMemo(() => {
    const found = GWALIOR_LOCALITIES.find(l => l.name === selectedLocality);
    return found || GWALIOR_LOCALITIES[0];
  }, [selectedLocality]);

  const filteredRecyclers = useMemo(() => {
    return VERIFIED_RECYCLERS.map(rec => {
      const distance = calculateDistanceKm(
        currentCoords.lat,
        currentCoords.lng,
        rec.coordinates.lat,
        rec.coordinates.lng
      );
      return { ...rec, distanceKm: distance };
    })
      .filter(rec => {
        if (activeCategory !== 'All' && !rec.acceptedCategories.includes(activeCategory as EWasteCategory)) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = rec.name.toLowerCase().includes(q);
          const matchLocality = rec.locality.toLowerCase().includes(q);
          const matchAddress = rec.address.toLowerCase().includes(q);
          const matchItems = rec.acceptedItemsSummary.some(item => item.toLowerCase().includes(q));
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
      
      <Card className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-zinc-300 border-zinc-800 bg-zinc-950">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
            <span>MPPCB & CPCB Regulatory Compliance Dataset</span>
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Find an Authorized Recycler Near You
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Locating verified e-waste recyclers & collection points in <strong className="text-zinc-200">Gwalior, Madhya Pradesh</strong>. Every facility listed is cross-checked against official pollution control board authorizations.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 self-start md:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'list'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            List View ({filteredRecyclers.length})
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'map'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Map className="w-4 h-4" />
            Map View
          </button>
        </div>
      </Card>

      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-700 flex items-start gap-3.5 text-xs text-zinc-300">
        <AlertTriangle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold text-white">
            Why Choose Authorized Recyclers Over Informal Scrap Dealers (Kabadiwalas)?
          </span>
          <p className="leading-relaxed text-zinc-400">
            Unregulated scrap dealers often burn electronic cables and acid-wash circuit boards in open air, releasing toxic dioxins, lead vapor, and mercury into Gwalior's air and groundwater. The facilities listed below are legally certified for zero-pollution mechanical shredding and safe metal extraction.
          </p>
        </div>
      </div>

      {highlightItemName && (
        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-200 font-medium">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Finding verified disposal hubs for: <strong className="text-white font-bold">{highlightItemName}</strong></span>
          </div>
          <Badge variant="white" className="text-[10px]">
            Filter Active
          </Badge>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, locality (Lashkar, Maharajpura, Thatipur), or item..."
              className="glass-input-dark w-full pl-11 pr-4 py-3 text-xs"
            />
          </div>

          <div className="relative">
            <select
              value={selectedLocality}
              onChange={e => setSelectedLocality(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 transition-all appearance-none cursor-pointer"
            >
              {GWALIOR_LOCALITIES.map(loc => (
                <option key={loc.name} value={loc.name}>
                  📍 Center: {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1 pl-1">
            <Filter className="w-3 h-3" />
            Filters:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
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

      {viewMode === 'map' ? (
        <LeafletMapView
          recyclers={filteredRecyclers}
          userLocation={currentCoords}
          onSelectRecycler={onViewDetails}
        />
      ) : (
        <div className="space-y-4">
          {filteredRecyclers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <Info className="w-8 h-8 text-zinc-500 mx-auto" />
              <h4 className="text-base font-bold text-zinc-200">No Verified Recyclers Found</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                No authorized facilities matched your specific search filters. Try selecting "All Categories" or changing your Gwalior locality filter.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredRecyclers.map(recycler => (
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
