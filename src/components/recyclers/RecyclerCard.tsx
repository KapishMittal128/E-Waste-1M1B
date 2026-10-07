import React from 'react';
import { motion } from 'framer-motion';
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
import { TiltedCard } from '../reactbits/TiltedCard';
import { ClickSpark } from '../reactbits/ClickSpark';
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
  onReport,
}) => {
  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${recycler.coordinates.lat},${recycler.coordinates.lng}`;
  };

  return (
    <TiltedCard rotateAmplitude={6} scaleOnHover={1.015} className="h-full">
      <div className="p-5 sm:p-6 space-y-4 flex flex-col justify-between h-full bg-zinc-950/80 border border-white/10 border-t-white/20 backdrop-blur-3xl rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all duration-300 group">
        {/* Top Header & Tier Badge */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="success" className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{recycler.authorizationTier}</span>
            </Badge>

            {recycler.distanceKm !== undefined && (
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-emerald-400">
                {recycler.distanceKm.toFixed(1)} KM AWAY
              </span>
            )}
          </div>

          {/* Recycler Name */}
          <h3 className="text-lg sm:text-xl font-bold font-space text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
            {recycler.name}
          </h3>

          {/* Verification Source */}
          <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
            <span className="text-zinc-500 font-semibold">REG:</span>
            <span className="text-zinc-300">{recycler.registrationNumber}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 truncate">VERIFIED: {recycler.lastVerifiedDate}</span>
          </div>
        </div>

        {/* Address & Hours */}
        <div className="space-y-2 text-xs font-mono text-zinc-300 bg-zinc-900/60 p-3.5 rounded-2xl border border-white/5">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
            <span className="font-sans text-xs">
              {recycler.address}, {recycler.locality}, {recycler.city} ({recycler.pincode})
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
            <span>
              {recycler.openingHours} // {recycler.daysOpen}
            </span>
          </div>
          {recycler.providesDoorstepPickup && (
            <div className="flex items-center gap-2 text-emerald-300 font-medium pt-1.5 border-t border-white/5 text-[11px]">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DOORSTEP PICKUP AVAILABLE (MIN: {recycler.minWeightForPickupKg}KG)</span>
            </div>
          )}
        </div>

        {/* Authorized Categories Chips */}
        <div className="space-y-1.5">
          <div className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
            AUTHORIZED E-WASTE CATEGORIES:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recycler.acceptedCategories.map((cat, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.02] text-zinc-400"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Incentive Note if available */}
        {recycler.incentiveNote && (
          <div className="flex items-start gap-2 text-[11px] font-mono text-zinc-300 bg-zinc-900/40 p-2.5 rounded-xl border border-white/5">
            <Award className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{recycler.incentiveNote}</span>
          </div>
        )}

        {/* Action Buttons Grid */}
        <div className="pt-2 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* CALL RECYCLER with ClickSpark */}
            <ClickSpark sparkColor="#fff" sparkRadius={20}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onCall(recycler)}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>CALL RECYCLER</span>
              </motion.button>
            </ClickSpark>

            {/* Share E-Waste Details */}
            <button
              type="button"
              onClick={() => onShareDetails(recycler)}
              className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>SHARE DETAILS</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 font-mono">
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-850 border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-zinc-400" />
              <span>DIRECTIONS</span>
            </a>

            <button
              type="button"
              onClick={() => onViewDetails(recycler)}
              className="py-1.5 px-2.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              VERIFICATION DOSSIER
            </button>

            <button
              type="button"
              onClick={() => onReport(recycler)}
              className="text-[10px] text-zinc-500 hover:text-orange-400 transition-colors flex items-center gap-1"
              title="Report inaccurate phone/address"
            >
              <AlertCircle className="w-3 h-3" />
              <span>REPORT</span>
            </button>
          </div>
        </div>
      </div>
    </TiltedCard>
  );
};
