import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Layers
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const TrustAndVerification: React.FC = () => {
  const [reportFacilityName, setReportFacilityName] = useState('');
  const [reportReason, setReportReason] = useState('Incorrect phone number or address');
  const [reportNotes, setReportNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
      
      {/* Header */}
      <Card className="p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2">
          <Badge variant="outline" className="text-zinc-300 border-zinc-800 bg-zinc-950">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
            <span>Trust, Integrity & Regulatory Protocol</span>
          </Badge>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Verification Hierarchy & Data Transparency
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Why data credibility matters: In informal e-waste handling, deceptive scrap dealers claim to "recycle" while burning electronics in back alleys. Here is how EWaste Off rigorously validates every listed recycler in Gwalior.
        </p>
      </Card>

      {/* 4-Tier Verification Hierarchy Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-white" />
          The 4-Tier Recycler Verification Protocol
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verificationHierarchy.map((h, idx) => (
            <Card key={idx} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{h.tier}</span>
              </div>
              <Badge variant="white" className="text-xs">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {h.badge}
              </Badge>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {h.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Formal Recycling vs Informal Scrap Burning Comparison */}
      <Card className="p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-white" />
          Authorized Formal Recyclers vs Informal Scrap Dealers (Kabadiwalas)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          
          {/* Formal Recycling */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-700 space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>MPPCB Authorized Facilities (Our Dataset)</span>
            </div>
            <ul className="space-y-2 text-zinc-300 list-disc list-inside">
              <li>Mechanical shredding and air-classification in sealed negative-pressure chambers.</li>
              <li>High-efficiency catalytic scrubbers capturing 99.8% of lead, mercury, and bromine vapors.</li>
              <li>Official Certificate of Destruction & Form-6 Manifest documentation provided.</li>
              <li>Fair trade value and formal circular economy compliance.</li>
            </ul>
          </div>

          {/* Informal Scrap Dealers */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-zinc-300 font-extrabold text-sm">
              <Flame className="w-5 h-5 text-zinc-400" />
              <span>Unregulated Scrap / Informal Burning</span>
            </div>
            <ul className="space-y-2 text-zinc-400 list-disc list-inside">
              <li>Open-air bonfire cable burning releasing carcinogenic dioxins into Gwalior's air.</li>
              <li>Cyanide and nitric acid baths to extract gold pins, dumping acidic residue into local drains.</li>
              <li>Severe respiratory disease, neurological damage, and heavy metal groundwater pollution.</li>
              <li>Zero safety equipment for scrap workers.</li>
            </ul>
          </div>

        </div>
      </Card>

      {/* Report Incorrect Recycler Information Form */}
      <Card className="p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-white" />
            Report Inaccurate Recycler Data
          </h3>
          <p className="text-xs text-zinc-400">
            Did you encounter a disconnected phone, moved facility, or refusal to accept listed e-waste in Gwalior? Submit a report so our student team can audit and update the live database.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-700 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-white mx-auto" />
            <div className="font-bold text-white text-sm">Thank You for Your Report!</div>
            <p className="text-xs text-zinc-400">Our Gwalior verification team will inspect this record against MPPCB registries.</p>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Facility Name / Location in Gwalior</label>
                <input
                  type="text"
                  required
                  value={reportFacilityName}
                  onChange={e => setReportFacilityName(e.target.value)}
                  placeholder="e.g. Recycler in Lashkar or Malanpur"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
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
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-500 resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="text-xs font-black"
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
