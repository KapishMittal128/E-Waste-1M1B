import React, { useState } from 'react';
import { 
  EWasteItemAnalysis, 
  EWasteCategory, 
  ConditionAssessment 
} from '../../types';
import { 
  ShieldAlert, 
  Sparkles, 
  Edit3, 
  Check, 
  Info, 
  MapPin, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ScanResultCardProps {
  analysis: EWasteItemAnalysis;
  onFindRecyclers: (category: EWasteCategory, itemName: string) => void;
  onResetScan: () => void;
}

export const ScanResultCard: React.FC<ScanResultCardProps> = ({
  analysis,
  onFindRecyclers,
  onResetScan
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
    'Other Electronics'
  ];

  const conditions: ConditionAssessment[] = [
    'Reusable',
    'Repairable',
    'Recyclable Only',
    'Hazardous / Damaged'
  ];

  const handleSaveEdit = () => {
    analysis.detectedName = editedName;
    analysis.category = editedCategory;
    analysis.condition = editedCondition;
    setIsEditing(false);
  };

  const isHazardous = analysis.hazardLevel === 'critical' || analysis.hazardLevel === 'high';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-white">AI Vision Analysis</span>
              <Badge variant="white" className="text-[10px] py-0">
                Confidence: {analysis.confidenceScore}%
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-400">
              Estimated classification based on visual circuitry, frame, and materials.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onResetScan}
          className="self-start sm:self-auto text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Scan Another
        </Button>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Detected Electronic Item
              </span>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md hover:bg-zinc-800"
                >
                  <Edit3 className="w-3 h-3" />
                  Correct Item
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Item Name</label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={e => setEditedName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Category</label>
                    <select
                      value={editedCategory}
                      onChange={e => setEditedCategory(e.target.value as EWasteCategory)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Condition</label>
                    <select
                      value={editedCondition}
                      onChange={e => setEditedCondition(e.target.value as ConditionAssessment)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                    >
                      {conditions.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveEdit}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {analysis.detectedName}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="secondary">
                    Category: {analysis.category}
                  </Badge>
                  <Badge variant={isHazardous ? 'hazard' : 'default'}>
                    Condition: {analysis.condition}
                  </Badge>
                  <span className="text-xs text-zinc-400">
                    Est. Weight: ~{analysis.estimatedWeightKg} kg
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {isHazardous && (
          <div className="p-5 rounded-2xl bg-zinc-950 border-2 border-zinc-600 space-y-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm">
              <ShieldAlert className="w-5 h-5 text-white" />
              <span>CRITICAL SAFETY WARNING — NEVER PUT IN GENERAL HOUSEHOLD TRASH</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              {analysis.hazardWarning || 'This item poses fire or toxic leaching risks. Handle with care and route directly to an MPPCB-authorized hazardous e-waste facility.'}
            </p>
            <div className="pt-2 border-t border-zinc-800">
              <span className="text-[11px] font-bold text-zinc-200 block mb-1">Required Safety Handling Steps:</span>
              <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
                {analysis.safetyInstructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-zinc-300" />
            Detected Circuitry & Likely Components
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.likelyComponents.map((component, idx) => (
              <div
                key={idx}
                className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                <span>{component}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-zinc-400">Material Composition</span>
            <span className="text-zinc-500 text-[11px]">Recovery Potential</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {analysis.materialsBreakdown.map((mat, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">{mat.material}</span>
                  <span className="font-mono font-bold text-white">{mat.percentage}%</span>
                </div>
                <p className="text-[10px] text-zinc-400 line-clamp-1">{mat.description}</p>
                {mat.isPreciousOrRare && (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-zinc-700 text-zinc-300">
                    Precious / Rare Earth
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-400">
          <Info className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-zinc-300">Regulatory Disclaimer:</strong> AI classification is a preliminary estimate to assist sorting. Physical inspection and final handling must strictly follow the receiving MPPCB-authorized recycler's acceptance guidelines.
          </p>
        </div>

      </Card>

      <Card className="p-6 sm:p-8 space-y-5">
        <div className="border-b border-zinc-800 pb-4">
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-5 bg-white rounded-full" />
            What Should I Do With It?
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Follow this practical environmental hierarchy before choosing recycling:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className={`p-4 rounded-2xl border transition-all ${
            analysis.recommendationHierarchy.reuse.possible
              ? 'bg-zinc-950 border-zinc-700'
              : 'bg-zinc-950/40 border-zinc-850 opacity-60'
          }`}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-white font-bold text-xs">
                1
              </div>
              <span className="font-extrabold text-sm text-zinc-200">Reuse First</span>
              {analysis.recommendationHierarchy.reuse.possible && (
                <Badge variant="white" className="ml-auto text-[9px]">
                  Viable
                </Badge>
              )}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {analysis.recommendationHierarchy.reuse.tip}
            </p>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            analysis.recommendationHierarchy.repair.possible
              ? 'bg-zinc-950 border-zinc-700'
              : 'bg-zinc-950/40 border-zinc-850 opacity-60'
          }`}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-white font-bold text-xs">
                2
              </div>
              <span className="font-extrabold text-sm text-zinc-200">Repair & Extend Life</span>
              {analysis.recommendationHierarchy.repair.estimatedCostRangeInInr && (
                <Badge variant="outline" className="ml-auto text-[9px] border-zinc-700 text-zinc-300">
                  Est: {analysis.recommendationHierarchy.repair.estimatedCostRangeInInr}
                </Badge>
              )}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {analysis.recommendationHierarchy.repair.tip}
            </p>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            analysis.recommendationHierarchy.donate.possible
              ? 'bg-zinc-950 border-zinc-700'
              : 'bg-zinc-950/40 border-zinc-850 opacity-60'
          }`}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-white font-bold text-xs">
                3
              </div>
              <span className="font-extrabold text-sm text-zinc-200">Donate / Refurbish</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {analysis.recommendationHierarchy.donate.tip}
            </p>
          </div>

          <div className="p-4 rounded-2xl border bg-zinc-950 border-zinc-600">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black font-extrabold text-xs">
                4
              </div>
              <span className="font-extrabold text-sm text-white">Authorized E-Waste Recycling</span>
              <Badge variant="white" className="ml-auto text-[9px]">
                MPPCB Channel
              </Badge>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {analysis.recommendationHierarchy.recycle.action}
            </p>
            <div className="mt-2 text-[11px] text-zinc-400 font-medium">
              💡 {analysis.recommendationHierarchy.recycle.environmentalBenefit}
            </div>
          </div>

        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="shimmer"
            size="lg"
            onClick={() => onFindRecyclers(analysis.category, analysis.detectedName)}
            className="w-full sm:flex-1 py-4 text-xs sm:text-sm"
          >
            <MapPin className="w-4 h-4 mr-1.5" />
            Find Authorized Recyclers in Gwalior →
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onResetScan}
            className="w-full sm:w-auto py-4 text-xs sm:text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Scan Another Item
          </Button>
        </div>

      </Card>

    </div>
  );
};
