import React, { useState } from 'react';
import { 
  Building2, MapPin, DollarSign, Calendar, FileText, CheckCircle2, 
  ArrowRight, ArrowLeft, Upload, Sparkles, ShieldCheck, Home, Utensils, 
  Stethoscope, Plane, Bus, Palmtree, Plus, Trash2, Check, HelpCircle, Image as ImageIcon, X
} from 'lucide-react';

interface NewJobPostFormProps {
  newJobTitle: string;
  setNewJobTitle: (val: string) => void;
  newJobCategory: string;
  setNewJobCategory: (val: string) => void;
  newJobCountry: string;
  setNewJobCountry: (val: string) => void;
  newJobLocation: string;
  setNewJobLocation: (val: string) => void;
  newJobType: string;
  setNewJobType: (val: string) => void;
  newJobVisaType: any;
  setNewJobVisaType: (val: any) => void;
  newJobSalary: string;
  setNewJobSalary: (val: string) => void;
  newJobDeadline: string;
  setNewJobDeadline: (val: string) => void;
  newJobDesc: string;
  setNewJobDesc: (val: string) => void;
  newJobReqs: string;
  setNewJobReqs: (val: string) => void;
  isPremiumPack: boolean;
  setIsPremiumPack: (val: boolean) => void;
  handlePostJobSubmit: (e: React.FormEvent) => void;
  activeCompanyName?: string;
  activeCompanyLogo?: string;
}

