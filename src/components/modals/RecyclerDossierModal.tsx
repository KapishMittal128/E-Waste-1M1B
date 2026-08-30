import React from 'react';
import { Recycler } from '../../types';
import { ShieldCheck, X, FileText, CheckCircle2, Phone, MapPin, Building2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface RecyclerDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  recycler: Recycler | null;
}

export const RecyclerDossierModal: React.FC<RecyclerDossierModalProps> = ({
  isOpen,
  onClose,
  recycler
}) => {
  if (!isOpen || !recycler) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Regulatory Verification Dossier</h3>
              <p className="text-xs text-zinc-400">MPPCB & CPCB Compliance Audit Record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Facility Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="white" className="text-[10px]">
              {recycler.authorizationTier}
            </Badge>
          </div>
          <h2 className="text-xl font-black text-white">{recycler.name}</h2>
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
            <span>{recycler.address}, {recycler.locality}, Gwalior</span>
          </div>
        </div>

        {/* Audit Details Box */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
          <div className="font-bold text-zinc-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-white" />
            <span>Statutory Registration & Licenses</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">State Registration Number</span>
              <div className="font-mono font-bold text-white text-xs mt-0.5">{recycler.registrationNumber}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Verification Registry Date</span>
              <div className="font-mono font-bold text-white text-xs mt-0.5">{recycler.lastVerifiedDate}</div>
            </div>
          </div>

          <div className="text-zinc-400 leading-relaxed text-[11px]">
            <strong className="text-zinc-200">Verification Source:</strong> {recycler.verificationSource}
          </div>
        </div>

        {/* Accepted Categories & Capabilities */}
        <div className="space-y-2 text-xs">
          <div className="font-bold text-zinc-300">Certified Recycling Capabilities</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recycler.acceptedCategories.map((cat, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0" />
                <span>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
          <div className="font-bold text-zinc-200">Direct Logistics Contacts</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-400">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-white" />
              <strong className="text-zinc-200">{recycler.phone}</strong>
            </div>
            {recycler.email && (
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                <span className="truncate">{recycler.email}</span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={onClose}
          className="w-full text-xs"
        >
          Close Dossier
        </Button>

      </div>
    </div>
  );
};
