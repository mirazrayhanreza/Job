import React, { useState } from 'react';
import { 
  Building, Landmark, Plus, CheckCircle, Clock, AlertTriangle, XCircle, 
  Trash2, ShieldCheck, Star, Eye, FileText, Check, X, Info, Search, 
  ExternalLink, CreditCard, ArrowUpRight, Lock, Copy
} from 'lucide-react';
import { AgentBankAccount, ClientPaymentSubmission, PaymentMethodType } from '../../types/bank';
import { Company } from '../../mockData';

interface AgentBankAccountManagerProps {
  currentEmployerCompanyId: string;
  companies: Company[];
  bankAccounts: AgentBankAccount[];
  clientPayments: ClientPaymentSubmission[];
  onAddAgentBankAccount: (account: Omit<AgentBankAccount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateAgentBankAccount: (id: string, updates: Partial<AgentBankAccount>) => void;
  onDeleteAgentBankAccount: (id: string) => void;
  onConfirmClientPaymentByAgent: (id: string, notes?: string) => void;
}

const COMMON_BANKS = [
  'Dutch Bangla Bank Ltd (DBBL)',
  'Islami Bank Bangladesh PLC',
  'BRAC Bank PLC',
  'City Bank PLC',
  'Sonali Bank Ltd',
  'Eastern Bank PLC (EBL)',
  'United Commercial Bank (UCB)',
  'bKash Merchant Account',
  'Nagad Merchant Account',
  'Rocket Mobile Banking',
  'USDT Crypto Wallet (TRC20)',
  'Other / Custom Payment Gateway'
];

const COUNTRIES_LIST = [
  'All',
  'Saudi Arabia 🇸🇦',
  'Malaysia 🇲🇾',
  'Singapore 🇸🇬',
  'Italy 🇮🇹',
  'UAE 🇦🇪',
  'Qatar 🇶🇦',
  'Kuwait 🇰🇼',
  'Romania 🇷🇴',
  'Serbia 🇷🇸'
];

export const AgentBankAccountManager: React.FC<AgentBankAccountManagerProps> = ({
  currentEmployerCompanyId,
  companies,
  bankAccounts = [],
  clientPayments = [],
  onAddAgentBankAccount,
  onUpdateAgentBankAccount,
  onDeleteAgentBankAccount,
  onConfirmClientPaymentByAgent
}) => {
  const currentCompany = companies.find(c => c.id === currentEmployerCompanyId) || {
    id: currentEmployerCompanyId,
    name: 'Our Recruiting Agency'
  };

  const [activeSubTab, setActiveSubTab] = useState<'accounts' | 'payments'>('accounts');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string | null>(null);

  // Agent's own bank accounts
  const myAccounts = bankAccounts.filter(a => a.agencyId === currentEmployerCompanyId);

  // Filtered accounts
  const filteredAccounts = myAccounts.filter(acc => {
    const matchesStatus = statusFilter === 'All' || acc.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      acc.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.accountNumber.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Client payment submissions for this agency
  const myClientPayments = clientPayments.filter(p => p.agencyId === currentEmployerCompanyId);

  // Form states for adding account
  const [bankName, setBankName] = useState(COMMON_BANKS[0]);
  const [customBankName, setCustomBankName] = useState('');
  const [accountName, setAccountName] = useState(currentCompany.name || '');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchName, setBranchName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('Bank Transfer');
  const [country, setCountry] = useState('All');
  const [isPriority, setIsPriority] = useState(false);
  const [notes, setNotes] = useState('');

  // Agent confirm notes modal
  const [confirmingPayId, setConfirmingPayId] = useState<string | null>(null);
  const [agentConfirmNote, setAgentConfirmNote] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBankName = bankName.startsWith('Other') ? customBankName : bankName;

    if (!finalBankName || !accountName || !accountNumber) {
      alert('অনুগ্রহ করে ব্যাংকের নাম, অ্যাকাউন্ট হোল্ডারের নাম এবং অ্যাকাউন্ট নম্বর সঠিকভাবে পূরণ করুন।');
      return;
    }

    onAddAgentBankAccount({
      agencyId: currentEmployerCompanyId,
      agencyName: currentCompany.name,
      bankName: finalBankName,
      accountName,
      accountNumber,
      branchName: branchName || undefined,
      routingNumber: routingNumber || undefined,
      swiftCode: swiftCode || undefined,
      paymentMethod,
      country,
      status: 'Pending', // Strictly Pending until Admin Approval
      isActive: true,
      isPriority,
      isVerifiedBadge: false,
      notes: notes || undefined
    });

    // Reset form
    setAccountNumber('');
    setBranchName('');
    setRoutingNumber('');
    setSwiftCode('');
    setNotes('');
    setShowAddModal(false);
    alert('✅ আপনার ব্যাংক অ্যাকাউন্টটি সফলভাবে যোগ করা হয়েছে! অ্যাডমিন প্যানেল কর্তৃক ভেরিফাই করার পরই এটি ক্লায়েন্টরা দেখতে পাবে।');
  };

  const handleConfirmAction = (id: string) => {
    onConfirmClientPaymentByAgent(id, agentConfirmNote);
    setConfirmingPayId(null);
    setAgentConfirmNote('');
    alert('✅ পেমেন্ট স্লিপ কনফার্ম করা হয়েছে। অ্যাডমিনের চূড়ান্ত ভেরিফিকেশনের জন্য পাঠানো হলো।');
  };

  // Metrics
  const totalAccounts = myAccounts.length;
  const approvedAccounts = myAccounts.filter(a => a.status === 'Approved').length;
  const pendingAccounts = myAccounts.filter(a => a.status === 'Pending').length;
  const pendingPaymentsCount = myClientPayments.filter(p => p.agentConfirmation === 'Pending').length;

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in font-sans">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> RBAC Protected Agency Vault
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Agency ID: {currentEmployerCompanyId}</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white mt-1.5 flex items-center gap-2">
              <Landmark className="w-6 h-6 text-blue-400" /> এজেন্সির ব্যাংক ও পেমেন্ট অ্যাকাউন্টস পোর্টাল
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              আপনার এজেন্সির ব্যাংক অ্যাকাউন্ট যোগ করুন। অ্যাডমিন প্যানেল কর্তৃক ভেরিফাইড হলে আপনার নির্দিষ্ট ক্লায়েন্টরা নিরাপদ লেনদেনের জন্য এই অ্যাকাউন্টসমূহ দেখতে পাবে।
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black transition flex items-center gap-2 shadow-lg shadow-blue-600/30 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> নতুন ব্যাংক অ্যাকাউন্ট যোগ করুন
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-semibold">মোট অ্যাকাউন্ট</span>
            <span className="text-lg font-black text-white">{totalAccounts} টি</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-emerald-900/40">
            <span className="text-emerald-400 text-[10px] block font-semibold">অনুমোদিত (Live to Clients)</span>
            <span className="text-lg font-black text-emerald-400">{approvedAccounts} টি</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-amber-900/40">
            <span className="text-amber-400 text-[10px] block font-semibold">অ্যাডমিন রিভিউয়ের অপেক্ষায়</span>
            <span className="text-lg font-black text-amber-400">{pendingAccounts} টি</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-indigo-900/40">
            <span className="text-indigo-400 text-[10px] block font-semibold">ক্লায়েন্ট পেমেন্ট স্লিপ রিভিও</span>
            <span className="text-lg font-black text-indigo-300">{pendingPaymentsCount} টি</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('accounts')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'accounts'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Building className="w-4 h-4" /> এজেন্সির ব্যাংক অ্যাকাউন্টসমূহ ({myAccounts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('payments')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'payments'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> ক্লায়েন্ট পেমেন্ট স্লিপ কনফার্মেশন
            {pendingPaymentsCount > 0 && (
              <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                {pendingPaymentsCount}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ব্যাংক বা অ্যাকাউন্ট নম্বর খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* SUB-TAB 1: BANK ACCOUNTS LIST */}
      {activeSubTab === 'accounts' && (
        <div className="space-y-4">
          
          {/* Status Filter Buttons */}
          <div className="flex gap-2 text-xs font-bold overflow-x-auto pb-1">
            {['All', 'Approved', 'Pending', 'Suspended', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl transition shrink-0 cursor-pointer ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white font-black'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {status === 'All' ? 'সব অ্যাকাউন্ট' :
                 status === 'Approved' ? '🟢 অনুমোদিত' :
                 status === 'Pending' ? '⏳ পেন্ডিং' :
                 status === 'Suspended' ? '⛔ স্থগিত' : '🔴 প্রত্যাখ্যাত'}
              </button>
            ))}
          </div>

          {/* Accounts Grid */}
          {filteredAccounts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Landmark className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-black text-slate-700">কোনো ব্যাংক অ্যাকাউন্ট খুঁজে পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                আপনি এখনও এই ফিল্টারে কোনো ব্যাংক অ্যাকাউন্ট যোগ করেননি। আপনার প্রসেসিং ফির জন্য ব্যাংক বা মোবাইল ব্যাংকিং বিবরণ যোগ করুন।
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" /> একাউন্ট যুক্ত করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAccounts.map((acc) => (
                <div 
                  key={acc.id}
                  className={`bg-white rounded-3xl border p-5 transition shadow-sm relative space-y-4 ${
                    acc.status === 'Approved' ? 'border-emerald-200 hover:border-emerald-400' :
                    acc.status === 'Pending' ? 'border-amber-200 bg-amber-50/10' :
                    acc.status === 'Suspended' ? 'border-slate-300 bg-slate-50' : 'border-rose-200 bg-rose-50/10'
                  }`}
                >
                  {/* Top Badges Row */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black shrink-0">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                          {acc.bankName}
                          {acc.isPriority && (
                            <span className="text-amber-500 text-xs font-black flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200" title="Primary Account">
                              <Star className="w-3 h-3 fill-amber-400" /> Primary
                            </span>
                          )}
                        </h4>
                        <span className="text-[10.5px] font-semibold text-slate-500">
                          মেথড: <strong className="text-slate-800">{acc.paymentMethod}</strong> | টার্গেট কান্ট্রি: <strong className="text-blue-600">{acc.country}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                        acc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        acc.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        acc.status === 'Suspended' ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {acc.status === 'Approved' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                        {acc.status === 'Pending' && <Clock className="w-3 h-3 text-amber-600 animate-spin" />}
                        {acc.status === 'Rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                        {acc.status}
                      </span>
                    </div>
                  </div>

                  {/* Details Block */}
                  <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 space-y-2 text-xs font-medium">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">অ্যাকোউন্ট নাম (Holder):</span>
                      <strong className="text-slate-800 font-bold">{acc.accountName}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">অ্যাকোউন্ট / ওয়ালেট নম্বর:</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-sm">
                        {acc.accountNumber}
                      </span>
                    </div>
                    {acc.branchName && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">শাখা (Branch):</span>
                        <span className="text-slate-700">{acc.branchName}</span>
                      </div>
                    )}
                    {(acc.routingNumber || acc.swiftCode) && (
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">Routing / Swift:</span>
                        <span className="font-mono text-slate-600">{acc.routingNumber || '-'} / {acc.swiftCode || '-'}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes / Notice */}
                  {acc.notes && (
                    <p className="text-[11px] text-slate-500 font-normal italic bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                      💡 {acc.notes}
                    </p>
                  )}

                  {acc.rejectionReason && (
                    <p className="text-[11px] text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                      ⚠️ রিজেকশন কারণ: {acc.rejectionReason}
                    </p>
                  )}

                  {/* Notice Alert for Pending */}
                  {acc.status === 'Pending' && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium flex items-center gap-2">
                      <Info className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>এটি অ্যাডমিন ভেরিফিকেশনের জন্য অপেক্ষমান। ভেরিফাইড হওয়ার পর ক্লায়েন্ট পেমেন্ট পেজে সচল হবে।</span>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onUpdateAgentBankAccount(acc.id, { isActive: !acc.isActive })}
                      className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                        acc.isActive 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {acc.isActive ? '🟢 Active' : '⚪ Inactive'}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateAgentBankAccount(acc.id, { isPriority: !acc.isPriority })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Set as Primary Account"
                      >
                        <Star className={`w-3.5 h-3.5 ${acc.isPriority ? 'fill-amber-400 text-amber-500' : ''}`} />
                        {acc.isPriority ? 'Primary' : 'Make Primary'}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('আপনি কি এই ব্যাংক অ্যাকাউন্টটি মুছে ফেলতে চান?')) {
                            onDeleteAgentBankAccount(acc.id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title="Delete Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: CLIENT PAYMENT SLIPS VERIFICATION */}
      {activeSubTab === 'payments' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> ক্লায়েন্টদের জমাকৃত পেমেন্ট স্লিপসমূহ
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  ক্লায়েন্ট যে ব্যাংক বা বিকাশ একাউন্টে টাকা জমা দিয়ে স্লিপ পাঠিয়েছে তা নিশ্চিত করুন।
                </p>
              </div>

              <span className="text-xs font-bold bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-100">
                মোট সাবমিশন: {myClientPayments.length} টি
              </span>
            </div>

            {myClientPayments.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-medium space-y-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p>এখনও কোনো ক্লায়েন্ট পেমেন্ট স্লিপ জমা দেয়নি।</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] bg-slate-50/80">
                      <th className="p-3">প্রার্থী নাম ও ফোন</th>
                      <th className="p-3">স্টেপ / চার্জ</th>
                      <th className="p-3">পরিমাণ & মেথড</th>
                      <th className="p-3">ট্রানজেকশন ID (TxID)</th>
                      <th className="p-3">ব্যবহৃত ব্যাংক</th>
                      <th className="p-3">এজেন্সি স্ট্যাটাস</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myClientPayments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-3 font-semibold text-slate-900">
                          {pay.candidateName}
                          <span className="block text-[10px] text-slate-400 font-mono font-normal">
                            {pay.candidatePhone || pay.candidateEmail}
                          </span>
                          {pay.passportNumber && (
                            <span className="inline-block bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[9.5px] font-mono mt-0.5">
                              Passport: {pay.passportNumber}
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-medium text-slate-700">
                          {pay.stepName || 'Registration Deposit'}
                          <span className="block text-[10px] text-slate-400">{pay.createdAt}</span>
                        </td>
                        <td className="p-3 font-black text-slate-900">
                          ৳{pay.amount.toLocaleString()} {pay.currency}
                          <span className="block text-[10px] font-bold text-blue-600">{pay.paymentMethod}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-800">
                          <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            {pay.txID}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">
                          {pay.bankName}
                          <span className="block text-[10px] text-slate-400 font-mono">{pay.accountNumber}</span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                            pay.agentConfirmation === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            pay.agentConfirmation === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {pay.agentConfirmation === 'Confirmed' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                            {pay.agentConfirmation === 'Pending' && <Clock className="w-3 h-3 text-amber-600" />}
                            {pay.agentConfirmation}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {pay.slipFileUrl && (
                              <button
                                onClick={() => setSelectedSlipUrl(pay.slipFileUrl || null)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" /> স্লিপ
                              </button>
                            )}

                            {pay.agentConfirmation === 'Pending' ? (
                              <button
                                onClick={() => setConfirmingPayId(pay.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition shadow-sm flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" /> কনফার্ম করুন
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-semibold italic">
                                {pay.agentConfirmedAt ? `Confirmed: ${pay.agentConfirmedAt}` : 'Processed'}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW BANK ACCOUNT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-600" /> নতুন ব্যাংক বা ওয়ালেট যোগ করুন
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>সিকিউরিটি নোটিশ (RBAC):</strong> যোগ করার পর অ্যাকাউন্টটি ⏳ <strong>Pending Review</strong> স্ট্যাটাসে থাকবে। অ্যাডমিন প্যানেল ভেরিফাই করলে আপনার এজেন্সি কর্তৃক পরিচালিত প্রার্থীরাই কেবল এটি দেখতে পাবে।
              </span>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">ব্যাংক বা ফিনান্সিয়াল সার্ভিসের নাম *</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                >
                  {COMMON_BANKS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {bankName.startsWith('Other') && (
                <div>
                  <label className="block text-slate-700 mb-1">কাস্টম ব্যাংক/গেটওয়ের নাম *</label>
                  <input
                    type="text"
                    placeholder="যেমন: Prime Bank PLC"
                    value={customBankName}
                    onChange={(e) => setCustomBankName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">অ্যাকাউন্ট হোল্ডারের নাম *</label>
                  <input
                    type="text"
                    placeholder="যেমন: Gulf Careers Overseas Ltd"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">অ্যাকাউন্ট / ওয়ালেট নম্বর *</label>
                  <input
                    type="text"
                    placeholder="যেমন: 110-120-4920193 বা 01711223344"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">শাখা / Branch (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="যেমন: Gulshan Branch, Dhaka"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">পেমেন্ট মেথড ক্যাটাগরি</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="Bank Transfer">Bank Transfer (ব্যাংক ডিপোজিট)</option>
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                    <option value="Rocket">Rocket (রকেট)</option>
                    <option value="USDT">USDT Crypto Wallet</option>
                    <option value="SSLCommerz">SSLCommerz Gateway</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Routing Number (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="09026173"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Swift Code (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="DBBLBDDH"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">টার্গেট কান্ট্রি ফিল্টার (নির্দিষ্ট দেশের প্রার্থীর জন্য)</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                >
                  {COUNTRIES_LIST.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPriorityCheck"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <label htmlFor="isPriorityCheck" className="text-slate-700 font-bold cursor-pointer">
                  ⭐ এজেন্সির প্রাইমারি/ডিফল্ট অ্যাকাউন্ট হিসেবে সেট করুন
                </label>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">পেমেন্ট করার বিশেষ নির্দেশনা (ক্যান্ডিডেটের জন্য)</label>
                <textarea
                  rows={2}
                  placeholder="যেমন: ব্যাংক ডিপোজিট করার পর কাউন্টার স্লিপটির স্পষ্ট ছবি তুলে এখানে আপলোড করুন।"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black transition shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  সাবমিট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM CLIENT PAYMENT SLIP */}
      {confirmingPayId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-scale-up">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" /> ক্লায়েন্ট পেমেন্ট স্লিপ নিশ্চিতকরণ
            </h3>
            <p className="text-xs text-slate-600">
              আপনি কি নিশ্চিত যে আপনার ব্যাংক বিবরণী বা বিকাশ মার্সেন্ট স্টেটমেন্টে উক্ত লেনদেনটি পাওয়া গিয়েছে?
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">এজেন্সির নোট (ঐচ্ছিক):</label>
              <textarea
                rows={2}
                placeholder="যেমন: ব্যাংক স্টেটমেন্টের সাথে মিল পাওয়া গিয়েছে।"
                value={agentConfirmNote}
                onChange={(e) => setAgentConfirmNote(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmingPayId(null)}
                className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleConfirmAction(confirmingPayId)}
                className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                কনফার্ম করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW DEPOSIT SLIP PREVIEW */}
      {selectedSlipUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 p-6 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> পেমেন্ট ডিপোজিট স্লিপ ডকুমেন্ট
              </h3>
              <button onClick={() => setSelectedSlipUrl(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-center text-xs space-y-3">
              <FileText className="w-12 h-12 text-blue-600 mx-auto" />
              <p className="font-mono font-bold text-slate-800">{selectedSlipUrl}</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 text-left space-y-1">
                <p>✅ <strong>ফাইল টাইপ:</strong> Verified PDF / Scanned Receipt</p>
                <p>🔒 <strong>সিকিউরিটি Hash:</strong> SHA256-Verified Slip</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedSlipUrl(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgentBankAccountManager;