export const NewJobPostForm: React.FC<NewJobPostFormProps> = ({
  newJobTitle,
  setNewJobTitle,
  newJobCategory,
  setNewJobCategory,
  newJobCountry,
  setNewJobCountry,
  newJobLocation,
  setNewJobLocation,
  newJobType,
  setNewJobType,
  newJobVisaType,
  setNewJobVisaType,
  newJobSalary,
  setNewJobSalary,
  newJobDeadline,
  setNewJobDeadline,
  newJobDesc,
  setNewJobDesc,
  newJobReqs,
  setNewJobReqs,
  isPremiumPack,
  setIsPremiumPack,
  handlePostJobSubmit,
  activeCompanyName,
  activeCompanyLogo,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1 extra fields
  const [sector, setSector] = useState<string>('PCM Sector');
  const [companyName, setCompanyName] = useState<string>(activeCompanyName || 'ABC Engineering Pte Ltd');
  const [jobImage, setJobImage] = useState<string | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(activeCompanyLogo || null);

  // Step 2 extra fields (Salary & Benefits)
  const [currency, setCurrency] = useState<string>('S$ (Singapore Dollar)');
  const [salaryPeriod, setSalaryPeriod] = useState<string>('প্রতি ঘণ্টা');
  const [salaryRate, setSalaryRate] = useState<string>('17');
  const [overtimeRate, setOvertimeRate] = useState<string>('25');
  const [overtimeOption, setOvertimeOption] = useState<string>('আছে');
  
  // Benefits Toggles
  const [accommodation, setAccommodation] = useState<boolean>(true);
  const [food, setFood] = useState<boolean>(true);
  const [medical, setMedical] = useState<boolean>(true);
  const [airTicket, setAirTicket] = useState<boolean>(true);
  const [localTransport, setLocalTransport] = useState<boolean>(false);
  const [annualLeave, setAnnualLeave] = useState<string>('14 দিন');
  
  const [contractPeriod, setContractPeriod] = useState<string>('2 বছর');
  const [probationPeriod, setProbationPeriod] = useState<string>('2 মাস');
  const [otherBenefits, setOtherBenefits] = useState<string>('');

  // Step 3 extra fields (Qualifications & Documents)
  const [education, setEducation] = useState<string>('এসএসসি (SSC)');
  const [languageSkill, setLanguageSkill] = useState<string>('English, Basic');
  const [experience, setExperience] = useState<string>('১-২ বছর');
  const [physicalFit, setPhysicalFit] = useState<string>('শারীরিক ফিটনেস সার্টিফিকেট আবশ্যক');
  const [minAge, setMinAge] = useState<number>(21);
  const [maxAge, setMaxAge] = useState<number>(40);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Both'>('Both');
  const [otherReqs, setOtherReqs] = useState<string>('');

  // Required Documents checkboxes
  const [requiredDocs, setRequiredDocs] = useState<string[]>([
    'পাসপোর্ট কপি',
    'শিক্ষাগত সনদ',
    'পুলিশ ক্লিয়ারেন্স',
    'মেডিকেল সার্টিফিকেট'
  ]);
  const [customDocInput, setCustomDocInput] = useState<string>('');
  const [showAddCustomDoc, setShowAddCustomDoc] = useState<boolean>(false);

  // Synced formatted salary calculation
  const updateFormattedSalary = (rate: string, curr: string, period: string) => {
    const symbol = curr.split(' ')[0] || 'S$';
    const formatted = `${symbol} ${rate} / ${period}`;
    setNewJobSalary(formatted);
  };

  // Synchronize requirement text
  const compileRequirementsText = () => {
    const reqList: string[] = [];
    if (education && education !== 'নির্বাচন করুন') reqList.push(`• শিক্ষাগত যোগ্যতা: ${education}`);
    if (languageSkill) reqList.push(`• ভাষার দক্ষতা: ${languageSkill}`);
    if (experience && experience !== 'নির্বাচন করুন') reqList.push(`• অভিজ্ঞতা: ${experience}`);
    if (physicalFit && physicalFit !== 'নির্বাচন করুন') reqList.push(`• শারীরিক যোগ্যতা: ${physicalFit}`);
    reqList.push(`• বয়স সীমা: ${minAge} - ${maxAge} বছর (${gender === 'Male' ? 'পুরুষ' : gender === 'Female' ? 'মহিলা' : 'উভয়'})`);
    if (requiredDocs.length > 0) reqList.push(`• প্রয়োজনীয় কাগজপত্র: ${requiredDocs.join(', ')}`);
    if (otherReqs) reqList.push(`• অন্যান্য: ${otherReqs}`);

    setNewJobReqs(reqList.join('\n'));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!newJobTitle.trim()) {
        alert('অনুগ্রহ করে পদের নাম প্রদান করুন');
        return;
      }
      updateFormattedSalary(salaryRate, currency, salaryPeriod);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      updateFormattedSalary(salaryRate, currency, salaryPeriod);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      compileRequirementsText();
      setCurrentStep(4);
    }
  };

  const handleToggleDoc = (docName: string) => {
    if (requiredDocs.includes(docName)) {
      setRequiredDocs(requiredDocs.filter(d => d !== docName));
    } else {
      setRequiredDocs([...requiredDocs, docName]);
    }
  };

  const handleAddCustomDoc = () => {
    if (customDocInput.trim()) {
      if (!requiredDocs.includes(customDocInput.trim())) {
        setRequiredDocs([...requiredDocs, customDocInput.trim()]);
      }
      setCustomDocInput('');
      setShowAddCustomDoc(false);
    }
  };

  // NEW ADD SYSTEM States (সেক্টর/বিভাগ, দেশ, এবং ক্যাটাগরি ডাইনামিক যোগ)
  const [sectorsList, setSectorsList] = useState<string[]>([
    'PCM Sector',
    'Construction & Engineering',
    'Manufacturing & Process',
    'Services & Hospitality',
    'Logistics & Transport',
    'Marine & Offshore',
    'Healthcare & Medical',
    'Agriculture & Farming',
    'Garments & Textile'
  ]);
  const [showAddSectorModal, setShowAddSectorModal] = useState<boolean>(false);
  const [newSectorInput, setNewSectorInput] = useState<string>('');

  const [countriesListState, setCountriesListState] = useState<Array<{ code: string; name: string; flag: string }>>([
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'AE', name: 'UAE (Dubai)', flag: '🇦🇪' },
    { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
    { code: 'OM', name: 'Oman', flag: '🇴🇲' },
    { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
    { code: 'RO', name: 'Romania', flag: '🇷🇴' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  ]);
  const [showAddCountryModal, setShowAddCountryModal] = useState<boolean>(false);
  const [newCountryNameInput, setNewCountryNameInput] = useState<string>('');
  const [newCountryFlagInput, setNewCountryFlagInput] = useState<string>('🌐');
  const [newCountryCodeInput, setNewCountryCodeInput] = useState<string>('');

  const [categoriesList, setCategoriesList] = useState<string[]>([
    'PCM Sector Worker',
    'General Construction Worker',
    'Heavy Truck / Trailer Driver',
    'Factory Production Worker',
    'Professional General Cook',
    'Cleaner & Housekeeping',
    'Welder & Pipefitter',
    'Electrician & Technician',
    'Staff Nurse & Caregiver',
    'Agriculture & Farming Worker',
    'Hotel & Restaurant Staff'
  ]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [newCategoryInput, setNewCategoryInput] = useState<string>('');

  const handleAddNewSector = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSectorInput.trim()) return;
    const name = newSectorInput.trim();
    if (!sectorsList.includes(name)) {
      setSectorsList(prev => [...prev, name]);
    }
    setSector(name);
    setNewSectorInput('');
    setShowAddSectorModal(false);
    alert(`NEW ADD SYSTEM: নতুন সেক্টর/বিভাগ "${name}" সফলভাবে যুক্ত ও সিলেক্ট করা হয়েছে!`);
  };

  const handleAddNewCountry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCountryNameInput.trim()) return;
    const name = newCountryNameInput.trim();
    const flag = newCountryFlagInput.trim() || '🌐';
    const code = newCountryCodeInput.trim().toUpperCase() || name.substring(0, 2).toUpperCase();
    
    if (!countriesListState.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      setCountriesListState(prev => [...prev, { code, name, flag }]);
    }
    setNewJobCountry(name);
    setNewCountryNameInput('');
    setNewCountryFlagInput('🌐');
    setNewCountryCodeInput('');
    setShowAddCountryModal(false);
    alert(`NEW ADD SYSTEM: নতুন দেশ "${flag} ${name}" সফলভাবে তালিকায় যুক্ত ও সিলেক্ট করা হয়েছে!`);
  };

  const handleAddNewCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCategoryInput.trim()) return;
    const name = newCategoryInput.trim();
    if (!categoriesList.includes(name)) {
      setCategoriesList(prev => [...prev, name]);
    }
    setNewJobCategory(name);
    setNewJobType(name);
    setNewCategoryInput('');
    setShowAddCategoryModal(false);
    alert(`NEW ADD SYSTEM: নতুন কাজের ধরন/ক্যাটাগরি "${name}" সফলভাবে যুক্ত ও সিলেক্ট করা হয়েছে!`);
  };

  const handleImageUploadSim = (type: 'job' | 'logo') => {
    if (type === 'job') {
      setJobImage('https://images.unsplash.com/photo-1541888946425-d0fbb1862568?auto=format&fit=crop&w=600&q=80');
    } else {
      setCompanyLogo('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80');
    }
  };

  const countriesList = [
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'AE', name: 'UAE (Dubai)', flag: '🇦🇪' },
    { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
    { code: 'OM', name: 'Oman', flag: '🇴🇲' },
    { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
    { code: 'RO', name: 'Romania', flag: '🇲🇩' },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-4 md:p-6 shadow-sm space-y-6 text-slate-800 transition-all">
      
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3.5">
        <div>
          <h2 className="text-base md:text-lg font-extrabold text-blue-900 flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-xl">📋</span>
            নতুন জব যোগ করুন
          </h2>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            সঠিক তথ্য প্রদান করে প্রবাসীদের জন্য আকর্ষণীয় সার্কুলার তৈরি করুন
          </p>
        </div>
        <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Employer
        </span>
      </div>

      {/* Stepper Progress Bar */}
      <div className="py-2 px-1 bg-slate-50/80 rounded-2xl border border-slate-100">
        <div className="grid grid-cols-4 gap-1 relative">
          
          {/* Step 1 */}
          <div 
            onClick={() => setCurrentStep(1)}
            className={`flex flex-col items-center text-center cursor-pointer group ${
              currentStep >= 1 ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
              currentStep > 1 
                ? 'bg-blue-600 text-white shadow-sm' 
                : currentStep === 1 
                ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md font-black' 
                : 'bg-white border border-slate-300 text-slate-400'
            }`}>
              {currentStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
            </div>
            <span className={`text-[10px] md:text-xs font-bold leading-tight ${currentStep === 1 ? 'text-blue-900 font-extrabold' : 'text-slate-600'}`}>
              জব তথ্য
            </span>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => currentStep > 1 && setCurrentStep(2)}
            className={`flex flex-col items-center text-center cursor-pointer group ${
              currentStep >= 2 ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
              currentStep > 2 
                ? 'bg-blue-600 text-white shadow-sm' 
                : currentStep === 2 
                ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md font-black' 
                : 'bg-white border border-slate-300 text-slate-400'
            }`}>
              {currentStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
            </div>
            <span className={`text-[10px] md:text-xs font-bold leading-tight ${currentStep === 2 ? 'text-blue-900 font-extrabold' : 'text-slate-600'}`}>
              বেতন ও সুবিধা
            </span>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => currentStep > 2 && setCurrentStep(3)}
            className={`flex flex-col items-center text-center cursor-pointer group ${
              currentStep >= 3 ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
              currentStep > 3 
                ? 'bg-blue-600 text-white shadow-sm' 
                : currentStep === 3 
                ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md font-black' 
                : 'bg-white border border-slate-300 text-slate-400'
            }`}>
              {currentStep > 3 ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
            </div>
            <span className={`text-[10px] md:text-xs font-bold leading-tight ${currentStep === 3 ? 'text-blue-900 font-extrabold' : 'text-slate-600'}`}>
              প্রয়োজনীয় যোগ্যতা
            </span>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => currentStep > 3 && setCurrentStep(4)}
            className={`flex flex-col items-center text-center cursor-pointer group ${
              currentStep === 4 ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
              currentStep === 4 
                ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md font-black' 
                : 'bg-white border border-slate-300 text-slate-400'
            }`}>
              4
            </div>
            <span className={`text-[10px] md:text-xs font-bold leading-tight ${currentStep === 4 ? 'text-blue-900 font-extrabold' : 'text-slate-600'}`}>
              পর্যালোচনা
            </span>
          </div>

        </div>
      </div>

      {/* STEP 1 FORM: JOB INFORMATION */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-fade-in text-xs">
          
          <div className="flex items-center gap-1.5 text-blue-900 font-bold border-b pb-2 text-xs">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>জব তথ্য (Job Information)</span>
          </div>

          {/* Job Title */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              পদের নাম <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              required
              placeholder="যেমন: PCM Sector Worker" 
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            />
          </div>

          {/* Job Category */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 block">
                কাজের ধরন / ক্যাটাগরি <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(true)}
                className="text-[10px] font-extrabold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                <span>NEW ADD SYSTEM: নতুন ক্যাটাগরি যোগ করুন</span>
              </button>
            </div>
            <select
              value={newJobCategory}
              onChange={(e) => {
                setNewJobCategory(e.target.value);
                setNewJobType(e.target.value);
              }}
              className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="">নির্বাচন করুন</option>
              {categoriesList.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Country & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700 block">
                  দেশ <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddCountryModal(true)}
                  className="text-[10px] font-extrabold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>NEW ADD SYSTEM: নতুন দেশ যোগ করুন</span>
                </button>
              </div>
              <select
                value={newJobCountry}
                onChange={(e) => setNewJobCountry(e.target.value)}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              >
                {countriesListState.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                কর্মস্থল/শহর <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                placeholder="যেমন: Singapore, Riyadh, Rome, Berlin"
                value={newJobLocation}
                onChange={(e) => setNewJobLocation(e.target.value)}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Sector / Department */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 block">
                সেক্টর/বিভাগ <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAddSectorModal(true)}
                className="text-[10px] font-extrabold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600 stroke-[3]" />
                <span>NEW ADD SYSTEM: নতুন সেক্টর যোগ করুন</span>
              </button>
            </div>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="">নির্বাচন করুন</option>
              {sectorsList.map((sec, idx) => (
                <option key={idx} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Company Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              কোম্পানির নাম
            </label>
            <input 
              type="text"
              placeholder="যেমন: ABC Engineering Pte Ltd"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            />
          </div>

          {/* Job Summary */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700">
                জব সংক্ষিপ্ত বিবরণ <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {newJobDesc.length}/500
              </span>
            </div>
            <textarea 
              rows={4}
              maxLength={500}
              placeholder="এই পদের কাজের সংক্ষিপ্ত বিবরণ লিখুন..."
              value={newJobDesc}
              onChange={(e) => setNewJobDesc(e.target.value)}
              className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 leading-relaxed"
            />
          </div>

          {/* Job Image & Logo Upload Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Job Banner Image */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">জব ছবি</label>
              <div 
                onClick={() => handleImageUploadSim('job')}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 p-3 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center min-h-[90px]"
              >
                {jobImage ? (
                  <div className="relative w-full h-16 rounded-lg overflow-hidden">
                    <img src={jobImage} alt="Job Banner" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded">পরিবর্তন করুন</span>
                  </div>
                ) : (
                  <>
                    <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-blue-600 text-xs">ছবি আপলোড করুন</span>
                    <span className="text-[9px] text-slate-400 font-medium">JPG, PNG (Max 2MB)</span>
                  </>
                )}
              </div>
            </div>

            {/* Company Logo */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">কোম্পানির লোগো (ঐচ্ছিক)</label>
              <div 
                onClick={() => handleImageUploadSim('logo')}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 p-3 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center min-h-[90px]"
              >
                {companyLogo ? (
                  <div className="flex items-center gap-2">
                    <img src={companyLogo} alt="Logo" className="w-10 h-10 rounded-full object-cover border" />
                    <span className="text-[10px] text-blue-600 font-bold">লোগো আপলোড হয়েছে</span>
                  </div>
                ) : (
                  <>
                    <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-blue-600 text-xs">লোগো আপলোড করুন</span>
                    <span className="text-[9px] text-slate-400 font-medium">JPG, PNG (Max 1MB)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit/Next Step Button */}
          <div className="pt-3">
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>পরবর্তী ধাপ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2 FORM: SALARY & BENEFITS */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-fade-in text-xs">
          
          <div className="flex items-center gap-1.5 text-blue-900 font-bold border-b pb-2 text-xs">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span>বেতন ও সুবিধা (Salary & Benefits)</span>
          </div>

          {/* Currency & Salary Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">মুদ্রা</label>
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  updateFormattedSalary(salaryRate, e.target.value, salaryPeriod);
                }}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              >
                <option value="S$ (Singapore Dollar)">S$ (Singapore Dollar)</option>
                <option value="SAR (Saudi Riyal)">SAR (Saudi Riyal)</option>
                <option value="AED (UAE Dirham)">AED (UAE Dirham)</option>
                <option value="MYR (Malaysian Ringgit)">MYR (Malaysian Ringgit)</option>
                <option value="EUR (Euro)">EUR (Euro)</option>
                <option value="QAR (Qatari Riyal)">QAR (Qatari Riyal)</option>
                <option value="USD ($)">USD ($)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">বেতন ধরন</label>
              <select
                value={salaryPeriod}
                onChange={(e) => {
                  setSalaryPeriod(e.target.value);
                  updateFormattedSalary(salaryRate, currency, e.target.value);
                }}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              >
                <option value="প্রতি ঘণ্টা">প্রতি ঘণ্টা</option>
                <option value="প্রতি মাস">প্রতি মাস</option>
                <option value="প্রতি দিন">প্রতি দিন</option>
                <option value="চুক্তিভিত্তিক">চুক্তিভিত্তিক</option>
              </select>
            </div>
          </div>

          {/* Basic Salary */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              {salaryPeriod} বেতন ({currency.split(' ')[0]}) <span className="text-rose-500">*</span>
            </label>
            <input 
              type="number"
              value={salaryRate}
              onChange={(e) => {
                setSalaryRate(e.target.value);
                updateFormattedSalary(e.target.value, currency, salaryPeriod);
              }}
              className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-slate-800 text-sm"
            />
          </div>

          {/* Overtime Pay & Option */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                ওভারটাইম বেতন ({currency.split(' ')[0]})
              </label>
              <input 
                type="number"
                value={overtimeRate}
                onChange={(e) => setOvertimeRate(e.target.value)}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-slate-800 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">ওভারটাইম সুবিধা</label>
              <select
                value={overtimeOption}
                onChange={(e) => setOvertimeOption(e.target.value)}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              >
                <option value="আছে">আছে</option>
                <option value="নাই">নাই</option>
                <option value="কোম্পানির নিয়ম অনুযায়ী">কোম্পানির নিয়ম অনুযায়ী</option>
              </select>
            </div>
          </div>

          {/* Benefits Cards Grid (6 items) */}
          <div className="space-y-2 pt-1">
            <label className="font-bold text-slate-700 block text-xs">সুবিধাসমূহ</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              
              {/* Accommodation */}
              <div className="p-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded-xl">
                    <Home className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[11px] text-slate-800">আবাসন সুবিধা</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAccommodation(!accommodation)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                    accommodation ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    accommodation ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Food */}
              <div className="p-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 text-amber-600 rounded-xl">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[11px] text-slate-800">খাবার সুবিধা</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFood(!food)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                    food ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    food ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Medical */}
              <div className="p-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-rose-100 text-rose-600 rounded-xl">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[11px] text-slate-800">মেডিকেল সুবিধা</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMedical(!medical)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                    medical ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    medical ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Air Ticket */}
              <div className="p-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Plane className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[11px] text-slate-800">এয়ার টিকেট</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAirTicket(!airTicket)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                    airTicket ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    airTicket ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Local Transport */}
              <div className="p-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Bus className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[11px] text-slate-800">লোকাল ট্রান্সপোর্ট</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLocalTransport(!localTransport)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                    localTransport ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    localTransport ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Annual Leave */}
              <div className="p-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-teal-100 text-teal-600 rounded-xl">
                    <Palmtree className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[11px] text-slate-800">বার্ষিক ছুটি</span>
                </div>
                <span className="font-extrabold text-blue-900 text-[11px] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                  {annualLeave}
                </span>
              </div>

            </div>
          </div>

          {/* Contract Duration & Probation Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">চুক্তির মেয়াদ</label>
              <select
                value={contractPeriod}
                onChange={(e) => setContractPeriod(e.target.value)}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              >
                <option value="2 বছর">2 বছর</option>
                <option value="1 বছর">1 বছর</option>
                <option value="3 বছর">3 বছর</option>
                <option value="নবায়নযোগ্য">নবায়নযোগ্য</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">পরীক্ষামূলক সময়</label>
              <select
                value={probationPeriod}
                onChange={(e) => setProbationPeriod(e.target.value)}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              >
                <option value="2 মাস">2 মাস</option>
                <option value="1 মাস">1 মাস</option>
                <option value="3 মাস">3 মাস</option>
                <option value="6 মাস">6 মাস</option>
                <option value="নাই">নাই</option>
              </select>
            </div>
          </div>

          {/* Other Benefits */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700">অন্যান্য সুবিধা (ঐচ্ছিক)</label>
              <span className="text-[10px] text-slate-400 font-mono">{otherBenefits.length}/300</span>
            </div>
            <textarea 
              rows={3}
              maxLength={300}
              placeholder="অতিরিক্ত সুবিধা লিখুন..."
              value={otherBenefits}
              onChange={(e) => setOtherBenefits(e.target.value)}
              className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            />
          </div>

          {/* Nav Buttons */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="w-1/3 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পূর্ববর্তী</span>
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="w-2/3 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>পরবর্তী ধাপ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 3 FORM: REQUIREMENTS & QUALIFICATIONS */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-fade-in text-xs">
          
          <div className="flex items-center gap-1.5 text-blue-900 font-bold border-b pb-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>প্রয়োজনীয় যোগ্যতা (Requirements & Qualifications)</span>
          </div>

          {/* Education & Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">শিক্ষাগত যোগ্যতা</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              >
                <option value="নির্বাচন করুন">নির্বাচন করুন</option>
                <option value="এসএসসি (SSC)">এসএসসি (SSC)</option>
                <option value="এইচএসসি (HSC)">এইচএসসি (HSC)</option>
                <option value="ডিপ্লোমা (Diploma)">ডিপ্লোমা (Diploma)</option>
                <option value="ডিগ্রী (Degree)">ডিগ্রী (Degree)</option>
                <option value="প্রাথমিক শিক্ষা (Primary)">প্রাথমিক শিক্ষা (Primary)</option>
                <option value="কোন প্রাতিষ্ঠানিক ডিগ্রি প্রয়োজন নেই">কোন প্রাতিষ্ঠানিক ডিগ্রি প্রয়োজন নেই</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">ভাষার দক্ষতা</label>
              <input 
                type="text"
                placeholder="যেমন: English, Basic"
                value={languageSkill}
                onChange={(e) => setLanguageSkill(e.target.value)}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Experience & Physical Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">অভিজ্ঞতা</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              >
                <option value="নির্বাচন করুন">নির্বাচন করুন</option>
                <option value="অভিজ্ঞতা ছাড়া আবেদন সম্ভব (Freshers)">অভিজ্ঞতা ছাড়া আবেদন সম্ভব (Freshers)</option>
                <option value="১-২ বছর">১-২ বছর</option>
                <option value="৩-৫ বছর">৩-৫ বছর</option>
                <option value="৫+ বছর">৫+ বছর</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">শারীরিক যোগ্যতা</label>
              <select
                value={physicalFit}
                onChange={(e) => setPhysicalFit(e.target.value)}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              >
                <option value="নির্বাচন করুন">নির্বাচন করুন</option>
                <option value="শারীরিক ফিটনেস সার্টিফিকেট আবশ্যক">শারীরিক ফিটনেস সার্টিফিকেট আবশ্যক</option>
                <option value="উচ্চতা ৫'৪&quot;+, শারীরিক ফিট">উচ্চতা ৫'৪"+, শারীরিক ফিট</option>
                <option value="ভারী কাজ বহনে সক্ষম">ভারী কাজ বহনে সক্ষম</option>
              </select>
            </div>
          </div>

          {/* Age Limit & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">বয়স সীমা</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={minAge} 
                  onChange={(e) => setMinAge(Number(e.target.value))}
                  className="w-16 p-2 bg-slate-50 border border-slate-300 rounded-xl text-center font-bold text-slate-800" 
                />
                <span className="text-slate-400 font-bold">-</span>
                <input 
                  type="number" 
                  value={maxAge} 
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                  className="w-16 p-2 bg-slate-50 border border-slate-300 rounded-xl text-center font-bold text-slate-800" 
                />
                <span className="text-slate-500 font-bold text-xs">বছর</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">লিঙ্গ</label>
              <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setGender('Male')}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition ${
                    gender === 'Male' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  পুরুষ
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Female')}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition ${
                    gender === 'Female' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  মহিলা
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Both')}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition ${
                    gender === 'Both' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  উভয়
                </button>
              </div>
            </div>
          </div>

          {/* Other Requirements */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700">অন্যান্য যোগ্যতা (ঐচ্ছিক)</label>
              <span className="text-[10px] text-slate-400 font-mono">{otherReqs.length}/300</span>
            </div>
            <textarea 
              rows={3}
              maxLength={300}
              placeholder="অন্যান্য যোগ্যতা লিখুন..."
              value={otherReqs}
              onChange={(e) => setOtherReqs(e.target.value)}
              className="w-full p-2.5 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            />
          </div>

          {/* Required Documents Card */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-2.5">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="font-extrabold text-blue-900 text-xs flex items-center gap-1.5">
                🎓 দরকারি ডকুমেন্টস
              </span>
              <span className="text-[10px] font-bold text-slate-400">প্রার্থীদের সাবমিট করতে হবে</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'পাসপোর্ট কপি',
                'শিক্ষাগত সনদ',
                'অভিজ্ঞতার সনদ',
                'পুলিশ ক্লিয়ারেন্স',
                'মেডিকেল সার্টিফিকেট',
                'ছবি (সাদা ব্যাকগ্রাউন্ড)'
              ].map((docItem) => {
                const isChecked = requiredDocs.includes(docItem);
                return (
                  <label 
                    key={docItem}
                    onClick={() => handleToggleDoc(docItem)}
                    className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer select-none transition ${
                      isChecked 
                        ? 'bg-blue-50/80 border-blue-200 text-blue-900 font-bold' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                      isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs">{docItem}</span>
                  </label>
                );
              })}
            </div>

            {/* Custom Doc Addition */}
            {showAddCustomDoc ? (
              <div className="flex gap-2 pt-1">
                <input 
                  type="text"
                  placeholder="নতুন ডকুমেন্টের নাম লিখুন..."
                  value={customDocInput}
                  onChange={(e) => setCustomDocInput(e.target.value)}
                  className="flex-grow p-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomDoc}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                >
                  যোগ করুন
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddCustomDoc(true)}
                className="w-full py-2 border border-dashed border-blue-300 hover:border-blue-500 text-blue-600 bg-blue-50/40 hover:bg-blue-50 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>আরও যোগ করুন</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="py-3 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পূর্ববর্তী</span>
            </button>
            
            <button
              type="button"
              onClick={() => {
                compileRequirementsText();
                alert('চাকরির বিবরণটি ড্রাফট হিসেবে সংরক্ষিত হয়েছে!');
              }}
              className="py-3 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>💾 সেভ হিসেবে ড্রাফট</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="flex-grow py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>পর্যালোচনা করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 4 FORM: REVIEW & PUBLISH */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-fade-in text-xs">
          
          <div className="flex items-center gap-1.5 text-blue-900 font-bold border-b pb-2 text-xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>জব সার্কুলার পর্যালোচনা (Review Job Details)</span>
          </div>

          {/* Summary Card Preview */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            
            {/* Header info */}
            <div className="flex justify-between items-start gap-2 border-b border-slate-200 pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                  {sector}
                </span>
                <h3 className="text-base font-extrabold text-slate-900">{newJobTitle || 'PCM Sector Worker'}</h3>
                <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
                  🏢 {companyName} • 📍 {newJobLocation}, {newJobCountry}
                </p>
              </div>

              {jobImage ? (
                <img src={jobImage} alt="Banner" className="w-16 h-12 rounded-xl object-cover border" />
              ) : (
                <div className="w-12 h-12 bg-blue-600 text-white font-black text-xl rounded-2xl flex items-center justify-center shadow-sm">
                  🇸🇬
                </div>
              )}
            </div>

            {/* Salary & Benefits Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[9.5px] text-slate-400 font-bold block">মূল বেতন</span>
                <span className="font-extrabold text-blue-900 text-xs">{newJobSalary || 'S$ 17 / প্রতি ঘণ্টা'}</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[9.5px] text-slate-400 font-bold block">ওভারটাইম</span>
                <span className="font-bold text-slate-800 text-xs">{overtimeOption === 'আছে' ? `S$ ${overtimeRate}` : overtimeOption}</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[9.5px] text-slate-400 font-bold block">চুক্তির মেয়াদ</span>
                <span className="font-bold text-slate-800 text-xs">{contractPeriod}</span>
              </div>
            </div>

            {/* Benefits Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {accommodation && <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-lg border border-blue-100">🏠 আবাসন সুবিধা</span>}
              {food && <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-lg border border-amber-100">🍽️ খাবার সুবিধা</span>}
              {medical && <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-lg border border-rose-100">🩺 মেডিকেল সুবিধা</span>}
              {airTicket && <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-lg border border-indigo-100">✈️ এয়ার টিকেট</span>}
              {localTransport && <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-lg border border-emerald-100">🚌 লোকাল ট্রান্সপোর্ট</span>}
              <span className="bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-lg border border-teal-100">🏖️ ছুটি: {annualLeave}</span>
            </div>

            {/* Description */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">জব বিবরণী</span>
              <p className="text-slate-700 leading-relaxed text-xs">{newJobDesc || 'এই পদের জন্য উপযুক্ত প্রবাসীদের দ্রুত আবেদন করার জন্য আহ্বান করা হচ্ছে।'}</p>
            </div>

            {/* Requirements & Documents */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">প্রয়োজনীয় যোগ্যতা ও ডকুমেন্টস</span>
              <div className="space-y-1 text-slate-700 font-medium">
                <p>🎓 শিক্ষাগত যোগ্যতা: <strong>{education}</strong></p>
                <p>🗣️ ভাষার দক্ষতা: <strong>{languageSkill}</strong></p>
                <p>💼 অভিজ্ঞতা: <strong>{experience}</strong></p>
                <p>👤 বয়স ও লিঙ্গ: <strong>{minAge}-{maxAge} বছর ({gender})</strong></p>
                <div className="pt-1 flex flex-wrap gap-1">
                  {requiredDocs.map((doc, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                      ✓ {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Premium Pack Checkbox */}
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5">
            <input 
              type="checkbox" 
              id="premiumCheckForm" 
              checked={isPremiumPack} 
              onChange={(e) => setIsPremiumPack(e.target.checked)} 
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
            />
            <label htmlFor="premiumCheckForm" className="text-xs text-emerald-900 font-bold cursor-pointer select-none">
              🌟 প্রিমিয়াম বুস্ট প্যাক যুক্ত করুন (৳৫,০০০ অতিরিক্ত) — <span className="font-normal text-emerald-700">টপ সার্কুলারে প্রদর্শন ও হাজারো প্রবাসীকে সরাসরি SMS নোটিফিকেশন</span>
            </label>
          </div>

          {/* Final Submit Buttons */}
          <form onSubmit={handlePostJobSubmit} className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="w-1/3 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>সম্পাদনা করুন</span>
            </button>

            <button
              type="submit"
              className="w-2/3 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🚀 সার্কুলার প্রকাশ করুন</span>
            </button>
          </form>

        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 1: NEW ADD SYSTEM - NEW SECTOR MODAL */}
      {/* ========================================== */}
      {showAddSectorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 max-w-md w-full overflow-hidden space-y-4 p-5 md:p-6 transition-all">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-sm">🏢</span>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm md:text-base">NEW ADD SYSTEM: নতুন সেক্টর/বিভাগ</h3>
                  <p className="text-[11px] text-slate-500 font-medium">জব সার্কুলারের জন্য নতুন সেক্টর যুক্ত করুন</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddSectorModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewSector} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">
                  সেক্টর/বিভাগের নাম (Sector Name) <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="যেমন: Healthcare & Nursing, IT & Telecom, Garments"
                  value={newSectorInput}
                  onChange={(e) => setNewSectorInput(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-xs text-slate-800"
                />
              </div>

              <div className="bg-indigo-50/60 p-3 rounded-2xl border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed font-medium">
                💡 <strong>দ্রুত নির্দেশিকা:</strong> নতুন সেক্টর যুক্ত করার সাথে সাথেই তা নির্বাচন করা হবে এবং সার্কুলারে সেভ হয়ে যাবে।
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddSectorModal(false)}
                  className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>সেক্টর যোগ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: NEW ADD SYSTEM - NEW COUNTRY MODAL */}
      {/* ========================================== */}
      {showAddCountryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-md w-full overflow-hidden space-y-4 p-5 md:p-6 transition-all">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-sm">🌍</span>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm md:text-base">NEW ADD SYSTEM: নতুন দেশ যুক্তকরণ</h3>
                  <p className="text-[11px] text-slate-500 font-medium">নতুন কোনো দেশের ভিসা থাকলে তালিকায় যুক্ত করুন</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddCountryModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewCountry} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 block">
                  দেশের নাম (Country Name) <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="যেমন: Germany, Japan, Poland, Canada"
                  value={newCountryNameInput}
                  onChange={(e) => setNewCountryNameInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    ফ্ল্যাগ ইমোজি (Flag)
                  </label>
                  <input 
                    type="text"
                    placeholder="যেমন: 🇩🇪, 🇵🇱, 🇯🇵"
                    value={newCountryFlagInput}
                    onChange={(e) => setNewCountryFlagInput(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-xs text-slate-800 text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    কোড (ISO Code)
                  </label>
                  <input 
                    type="text"
                    placeholder="যেমন: DE, PL, JP"
                    maxLength={3}
                    value={newCountryCodeInput}
                    onChange={(e) => setNewCountryCodeInput(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-xs text-slate-800 text-center uppercase"
                  />
                </div>
              </div>

              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 text-[11px] text-emerald-900 leading-relaxed font-medium">
                🌐 <strong>টিপস:</strong> ফ্ল্যাগ ইমোজি না জানা থাকলে ডিফল্ট গ্লোব ইমোজি ব্যবহৃত হবে।
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCountryModal(false)}
                  className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>দেশ যোগ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =============================================== */}
      {/* MODAL 3: NEW ADD SYSTEM - NEW CATEGORY MODAL   */}
      {/* =============================================== */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 max-w-md w-full overflow-hidden space-y-4 p-5 md:p-6 transition-all">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-2xl font-black text-sm">🛠️</span>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm md:text-base">NEW ADD SYSTEM: নতুন কাজের ধরন/ক্যাটাগরি</h3>
                  <p className="text-[11px] text-slate-500 font-medium">কাজের পজিশন বা পদবী নতুন তালিকায় যোগ করুন</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">
                  ক্যাটাগরি / পদের নাম <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="যেমন: Staff Nurse, Agricultural Worker, Heavy Crane Operator"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-xs text-slate-800"
                />
              </div>

              <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed font-medium">
                ⚡ <strong>সহজ টিপস:</strong> নতুন ক্যাটাগরি তৈরি করার পর যেকোনো নতুন জবে সরাসরি তা ব্যবহার করতে পারবেন।
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ক্যাটাগরি যোগ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
