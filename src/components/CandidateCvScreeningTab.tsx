import React, { useState } from 'react';
import { 
  Search, Filter, Download, RotateCcw, Eye, CheckCircle2, XCircle, 
  Clock, Video, Star, Users, FileCheck, ChevronRight, MoreVertical, 
  Building2, Globe, GraduationCap, Briefcase, Award, Languages, FileText,
  Sparkles, Check, AlertTriangle, ShieldCheck, UserCheck, X, Calendar, 
  Link as LinkIcon, DollarSign, FileCode2, ArrowRight, UserX, CreditCard,
  FileSpreadsheet, CheckCircle, Clock3, AlertCircle, Send, Upload
} from 'lucide-react';
import { Application, Job } from '../mockData';

export interface CandidateCvScreeningTabProps {
  applications?: Application[];
  jobs?: Job[];
  onUpdateStatus?: (appId: string, status: string) => void;
}

export type CandidateWorkflowStatus = 
  | 'CV Pending'
  | 'CV Confirmed'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Interview Passed'
  | 'Interview Failed'
  | 'Interview Absent'
  | 'Contract Pending'
  | 'Payment Pending'
  | 'Payment Complete'
  | 'Visa Processing'
  | 'Cancelled';

export type ContractStep = 
  | 'Contract Generate'
  | 'Contract Approval'
  | 'Invoice Generate'
  | 'Payment Request'
  | 'Payment Upload'
  | 'Agent Verify'
  | 'Admin Final Verify'
  | 'Payment Complete'
  | 'Visa Processing';

export interface InterviewDetails {
  date: string;
  time: string;
  interviewer: string;
  locationLink: string;
  notes?: string;
  result?: 'Pass' | 'Fail' | 'Absent';
}

export interface ContractDetails {
  contractId: string;
  contractAmount: number;
  paidAmount: number;
  step: ContractStep;
  contractGeneratedDate?: string;
  invoiceNumber?: string;
  paymentMethod?: string;
  paymentProofUrl?: string;
  agentVerified?: boolean;
  adminVerified?: boolean;
}

export interface CandidateRow {
  id: string;
  name: string;
  passport: string;
  phone: string;
  avatar: string;
  position: string;
  country: string;
  countryFlag: string;
  experience: string;
  education: string;
  languages: { name: string; level: 'ভালো' | 'মাঝারি' | 'দুর্বল'; color: string }[];
  cvMatchScore: number;
  cvMatchLabel: string;
  documentStatus: 'ভেরিফাইড' | 'আংশিক ভেরিফাইড' | 'ডকুমেন্ট সমস্যা';
  documentNote: string;
  visaEligibility: 'যোগ্য' | 'সম্ভাব্য' | 'অতিরিক্ত যাচাই প্রয়োজন';
  visaNote: string;
  applyDate: string;
  status: CandidateWorkflowStatus;
  interview?: InterviewDetails;
  contract?: ContractDetails;
  inContractWorkflow?: boolean;
}

