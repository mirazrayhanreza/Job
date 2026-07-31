import React from 'react';
import { 
  X, Mail, Phone, Settings, Pencil, GraduationCap, CreditCard, Camera, 
  Check, CheckCircle, Upload, Plus, Trash2, Shield, Bell, CheckCircle2,
  FileText
} from 'lucide-react';

interface ProfileSheetsProps {
  profileSheet: string | null;
  onClose: () => void;
  isDark?: boolean;
  
  // Personal Info State
  applicantName: string;
  setApplicantName: (v: string) => void;
  applicantEmail: string;
  setApplicantEmail: (v: string) => void;
  applicantPhone: string;
  setApplicantPhone: (v: string) => void;
  applicantLanguages: string;
  setApplicantLanguages: (v: string) => void;

  // Passport State
  applicantPassportNumber: string;
  setApplicantPassportNumber: (v: string) => void;
  applicantPassportExpiry: string;
  setApplicantPassportExpiry: (v: string) => void;
  applicantBmetNumber: string;
  setApplicantBmetNumber: (v: string) => void;
  applicantMedicalStatus: 'Fit' | 'Pending' | 'Unfit';
  setApplicantMedicalStatus: (v: 'Fit' | 'Pending' | 'Unfit') => void;
  applicantPoliceClearance: 'Verified' | 'Pending' | 'Not Provided';
  setApplicantPoliceClearance: (v: 'Verified' | 'Pending' | 'Not Provided') => void;
  additionalPassports: Array<{
    id: string;
    passportNumber: string;
    passportExpiry: string;
    bmetNumber: string;
    medicalStatus: 'Fit' | 'Pending' | 'Unfit';
    policeClearance: 'Verified' | 'Pending' | 'Not Provided';
  }>;
  setAdditionalPassports: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    passportNumber: string;
    passportExpiry: string;
    bmetNumber: string;
    medicalStatus: 'Fit' | 'Pending' | 'Unfit';
    policeClearance: 'Verified' | 'Pending' | 'Not Provided';
  }>>>;

  // Education State
  applicantDegree: string;
  setApplicantDegree: (v: string) => void;
  applicantInstitution: string;
  setApplicantInstitution: (v: string) => void;
  applicantPassingYear: string;
  setApplicantPassingYear: (v: string) => void;

  // Experience State
  applicantGccExp: string;
  setApplicantGccExp: (v: string) => void;
  applicantBdExp: string;
  setApplicantBdExp: (v: string) => void;
  applicantPrevCompany: string;
  setApplicantPrevCompany: (v: string) => void;
  additionalExperiences: Array<{ id: string; gccExp: string; bdExp: string; prevCompany: string }>;
  setAdditionalExperiences: React.Dispatch<React.SetStateAction<Array<{ id: string; gccExp: string; bdExp: string; prevCompany: string }>>>;

  // Skills State
  applicantSkills: string;
  setApplicantSkills: (v: string) => void;

  // Documents State
  cvFileName: string;
  setCvFileName: (v: string) => void;
  passportCopyName: string;
  setPassportCopyName: (v: string) => void;
  medicalCertName: string;
  setMedicalCertName: (v: string) => void;
  policeCertName: string;
  setPoliceCertName: (v: string) => void;

  // Photo State
  uploadedPhotoName: string;
  setUploadedPhotoName: (v: string) => void;

  // Payments State
  paymentList: Array<{ id: string; title: string; amount: string; date: string; status: 'Success' | 'Pending' | 'Failed' }>;
  setPaymentList: React.Dispatch<React.SetStateAction<Array<{ id: string; title: string; amount: string; date: string; status: 'Success' | 'Pending' | 'Failed' }>>>;

  // Save Trigger
  onSave: () => void;
}

