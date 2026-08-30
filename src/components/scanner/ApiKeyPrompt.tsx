import React, { useState } from 'react';
import { Key, ExternalLink, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ApiKeyPromptProps {
  onRetry: () => void;
}

export const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onRetry }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    localStorage.setItem('ewaste_gemini_api_key', apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      onRetry();
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card className="p-8 space-y-6">

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <Key className="w-7 h-7 text-zinc-200" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Gemini AI Key Required</h2>
            <p className="text-xs text-zinc-400 mt-0.5">One-time setup to unlock real image analysis</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs text-zinc-300 leading-relaxed">
          <p className="font-bold text-zinc-200">Why is this needed?</p>
          <p>
            EWaste Off uses <strong className="text-white">Google Gemini Vision AI</strong> to actually look at your photo and identify what electronic device it is. Without an API key, the app cannot connect to the AI engine.
          </p>
          <p className="text-zinc-400">
            The free Gemini API tier includes <strong className="text-zinc-300">1,500 requests/day</strong> — more than enough for personal use. Your key is stored only in your browser.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">How to get a free API key:</p>
          <ol className="space-y-2 text-xs text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-200 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-2 hover:no-underline">aistudio.google.com/app/apikey</a></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-200 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span>Sign in with Google and click <strong className="text-zinc-200">"Create API Key"</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-200 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span>Copy the key and paste it below</span>
            </li>
          </ol>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white underline underline-offset-2 transition-colors"
          >
            Open Google AI Studio <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
            Paste your Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 pr-12 text-sm text-white font-mono focus:outline-none focus:border-zinc-500 transition-all"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-zinc-500">Stored locally in your browser. Never sent anywhere except Google's API.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {saved ? (
            <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-sm text-white font-bold">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Saved! Reloading...
            </div>
          ) : (
            <Button
              variant="shimmer"
              size="lg"
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 py-4 text-sm"
            >
              <Key className="w-4 h-4 mr-2" />
              Save Key & Enable AI Scanning
            </Button>
          )}
          <Button
            variant="secondary"
            size="lg"
            onClick={onRetry}
            className="sm:w-auto py-4 text-sm"
          >
            Use Manual Search Instead
          </Button>
        </div>

      </Card>
    </div>
  );
};
