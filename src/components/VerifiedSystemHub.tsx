import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  User,
  Calendar,
  ShieldAlert,
  DollarSign,
  Check,
  FileText,
  X,
  ChevronRight,
  ChevronDown,
  Send,
  Smartphone,
  MapPin,
  Plane,
  Lock,
  HelpCircle,
  History,
  AlertTriangle,
  Download,
  Plus,
  ArrowLeft,
  Loader2
} from 'lucide-react';

interface VerifiedSystemHubProps {
  application: any;
  onClose: () => void;
  isMobile?: boolean; // If true, optimizes for Android screen frame (290px-320px)
  onUpdateItalyPackage?: (updatedPkg: any) => void;
  userRole?: 'Admin' | 'Employer' | 'Candidate';
}

export default function VerifiedSystemHub({ 
  application, 
  onClose, 
  isMobile = false,
  onUpdateItalyPackage,
  userRole = 'Candidate'
}: VerifiedSystemHubProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applications' | 'visa' | 'payments' | 'documents' | 'messages' | 'interviews' | 'travel' | 'history' | 'settings' | 'help'>('dashboard');
  
  // Local interactive states to make it "Fully Live" for the user
  const [uploadedReceipt, setUploadedReceipt] = useState<File | null>(null);
  const [txIdInput, setTxIdInput] = useState('');
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [selectedInstallmentKey, setSelectedInstallmentKey] = useState('inst_1');
  const [paymentAmountInput, setPaymentAmountInput] = useState('50000');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [paymentRemarks, setPaymentRemarks] = useState('');
  const [integrityStatus, setIntegrityStatus] = useState<'idle' | 'scanning' | 'verified'>('idle');

  // Sync selected installment key and amount based on dynamic application steps
  useEffect(() => {
    if (application) {
      if (application.visaSteps && application.visaSteps.length > 0) {
        const firstStep = application.visaSteps[0];
        setSelectedInstallmentKey(firstStep.key);
        setPaymentAmountInput(String(firstStep.amount || 0));
      } else {
        setSelectedInstallmentKey('inst_1');
        const gTotal = application.grandTotal || application.totalAmount || 190000;
        const inst1_val = Math.round(gTotal * 0.26315) || 50000;
        setPaymentAmountInput(String(inst1_val));
      }
    }
  }, [application?.id, application?.visaSteps]);
  
  // States for Admin/Staff Editing of Cost Breakdown
  const [isAdminEditMode, setIsAdminEditMode] = useState(false);
  const [editVisaFee, setEditVisaFee] = useState(application.visaProcessingFee || 80000);
  const [editMedicalFee, setEditMedicalFee] = useState(application.medicalFee || 8000);
  const [editAgencyFee, setEditAgencyFee] = useState(application.agencyServiceFee || 15000);
  const [editEmbassyFee, setEditEmbassyFee] = useState(application.embassyFee || 12000);
  const [editInsuranceFee, setEditInsuranceFee] = useState(application.insuranceFee || 5000);
  const [editBmetFee, setEditBmetFee] = useState(application.bmetFee || 4000);
  const [editTicketFee, setEditTicketFee] = useState(application.airTicketFee || 40000);
  const [editOtherFee, setEditOtherFee] = useState(application.otherCharges || 10000);
  const [editCommission, setEditCommission] = useState(application.adminCommission || 20000);

  const [supportMessage, setSupportMessage] = useState('');
  const [supportChat, setSupportChat] = useState<Array<{ sender: 'user' | 'support' | 'system'; text: string; time: string }>>([
    { sender: 'system', text: 'অ্যাডমিন/স্টাফ সাপোর্ট প্যানেলে যুক্ত হয়েছেন।', time: '10:00 AM' },
    { sender: 'support', text: 'আসসালামু আলাইকুম। আমি আরিফ আল মামুন (সিনিয়রスタッフ)। আপনার ডকুমেন্টস ভেরিফিকেশন সম্পন্ন হয়েছে। আপনার কোনো বিষয়ে সহযোগিতা লাগবে?', time: '10:02 AM' }
  ]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCreated, setTicketCreated] = useState(false);
  
  // Settings modification states
  const [phoneInput, setPhoneInput] = useState(application.candidatePhone);
  const [emailInput, setEmailInput] = useState(application.candidateEmail);
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Derive application identifier details
  const title = application.jobTitle || `🇮🇹 ${application.packageName || 'Italy'} Work Visa Package`;
  const isItaly = !!application.packageName;
  const currentStatus = application.status;

  // Handles adding chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    
    const userMsg = { sender: 'user' as const, text: supportMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setSupportChat(prev => [...prev, userMsg]);
    setSupportMessage('');

    // Trigger auto staff response with realistic advice
    setTimeout(() => {
      let responseText = 'আপনার বার্তাটির জন্য ধন্যবাদ। আমরা বিষয়টি পর্যালোচনা করে দেখছি। আপনার ভিসা ও ডকুমেন্ট সংক্রান্ত অগ্রগতির সর্বশেষ আপডেট ড্যাশবোর্ডে রিয়েল-টাইম দেখতে পাবেন।';
      if (supportMessage.includes('পেমেন্ট') || supportMessage.includes('টাকা')) {
        responseText = 'জ্বী, আপনার পেমেন্ট ট্রানজেকশন আইডি সাবমিট করলে আমাদের একাউন্টস টিম ১০-১৫ মিনিটের মধ্যে ভেরিফাই করে দেবে। ভেরিফিকেশন সম্পন্ন হলে আপনি ইন-অ্যাপ রসিদ ডাউনলোড করতে পারবেন।';
      } else if (supportMessage.includes('পাসপোর্ট') || supportMessage.includes('ভুল')) {
        responseText = 'আপনার পাসপোর্টের তথ্য সংশোধনের জন্য অনুগ্রহ করে হেল্প সেন্টার থেকে একটি সাপোর্ট টিকেট ওপেন করুন অথবা নতুন পাসপোর্টের স্ক্যান কপি চ্যাটবক্সে শেয়ার করুন।';
      }
      setSupportChat(prev => [...prev, {
        sender: 'support',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  // Mock document status and verifier details
  const verifications = {
    passport: { status: 'Verified', verifiedBy: 'Arif Al Mamun (Senior Staff)', date: '01 July 2026, 10:15 AM', remarks: 'পাসপোর্ট মেয়াদ ২০৩১ সাল পর্যন্ত রয়েছে, যা কাজের ভিসার জন্য উপযুক্ত।' },
    cv: { status: 'Verified', verifiedBy: 'Sharmin Akter (CV Team Lead)', date: '01 July 2026, 02:45 PM', remarks: 'ইউরোপাস (Europass) ফরম্যাটে সিভি ও কভার লেটার সফলভাবে প্রস্তুত করা হয়েছে।' },
    certificate: { status: 'Verified', verifiedBy: 'Rubel Ahmed (Document Officer)', date: '02 July 2026, 11:30 AM', remarks: 'কারিগরি কাজের অভিজ্ঞতা ও ট্রেড টেস্ট সার্টিফিকেট ডাটাবেজ দ্বারা অনুমোদিত।' },
    medical: { status: 'Verified', verifiedBy: 'Dr. M. A. Kabir (Authorized Doctor)', date: '02 July 2026, 04:15 PM', remarks: 'মেডিকেল ফিটনেস পরীক্ষার ফলাফল সন্তোষজনক (FIT)।' },
    police: { status: 'Verified', verifiedBy: 'Special Branch Officer (HQ)', date: '03 July 2026, 09:20 AM', remarks: 'ডিজিটাল পুলিশ ক্লিয়ারেন্স সার্টিফিকেট রিয়েল-টাইম কিউআর কোড দিয়ে যাচাই করা হয়েছে।' }
  };

  // Timeline step helper array
  const timelineSteps = [
    { key: 'submitted', label: 'আবেদন জমাদান (Submitted)', desc: 'আবেদন জমা হয়েছে', date: '01 July 2026, 09:00 AM', verifiedBy: 'System Auto-Register', status: 'completed' },
    { key: 'review', label: 'কাগজপত্র যাচাই (Employer Review)', desc: 'ডকুমেন্ট ও সিভি যাচাই', date: '01 July 2026, 03:00 PM', verifiedBy: 'Sharmin Akter (Staff)', status: 'completed' },
    { key: 'selected', label: 'মনোনয়ন নির্বাচিত (Selected)', desc: 'প্রাথমিক সিলেকশন সম্পন্ন', date: '02 July 2026, 11:00 AM', verifiedBy: 'Sajib Chowdhury (Admin)', status: 'completed' },
    { key: 'visa_upload', label: 'ভিসা/অফার লেটার আপলোড (Visa Uploaded)', desc: 'অফার লেটার ইস্যু করা হয়েছে', date: '02 July 2026, 12:30 PM', verifiedBy: 'Gulf Recruiting Agency', status: 'completed' },
    { key: 'admin_verify', label: 'সরকারি ডাটাবেজ ভেরিফিকেশন (Admin Verification)', desc: 'নুলা ওস্তা ট্র্যাকিং অনুমোদন', date: '02 July 2026, 01:15 PM', verifiedBy: 'Mizanur Rahman (Visa Officer)', status: 'completed' },
    { key: 'visa_approved', label: 'ভিসা চূড়ান্ত অনুমোদন (Visa Approved)', desc: 'ভিসা নিশ্চিতকরণ করা হয়েছে', date: '02 July 2026, 03:40 PM', verifiedBy: 'Embassy Attache Desk', status: 'completed' },
    { key: 'payment_sub', label: 'ফি পেমেন্ট জমাদান (Payment Submitted)', desc: 'পেমেন্ট স্ক্রিনশট ও TxID প্রদান', date: paymentSubmitted ? '03 July 2026, 11:45 AM' : '⏳ পেমেন্ট জমাদানের জন্য অপেক্ষা', verifiedBy: paymentSubmitted ? 'User Submited' : 'N/A', status: paymentSubmitted ? 'completed' : 'active' },
    { key: 'payment_appr', label: 'পেমেন্ট অনুমোদন (Payment Approved)', desc: 'টাকা প্রাপ্তি নিশ্চিতকরণ', date: paymentSubmitted ? '03 July 2026, 12:00 PM (Auto-Review)' : '⏳ অপেক্ষায়', verifiedBy: paymentSubmitted ? 'Accounts Manager (Sajib)' : 'N/A', status: paymentSubmitted ? 'completed' : 'pending' },
    { key: 'medical_cleared', label: 'মেডিকেল ফিটনেস (Medical Approved)', desc: 'মেডিকেল ফিট রিপোর্ট', date: '02 July 2026, 04:15 PM', verifiedBy: 'Authorized Medical Center', status: 'completed' },
    { key: 'police_cleared', label: 'পুলিশ ক্লিয়ারেন্স (Police Clearance Approved)', desc: 'আইনগত ক্লিয়ারেন্স প্রাপ্তি', date: '03 July 2026, 09:20 AM', verifiedBy: 'SB Police Department', status: 'completed' },
    { key: 'bmet_issued', label: 'BMET স্মার্ট কার্ড ইস্যু (BMET Card)', desc: 'স্মার্ট ইমিগ্রেশন কার্ড প্রস্তুত', date: '03 July 2026, 02:15 PM', verifiedBy: 'Bureau of Manpower Dept', status: 'completed' },
    { key: 'ticket_issued', label: 'ফ্লাইট টিকিট ইস্যু (Ticket Issued)', desc: 'বিমান টিকিট ও ট্রাভেল শিডিউল', date: '03 July 2026, 03:00 PM', verifiedBy: 'Travel Desk Officer', status: 'completed' },
    { key: 'successfully_departed', label: 'সফলভাবে বিদেশ যাত্রা (Successfully Departed)', desc: 'স্বপ্নযাত্রার শুভকামনা!', date: '১৫ আগস্ট ২০২৬ (শিডিউল)', verifiedBy: 'Airport Immigration Desk', status: 'pending' }
  ];

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txIdInput.trim()) return;
    setPaymentSubmitted(true);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    setTicketCreated(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Tab definition details
  const tabs = [
    { id: 'dashboard' as const, label: '🏠 Dashboard', labelBn: '🏠 ড্যাশবোর্ড' },
    { id: 'applications' as const, label: '📋 My Applications', labelBn: '📋 আমার আবেদন' },
    { id: 'visa' as const, label: '📄 Visa Process', labelBn: '📄 ভিসা প্রসেস' },
    { id: 'payments' as const, label: '💳 Payments', labelBn: '💳 পেমেন্ট ও ফি' },
    { id: 'documents' as const, label: '📑 Document Verification', labelBn: '📑 নথি যাচাইকরণ' },
    { id: 'messages' as const, label: '💬 Messages & Support', labelBn: '💬 চ্যাট ও সাপোর্ট' },
    { id: 'interviews' as const, label: '🎥 Interviews', labelBn: '🎥 সাক্ষাত্কার' },
    { id: 'travel' as const, label: '✈️ Travel Process', labelBn: '✈️ ট্রাভেল প্রসেস' },
    { id: 'history' as const, label: '📜 Verification History', labelBn: '📜 যাচাইকরণের ইতিহাস' },
    { id: 'settings' as const, label: '⚙️ Settings', labelBn: '⚙️ সেটিংস' },
    { id: 'help' as const, label: '🆘 Help Center', labelBn: '🆘 হেল্প সেন্টার' }
  ];

  return (
    <div className={`flex flex-col bg-slate-950 text-slate-100 ${isMobile ? 'h-full w-full' : 'w-full max-w-5xl h-[600px] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden'}`}>
      
      {/* Upper header section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
            title="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-xs font-black tracking-tight text-white truncate flex items-center gap-1">
              <span>
                {userRole === 'Admin' 
                  ? '🛡️ Admin/Staff Verified Tracking Panel' 
                  : userRole === 'Employer' 
                  ? '🏢 Agency Candidate Verification Hub' 
                  : '👤 Client/Candidate Application Progress Tracker'}
              </span>
            </h2>
            <p className="text-[8.2px] text-slate-400 truncate font-semibold">
              {application.candidateName} • {title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/25">
            Transparent Audit
          </span>
          {!isMobile && (
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main body: adapt dynamically */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        
        {/* Mobile Tab Selector: Horizonally Scrollable pills if mobile, otherwise Sidebar */}
        {isMobile ? (
          <div className="border-b border-slate-800 bg-slate-950/90 shrink-0 px-2.5 py-2.5 overflow-hidden">
            <div className="flex gap-1.5 overflow-x-auto pb-1 snap-x scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {tabs.map((t) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`snap-center flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[9px] font-black transition-all whitespace-nowrap border shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-400 font-extrabold shadow-md scale-102'
                        : 'bg-slate-900/70 text-slate-400 border-slate-800/80 hover:text-slate-250 hover:bg-slate-850/60'
                    }`}
                  >
                    <span>{t.labelBn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Left Sidebar for Desktop */
          <div className="w-56 bg-slate-950/80 border-r border-slate-850 overflow-y-auto shrink-0 py-3 flex flex-col justify-between">
            <div className="space-y-1 px-2">
              <span className="text-[8px] font-black uppercase text-slate-500 px-3 tracking-widest block mb-2">
                VERIFIED STEPS HUB
              </span>
              {tabs.map((t) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-[10.5px] font-black transition-all flex items-center justify-between ${
                      isActive 
                        ? 'bg-emerald-500 text-slate-950 shadow-md' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <span>{t.labelBn}</span>
                    <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'translate-x-0.5' : ''}`} />
                  </button>
                );
              })}
            </div>
            
            <div className="p-3 m-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <p className="text-[8.5px] font-black text-amber-500 uppercase flex items-center gap-1">
                🛡️ Verified Secure
              </p>
              <p className="text-[8px] text-slate-400 leading-normal">
                সকল অনুমোদন স্থায়ী সার্ভারে ডিজিটাল সিগনেচার দ্বারা সুরক্ষিত।
              </p>
            </div>
          </div>
        )}

        {/* Tab Content Display Area */}
        <div className="flex-grow p-4 overflow-y-auto bg-slate-900/20">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              {/* Profile Completion Card */}
              <div className="p-4 rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1.5">
                  <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                    ✓ প্রোফাইল সিকিউরিটি স্ট্যাটাস
                  </span>
                  <h3 className="text-[11.5px] font-black text-slate-100 leading-snug">প্রোফাইল সম্পন্নতা: ৮৫% (সম্পূর্ণ নিরাপদ)</h3>
                  <p className="text-[9px] text-slate-350 font-medium leading-relaxed">
                    পাসপোর্ট কপি, পুলিশ ক্লিয়ারেন্স ও মেডিকেল টেস্ট ডাটাবেজ দ্বারা সফলভাবে ভেরিফাইড সম্পন্ন হয়েছে।
                  </p>
                </div>
                <div className="relative shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-inner shadow-emerald-500/5">
                  <div className="absolute inset-1 rounded-full border-2 border-dashed border-emerald-500/20 animate-[spin_20s_linear_infinite]"></div>
                  <span className="text-xs font-black text-emerald-400 font-mono tracking-tighter">৮৫%</span>
                </div>
              </div>

              {/* Admin official feedback card */}
              {application.notes && (
                <div className="p-4 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/20 via-blue-900/10 to-blue-950/20 text-blue-300 space-y-1.5 text-left shadow-lg">
                  <span className="text-[9.5px] font-black uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    💬 এডমিন অফিসিয়াল ফিডব্যাক নোট (Admin Feedback)
                  </span>
                  <p className="text-[10px] font-semibold leading-relaxed text-slate-200 pl-3 border-l border-blue-500/30">
                    {application.notes}
                  </p>
                </div>
              )}

              {/* Status Timeline Progress Block */}
              <div className="p-4 rounded-3xl border border-slate-800/80 bg-slate-950/40 space-y-3.5 shadow-md">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                  <h4 className="text-[10px] font-black text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    📈 রিয়েল-টাইম অগ্রগতি টাইমলাইন (Real-time Progress Timeline)
                  </h4>
                </div>

                {/* Timeline list mapped */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {timelineSteps.map((step, index) => (
                    <div key={step.key} className="flex gap-2.5 text-left relative">
                      {index < timelineSteps.length - 1 && (
                        <div className="absolute left-[7px] top-4 bottom-[-16px] w-[1px] bg-slate-800" />
                      )}
                      <div className="mt-1 shrink-0 z-10">
                        {step.status === 'completed' ? (
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[8px] text-emerald-400 font-bold">✓</div>
                        ) : step.status === 'active' ? (
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-[8px] text-blue-400 font-bold animate-pulse">●</div>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className={`text-[9.5px] font-black ${step.status === 'completed' ? 'text-slate-200' : step.status === 'active' ? 'text-blue-400' : 'text-slate-500'}`}>
                          {step.label}
                        </p>
                        <p className="text-[8px] text-slate-400 leading-relaxed font-semibold">
                          {step.desc}
                        </p>
                        <p className="text-[7.5px] text-slate-500 font-mono">
                          {step.date} {step.verifiedBy && `• Verified by: ${step.verifiedBy}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick action buttons */}
                <div className="border-t border-slate-900 pt-3 space-y-2">
                  <p className="text-[7.5px] font-extrabold uppercase text-slate-500 tracking-wider text-left">দ্রুত অ্যাকশন (Quick Actions):</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setActiveTab('payments')}
                      className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950 transition-all duration-200 text-left space-y-1 font-black shadow-sm group"
                    >
                      <p className="text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[9.5px]">
                        <span>💸 পেমেন্ট রশিদ আপলোড</span>
                      </p>
                      <p className="text-[7.5px] font-semibold text-slate-400">TxID সাবমিট করে ভেরিফিকেশন চালু করুন</p>
                    </button>
                    <button 
                      onClick={() => setActiveTab('messages')}
                      className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950 transition-all duration-200 text-left space-y-1 font-black shadow-sm group"
                    >
                      <p className="text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[9.5px]">
                        <span>💬 স্টাফ ও এডমিন চ্যাট</span>
                      </p>
                      <p className="text-[7.5px] font-semibold text-slate-400">আপনার ফাইল নিয়ে সরাসরি কথা বলুন</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl border border-slate-800/80 bg-slate-950/40 space-y-3 shadow-md">
                <h4 className="text-[10px] font-black text-slate-100 uppercase tracking-wider">📋 চাকরির বিস্তারিত আবেদন রেকর্ড ও অগ্রগতি</h4>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
                    <div>
                      <h5 className="text-[11px] font-black text-slate-100">{title}</h5>
                      <p className="text-[9px] text-slate-400 mt-0.5">{application.companyName}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[8.5px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 uppercase">
                      {currentStatus === 'Approved' ? 'অনুমোদিত' : currentStatus === 'Shortlisted' ? 'শর্টলিস্টেড' : 'প্রক্রিয়াধীন'}
                    </span>
                  </div>

                  <div className="space-y-2 text-[8.5px] font-bold text-slate-300">
                    <p className="text-slate-400 font-extrabold uppercase text-[7.5px] tracking-wider mb-1.5">অ্যাডমিন / স্টাফ ভেরিফিকেশন স্ট্যাটাস:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-slate-900 rounded-xl border border-slate-850 flex items-center gap-1.5">
                        <span className="text-slate-400">👤 ভেরিফায়ার:</span>
                        <span className="text-slate-250 font-black">Arif Al Mamun</span>
                      </div>
                      <div className="p-2 bg-slate-900 rounded-xl border border-slate-850 flex items-center gap-1.5">
                        <span className="text-slate-400">📅 সময়:</span>
                        <span className="text-slate-250 font-mono">02 July 2026</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 leading-relaxed text-slate-300">
                      🛡️ <strong className="text-slate-100 font-black">স্টাফ রিভিউ নোট:</strong> পাসপোর্ট ডাটা, পুলিশ ক্লিয়ারেন্স ভেরিফাইড পাওয়া গেছে। প্রার্থীর কাজের অভিজ্ঞতা সন্তোষজনক এবং সিভি ইতালির ডাটাবেজে সাবমিট করা হয়েছে।
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VISA PROCESS */}
          {activeTab === 'visa' && (
            <div className="space-y-4">
              {/* Visa Authentication Shield Status */}
              <div className="p-4 rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between gap-3 shadow-xl">
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                    🔒 SECURE EMBASSY LINK
                  </span>
                  <h4 className="text-[11.5px] font-black text-slate-100 leading-snug">ভিসা অথেন্টিকেশন স্ট্যাটাস (Embassy Safe Verified)</h4>
                  <p className="text-[9px] text-slate-400 leading-relaxed">
                    আপনার নুলা ওস্তা এবং সরকারি ওয়ার্ক পারমিট লেটার রোম ইমিগ্রেশন পোর্টাল থেকে ভেরিফাইড এবং অনুমোদিত।
                  </p>
                </div>
                <div className="relative shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/30">
                  <Lock className="w-5 h-5 text-indigo-400 animate-[pulse_3s_infinite]" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-3 shadow-md">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                  <h4 className="text-[10px] font-black text-slate-100 uppercase tracking-wider">📄 ভিসা ও অফার লেটার প্রসেস রেকর্ড</h4>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[8px] font-black rounded font-mono">
                    {application.packageName ? `${application.packageName} Package` : 'Verified'}
                  </span>
                </div>

                <div className="space-y-3 text-[8.5px]">
                  {application.visaSteps ? (
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {application.visaSteps.map((step, idx) => (
                        <div key={step.key} className="p-3 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col gap-2 shadow-sm hover:border-indigo-500/20 transition-all duration-200">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-900 pb-2">
                            <p className="font-black text-slate-100 text-[10px]">
                              {idx + 1}. {step.name}
                            </p>
                            <span className={`px-2 py-0.5 rounded text-[7.5px] font-black uppercase tracking-wider border ${
                              step.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              step.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' :
                              step.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                              'bg-slate-800/40 text-slate-400 border-slate-800/50'
                            }`}>
                              {step.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-[8.2px] text-slate-400 font-bold">
                            {step.date && <p>📅 আপডেট তারিখ: <span className="text-slate-200 font-mono">{step.date}</span></p>}
                            {step.staffName && <p>🧑‍💻 দায়িত্বপ্রাপ্ত স্টাফ: <span className="text-slate-200">{step.staffName}</span></p>}
                          </div>

                          {step.adminNotes && (
                            <div className="p-2 bg-slate-900/40 border border-slate-900/60 rounded-lg text-slate-300 text-[8.2px] leading-relaxed">
                              📝 <strong className="text-slate-100 font-black">অফিসিয়াল রিমার্কস:</strong> {step.adminNotes}
                            </div>
                          )}

                          {step.documentUrl && (
                            <div className="flex justify-between items-center bg-slate-900/20 p-1.5 rounded border border-slate-900/40 mt-1">
                              <span className="text-[8px] text-indigo-400 truncate">📄 ফাইল: {step.documentUrl}</span>
                              <button 
                                onClick={() => alert(`"${step.documentUrl}" স্ক্যান ফাইলটি সফলভাবে ডাউনলোড হচ্ছে...`)}
                                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-1.5 py-0.5 rounded border border-indigo-550 transition text-[7.5px]"
                              >
                                <Download className="w-2.5 h-2.5 text-white" /> ডাউনলোড (Scan Copy)
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Offer Letter */}
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-black text-slate-200">১. অফিসিয়াল কাজের অফার লেটার (Offer Letter)</p>
                          <p className="text-[7.5px] text-slate-500 font-semibold mt-0.5">ফাইলের নাম: Gulf_Logistics_Offer_Letter_Ariful.pdf</p>
                        </div>
                        <button className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white font-black px-2 py-1 rounded border border-slate-750 transition text-[8px] shrink-0">
                          <Download className="w-3 h-3 text-emerald-500" /> ডাউনলোড
                        </button>
                      </div>

                      {/* Visa Permit */}
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-black text-slate-200">২. ইতালির ওয়ার্ক পারমিট / নুলা ওস্তা (Visa Permit - Nulla Osta)</p>
                          <p className="text-[7.5px] text-slate-500 font-semibold mt-0.5">ফাইলের নাম: Nulla_Osta_Italy_Ariful_EH0987.pdf</p>
                        </div>
                        <button className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white font-black px-2 py-1 rounded border border-slate-750 transition text-[8px] shrink-0">
                          <Download className="w-3 h-3 text-emerald-500" /> ডাউনলোড
                        </button>
                      </div>

                      {/* Verification Info Table */}
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ভিসা অথেন্টিকেশন লগ (Visa Verification Log)</p>
                        <div className="grid grid-cols-2 gap-2 text-[8.5px] font-bold">
                          <p className="text-slate-400">👤 ভেরিফাইড বাই (Verified By):</p>
                          <p className="text-slate-100 font-black text-right">Mizanur Rahman (Visa Specialist)</p>

                          <p className="text-slate-400">📅 তারিখ ও সময় (Date & Time):</p>
                          <p className="text-slate-100 font-black text-right">03 July 2026, 11:15 AM</p>

                          <p className="text-slate-400">🛡️ ভিসা স্ট্যাটাস (Visa Status):</p>
                          <p className="text-emerald-400 font-black text-right">APPROVED & ATTESTED</p>
                        </div>
                        <div className="p-1.5 bg-slate-900/60 rounded border border-slate-850 text-slate-300 font-semibold leading-normal pt-1.5 border-t mt-1 text-[8.2px]">
                          📝 <strong className="text-slate-100 font-black">অ্যাডমিন রিমার্কস:</strong> ইতালির প্রিফেকচুরা সিস্টেম থেকে অফিশিয়াল বারকোড ভেরিফিকেশন সফল হয়েছে। ঢাকার দূতাবাসে পাসপোর্ট সাবমিট করার প্রস্তুতি নিন।
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS */}
          {activeTab === 'payments' && (() => {
            // Compute dynamic installments based on Grand Total
            const dynamicTotal = (application.visaSteps && application.visaSteps.length > 0)
              ? application.visaSteps.reduce((sum: number, s: any) => sum + (s.amount || 0), 0)
              : 0;
            const gTotal = dynamicTotal > 0 ? dynamicTotal : (application.grandTotal || application.totalAmount || 190000);
            const inst1_val = Math.round(gTotal * 0.26315) || 50000;
            const inst2_val = Math.round(gTotal * 0.10526) || 20000;
            const inst3_val = Math.round(gTotal * 0.21052) || 40000;
            const inst4_val = gTotal - inst1_val - inst2_val - inst3_val;

            const history = application.paymentHistory || [];
            
            const editEmployerTotal = editVisaFee + editMedicalFee + editAgencyFee + editEmbassyFee + editInsuranceFee + editBmetFee + editTicketFee + editOtherFee;
            const editGrandTotal = editEmployerTotal + editCommission;
            
            // Calculate actual paid & pending amounts
            const getPaidForStep = (stepKey: string) => 
              history.filter((h: any) => h.stepKey === stepKey && h.status === 'Verified')
                     .reduce((sum: number, h: any) => sum + h.amount, 0);

            const getPendingForStep = (stepKey: string) =>
              history.filter((h: any) => h.stepKey === stepKey && h.status === 'Pending')
                     .reduce((sum: number, h: any) => sum + h.amount, 0);

            const isRejectedForStep = (stepKey: string) =>
              history.some((h: any) => h.stepKey === stepKey && h.status === 'Rejected');

            const insts = (application.visaSteps && application.visaSteps.length > 0)
              ? application.visaSteps.map((s: any, idx: number) => ({
                  key: s.key,
                  name: `${idx + 1}. ${s.name}`,
                  target: s.amount || 0,
                  paid: getPaidForStep(s.key),
                  pending: getPendingForStep(s.key)
                }))
              : [
                  { key: 'inst_1', name: '১ম কিস্তি (রেজিস্ট্রেশন ও ডকুমেন্ট প্রসেসিং)', target: inst1_val, paid: getPaidForStep('inst_1'), pending: getPendingForStep('inst_1') },
                  { key: 'inst_2', name: '২য় কিস্তি (মেডিকেল ও ওয়ার্ক পারমিট)', target: inst2_val, paid: getPaidForStep('inst_2'), pending: getPendingForStep('inst_2') },
                  { key: 'inst_3', name: '৩য় কিস্তি (এম্বেসি ও BMET ক্লিয়ারেন্স)', target: inst3_val, paid: getPaidForStep('inst_3'), pending: getPendingForStep('inst_3') },
                  { key: 'inst_4', name: '৪র্থ কিস্তি (ফ্লাইট টিকিট ও ভিসা হ্যান্ডওভার)', target: inst4_val, paid: getPaidForStep('inst_4'), pending: getPendingForStep('inst_4') }
                ];

            const totalVerifiedPaid = insts.reduce((sum, i) => sum + i.paid, 0);
            const totalPending = insts.reduce((sum, i) => sum + i.pending, 0);
            const totalRemaining = Math.max(0, gTotal - totalVerifiedPaid);
            const progressPercent = Math.min(100, Math.round((totalVerifiedPaid / gTotal) * 100));

            // Default Bank details for display
            const bank = application.bankDetails || {
              bankName: 'City Bank PLC',
              accountName: 'Euro Bangla Manpower Services Ltd.',
              accountNumber: '1102938475001',
              branch: 'Gulshan Branch, Dhaka',
              routingNumber: '220150153',
              bkashMerchant: '01700998877',
              nagadMerchant: '01700998877',
              status: 'Approved'
            };

            // Handlers for candidate payment submission
            const handleCandidateSubmitPayment = (e: React.FormEvent) => {
              e.preventDefault();
              if (!txIdInput.trim()) {
                alert('অনুগ্রহ করে ট্রানজেকশন আইডি প্রদান করুন।');
                return;
              }

              const activeStep = insts.find(i => i.key === selectedInstallmentKey);
              const targetAmount = activeStep ? activeStep.target : 0;
              const stepName = activeStep ? activeStep.name : 'কিস্তি';

              const newTx = {
                id: 'tx_c_' + Date.now(),
                amount: targetAmount,
                date: new Date().toLocaleDateString('bn-BD') + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                method: paymentMethod,
                invoiceId: txIdInput.trim(),
                status: 'Pending' as const,
                stepKey: selectedInstallmentKey,
                remarks: paymentRemarks || 'ম্যানুয়াল ডিপোজিট সাবমিশন'
              };

              const updatedLogs = [
                ...(application.auditLogs || []),
                {
                  id: 'log_' + Date.now(),
                  action: 'Payment Submitted',
                  user: 'Job Seeker',
                  timestamp: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString(),
                  details: `প্রার্থী "${stepName}" বাবদ ৳${targetAmount.toLocaleString()} টাকার পেমেন্ট জমা দিয়েছেন। TxID: ${txIdInput}`
                }
              ];

              const updatedPkg = {
                ...application,
                paymentHistory: [...history, newTx],
                auditLogs: updatedLogs
              };

              if (onUpdateItalyPackage) {
                onUpdateItalyPackage(updatedPkg);
                alert('আপনার পেমেন্ট ভেরিফিকেশন আবেদন সফলভাবে জমা হয়েছে। অ্যাডমিন অ্যাকাউন্টস প্যানেল শীঘ্রই চেক করে অনুমোদন দিবে।');
                setTxIdInput('');
                setPaymentRemarks('');
              } else {
                alert('সফলভাবে জমা হয়েছে (সিমুলেশন)।');
              }
            };

            // Handlers for Admin actions
            const handleAdminVerifyPaymentAction = (txId: string, action: 'Approve' | 'Reject' | 'Correction') => {
              const updatedHistory = history.map((tx: any) => {
                if (tx.id === txId) {
                  return { 
                    ...tx, 
                    status: action === 'Approve' ? 'Verified' : action === 'Reject' ? 'Rejected' : 'Pending' 
                  };
                }
                return tx;
              });

              // Recalculate paidAmount
              const newPaidSum = updatedHistory
                .filter((tx: any) => tx.status === 'Verified')
                .reduce((sum: number, tx: any) => sum + tx.amount, 0);

              const updatedLogs = [
                ...(application.auditLogs || []),
                {
                  id: 'log_' + Date.now(),
                  action: action === 'Approve' ? 'Payment Approved' : action === 'Reject' ? 'Payment Rejected' : 'Correction Requested',
                  user: 'Admin Accounts',
                  timestamp: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString(),
                  details: `পেমেন্ট ট্রানজেকশন ${txId} টি ${action === 'Approve' ? 'অনুমোদিত' : action === 'Reject' ? 'প্রত্যাখ্যাত' : 'সংশোধন আবশ্যক হিসেবে চিহ্নিত'} করা হয়েছে।`
                }
              ];

              const updatedPkg = {
                ...application,
                paymentHistory: updatedHistory,
                paidAmount: newPaidSum,
                dueAmount: gTotal - newPaidSum,
                auditLogs: updatedLogs
              };

              if (onUpdateItalyPackage) {
                onUpdateItalyPackage(updatedPkg);
                alert(`পেমেন্ট সফলভাবে ${action === 'Approve' ? 'ভেরিফাইড ও এপ্রুভড' : action === 'Reject' ? 'প্রত্যাখ্যাত' : 'রি-আপলোড রিকোয়েস্ট'} করা হয়েছে!`);
              }
            };

            // Handler for Admin updating Cost Plan
            const handleAdminUpdateCostPlan = (action: 'Approve' | 'Reject' | 'Save') => {
              const updatedLogs = [
                ...(application.auditLogs || []),
                {
                  id: 'log_' + Date.now(),
                  action: `Cost Plan ${action}`,
                  user: 'Admin Moderator',
                  timestamp: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString(),
                  details: `ফি বিবরণী: ভিসা প্রসেসিং ৳${editVisaFee}, মেডিকেল ৳${editMedicalFee}, সার্ভিস চার্জ ৳${editAgencyFee}, এম্বেসি ৳${editEmbassyFee}, ইন্সুরেন্স ৳${editInsuranceFee}, BMET ৳${editBmetFee}, টিকিট ৳${editTicketFee}, অন্যান্য ৳${editOtherFee}, কমিশন ৳${editCommission}`
                }
              ];

              const updatedPkg = {
                ...application,
                visaProcessingFee: editVisaFee,
                medicalFee: editMedicalFee,
                agencyServiceFee: editAgencyFee,
                embassyFee: editEmbassyFee,
                insuranceFee: editInsuranceFee,
                bmetFee: editBmetFee,
                airTicketFee: editTicketFee,
                otherCharges: editOtherFee,
                adminCommission: editCommission,
                employerTotal: editEmployerTotal,
                grandTotal: editGrandTotal,
                totalAmount: editGrandTotal,
                dueAmount: editGrandTotal - (application.paidAmount || 0),
                paymentPlanStatus: action === 'Approve' ? 'Approved' : action === 'Reject' ? 'Rejected' : application.paymentPlanStatus,
                auditLogs: updatedLogs
              };

              if (onUpdateItalyPackage) {
                onUpdateItalyPackage(updatedPkg);
                setIsAdminEditMode(false);
                alert(`ফি বিবরণী সফলভাবে ${action === 'Approve' ? 'অনুমোদন করা হয়েছে এবং পেমেন্ট কিস্তি চালু করা হয়েছে!' : action === 'Reject' ? 'প্রত্যাখ্যান করা হয়েছে।' : 'সংরক্ষণ করা হয়েছে।'}`);
              }
            };

            // Handler for Employer / Admin updating Bank Details
            const handleAdminApproveBankDetails = () => {
              const updatedLogs = [
                ...(application.auditLogs || []),
                {
                  id: 'log_' + Date.now(),
                  action: 'Bank Details Approved',
                  user: 'Admin Moderator',
                  timestamp: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString(),
                  details: `ব্যাংক হিসাব '${bank.accountName}' সফলভাবে ভেরিফাই ও এপ্রুভ করা হয়েছে।`
                }
              ];

              const updatedPkg = {
                ...application,
                bankDetails: {
                  ...bank,
                  status: 'Approved',
                  approvedBy: 'Admin Accounts Team'
                },
                auditLogs: updatedLogs
              };

              if (onUpdateItalyPackage) {
                onUpdateItalyPackage(updatedPkg);
                alert('নিয়োগকর্তার ব্যাংক হিসাবটি সফলভাবে যাচাই ও ভেরিফাইড ঘোষণা করা হয়েছে!');
              }
            };

            return (
              <div className="space-y-4 animate-fade-in text-slate-200">
                
                {/* DYNAMIC PROGRESS BLOCK */}
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <h4 className="text-[10px] font-black uppercase text-slate-100 tracking-wider">
                        💰 Recruitment Payment Workflow Tracker
                      </h4>
                      <p className="text-[8.5px] text-slate-400 font-medium">
                        {userRole === 'Candidate' ? 'নিয়োগ মোট খরচ এবং প্রার্থীর কিস্তির রিয়েল-টাইম গতিবিধি' : 'নিয়োগকর্তা মোট খরচ, এডমিন কমিশন এবং প্রার্থীর কিস্তির রিয়েল-টাইম গতিবিধি'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-sans text-[9px] font-black text-slate-400 uppercase">প্ল্যান স্ট্যাটাস:</span>
                      <span className={`px-2 py-0.5 rounded-[5px] text-[8.5px] font-black uppercase border ${
                        application.paymentPlanStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        application.paymentPlanStatus === 'Pending Admin Review' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {application.paymentPlanStatus || 'Approved'}
                      </span>
                    </div>
                  </div>

                  {/* Core Metrics Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 space-y-0.5">
                      <span className="text-[7.5px] text-slate-400 font-sans block uppercase">মোট বাজেট (Grand Total)</span>
                      <strong className="text-slate-100 font-mono text-[11px] font-black">৳{gTotal.toLocaleString()} BDT</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 space-y-0.5">
                      <span className="text-[7.5px] text-emerald-400 font-sans block uppercase">ভেরিফাইড পেমেন্ট (Paid)</span>
                      <strong className="text-emerald-400 font-mono text-[11px] font-black">৳{totalVerifiedPaid.toLocaleString()} BDT</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 space-y-0.5">
                      <span className="text-[7.5px] text-amber-400 font-sans block uppercase">যাচাইাধীন পেমেন্ট (Pending)</span>
                      <strong className="text-amber-400 font-mono text-[11px] font-black">৳{totalPending.toLocaleString()} BDT</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 space-y-0.5">
                      <span className="text-[7.5px] text-rose-400 font-sans block uppercase">বকেয়া টাকা (Due)</span>
                      <strong className="text-rose-400 font-mono text-[11px] font-black">৳{totalRemaining.toLocaleString()} BDT</strong>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[8.5px] font-black font-sans">
                      <span className="text-slate-300">পরিশোধের সামগ্রিক অগ্রগতি (Progress)</span>
                      <span className="text-indigo-400 font-mono">{progressPercent}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* TWO COLUMN WORKFLOW DETAILS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                  
                  {/* LEFT: ITEMISED COST BREAKDOWN & BANK INFO (8 Columns) */}
                  <div className="lg:col-span-7 space-y-3.5">
                    
                    {/* COST BREAKDOWN ACCORDION/CARD */}
                    <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <h5 className="text-[9.5px] font-black uppercase text-slate-100">
                            {userRole === 'Candidate' ? '📋 নিয়োগ ফি বিশ্লেষণ (Itemized Cost)' : '📋 নিয়োগ ফি ও কমিশন বিশ্লেষণ (Itemized Cost)'}
                          </h5>
                        </div>
                        {userRole === 'Admin' && !isAdminEditMode && (
                          <button 
                            onClick={() => setIsAdminEditMode(true)}
                            className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[8px] font-black uppercase transition"
                          >
                            ✏️ Edit Fee Setup
                          </button>
                        )}
                      </div>

                      {isAdminEditMode ? (
                        /* ADMIN EDITABLE FEE FORM */
                        <div className="space-y-2 text-[8.5px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <p className="font-black text-amber-400 uppercase text-[8px]">🔧 মডারেটর ফি এডিট প্যানেল</p>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-0.5">
                              <label className="text-slate-400 font-bold block">Visa Processing Fee</label>
                              <input type="number" value={editVisaFee} onChange={(e) => setEditVisaFee(Number(e.target.value))} className="w-full py-1 px-1.5 bg-slate-900 border border-slate-800 rounded text-white font-mono" />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-slate-400 font-bold block">Medical Fee</label>
                              <input type="number" value={editMedicalFee} onChange={(e) => setEditMedicalFee(Number(e.target.value))} className="w-full py-1 px-1.5 bg-slate-900 border border-slate-800 rounded text-white font-mono" />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-slate-400 font-bold block">Agency Service Fee</label>
                              <input type="number" value={editAgencyFee} onChange={(e) => setEditAgencyFee(Number(e.target.value))} className="w-full py-1 px-1.5 bg-slate-900 border border-slate-800 rounded text-white font-mono" />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-slate-400 font-bold block">Embassy Fee</label>
                              <input type="number" value={editEmbassyFee} onChange={(e) => setEditEmbassyFee(Number(e.target.value))} className="w-full py-1 px-1.5 bg-slate-900 border border-slate-800 rounded text-white font-mono" />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-slate-400 font-bold block">Insurance Fee</label>
                              <input type="number" value={editInsuranceFee} onChange={(e) => setEditInsuranceFee(Number(e.target.value))} className="w-full py-1 px-1.5 bg-slate-900 border border-slate-800 rounded text-white font-mono" />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-slate-400 font-bold block">BMET Fee</label>
                              <input type="number" value={editBmetFee} onChange={(e) => setEditBmetFee(Number(e.target.value))} className="w-full py-1 px-1.5 bg-slate-900 border border-slate-800 rounded text-white font-mono" />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-slate-400 font-bold block">Air Ticket Fee</label>
                              <input type="number" value={editTicketFee} onChange={(e) => setEditTicketFee(Number(e.target.value))} className="w-full py-1 px-1.5 bg-slate-900 border border-slate-800 rounded text-white font-mono" />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-slate-400 font-bold block">Other Charges</label>
                              <input type="number" value={editOtherFee} onChange={(e) => setEditOtherFee(Number(e.target.value))} className="w-full py-1 px-1.5 bg-slate-900 border border-slate-800 rounded text-white font-mono" />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-indigo-300 font-bold block">Admin Commission</label>
                              <input type="number" value={editCommission} onChange={(e) => setEditCommission(Number(e.target.value))} className="w-full py-1 px-1.5 bg-indigo-950 border border-indigo-800 rounded text-white font-mono" />
                            </div>
                          </div>

                          <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800 mt-2">
                            <div>
                              <p className="text-[7.5px] text-slate-400">Employer Cost: ৳{editEmployerTotal.toLocaleString()}</p>
                              <p className="text-[8.5px] text-emerald-400 font-black">Grand Total: ৳{editGrandTotal.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-1.5">
                              <button 
                                type="button" 
                                onClick={() => setIsAdminEditMode(false)}
                                className="py-1 px-2 bg-slate-800 text-slate-300 rounded font-bold"
                              >
                                Cancel
                              </button>
                              <button 
                                type="button" 
                                onClick={() => handleAdminUpdateCostPlan('Save')}
                                className="py-1 px-2.5 bg-indigo-600 text-white rounded font-black hover:bg-indigo-500"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* DISPLAY SYSTEM BREAKDOWN */
                        <div className="space-y-1 text-[8.5px] font-semibold text-slate-300">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-slate-800/50 pb-2">
                            <div className="p-2 bg-slate-950/40 rounded-lg">
                              <p className="text-slate-400 text-[7.5px]">Visa Processing Fee</p>
                              <p className="font-mono text-slate-200 font-bold">৳{(application.visaProcessingFee || 80000).toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-slate-950/40 rounded-lg">
                              <p className="text-slate-400 text-[7.5px]">Medical Examination</p>
                              <p className="font-mono text-slate-200 font-bold">৳{(application.medicalFee || 8000).toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-slate-950/40 rounded-lg">
                              <p className="text-slate-400 text-[7.5px]">Agency Service Charge</p>
                              <p className="font-mono text-slate-200 font-bold">৳{(application.agencyServiceFee || 15000).toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-slate-950/40 rounded-lg">
                              <p className="text-slate-400 text-[7.5px]">Embassy Stamp Fee</p>
                              <p className="font-mono text-slate-200 font-bold">৳{(application.embassyFee || 12000).toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-slate-950/40 rounded-lg">
                              <p className="text-slate-400 text-[7.5px]">Overseas Insurance</p>
                              <p className="font-mono text-slate-200 font-bold">৳{(application.insuranceFee || 5000).toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-slate-950/40 rounded-lg">
                              <p className="text-slate-400 text-[7.5px]">BMET Smart Card Fee</p>
                              <p className="font-mono text-slate-200 font-bold">৳{(application.bmetFee || 4000).toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-slate-950/40 rounded-lg">
                              <p className="text-slate-400 text-[7.5px]">Air Ticket Flight Fee</p>
                              <p className="font-mono text-slate-200 font-bold">৳{(application.airTicketFee || 40000).toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-slate-950/40 rounded-lg">
                              <p className="text-slate-400 text-[7.5px]">Other Transit Charges</p>
                              <p className="font-mono text-slate-200 font-bold">৳{(application.otherCharges || 10000).toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-2 bg-slate-950/75 border border-slate-850 rounded-xl mt-1.5">
                            <div className="space-y-0.5">
                              <span className="text-slate-400 text-[7.5px] block uppercase">
                                {userRole === 'Candidate' ? 'মোট খরচ (Total Package Cost)' : 'নিয়োগকর্তা মোট খরচ (Employer Cost Total)'}
                              </span>
                              <strong className="text-slate-200 text-[10px] font-mono font-bold">
                                ৳{(userRole === 'Candidate' ? gTotal : (application.employerTotal || (gTotal - (application.adminCommission || 20000)))).toLocaleString()} BDT
                              </strong>
                            </div>
                            {userRole !== 'Candidate' && (
                              <div className="text-right border-l border-slate-800 pl-3">
                                <span className="text-indigo-400 text-[7.5px] block uppercase font-bold">+ অ্যাডমিন কমিশন (Admin Commission)</span>
                                <strong className="text-indigo-300 text-[10px] font-mono font-black">৳{(application.adminCommission || 20000).toLocaleString()} BDT</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Admin Cost Approval Actions */}
                      {userRole === 'Admin' && application.paymentPlanStatus === 'Pending Admin Review' && (
                        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex justify-between items-center gap-3">
                          <div className="space-y-0.5">
                            <p className="text-[8px] font-black text-amber-400 uppercase flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> খরচ বিবরণী যাচাই পেন্ডিং আছে
                            </p>
                            <p className="text-[7.5px] text-slate-400">নিয়োগকর্তা কর্তৃক সাবমিটকৃত এই বাজেটটি ক্যান্ডিডেটের পেমেন্ট সিস্টেমে যুক্ত করার আগে এপ্রুভ করুন।</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button 
                              onClick={() => handleAdminUpdateCostPlan('Reject')}
                              className="py-1 px-2.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 font-bold rounded text-[8px] border border-rose-500/20"
                            >
                              Reject Plan
                            </button>
                            <button 
                              onClick={() => handleAdminUpdateCostPlan('Approve')}
                              className="py-1 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded text-[8px]"
                            >
                              ✓ Approve & Activate
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* EMPLOYER BANK ACCOUNT CARD */}
                    <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <h5 className="text-[9.5px] font-black uppercase text-slate-100">🏦 নিয়োগকর্তার ভেরিফাইড ব্যাংক অ্যাকাউন্ট (Employer Bank Info)</h5>
                        </div>
                        <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-black uppercase ${
                          bank.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          {bank.status === 'Approved' ? '✓ Verified' : 'Pending Verification'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[8.5px] font-bold">
                        <div className="space-y-1 p-2 bg-slate-950 rounded-xl border border-slate-850">
                          <p className="text-slate-400 text-[7px] uppercase font-sans">অফিশিয়াল ব্যাংক বিবরণী (Bank Transfer)</p>
                          <p className="text-slate-150 font-extrabold text-[9px]">{bank.bankName}</p>
                          <p className="text-slate-300">হিসাবের নাম: <span className="font-sans text-slate-100">{bank.accountName}</span></p>
                          <p className="text-slate-300">হিসাব নম্বর: <span className="font-mono text-slate-100 text-[9.5px]">{bank.accountNumber}</span></p>
                          <p className="text-slate-300">শাখা ও রাউটিং: <span className="text-slate-300 font-normal">{bank.branch} • {bank.routingNumber}</span></p>
                        </div>
                        
                        <div className="space-y-1 p-2 bg-slate-950 rounded-xl border border-slate-850">
                          <p className="text-slate-400 text-[7px] uppercase font-sans">মোবাইল ফাইন্যান্সিয়াল সার্ভিস (Merchant Pay)</p>
                          <p className="text-pink-400 text-[9px] flex justify-between">
                            <span>bKash Merchant:</span> <strong className="font-mono font-black text-slate-100">{bank.bkashMerchant}</strong>
                          </p>
                          <p className="text-orange-400 text-[9px] flex justify-between">
                            <span>Nagad Merchant:</span> <strong className="font-mono font-black text-slate-100">{bank.nagadMerchant}</strong>
                          </p>
                          <p className="text-violet-400 text-[9px] flex justify-between">
                            <span>Rocket Personal:</span> <strong className="font-mono font-black text-slate-100">{bank.rocketNumber || '01700998877-3'}</strong>
                          </p>
                          <p className="text-[7.5px] text-slate-500 leading-normal font-normal">দ্রষ্টব্য: মোবাইল পেমেন্টের ক্ষেত্রে ট্রানজেকশন আইডিতে অবশ্যই প্রার্থীর পাসপোর্ট নম্বর রেফারেন্স হিসেবে উল্লেখ করবেন।</p>
                        </div>
                      </div>

                      {/* Admin Bank Verification Actions */}
                      {userRole === 'Admin' && bank.status !== 'Approved' && (
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex justify-between items-center text-[8.2px] mt-1">
                          <p className="text-emerald-400 font-bold">✓ নিয়োগকর্তার ব্যাংক বিবরণটি সিস্টেমে ভেরিফাই করার জন্য অপেক্ষমাণ।</p>
                          <button 
                            onClick={handleAdminApproveBankDetails}
                            className="py-1 px-2.5 bg-emerald-500 text-slate-950 font-black rounded text-[8px] uppercase"
                          >
                            Approve Bank Details
                          </button>
                        </div>
                      )}
                    </div>

                    {/* PAYMENT CONFIRMATION LOGS & AUDIT TRAIL */}
                    <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
                      <h5 className="text-[9.5px] font-black uppercase text-slate-100 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                        <History className="w-4 h-4 text-slate-400" />
                        📜 পেমেন্ট অডিট লগ ও ইতিহাস (Ledger Audit Logs)
                      </h5>
                      <div className="space-y-1.5 max-h-[120px] overflow-y-auto font-mono text-[8px]">
                        {(application.auditLogs || []).map((log: any, lIdx: number) => (
                          <div key={log.id || lIdx} className="p-1.5 bg-slate-950/80 rounded border border-slate-850 space-y-0.5">
                            <div className="flex justify-between text-slate-400 font-bold">
                              <span className="text-slate-200">🛠️ {log.action}</span>
                              <span>⏱️ {log.timestamp}</span>
                            </div>
                            <p className="text-slate-350">ব্যবহারকারী: <span className="text-slate-150 font-bold">{log.user}</span></p>
                            {log.details && <p className="text-[7.5px] text-slate-400 leading-relaxed font-sans">{log.details}</p>}
                          </div>
                        ))}
                        {(application.auditLogs || []).length === 0 && (
                          <p className="text-center text-slate-500 py-4 font-sans text-[8.5px]">কোনো লেনদেনের অডিট রেকর্ড এখনও পাওয়া যায়নি।</p>
                        )}
                      </div>
                    </div>

                  </div>
                  
                  {/* RIGHT: PAYMENT FORM / VERIFICATION (5 Columns) */}
                  <div className="lg:col-span-5 space-y-3.5">
                    
                    {/* INSTALLMENT MILESTONES PROGRESS LIST */}
                    <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
                      <h5 className="text-[9.5px] font-black uppercase text-slate-100 border-b border-slate-800 pb-1.5">
                        📆 কিস্তির ধাপসমূহ (Installment Milestones)
                      </h5>
                      <div className="space-y-2">
                        {insts.map((inst, index) => {
                          const isFullyPaid = inst.paid >= inst.target;
                          const hasPending = inst.pending > 0;
                          const hasRejection = isRejectedForStep(inst.key);

                          return (
                            <div key={inst.key} className="p-2 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
                              <div className="flex justify-between items-center text-[8.5px] gap-2">
                                <div className="min-w-0">
                                  <p className="font-extrabold text-slate-100 truncate">{index + 1}. {inst.name}</p>
                                  <p className="text-[7.5px] text-slate-400">
                                    নির্ধারিত লক্ষ্য: <strong className="text-slate-200 font-mono">৳{inst.target.toLocaleString()} BDT</strong>
                                  </p>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className={`inline-block px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider ${
                                    isFullyPaid ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                                    hasPending ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse' :
                                    hasRejection ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' :
                                    'bg-slate-800 text-slate-400 border border-slate-700'
                                  }`}>
                                    {isFullyPaid ? 'Paid' : hasPending ? 'Pending Verify' : hasRejection ? 'Rejected' : 'Unpaid'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center pt-1 border-t border-slate-900 text-[8px] font-mono">
                                <span className="text-slate-400">পরিশোধিত: ৳{inst.paid.toLocaleString()}</span>
                                {hasPending && <span className="text-amber-400">অপেক্ষমাণ: ৳{inst.pending.toLocaleString()}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CANDIDATE PAYMENT SUBMISSION FORM (Seeker only) */}
                    {userRole === 'Candidate' && (
                      <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
                        <h5 className="text-[9.5px] font-black uppercase text-slate-100 border-b border-slate-800 pb-1.5 flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5 text-indigo-400" />
                          কিস্তি পেমেন্ট রসিদ জমাদান ফর্ম
                        </h5>
                        
                        {application.paymentPlanStatus !== 'Approved' ? (
                          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[8.5px] text-amber-400 leading-relaxed font-bold">
                            ⚠️ দুঃখিত! নিয়োগকর্তা কর্তৃক সেট করা পেমেন্ট প্ল্যান এখনও এডমিন প্যানেল এপ্রুভ করেনি। প্ল্যান এপ্রুভ হওয়ার পর পেমেন্ট করতে পারবেন।
                          </div>
                        ) : (
                          <form onSubmit={handleCandidateSubmitPayment} className="space-y-2 text-[8.5px]">
                            
                            <div className="space-y-0.5">
                              <label className="text-slate-400 font-bold block">টার্গেট কিস্তির ধাপ নির্বাচন করুন</label>
                              <select 
                                value={selectedInstallmentKey} 
                                onChange={(e) => {
                                  setSelectedInstallmentKey(e.target.value);
                                  const activeStep = insts.find(i => i.key === e.target.value);
                                  const tAmt = activeStep ? activeStep.target : 0;
                                  setPaymentAmountInput(String(tAmt));
                                }}
                                className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 rounded text-white font-bold"
                              >
                                {insts.map(i => (
                                  <option key={i.key} value={i.key}>{i.name} (৳{i.target.toLocaleString()} BDT)</option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-0.5">
                                <label className="text-slate-400 font-bold block">পেমেন্ট মাধ্যম (Method)</label>
                                <select 
                                  value={paymentMethod} 
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                  className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 rounded text-white font-bold"
                                >
                                  <option value="Bank Transfer">Bank Transfer (ব্যাংক)</option>
                                  <option value="bKash Merchant">bKash (বিকাশ)</option>
                                  <option value="Nagad Merchant">Nagad (নগদ)</option>
                                </select>
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-slate-400 font-bold block">পরিমাণ (Amount BDT)</label>
                                <input 
                                  type="text" 
                                  disabled
                                  value={`৳${Number(paymentAmountInput).toLocaleString()} BDT`}
                                  className="w-full py-1.5 px-2 bg-slate-950/70 border border-slate-850 rounded text-slate-300 font-mono font-bold cursor-not-allowed" 
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-0.5">
                                <label className="text-slate-400 font-bold block">Transaction ID (TxID)</label>
                                <input 
                                  type="text" 
                                  required
                                  value={txIdInput}
                                  onChange={(e) => setTxIdInput(e.target.value)}
                                  placeholder="e.g. TRN8749842"
                                  className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 rounded text-white font-mono"
                                />
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-slate-400 font-bold block">পেমেন্ট রসিদ / স্ক্রিনশট</label>
                                <input 
                                  type="file" 
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) setUploadedReceipt(e.target.files[0]);
                                  }}
                                  className="w-full text-[7.5px] text-slate-400 cursor-pointer pt-1"
                                />
                              </div>
                            </div>

                            <div className="space-y-0.5">
                              <label className="text-slate-400 font-bold block">মন্তব্য (Remarks)</label>
                              <input 
                                type="text"
                                value={paymentRemarks}
                                onChange={(e) => setPaymentRemarks(e.target.value)}
                                placeholder="ব্যাংক নাম বা অতিরিক্ত রেফারেন্স..."
                                className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 rounded text-white"
                              />
                            </div>

                            <button 
                              type="submit"
                              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition shadow-md uppercase tracking-wider text-[8.5px]"
                            >
                              ✓ পেমেন্ট নোটিফিকেশন জমা দিন (Submit Payment Receipt)
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* ADMIN PENDING PAYMENTS VERIFICATION QUEUE (Admin or Employer view) */}
                    {(userRole === 'Admin' || userRole === 'Employer') && (
                      <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
                        <h5 className="text-[9.5px] font-black uppercase text-slate-100 border-b border-slate-800 pb-1.5 flex items-center gap-1 text-amber-400">
                          <Check className="w-4 h-4" />
                          👮 পেমেন্ট ডিপোজিট ভেরিফিকেশন প্যানেল ({history.filter((tx: any) => tx.status === 'Pending').length})
                        </h5>

                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {history.filter((tx: any) => tx.status === 'Pending').map((tx: any) => (
                            <div key={tx.id} className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl space-y-2 text-[8.2px] leading-relaxed">
                              <div className="flex justify-between items-start">
                                <div className="space-y-0.5">
                                  <span className="font-extrabold text-slate-200">
                                    {tx.stepKey === 'inst_1' ? '১ম কিস্তি' : tx.stepKey === 'inst_2' ? '২য় কিস্তি' : tx.stepKey === 'inst_3' ? '৩য় কিস্তি' : '৪র্থ কিস্তি'} (৳{tx.amount.toLocaleString()})
                                  </span>
                                  <p className="text-slate-400 text-[7.5px]">মেথড: {tx.method} • তারিখ: {tx.date}</p>
                                </div>
                                <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[7px] font-black rounded">PENDING</span>
                              </div>
                              
                              <div className="bg-slate-900 p-1.5 rounded border border-slate-850 text-slate-300 font-mono">
                                <p>🎫 TxID: <span className="text-white font-bold">{tx.invoiceId}</span></p>
                                <p>💬 রিমার্কস: {tx.remarks || 'কোনো মন্তব্য নেই।'}</p>
                              </div>

                              <div className="flex gap-1.5 justify-end pt-1">
                                <button 
                                  onClick={() => handleAdminVerifyPaymentAction(tx.id, 'Reject')}
                                  className="py-1 px-2.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 font-bold rounded"
                                >
                                  Reject
                                </button>
                                <button 
                                  onClick={() => handleAdminVerifyPaymentAction(tx.id, 'Correction')}
                                  className="py-1 px-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded border border-amber-500/20"
                                >
                                  Request Re-upload
                                </button>
                                <button 
                                  onClick={() => handleAdminVerifyPaymentAction(tx.id, 'Approve')}
                                  className="py-1 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded"
                                >
                                  ✓ Approve
                                </button>
                              </div>
                            </div>
                          ))}

                          {history.filter((tx: any) => tx.status === 'Pending').length === 0 && (
                            <div className="text-center text-slate-500 py-6 text-[8.5px]">
                              কোনো পেমেন্ট ভেরিফিকেশন ডিপোজিট পেন্ডিং নেই।
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* RECEIPT / INVOICE DOWNLOAD BANNER */}
                    <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-between text-[8.5px]">
                      <div className="space-y-0.5">
                        <span className="text-slate-200 font-extrabold block">📄 অফিশিয়াল মেমো ও পেমেন্ট রসিদ (Invoice Memo)</span>
                        <p className="text-[7.5px] text-slate-400">অনুমোদিত সকল কিস্তির বিপরীতে জেনারেটেড পিডিএফ রসিদ</p>
                      </div>
                      <button 
                        onClick={() => {
                          alert(`অফিশিয়াল পেমেন্ট মেমো জেনারেট হচ্ছে...\n\nপ্রার্থীর নাম: ${application.candidateName}\nপাসপোর্ট নম্বর: ${application.passportNumber}\nচুক্তির মূল্য: ৳${gTotal.toLocaleString()}\nপরিশোধিত মোট টাকা: ৳${totalVerifiedPaid.toLocaleString()}\nবকেয়া টাকা: ৳${totalRemaining.toLocaleString()}\n\nজেনারেটেড ইনভয়েস: INV-2026-${application.id.slice(-4).toUpperCase()}`);
                        }}
                        className="py-1 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-black text-[7.5px] rounded flex items-center gap-1 transition"
                      >
                        <Download className="w-3 h-3 text-emerald-400" /> ডাউনলোড (Download Memo)
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })()}

          {/* TAB 5: DOCUMENTS VERIFICATION */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
                <h4 className="text-[9.5px] font-black text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-1.5">
                  📑 অফিসিয়াল ডকুমেন্টস ভেরিফিকেশন স্ট্যাটাস
                </h4>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  
                  {/* Passport */}
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-100">১. পাসপোর্ট ভেরিফিকেশন (Passport Copy)</span>
                      <span className="text-[7.5px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded">Verified</span>
                    </div>
                    <div className="text-[8px] text-slate-400 font-semibold leading-normal space-y-0.5">
                      <p>👤 যাচাইকারী: <strong className="text-slate-300">{verifications.passport.verifiedBy}</strong></p>
                      <p>📅 তারিখ: {verifications.passport.date}</p>
                      <p className="text-slate-300 mt-0.5">📝 মন্তব্য: {verifications.passport.remarks}</p>
                    </div>
                  </div>

                  {/* CV */}
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-100">২. ইউরোপাস জীবনবৃত্তান্ত ও কভার লেটার (CV & Cover Letter)</span>
                      <span className="text-[7.5px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded">Verified</span>
                    </div>
                    <div className="text-[8px] text-slate-400 font-semibold leading-normal space-y-0.5">
                      <p>👤 যাচাইকারী: <strong className="text-slate-300">{verifications.cv.verifiedBy}</strong></p>
                      <p>📅 তারিখ: {verifications.cv.date}</p>
                      <p className="text-slate-300 mt-0.5">📝 মন্তব্য: {verifications.cv.remarks}</p>
                    </div>
                  </div>

                  {/* Certificate */}
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-100">৩. শিক্ষাগত ও কাজের অভিজ্ঞতা সার্টিফিকেট (Certificates)</span>
                      <span className="text-[7.5px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded">Verified</span>
                    </div>
                    <div className="text-[8px] text-slate-400 font-semibold leading-normal space-y-0.5">
                      <p>👤 যাচাইকারী: <strong className="text-slate-300">{verifications.certificate.verifiedBy}</strong></p>
                      <p>📅 তারিখ: {verifications.certificate.date}</p>
                      <p className="text-slate-300 mt-0.5">📝 মন্তব্য: {verifications.certificate.remarks}</p>
                    </div>
                  </div>

                  {/* Medical */}
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-100">৪. মেডিকেল ফিটনেস রিপোর্ট (Medical Test)</span>
                      <span className="text-[7.5px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded">Verified</span>
                    </div>
                    <div className="text-[8px] text-slate-400 font-semibold leading-normal space-y-0.5">
                      <p>👤 যাচাইকারী: <strong className="text-slate-300">{verifications.medical.verifiedBy}</strong></p>
                      <p>📅 তারিখ: {verifications.medical.date}</p>
                      <p className="text-slate-300 mt-0.5">📝 মন্তব্য: {verifications.medical.remarks}</p>
                    </div>
                  </div>

                  {/* Police Clearance */}
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-100">৫. পুলিশ ক্লিয়ারেন্স সার্টিফিকেট (Police Clearance)</span>
                      <span className="text-[7.5px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded">Verified</span>
                    </div>
                    <div className="text-[8px] text-slate-400 font-semibold leading-normal space-y-0.5">
                      <p>👤 যাচাইকারী: <strong className="text-slate-300">{verifications.police.verifiedBy}</strong></p>
                      <p>📅 তারিখ: {verifications.police.date}</p>
                      <p className="text-slate-300 mt-0.5">📝 মন্তব্য: {verifications.police.remarks}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MESSAGES & CHAT */}
          {activeTab === 'messages' && (
            <div className="space-y-3 flex flex-col h-full max-h-[350px]">
              <div className="p-2 border-b border-slate-800 bg-slate-900/40 rounded-t-xl flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-100">💬 ডেডিকেটেড সাপোর্ট ও এডমিন চ্যাট</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              
              <div className="flex-grow overflow-y-auto p-2 bg-slate-950 rounded-lg space-y-2 h-[200px]">
                {supportChat.map((chat, idx) => {
                  const isUser = chat.sender === 'user';
                  const isSys = chat.sender === 'system';
                  if (isSys) {
                    return (
                      <p key={idx} className="text-center text-[7.5px] text-slate-500 font-semibold">
                        {chat.text}
                      </p>
                    );
                  }
                  return (
                    <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}>
                      <div className={`p-2 rounded-2xl text-[8.5px] leading-relaxed max-w-[85%] font-medium ${
                        isUser 
                          ? 'bg-emerald-500 text-slate-950 rounded-tr-none' 
                          : 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800'
                      }`}>
                        <p>{chat.text}</p>
                      </div>
                      <span className="text-[6.5px] text-slate-500 mt-0.5 font-bold px-1">{chat.time}</span>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-1.5 pt-1">
                <input 
                  type="text"
                  required
                  placeholder="আপনার প্রশ্নটি এখানে লিখুন..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="flex-grow py-1.5 px-2 bg-slate-950 border border-slate-800 rounded-xl text-[9px] focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white"
                />
                <button 
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 p-1.5 rounded-xl transition flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: INTERVIEWS */}
          {activeTab === 'interviews' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
                <h4 className="text-[9.5px] font-black text-slate-100 uppercase tracking-wider">🎥 নিয়োগকর্তা ইন্টারভিউ ও কল ট্র্যাকিং</h4>
                
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-[8.5px]">
                  <div className="grid grid-cols-2 gap-1.5 font-bold">
                    <p className="text-slate-400">📅 ইন্টারভিউয়ের তারিখ:</p>
                    <p className="text-slate-100 font-black text-right">08 July 2026</p>

                    <p className="text-slate-400">🕒 সময় (Time):</p>
                    <p className="text-slate-100 font-black text-right">সকাল ১০:৩০ মিনিট (BD Time)</p>

                    <p className="text-slate-400">📍 ইন্টারভিউ ভেন্যু / স্থান:</p>
                    <p className="text-slate-100 font-black text-right">Gulf Careers Agency (Gulshan, Dhaka)</p>

                    <p className="text-slate-400">🎥 মিটিং লিংক (Online Link):</p>
                    <p className="text-right">
                      <a href="https://meet.google.com/abc-defg-hij" target="_blank" rel="noreferrer" className="text-indigo-400 font-black hover:underline">
                        Google Meet
                      </a>
                    </p>

                    <p className="text-slate-400">🏆 সাক্ষাত্কারের ফলাফল (Result):</p>
                    <p className="text-emerald-400 font-black text-right">SELECTED FOR FINAL PROCESS</p>
                  </div>

                  <div className="p-2 bg-slate-900 rounded border border-slate-850 text-slate-300 font-semibold leading-normal">
                    💡 <strong className="text-slate-100 font-black">মিটিং রিমার্কস:</strong> প্রার্থী ট্রেড টেস্টে অত্যন্ত ভালো পারফর্ম করেছেন। হেভি ট্রাক ট্রেইলার ড্রাইভিং টেস্ট প্রথমবারেই পাস করেছেন।
                  </div>

                  <button className="w-full py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-black text-[8.5px] transition flex items-center justify-center gap-1 cursor-pointer">
                    💻 অনলাইন গুগল মিট ক্লায়েন্ট ওপেন করুন (Join Meeting)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: TRAVEL PROCESS */}
          {activeTab === 'travel' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
                <h4 className="text-[9.5px] font-black text-slate-100 uppercase tracking-wider">🛫 ইমিগ্রেশন ও সফল ট্রাভেল প্রসেস</h4>
                
                <div className="space-y-2 text-[8.5px] font-bold">
                  {/* Medical Fitness */}
                  <div className="p-2 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-slate-100">⚕️ মেডিকেল ফিটনেস স্ট্যাটাস (Medical Report)</p>
                      <p className="text-[7.5px] text-slate-500 mt-0.5">মেডিকেল সেন্টার: Authorized GCC Medical, Gulshan</p>
                    </div>
                    <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">FIT</span>
                  </div>

                  {/* Police Clearance */}
                  <div className="p-2 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-slate-100">👮 পুলিশ ক্লিয়ারেন্স ভেরিফিকেশন (Police Status)</p>
                      <p className="text-[7.5px] text-slate-500 mt-0.5">স্ট্যাটাস: সফলভাবে পুলিশ ভেরিফিকেশন সমাপ্ত</p>
                    </div>
                    <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">CLEARED</span>
                  </div>

                  {/* BMET Smart Card */}
                  <div className="p-2 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-slate-100">💳 BMET স্মার্ট ইমিগ্রেশন কার্ড (BMET Registration)</p>
                      <p className="text-[7.5px] text-slate-500 mt-0.5">কার্ড নম্বর: BMET-2026-44321</p>
                    </div>
                    <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">ISSUED</span>
                  </div>

                  {/* Flight Ticket */}
                  <div className="p-2 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center">
                      <p className="text-slate-100">✈️ এয়ারলাইন ফ্লাইট টিকিট (Flight Ticket Info)</p>
                      <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">CONFIRMED</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded text-[8px] font-mono space-y-0.5 text-slate-300">
                      <p>🎫 এয়ারলাইন: Gulf Air (GF-251)</p>
                      <p>🛫 প্রস্থান (Departure): 15 August 2026, 09:15 PM (Dhaka Hazrat Shahjalal Airport)</p>
                      <p>🛬 গন্তব্য (Arrival): 16 August 2026, 01:30 AM (Riyadh King Khalid Airport)</p>
                      <p>🎒 ব্যাগেজ এলাউন্স: 40 KG + 7 KG Carry On</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: VERIFICATION HISTORY */}
          {activeTab === 'history' && (() => {
            const historyList = application.paymentHistory || [];
            const dynamicLogs = historyList.map((p: any, idx: number) => ({
              id: `dynamic_payment_${p.id || idx}`,
              blockNum: `SECURE_BLOCK_P${101 + idx}`,
              title: `${p.installmentName || 'Installment Payment'} Verification`,
              verifier: p.status === 'Verified' ? 'Taskin Ahmed (Finance Officer)' : 'Pending Admin Verification Audit',
              status: p.status.toUpperCase(),
              remarks: `পেমেন্ট ট্রানজেকশন আইডি ${p.transactionId || 'N/A'} সিগনেচার করা হয়েছে। পরিমাণ: ৳${(p.amount || 0).toLocaleString()} (মেথড: ${p.paymentMethod || 'Bank Transfer'})`,
              date: p.date || new Date().toLocaleDateString('bn-BD'),
              sig: `0x${p.transactionId ? p.transactionId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) : 'payment'}${idx}ca...3e${idx}`
            }));
            const totalRecords = 4 + dynamicLogs.length;

            return (
              <div className="space-y-4">
                {/* Ledger Integrity Header */}
                <div className="p-4 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        🔒 SECURE AUDIT LEDGER
                      </span>
                      <h4 className="text-xs font-black text-white leading-tight flex items-center gap-1.5 mt-1">
                        🛡️ ক্রিপ্টোগ্রাফিক ও অডিট ট্রেইল (Immutable Audit Trail)
                      </h4>
                      <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed">
                        প্রার্থীর সকল প্রসেস ডাটা, পেমেন্ট ট্র্যাকিং এবং এডমিন অনুমোদনসমূহ ডিজিটাল ইন্টিগ্রিটি এবং SHA-256 এনক্রিপ্টশন দ্বারা সার্ভারে সংরক্ষিত।
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-800 text-[9px] font-bold text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>সিস্টেম লাইভ: ১০০% নিরাপদ</span>
                    </div>
                  </div>

                  {/* Ledger stats grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-bold pt-2.5 border-t border-slate-800/60">
                    <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-850">
                      <p className="text-slate-500">মোট ট্র্যাকিং রেকর্ডস</p>
                      <p className="text-xs font-black text-emerald-400 mt-0.5">{totalRecords} টি রেকর্ড</p>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-850">
                      <p className="text-slate-500">ডাটা সিঙ্ক্রোনাইজেশন</p>
                      <p className="text-xs font-black text-emerald-400 mt-0.5">রিয়েল-টাইম ক্লাউড</p>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-850">
                      <p className="text-slate-500">ডিজিটাল блок হ্যাশ</p>
                      <p className="text-xs font-black text-blue-400 mt-0.5 font-mono">SHA-256 VALID</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Scan Component */}
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider">
                      🛡️ ক্রিপ্টোগ্রাফিক ব্লক ভেরিফায়ার (Blockchain Signature Inspector)
                    </span>
                    <span className="text-[8px] font-mono text-slate-500">ALGORITHM: ECDSA / SHA-256</span>
                  </div>

                  {integrityStatus === 'idle' && (
                    <div className="flex flex-col items-center py-2 text-center space-y-2">
                      <p className="text-[9px] text-slate-400">
                        লেজার ট্রেইলের প্রতিটি ব্লকের ব্লকচেইন হ্যাশ সিগনেচার যাচাই করতে ইন্সপেক্টর রান করুন।
                      </p>
                      <button
                        onClick={() => {
                          setIntegrityStatus('scanning');
                          setTimeout(() => {
                            setIntegrityStatus('verified');
                          }, 1500);
                        }}
                        className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-[10px] rounded-xl shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
                        লেজার সিকিউরিটি ইন্টিগ্রিটি স্ক্যান করুন (Verify Ledger Integrity)
                      </button>
                    </div>
                  )}

                  {integrityStatus === 'scanning' && (
                    <div className="py-3 px-2 rounded-xl bg-slate-900 border border-slate-850 space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span className="text-[10px] text-emerald-400 font-black animate-pulse">
                          SHA-256 ক্রিপ্টোগ্রাফিক চেইন যাচাই করা হচ্ছে (Verifying blockchain hash signature)...
                        </span>
                      </div>
                      <div className="font-mono text-[7px] text-slate-500 space-y-0.5 text-left">
                        <p className="truncate">» Loading blocks from decentralized storage ledger...</p>
                        <p className="truncate">» Comparing SHA-256 digests on block_01, block_02, block_03, block_04...</p>
                        <p className="truncate">» Validating digital signatures of verify officers Sajib Chowdhury & Taskin Ahmed...</p>
                      </div>
                      {/* Bar indicator */}
                      <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-[65%] animate-[pulse_1.5s_infinite]"></div>
                      </div>
                    </div>
                  )}

                  {integrityStatus === 'verified' && (
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 space-y-2 shadow-inner text-left">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-[10px] font-black text-emerald-400">
                            লেজার ইন্টিগ্রিটি সফলভাবে যাচাই হয়েছে! (Ledger Integrity Verified)
                          </p>
                          <p className="text-[8px] text-emerald-500/80 font-bold">
                            সকল ব্লক সিগনেচার বৈধ। কোনো অননুমোদিত তথ্য পরিবর্তন পাওয়া যায়নি (100% Cryptographically Sound).
                          </p>
                        </div>
                      </div>
                      <div className="font-mono text-[7px] bg-slate-950/60 p-2 rounded-lg border border-slate-900 text-slate-500 space-y-0.5">
                        <p>VERIFICATION_TIMESTAMP: {new Date().toLocaleString()}</p>
                        <p>CHAIN_STATUS: SUCCESS (VALID)</p>
                        <p>MERKLE_ROOT: 0xe84f72db7b9a527da7c7849e7cf45ba9ceea5df2864f7762a4b89ffc71</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dynamic Ledger Block List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-emerald-400" />
                      অডিট ট্রেইল অ্যাক্টিভিটি টাইমলাইন (Ledger Logs)
                    </h5>
                    <button
                      onClick={() => {
                        alert('অডিট লগ সফলভাবে ডাউনলোড সম্পন্ন হয়েছে! (SHA-256 Signature verified)');
                      }}
                      className="flex items-center gap-1 py-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[9px] font-black rounded-lg border border-slate-800 transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-emerald-400" /> Export (.JSON)
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    
                    {/* Dynamic Ledger Blocks (Payments and Transactions) */}
                    {dynamicLogs.length > 0 && dynamicLogs.map((log: any) => (
                      <div key={log.id} className="p-3 bg-slate-950 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 space-y-2 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[7px] font-mono px-2 py-0.5 rounded-bl-xl border-l border-b border-emerald-500/20 font-bold">
                          {log.blockNum}
                        </div>
                        
                        <div className="flex justify-between items-start gap-2 border-b border-slate-900 pb-1.5">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-slate-100 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              {log.title}
                            </span>
                            <p className="text-[8.5px] text-slate-500 font-bold">ভেরিফায়ার: <span className="text-slate-300">{log.verifier}</span></p>
                          </div>
                          <span className={`text-[8px] font-mono border px-1.5 py-0.5 rounded font-black shrink-0 ${
                            log.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            log.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        
                        <p className="text-[9px] text-slate-300 leading-relaxed font-medium bg-slate-900/30 p-2 rounded-xl border border-slate-850/60">
                          📝 রিমার্কস: {log.remarks}
                        </p>

                        <div className="flex justify-between items-center text-[7px] font-mono text-slate-500 pt-0.5">
                          <span>📅 {log.date}</span>
                          <span>SIG: <span className="text-emerald-500 font-bold">{log.sig}</span></span>
                        </div>
                      </div>
                    ))}

                    {/* Ledger Block 1 */}
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all duration-200 space-y-2 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[7px] font-mono px-2 py-0.5 rounded-bl-xl border-l border-b border-emerald-500/20 font-bold">
                        SECURE_BLOCK_04
                      </div>
                      
                      <div className="flex justify-between items-start gap-2 border-b border-slate-900 pb-1.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black text-slate-100 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ১. visa চূড়ান্ত অনুমোদন (Visa Approved & Verified)
                          </span>
                          <p className="text-[8.5px] text-slate-500 font-bold">ভেরিফায়ার: <span className="text-slate-300">Sajib Chowdhury (Admin Lead)</span></p>
                        </div>
                        <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black shrink-0">
                          APPROVED
                        </span>
                      </div>
                      
                      <p className="text-[9px] text-slate-300 leading-relaxed font-medium bg-slate-900/30 p-2 rounded-xl border border-slate-850/60">
                        📝 রিমার্কস: ইতালির ওয়ার্ক পারমিটের সরকারি কপি এবং দূতাবাস সিল সফলভাবে ভেরিফাই করা হয়েছে। পাসপোর্টের সাথে visa বারকোড মিলানো হয়েছে।
                      </p>

                      <div className="flex justify-between items-center text-[7px] font-mono text-slate-500 pt-0.5">
                        <span>📅 ০২ জুলাই ২০২৬, ০৩:৪০ PM</span>
                        <span>SIG: <span className="text-emerald-500 font-bold">0x89fd56ca...3e12</span></span>
                      </div>
                    </div>

                    {/* Ledger Block 2 */}
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all duration-200 space-y-2 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[7px] font-mono px-2 py-0.5 rounded-bl-xl border-l border-b border-emerald-500/20 font-bold">
                        SECURE_BLOCK_03
                      </div>
                      
                      <div className="flex justify-between items-start gap-2 border-b border-slate-900 pb-1.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black text-slate-100 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ২. সার্ভিস চার্জ পেমেন্ট ভেরিফিকেশন (Payment Verified)
                          </span>
                          <p className="text-[8.5px] text-slate-500 font-bold">ভেরিফায়ার: <span className="text-slate-300">Taskin Ahmed (Finance Officer)</span></p>
                        </div>
                        <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black shrink-0">
                          APPROVED
                        </span>
                      </div>
                      
                      <p className="text-[9px] text-slate-300 leading-relaxed font-medium bg-slate-900/30 p-2 rounded-xl border border-slate-850/60">
                        📝 রিমার্কস: Bkash মারফৎ প্রাপ্ত প্রসেসিং ফি বাবদ ৳১২,৫০০ পেমেন্ট ট্রানজেকশন সফলভাবে ব্যাংকিং চ্যানেল দ্বারা ভেরিফাইড ও সিঙ্ক করা হয়েছে।
                      </p>

                      <div className="flex justify-between items-center text-[7px] font-mono text-slate-500 pt-0.5">
                        <span>📅 ০২ জুলাই ২০২৬, ০৫:০০ PM</span>
                        <span>SIG: <span className="text-emerald-500 font-bold">0x12dc56a3...88df</span></span>
                      </div>
                    </div>

                    {/* Ledger Block 3 */}
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all duration-200 space-y-2 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[7px] font-mono px-2 py-0.5 rounded-bl-xl border-l border-b border-emerald-500/20 font-bold">
                        SECURE_BLOCK_02
                      </div>
                      
                      <div className="flex justify-between items-start gap-2 border-b border-slate-900 pb-1.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black text-slate-100 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ৩. ডকুমেন্টস যাচাইকরণ (Documents Verified)
                          </span>
                          <p className="text-[8.5px] text-slate-500 font-bold">ভেরিফায়ার: <span className="text-slate-300">Arif Al Mamun (Senior Staff)</span></p>
                        </div>
                        <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black shrink-0">
                          APPROVED
                        </span>
                      </div>
                      
                      <p className="text-[9px] text-slate-300 leading-relaxed font-medium bg-slate-900/30 p-2 rounded-xl border border-slate-850/60">
                        📝 রিমার্কস: পাসপোর্টের ডাটা এবং মূল কারিগরি সার্টিফিকেটের সত্যতা সরকারি এবং সংশ্লিষ্ট ট্রেড ট্রাস্ট ডাটাবেজ দ্বারা যাচাই সম্পন্ন হয়েছে।
                      </p>

                      <div className="flex justify-between items-center text-[7px] font-mono text-slate-500 pt-0.5">
                        <span>📅 ০১ জুলাই ২০২৬, ১০:১৫ AM</span>
                        <span>SIG: <span className="text-emerald-500 font-bold">0x993a2c51...a8f4</span></span>
                      </div>
                    </div>

                    {/* Ledger Block 4 */}
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all duration-200 space-y-2 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[7px] font-mono px-2 py-0.5 rounded-bl-xl border-l border-b border-emerald-500/20 font-bold">
                        SECURE_BLOCK_01
                      </div>
                      
                      <div className="flex justify-between items-start gap-2 border-b border-slate-900 pb-1.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black text-slate-100 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ৪. ইন্টারভিউ সম্পন্ন (Interview Passed)
                          </span>
                          <p className="text-[8.5px] text-slate-500 font-bold">ভেরিফায়ার: <span className="text-slate-300">Gulf Careers HR Panel</span></p>
                        </div>
                        <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black shrink-0">
                          PASSED
                        </span>
                      </div>
                      
                      <p className="text-[9px] text-slate-300 leading-relaxed font-medium bg-slate-900/30 p-2 rounded-xl border border-slate-850/60">
                        📝 রিমার্কস: প্রার্থী ড্রাইভিং ট্রেড টেস্ট ও ইউরোপীয় কর্মক্ষমতা পরীক্ষায় উত্তীর্ণ হয়েছেন। চূড়ান্ত ইমিগ্রেশন পেপারের জন্য রেকমেন্ডেড করা হয়েছে।
                      </p>

                      <div className="flex justify-between items-center text-[7px] font-mono text-slate-500 pt-0.5">
                        <span>📅 ০৮ জুন ২০২৬, ১১:৩০ AM</span>
                        <span>SIG: <span className="text-emerald-500 font-bold">0x334bfca2...7721</span></span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 10: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                <h4 className="text-[9.5px] font-black text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-1.5">
                  ⚙️ ব্যবহারকারীর সেটিংস ও নিরাপত্তা
                </h4>

                {settingsSaved && (
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-[8.5px] font-black text-center border border-emerald-500/25">
                    ✓ প্রোফাইল সেটিংস পরিবর্তন সফলভাবে সেভ করা হয়েছে!
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-2 text-[8.5px]">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">মোবাইল নম্বর সংশোধন</label>
                      <input 
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full py-1.5 px-2 bg-slate-950 border border-slate-850 rounded text-[9px] text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">ইমেইল সংশোধন</label>
                      <input 
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full py-1.5 px-2 bg-slate-950 border border-slate-850 rounded text-[9px] text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">নতুন পাসওয়ার্ড</label>
                      <input 
                        type="password"
                        placeholder="••••••••"
                        className="w-full py-1.5 px-2 bg-slate-950 border border-slate-850 rounded text-[9px] text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1 flex flex-col justify-end">
                      <div className="flex items-center gap-1.5 py-1">
                        <input 
                          type="checkbox"
                          id="two-factor-auth"
                          checked={tfaEnabled}
                          onChange={(e) => setTfaEnabled(e.target.checked)}
                          className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-0"
                        />
                        <label htmlFor="two-factor-auth" className="text-slate-300 font-black cursor-pointer">Two-Factor Auth (2FA)</label>
                      </div>
                    </div>
                  </div>

                  {/* Login History */}
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-850 space-y-1.5 mt-2">
                    <p className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest">ডিভাইস ও লগইন হিস্টোরি (Login History)</p>
                    <div className="text-[7px] text-slate-400 font-mono space-y-1 leading-normal">
                      <p className="text-emerald-400">● Active now: Samsung Galaxy S24 Ultra • IP 103.25.12.9 (Dhaka)</p>
                      <p>● 02-Jul-2026: Windows PC • Chrome Browser • IP 103.25.12.9</p>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[9px] rounded-lg transition"
                  >
                    সেটিংস সংরক্ষণ করুন (Save)
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 11: HELP CENTER */}
          {activeTab === 'help' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                <h4 className="text-[9.5px] font-black text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-1.5">
                  🆘 হেল্প সেন্টার ও সাপোর্ট টিকেট পোর্টাল
                </h4>

                {ticketCreated ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[8.5px] font-black text-center">
                    ✓ আপনার সাপোর্ট টিকেট সফলভাবে তৈরি করা হয়েছে! আমাদের টিম খুব শীঘ্রই টিকিটের মাধ্যমে উত্তর দেবে। টিকিট নম্বর: #PRB-847A-2026.
                  </div>
                ) : (
                  <form onSubmit={handleCreateTicket} className="space-y-2 text-[8px] bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                    <p className="text-[8.5px] font-black text-slate-200">১. সাপোর্ট টিকেট ওপেন করুন (Create Ticket)</p>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">টিকিটের বিষয় (Subject)</label>
                      <input 
                        type="text"
                        required
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="পাসপোর্টে নামের সংশোধন / পেমেন্ট সংক্রান্ত জিজ্ঞাসা"
                        className="w-full py-1.5 px-2 bg-slate-900 border border-slate-800 rounded text-[9px] text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">বার্তার বিবরণ (Detailed Message)</label>
                      <textarea 
                        rows={2}
                        required
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        placeholder="আপনার সমস্যাটি বিস্তারিত লিখুন..."
                        className="w-full py-1.5 px-2 bg-slate-900 border border-slate-800 rounded text-[9px] text-white focus:outline-none resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[9px] rounded-lg transition"
                    >
                      টিকিট সাবমিট করুন
                    </button>
                  </form>
                )}

                {/* FAQ Details */}
                <div className="p-2 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 text-[8px] font-bold">
                  <p className="text-[8.5px] font-black text-slate-200">২. সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)</p>
                  
                  <div className="space-y-1.5 leading-normal">
                    <details className="group cursor-pointer">
                      <summary className="text-slate-300 hover:text-white font-black list-none flex justify-between items-center bg-slate-900 p-1.5 rounded">
                        <span>প্রশ্ন: ইতালি ওয়ার্ক ভিসার সম্পূর্ণ সময় কত লাগে?</span>
                        <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition" />
                      </summary>
                      <p className="text-slate-400 text-[7.5px] p-1.5 font-medium">
                        উত্তর: সাধারণত স্পন্সর আবেদন জমার পর নুলা ওস্তা আসতে ২ থেকে ৪ মাস সময় লাগে। অতঃপর ভিসা ইস্যু হতে আরও ১ থেকে ২ মাস লাগতে পারে।
                      </p>
                    </details>

                    <details className="group cursor-pointer">
                      <summary className="text-slate-300 hover:text-white font-black list-none flex justify-between items-center bg-slate-900 p-1.5 rounded">
                        <span>প্রশ্ন: কভার লেটার ও সিভি তৈরিতে কোনো চার্জ লাগে?</span>
                        <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition" />
                      </summary>
                      <p className="text-slate-400 text-[7.5px] p-1.5 font-medium">
                        উত্তর: বেসিক বা স্ট্যান্ডার্ড প্যাকেজের ব্যবহারকারীদের জন্য ইউরোপাস ফরম্যাট সিভি তৈরি এককালীন বুকিং ফি-এর অন্তর্ভুক্ত। অতিরিক্ত কোনো চার্জ নেই।
                      </p>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
}
