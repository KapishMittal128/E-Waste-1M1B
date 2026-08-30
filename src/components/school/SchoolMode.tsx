import React, { useState, useEffect } from 'react';
import { BinPlacementRequest } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  GraduationCap, 
  FileText, 
  PlusCircle, 
  Building, 
  Phone, 
  MapPin, 
  Printer, 
  Copy, 
  Check, 
  X,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const SchoolMode: React.FC = () => {
  const [requests, setRequests] = useState<BinPlacementRequest[]>([]);
  const [showBinRequestModal, setShowBinRequestModal] = useState(false);
  const [showAgreementDoc, setShowAgreementDoc] = useState<BinPlacementRequest | null>(null);
  const [copiedDoc, setCopiedDoc] = useState(false);

  // Form State
  const [schoolName, setSchoolName] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorPhone, setCoordinatorPhone] = useState('');
  const [coordinatorEmail, setCoordinatorEmail] = useState('');
  const [address, setAddress] = useState('');
  const [studentStrength, setStudentStrength] = useState<number | ''>('');
  const [binLocation, setBinLocation] = useState('');
  const [pledgeAccepted, setPledgeAccepted] = useState(false);

  useEffect(() => {
    setRequests(StorageService.getBinRequests());
  }, []);

  const handleBinRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !pledgeAccepted) return;

    const req = StorageService.addBinRequest({
      schoolName: schoolName.trim(),
      principalName: principalName.trim(),
      coordinatorName: coordinatorName.trim(),
      coordinatorPhone: coordinatorPhone.trim(),
      coordinatorEmail: coordinatorEmail.trim(),
      schoolAddress: address.trim(),
      approxStudentStrength: Number(studentStrength) || 0,
      preferredBinLocation: binLocation.trim(),
      pledgeAccepted
    });

    setRequests(StorageService.getBinRequests());
    setShowBinRequestModal(false);
    setShowAgreementDoc(req);

    // Reset form
    setSchoolName('');
    setPrincipalName('');
    setCoordinatorName('');
    setCoordinatorPhone('');
    setCoordinatorEmail('');
    setAddress('');
    setStudentStrength('');
    setBinLocation('');
    setPledgeAccepted(false);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <Card className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-zinc-300 border-zinc-800 bg-zinc-950">
            <GraduationCap className="w-3.5 h-3.5 text-zinc-300" />
            <span>Institutional E-Waste Bin Program • Gwalior</span>
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            School & Campus Collection Bins
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Educational institutes in Gwalior can request dedicated 50kg safe e-waste collection bins connected directly to MPPCB-authorized recyclers for periodic bulk clearances.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowBinRequestModal(true)}
          className="self-start md:self-auto text-xs sm:text-sm"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Request an E-Waste Bin for Your Campus
        </Button>
      </Card>

      {/* Program Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        <Card className="p-5 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold">
            1
          </div>
          <h4 className="font-bold text-white text-sm">Formal Institutional Request</h4>
          <p className="text-zinc-400 leading-relaxed">
            School coordinators submit campus details, estimated student strength, and proposed indoor bin location (e.g. Science Lab or Reception).
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold">
            2
          </div>
          <h4 className="font-bold text-white text-sm">MPPCB Recycler Dispatch</h4>
          <p className="text-zinc-400 leading-relaxed">
            Authorized regional PRO partners (e.g. Karo Sambhav, Greenscape) install a tamper-resistant steel e-waste receptacle at zero cost.
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold">
            3
          </div>
          <h4 className="font-bold text-white text-sm">Destruction Certificate</h4>
          <p className="text-zinc-400 leading-relaxed">
            When bins are filled, collection vans clear the contents and issue an official Form-6 Green Destruction Certificate to the institution.
          </p>
        </Card>

      </div>

      {/* Existing Requests Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Your Submitted Campus Requests</h3>
            <p className="text-xs text-zinc-400">Track the status of bin placement applications for Gwalior institutes</p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 text-center bg-zinc-950/60 rounded-2xl border border-zinc-800 space-y-3">
            <Building className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              No institutional requests submitted yet from this device. Click the button above to request a collection bin for your school, college, or coaching campus in Gwalior.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBinRequestModal(true)}
              className="text-xs"
            >
              Submit School Request
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map(req => (
              <div key={req.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{req.schoolName}</span>
                  <Badge variant="white" className="text-[10px]">
                    {req.status}
                  </Badge>
                </div>

                <div className="space-y-1 text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{req.schoolAddress}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{req.coordinatorName} ({req.coordinatorPhone})</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Requested: {req.requestDate}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">Location: {req.preferredBinLocation}</span>
                  <button
                    onClick={() => setShowAgreementDoc(req)}
                    className="text-white hover:underline text-xs font-semibold"
                  >
                    View Document →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Request E-Waste Bin Form Modal */}
      {showBinRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Request an E-Waste Collection Bin</h3>
                  <p className="text-xs text-zinc-400">Official Placement & Recycler Logistics Application</p>
                </div>
              </div>
              <button
                onClick={() => setShowBinRequestModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBinRequestSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">School / Institute Name</label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  placeholder="e.g. Scindia Kanya Vidyalaya / Gwalior Institute of Technology"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Principal / Head of Institute</label>
                  <input
                    type="text"
                    required
                    value={principalName}
                    onChange={e => setPrincipalName(e.target.value)}
                    placeholder="Name of Principal / Director"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Teacher / Coordinator Name</label>
                  <input
                    type="text"
                    required
                    value={coordinatorName}
                    onChange={e => setCoordinatorName(e.target.value)}
                    placeholder="Eco-Club Coordinator / Admin Lead"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Coordinator Phone</label>
                  <input
                    type="text"
                    required
                    value={coordinatorPhone}
                    onChange={e => setCoordinatorPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Coordinator Email (Optional)</label>
                  <input
                    type="email"
                    value={coordinatorEmail}
                    onChange={e => setCoordinatorEmail(e.target.value)}
                    placeholder="coordinator@school.edu.in"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Full Campus Address (Gwalior)</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Street, Locality, Gwalior"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Approx. Student Strength</label>
                  <input
                    type="number"
                    required
                    value={studentStrength}
                    onChange={e => setStudentStrength(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 500"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Proposed Bin Location on Campus</label>
                <input
                  type="text"
                  required
                  value={binLocation}
                  onChange={e => setBinLocation(e.target.value)}
                  placeholder="e.g. Science block lobby, library entrance, main corridor"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-950 border border-zinc-700">
                <input
                  type="checkbox"
                  id="pledge"
                  checked={pledgeAccepted}
                  onChange={e => setPledgeAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-white focus:ring-0"
                />
                <label htmlFor="pledge" className="text-[11px] text-zinc-300 leading-relaxed cursor-pointer">
                  The school administration commits to safe student e-waste segregation and periodic MPPCB-authorized clearances with zero informal scrap dealer leakage.
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!pledgeAccepted}
                className="w-full py-3.5 text-xs font-black"
              >
                <FileText className="w-4 h-4 mr-1.5" />
                GENERATE FORMAL BIN AGREEMENT & COMMITMENT
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Generated Agreement Modal */}
      {showAgreementDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-white" />
                <h3 className="text-base font-extrabold text-white">E-Waste Bin Agreement Document</h3>
              </div>
              <button
                onClick={() => setShowAgreementDoc(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formal Letter Paper Mock */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-sans space-y-4 text-zinc-200 leading-relaxed">
              <div className="text-center border-b border-zinc-800 pb-3 space-y-1">
                <div className="font-extrabold text-sm text-white uppercase tracking-wider">
                  MEMORANDUM OF UNDERSTANDING & COMMITMENT
                </div>
                <div className="text-[11px] text-zinc-400">
                  Campus E-Waste Collection Bin Placement • Gwalior, Madhya Pradesh
                </div>
                <div className="text-[10px] font-mono text-zinc-400">Document Ref: {showAgreementDoc.id}</div>
              </div>

              <div className="space-y-2">
                <p><strong>To:</strong> The Regional Logistics Lead, MPPCB Authorized E-Waste Partner (Gwalior)</p>
                <p><strong>Institution:</strong> {showAgreementDoc.schoolName}</p>
                <p><strong>Campus Address:</strong> {showAgreementDoc.schoolAddress}</p>
                <p><strong>Principal / Head:</strong> {showAgreementDoc.principalName} | <strong>Coordinator:</strong> {showAgreementDoc.coordinatorName} ({showAgreementDoc.coordinatorPhone})</p>
                <p><strong>Approx. Student Strength:</strong> ~{showAgreementDoc.approxStudentStrength} Students</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] space-y-1.5 text-zinc-300">
                <div className="font-bold text-white">Institutional Terms & Commitment:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>A secure 50kg steel collection bin will be installed at: <strong>{showAgreementDoc.preferredBinLocation}</strong>.</li>
                  <li>School staff and students will be briefed on hazardous segregation (no swollen batteries without terminal tape).</li>
                  <li>When bin reaches capacity, the school will trigger pickup via the EWaste Off app.</li>
                  <li>Receiving authorized dismantler will provide a signed Form-6 E-Waste Manifest & Certificate of Destruction.</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800 text-center">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">For School Administration</div>
                  <div className="font-bold text-zinc-300 mt-4 underline decoration-dotted">{showAgreementDoc.principalName}</div>
                  <div className="text-[10px] text-zinc-400">Principal / Authorized Signatory</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">For Authorized Recycler</div>
                  <div className="font-bold text-zinc-300 mt-4 underline decoration-dotted">Gwalior Regional Operations Lead</div>
                  <div className="text-[10px] text-zinc-400">MPPCB Registered Hub</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(showAgreementDoc, null, 2));
                  setCopiedDoc(true);
                  setTimeout(() => setCopiedDoc(false), 2000);
                }}
                className="flex-1 text-xs"
              >
                {copiedDoc ? <Check className="w-4 h-4 text-white mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copiedDoc ? 'Copied to Clipboard' : 'Copy Document Text'}
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 text-xs"
              >
                <Printer className="w-4 h-4 mr-1" />
                Print / Save PDF Agreement
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
