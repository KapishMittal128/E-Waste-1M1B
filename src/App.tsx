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
import { FloatingDock, NavTab } from './components/navigation/FloatingDock';
import { Aurora } from './components/reactbits/Aurora';
import { Particles } from './components/reactbits/Particles';
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

  const handleProcessFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') handleCaptureImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) handleProcessFile(file);
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
    } catch (err: any) {
      if (err instanceof NotEWasteError) {
        setNotEWasteDescription(err.description);
        setScanState('not_ewaste');
      } else {
        console.error(err);
        setScanState('idle');
      }
    }
  };

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

  const mapActiveTabToNavTab = (tab: string): NavTab => {
    if (tab === 'recyclers') return 'radar';
    if (tab === 'school') return 'campus';
    if (tab === 'trust') return 'trust';
    return 'scanner';
  };

  const handleDockTabChange = (navTab: NavTab) => {
    if (navTab === 'radar') setActiveTab('recyclers');
    else if (navTab === 'campus') setActiveTab('school');
    else if (navTab === 'trust') setActiveTab('trust');
    else setActiveTab('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        onUploadFile={handleProcessFile}
        onSearchManual={handleSearchManual}
        onSelectPreset={handleSelectPreset}
        isAnalyzing={scanState === 'analyzing'}
        selectedLocality={selectedLocality}
        onLocalityChange={handleLocalityChange}
        onOpenHazardGuide={() => setIsHazardGuideOpen(true)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-zinc-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-200">
      {/* Ambient React Bits Aurora & Particle Canvas */}
      <Aurora speed={0.45} />
      <Particles particleCount={35} particleColor="255, 255, 255" speed={0.25} />

      {activeTab !== 'scanner' && (
        <Header
          onNavigateHome={() => setActiveTab('scanner')}
          selectedLocality={selectedLocality}
          setSelectedLocality={handleLocalityChange}
          onOpenHazardGuide={() => setIsHazardGuideOpen(true)}
        />
      )}

      <main className={`flex-1 relative z-10 ${activeTab !== 'scanner' ? 'sm:pl-16 lg:pl-20 pt-16 sm:pt-20 pb-16' : ''}`}>
        {activeTab === 'scanner' && (
          <div>
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

      {/* Floating Frosted Glass Command Dock on Side */}
      <FloatingDock
        activeTab={mapActiveTabToNavTab(activeTab)}
        onTabChange={handleDockTabChange}
      />

      {/* Footer only on secondary tabs */}
      {activeTab !== 'scanner' && (
        <footer className="border-t border-zinc-800/80 bg-[#070707]/90 backdrop-blur-md py-8 text-xs text-zinc-400 relative z-10 sm:pl-16 lg:pl-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left font-mono">
            <div className="font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <span>EWASTE OFF // GWALIOR REGION</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400 font-medium">
                LEAD: <strong className="text-white">KAPISH MITTAL</strong>
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-sans">
              Autonomous on-device e-waste edge classification & MPPCB authorized recycler verification protocol.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <button onClick={() => setActiveTab('trust')} className="text-zinc-400 hover:text-white transition-colors">
              VERIFICATION PROTOCOL
            </button>
            <span className="text-zinc-600">•</span>
            <button onClick={() => setIsHazardGuideOpen(true)} className="text-zinc-300 hover:text-white transition-colors">
              HAZARD PROTOCOL
            </button>
          </div>
        </div>
      </footer>
      )}

      {/* Modals */}
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
