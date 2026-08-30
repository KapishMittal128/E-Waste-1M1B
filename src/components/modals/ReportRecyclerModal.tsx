import React, { useState } from 'react';
import { Recycler } from '../../types';
import { StorageService } from '../../services/storage';
import { AlertCircle, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';

interface ReportRecyclerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recycler: Recycler | null;
}

export const ReportRecyclerModal: React.FC<ReportRecyclerModalProps> = ({
  isOpen,
  onClose,
  recycler
}) => {
  const [reason, setReason] = useState('Incorrect phone number or unresponsive');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !recycler) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    StorageService.saveReportedRecycler({
      recyclerId: recycler.id,
      recyclerName: recycler.name,
      reason,
      details: notes.trim(),
      date: new Date().toISOString()
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Report Recycler Issue</h3>
              <p className="text-[11px] text-zinc-400">Flag inaccurate contact or facility data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-700 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-white mx-auto" />
            <div className="font-bold text-white text-sm">Report Dispatched</div>
            <p className="text-xs text-zinc-400">Our Gwalior verification cell will re-audit this facility.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="font-bold text-white text-xs">{recycler.name}</div>
              <div className="text-[11px] text-zinc-400">{recycler.address}, {recycler.locality}</div>
            </div>

            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Issue Encountered</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
              >
                <option value="Incorrect phone number or unresponsive">Incorrect phone number or unresponsive</option>
                <option value="Facility moved or closed">Facility moved or closed</option>
                <option value="Refused to accept listed category">Refused to accept listed category</option>
                <option value="Suspected informal scrap operation">Suspected informal scrap operation</option>
                <option value="Other discrepancy">Other discrepancy</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Details (Optional)</label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="What occurred during your interaction?"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-500 resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-3.5 text-xs font-black"
            >
              <ShieldAlert className="w-4 h-4 mr-1.5" />
              SUBMIT AUDIT REPORT
            </Button>
          </form>
        )}

      </div>
    </div>
  );
};
