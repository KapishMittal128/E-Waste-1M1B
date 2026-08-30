import React, { useState, useEffect } from 'react';
import { 
  EWasteCategory, 
  EWasteItemAnalysis, 
  Recycler 
} from './types';
import { StorageService } from './services/storage';
import { AIVisionService, NotEWasteError } from './services/aiVision';
import { GWALIOR_LOCALITIES } from './data/recyclers';

import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { ScannerHero } from './components/scanner/ScannerHero';
import { CameraModal } from './components/scanner/CameraModal';
import { ScanResultCard } from './components/scanner/ScanResultCard';
import { RecyclerLocator } from './components/recyclers/RecyclerLocator';
import { SchoolMode } from './components/school/SchoolMode';
import { TrustAndVerification } from './components/trust/TrustAndVerification';
import { NotEWasteCard } from './components/scanner/NotEWasteCard';

import { PreCallModal } from './components/modals/PreCallModal';
import { ShareDetailsModal } from './components/modals/ShareDetailsModal';
import { ReportRecyclerModal } from './components/modals/ReportRecyclerModal';
import { RecyclerDossierModal } from './components/modals/RecyclerDossierModal';
import { HazardGuideModal } from './components/modals/HazardGuideModal';
import { Heart } from 'lucide-react';

type ScanState = 'idle' | 'analyzing' | 'result' | 'not_ewaste';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('scanner');
  const [selectedLocality, setSelectedLocality] = useState<string>(GWALIOR_LOCALITIES[0].name);

  const [scanState, setScanState] = useState<ScanState>('idle');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EWasteItemAnalysis | null>(null);
  const [notEWasteDescription, setNotEWasteDescription] = useState<string>('');

  const [filterCategory, setFilterCategory] = useState<EWasteCategory | 'All'>('All');
  const [highlightItemName, setHighlightItemName] = useState<string | undefined>(undefined);

  const [activePreCallRecycler, setActivePreCallRecycler] = useState<Recycler | null>(null);
  const [activeShareRecycler, setActiveShareRecycler] = useState<Recycler | null>(null);
  const [activeDossierRecycler, setActiveDossierRecycler] = useState<Recycler | null>(null);
  const [activeReportRecycler, setActiveReportRecycler] = useState<Recycler | null>(null);
  const [isHazardGuideOpen, setIsHazardGuideOpen] = useState(false);

  useEffect(() => {
    const savedLoc = StorageService.getSavedUserLocation();
    if (savedLoc) setSelectedLocality(savedLoc.name);
  }, []);

  const handleLocalityChange = (locName: string) => {
    setSelectedLocality(locName);
    const found = GWALIOR_LOCALITIES.find(l => l.name === locName);
    if (found) StorageService.saveUserLocation(found);
  };

  const handleStartCamera = () => setIsCameraOpen(true);

  const handleUploadImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') handleCaptureImage(reader.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleCaptureImage = async (dataUrl: string) => {
    setIsCameraOpen(false);
    setScanState('analyzing');
    setAnalysisResult(null);

    try {
      const result = await AIVisionService.analyzeImage(dataUrl);
      setAnalysisResult(result);
      setScanState('result');
    } catch (err: any) {
      if (err instanceof NotEWasteError) {
        setNotEWasteDescription(err.description);
        setScanState('not_ewaste');
      } else {
        console.error(err);
        alert('Analysis failed. Please try again or use the manual search below.');
        setScanState('idle');
      }
    }
  };

  const handleSearchManual = async (query: string) => {
    setScanState('analyzing');
    setAnalysisResult(null);

    try {
      const result = await AIVisionService.analyzeImage(undefined, query);
      setAnalysisResult(result);
      setScanState('result');
    } catch (err) {
      console.error(err);
      setScanState('idle');
    }
  };

  // THIS WORKS YAYAYA (O(1) hashmap matching)
  const handleSelectPreset = async (presetKey: string) => {
    setScanState('analyzing');
    setAnalysisResult(null);

    try {
      const result = await AIVisionService.analyzeImage(undefined, undefined, presetKey);
      setAnalysisResult(result);
      setScanState('result');
    } catch (err) {
      console.error(err);
      setScanState('idle');
    }
  };

  const handleFindRecyclersFromScan = (category: EWasteCategory, itemName: string) => {
    setFilterCategory(category);
    setHighlightItemName(itemName);
    setActiveTab('recyclers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setScanState('idle');
    setAnalysisResult(null);
    setNotEWasteDescription('');
  };

  const renderScannerContent = () => {
    if (scanState === 'not_ewaste') {
      return <NotEWasteCard description={notEWasteDescription} onTryAgain={handleReset} />;
    }
    if (scanState === 'result' && analysisResult) {
      return (
        <ScanResultCard
          analysis={analysisResult}
          onFindRecyclers={handleFindRecyclersFromScan}
          onResetScan={handleReset}
        />
      );
    }
    return (
      <ScannerHero
        onStartCamera={handleStartCamera}
        onUploadImage={handleUploadImage}
        onSearchManual={handleSearchManual}
        onSelectPreset={handleSelectPreset}
        isAnalyzing={scanState === 'analyzing'}
      />
    );
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans">
      
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLocality={selectedLocality}
        setSelectedLocality={handleLocalityChange}
        onOpenHazardGuide={() => setIsHazardGuideOpen(true)}
      />

      <main className="flex-1 pb-24 md:pb-12">
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            {renderScannerContent()}
          </div>
        )}

        {activeTab === 'recyclers' && (
          <RecyclerLocator
            selectedCategory={filterCategory}
            highlightItemName={highlightItemName}
            selectedLocality={selectedLocality}
            setSelectedLocality={handleLocalityChange}
            onCallRecycler={rec => setActivePreCallRecycler(rec)}
            onShareDetails={rec => setActiveShareRecycler(rec)}
            onViewDetails={rec => setActiveDossierRecycler(rec)}
            onReportRecycler={rec => setActiveReportRecycler(rec)}
          />
        )}

        {activeTab === 'school' && <SchoolMode />}
        {activeTab === 'trust' && <TrustAndVerification />}
      </main>

      <footer className="hidden md:block border-t border-zinc-800/80 bg-black py-8 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-extrabold text-white flex items-center gap-2 justify-center sm:justify-start">
              <span>EWaste Off • Gwalior Action Tool</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-300 font-medium inline-flex items-center gap-1">
                made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by <strong className="text-white">Kapish Mittal</strong>
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Connecting Gwalior citizens and institutions directly with MPPCB-authorized e-waste recyclers.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => setActiveTab('trust')} className="text-zinc-400 hover:text-white transition-colors">
              MPPCB Verification Protocol
            </button>
            <span>•</span>
            <button onClick={() => setIsHazardGuideOpen(true)} className="text-zinc-300 hover:text-white transition-colors">
              Hazardous E-Waste Safety Guide
            </button>
          </div>
        </div>
      </footer>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCaptureImage={handleCaptureImage}
      />

      <PreCallModal isOpen={!!activePreCallRecycler} recycler={activePreCallRecycler} onClose={() => setActivePreCallRecycler(null)} />
      <ShareDetailsModal isOpen={!!activeShareRecycler} recycler={activeShareRecycler} itemAnalysis={analysisResult} userLocality={selectedLocality} onClose={() => setActiveShareRecycler(null)} />
      <RecyclerDossierModal isOpen={!!activeDossierRecycler} recycler={activeDossierRecycler} onClose={() => setActiveDossierRecycler(null)} />
      <ReportRecyclerModal isOpen={!!activeReportRecycler} recycler={activeReportRecycler} onClose={() => setActiveReportRecycler(null)} />
      <HazardGuideModal isOpen={isHazardGuideOpen} onClose={() => setIsHazardGuideOpen(false)} />

    </div>
  );
};

export default App;
