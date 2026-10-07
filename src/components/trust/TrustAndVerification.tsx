import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Layers,
  Cpu
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DecryptedText } from '../reactbits/DecryptedText';
import { HandwrittenNote } from '../annotations/HandwrittenNote';
import { SpotlightCard } from '../reactbits/SpotlightCard';

export const TrustAndVerification: React.FC = () => {
  const [reportFacilityName, setReportFacilityName] = useState('');
  const [reportReason, setReportReason] = useState('Incorrect phone number or address');
  const [reportNotes, setReportNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeElement, setActiveElement] = useState<'Hg' | 'Pb' | 'Cd' | 'Li'>('Hg');

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportFacilityName.trim()) return;

    StorageService.saveReportedRecycler({
      recyclerId: 'custom-report-' + Date.now(),
      recyclerName: reportFacilityName.trim(),
      reason: reportReason,
      details: reportNotes.trim(),
      date: new Date().toISOString()
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReportFacilityName('');
      setReportNotes('');
    }, 2500);
  };

  const toxicElements = {
    Hg: {
      symbol: 'Hg',
      name: 'Mercury',
      atomicNumber: 80,
      foundIn: 'CCFL display backlights, tilt switches, legacy thermostats',
      toxicity: 'Severe neurotoxin. Vapor inhalation bio-accumulates in the brain and nervous system, leading to cognitive and motor impairment.',
      handling: 'Never crush or break fluorescent tubes. Store in sealed double-layer polyethylene with cushioning.',
    },
    Pb: {
      symbol: 'Pb',
      name: 'Lead',
      atomicNumber: 82,
      foundIn: 'CRT monitor funnel glass (up to 2.5kg per screen), leaded solder on pre-RoHS PCBs',
      toxicity: 'Causes irreversible neurological damage, kidney failure, and developmental disorders in children when leached into groundwater.',
      handling: 'Wear nitrile gloves. Do not fracture glass. Divert only to pyrometallurgical smelters.',
    },
    Cd: {
      symbol: 'Cd',
      name: 'Cadmium',
      atomicNumber: 48,
      foundIn: 'Ni-Cd rechargeable batteries, surface-mount chip resistors, infrared detectors',
      toxicity: 'Human carcinogen. Ingestion or inhalation causes severe kidney disease and irreversible bone demineralization (Itai-itai disease).',
      handling: 'Seal in corrosion-proof container. Keep isolated from moisture and acidic substances.',
    },
    Li: {
      symbol: 'Li',
      name: 'Lithium',
      atomicNumber: 3,
      foundIn: 'Smartphones, laptops, vape batteries, power tools',
      toxicity: 'Extreme thermal runaway risk. Exposure to air or puncture creates explosive 600°C combustion emitting toxic hydrofluoric acid gas.',
      handling: 'Tape battery terminals with non-conductive vinyl tape. Store in vermiculite or dry sand box.',
    },
  };

  const verificationHierarchy = [
    {
      tier: 'Tier 1: Government Regulatory License (Highest)',
      badge: 'MPPCB / CPCB Authorized Recycler',
      description: 'Official authorization granted by Madhya Pradesh Pollution Control Board (MPPCB) under E-Waste (Management) Rules, 2022 with valid Consent to Operate (CTO) and industrial air/water pollution scrubbers.'
    },
    {
      tier: 'Tier 2: Registered PRO / EPR Channel',
      badge: 'CPCB EPR Takeback Partner',
      description: 'Nationally registered Producer Responsibility Organizations (e.g. Karo Sambhav, Namo E-Waste, Attero) legally contracted with electronics manufacturers for audited circular collection and dismantling.'
    },
    {
      tier: 'Tier 3: Municipal Clean Drop Point',
      badge: 'GMC Swachh Survekshan E-Waste Center',
      description: 'Designated civic e-waste collection receptacles run by Gwalior Municipal Corporation (GMC) where materials are batched and transferred directly to MPPCB authorized units.'
    },
    {
      tier: 'Tier 4: User / Community Submitted Listing',
      badge: 'Unverified Community Submission',
      description: 'Crowdsourced recommendations. Strictly segregated and marked with a provisional caution badge until physically audited and verified by our project cell against government gazettes.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Edge Architecture & LiteRT Hardware Dossier */}
      <SpotlightCard className="p-6 sm:p-8 space-y-6 bg-zinc-950/80 border border-white/10 border-t-white/20 backdrop-blur-3xl shadow-2xl rounded-3xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <Badge variant="cyan" className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>UN SDG-12 TECHNICAL DOSSIER</span>
              </Badge>
              <Badge variant="success">
                <span>100% OFFLINE</span>
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-space text-white tracking-tight uppercase">
              ECOEDGENET ARCHITECTURE & SPECS
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
              Designed from scratch to operate entirely on-device on low-cost smartphones without internet connectivity.
            </p>
          </div>

          <HandwrittenNote arrow="curved-right" text="runs on $40 Android phones!" color="amber" tilt={2} />
        </div>

        {/* 4 Metric Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">MODEL FOOTPRINT</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">
              <DecryptedText text="346 KB" speed={30} />
            </div>
            <div className="text-[10px] font-mono text-zinc-500">Post-Training INT8 PTQ</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">INFERENCE LATENCY</div>
            <div className="text-2xl font-extrabold font-mono text-cyan-400">
              <DecryptedText text="11.2 MS" speed={30} />
            </div>
            <div className="text-[10px] font-mono text-zinc-500">ARM Cortex-A53 CPU</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">TELEMETRY PRIVACY</div>
            <div className="text-2xl font-extrabold font-mono text-white">
              <DecryptedText text="0 BYTES" speed={30} />
            </div>
            <div className="text-[10px] font-mono text-zinc-500">Zero Cloud Transmission</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">MEMORY CEILING</div>
            <div className="text-2xl font-extrabold font-mono text-amber-400">
              <DecryptedText text="<1.4 MB" speed={30} />
            </div>
            <div className="text-[10px] font-mono text-zinc-500">Fits 2GB RAM Budget</div>
          </div>
        </div>
      </SpotlightCard>

      {/* 2. Interactive Toxic Chemical Profile Inspector */}
      <SpotlightCard className="p-6 sm:p-8 space-y-6 bg-zinc-950/80 border border-white/10 border-t-white/20 backdrop-blur-3xl shadow-2xl rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
              BIO-HAZARD DIAGNOSTIC MATRIX
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-space text-white tracking-tight uppercase">
              INTERACTIVE TOXIC ELEMENT PROFILE
            </h3>
          </div>

          {/* Element Selection Pills */}
          <div className="flex items-center gap-2">
            {(['Hg', 'Pb', 'Cd', 'Li'] as const).map((el) => (
              <button
                key={el}
                type="button"
                onClick={() => setActiveElement(el)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  activeElement === el
                    ? 'bg-white text-black shadow-lg shadow-white/20 scale-105'
                    : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {el} : {toxicElements[el].name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Element Detail Box */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/40 text-orange-400 font-mono font-black text-lg flex items-center justify-center">
                {toxicElements[activeElement].symbol}
              </div>
              <div>
                <div className="text-base font-bold font-mono text-white">
                  {toxicElements[activeElement].name} (Atomic #{toxicElements[activeElement].atomicNumber})
                </div>
                <div className="text-xs text-zinc-400 font-mono">
                  Primary source: {toxicElements[activeElement].foundIn}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs font-sans leading-relaxed border-t border-white/5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-orange-400 font-bold block">
                PATHOLOGY & TOXICOLOGY:
              </span>
              <p className="text-zinc-300">{toxicElements[activeElement].toxicity}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                SAFETY & CONTAINMENT MANDATE:
              </span>
              <p className="text-zinc-300">{toxicElements[activeElement].handling}</p>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* 3. 4-Tier Verification Hierarchy Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-space text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>THE 4-TIER RECYCLER VERIFICATION PROTOCOL</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verificationHierarchy.map((h, idx) => (
            <Card key={idx} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">{h.tier}</span>
              </div>
              <Badge variant="white" className="text-xs">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-black" />
                {h.badge}
              </Badge>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {h.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Formal Recycling vs Informal Scrap Burning Comparison */}
      <SpotlightCard className="p-6 sm:p-8 space-y-6 bg-zinc-950/80 border border-white/10 rounded-3xl">
        <h3 className="text-xl font-bold font-space text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <span>AUTHORIZED FORMAL RECYCLERS VS INFORMAL SCRAP BURNING (KABADIWALAS)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          {/* Formal Recycling */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-emerald-500/40 space-y-3 shadow-[0_0_25px_rgba(16,185,129,0.08)]">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>MPPCB Authorized Facilities (Our Dataset)</span>
            </div>
            <ul className="space-y-2 text-zinc-300 list-disc list-inside font-sans">
              <li>Mechanical shredding and air-classification in sealed negative-pressure chambers.</li>
              <li>High-efficiency catalytic scrubbers capturing 99.8% of lead, mercury, and bromine vapors.</li>
              <li>Official Certificate of Destruction & Form-6 Manifest documentation provided.</li>
              <li>Fair trade value and formal circular economy compliance.</li>
            </ul>
          </div>

          {/* Informal Scrap Dealers */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-orange-500/40 space-y-3 shadow-[0_0_25px_rgba(255,87,34,0.08)]">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
              <Flame className="w-5 h-5 text-orange-400" />
              <span>Unregulated Scrap / Informal Burning</span>
            </div>
            <ul className="space-y-2 text-zinc-400 list-disc list-inside font-sans">
              <li>Open-air bonfire cable burning releasing carcinogenic dioxins into Gwalior's air.</li>
              <li>Cyanide and nitric acid baths to extract gold pins, dumping acidic residue into local drains.</li>
              <li>Severe respiratory disease, neurological damage, and heavy metal groundwater pollution.</li>
            </ul>
          </div>
        </div>
      </SpotlightCard>

      {/* 5. Inaccurate Recycler Report Form */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-space text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-white" />
            <span>REPORT INACCURATE RECYCLER DATA</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Did you encounter a disconnected phone, moved facility, or refusal to accept listed e-waste in Gwalior? Submit a report so our student team can audit and update the live database.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-700 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-bold text-white text-sm font-space">Thank You for Your Report!</div>
            <p className="text-xs text-zinc-400">Our Gwalior verification team will inspect this record against MPPCB registries.</p>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Facility Name / Location in Gwalior</label>
                <input
                  type="text"
                  required
                  value={reportFacilityName}
                  onChange={e => setReportFacilityName(e.target.value)}
                  placeholder="e.g. Recycler in Lashkar or Malanpur"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Incorrect phone number or unresponsive">Incorrect phone number or unresponsive</option>
                  <option value="Facility moved or closed">Facility moved or closed</option>
                  <option value="Refused to accept listed category">Refused to accept listed category</option>
                  <option value="Suspected unauthorized operation">Suspected unauthorized operation</option>
                  <option value="Other discrepancy">Other discrepancy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Observations / Additional Context</label>
              <textarea
                rows={2}
                required
                value={reportNotes}
                onChange={e => setReportNotes(e.target.value)}
                placeholder="Describe what occurred during your contact or visit..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400 resize-none font-sans text-xs"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="text-xs font-mono font-bold uppercase tracking-wider"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              SUBMIT FACILITY AUDIT REPORT
            </Button>
          </form>
        )}
      </Card>

    </div>
  );
};
