import React, { useState } from 'react';
import { Recycler } from '../../types';
import { Phone, CheckSquare, Square, X, PhoneCall } from 'lucide-react';
import { Button } from '../ui/Button';

interface PreCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  recycler: Recycler | null;
}

export const PreCallModal: React.FC<PreCallModalProps> = ({
  isOpen,
  onClose,
  recycler
}) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({
    0: true,
    1: true,
    2: false,
    3: false
  });

  if (!isOpen || !recycler) return null;

  const checklist = [
    {
      title: 'Item Acceptance Check',
      prompt: `“Do you accept ${recycler.acceptedCategories[0] || 'my electronic item'} from individual households?”`
    },
    {
      title: 'Drop-off vs Doorstep Pickup',
      prompt: `“Can I drop it off today at ${recycler.locality}, or do you offer home collection in Gwalior?”`
    },
    {
      title: 'Documentation & Receipts',
      prompt: '“Do you provide an e-waste disposal acknowledgement or Certificate of Destruction?”'
    },
    {
      title: 'Safety / Packaging Guidance',
      prompt: '“Do I need to tape battery terminals or wrap circuit boards before handover?”'
    }
  ];

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCallNow = () => {
    window.location.href = `tel:${recycler.phone}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Pre-Call Verification</h3>
              <p className="text-[11px] text-zinc-400">Questions to ask before visiting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recycler Target Meta */}
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
          <div className="font-bold text-white text-sm">{recycler.name}</div>
          <div className="text-zinc-400 mt-0.5">{recycler.locality}, Gwalior • {recycler.openingHours}</div>
          <div className="font-mono text-zinc-200 mt-1 font-bold">📞 {recycler.phone}</div>
        </div>

        {/* Script Checklist */}
        <div className="space-y-2 text-xs">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Recommended Questions (Tap to tick):
          </span>

          {checklist.map((item, idx) => (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`p-3 rounded-xl border transition-all cursor-pointer select-none space-y-1 ${
                checkedItems[idx]
                  ? 'bg-zinc-950 border-zinc-700'
                  : 'bg-zinc-950/40 border-zinc-850 opacity-70'
              }`}
            >
              <div className="flex items-center gap-2">
                {checkedItems[idx] ? (
                  <CheckSquare className="w-4 h-4 text-white flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                )}
                <span className="font-bold text-zinc-200 text-xs">{item.title}</span>
              </div>
              <p className="text-[11px] text-zinc-400 pl-6 italic">
                {item.prompt}
              </p>
            </div>
          ))}
        </div>

        {/* Direct Call Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleCallNow}
          className="w-full py-3.5 text-xs font-black"
        >
          <PhoneCall className="w-4 h-4 mr-1.5" />
          CALL {recycler.phone} NOW
        </Button>

      </div>
    </div>
  );
};
