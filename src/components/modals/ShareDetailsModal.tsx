import React, { useState } from 'react';
import { Recycler, EWasteItemAnalysis } from '../../types';
import { Share2, Copy, Check, MessageSquare, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface ShareDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recycler: Recycler | null;
  itemAnalysis?: EWasteItemAnalysis | null;
  userLocality: string;
}

export const ShareDetailsModal: React.FC<ShareDetailsModalProps> = ({
  isOpen,
  onClose,
  recycler,
  itemAnalysis,
  userLocality
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !recycler) return null;

  const itemName = itemAnalysis?.detectedName || 'Electronic Waste Item (Phone / Battery / Computer)';
  const itemCategory = itemAnalysis?.category || 'General Electronics';
  const itemCondition = itemAnalysis?.condition || 'Defunct / Scrap';
  const itemWeight = itemAnalysis?.estimatedWeightKg || '~0.5';

  const shareText = `*E-Waste Disposal Inquiry — Gwalior*\n\nHello *${recycler.name}*,\n\nI found your authorized facility via the *EWaste Off* platform. I would like to arrange responsible disposal for the following electronic item:\n\n• *Item:* ${itemName}\n• *Category:* ${itemCategory}\n• *Condition:* ${itemCondition}\n• *Estimated Weight:* ${itemWeight} kg\n• *My Location:* ${userLocality}, Gwalior\n\nPlease let me know if you can accept this today or provide doorstep collection.\n\nThank you!`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = recycler.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Share E-Waste Details</h3>
              <p className="text-xs text-zinc-400">Pre-formatted inquiry message for WhatsApp & SMS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Preview Box */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Generated Message Template:
          </span>
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
            {shareText}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button
            variant="secondary"
            size="md"
            onClick={handleCopyText}
            className="flex-1 text-xs"
          >
            {copied ? <Check className="w-4 h-4 text-white mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Text'}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenWhatsApp}
            className="flex-1 text-xs"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Send via WhatsApp
          </Button>
        </div>

      </div>
    </div>
  );
};
