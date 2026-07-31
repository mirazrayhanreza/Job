import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, Save, Check, X, AlertCircle, TrendingUp, User, Calendar, 
  DollarSign, FileText, CheckCircle2, Clock, ArrowRight, Search, Building2, 
  Bell, Download, SlidersHorizontal, Sparkles, Calculator, Briefcase, 
  ShieldCheck, RefreshCw, FileSpreadsheet, Printer, Eye, Settings2, Info, ListFilter
} from 'lucide-react';
import { ItalyPackageApplication, VisaProcessStep, PaymentStep } from '../mockData';
import { StaffMember } from './AdminPanel';
import { 
  CustomVisaStepTemplate, VisaProcessTemplate, SystemNotification, NotificationTemplate, 
  SystemSettings, DEFAULT_SETTINGS, PRESET_STEPS, PRESET_TEMPLATES, calculateCandidateBalance 
} from '../types/visa';
import { 
  VisaDashboardSubTab, VisaTemplatesSubTab, VisaStepsSubTab, VisaPaymentSubTab 
} from './visa/VisaSubTabs';
import { 
  VisaCalculatorSubTab, VisaCandidateSubTab, VisaAgencySubTab 
} from './visa/VisaSubTabsPart2';
import { 
  VisaApprovalSubTab, VisaNotificationsSubTab, VisaReportsSubTab, VisaSettingsSubTab 
} from './visa/VisaSubTabsPart3';

interface VisaStepManagerTabProps {
  italyPackages: ItalyPackageApplication[];
  onUpdateItalyPackage: (pkg: ItalyPackageApplication) => void;
  activeStaff: StaffMember;
  addLog: (user: string, action: string, type?: string) => void;
  onBroadcastNotification?: (title: string, msg: string) => void;
  companies: any[];
  transactions: any[];
}

