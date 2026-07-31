import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit3, Save, Check, X, AlertCircle, TrendingUp, User, Calendar, 
  DollarSign, FileText, CheckCircle2, Clock, ArrowRight, Search, Building2, 
  Bell, Download, SlidersHorizontal, Sparkles, Calculator, Briefcase, 
  ShieldCheck, RefreshCw, FileSpreadsheet, Printer, Eye, Settings2, Info,
  ChevronUp, ChevronDown, Copy, Settings, CheckSquare, MessageSquare, Mail, 
  AlertTriangle, FileUp, Globe, Lock, ListFilter, PlayCircle, EyeOff, CheckSquare2
} from 'lucide-react';
import { ItalyPackageApplication, VisaProcessStep, PaymentStep } from '../../mockData';
import { 
  CustomVisaStepTemplate, VisaProcessTemplate, SystemNotification, NotificationTemplate, 
  SystemSettings, DEFAULT_SETTINGS, PRESET_NOTIFICATION_TEMPLATES, calculateCandidateBalance 
} from '../../types/visa';
import { StaffMember } from '../AdminPanel';

// ==========================================
// 1. DASHBOARD SUB-TAB
// ==========================================
interface DashboardSubTabProps {
  approvedCandidates: ItalyPackageApplication[];
  steps: CustomVisaStepTemplate[];
  paymentConfig: any;
  notifications: SystemNotification[];
  pendingPaymentsCount: number;
  totalVisaSteps: number;
  activeStepsCount: number;
  completedStepsCount: number;
  totalContractAmountGlobal: number;
  totalPaidGlobal: number;
  totalDueGlobal: number;
  setSubTab: (tab: any) => void;
  triggerNotification: (title: string, msg: string, type: any, recipient: any) => void;
  addLog: (user: string, action: string, type?: string) => void;
  activeStaff: StaffMember;
}

