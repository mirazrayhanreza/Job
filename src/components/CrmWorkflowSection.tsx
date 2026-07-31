import React, { useState } from 'react';
import { 
  Check, X, Calendar, DollarSign, FileText, Video, Globe, Upload, Eye, 
  Download, CreditCard, AlertCircle, CheckCircle, Clock, User, MapPin, 
  Sparkles, ChevronRight, Plus, ArrowUpRight, ShieldAlert, HeartHandshake, Settings
} from 'lucide-react';
import { Application } from '../mockData';
import DynamicContractWorkflowManager from './workflow/DynamicContractWorkflowManager';

// Preset package values for countries
export const COUNTRY_PACKAGES = {
  Serbia: {
    countryName: 'Serbia 🇷🇸',
    totalAmount: 650000,
    installments: [
      { name: '1st Installment (Booking & Agreement)', amount: 150000 },
      { name: '2nd Installment (Work Permit Received)', amount: 250000 },
      { name: '3rd Installment (Visa Delivery & Flight)', amount: 250000 }
    ]
  },
  Italy: {
    countryName: 'Italy 🇮🇹',
    totalAmount: 850000,
    installments: [
      { name: '1st Installment (Booking & Agreement)', amount: 200000 },
      { name: '2nd Installment (Work Permit / Nulla Osta)', amount: 350000 },
      { name: '3rd Installment (Visa Delivery & Flight)', amount: 300000 }
    ]
  },
  Romania: {
    countryName: 'Romania 🇷🇴',
    totalAmount: 750000,
    installments: [
      { name: '1st Installment (Booking & Agreement)', amount: 180000 },
      { name: '2nd Installment (Work Permit Issued)', amount: 270000 },
      { name: '3rd Installment (Visa Delivery & Flight)', amount: 300000 }
    ]
  }
};

interface CrmWorkflowSectionProps {
  viewType: 'candidate' | 'agency' | 'admin';
  applications: Application[];
  onUpdateApplication: (updatedApp: Application) => void;
  currentCandidateEmail?: string;
  selectedAppIdFromParent?: string;
  lang?: 'bn' | 'en';
}

