import React from 'react';
import { XCircle, Camera, Search } from 'lucide-react';
import { Button } from '../ui/Button';

interface NotEWasteCardProps {
  description: string;
  onTryAgain: () => void;
}

export const NotEWasteCard: React.FC<NotEWasteCardProps> = ({ description, onTryAgain }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="text-center space-y-6">
        
        <div className="w-20 h-20 rounded-3xl bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-zinc-400" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-black text-white tracking-tight">
            That's Not E-Waste
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            The AI identified this image as: <span className="text-zinc-200 font-semibold">"{description}"</span>
          </p>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-md mx-auto">
            EWaste Off analyzes electronic devices, components, cables, batteries, and electrical appliances only. Please upload a photo of an actual e-waste item.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-left space-y-3">
          <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Examples of valid e-waste to scan:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
            {[
              '📱 Old smartphones',
              '💻 Broken laptops',
              '🔋 Swollen batteries',
              '📺 CRT televisions',
              '🖥️ Computer monitors',
              '🔌 Chargers & cables',
              '🖨️ Printers & scanners',
              '⚡ Power banks / UPS',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="shimmer"
            size="lg"
            onClick={onTryAgain}
            className="py-4 text-sm"
          >
            <Camera className="w-4 h-4 mr-2" />
            Scan Again
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={onTryAgain}
            className="py-4 text-sm"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Manually Instead
          </Button>
        </div>

      </div>
    </div>
  );
};