export default function VisaStepManagerTab({
  italyPackages,
  onUpdateItalyPackage,
  activeStaff,
  addLog,
  onBroadcastNotification,
  companies,
  transactions
}: VisaStepManagerTabProps) {
  
  // Tab Routing inside the Visa Step Manager Module
  const [subTab, setSubTab] = useState<'dashboard' | 'templates' | 'steps' | 'payment-settings' | 'calc' | 'candidate-view' | 'agency' | 'approval' | 'notifications' | 'reports' | 'settings'>('dashboard');

  // 1. Approved applicants count
  const approvedCandidates = italyPackages.filter(pkg => pkg.status === 'Approved');

  // 2. Load custom step templates
  const [steps, setSteps] = useState<CustomVisaStepTemplate[]>(() => {
    const saved = localStorage.getItem('visa_custom_step_templates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [...PRESET_STEPS];
  });

  // 3. Load Visa templates
  const [templates, setTemplates] = useState<VisaProcessTemplate[]>(() => {
    const saved = localStorage.getItem('visa_process_templates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [...PRESET_TEMPLATES];
  });

  // 4. Load payment configs
  const [paymentConfig, setPaymentConfig] = useState(() => {
    const saved = localStorage.getItem('visa_payment_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      pricingModel: 'custom', // 'fixed' | 'custom'
      fixedAmount: 285000,
      partialAllowed: true,
      installmentAllowed: true,
      lateFee: 2500,
      globalDiscount: 5000,
      extraCharges: 4000
    };
  });

  // 5. Load notifications log
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('visa_step_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'n1', title: 'পেমেন্ট রিসিভড', msg: 'ক্যান্ডিডেট কামাল উদ্দিনের ৩য় কিস্তি ৩০,০০০ টাকা জমা হয়েছে।', time: 'আজ ১০:৩০ AM', type: 'success', recipient: 'Admin' },
      { id: 'n2', title: 'নতুন ভিসা প্রসেস শুরু', msg: 'আবেদনকারী সাইদ আহম্মেদের ওয়ার্ক পারমিট প্রসেস শুরু হয়েছে।', time: 'আজ ০৯:১৫ AM', type: 'info', recipient: 'Candidate' },
      { id: 'n3', title: 'পেমেন্ট ডিউ এলার্ট', msg: 'মেহেদী হাসানের চুক্তিপত্র সইয়ের ফি পরিশোধের সময় অতিবাহিত হচ্ছে।', time: 'গতকাল ০৩:০০ PM', type: 'warning', recipient: 'Agency' }
    ];
  });

  // Persists
  useEffect(() => {
    localStorage.setItem('visa_step_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('visa_custom_step_templates', JSON.stringify(steps));
  }, [steps]);

  useEffect(() => {
    localStorage.setItem('visa_process_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('visa_payment_config', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  // Selected candidate state helper
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(() => {
    return approvedCandidates[0]?.id || '';
  });

  // Automatically select first candidate if none selected
  useEffect(() => {
    if (!selectedCandidateId && approvedCandidates.length > 0) {
      setSelectedCandidateId(approvedCandidates[0].id);
    }
  }, [approvedCandidates, selectedCandidateId]);

  const selectedCandidate = approvedCandidates.find(c => c.id === selectedCandidateId) || approvedCandidates[0];

  // Helper trigger notification
  const triggerNotification = (title: string, msg: string, type: 'info' | 'success' | 'warning' | 'alert', recipient: 'Candidate' | 'Agency' | 'Staff' | 'Admin') => {
    const newNotif: SystemNotification = {
      id: 'notif_' + Date.now(),
      title,
      msg,
      time: new Date().toLocaleTimeString() + ' | ' + new Date().toLocaleDateString(),
      type,
      recipient
    };
    setNotifications(prev => [newNotif, ...prev]);
    if (onBroadcastNotification && recipient === 'Candidate') {
      onBroadcastNotification(title, msg);
    }
  };

  // State parameters for adding new step
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepKey, setNewStepKey] = useState('');
  const [newStepName, setNewStepName] = useState('');
  const [newStepLabel, setNewStepLabel] = useState('');
  const [newStepOrder, setNewStepOrder] = useState<number>(steps.length + 1);
  const [newStepAmount, setNewStepAmount] = useState<number>(20000);
  const [newStepDueDate, setNewStepDueDate] = useState('2026-08-30');
  const [newStepDesc, setNewStepDesc] = useState('');
  const [newStepDocs, setNewStepDocs] = useState('');

  const handleCreateStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepName.trim() || !newStepLabel.trim()) {
      alert('অনুগ্রহ করে প্রয়োজনীয় ঘরসমূহ পূরণ করুন।');
      return;
    }
    const key = newStepKey.trim() || newStepName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (steps.some(s => s.key === key)) {
      alert('এই কী (ID Key) দিয়ে ইতিমধ্যে একটি ভিসা ধাপ রয়েছে।');
      return;
    }

    const newStep: CustomVisaStepTemplate = {
      key,
      name: newStepName,
      label: newStepLabel,
      order: steps.length + 1,
      amount: newStepAmount,
      currency: 'BDT',
      dueDate: newStepDueDate,
      description: newStepDesc,
      requiredDocs: newStepDocs,
      status: 'Active'
    };

    setSteps(prev => [...prev, newStep]);
    setIsAddingStep(false);
    setNewStepKey('');
    setNewStepName('');
    setNewStepLabel('');
    setNewStepDesc('');
    setNewStepDocs('');
    addLog(activeStaff.name, `নতুন ভিসা প্রসেস ট্র্যাকিং কিস্তি ধাপ "${newStep.name}" যোগ করেছেন।`, 'success');
    alert('নতুন ভিসা কিস্তি ধাপ সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleDeleteStep = (key: string) => {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই ভিসা প্রসেস কিস্তি ধাপটি মুছে দিতে চান?')) return;
    setSteps(prev => prev.filter(s => s.key !== key).map((s, idx) => ({ ...s, order: idx + 1 })));
    addLog(activeStaff.name, `ভিসা প্রসেস কিস্তি ধাপ "${key}" মুছে দিয়েছেন।`, 'warning');
  };

  // Live adjustment modifiers
  const [candCustomDiscount, setCandCustomDiscount] = useState(0);
  const [candCustomExtra, setCandCustomExtra] = useState(0);
  const [candContractStatus, setCandContractStatus] = useState<'Active' | 'Completed' | 'Pending' | 'Terminated'>('Active');

  // Sync adjustment inputs when active candidate changes
  useEffect(() => {
    if (selectedCandidate) {
      setCandCustomDiscount(selectedCandidate.discount || 0);
      setCandCustomExtra(selectedCandidate.extraCharges || 0);
      setCandContractStatus(selectedCandidate.contractStatus || 'Active');
    }
  }, [selectedCandidateId, selectedCandidate]);

  const handleSaveCandidateAdjustments = () => {
    if (!selectedCandidate) return;

    const bal = calculateCandidateBalance(selectedCandidate, steps, paymentConfig);
    const updated: ItalyPackageApplication = {
      ...selectedCandidate,
      discount: candCustomDiscount,
      extraCharges: candCustomExtra,
      contractStatus: candContractStatus,
      totalAmount: bal.totalContract,
      dueAmount: bal.totalDue
    };

    onUpdateItalyPackage(updated);
    addLog(activeStaff.name, `ক্যান্ডিডেট "${selectedCandidate.candidateName}" এর আর্থিক ফাইল সমন্বয় করেছেন।`, 'success');
    alert(`আর্থিক সমন্বয় সফলভাবে সংরক্ষিত হয়েছে!`);
  };

  // Agency deposit submission
  const [agencySelectedStep, setAgencySelectedStep] = useState(steps[0]?.key || 'registration');
  const [agencyPaidAmountInput, setAgencyPaidAmountInput] = useState(20000);
  const [agencyPaymentMethod, setAgencyPaymentMethod] = useState('bKash Merchant');
  const [agencyReceiptName, setAgencyReceiptName] = useState('deposit_slip_039.png');

  // Sync agency step key when step list loads
  useEffect(() => {
    if (steps.length > 0) {
      setAgencySelectedStep(steps[0].key);
    }
  }, [steps]);

  const handleAgencySubmitPayment = () => {
    if (!selectedCandidate) return;

    const newPayment = {
      id: 'pay_sim_' + Date.now(),
      amount: agencyPaidAmountInput,
      date: new Date().toLocaleDateString(),
      method: agencyPaymentMethod,
      invoiceId: 'TXN' + Math.floor(100000 + Math.random() * 900000),
      status: 'Pending' as const,
      stepKey: agencySelectedStep
    };

    const currentHistory = selectedCandidate.paymentHistory ? [...selectedCandidate.paymentHistory] : [];
    const updated: ItalyPackageApplication = {
      ...selectedCandidate,
      paymentHistory: [...currentHistory, newPayment]
    };

    onUpdateItalyPackage(updated);
    addLog('পার্টনার এজেন্সি প্যানেল', `ক্যান্ডিডেট "${selectedCandidate.candidateName}" এর "${agencySelectedStep}" ধাপের পেমেন্ট স্লিপ জমা দিয়েছেন।`, 'info');
    triggerNotification('নতুন পেমেন্ট যাচাই আবেদন', `এজেন্সি ${selectedCandidate.candidateName} এর পক্ষ থেকে ৳${agencyPaidAmountInput} টাকা পেমেন্ট স্লিপ পাঠিয়েছে।`, 'warning', 'Admin');
    alert(`পেমেন্ট স্লিপ জমা দেওয়া হয়েছে! এডমিন মডারেটর রশিদটি যাচাই করার পর অনুমোদন দেবেন।`);
  };

  // Admin approval verification
  const handleAdminVerifyPayment = (candId: string, payId: string, action: 'Approve' | 'Reject') => {
    const cand = italyPackages.find(c => c.id === candId);
    if (!cand || !cand.paymentHistory) return;

    const updatedHistory = cand.paymentHistory.map(p => {
      if (p.id === payId) {
        return { ...p, status: action === 'Approve' ? ('Verified' as const) : ('Rejected' as const) };
      }
      return p;
    });

    // Automatically update the matching visa step status to completed upon payment verification approval!
    const targetPay = cand.paymentHistory.find(p => p.id === payId);
    let updatedSteps = cand.visaSteps ? [...cand.visaSteps] : [];
    
    if (action === 'Approve' && targetPay) {
      updatedSteps = updatedSteps.map(s => {
        if (s.key === targetPay.stepKey) {
          return { ...s, status: 'Completed' as const, date: new Date().toLocaleDateString(), staffName: activeStaff.name };
        }
        return s;
      });
    }

    const updated: ItalyPackageApplication = {
      ...cand,
      paymentHistory: updatedHistory,
      visaSteps: updatedSteps
    };

    onUpdateItalyPackage(updated);
    
    if (action === 'Approve' && targetPay) {
      addLog(activeStaff.name, `ক্যান্ডিডেট "${cand.candidateName}" এর "${targetPay.stepKey}" পেমেন্ট ও ধাপ ভেরিফাই করেছেন।`, 'success');
      triggerNotification('পেমেন্ট সফলভাবে ভেরিফাইড!', `আপনার "${targetPay.stepKey}" ধাপের জন্য কিস্তি পরিশোধিত হিসেবে অনুমোদন করা হয়েছে।`, 'success', 'Candidate');
    } else if (targetPay) {
      addLog(activeStaff.name, `ক্যান্ডিডেট "${cand.candidateName}" এর পেমেন্ট স্লিপ প্রত্যাখ্যান করেছেন।`, 'warning');
      triggerNotification('পেমেন্ট প্রত্যাখ্যান নোটিশ', `আপনার জমাকৃত পেমেন্ট স্লিপটি যাচাইয়ের পর রিজেক্ট করা হয়েছে। পুনরায় ট্রাই করুন।`, 'alert', 'Candidate');
    }
  };

  // Dynamic counts for alerts
  const pendingPaymentsCount = approvedCandidates.reduce((sum, c) => {
    const pendingInCand = c.paymentHistory?.filter(p => p.status === 'Pending').length || 0;
    const pendingStepsInCand = c.visaSteps?.filter(s => s.status === 'Processing').length || 0;
    return sum + pendingInCand + pendingStepsInCand;
  }, 0);

  // Global aggregate financial numbers
  const totalContractAmountGlobal = approvedCandidates.reduce((sum, c) => {
    const bal = calculateCandidateBalance(c, steps, paymentConfig);
    return sum + bal.totalContract;
  }, 0);

  const totalPaidGlobal = approvedCandidates.reduce((sum, c) => {
    const bal = calculateCandidateBalance(c, steps, paymentConfig);
    return sum + bal.totalPaid;
  }, 0);

  const totalDueGlobal = totalContractAmountGlobal - totalPaidGlobal;

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300 font-sans p-4 md:p-6 space-y-6">
      
      {/* Dynamic Module Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-950 border border-slate-850 p-5 rounded-3xl gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </span>
            <h1 className="text-base font-black text-white uppercase tracking-wider">
              ভিসা প্রসেস ধাপ ও কিস্তি পেমেন্ট ম্যানেজার (Visa Step Manager Module)
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            সক্রিয় অ্যাডমিন: <span className="text-white font-bold">{activeStaff.name} ({activeStaff.role})</span> • রিয়েল-টাইম ক্যান্ডিডেট ট্র্যাকিং, কিস্তি ইনভয়েসিং এবং পেমেন্ট অনুমোদন পোর্টাল।
          </p>
        </div>

        {/* Global tab shortcuts */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-xl border border-slate-850">
            মোট ক্যান্ডিডেট: <span className="text-white font-bold">{approvedCandidates.length} জন</span>
          </span>
          <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/20 font-black">
            ⏳ মুলতুবি নোটিশ: {pendingPaymentsCount} টি
          </span>
        </div>
      </div>

      {/* Main Sub-Tab Horizontal Navigation Rail */}
      <div className="flex items-center gap-1 overflow-x-auto bg-slate-950/60 p-1.5 rounded-2xl border border-slate-850">
        <button 
          onClick={() => setSubTab('dashboard')}
          className={`px-3 py-2 text-[10.5px] font-black rounded-xl transition shrink-0 uppercase tracking-wider ${subTab === 'dashboard' ? 'bg-indigo-500 text-slate-950 shadow-lg shadow-indigo-500/15' : 'text-slate-400 hover:text-white'}`}
        >
          📊 ড্যাশবোর্ড (Analytics)
        </button>

        <button 
          onClick={() => setSubTab('templates')}
          className={`px-3 py-2 text-[10.5px] font-black rounded-xl transition shrink-0 uppercase tracking-wider ${subTab === 'templates' ? 'bg-indigo-500 text-slate-950 shadow-lg shadow-indigo-500/15' : 'text-slate-400 hover:text-white'}`}
        >
          📋 ভিসা টেমপ্লেট (Templates)
        </button>

        <button 
          onClick={() => setSubTab('steps')}
          className={`px-3 py-2 text-[10.5px] font-black rounded-xl transition shrink-0 uppercase tracking-wider ${subTab === 'steps' ? 'bg-indigo-500 text-slate-950 shadow-lg shadow-indigo-500/15' : 'text-slate-400 hover:text-white'}`}
        >
          ⚙️ প্রসেস ধাপসমূহ (Unlimited Steps)
        </button>

        <button 
          onClick={() => setSubTab('payment-settings')}
          className={`px-3 py-2 text-[10.5px] font-black rounded-xl transition shrink-0 uppercase tracking-wider ${subTab === 'payment-settings' ? 'bg-indigo-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          💳 পেমেন্ট সেটিংস (Installments Rules)
        </button>

        <button 
          onClick={() => setSubTab('calc')}
          className={`px-3 py-2 text-[10.5px] font-black rounded-xl transition shrink-0 uppercase tracking-wider ${subTab === 'calc' ? 'bg-indigo-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          🧮 সমন্বয় ও ক্যালকুলেটর (Invoicing)
        </button>

        <button 
          onClick={() => setSubTab('candidate-view')}
          className={`px-3 py-2 text-[10.5px] font-black rounded-xl transition shrink-0 uppercase tracking-wider ${subTab === 'candidate-view' ? 'bg-indigo-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          🛰️ ক্যান্ডিডেট ড্যাশবোর্ড ভিউ
        </button>

        <button 
          onClick={() => setSubTab('agency')}
          className={`px-3 py-2 text-[10.5px] font-black rounded-xl transition shrink-0 uppercase tracking-wider ${subTab === 'agency' ? 'bg-indigo-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          🏢 এজেন্সি গেটওয়ে (Partner Agency)
        </button>

        <button 
          onClick={() => setSubTab('approval')}
          className={`px-3 py-2 text-[10.5px] font-black rounded-xl transition shrink-0 uppercase tracking-wider relative ${subTab === 'approval' ? 'bg-indigo-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          🛡️ এডমিন এপ্রুভাল ({pendingPaymentsCount})
        </button>

        <button 
          onClick={() => setSubTab('notifications')}
          className={`px-3 py-2 text-[10.5px] font-black rounded-xl transition shrink-0 uppercase tracking-wider ${subTab === 'notifications' ? 'bg-indigo-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          🔔 নোটিফিকেশন হাব (Reminders)
        </button>

        <button 
          onClick={() => setSubTab('reports')}
          className={`px-3 py-2 text-[10.5px] font-black rounded-xl transition shrink-0 uppercase tracking-wider ${subTab === 'reports' ? 'bg-indigo-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          📊 রিপোর্টস (Reports Export)
        </button>

        <button 
          onClick={() => setSubTab('settings')}
          className={`px-3 py-2 text-[10.5px] font-black rounded-xl transition shrink-0 uppercase tracking-wider ${subTab === 'settings' ? 'bg-indigo-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          ⚙️ সিস্টেম সেটিংস (Rules)
        </button>
      </div>

      {/* Subtab Contents Container Router */}
      <div className="min-h-[400px]">
        
        {subTab === 'dashboard' && (
          <VisaDashboardSubTab 
            approvedCandidates={approvedCandidates}
            steps={steps}
            paymentConfig={paymentConfig}
            notifications={notifications}
            pendingPaymentsCount={pendingPaymentsCount}
            totalVisaSteps={steps.length}
            activeStepsCount={steps.filter(s => s.status === 'Active').length}
            completedStepsCount={0}
            totalContractAmountGlobal={totalContractAmountGlobal}
            totalPaidGlobal={totalPaidGlobal}
            totalDueGlobal={totalDueGlobal}
            setSubTab={setSubTab}
            triggerNotification={triggerNotification}
            addLog={addLog}
            activeStaff={activeStaff}
          />
        )}

        {subTab === 'templates' && (
          <VisaTemplatesSubTab 
            templates={templates}
            setTemplates={setTemplates}
            approvedCandidates={approvedCandidates}
            onUpdateItalyPackage={onUpdateItalyPackage}
            addLog={addLog}
            activeStaff={activeStaff}
            triggerNotification={triggerNotification}
            steps={steps}
          />
        )}

        {subTab === 'steps' && (
          <VisaStepsSubTab 
            steps={steps}
            setSteps={setSteps}
            isAddingStep={isAddingStep}
            setIsAddingStep={setIsAddingStep}
            newStepKey={newStepKey}
            setNewStepKey={setNewStepKey}
            newStepName={newStepName}
            setNewStepName={setNewStepName}
            newStepLabel={newStepLabel}
            setNewStepLabel={setNewStepLabel}
            newStepOrder={newStepOrder}
            setNewStepOrder={setNewStepOrder}
            newStepAmount={newStepAmount}
            setNewStepAmount={setNewStepAmount}
            newStepDueDate={newStepDueDate}
            setNewStepDueDate={setNewStepDueDate}
            newStepDesc={newStepDesc}
            setNewStepDesc={setNewStepDesc}
            newStepDocs={newStepDocs}
            setNewStepDocs={setNewStepDocs}
            handleCreateStep={handleCreateStep}
            handleDeleteStep={handleDeleteStep}
          />
        )}

        {subTab === 'payment-settings' && (
          <VisaPaymentSubTab 
            paymentConfig={paymentConfig}
            setPaymentConfig={setPaymentConfig}
            addLog={addLog}
            activeStaff={activeStaff}
          />
        )}

        {subTab === 'calc' && (
          <VisaCalculatorSubTab 
            selectedCandidate={selectedCandidate}
            selectedCandidateId={selectedCandidateId}
            setSelectedCandidateId={setSelectedCandidateId}
            approvedCandidates={approvedCandidates}
            steps={steps}
            paymentConfig={paymentConfig}
            candCustomDiscount={candCustomDiscount}
            setCandCustomDiscount={setCandCustomDiscount}
            candCustomExtra={candCustomExtra}
            setCandCustomExtra={setCandCustomExtra}
            candContractStatus={candContractStatus}
            setCandContractStatus={setCandContractStatus}
            handleSaveCandidateAdjustments={handleSaveCandidateAdjustments}
          />
        )}

        {subTab === 'candidate-view' && (
          <VisaCandidateSubTab 
            selectedCandidate={selectedCandidate}
            setSelectedCandidateId={setSelectedCandidateId}
            approvedCandidates={approvedCandidates}
            steps={steps}
            paymentConfig={paymentConfig}
            onUpdateItalyPackage={onUpdateItalyPackage}
            addLog={addLog}
          />
        )}

        {subTab === 'agency' && (
          <VisaAgencySubTab 
            selectedCandidate={selectedCandidate}
            setSelectedCandidateId={setSelectedCandidateId}
            approvedCandidates={approvedCandidates}
            steps={steps}
            agencySelectedStep={agencySelectedStep}
            setAgencySelectedStep={setAgencySelectedStep}
            agencyPaidAmountInput={agencyPaidAmountInput}
            setAgencyPaidAmountInput={setAgencyPaidAmountInput}
            agencyPaymentMethod={agencyPaymentMethod}
            setAgencyPaymentMethod={setAgencyPaymentMethod}
            agencyReceiptName={agencyReceiptName}
            setAgencyReceiptName={setAgencyReceiptName}
            handleAgencySubmitPayment={handleAgencySubmitPayment}
            onUpdateItalyPackage={onUpdateItalyPackage}
            addLog={addLog}
            triggerNotification={triggerNotification}
          />
        )}

        {subTab === 'approval' && (
          <VisaApprovalSubTab 
            approvedCandidates={approvedCandidates}
            onUpdateItalyPackage={onUpdateItalyPackage}
            addLog={addLog}
            activeStaff={activeStaff}
            triggerNotification={triggerNotification}
            handleAdminVerifyPayment={handleAdminVerifyPayment}
          />
        )}

        {subTab === 'notifications' && (
          <VisaNotificationsSubTab 
            notifications={notifications}
            setNotifications={setNotifications}
            addLog={addLog}
            activeStaff={activeStaff}
          />
        )}

        {subTab === 'reports' && (
          <VisaReportsSubTab 
            approvedCandidates={approvedCandidates}
            steps={steps}
            paymentConfig={paymentConfig}
            transactions={transactions}
            addLog={addLog}
            activeStaff={activeStaff}
          />
        )}

        {subTab === 'settings' && (
          <VisaSettingsSubTab 
            addLog={addLog}
            activeStaff={activeStaff}
          />
        )}

      </div>
    </div>
  );
}
