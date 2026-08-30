import React from 'react';
import { Recycler } from '../../types';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Share2, 
  AlertCircle, 
  Truck, 
  Award,
  Navigation
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface RecyclerCardProps {
  recycler: Recycler;
  onCall: (recycler: Recycler) => void;
  onShareDetails: (recycler: Recycler) => void;
  onViewDetails: (recycler: Recycler) => void;
  onReport: (recycler: Recycler) => void;
}

export const RecyclerCard: React.FC<RecyclerCardProps> = ({
  recycler,
  onCall,
  onShareDetails,
  onViewDetails,
  onReport
}) => {
  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${recycler.coordinates.lat},${recycler.coordinates.lng}`;
  };

  return (
    <Card className="p-5 sm:p-6 space-y-4 flex flex-col justify-between">
      
      {/* Top Header & Tier Badge */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="secondary" className="border-zinc-700 bg-zinc-800 text-white font-bold">
            <ShieldCheck className="w-3.5 h-3.5 mr-0.5" />
            {recycler.authorizationTier}
          </Badge>

          {recycler.distanceKm !== undefined && (
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-black border border-zinc-800 text-zinc-200">
              {recycler.distanceKm.toFixed(1)} km away
            </span>
          )}
        </div>

        {/* Recycler Name */}
        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
          {recycler.name}
        </h3>

        {/* Verification Source */}
        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
          <span className="text-zinc-500 font-semibold">Reg ID:</span>
          <span className="font-mono text-zinc-300">{recycler.registrationNumber}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 truncate">Verified: {recycler.lastVerifiedDate}</span>
        </div>
      </div>

      {/* Address & Hours */}
      <div className="space-y-2 text-xs text-zinc-300 bg-zinc-950/70 p-3.5 rounded-2xl border border-zinc-800">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
          <span>{recycler.address}, {recycler.locality}, {recycler.city} ({recycler.pincode})</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Clock className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <span>{recycler.openingHours} • {recycler.daysOpen}</span>
        </div>
        {recycler.providesDoorstepPickup && (
          <div className="flex items-center gap-2 text-zinc-200 font-medium pt-1 border-t border-zinc-800">
            <Truck className="w-3.5 h-3.5 text-white" />
            <span>Provides Doorstep Pickup in Gwalior (Min. {recycler.minWeightForPickupKg}kg)</span>
          </div>
        )}
      </div>

      {/* Accepted Categories Chips */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Accepted E-Waste Categories:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {recycler.acceptedCategories.map((cat, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="text-[10px] py-0.5 border-zinc-800 bg-zinc-950 text-zinc-400"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Incentive Note if available */}
      {recycler.incentiveNote && (
        <div className="flex items-start gap-2 text-[11px] text-zinc-300 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
          <Award className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
          <span>{recycler.incentiveNote}</span>
        </div>
      )}

      {/* Action Buttons Grid */}
      <div className="pt-2 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* CALL RECYCLER (Direct Dialer with Safety Prompt) */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => onCall(recycler)}
            className="py-3 text-xs"
          >
            <Phone className="w-3.5 h-3.5 mr-1" />
            CALL RECYCLER
          </Button>

          {/* Share E-Waste Details */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onShareDetails(recycler)}
            className="py-3 text-xs"
          >
            <Share2 className="w-3.5 h-3.5 mr-1" />
            Share Details
          </Button>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-3 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 flex items-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-zinc-400" />
            Get Directions
          </a>

          <button
            onClick={() => onViewDetails(recycler)}
            className="py-1.5 px-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-850 transition-colors"
          >
            Verification Dossier
          </button>

          <button
            onClick={() => onReport(recycler)}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
            title="Report inaccurate phone/address"
          >
            <AlertCircle className="w-3 h-3" />
            Report Issue
          </button>
        </div>
      </div>

    </Card>
  );
};
