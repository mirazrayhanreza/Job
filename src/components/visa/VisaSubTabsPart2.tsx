import React, { useState, useEffect } from 'react';
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
// 5. AUTO-CALCULATION, INVOICE & RECEIPTS
// ==========================================
interface CalculatorSubTabProps {
  selectedCandidate: ItalyPackageApplication;
  selectedCandidateId: string;
  setSelectedCandidateId: (id: string) => void;
  approvedCandidates: ItalyPackageApplication[];
  steps: CustomVisaStepTemplate[];
  paymentConfig: any;
  candCustomDiscount: number;
  setCandCustomDiscount: (val: number) => void;
  candCustomExtra: number;
  setCandCustomExtra: (val: number) => void;
  candContractStatus: any;
  setCandContractStatus: (val: any) => void;
  handleSaveCandidateAdjustments: () => void;
}

export function VisaCalculatorSubTab({
  selectedCandidate,
  selectedCandidateId,
  setSelectedCandidateId,
  approvedCandidates,
  steps,
  paymentConfig,
  candCustomDiscount,
  setCandCustomDiscount,
  candCustomExtra,
  setCandCustomExtra,
  candContractStatus,
  setCandContractStatus,
  handleSaveCandidateAdjustments
}: CalculatorSubTabProps) {

  const [activeInvoiceTab, setActiveInvoiceTab] = useState<'calc' | 'invoice' | 'receipt'>('calc');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const bal = calculateCandidateBalance(selectedCandidate, steps, paymentConfig);

  const handlePrint = (elementId: string) => {
    const printContent = document.getElementById(elementId);
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0');
    
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Ledger Document</title>
            <style>
              body { font-family: 'Inter', sans-serif; color: #333; padding: 40px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .invoice-title { font-size: 24px; font-weight: bold; text-transform: uppercase; }
              .grid { display: flex; justify-content: space-between; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
              th { bg-color: #f5f5f5; font-weight: bold; }
              .total-row { font-weight: bold; text-align: right; font-size: 14px; }
              .footer { text-align: center; font-size: 10px; color: #777; margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      // Fallback
      window.print();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-[11px]">
      
      {/* Tab select and candidate selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveInvoiceTab('calc')}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg ${activeInvoiceTab === 'calc' ? 'bg-indigo-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
          >
            🧮 সমন্বয় ও ক্যালকুলেটর
          </button>
          <button 
            onClick={() => setActiveInvoiceTab('invoice')}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg ${activeInvoiceTab === 'invoice' ? 'bg-indigo-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
          >
            📄 অটো ইনভয়েস (Auto Invoice)
          </button>
          <button 
            onClick={() => setActiveInvoiceTab('receipt')}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg ${activeInvoiceTab === 'receipt' ? 'bg-indigo-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
          >
            🧾 অটো রশিদ (Payment Receipts)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 block text-[10.5px]">আবেদনকারী নির্বাচন:</span>
          <select 
            value={selectedCandidateId}
            onChange={(e) => setSelectedCandidateId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white rounded-xl py-1.5 px-3 text-[11px] focus:outline-none"
          >
            {approvedCandidates.map(c => (
              <option key={c.id} value={c.id}>{c.candidateName} ({c.passportNumber})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedCandidate ? (
        <div>
          {/* TAB 1: CALCULATOR & ADJUSTMENTS */}
          {activeInvoiceTab === 'calc' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-[11px] animate-fade-in">
              <div className="lg:col-span-2 space-y-4">
                
                {/* Micro Financial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">মোট চুক্তি ফি</span>
                    <strong className="text-sm font-black text-white">৳{bal.totalContract.toLocaleString()}</strong>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] text-emerald-400 uppercase tracking-wider block">মোট পরিশোধিত</span>
                    <strong className="text-sm font-black text-emerald-400">৳{bal.totalPaid.toLocaleString()}</strong>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] text-rose-400 uppercase tracking-wider block">বকেয়া পরিমাণ</span>
                    <strong className="text-sm font-black text-rose-400">৳{bal.totalDue.toLocaleString()}</strong>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] text-indigo-400 uppercase tracking-wider block">পরবর্তী কিস্তি</span>
                    <strong className="text-sm font-black text-indigo-400">৳{bal.nextDue.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Adjustment Slider & Input Forms */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                  <span className="text-xs font-black text-emerald-400 block border-b border-slate-900 pb-2">
                    🛠️ পার্সোনাল সমন্বয় ও আউটস্ট্যান্ডিং মডিফায়ার (Personal Ledger Adjustments)
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9.5px] text-slate-400 font-black uppercase">ডিসকাউন্ট পরিমাণ (৳ BDT)</label>
                      <input 
                        type="number" 
                        value={candCustomDiscount}
                        onChange={(e) => setCandCustomDiscount(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] text-slate-400 font-black uppercase">অতিরিক্ত সার্ভিস চার্জ (৳ BDT)</label>
                      <input 
                        type="number" 
                        value={candCustomExtra}
                        onChange={(e) => setCandCustomExtra(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] text-slate-400 font-black uppercase">কন্ট্রাক্ট স্ট্যাটাস (Contract Status)</label>
                      <select
                        value={candContractStatus}
                        onChange={(e: any) => setCandContractStatus(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                      >
                        <option value="Active">Active (সক্রিয় প্রসেস)</option>
                        <option value="Completed">Completed (প্রসেস সফল সমাপ্ত)</option>
                        <option value="Pending">Pending Approval (পেন্ডিং)</option>
                        <option value="Terminated">Terminated (বাতিলকৃত)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-900">
                    <span className="text-slate-400 leading-relaxed block max-w-[400px]">
                      💡 <strong>নোট:</strong> ডিসকাউন্ট দিলে টোটাল চুক্তি ফি থেকে বাদ যাবে এবং অতিরিক্ত চার্জ দিলে তা যোগ হবে। পরিবর্তনগুলো করার পর নিচের বাটনে ক্লিক করে সেভ করুন।
                    </span>
                    <button 
                      onClick={handleSaveCandidateAdjustments}
                      className="py-1.5 px-3 bg-emerald-500 text-slate-950 font-black rounded-lg hover:bg-emerald-400 transition shrink-0 animate-pulse"
                    >
                      ✓ সেভ অ্যাডজাস্টমেন্ট
                    </button>
                  </div>
                </div>

                {/* Candidate Verified Payment History Registry */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
                  <span className="text-xs font-black text-slate-200 block border-b border-slate-900 pb-2">
                    💳 ভেরিফায়েড পেমেন্ট হিস্ট্রি ও রশিদ (Receipt and Verification Logs)
                  </span>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-850 text-slate-400 font-black pb-2 text-[10px]">
                          <th className="py-1.5">আইডি / ট্রানজেকশন</th>
                          <th className="py-1.5">ধাপের কী (Step)</th>
                          <th className="py-1.5">পরিমাণ</th>
                          <th className="py-1.5">তারিখ</th>
                          <th className="py-1.5">পেমেন্ট মেথড</th>
                          <th className="py-1.5 text-right">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60 text-[10px]">
                        {selectedCandidate.paymentHistory && selectedCandidate.paymentHistory.length > 0 ? (
                          selectedCandidate.paymentHistory.map((pay) => (
                            <tr key={pay.id} className="hover:bg-slate-900/40">
                              <td className="py-2 font-mono text-white font-bold">{pay.invoiceId}</td>
                              <td className="py-2 text-indigo-400 font-bold font-mono">{pay.stepKey}</td>
                              <td className="py-2 font-black text-white">৳{pay.amount.toLocaleString()}</td>
                              <td className="py-2 text-slate-400">{pay.date}</td>
                              <td className="py-2 text-slate-300 font-bold">{pay.method}</td>
                              <td className="py-2 text-right">
                                <span className={`px-2 py-0.5 rounded text-[8.5px] font-black ${
                                  pay.status === 'Verified' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                                  pay.status === 'Pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                                  'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {pay.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-4 text-center text-slate-500">কোনো পেমেন্ট রেকর্ড এখনও পাওয়া যায়নি।</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Side gauge charts */}
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4 text-center">
                  <span className="text-xs font-black text-slate-400 uppercase block">আউটস্ট্যান্ডিং পরিশোধ সূচক</span>
                  
                  <div className="inline-flex relative items-center justify-center p-2">
                    <div className="w-24 h-24 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 flex flex-col justify-center items-center">
                      <span className="text-lg font-black text-emerald-400">
                        {bal.totalContract > 0 ? Math.round((bal.totalPaid / bal.totalContract) * 100) : 0}%
                      </span>
                      <span className="text-[8px] text-slate-500 font-bold uppercase">Collected</span>
                    </div>
                  </div>

                  <div className="text-left bg-slate-900/60 p-3 rounded-xl space-y-1.5 border border-slate-900">
                    <span className="text-[10px] font-black text-slate-300 uppercase block">কাস্টমার প্রোফাইল</span>
                    <p className="text-[10.5px] text-slate-400">নাম: <span className="text-white font-bold">{selectedCandidate.candidateName}</span></p>
                    <p className="text-[10.5px] text-slate-400">পাসপোর্ট: <span className="text-white font-mono">{selectedCandidate.passportNumber}</span></p>
                    <p className="text-[10.5px] text-slate-400">এজেন্সি: <span className="text-indigo-400 font-bold">Gulf Careers</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVOICE GENERATOR */}
          {activeInvoiceTab === 'invoice' && (
            <div className="space-y-4 animate-fade-in text-[11px]">
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-850">
                <p className="text-[10.5px] text-slate-400">
                  📄 সিস্টেমে সংরক্ষিত ক্যান্ডিডেট ডেটা দিয়ে অটোমেটেড ইনভয়েস জেনারেট করা হয়েছে। পিডিএফ প্রিন্ট করতে পারেন।
                </p>
                <button 
                  onClick={() => handlePrint('official-invoice-print')}
                  className="py-1.5 px-3 bg-indigo-500 text-slate-950 font-black rounded-lg flex items-center gap-1 hover:bg-indigo-400"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Invoice
                </button>
              </div>

              {/* Printable Area with Corporate Look */}
              <div id="official-invoice-print" className="bg-slate-950 border border-slate-850 rounded-2xl p-6 text-slate-300 space-y-6">
                <div className="flex justify-between items-start border-b border-slate-900 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-white">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <strong className="text-lg font-black tracking-tight uppercase">VERIFIED HUB EXPORTS LTD</strong>
                    </div>
                    <p className="text-[9.5px] text-slate-400 leading-normal">
                      হাউস ৪৪, রোড ১২, গুলশান-১, ঢাকা-১২১২<br />
                      ফোন: +৮৮০ ৯৬১২৩৪৫৬৭৮ | ইমেইল: billing@verifiedhub.com
                    </p>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <h4 className="text-lg font-black text-white uppercase tracking-wider">INVOICE (বিল)</h4>
                    <p className="text-[10px] font-mono text-slate-400">ইনভয়েস নং: #INV-2026-00{selectedCandidate.id}</p>
                    <p className="text-[10px] text-slate-400">তারিখ: ৬ জুলাই, ২০২৬</p>
                    <span className="px-2 py-0.5 text-[8.5px] font-black bg-emerald-500/10 text-emerald-400 rounded uppercase">
                      Official Draft
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] bg-slate-900/40 p-4 rounded-xl border border-slate-900">
                  <div className="space-y-1">
                    <span className="text-slate-500 uppercase text-[9px] font-bold block">বিল কার কাছে পাঠানো হয়েছে (Billed To)</span>
                    <strong className="text-white text-sm block">{selectedCandidate.candidateName}</strong>
                    <p className="text-slate-400">🎫 পাসপোর্ট: {selectedCandidate.passportNumber}</p>
                    <p className="text-slate-400">📞 মোবাইল: {selectedCandidate.candidatePhone}</p>
                  </div>

                  <div className="space-y-1 text-right">
                    <span className="text-slate-500 uppercase text-[9px] font-bold block">ভিসা রুট ও এজেন্সি বিবরণ (Workflow Route)</span>
                    <strong className="text-white text-sm block">ইতালি ওয়ার্ক পারমিট ভিসা</strong>
                    <p className="text-slate-400">কোম্পানি: {selectedCandidate.company || 'Italy Sponsor Co'}</p>
                    <p className="text-indigo-400 font-bold">এজেন্সি আইডি: Gulf Careers RL-1902</p>
                  </div>
                </div>

                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold pb-2 uppercase">
                      <th className="py-2.5 pl-2">ক্রমিক</th>
                      <th className="py-2.5">ভিসা প্রসেস ধাপ বিবরণ (Step Description)</th>
                      <th className="py-2.5">স্ট্যাটাস</th>
                      <th className="py-2.5 text-right pr-2">পরিমাণ (Amount BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 text-slate-300">
                    {steps.map((s, idx) => (
                      <tr key={s.key} className="hover:bg-slate-900/20">
                        <td className="py-2 pl-2 font-mono text-slate-500">0{idx+1}</td>
                        <td className="py-2">
                          <span className="font-bold text-white block">{s.name}</span>
                          <span className="text-[10px] text-slate-400">{s.label}</span>
                        </td>
                        <td className="py-2">
                          <span className="text-[8px] uppercase bg-slate-900 px-1.5 py-0.2 rounded text-indigo-400">
                            Installment Track
                          </span>
                        </td>
                        <td className="py-2 text-right pr-2 font-mono text-white">৳{s.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals Breakdown */}
                <div className="flex justify-end pt-4 border-t border-slate-900">
                  <div className="w-full md:w-64 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>সাব-টোটাল (Subtotal):</span>
                      <span className="font-mono text-white">৳{(bal.totalContract - bal.taxAmount + (selectedCandidate.discount || 0) - (selectedCandidate.extraCharges || 0)).toLocaleString()}</span>
                    </div>
                    {selectedCandidate.discount ? (
                      <div className="flex justify-between text-slate-400">
                        <span>সমন্বয় ডিসকাউন্ট (Discount):</span>
                        <span className="font-mono text-emerald-400">-৳{selectedCandidate.discount.toLocaleString()}</span>
                      </div>
                    ) : null}
                    {selectedCandidate.extraCharges ? (
                      <div className="flex justify-between text-slate-400">
                        <span>সার্ভিস চার্জ (Extra Fee):</span>
                        <span className="font-mono text-indigo-400">+৳{selectedCandidate.extraCharges.toLocaleString()}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-slate-400">
                      <span>ট্যাক্স (VAT 5%):</span>
                      <span className="font-mono text-white">৳{bal.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-white pt-2 border-t border-slate-850">
                      <span>সর্বমোট মূল্য (Net Total):</span>
                      <span className="font-mono text-emerald-400">৳{bal.totalContract.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>মোট পরিশোধিত (Paid):</span>
                      <span className="font-mono text-white">৳{bal.totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-black text-rose-400 text-xs">
                      <span>বকেয়া পরিমাণ (Outstanding):</span>
                      <span className="font-mono">৳{bal.totalDue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Stamp and signatures */}
                <div className="flex justify-between items-end pt-8">
                  <div className="text-center space-y-1">
                    <div className="w-24 h-1 border-b border-slate-800"></div>
                    <p className="text-[9px] text-slate-500">ক্রেতার স্বাক্ষর (Signature)</p>
                  </div>
                  
                  <div className="text-center space-y-1.5 relative">
                    {/* Visual Stamp */}
                    <div className="absolute -top-6 -left-6 border-2 border-emerald-500 text-emerald-500 uppercase rounded-xl px-2.5 py-0.5 text-[10px] font-black tracking-widest transform -rotate-12 opacity-30 select-none">
                      PAID SECURE
                    </div>
                    <div className="w-24 h-1 border-b border-slate-800"></div>
                    <p className="text-[9px] text-slate-500">অনুমোদিত ম্যানেজার (Accounts Manager)</p>
                  </div>
                </div>

                <p className="text-[9px] text-slate-650 text-center leading-normal pt-4 border-t border-slate-900/60">
                  * এটি একটি স্বয়ংক্রিয় প্রসেস ইনভয়েস বিল কপি যা ভেরিফায়েড প্রসেস ট্র্যাকার হাব থেকে প্রস্তুত করা হয়েছে। স্বাক্ষর ছাড়াই তা বৈধ।
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: AUTO RECEIPTS */}
          {activeInvoiceTab === 'receipt' && (
            <div className="space-y-4 animate-fade-in text-[11px]">
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                <span className="text-xs font-black text-slate-300 block">
                  🧾 আবেদনকারীর পরিশোধিত ট্রানজেকশনের তালিকা (Select payment receipt to view/print)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCandidate.paymentHistory && selectedCandidate.paymentHistory.filter(p => p.status === 'Verified').length > 0 ? (
                    selectedCandidate.paymentHistory.filter(p => p.status === 'Verified').map(pay => (
                      <div 
                        key={pay.id} 
                        onClick={() => setSelectedReceipt(pay)}
                        className={`p-3 rounded-xl border cursor-pointer transition text-left flex justify-between items-center ${
                          selectedReceipt?.id === pay.id ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-900 border-slate-850 hover:bg-slate-850'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <strong className="text-white block font-mono">আইডি: {pay.invoiceId}</strong>
                          <span className="text-[9.5px] text-slate-400 uppercase font-bold text-indigo-400 font-mono">ধাপ: {pay.stepKey}</span>
                          <p className="text-[9.5px] text-slate-400">তারিখ: {pay.date} | মেথড: {pay.method}</p>
                        </div>
                        <div className="text-right space-y-1 shrink-0">
                          <span className="text-sm font-black text-emerald-400 block">৳{pay.amount.toLocaleString()}</span>
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.1 rounded font-bold uppercase block">
                            Receipt Ready
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic py-4 col-span-2 text-center">কোনো ভেরিফায়েড পেমেন্ট স্লিপ পাওয়া যায়নি।</p>
                  )}
                </div>
              </div>

              {selectedReceipt && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-850">
                    <span className="text-emerald-400 font-bold font-mono">রশিদ # {selectedReceipt.invoiceId} লোড করা হয়েছে</span>
                    <button 
                      onClick={() => handlePrint('official-receipt-print')}
                      className="py-1 px-3 bg-emerald-500 text-slate-950 font-black rounded-lg flex items-center gap-1 hover:bg-emerald-400"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Receipt
                    </button>
                  </div>

                  {/* Receipt Format */}
                  <div id="official-receipt-print" className="bg-slate-950 border border-slate-850 rounded-2xl p-6 text-slate-300 space-y-4 max-w-xl mx-auto">
                    <div className="text-center border-b border-slate-900 pb-3 space-y-1">
                      <h4 className="text-lg font-black text-white uppercase tracking-wider">PAYMENT RECEIPT (টাকা প্রাপ্তি রশিদ)</h4>
                      <p className="text-[10px] text-slate-450">VERIFIED HUB EXPORTS LTD | গুলশান, ঢাকা</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] bg-slate-900/50 p-3 rounded-xl border border-slate-900">
                      <div className="space-y-0.5">
                        <span className="text-slate-500">প্রার্থীর নাম (Candidate Name)</span>
                        <strong className="text-white block">{selectedCandidate.candidateName}</strong>
                        <span className="text-slate-400 font-mono">🎫 Passport: {selectedCandidate.passportNumber}</span>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <span className="text-slate-500">রশিদ বিবরণ (Receipt details)</span>
                        <strong className="text-emerald-400 block font-mono">৳{selectedReceipt.amount.toLocaleString()} BDT</strong>
                        <span className="text-slate-400">গেটওয়ে / মেথড: {selectedReceipt.method}</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/20 p-3.5 rounded-xl border border-slate-900 text-center space-y-1.5">
                      <p className="text-slate-400 text-[10.5px]">
                        আপনার জমাদানকৃত ৳{selectedReceipt.amount.toLocaleString()} টাকা (কথায়: {selectedReceipt.amount} টাকা মাত্র) <strong>{selectedReceipt.stepKey}</strong> পেমেন্ট ধাপে সফলভাবে পরিশোধিত হয়েছে।
                      </p>
                      <span className="font-mono text-emerald-400 text-[9.5px] font-bold block uppercase">
                        Transaction ID: {selectedReceipt.invoiceId} • Verified Date: {selectedReceipt.date}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-900">
                      <span className="text-[9px] text-slate-500 font-mono text-left">
                        * এটি একটি সিস্টেম জেনারেটেড রশিদ কপি। কোনো সিগনেচারের প্রয়োজন নেই।
                      </span>
                      
                      <div className="border-2 border-emerald-500 text-emerald-500 text-[8.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider transform -rotate-12 opacity-40">
                        APPROVED VERIFIED
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-6">দয়া করে একজন ক্যান্ডিডেট নির্বাচন করুন।</p>
      )}

    </div>
  );
}


// ==========================================
// 6. CANDIDATE PORTAL SIMULATOR
// ==========================================
interface CandidateSubTabProps {
  selectedCandidate: ItalyPackageApplication;
  setSelectedCandidateId: (id: string) => void;
  approvedCandidates: ItalyPackageApplication[];
  steps: CustomVisaStepTemplate[];
  paymentConfig: any;
  onUpdateItalyPackage: (pkg: ItalyPackageApplication) => void;
  addLog: (user: string, action: string, type?: string) => void;
}

export function VisaCandidateSubTab({
  selectedCandidate,
  setSelectedCandidateId,
  approvedCandidates,
  steps,
  paymentConfig,
  onUpdateItalyPackage,
  addLog
}: CandidateSubTabProps) {

  const [simDocName, setSimDocName] = useState('NID_Scan.pdf');
  const [simDocStep, setSimDocStep] = useState(steps[0]?.key || 'registration');

  const bal = calculateCandidateBalance(selectedCandidate, steps, paymentConfig);

  const handleSimCandidateUpload = (customName?: string) => {
    if (!selectedCandidate) return;

    const key = simDocStep;
    const documentName = (customName || simDocName).trim() || 'uploaded_file.pdf';

    // Simulated dossier updates
    const currentDocs = selectedCandidate.documents || {};
    const updatedDocs = {
      ...currentDocs,
      [key]: { status: 'Pending' as const, fileUrl: documentName, notes: `Candidate manual upload on ${new Date().toLocaleDateString()}` }
    };

    const updated: ItalyPackageApplication = {
      ...selectedCandidate,
      documents: updatedDocs
    };

    onUpdateItalyPackage(updated);
    addLog(`আবেদনকারী (পোর্টাল)`, `প্রার্থী ${selectedCandidate.candidateName} তার পোর্টালে "${key}" ধাপের জন্য ডকুমেন্ট "${documentName}" আপলোড করেছেন।`, 'info');
    alert(`"${documentName}" ডকুমেন্টটি সফলভাবে আপলোড হয়েছে! অ্যাডমিন এটি যাচাইয়ের পর ভেরিফাইড করবে।`);
  };

  return (
    <div className="space-y-6 animate-fade-in text-[11px]">
      {selectedCandidate ? (
        <div className="bg-slate-950 rounded-3xl border border-slate-850 p-5 space-y-6 text-[11px]">
          
          {/* Header row with customer status and balance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-900 pb-4">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase">ক্যান্ডিডেট প্রোফাইল</span>
              <strong className="text-sm font-black text-white block">{selectedCandidate.candidateName}</strong>
              <span className="text-[9px] text-slate-400 font-mono block">📧 {selectedCandidate.candidateEmail} | {selectedCandidate.candidatePhone}</span>
            </div>

            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-900 flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase block">মোট পরিশোধিত</span>
                <strong className="text-base font-black text-emerald-400">৳{bal.totalPaid.toLocaleString()}</strong>
              </div>
              <span className="p-1 px-2 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-black uppercase">PAID</span>
            </div>

            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-900 flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase block">বকেয়া কিস্তি (Outstanding)</span>
                <strong className="text-base font-black text-rose-400">৳{bal.totalDue.toLocaleString()}</strong>
              </div>
              <span className="p-1 px-2 bg-rose-500/10 text-rose-400 rounded text-[9px] font-black uppercase">DUE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Timeline display */}
            <div className="lg:col-span-2 space-y-4 bg-slate-900/30 p-4 rounded-2xl border border-slate-850">
              <span className="text-xs font-black text-slate-200 block uppercase tracking-wider">
                🛰️ ভিসা প্রগ্রেস টাইমলাইন (Visa Steps Tracker)
              </span>

              <div className="relative border-l border-slate-850 pl-4 ml-2 space-y-4 text-left">
                {steps.map((tpl, idx) => {
                  const completed = selectedCandidate.visaSteps?.some(s => s.key === tpl.key && s.status === 'Completed');
                  const processing = selectedCandidate.visaSteps?.some(s => s.key === tpl.key && s.status === 'Processing');
                  
                  return (
                    <div key={tpl.key} className="relative">
                      <span className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                        completed ? 'bg-emerald-400 border-slate-950' : 
                        processing ? 'bg-indigo-400 border-slate-950 animate-pulse' : 
                        'bg-slate-800 border-slate-950'
                      }`}></span>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-[11px]">{idx + 1}. {tpl.name}</span>
                          <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-black uppercase ${
                            completed ? 'bg-emerald-500/10 text-emerald-400' :
                            processing ? 'bg-indigo-500/10 text-indigo-400' :
                            'bg-slate-800 text-slate-500'
                          }`}>
                            {completed ? 'Completed' : processing ? 'Processing' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold">{tpl.label}</p>
                        <p className="text-[9.5px] text-slate-500 leading-relaxed">{tpl.description}</p>
                        
                        <div className="flex gap-3 text-[8.5px] text-slate-400 font-mono pt-1">
                          <span>💰 ফি: ৳{tpl.amount.toLocaleString()}</span>
                          <span>📅 টার্গেট তারিখ: {tpl.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Document upload simulator */}
            <div className="space-y-4">
              <div className="bg-slate-900/30 p-4 rounded-2xl border border-slate-850 space-y-3">
                <span className="text-xs font-black text-slate-200 block uppercase tracking-wider">
                  📁 ক্যান্ডিডেট ডকুমেন্ট ড্রপবক্স (Upload Your Documents)
                </span>
                
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 uppercase font-bold block">কোন ধাপের জন্য ডকুমেন্ট আপলোড করছেন?</label>
                    <select 
                      id="sim-doc-step-select"
                      value={simDocStep}
                      onChange={(e) => setSimDocStep(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    >
                      {steps.map(s => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 uppercase font-bold block">ফাইল আপলোড করুন (Click to Select & Upload Instant)</label>
                    <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-xl p-4 text-center cursor-pointer transition relative bg-slate-950/60 hover:bg-slate-900/30">
                      <input 
                        id="candidate-direct-file-input"
                        type="file" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSimDocName(file.name);
                            // Instantly submit and send the file!
                            handleSimCandidateUpload(file.name);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <span className="text-xl block mb-1">📤</span>
                      <p className="font-bold text-[10px] text-slate-200">
                        এখানে ক্লিক করে ফাইল সিলেক্ট করুন
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        ফাইল সিলেক্ট করার সাথে সাথেই অটো-আপলোড ও সাবমিট হয়ে যাবে।
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] text-slate-400 uppercase font-bold block flex justify-between">
                      <span>অথবা ম্যানুয়ালি ফাইল নাম টাইপ করুন:</span>
                      {simDocName && <span className="text-emerald-400 font-mono text-[8px]">Selected: {simDocName}</span>}
                    </label>
                    <input 
                      id="candidate-sim-doc-name-input"
                      type="text" 
                      value={simDocName}
                      onChange={(e) => setSimDocName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none font-mono text-[9.5px]"
                    />
                  </div>

                  <button 
                    id="candidate-sim-upload-btn"
                    type="button" 
                    onClick={() => handleSimCandidateUpload()}
                    className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black rounded-xl flex items-center justify-center gap-1.5 transition text-[10px]"
                  >
                    <FileUp className="w-3.5 h-3.5 text-slate-950" /> ম্যানুয়ালি আপলোড নিশ্চিত করুন
                  </button>
                </div>
              </div>

              {/* Dossier History list */}
              <div className="bg-slate-900/30 p-4 rounded-2xl border border-slate-850 space-y-2">
                <span className="text-xs font-black text-slate-200 block">
                  📁 আমার আপলোড করা ডকুমেন্টস (My Digital Dossier)
                </span>
                <div className="space-y-2">
                  {selectedCandidate.documents ? (
                    Object.entries(selectedCandidate.documents).map(([key, value]: any) => (
                      <div key={key} className="p-2.5 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="text-white block font-bold font-mono">{key.toUpperCase()}</span>
                          <span className="text-[9px] text-slate-400">ফাইল: {value.fileUrl}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          value.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {value.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic text-center py-2">কোনো ফাইল এখনো আপলোড করা হয়নি।</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <p className="text-slate-500 text-center py-6">কোনো ক্যান্ডিডেট ডেটা সিমুলেটর ভিউ এর জন্য লোড নেই।</p>
      )}
    </div>
  );
}


// ==========================================
// 7. AGENCY PANEL PORTAL CONSOLE
// ==========================================
interface AgencySubTabProps {
  selectedCandidate: ItalyPackageApplication;
  setSelectedCandidateId: (id: string) => void;
  approvedCandidates: ItalyPackageApplication[];
  steps: CustomVisaStepTemplate[];
  agencySelectedStep: string;
  setAgencySelectedStep: (val: string) => void;
  agencyPaidAmountInput: number;
  setAgencyPaidAmountInput: (val: number) => void;
  agencyPaymentMethod: string;
  setAgencyPaymentMethod: (val: string) => void;
  agencyReceiptName: string;
  setAgencyReceiptName: (val: string) => void;
  handleAgencySubmitPayment: () => void;
  onUpdateItalyPackage: (pkg: ItalyPackageApplication) => void;
  addLog: (user: string, action: string, type?: string) => void;
  triggerNotification: (title: string, msg: string, type: any, recipient: any) => void;
}

export function VisaAgencySubTab({
  selectedCandidate,
  setSelectedCandidateId,
  approvedCandidates,
  steps,
  agencySelectedStep,
  setAgencySelectedStep,
  agencyPaidAmountInput,
  setAgencyPaidAmountInput,
  agencyPaymentMethod,
  setAgencyPaymentMethod,
  agencyReceiptName,
  setAgencyReceiptName,
  handleAgencySubmitPayment,
  onUpdateItalyPackage,
  addLog,
  triggerNotification
}: AgencySubTabProps) {

  const [agencySelect, setAgencySelect] = useState('agency_1');
  const [completionNotes, setCompletionNotes] = useState('');
  
  // States for the active custom step editor inside agency panel
  const [editingStepKey, setEditingStepKey] = useState<string | null>(null);
  const [editStepAmount, setEditStepAmount] = useState<number>(0);
  const [editStepDate, setEditStepDate] = useState<string>('');
  const [editStepDoc, setEditStepDoc] = useState<string>('');
  const [editStepStatus, setEditStepStatus] = useState<any>('Pending');
  const [editStepNotes, setEditStepNotes] = useState<string>('');

  // Filter candidates for selected agency
  const agencyCandidates = approvedCandidates.filter(c => c.agencyId === agencySelect || (!c.agencyId && agencySelect === 'agency_1'));

  // Get current candidate's country-wise custom steps, with default steps fallback
  const getCandidateSteps = () => {
    if (!selectedCandidate) return [];
    if (selectedCandidate.visaSteps && selectedCandidate.visaSteps.length > 0) {
      return selectedCandidate.visaSteps;
    }
    // Fallback: construct standard list if empty
    return steps.map(s => ({
      key: s.key,
      name: s.label || s.name,
      status: 'Pending' as const,
      date: '',
      staffName: '',
      requiredDocs: s.requiredDocs || 'Original paperwork',
      isPaymentRequired: s.isPaymentRequired !== false,
      agencyCanUpdate: s.agencyCanUpdate !== false,
      amount: s.amount || 0
    }));
  };

  const candidateSteps = getCandidateSteps();

  const handleStartEditStep = (step: any) => {
    setEditingStepKey(step.key);
    setEditStepAmount(step.amount || 0);
    setEditStepDate(step.date || new Date().toISOString().split('T')[0]);
    setEditStepDoc(step.documentUrl || '');
    setEditStepStatus(step.status || 'Pending');
    setEditStepNotes(step.adminNotes || '');
  };

  const handleSaveStepUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !editingStepKey) return;

    const currentSteps = [...candidateSteps];
    const stepIdx = currentSteps.findIndex(s => s.key === editingStepKey);
    if (stepIdx === -1) return;

    const stepToEdit = currentSteps[stepIdx];

    // Check if amount edit permission is off
    const canChangeAmount = stepToEdit.agencyCanUpdate !== false;
    const finalAmount = canChangeAmount ? editStepAmount : (stepToEdit.amount || 0);

    // Update the visa step record
    currentSteps[stepIdx] = {
      ...stepToEdit,
      status: editStepStatus,
      date: editStepDate,
      documentUrl: editStepDoc,
      adminNotes: editStepNotes,
      amount: finalAmount,
      staffName: `Agency Portal (${agencySelect === 'agency_1' ? 'Gulf' : agencySelect === 'agency_2' ? 'Euro' : 'Rony'})`
    };

    // Keep corresponding payment step amount in sync
    const currentPaymentSteps = selectedCandidate.paymentSteps ? [...selectedCandidate.paymentSteps] : [];
    const payIdx = currentPaymentSteps.findIndex(p => p.key === editingStepKey);
    if (payIdx !== -1) {
      currentPaymentSteps[payIdx] = {
        ...currentPaymentSteps[payIdx],
        amount: finalAmount,
        // If status completed and payment was required, we can mark payment status as appropriate or let candidate do bank slip
      };
    }

    // Recalculate candidate contract totals
    const newTotalAmount = currentSteps.reduce((sum, s) => sum + (s.amount || 0), 0);
    const paidAmountSum = selectedCandidate.paidAmount || 0;

    const updatedCandidate: ItalyPackageApplication = {
      ...selectedCandidate,
      visaSteps: currentSteps,
      paymentSteps: currentPaymentSteps,
      totalAmount: newTotalAmount,
      dueAmount: newTotalAmount - paidAmountSum
    };

    onUpdateItalyPackage(updatedCandidate);
    
    // Add transaction audit logs
    const updatedLogs = [
      ...(updatedCandidate.auditLogs || []),
      {
        id: 'log_' + Date.now(),
        action: 'Visa Step Updated By Agency',
        user: 'Recruiting Agency',
        timestamp: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString(),
        details: `ভিসা প্রসেস ধাপ "${stepToEdit.name}" আপডেট করা হয়েছে। স্ট্যাটাস: ${editStepStatus}, পেমেন্ট অ্যামাউন্ট: ৳${finalAmount.toLocaleString()} BDT`
      }
    ];
    updatedCandidate.auditLogs = updatedLogs;
    onUpdateItalyPackage(updatedCandidate);

    addLog(`এজেন্সি পোর্টালে (${agencySelect === 'agency_1' ? 'Gulf Careers' : 'Euro Travels'})`, `ক্যান্ডিডেট "${selectedCandidate.candidateName}" এর "${stepToEdit.name}" ধাপটি সফলভাবে আপডেট করেছেন।`, 'success');
    triggerNotification('ধাপ প্রগ্রেস আপডেট', `এজেন্সি আপনার "${stepToEdit.name}" ধাপের তথ্য ও স্ট্যাটাস আপডেট করেছে।`, 'info', 'Candidate');

    alert(`"${stepToEdit.name}" ধাপের সকল তথ্য সফলভাবে ক্যান্ডিডেটের ফাইলে সংরক্ষণ করা হয়েছে!`);
    setEditingStepKey(null);
  };

  const handleRequestStepCompletion = () => {
    if (!selectedCandidate) return;

    // Simulate requesting approval for a step completion
    const currentSteps = [...candidateSteps];
    const stepIdx = currentSteps.findIndex(s => s.key === agencySelectedStep);
    
    if (stepIdx !== -1) {
      currentSteps[stepIdx] = {
        ...currentSteps[stepIdx],
        status: 'Processing' as const, // Put into review mode
        adminNotes: `Agency Request completion notes: ${completionNotes}`
      };
    }

    const updated: ItalyPackageApplication = {
      ...selectedCandidate,
      visaSteps: currentSteps
    };

    onUpdateItalyPackage(updated);
    addLog(`এজেন্সি পোর্টালে (Gulf Careers)`, `ক্যান্ডিডেট "${selectedCandidate.candidateName}" এর "${agencySelectedStep}" ধাপটি সম্পন্ন করার জন্য এপ্রুভাল রিকোয়েস্ট করেছেন।`, 'info');
    triggerNotification('ধাপ এপ্রুভাল পেন্ডিং', `এজেন্সি ${selectedCandidate.candidateName} এর "${agencySelectedStep}"  ধাপটি এপ্রুভ করতে এডমিনকে রিকোয়েস্ট করেছে।`, 'warning', 'Admin');
    alert(`"${agencySelectedStep}" ধাপটি সম্পন্ন করার আবেদনটি অ্যাডমিন মডারেটরের কাছে সফলভাবে পাঠানো হয়েছে!`);
    setCompletionNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in text-[11px]">
      
      {/* Top Selector Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold block">এজেন্সি গেটওয়ে পোর্টাল:</span>
          <select 
            value={agencySelect}
            onChange={(e) => setAgencySelect(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white rounded-xl py-1.5 px-3 text-[11px] focus:outline-none"
          >
            <option value="agency_1">Gulf Careers Bangladesh (RL-1902)</option>
            <option value="agency_2">Euro Bangladesh Travels (RL-1450)</option>
            <option value="agency_3">Rony Travels Agency (RL-1100)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 block font-bold">নিযুক্ত ক্যান্ডিডেট:</span>
          <select 
            value={selectedCandidate?.id || ''}
            onChange={(e) => setSelectedCandidateId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white rounded-xl py-1.5 px-3 text-[11px] focus:outline-none font-black text-emerald-400"
          >
            <option value="">-- ক্যান্ডিডেট নির্বাচন করুন --</option>
            {agencyCandidates.map(c => (
              <option key={c.id} value={c.id}>{c.candidateName} ({c.passportNumber}) - {c.country || 'Italy'}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedCandidate ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-[11px]">
          
          {/* Left panel: Payment Slip submission */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Country Wise Interactive Step Update Table */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3.5">
              <div className="flex justify-between items-center border-b border-slate-905 pb-2">
                <span className="text-xs font-black text-indigo-400 block">
                  🛫 {selectedCandidate.country || 'Italy'} ভিসা প্রসেস ওয়ার্কফ্লো ম্যানেজার (Country-wise Visa Step Controller)
                </span>
                <span className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded font-bold text-white">
                  টোটাল কস্ট প্ল্যান: ৳{(selectedCandidate.totalAmount || 0).toLocaleString()} BDT
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-450 uppercase font-black text-[8px] tracking-wider">
                      <th className="pb-2">ধাপ</th>
                      <th className="pb-2">নাম (English/Bangla)</th>
                      <th className="pb-2 text-right">নির্ধারিত ফি</th>
                      <th className="pb-2">প্রয়োজনীয় ফাইল</th>
                      <th className="pb-2 text-center">স্ট্যাটাস</th>
                      <th className="pb-2 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 font-semibold">
                    {candidateSteps.map((s: any, idx: number) => (
                      <tr key={s.key || idx} className="hover:bg-slate-900/20">
                        <td className="py-2.5 font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-2.5">
                          <span className="text-white font-bold block">{s.name}</span>
                          <span className="text-[8.5px] text-slate-400 block">{s.key}</span>
                        </td>
                        <td className="py-2.5 text-right font-bold text-emerald-400">
                          ৳{(s.amount || 0).toLocaleString()} BDT
                          <span className="text-[8px] text-slate-500 block">
                            {s.agencyCanUpdate !== false ? 'Edit Allowed' : 'Locked by Admin'}
                          </span>
                        </td>
                        <td className="py-2.5 max-w-[120px] truncate text-slate-400" title={s.requiredDocs}>
                          {s.requiredDocs || 'None'}
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            s.status === 'Completed' || s.status === 'Approved' || s.status === 'Medical Fit' ? 'bg-emerald-500/10 text-emerald-400' :
                            s.status === 'Processing' ? 'bg-blue-500/10 text-blue-400' :
                            s.status === 'Rejected' || s.status === 'Medical Unfit' ? 'bg-rose-500/10 text-rose-400' :
                            'bg-slate-800 text-slate-500'
                          }`}>
                            {s.status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-2.5 text-center">
                          <button 
                            type="button"
                            onClick={() => handleStartEditStep(s)}
                            className="py-1 px-2.5 bg-indigo-500/15 hover:bg-indigo-500 text-indigo-400 hover:text-slate-950 rounded font-black text-[9px] transition-all"
                          >
                            সম্পাদনা (Edit)
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Edit Step Form */}
            {editingStepKey && (
              <form onSubmit={handleSaveStepUpdate} className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/30 space-y-3.5 animate-fade-in">
                <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                  <span className="text-xs font-black text-indigo-400 uppercase flex items-center gap-1.5">
                    📝 প্রসেস ধাপ সম্পাদন ও আপডেট (Edit Step Details: {editingStepKey})
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setEditingStepKey(null)}
                    className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                  {/* Amount Block with permission check */}
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">ধাপ কিস্তির পরিমাণ (Step Amount in BDT):</label>
                    <input 
                      type="number"
                      value={editStepAmount}
                      onChange={(e) => setEditStepAmount(Number(e.target.value))}
                      disabled={candidateSteps.find(s => s.key === editingStepKey)?.agencyCanUpdate === false}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                    {candidateSteps.find(s => s.key === editingStepKey)?.agencyCanUpdate === false && (
                      <span className="text-[8.5px] text-amber-500 block font-bold">
                        ⚠️ অ্যাডমিন কর্তৃক এডিটিং পারমিশন অফ রাখা হয়েছে, তাই আপনি এই কিস্তির ফি পরিবর্তন করতে পারবেন না।
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">ধাপের স্ট্যাটাস (Select Step Status):</label>
                    <select
                      value={editStepStatus}
                      onChange={(e) => setEditStepStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-bold"
                    >
                      <option value="Pending">Pending (অপেক্ষমাণ)</option>
                      <option value="Processing">Processing (চলমান)</option>
                      <option value="Completed">Completed (সম্পন্ন)</option>
                      <option value="Rejected">Rejected (প্রত্যাখ্যাত)</option>
                      <option value="Medical Fit">Medical Fit (মেডিকেল ফিট)</option>
                      <option value="Medical Unfit">Medical Unfit (মেডিকেল আনফিট)</option>
                      <option value="Approved">Approved (অনুমোদিত)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">আপডেট / কার্যকর তারিখ (Target/Completion Date):</label>
                    <input 
                      type="date"
                      value={editStepDate}
                      onChange={(e) => setEditStepDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">ডকুমেন্ট আপলোড ফাইল নাম (Document File Name):</label>
                    <input 
                      type="text"
                      placeholder="যেমন: mofa_receipt_attested.pdf"
                      value={editStepDoc}
                      onChange={(e) => setEditStepDoc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  <label className="text-slate-400 font-bold block">স্টাফ/এজেন্সি নোট ও মন্তব্য (Official Remarks):</label>
                  <textarea 
                    placeholder="ধাপটির বর্তমান অগ্রগতি এবং প্রয়োজনীয় নির্দেশনা এখানে লিখুন..."
                    value={editStepNotes}
                    onChange={(e) => setEditStepNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white min-h-[50px] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setEditingStepKey(null)}
                    className="py-1.5 px-3 bg-slate-900 text-slate-400 border border-slate-800 rounded-lg hover:text-white"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="submit"
                    className="py-1.5 px-4 bg-emerald-500 text-slate-950 font-black rounded-lg hover:bg-emerald-400"
                  >
                    ✓ ধাপ আপডেট সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            )}

            {/* Payment Slip Upload */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
              <span className="text-xs font-black text-emerald-400 block border-b border-slate-900 pb-2">
                💵 পেমেন্ট ট্র্যাকার ও ব্যাংক স্লিপ/মোবাইল ব্যাংকিং রিসিট জমাদান (Submit Client Payment Slip)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-semibold text-[10px]">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">পেমেন্ট কিস্তি ধাপ (Target Step)</label>
                  <select 
                    value={agencySelectedStep}
                    onChange={(e) => setAgencySelectedStep(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none font-bold"
                  >
                    {candidateSteps.map((s: any) => (
                      <option key={s.key} value={s.key}>{s.name} - (৳{(s.amount || 0).toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">জমাকৃত টাকার পরিমাণ (Amount in BDT)</label>
                  <input 
                    type="number" 
                    value={agencyPaidAmountInput}
                    onChange={(e) => setAgencyPaidAmountInput(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none font-bold text-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">পেমেন্ট গেটওয়ে (Gateway / Bank)</label>
                  <select 
                    value={agencyPaymentMethod}
                    onChange={(e) => setAgencyPaymentMethod(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none font-bold"
                  >
                    <option value="bKash Merchant">bKash Merchant</option>
                    <option value="Nagad Pay">Nagad Pay</option>
                    <option value="Islami Bank (IBBL)">Islami Bank (IBBL)</option>
                    <option value="Eastern Bank (EBL)">Eastern Bank (EBL)</option>
                    <option value="Dutch Bangla (DBBL)">Dutch Bangla (DBBL)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase font-semibold">রিসিট বা ট্রানজেকশন স্ক্রিনশট নাম (Slip File Name)</label>
                  <input 
                    type="text" 
                    value={agencyReceiptName}
                    onChange={(e) => setAgencyReceiptName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] opacity-0 block">জমা দিন</label>
                  <button 
                    type="button" 
                    onClick={handleAgencySubmitPayment}
                    className="w-full py-2.5 px-4 bg-emerald-500 text-slate-950 font-black rounded-xl hover:bg-emerald-400"
                  >
                    ✓ ব্যাংক রশিদ যাচাইয়ের জন্য অ্যাডমিনে পাঠান
                  </button>
                </div>
              </div>
            </div>

            {/* Request Step Completion */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
              <span className="text-xs font-black text-indigo-400 block border-b border-slate-900 pb-2">
                ⚙️ ক্যান্ডিডেটের ভিসা প্রসেস সম্পন্ন করার আবেদন (Request Step Completion Approval)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">সম্পন্ন হওয়া টার্গেট ধাপ (Completed Step)</label>
                  <select 
                    value={agencySelectedStep}
                    onChange={(e) => setAgencySelectedStep(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none font-bold"
                  >
                    {candidateSteps.map((s: any) => (
                      <option key={s.key} value={s.key}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">এজেন্সি সম্পাদন মন্তব্য (Work Completion Notes)</label>
                  <input 
                    type="text" 
                    placeholder="যেমন: এমওএফএ মুফা সত্যায়ন কপি এবং এম্বেসির রশিদ সংযুক্ত।"
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleRequestStepCompletion}
                className="w-full py-2.5 px-4 bg-indigo-500 text-slate-950 font-black rounded-xl hover:bg-indigo-400"
              >
                ✓ ধাপ ভেরিফিকেশন ও এপ্রুভালের জন্য আবেদন করুন
              </button>
            </div>
          </div>

          {/* Right panel: Active progress timeline of selected candidates */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
            <span className="text-xs font-black text-slate-200 block uppercase">
              🏢 এজেন্সির ক্যান্ডিডেটের প্রসেস ও বিলিং ট্র্যাকার (Installments History)
            </span>

            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {candidateSteps.map((tpl: any) => {
                const paidItem = selectedCandidate.paymentHistory?.find(h => h.stepKey === tpl.key && h.status === 'Verified');
                const pendingItem = selectedCandidate.paymentHistory?.find(h => h.stepKey === tpl.key && h.status === 'Pending');

                return (
                  <div key={tpl.key} className="p-2.5 bg-slate-900 rounded-xl border border-slate-850 flex justify-between items-center text-[10px]">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white block">{tpl.name}</span>
                      <span className="text-[9px] text-emerald-400 font-extrabold">ফি: ৳{(tpl.amount || 0).toLocaleString()} BDT</span>
                    </div>
                    
                    <div>
                      {paidItem ? (
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded">
                          ✓ পরিশোধিত
                        </span>
                      ) : pendingItem ? (
                        <span className="text-[8px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded">
                          ⏳ যাচাই পেন্ডিং
                        </span>
                      ) : (
                        <span className="text-[8px] bg-rose-500/10 text-rose-400 font-bold px-2 py-0.5 rounded">
                          UNPAID
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-slate-500 text-center py-6">কোনো ক্যান্ডিডেট ডাটা প্রিভিউ করার জন্য পাওয়া যায়নি। অনুগ্রহ করে উপযুক্ত ক্যান্ডিডেট নির্বাচন করুন।</p>
      )}
    </div>
  );
}
