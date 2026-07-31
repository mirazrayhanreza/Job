import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, CheckCircle, Clock, XCircle, AlertTriangle, 
  Settings, Lock, Star, Eye, Plus, Search, Check, X, RefreshCw, 
  Sliders, Landmark, FileText, ArrowRight, ShieldAlert, BadgeCheck, Copy
} from 'lucide-react';
import { AgentBankAccount, ClientPaymentSubmission, AdminBankSettings, BankAccountStatus } from '../../types/bank';
import { Company } from '../../mockData';

interface AdminBankVerifierProps {
  bankAccounts: AgentBankAccount[];
  clientPayments: ClientPaymentSubmission[];
  adminBankSettings: AdminBankSettings;
  companies: Company[];
  onUpdateAgentBankAccountStatus: (id: string, status: BankAccountStatus, rejectionReason?: string) => void;
  onUpdateAgentBankAccount: (id: string, updates: Partial<AgentBankAccount>) => void;
  onAddAgentBankAccount: (account: Omit<AgentBankAccount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteAgentBankAccount: (id: string) => void;
  onVerifyClientPaymentByAdmin: (id: string, notes?: string) => void;
  onUpdateAdminBankSettings: (settings: Partial<AdminBankSettings>) => void;
}

export const AdminBankVerifier: React.FC<AdminBankVerifierProps> = ({
  bankAccounts = [],
  clientPayments = [],
  adminBankSettings,
  companies = [],
  onUpdateAgentBankAccountStatus,
  onUpdateAgentBankAccount,
  onAddAgentBankAccount,
  onDeleteAgentBankAccount,
  onVerifyClientPaymentByAdmin,
  onUpdateAdminBankSettings
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'rbac' | 'escrow' | 'audit'>('queue');
  const [statusFilter, setStatusFilter] = useState<string>('Pending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [agencyFilter, setAgencyFilter] = useState<string>('All');

  // Rejection modal
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Admin notes for payment audit
  const [auditingPayId, setAuditingPayId] = useState<string | null>(null);
  const [adminAuditNote, setAdminAuditNote] = useState<string>('');

  // Admin company escrow account modal
  const [showAddAdminEscrowModal, setShowAddAdminEscrowModal] = useState<boolean>(false);
  const [adminBankName, setAdminBankName] = useState('Sonali Bank Ltd (Central Escrow)');
  const [adminAccountName, setAdminAccountName] = useState('Probashi Jobs Escrow Ltd');
  const [adminAccountNumber, setAdminAccountNumber] = useState('4401201987623');
  const [adminBranch, setAdminBranch] = useState('Dhaka Central Branch');
  const [adminRouting, setAdminRouting] = useState('20027001');

  // Local state for RBAC toggles before saving
  const [rbacSettings, setRbacSettings] = useState<AdminBankSettings>(adminBankSettings);

  const handleRbacSave = () => {
    onUpdateAdminBankSettings(rbacSettings);
    alert('✅ RBAC ব্যাংক নিরাপত্তা পলিসি সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleApprove = (id: string) => {
    onUpdateAgentBankAccountStatus(id, 'Approved');
    onUpdateAgentBankAccount(id, { isVerifiedBadge: true });
    alert('✅ ব্যাংক অ্যাকাউন্টটি সফলভাবে অনুমোদিত হয়েছে! এটি এখন নির্দেশিত ক্লায়েন্টদের পেমেন্ট পোর্টালে প্রদর্শিত হবে।');
  };

  const handleRejectSubmit = () => {
    if (!rejectingId) return;
    if (!rejectionReason.trim()) {
      alert('অনুগ্রহ করে প্রত্যাখ্যানের কারণ লিখুন।');
      return;
    }
    onUpdateAgentBankAccountStatus(rejectingId, 'Rejected', rejectionReason);
    setRejectingId(null);
    setRejectionReason('');
    alert('🔴 ব্যাংক অ্যাকাউন্টটি প্রত্যাখ্যান করা হয়েছে। এজেন্সিকে অবহিত করা হয়েছে।');
  };

  const handleAdminAddEscrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAgentBankAccount({
      agencyId: 'admin',
      agencyName: 'Probashi Jobs Official Escrow',
      bankName: adminBankName,
      accountName: adminAccountName,
      accountNumber: adminAccountNumber,
      branchName: adminBranch || undefined,
      routingNumber: adminRouting || undefined,
      paymentMethod: 'Bank Transfer',
      country: 'All',
      status: 'Approved',
      isActive: true,
      isPriority: true,
      isVerifiedBadge: true,
      isAdminCompanyAccount: true,
      notes: 'Official platform central escrow account for guaranteed candidate safety.'
    });

    setShowAddAdminEscrowModal(false);
    alert('✅ প্ল্যাটফর্ম অফিশিয়াল এসক্রো ব্যাংক অ্যাকাউন্ট যোগ করা হয়েছে!');
  };

  // Filter bank accounts
  const filteredBankAccounts = bankAccounts.filter(acc => {
    const matchesStatus = statusFilter === 'All' || acc.status === statusFilter;
    const matchesAgency = agencyFilter === 'All' || acc.agencyId === agencyFilter;
    const matchesSearch = searchQuery === '' || 
      acc.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.accountNumber.includes(searchQuery);
    return matchesStatus && matchesAgency && matchesSearch;
  });

  // Metrics
  const totalAccounts = bankAccounts.length;
  const pendingQueueCount = bankAccounts.filter(a => a.status === 'Pending').length;
  const approvedCount = bankAccounts.filter(a => a.status === 'Approved').length;
  const rejectedCount = bankAccounts.filter(a => a.status === 'Rejected').length;
  const adminEscrowAccounts = bankAccounts.filter(a => a.isAdminCompanyAccount || a.agencyId === 'admin');

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" /> Admin Central Audit Hub
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Role-Based Access Control (RBAC)</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white mt-1.5 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-400" /> এজেন্সির ব্যাংক অ্যাকাউন্ট ভেরিফিকেশন ও সিকিউরিটি কন্ট্রোল
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              রিক্রুটিং এজেন্সিগুলোর যুক্ত করা ব্যাংক অ্যাকাউন্ট যাচাই ও অনুমোদন করুন। সিকিউরিটি নীতি অনুযায়ী কোনো ক্লায়েন্ট যেন ভিন্ন এজেন্সির অ্যাকাউন্ট দেখতে না পায় তা নিশ্চিত করা হয়।
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveSubTab('rbac')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Settings className="w-4 h-4" /> RBAC পলিসি সেটিং
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-semibold">মোট রেজিস্টার্ড অ্যাকাউন্ট</span>
            <span className="text-lg font-black text-white">{totalAccounts} টি</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-amber-900/40">
            <span className="text-amber-400 text-[10px] block font-semibold">ভেরিফিকেশনের অপেক্ষায় (Pending)</span>
            <span className="text-lg font-black text-amber-400">{pendingQueueCount} টি</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-emerald-900/40">
            <span className="text-emerald-400 text-[10px] block font-semibold">অনুমোদিত (Live)</span>
            <span className="text-lg font-black text-emerald-400">{approvedCount} টি</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-rose-900/40">
            <span className="text-rose-400 text-[10px] block font-semibold">প্রত্যাখ্যাত / ব্লকড</span>
            <span className="text-lg font-black text-rose-400">{rejectedCount} টি</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('queue')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'queue'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" /> এজেন্সি ব্যাংক ভেরিফিকেশন কিউ ({pendingQueueCount})
          </button>
          <button
            onClick={() => setActiveSubTab('rbac')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'rbac'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-400" /> RBAC সিকিউরিটি ও পলিসি
          </button>
          <button
            onClick={() => setActiveSubTab('escrow')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'escrow'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Landmark className="w-4 h-4 text-indigo-400" /> অফিশিয়াল এসক্রো অ্যাকাউন্টস ({adminEscrowAccounts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'audit'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-400" /> ক্লায়েন্ট পেমেন্ট লেজার ({clientPayments.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: AGENCY BANK VERIFICATION QUEUE */}
      {activeSubTab === 'queue' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              {['Pending', 'Approved', 'Suspended', 'Rejected', 'All'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'Pending' ? '⏳ ভেরিফিকেশন পেন্ডিং' :
                   st === 'Approved' ? '🟢 অনুমোদিত (Approved)' :
                   st === 'Suspended' ? '⛔ স্থগিত' :
                   st === 'Rejected' ? '🔴 প্রত্যাখ্যাত' : 'সব অ্যাকাউন্ট'}
                </button>
              ))}
            </div>

            <div className="flex gap-2 min-w-[280px]">
              <select
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="All">সব এজেন্সি</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Cards Table */}
          {filteredBankAccounts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-black text-slate-800">কোনো অ্যাকাউন্ট ভেরিফিকেশনের জন্য বাকি নেই</h3>
              <p className="text-xs text-slate-400">এই ফিল্টারে কোনো এজেন্সির ব্যাংক অ্যাকাউন্ট সাবমিশন পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBankAccounts.map((acc) => (
                <div 
                  key={acc.id}
                  className={`bg-white rounded-3xl border p-5 shadow-sm space-y-4 transition ${
                    acc.status === 'Approved' ? 'border-emerald-200' :
                    acc.status === 'Pending' ? 'border-amber-300 bg-amber-50/20' :
                    acc.status === 'Suspended' ? 'border-slate-300 bg-slate-50' : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  {/* Agency Header */}
                  <div className="flex items-start justify-between border-b pb-3 gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        এজেন্সি: {acc.agencyName}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-1">{acc.bankName}</h4>
                      <p className="text-[11px] text-slate-500">
                        মেথড: <strong>{acc.paymentMethod}</strong> | টার্গেট: <strong className="text-slate-800">{acc.country}</strong>
                      </p>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                      acc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      acc.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      acc.status === 'Suspended' ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {acc.status}
                    </span>
                  </div>

                  {/* Account Numbers */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-normal">Holder Name:</span>
                      <strong className="text-slate-900">{acc.accountName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-normal">Account Number:</span>
                      <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {acc.accountNumber}
                      </span>
                    </div>
                    {acc.branchName && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 font-normal">Branch:</span>
                        <span className="text-slate-700">{acc.branchName}</span>
                      </div>
                    )}
                    {acc.routingNumber && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 font-normal">Routing / Swift:</span>
                        <span className="font-mono text-slate-600">{acc.routingNumber} / {acc.swiftCode || '-'}</span>
                      </div>
                    )}
                  </div>

                  {acc.notes && (
                    <p className="text-[11px] text-slate-600 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                      📝 এজেন্সির নোটিশ: {acc.notes}
                    </p>
                  )}

                  {/* Admin Actions */}
                  <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateAgentBankAccount(acc.id, { isVerifiedBadge: !acc.isVerifiedBadge })}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                          acc.isVerifiedBadge 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                        {acc.isVerifiedBadge ? 'Verified Badge' : '+ Verify Badge'}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      {acc.status !== 'Approved' && (
                        <button
                          onClick={() => handleApprove(acc.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black transition shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> অনুমোদন দিন (Approve)
                        </button>
                      )}

                      {acc.status !== 'Rejected' && (
                        <button
                          onClick={() => setRejectingId(acc.id)}
                          className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> রিজেক্ট করুন
                        </button>
                      )}

                      {acc.status === 'Approved' && (
                        <button
                          onClick={() => onUpdateAgentBankAccountStatus(acc.id, 'Suspended')}
                          className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold transition cursor-pointer"
                        >
                          ⛔ স্থগিত করুন
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: RBAC POLICY & SECURITY SETTINGS */}
      {activeSubTab === 'rbac' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" /> Role-Based Access Control (RBAC) ও পেমেন্ট সিকিউরিটি পলিসি
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              সিকিউরিটি সেটিংস পরিবর্তন করুন। এটি নিশ্চিত করে যে কোনো সাধারণ ইউজার/ক্লায়েন্ট অননুমোদিত বা ভিন্ন এজেন্সির ব্যাংক একাউন্ট দেখতে পারবে না।
            </p>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            
            {/* Setting Item 1 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> শুধুমাত্র বরাদ্দকৃত এজেন্সির ব্যাংক একাউন্ট প্রদর্শন (Strict Agency Isolation)
                </h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  সক্রিয় থাকলে, একজন ক্লায়েন্ট বা ক্যান্ডিডেট শুধুমাত্র যে এজেন্সির মাধ্যমে বিদেশ যাচ্ছেন সেই এজেন্সির ভেরিফাইড ব্যাংক একাউন্টই দেখতে পাবেন। অন্য কোনো এজেন্সির একাউন্ট সম্পূর্ণ হাইড থাকবে।
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={rbacSettings.showOnlyAssignedAgencyAccount}
                  onChange={(e) => setRbacSettings({ ...rbacSettings, showOnlyAssignedAgencyAccount: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Setting Item 2 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-indigo-600" /> প্ল্যাটফর্ম অফিশিয়াল এসক্রো অ্যাকাউন্ট ব্যাকআপ হিসেবে প্রদর্শন
                </h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  সক্রিয় থাকলে, এজেন্সির ব্যাংকের পাশাপাশি কেন্দ্রীয় Probashi Jobs Official Escrow অ্যাকাউন্টটি ক্যান্ডিডেটকে অতিরিক্ত বিকল্প হিসেবে প্রদর্শন করা হবে।
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={rbacSettings.showAdminCompanyAccount}
                  onChange={(e) => setRbacSettings({ ...rbacSettings, showAdminCompanyAccount: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Setting Item 3 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" /> প্রাইমারি ডিফল্ট অ্যাকাউন্ট হাইলাইট
                </h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  এজেন্সি যে ব্যাংকটিকে প্রাইমারি হিসেবে চিহ্নিত করবে পেমেন্ট পেজে সেটিকে সবার উপরে হাইলাইট করে দেখানো হবে।
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={rbacSettings.priorityAccountEnabled}
                  onChange={(e) => setRbacSettings({ ...rbacSettings, priorityAccountEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Setting Item 4 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-blue-600" /> ভেরিফাইড এজেন্সির ব্যাজ পেমেন্ট কার্ডে প্রদর্শন
                </h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  অ্যাডমিন কর্তৃক অনুমোদিত হলে ক্যান্ডিডেট পেমেন্ট কার্ডের উপর 🟢 Verified Agency Account ব্যাজটি দেখতে পাবে।
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={rbacSettings.verifyBadgeEnabled}
                  onChange={(e) => setRbacSettings({ ...rbacSettings, verifyBadgeEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Setting Item 5 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-600" /> কান্ট্রি অনুযায়ী ব্যাংক একাউন্ট ফিল্টারিং
                </h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  প্রার্থীর গন্তব্য দেশ (যেমন: সৌদি আরব, ইতালি) অনুযায়ী এজেন্সির নির্দিষ্ট ব্যাংক অ্যাকাউন্ট প্রদর্শন করা হবে।
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={rbacSettings.countryWiseAccountEnabled}
                  onChange={(e) => setRbacSettings({ ...rbacSettings, countryWiseAccountEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              onClick={handleRbacSave}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            >
              সেটিংস সংরক্ষণ করুন (Save RBAC Policy)
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: OFFICIAL ESCROW ACCOUNTS */}
      {activeSubTab === 'escrow' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600" /> প্ল্যাটফর্ম সেন্ট্রাল অফিশিয়াল এসক্রো ব্যাংক অ্যাকাউন্টসমূহ
              </h3>
              <p className="text-xs text-slate-500">
                প্রার্থীদের সর্বোচ্চ নিরাপত্তার জন্য প্ল্যাটফর্মের নিজস্ব ট্রাস্ট / এসক্রো ব্যাংক বিবরণী।
              </p>
            </div>

            <button
              onClick={() => setShowAddAdminEscrowModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> অফিশিয়াল একাউন্ট যোগ করুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminEscrowAccounts.map((acc) => (
              <div key={acc.id} className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-black text-indigo-950">{acc.bankName}</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                    Official Escrow
                  </span>
                </div>
                <div className="text-xs space-y-1 font-semibold text-slate-700">
                  <p>Holder: <strong>{acc.accountName}</strong></p>
                  <p className="font-mono text-sm bg-white p-1.5 rounded border border-indigo-100 font-bold">
                    {acc.accountNumber}
                  </p>
                  <p className="text-[11px] text-slate-500">Branch: {acc.branchName || 'Main Branch'}</p>
                </div>
                <p className="text-[10.5px] text-indigo-900 italic font-medium">💡 {acc.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CLIENT PAYMENTS AUDIT LEDGER */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> অল-প্ল্যাটফর্ম ক্লায়েন্ট পেমেন্ট স্লিপ অডিট লেজার
            </h3>
            <p className="text-xs text-slate-500">
              এজেন্সি কর্তৃক কনফার্মকৃত পেমেন্ট স্লিপসমূহ অ্যাডমিন রিভিউ করে ফাইনাল লেজারে সিঙ্ক করুন।
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-slate-400 font-bold uppercase text-[10px] bg-slate-50">
                  <th className="p-3">প্রার্থী নাম</th>
                  <th className="p-3">এজেন্সি</th>
                  <th className="p-3">পরিমাণ</th>
                  <th className="p-3">TxID & ব্যাংক</th>
                  <th className="p-3">এজেন্সি কনফার্মেশন</th>
                  <th className="p-3">অ্যাডমিন অডিট</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {clientPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 transition font-medium">
                    <td className="p-3 text-slate-900 font-bold">{pay.candidateName}</td>
                    <td className="p-3 text-blue-600 font-bold">{pay.agencyName}</td>
                    <td className="p-3 font-mono font-black text-slate-900">৳{pay.amount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border text-[11px] font-bold">
                        {pay.txID}
                      </span>
                      <span className="block text-[10px] text-slate-500">{pay.bankName}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pay.agentConfirmation === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pay.agentConfirmation}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pay.adminVerification === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {pay.adminVerification}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {pay.adminVerification !== 'Verified' ? (
                        <button
                          onClick={() => {
                            onVerifyClientPaymentByAdmin(pay.id, 'Admin Ledger Verified');
                            alert('✅ ফাইনাল অডিট সমাপ্ত ও লেজার আপডেট করা হয়েছে!');
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10.5px] font-bold transition shadow-sm cursor-pointer"
                        >
                          ফাইনাল ভেরিফাই
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold">Verified ✅</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: REJECT REASON */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-scale-up">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" /> ব্যাংক অ্যাকাউন্ট প্রত্যাখ্যানের কারণ
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">এজেন্সি কেন রিজেক্ট হচ্ছে লিখুন:</label>
              <textarea
                rows={3}
                placeholder="যেমন: প্রদানকৃত অ্যাকাউন্ট নম্বরটিতে এজেন্সির ট্রেড লাইসেন্স ও টাইটেল মিল পাওয়া যায়নি।"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setRejectingId(null)}
                className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleRejectSubmit}
                className="w-1/2 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition shadow-md cursor-pointer"
              >
                প্রত্যাখ্যান কনফার্ম
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD ADMIN ESCROW ACCOUNT */}
      {showAddAdminEscrowModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-indigo-600" /> অফিশিয়াল এসক্রো অ্যাকাউন্ট
              </h3>
              <button onClick={() => setShowAddAdminEscrowModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminAddEscrowSubmit} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">ব্যাংকের নাম</label>
                <input
                  type="text"
                  value={adminBankName}
                  onChange={(e) => setAdminBankName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">অ্যাকোউন্ট নাম (Holder)</label>
                <input
                  type="text"
                  value={adminAccountName}
                  onChange={(e) => setAdminAccountName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">অ্যাকোউন্ট নম্বর</label>
                <input
                  type="text"
                  value={adminAccountNumber}
                  onChange={(e) => setAdminAccountNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">ব্রাঞ্চ ও রাউটিং</label>
                <input
                  type="text"
                  value={adminBranch}
                  onChange={(e) => setAdminBranch(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAdminEscrowModal(false)}
                  className="w-1/2 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBankVerifier;
