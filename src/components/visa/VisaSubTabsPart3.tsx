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
// 8. ADMIN APPROVAL HUB (PENDING STEPS & PAYMENTS)
// ==========================================
interface ApprovalSubTabProps {
  approvedCandidates: ItalyPackageApplication[];
  onUpdateItalyPackage: (pkg: ItalyPackageApplication) => void;
  addLog: (user: string, action: string, type?: string) => void;
  activeStaff: StaffMember;
  triggerNotification: (title: string, msg: string, type: any, recipient: any) => void;
  handleAdminVerifyPayment: (candId: string, payId: string, action: 'Approve' | 'Reject') => void;
}

export function VisaApprovalSubTab({
  approvedCandidates,
  onUpdateItalyPackage,
  addLog,
  activeStaff,
  triggerNotification,
  handleAdminVerifyPayment
}: ApprovalSubTabProps) {

  const [activeQueueTab, setActiveQueueTab] = useState<'payments' | 'steps' | 'audit'>('payments');
  const [rejectionNotes, setRejectionNotes] = useState('');

  // 1. Gather all pending payments across candidates
  const pendingPayments: any[] = [];
  approvedCandidates.forEach(c => {
    if (c.paymentHistory) {
      c.paymentHistory.forEach(p => {
        if (p.status === 'Pending') {
          pendingPayments.push({
            candidateId: c.id,
            candidateName: c.candidateName,
            passportNumber: c.passportNumber,
            ...p
          });
        }
      });
    }
  });

  // 2. Gather pending step completion requests from agencies
  const pendingSteps: any[] = [];
  approvedCandidates.forEach(c => {
    if (c.visaSteps) {
      c.visaSteps.forEach(s => {
        // If agency put it into Processing, it requires admin verification
        if (s.status === 'Processing') {
          pendingSteps.push({
            candidateId: c.id,
            candidateName: c.candidateName,
            passportNumber: c.passportNumber,
            step: s
          });
        }
      });
    }
  });

  const handleApproveStep = (candId: string, stepKey: string) => {
    const cand = approvedCandidates.find(c => c.id === candId);
    if (!cand) return;

    const updatedSteps = cand.visaSteps ? cand.visaSteps.map(s => {
      if (s.key === stepKey) {
        return { ...s, status: 'Completed' as const, date: new Date().toLocaleDateString(), staffName: activeStaff.name };
      }
      return s;
    }) : [];

    const updated: ItalyPackageApplication = {
      ...cand,
      visaSteps: updatedSteps
    };

    onUpdateItalyPackage(updated);
    addLog(activeStaff.name, `ক্যান্ডিডেট "${cand.candidateName}" এর "${stepKey}" ধাপের সম্পাদন এপ্রুভ বা অনুমোদন করেছেন।`, 'success');
    triggerNotification('ভিসা ধাপ এপ্রুভড!', `আপনার ফাইল ট্র্যাকার অনুযায়ী "${stepKey}" ধাপের প্রগ্রেস অনুমোদন করা হয়েছে।`, 'success', 'Candidate');
    alert(`"${stepKey}" ধাপের সম্পাদন সফলভাবে অনুমোদন করা হয়েছে!`);
  };

  const handleRejectStep = (candId: string, stepKey: string) => {
    const cand = approvedCandidates.find(c => c.id === candId);
    if (!cand) return;

    const updatedSteps = cand.visaSteps ? cand.visaSteps.map(s => {
      if (s.key === stepKey) {
        return { ...s, status: 'Rejected' as const, adminNotes: rejectionNotes || 'ডকুমেন্ট গরমিল বা অসম্পূর্ণ তথ্য।' };
      }
      return s;
    }) : [];

    const updated: ItalyPackageApplication = {
      ...cand,
      visaSteps: updatedSteps
    };

    onUpdateItalyPackage(updated);
    addLog(activeStaff.name, `ক্যান্ডিডেট "${cand.candidateName}" এর "${stepKey}" ধাপের সম্পাদন প্রত্যাখ্যান (Reject) করেছেন।`, 'warning');
    triggerNotification('ধাপ প্রত্যাখ্যান করা হয়েছে', `আপনার "${stepKey}" ধাপের রিকোয়েস্টটি অ্যাডমিন রিজেক্ট করেছেন: ${rejectionNotes}`, 'alert', 'Candidate');
    alert(`ধাপটির প্রগ্রেস প্রত্যাখ্যান করা হয়েছে ও মন্তব্য ক্যান্ডিডেটকে পাঠানো হয়েছে।`);
    setRejectionNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in text-[11px]">
      
      {/* Sub-navigation */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveQueueTab('payments')}
            className={`px-3 py-1 text-[10px] font-black rounded-lg ${activeQueueTab === 'payments' ? 'bg-indigo-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
          >
            💰 পেমেন্ট স্লিপ রিকোয়েস্ট ({pendingPayments.length} টি)
          </button>
          <button 
            onClick={() => setActiveQueueTab('steps')}
            className={`px-3 py-1 text-[10px] font-black rounded-lg ${activeQueueTab === 'steps' ? 'bg-indigo-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
          >
            ⚙️ ধাপ সম্পাদন এপ্রুভাল ({pendingSteps.length} টি)
          </button>
          <button 
            onClick={() => setActiveQueueTab('audit')}
            className={`px-3 py-1 text-[10px] font-black rounded-lg ${activeQueueTab === 'audit' ? 'bg-indigo-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
          >
            📜 অডিট ট্রেইল ও ভেরিফিকেশন লগ
          </button>
        </div>

        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded font-black uppercase">
          🛡️ Admin Moderation Center
        </span>
      </div>

      {/* QUEUE 1: PAYMENTS VERIFICATION */}
      {activeQueueTab === 'payments' && (
        <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden animate-fade-in">
          <div className="p-3 bg-slate-950 text-slate-300 font-bold border-b border-slate-850">
            ব্যাংক ডিপোজিট ও স্লিপ ভেরিফিকেশন কিউ ({pendingPayments.length} টি স্লিপ অপেক্ষমাণ)
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-black text-[10px] border-b border-slate-850">
                  <th className="p-3">প্রার্থীর বিবরণ</th>
                  <th className="p-3">কিস্তির ধাপ (Step)</th>
                  <th className="p-3">টাকার পরিমাণ</th>
                  <th className="p-3">ট্রানজেকশন আইডি</th>
                  <th className="p-3">তারিখ ও মেথড</th>
                  <th className="p-3 text-right">মডারেশন অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {pendingPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/30 transition">
                    <td className="p-3">
                      <span className="font-bold text-white block">{p.candidateName}</span>
                      <span className="text-[9.5px] text-slate-400 font-mono">🎫 {p.passportNumber}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-indigo-400 font-bold font-mono uppercase">{p.stepKey}</span>
                    </td>
                    <td className="p-3 font-black text-emerald-400">৳{p.amount.toLocaleString()} BDT</td>
                    <td className="p-3 font-mono text-white">{p.invoiceId}</td>
                    <td className="p-3">
                      <span className="text-slate-350 block font-bold">{p.method}</span>
                      <span className="text-[9.5px] text-slate-500 font-mono">{p.date}</span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => {
                            handleAdminVerifyPayment(p.candidateId, p.id, 'Approve');
                            alert('পেমেন্ট ডিপোজিট সফলভাবে অনুমোদন ও লেজারে ক্রেডিট করা হয়েছে!');
                          }}
                          className="py-1 px-3 bg-emerald-500 text-slate-950 font-black rounded hover:bg-emerald-400"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => {
                            handleAdminVerifyPayment(p.candidateId, p.id, 'Reject');
                            alert('পেমেন্ট প্রত্যাখ্যান করা হয়েছে। কাস্টমার পুনরায় আপলোড করবে।');
                          }}
                          className="py-1 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded border border-rose-500/15"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingPayments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">কোনো মুলতুবি পেমেন্ট রিকোয়েস্ট এখন সিস্টেমে নেই।</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUEUE 2: STEP COMPLETION APPROVAL */}
      {activeQueueTab === 'steps' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden">
            <div className="p-3 bg-slate-950 text-slate-350 font-bold border-b border-slate-850">
              ভিসা প্রসেস ধাপ সম্পাদন অনুমোদন কিউ ({pendingSteps.length} টি ধাপ ভেরিফিকেশন পেন্ডিং)
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 font-black text-[10px] border-b border-slate-850">
                    <th className="p-3">আবেদনকারী</th>
                    <th className="p-3">টার্গেট ধাপ</th>
                    <th className="p-3">এজেন্সি মন্তব্য (Submission Remarks)</th>
                    <th className="p-3 text-right">মডারেশন ও এপ্রুভাল অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {pendingSteps.map((item) => (
                    <tr key={`${item.candidateId}-${item.step.key}`} className="hover:bg-slate-900/30 transition">
                      <td className="p-3">
                        <span className="font-bold text-white block">{item.candidateName}</span>
                        <span className="text-[9.5px] text-slate-450 font-mono">🎫 {item.passportNumber}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-indigo-400 font-bold font-mono">{item.step.key.toUpperCase()}</span>
                      </td>
                      <td className="p-3">
                        <p className="text-slate-300 leading-relaxed italic">{item.step.adminNotes || 'কোনো মন্তব্য প্রদান করা হয়নি।'}</p>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleApproveStep(item.candidateId, item.step.key)}
                            className="py-1 px-3 bg-emerald-500 text-slate-950 font-black rounded hover:bg-emerald-400"
                          >
                            Approve Step
                          </button>
                          
                          <button 
                            onClick={() => {
                              const notes = prompt('ধাপটি রিজেক্ট করার কারণ টাইপ করুন:');
                              if (notes) {
                                setRejectionNotes(notes);
                                handleRejectStep(item.candidateId, item.step.key);
                              }
                            }}
                            className="py-1 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded border border-rose-500/15"
                          >
                            Reject & Request Correction
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingSteps.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">কোনো মুলতুবি ধাপ অনুমোদন রিকোয়েস্ট এখন সিস্টেমে নেই।</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QUEUE 3: AUDIT TRAIL */}
      {activeQueueTab === 'audit' && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3 animate-fade-in">
          <span className="text-xs font-black text-slate-200 block border-b border-slate-900 pb-2">
            🛡️ সিস্টেম সিকিউরিটি অডিট ও অপারেশন লগস (System Integrity Trail)
          </span>

          <div className="space-y-2">
            <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-850 text-[10px] flex justify-between">
              <span className="text-slate-350">অ্যাডমিন <strong>{activeStaff.name}</strong> ক্যান্ডিডেট কামাল উদ্দিনের MOFA পেমেন্ট ভেরিফাই করেছেন।</span>
              <span className="text-slate-500 font-mono">০৬ জুলাই, ২০২৬ - ১০:৩০ AM</span>
            </div>
            <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-850 text-[10px] flex justify-between">
              <span className="text-slate-350">এজেন্সি <strong>Gulf Careers</strong> ক্যান্ডিডেটের ওয়ার্ক পারমিট ধাপ এপ্রুভাল রিকোয়েস্ট করেছেন।</span>
              <span className="text-slate-500 font-mono">০৬ জুলাই, ২০২৬ - ০৯:১৫ AM</span>
            </div>
            <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-850 text-[10px] flex justify-between">
              <span className="text-slate-350">সিস্টেম স্বয়ংক্রিয় পেমেন্ট নোটিশ ইমেইল ক্যান্ডিডেটের কাছে পাঠিয়েছে।</span>
              <span className="text-slate-500 font-mono">০৫ জুলাই, ২০২৬ - ০৩:০০ PM</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


// ==========================================
// 9. AUTOMATED REMINDERS & NOTIFICATION TEMPLATES
// ==========================================
interface NotificationsSubTabProps {
  notifications: SystemNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<SystemNotification[]>>;
  addLog: (user: string, action: string, type?: string) => void;
  activeStaff: StaffMember;
}

export function VisaNotificationsSubTab({
  notifications,
  setNotifications,
  addLog,
  activeStaff
}: NotificationsSubTabProps) {

  const [notifTemplates, setNotifTemplates] = useState<NotificationTemplate[]>(PRESET_NOTIFICATION_TEMPLATES);
  const [broadTitle, setBroadTitle] = useState('');
  const [broadMsg, setBroadMsg] = useState('');
  const [broadRecipient, setBroadRecipient] = useState<'Candidate' | 'Agency' | 'Staff' | 'Admin'>('Candidate');

  const [chanEmail, setChanEmail] = useState(true);
  const [chanSMS, setChanSMS] = useState(true);
  const [chanWA, setChanWA] = useState(false);
  const [chanPush, setChanPush] = useState(true);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadTitle.trim() || !broadMsg.trim()) return;

    const newNotif: SystemNotification = {
      id: 'notif_' + Date.now(),
      title: broadTitle,
      msg: broadMsg,
      time: new Date().toLocaleTimeString() + ' | ' + new Date().toLocaleDateString(),
      type: 'info',
      recipient: broadRecipient,
      channels: {
        email: chanEmail,
        sms: chanSMS,
        whatsapp: chanWA,
        push: chanPush
      }
    };

    setNotifications(prev => [newNotif, ...prev]);
    addLog(activeStaff.name, `ক্যান্ডিডেট ও এজেন্সিদের উদ্দেশ্যে গ্লোবাল বার্তা "${broadTitle}" ব্রডকাস্ট করেছেন।`, 'success');
    alert(`"${broadTitle}" বিজ্ঞপ্তিটি সফলভাবে সিস্টেমে ব্রডকাস্ট ও টার্গেট নোটিফিকেশন লগে যুক্ত করা হয়েছে!`);
    setBroadTitle('');
    setBroadMsg('');
  };

  return (
    <div className="space-y-6 animate-fade-in text-[11px]">
      
      {/* Configuration row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-[11px]">
        
        {/* Interactive Manual Broadcaster Form */}
        <form onSubmit={handleBroadcast} className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3.5">
          <span className="text-xs font-black text-indigo-400 block border-b border-slate-900 pb-2">
            📡 রিয়েল-টাইম এসএমএস/ইমেইল বার্তা ব্রডকাস্টার (Broadcast Alert Engine)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 font-bold uppercase">গ্রাহক ক্যাটাগরি (Audience)</label>
              <select 
                value={broadRecipient}
                onChange={(e: any) => setBroadRecipient(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
              >
                <option value="Candidate">All Candidates (আবেদনকারীগণ)</option>
                <option value="Agency">Registered Agencies (এজেন্সিসমূহ)</option>
                <option value="Staff">Internal Office Staff (স্টাফ)</option>
                <option value="Admin">System Admin Only (মডারেটরস)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 font-bold uppercase">বার্তা শিরোনাম (Alert Subject)</label>
              <input 
                type="text" 
                required
                placeholder="যেমন: সার্ভার রক্ষণাবেক্ষণ নোটিশ"
                value={broadTitle}
                onChange={(e) => setBroadTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-slate-400 font-bold uppercase">বার্তার বিবরণ (Message Content)</label>
            <textarea 
              required
              placeholder="আপনার কাস্টম মেসেজ টাইপ করুন..."
              value={broadMsg}
              onChange={(e) => setBroadMsg(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none h-16 text-[11px]"
            />
          </div>

          {/* Channels checklist */}
          <div className="space-y-1 bg-slate-900/50 p-3 rounded-xl border border-slate-900">
            <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1.5">ডেলিভারি চ্যানেলসমূহ (Active Channels)</span>
            <div className="grid grid-cols-4 gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={chanEmail} onChange={(e) => setChanEmail(e.target.checked)} className="rounded text-indigo-500 bg-slate-950 border-slate-800" />
                <span>📧 Email</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={chanSMS} onChange={(e) => setChanSMS(e.target.checked)} className="rounded text-indigo-500 bg-slate-950 border-slate-800" />
                <span>💬 SMS</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={chanWA} onChange={(e) => setChanWA(e.target.checked)} className="rounded text-indigo-500 bg-slate-950 border-slate-800" />
                <span>🟢 WA</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={chanPush} onChange={(e) => setChanPush(e.target.checked)} className="rounded text-indigo-500 bg-slate-950 border-slate-800" />
                <span>🔔 Push</span>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full py-2 bg-indigo-500 text-slate-950 font-black rounded-xl hover:bg-indigo-400 transition">
            ✓ গ্লোবাল বার্তা ও এলার্ট প্রচার করুন (Broadcast Now)
          </button>
        </form>

        {/* Channels configuration parameters and rules */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4 text-[11px]">
          <span className="text-xs font-black text-indigo-400 block border-b border-slate-900 pb-2">
            ⚙️ কিস্তি পেমেন্ট রিমাইন্ডার শিডিউল সেটআপ (Automatic Reminder Schedule)
          </span>

          <div className="space-y-3">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-900 space-y-1.5">
              <span className="font-bold text-slate-200 block">১ম সতর্কবার্তা (1st Warning Alert)</span>
              <p className="text-slate-400 text-[10px]">কিস্তির টার্গেট শেষ সময়সীমার ৩ দিন পূর্বে অটোমেটিক এসএমএস সতর্কবার্তা পাঠানো হবে।</p>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded border-slate-800 text-indigo-500 bg-slate-950 h-3.5 w-3.5" />
                <span className="font-bold text-indigo-400">Enable Automated Trigger</span>
              </label>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-900 space-y-1.5">
              <span className="font-bold text-slate-200 block">২য় চুড়ান্ত সতর্কবার্তা (Overdue Critical Alert)</span>
              <p className="text-slate-400 text-[10px]">কিস্তির টার্গেট শেষ সময়সীমা অতিক্রম হওয়ার ১ দিন পর পেনাল্টি ও লেট ফিসহ ইমেইল পাঠানো হবে।</p>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded border-slate-800 text-indigo-500 bg-slate-950 h-3.5 w-3.5" />
                <span className="font-bold text-rose-400">Enable Automated Overdue Warning</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Preset templates list */}
      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-3">
        <span className="text-xs font-black text-slate-200 block border-b border-slate-900 pb-2">
          📋 নোটিফিকেশন ম্যাসেজিং টেমপ্লেট লাইব্রেরি (Notification Templates)
        </span>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {notifTemplates.map(t => (
            <div key={t.id} className="p-3 rounded-xl bg-slate-900 border border-slate-850 space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-white block font-bold text-xs">{t.name}</strong>
                <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.2 rounded font-black font-mono">
                  {t.id.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-400 text-[10px] leading-relaxed italic">"{t.body}"</p>
              
              <div className="flex justify-between items-center text-[9px] border-t border-slate-850 pt-1.5">
                <span className="text-slate-500 font-bold">অ্যাক্টিভ চ্যানেল:</span>
                <span className="text-emerald-400 font-mono">Email, SMS, App Push</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


// ==========================================
// 10. REPORTS & EXPORTS HUB
// ==========================================
interface ReportsSubTabProps {
  approvedCandidates: ItalyPackageApplication[];
  steps: CustomVisaStepTemplate[];
  paymentConfig: any;
  transactions: any[];
  addLog?: (user: string, action: string, type?: string) => void;
  activeStaff?: StaffMember;
}

export function VisaReportsSubTab({
  approvedCandidates,
  steps,
  paymentConfig,
  transactions,
  addLog,
  activeStaff
}: ReportsSubTabProps) {

  const [reportType, setReportType] = useState<'progress' | 'payment' | 'agency' | 'country'>('progress');
  const [filterStep, setFilterStep] = useState('all');

  const handleExportSimulated = (format: 'pdf' | 'excel' | 'csv') => {
    addLog?.('অ্যাডমিন মডারেটর', `রিপোর্ট ডক "${reportType}-report.${format}" ডাউনলোড করেছেন।`, 'success');
    alert(`অভিনন্দন! আপনার ফিল্টারকৃত "${reportType}" রিপোর্টের ওয়ান-ক্লিক ${format.toUpperCase()} ফাইলটি সফলভাবে ডাউনলোড করা হয়েছে।`);
  };

  return (
    <div className="space-y-6 animate-fade-in text-[11px]">
      
      {/* Filtering row */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setReportType('progress')}
            className={`px-3 py-1.5 rounded-xl font-bold ${reportType === 'progress' ? 'bg-indigo-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
          >
            📋 প্রসেস অগ্রগতি রিপোর্ট (Progress)
          </button>
          <button 
            onClick={() => setReportType('payment')}
            className={`px-3 py-1.5 rounded-xl font-bold ${reportType === 'payment' ? 'bg-indigo-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
          >
            💰 কিস্তি পেমেন্ট ও রেভিনিউ রিপোর্ট (Revenue)
          </button>
          <button 
            onClick={() => setReportType('agency')}
            className={`px-3 py-1.5 rounded-xl font-bold ${reportType === 'agency' ? 'bg-indigo-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
          >
            🏢 এজেন্সি পারফরম্যান্স স্পিড (Agencies)
          </button>
        </div>

        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => handleExportSimulated('excel')}
            className="py-1.5 px-3 bg-emerald-500 text-slate-950 font-black rounded-lg text-[10.5px] flex items-center gap-1 hover:bg-emerald-400"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
          <button 
            onClick={() => window.print()}
            className="py-1.5 px-3 bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded-lg text-[10.5px] flex items-center gap-1 hover:text-white"
          >
            <Printer className="w-3.5 h-3.5" /> Print Report
          </button>
        </div>
      </div>

      {/* REPORT TYPE 1: PROGRESS */}
      {reportType === 'progress' && (
        <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden animate-fade-in">
          <div className="p-3.5 bg-slate-950 text-slate-300 font-bold border-b border-slate-850 flex justify-between items-center">
            <span>📊 অল ক্যান্ডিডেট ভিসা প্রগ্রেস ডাইনামিক টেবিল</span>
            <span className="text-[10px] text-slate-500">আপডেট: ৬ জুলাই, ২০২৬</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-black border-b border-slate-850 text-[10px]">
                  <th className="p-3 pl-4">আবেদনকারী</th>
                  <th className="p-3">পাসপোর্ট নং</th>
                  <th className="p-3">কোম্পানি ও রুট</th>
                  <th className="p-3">সম্পন্ন ধাপসমূহ</th>
                  <th className="p-3">চলতি ধাপ (Current)</th>
                  <th className="p-3 text-right pr-4">ভিসা স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {approvedCandidates.map((cand) => {
                  const completedSteps = cand.visaSteps?.filter(s => s.status === 'Completed').length || 0;
                  const currentStep = cand.visaSteps?.find(s => s.status === 'Pending' || s.status === 'Processing')?.name || ' Departure';
                  
                  return (
                    <tr key={cand.id} className="hover:bg-slate-900/30">
                      <td className="p-3 pl-4 font-bold text-white">{cand.candidateName}</td>
                      <td className="p-3 font-mono text-slate-400">{cand.passportNumber}</td>
                      <td className="p-3 text-slate-350">{cand.company || 'Italy Agrisport'}</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">{completedSteps} / {steps.length} সম্পন্ন</td>
                      <td className="p-3 text-indigo-400 font-bold">{currentStep}</td>
                      <td className="p-3 text-right pr-4">
                        <span className="px-2 py-0.5 rounded text-[8.5px] font-black uppercase bg-emerald-500/10 text-emerald-400">
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT TYPE 2: PAYMENT */}
      {reportType === 'payment' && (
        <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden animate-fade-in">
          <div className="p-3.5 bg-slate-950 text-slate-300 font-bold border-b border-slate-850">
            💸 ফাইনান্সিয়াল অডিট ও বকেয়া ক্যাশ ফ্লো রিপোর্ট
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-black border-b border-slate-850 text-[10px]">
                  <th className="p-3 pl-4">আবেদনকারী</th>
                  <th className="p-3">মোট চুক্তি ফি</th>
                  <th className="p-3">পরিশোধিত কিস্তি পরিমাণ</th>
                  <th className="p-3">বকেয়া পরিমাণ</th>
                  <th className="p-3 text-right pr-4">পরিশোধের অগ্রগতি</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {approvedCandidates.map((cand) => {
                  const bal = calculateCandidateBalance(cand, steps, paymentConfig);
                  const payRatio = bal.totalContract > 0 ? Math.round((bal.totalPaid / bal.totalContract) * 100) : 0;
                  
                  return (
                    <tr key={cand.id} className="hover:bg-slate-900/30">
                      <td className="p-3 pl-4 font-bold text-white">{cand.candidateName}</td>
                      <td className="p-3 font-mono text-white">৳{bal.totalContract.toLocaleString()}</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">৳{bal.totalPaid.toLocaleString()}</td>
                      <td className="p-3 font-mono text-rose-400 font-bold">৳{bal.totalDue.toLocaleString()}</td>
                      <td className="p-3 text-right pr-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                          payRatio >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {payRatio}% পরিশোধিত
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT TYPE 3: AGENCY */}
      {reportType === 'agency' && (
        <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-4 animate-fade-in text-[11px]">
          <span className="text-xs font-black text-slate-200 block border-b border-slate-900 pb-2">
            🏢 এজেন্সিসমূহ পারফরম্যান্স ও ট্রানজেকশন স্পিড র্যাংকিং (Agency Performance Ranking)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-850 space-y-1">
              <strong className="text-white block font-bold">Gulf Careers Bangladesh</strong>
              <p className="text-[10px] text-slate-400">মোট সক্রিয় ফাইল: ৫ জন ক্যান্ডিডেট</p>
              <div className="flex justify-between items-center text-[10px] pt-1">
                <span className="text-slate-400">এপ্রুভাল স্পিড:</span>
                <span className="text-emerald-400 font-black">⭐⭐⭐⭐⭐ 98%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-850 space-y-1">
              <strong className="text-white block font-bold">Euro Bangladesh Travels</strong>
              <p className="text-[10px] text-slate-400">মোট সক্রিয় ফাইল: ২ জন ক্যান্ডিডেট</p>
              <div className="flex justify-between items-center text-[10px] pt-1">
                <span className="text-slate-400">এপ্রুভাল স্পিড:</span>
                <span className="text-emerald-400 font-black">⭐⭐⭐⭐ 85%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-850 space-y-1">
              <strong className="text-white block font-bold">Rony Travels Agency</strong>
              <p className="text-[10px] text-slate-400">মোট সক্রিয় ফাইল: ১ জন ক্যান্ডিডেট</p>
              <div className="flex justify-between items-center text-[10px] pt-1">
                <span className="text-slate-400">এপ্রুভাল স্পিড:</span>
                <span className="text-emerald-400 font-black">⭐⭐⭐ 72%</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


// ==========================================
// 11. DETAILED SYSTEM SETTINGS & PERMISSIONS
// ==========================================
interface SettingsSubTabProps {
  addLog: (user: string, action: string, type?: string) => void;
  activeStaff: StaffMember;
}

export function VisaSettingsSubTab({
  addLog,
  activeStaff
}: SettingsSubTabProps) {

  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);

  const handleToggleRule = (ruleId: string) => {
    setSettings(prev => {
      const updatedRules = prev.workflowRules.map(r => {
        if (r.id === ruleId) {
          const toggled = !r.enabled;
          addLog(activeStaff.name, `ওয়ার্কফ্লো রুল "${r.name}" পরিবর্তন করে ${toggled ? 'Enabled' : 'Disabled'} করেছেন।`, 'warning');
          return { ...r, enabled: toggled };
        }
        return r;
      });
      return { ...prev, workflowRules: updatedRules };
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-[11px]">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-[11px]">
        
        {/* Status color pickers */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
          <span className="text-xs font-black text-emerald-400 block border-b border-slate-900 pb-2 uppercase">
            🎨 ভিসা প্রসেস স্ট্যাটাস কালার স্কিম (Status Colors Configuration)
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 uppercase font-bold">Pending (অপেক্ষমাণ) কালার</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.statusColors.Pending}
                  onChange={(e) => setSettings(prev => ({ ...prev, statusColors: { ...prev.statusColors, Pending: e.target.value } }))}
                  className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                />
                <span className="font-mono text-slate-300 font-bold">{settings.statusColors.Pending}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 uppercase font-bold">Processing (চলতি) কালার</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.statusColors.Processing}
                  onChange={(e) => setSettings(prev => ({ ...prev, statusColors: { ...prev.statusColors, Processing: e.target.value } }))}
                  className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                />
                <span className="font-mono text-slate-300 font-bold">{settings.statusColors.Processing}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 uppercase font-bold">Completed (সম্পন্ন) কালার</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.statusColors.Completed}
                  onChange={(e) => setSettings(prev => ({ ...prev, statusColors: { ...prev.statusColors, Completed: e.target.value } }))}
                  className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                />
                <span className="font-mono text-slate-300 font-bold">{settings.statusColors.Completed}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 uppercase font-bold">Rejected (প্রত্যাখ্যাত) কালার</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.statusColors.Rejected}
                  onChange={(e) => setSettings(prev => ({ ...prev, statusColors: { ...prev.statusColors, Rejected: e.target.value } }))}
                  className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                />
                <span className="font-mono text-slate-300 font-bold">{settings.statusColors.Rejected}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Lock Rules checklist */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3.5">
          <span className="text-xs font-black text-indigo-400 block border-b border-slate-900 pb-2 uppercase">
            🛡️ কিস্তি ট্র্যাকিং ও প্রগ্রেস ওয়ার্কফ্লো লক রুলস (Strict Validation Rules)
          </span>

          <div className="space-y-2">
            {settings.workflowRules.map(rule => (
              <div key={rule.id} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-900 flex justify-between items-center">
                <div className="space-y-0.5 pr-2">
                  <strong className="text-white block font-bold">{rule.name}</strong>
                  <p className="text-[9.5px] text-slate-400">{rule.description}</p>
                </div>
                
                <button 
                  onClick={() => handleToggleRule(rule.id)}
                  className={`py-1 px-3.5 font-bold rounded-lg text-[9.5px] ${
                    rule.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-950 text-slate-500'
                  }`}
                >
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role permission matrix */}
      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-3.5">
        <span className="text-xs font-black text-slate-200 block border-b border-slate-900 pb-2 uppercase">
          🔑 সিস্টেম ব্যবহারকারী অ্যাক্সেস পারমিশন ম্যাট্রিক্স (Role Permissions Matrix)
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[10.5px]">
            <thead>
              <tr className="border-b border-slate-850 text-slate-450 uppercase font-black pb-2">
                <th className="py-2">ইউজার রোল (User Role)</th>
                <th className="py-2">ভিসা প্রসেস ধাপ দেখুন</th>
                <th className="py-2">ধাপ সম্পাদন এপ্রুভ করুন</th>
                <th className="py-2">ডকুমেন্ট স্ক্যান আপলোড</th>
                <th className="py-2">পেমেন্ট ভেরিফাই করুন</th>
                <th className="py-2">টেমপ্লেট তৈরি করুন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              <tr>
                <td className="py-2 font-bold text-white">Super Admin</td>
                <td className="py-2 text-emerald-400 font-bold">Yes ✓</td>
                <td className="py-2 text-emerald-400 font-bold">Yes ✓</td>
                <td className="py-2 text-emerald-400 font-bold">Yes ✓</td>
                <td className="py-2 text-emerald-400 font-bold">Yes ✓</td>
                <td className="py-2 text-emerald-400 font-bold">Yes ✓</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-slate-300">Internal Staff</td>
                <td className="py-2 text-emerald-400 font-bold">Yes ✓</td>
                <td className="py-2 text-emerald-400 font-bold">Yes ✓</td>
                <td className="py-2 text-emerald-400 font-bold">Yes ✓</td>
                <td className="py-2 text-slate-500">Read Only</td>
                <td className="py-2 text-slate-500">Read Only</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-indigo-400">Partner Agency</td>
                <td className="py-2 text-emerald-400 font-bold">Yes ✓</td>
                <td className="py-2 text-amber-500 font-bold">Request Only</td>
                <td className="py-2 text-emerald-400 font-bold">Yes ✓</td>
                <td className="py-2 text-slate-500">No Access</td>
                <td className="py-2 text-slate-500">No Access</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-slate-400">Candidate (Applicant)</td>
                <td className="py-2 text-emerald-400 font-bold">Yes ✓</td>
                <td className="py-2 text-slate-500">No Access</td>
                <td className="py-2 text-emerald-400 font-bold">Yes ✓</td>
                <td className="py-2 text-slate-500">No Access</td>
                <td className="py-2 text-slate-500">No Access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