const INITIAL_CANDIDATES: CandidateRow[] = [
  {
    id: 'cand_1',
    name: 'মোঃ রাকিব হাসান',
    passport: 'A12345678',
    phone: '+8801712-345678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    position: 'Construction Worker',
    country: 'রোমানিয়া',
    countryFlag: '🇷🇴',
    experience: '5 বছর (বাংলাদেশ)',
    education: 'HSC (2nd Division)',
    languages: [
      { name: 'বাংলা', level: 'ভালো', color: 'bg-emerald-500' },
      { name: 'ইংরেজি', level: 'মাঝারি', color: 'bg-amber-500' }
    ],
    cvMatchScore: 92,
    cvMatchLabel: 'Excellent Match',
    documentStatus: 'ভেরিফাইড',
    documentNote: 'সব ডকুমেন্ট ঠিক আছে',
    visaEligibility: 'যোগ্য',
    visaNote: 'প্রযোজ্য',
    applyDate: '24 মে, 2025 10:30 AM',
    status: 'CV Pending',
    inContractWorkflow: false
  },
  {
    id: 'cand_2',
    name: 'মোঃ সোহেল রানা',
    passport: 'B87654321',
    phone: '+8801719-876543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    position: 'Factory Worker',
    country: 'পোল্যান্ড',
    countryFlag: '🇵🇱',
    experience: '3 বছর (বাংলাদেশ)',
    education: 'SSC (1st Division)',
    languages: [
      { name: 'বাংলা', level: 'ভালো', color: 'bg-emerald-500' },
      { name: 'ইংরেজি', level: 'মাঝারি', color: 'bg-amber-500' }
    ],
    cvMatchScore: 78,
    cvMatchLabel: 'Good Match',
    documentStatus: 'আংশিক ভেরিফাইড',
    documentNote: 'কিছু ডকুমেন্ট বাকি',
    visaEligibility: 'যোগ্য',
    visaNote: 'প্রযোজ্য',
    applyDate: '23 মে, 2025 03:15 PM',
    status: 'CV Confirmed',
    inContractWorkflow: true,
    contract: {
      contractId: 'CNT-2025-001',
      contractAmount: 350000,
      paidAmount: 50000,
      step: 'Contract Generate',
      contractGeneratedDate: '2025-05-25'
    }
  },
  {
    id: 'cand_3',
    name: 'মোঃ ইমরান হোসেন',
    passport: 'C11223344',
    phone: '+8801812-334455',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    position: 'Cleaner',
    country: 'মালয়েশিয়া',
    countryFlag: '🇲🇾',
    experience: '2 বছর (মালয়েশিয়া)',
    education: 'JSC (2nd Division)',
    languages: [
      { name: 'বাংলা', level: 'ভালো', color: 'bg-emerald-500' },
      { name: 'ইংরেজি', level: 'দুর্বল', color: 'bg-rose-500' }
    ],
    cvMatchScore: 65,
    cvMatchLabel: 'Average Match',
    documentStatus: 'ডকুমেন্ট সমস্যা',
    documentNote: 'NID ফ্রন্টসাইড অস্পষ্ট',
    visaEligibility: 'সম্ভাব্য',
    visaNote: 'অতিরিক্ত যাচাই প্রয়োজন',
    applyDate: '22 মে, 2025 11:20 AM',
    status: 'CV Pending',
    inContractWorkflow: false
  },
  {
    id: 'cand_4',
    name: 'মোঃ আল-আমিন',
    passport: 'D99887766',
    phone: '+8801688-776655',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    position: 'Warehouse Worker',
    country: 'সৌদি আরব',
    countryFlag: '🇸🇦',
    experience: '4 বছর (সৌদি আরব)',
    education: 'HSC (1st Division)',
    languages: [
      { name: 'বাংলা', level: 'ভালো', color: 'bg-emerald-500' },
      { name: 'ইংরেজি', level: 'ভালো', color: 'bg-emerald-500' }
    ],
    cvMatchScore: 88,
    cvMatchLabel: 'Very Good Match',
    documentStatus: 'ভেরিফাইড',
    documentNote: 'সব ডকুমেন্ট ঠিক আছে',
    visaEligibility: 'যোগ্য',
    visaNote: 'প্রযোজ্য',
    applyDate: '21 মে, 2025 09:45 AM',
    status: 'Shortlisted',
    inContractWorkflow: true,
    contract: {
      contractId: 'CNT-2025-002',
      contractAmount: 280000,
      paidAmount: 100000,
      step: 'Contract Approval',
      contractGeneratedDate: '2025-05-22'
    }
  },
  {
    id: 'cand_5',
    name: 'মোঃ ফারুক হোসেন',
    passport: 'E55443322',
    phone: '+8801912-223344',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    position: 'Electrician',
    country: 'কাতার',
    countryFlag: '🇶🇦',
    experience: '6 বছর (কাতার)',
    education: 'Diploma (Engineering)',
    languages: [
      { name: 'বাংলা', level: 'ভালো', color: 'bg-emerald-500' },
      { name: 'ইংরেজি', level: 'ভালো', color: 'bg-emerald-500' },
      { name: 'আরবি', level: 'মাঝারি', color: 'bg-amber-500' }
    ],
    cvMatchScore: 90,
    cvMatchLabel: 'Excellent Match',
    documentStatus: 'ভেরিফাইড',
    documentNote: 'সব ডকুমেন্ট ঠিক আছে',
    visaEligibility: 'যোগ্য',
    visaNote: 'প্রযোজ্য',
    applyDate: '20 মে, 2025 02:40 PM',
    status: 'Interview Scheduled',
    interview: {
      date: '2025-05-30',
      time: '11:00 AM',
      interviewer: 'Mr. Tariq Rahman (HR Head)',
      locationLink: 'https://meet.google.com/abc-xyz-123'
    },
    inContractWorkflow: false
  },
  {
    id: 'cand_6',
    name: 'মোঃ জসিম উদ্দিন',
    passport: 'F66778899',
    phone: '+8801755-667788',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    position: 'Heavy Driver',
    country: 'ইউএই (দুবাই)',
    countryFlag: '🇦🇪',
    experience: '7 বছর (ইউএই)',
    education: 'SSC (Passed)',
    languages: [
      { name: 'বাংলা', level: 'ভালো', color: 'bg-emerald-500' },
      { name: 'আরবি', level: 'ভালো', color: 'bg-emerald-500' }
    ],
    cvMatchScore: 95,
    cvMatchLabel: 'Excellent Match',
    documentStatus: 'ভেরিফাইড',
    documentNote: 'ড্রাইভিং লাইসেন্স স্ক্যান করা',
    visaEligibility: 'যোগ্য',
    visaNote: 'প্রযোজ্য',
    applyDate: '19 মে, 2025 04:10 PM',
    status: 'Interview Passed',
    interview: {
      date: '2025-05-20',
      time: '02:00 PM',
      interviewer: 'Engr. Mahbub',
      locationLink: 'Dhaka Office Room 302',
      result: 'Pass'
    },
    inContractWorkflow: true,
    contract: {
      contractId: 'CNT-2025-003',
      contractAmount: 420000,
      paidAmount: 420000,
      step: 'Payment Complete',
      contractGeneratedDate: '2025-05-21',
      invoiceNumber: 'INV-9981',
      paymentMethod: 'Bank Transfer (City Bank)',
      paymentProofUrl: 'receipt_420k.pdf',
      agentVerified: true,
      adminVerified: true
    }
  }
];

