import React, { useState } from 'react';
import { 
  Building, Landmark, ShieldCheck, Copy, Check, Lock, FileText, 
  Upload, Clock, CheckCircle, ArrowRight, CreditCard, Sparkles, X, Info, AlertCircle
} from 'lucide-react';
import { AgentBankAccount, ClientPaymentSubmission, AdminBankSettings } from '../../types/bank';
import { Company } from '../../mockData';

interface CandidateBankViewerProps {
  assignedAgencyId: string;
  assignedAgencyName?: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  passportNumber?: string;
  bankAccounts: AgentBankAccount[];
  clientPayments: ClientPaymentSubmission[];
  adminBankSettings: AdminBankSettings;
  companies: Company[];
  onSubmitClientPayment: (payment: Omit<ClientPaymentSubmission, 'id' | 'agentConfirmation' | 'adminVerification' | 'createdAt'>) => void;
}

export const CandidateBankViewer: React.FC<CandidateBankViewerProps> = ({
  assignedAgencyId,
  assignedAgencyName,
  candidateName,
  candidateEmail,
  candidatePhone,
  passportNumber,
  bankAccounts = [],
  clientPayments = [],
  adminBankSettings,
  companies = [],
  onSubmitClientPayment
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAccountForPay, setSelectedAccountForPay] = useState<AgentBankAccount | null>(null);

  // Form state
  const [payAmount, setPayAmount] = useState<string>('');
  const [payTxId, setPayTxId] = useState<string>('');
  const [stepName, setStepName] = useState<string>('Registration Fee Deposit');
  const [slipFile, setSlipFile] = useState<string>('deposit_slip_receipt.pdf');
  const [showSubmitSuccess, setShowSubmitSuccess] = useState<boolean>(false);

  // Find agency object
  const agencyObj = companies.find(c => c.id === assignedAgencyId) || {
    id: assignedAgencyId,
    name: assignedAgencyName || 'Gulf Careers recruiting agency',
    licenseNumber: 'RL-1452'
  };

  // STRICT RBAC FILTERING:
  // Candidate ONLY sees approved & active accounts of their assigned agency!
  const agencyAccounts = bankAccounts.filter(a => 
    a.agencyId === assignedAgencyId && 
    a.status === 'Approved' && 
    a.isActive === true
  );

  // If Admin settings allow, append Admin Escrow Account
  const escrowAccounts = adminBankSettings.showAdminCompanyAccount 
    ? bankAccounts.filter(a => a.isAdminCompanyAccount && a.status === 'Approved')
    : [];

  const visibleAccounts = [...agencyAccounts, ...escrowAccounts];

  // Candidate's own submitted payments
  const mySubmissions = clientPayments.filter(p => 
    p.candidateEmail.toLowerCase() === candidateEmail.toLowerCase() ||
    p.candidateName.includes(candidateName)
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountForPay) return;
    if (!payAmount || !payTxId) {
      alert('অনুগ্রহ করে টাকার পরিমাণ এবং ট্রানজেকশন ID সঠিকভাবে দিন।');
      return;
    }

    onSubmitClientPayment({
      candidateName,
      candidateEmail,
      candidatePhone,
      passportNumber,
      agencyId: assignedAgencyId,
      agencyName: agencyObj.name,
      bankAccountId: selectedAccountForPay.id,
      bankName: selectedAccountForPay.bankName,
      accountNumber: selectedAccountForPay.accountNumber,
      paymentMethod: selectedAccountForPay.paymentMethod,
      amount: parseFloat(payAmount),
      currency: 'BDT',
      txID: payTxId,
      slipFileUrl: slipFile,
      stepName
    });

    setSelectedAccountForPay(null);
    setPayAmount('');
    setPayTxId('');
    setShowSubmitSuccess(true);
  };

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in font-sans">
      
      {/* Header Security Card */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-blue-800/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> RBAC Verified Secure Payment Channel
            </span>
            <h2 className="text-lg font-black text-white mt-2 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" /> বরাদ্দকৃত এজেন্সির অফিশিয়াল ব্যাংক একাউন্ট
            </h2>
            <p className="text-xs text-blue-100 mt-1 max-w-xl leading-relaxed font-light">
              আপনার মনোনীত রিক্রুটিং এজেন্সি <strong className="text-white underline">{agencyObj.name}</strong>-এর অনুমোদিত ব্যাংক বিবরণী। শুধুমাত্র এই অ্যাকাউন্টে পেমেন্ট জমা দিন।
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-right shrink-0">
            <span className="text-[10px] text-blue-200 block uppercase font-bold tracking-widest">আপনার এজেন্সির লাইসেন্স</span>
            <span className="text-sm font-black text-emerald-400 font-mono">
              {(agencyObj as any).licenseNumber || 'RL-1452'}
            </span>
          </div>
        </div>
      </div>

      {/* RBAC Security Banner */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 font-medium flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>নিরাপত্তা গ্যারান্টি:</strong> অন্য কোনো এজেন্সির ব্যাংক একাউন্ট আপনাকে দেখানো হচ্ছে না। সম্পূর্ণ লেনদেন অ্যাডমিন অডিট সাপেক্ষ।
          </span>
        </div>
        <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded shrink-0">
          Role Protected
        </span>
      </div>

      {/* Bank Accounts Grid */}
      <div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Landmark className="w-4 h-4 text-blue-600" /> এজেন্সির সচল পেমেন্ট অ্যাকাউন্টসমূহ ({visibleAccounts.length})
        </h3>

        {visibleAccounts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700">আপনার এজেন্সির কোনো অনুমোদিত ব্যাংক অ্যাকাউন্ট এখনো পাওয়া যায়নি।</p>
            <p className="text-[11px] text-slate-400">এজেন্সি থেকে অ্যাকাউন্ট সাবমিট করার পর অ্যাডমিন ভেরিফাইড হলে এখানে প্রদর্শিত হবে।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleAccounts.map((acc) => (
              <div 
                key={acc.id}
                className={`bg-white rounded-3xl border p-5 shadow-sm space-y-4 transition hover:shadow-md relative ${
                  acc.isAdminCompanyAccount ? 'border-indigo-300 bg-indigo-50/20' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Account Top info */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-3 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
                      acc.isAdminCompanyAccount ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        {acc.bankName}
                        {acc.isPriority && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                            Primary
                          </span>
                        )}
                      </h4>
                      <span className="text-[10.5px] font-semibold text-slate-500">
                        {acc.paymentMethod} {acc.country !== 'All' ? `(${acc.country})` : ''}
                      </span>
                    </div>
                  </div>

                  {acc.isVerifiedBadge && (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9.5px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Agency
                    </span>
                  )}
                </div>

                {/* Account Details Box */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-normal">Account Name:</span>
                    <strong className="text-slate-900">{acc.accountName}</strong>
                  </div>
                  
                  <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-normal">Account / Wallet No:</span>
                      <strong className="text-sm font-mono text-slate-900">{acc.accountNumber}</strong>
                    </div>
                    
                    <button
                      onClick={() => handleCopy(acc.accountNumber, acc.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === acc.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === acc.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {acc.branchName && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-normal">Branch:</span>
                      <span className="text-slate-800">{acc.branchName}</span>
                    </div>
                  )}

                  {(acc.routingNumber || acc.swiftCode) && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-normal">Routing / Swift:</span>
                      <span className="font-mono text-slate-600">{acc.routingNumber || '-'} / {acc.swiftCode || '-'}</span>
                    </div>
                  )}
                </div>

                {acc.notes && (
                  <p className="text-[11px] text-slate-600 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    💡 <strong>নির্দেশনা:</strong> {acc.notes}
                  </p>
                )}

                {/* Submit Payment Button */}
                <button
                  onClick={() => setSelectedAccountForPay(acc)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" /> এই একাউন্টে পেমেন্ট ডিপোজিট স্লিপ সাবমিট করুন
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidate Submitted Payments History */}
      {mySubmissions.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 border-b pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" /> আপনার সাবমিট করা পেমেন্ট ভেরিফিকেশন স্ট্যাটাস
          </h3>

          <div className="space-y-3">
            {mySubmissions.map((sub) => (
              <div key={sub.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-3">
                <div className="flex justify-between items-start flex-wrap gap-2 border-b pb-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">৳{sub.amount.toLocaleString()} BDT</span>
                    <span className="text-slate-500 block text-[11px]">{sub.stepName || 'Registration Fee'} ({sub.paymentMethod})</span>
                  </div>
                  
                  <span className="font-mono bg-white px-2 py-1 rounded border text-[11px] font-bold text-slate-800">
                    TxID: {sub.txID}
                  </span>
                </div>

                {/* 3-Step Pipeline Tracker */}
                <div className="grid grid-cols-3 gap-2 text-[10.5px] font-bold text-center">
                  <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-200">
                    1. প্রার্থী সাবমিটেড 🟢
                  </div>
                  <div className={`p-2 rounded-xl border ${
                    sub.agentConfirmation === 'Confirmed' ? 'bg-emerald-100 text-emerald-900 border-emerald-200' : 'bg-amber-100 text-amber-900 border-amber-200'
                  }`}>
                    2. এজেন্সি ভেরিফাইড {sub.agentConfirmation === 'Confirmed' ? '🟢' : '⏳'}
                  </div>
                  <div className={`p-2 rounded-xl border ${
                    sub.adminVerification === 'Verified' ? 'bg-emerald-100 text-emerald-900 border-emerald-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    3. অ্যাডমিন লেজার সিঙ্ক {sub.adminVerification === 'Verified' ? '🟢' : '⏳'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT PAYMENT SLIP */}
      {selectedAccountForPay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">পেমেন্ট স্লিপ সাবমিট করুন</h3>
                <span className="text-[11px] text-blue-600 font-bold">{selectedAccountForPay.bankName}</span>
              </div>
              <button onClick={() => setSelectedAccountForPay(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">পেমেন্ট স্টেপ / বিবরণ *</label>
                <select
                  value={stepName}
                  onChange={(e) => setStepName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                >
                  <option value="Registration Fee Deposit">Registration Deposit (রেজিস্ট্রেশন ফি)</option>
                  <option value="MoFA Attestation Charge">MoFA Attestation Charge</option>
                  <option value="Medical Deposit">GAMCA Medical Test Charge</option>
                  <option value="Work Permit Installment">Work Permit Installment</option>
                  <option value="Flight & Visa Fee">Flight Ticket & Visa Processing</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">পরিশোধিত টাকার পরিমাণ (BDT) *</label>
                <input
                  type="number"
                  placeholder="যেমন: ১০,০০০"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">ট্রানজেকশন ID (TxID) / ব্যাংক স্লিপ নম্বর *</label>
                <input
                  type="text"
                  placeholder="যেমন: DBBL-984721 বা BKS-8837126"
                  value={payTxId}
                  onChange={(e) => setPayTxId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">ডিপোজিট স্লিপ / রসিদের ছবি সংযুক্ত করুন</label>
                <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-1">
                  <Upload className="w-5 h-5 text-blue-600 mx-auto" />
                  <span className="text-[11px] text-slate-500 block">ক্লিক করে আপনার ডিপোজিট স্লিপ সিলেক্ট করুন</span>
                  <span className="text-[9.5px] font-mono text-emerald-600 font-bold">{slipFile}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAccountForPay(null)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black shadow-md shadow-blue-600/30"
                >
                  সাবমিট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSubmitSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 border border-slate-200 shadow-2xl animate-scale-up">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-black text-slate-900">পেমেন্ট স্লিপ সফলভাবে জমা হয়েছে!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              আপনার এজেন্সির প্রতিনিধি এবং অ্যাডমিন প্যানেল ট্রানজেকশনটি যাচাই করে নোটিফিকেশন পাঠাবে।
            </p>
            <button
              onClick={() => setShowSubmitSuccess(false)}
              className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CandidateBankViewer;
