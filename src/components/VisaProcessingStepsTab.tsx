/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ClipboardList, Search, User, Calendar, FileText, 
  CheckCircle2, Clock, AlertTriangle, ChevronRight, 
  Info, SlidersHorizontal, Sparkles, Filter, ArrowRight, Activity, ShieldCheck
} from 'lucide-react';
import { ItalyPackageApplication } from '../mockData';
import { StaffMember } from './AdminPanel';

interface VisaProcessingStepsTabProps {
  italyPackages: ItalyPackageApplication[];
  onUpdateItalyPackage: (pkg: ItalyPackageApplication) => void;
  activeStaff: StaffMember;
  addLog: (user: string, action: string, type?: string) => void;
  onBroadcastNotification?: (title: string, msg: string) => void;
}

export default function VisaProcessingStepsTab({
  italyPackages,
  onUpdateItalyPackage,
  activeStaff,
  addLog,
  onBroadcastNotification
}: VisaProcessingStepsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'columns' | 'registry'>('columns');
  const [selectedStepFilter, setSelectedStepFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // State for active package editing
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [selectedStepKey, setSelectedStepKey] = useState<string>('mofa');
  
  // Form fields for editing a step
  const [formStatus, setFormStatus] = useState<'Pending' | 'Processing' | 'Completed' | 'Rejected'>('Pending');
  const [formDate, setFormDate] = useState('');
  const [formStaff, setFormStaff] = useState('');
  const [formDocUrl, setFormDocUrl] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // 9 Visa Steps Definition
  const VISA_STEPS_META = [
    { key: 'mofa', name: 'MOFA Attestation', label: 'মুফা অ্যাটেস্টেশন', desc: 'পররাষ্ট্র মন্ত্রণালয় কর্তৃক মূল নথি সত্যায়ন।' },
    { key: 'work_permit', name: 'Work Permit (Nulla Osta)', label: 'ওয়ার্ক পারমিট রিসিভ', desc: 'ইতালি সরকারের অনুমোদিত নুলা ওস্তা।' },
    { key: 'invitation_letter', name: 'Sponsor Invitation', label: 'স্পন্সর ইনভিটেশন', desc: 'স্পন্সর বা কোম্পানির আমন্ত্রণ পত্র।' },
    { key: 'visa_submission', name: 'Visa Submission', label: 'এম্বেসি সাবমিশন', desc: 'ভিসা সেন্টারে পাসপোর্ট ও নথিপত্র জমা।' },
    { key: 'visa_approved', name: 'Visa Approved', label: 'ভিসা অনুমোদন', desc: 'দূতাবাস কর্তৃক ভিসা অনুমোদন।' },
    { key: 'visa_printed', name: 'Visa Printed', label: 'ভিসা প্রিন্ট ও ডেলিভারি', desc: 'পাসপোর্টে ভিসা স্টিকার প্রিন্ট।' },
    { key: 'ticket_issued', name: 'Flight Ticket Ready', label: 'ফ্লাইট টিকিট ও শিডিউল', desc: 'ফ্লাইটের টিকিট চূড়ান্তকরণ।' },
    { key: 'departure', name: 'Departure (Fly)', label: 'ফ্লাইট ডিপার্চার', desc: 'বাংলাদেশ বিমানবন্দর থেকে যাত্রা।' },
    { key: 'arrived', name: 'Arrived Italy', label: 'ইতালি আগমন', desc: 'ইতালিতে নিরাপদে পৌঁছানো।' }
  ];

  // Active candidates list (Approved by Admin)
  const activeCandidates = italyPackages.filter(p => p.status === 'Approved');

  // Filter candidates based on search
  const filteredCandidates = activeCandidates.filter(candidate => {
    const query = searchQuery.toLowerCase();
    const matchSearch = 
      candidate.candidateName.toLowerCase().includes(query) ||
      candidate.passportNumber.toLowerCase().includes(query) ||
      candidate.candidateEmail.toLowerCase().includes(query) ||
      candidate.candidatePhone.includes(query);

    if (selectedStepFilter === 'all') {
      return matchSearch;
    } else {
      const step = candidate.visaSteps?.find(s => s.key === selectedStepFilter);
      if (!step) return false;
      
      const matchStatus = statusFilter === 'all' || step.status === statusFilter;
      return matchSearch && matchStatus;
    }
  });

  // Calculate statistics
  const totalProfiles = activeCandidates.length;
  const visaApprovedCount = activeCandidates.filter(p => 
    p.visaSteps?.some(s => s.key === 'visa_approved' && s.status === 'Completed')
  ).length;
  const readyToFlyCount = activeCandidates.filter(p => 
    p.visaSteps?.some(s => s.key === 'ticket_issued' && s.status === 'Completed')
  ).length;
  const completedCount = activeCandidates.filter(p => 
    p.visaSteps?.some(s => s.key === 'arrived' && s.status === 'Completed')
  ).length;

  // Handle open step editor for a specific package and step
  const openStepEditor = (pkgId: string, stepKey: string) => {
    const pkg = activeCandidates.find(p => p.id === pkgId);
    if (!pkg) return;
    
    const step = pkg.visaSteps?.find(s => s.key === stepKey) || {
      key: stepKey,
      name: VISA_STEPS_META.find(m => m.key === stepKey)?.name || '',
      status: 'Pending',
      date: '',
      staffName: '',
      documentUrl: '',
      adminNotes: ''
    };

    setSelectedPkgId(pkgId);
    setSelectedStepKey(stepKey);
    setFormStatus(step.status as any || 'Pending');
    setFormDate(step.date || new Date().toISOString().split('T')[0]);
    setFormStaff(step.staffName || activeStaff.name);
    setFormDocUrl(step.documentUrl || '');
    setFormNotes(step.adminNotes || '');
  };

  // Handle Save Step Updates
  const handleSaveStep = () => {
    if (!selectedPkgId) return;
    const pkg = activeCandidates.find(p => p.id === selectedPkgId);
    if (!pkg) return;

    const updatedVisaSteps = (pkg.visaSteps || []).map(s => {
      if (s.key === selectedStepKey) {
        return {
          ...s,
          status: formStatus,
          date: formDate,
          staffName: formStaff,
          documentUrl: formDocUrl,
          adminNotes: formNotes
        };
      }
      return s;
    });

    const updatedPkg = { ...pkg, visaSteps: updatedVisaSteps };
    onUpdateItalyPackage(updatedPkg);
    
    // Log entry
    const stepMeta = VISA_STEPS_META.find(m => m.key === selectedStepKey);
    addLog(
      activeStaff.name, 
      `ভিসা প্রসেস কন্ট্রোল থেকে ${pkg.candidateName} এর "${stepMeta?.label || selectedStepKey}" ধাপের তথ্য ও স্ট্যাটাস '${formStatus}' আপডেট করেছেন।`, 
      'success'
    );

    // Automated notification trigger on completion
    const oldStepStatus = pkg.visaSteps?.find(s => s.key === selectedStepKey)?.status;
    if (formStatus === 'Completed' && oldStepStatus !== 'Completed') {
      let customNotifTitle = `🔔 ${stepMeta?.name || selectedStepKey} Completed`;
      let customNotifMsg = `${pkg.candidateName} এর "${stepMeta?.label || selectedStepKey}" ধাপটি সফলভাবে সম্পন্ন হয়েছে।`;
      
      if (selectedStepKey === 'mofa') {
        customNotifTitle = '🔔 MOFA Completed';
        customNotifMsg = `${pkg.candidateName} এর MOFA Attestation সফলভাবে সম্পন্ন হয়েছে।`;
      } else if (selectedStepKey === 'work_permit') {
        customNotifTitle = '🔔 Work Permit Ready';
        customNotifMsg = `${pkg.candidateName} এর ইতালির ওয়ার্ক পারমিট (Nulla Osta) সফলভাবে অনুমোদিত ও রিসিভ হয়েছে!`;
      } else if (selectedStepKey === 'invitation_letter') {
        customNotifTitle = '🔔 Invitation Letter Uploaded';
        customNotifMsg = `${pkg.candidateName} এর স্পন্সর ইনভিটেশন লেটার সফলভাবে সিস্টেমে আপলোড করা হয়েছে।`;
      } else if (selectedStepKey === 'visa_submission') {
        customNotifTitle = '🔔 Visa Submitted';
        customNotifMsg = `${pkg.candidateName} এর পাসপোর্ট ও নথিপত্র ইতালির দূতাবাসে সাবমিট করা হয়েছে।`;
      } else if (selectedStepKey === 'visa_approved') {
        customNotifTitle = '🔔 Visa Approved';
        customNotifMsg = `🎉 অভিনন্দন! ${pkg.candidateName} এর ইতালির কাজের ভিসা সফলভাবে embassy কর্তৃক অনুমোদিত হয়েছে!`;
      } else if (selectedStepKey === 'visa_printed') {
        customNotifTitle = '🔔 Visa Printed';
        customNotifMsg = `🎉 ${pkg.candidateName} এর পাসপোর্ট ও ভিসা সফলভাবে প্রিন্ট হয়েছে এবং প্রধান কার্যালয়ে পৌঁছেছে।`;
      } else if (selectedStepKey === 'ticket_issued') {
        customNotifTitle = '🔔 Flight Ticket Ready';
        customNotifMsg = `✈️ ${pkg.candidateName} এর ফ্লাইটের টিকিট ও ট্রাভেল শিডিউল চূড়ান্ত করা হয়েছে।`;
      } else if (selectedStepKey === 'departure') {
        customNotifTitle = '🔔 Departure Reminder';
        customNotifMsg = `✈️ শুভকামনা! ${pkg.candidateName} এর বিমান যাত্রা আজ সম্পন্ন হচ্ছে। ফ্লাইট সময়ের ৪ ঘণ্টা আগে উপস্থিত থাকুন।`;
      } else if (selectedStepKey === 'arrived') {
        customNotifTitle = '🔔 Arrived in Italy';
        customNotifMsg = `✈️ 🎉 আলহামদুলিল্লাহ্‌! ${pkg.candidateName} সফলভাবে ইতালিতে পৌঁছেছেন।`;
      }
      onBroadcastNotification?.(customNotifTitle, customNotifMsg);
    }

    setSelectedPkgId(null);
    alert(`"${stepMeta?.label}" সফলভাবে সংরক্ষিত হয়েছে!`);
  };

  return (
    <div className="space-y-6" id="visa-steps-management-container">
      {/* Upper Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl border border-indigo-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/25">
              <ClipboardList className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">Immigration Control</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Visa Processing Steps Tracker</h2>
          <p className="text-slate-400 text-xs max-w-xl font-light">
            সকল ইমিগ্রেশন ও ইতালি ওয়ার্ক পারমিট ক্যান্ডিডেটদের ভিসা প্রসেস স্ট্যাটাস এবং ৯টি প্রফেশনাল ধাপের কেন্দ্রীয় কন্ট্রোল প্যানেল।
          </p>
        </div>

        <div className="flex items-center gap-2 z-10 shrink-0">
          <button
            onClick={() => setViewMode('columns')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'columns' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15' 
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>ধাপ ভিত্তিক ভিউ</span>
          </button>
          <button
            onClick={() => setViewMode('registry')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'registry' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15' 
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>সেন্ট্রাল ক্যান্ডিডেট লিস্ট</span>
          </button>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm relative overflow-hidden flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
            👥
          </div>
          <div className="min-w-0">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">মোট একটিভ ফাইল</p>
            <p className="text-base font-black text-slate-800 mt-0.5">{totalProfiles} জন</p>
          </div>
        </div>
        
        {/* Stat 2 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm relative overflow-hidden flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
            🎉
          </div>
          <div className="min-w-0">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ভিসা অনুমোদিত</p>
            <p className="text-base font-black text-slate-800 mt-0.5">{visaApprovedCount} জন</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm relative overflow-hidden flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
            ✈️
          </div>
          <div className="min-w-0">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">টিকিট ও ট্রাভেল রেডি</p>
            <p className="text-base font-black text-slate-800 mt-0.5">{readyToFlyCount} জন</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm relative overflow-hidden flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-650 flex items-center justify-center font-bold text-sm shrink-0">
            🇮🇹
          </div>
          <div className="min-w-0">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ইতালি পৌঁছেছেন</p>
            <p className="text-base font-black text-slate-800 mt-0.5">{completedCount} জন</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নাম, পাসপোর্ট, ইমেইল দিয়ে সার্চ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:bg-white focus:outline-indigo-600 focus:border-indigo-600 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 text-slate-400 text-xs shrink-0 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>ফিল্টার:</span>
          </div>

          <select
            value={selectedStepFilter}
            onChange={(e) => {
              setSelectedStepFilter(e.target.value);
              if (e.target.value === 'all') setStatusFilter('all');
            }}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-3 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-500"
          >
            <option value="all">সকল ভিসা ধাপ (All Steps)</option>
            {VISA_STEPS_META.map(step => (
              <option key={step.key} value={step.key}>{step.name}</option>
            ))}
          </select>

          {selectedStepFilter !== 'all' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-3 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 animate-fade-in"
            >
              <option value="all">সকল অবস্থা (All Status)</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}
        </div>
      </div>

      {/* Main View Render */}
      {viewMode === 'columns' ? (
        /* STEP-BY-STEP COLUMNS VIEW (Visually Stunning horizontal progression layout or active list) */
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4" id="visa-steps-columns-layout">
          {VISA_STEPS_META.map((meta, stepIdx) => {
            // Find candidates whose active status or completed status applies to this step
            const candidatesInThisStep = activeCandidates.filter(candidate => {
              const step = candidate.visaSteps?.find(s => s.key === meta.key);
              if (!step) return false;
              
              // We match candidates that are active on this step
              const isSearchMatch = searchQuery === '' || 
                candidate.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                candidate.passportNumber.toLowerCase().includes(searchQuery.toLowerCase());
                
              if (selectedStepFilter !== 'all' && selectedStepFilter !== meta.key) {
                return false;
              }

              // Filter by status if step filter is active
              if (selectedStepFilter === meta.key && statusFilter !== 'all') {
                return step.status === statusFilter && isSearchMatch;
              }

              // By default, show candidates who are in "Processing", "Completed", or "Rejected"
              return (step.status === 'Processing' || step.status === 'Completed' || step.status === 'Rejected') && isSearchMatch;
            });

            // Count for badge
            const stepTotal = activeCandidates.filter(candidate => {
              const step = candidate.visaSteps?.find(s => s.key === meta.key);
              return step?.status === 'Completed';
            }).length;

            return (
              <div 
                key={meta.key} 
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col h-[420px] transition-all duration-200 hover:border-slate-300 relative"
              >
                {/* Step Header */}
                <div className="border-b border-slate-200/80 pb-3 mb-3 shrink-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-mono uppercase">
                      ধাপ {stepIdx + 1} / 9
                    </span>
                    <span className="text-[10.5px] font-black text-slate-500 flex items-center gap-1">
                      ✅ {stepTotal} সম্পন্ন
                    </span>
                  </div>
                  <h3 className="font-bold text-[12.5px] text-slate-800 leading-tight block truncate" title={meta.name}>
                    {meta.label}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{meta.desc}</p>
                </div>

                {/* Candidate Cards List in Step */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs select-none">
                  {candidatesInThisStep.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <span className="text-xl opacity-40">📂</span>
                      <p className="text-[10.5px] text-slate-400 font-medium mt-1">কোনো ক্যান্ডিডেট নেই</p>
                    </div>
                  ) : (
                    candidatesInThisStep.map(candidate => {
                      const stepData = candidate.visaSteps?.find(s => s.key === meta.key);
                      return (
                        <div 
                          key={candidate.id} 
                          className="bg-white p-3 border border-slate-150 rounded-xl shadow-xs hover:shadow-md hover:border-indigo-200 transition space-y-2 group"
                        >
                          <div className="flex justify-between items-start gap-1">
                            <div className="min-w-0">
                              <h4 className="font-black text-[11.5px] text-slate-800 truncate group-hover:text-indigo-600 transition">
                                {candidate.candidateName}
                              </h4>
                              <p className="text-[9.5px] text-slate-400 font-mono font-semibold mt-0.5">
                                🛂 {candidate.passportNumber}
                              </p>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider shrink-0 ${
                              stepData?.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              stepData?.status === 'Processing' ? 'bg-blue-50 text-blue-700 border border-blue-100 animate-pulse' :
                              stepData?.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              {stepData?.status || 'Pending'}
                            </span>
                          </div>

                          {/* Quick Step info */}
                          {(stepData?.date || stepData?.staffName) && (
                            <div className="grid grid-cols-2 gap-1.5 text-[8.5px] text-slate-400 border-t border-slate-100 pt-1.5 font-bold">
                              {stepData.date && <p className="truncate">📅 {stepData.date}</p>}
                              {stepData.staffName && <p className="truncate text-right">🧑‍💻 {stepData.staffName.split(' ')[0]}</p>}
                            </div>
                          )}

                          {stepData?.adminNotes && (
                            <p className="text-[9px] bg-slate-50 p-1 rounded text-slate-500 truncate italic">
                              "{stepData.adminNotes}"
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={() => openStepEditor(candidate.id, meta.key)}
                            className="w-full py-1 text-center bg-slate-50 hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 rounded-lg text-[9.5px] font-bold text-indigo-600 cursor-pointer transition flex items-center justify-center gap-1"
                          >
                            <span>📝 আপডেট করুন</span>
                            <ChevronRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CENTRAL PROFILE REGISTRY VIEW (A searchable database list with overall step progression mapped horizontally) */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" id="visa-steps-registry-layout">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9.5px] tracking-wider">
                  <th className="py-3.5 px-4 font-black">আবেদনকারী / ক্যান্ডিডেট</th>
                  <th className="py-3.5 px-4 font-black">পাসপোর্ট নম্বর</th>
                  <th className="py-3.5 px-4 font-black text-center">সম্পন্ন ধাপসমূহ (Progress)</th>
                  <th className="py-3.5 px-4 font-black">বর্তমান একটিভ ধাপ</th>
                  <th className="py-3.5 px-4 font-black text-center font-black">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-3xl opacity-40">📂</span>
                        <p className="text-xs font-semibold text-slate-500 mt-2">কোনো ক্যান্ডিডেট প্রোফাইল খুঁজে পাওয়া যায়নি।</p>
                        <p className="text-[10px] text-slate-400 mt-1">সার্চ ফিল্টার সংশোধন বা যাচাই করুন।</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map(candidate => {
                    const completedStepsCount = candidate.visaSteps?.filter(s => s.status === 'Completed').length || 0;
                    const progressPercent = Math.round((completedStepsCount / 9) * 100);
                    
                    // Find the current active step (the first one with 'Processing' or 'Pending')
                    const currentActiveStep = candidate.visaSteps?.find(s => s.status === 'Processing') || 
                                              candidate.visaSteps?.find(s => s.status === 'Pending') ||
                                              candidate.visaSteps?.[8]; // default to last step if all done

                    const currentActiveMeta = VISA_STEPS_META.find(m => m.key === currentActiveStep?.key);

                    return (
                      <tr key={candidate.id} className="hover:bg-slate-50/50 transition">
                        {/* Name Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold font-mono">
                              {candidate.candidateName.charAt(0)}
                            </span>
                            <div>
                              <p className="font-black text-slate-800 text-[11.5px]">{candidate.candidateName}</p>
                              <p className="text-[9.5px] text-slate-400 font-mono">{candidate.candidateEmail}</p>
                            </div>
                          </div>
                        </td>

                        {/* Passport Column */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-700 bg-slate-100 py-1 px-2 rounded-md text-[10.5px]">
                            {candidate.passportNumber}
                          </span>
                        </td>

                        {/* Progress Stepper Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col items-center max-w-xs mx-auto space-y-1.5">
                            <div className="flex items-center gap-1 w-full justify-between text-[9px] font-bold text-slate-400 px-1 font-mono">
                              <span>অগ্রগতি: {completedStepsCount}/9 ধাপ</span>
                              <span className="text-indigo-600">{progressPercent}%</span>
                            </div>
                            
                            {/* Horizontal 9 Dots Progression Meter */}
                            <div className="flex items-center gap-1 w-full justify-between">
                              {VISA_STEPS_META.map((meta, idx) => {
                                const stepState = candidate.visaSteps?.find(s => s.key === meta.key);
                                const isCompleted = stepState?.status === 'Completed';
                                const isProcessing = stepState?.status === 'Processing';
                                const isRejected = stepState?.status === 'Rejected';

                                return (
                                  <div 
                                    key={meta.key}
                                    title={`${idx + 1}. ${meta.label} (${stepState?.status || 'Pending'})`}
                                    className={`h-2.5 flex-1 rounded-full border transition-all duration-300 cursor-pointer ${
                                      isCompleted ? 'bg-emerald-500 border-emerald-500 shadow-xs shadow-emerald-500/10' :
                                      isProcessing ? 'bg-blue-500 border-blue-500 animate-pulse' :
                                      isRejected ? 'bg-rose-500 border-rose-500' :
                                      'bg-slate-200 border-slate-200/80'
                                    }`}
                                    onClick={() => openStepEditor(candidate.id, meta.key)}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </td>

                        {/* Active Step Column */}
                        <td className="py-3.5 px-4">
                          {currentActiveStep ? (
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-800 text-[11px] block">
                                {currentActiveMeta?.label || currentActiveStep.name}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-black uppercase tracking-wider inline-block ${
                                currentActiveStep.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                                currentActiveStep.status === 'Processing' ? 'bg-blue-50 text-blue-700 animate-pulse' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {currentActiveStep.status}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No Active Step</span>
                          )}
                        </td>

                        {/* Action Column */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => openStepEditor(candidate.id, 'mofa')}
                            className="py-1 px-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-150 hover:border-indigo-600 rounded-xl text-[10px] font-black cursor-pointer transition flex items-center gap-1 mx-auto"
                          >
                            <span>⚙️ ম্যানেজ ও আপডেট</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STEP MANAGER DETAILED SIDE OVERLAY MODAL */}
      {selectedPkgId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedPkgId(null)}
          id="step-editor-modal-overlay"
        >
          <div 
            className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-in relative border-l border-slate-100"
            onClick={(e) => e.stopPropagation()}
            id="step-editor-modal-body"
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 shrink-0 flex justify-between items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
              <div className="z-10 space-y-1">
                <span className="text-[8.5px] bg-indigo-500/25 text-indigo-300 font-black tracking-wider uppercase px-2 py-0.5 rounded border border-indigo-500/20">
                  ভিসা স্টেপ ম্যানেজার
                </span>
                <h3 className="font-black text-sm tracking-tight pt-1">
                  {activeCandidates.find(p => p.id === selectedPkgId)?.candidateName}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold font-mono">
                  পাসপোর্ট: {activeCandidates.find(p => p.id === selectedPkgId)?.passportNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPkgId(null)}
                className="text-slate-400 hover:text-white bg-slate-800/60 p-1 rounded-xl transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Steps Horizontal Navigation Inside Drawer */}
            <div className="bg-slate-50 border-b border-slate-150 p-2.5 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
              {VISA_STEPS_META.map((stepMeta, idx) => {
                const pkg = activeCandidates.find(p => p.id === selectedPkgId);
                const stepState = pkg?.visaSteps?.find(s => s.key === stepMeta.key);
                const isSelected = selectedStepKey === stepMeta.key;
                
                return (
                  <button
                    key={stepMeta.key}
                    type="button"
                    onClick={() => openStepEditor(selectedPkgId, stepMeta.key)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-tight shrink-0 transition flex items-center gap-1 cursor-pointer border ${
                      isSelected 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                        : stepState?.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-150 hover:bg-emerald-100/60'
                          : stepState?.status === 'Processing'
                            ? 'bg-blue-50 text-blue-800 border-blue-150 animate-pulse'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-mono">{idx + 1}.</span>
                    <span>{stepMeta.label.split(' ')[0]}</span>
                    {stepState?.status === 'Completed' && '✓'}
                  </button>
                );
              })}
            </div>

            {/* Modal Form Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Selected Step Banner Info */}
              <div className="bg-slate-50/80 border border-slate-150 rounded-xl p-4 space-y-1 relative">
                <div className="absolute right-3 top-3 text-2xl opacity-15">🛂</div>
                <h4 className="font-black text-slate-800 text-[11.5px] flex items-center gap-1.5">
                  <span>{VISA_STEPS_META.find(m => m.key === selectedStepKey)?.name}</span>
                  <span className="text-[9.5px] text-slate-400 font-normal">({VISA_STEPS_META.find(m => m.key === selectedStepKey)?.label})</span>
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  {VISA_STEPS_META.find(m => m.key === selectedStepKey)?.desc}
                </p>
              </div>

              {/* Form Input Controls */}
              <div className="space-y-4">
                {/* 1. Status Select */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">
                    স্ট্যাটাস (Status)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['Pending', 'Processing', 'Completed', 'Rejected'] as const).map((statusVal) => {
                      const isSelected = formStatus === statusVal;
                      return (
                        <button
                          key={statusVal}
                          type="button"
                          onClick={() => setFormStatus(statusVal)}
                          className={`py-2 text-center rounded-xl font-bold border transition cursor-pointer text-[10px] ${
                            isSelected
                              ? statusVal === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' :
                                statusVal === 'Processing' ? 'bg-blue-500 border-blue-500 text-white shadow-sm' :
                                statusVal === 'Rejected' ? 'bg-rose-500 border-rose-500 text-white shadow-sm' :
                                'bg-slate-700 border-slate-700 text-white shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {statusVal}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Date Input */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>আপডেট বা সম্পন্ন হওয়ার তারিখ (Update Date)</span>
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:bg-white focus:outline-indigo-600 transition"
                  />
                </div>

                {/* 3. Assigned Staff Name */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>দায়িত্বপ্রাপ্ত স্টাফ বা কর্মকর্তা (Assigned Officer)</span>
                  </label>
                  <input
                    type="text"
                    value={formStaff}
                    onChange={(e) => setFormStaff(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:bg-white focus:outline-indigo-600 transition"
                  />
                </div>

                {/* 4. Document Reference or File Name */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>সংযুক্ত নথি বা স্ক্যান কপি ফাইল নাম (Scan File Ref)</span>
                  </label>
                  <input
                    type="text"
                    value={formDocUrl}
                    onChange={(e) => setFormDocUrl(e.target.value)}
                    placeholder="যেমন: mofa_approved_scan.pdf"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:bg-white focus:outline-indigo-600 transition"
                  />
                </div>

                {/* 5. Official Notes / Feedback */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">
                    অফিসিয়াল অভ্যন্তরীণ মন্তব্য ও আপডেট বিবরণী (Internal Admin Notes)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="যেমন: পররাষ্ট্র মন্ত্রণালয় থেকে ক্যান্ডিডেটের মূল পুলিশ ক্লিয়ারেন্স ও শিক্ষাগত সার্টিফিকেট সফলভাবে ভেরিফিকেশন সিল প্রাপ্ত হয়েছে।"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:bg-white focus:outline-indigo-600 transition"
                  />
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 flex gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedPkgId(null)}
                className="flex-1 py-2 text-center border border-slate-250 text-slate-600 bg-white hover:bg-slate-100 rounded-xl font-bold cursor-pointer transition text-xs"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleSaveStep}
                className="flex-1 py-2 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-indigo-600/10 transition text-xs"
              >
                সংরক্ষণ করুন (Save Step)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
