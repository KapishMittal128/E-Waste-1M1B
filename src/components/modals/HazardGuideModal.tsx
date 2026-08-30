import React from 'react';
import { 
  ShieldAlert, 
  BatteryWarning, 
  Tv, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  X,
  PhoneCall
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface HazardGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HazardGuideModal: React.FC<HazardGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Hazardous E-Waste Safety Protocol</h3>
              <p className="text-xs text-zinc-400">Emergency containment guide for Gwalior households</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Critical Hazard Categories */}
        <div className="space-y-4 text-xs">
          
          {/* Swollen Batteries */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <BatteryWarning className="w-4 h-4 text-white" />
                <span>Swollen / Punctured Lithium-Ion Batteries</span>
              </div>
              <Badge variant="white" className="text-[10px]">
                Thermal Runaway Risk
              </Badge>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Lithium batteries with visible swelling can spontaneously combust at temperatures above 60°C.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-white" /> DO:
                </span>
                <p className="text-[11px] text-zinc-400">Cover metallic terminals with electrical tape. Store in sand or a metal tin.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-zinc-500" /> DON'T:
                </span>
                <p className="text-[11px] text-zinc-400">Never puncture, immerse in water, or place near heat sources or curtains.</p>
              </div>
            </div>
          </div>

          {/* CRT Monitors */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-zinc-200 text-sm">
                <Tv className="w-4 h-4 text-zinc-300" />
                <span>Broken CRT Monitors & Old Box TVs</span>
              </div>
              <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-300">
                1.5 - 3 kg Leaded Glass
              </Badge>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Cathode ray tubes contain high concentrations of lead and phosphorus powder inside vacuum funnels.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-white" /> DO:
                </span>
                <p className="text-[11px] text-zinc-400">Keep intact. Wrap broken glass in thick cardboard with gloves.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-zinc-500" /> DON'T:
                </span>
                <p className="text-[11px] text-zinc-400">Never dismantle copper yoke or shatter glass for scrap metal.</p>
              </div>
            </div>
          </div>

          {/* CFL Lamps */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-zinc-200 text-sm">
                <Lightbulb className="w-4 h-4 text-zinc-300" />
                <span>Fluorescent Tubes & CFL Bulbs</span>
              </div>
              <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-300">
                Mercury Vapor
              </Badge>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              CFLs contain 3-5mg of toxic elemental mercury which turns to vapor when shattered.
            </p>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-300 block mb-1">Containment Protocol:</span>
              <p className="text-[11px] text-zinc-400">If broken, ventilate room for 15 minutes. Use cardboard to scoop shards into a sealed glass jar. Do not vacuum.</p>
            </div>
          </div>

        </div>

        {/* Emergency Helpline Note */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-white">Gwalior Municipal Corporation Clean Line</div>
            <div className="text-zinc-400">Report large quantities or commercial hazmat spill</div>
          </div>
          <a
            href="tel:18002334545"
            className="px-3.5 py-2 rounded-xl bg-white text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-zinc-200 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            1800 233 4545
          </a>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={onClose}
          className="w-full text-xs"
        >
          Got It, Back to Safety
        </Button>

      </div>
    </div>
  );
};