export default function ProfileSheets({
  profileSheet,
  onClose,
  isDark = true,
  applicantName, setApplicantName,
  applicantEmail, setApplicantEmail,
  applicantPhone, setApplicantPhone,
  applicantLanguages, setApplicantLanguages,
  applicantPassportNumber, setApplicantPassportNumber,
  applicantPassportExpiry, setApplicantPassportExpiry,
  applicantBmetNumber, setApplicantBmetNumber,
  applicantMedicalStatus, setApplicantMedicalStatus,
  applicantPoliceClearance, setApplicantPoliceClearance,
  additionalPassports, setAdditionalPassports,
  applicantDegree, setApplicantDegree,
  applicantInstitution, setApplicantInstitution,
  applicantPassingYear, setApplicantPassingYear,
  applicantGccExp, setApplicantGccExp,
  applicantBdExp, setApplicantBdExp,
  applicantPrevCompany, setApplicantPrevCompany,
  additionalExperiences, setAdditionalExperiences,
  applicantSkills, setApplicantSkills,
  cvFileName, setCvFileName,
  passportCopyName, setPassportCopyName,
  medicalCertName, setMedicalCertName,
  policeCertName, setPoliceCertName,
  uploadedPhotoName, setUploadedPhotoName,
  paymentList, setPaymentList,
  onSave
}: ProfileSheetsProps) {
  if (!profileSheet) return null;

  const inputStyle = "w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-emerald-500/80 font-medium transition-all";
  const labelStyle = "text-[10px] font-bold text-slate-400 block mb-1";

  const renderSheetContent = () => {
    switch (profileSheet) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className={labelStyle}>সম্পূর্ণ নাম (Full Name)</label>
              <input 
                type="text" 
                value={applicantName} 
                onChange={(e) => setApplicantName(e.target.value)}
                className={inputStyle}
                placeholder="যেমন: আরীফুল ইসলাম"
              />
            </div>
            <div className="space-y-1">
              <label className={labelStyle}>ইমেইল ঠিকানা (Email Address)</label>
              <input 
                type="email" 
                value={applicantEmail} 
                onChange={(e) => setApplicantEmail(e.target.value)}
                className={`${inputStyle} font-mono`}
                placeholder="যেমন: user@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className={labelStyle}>মোবাইল নম্বর (Phone Number)</label>
              <input 
                type="text" 
                value={applicantPhone} 
                onChange={(e) => setApplicantPhone(e.target.value)}
                className={`${inputStyle} font-mono`}
                placeholder="যেমন: 01712345678"
              />
            </div>
            <div className="space-y-1">
              <label className={labelStyle}>ভাষাজ্ঞান (Languages)</label>
              <input 
                type="text" 
                value={applicantLanguages} 
                onChange={(e) => setApplicantLanguages(e.target.value)}
                className={inputStyle}
                placeholder="যেমন: বাংলা (native), আরবী (conversational)"
              />
            </div>
          </div>
        );

      case 'passport':
        return (
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex justify-between items-center pb-1 border-b border-slate-800">
                <span className="text-emerald-400 font-extrabold text-[9px] uppercase tracking-wider">১ম পাসপোর্ট (Primary Passport)</span>
              </div>
              <div className="space-y-1">
                <label className={labelStyle}>পাসপোর্ট নম্বর (Passport Number)</label>
                <input 
                  type="text" 
                  value={applicantPassportNumber} 
                  onChange={(e) => setApplicantPassportNumber(e.target.value)}
                  className={`${inputStyle} font-mono uppercase`}
                />
              </div>
              <div className="space-y-1">
                <label className={labelStyle}>মেয়াদোত্তীর্ণের তারিখ (Expiry Date)</label>
                <input 
                  type="date" 
                  value={applicantPassportExpiry} 
                  onChange={(e) => setApplicantPassportExpiry(e.target.value)}
                  className={`${inputStyle} font-mono`}
                />
              </div>
              <div className="space-y-1">
                <label className={labelStyle}>BMET রেজিস্ট্রেশন নম্বর (Smart Card No)</label>
                <input 
                  type="text" 
                  value={applicantBmetNumber} 
                  onChange={(e) => setApplicantBmetNumber(e.target.value)}
                  className={`${inputStyle} font-mono`}
                  placeholder="BMET-2026-XXXXX"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className={labelStyle}>মেডিকেল স্ট্যাটাস</label>
                  <select 
                    value={applicantMedicalStatus} 
                    onChange={(e) => setApplicantMedicalStatus(e.target.value as any)}
                    className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none"
                  >
                    <option value="Fit">Fit (ফিট)</option>
                    <option value="Pending">Pending (চলমান)</option>
                    <option value="Unfit">Unfit (আনফিট)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}>পুলিশ ক্লিয়ারেন্স</label>
                  <select 
                    value={applicantPoliceClearance} 
                    onChange={(e) => setApplicantPoliceClearance(e.target.value as any)}
                    className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none"
                  >
                    <option value="Verified">Verified (অনুমোদিত)</option>
                    <option value="Pending">Pending (চলমান)</option>
                    <option value="Not Provided">Not Provided (নাই)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Passports */}
            {additionalPassports.map((passport, index) => (
              <div key={passport.id} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl space-y-3">
                <div className="flex justify-between items-center pb-1 border-b border-slate-800">
                  <span className="text-emerald-400 font-extrabold text-[9px] uppercase tracking-wider">{index + 2}তম পাসপোর্ট (Passport {index + 2})</span>
                  <button
                    type="button"
                    onClick={() => setAdditionalPassports(prev => prev.filter(p => p.id !== passport.id))}
                    className="text-rose-500 hover:text-rose-400 font-bold flex items-center gap-0.5 text-[8px]"
                  >
                    <Trash2 className="w-3 h-3" /> মুছুন
                  </button>
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}>পাসপোর্ট নম্বর</label>
                  <input 
                    type="text" 
                    value={passport.passportNumber} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setAdditionalPassports(prev => prev.map(item => item.id === passport.id ? { ...item, passportNumber: val } : item));
                    }}
                    className={`${inputStyle} font-mono uppercase`}
                    placeholder="যেমন: EH1234567"
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}>মেয়াদোত্তীর্ণের তারিখ</label>
                  <input 
                    type="date" 
                    value={passport.passportExpiry} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setAdditionalPassports(prev => prev.map(item => item.id === passport.id ? { ...item, passportExpiry: val } : item));
                    }}
                    className={`${inputStyle} font-mono`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}>BMET রেজিস্ট্রেশন নম্বর</label>
                  <input 
                    type="text" 
                    value={passport.bmetNumber} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setAdditionalPassports(prev => prev.map(item => item.id === passport.id ? { ...item, bmetNumber: val } : item));
                    }}
                    className={`${inputStyle} font-mono`}
                    placeholder="যেমন: BMET-2026-XXXXX"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className={labelStyle}>মেডিকেল স্ট্যাটাস</label>
                    <select 
                      value={passport.medicalStatus} 
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setAdditionalPassports(prev => prev.map(item => item.id === passport.id ? { ...item, medicalStatus: val } : item));
                      }}
                      className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
                    >
                      <option value="Fit">Fit</option>
                      <option value="Pending">Pending</option>
                      <option value="Unfit">Unfit</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle}>পুলিশ ক্লিয়ারেন্স</label>
                    <select 
                      value={passport.policeClearance} 
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setAdditionalPassports(prev => prev.map(item => item.id === passport.id ? { ...item, policeClearance: val } : item));
                      }}
                      className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
                    >
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Not Provided">Not Provided</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setAdditionalPassports(prev => [...prev, { id: 'passport_' + Date.now(), passportNumber: '', passportExpiry: '', bmetNumber: '', medicalStatus: 'Fit', policeClearance: 'Verified' }])}
              className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[9px] rounded-xl border border-dashed border-emerald-500/30 flex items-center justify-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> নতুন পাসপোর্ট তথ্য যোগ করুন
            </button>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className={labelStyle}>ডিগ্রি / সার্টিফিকেট (Degree/Certificate)</label>
              <input 
                type="text" 
                value={applicantDegree} 
                onChange={(e) => setApplicantDegree(e.target.value)}
                className={inputStyle}
                placeholder="যেমন: SSC, HSC, Vocational Certificate"
              />
            </div>
            <div className="space-y-1">
              <label className={labelStyle}>শিক্ষা প্রতিষ্ঠান (Institution Name)</label>
              <input 
                type="text" 
                value={applicantInstitution} 
                onChange={(e) => setApplicantInstitution(e.target.value)}
                className={inputStyle}
                placeholder="যেমন: বরিশাল টেকনিক্যাল স্কুল ও কলেজ"
              />
            </div>
            <div className="space-y-1">
              <label className={labelStyle}>পাসের সাল (Passing Year)</label>
              <input 
                type="text" 
                value={applicantPassingYear} 
                onChange={(e) => setApplicantPassingYear(e.target.value)}
                className={`${inputStyle} font-mono`}
                placeholder="যেমন: ২০১৮"
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex justify-between items-center pb-1 border-b border-slate-800">
                <span className="text-emerald-400 font-extrabold text-[9px] uppercase tracking-wider">১ম অভিজ্ঞতা (Primary Experience)</span>
              </div>
              <div className="space-y-1">
                <label className={labelStyle}>জিসিসি প্রবাসী অভিজ্ঞতা (GCC Experience)</label>
                <input 
                  type="text" 
                  value={applicantGccExp} 
                  onChange={(e) => setApplicantGccExp(e.target.value)}
                  className={inputStyle}
                  placeholder="যেমন: ৪ বছর (রিয়াদ, সৌদি আরব)"
                />
              </div>
              <div className="space-y-1">
                <label className={labelStyle}>দেশে কাজের অভিজ্ঞতা (Local BD Experience)</label>
                <input 
                  type="text" 
                  value={applicantBdExp} 
                  onChange={(e) => setApplicantBdExp(e.target.value)}
                  className={inputStyle}
                  placeholder="যেমন: ২ বছর (স্থানীয় পরিবহন চালক)"
                />
              </div>
              <div className="space-y-1">
                <label className={labelStyle}>পূর্ববর্তী কোম্পানি ও পদবি (Prev Employer & Role)</label>
                <input 
                  type="text" 
                  value={applicantPrevCompany} 
                  onChange={(e) => setApplicantPrevCompany(e.target.value)}
                  className={inputStyle}
                  placeholder="যেমন: আল-আদিল ট্রান্সপোর্ট গ্রুপ (হেভি ট্রেইলার ড্রাইভার)"
                />
              </div>
            </div>

            {/* Additional Experiences */}
            {additionalExperiences.map((exp, index) => (
              <div key={exp.id} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl space-y-3">
                <div className="flex justify-between items-center pb-1 border-b border-slate-800">
                  <span className="text-emerald-400 font-extrabold text-[9px] uppercase tracking-wider">{index + 2}তম অভিজ্ঞতা (Experience {index + 2})</span>
                  <button
                    type="button"
                    onClick={() => setAdditionalExperiences(prev => prev.filter(e => e.id !== exp.id))}
                    className="text-rose-500 hover:text-rose-400 font-bold flex items-center gap-0.5 text-[8px]"
                  >
                    <Trash2 className="w-3 h-3" /> মুছুন
                  </button>
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}>জিসিসি প্রবাসী অভিজ্ঞতা</label>
                  <input 
                    type="text" 
                    value={exp.gccExp} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setAdditionalExperiences(prev => prev.map(item => item.id === exp.id ? { ...item, gccExp: val } : item));
                    }}
                    className={inputStyle}
                    placeholder="যেমন: ৩ বছর (দুবাই, ইউএই)"
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}>দেশে কাজের অভিজ্ঞতা</label>
                  <input 
                    type="text" 
                    value={exp.bdExp} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setAdditionalExperiences(prev => prev.map(item => item.id === exp.id ? { ...item, bdExp: val } : item));
                    }}
                    className={inputStyle}
                    placeholder="যেমন: ১ বছর (লজিস্টিক)"
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}>পূর্ববর্তী কোম্পানি ও পদবি</label>
                  <input 
                    type="text" 
                    value={exp.prevCompany} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setAdditionalExperiences(prev => prev.map(item => item.id === exp.id ? { ...item, prevCompany: val } : item));
                    }}
                    className={inputStyle}
                    placeholder="যেমন: ডিএইচএল এক্সপ্রেস (ভ্যান চালক)"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setAdditionalExperiences(prev => [...prev, { id: 'exp_' + Date.now(), gccExp: '', bdExp: '', prevCompany: '' }])}
              className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[9px] rounded-xl border border-dashed border-emerald-500/30 flex items-center justify-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> নতুন কাজের অভিজ্ঞতা যোগ করুন
            </button>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className={labelStyle}>পেশাগত দক্ষতা সমূহ (Skills List)</label>
              <textarea 
                rows={4}
                value={applicantSkills} 
                onChange={(e) => setApplicantSkills(e.target.value)}
                className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-emerald-500/80 font-sans leading-normal resize-none"
                placeholder="যেমন: Heavy Vehicle Driving, Trailer Hooking, Air Brakes Maintenance, Google Maps Navigation"
              />
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl space-y-1.5 text-[9px] leading-relaxed text-slate-400 font-semibold">
              <p className="text-emerald-400 font-bold">💡 সাজেস্টেড স্কিলস সমূহ:</p>
              <p>• Heavy Trailer Operation, GCC Traffic Regulations, Logbook Maintenance, Night Shifts Driving, Route Navigation, Vehicle Diagnostics.</p>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[9px]">
                <span className="font-bold text-slate-300">📄 জীবনবৃত্তান্ত (CV / Resume)</span>
                <span className="text-emerald-500 text-[8px] font-black uppercase">PDF ONLY</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <input 
                  type="text" 
                  value={cvFileName} 
                  onChange={(e) => setCvFileName(e.target.value)}
                  className="flex-1 py-1.5 px-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 text-[10px] font-mono focus:outline-none"
                />
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[9px] font-black flex items-center gap-0.5 border border-slate-750 shrink-0 transition">
                  <Upload className="w-2.5 h-2.5" /> আপলোড
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[9px]">
                <span className="font-bold text-slate-300">🛂 পাসপোর্ট কপি (Passport Scan)</span>
                <span className="text-emerald-500 text-[8px] font-black uppercase">PDF / JPG</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <input 
                  type="text" 
                  value={passportCopyName} 
                  onChange={(e) => setPassportCopyName(e.target.value)}
                  className="flex-1 py-1.5 px-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 text-[10px] font-mono focus:outline-none"
                />
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[9px] font-black flex items-center gap-0.5 border border-slate-750 shrink-0 transition">
                  <Upload className="w-2.5 h-2.5" /> আপলোড
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[9px]">
                <span className="font-bold text-slate-300">⚕️ মেডিকেল সার্টিফিকেট (Medical Cert)</span>
                <span className="text-emerald-500 text-[8px] font-black uppercase">GAMCA FIT</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <input 
                  type="text" 
                  value={medicalCertName} 
                  onChange={(e) => setMedicalCertName(e.target.value)}
                  className="flex-1 py-1.5 px-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 text-[10px] font-mono focus:outline-none"
                />
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[9px] font-black flex items-center gap-0.5 border border-slate-750 shrink-0 transition">
                  <Upload className="w-2.5 h-2.5" /> আপলোড
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[9px]">
                <span className="font-bold text-slate-300">👮 পুলিশ ক্লিয়ারেন্স (Police Clearance)</span>
                <span className="text-emerald-500 text-[8px] font-black uppercase">VERIFIED PDF</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <input 
                  type="text" 
                  value={policeCertName} 
                  onChange={(e) => setPoliceCertName(e.target.value)}
                  className="flex-1 py-1.5 px-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 text-[10px] font-mono focus:outline-none"
                />
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[9px] font-black flex items-center gap-0.5 border border-slate-750 shrink-0 transition">
                  <Upload className="w-2.5 h-2.5" /> আপলোড
                </button>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-indigo-950 border border-emerald-500/30 rounded-xl flex justify-between items-center shadow-lg">
              <div>
                <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">টোটাল পরিশোধিত ফি</p>
                <h4 className="text-base font-black text-slate-100 font-mono mt-0.5">৳৬০,০০০ BDT</h4>
              </div>
              <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-[8px] font-black uppercase flex items-center gap-0.5 shadow-md shadow-emerald-500/10">
                <Check className="w-2 h-2 stroke-[3]" /> Verified
              </span>
            </div>

            {/* Official Agency Bank & Payment Info */}
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
              <p className="text-[9px] font-black text-slate-200 flex items-center justify-between border-b border-slate-800 pb-1">
                <span>🏦 এজেন্সির ব্যাংক ও মোবাইল ব্যাংকিং হিসাব</span>
                <span className="text-[7.5px] text-amber-400 font-mono">Verified A/C</span>
              </p>
              <div className="text-[8.5px] text-slate-300 space-y-1 bg-slate-950 p-2 rounded-lg font-mono">
                <p className="flex justify-between"><span>🇳🇱 DBBL:</span> <strong className="text-emerald-400">148-110-294021</strong></p>
                <p className="flex justify-between"><span>🕌 IBBL:</span> <strong className="text-emerald-400">2050-38101-009</strong></p>
                <p className="flex justify-between"><span>📱 bKash Merchant:</span> <strong className="text-pink-400">01711-000000</strong></p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-[9.5px] font-bold text-slate-300">পরিশোধিত রিসিপ্ট ও হিস্ট্রি ({paymentList.length}):</p>
              {paymentList.map((pay) => (
                <div key={pay.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div className="min-w-0 flex-1 pr-2">
                    <h5 className="text-[10px] font-bold text-slate-200 leading-snug truncate">{pay.title}</h5>
                    <p className="text-[8px] text-slate-500 font-mono mt-0.5">{pay.date}</p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span className="text-[10.5px] font-black text-slate-200 font-mono">{pay.amount}</span>
                    <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1 py-0.2 rounded text-[7.5px] font-bold flex items-center gap-0.5">
                      • {pay.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-[10.5px] font-bold text-slate-200">সিকিউরিটি লগইন মেথড (Login Type)</h4>
                <p className="text-[8.5px] text-slate-400 mt-0.5">আপনার সিকিউর ফোন ভেরিফাইড মেথড সক্রিয় আছে।</p>
              </div>
              <span className="bg-blue-500/15 text-blue-400 border border-blue-500/25 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase">OTP Verified</span>
            </div>

            <div className="space-y-1">
              <label className={labelStyle}>সিকিউরিটি পিন পরিবর্তন (Update PIN Code)</label>
              <input 
                type="password" 
                defaultValue="••••"
                className={`${inputStyle} font-mono`}
                placeholder="নতুন ৪-ডিজিট সিকিউরিটি পিন লিখুন"
              />
            </div>
            
            <div className="space-y-1">
              <label className={labelStyle}>আঙ্গুলের ছাপ সিকিউরিটি (Biometric Fingerprint)</label>
              <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9.5px] text-slate-300 font-semibold">ফিঙ্গারপ্রিন্ট আনলক একটিভ করুন</span>
                <input 
                  type="checkbox" 
                  defaultChecked
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-800 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">নোটিফিকেশন অ্যালার্ট প্রেফারেন্স</h4>
            
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="text-[10px] font-bold text-slate-200">এসএমএস অ্যালার্ট (SMS Alert)</h5>
                  <p className="text-[8px] text-slate-500">ভিসা স্ট্যাটাস আপডেট সরাসরি আপনার ফোনে যাবে।</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="text-[10px] font-bold text-slate-200">ইমেইল নোটিফিকেশন (Email Notif)</h5>
                  <p className="text-[8px] text-slate-500">নিয়োগকারীদের আমন্ত্রণপত্র ইমেইলে পাঠানো হবে।</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="text-[10px] font-bold text-slate-200">পুশ নোটিফিকেশন (App Push Notif)</h5>
                  <p className="text-[8px] text-slate-500">অ্যাপ স্ক্রিনে রিয়েল-টাইম নোটিফিকেশন ব্যানার।</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getSheetTitle = () => {
    switch (profileSheet) {
      case 'personal': return '👤 ব্যক্তিগত তথ্য (Personal Details)';
      case 'passport': return '🛂 পাসপোর্ট তথ্য (Passport Details)';
      case 'education': return '🎓 শিক্ষাগত যোগ্যতা (Education Details)';
      case 'experience': return '💼 কাজের অভিজ্ঞতা (Experience Details)';
      case 'skills': return '🛠️ দক্ষতা সমূহ (Skills & Specialties)';
      case 'documents': return '📁 ডকুমেন্ট আপলোড (My Documents)';
      case 'payments': return '💳 পেমেন্ট রেকর্ড (Payment Records)';
      case 'security': return '🔒 নিরাপত্তা ও লগইন (Security Settings)';
      case 'notifications': return '🔔 নোটিফিকেশন সেটিংস (Alert Settings)';
      default: return 'Profile Detail';
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] z-50 flex flex-col justify-end">
      {/* Click outside container to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
      
      {/* Sheet Frame inside Simulator */}
      <div className="w-full bg-[#0d131e] border-t border-slate-800 rounded-t-2xl p-4 space-y-4 shadow-2xl max-h-[90%] flex flex-col">
        {/* Handle slider bar */}
        <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto -mt-1" />
        
        <div className="flex justify-between items-center border-b border-slate-850 pb-2 shrink-0">
          <h3 className="text-[11px] font-black text-slate-100 flex items-center gap-1.5 uppercase tracking-tight">
            {getSheetTitle()}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-grow overflow-y-auto min-h-0">
          {renderSheetContent()}
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-slate-850 shrink-0 grid grid-cols-2 gap-2">
          <button 
            onClick={onClose}
            className="w-full py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 font-bold text-[9.5px] rounded-xl transition-all"
          >
            বাতিল (Cancel)
          </button>
          <button 
            onClick={() => {
              onSave();
              onClose();
            }}
            className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[9.5px] rounded-xl shadow-md shadow-emerald-500/5 flex items-center justify-center gap-1 transition-all"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" /> সেভ করুন (Save)
          </button>
        </div>
      </div>
    </div>
  );
}