export function VisaDashboardSubTab({
  approvedCandidates,
  steps,
  paymentConfig,
  notifications,
  pendingPaymentsCount,
  totalVisaSteps,
  activeStepsCount,
  completedStepsCount,
  totalContractAmountGlobal,
  totalPaidGlobal,
  totalDueGlobal,
  setSubTab,
  triggerNotification,
  addLog,
  activeStaff
}: DashboardSubTabProps) {
  
  // Local checklist for "Today's Tasks"
  const [tasks, setTasks] = useState([
    { id: 't1', text: 'ক্যান্ডিডেট কামাল উদ্দিনের পাসপোর্ট ভেরিফিকেশন', completed: false, tag: 'Passport' },
    { id: 't2', text: 'সাইদ আহম্মেদের অফার লেটার সংগ্রহ চেক', completed: true, tag: 'Offer Letter' },
    { id: 't3', text: 'মোহাম্মদ আলীর ৩য় কিস্তি পেমেন্ট ভেরিফাই', completed: false, tag: 'Finance' },
    { id: 't4', text: 'এজেন্সি "Euro Travels" এর ক্যান্ডিডেট নুলা ওস্তা ডকুমেন্ট ভেরিফিকেশন', completed: false, tag: 'Work Permit' }
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.completed) {
          addLog(activeStaff.name, `আজকের কার্যতালিকা "${t.text}" সম্পন্ন করেছেন।`, 'success');
        }
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;

  // Calculate the 12 requested Enterprise Dashboard Metrics
  const totalCandidates = approvedCandidates.length;
  const totalApplications = approvedCandidates.length; // Active visa process applications
  
  const totalPendingSteps = approvedCandidates.reduce((sum, c) => {
    return sum + (c.visaSteps?.filter(s => s.status === 'Pending' || s.status === 'Processing').length || 0);
  }, 0);

  const totalCompletedSteps = approvedCandidates.reduce((sum, c) => {
    return sum + (c.visaSteps?.filter(s => s.status === 'Completed').length || 0);
  }, 0);

  const pendingDocVerification = approvedCandidates.reduce((sum, c) => {
    return sum + (c.visaSteps?.filter(s => s.status === 'Processing').length || 0);
  }, 0);

  const pendingAdminApprovals = pendingPaymentsCount + pendingDocVerification;

  const readyForSubmission = approvedCandidates.filter(c => {
    const subStep = c.visaSteps?.find(s => s.key === 'visa_submission');
    return subStep && (subStep.status === 'Pending' || subStep.status === 'Processing');
  }).length;

  const visaApprovedCount = approvedCandidates.filter(c => {
    const appStep = c.visaSteps?.find(s => s.key === 'visa_approved' || s.key === 'visa_printed');
    return appStep && appStep.status === 'Completed';
  }).length;

  const flightPendingCount = approvedCandidates.filter(c => {
    const ticketStep = c.visaSteps?.find(s => s.key === 'air_ticket');
    const visaOk = c.visaSteps?.find(s => s.key === 'visa_approved' || s.key === 'visa_printed')?.status === 'Completed';
    return visaOk && ticketStep && ticketStep.status !== 'Completed';
  }).length;

  const departedCount = approvedCandidates.filter(c => {
    const depStep = c.visaSteps?.find(s => s.key === 'departure');
    return depStep && depStep.status === 'Completed';
  }).length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Dynamic 12 Grid Analytics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {/* Card 1: Total Candidates */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition">
            <User className="w-12 h-12 text-white" />
          </div>
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">👥 মোট ক্যান্ডিডেট</span>
          <div className="mt-2">
            <strong className="text-lg font-black text-white">{totalCandidates} জন</strong>
            <p className="text-[8.5px] text-slate-500">Total Candidates</p>
          </div>
        </div>
        
        {/* Card 2: Total Visa Applications */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition">
            <FileText className="w-12 h-12 text-indigo-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">📄 মোট ভিসা আবেদন</span>
          <div className="mt-2">
            <strong className="text-lg font-black text-indigo-400">{totalApplications} টি</strong>
            <p className="text-[8.5px] text-slate-500">Visa Applications</p>
          </div>
        </div>

        {/* Card 3: Pending Steps */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition">
            <Clock className="w-12 h-12 text-amber-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">⏳ অপেক্ষমাণ ধাপসমূহ</span>
          <div className="mt-2">
            <strong className="text-lg font-black text-amber-400">{totalPendingSteps} টি</strong>
            <p className="text-[8.5px] text-slate-500">Pending Steps</p>
          </div>
        </div>

        {/* Card 4: Completed Steps */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">✅ সম্পন্ন ধাপসমূহ</span>
          <div className="mt-2">
            <strong className="text-lg font-black text-emerald-400">{totalCompletedSteps} টি</strong>
            <p className="text-[8.5px] text-slate-500">Completed Steps</p>
          </div>
        </div>

        {/* Card 5: Total Visa Revenue */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition">
            <DollarSign className="w-12 h-12 text-emerald-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">💰 মোট চুক্তি রেভিনিউ</span>
          <div className="mt-2">
            <strong className="text-sm font-black text-white">৳{totalContractAmountGlobal.toLocaleString()}</strong>
            <p className="text-[8.5px] text-emerald-500/80">Total Visa Revenue</p>
          </div>
        </div>

        {/* Card 6: Pending Payments */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition">
            <Calculator className="w-12 h-12 text-rose-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">💳 বকেয়া পেমেন্ট</span>
          <div className="mt-2">
            <strong className="text-sm font-black text-rose-400">৳{totalDueGlobal.toLocaleString()}</strong>
            <p className="text-[8.5px] text-rose-500/85">Pending Payments</p>
          </div>
        </div>

        {/* Card 7: Pending Document Verification */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition">
            <FileUp className="w-12 h-12 text-blue-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">📑 ডকুমেন্ট ভেরিফিকেশন</span>
          <div className="mt-2">
            <strong className="text-lg font-black text-blue-400">{pendingDocVerification} টি ফাইল</strong>
            <p className="text-[8.5px] text-slate-500">Pending Documents</p>
          </div>
        </div>

        {/* Card 8: Pending Admin Approvals */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition">
            <ShieldCheck className="w-12 h-12 text-orange-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">✔ এডমিন এপ্রুভাল পেন্ডিং</span>
          <div className="mt-2">
            <strong className="text-lg font-black text-orange-400">{pendingAdminApprovals} টি</strong>
            <p className="text-[8.5px] text-slate-500">Pending Approvals</p>
          </div>
        </div>

        {/* Card 9: Ready for Visa Submission */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition">
            <ArrowRight className="w-12 h-12 text-purple-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">✈ ভিসা সাবমিশন রেডি</span>
          <div className="mt-2">
            <strong className="text-lg font-black text-purple-400">{readyForSubmission} জন</strong>
            <p className="text-[8.5px] text-slate-500">Ready for Embassy</p>
          </div>
        </div>

        {/* Card 10: Visa Approved */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition">
            <Sparkles className="w-12 h-12 text-emerald-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">🛂 ভিসা অনুমোদিত</span>
          <div className="mt-2">
            <strong className="text-lg font-black text-emerald-400">{visaApprovedCount} জন</strong>
            <p className="text-[8.5px] text-slate-500">Visa Approved</p>
          </div>
        </div>

        {/* Card 11: Flight Ticket Pending */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition">
            <Printer className="w-12 h-12 text-sky-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">🎫 ফ্লাইট টিকিট পেন্ডিং</span>
          <div className="mt-2">
            <strong className="text-lg font-black text-sky-400">{flightPendingCount} জন</strong>
            <p className="text-[8.5px] text-slate-500">Flight Ticket Pending</p>
          </div>
        </div>

        {/* Card 12: Candidate Departed */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition">
            <Globe className="w-12 h-12 text-indigo-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">🌍 ফ্লাইট ও ডিপার্চার সম্পন্ন</span>
          <div className="mt-2">
            <strong className="text-lg font-black text-indigo-400">{departedCount} জন</strong>
            <p className="text-[8.5px] text-slate-500">Candidate Departed</p>
          </div>
        </div>
      </div>

      {/* Main Contents Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column: Live Activity Stream and Statistics Visualization */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Custom SVG Visualization Chart for Finance */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                📊 আর্থিক সংগ্রহ ও বকেয়ার বিবরণী (Revenue Collection Analytics)
              </h3>
              <span className="text-[9px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded font-mono">BDT</span>
            </div>
            
            {/* Visual Mini Chart purely in HTML/CSS/SVG */}
            <div className="flex flex-col md:flex-row items-center gap-6 py-2">
              <div className="flex-1 w-full space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>সংগৃহীত পেমেন্ট (Collected Cash)</span>
                    <span className="font-bold text-emerald-400">
                      {totalContractAmountGlobal > 0 ? Math.round((totalPaidGlobal / totalContractAmountGlobal) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${totalContractAmountGlobal > 0 ? (totalPaidGlobal / totalContractAmountGlobal) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>বকেয়া পরিমাণ (Outstanding Due)</span>
                    <span className="font-bold text-rose-400">
                      {totalContractAmountGlobal > 0 ? Math.round((totalDueGlobal / totalContractAmountGlobal) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${totalContractAmountGlobal > 0 ? (totalDueGlobal / totalContractAmountGlobal) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Side legend metrics */}
              <div className="grid grid-cols-2 gap-3 shrink-0 bg-slate-900/60 p-3 rounded-xl border border-slate-850 text-[10px] w-full md:w-auto">
                <div className="space-y-0.5">
                  <span className="text-slate-400 block">কলেকশন হার:</span>
                  <strong className="text-emerald-400 font-bold">
                    ৳{totalPaidGlobal.toLocaleString()} BDT
                  </strong>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 block">আউটস্ট্যান্ডিং:</span>
                  <strong className="text-rose-400 font-bold">
                    ৳{totalDueGlobal.toLocaleString()} BDT
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Stream */}
          <div className="bg-slate-950/50 border border-slate-850 rounded-2xl p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                📈 ক্যান্ডিডেট স্ট্যাটাস অগ্রগতি ও রিয়েল-টাইম ট্র্যাকার স্ট্রিম (Active Timeline Stream)
              </h3>
              <span className="text-[8px] text-emerald-400 font-mono animate-pulse flex items-center gap-1">
                ● LIVE MONITOR
              </span>
            </div>
            
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2">
              {approvedCandidates.length > 0 ? (
                approvedCandidates.map((cand) => {
                  const bal = calculateCandidateBalance(cand, steps, paymentConfig);
                  const completedSteps = cand.visaSteps?.filter(s => s.status === 'Completed').length || 0;
                  const progressPct = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;
                  
                  return (
                    <div key={cand.id} className="p-3 rounded-xl bg-slate-950 border border-slate-900 flex justify-between items-center text-[11px] hover:bg-slate-900/40 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                          {cand.candidateName[0]}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{cand.candidateName}</span>
                            <span className="text-[9px] bg-slate-900 text-indigo-400 px-1.5 py-0.2 rounded font-mono">
                              {cand.packageName}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono">🎫 {cand.passportNumber} • 🏢 {cand.company || 'Italy Sporsor'}</span>
                        </div>
                      </div>

                      {/* Progress visual gauge bar */}
                      <div className="hidden md:flex flex-col items-center gap-1">
                        <span className="text-[9px] text-slate-400">ধাপ অগ্রগতি ({completedSteps}/{steps.length})</span>
                        <div className="w-28 bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all" 
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="text-right space-y-0.5">
                        <span className="font-black text-emerald-400 block">৳{bal.totalPaid.toLocaleString()}</span>
                        <span className="text-[9px] text-rose-400 font-bold block">বকেয়া ৳{bal.totalDue.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[11px] text-slate-500 text-center py-6">কোনো অনুমোদিত ক্যান্ডিডেট ডেটা পাওয়া যায়নি।</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Tasks, Reminders & Deadlines alerts */}
        <div className="space-y-5">
          
          {/* Today's Tasks Interactive Panel */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-3 text-[11px]">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                📅 আজকের অ্যাকশন আইটেম ({completedTasksCount}/{tasks.length})
              </h3>
              <span className="text-[9px] text-slate-400 font-bold bg-slate-900 px-1.5 py-0.2 rounded">Tasks</span>
            </div>
            
            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {tasks.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => toggleTask(t.id)} 
                  className={`p-2.5 rounded-xl border cursor-pointer transition flex items-start gap-2.5 select-none ${
                    t.completed 
                      ? 'bg-slate-900/40 border-slate-900/60 opacity-50' 
                      : 'bg-slate-900 border-slate-850 hover:bg-slate-850 hover:border-slate-800'
                  }`}
                >
                  <span className={`p-0.5 rounded border mt-0.5 transition ${
                    t.completed ? 'bg-emerald-500 border-emerald-600 text-slate-950' : 'border-slate-700 text-transparent'
                  }`}>
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  
                  <div className="space-y-0.5 flex-1">
                    <span className={`text-[10.5px] leading-relaxed block ${t.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                      {t.text}
                    </span>
                    <span className="text-[8px] bg-slate-950 text-indigo-400 px-1.5 py-0.1 rounded font-bold uppercase">
                      #{t.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines countdown warning panel */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-3 text-[11px]">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                ⚠️ আসন্ন সময়সীমা ও এলার্টস (Upcoming Deadlines)
              </h3>
              <span className="text-[9px] text-rose-400 font-black flex items-center gap-0.5 animate-pulse">
                <AlertTriangle className="w-3 h-3 text-rose-400" /> ALERT
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-850/80 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-200 block">কামাল উদ্দিন - ভিসা সাবমিশন ফি</span>
                  <span className="text-[9px] text-rose-400 font-mono">শেষ তারিখ: ১২ জুলাই, ২০২৬ (৬ দিন বাকি)</span>
                </div>
                <button onClick={() => setSubTab('calc')} className="p-1 bg-slate-950 text-slate-400 hover:text-white rounded border border-slate-800">
                  <Eye className="w-3 h-3" />
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-850/80 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-200 block">সাইদ আহম্মেদের অফার লেটার আপলোড</span>
                  <span className="text-[9px] text-amber-400 font-mono">টার্গেট: ২০ জুলাই, ২০২৬ (১৪ দিন বাকি)</span>
                </div>
                <button onClick={() => setSubTab('agency')} className="p-1 bg-slate-950 text-slate-400 hover:text-white rounded border border-slate-800">
                  <Eye className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


// ==========================================
// 2. PROCESS TEMPLATES SUB-TAB
// ==========================================
interface TemplatesSubTabProps {
  templates: VisaProcessTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<VisaProcessTemplate[]>>;
  approvedCandidates: ItalyPackageApplication[];
  onUpdateItalyPackage: (pkg: ItalyPackageApplication) => void;
  addLog: (user: string, action: string, type?: string) => void;
  activeStaff: StaffMember;
  triggerNotification: (title: string, msg: string, type: any, recipient: any) => void;
  steps: CustomVisaStepTemplate[];
}

export function VisaTemplatesSubTab({
  templates,
  setTemplates,
  approvedCandidates,
  onUpdateItalyPackage,
  addLog,
  activeStaff,
  triggerNotification,
  steps
}: TemplatesSubTabProps) {
  
  const [isCreating, setIsCreating] = useState(false);
  const [tplCountry, setTplCountry] = useState('Italy');
  const [tplName, setTplName] = useState('');
  const [tplDesc, setTplDesc] = useState('');
  const [selectedCandidateForApply, setSelectedCandidateForApply] = useState('');
  const [selectedTemplateForApply, setSelectedTemplateForApply] = useState('');

  // Preset of 11 professional visa steps requested by the user
  const DEFAULT_VISA_STEPS_PRESET = [
    { key: 'passport_submit', name: 'Passport Submit', label: 'পাসপোর্ট জমাদান', order: 1, amount: 10000, dueDate: '7 Days', description: 'মূল পাসপোর্ট ও ৩ কপি ল্যাব প্রিন্ট ছবি জমা দিতে হবে।', requiredDocs: 'Original Passport, Photo 3 copies', isPaymentRequired: true, agencyCanUpdate: true, statusOptions: 'Pending, Processing, Completed, Rejected' },
    { key: 'medical_test', name: 'Medical Test', label: 'মেডিকেল টেস্ট সম্পন্নকরণ', order: 2, amount: 8000, dueDate: '15 Days', description: 'অনুমোদিত মেডিকেল সেন্টারে গামকা বা নির্ধারিত মেডিকেল পরীক্ষা।', requiredDocs: 'Medical Slip, Registration copy', isPaymentRequired: true, agencyCanUpdate: true, statusOptions: 'Pending, Processing, Completed, Rejected' },
    { key: 'medical_fit_report', name: 'Medical Fitness', label: 'মেডিকেল ফিটনেস রিপোর্ট প্রাপ্তি', order: 3, amount: 0, dueDate: '20 Days', description: 'মেডিকেল টেস্টের ফলাফল ফিট বা আনফিট হওয়া নিশ্চিত করা।', requiredDocs: 'Medical Fitness Certificate / Report', isPaymentRequired: false, agencyCanUpdate: false, statusOptions: 'Pending, Processing, Medical Fit, Medical Unfit' },
    { key: 'mofa_attestation', name: 'MOFA Attestation', label: 'মুফা সত্যায়ন (MOFA)', order: 4, amount: 20000, dueDate: '30 Days', description: 'পররাষ্ট্র মন্ত্রণালয় (MOFA) থেকে ভিসা প্রসেসিং ডকুমেন্ট সত্যায়ন।', requiredDocs: 'MOFA Receipt or Attested Copy', isPaymentRequired: true, agencyCanUpdate: true, statusOptions: 'Pending, Processing, Completed, Rejected' },
    { key: 'embassy_submission', name: 'Embassy Submission', label: 'এম্বেসি ফাইল সাবমিশন', order: 5, amount: 12000, dueDate: '45 Days', description: 'এম্বেসি বা ভিসা সেন্টারে পাসপোর্ট এবং প্রয়োজনীয় কাগজপত্র জমা দান।', requiredDocs: 'Embassy Appointment Copy & Submission Receipt', isPaymentRequired: true, agencyCanUpdate: true, statusOptions: 'Pending, Processing, Completed, Rejected' },
    { key: 'embassy_decision', name: 'Embassy Decision', label: 'ভিসা অনুমোদন নিশ্চিতকরণ', order: 6, amount: 0, dueDate: '60 Days', description: 'এম্বেসি বা কনস্যুলেট হতে ভিসা অনুমোদন সিদ্ধান্ত প্রাপ্তি।', requiredDocs: 'Approved Passport scan / Visa Grant Copy', isPaymentRequired: false, agencyCanUpdate: false, statusOptions: 'Pending, Processing, Approved, Rejected' },
    { key: 'flight_booking', name: 'Flight Booking', label: 'ফ্লাইট বুকিং সম্পন্নকরণ', order: 7, amount: 40000, dueDate: '70 Days', description: 'নির্ধারিত এয়ারলাইন্সে ফ্লাইট টিকিট বুকিং করা।', requiredDocs: 'Flight Booking Confirmation PDF', isPaymentRequired: true, agencyCanUpdate: true, statusOptions: 'Pending, Processing, Completed, Rejected' },
    { key: 'flight_date', name: 'Flight Date', label: 'ফ্লাইটের তারিখ নির্ধারণ', order: 8, amount: 0, dueDate: '75 Days', description: 'ফ্লাইটের চূড়ান্ত তারিখ ও প্রস্থান সময়সূচি কনফার্ম করা।', requiredDocs: 'Flight Schedule Detail document', isPaymentRequired: false, agencyCanUpdate: false, statusOptions: 'Pending, Processing, Completed, Rejected' },
    { key: 'ticket_upload', name: 'Ticket Upload', label: 'বিমান টিকিট প্রস্তুতকরণ', order: 9, amount: 5000, dueDate: '80 Days', description: ' চূড়ান্ত বিমান টিকিট কপি সিস্টেমে আপলোড করা।', requiredDocs: 'E-Ticket scan copy PDF', isPaymentRequired: true, agencyCanUpdate: true, statusOptions: 'Pending, Processing, Completed, Rejected' },
    { key: 'passport_delivery', name: 'Passport Delivery', label: 'পাসপোর্ট ডেলিভারি ও রিলিজ', order: 10, amount: 2000, dueDate: '85 Days', description: 'ভিসা স্ট্যাম্পড পাসপোর্ট প্রার্থী বা এজেন্সির নিকট রিলিজ/ডেলিভারি।', requiredDocs: 'Delivery Slip', isPaymentRequired: true, agencyCanUpdate: true, statusOptions: 'Pending, Processing, Completed, Rejected' },
    { key: 'safe_arrival', name: 'Safe Arrival', label: 'গন্তব্যে নিরাপদ আগমন নিশ্চিতকরণ', order: 11, amount: 0, dueDate: '90 Days', description: 'বিদেশে পৌঁছানোর পর বোর্ডিং পাস ও এন্ট্রি স্ট্যাম্প স্ক্যান কপি আপলোড।', requiredDocs: 'Boarding Pass scan copy', isPaymentRequired: false, agencyCanUpdate: false, statusOptions: 'Pending, Processing, Completed, Arrived' }
  ];

  // Dynamic steps state for the draft template being created
  const [draftSteps, setDraftSteps] = useState<any[]>([]);

  // Local state for adding a custom step inside the workflow template draft
  const [newStepKey, setNewStepKey] = useState('');
  const [newStepName, setNewStepName] = useState('');
  const [newStepLabel, setNewStepLabel] = useState('');
  const [newStepAmount, setNewStepAmount] = useState(0);
  const [newStepDocs, setNewStepDocs] = useState('');
  const [newStepPayReq, setNewStepPayReq] = useState(true);
  const [newStepAgencyCanUpdate, setNewStepAgencyCanUpdate] = useState(true);
  const [newStepStatusOptions, setNewStepStatusOptions] = useState('Pending, Processing, Completed, Rejected');

  // Load defaults when creating template is opened
  React.useEffect(() => {
    if (isCreating) {
      setDraftSteps([...DEFAULT_VISA_STEPS_PRESET]);
      if (tplCountry) {
        setTplName(`${tplCountry} Work Visa Process Workflow`);
        setTplDesc(`Comprehensive multi-step visa processing template for ${tplCountry}.`);
      }
    }
  }, [isCreating, tplCountry]);

  const handleAddDraftStep = () => {
    if (!newStepKey.trim() || !newStepLabel.trim()) {
      alert('ধাপের আইডি (Key) এবং নাম (Bangla) প্রদান করা আবশ্যক!');
      return;
    }

    const orderNum = draftSteps.length + 1;
    const newStep = {
      key: newStepKey.trim().toLowerCase().replace(/\s+/g, '_'),
      name: newStepName.trim() || newStepKey,
      label: newStepLabel.trim(),
      order: orderNum,
      amount: Number(newStepAmount) || 0,
      dueDate: `${orderNum * 8} Days`,
      description: `প্রসেস ধাপ: ${newStepLabel.trim()}`,
      requiredDocs: newStepDocs.trim() || 'Required paperwork',
      isPaymentRequired: newStepPayReq,
      agencyCanUpdate: newStepAgencyCanUpdate,
      statusOptions: newStepStatusOptions.trim()
    };

    setDraftSteps([...draftSteps, newStep]);
    setNewStepKey('');
    setNewStepName('');
    setNewStepLabel('');
    setNewStepAmount(0);
    setNewStepDocs('');
    setNewStepPayReq(true);
    setNewStepAgencyCanUpdate(true);
  };

  const handleDeleteDraftStep = (idx: number) => {
    const updated = draftSteps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 }));
    setDraftSteps(updated);
  };

  const handleMoveDraftStep = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === draftSteps.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...draftSteps];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    // re-assign orders
    const finalSteps = updated.map((s, i) => ({ ...s, order: i + 1 }));
    setDraftSteps(finalSteps);
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplName.trim()) return;

    if (draftSteps.length === 0) {
      alert('টেমপ্লেটে অন্তত একটি ভিসা প্রসেস কিস্তি ধাপ যোগ করতে হবে!');
      return;
    }

    const newTpl: VisaProcessTemplate = {
      id: 'tpl_' + Date.now(),
      name: tplName,
      description: tplDesc || `${tplCountry} ভিসা প্রসেসিং রুট।`,
      country: tplCountry,
      status: 'Active',
      steps: [...draftSteps]
    };

    setTemplates(prev => [...prev, newTpl]);
    setIsCreating(false);
    setTplName('');
    setTplDesc('');
    setDraftSteps([]);
    addLog(activeStaff.name, `নতুন দেশভিত্তিক ভিসা প্রসেস টেমপ্লেট "${newTpl.name}" (${tplCountry}) তৈরি করেছেন।`, 'success');
    alert(`"${newTpl.name}" টেমপ্লেটটি ${draftSteps.length} টি ধাপ ও কনফিগারেশন সহ সফলভাবে সংরক্ষিত হয়েছে!`);
  };

  const handleCopyTemplate = (tplId: string) => {
    const tpl = templates.find(t => t.id === tplId);
    if (!tpl) return;

    const copy: VisaProcessTemplate = {
      id: 'tpl_copy_' + Date.now(),
      name: `${tpl.name} (Copy)`,
      description: tpl.description,
      country: tpl.country || 'Italy',
      status: 'Active',
      steps: tpl.steps.map(s => ({ ...s }))
    };

    setTemplates(prev => [...prev, copy]);
    addLog(activeStaff.name, `ভিসা প্রসেস টেমপ্লেট "${tpl.name}" কপি করেছেন।`, 'info');
    alert(`"${tpl.name}" এর ডুপ্লিকেট টেমপ্লেট সফলভাবে তৈরি হয়েছে!`);
  };

  const handleToggleTemplateStatus = (tplId: string) => {
    setTemplates(prev => prev.map(t => {
      if (t.id === tplId) {
        const newStatus = t.status === 'Active' ? 'Archived' : 'Active';
        addLog(activeStaff.name, `টেমপ্লেট "${t.name}" স্ট্যাটাস পরিবর্তন করে "${newStatus}" করেছেন।`, 'warning');
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleApplyTemplate = () => {
    if (!selectedCandidateForApply || !selectedTemplateForApply) {
      alert('অনুগ্রহ করে ক্যান্ডিডেট এবং টেমপ্লেট সিলেক্ট করুন।');
      return;
    }

    const cand = approvedCandidates.find(c => c.id === selectedCandidateForApply);
    const tpl = templates.find(t => t.id === selectedTemplateForApply);

    if (!cand || !tpl) return;

    // Apply country template steps to candidate
    const mappedSteps: VisaProcessStep[] = tpl.steps.map(s => ({
      key: s.key,
      name: s.label || s.name,
      status: 'Pending',
      date: '',
      staffName: '',
      requiredDocs: s.requiredDocs || '',
      isPaymentRequired: s.isPaymentRequired !== false,
      agencyCanUpdate: s.agencyCanUpdate !== false,
      amount: s.amount || 0
    }));

    const mappedPayments: PaymentStep[] = tpl.steps.map(s => ({
      key: s.key,
      name: s.label || s.name,
      amount: s.amount || 0,
      status: 'Unpaid',
      paidAmount: 0,
      dueDate: s.dueDate || 'Immediate',
      agencyCanUpdate: s.agencyCanUpdate !== false
    }));

    // Recalculate totalAmount based on template steps sum
    const totalAmountSum = tpl.steps.reduce((sum, s) => sum + (s.amount || 0), 0);

    const updated: ItalyPackageApplication = {
      ...cand,
      country: tpl.country || 'Italy',
      visaSteps: mappedSteps,
      paymentSteps: mappedPayments,
      totalAmount: totalAmountSum,
      dueAmount: totalAmountSum - (cand.paidAmount || 0),
      notes: `Applied dynamic ${tpl.country || 'Italy'} workflow: ${tpl.name}. ${cand.notes || ''}`
    };

    onUpdateItalyPackage(updated);
    addLog(activeStaff.name, `ক্যান্ডিডেট "${cand.candidateName}" এর ফাইলে "${tpl.country}" দেশের ভিসা প্রসেস টেমপ্লেট "${tpl.name}" প্রয়োগ করেছেন।`, "success");
    triggerNotification("ভিসা প্রসেস ম্যাপ করা হয়েছে", `আপনার অ্যাকাউন্টে ${tpl.country} দেশের "${tpl.name}" প্রসেস ও কিস্তি ম্যাপ করা হয়েছে।`, "success", "Candidate");
    alert(`ক্যান্ডিডেট "${cand.candidateName}" এর ফাইলে "${tpl.country}" দেশের "${tpl.name}" টেমপ্লেটের সকল ${mappedSteps.length} টি কিস্তি ধাপ ও পেমেন্ট কনফিগারেশন সফলভাবে সেট করা হয়েছে!`);
    setSelectedCandidateForApply("");
    setSelectedTemplateForApply("");
  };

  const countriesList = [
    { code: 'Italy', label: 'Italy (ইতালি)' },
    { code: 'Saudi Arabia', label: 'Saudi Arabia (সৌদি আরব)' },
    { code: 'Germany', label: 'Germany (জার্মানি)' },
    { code: 'Romania', label: 'Romania (রোমানিয়া)' },
    { code: 'Oman', label: 'Oman (ওমান)' },
    { code: 'Dubai', label: 'Dubai / UAE (দুবাই / ইউএই)' },
    { code: 'United Kingdom', label: 'United Kingdom (যুক্তরাজ্য)' },
    { code: 'Malaysia', label: 'Malaysia (মালয়েশিয়া)' },
    { code: 'Kuwait', label: 'Kuwait (কুয়েত)' },
    { code: 'Qatar', label: 'Qatar (কাতার)' }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-[11px]">
      {/* Template Application Panel */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">
            ✨ ক্যান্ডিডেট ফাইলে দেশভিত্তিক ওয়ার্কফ্লো টেমপ্লেট ম্যাপ করুন (Map Country-wise Workflow)
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-[9.5px] text-slate-400 font-bold block">১. ক্যান্ডিডেট সিলেক্ট করুন:</label>
            <select 
              value={selectedCandidateForApply} 
              onChange={(e) => setSelectedCandidateForApply(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-[11px] focus:outline-none font-bold"
            > 
              <option value="">-- ক্যান্ডিডেট সিলেক্ট করুন --</option>
              {approvedCandidates.map(c => (
                <option key={c.id} value={c.id}>{c.candidateName} - {c.passportNumber} ({c.country || 'No Country yet'})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9.5px] text-slate-400 font-bold block">২. ওয়ার্কফ্লো টেমপ্লেট সিলেক্ট করুন (দেশভিত্তিক):</label>
            <select 
              value={selectedTemplateForApply} 
              onChange={(e) => setSelectedTemplateForApply(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-[11px] focus:outline-none font-bold"
            > 
              <option value="">-- ওয়ার্কফ্লো টেমপ্লেট সিলেক্ট করুন --</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.country || 'Italy'}) [{t.steps?.length || 0} Steps]</option>
              ))}
            </select>
          </div>

          <button 
            type="button" 
            onClick={handleApplyTemplate}
            className="py-2.5 px-4 bg-indigo-500 text-slate-950 font-black rounded-xl hover:bg-indigo-400 hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> ম্যাপ করুন ও কিস্তি সেট করুন
          </button>
        </div>
      </div>

      {/* Templates List Management */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">
            📋 দেশভিত্তিক ভিসা প্রসেস টেমপ্লেট কনফিগারেশন প্যানেল
          </h3>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="py-1 px-3 bg-emerald-500 text-slate-950 font-black text-[10.5px] rounded-lg flex items-center gap-1 hover:bg-emerald-400"
          >
            {isCreating ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            {isCreating ? 'বাতিল' : 'নতুন দেশের ওয়ার্কফ্লো তৈরি'}
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleCreateTemplate} className="bg-slate-950 p-4 rounded-xl border border-emerald-500/20 space-y-4">
            <span className="text-[10.5px] font-black text-emerald-400 block uppercase border-b border-slate-900 pb-1">
              🌍 দেশভিত্তিক ভিসা ওয়ার্কফ্লো বিল্ডার (Visa Workflow Builder)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[9.5px] text-slate-400 font-bold block">১. দেশ নির্বাচন (Select Country):</label>
                <select 
                  value={tplCountry}
                  onChange={(e) => setTplCountry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                >
                  {countriesList.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] text-slate-400 font-bold block">২. টেমপ্লেট নাম (Template Name):</label>
                <input 
                  type="text" 
                  required
                  placeholder="যেমন: Saudi Arabia General Employment"
                  value={tplName}
                  onChange={(e) => setTplName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] text-slate-400 font-bold block">৩. সংক্ষিপ্ত বর্ণনা (Template Description):</label>
                <input 
                  type="text" 
                  placeholder="যেমন: সৌদি আরবের সাধারণ এমপ্লয়মেন্ট ভিসার জন্য ধাপসমূহ..."
                  value={tplDesc}
                  onChange={(e) => setTplDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Step list editor inside the creation draft */}
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-850 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                <span className="text-[10px] text-slate-200 font-black uppercase flex items-center gap-1">
                  ⚙️ {tplCountry} এর ধাপসমূহ ({draftSteps.length} Steps Defined)
                </span>
                <span className="text-[10px] text-slate-400">
                  মোট খরচ: <span className="text-emerald-400 font-bold">৳{draftSteps.reduce((sum, s) => sum + s.amount, 0).toLocaleString()} BDT</span>
                </span>
              </div>

              {/* Steps Draft List */}
              <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
                {draftSteps.map((item, index) => (
                  <div key={item.key || index} className="p-2 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-[10px] gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-800 text-slate-300 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <strong className="text-white block">{item.label} ({item.name})</strong>
                        <p className="text-[8.5px] text-slate-400">
                          প্রয়োজনীয় ডকুমেন্ট: <span className="text-indigo-400">{item.requiredDocs || 'N/A'}</span> • স্ট্যাটাস অপশনস: <span className="text-amber-500 font-mono">{item.statusOptions}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Amount */}
                      <div className="text-right">
                        <span className="text-emerald-400 font-extrabold block">৳{(item.amount || 0).toLocaleString()}</span>
                        <span className="text-[8px] text-slate-400 block uppercase">
                          {item.isPaymentRequired ? '💰 পেমেন্ট আবশ্যিক' : 'ফ্রি ধাপ'}
                        </span>
                      </div>

                      {/* Permissions */}
                      <div className="text-right text-[8.5px] border-l border-slate-850 pl-2">
                        <span className={`block font-bold ${item.agencyCanUpdate ? 'text-blue-400' : 'text-slate-500'}`}>
                          {item.agencyCanUpdate ? 'Agency Edit ON' : 'Agency Edit OFF'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1">
                        <button 
                          type="button" 
                          onClick={() => handleMoveDraftStep(index, 'up')}
                          disabled={index === 0}
                          className="p-1 bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleMoveDraftStep(index, 'down')}
                          disabled={index === draftSteps.length - 1}
                          className="p-1 bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteDraftStep(index)}
                          className="p-1 bg-rose-500/10 border border-rose-500/20 rounded text-rose-400 hover:bg-rose-500/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {draftSteps.length === 0 && (
                  <p className="text-center text-slate-500 py-4 italic">কোনো ধাপ নেই। নিচের ফর্ম থেকে ধাপ যোগ করুন অথবা ডিফল্ট সেট রিলোড করুন।</p>
                )}
              </div>

              {/* Add Custom Step to Draft Form */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-[9.5px]">
                <strong className="text-slate-200 block border-b border-slate-900 pb-1 uppercase text-[8.5px] tracking-wider text-emerald-400">
                  ➕ নতুন ধাপ যোগ করুন (Add Custom Step to Draft)
                </strong>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-slate-400 font-bold block">ধাপের আইডি (Unique Key):</label>
                    <input 
                      type="text"
                      placeholder="যেমন: visa_apply"
                      value={newStepKey}
                      onChange={(e) => setNewStepKey(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-slate-400 font-bold block">ধাপের নাম (English Name):</label>
                    <input 
                      type="text"
                      placeholder="e.g. Visa Submission"
                      value={newStepName}
                      onChange={(e) => setNewStepName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-slate-400 font-bold block">বাংলা লেবেল (Bangla Title):</label>
                    <input 
                      type="text"
                      placeholder="যেমন: ভিসা সাবমিশন"
                      value={newStepLabel}
                      onChange={(e) => setNewStepLabel(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-slate-400 font-bold block">কিস্তি ফি (Amount in BDT):</label>
                    <input 
                      type="number"
                      placeholder="যেমন: 25000"
                      value={newStepAmount}
                      onChange={(e) => setNewStepAmount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-slate-400 font-bold block">প্রয়োজনীয় ফাইলসমূহ (Required Docs):</label>
                    <input 
                      type="text"
                      placeholder="যেমন: পাসপোর্ট, ভিসা কপি, ছবি..."
                      value={newStepDocs}
                      onChange={(e) => setNewStepDocs(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-slate-400 font-bold block">স্ট্যাটাস অপশনস (Status Options CSV):</label>
                    <input 
                      type="text"
                      placeholder="Pending, Processing, Completed, Rejected"
                      value={newStepStatusOptions}
                      onChange={(e) => setNewStepStatusOptions(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <label className="flex items-center gap-1.5 text-slate-350 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newStepPayReq} 
                        onChange={(e) => setNewStepPayReq(e.target.checked)}
                        className="rounded border-slate-850 bg-slate-900 text-indigo-500 focus:ring-0"
                      />
                      <span>পেমেন্ট আবশ্যক</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-slate-350 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newStepAgencyCanUpdate} 
                        onChange={(e) => setNewStepAgencyCanUpdate(e.target.checked)}
                        className="rounded border-slate-850 bg-slate-900 text-indigo-500 focus:ring-0"
                      />
                      <span>এজেন্সি এডিট পারমিশন</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 pt-1">
                  <button 
                    type="button" 
                    onClick={() => setDraftSteps([...DEFAULT_VISA_STEPS_PRESET])}
                    className="py-1 px-3 bg-slate-900 text-slate-400 border border-slate-800 rounded hover:text-white"
                  >
                    ↺ রিসেট ডিফল্ট (11 Steps Reset)
                  </button>
                  <button 
                    type="button" 
                    onClick={handleAddDraftStep}
                    className="py-1 px-3 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-500"
                  >
                    ✓ এই ধাপটি যুক্ত করুন
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button type="submit" className="py-2 px-5 bg-emerald-500 text-slate-950 font-black rounded-lg hover:bg-emerald-400">
                ✓ টেমপ্লেট সেভ করুন (Save workflow)
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map(t => (
            <div key={t.id} className={`p-4 rounded-2xl bg-slate-950 border transition ${t.status === 'Archived' ? 'border-slate-900 opacity-60' : 'border-slate-850 hover:border-slate-800'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-0.5">
                  <span className="text-[8px] bg-slate-900 border border-slate-800 rounded px-1.5 py-0.2 text-indigo-400 font-extrabold uppercase tracking-wider block w-fit mb-1">
                    🌍 {t.country || 'Italy'}
                  </span>
                  <h4 className="font-black text-white text-xs block">{t.name}</h4>
                  <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase inline-block ${
                    t.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {t.status}
                  </span>
                </div>
                
                <div className="flex gap-1 shrink-0">
                  <button 
                    onClick={() => handleCopyTemplate(t.id)} 
                    className="p-1 bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-white"
                    title="Copy Template"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleToggleTemplateStatus(t.id)} 
                    className={`p-1 border rounded text-slate-400 hover:text-white ${t.status === 'Active' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-900 border-slate-800'}`}
                    title={t.status === 'Active' ? 'Archive Template' : 'Restore Template'}
                  >
                    {t.status === 'Active' ? <EyeOff className="w-3 h-3 text-amber-400" /> : <Eye className="w-3 h-3 text-emerald-400" />}
                  </button>
                </div>
              </div>

              <p className="text-slate-400 text-[10.5px] leading-relaxed mb-3 min-h-[32px]">{t.description}</p>
              
              <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-900">
                <span className="text-slate-400 font-bold block">ভিসা ধাপসমূহ:</span>
                <span className="text-indigo-400 font-black">{t.steps?.length || 0} টি কিস্তি ধাপ</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


// ==========================================
// 3. VISA PROCESS STEPS CONFIGURATION & REORDERING
// ==========================================
interface StepsSubTabProps {
  steps: CustomVisaStepTemplate[];
  setSteps: React.Dispatch<React.SetStateAction<CustomVisaStepTemplate[]>>;
  isAddingStep: boolean;
  setIsAddingStep: (val: boolean) => void;
  newStepKey: string;
  setNewStepKey: (val: string) => void;
  newStepName: string;
  setNewStepName: (val: string) => void;
  newStepLabel: string;
  setNewStepLabel: (val: string) => void;
  newStepOrder: number;
  setNewStepOrder: (val: number) => void;
  newStepAmount: number;
  setNewStepAmount: (val: number) => void;
  newStepDueDate: string;
  setNewStepDueDate: (val: string) => void;
  newStepDesc: string;
  setNewStepDesc: (val: string) => void;
  newStepDocs: string;
  setNewStepDocs: (val: string) => void;
  handleCreateStep: (e: React.FormEvent) => void;
  handleDeleteStep: (key: string) => void;
}

export function VisaStepsSubTab({
  steps,
  setSteps,
  isAddingStep,
  setIsAddingStep,
  newStepKey,
  setNewStepKey,
  newStepName,
  setNewStepName,
  newStepLabel,
  setNewStepLabel,
  newStepOrder,
  setNewStepOrder,
  newStepAmount,
  setNewStepAmount,
  newStepDueDate,
  setNewStepDueDate,
  newStepDesc,
  setNewStepDesc,
  newStepDocs,
  setNewStepDocs,
  handleCreateStep,
  handleDeleteStep
}: StepsSubTabProps) {

  // Steps Order Swapping (Up / Down Reordering)
  const moveStep = (index: number, direction: 'UP' | 'DOWN') => {
    if (direction === 'UP' && index === 0) return;
    if (direction === 'DOWN' && index === steps.length - 1) return;

    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    const updated = [...steps];
    
    // Swap items
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate order indices
    const normalized = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSteps(normalized);
  };

  return (
    <div className="space-y-6 animate-fade-in text-[11px]">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">
          ⚙️ ভিসা প্রসেস ধাপ ও ট্র্যাকিং কিস্তি কনফিগারেটর (Unlimited Process Steps)
        </h3>
        <button 
          onClick={() => setIsAddingStep(!isAddingStep)}
          className="py-1.5 px-3 bg-emerald-500 text-slate-950 font-black text-[10.5px] rounded-xl flex items-center gap-1.5 hover:bg-emerald-400"
        >
          {isAddingStep ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {isAddingStep ? 'বাতিল' : 'নতুন প্রসেস ধাপ যোগ করুন'}
        </button>
      </div>

      {isAddingStep && (
        <form onSubmit={handleCreateStep} className="bg-slate-950/80 p-5 rounded-2xl border border-emerald-500/10 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-xs mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" /> নতুন ভিসা প্রসেস প্যারামিটার সেটআপ
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 font-black uppercase">ধাপের ইউনিক আইডি (Key - English No Spaces) *</label>
              <input 
                type="text" 
                required
                placeholder="যেমন: fingerprint_vfs"
                value={newStepKey}
                onChange={(e) => setNewStepKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 font-black uppercase">ধাপের ইংরেজি নাম (English Title) *</label>
              <input 
                type="text" 
                required
                placeholder="যেমন: Fingerprint Biometric"
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 font-black uppercase">ধাপের বাংলা কাস্টম লেবেল (Custom Label in Bengali) *</label>
              <input 
                type="text" 
                required
                placeholder="যেমন: ফিঙ্গারপ্রিন্ট সম্পন্নকরণ"
                value={newStepLabel}
                onChange={(e) => setNewStepLabel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 font-black uppercase">ধাপের ধার্য ফি (Amount in BDT)</label>
              <input 
                type="number" 
                value={newStepAmount}
                onChange={(e) => setNewStepAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 font-black uppercase">টার্গেট পেমেন্ট ডেট (Due Date)</label>
              <input 
                type="date" 
                value={newStepDueDate}
                onChange={(e) => setNewStepDueDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 font-black uppercase">প্রয়োজনীয় ডকুমেন্টস (Required Documents List)</label>
              <input 
                type="text" 
                placeholder="যেমন: পাসপোর্টের ছবি, এনআইডি"
                value={newStepDocs}
                onChange={(e) => setNewStepDocs(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 font-black uppercase">প্রাক-শর্ত ধাপ (Pre-requisite / Conditions)</label>
              <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none">
                <option value="">কোনো শর্ত নেই</option>
                {steps.map(s => (
                  <option key={s.key} value={s.key}>{s.name} সম্পন্ন হওয়া বাধ্যতামূলক</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-slate-400 font-black uppercase">ধাপের বিবরণ ও কাজের নির্দেশনা (Detailed Step Guidelines)</label>
            <textarea 
              placeholder="এই ধাপে কাজের জন্য এজেন্সি এবং আবেদনকারীর করণীয় সম্পর্কে বিস্তারিত নির্দেশনা প্রদান করুন..."
              value={newStepDesc}
              onChange={(e) => setNewStepDesc(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none h-16 text-[11px]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => setIsAddingStep(false)}
              className="py-2 px-4 bg-slate-900 text-slate-400 border border-slate-800 rounded-xl font-bold"
            >
              বাতিল
            </button>
            <button 
              type="submit" 
              className="py-2 px-5 bg-emerald-500 text-slate-950 font-black rounded-xl hover:bg-emerald-400 transition"
            >
              ✓ ধাপটি সংরক্ষণ করুন
            </button>
          </div>
        </form>
      )}

      {/* Steps Table Ledger & Order Management */}
      <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden">
        <div className="p-3 bg-slate-950 text-slate-350 font-bold border-b border-slate-850 flex justify-between items-center">
          <span>ভিসা প্রসেস কিস্তি ও নির্দেশাবলী ({steps.length} টি সক্রিয় ধাপ)</span>
          <span className="text-[9.5px] text-slate-400 italic">🔼 🔽 বাটন দিয়ে ক্রম বা অর্ডার সাজান</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 font-black text-[10px] border-b border-slate-850">
                <th className="p-3">ক্রম (Order)</th>
                <th className="p-3">কী (ID Key)</th>
                <th className="p-3">ধাপ ও বাংলা লেবেল</th>
                <th className="p-3">টার্গেট পেমেন্ট ফি</th>
                <th className="p-3 text-center">টার্গেট দিন</th>
                <th className="p-3">প্রয়োজনীয় ডকুমেন্টস</th>
                <th className="p-3 text-center">অগ্রগতি স্ট্যাটাস</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 bg-slate-950/30">
              {steps.map((s, idx) => (
                <tr key={s.key} className="hover:bg-slate-900/30 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-emerald-400 font-black">#{s.order}</span>
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button 
                          onClick={() => moveStep(idx, 'UP')} 
                          disabled={idx === 0}
                          className="p-0.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 rounded"
                        >
                          <ChevronUp className="w-2.5 h-2.5" />
                        </button>
                        <button 
                          onClick={() => moveStep(idx, 'DOWN')} 
                          disabled={idx === steps.length - 1}
                          className="p-0.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 rounded"
                        >
                          <ChevronDown className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-slate-450">{s.key}</td>
                  <td className="p-3">
                    <span className="font-bold text-white block">{s.name}</span>
                    <span className="text-[9.5px] text-slate-400">{s.label}</span>
                  </td>
                  <td className="p-3 font-black text-emerald-400">৳{s.amount.toLocaleString()}</td>
                  <td className="p-3 text-center font-mono text-slate-400">{s.avgProcessingDays || 15} দিন</td>
                  <td className="p-3">
                    <span className="bg-slate-900 text-indigo-400 border border-slate-850 px-2 py-0.5 rounded text-[9.5px] font-bold inline-block max-w-[150px] truncate" title={s.requiredDocs}>
                      📁 {s.requiredDocs || 'প্রয়োজন নেই'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase ${
                      s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => handleDeleteStep(s.key)}
                      className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-500 rounded border border-rose-500/10"
                      title="Delete Step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 4. PAYMENT SETTINGS SUB-TAB
// ==========================================
interface PaymentSubTabProps {
  paymentConfig: any;
  setPaymentConfig: React.Dispatch<React.SetStateAction<any>>;
  addLog: (user: string, action: string, type?: string) => void;
  activeStaff: StaffMember;
}

export function VisaPaymentSubTab({
  paymentConfig,
  setPaymentConfig,
  addLog,
  activeStaff
}: PaymentSubTabProps) {

  return (
    <div className="space-y-6 animate-fade-in text-[11px]">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">
          💳 গ্লোবাল পেমেন্ট ও ইনভয়েস কনফিগুরেশন (Installments Rules)
        </h3>
        <p className="text-[10px] text-slate-400">প্রতিটি ক্যান্ডিডেটের টোটাল চুক্তি এবং কিস্তিভিত্তিক পরিশোধের নিয়ম নির্ধারণ করুন।</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-[11px]">
        
        {/* Pricing Model select */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
          <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase">
            <SlidersHorizontal className="w-4 h-4" /> Pricing Model Setup
          </span>
          
          <div className="grid grid-cols-2 gap-3">
            <label className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${paymentConfig.pricingModel === 'fixed' ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
              <input 
                type="radio" 
                name="pricingModel" 
                value="fixed" 
                checked={paymentConfig.pricingModel === 'fixed'}
                onChange={() => setPaymentConfig((p: any) => ({ ...p, pricingModel: 'fixed' }))}
                className="sr-only"
              />
              <span className="font-bold block text-xs">🔒 Fixed Package Model</span>
              <span className="text-[9px] text-slate-400 mt-1">সব ক্যান্ডিডেটের জন্য একই ফিক্সড অ্যামাউন্ট নির্ধারণ করুন।</span>
            </label>

            <label className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${paymentConfig.pricingModel === 'custom' ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
              <input 
                type="radio" 
                name="pricingModel" 
                value="custom" 
                checked={paymentConfig.pricingModel === 'custom'}
                onChange={() => setPaymentConfig((p: any) => ({ ...p, pricingModel: 'custom' }))}
                className="sr-only"
              />
              <span className="font-bold block text-xs">⚙️ Step Sum Model</span>
              <span className="text-[9px] text-slate-400 mt-1">ভিসা ধাপগুলোর অ্যামাউন্টের যোগফল অনুযায়ী চুক্তি হিসাব।</span>
            </label>
          </div>

          {paymentConfig.pricingModel === 'fixed' && (
            <div className="space-y-1.5 animate-fade-in pt-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase">নির্ধারিত গ্লোবাল চুক্তি ফি (Fixed BDT Amount)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-black">৳</span>
                <input 
                  type="number" 
                  value={paymentConfig.fixedAmount}
                  onChange={(e) => setPaymentConfig((p: any) => ({ ...p, fixedAmount: Number(e.target.value) }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-7 pr-3 text-white font-black text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Allowed rules configuration */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
          <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase">
            <Calculator className="w-4 h-4" /> Installment & Charges Configuration
          </span>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <input 
                type="checkbox" 
                checked={paymentConfig.partialAllowed}
                onChange={(e) => setPaymentConfig((p: any) => ({ ...p, partialAllowed: e.target.checked }))}
                className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="font-bold">আংশিক পেমেন্ট এলাউড (Partial)</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <input 
                type="checkbox" 
                checked={paymentConfig.installmentAllowed}
                onChange={(e) => setPaymentConfig((p: any) => ({ ...p, installmentAllowed: e.target.checked }))}
                className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="font-bold">কিস্তি সুবিধা এলাউড (Installments)</span>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 font-black">দেরি ফি (Late Fee Flat BDT)</label>
              <input 
                type="number" 
                value={paymentConfig.lateFee}
                onChange={(e) => setPaymentConfig((p: any) => ({ ...p, lateFee: Number(e.target.value) }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 font-black">গ্লোবাল ডিসকাউন্ট (BDT)</label>
              <input 
                type="number" 
                value={paymentConfig.globalDiscount}
                onChange={(e) => setPaymentConfig((p: any) => ({ ...p, globalDiscount: Number(e.target.value) }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 font-black">অতিরিক্ত চার্জ (Extra Charges)</label>
              <input 
                type="number" 
                value={paymentConfig.extraCharges}
                onChange={(e) => setPaymentConfig((p: any) => ({ ...p, extraCharges: Number(e.target.value) }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => {
            localStorage.setItem('visa_payment_config', JSON.stringify(paymentConfig));
            addLog(activeStaff.name, 'ভিসা পেমেন্ট ফি কনফিগুরেশন পরিবর্তন করেছেন।', 'info');
            alert('পেমেন্ট রুল সেটিংস সফলভাবে আপডেট হয়েছে!');
          }}
          className="py-2.5 px-5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl hover:bg-emerald-400 transition"
        >
          ✓ গ্লোবাল সেটিংস সংরক্ষণ করুন
        </button>
      </div>
    </div>
  );
}