export const CandidateCvScreeningTab: React.FC<CandidateCvScreeningTabProps> = () => {
  const [candidatesList, setCandidatesList] = useState<CandidateRow[]>(INITIAL_CANDIDATES);
  const [mainNav, setMainNav] = useState<'screening' | 'contract_workflow'>('screening');
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'pending' | 'confirmed' | 'shortlist' | 'interview' | 'workflow' | 'rejected'>('all');
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedAgency, setSelectedAgency] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedScore, setSelectedScore] = useState('all');
  
  // Selection check
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  
  // Modals state
  const [previewCandidate, setPreviewCandidate] = useState<CandidateRow | null>(null);
  const [shortlistModalCandidate, setShortlistModalCandidate] = useState<CandidateRow | null>(null);
  const [interviewModalCandidate, setInterviewModalCandidate] = useState<CandidateRow | null>(null);
  const [interviewResultCandidate, setInterviewResultCandidate] = useState<CandidateRow | null>(null);
  const [contractModalCandidate, setContractModalCandidate] = useState<CandidateRow | null>(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // Interview Form Inputs
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewerName, setInterviewerName] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');

  // Status Badge Rendering Helper
  const renderStatusBadge = (status: CandidateWorkflowStatus) => {
    switch (status) {
      case 'CV Pending':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1"><Clock3 className="w-3 h-3 text-slate-500" /> CV Pending</span>;
      case 'CV Confirmed':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> CV Confirmed</span>;
      case 'Shortlisted':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1"><Star className="w-3 h-3 text-blue-600" /> Shortlisted</span>;
      case 'Interview Scheduled':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-orange-100 text-orange-800 border border-orange-200 inline-flex items-center gap-1"><Video className="w-3 h-3 text-orange-600" /> Interview Scheduled</span>;
      case 'Interview Passed':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-600" /> Interview Passed</span>;
      case 'Interview Failed':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1"><XCircle className="w-3 h-3 text-rose-600" /> Interview Failed</span>;
      case 'Interview Absent':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-slate-200 text-slate-800 border border-slate-300 inline-flex items-center gap-1"><UserX className="w-3 h-3 text-slate-600" /> Interview Absent</span>;
      case 'Contract Pending':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 inline-flex items-center gap-1"><FileText className="w-3 h-3 text-purple-600" /> Contract Pending</span>;
      case 'Payment Pending':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-yellow-100 text-yellow-800 border border-yellow-200 inline-flex items-center gap-1"><DollarSign className="w-3 h-3 text-yellow-700" /> Payment Pending</span>;
      case 'Payment Complete':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-600" /> Payment Complete</span>;
      case 'Visa Processing':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200 inline-flex items-center gap-1"><Globe className="w-3 h-3 text-indigo-600" /> Visa Processing</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1"><XCircle className="w-3 h-3 text-rose-600" /> Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  // Helper to transition candidate to Contract & Payment Workflow
  const transitionToContractWorkflow = (candidateId: string, newStatus: CandidateWorkflowStatus) => {
    setCandidatesList(prev => prev.map(c => {
      if (c.id === candidateId) {
        const existingContract = c.contract || {
          contractId: `CNT-${Date.now().toString().slice(-4)}`,
          contractAmount: 300000,
          paidAmount: 0,
          step: 'Contract Generate',
          contractGeneratedDate: new Date().toISOString().split('T')[0]
        };
        return {
          ...c,
          status: newStatus,
          inContractWorkflow: true,
          contract: existingContract
        };
      }
      return c;
    }));
  };

  // Actions
  // A. Confirm Action Button
  const handleConfirmCandidate = (cand: CandidateRow) => {
    transitionToContractWorkflow(cand.id, 'CV Confirmed');
    alert(`✅ ${cand.name}-এর CV সফলভাবে কনফার্ম করা হয়েছে! চুক্তি ও পেমেন্ট ওয়ার্কফ্লো (Contract & Payment Workflow)-এ স্থানান্তর করা হয়েছে।`);
  };

  // B. Shortlist Click -> open Shortlist Modal
  const handleOpenShortlistModal = (cand: CandidateRow) => {
    setShortlistModalCandidate(cand);
  };

  // Shortlist Confirm
  const handleConfirmShortlist = () => {
    if (shortlistModalCandidate) {
      transitionToContractWorkflow(shortlistModalCandidate.id, 'Shortlisted');
      alert(`⭐ ${shortlistModalCandidate.name}-কে শর্টলিস্ট করা হয়েছে এবং চুক্তি ও পেমেন্ট ওয়ার্কফ্লোতে পাঠানো হয়েছে!`);
      setShortlistModalCandidate(null);
    }
  };

  // C. Interview Click -> open Interview Modal
  const handleOpenInterviewModal = (cand: CandidateRow) => {
    setInterviewModalCandidate(cand);
    setInterviewDate('');
    setInterviewTime('');
    setInterviewerName('HR Manager');
    setMeetingLocation('https://meet.google.com/abc-xyz-123');
  };

  // Submit Interview Schedule
  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewModalCandidate) return;

    setCandidatesList(prev => prev.map(c => {
      if (c.id === interviewModalCandidate.id) {
        return {
          ...c,
          status: 'Interview Scheduled',
          interview: {
            date: interviewDate || '2025-06-05',
            time: interviewTime || '11:00 AM',
            interviewer: interviewerName || 'HR Interviewer',
            locationLink: meetingLocation || 'Dhaka HQ / Online'
          }
        };
      }
      return c;
    }));

    alert(`🎤 ${interviewModalCandidate.name}-এর জন্য ইন্টারভিউ শিডিউল সম্পন্ন হয়েছে!`);
    setInterviewModalCandidate(null);
  };

  // Mark Interview Result (Pass, Fail, Absent)
  const handleSetInterviewResult = (candId: string, result: 'Pass' | 'Fail' | 'Absent') => {
    if (result === 'Pass') {
      transitionToContractWorkflow(candId, 'Interview Passed');
      setCandidatesList(prev => prev.map(c => c.id === candId ? { ...c, interview: { ...c.interview!, result: 'Pass' } } : c));
      alert(`🎉 ইন্টারভিউ উত্তীর্ণ! ${candidatesList.find(c => c.id === candId)?.name}-কে চুক্তি ও পেমেন্ট ওয়ার্কফ্লোতে পাঠানো হয়েছে।`);
    } else if (result === 'Fail') {
      setCandidatesList(prev => prev.map(c => c.id === candId ? { ...c, status: 'Interview Failed', interview: { ...c.interview!, result: 'Fail' } } : c));
      alert(`❌ ইন্টারভিউ ফেল হিসেবে আপডেট করা হয়েছে।`);
    } else {
      setCandidatesList(prev => prev.map(c => c.id === candId ? { ...c, status: 'Interview Absent', interview: { ...c.interview!, result: 'Absent' } } : c));
      alert(`⚠️ ইন্টারভিউ অনুপস্থিত (Absent) হিসেব আপডেট করা হয়েছে।`);
    }
    setInterviewResultCandidate(null);
  };

  // Cancel / Reject Candidate
  const handleCancelCandidate = (cand: CandidateRow) => {
    if (confirm(`আপনি কি নিশ্চিত ${cand.name}-এর আবেদন বাতিল করতে চান?`)) {
      setCandidatesList(prev => prev.map(c => c.id === cand.id ? { ...c, status: 'Cancelled', inContractWorkflow: false } : c));
    }
  };

  // Contract Step Progression
  const handleAdvanceContractStep = (candId: string, nextStep: ContractStep) => {
    setCandidatesList(prev => prev.map(c => {
      if (c.id === candId && c.contract) {
        let newStatus = c.status;
        if (nextStep === 'Contract Approval') newStatus = 'Contract Pending';
        if (nextStep === 'Payment Request') newStatus = 'Payment Pending';
        if (nextStep === 'Payment Complete') newStatus = 'Payment Complete';
        if (nextStep === 'Visa Processing') newStatus = 'Visa Processing';

        return {
          ...c,
          status: newStatus,
          contract: {
            ...c.contract,
            step: nextStep,
            agentVerified: nextStep === 'Agent Verify' || nextStep === 'Admin Final Verify' || nextStep === 'Payment Complete' || nextStep === 'Visa Processing' ? true : c.contract.agentVerified,
            adminVerified: nextStep === 'Admin Final Verify' || nextStep === 'Payment Complete' || nextStep === 'Visa Processing' ? true : c.contract.adminVerified
          }
        };
      }
      return c;
    }));
    alert(`ধাপ সফলভাবে আপডেট করে '${nextStep}' করা হয়েছে!`);
  };

  // Filter candidates list
  const filteredCandidates = candidatesList.filter(cand => {
    if (mainNav === 'contract_workflow') {
      if (!cand.inContractWorkflow) return false;
    } else {
      // screening view
      if (activeSubTab === 'pending' && cand.status !== 'CV Pending') return false;
      if (activeSubTab === 'confirmed' && cand.status !== 'CV Confirmed') return false;
      if (activeSubTab === 'shortlist' && cand.status !== 'Shortlisted') return false;
      if (activeSubTab === 'interview' && !cand.status.includes('Interview')) return false;
      if (activeSubTab === 'workflow' && !cand.inContractWorkflow) return false;
      if (activeSubTab === 'rejected' && cand.status !== 'Cancelled' && cand.status !== 'Interview Failed') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = cand.name.toLowerCase().includes(q) || 
                    cand.passport.toLowerCase().includes(q) || 
                    cand.phone.toLowerCase().includes(q) ||
                    cand.position.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedCountry !== 'all' && !cand.country.includes(selectedCountry)) return false;
    if (selectedPosition !== 'all' && !cand.position.includes(selectedPosition)) return false;

    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredCandidates.map(c => c.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedRowIds(prev => [...prev, id]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    setSelectedAgency('all');
    setSelectedPosition('all');
    setSelectedStatus('all');
    setSelectedScore('all');
  };

  // Counts
  const totalCount = candidatesList.length;
  const screenedCount = candidatesList.filter(c => c.status === 'CV Confirmed').length;
  const shortlistCount = candidatesList.filter(c => c.status === 'Shortlisted').length;
  const interviewCount = candidatesList.filter(c => c.status.includes('Interview')).length;
  const contractWorkflowCount = candidatesList.filter(c => c.inContractWorkflow).length;

  return (
    <div className="bg-slate-50 min-h-screen p-3 md:p-6 font-sans space-y-6 text-slate-800 animate-fade-in">
      
      {/* TOP WORKFLOW NAVIGATION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              আবেদনকারীদের CV স্ক্রিনিং ও চুক্তি-পেমেন্ট ওয়ার্কফ্লো
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            CV স্ক্রিনিং থেকে সরাসরি চুক্তি তৈরি, পেমেন্ট ভেরিফিকেশন ও ভিসা প্রসেসিং ট্র্যাক করুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => alert('Excel রিপোর্ট তৈরি হচ্ছে...')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Excel</span>
          </button>

          <button 
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            <span>Advanced Filter</span>
          </button>
        </div>
      </div>

      {/* WORKFLOW MAIN TABS SWITCHER */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setMainNav('screening')}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            mainNav === 'screening' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>১. CV Screening & Applicant Management</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${mainNav === 'screening' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'}`}>
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => setMainNav('contract_workflow')}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            mainNav === 'contract_workflow' 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>২. 💼 চুক্তি ও পেমেন্ট ওয়ার্কফ্লো (Contract & Payment)</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${mainNav === 'contract_workflow' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800 font-extrabold'}`}>
            {contractWorkflowCount}
          </span>
        </button>
      </div>

      {/* KPI SUMMARY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10.5px] font-bold text-slate-500 uppercase">মোট আবেদন</p>
            <h3 className="text-lg font-black text-slate-900">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10.5px] font-bold text-slate-500 uppercase">CV Confirmed</p>
            <h3 className="text-lg font-black text-emerald-700">{screenedCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10.5px] font-bold text-slate-500 uppercase">Shortlisted</p>
            <h3 className="text-lg font-black text-amber-700">{shortlistCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10.5px] font-bold text-slate-500 uppercase">Interview</p>
            <h3 className="text-lg font-black text-orange-700">{interviewCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10.5px] font-bold text-slate-500 uppercase">Contract & Payment</p>
            <h3 className="text-lg font-black text-purple-700">{contractWorkflowCount}</h3>
          </div>
        </div>
      </div>

      {/* IF MAIN NAV IS CONTRACT WORKFLOW -> SHOW WORKFLOW STEPS GRAPH */}
      {mainNav === 'contract_workflow' && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                💼 চুক্তি ও পেমেন্ট ওয়ার্কফ্লো (Contract & Payment Workflow)
              </h2>
              <p className="text-xs text-slate-300">
                Confirm, Shortlist (Confirm) এবং Interview Pass প্রার্থীগণ স্বয়ংক্রিয়ভাবে এই ওয়ার্কফ্লোতে সংযুক্ত হন
              </p>
            </div>
            <span className="text-xs bg-amber-400/20 text-amber-300 font-extrabold px-3 py-1 rounded-full border border-amber-400/30">
              {contractWorkflowCount} জন প্রার্থী সক্রিয়
            </span>
          </div>

          {/* 9 STEPS PROGRESS VISUALIZER */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-2 text-center text-[10.5px] font-bold pt-2">
            {[
              { num: '1', title: 'Contract Generate', icon: FileText, color: 'bg-blue-500/30 border-blue-400 text-blue-200' },
              { num: '2', title: 'Contract Approval', icon: CheckCircle2, color: 'bg-indigo-500/30 border-indigo-400 text-indigo-200' },
              { num: '3', title: 'Invoice Generate', icon: FileCode2, color: 'bg-purple-500/30 border-purple-400 text-purple-200' },
              { num: '4', title: 'Payment Request', icon: Send, color: 'bg-amber-500/30 border-amber-400 text-amber-200' },
              { num: '5', title: 'Payment Upload', icon: Upload, color: 'bg-yellow-500/30 border-yellow-400 text-yellow-200' },
              { num: '6', title: 'Agent Verify', icon: ShieldCheck, color: 'bg-cyan-500/30 border-cyan-400 text-cyan-200' },
              { num: '7', title: 'Admin Final Verify', icon: UserCheck, color: 'bg-teal-500/30 border-teal-400 text-teal-200' },
              { num: '8', title: 'Payment Complete', icon: CheckCircle, color: 'bg-emerald-500/30 border-emerald-400 text-emerald-200' },
              { num: '9', title: 'Visa Processing', icon: Globe, color: 'bg-sky-500/30 border-sky-400 text-sky-200' }
            ].map((step, idx) => (
              <div key={idx} className={`p-2.5 rounded-2xl border ${step.color} flex flex-col items-center justify-center space-y-1`}>
                <span className="text-[10px] opacity-70 font-mono">Step {step.num}</span>
                <step.icon className="w-4 h-4 opacity-90" />
                <span className="leading-tight">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER BAR & DATA TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SUB-SIDEBAR */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="px-3 py-2 border-b border-slate-100">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              {mainNav === 'contract_workflow' ? 'ওয়ার্কফ্লো ফিল্টার' : 'আবেদনকারী ফিল্টার'}
            </h3>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveSubTab('all')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                activeSubTab === 'all' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>সকল তালিকা</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeSubTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {filteredCandidates.length}
              </span>
            </button>

            {mainNav === 'screening' && (
              <>
                <button
                  onClick={() => setActiveSubTab('pending')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                    activeSubTab === 'pending' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock3 className="w-4 h-4 text-slate-500" />
                    <span>CV Pending</span>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] text-slate-700">
                    {candidatesList.filter(c => c.status === 'CV Pending').length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveSubTab('confirmed')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                    activeSubTab === 'confirmed' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>CV Confirmed</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 rounded-full text-[10px] text-emerald-700 font-bold">
                    {candidatesList.filter(c => c.status === 'CV Confirmed').length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveSubTab('shortlist')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                    activeSubTab === 'shortlist' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>Shortlisted</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-50 rounded-full text-[10px] text-amber-700 font-bold">
                    {candidatesList.filter(c => c.status === 'Shortlisted').length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveSubTab('interview')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                    activeSubTab === 'interview' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-orange-500" />
                    <span>Interview Scheduled</span>
                  </div>
                  <span className="px-2 py-0.5 bg-orange-50 rounded-full text-[10px] text-orange-700 font-bold">
                    {candidatesList.filter(c => c.status.includes('Interview')).length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveSubTab('rejected')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                    activeSubTab === 'rejected' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>Failed / Cancelled</span>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-50 rounded-full text-[10px] text-rose-700 font-bold">
                    {candidatesList.filter(c => c.status === 'Cancelled' || c.status === 'Interview Failed').length}
                  </span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* RIGHT CONTENT TABLE */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* SEARCH & FILTER BAR */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="নাম, পাসপোর্ট, মোবাইল..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="all">সব দেশ</option>
                  <option value="রোমানিয়া">🇷🇴 রোমানিয়া</option>
                  <option value="পোল্যান্ড">🇵🇱 পোল্যান্ড</option>
                  <option value="মালয়েশিয়া">🇲🇾 মালয়েশিয়া</option>
                  <option value="সৌদি আরব">🇸🇦 সৌদি আরব</option>
                  <option value="কাতার">🇶🇦 কাতার</option>
                  <option value="ইউএই">🇦🇪 ইউএই (দুবাই)</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="all">সব পদের নাম</option>
                  <option value="Construction Worker">Construction Worker</option>
                  <option value="Factory Worker">Factory Worker</option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="Warehouse Worker">Warehouse Worker</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Heavy Driver">Heavy Driver</option>
                </select>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={handleResetFilters}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-[11px] rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filter</span>
                </button>
              </div>

            </div>
          </div>

          {/* TABLE OF APPLICANTS */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                
                <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 w-8">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={selectedRowIds.length === filteredCandidates.length && filteredCandidates.length > 0}
                        className="rounded border-slate-300 text-blue-600 cursor-pointer"
                      />
                    </th>
                    <th className="p-3.5">প্রার্থী তথ্য</th>
                    <th className="p-3.5">পদ ও দেশ</th>
                    <th className="p-3.5">CV ম্যাচ (AI)</th>
                    <th className="p-3.5 text-center">Status Badge</th>
                    {mainNav === 'contract_workflow' && <th className="p-3.5">চুক্তি/পেমেন্ট ধাপ</th>}
                    <th className="p-3.5 text-center">Action Buttons (Workflow)</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        কোনো আবেদনকারীর তথ্য পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((cand) => (
                      <tr key={cand.id} className="hover:bg-slate-50/80 transition">
                        
                        <td className="p-3.5">
                          <input 
                            type="checkbox" 
                            checked={selectedRowIds.includes(cand.id)}
                            onChange={() => handleToggleRow(cand.id)}
                            className="rounded border-slate-300 text-blue-600 cursor-pointer"
                          />
                        </td>

                        <td className="p-3.5 min-w-[180px]">
                          <div className="flex items-center gap-3">
                            <img 
                              src={cand.avatar} 
                              alt={cand.name} 
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-[13px]">{cand.name}</h4>
                              <p className="text-[10.5px] text-slate-500 font-mono">পাসপোর্ট: {cand.passport}</p>
                              <p className="text-[10.5px] text-slate-500 font-mono">{cand.phone}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 min-w-[130px]">
                          <span className="font-bold text-slate-800 block text-[12px]">{cand.position}</span>
                          <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5 mt-0.5">
                            <span>{cand.countryFlag}</span>
                            <span>{cand.country}</span>
                          </span>
                        </td>

                        <td className="p-3.5 min-w-[100px]">
                          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-black text-xs">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{cand.cvMatchScore}% Match</span>
                          </div>
                        </td>

                        {/* STATUS BADGE */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          {renderStatusBadge(cand.status)}
                        </td>

                        {/* CONTRACT STEP (If in contract workflow) */}
                        {mainNav === 'contract_workflow' && (
                          <td className="p-3.5 min-w-[180px]">
                            <div className="space-y-1">
                              <span className="px-2.5 py-1 bg-purple-100 text-purple-900 font-extrabold text-[11px] rounded-lg border border-purple-200 block text-center">
                                {cand.contract?.step || 'Contract Generate'}
                              </span>
                              <div className="text-[10px] text-slate-500 flex justify-between font-mono">
                                <span>Amount: ৳{cand.contract?.contractAmount.toLocaleString()}</span>
                              </div>
                            </div>
                          </td>
                        )}

                        {/* ACTION BUTTONS */}
                        <td className="p-3.5 text-center min-w-[280px]">
                          
                          {/* 1. CV SCREENING ACTION BUTTONS */}
                          {mainNav === 'screening' && (
                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                              
                              {/* 👁️ View CV */}
                              <button
                                onClick={() => setPreviewCandidate(cand)}
                                title="View CV"
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-extrabold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>CV দেখুন</span>
                              </button>

                              {/* ✅ Confirm */}
                              <button
                                onClick={() => handleConfirmCandidate(cand)}
                                title="Confirm Candidate"
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg transition shadow-2xs flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Confirm</span>
                              </button>

                              {/* ⭐ Shortlist */}
                              <button
                                onClick={() => handleOpenShortlistModal(cand)}
                                title="Shortlist Candidate"
                                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] rounded-lg transition shadow-2xs flex items-center gap-1 cursor-pointer"
                              >
                                <Star className="w-3.5 h-3.5" />
                                <span>Shortlist</span>
                              </button>

                              {/* 🎤 Interview */}
                              <button
                                onClick={() => handleOpenInterviewModal(cand)}
                                title="Schedule Interview"
                                className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] rounded-lg transition shadow-2xs flex items-center gap-1 cursor-pointer"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>Interview</span>
                              </button>

                              {/* ❌ Cancel */}
                              <button
                                onClick={() => handleCancelCandidate(cand)}
                                title="Cancel Applicant"
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition cursor-pointer"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>

                              {/* If Interview Scheduled -> Show Result Mark button */}
                              {cand.status === 'Interview Scheduled' && (
                                <button
                                  onClick={() => setInterviewResultCandidate(cand)}
                                  className="w-full mt-1 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10.5px] rounded-lg shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>ইন্টারভিউ ফলাফল দিন (Pass/Fail)</span>
                                </button>
                              )}

                            </div>
                          )}

                          {/* 2. CONTRACT WORKFLOW ACTION BUTTONS */}
                          {mainNav === 'contract_workflow' && (
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setContractModalCandidate(cand)}
                                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>ওয়ার্কফ্লো ডিটেইলস</span>
                                </button>

                                <button
                                  onClick={() => handleAdvanceContractStep(cand.id, 'Visa Processing')}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                  <span>ভিসা প্রসেসিং-এ পাঠান</span>
                                </button>
                              </div>
                            </div>
                          )}

                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL 1: SHORTLIST CONFIRMATION POPUP */}
      {shortlistModalCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 text-center">
            
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border-4 border-amber-50">
              <Star className="w-8 h-8 fill-amber-400" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                Shortlisted Candidate
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-semibold">
                আপনি কি <span className="font-bold text-slate-900">{shortlistModalCandidate.name}</span>-কে শর্টলিস্ট করতে নিশ্চিত? 
              </p>
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs font-medium text-amber-900">
                <p>➡️ <strong>Confirm</strong> করলে প্রার্থী স্বয়ংক্রিয়ভাবে <strong>💼 চুক্তি ও পেমেন্ট ওয়ার্কফ্লোতে</strong> চলে যাবে।</p>
                <p className="mt-1">➡️ <strong>Cancel</strong> করলে প্রার্থী CV Screening তালিকায় থাকবে।</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShortlistModalCandidate(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmShortlist}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl transition shadow-md cursor-pointer"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: INTERVIEW SCHEDULE FORM */}
      {interviewModalCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Interview Schedule</h3>
                  <p className="text-xs text-slate-500">প্রার্থী: {interviewModalCandidate.name} ({interviewModalCandidate.position})</p>
                </div>
              </div>
              <button onClick={() => setInterviewModalCandidate(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs font-medium">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Date (তারিখ)</label>
                  <input 
                    type="date" 
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Time (সময়)</label>
                  <input 
                    type="time" 
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold block">Interviewer (ইন্টারভিউয়ার এর নাম)</label>
                <input 
                  type="text" 
                  required
                  placeholder="যেমন: Mr. Tariq Rahman (HR Head)"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold block">Meeting Link / Location (মিটিং লিংক বা লোকেশন)</label>
                <input 
                  type="text" 
                  required
                  placeholder="যেমন: https://meet.google.com/abc-xyz-123 অথবা ঢাকা অফিস ৩য় তলা"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInterviewModalCandidate(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl shadow-md"
                >
                  শিডিউল কনফার্ম করুন
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 3: INTERVIEW RESULT SELECTION (PASS / FAIL / ABSENT) */}
      {interviewResultCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
              <Video className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                ইন্টারভিউ এর ফলাফল প্রদান করুন
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                প্রার্থী: <span className="font-bold text-slate-800">{interviewResultCandidate.name}</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Pass */}
              <button
                onClick={() => handleSetInterviewResult(interviewResultCandidate.id, 'Pass')}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-800 font-extrabold text-xs flex flex-col items-center justify-center space-y-1 cursor-pointer transition"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>Pass</span>
                <span className="text-[9px] text-emerald-700 font-normal">➡️ Contract Workflow</span>
              </button>

              {/* Fail */}
              <button
                onClick={() => handleSetInterviewResult(interviewResultCandidate.id, 'Fail')}
                className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-2xl text-rose-800 font-extrabold text-xs flex flex-col items-center justify-center space-y-1 cursor-pointer transition"
              >
                <XCircle className="w-6 h-6 text-rose-600" />
                <span>Fail</span>
                <span className="text-[9px] text-rose-700 font-normal">Status: Failed</span>
              </button>

              {/* Absent */}
              <button
                onClick={() => handleSetInterviewResult(interviewResultCandidate.id, 'Absent')}
                className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-2xl text-slate-800 font-extrabold text-xs flex flex-col items-center justify-center space-y-1 cursor-pointer transition"
              >
                <UserX className="w-6 h-6 text-slate-600" />
                <span>Absent</span>
                <span className="text-[9px] text-slate-600 font-normal">Status: Absent</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setInterviewResultCandidate(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 4: FULL CV VIEW MODAL */}
      {previewCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={previewCandidate.avatar} 
                  alt={previewCandidate.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-md"
                />
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    {previewCandidate.name}
                    {renderStatusBadge(previewCandidate.status)}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    পাসপোর্ট: <span className="font-mono text-slate-800 font-bold">{previewCandidate.passport}</span> • মোবাইল: <span className="font-mono text-slate-800 font-bold">{previewCandidate.phone}</span>
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setPreviewCandidate(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-black text-slate-800 uppercase text-[11px] text-blue-600">আবেদনের তথ্য</h4>
                <p><strong>আবেদনকৃত পদ:</strong> {previewCandidate.position}</p>
                <p><strong>গন্তব্য দেশ:</strong> {previewCandidate.countryFlag} {previewCandidate.country}</p>
                <p><strong>অভিজ্ঞতা:</strong> {previewCandidate.experience}</p>
                <p><strong>শিক্ষাগত যোগ্যতা:</strong> {previewCandidate.education}</p>
                <p><strong>আবেদনের সময়:</strong> {previewCandidate.applyDate}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-black text-slate-800 uppercase text-[11px] text-emerald-600">ডকুমেন্ট ও ভিসা যোগ্যতা</h4>
                <p><strong>ডকুমেন্ট স্ট্যাটাস:</strong> <span className="font-bold text-emerald-700">{previewCandidate.documentStatus}</span> ({previewCandidate.documentNote})</p>
                <p><strong>ভিসা যোগ্যতা:</strong> <span className="font-bold text-blue-700">{previewCandidate.visaEligibility}</span></p>
                <p><strong>AI Match Score:</strong> <span className="font-bold text-emerald-700">{previewCandidate.cvMatchScore}% ({previewCandidate.cvMatchLabel})</span></p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 justify-end">
              <button
                onClick={() => { handleConfirmCandidate(previewCandidate); setPreviewCandidate(null); }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
              >
                ✅ Confirm Candidate
              </button>
              <button
                onClick={() => { handleOpenShortlistModal(previewCandidate); setPreviewCandidate(null); }}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
              >
                ⭐ Shortlist
              </button>
              <button
                onClick={() => { handleOpenInterviewModal(previewCandidate); setPreviewCandidate(null); }}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
              >
                🎤 Schedule Interview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 5: CONTRACT & PAYMENT STEP MODAL MANAGER */}
      {contractModalCandidate && contractModalCandidate.contract && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    চুক্তি ও পেমেন্ট ওয়ার্কফ্লো ম্যানেজার
                  </h3>
                  <p className="text-xs text-slate-500">
                    প্রার্থী: {contractModalCandidate.name} ({contractModalCandidate.passport})
                  </p>
                </div>
              </div>
              <button onClick={() => setContractModalCandidate(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between">
                <span>বর্তমান ধাপ: <strong className="text-purple-800">{contractModalCandidate.contract.step}</strong></span>
                <span>Contract ID: <strong className="font-mono">{contractModalCandidate.contract.contractId}</strong></span>
              </div>
              <div className="flex justify-between">
                <span>চুক্তির পরিমাণ: <strong>৳{contractModalCandidate.contract.contractAmount.toLocaleString()}</strong></span>
                <span>পরিশোধিত: <strong className="text-emerald-700">৳{contractModalCandidate.contract.paidAmount.toLocaleString()}</strong></span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-bold text-slate-700">
              <p>ধাপ পরিবর্তন করুন:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Contract Generate',
                  'Contract Approval',
                  'Invoice Generate',
                  'Payment Request',
                  'Payment Upload',
                  'Agent Verify',
                  'Admin Final Verify',
                  'Payment Complete',
                  'Visa Processing'
                ].map((stepName, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handleAdvanceContractStep(contractModalCandidate.id, stepName as ContractStep);
                      setContractModalCandidate(null);
                    }}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold text-left cursor-pointer transition ${
                      contractModalCandidate.contract?.step === stepName 
                        ? 'bg-purple-600 text-white border-purple-700' 
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {i + 1}. {stepName}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setContractModalCandidate(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CandidateCvScreeningTab;
