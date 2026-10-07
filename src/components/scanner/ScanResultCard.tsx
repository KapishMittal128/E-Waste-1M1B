import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  EWasteItemAnalysis, 
  EWasteCategory, 
  ConditionAssessment 
} from '../../types';
import { 
  Edit3, 
  Check, 
  MapPin, 
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  Coins
} from 'lucide-react';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { HandwrittenNote } from '../annotations/HandwrittenNote';
import { EcoDot } from '../dot/EcoDot';
import { Magnet } from '../reactbits/Magnet';
import { ClickSpark } from '../reactbits/ClickSpark';
import { Badge } from '../ui/Badge';

interface ScanResultCardProps {
  analysis: EWasteItemAnalysis;
  onFindRecyclers: (category: EWasteCategory, itemName: string) => void;
  onResetScan: () => void;
}

export const ScanResultCard: React.FC<ScanResultCardProps> = ({
  analysis,
  onFindRecyclers,
  onResetScan,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(analysis.detectedName);
  const [editedCategory, setEditedCategory] = useState<EWasteCategory>(analysis.category);
  const [editedCondition, setEditedCondition] = useState<ConditionAssessment>(analysis.condition);

  const categories: EWasteCategory[] = [
    'Mobile Phones',
    'Laptops & Computers',
    'Batteries & Power',
    'Appliances & Consumer Tech',
    'Cables & Chargers',
    'PCBs & Internal Components',
    'Other Electronics',
  ];

  const conditions: ConditionAssessment[] = [
    'Reusable',
    'Repairable',
    'Recyclable Only',
    'Hazardous / Damaged',
  ];

  const handleSaveEdit = () => {
    analysis.detectedName = editedName;
    analysis.category = editedCategory;
    analysis.condition = editedCondition;
    setIsEditing(false);
  };

  const isHazardous = analysis.hazardLevel === 'critical' || analysis.hazardLevel === 'high';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6"
    >
      {/* Top Telemetry Header Ribbon with Reactive Plush Mascot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-950/80 border border-white/10 border-t-white/20 backdrop-blur-3xl shadow-2xl">
        <div className="flex items-center gap-4">
          <EcoDot
            state={isHazardous ? 'hazard' : 'success'}
            size={68}
            className="flex-shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono">
              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                ECOEDGENET_INT8 DIAGNOSTIC
              </span>
              <Badge variant={isHazardous ? 'hazard' : 'success'}>
                {analysis.confidenceScore}% CONF
              </Badge>
              <Badge variant="cyan" className="hidden sm:inline-flex">
                346KB // LOCAL
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">
              {isHazardous ? 'CRITICAL THERMAL HAZARD ISOLATED' : 'URBAN MINING SALVAGE VERIFIED'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetScan}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-white/10 hover:border-white/40 text-xs font-mono font-medium text-zinc-300 hover:text-white transition-all bg-white/[0.03] flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>SCAN ANOTHER</span>
        </button>
      </div>

      {/* Main Diagnostic Inspector Card */}
      <SpotlightCard className="p-6 sm:p-8 space-y-6 bg-zinc-950/75 border border-white/10 border-t-white/20 backdrop-blur-3xl rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                IDENTIFIED HARDWARE ARCHETYPE
              </span>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md border border-white/10 hover:border-white/30"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>EDIT</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-900 border border-white/10">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Item Designation
                  </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Category
                    </label>
                    <select
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value as EWasteCategory)}
                      className="w-full bg-zinc-950 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Condition Assessment
                    </label>
                    <select
                      value={editedCondition}
                      onChange={(e) => setEditedCondition(e.target.value as ConditionAssessment)}
                      className="w-full bg-zinc-950 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                    >
                      {conditions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="px-4 py-1.5 rounded-lg bg-white text-black font-mono font-bold text-xs flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>SAVE</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-space text-white tracking-tight">
                  {analysis.detectedName}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2 font-mono">
                  <Badge variant="outline">
                    CATEGORY: {analysis.category}
                  </Badge>
                  <Badge variant={isHazardous ? 'hazard' : 'default'}>
                    STATUS: {analysis.condition}
                  </Badge>
                  <span className="text-xs text-zinc-400 font-mono">
                    EST. WEIGHT: ~{analysis.estimatedWeightKg} KG
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hazard Warning Strip in Safety Orange */}
        {isHazardous && (
          <div className="p-5 rounded-2xl bg-orange-500/10 border-2 border-orange-500/50 space-y-2.5 relative overflow-hidden shadow-[0_0_30px_rgba(255,87,34,0.15)]">
            <div className="flex items-center gap-2 text-orange-400 font-mono font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <span>CRITICAL SAFETY HAZARD // DO NOT DISPOSE IN GENERAL TRASH</span>
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed font-sans">
              {analysis.hazardWarning ||
                'This item contains volatile chemistry or heavy metals. Handle with insulation and route directly to an MPPCB-authorized facility.'}
            </p>
            <div className="pt-2 border-t border-orange-500/20">
              <span className="text-[10px] font-mono uppercase text-orange-300 block mb-1">
                MANDATORY HANDLING PROTOCOL:
              </span>
              <ul className="text-xs font-mono text-zinc-300 space-y-1 list-disc list-inside">
                {analysis.safetyInstructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Recovered Material Valuation Breakdown */}
        {analysis.materialsBreakdown && analysis.materialsBreakdown.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  URBAN MINING MATERIAL RECOVERY
                </span>
              </div>
              <HandwrittenNote arrow="curved-right" text="spot commodity value!" color="amber" tilt={2} className="text-xs" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {analysis.materialsBreakdown.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-200 font-bold">{m.material}</span>
                    <span className="text-emerald-400 font-bold">~{m.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: `${Math.min(100, m.percentage * 2)}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                    <span>{m.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Dispatch Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <ClickSpark sparkColor="#10B981" sparkRadius={30} className="w-full sm:flex-1 block">
            <Magnet padding={80} magnetStrength={3} className="w-full block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onFindRecyclers(analysis.category, analysis.detectedName)}
                className="w-full py-4 px-6 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 select-none"
              >
                <MapPin className="w-4 h-4" />
                <span>DISPATCH TO GWALIOR RECYCLER RADAR</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Magnet>
          </ClickSpark>

          <button
            type="button"
            onClick={onResetScan}
            className="w-full sm:w-auto py-4 px-6 rounded-full border border-white/15 hover:border-white/40 text-xs font-mono font-medium text-zinc-300 hover:text-white transition-all bg-white/[0.03] flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET SCAN</span>
          </button>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};