export const CrmWorkflowSection: React.FC<CrmWorkflowSectionProps> = ({
  viewType,
  applications,
  onUpdateApplication,
  currentCandidateEmail = 'ariful@example.com',
  selectedAppIdFromParent,
  lang = 'bn'
}) => {
  // Candidate selector
  const candidateApps = applications.filter(app => 
    app.candidateEmail.toLowerCase() === currentCandidateEmail.toLowerCase() ||
    app.candidateEmail.toLowerCase() === 'seeker@example.com' ||
    app.candidateEmail.toLowerCase() === 'ariful@example.com'
  );
  
  const [selectedAppId, setSelectedAppId] = useState<string>(
    selectedAppIdFromParent || (candidateApps[0]?.id || '')
  );

  const activeApp = applications.find(app => app.id === selectedAppId) || candidateApps[0] || applications[0];

  // UI state
  const [workflowViewMode, setWorkflowViewMode] = useState<'dynamic_workflow' | 'classic_crm'>('dynamic_workflow');
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'package' | 'documents'>('timeline');
  const [showPayModal, setShowPayModal] = useState(false);
  const [payInstallmentIndex, setPayInstallmentIndex] = useState<number | null>(null);
  const [payMethod, setPayMethod] = useState<'bkash' | 'nagad' | 'stripe' | 'manual'>('bkash');
  
  // Manual payment fields
  const [manualTxId, setManualTxId] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualBank, setManualBank] = useState('');
  const [manualReceiptName, setManualReceiptName] = useState('');

  // Agency scheduler fields
  const [schedDate, setSchedDate] = useState('');
  const [schedTime, setSchedTime] = useState('');
  const [schedLink, setSchedLink] = useState('https://meet.google.com/abc-defg-hij');
  const [schedNotes, setSchedNotes] = useState('');

  // Agency Package builder fields
  const [selectedCountry, setSelectedCountry] = useState<'Serbia' | 'Italy' | 'Romania'>('Italy');
  const [customTotal, setCustomTotal] = useState('850000');
  const [inst1, setInst1] = useState('200000');
  const [inst2, setInst2] = useState('350000');
  const [inst3, setInst3] = useState('300000');
  const [pkgDueDate, setPkgDueDate] = useState('2026-09-15');

  // Document upload simulation
  const [docTypeToUpload, setDocTypeToUpload] = useState<string>('passport');
  const [uploadedFileName, setUploadedFileName] = useState('');

  if (!activeApp) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-3xl" id="crm-no-apps-fallback">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-sm font-black text-slate-700">
          {lang === 'bn' ? 'কোনো সক্রিয় আবেদন খুঁজে পাওয়া যায়নি' : 'No active applications found'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'bn' ? 'দয়া করে পোর্টাল থেকে প্রথমে কোনো জবে আবেদন করুন।' : 'Please apply for a job circular to start the tracking process.'}
        </p>
      </div>
    );
  }

  // Define 14 recruitment steps
  const steps = [
    { key: 'applied', label: lang === 'bn' ? 'আবেদন জমাদান' : 'Applied', desc: lang === 'bn' ? 'আবেদন সফলভাবে গৃহীত হয়েছে' : 'Successfully submitted' },
    { key: 'shortlisted', label: lang === 'bn' ? 'শর্টলিস্ট' : 'Shortlisted', desc: lang === 'bn' ? 'প্রাথমিক যাছাইয়ে শর্টলিস্টেড' : 'Selected for screening' },
    { key: 'interview_scheduled', label: lang === 'bn' ? 'ইন্টারভিউ সিডিউল' : 'Interview Scheduled', desc: lang === 'bn' ? 'অনলাইন/সরাসরি ইন্টারভিউ' : 'Date, time, and meet link set' },
    { key: 'interview_result', label: lang === 'bn' ? 'ইন্টারভিউ ফলাফল' : 'Interview Passed', desc: lang === 'bn' ? 'এজেন্সি ইন্টারভিউতে উত্তীর্ণ' : 'Passed agency selection' },
    { key: 'package_created', label: lang === 'bn' ? 'প্যাকেজ ঘোষণা' : 'Package Created', desc: lang === 'bn' ? 'পেমেন্ট ও প্যাকেজ বিবরণ' : 'Visa cost structure defined' },
    { key: 'payment_1', label: lang === 'bn' ? '১ম পেমেন্ট (বুকিং)' : 'Booking Payment', desc: lang === 'bn' ? 'নিবন্ধন ও চুক্তি পেমেন্ট' : 'Booking fee cleared' },
    { key: 'docs_uploaded', label: lang === 'bn' ? 'নথিপত্র আপলোড' : 'Docs Uploaded', desc: lang === 'bn' ? 'পাসপোর্ট ও অন্যান্য ডকুমেন্টস' : 'Files in verification queue' },
    { key: 'docs_approved', label: lang === 'bn' ? 'ডকুমেন্ট ভেরিফাইড' : 'Docs Verified', desc: lang === 'bn' ? 'এডমিন ভেরিফিকেশন সম্পূর্ণ' : 'Approved by office staff' },
    { key: 'medical', label: lang === 'bn' ? 'মেডিকেল ফিটনেস' : 'Medical Test', desc: lang === 'bn' ? 'GAMCA মেডিকেল টেস্ট রিপোর্ট' : 'Fit certificate received' },
    { key: 'work_permit', label: lang === 'bn' ? 'ওয়ার্ক পারমিট' : 'Work Permit', desc: lang === 'bn' ? 'সরকারি ভিসা ছাড়পত্র' : 'Work permit issued' },
    { key: 'visa_processing', label: lang === 'bn' ? 'ভিসা প্রসেসিং' : 'Visa Processing', desc: lang === 'bn' ? 'এম্বেসি সাবমিশন ও স্ট্যাম্পিং' : 'Sent to embassy stamping' },
    { key: 'visa_approved', label: lang === 'bn' ? 'ভিসা অনুমোদন' : 'Visa Approved', desc: lang === 'bn' ? 'পাসপোর্টে ভিসা স্ট্যাম্প সম্পূর্ণ' : 'Visa stamped successfully' },
    { key: 'flight_ticket', label: lang === 'bn' ? 'ফ্লাইট টিকিট' : 'Flight Booked', desc: lang === 'bn' ? 'এয়ার টিকিট ও পিএনআর' : 'Ticket issued with PNR' },
    { key: 'departure', label: lang === 'bn' ? 'বিদেশ যাত্রা ✈️' : 'Departure', desc: lang === 'bn' ? 'শুভ বিদায় ও নতুন কর্মযাত্রা' : 'Successfully departed' }
  ];

  // Helper to check if step is completed or active
  const getStepStatus = (index: number) => {
    // 0: Applied, 1: Shortlisted, 2: Interview Scheduled, 3: Interview Result, 4: Package Created, etc.
    let currentActiveIdx = 0;
    
    if (activeApp.status === 'Applied') currentActiveIdx = 0;
    if (activeApp.status === 'Shortlisted') currentActiveIdx = 1;
    if (activeApp.status === 'Interview Scheduled') currentActiveIdx = 2;
    if (activeApp.interviewResult === 'Passed') currentActiveIdx = 3;
    if (activeApp.packageDetails) currentActiveIdx = 4;
    
    // Check first payment status
    const firstPay = activeApp.paymentHistory?.[0];
    if (firstPay?.status === 'Verified') {
      currentActiveIdx = 5;
    }
    
    // Check if documents are uploaded
    const docs = activeApp.documentVault || [];
    const hasUploadedDocs = docs.length > 0;
    const allApproved = docs.length > 0 && docs.every(d => d.status === 'Verified');
    
    if (hasUploadedDocs) currentActiveIdx = 6;
    if (allApproved) currentActiveIdx = 7;
    
    // Additional workflow states based on application status flags
    if (activeApp.medicalStatus === 'Fit') currentActiveIdx = 8;
    if (activeApp.workPermitPdf) currentActiveIdx = 9;
    if (activeApp.visaStampingStatus === 'Approved') currentActiveIdx = 11;
    if (activeApp.flightPnr) currentActiveIdx = 12;
    if (activeApp.status === 'Hired') currentActiveIdx = 13;

    if (index < currentActiveIdx) return 'completed';
    if (index === currentActiveIdx) return 'active';
    return 'pending';
  };

  // 1. CANDIDATE: Automatic mock payment success handler
  const handleMockPayOnline = (instIdx: number) => {
    const updatedApp = { ...activeApp };
    if (!updatedApp.paymentHistory) updatedApp.paymentHistory = [];
    
    const installmentName = activeApp.packageDetails?.installments[instIdx]?.name || `Installment ${instIdx + 1}`;
    const amountToPay = activeApp.packageDetails?.installments[instIdx]?.amount || 0;

    const newPayment = {
      id: 'pay_' + Date.now(),
      installmentIndex: instIdx,
      installmentName,
      amount: amountToPay,
      paymentMethod: payMethod.toUpperCase() as any,
      transactionId: 'TXN' + Math.floor(Math.random() * 100000000),
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'Verified' as const, // Online payments are verified instantly
      notes: 'Paid securely via online gateway.'
    };

    updatedApp.paymentHistory.push(newPayment);
    // update paid / due
    const totalPaid = updatedApp.paymentHistory
      .filter(p => p.status === 'Verified')
      .reduce((sum, p) => sum + p.amount, 0);
    
    if (updatedApp.packageDetails) {
      updatedApp.packageDetails.paidAmount = totalPaid;
      updatedApp.packageDetails.dueAmount = Math.max(0, updatedApp.packageDetails.totalAmount - totalPaid);
    }

    onUpdateApplication(updatedApp);
    setShowPayModal(false);
  };

  // 2. CANDIDATE: Submit manual bank receipt
  const handleSubmitManualReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTxId || !manualAmount) {
      alert(lang === 'bn' ? 'দয়া করে পরিমাণ ও ট্রানজেকশন আইডি প্রদান করুন।' : 'Please fill in required payment details.');
      return;
    }

    const updatedApp = { ...activeApp };
    if (!updatedApp.paymentHistory) updatedApp.paymentHistory = [];

    const instIdx = payInstallmentIndex !== null ? payInstallmentIndex : 0;
    const installmentName = activeApp.packageDetails?.installments[instIdx]?.name || `Installment ${instIdx + 1}`;

    const newPayment = {
      id: 'pay_' + Date.now(),
      installmentIndex: instIdx,
      installmentName,
      amount: parseFloat(manualAmount),
      paymentMethod: 'Bank Transfer' as const,
      transactionId: manualTxId,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'Pending' as const, // Needs Admin approval
      receiptFile: manualReceiptName || 'manual_bank_deposit_slip.pdf',
      bankName: manualBank || 'Sonali Bank Ltd'
    };

    updatedApp.paymentHistory.push(newPayment);
    onUpdateApplication(updatedApp);
    
    // Clear forms
    setManualTxId('');
    setManualAmount('');
    setManualBank('');
    setManualReceiptName('');
    setShowPayModal(false);
    alert(lang === 'bn' ? 'পেমেন্ট রশিদ সফলভাবে আপলোড হয়েছে! এডমিন খুব শীঘ্রই এটি যাচাই করবেন।' : 'Deposit receipt uploaded successfully! Admin will verify soon.');
  };

  // 3. CANDIDATE: Upload Document
  const handleUploadDocument = () => {
    if (!uploadedFileName) {
      alert(lang === 'bn' ? 'দয়া করে একটি ফাইল বা রশিদ সিলেক্ট করুন' : 'Please select or name a file first');
      return;
    }

    const updatedApp = { ...activeApp };
    if (!updatedApp.documentVault) updatedApp.documentVault = [];

    const labelMap: Record<string, string> = {
      passport: 'Passport Copy',
      photo: 'Passport Size Photo',
      police_clearance: 'Police Clearance Certificate',
      medical: 'Medical Fit Certificate',
      visa_copy: 'Work Visa Copy',
      work_permit: 'Official Work Permit'
    };

    const newDoc = {
      id: 'doc_' + Date.now(),
      documentType: labelMap[docTypeToUpload] || docTypeToUpload,
      fileName: uploadedFileName,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'Pending' as const, // Verification status
    };

    // Remove old doc of same type if exists
    updatedApp.documentVault = updatedApp.documentVault.filter(d => d.documentType !== newDoc.documentType);
    updatedApp.documentVault.push(newDoc);

    onUpdateApplication(updatedApp);
    setUploadedFileName('');
    alert(lang === 'bn' ? 'দলিল সফলভাবে আপলোড হয়েছে! যাচাইয়ের জন্য পাঠানো হয়েছে।' : 'Document uploaded successfully! Under administrative review.');
  };

  // 4. AGENCY: Schedule Interview
  const handleScheduleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedDate || !schedTime) {
      alert(lang === 'bn' ? 'দয়া করে তারিখ ও সময় সিলেক্ট করুন' : 'Please select date and time');
      return;
    }

    const updatedApp = {
      ...activeApp,
      status: 'Interview Scheduled' as const,
      interviewDetails: {
        date: schedDate,
        time: schedTime,
        location: schedLink,
        notes: schedNotes || 'Sponsor recruitment agency live video interview call.'
      }
    };

    onUpdateApplication(updatedApp);
    setSchedDate('');
    setSchedTime('');
    setSchedNotes('');
    alert(lang === 'bn' ? 'ইন্টারভিউ সিডিউল সফলভাবে সম্পন্ন ও ক্যান্ডিডেটকে নোটিফিকেশন পাঠানো হয়েছে!' : 'Interview scheduled successfully and notification sent to candidate!');
  };

  // 5. AGENCY: Record Interview Result
  const handleRecordInterviewResult = (result: 'Passed' | 'Failed' | 'Waiting') => {
    const updatedApp = {
      ...activeApp,
      interviewResult: result
    };
    onUpdateApplication(updatedApp);
    alert(lang === 'bn' ? `ইন্টারভিউ ফলাফল রেকর্ড করা হয়েছে: ${result}` : `Interview result successfully recorded: ${result}`);
  };

  // 6. AGENCY: Create Country Wise Package
  const handleCreatePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedApp = {
      ...activeApp,
      packageDetails: {
        packageName: `${selectedCountry} Standard Package`,
        country: selectedCountry,
        totalAmount: parseFloat(customTotal),
        paidAmount: 0,
        dueAmount: parseFloat(customTotal),
        currency: 'BDT',
        installments: [
          { name: '1st Installment (Booking Fee)', amount: parseFloat(inst1), deadline: pkgDueDate },
          { name: '2nd Installment (Work Permit Issued)', amount: parseFloat(inst2), deadline: pkgDueDate },
          { name: '3rd Installment (Visa Delivery)', amount: parseFloat(inst3), deadline: pkgDueDate }
        ]
      }
    };

    onUpdateApplication(updatedApp);
    alert(lang === 'bn' ? 'প্রবাসী প্রসেসিং প্যাকেজ সফলভাবে ক্যান্ডিডেটের জন্য বরাদ্দ করা হয়েছে!' : 'Processing package successfully issued to the candidate profile!');
  };

  // 7. ADMIN: Approve / Reject Manual Payment
  const handleVerifyManualPayment = (paymentId: string, action: 'Verified' | 'Rejected') => {
    const updatedApp = { ...activeApp };
    if (!updatedApp.paymentHistory) return;

    updatedApp.paymentHistory = updatedApp.paymentHistory.map(p => {
      if (p.id === paymentId) {
        return { ...p, status: action };
      }
      return p;
    });

    // Recalculate balances
    const totalPaid = updatedApp.paymentHistory
      .filter(p => p.status === 'Verified')
      .reduce((sum, p) => sum + p.amount, 0);

    if (updatedApp.packageDetails) {
      updatedApp.packageDetails.paidAmount = totalPaid;
      updatedApp.packageDetails.dueAmount = Math.max(0, updatedApp.packageDetails.totalAmount - totalPaid);
    }

    onUpdateApplication(updatedApp);
    alert(lang === 'bn' ? `পেমেন্ট স্ট্যাটাস আপডেট সম্পন্ন: ${action}` : `Payment transaction marked as: ${action}`);
  };

  // 8. ADMIN: Verify Candidate Document
  const handleVerifyDocument = (docId: string, action: 'Verified' | 'Rejected' | 'Needs Re-upload') => {
    const updatedApp = { ...activeApp };
    if (!updatedApp.documentVault) return;

    updatedApp.documentVault = updatedApp.documentVault.map(d => {
      if (d.id === docId) {
        return { ...d, status: action };
      }
      return d;
    });

    onUpdateApplication(updatedApp);
    alert(lang === 'bn' ? `ডকুমেন্ট ভেরিফিকেশন আপডেট সম্পন্ন: ${action}` : `Document verification state updated to: ${action}`);
  };

  // Handle Country selection template trigger
  const handleCountryTemplateChange = (countryKey: 'Serbia' | 'Italy' | 'Romania') => {
    setSelectedCountry(countryKey);
    const tmpl = COUNTRY_PACKAGES[countryKey];
    setCustomTotal(tmpl.totalAmount.toString());
    setInst1(tmpl.installments[0].amount.toString());
    setInst2(tmpl.installments[1].amount.toString());
    setInst3(tmpl.installments[2].amount.toString());
  };


  return (
    <div className="space-y-6" id="crm-workflow-hub">
      
      {/* HEADER CONTROLS */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800" id="crm-workflow-header">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-black rounded-full text-[10px] tracking-wider uppercase">
            LIVE CRM INTEGRATION
          </span>
          <h2 className="text-base md:text-lg font-black flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0" />
            {lang === 'bn' ? 'রিক্রুটমেন্ট CRM ও ওয়ার্ক পারমিট প্রসেসিং হাব' : 'Recruitment CRM & Work Permit Tracker'}
          </h2>
          <p className="text-[11px] text-slate-400 font-light">
            {lang === 'bn' 
              ? `ক্যান্ডিডেট: ${activeApp.candidateName} | মোবাইল: ${activeApp.candidatePhone}` 
              : `Candidate: ${activeApp.candidateName} | Phone: ${activeApp.candidatePhone}`}
          </p>
        </div>

        {/* View Switcher Simulator Indicator */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-1.5 flex items-center gap-1.5 self-stretch md:self-auto">
          <span className="text-[10px] text-slate-300 font-bold px-3">
            {lang === 'bn' ? 'সিস্টেম ভিউ:' : 'Active Role:'}
          </span>
          <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide ${
            viewType === 'candidate' ? 'bg-indigo-500 text-white' :
            viewType === 'agency' ? 'bg-sky-500 text-white' :
            'bg-amber-500 text-slate-950'
          }`}>
            {viewType}
          </span>
        </div>
      </div>

      {/* WORKFLOW MODULE SWITCHER TABS */}
      <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <button
          onClick={() => setWorkflowViewMode('dynamic_workflow')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            workflowViewMode === 'dynamic_workflow'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>💼 Dynamic Contract & Payment Workflow Manager</span>
        </button>

        <button
          onClick={() => setWorkflowViewMode('classic_crm')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            workflowViewMode === 'classic_crm'
              ? 'bg-slate-800 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span>📍 Classic Immigration Roadmap & Document Vault</span>
        </button>
      </div>

      {/* 1. DYNAMIC CONTRACT & PAYMENT WORKFLOW MANAGER */}
      {workflowViewMode === 'dynamic_workflow' && (
        <DynamicContractWorkflowManager 
          initialRole={viewType === 'candidate' ? 'Candidate' : viewType === 'agency' ? 'Agency' : 'Admin'} 
        />
      )}

      {/* 2. CLASSIC CRM VIEW */}
      {workflowViewMode === 'classic_crm' && (
        <>
          {/* RENDER CANDIDATE PORTAL VIEW */}
          {viewType === 'candidate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="crm-candidate-view">
          
          {/* Left Column: Milestones Timeline */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pb-2 border-b">
              {lang === 'bn' ? 'ভিসা প্রসেসিং রুটম্যাপ (১৪ ধাপ)' : 'Immigration Timeline (14 Stages)'}
            </h3>
            
            <div className="relative pl-3 space-y-4 max-h-[580px] overflow-y-auto pr-1">
              <div className="absolute left-4.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>
              
              {steps.map((st, idx) => {
                const stepState = getStepStatus(idx);
                return (
                  <div key={st.key} className="flex gap-4 relative items-start text-xs leading-normal">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                      stepState === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white text-[8px] font-bold' :
                      stepState === 'active' ? 'bg-blue-600 border-blue-600 text-white text-[8px] font-bold animate-pulse' :
                      'bg-white border-slate-200 text-slate-400 text-[8px]'
                    }`}>
                      {stepState === 'completed' ? '✓' : idx + 1}
                    </div>
                    <div className={stepState === 'pending' ? 'opacity-50' : ''}>
                      <h4 className={`font-black ${stepState === 'active' ? 'text-blue-600' : 'text-slate-800'}`}>
                        {st.label}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-light mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Columns: Payments, Package, Document Vault */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Nav Sub-Tabs */}
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 grid grid-cols-3 gap-1 shadow-inner">
              <button
                onClick={() => setActiveSubTab('timeline')}
                className={`py-2 text-xs font-black rounded-xl transition ${activeSubTab === 'timeline' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {lang === 'bn' ? 'সাক্ষাত্কার ও নোটিশ' : 'Interview & Notices'}
              </button>
              <button
                onClick={() => setActiveSubTab('package')}
                className={`py-2 text-xs font-black rounded-xl transition ${activeSubTab === 'package' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {lang === 'bn' ? 'ভিসা পেমেন্ট সেন্টার' : 'Payment Center'}
              </button>
              <button
                onClick={() => setActiveSubTab('documents')}
                className={`py-2 text-xs font-black rounded-xl transition ${activeSubTab === 'documents' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {lang === 'bn' ? 'নথিপত্র আপলোড ভল্ট' : 'Document Vault'}
              </button>
            </div>

            {/* TAB CONTENT: INTERVIEW & NOTICE */}
            {activeSubTab === 'timeline' && (
              <div className="space-y-6">
                
                {/* Active Interview details */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pb-2 border-b flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-indigo-500" />
                    {lang === 'bn' ? 'লাইভ সার্কুলার ইন্টারভিউ সূচী' : 'Scheduled Recruitment Interview'}
                  </h3>

                  {activeApp.interviewDetails ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <span className="text-slate-400 block font-light">{lang === 'bn' ? 'তারিখ:' : 'Date:'}</span>
                          <span className="text-slate-800 font-mono">{activeApp.interviewDetails.date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-light">{lang === 'bn' ? 'সময়:' : 'Time:'}</span>
                          <span className="text-slate-800 font-mono">{activeApp.interviewDetails.time}</span>
                        </div>
                      </div>

                      <div className="text-xs font-semibold">
                        <span className="text-slate-400 block font-light">{lang === 'bn' ? 'ইন্টারভিউ লিংক / ভেন্যু:' : 'Google Meet / Zoom Link:'}</span>
                        <a 
                          href={activeApp.interviewDetails.location} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 underline font-mono break-all inline-block mt-0.5"
                        >
                          {activeApp.interviewDetails.location}
                        </a>
                      </div>

                      {activeApp.interviewDetails.notes && (
                        <div className="text-xs p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-800 leading-normal">
                          <strong>{lang === 'bn' ? 'বিশেষ নির্দেশনা:' : 'Notes:'}</strong> {activeApp.interviewDetails.notes}
                        </div>
                      )}

                      {/* Result badge */}
                      <div className="pt-2 border-t flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-light">{lang === 'bn' ? 'নির্বাচন স্থিতি:' : 'Interview Status:'}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          activeApp.interviewResult === 'Passed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          activeApp.interviewResult === 'Failed' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {activeApp.interviewResult || 'Waiting / Processing'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs font-light leading-relaxed">
                      {lang === 'bn' 
                        ? 'আপনার আবেদনটি পর্যালোচনাধীন আছে। এজেন্সী ইন্টারভিউ নির্ধারণ করলে আপনার মোবাইলে ও এখানে নোটিফিকেশন পাবেন।' 
                        : 'Your application is currently under review. The agency has not scheduled an interview yet.'}
                    </div>
                  )}
                </div>

                {/* Important Notices */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b pb-2">
                    {lang === 'bn' ? 'প্রয়োজনীয় গাইডলাইন ও নোটিশ' : 'CRM Guide & Safety Notice'}
                  </h3>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed font-light">
                    <li>{lang === 'bn' ? 'কোনো নগদ টাকা লেনদেনের পূর্বে অবশ্যই ভেরিফাইড ব্যাংক অ্যাকাউন্টে জমা দিন।' : 'Always check the agency license number before signing any official country package.'}</li>
                    <li>{lang === 'bn' ? 'ভিসা প্রসেসিংয়ের ১ম ধাপ হিসেবে চুক্তি সম্পন্ন করে বুকিং কিস্তি পরিশোধ করুন।' : 'Upload clear scanned color passport copy to prevent embassy submission rejections.'}</li>
                    <li>{lang === 'bn' ? 'GAMCA অনুমোদিত মেডিকেল সেন্টার ব্যতীত অন্য কোনো মেডিকেল চেকআপ গ্রহণযোগ্য নয়।' : 'Use Sonali, Brac, or Premier Bank accounts for manual slip deposits.'}</li>
                  </ul>
                </div>

              </div>
            )}

            {/* TAB CONTENT: PAYMENTS */}
            {activeSubTab === 'package' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-6">
                
                {/* Active Country Package Info */}
                <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {lang === 'bn' ? 'অনুমোদিত কান্ট্রি ভিসা প্যাকেজ' : 'Your Appointed Immigration Package'}
                    </h3>
                    <p className="text-xs font-bold text-emerald-600 mt-1">
                      {activeApp.packageDetails ? activeApp.packageDetails.packageName : (lang === 'bn' ? 'প্যাকেজ এখনো নির্ধারণ করা হয়নি' : 'Not assigned yet')}
                    </p>
                  </div>
                  {activeApp.packageDetails && (
                    <div className="bg-slate-100 px-3 py-1.5 rounded-2xl text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">{lang === 'bn' ? 'মোট বাজেট' : 'Total Cost'}</span>
                      <strong className="text-sm font-black text-slate-800">৳{activeApp.packageDetails.totalAmount.toLocaleString()}</strong>
                    </div>
                  )}
                </div>

                {activeApp.packageDetails ? (
                  <div className="space-y-6">
                    {/* Balances widgets */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-slate-700">
                        <span className="text-slate-400 block font-light">{lang === 'bn' ? 'পরিশোধিত টাকা:' : 'Total Paid:'}</span>
                        <strong className="text-base font-black text-emerald-600 mt-1 block">
                          ৳{activeApp.packageDetails.paidAmount.toLocaleString()}
                        </strong>
                      </div>
                      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 text-slate-700">
                        <span className="text-slate-400 block font-light">{lang === 'bn' ? 'বকেয়া টাকা:' : 'Total Due:'}</span>
                        <strong className="text-base font-black text-rose-600 mt-1 block">
                          ৳{activeApp.packageDetails.dueAmount.toLocaleString()}
                        </strong>
                      </div>
                    </div>

                    {/* Installments Table list */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        {lang === 'bn' ? 'পেমেন্ট কিস্তি ও স্থিতি' : 'Installments Milestone Plan'}
                      </h4>

                      <div className="space-y-2.5">
                        {activeApp.packageDetails.installments.map((inst, index) => {
                          // Check if this installment index is paid in verification list
                          const matchingPayment = activeApp.paymentHistory?.find(
                            p => p.installmentIndex === index && p.status === 'Verified'
                          );
                          const isPendingVerification = activeApp.paymentHistory?.find(
                            p => p.installmentIndex === index && p.status === 'Pending'
                          );

                          return (
                            <div key={index} className="p-3 border border-slate-100 rounded-2xl bg-slate-50/30 flex justify-between items-center gap-4 text-xs font-semibold">
                              <div className="space-y-1">
                                <p className="text-slate-800 font-extrabold">{inst.name}</p>
                                <p className="text-[10px] text-slate-400 font-light">
                                  {lang === 'bn' ? 'মূল্য:' : 'Amount:'} <strong className="text-slate-700">৳{inst.amount.toLocaleString()}</strong>
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                {matchingPayment ? (
                                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[9.5px] font-black uppercase">
                                    ✓ {lang === 'bn' ? 'পরিশোধিত' : 'PAID'}
                                  </span>
                                ) : isPendingVerification ? (
                                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[9.5px] font-black uppercase animate-pulse">
                                    ⏳ {lang === 'bn' ? 'যাচাইাধীন' : 'VERIFYING'}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setPayInstallmentIndex(index);
                                      setShowPayModal(true);
                                    }}
                                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10.5px] rounded-xl transition shadow-xs flex items-center gap-1 cursor-pointer"
                                  >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    {lang === 'bn' ? 'টাকা দিন' : 'Pay Now'}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Transaction logs */}
                    {activeApp.paymentHistory && activeApp.paymentHistory.length > 0 && (
                      <div className="space-y-2.5 border-t pt-4">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                          {lang === 'bn' ? 'পেমেন্ট রশিদ ও ইতিহাস' : 'Your Payment History Log'}
                        </h4>
                        <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                          {activeApp.paymentHistory.map((p) => (
                            <div key={p.id} className="p-2.5 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-center text-[10.5px] font-semibold text-slate-600">
                              <div className="space-y-0.5">
                                <p className="text-slate-800 font-extrabold">{p.installmentName}</p>
                                <p className="text-slate-400 font-mono text-[9px]">TxID: {p.transactionId}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-slate-800 block">৳{p.amount.toLocaleString()}</span>
                                <span className={`text-[9px] font-black uppercase ${
                                  p.status === 'Verified' ? 'text-emerald-600' :
                                  p.status === 'Rejected' ? 'text-rose-600' :
                                  'text-amber-600'
                                }`}>
                                  {p.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs font-light leading-relaxed">
                    {lang === 'bn'
                      ? 'এজেন্সী আপনার জন্য পেমেন্ট প্যাকেজ বরাদ্দ করেনি। ইন্টারভিউ সফলভাবে পাস করার পর এখানে Serbia, Italy, or Romania প্যাকেজটি দেখতে পাবেন।'
                      : 'The agency has not created your country package yet. Pass the selection interview to unlock payment gateway.'}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: DOCUMENT VAULT */}
            {activeSubTab === 'documents' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-6">
                
                {/* Upload Form Box */}
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl space-y-3 bg-slate-50/50">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {lang === 'bn' ? 'নতুন পাসপোর্ট ও ডকুমেন্ট আপলোড ফর্ম' : 'File Upload Area (Scan Copy)'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">{lang === 'bn' ? 'দলিলের প্রকার' : 'Document Type'}</label>
                      <select
                        value={docTypeToUpload}
                        onChange={(e) => setDocTypeToUpload(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 w-full"
                      >
                        <option value="passport">🛂 {lang === 'bn' ? 'পাসপোর্ট স্ক্যান কপি' : 'Passport Color Page'}</option>
                        <option value="photo">👤 {lang === 'bn' ? 'পাসপোর্ট সাইজ ফটো' : 'Profile Photo'}</option>
                        <option value="police_clearance">🛡️ {lang === 'bn' ? 'পুলিশ ক্লিয়ারেন্স কপি' : 'Police Clearance Certificate'}</option>
                        <option value="medical">🏥 {lang === 'bn' ? 'GAMCA মেডিকেল ফিটনেস' : 'Medical Fitness Report'}</option>
                        <option value="work_permit">📄 {lang === 'bn' ? 'ওয়ার্ক পারমিট লেটার' : 'Work Permit PDF'}</option>
                        <option value="visa_copy">✈️ {lang === 'bn' ? 'ভিসা কপি' : 'Work Visa Copy'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">{lang === 'bn' ? 'ফাইল নির্বাচন (সিমুলেশন)' : 'File Name (Simulation)'}</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="filename_scan.pdf"
                          value={uploadedFileName}
                          onChange={(e) => setUploadedFileName(e.target.value)}
                          className="p-2 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => setUploadedFileName(docTypeToUpload + '_scanned_copy_ver2.pdf')}
                          className="px-3 bg-slate-100 hover:bg-slate-200 border text-xs font-extrabold rounded-xl"
                        >
                          Auto
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleUploadDocument}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    {lang === 'bn' ? 'সার্ভারে জমা দিন' : 'Submit & Upload Document'}
                  </button>
                </div>

                {/* Vault List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {lang === 'bn' ? 'আমার আপলোডকৃত নথিসমূহ' : 'Your Document Vault'}
                  </h4>

                  {activeApp.documentVault && activeApp.documentVault.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {activeApp.documentVault.map((doc) => {
                        const iconMap: Record<string, string> = {
                          'Passport Copy': '🛂',
                          'Passport Size Photo': '👤',
                          'Police Clearance Certificate': '🛡️',
                          'Medical Fit Certificate': '🏥',
                          'Work Permit Copy': '📄',
                          'Official Work Permit': '📄',
                          'Work Visa Copy': '✈️'
                        };

                        return (
                          <div key={doc.id} className="p-3 border rounded-2xl bg-slate-50/20 hover:border-slate-300 transition flex flex-col justify-between gap-3 text-xs font-semibold">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{iconMap[doc.documentType] || '📄'}</span>
                                <div>
                                  <p className="text-slate-800 font-extrabold">{doc.documentType}</p>
                                  <p className="text-[9.5px] text-slate-400 font-mono truncate max-w-[150px]">{doc.fileName}</p>
                                </div>
                              </div>

                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                                doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                                doc.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {doc.status}
                              </span>
                            </div>

                            <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                              <span>{lang === 'bn' ? 'তারিখ:' : 'Uploaded:'} {doc.uploadedAt}</span>
                              <button
                                onClick={() => alert(`${doc.fileName} ডাউনলোড শুরু হচ্ছে...`)}
                                className="text-blue-600 hover:underline flex items-center gap-0.5"
                              >
                                <Download className="w-3 h-3" />
                                {lang === 'bn' ? 'ডাউনলোড' : 'Download'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs font-light leading-relaxed">
                      {lang === 'bn' ? 'ভল্ট খালি আছে। পাসপোর্ট এবং পুলিশ ক্লিয়ারেন্স আপলোড করুন।' : 'Vault is empty. Upload your passport to start embassy verification.'}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* RENDER AGENCY PANEL VIEW */}
      {viewType === 'agency' && (
        <div className="space-y-6" id="crm-agency-view">
          
          {/* Active Candidate stats summary banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 font-black rounded-full flex items-center justify-center">
                {activeApp.candidateName.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">{activeApp.candidateName}</h3>
                <p className="text-[10.5px] text-slate-400 font-medium">
                  {lang === 'bn' ? 'আবেদনের পদ:' : 'Applied Job:'} <span className="text-slate-600 font-bold">{activeApp.jobTitle}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{lang === 'bn' ? 'বর্তমান স্ট্যাটাস:' : 'Recruitment Status:'}</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-200 font-black rounded-lg text-xs uppercase">
                {activeApp.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Step 1 & 2: Review + Schedule Interview */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pb-2 border-b flex items-center gap-1.5">
                <Video className="w-4 h-4 text-blue-500" />
                {lang === 'bn' ? '১ ও ২. ইন্টারভিউ সূচী নির্ধারণ ও গাইডলাইন' : '1 & 2. Schedule Candidate Selection Interview'}
              </h3>

              <form onSubmit={handleScheduleInterviewSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">{lang === 'bn' ? 'সাক্ষাত্কারের তারিখ' : 'Interview Date'}</label>
                    <input
                      type="date"
                      value={schedDate}
                      onChange={(e) => setSchedDate(e.target.value)}
                      className="p-2 bg-slate-50 border rounded-xl font-bold text-slate-700 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">{lang === 'bn' ? 'সাক্ষাত্কারের সময়' : 'Interview Time'}</label>
                    <input
                      type="time"
                      value={schedTime}
                      onChange={(e) => setSchedTime(e.target.value)}
                      className="p-2 bg-slate-50 border rounded-xl font-bold text-slate-700 w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">{lang === 'bn' ? 'গুগল মিট / জুম ভার্চুয়াল লিংক' : 'Meet / Zoom Virtual Call Link'}</label>
                  <input
                    type="url"
                    value={schedLink}
                    onChange={(e) => setSchedLink(e.target.value)}
                    className="p-2 bg-slate-50 border rounded-xl font-bold text-slate-700 w-full font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">{lang === 'bn' ? 'বিশেষ নির্দেশনা (ক্যান্ডিডেটের জন্য)' : 'Special Instructions for Candidate'}</label>
                  <textarea
                    rows={2}
                    placeholder="দয়া করে ইন্টারভিউয়ের সময় আপনার পাসপোর্ট ও মূল সনদপত্র সামনে রাখুন।"
                    value={schedNotes}
                    onChange={(e) => setSchedNotes(e.target.value)}
                    className="p-2 bg-slate-50 border rounded-xl font-medium text-slate-700 w-full"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition shadow flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  {lang === 'bn' ? 'ইন্টারভিউ সিডিউল সেভ করুন' : 'Confirm & Notify Seeker'}
                </button>
              </form>

              {/* Step 3: Record Result */}
              <div className="pt-4 border-t space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  {lang === 'bn' ? '৩. সাক্ষাত্কারের লাইভ ফলাফল রেকর্ড' : '3. Post-Interview Verification Decision'}
                </h4>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => handleRecordInterviewResult('Passed')}
                    className={`p-2.5 rounded-xl border font-black transition flex flex-col items-center gap-1 cursor-pointer ${
                      activeApp.interviewResult === 'Passed' 
                        ? 'bg-emerald-500 text-slate-950 border-emerald-600 shadow' 
                        : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="text-sm">✅</span> Passed
                  </button>
                  <button
                    onClick={() => handleRecordInterviewResult('Failed')}
                    className={`p-2.5 rounded-xl border font-black transition flex flex-col items-center gap-1 cursor-pointer ${
                      activeApp.interviewResult === 'Failed' 
                        ? 'bg-rose-500 text-white border-rose-600 shadow' 
                        : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50'
                    }`}
                  >
                    <span className="text-sm">❌</span> Failed
                  </button>
                  <button
                    onClick={() => handleRecordInterviewResult('Waiting')}
                    className={`p-2.5 rounded-xl border font-black transition flex flex-col items-center gap-1 cursor-pointer ${
                      activeApp.interviewResult === 'Waiting' 
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow' 
                        : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'
                    }`}
                  >
                    <span className="text-sm">⏳</span> Waiting
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4: Package Generator */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pb-2 border-b flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-500" />
                {lang === 'bn' ? '৪. কান্ট্রি ওয়াইজ প্রসেসিং প্যাকেজ নির্ধারণ' : '4. Country-Wise Fee Package Builder'}
              </h3>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-3 gap-2 text-[10px] uppercase font-black text-center">
                <button
                  type="button"
                  onClick={() => handleCountryTemplateChange('Serbia')}
                  className={`p-2 rounded-xl border transition ${selectedCountry === 'Serbia' ? 'bg-slate-900 text-white border-slate-900 shadow' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                >
                  Serbia 🇷🇸
                </button>
                <button
                  type="button"
                  onClick={() => handleCountryTemplateChange('Italy')}
                  className={`p-2 rounded-xl border transition ${selectedCountry === 'Italy' ? 'bg-slate-900 text-white border-slate-900 shadow' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                >
                  Italy 🇮🇹
                </button>
                <button
                  type="button"
                  onClick={() => handleCountryTemplateChange('Romania')}
                  className={`p-2 rounded-xl border transition ${selectedCountry === 'Romania' ? 'bg-slate-900 text-white border-slate-900 shadow' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                >
                  Romania 🇷🇴
                </button>
              </div>

              <form onSubmit={handleCreatePackageSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">{lang === 'bn' ? 'প্যাকেজের মোট মূল্য (টাকা)' : 'Total Package BDT Cost'}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-black">৳</span>
                    <input
                      type="number"
                      value={customTotal}
                      onChange={(e) => setCustomTotal(e.target.value)}
                      className="p-2 pl-7 bg-slate-50 border rounded-xl font-bold text-slate-800 w-full"
                      required
                    />
                  </div>
                </div>

                {/* Installments split */}
                <div className="space-y-2.5 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <h4 className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
                    {lang === 'bn' ? '৩ কিস্তি বিভাজন' : '3 Installment Split'}
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9.5px] text-slate-500 font-light block mb-0.5">{lang === 'bn' ? '১ম (বুকিং)' : '1st (Booking)'}</label>
                      <input
                        type="number"
                        value={inst1}
                        onChange={(e) => setInst1(e.target.value)}
                        className="p-1.5 bg-white border rounded-lg font-bold text-slate-700 w-full text-center"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] text-slate-500 font-light block mb-0.5">{lang === 'bn' ? '২য় (ওয়ার্ক পারমিট)' : '2nd (Permit)'}</label>
                      <input
                        type="number"
                        value={inst2}
                        onChange={(e) => setInst2(e.target.value)}
                        className="p-1.5 bg-white border rounded-lg font-bold text-slate-700 w-full text-center"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] text-slate-500 font-light block mb-0.5">{lang === 'bn' ? '৩য় (ভিসা ছাড়)' : '3rd (Visa)'}</label>
                      <input
                        type="number"
                        value={inst3}
                        onChange={(e) => setInst3(e.target.value)}
                        className="p-1.5 bg-white border rounded-lg font-bold text-slate-700 w-full text-center"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">{lang === 'bn' ? 'পেমেন্ট শেষ সময়সীমা' : 'Due Date Deadline'}</label>
                    <input
                      type="date"
                      value={pkgDueDate}
                      onChange={(e) => setPkgDueDate(e.target.value)}
                      className="p-2 bg-slate-50 border rounded-xl font-bold text-slate-700 w-full"
                      required
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={activeApp.interviewResult !== 'Passed'}
                      className={`w-full py-2 font-black rounded-xl transition shadow flex items-center justify-center gap-1 cursor-pointer ${
                        activeApp.interviewResult === 'Passed' 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950' 
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      }`}
                      title={activeApp.interviewResult !== 'Passed' ? 'ইন্টারভিউ পাস করা ছাড়া প্যাকেজ তৈরি করা যাবে না।' : ''}
                    >
                      <Sparkles className="w-4 h-4 shrink-0" />
                      {lang === 'bn' ? 'প্যাকেজ ঘোষণা করুন' : 'Issue Standard Package'}
                    </button>
                  </div>
                </div>
              </form>

            </div>

          </div>

          {/* Payments and Documents overview for Agency */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pb-2 border-b">
              {lang === 'bn' ? 'ক্যান্ডিডেট ভিসা প্যাকেজ পেমেন্ট স্থিতি' : 'Financial Statement & Deposited Records'}
            </h3>

            {activeApp.packageDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-slate-700 font-bold">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-slate-400 font-light block">{lang === 'bn' ? 'মোট বরাদ্দকৃত বাজেট:' : 'Standard Package:'}</span>
                  <span className="text-slate-800 font-black mt-1 block">৳{activeApp.packageDetails.totalAmount.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-800">
                  <span className="text-emerald-600 font-light block">{lang === 'bn' ? 'পরিশোধিত ফান্ড (Paid):' : 'Verified Cleared:'}</span>
                  <span className="font-black mt-1 block">৳{activeApp.packageDetails.paidAmount.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-2xl text-rose-800">
                  <span className="text-rose-600 font-light block">{lang === 'bn' ? 'বকেয়া পাওনা (Due):' : 'Remaining Balance:'}</span>
                  <span className="font-black mt-1 block">৳{activeApp.packageDetails.dueAmount.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-slate-400 text-xs font-light leading-relaxed">
                {lang === 'bn' ? 'কোনো পেমেন্ট বিবরণ এখনো তৈরি করা হয়নি।' : 'Candidate has no processing packages assigned yet.'}
              </div>
            )}
          </div>

        </div>
      )}

      {/* RENDER ADMIN PANEL VIEW */}
      {viewType === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="crm-admin-view">
          
          {/* Admin Payment Verification Queue */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pb-2 border-b flex items-center justify-between">
              <span>💳 {lang === 'bn' ? 'ব্যাংক ট্রান্সফার পেমেন্ট যাচাই কিউ' : 'Manual Payment Audit Queue'}</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border rounded-md text-[10px] font-black uppercase">
                {applications.reduce((acc, app) => acc + (app.paymentHistory?.filter(p => p.status === 'Pending').length || 0), 0)} {lang === 'bn' ? 'বকেয়া' : 'Pending'}
              </span>
            </h3>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 text-xs">
              {applications.flatMap(app => 
                (app.paymentHistory || [])
                  .filter(p => p.status === 'Pending')
                  .map(p => (
                    <div key={p.id} className="p-4 border border-slate-200 rounded-2.5xl bg-slate-50/50 space-y-3 hover:border-slate-300 transition leading-relaxed">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <strong className="text-slate-800 text-[13px] block">{app.candidateName}</strong>
                          <span className="text-[10px] text-slate-400 block font-light">মোবাইল: <span className="font-bold text-slate-600">{app.candidatePhone}</span></span>
                          <span className="text-[10.5px] text-emerald-600 font-bold block">{p.installmentName}</span>
                        </div>
                        <div className="text-right">
                          <strong className="text-slate-900 font-black text-sm block">৳{p.amount.toLocaleString()}</strong>
                          <span className="text-[10px] bg-slate-100 text-slate-600 border px-1.5 py-0.5 rounded-md font-mono mt-0.5 inline-block">TxID: {p.transactionId}</span>
                        </div>
                      </div>

                      {p.bankName && (
                        <p className="text-[10.5px] text-slate-500 font-semibold">
                          🏦 {lang === 'bn' ? 'জমাদানকৃত ব্যাংক:' : 'Deposit Bank:'} <span className="text-slate-800 font-black">{p.bankName}</span>
                        </p>
                      )}

                      {/* Receipt File download simulation */}
                      <div className="p-2 bg-white border border-slate-100 rounded-xl flex justify-between items-center text-[10.5px] font-semibold text-slate-500">
                        <span className="truncate max-w-[180px]">📄 {p.receiptFile}</span>
                        <button
                          onClick={() => alert(`ডাউনলোড হচ্ছে: ${p.receiptFile}`)}
                          className="text-blue-600 hover:underline flex items-center gap-0.5 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" /> {lang === 'bn' ? 'রশিদ ডাউনলোড' : 'View slip'}
                        </button>
                      </div>

                      {/* Verify Action buttons */}
                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={() => {
                            setSelectedAppId(app.id);
                            handleVerifyManualPayment(p.id, 'Rejected');
                          }}
                          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-[10.5px] border border-rose-100 transition cursor-pointer"
                        >
                          ❌ {lang === 'bn' ? 'নাকচ' : 'Reject'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAppId(app.id);
                            handleVerifyManualPayment(p.id, 'Verified');
                          }}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-black text-[10.5px] transition shadow flex items-center gap-0.5 cursor-pointer"
                        >
                          ✓ {lang === 'bn' ? 'অনুমোদন' : 'Verify & Clear'}
                        </button>
                      </div>
                    </div>
                  ))
              ).length === 0 && (
                <div className="text-center py-8 text-slate-400 font-light leading-relaxed">
                  {lang === 'bn' ? 'যাচাই করার মতো কোনো বকেয়া ব্যাংক ট্রান্সফার কিউ নেই।' : 'No manual banking transaction uploads currently pending verification.'}
                </div>
              )}
            </div>
          </div>

          {/* Admin Document Verification Queue */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pb-2 border-b flex items-center justify-between">
              <span>📄 {lang === 'bn' ? 'ক্যান্ডিডেট ডকুমেন্ট যাছাই হাব' : 'Candidate Document Vault Audit'}</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border rounded-md text-[10px] font-black uppercase">
                {applications.reduce((acc, app) => acc + (app.documentVault?.filter(d => d.status === 'Pending').length || 0), 0)} {lang === 'bn' ? 'বকেয়া' : 'Pending'}
              </span>
            </h3>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 text-xs">
              {applications.flatMap(app => 
                (app.documentVault || [])
                  .filter(d => d.status === 'Pending')
                  .map(doc => (
                    <div key={doc.id} className="p-4 border border-slate-200 rounded-2.5xl bg-slate-50/50 space-y-3 hover:border-slate-300 transition leading-relaxed">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-slate-800 text-[13px] block">{app.candidateName}</strong>
                          <span className="text-[10px] text-slate-400 block font-light">{lang === 'bn' ? 'সার্কুলার পদ:' : 'Applied Job:'} {app.jobTitle}</span>
                          <span className="text-xs text-indigo-600 font-extrabold mt-1 block">📁 {doc.documentType}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-light">তারিখ: {doc.uploadedAt}</span>
                      </div>

                      <div className="p-2 bg-white border border-slate-100 rounded-xl flex justify-between items-center text-[10.5px] font-semibold text-slate-500">
                        <span className="truncate max-w-[180px] font-mono">{doc.fileName}</span>
                        <button
                          onClick={() => alert(`ডাউনলোড হচ্ছে: ${doc.fileName}`)}
                          className="text-blue-600 hover:underline flex items-center gap-0.5 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" /> {lang === 'bn' ? 'ডাউনলোড' : 'Download'}
                        </button>
                      </div>

                      {/* Verify Action buttons */}
                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={() => {
                            setSelectedAppId(app.id);
                            handleVerifyDocument(doc.id, 'Rejected');
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-[10.5px] border border-rose-100 transition cursor-pointer"
                        >
                          ❌ {lang === 'bn' ? 'নাকচ' : 'Reject'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAppId(app.id);
                            handleVerifyDocument(doc.id, 'Verified');
                          }}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-black text-[10.5px] transition shadow flex items-center gap-0.5 cursor-pointer"
                        >
                          ✓ {lang === 'bn' ? 'অনুমোদন' : 'Approve Document'}
                        </button>
                      </div>
                    </div>
                  ))
              ).length === 0 && (
                <div className="text-center py-8 text-slate-400 font-light leading-relaxed">
                  {lang === 'bn' ? 'যাচাই করার মতো কোনো ফাইল বা পাসপোর্ট স্ক্যান আপলোড বকেয়া নেই।' : 'No scanned candidate documents awaiting administrative audit.'}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* POPUP: SECURE SIMULATED ONLINE GATEWAY */}
      {showPayModal && payInstallmentIndex !== null && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="crm-payment-modal-overlay">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in" id="crm-payment-modal">
            
            <div className="flex justify-between items-start border-b pb-3 mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  {lang === 'bn' ? 'অনলাইন ও ব্যাংক ডিপোজিট গেটওয়ে' : 'Select Secure Payment Method'}
                </h3>
                <p className="text-[11.5px] text-slate-400 font-light mt-0.5">
                  {activeApp.packageDetails?.installments[payInstallmentIndex]?.name}
                </p>
              </div>
              <button 
                onClick={() => setShowPayModal(false)}
                className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Methods Selectors tabs */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-center">
              {[
                { id: 'bkash', label: 'bKash', icon: '🇧🇩' },
                { id: 'nagad', label: 'Nagad', icon: '🇧🇩' },
                { id: 'stripe', label: 'Card', icon: '💳' },
                { id: 'manual', label: 'Bank', icon: '🏦' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayMethod(m.id as any)}
                  className={`p-2 rounded-2xl border text-xs font-black transition flex flex-col items-center gap-1 cursor-pointer ${
                    payMethod === m.id 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span className="text-[10px]">{m.label}</span>
                </button>
              ))}
            </div>

            {/* PAYMENT DETAILS FORM */}
            {payMethod !== 'manual' ? (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border text-center space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
                    {lang === 'bn' ? 'মোট চার্জ করা হবে' : 'Amount to Charge'}
                  </span>
                  <strong className="text-xl font-black text-slate-800">
                    ৳{(activeApp.packageDetails?.installments[payInstallmentIndex]?.amount || 0).toLocaleString()}
                  </strong>
                  <span className="text-[9px] text-slate-400 block font-light">
                    * {lang === 'bn' ? 'কোনো গেটওয়ে চার্জ প্রযোজ্য নয়।' : 'No extra payment gateway processing fees apply.'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="text-slate-400 font-bold block">{lang === 'bn' ? 'মোবাইল ওয়ালেট নম্বর / কার্ড হোল্ডার নাম' : 'Account/Card Details'}</label>
                  <input
                    type="text"
                    defaultValue={payMethod === 'stripe' ? 'Ariful Islam' : activeApp.candidatePhone}
                    className="p-2.5 bg-slate-50 border rounded-xl font-bold text-slate-800 w-full"
                    placeholder="01712345678"
                  />
                </div>

                <button
                  onClick={() => handleMockPayOnline(payInstallmentIndex)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  {lang === 'bn' ? `অনলাইনে ৳${(activeApp.packageDetails?.installments[payInstallmentIndex]?.amount || 0).toLocaleString()} দিন` : 'Authorize Security Checkout'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitManualReceipt} className="space-y-3.5 text-xs font-semibold text-slate-700">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">{lang === 'bn' ? 'ডিপোজিট ব্যাংকের নাম' : 'Deposit Bank'}</label>
                  <select
                    value={manualBank}
                    onChange={(e) => setManualBank(e.target.value)}
                    className="p-2 bg-slate-50 border rounded-xl font-bold text-slate-800 w-full"
                    required
                  >
                    <option value="Sonali Bank Ltd">Sonali Bank Ltd</option>
                    <option value="BRAC Bank plc">BRAC Bank plc</option>
                    <option value="Premier Bank Ltd">Premier Bank Ltd</option>
                    <option value="Islamic Bank Bangladesh">Islamic Bank Bangladesh</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">{lang === 'bn' ? 'পরিমাণ (টাকা)' : 'Paid Amount (BDT)'}</label>
                    <input
                      type="number"
                      placeholder="Amount BDT"
                      value={manualAmount}
                      onChange={(e) => setManualAmount(e.target.value)}
                      className="p-2 bg-slate-50 border rounded-xl font-bold text-slate-800 w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">{lang === 'bn' ? 'ট্রানজেকশন আইডি / স্লিপ নম্বর' : 'Bank Transaction ID'}</label>
                    <input
                      type="text"
                      placeholder="TXN994231"
                      value={manualTxId}
                      onChange={(e) => setManualTxId(e.target.value)}
                      className="p-2 bg-slate-50 border rounded-xl font-bold text-slate-800 w-full font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">{lang === 'bn' ? 'ব্যাংক স্লিপ স্ক্যান / রশিদের নাম' : 'Deposit Slip Filename'}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="sonali_bank_deposit_slip.pdf"
                      value={manualReceiptName}
                      onChange={(e) => setManualReceiptName(e.target.value)}
                      className="p-2 bg-slate-50 border rounded-xl font-bold text-slate-800 w-full flex-1"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setManualReceiptName('sonali_bank_slip_' + Math.floor(Math.random()*900 + 100) + '.pdf')}
                      className="px-2.5 bg-slate-100 hover:bg-slate-200 text-[11px] font-black rounded-xl border"
                    >
                      Gen
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  {lang === 'bn' ? 'ব্যাংক রশিদ জমা দিন' : 'Upload & Send for Audit'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      </>
      )}

    </div>
  );
};
