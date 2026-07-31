import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Building, FileText, FileCheck, ShieldCheck, Briefcase, Users, 
  Award, MessageSquare, Video, CreditCard, BarChart2, Star, Lock, 
  LifeBuoy, ChevronRight, Check, X, Plus, Trash2, Send, Upload, 
  ShieldAlert, Sparkles, Info, Eye, Bell, Shield, ChevronDown,
  Image, Camera, RefreshCw, LogOut, Wallet, Calendar, Folder, Globe, Search, Plane, Menu, Landmark
} from 'lucide-react';
import { Job, Company, Application, CompanyReport, BlacklistedItem, ItalyPackageApplication, VisaProcessStep, PaymentStep } from '../mockData';
import { AgentBankAccount, ClientPaymentSubmission, AdminBankSettings } from '../types/bank';
import AgentBankAccountManager from './bank/AgentBankAccountManager';
import VerifiedSystemHub from './VerifiedSystemHub';
import { CrmWorkflowSection } from './CrmWorkflowSection';
import { NewJobPostForm } from './NewJobPostForm';
import CandidateCvScreeningTab from './CandidateCvScreeningTab';

interface AgencyPanelProps {
  jobs: Job[];
  companies: Company[];
  applications: Application[];
  currentEmployerCompanyId: string;
  onUpdateCompany: (updatedCompany: Company) => void;
  onUpdateJob: (updatedJob: Job) => void;
  onUpdateApplicationStatus: (appId: string, status: 'Pending' | 'Shortlisted' | 'Rejected', interviewDate?: string) => void;
  companyReports?: CompanyReport[];
  blacklistItems?: BlacklistedItem[];
  italyPackages?: ItalyPackageApplication[];
  onUpdateItalyPackage?: (updatedPkg: ItalyPackageApplication) => void;
  onLogout?: () => void;
  
  // Tab states
  employerTab: string;
  setEmployerTab: (tab: any) => void;

  // Rich states passed from parent
  supportTickets: any[];
  setSupportTickets: any;
  scheduledInterviews: any[];
  setScheduledInterviews: any;
  newIntCandidate: string;
  setNewIntCandidate: any;
  uploadedDocs: any[];
  setUploadedDocs: any;
  visaProcessList: any[];
  setVisaProcessList: any;
  
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: any;
  branchOffices: any[];
  setBranchOffices: any;

  // Filters
  jobsFilter: string;
  setJobsFilter: any;
  applicantsFilter: string;
  setApplicantsFilter: any;

  // Job states
  editingJob: Job | null;
  setEditingJob: any;
  editingTitle: string;
  setEditingTitle: any;
  editingCategory: string;
  setEditingCategory: any;
  editingCountry: string;
  setEditingCountry: any;
  editingLocation: string;
  setEditingLocation: any;
  editingType: string;
  setEditingType: any;
  editingVisaType: any;
  setEditingVisaType: any;
  editingSalary: string;
  setEditingSalary: any;
  editingDeadline: string;
  setEditingDeadline: any;
  editingDesc: string;
  setEditingDesc: any;
  editingReqs: string;
  setEditingReqs: any;

  // Profile states
  profileCover: string;
  setProfileCover: any;
  profileEstYear: string;
  setProfileEstYear: any;
  profileWebsite: string;
  setProfileWebsite: any;
  profileGoogleMap: string;
  setProfileGoogleMap: any;
  profilePhone: string;
  setProfilePhone: any;
  profileFbLinkedIn: string;
  setProfileFbLinkedIn: any;

  // Chat states
  chatInputText: string;
  setChatInputText: any;
  activeChatCandidateId: string;
  setActiveChatCandidateId: any;
  handleSendMessage: (candId: string) => void;
  handleStartEditingJob: (job: Job) => void;
  handleEditJobSubmit: (e: React.FormEvent) => void;
  handlePostJobSubmit: (e: React.FormEvent) => void;
  handleUpdateCompanySubmit: (e: React.FormEvent) => void;

  newJobTitle: string;
  setNewJobTitle: any;
  newJobCategory: string;
  setNewJobCategory: any;
  newJobCountry: string;
  setNewJobCountry: any;
  newJobLocation: string;
  setNewJobLocation: any;
  newJobType: string;
  setNewJobType: any;
  newJobVisaType: any;
  setNewJobVisaType: any;
  newJobSalary: string;
  setNewJobSalary: any;
  newJobDeadline: string;
  setNewJobDeadline: any;
  newJobDesc: string;
  setNewJobDesc: any;
  newJobReqs: string;
  setNewJobReqs: any;
  isPremiumPack: boolean;
  setIsPremiumPack: any;
  onSetEmployerCompanyId?: (id: string) => void;
  onRegisterCompany?: (newCompany: Company) => void;
  onSetUserType?: (userType: 'seeker' | 'employer') => void;
  lang?: 'bn' | 'en';
  setLang?: (lang: 'bn' | 'en') => void;
  onUpdateApplication?: (updatedApp: Application) => void;

  // Bank System Props
  bankAccounts?: AgentBankAccount[];
  clientPayments?: ClientPaymentSubmission[];
  adminBankSettings?: AdminBankSettings;
  onAddAgentBankAccount?: (account: Omit<AgentBankAccount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateAgentBankAccount?: (id: string, updates: Partial<AgentBankAccount>) => void;
  onDeleteAgentBankAccount?: (id: string) => void;
  onConfirmClientPaymentByAgent?: (id: string, notes?: string) => void;
}

export default function AgencyPanel({
  jobs,
  companies,
  applications,
  currentEmployerCompanyId,
  onUpdateCompany,
  onUpdateJob,
  onUpdateApplicationStatus,
  onSetEmployerCompanyId,
  onRegisterCompany,
  companyReports = [],
  blacklistItems = [],
  italyPackages = [],
  onUpdateItalyPackage,
  onSetUserType,
  lang = 'bn',
  setLang,
  onUpdateApplication,

  // Bank System Props
  bankAccounts = [],
  clientPayments = [],
  adminBankSettings,
  onAddAgentBankAccount = () => {},
  onUpdateAgentBankAccount = () => {},
  onDeleteAgentBankAccount = () => {},
  onConfirmClientPaymentByAgent = () => {},
  
  employerTab,
  setEmployerTab,

  supportTickets,
  setSupportTickets,
  scheduledInterviews,
  setScheduledInterviews,
  newIntCandidate,
  setNewIntCandidate,
  uploadedDocs,
  setUploadedDocs,
  visaProcessList,
  setVisaProcessList,

  twoFactorEnabled,
  setTwoFactorEnabled,
  branchOffices,
  setBranchOffices,

  jobsFilter,
  setJobsFilter,
  applicantsFilter,
  setApplicantsFilter,

  editingJob,
  setEditingJob,
  editingTitle,
  setEditingTitle,
  editingCategory,
  setEditingCategory,
  editingCountry,
  setEditingCountry,
  editingLocation,
  setEditingLocation,
  editingType,
  setEditingType,
  editingVisaType,
  setEditingVisaType,
  editingSalary,
  setEditingSalary,
  editingDeadline,
  setEditingDeadline,
  editingDesc,
  setEditingDesc,
  editingReqs,
  setEditingReqs,

  profileCover,
  setProfileCover,
  profileEstYear,
  setProfileEstYear,
  profileWebsite,
  setProfileWebsite,
  profileGoogleMap,
  setProfileGoogleMap,
  profilePhone,
  setProfilePhone,
  profileFbLinkedIn,
  setProfileFbLinkedIn,

  chatInputText,
  setChatInputText,
  activeChatCandidateId,
  setActiveChatCandidateId,
  handleSendMessage,
  handleStartEditingJob,
  handleEditJobSubmit,
  handlePostJobSubmit,
  handleUpdateCompanySubmit,

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
  onLogout
}: AgencyPanelProps) {

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'crm_workflow', label: 'Recruitment CRM & packages', icon: Sparkles, badge: 'NEW', badgeColor: 'bg-indigo-500 text-white' },
    { id: 'jobs', label: 'Jobs Management', icon: Briefcase, hasChevron: true },
    { id: 'cv_screening', label: 'আবেদনকারী ব্যবস্থাপনা (CV Screening)', icon: FileCheck, badge: 'AI', badgeColor: 'bg-blue-600 text-white' },
    { id: 'candidates', label: 'Clients / Job Seekers', icon: Users, hasChevron: true },
    { id: 'visa', label: 'Visa Process', icon: Award, hasChevron: true },
    { id: 'staff', label: 'Employees / Staff', icon: Users, hasChevron: true },
    { id: 'interview', label: 'Interview Schedule', icon: Video, hasChevron: true },
    { id: 'agent_bank_accounts', label: 'ব্যাংক ও ওয়ালেট অ্যাকাউন্টস', icon: Landmark, badge: 'RBAC', badgeColor: 'bg-emerald-500 text-white' },
    { id: 'payments', label: 'Payments & Finance', icon: CreditCard, hasChevron: true },
    { id: 'documents', label: 'Documents', icon: Folder, hasChevron: true },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart2, hasChevron: true },
    { id: 'messages', label: 'Messages / Chat', icon: MessageSquare, badge: 12, badgeColor: 'bg-emerald-500 text-white' },
    { id: 'notices', label: 'Visa Full Photo', icon: Bell, badge: 7, badgeColor: 'bg-rose-500 text-white' }
  ];

  const agencyToolsItems = [
    { id: 'profile', label: 'Company Profile', icon: Building },
    { id: 'verification', label: 'Subscription / Plan', icon: Shield },
    { id: 'payments', label: 'Wallet & Balance', icon: Wallet, value: '৳ 125,450', valueColor: 'text-emerald-400' },
    { id: 'settings', label: 'Settings', icon: Lock },
    { id: 'support', label: 'Support / Help', icon: LifeBuoy }
  ];

  const activeCompanyObj = companies.find(c => c.id === currentEmployerCompanyId);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const activeCompanyJobs = jobs.filter(j => j.companyId === currentEmployerCompanyId);
  const activeCompanyApplications = applications.filter(app => 
    activeCompanyJobs.some(job => job.id === app.jobId)
  );

  // Sub-states for various tabs
  const [visaSubTab, setVisaSubTab] = useState<'general' | 'italy'>('general');
  const [selectedItPkgDetail, setSelectedItPkgDetail] = useState<ItalyPackageApplication | null>(null);
  const [contactCredits, setContactCredits] = useState<number>(3); // start with 3 credits as demo
  const [unlockedCandidates, setUnlockedCandidates] = useState<string[]>(['মোঃ আব্দুর রহমান']); // first is unlocked by default

  // States for Contract Payment & Document Verification
  const [searchCandidate, setSearchCandidate] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [isCreatingPkg, setIsCreatingPkg] = useState(false);
  const [autofillSearchQuery, setAutofillSearchQuery] = useState('');

  // Package creation fields
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candPassport, setCandPassport] = useState('');
  const [candCompany, setCandCompany] = useState('Global Construction Group Ltd.');
  const [candCountry, setCandCountry] = useState('Romania');
  const [candJob, setCandJob] = useState('Construction Worker');
  const [candSalary, setCandSalary] = useState('€1,200 / month');
  const [candContractNum, setCandContractNum] = useState('');
  const [candNotes, setCandNotes] = useState('');
  const [candPkgName, setCandPkgName] = useState<'Basic' | 'Standard' | 'Premium'>('Premium');

  // Fees fields
  const [feeRegistration, setFeeRegistration] = useState(10000);
  const [feeOfferLetter, setFeeOfferLetter] = useState(15000);
  const [feeWorkPermit, setFeeWorkPermit] = useState(30000);
  const [feeMofa, setFeeMofa] = useState(20000);
  const [feeInvitation, setFeeInvitation] = useState(15000);
  const [feeVisaProcessing, setFeeVisaProcessing] = useState(80000); // Updated to 80,000 for Workflow
  const [feeVisaApproval, setFeeVisaApproval] = useState(40000);
  const [feeVisaPrinting, setFeeVisaPrinting] = useState(10000);
  const [feeAirTicket, setFeeAirTicket] = useState(40000);            // Updated to 40,000 for Workflow

  // Recruitment Payment Workflow fields
  const [feeMedical, setFeeMedical] = useState(8000);
  const [feeAgencyService, setFeeAgencyService] = useState(15000);
  const [feeEmbassy, setFeeEmbassy] = useState(12000);
  const [feeInsurance, setFeeInsurance] = useState(5000);
  const [feeBmet, setFeeBmet] = useState(4000);
  const [feeOtherCharges, setFeeOtherCharges] = useState(10000);
  const [feeAdminCommission, setFeeAdminCommission] = useState(20000);

  const [newBranchLoc, setNewBranchLoc] = useState('');
  const [newBranchMgr, setNewBranchMgr] = useState('');
  const [newBranchPhn, setNewBranchPhn] = useState('');

  const [docUploadType, setDocUploadType] = useState('Trade License');
  const [docUploadFileName, setDocUploadFileName] = useState('');

  const [selectedVisaId, setSelectedVisaId] = useState('');
  const [visaDocType, setVisaDocType] = useState<'offer' | 'permit' | 'contract'>('offer');
  const [visaDocName, setVisaDocName] = useState('');

  const [chatChannel, setChatChannel] = useState<'applicants' | 'admin' | 'staff'>('applicants');
  const [adminMessages, setAdminMessages] = useState<{ sender: 'agency' | 'admin'; text: string; time: string }[]>([
    { sender: 'admin', text: 'আসসালামু আলাইকুম, প্রবাসী পোর্টাল এডমিন প্যানেল থেকে বলছি। কোনো বিষয়ে সাহায্য প্রয়োজন?', time: '১০:০০ AM' },
    { sender: 'agency', text: 'আমাদের রিক্রুটিং লাইসেন্স ভেরিফিকেশন কতোদূর সম্পন্ন হয়েছে জানতে চাচ্ছিলাম।', time: '১০:০৫ AM' },
    { sender: 'admin', text: 'আপনার লাইসেন্স ভেরিফিকেশন সফলভাবে সম্পন্ন হয়েছে। চট্টগ্রামের অফিস স্পেস যাচাইয়ের কাজও ইতিবাচক।', time: '১০:০৮ AM' }
  ]);
  const [staffMessages, setStaffMessages] = useState<{ sender: 'agency' | 'staff'; text: string; time: string }[]>([
    { sender: 'staff', text: 'আসসালামু আলাইকুম, আমি মাঠ ভেরিফিকেশন অফিসার মোঃ রিয়াজ হোসেন। আপনার চট্টগ্রাম শাখার ঠিকানার লিজ এগ্রিমেন্ট ফাইলটি একটু পুনরায় আপলোড করবেন কি?', time: 'গতকাল' },
    { sender: 'agency', text: 'জ্বি, আমি আজ বিকেলের মধ্যে সেটিংস পেজ থেকে আপলোড করে দিচ্ছি।', time: 'গতকাল' }
  ]);
  const [customMsgText, setCustomMsgText] = useState('');

  const [newIntCandName, setNewIntCandName] = useState('');
  const [newIntJobTitle, setNewIntJobTitle] = useState('');
  const [newIntDateVal, setNewIntDateVal] = useState('2026-07-15');
  const [newIntTimeVal, setNewIntTimeVal] = useState('11:00 AM');
  const [newIntMethodVal, setNewIntMethodVal] = useState('Online Zoom');
  const [newIntNotesVal, setNewIntNotesVal] = useState('');

  // States for Interview Result & Workflow Pushing
  const [pushCandName, setPushCandName] = useState('');
  const [pushCandPassport, setPushCandPassport] = useState('');
  const [pushCandEmail, setPushCandEmail] = useState('');
  const [pushCandPhone, setPushCandPhone] = useState('');
  const [pushCandJob, setPushCandJob] = useState('');
  const [pushCandResult, setPushCandResult] = useState<'Passed' | 'Failed'>('Passed');
  const [pushCandPkgType, setPushCandPkgType] = useState<'Basic' | 'Standard' | 'Premium'>('Standard');
  const [pushCandCountry, setPushCandCountry] = useState('Italy');
  const [pushCandSalary, setPushCandSalary] = useState('1200 Euro / month');
  const [pushCandPrice, setPushCandPrice] = useState(650000);

  const [reportType, setReportType] = useState<'job' | 'demographics' | 'visa'>('job');

  const [reviewReplies, setReviewReplies] = useState<{ [reviewId: string]: string }>({});
  const [tempReplyText, setTempReplyText] = useState<{ [reviewId: string]: string }>({});

  const [twoFactorCodeInput, setTwoFactorCodeInput] = useState('');
  const [is2FASetupActive, setIs2FASetupActive] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('License validation');
  const [ticketPriority, setTicketPriority] = useState('High');
  const [ticketDesc, setTicketDesc] = useState('');

  // Agency Notices and Staff States
  const [agencyNotices, setAgencyNotices] = useState([
    { id: 1, title: 'বায়োমেট্রিক ফিঙ্গারপ্রিন্ট পদ্ধতি চালু', sender: 'BMET (সরকারি জনশক্তি)', date: '২০২৬-০৭-১২', urgency: 'High', content: 'সকল এজেন্সিকে জানানো যাচ্ছে যে, প্রার্থী নিবন্ধনের জন্য নতুন স্মার্টকার্ডে বায়োমেট্রিক পদ্ধতি বাধ্যতামূলক করা হয়েছে।' },
    { id: 2, title: 'ইতালি ওয়ান-স্টপ ক্লিয়ারেন্স আপডেট', sender: 'ইতালি এম্বাসি', date: '২০২৬-০৭-১০', urgency: 'Medium', content: 'রোমানিয়া এবং ইতালি গমনেচ্ছু কর্মীদের জন্য ওয়ান-স্টপ এম্বাসি ফি জমা দেওয়ার ও ক্লিয়ারেন্স ফাইল করার নিয়ম আপডেট করা হয়েছে।' },
    { id: 3, title: 'প্রাইড ডে কোটা বুকিং শুরু', sender: 'সিস্টেম এডমিন', date: '২০২৬-০৭-০৯', urgency: 'Low', content: 'চলতি মাসের ২০ তারিখ থেকে সকল প্রিমিয়াম সার্কুলার বুস্টিং এর ওপর বিশেষ ৩০% মূল্যছাড় ও সাপোর্ট টিকেট অগ্রাধিকার পাবেন।' }
  ]);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeUrgency, setNewNoticeUrgency] = useState('Medium');

  const [agencyStaff, setAgencyStaff] = useState([
    { id: 1, name: 'মোহাম্মদ মনিরুল ইসলাম', role: 'এজেন্সি ডিরেক্টর & জিএম', phone: '০১৮১২৩৪৫৬৭০', status: 'Active (Online)', email: 'monirul@gulfrecbd.com' },
    { id: 2, name: 'সুলতানা রাজিয়া', role: 'ভিসা প্রসেসিং কো-অর্ডিনেটর', phone: '০১৭১১৩৪৫৬৭৪', status: 'Active (Online)', email: 'razia.visa@gulfrecbd.com' },
    { id: 3, name: 'আরিফ চৌধুরী', role: 'মাঠ পরিদর্শন কর্মকর্তা (Field Agent)', phone: '০১৯১১৩৪৫৬৭৯', status: 'Active (Offline)', email: 'arif.field@gulfrecbd.com' }
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('ভিসা প্রসেসিং কো-অর্ডিনেটর');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');

  // Advanced Document Upload and Camera Simulation States
  const [uploadProgress, setUploadProgress] = useState<{ [docType: string]: number }>({});
  const [uploadErrors, setUploadErrors] = useState<{ [docType: string]: string }>({});
  const [cameraModalDocType, setCameraModalDocType] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraSupported, setIsCameraSupported] = useState<boolean>(true);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      setIsCameraSupported(true);
    } catch (err) {
      console.warn("Camera access denied or unsupported, falling back to simulated camera feed.", err);
      setIsCameraSupported(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    if (cameraModalDocType) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [cameraModalDocType]);

  // Hook up video ref when stream is loaded
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(e => console.log("Video play interrupted", e));
    }
  }, [cameraStream, cameraModalDocType]);

  // Auto-fill applicant name if redirected to interview tab
  useEffect(() => {
    if (employerTab === 'interview' && !newIntCandName && newIntCandidate) {
      setNewIntCandName(newIntCandidate);
      const app = activeCompanyApplications.find(a => a.candidateName.includes(newIntCandidate) || newIntCandidate.includes(a.candidateName));
      if (app) {
        setNewIntJobTitle(app.jobTitle);
      }
    }
  }, [employerTab, newIntCandidate]);

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchLoc.trim() || !newBranchMgr.trim() || !newBranchPhn.trim()) {
      alert('অনুগ্রহ করে সবগুলো তথ্য পূরণ করুন');
      return;
    }
    const newBr = {
      id: `BR-0${branchOffices.length + 1}`,
      location: newBranchLoc,
      manager: newBranchMgr,
      phone: newBranchPhn
    };
    setBranchOffices([...branchOffices, newBr]);
    setNewBranchLoc('');
    setNewBranchMgr('');
    setNewBranchPhn('');
    alert('নতুন শাখা অফিস সফলভাবে যুক্ত করা হয়েছে!');
  };

  const handleDeleteBranch = (id: string) => {
    setBranchOffices(branchOffices.filter(b => b.id !== id));
  };

  const validateFile = (fileName: string, fileSizeMB: number) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const validExts = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
    if (!validExts.includes(ext)) {
      return { valid: false, error: 'সমর্থিত ফরম্যাট নয়! (JPG, JPEG, PNG, PDF, DOC, DOCX)' };
    }
    const isImage = ['jpg', 'jpeg', 'png'].includes(ext);
    if (isImage && fileSizeMB > 5) {
      return { valid: false, error: 'ছবির সাইজ সর্বোচ্চ ৫ MB হতে পারবে।' };
    }
    if (!isImage && fileSizeMB > 10) {
      return { valid: false, error: 'নথি ফাইলের সাইজ সর্বোচ্চ ১০ MB হতে পারবে।' };
    }
    return { valid: true };
  };

  const triggerSimulatedUpload = (docType: string, uploadMethod: 'gallery' | 'file' | 'camera', fileDetail: { name: string; sizeMB: number }) => {
    const validation = validateFile(fileDetail.name, fileDetail.sizeMB);
    if (!validation.valid) {
      setUploadErrors(prev => ({ ...prev, [docType]: validation.error || 'ভুল ফাইল ফরম্যাট বা সাইজ!' }));
      alert(`আপলোড ব্যর্থ: ${validation.error}`);
      return;
    }

    setUploadErrors(prev => {
      const copy = { ...prev };
      delete copy[docType];
      return copy;
    });

    // Start progress simulation
    let progress = 10;
    setUploadProgress(prev => ({ ...prev, [docType]: progress }));

    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(prev => {
          const copy = { ...prev };
          delete copy[docType];
          return copy;
        });

        // Add or update in uploadedDocs
        const ext = fileDetail.name.split('.').pop()?.toLowerCase() || 'pdf';
        const newDocItem = {
          id: `DOC-0${uploadedDocs.length + 1}`,
          type: docType,
          name: fileDetail.name,
          size: `${fileDetail.sizeMB.toFixed(1)} MB`,
          date: '২০২৬-০৭-০৪',
          status: 'Pending' as const,
          uploadMethod,
          fileFormat: ext,
          remarks: ''
        };

        const exists = uploadedDocs.some(d => d.type === docType);
        let updated;
        if (exists) {
          updated = uploadedDocs.map(d => d.type === docType ? newDocItem : d);
        } else {
          updated = [...uploadedDocs, newDocItem];
        }

        setUploadedDocs(updated);
        alert(`"${docType}" ডকুমেন্টটি (${uploadMethod === 'camera' ? 'ক্যামেরা ক্যাপচার' : uploadMethod === 'gallery' ? 'গ্যালারি' : 'ফাইল'}) এর মাধ্যমে সফলভাবে আপলোড করা হয়েছে এবং বর্তমানে অডিটের অধীনে রয়েছে।`);
      } else {
        setUploadProgress(prev => ({ ...prev, [docType]: progress }));
      }
    }, 150);
  };

  const handleRealFileSelection = (docType: string, uploadMethod: 'gallery' | 'file', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMB = file.size / (1024 * 1024);
    triggerSimulatedUpload(docType, uploadMethod, {
      name: file.name,
      sizeMB: sizeMB
    });
  };

  const handleDeleteDocument = (docType: string) => {
    const target = uploadedDocs.find(d => d.type === docType);
    if (!target) return;
    if (target.status !== 'Pending') {
      alert('দুঃখিত, শুধুমাত্র পর্যালোচনার অধীনে থাকা (Pending) ডকুমেন্টই মুছে ফেলা সম্ভব।');
      return;
    }
    if (confirm(`আপনি কি নিশ্চিত যে "${docType}" ডকুমেন্টটি মুছে ফেলতে চান?`)) {
      const updated = uploadedDocs.filter(d => d.type !== docType);
      setUploadedDocs(updated);
      alert(`"${docType}" ডকুমেন্ট সফলভাবে মুছে ফেলা হয়েছে।`);
    }
  };

  const handleDocumentUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Maintain old fallback uploader just in case, but route to modern triggering
    if (!docUploadFileName.trim()) {
      alert('অনুগ্রহ করে ফাইলের নাম উল্লেখ করুন');
      return;
    }
    triggerSimulatedUpload(docUploadType, 'file', {
      name: docUploadFileName,
      sizeMB: 2.5
    });
    setDocUploadFileName('');
  };

  const handleVisaUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisaId || !visaDocName.trim()) {
      alert('অনুগ্রহ করে প্রার্থী ও ফাইলের নাম নির্বাচন করুন');
      return;
    }

    setVisaProcessList(visaProcessList.map(item => {
      if (item.id === selectedVisaId) {
        let nextStatus = item.status;
        let detail = item.statusDetail;
        if (visaDocType === 'offer') {
          nextStatus = 'Visa Permit';
          detail = `কোম্পানি অফার লেটার আপলোড করা হয়েছে (${visaDocName})। ভিসা পারমিটের আবেদন চলমান।`;
        } else if (visaDocType === 'permit') {
          nextStatus = 'Embassy Stamping';
          detail = `ওয়ার্ক পারমিট সংগ্রহ করে (${visaDocName}) এম্বেসি ভিসার জন্য পাসপোর্ট প্রেরণ করা হয়েছে।`;
        } else if (visaDocType === 'contract') {
          nextStatus = 'BMET Card';
          detail = `চুক্তিপত্র সফলভাবে ভেরিফাই করা হয়েছে (${visaDocName})। বিএমইটি ওয়ান-স্টপ স্মার্টকার্ড প্রস্তুত হচ্ছে।`;
        }
        return {
          ...item,
          status: nextStatus,
          statusDetail: detail,
          offerLetterUrl: visaDocType === 'offer' ? visaDocName : item.offerLetterUrl,
          visaPermitUrl: visaDocType === 'permit' ? visaDocName : item.visaPermitUrl,
          contractUrl: visaDocType === 'contract' ? visaDocName : item.contractUrl
        };
      }
      return item;
    }));

    setVisaDocName('');
    alert('প্রার্থীর ওয়ার্ক ভিসা প্রসেস ডকুমেন্ট আপলোড সফল হয়েছে!');
  };

  const handleSendCustomMessage = () => {
    if (!customMsgText.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (chatChannel === 'admin') {
      setAdminMessages([...adminMessages, { sender: 'agency', text: customMsgText, time }]);
      setTimeout(() => {
        setAdminMessages(prev => [...prev, { sender: 'admin', text: 'আপনার অনুরোধটি গ্রহণ করা হয়েছে। সাপোর্ট ইউনিট আপনার ফাইলটি চেক করে দেখছে।', time: 'Just Now' }]);
      }, 1200);
    } else if (chatChannel === 'staff') {
      setStaffMessages([...staffMessages, { sender: 'agency', text: customMsgText, time }]);
      setTimeout(() => {
        setStaffMessages(prev => [...prev, { sender: 'staff', text: 'ধন্যবাদ, আমি আপনার ড্যাশবোর্ডে নথিটি দেখতে পাচ্ছি। ধন্যবাদ দ্রুত সহায়তা করার জন্য।', time: 'Just Now' }]);
      }, 1200);
    }
    setCustomMsgText('');
  };

  const handleScheduleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIntCandName.trim() || !newIntJobTitle.trim()) {
      alert('অনুগ্রহ করে ক্যান্ডিডেট ও পদের নাম লিখুন');
      return;
    }
    const newInt = {
      id: `INT-0${scheduledInterviews.length + 1}`,
      candidateName: newIntCandName,
      jobTitle: newIntJobTitle,
      date: newIntDateVal,
      time: newIntTimeVal,
      method: newIntMethodVal,
      link: newIntMethodVal !== 'In-Person HQ' ? 'https://zoom.us/j/9876543210' : undefined,
      notes: newIntNotesVal || 'খাদ্য ও বাসস্থান আলোচনা করা হবে।',
      status: 'Scheduled'
    };
    setScheduledInterviews([...scheduledInterviews, newInt]);
    setNewIntCandName('');
    setNewIntJobTitle('');
    setNewIntNotesVal('');
    alert('সাক্ষাৎকার সময়সূচী সফলভাবে শিডিউল করা হয়েছে এবং প্রার্থীর মোবাইলে এসএমএস ও ইমেইল পাঠানো হয়েছে!');
  };

  const handlePushCandidateToWorkflow = (e?: React.FormEvent, customData?: any) => {
    if (e) e.preventDefault();

    const name = customData?.name || pushCandName;
    const passport = customData?.passport || pushCandPassport;
    const email = customData?.email || pushCandEmail || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`;
    const phone = customData?.phone || pushCandPhone || '01711' + Math.floor(Math.random() * 900000 + 100000);
    const job = customData?.job || pushCandJob || 'Truck Driver';
    const result = customData?.result || pushCandResult;
    const pkgType = customData?.pkgType || pushCandPkgType || 'Standard';
    const country = customData?.country || pushCandCountry || 'Italy';
    const salary = customData?.salary || pushCandSalary || '1200 Euro / month';
    const price = customData?.price || pushCandPrice || 650000;

    if (!name.trim()) {
      alert('অনুগ্রহ করে প্রার্থীর নাম প্রদান করুন।');
      return;
    }
    if (!passport.trim()) {
      alert('অনুগ্রহ করে প্রার্থীর পাসপোর্ট নম্বর প্রদান করুন।');
      return;
    }

    const newId = `it_pkg_agency_${Date.now()}`;
    const newContractNo = `CON-2026-${Math.floor(Math.random() * 90000 + 10000)}`;
    const appliedDate = new Date().toLocaleDateString('bn-BD');

    const newPkg: ItalyPackageApplication = {
      id: newId,
      packageName: pkgType as any,
      candidateName: name,
      candidateEmail: email,
      candidatePhone: phone,
      passportNumber: passport,
      status: 'Approved',
      appliedAt: appliedDate,
      notes: `ইন্টারভিউতে উত্তীর্ণ হওয়ার পর সরাসরি ওয়ার্কফ্লোতে পুশ করা হয়েছে। ইন্টারভিউ রেজাল্ট: ${result === 'Passed' ? 'Passed (উত্তীর্ণ)' : 'Failed (অনুপযুক্ত)'}`,
      priceAmount: `৳${price.toLocaleString()}`,
      agencyId: currentEmployerCompanyId,
      commission: Math.floor(price * 0.05),
      contractStatus: 'Active',
      company: 'Euro Bangla Manpower Services',
      country: country,
      jobPosition: job,
      salary: salary,
      contractNumber: newContractNo,
      
      // Fees Set
      registrationFee: 20000,
      offerLetterFee: 80000,
      workPermitFee: 150000,
      mofaFee: 50000,
      invitationLetterFee: 50000,
      visaProcessingFee: 100000,
      visaApprovalFee: 100000,
      visaPrintingFee: 50000,
      airTicketFee: 50000,

      medicalFee: 10000,
      agencyServiceFee: 150000,
      embassyFee: 15000,
      insuranceFee: 5000,
      bmetFee: 5000,
      otherCharges: 20000,
      adminCommission: Math.floor(price * 0.05),
      employerTotal: price,
      grandTotal: price,
      paymentPlanStatus: 'Approved',

      totalAmount: price,
      paidAmount: 0,
      dueAmount: price,
      paymentHistory: [],

      bankDetails: {
        bankName: 'City Bank PLC',
        accountName: 'Euro Bangla Manpower Services Ltd.',
        accountNumber: '1102938475001',
        branch: 'Gulshan Branch, Dhaka',
        routingNumber: '220150153',
        swiftCode: 'CIBKBDDH',
        bkashMerchant: '01700998877',
        nagadMerchant: '01700998877',
        rocketNumber: '01700998877-3',
        status: 'Approved',
        approvedBy: 'N/A',
        qrCode: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=150'
      },

      auditLogs: [
        { id: 'log_init_' + newId, action: 'Pushed from Passed Interview', user: 'Agency', timestamp: appliedDate, details: `প্রার্থী ইন্টারভিউতে উত্তীর্ণ হয়েছেন। রেজাল্ট সাবমিট ও ওয়ার্কফ্লোতে প্রগতি পুশ করা হয়েছে।` }
      ],
      
      documents: {
        offerLetter: { status: 'Pending', fileUrl: 'italy_offer_letter.pdf' },
        employmentContract: { status: 'Pending', fileUrl: 'italy_employment_contract.pdf' },
        workPermit: { status: 'Pending', fileUrl: 'italy_work_permit.pdf' },
        passportCopy: { status: 'Approved', fileUrl: 'candidate_passport_scan.pdf' },
        visaDocuments: { status: 'Pending', fileUrl: 'visa_document_scan.pdf' },
        paymentReceipts: { status: 'Pending', fileUrl: 'payment_receipt_copy.png' }
      },
      timeline: [
        { key: 'offer_letter', label: 'Offer Letter (অফার লেটার)', status: 'Approved' as const, date: appliedDate },
        { key: 'visa_permit', label: 'Visa Permit (ওয়ার্ক পারমিট)', status: 'Processing' as const, date: appliedDate },
        { key: 'embassy_stamping', label: 'Embassy Stamping (এম্বেসি স্ট্যাম্পিং)', status: 'Pending' as const, date: '' },
        { key: 'bmet_card', label: 'BMET Card (বিএমইটি স্মার্ট কার্ড)', status: 'Pending' as const, date: '' },
        { key: 'flight_ready', label: 'Flight Ready (ফ্লাইট ও টিকেট)', status: 'Pending' as const, date: '' }
      ]
    };

    onUpdateItalyPackage?.(newPkg);

    // Update scheduledInterviews status
    if (customData?.interviewId) {
      setScheduledInterviews(prev => 
        prev.map(i => i.id === customData.interviewId ? { ...i, status: result, isPushed: true } : i)
      );
    }

    // Reset Form
    setPushCandName('');
    setPushCandPassport('');
    setPushCandEmail('');
    setPushCandPhone('');
    setPushCandJob('');
    setPushCandResult('Passed');
    setPushCandPkgType('Standard');
    setPushCandCountry('Italy');
    setPushCandSalary('1200 Euro / month');
    setPushCandPrice(650000);

    alert(`🎉 ইন্টারভিউ রেজাল্ট সফলভাবে সাবমিট করা হয়েছে এবং প্রার্থীকে পাসপোর্ট ওয়ার্কফ্লোতে পুশ করা হয়েছে!\n\nপ্রার্থীর নাম: ${name}\nপাসপোর্ট নম্বর: ${passport}\nকন্ট্রাক্ট নাম্বার: ${newContractNo}\n\n🔍 "প্রার্থী / পাসপোর্ট খুঁজুন" সেকশনে সার্চ করে তাকে ট্র্যাক করতে পারবেন।`);
  };

  const handleAddReviewReply = (reviewId: string) => {
    const text = tempReplyText[reviewId];
    if (!text || !text.trim()) return;
    setReviewReplies({ ...reviewReplies, [reviewId]: text });
    setTempReplyText({ ...tempReplyText, [reviewId]: '' });
    alert('আপনার অফিসিয়াল এজেন্সি উত্তর পোস্ট করা হয়েছে!');
  };

  const handleToggle2FA = () => {
    if (twoFactorEnabled) {
      setTwoFactorEnabled(false);
      setIs2FASetupActive(false);
      alert('দ্বি-স্তর বিশিষ্ট নিরাপত্তা (2FA) নিষ্ক্রিয় করা হয়েছে।');
    } else {
      setIs2FASetupActive(true);
    }
  };

  const handleConfirm2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCodeInput.length === 6) {
      setTwoFactorEnabled(true);
      setIs2FASetupActive(false);
      setTwoFactorCodeInput('');
      alert('দ্বি-স্তর বিশিষ্ট নিরাপত্তা (2FA) সফলভাবে সক্রিয় করা হয়েছে!');
    }
  };

  const handlePostSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) {
      alert('অনুগ্রহ করে টিকিটের বিষয় ও বিবরণ পূরণ করুন');
      return;
    }
    const newTicket = {
      id: `TKT-0${supportTickets.length + 1}`,
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      desc: ticketDesc,
      date: '২০২৬-০৭-০৪',
      status: 'Open'
    };
    setSupportTickets([...supportTickets, newTicket]);
    setTicketSubject('');
    setTicketDesc('');
    alert('নতুন সহায়তা টিকিট সফলভাবে খোলা হয়েছে! আমাদের সাপোর্ট ইউনিট দ্রুত আপনার সাথে যোগাযোগ করবে।');
  };


  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col lg:flex-row antialiased font-sans animate-fade-in w-full">
      
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0C1427] text-slate-100 h-screen sticky top-0 shrink-0 shadow-2xl border-r border-slate-900/40 z-30 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base">P</div>
            <div>
              <h2 className="text-sm font-black tracking-wider leading-none text-white">Probashi Jobs</h2>
              <span className="text-[9px] text-blue-400 font-extrabold uppercase tracking-widest block mt-1">Agency Portal</span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white transition">
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable menu content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* MAIN MENU SECTION */}
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider px-3 pb-1">MAIN MENU</p>
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = employerTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setEmployerTab(item.id as any)}
                  className={`w-full py-2.5 px-3 rounded-xl text-left transition flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  ) : item.hasChevron && !isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* AGENCY TOOLS SECTION */}
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider px-3 pb-1">AGENCY TOOLS</p>
            {agencyToolsItems.map((item) => {
              const Icon = item.icon;
              const isActive = employerTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setEmployerTab(item.id as any)}
                  className={`w-full py-2.5 px-3 rounded-xl text-left transition flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                  {item.value ? (
                    <span className={`text-[10px] font-black ${item.valueColor || 'text-slate-400'}`}>
                      {item.value}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Premium Plan Card at Bottom of Sidebar */}
          <div className="bg-[#121A30] border border-slate-800 rounded-2xl p-3.5 relative overflow-hidden mt-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                  👑 Premium Plan
                </span>
                <p className="text-[10px] text-slate-400 font-bold mt-1.5">Expiry: 31 Dec 2025</p>
              </div>
              <span className="text-emerald-400 text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Active</span>
            </div>
            
            <div className="mt-3.5 space-y-1">
              <div className="flex justify-between text-[9px] text-slate-400 font-extrabold">
                <span>85% Used</span>
                <span>850 / 1000 limit</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <button className="w-full mt-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 text-[10px] font-black transition text-center cursor-pointer shadow-sm">
              Upgrade Plan
            </button>
          </div>

        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-800 bg-[#0A1124]">
          <button
            onClick={() => {
              if (onLogout) {
                onLogout();
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl text-left transition flex items-center gap-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer text-xs font-black"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & SIDEBAR DRAWER */}
      <header className="lg:hidden bg-[#0C1427] text-white p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-40 shadow-md w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">P</div>
          <div>
            <h1 className="text-xs font-black tracking-wider leading-none">Probashi Jobs</h1>
            <span className="text-[8px] text-blue-400 font-extrabold uppercase tracking-widest block">Agency Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={employerTab}
            onChange={(e) => setEmployerTab(e.target.value as any)}
            className="p-1.5 bg-[#121A30] border border-slate-800 rounded-lg text-[10px] font-bold text-slate-200 focus:outline-none"
          >
            {[...mainMenuItems, ...agencyToolsItems].map((item, idx) => (
              <option key={`${item.id}-${idx}`} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Right Content Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F1F5F9]">
        
        {/* PREMIUM TOP HEADER BAR */}
        <div className="bg-[#0B30AD] bg-gradient-to-r from-[#00249c] to-[#0c39cc] text-white py-6 px-6 shadow-md border-b border-blue-900/40 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
          {/* Aesthetic grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-45"></div>
          
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-xl font-black text-white tracking-tight">Welcome back, Ariful Islam 👋</h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[8.5px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <Check className="w-2.5 h-2.5 text-emerald-300" /> Agency Verified
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-blue-200 font-extrabold uppercase tracking-wide">
              {activeCompanyObj?.name || 'Al Madina International Agency'} • License: {activeCompanyObj?.licenseNumber || 'RL-2024-5784'}
            </p>
          </div>

          {/* Search bar & Icons */}
          <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center gap-3.5">
            {/* Search Input Bar */}
            <div className="relative min-w-[240px] lg:min-w-[320px]">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-blue-300" />
              </span>
              <input
                type="text"
                placeholder="Search clients, jobs, applications..."
                className="w-full bg-[#00176D]/40 border border-blue-400/20 hover:border-blue-400/40 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-blue-300/60 rounded-xl py-2 pl-9 pr-12 text-xs font-semibold text-white transition-all shadow-inner"
              />
              <span className="absolute right-2.5 top-2.5 bg-[#00176D]/60 text-blue-300/80 border border-blue-400/10 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                Ctrl /
              </span>
            </div>

            {/* Quick Utility Icons */}
            <div className="flex items-center gap-3.5 justify-end">
              <button className="relative p-2 rounded-xl bg-[#00176D]/40 border border-blue-400/15 hover:bg-[#00176D]/60 transition">
                <Bell className="w-4 h-4 text-white" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[8.5px] font-black flex items-center justify-center">7</span>
              </button>
              
              <button className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#00176D]/40 border border-blue-400/15 hover:bg-[#00176D]/60 text-[10px] font-black transition">
                <Globe className="w-3.5 h-3.5 text-white" />
                <span>EN</span>
              </button>

              <button className="p-2 rounded-xl bg-[#00176D]/40 border border-blue-400/15 hover:bg-[#00176D]/60 transition">
                <RefreshCw className="w-3.5 h-3.5 text-white" />
              </button>

              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer bg-[#00176D]/40 border border-blue-400/15 py-1 px-2 rounded-xl">
                  <div className="relative w-7 h-7 rounded-full bg-blue-900 border border-blue-400/20 flex items-center justify-center overflow-hidden">
                    <img referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Ariful Islam" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-blue-950"></span>
                  </div>
                  <span className="hidden lg:inline text-xs font-black">Ariful I.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Work Area Scroll View */}
        <div className="p-6">
          
          {/* DYNAMIC HEADER CONTROLS (IF ON DASHBOARD) */}
          {employerTab === 'dashboard' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 select-none animate-fade-in">
              <div>
                <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">এজেন্সি ড্যাশবোর্ড</h2>
                <p className="text-[11px] text-slate-400 font-bold">এজেন্সি রিক্রুটিং কার্যক্রম, ভিসা পাইপলাইন ও বিলিং সারসংক্ষেপ</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl py-2 px-3.5 text-xs font-black text-slate-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>01 - 31 July 2024</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>

                <button 
                  onClick={() => setEmployerTab('jobs')}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-4 text-xs font-black flex items-center gap-1.5 transition shadow-md shadow-blue-600/10 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Job</span>
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC TAB RENDERING */}
          {employerTab === 'crm_workflow' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm animate-fade-in space-y-6">
              <CrmWorkflowSection 
                viewType="agency" 
                applications={applications} 
                onUpdateApplication={onUpdateApplication || (() => {})} 
                lang={lang} 
              />
            </div>
          )}

          {employerTab === 'dashboard' && (
            /* HIGH FIDELITY LIGHT THEMED DASHBOARD WORKSPACE */
            <div className="space-y-6 animate-fade-in text-slate-800">
              
              {/* KPI Top Summary Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { label: 'Total Active Jobs', val: '145', change: '+18.5%', term: 'from last month', icon: Briefcase, color: 'text-blue-600 bg-blue-500/10 border-blue-500/10' },
                  { label: 'Total Applications', val: '1,248', change: '+22.3%', term: 'from last month', icon: Users, color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/10' },
                  { label: 'Selected / Shortlisted', val: '328', change: '+15.7%', term: 'this month', icon: Check, color: 'text-indigo-600 bg-indigo-500/10 border-indigo-500/10' },
                  { label: 'Visa Approved', val: '96', change: '+12.4%', term: 'this month', icon: Plane, color: 'text-amber-600 bg-amber-500/10 border-amber-500/10' },
                  { label: 'Total Earnings', val: '৳ 2,845,000', change: '+8.9%', term: 'from last month', icon: CreditCard, color: 'text-teal-600 bg-teal-500/10 border-teal-500/10' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition flex items-center justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">{stat.label}</span>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">{stat.val}</h3>
                        <div className="flex items-center gap-1.5 text-[9.5px]">
                          <span className="text-emerald-500 font-extrabold">{stat.change}</span>
                          <span className="text-slate-400 font-bold">{stat.term}</span>
                        </div>
                      </div>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color} border shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Main Content Dashboard Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side (8 Columns) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Recent Active Jobs Card */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-500" /> Active Jobs (Recent)
                      </h3>
                      <button onClick={() => setEmployerTab('jobs')} className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer">
                        View All Jobs <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {[
                        { title: 'Construction Worker', company: 'NPCC Company', country: 'Saudi Arabia 🇸🇦', vacancy: '50', salary: '৳ 45,000 - 55,000', status: 'Active', time: '2 hours ago' },
                        { title: 'Electrician', company: 'Gulf Power Co. Ltd', country: 'Qatar 🇶🇦', vacancy: '30', salary: '৳ 60,000 - 75,000', status: 'Active', time: '5 hours ago' },
                        { title: 'Hotel Cleaner', company: 'Accor Hotels', country: 'UAE 🇦🇪', vacancy: '25', salary: '৳ 38,000 - 45,000', status: 'Active', time: '1 day ago' },
                        { title: 'Driver (Light Vehicle)', company: 'Salik Group', country: 'Kuwait 🇰🇼', vacancy: '20', salary: '৳ 40,000 - 48,000', status: 'Review', time: '2 days ago' },
                        { title: 'Security Guard', company: 'Al Rayyan Security', country: 'Oman 🇴🇲', vacancy: '15', salary: '৳ 35,000 - 40,000', status: 'Pending', time: '3 days ago' }
                      ].map((job, i) => (
                        <div key={i} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 first:pt-0 last:pb-0 hover:bg-slate-50/50 px-2 rounded-xl transition">
                          <div className="flex items-center gap-3.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center font-black text-blue-600 text-sm">
                              {job.title.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 leading-snug">{job.title}</h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">{job.company} • {job.country}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end gap-5 text-right">
                            <div className="text-left md:text-right">
                              <p className="text-[10px] text-slate-400 font-bold">Vacancy: <span className="text-slate-700 font-extrabold">{job.vacancy}</span></p>
                              <p className="text-[10px] text-slate-500 font-black mt-0.5">{job.salary}</p>
                            </div>
                            
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className={`px-2 py-0.5 text-[8.5px] font-black rounded-md ${
                                job.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/10' :
                                job.status === 'Review' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/10' :
                                'bg-amber-500/10 text-amber-600 border border-amber-500/10'
                              } border uppercase tracking-wider`}>
                                {job.status}
                              </span>
                              <span className="text-[8.5px] text-slate-400 font-medium">{job.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visa Process Pipeline Map */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-5">
                    <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-500" /> Visa Process Pipeline
                    </h3>
                    
                    {/* Progress connection flow */}
                    <div className="relative py-4 px-2 bg-slate-50/60 rounded-2xl border border-slate-100">
                      {/* Flow Background Line */}
                      <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0 hidden md:block"></div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
                        {[
                          { label: 'Application', count: '1,248', color: 'bg-blue-600 border-blue-200' },
                          { label: 'Medical', count: '856', color: 'bg-indigo-600 border-indigo-200' },
                          { label: 'MOFA', count: '432', color: 'bg-purple-600 border-purple-200' },
                          { label: 'Embassy', count: '286', color: 'bg-amber-600 border-amber-200' },
                          { label: 'Approved', count: '96', color: 'bg-emerald-600 border-emerald-200' }
                        ].map((node, i) => (
                          <div key={i} className="flex flex-col items-center text-center">
                            <div className={`w-10 h-10 rounded-full ${node.color} text-white font-black text-xs flex items-center justify-center border-4 shadow-sm shrink-0`}>
                              {i + 1}
                            </div>
                            <h4 className="text-[10px] font-extrabold text-slate-700 mt-2 leading-none">{node.label}</h4>
                            <p className="text-xs font-black text-slate-900 mt-1">{node.count}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Visa Updates */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Recent Visa Updates</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { name: 'Md. Saiful Islam', role: 'Construction Worker (Saudi)', state: 'Embassy Stamping', update: 'Updated 1 hour ago', badgeColor: 'bg-amber-500/10 text-amber-600' },
                          { name: 'Rina Akter', role: 'Nurse (UAE)', state: 'Medical Fitness FIT', update: 'Updated 2 hours ago', badgeColor: 'bg-blue-500/10 text-blue-600' },
                          { name: 'Jahid Hasan', role: 'Driver (Kuwait)', state: 'Visa Approved', update: 'Updated 3 hours ago', badgeColor: 'bg-emerald-500/10 text-emerald-600' }
                        ].map((v, i) => (
                          <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 flex flex-col justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-600 font-black text-xs flex items-center justify-center shrink-0">
                                {v.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-[10.5px] font-extrabold text-slate-800 truncate leading-none">{v.name}</h5>
                                <span className="text-[8.5px] text-slate-400 font-bold truncate block mt-1">{v.role}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider block text-center ${v.badgeColor}`}>
                                {v.state}
                              </span>
                              <span className="text-[8.5px] text-slate-400 text-center block font-medium">{v.update}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button onClick={() => setEmployerTab('visa')} className="w-full mt-1.5 py-2.5 bg-slate-50 border border-slate-150 text-slate-600 rounded-2xl text-[10.5px] font-black text-center hover:bg-slate-100 transition cursor-pointer">
                        View All Visa Applications
                      </button>
                    </div>

                  </div>

                  {/* Recent Applications Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Registrations/Applications */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                        <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Recent Applications</h3>
                        <button onClick={() => setEmployerTab('cv_screening')} className="text-[9.5px] font-black text-blue-600 hover:text-blue-700 cursor-pointer">View All</button>
                      </div>

                      <div className="space-y-3">
                        {[
                          { name: 'Md. Saiful Islam', skill: 'Construction Worker', iconBg: 'bg-emerald-500/10 text-emerald-600', status: 'Approved', time: '10 min ago' },
                          { name: 'Akter Hossain', skill: 'Hotel Cleaner', iconBg: 'bg-blue-500/10 text-blue-600', status: 'Review', time: '25 min ago' },
                          { name: 'Rina Akter', skill: 'Nurse', iconBg: 'bg-amber-500/10 text-amber-600', status: 'Pending', time: '35 min ago' },
                          { name: 'Mizanur Rahman', skill: 'Electrician', iconBg: 'bg-indigo-500/10 text-indigo-600', status: 'Approved', time: '45 min ago' },
                          { name: 'Jahid Hasan', skill: 'Driver', iconBg: 'bg-rose-500/10 text-rose-600', status: 'Rejected', time: '1 hour ago' }
                        ].map((cand, i) => (
                          <div key={i} className="flex justify-between items-center bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 font-black text-xs flex items-center justify-center shrink-0">
                                {cand.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-[10.5px] font-extrabold text-slate-800 leading-none">{cand.name}</h4>
                                <span className="text-[8.5px] text-slate-400 font-semibold block mt-1">{cand.skill}</span>
                              </div>
                            </div>
                            
                            <div className="text-right flex flex-col items-end gap-0.5">
                              <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-black uppercase tracking-wider ${
                                cand.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' :
                                cand.status === 'Review' ? 'bg-blue-500/10 text-blue-600' :
                                cand.status === 'Pending' ? 'bg-amber-500/10 text-amber-600' :
                                'bg-rose-500/10 text-rose-600'
                              }`}>{cand.status}</span>
                              <span className="text-[8.5px] text-slate-400 font-medium">{cand.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Countries Flag Deck */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                      <div className="border-b border-slate-100 pb-2.5">
                        <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Active Countries (12)</h3>
                        <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5">Where your agency active jobs are focused</p>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { flag: '🇸🇦', name: 'Saudi Arabia' },
                          { flag: '🇦🇪', name: 'UAE' },
                          { flag: '🇶🇦', name: 'Qatar' },
                          { flag: '🇰🇼', name: 'Kuwait' },
                          { flag: '🇴🇲', name: 'Oman' },
                          { flag: '🇲🇾', name: 'Malaysia' },
                          { flag: '🇸🇬', name: 'Singapore' },
                          { flag: '🇮🇹', name: 'Italy' }
                        ].map((country, i) => (
                          <div key={i} className="bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center transition cursor-pointer shadow-inner">
                            <span className="text-2xl">{country.flag}</span>
                            <span className="text-[8.5px] font-black text-slate-600 mt-1.5 truncate w-full">{country.name}</span>
                          </div>
                        ))}
                        
                        {/* More grid blocks */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center transition cursor-pointer shadow-inner col-span-4 py-3">
                          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">+4 Countries (Japan 🇯🇵, Romania 🇷🇴, Poland 🇵🇱, Singapore 🇸🇬)</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Right Side (4 Columns) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Application Overview Doughnut Chart */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-2.5 flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Application Overview</h3>
                      <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest">This Month</span>
                    </div>

                    <div className="flex flex-col items-center py-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      {/* Interactive CSS SVG Doughnut Chart */}
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          {/* Segment 1: Approved (green, 26.3%) -> Dasharray: 26.3, Offset: 100 */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="2.5"></circle>
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="26.3 73.7" strokeDashoffset="100"></circle>
                          {/* Segment 2: In Review (blue, 36.2%) -> Dasharray: 36.2, Offset: 73.7 */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="36.2 63.8" strokeDashoffset="73.7"></circle>
                          {/* Segment 3: Pending (yellow, 22.9%) -> Dasharray: 22.9, Offset: 37.5 */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="22.9 77.1" strokeDashoffset="37.5"></circle>
                          {/* Segment 4: Rejected (red, 14.6%) -> Dasharray: 14.6, Offset: 14.6 */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="14.6 85.4" strokeDashoffset="14.6"></circle>
                        </svg>
                        
                        <div className="absolute text-center">
                          <p className="text-lg font-black text-slate-800 leading-none">1,248</p>
                          <p className="text-[9px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">Total</p>
                        </div>
                      </div>

                      {/* Legends */}
                      <div className="grid grid-cols-2 gap-x-5 gap-y-2 mt-5 text-[10px] w-full px-4 font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0"></span>
                          <span className="text-slate-500 truncate">Approved: <span className="text-slate-800 font-extrabold">328 (26.3%)</span></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#3b82f6] shrink-0"></span>
                          <span className="text-slate-500 truncate">In Review: <span className="text-slate-800 font-extrabold">452 (36.2%)</span></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0"></span>
                          <span className="text-slate-500 truncate">Pending: <span className="text-slate-800 font-extrabold">286 (22.9%)</span></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#ef4444] shrink-0"></span>
                          <span className="text-slate-500 truncate">Rejected: <span className="text-slate-800 font-extrabold">182 (14.6%)</span></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Grid Panel */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Quick Actions</h3>
                    
                    <div className="grid grid-cols-2 gap-3.5">
                      {[
                        { label: 'Add New Job', icon: Plus, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100/80 border-blue-100', tab: 'jobs' },
                        { label: 'Upload Document', icon: Upload, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100/80 border-emerald-100', tab: 'documents' },
                        { label: 'Schedule Interview', icon: Calendar, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80 border-indigo-100', tab: 'interview' },
                        { label: 'Send Notification', icon: Bell, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100/80 border-amber-100', tab: 'notices' },
                        { label: 'Visa Approval', icon: Award, color: 'text-teal-600 bg-teal-50 hover:bg-teal-100/80 border-teal-100', tab: 'visa' },
                        { label: 'Payment Request', icon: CreditCard, color: 'text-rose-600 bg-rose-50 hover:bg-rose-100/80 border-rose-100', tab: 'payments' }
                      ].map((act, i) => {
                        const Icon = act.icon;
                        return (
                          <button 
                            key={i} 
                            onClick={() => setEmployerTab(act.tab as any)}
                            className={`p-3 rounded-2xl border ${act.color} transition flex flex-col items-center justify-center text-center gap-2 cursor-pointer shadow-sm w-full`}
                          >
                            <Icon className="w-4.5 h-4.5" />
                            <span className="text-[10px] font-black uppercase tracking-wide leading-none">{act.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upcoming Schedule */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Upcoming Schedule</h3>
                      <button onClick={() => setEmployerTab('interview')} className="text-[9.5px] font-black text-blue-600 hover:text-blue-700 cursor-pointer">View All</button>
                    </div>

                    <div className="space-y-3">
                      {[
                        { title: 'Interview: Construction Worker', date: '02 Jul 2024, 10:00 AM', count: '12 Candidates', color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
                        { title: 'Medical Test: Hotel Cleaner', date: '03 Jul 2024, 09:30 AM', count: '08 Candidates', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
                        { title: 'Visa Submission (NPCC)', date: '05 Jul 2024, 11:00 AM', count: '25 Applications', color: 'bg-blue-50 border-blue-100 text-blue-700' }
                      ].map((sched, i) => (
                        <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 hover:bg-slate-100 transition">
                          <div className="flex justify-between items-start">
                            <h4 className="text-[10.5px] font-extrabold text-slate-800 leading-snug">{sched.title}</h4>
                            <span className="text-[8.5px] text-slate-400 font-mono shrink-0">#{i+1}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-[9px] font-bold">
                            <div className="flex items-center gap-1 text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>{sched.date}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded ${sched.color} text-[8.5px] font-black uppercase tracking-wider`}>
                              {sched.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Earnings Overview Mini Line Chart */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Earnings Overview</h3>
                      <span className="text-emerald-500 text-[10px] font-black">+18.4%</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] text-slate-400 font-extrabold uppercase leading-none">Total Earnings</p>
                          <h4 className="text-base font-black text-slate-800 mt-1">৳ 2,845,000</h4>
                        </div>
                        <span className="bg-slate-200 text-slate-700 text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">July: ৳ 2.84M</span>
                      </div>

                      {/* Elegant SVG Line Graph */}
                      <div className="h-16 w-full pt-1">
                        <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <path
                            d="M 0 25 Q 15 15 30 22 T 60 10 T 90 4 T 100 2"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <circle cx="100" cy="2" r="1.5" fill="#1d4ed8" />
                        </svg>
                      </div>

                      {/* Graph labels */}
                      <div className="flex justify-between text-[8px] text-slate-400 font-black uppercase tracking-wider">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Notifications Logs list */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Recent Notifications</h3>
                      <button onClick={() => setEmployerTab('notices')} className="text-[9.5px] font-black text-blue-600 hover:text-blue-700 cursor-pointer">View All</button>
                    </div>

                    <div className="space-y-3 text-[10px] font-bold text-slate-600">
                      {[
                        { text: 'New job "Construction Worker" added successfully', time: '5 min ago', icon: Check, color: 'text-emerald-500 bg-emerald-50' },
                        { text: 'Payment received from NPCC Company', time: '20 min ago', icon: CreditCard, color: 'text-blue-500 bg-blue-50' },
                        { text: 'Visa approved for 12 candidates (Saudi Arabia)', time: '1 hour ago', icon: Award, color: 'text-amber-500 bg-amber-50' },
                        { text: 'Interview scheduled for Hotel Cleaner (UAE)', time: '2 hours ago', icon: Calendar, color: 'text-indigo-500 bg-indigo-50' }
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div key={idx} className="flex items-start gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className={`w-6 h-6 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-slate-700 leading-tight truncate">{item.text}</p>
                              <span className="text-[8.5px] text-slate-400 mt-1 block font-medium">{item.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* All other tabs share the native dark themed card */}
          {employerTab !== 'dashboard' && (
            <div className="bg-[#0B1329] text-slate-100 rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-6 animate-fade-in">

        {/* NEW TAB: CANDIDATES */}
        {employerTab === 'candidates' && (
          <div className="bg-[#131C31] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in text-slate-200">
            <div className="border-b border-slate-800 pb-3.5 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" /> প্রবাসী প্রার্থী ডাটাবেজ (Candidates Database)
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">আপনার রিক্রুটিং এজেন্সির অধীনে নিবন্ধিত এবং বিভিন্ন পদের জন্য যোগ্য সক্রিয় প্রবাসীদের পূর্ণাঙ্গ প্রোফাইল ও নথি ট্র্যাকার।</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-2xl text-[11px] font-black flex items-center gap-1.5">
                  🔑 কন্টাক্ট ক্রেডিট ব্যালেন্স: <span className="text-white text-xs font-bold">{contactCredits}</span>টি
                </div>
                <button
                  onClick={() => {
                    setEmployerTab('payments');
                    alert('পেমেন্ট ও সাবস্ক্রিপশন ট্যাবে নিয়ে যাওয়া হচ্ছে। সেখানে নতুন "ক্যান্ডিডেট কন্টাক্ট প্যাক" ক্রয় করুন।');
                  }}
                  className="py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl text-[10px] transition hover:from-emerald-500 hover:to-teal-500 shadow-md"
                >
                  ➕ কন্টাক্ট প্যাক কিনুন (Buy Contact Pack)
                </button>
              </div>
            </div>

            {/* Candidate database list */}
            <div className="space-y-4">
              {[
                { name: 'মোঃ আব্দুর রহমান', skill: 'Heavy Truck Driver', country: 'Saudi Arabia 🇸🇦', exp: '৫ বছর (জিসিসি)', status: 'স্মার্টকার্ড প্রস্তুত', medical: 'FIT', police: 'Verified', phone: '০১৭১২৩৪৫৬৭৮' },
                { name: 'কফিল উদ্দিন আহমেদ', skill: 'Pipe Fitter', country: 'Qatar 🇶🇦', exp: '৩ বছর', status: 'ভিসা স্ট্যাম্পিং রানিং', medical: 'FIT', police: 'Verified', phone: '০১৮৯৮৭৬৫৪৩২' },
                { name: 'রাসেল মিয়া', skill: 'Electrician', country: 'Romania 🇷🇴', exp: '৪ বছর (বাংলাদেশ)', status: 'অফার লেটার গৃহীত', medical: 'FIT', police: 'Verified', phone: '০১৬১২৩৪৫৬৯৯' },
                { name: 'মোঃ মিজানুর রহমান', skill: 'Construction Mason', country: 'Italy 🇮🇹', exp: '২ বছর', status: 'নুল্লা ওস্তা অপেক্ষমাণ', medical: 'FIT', police: 'Verified', phone: '০১৫১২৩৪৫৬১১' }
              ].map((cand, idx) => {
                const isUnlocked = unlockedCandidates.includes(cand.name);
                const displayPhone = isUnlocked ? cand.phone : cand.phone.substring(0, 4) + ' •••••••';

                return (
                  <div key={idx} className="p-5 bg-[#111A2E] border border-slate-800/80 rounded-2xl flex flex-col md:flex-row justify-between gap-4 hover:border-slate-700 transition shadow-inner">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-sm font-black flex items-center justify-center select-none">
                          {cand.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-white text-sm">{cand.name}</h4>
                            {isUnlocked ? (
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black">UNLOCKED</span>
                            ) : (
                              <span className="text-[8px] bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded font-black">LOCKED</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">দক্ষতা: <span className="text-blue-400 font-bold">{cand.skill}</span> • অভিজ্ঞতা: {cand.exp}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md text-[9px] font-bold">গন্তব্য: {cand.country}</span>
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[9px] font-bold">মেডিকেল: {cand.medical} (FIT)</span>
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md text-[9px] font-bold">পুলিশ ক্লিয়ারেন্স: {cand.police}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end gap-3 shrink-0 text-right md:w-56">
                      <div className="w-full">
                        <span className="bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-lg text-[9.5px] font-black uppercase">
                          {cand.status}
                        </span>
                        <p className="text-[10px] text-slate-300 font-mono mt-1.5">যোগাযোগ: {displayPhone}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 w-full md:justify-end">
                        {!isUnlocked ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (contactCredits > 0) {
                                if (confirm(`ক্যান্ডিডেট "${cand.name}" এর কন্টাক্ট নম্বর আনলক করতে ১টি ক্রেডিট কাটা হবে। আপনি কি নিশ্চিত?`)) {
                                  setContactCredits(prev => prev - 1);
                                  setUnlockedCandidates(prev => [...prev, cand.name]);
                                  alert(`সফলভাবে "${cand.name}" এর মোবাইল নম্বর আনলক করা হয়েছে!\nকন্টাক্ট নম্বর: ${cand.phone}`);
                                }
                              } else {
                                alert('আপনার কন্টাক্ট ক্রেডিট ব্যালেন্স শেষ! কন্টাক্ট নম্বর আনলক করতে অনুগ্রহ করে "পেমেন্ট ও বিলিং" ট্যাব থেকে "ক্যান্ডিডেট কন্টাক্ট প্যাক" কিনুন।');
                                setEmployerTab('payments');
                              }
                            }}
                            className="py-1 px-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1 shadow-sm"
                          >
                            🔑 আনলক করুন (১ ক্রেডিট)
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              setNewIntCandName(cand.name);
                              setNewIntJobTitle(cand.skill);
                              setEmployerTab('interview');
                              alert(`প্রার্থী "${cand.name}" কে সাক্ষাৎকারের জন্য বাছাই করা হয়েছে। সাক্ষাৎকারের সময়সূচী ফর্মটি পূরণ করুন।`);
                            }}
                            className="py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] transition cursor-pointer"
                          >
                            📅 Interview Call
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            if (!isUnlocked) {
                              alert('অনুগ্রহ করে ক্যান্ডিডেটের কন্টাক্ট নম্বর আনলক করে সিভি ফাইল ডাউনলোড করুন!');
                            } else {
                              alert(`প্রার্থী "${cand.name}" এর বায়োমেট্রিক ও পাসপোর্ট এনক্রিপ্টেড সিভি ডাউনলোড শুরু হয়েছে!`);
                            }
                          }}
                          className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[10px] transition cursor-pointer"
                        >
                          📄 View CV
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* NEW TAB: NOTICES */}
        {employerTab === 'notices' && (
          <div className="bg-[#131C31] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in text-slate-200">
            <div className="border-b border-slate-800 pb-3.5 flex justify-between items-start flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400 animate-bounce" /> 🛂 ভিসা ফুল ফটো এবং নোটিশ বোর্ড (Visa Full Photo & Notice Board)
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">ভিসা প্রুফ কপি, ফুল-সাইজ পাসপোর্ট সাইজ ভিসা অনুমোদন নিশ্চিতকরণ এবং এম্বাসি ক্লিয়ারেন্স সংক্রান্ত জরুরি নিয়মাবলী ও নির্দেশিকা সমূহ।</p>
              </div>
            </div>

            {/* Post notice for internal staff */}
            <div className="bg-[#111A2E] p-5 rounded-2xl border border-slate-800/80 space-y-4">
              <h4 className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                📢 অভ্যন্তরীণ স্টাফদের জন্য নতুন নোটিশ জারি করুন
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10.5px] text-slate-400">নোটিশের শিরোনাম (Notice Title)</label>
                  <input 
                    type="text" 
                    placeholder="যেমন: সিলেট শাখার আগামী রোববারের মিটিং স্থগিত"
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    className="w-full p-2 bg-[#0B1329] border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10.5px] text-slate-400">গুরুত্ব মাত্রা (Urgency Level)</label>
                  <select 
                    value={newNoticeUrgency}
                    onChange={(e) => setNewNoticeUrgency(e.target.value)}
                    className="w-full p-2 bg-[#0B1329] border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none text-white"
                  >
                    <option value="High">🔴 High Urgency (জরুরি)</option>
                    <option value="Medium">🟡 Medium Urgency (সাধারণ)</option>
                    <option value="Low">🟢 Low Urgency (তথ্যমূলক)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10.5px] text-slate-400">নোটিশের বিবরণ (Content)</label>
                <textarea 
                  rows={2} 
                  placeholder="নোটিশের বিস্তারিত বার্তা এখানে লিখুন..."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  className="w-full p-2 bg-[#0B1329] border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
              <button 
                onClick={() => {
                  if (!newNoticeTitle.trim() || !newNoticeContent.trim()) {
                    alert('শিরোনাম ও বিবরণ পূরণ করুন!');
                    return;
                  }
                  const newNotice = {
                    id: agencyNotices.length + 1,
                    title: newNoticeTitle,
                    sender: 'এজেন্সি ডিরেক্টর (আপনি)',
                    date: 'আজ (Just Now)',
                    urgency: newNoticeUrgency,
                    content: newNoticeContent
                  };
                  setAgencyNotices([newNotice, ...agencyNotices]);
                  setNewNoticeTitle('');
                  setNewNoticeContent('');
                  alert('নতুন নোটিশ জারি করা হয়েছে এবং আপনার এজেন্সির সকল স্টাফদের পোর্টালে ব্রডকাস্ট করা হয়েছে!');
                }}
                className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition"
              >
                জারি করুন (Publish Notice)
              </button>
            </div>

            {/* Notices List */}
            <div className="space-y-4">
              {agencyNotices.map((notice) => (
                <div key={notice.id} className="p-4 bg-[#111A2E] border border-slate-800 rounded-2xl space-y-3 shadow-inner relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    notice.urgency === 'High' ? 'bg-rose-500' : notice.urgency === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}></div>
                  
                  <div className="flex justify-between items-start gap-2 flex-wrap pl-2.5">
                    <div>
                      <h4 className="font-extrabold text-white text-[13px]">{notice.title}</h4>
                      <p className="text-[9.5px] text-slate-400 font-medium mt-0.5">প্রেরক: <span className="text-slate-200 font-bold">{notice.sender}</span> • তারিখ: {notice.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase ${
                      notice.urgency === 'High' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' : notice.urgency === 'Medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {notice.urgency === 'High' ? 'জরুরি' : notice.urgency === 'Medium' ? 'সাধারণ' : 'তথ্যমূলক'}
                    </span>
                  </div>
                  <p className="text-slate-300 font-light text-xs leading-relaxed pl-2.5">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEW TAB: STAFF & BRANCHES */}
        {employerTab === 'staff' && (
          <div className="bg-[#131C31] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in text-slate-200">
            <div className="border-b border-slate-800 pb-3.5">
              <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" /> স্টাফ ও শাখা অফিস ব্যবস্থাপনা (Staff & Branches Cockpit)
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">আপনার রিক্রুটিং এজেন্সির অধীনে বিভিন্ন শাখার ম্যানেজার এবং ভিসা প্রসেসিং অফিসারদের অ্যাকাউন্ট ও ক্রিয়াকলাপ ট্র্যাকার।</p>
            </div>

            {/* Sibling columns: Left is staff roster, Right is branch offices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              
              {/* Left col: Staff members */}
              <div className="bg-[#111A2E] p-5 rounded-2xl border border-slate-800/80 space-y-4">
                <h4 className="text-xs font-black text-white uppercase border-b border-slate-800 pb-2 flex justify-between items-center">
                  👥 এজেন্সির সক্রিয় স্টাফ মেম্বারস
                  <span className="bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-black">Roster</span>
                </h4>

                {/* Add new staff member form */}
                <div className="bg-[#0B1329] p-3 rounded-xl border border-slate-800 space-y-3">
                  <p className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider">নতুন স্টাফ অফিসার যুক্ত করুন</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="নাম" 
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      className="p-1.5 bg-[#111A2E] border border-slate-800 rounded-lg text-[11px]" 
                    />
                    <select 
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value)}
                      className="p-1.5 bg-[#111A2E] border border-slate-800 rounded-lg text-[11px] text-white"
                    >
                      <option value="ভিসা প্রসেসিং কো-অর্ডিনেটর">ভিসা কো-অর্ডিনেটর</option>
                      <option value="শাখা ব্যবস্থাপক (Branch Manager)">শাখা ব্যবস্থাপক</option>
                      <option value="মাঠ পরিদর্শন কর্মকর্তা">মাঠ কর্মকর্তা</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="মোবাইল" 
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      className="p-1.5 bg-[#111A2E] border border-slate-800 rounded-lg text-[11px]" 
                    />
                    <input 
                      type="email" 
                      placeholder="ইমেইল" 
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      className="p-1.5 bg-[#111A2E] border border-slate-800 rounded-lg text-[11px]" 
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (!newStaffName.trim() || !newStaffPhone.trim() || !newStaffEmail.trim()) {
                        alert('স্টাফ মেম্বারের সম্পূর্ণ তথ্য দিন!');
                        return;
                      }
                      const newM = {
                        id: agencyStaff.length + 1,
                        name: newStaffName,
                        role: newStaffRole,
                        phone: newStaffPhone,
                        email: newStaffEmail,
                        status: 'Active (Online)'
                      };
                      setAgencyStaff([...agencyStaff, newM]);
                      setNewStaffName('');
                      setNewStaffPhone('');
                      setNewStaffEmail('');
                      alert('নতুন স্টাফ অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে এবং তাদের ইমেইলে ওয়ান-টাইম পাসওয়ার্ড পাঠানো হয়েছে!');
                    }}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg transition"
                  >
                    + Add Staff Account
                  </button>
                </div>

                {/* Staff list */}
                <div className="space-y-3">
                  {agencyStaff.map((staff) => (
                    <div key={staff.id} className="p-3 bg-[#0B1329] border border-slate-800 rounded-xl flex justify-between items-center gap-2">
                      <div>
                        <h5 className="font-extrabold text-white text-[12.5px]">{staff.name}</h5>
                        <p className="text-[9px] text-slate-400 font-medium">{staff.role} • {staff.email}</p>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">মোবাইল: {staff.phone}</p>
                      </div>
                      <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[8.5px] font-black shrink-0">
                        {staff.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right col: Branches (Originally from settings) */}
              <div className="bg-[#111A2E] p-5 rounded-2xl border border-slate-800/80 space-y-4">
                <h4 className="text-xs font-black text-white uppercase border-b border-slate-800 pb-2 flex justify-between items-center">
                  🏢 অনুমোদিত শাখা অফিস সমূহ (Branch Offices)
                  <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-black">Verified</span>
                </h4>

                {/* Add new branch form */}
                <div className="bg-[#0B1329] p-3 rounded-xl border border-slate-800 space-y-3">
                  <p className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider">নতুন শাখা অফিস যুক্ত করুন</p>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="শাখার ঠিকানা ও অবস্থান" 
                      value={newBranchLoc}
                      onChange={(e) => setNewBranchLoc(e.target.value)}
                      className="w-full p-1.5 bg-[#111A2E] border border-slate-800 rounded-lg text-[11px]" 
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="শাখা প্রধান (Manager)" 
                        value={newBranchMgr}
                        onChange={(e) => setNewBranchMgr(e.target.value)}
                        className="p-1.5 bg-[#111A2E] border border-slate-800 rounded-lg text-[11px]" 
                      />
                      <input 
                        type="text" 
                        placeholder="হেল্পলাইন ফোন" 
                        value={newBranchPhn}
                        onChange={(e) => setNewBranchPhn(e.target.value)}
                        className="p-1.5 bg-[#111A2E] border border-slate-800 rounded-lg text-[11px]" 
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleAddBranch}
                    className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-lg transition cursor-pointer"
                  >
                    + Add Branch Location
                  </button>
                </div>

                {/* Branch offices list */}
                <div className="space-y-3">
                  {branchOffices.map((branch: any) => (
                    <div key={branch.id} className="p-3 bg-[#0B1329] border border-slate-800 rounded-xl flex justify-between items-start gap-2">
                      <div>
                        <h5 className="font-extrabold text-white text-xs">{branch.location}</h5>
                        <p className="text-[9px] text-slate-400 mt-1">শাখা ব্যবস্থাপক: <strong className="text-slate-200">{branch.manager}</strong></p>
                        <p className="text-[9px] text-slate-500 font-mono">হটলাইন: {branch.phone}</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (confirm('আপনি কি নিশ্চিতভাবে এই শাখাটি ডিলিট করতে চান?')) {
                            handleDeleteBranch(branch.id);
                          }
                        }}
                        className="p-1 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded transition border border-transparent cursor-pointer"
                        title="Delete Branch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: COMPANY PROFILE */}
        {employerTab === 'profile' && (
          <div className="bg-[#131C31] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in text-slate-200">
            <div className="border-b border-slate-800 pb-3.5">
              <h3 className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <Building className="w-4.5 h-4.5 text-blue-400" /> কোম্পানি প্রোফাইল পরিচালনা
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">প্রার্থীদের সামনে আপনার রিক্রুটিং এজেন্সির ব্যান্ড ও যোগাযোগের ঠিকানাগুলো আকর্ষণীয় উপায়ে উপস্থাপন করুন।</p>
            </div>

            <form onSubmit={handleUpdateCompanySubmit} className="space-y-5 text-xs font-semibold text-slate-300">
              <div className="relative rounded-2xl overflow-hidden h-36 bg-slate-950 border border-slate-800 shadow-inner">
                <img src={profileCover} alt="Cover" className="w-full h-full object-cover opacity-60" />
                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                  <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-3xl shadow-md border border-slate-800 shrink-0 select-none">
                    {activeCompanyObj?.logo || '✈️'}
                  </div>
                  <div className="text-white drop-shadow">
                    <h3 className="text-xs font-black">{activeCompanyObj?.name}</h3>
                    <p className="text-[10px] text-slate-300 font-light mt-0.5">স্থাপিত: {profileEstYear} • {activeCompanyObj?.employees || '50-100'} কর্মী</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">কোম্পানি নাম (সংশোধনযোগ্য নয়)</label>
                  <input type="text" disabled value={activeCompanyObj?.name || ''} className="w-full py-2 px-3 border border-slate-800 rounded-xl bg-[#111A2E]/50 font-bold text-slate-500 cursor-not-allowed" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">লাইসেন্স নম্বর (সংশোধনযোগ্য নয়)</label>
                  <input type="text" disabled value={activeCompanyObj?.licenseNumber || 'RL-1452'} className="w-full py-2 px-3 border border-slate-800 rounded-xl bg-[#111A2E]/50 font-bold text-slate-500 cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">কভার ব্যানার ইমেজ লিংক (Cover URL)</label>
                  <input type="text" value={profileCover} onChange={(e) => setProfileCover(e.target.value)} className="w-full py-2 px-3 border border-slate-800 bg-[#111A2E] text-white rounded-xl font-mono text-[10px]" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">প্রতিষ্ঠার বছর</label>
                  <input type="number" value={profileEstYear} onChange={(e) => setProfileEstYear(e.target.value)} className="w-full py-2 px-3 border border-slate-800 bg-[#111A2E] text-white rounded-xl" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">অফিসিয়াল ওয়েবসাইট</label>
                  <input type="text" value={profileWebsite} onChange={(e) => setProfileWebsite(e.target.value)} className="w-full py-2 px-3 border border-slate-800 bg-[#111A2E] text-white rounded-xl font-mono text-[10px]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">হটলাইন ফোন নম্বর</label>
                  <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full py-2 px-3 border border-slate-800 bg-[#111A2E] text-white rounded-xl font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">গুগল ম্যাপ লোকেশন লিংক</label>
                  <input type="text" value={profileGoogleMap} onChange={(e) => setProfileGoogleMap(e.target.value)} className="w-full py-2 px-3 border border-slate-800 bg-[#111A2E] text-white rounded-xl font-mono text-[10px]" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">ফেসবুক / লিঙ্কডইন লিংক</label>
                  <input type="text" value={profileFbLinkedIn} onChange={(e) => setProfileFbLinkedIn(e.target.value)} className="w-full py-2 px-3 border border-slate-800 bg-[#111A2E] text-white rounded-xl font-mono text-[10px]" />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button type="submit" className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition">
                  আপডেট বিবরণী সংরক্ষণ করুন
                </button>
              </div>
            </form>

            {/* BRANCH OFFICES SECTION */}
            <div className="border-t border-slate-800 pt-5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5 uppercase">
                  <MapPinIcon className="w-4 h-4 text-emerald-400" /> এজেন্সির শাখা অফিসসমূহ ({branchOffices.length})
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branchOffices.map((b) => (
                  <div key={b.id} className="p-3 bg-[#111A2E] border border-slate-800 rounded-2xl flex justify-between items-start gap-2.5 transition hover:shadow-sm">
                    <div className="text-[11px] text-slate-300 space-y-1 font-semibold leading-normal">
                      <p className="font-bold text-white flex items-center gap-1">🏢 {b.location}</p>
                      <p className="text-slate-400 font-light">ব্যবস্থাপক: <span className="font-bold text-slate-200">{b.manager}</span></p>
                      <p className="text-slate-400 font-light">ফোন: <span className="font-bold text-slate-200 font-mono text-[10px]">{b.phone}</span></p>
                    </div>
                    <button onClick={() => handleDeleteBranch(b.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition" title="মুছে ফেলুন">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add branch form */}
              <form onSubmit={handleAddBranch} className="bg-[#111A2E]/50 p-4 border border-dashed border-slate-800 rounded-2xl space-y-3 text-xs">
                <span className="text-[10px] font-black text-slate-400 block">নতুন শাখা অফিস যুক্ত করুন</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input type="text" placeholder="শাখার অবস্থান (যেমন: সিলেট কদমতলী)" value={newBranchLoc} onChange={(e) => setNewBranchLoc(e.target.value)} className="p-2 border border-slate-800 bg-[#111A2E] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                  <input type="text" placeholder="ম্যানেজার নাম" value={newBranchMgr} onChange={(e) => setNewBranchMgr(e.target.value)} className="p-2 border border-slate-800 bg-[#111A2E] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                  <input type="text" placeholder="মোবাইল নম্বর" value={newBranchPhn} onChange={(e) => setNewBranchPhn(e.target.value)} className="p-2 border border-slate-800 bg-[#111A2E] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition flex items-center gap-1 shadow-sm">
                    <Plus className="w-3.5 h-3.5" /> শাখা অফিস যুক্ত করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: COMPANY DOCUMENTS */}
        {employerTab === 'documents' && (() => {
          const requiredDocTypes = [
            { key: 'Company Logo', label: 'কোম্পানি লোগো (Company Logo)', icon: '🖼️', accepted: 'image/*', sizeLimit: '৫ MB' },
            { key: 'Trade License', label: 'ট্রেড লাইসেন্স (Trade License)', icon: '📜', accepted: '.pdf,.jpg,.jpeg,.png', sizeLimit: '১০ MB' },
            { key: 'Company Registration Certificate', label: 'রেজিস্ট্রেশন সার্টিফিকেট (RJSC Certificate)', icon: '🏢', accepted: '.pdf,.jpg,.jpeg,.png', sizeLimit: '১০ MB' },
            { key: 'Recruiting Agency License', label: 'এজেন্সি লাইসেন্স (BMET RL License)', icon: '🛂', accepted: '.pdf,.jpg,.jpeg,.png', sizeLimit: '১০ MB' },
            { key: 'Tax/VAT Certificate', label: 'ট্যাক্স/ভ্যাট সার্টিফিকেট (NBR TIN Certificate)', icon: '💸', accepted: '.pdf,.jpg,.jpeg,.png', sizeLimit: '১০ MB' },
            { key: 'Owner NID/Passport', label: 'মালিকের এনআইডি / পাসপোর্ট (Owner NID/Passport)', icon: '👤', accepted: '.pdf,.jpg,.jpeg,.png', sizeLimit: '১০ MB' },
            { key: 'Authorization Letter', label: 'অথরাইজেশন লেটার (Authorization Letter)', icon: '✉️', accepted: '.pdf,.doc,.docx,.jpg,.jpeg,.png', sizeLimit: '১০ MB' },
            { key: 'Office Photos', label: 'অফিস ভবনের ছবি (Premises Office Photos)', icon: '📸', accepted: 'image/*', sizeLimit: '৫ MB' },
            { key: 'Other Documents', label: 'অন্যান্য প্রয়োজনীয় নথি (Other Documents)', icon: '📂', accepted: '.pdf,.doc,.docx,.jpg,.jpeg,.png', sizeLimit: '১০ MB' },
          ];

          const findDocInUploaded = (key: string) => {
            return uploadedDocs.find(d => 
              d.type.toLowerCase().replace(/\s+/g, '') === key.toLowerCase().replace(/\s+/g, '') ||
              d.type.toLowerCase().includes(key.toLowerCase().substring(0, 10))
            );
          };

          return (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4.5 h-4.5 text-blue-600" /> সরকারি লাইসেন্স ও এজেন্সির নথি ভান্ডার
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">BMET ওয়ান-স্টপ ভেরিফিকেশনের জন্য প্রয়োজনীয় সব নথিপত্র গ্যালারি, ফাইল বা মোবাইল ক্যামেরা দিয়ে আপলোড করুন।</p>
                </div>
                <div className="flex gap-2 text-[9px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border">
                  <span>সর্বোচ্চ সাইজ: ছবি ৫ MB • PDF/নথি ১০ MB</span>
                </div>
              </div>

              {/* Grid of Documents */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {requiredDocTypes.map((docType) => {
                  const uploaded = findDocInUploaded(docType.key);
                  const progress = uploadProgress[docType.key];
                  const error = uploadErrors[docType.key];

                  return (
                    <div key={docType.key} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md hover:border-slate-300 transition-all duration-300 relative">
                      {/* Hidden Real Input fields for file selection */}
                      <input 
                        type="file"
                        id={`file-picker-${docType.key.replace(/\s+/g, '-')}`}
                        className="hidden"
                        accept={docType.accepted}
                        onChange={(e) => handleRealFileSelection(docType.key, 'file', e)}
                      />
                      <input 
                        type="file"
                        id={`gallery-picker-${docType.key.replace(/\s+/g, '-')}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleRealFileSelection(docType.key, 'gallery', e)}
                      />

                      <div className="space-y-3">
                        {/* Header info */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-start gap-2.5">
                            <span className="text-2xl bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-center shrink-0">
                              {docType.icon}
                            </span>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-black text-slate-800 leading-tight">{docType.label}</h4>
                              <p className="text-[9.5px] text-slate-400 font-medium">সমর্থিত ফরম্যাট: {docType.accepted.replace(/\./g, ' ').toUpperCase()}</p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0">
                            {progress !== undefined ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8.5px] font-black font-mono bg-blue-50 text-blue-600 border-blue-200">
                                <RefreshCw className="w-3 h-3 animate-spin text-blue-500" /> {progress}%
                              </span>
                            ) : uploaded ? (
                              <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-[8.5px] font-black ${
                                uploaded.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                uploaded.status === 'Correction' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                {uploaded.status === 'Verified' ? '✓ APPROVED' : uploaded.status === 'Correction' ? '⚠️ CORRECTION REQUESTED' : '⏳ UNDER REVIEW'}
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 rounded-lg border text-[8.5px] font-black bg-slate-50 text-slate-400 border-slate-100">
                                MISSING
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {progress !== undefined && (
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full transition-all duration-150" style={{ width: `${progress}%` }}></div>
                          </div>
                        )}

                        {/* File details or Upload Options */}
                        {uploaded ? (
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 space-y-2">
                            <div className="text-[10.5px] space-y-1">
                              <p className="font-mono text-slate-600 font-bold truncate">
                                📄 {uploaded.name}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-2 text-[9.5px] text-slate-400 font-medium">
                                <span>সাইজ: <strong className="text-slate-600 font-bold">{uploaded.size}</strong></span>
                                <span>•</span>
                                <span>আপলোড: <strong className="text-slate-600 font-bold">{uploaded.date}</strong></span>
                                {uploaded.uploadMethod && (
                                  <>
                                    <span>•</span>
                                    <span>মাধ্যম: <strong className="text-slate-600 font-bold uppercase">{uploaded.uploadMethod === 'gallery' ? '🖼️ গ্যালারি' : uploaded.uploadMethod === 'camera' ? '📸 ক্যামেরা' : '📁 ফাইল'}</strong></span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Remarks Box if correction or remarks are active */}
                            {uploaded.remarks && (
                              <div className="bg-rose-50 border border-rose-150 p-2.5 rounded-lg text-[9.5px] text-rose-700 leading-normal">
                                <p className="font-extrabold flex items-center gap-1">⚠️ ভেরিফিকেশন কর্মকর্তার মন্তব্য:</p>
                                <p className="italic font-medium mt-0.5">"{uploaded.remarks}"</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                            এজেন্সি ও লাইসেন্স ভেরিফাই করার জন্য অবশ্যই এই ডকুমেন্টটি আপলোড করতে হবে। নিচে যেকোনো একটি অপশন ব্যবহার করুন।
                          </div>
                        )}

                        {/* Error Alert */}
                        {error && (
                          <div className="p-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[9.5px] font-semibold">
                            ⚠️ {error}
                          </div>
                        )}
                      </div>

                      {/* Document Actions */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                        {!uploaded && progress === undefined ? (
                          <>
                            <button
                              type="button"
                              onClick={() => document.getElementById(`gallery-picker-${docType.key.replace(/\s+/g, '-')}`)?.click()}
                              className="flex-1 min-w-[100px] py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl font-bold text-[9.5px] text-slate-700 shadow-sm transition flex items-center justify-center gap-1"
                            >
                              📷 Choose Gallery
                            </button>
                            <button
                              type="button"
                              onClick={() => document.getElementById(`file-picker-${docType.key.replace(/\s+/g, '-')}`)?.click()}
                              className="flex-1 min-w-[100px] py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl font-bold text-[9.5px] text-slate-700 shadow-sm transition flex items-center justify-center gap-1"
                            >
                              📁 Choose File
                            </button>
                            <button
                              type="button"
                              onClick={() => setCameraModalDocType(docType.key)}
                              className="flex-1 min-w-[100px] py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 hover:border-blue-200 rounded-xl font-bold text-[9.5px] shadow-sm transition flex items-center justify-center gap-1"
                            >
                              📸 Take Photo
                            </button>
                          </>
                        ) : uploaded ? (
                          <div className="flex items-center justify-between w-full gap-2">
                            <div className="flex gap-1.5 flex-1">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc({ ...uploaded, key: docType.key })}
                                className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-[9.5px] shadow-sm transition flex items-center justify-center gap-1"
                              >
                                <Eye className="w-3 h-3" /> Preview
                              </button>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  alert(`ফাইল "${uploaded.name}" ডাউনলোড শুরু হয়েছে!`);
                                }}
                                className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border font-bold text-[9.5px] transition flex items-center justify-center"
                                title="Download Document"
                              >
                                ⬇️ Download
                              </a>
                            </div>

                            <div className="flex gap-1.5">
                              {uploaded.status === 'Correction' && (
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`file-picker-${docType.key.replace(/\s+/g, '-')}`)?.click()}
                                  className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl font-bold text-[9.5px] transition"
                                >
                                  Replace File
                                </button>
                              )}

                              {uploaded.status === 'Verified' && (
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`file-picker-${docType.key.replace(/\s+/g, '-')}`)?.click()}
                                  className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold text-[9.5px] transition"
                                >
                                  Replace
                                </button>
                              )}

                              {uploaded.status === 'Pending' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => document.getElementById(`file-picker-${docType.key.replace(/\s+/g, '-')}`)?.click()}
                                    className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold text-[9.5px] transition"
                                    title="Replace File"
                                  >
                                    Replace
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDocument(docType.key)}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition border border-rose-100"
                                    title="Delete (Pending state only)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* General Document Uploader Form at bottom */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200/60 space-y-4 text-xs font-semibold">
                <h4 className="text-[10.5px] font-black uppercase text-slate-500 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-500" /> অন্যান্য অতিরিক্ত নথিপত্র সংযোজন করুন
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-500">নথির ক্যাটাগরি</label>
                    <select 
                      value={docUploadType} 
                      onChange={(e) => setDocUploadType(e.target.value)} 
                      className="w-full p-2.5 bg-white border border-slate-250 rounded-xl"
                    >
                      <option value="Trade License">ট্রেড লাইসেন্স (Trade License)</option>
                      <option value="Recruiting Agency License">রিক্রুটিং এজেন্সি লাইসেন্স (BMET RL-1452)</option>
                      <option value="Company Registration Certificate">কোম্পানি রেজিস্ট্রেশন সার্টিফিকেট (RJSC Certificate)</option>
                      <option value="Tax/VAT Certificate">ট্যাক্স/ভ্যাট সার্টিফিকেট (TIN/VAT Certificate)</option>
                      <option value="Owner NID/Passport">মালিকের এনআইডি/পাসপোর্ট (Owner Identity)</option>
                      <option value="Office Photos">চট্টগ্রাম/সিলেট অফিস ভবনের ফটো (Premises Photo)</option>
                      <option value="Authorization Letter">সরকারি অথরাইজেশন লেটার (Authorization Letter)</option>
                      <option value="Other Documents">অন্যান্য নথিপত্র (Other Documents)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500">ফাইলের নাম</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: Tax_Certificate_Draft_2026.pdf" 
                      value={docUploadFileName} 
                      onChange={(e) => setDocUploadFileName(e.target.value)} 
                      className="w-full p-2 bg-white border border-slate-250 rounded-xl font-mono text-[11px]" 
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => {
                      if (!docUploadFileName.trim()) {
                        alert('অনুগ্রহ করে ফাইলের নাম লিখুন');
                        return;
                      }
                      triggerSimulatedUpload(docUploadType, 'file', {
                        name: docUploadFileName,
                        sizeMB: 3.2
                      });
                      setDocUploadFileName('');
                    }}
                    className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow transition"
                  >
                    নথি ফাইল আপলোড শুরু করুন
                  </button>
                </div>
              </div>

              {/* SIMULATED MOBILE CAMERA MODAL */}
              {cameraModalDocType && (
                <div className="fixed inset-0 z-[999] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="w-full max-w-sm bg-slate-900 border-[6px] border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl relative aspect-[9/16] flex flex-col justify-between p-3">
                    
                    {/* Speaker & Sensor */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-850 rounded-full flex items-center justify-center gap-1.5 z-50">
                      <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                    </div>

                    {/* Top Status Indicators inside Screen */}
                    <div className="flex justify-between items-center px-4 pt-6 text-[10px] text-slate-400 font-mono font-bold z-40">
                      <span>১০:২৫ AM</span>
                      <div className="flex items-center gap-1">
                        <span>📡 5G</span>
                        <span>🔋 ১০০%</span>
                      </div>
                    </div>

                    {/* Viewfinder Camera Area */}
                    <div className="flex-1 my-3 rounded-2xl bg-black border border-slate-800 overflow-hidden relative flex flex-col items-center justify-center">
                      {isCameraSupported && cameraStream ? (
                        <video 
                          ref={videoRef}
                          className="w-full h-full object-cover transform scale-x-[-1]"
                          playsInline
                          muted
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center text-center p-4 space-y-4">
                          {/* Grid Guidelines */}
                          <div className="absolute inset-4 border border-dashed border-slate-700/30 pointer-events-none flex items-center justify-center">
                            <div className="w-px h-full bg-slate-700/15"></div>
                            <div className="h-px w-full bg-slate-700/15"></div>
                          </div>

                          {/* Pulsing Scanning bar */}
                          <div className="absolute left-0 right-0 h-0.5 bg-blue-500/80 shadow-[0_0_10px_#3b82f6] animate-[bounce_3s_infinite] pointer-events-none"></div>

                          {/* Document Layout Silhouette */}
                          <div className="w-48 h-32 border-2 border-dashed border-blue-500/40 rounded-xl flex flex-col items-center justify-center bg-blue-500/5 relative">
                            <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest">Document Viewfinder</span>
                            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-400"></div>
                            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-400"></div>
                            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-400"></div>
                            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-400"></div>
                          </div>

                          <div className="space-y-1 z-10">
                            <span className="text-xs font-bold text-white block">সরাসরি ক্যামেরা প্রিভিউ</span>
                            <span className="text-[9.5px] text-slate-500 block leading-relaxed max-w-[200px] mx-auto">নথি বা ফাইলটি ক্যামেরার আয়তক্ষেত্রের ভেতর সোজাভাবে ধরে রাখুন।</span>
                          </div>
                        </div>
                      )}

                      {/* Flash overlay effect */}
                      {isCapturing && (
                        <div className="absolute inset-0 bg-white z-50 animate-ping"></div>
                      )}

                      {/* Camera Info HUD */}
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[8.5px] text-white font-mono flex items-center gap-1.5 z-40">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                        <span>RESOLUT: 12MP • HDR AUTO</span>
                      </div>
                    </div>

                    {/* Shutter & Controls Bar */}
                    <div className="pb-4 px-4 flex justify-between items-center gap-4 z-40">
                      <button 
                        type="button"
                        onClick={() => {
                          stopCamera();
                          setCameraModalDocType(null);
                        }}
                        className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-[10px] font-black transition border border-slate-700"
                      >
                        বাতিল
                      </button>

                      {/* Shutter Button */}
                      <button
                        type="button"
                        disabled={isCapturing}
                        onClick={() => {
                          setIsCapturing(true);
                          setTimeout(() => {
                            setIsCapturing(false);
                            const mockFileFormat = ['Company Logo', 'Office Photos'].includes(cameraModalDocType) ? 'jpg' : 'png';
                            const fileCleanName = cameraModalDocType.replace(/\s+/g, '_') + `_Captured_Photo.${mockFileFormat}`;
                            triggerSimulatedUpload(cameraModalDocType, 'camera', {
                              name: fileCleanName,
                              sizeMB: Math.random() * 2 + 1.2
                            });
                            stopCamera();
                            setCameraModalDocType(null);
                          }, 600);
                        }}
                        className="w-16 h-16 rounded-full bg-white border-[4px] border-slate-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-150 relative shadow-lg"
                      >
                        <div className="w-11 h-11 rounded-full bg-white border border-slate-400/30"></div>
                      </button>

                      {/* Gallery Shortcut inside phone */}
                      <button
                        type="button"
                        onClick={() => {
                          stopCamera();
                          setCameraModalDocType(null);
                          setTimeout(() => {
                            document.getElementById(`gallery-picker-${cameraModalDocType.replace(/\s+/g, '-')}`)?.click();
                          }, 100);
                        }}
                        className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-[18px] transition border border-slate-700"
                        title="গ্যালারি থেকে সিলেক্ট করুন"
                      >
                        🖼️
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* DOCUMENT PREVIEW MODAL */}
              {previewDoc && (
                <div className="fixed inset-0 z-[999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[90vh]">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div>
                        <h3 className="text-xs font-black text-slate-800 uppercase">নথিপত্র প্রিভিউ: {previewDoc.type}</h3>
                        <p className="text-[10px] font-mono text-slate-400">ID: {previewDoc.id} • {previewDoc.name} ({previewDoc.size})</p>
                      </div>
                      <button 
                        onClick={() => setPreviewDoc(null)}
                        className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Interactive document render preview canvas */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50 flex items-center justify-center min-h-[300px]">
                      {(() => {
                        const isImg = ['jpg', 'jpeg', 'png'].includes(previewDoc.fileFormat || '');
                        if (isImg) {
                          return (
                            <div className="relative border-4 border-white rounded-xl shadow-lg bg-white overflow-hidden max-w-[340px] md:max-w-md">
                              {/* Office premises simulation or generic capture */}
                              {previewDoc.type === 'Office Photos' ? (
                                <div className="space-y-2 text-center">
                                  <div className="grid grid-cols-2 gap-1.5 p-1">
                                    <div className="bg-slate-200 h-28 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80')] bg-cover">প্রধান গেট</div>
                                    <div className="bg-slate-200 h-28 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=200&q=80')] bg-cover">অফিস কেবিন</div>
                                    <div className="bg-slate-200 h-28 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 bg-[url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=200&q=80')] bg-cover">কনফারেন্স রুম</div>
                                    <div className="bg-slate-200 h-28 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 bg-[url('https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=200&q=80')] bg-cover">আইটি হাব</div>
                                  </div>
                                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block py-1.5">Dhaka Gulshan Corporate HQ Photo Album</span>
                                </div>
                              ) : previewDoc.type === 'Company Logo' ? (
                                <div className="w-56 h-56 flex flex-col items-center justify-center p-6 bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-lg">
                                  <span className="text-5xl mb-2">🏢</span>
                                  <span className="text-sm font-black tracking-wide">GULF RECRUIT PRO</span>
                                  <span className="text-[9px] font-mono text-slate-400 uppercase mt-0.5 border-t border-white/10 pt-1 tracking-widest">Verified Recruiting Hub</span>
                                </div>
                              ) : (
                                <div className="p-4 flex flex-col items-center space-y-3">
                                  <div className="w-64 h-80 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                                    <span className="text-4xl">👤</span>
                                    <p className="text-xs font-extrabold text-slate-800 mt-3">মালিকের এনআইডি / পাসপোর্ট</p>
                                    <div className="w-full h-8 bg-slate-200 rounded mt-3 flex items-center px-2 justify-between">
                                      <div className="w-1/2 h-2.5 bg-slate-350 rounded"></div>
                                      <div className="w-1/4 h-3.5 bg-slate-400 rounded"></div>
                                    </div>
                                    <div className="w-full border-t border-dashed mt-4 pt-3 flex items-center justify-between text-[8px] font-mono text-slate-400">
                                      <span>ISSUE: BANGLADESH GOVT</span>
                                      <span>NID ID: 1991283749</span>
                                    </div>
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full flex items-center justify-center font-bold text-blue-500 text-[9px] rotate-45 translate-x-3 -translate-y-3 border">
                                      NID
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        } else {
                          // PDF / DOCUMENT PREVIEWS
                          return (
                            <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-lg relative overflow-hidden text-slate-800 space-y-4">
                              
                              {/* National Seal Badge */}
                              <div className="flex flex-col items-center text-center space-y-1 pb-4 border-b-2 border-slate-100">
                                <span className="text-3xl">🇧🇩</span>
                                <h4 className="text-[11px] font-extrabold text-slate-950 uppercase tracking-wide">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h4>
                                <p className="text-[9px] text-slate-500 font-bold uppercase">{previewDoc.type}</p>
                              </div>

                              <div className="space-y-2.5 text-[10.5px] font-medium leading-normal text-slate-600">
                                <div className="grid grid-cols-2 gap-2 border-b pb-2">
                                  <div>
                                    <span className="text-[9px] text-slate-400 uppercase block">কোম্পানি নাম:</span>
                                    <strong className="text-slate-800">জিজিসি রিক্রুটমেন্ট ওভারসিজ</strong>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-slate-400 uppercase block">লাইসেন্স রেফারেন্স:</span>
                                    <strong className="text-slate-800 font-mono">REG-BMET-{Math.floor(Math.random() * 89999 + 10000)}</strong>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[9px] text-slate-400 uppercase block">সনদের ধরণ ও বিবরণ:</span>
                                  <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                                    "নিবন্ধিত সংস্থাকে প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয় এবং জনশক্তি কর্মসংস্থান ও প্রশিক্ষণ ব্যুরো (BMET) কর্তৃক এ অনুমোদন দেওয়া হয়েছে।"
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-2 text-[9px]">
                                  <div>
                                    <span>কার্যকরী সন: <strong className="text-slate-800">২০২৬-২০২৭</strong></span>
                                  </div>
                                  <div className="text-right">
                                    <span>নিবন্ধনের তারিখ: <strong className="text-slate-800">২০২৬-০৬-১৫</strong></span>
                                  </div>
                                </div>
                              </div>

                              {/* Official Stamps */}
                              <div className="flex justify-between items-end pt-5 text-[8.5px] font-mono text-slate-400 border-t border-dashed">
                                <div className="flex flex-col items-center">
                                  <div className="w-12 h-12 rounded-full border border-red-500/20 flex items-center justify-center text-red-500 font-bold text-[8px] rotate-12 bg-red-500/5 mb-1">
                                    APPROVED
                                  </div>
                                  <span>প্রবাসী কল্যাণ মন্ত্রণালয়</span>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                  <span className="text-slate-800 font-bold italic mb-1">Md. Rafiqul Islam</span>
                                  <span>ভেরিফিকেশন কর্মকর্তা</span>
                                </div>
                              </div>

                            </div>
                          );
                        }
                      })()}
                    </div>

                    {/* Footer buttons */}
                    <div className="p-4 border-t border-slate-150 bg-slate-50 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          alert(`ডাউনলোড শুরু হয়েছে!`);
                        }}
                        className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[11px] border border-slate-200 transition"
                      >
                        ⬇️ ডাউনলোড করুন (Download)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(null)}
                        className="py-2 px-5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-xl text-[11px] transition"
                      >
                        বন্ধ করুন (Close)
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          );
        })()}

        {/* TAB 4: COMPANY VERIFICATION */}
        {employerTab === 'verification' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in text-xs">
            <div className="border-b pb-3.5 flex justify-between items-start flex-wrap gap-2">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-blue-600" /> এজেন্সির সরকারি ও সিস্টেম ভেরিফিকেশন স্ট্যাটাস
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">BMET ও প্রবাসী কল্যাণ মন্ত্রণালয় এবং পোর্টাল এডমিন কর্তৃক কোম্পানির নিরাপত্তা ও সত্যতা যাচাই স্ট্যাটাস।</p>
              </div>
              
              {(() => {
                const currentCompany = companies.find(c => c.id === currentEmployerCompanyId);
                const status = currentCompany?.companyStatus || (currentCompany?.isApproved ? 'Verified' : 'Pending');
                if (status === 'Verified') {
                  return (
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                      🟢 Verified Company (যাচাইকৃত)
                    </span>
                  );
                } else if (status === 'Under Review' || status === 'Pending') {
                  return (
                    <span className="bg-amber-50 text-amber-600 border border-amber-200 font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                      🟡 Under Review (পর্যালোচনাধীন)
                    </span>
                  );
                } else if (status === 'Suspended') {
                  return (
                    <span className="bg-rose-50 text-rose-600 border border-rose-200 font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                      🔴 Suspended (স্থগিত)
                    </span>
                  );
                } else {
                  return (
                    <span className="bg-slate-900 text-white border border-slate-950 font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                      ⚫ Blacklisted (কালো তালিকাভুক্ত)
                    </span>
                  );
                }
              })()}
            </div>

            {(() => {
              const currentCompany = companies.find(c => c.id === currentEmployerCompanyId);
              if (!currentCompany) return null;

              return (
                <div className="space-y-6">
                  {/* Verification Badges summary */}
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-150 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">ট্রেড লাইসেন্স স্ট্যাটাস</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${currentCompany.tradeLicense ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span className="font-extrabold text-slate-700">{currentCompany.tradeLicense ? 'ট্রেড লাইসেন্স ভেরিফাইড' : 'ট্রেড লাইসেন্স পেন্ডিং'}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-500">অনুমোদিত নম্বর: {currentCompany.tradeLicense || 'Not Submitted'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">রিক্রুটিং লাইসেন্স (RL-No)</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${currentCompany.recruitingLicense ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span className="font-extrabold text-slate-700">{currentCompany.recruitingLicense ? 'রিক্রুটিং লাইসেন্স ভেরিফাইড' : 'লাইসেন্স সাবমিট করুন'}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-500">RL-অনুমোদন কোড: {currentCompany.recruitingLicense || 'Not Provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">ফিজিক্যাল অফিস ঠিকানা যাচাই</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${currentCompany.officeVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span className="font-extrabold text-slate-700">{currentCompany.officeVerified ? 'অফিস সশরীরে ভেরিফাইড' : 'রিভিউ চলছে'}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-500">ঠিকানা: {currentCompany.location}</p>
                    </div>
                  </div>

                  {/* Multi-step Interactive Checklists */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Checklist */}
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5 border-b pb-2">
                        🛡️ নিরাপত্তা ভেরিফিকেশন চেকলিস্ট (নিয়োগকর্তা তথ্য)
                      </h4>

                      <div className="space-y-3">
                        {/* Trade License */}
                        <div className="flex items-start justify-between p-3 bg-white border border-slate-150 rounded-2xl gap-2">
                          <div>
                            <p className="font-bold text-slate-800">১. সরকারি ট্রেড লাইসেন্স (Trade License)</p>
                            <p className="text-[9.5px] text-slate-400 leading-normal mt-0.5">এজেন্সির ব্যবসা পরিচালনার वैधতা নিশ্চিতকরণ ও সরকারি ভেরিফিকেশন।</p>
                          </div>
                          {currentCompany.tradeLicense ? (
                            <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-0.5 border border-emerald-150 text-[10px]">
                              ✓ ভেরিফাইড
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const code = prompt('আপনার কোম্পানির ট্রেড লাইসেন্স নম্বর দিন (যেমন: TR-10928-DHAKA):', 'TR-10928-DHAKA');
                                if (code) {
                                  onUpdateCompany({ ...currentCompany, tradeLicense: code });
                                  alert('ট্রেড লাইসেন্স সাবমিট করা হয়েছে এবং এডমিন প্যানেলে রিভিউ এর জন্য পাঠানো হয়েছে!');
                                }
                              }}
                              className="text-blue-600 font-extrabold hover:bg-blue-50 px-2.5 py-1 rounded-xl shrink-0 border border-blue-200 text-[10px]"
                            >
                              সাবমিট করুন
                            </button>
                          )}
                        </div>

                        {/* Recruiting License */}
                        <div className="flex items-start justify-between p-3 bg-white border border-slate-150 rounded-2xl gap-2">
                          <div>
                            <p className="font-bold text-slate-800">২. রিক্রুটিং লাইসেন্স (Recruiting License - RL No)</p>
                            <p className="text-[9.5px] text-slate-400 leading-normal mt-0.5">বিদেশে জনশক্তি রপ্তানির বৈধ লাইসেন্স চেক।</p>
                          </div>
                          {currentCompany.recruitingLicense ? (
                            <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-0.5 border border-emerald-150 text-[10px]">
                              ✓ ভেরিফাইড
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const code = prompt('আপনার রিক্রুটিং লাইসেন্স নম্বর দিন (যেমন: RL-1095):', 'RL-1095');
                                if (code) {
                                  onUpdateCompany({ ...currentCompany, recruitingLicense: code });
                                  alert('রিক্রুটিং লাইসেন্স আপলোড সফল! এডমিন দ্রুত ভেরিফিকেশন করবে।');
                                }
                              }}
                              className="text-blue-600 font-extrabold hover:bg-blue-50 px-2.5 py-1 rounded-xl shrink-0 border border-blue-200 text-[10px]"
                            >
                              সাবমিট করুন
                            </button>
                          )}
                        </div>

                        {/* Phone OTP Verification */}
                        <div className="flex items-start justify-between p-3 bg-white border border-slate-150 rounded-2xl gap-2">
                          <div>
                            <p className="font-bold text-slate-800">৩. মোবাইল নম্বর OTP ভেরিফিকেশন</p>
                            <p className="text-[9.5px] text-slate-400 leading-normal mt-0.5">প্রতিষ্ঠানের প্রধান কর্মকর্তার মোবাইল নম্বর OTP কোড দিয়ে যাচাই।</p>
                          </div>
                          {currentCompany.phoneVerified ? (
                            <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-0.5 border border-emerald-150 text-[10px]">
                              ✓ ভেরিফাইড
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const otp = prompt('আপনার নিবন্ধিত মোবাইলে একটি ৪ ডিজিটের OTP পাঠানো হয়েছে। কোডটি দিন (ডেমো: ১২৩৪):', '1234');
                                if (otp === '1234') {
                                  onUpdateCompany({ ...currentCompany, phoneVerified: true });
                                  alert('ধন্যবাদ! আপনার মোবাইল নম্বর সফলভাবে ভেরিফাই করা হয়েছে।');
                                } else if (otp) {
                                  alert('ভুল OTP কোড। আবার চেষ্টা করুন।');
                                }
                              }}
                              className="text-amber-600 font-extrabold hover:bg-amber-50 px-2.5 py-1 rounded-xl shrink-0 border border-amber-200 text-[10px]"
                            >
                              ভেরিফাই করুন
                            </button>
                          )}
                        </div>

                        {/* Email Verification */}
                        <div className="flex items-start justify-between p-3 bg-white border border-slate-150 rounded-2xl gap-2">
                          <div>
                            <p className="font-bold text-slate-800">৪. কর্পোরেট ইমেইল ভেরিফিকেশন</p>
                            <p className="text-[9.5px] text-slate-400 leading-normal mt-0.5">অফিসিয়াল ইমেইল ঠিকানায় ভেরিফিকেশন লিংক প্রেরণ ও নিশ্চিতকরণ।</p>
                          </div>
                          {currentCompany.emailVerified ? (
                            <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-0.5 border border-emerald-150 text-[10px]">
                              ✓ ভেরিফাইড
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateCompany({ ...currentCompany, emailVerified: true });
                                alert('ইমেইল ভেরিফিকেশন লিংক পাঠানো হয়েছে এবং কর্পোরেট ইমেইল সফলভাবে ভেরিফাইড করা হয়েছে!');
                              }}
                              className="text-amber-600 font-extrabold hover:bg-amber-50 px-2.5 py-1 rounded-xl shrink-0 border border-amber-200 text-[10px]"
                            >
                              ইমেইল ভেরিফাই
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Checklist */}
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5 border-b pb-2">
                        📍 ফিজিক্যাল ও ডিজিটাল ভেরিফিকেশন (অ্যাডমিন পরিদর্শন)
                      </h4>

                      <div className="space-y-3">
                        {/* Office Address Verification */}
                        <div className="flex items-start justify-between p-3 bg-white border border-slate-150 rounded-2xl gap-2">
                          <div>
                            <p className="font-bold text-slate-800">৫. অফিসের সশরীরে ঠিকানা যাচাই (Office Address)</p>
                            <p className="text-[9.5px] text-slate-400 leading-normal mt-0.5">এডমিন টিম সশরীরে অফিস ঠিকানা পরিদর্শন করে সাইনবোর্ড ও ডেস্ক লজিস্টিকস মেলাবেন।</p>
                          </div>
                          {currentCompany.officeVerified ? (
                            <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-0.5 border border-emerald-150 text-[10px]">
                              ✓ পরিদর্শিত ও ভেরিফাইড
                            </span>
                          ) : (
                            <span className="text-amber-600 font-extrabold bg-amber-50 px-2.5 py-1 rounded-xl shrink-0 border border-amber-200 text-[10px]">
                              ⏳ পরিদর্শন অপেক্ষমান
                            </span>
                          )}
                        </div>



                        {/* Active Reports Indicator inside employer view */}
                        {(() => {
                          const myReports = companyReports.filter(r => r.companyId === currentEmployerCompanyId);
                          if (myReports.length > 0) {
                            return (
                              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                                <p className="font-black text-rose-800 flex items-center gap-1 text-[11px]">
                                  ⚠️ আপনার এজেন্সির বিরুদ্ধে অভিযোগ দায়ের হয়েছে!
                                </p>
                                <p className="text-[10px] text-rose-700 leading-normal">
                                  পোর্টাল গ্রাহক/চাকরিপ্রার্থীদের কাছ থেকে আপনার কোম্পানির বিরুদ্ধে <strong>{myReports.length}টি অভিযোগ</strong> জমা পড়েছে। এডমিন টিম বিষয়টি ইনভেস্টিগেট করছে। অনুগ্রহ করে অভিযোগের কারণ খতিয়ে দেখুন এবং সংশোধন করুন।
                                </p>
                                <div className="space-y-1 pt-1.5 border-t border-rose-150">
                                  {myReports.map((rep) => (
                                    <div key={rep.id} className="bg-white/60 p-2 rounded-lg text-[9.5px] text-rose-900 border border-rose-100 flex justify-between items-center">
                                      <span>{rep.category === 'Fake Job' ? 'ভুয়া চাকরি' : rep.category === 'Fake Visa' ? 'ভুয়া ভিসা অফার' : 'অন্যান্য প্রতারণা'}: {rep.description.substring(0, 40)}...</span>
                                      <span className="font-bold bg-rose-200 px-1.5 rounded">{(rep.status === 'Pending' || rep.status === 'Investigating') ? 'চলমান' : 'সমাধানকৃত'}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-2xl text-[10.5px] text-emerald-800 font-medium">
                                🟢 আপনার কোম্পানির বিরুদ্ধে এখন পর্যন্ত কোনো নেতিবাচক অভিযোগ বা রিপোর্ট জমা পড়েনি। আপনার স্বচ্ছ সেবা বজায় রাখুন!
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Feedback Officer Comments */}
                  <div className="bg-slate-50 p-4 rounded-2xl border space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ভেরিফিকেশন অফিসার ও এডমিন অফিসিয়াল মন্তব্য</span>
                    <div className="space-y-2">
                      <div className="p-3 bg-white border border-slate-150 rounded-2xl leading-relaxed">
                        <p className="font-black text-blue-900 mb-0.5">💬 এডমিন অফিসার ফিডব্যাক (২০২৬-০৬-২৫):</p>
                        <p className="text-slate-600 font-medium text-[10.5px]">সবগুলো প্রধান লাইসেন্স সঠিক পাওয়া গেছে। ঢাকার গুলশান হেড অফিসের ছবি ও চট্টগ্রাম শাখা কার্যালয় স্পেস সফলভাবে ফিজিক্যাল ভেরিফাই সম্পন্ন। দয়া করে সিলেট শাখার লিজ চুক্তি ফাইলটি আপলোড করুন।</p>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 5: JOBS MANAGEMENT */}
        {employerTab === 'jobs' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Sub-tabs Navigation Bar */}
            <div className="bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              {/* Sub-tabs List matching user design */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {[
                  { id: 'All', label: 'সব সার্কুলার' },
                  { id: 'Approved', label: 'সক্রিয়' },
                  { id: 'Pending', label: 'অনুমোদন অপেক্ষমাণ' },
                  { id: 'Draft', label: 'ড্রাফট' },
                  { id: 'Expired', label: 'মেয়াদোত্তীর্ণ' },
                  { id: 'Closed', label: 'বন্ধ' },
                ].map((tab) => {
                  const count = tab.id === 'All' 
                    ? activeCompanyJobs.length 
                    : activeCompanyJobs.filter(j => j.status === tab.id).length;
                  const isActive = jobsFilter === tab.id && !editingJob;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setEditingJob(null);
                        setJobsFilter(tab.id);
                      }}
                      className={`py-2 px-3.5 rounded-xl text-xs font-black shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action Button: Post New Job */}
              <button
                type="button"
                onClick={() => {
                  setEditingJob(null);
                  setJobsFilter('PostNew');
                }}
                className={`py-2.5 px-4 rounded-xl text-xs font-black shrink-0 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  jobsFilter === 'PostNew' && !editingJob
                    ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 ring-offset-2 ring-offset-slate-900'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>নতুন চাকরির বিজ্ঞপ্তি দিন</span>
              </button>
            </div>

            {/* FULL PAGE CONTENT AREA */}
            {jobsFilter === 'PostNew' && !editingJob ? (
              /* Full Page Post New Job Form */
              <div className="w-full max-w-4xl mx-auto space-y-4">
                {(() => {
                  const currentCompany = companies.find(c => c.id === currentEmployerCompanyId);
                  const status = currentCompany?.companyStatus || (currentCompany?.isApproved ? 'Verified' : 'Pending');
                  if (status !== 'Verified') {
                    return (
                      <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl space-y-3 text-rose-800 font-medium shadow-sm">
                        <div className="flex items-center gap-2 font-black text-sm">
                          <ShieldAlert className="w-6 h-6 text-rose-600 animate-pulse" /> 
                          <span>চাকরি পোস্ট ব্লক করা আছে (Posting Blocked)</span>
                        </div>
                        <p className="text-xs">
                          আপনার কোম্পানির বর্তমান স্ট্যাটাস: <strong className="bg-rose-150 px-2 py-0.5 rounded text-rose-900 font-extrabold">{status === 'Blacklisted' ? 'কালো তালিকাভুক্ত (Blacklisted)' : status === 'Suspended' ? 'স্থগিত (Suspended)' : 'পর্যালোচনাধীন (Under Review)'}</strong>।
                        </p>
                        <p className="text-xs leading-relaxed">
                          নিরাপত্তা নীতি অনুযায়ী, শুধুমাত্র <strong>🟢 Verified Company</strong> (যাচাইকৃত প্রতিষ্ঠান) চাকরি পোস্ট করতে পারবে। দয়া করে আপনার কোম্পানির ভেরিফিকেশন ট্যাব থেকে প্রয়োজনীয় সকল ডকুমেন্ট (ট্রেড লাইসেন্স, রিক্রুটিং লাইসেন্স) সাবমিট করুন এবং ভেরিফিকেশন সম্পন্ন হওয়া পর্যন্ত অপেক্ষা করুন।
                        </p>
                        <div className="pt-2">
                          <button 
                            type="button"
                            onClick={() => setEmployerTab('verification')}
                            className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2 rounded-xl transition shadow cursor-pointer"
                          >
                            ভেরিফিকেশন ট্যাবে যান ➔
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <NewJobPostForm
                      newJobTitle={newJobTitle}
                      setNewJobTitle={setNewJobTitle}
                      newJobCategory={newJobCategory}
                      setNewJobCategory={setNewJobCategory}
                      newJobCountry={newJobCountry}
                      setNewJobCountry={setNewJobCountry}
                      newJobLocation={newJobLocation}
                      setNewJobLocation={setNewJobLocation}
                      newJobType={newJobType}
                      setNewJobType={setNewJobType}
                      newJobVisaType={newJobVisaType}
                      setNewJobVisaType={setNewJobVisaType}
                      newJobSalary={newJobSalary}
                      setNewJobSalary={setNewJobSalary}
                      newJobDeadline={newJobDeadline}
                      setNewJobDeadline={setNewJobDeadline}
                      newJobDesc={newJobDesc}
                      setNewJobDesc={setNewJobDesc}
                      newJobReqs={newJobReqs}
                      setNewJobReqs={setNewJobReqs}
                      isPremiumPack={isPremiumPack}
                      setIsPremiumPack={setIsPremiumPack}
                      handlePostJobSubmit={(e) => {
                        handlePostJobSubmit(e);
                        setJobsFilter('All');
                      }}
                      activeCompanyName={activeCompanyObj?.name}
                      activeCompanyLogo={activeCompanyObj?.logo}
                    />
                  );
                })()}
              </div>
            ) : editingJob ? (
              /* Full Page Edit Job Form */
              <div className="w-full max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs font-semibold">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black text-blue-900 flex items-center gap-2">
                    <EditIcon className="w-5 h-5 text-blue-600" /> চাকরির তথ্য এডিট করুন ({editingJob.title})
                  </h3>
                  <button type="button" onClick={() => setEditingJob(null)} className="text-slate-400 hover:text-slate-700 font-black text-xs px-2.5 py-1 bg-slate-100 rounded-lg cursor-pointer">
                    ✕ বাতিল
                  </button>
                </div>

                <form onSubmit={handleEditJobSubmit} className="space-y-4 text-xs text-slate-700">
                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold block">পদের নাম (Title)</label>
                    <input type="text" required value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">দেশ (Country)</label>
                      <input type="text" value={editingCountry} onChange={(e) => setEditingCountry(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">শহর (Location)</label>
                      <input type="text" value={editingLocation} onChange={(e) => setEditingLocation(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold block">বেতন (Salary)</label>
                    <input type="text" value={editingSalary} onChange={(e) => setEditingSalary(e.target.value)} className="w-full p-2.5 border rounded-xl font-mono font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold block">আবেদনের শেষ তারিখ</label>
                    <input type="date" value={editingDeadline} onChange={(e) => setEditingDeadline(e.target.value)} className="w-full p-2.5 border rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold block">পদ বিবরণী</label>
                    <textarea rows={4} value={editingDesc} onChange={(e) => setEditingDesc(e.target.value)} className="w-full p-2.5 border rounded-xl leading-relaxed" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold block">প্রয়োজনীয় যোগ্যতা (নতুন লাইন দিয়ে আলাদা করুন)</label>
                    <textarea rows={4} value={editingReqs} onChange={(e) => setEditingReqs(e.target.value)} className="w-full p-2.5 border rounded-xl font-mono" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setEditingJob(null)} className="w-1/3 py-3 border border-slate-300 rounded-xl font-bold text-slate-700 cursor-pointer">
                      বাতিল
                    </button>
                    <button type="submit" className="w-2/3 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition shadow cursor-pointer">
                      পরিবর্তন সেভ করুন
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Full Page Circulars Grid View */
              <div className="space-y-4">
                {/* Header Info Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white p-4 rounded-2.5xl border border-slate-200/80 shadow-sm">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                      <span>📌</span>
                      {jobsFilter === 'All' ? 'সকল চাকরির বিজ্ঞপ্তি' : jobsFilter === 'Approved' ? 'সক্রিয় সার্কুলারসমূহ' : jobsFilter === 'Pending' ? 'অনুমোদন অপেক্ষমাণ সার্কুলারসমূহ' : jobsFilter === 'Draft' ? 'ড্রাফট সার্কুলারসমূহ' : jobsFilter === 'Expired' ? 'মেয়াদোত্তীর্ণ সার্কুলারসমূহ' : 'বন্ধ সার্কুলারসমূহ'}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      মোট {activeCompanyJobs.filter(j => jobsFilter === 'All' || j.status === jobsFilter).length} টি সার্কুলার পাওয়া গেছে
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setJobsFilter('PostNew')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>নতুন সার্কুলার দিন</span>
                  </button>
                </div>

                {/* Jobs Grid (2 Columns on MD/LG screens) */}
                {activeCompanyJobs.filter(j => jobsFilter === 'All' || j.status === jobsFilter).length === 0 ? (
                  <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-2xl">
                      📂
                    </div>
                    <p className="text-xs font-bold text-slate-600">কোন সার্কুলার পাওয়া যায়নি</p>
                    <p className="text-[11px] text-slate-400">আপনার প্রতিষ্ঠানের জন্য নতুন জব বিজ্ঞপ্তি সাবমিট করতে নিচের বাটনে ক্লিক করুন।</p>
                    <button
                      type="button"
                      onClick={() => setJobsFilter('PostNew')}
                      className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow cursor-pointer"
                    >
                      ➕ নতুন সার্কুলার যোগ করুন
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeCompanyJobs
                      .filter(j => jobsFilter === 'All' || j.status === jobsFilter)
                      .map((job) => (
                        <div key={job.id} className="bg-white border border-slate-200 rounded-2.5xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3 group">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border ${
                                job.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {job.status === 'Approved' ? '🟢 LIVE (APPROVED)' : '⏳ PENDING REVIEW'}
                              </span>
                              <div className="flex gap-1.5">
                                <button onClick={() => handleStartEditingJob(job)} className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                                  ✏️ এডিট
                                </button>
                              </div>
                            </div>

                            <h4 className="font-black text-slate-900 text-sm group-hover:text-blue-600 transition">{job.title}</h4>
                            <p className="text-slate-500 font-semibold text-xs flex items-center gap-1.5">
                              <span>📍 {job.location}, {job.country}</span>
                              <span>•</span>
                              <span className="font-mono text-emerald-700 font-bold">💰 {job.salary}</span>
                            </p>
                            {job.description && (
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
                                {job.description}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-between items-center text-xs border-t pt-3 text-slate-500 font-semibold">
                            <p className="text-[11px]">মেয়াদ: <span className="font-mono font-bold text-slate-700">{job.deadline}</span></p>
                            <p className="text-blue-700 font-extrabold bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100 text-[11px]">
                              আবেদন: {applications.filter(a => a.jobId === job.id).length} জন
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: APPLICANTS */}
        {(employerTab === 'applicants' || employerTab === 'applications') && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="border-b pb-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4.5 h-4.5 text-blue-600" /> আবেদনকারীদের জীবনবৃত্তান্ত স্ক্রিনিং
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">আপনার এজেন্সির অধীনে বিভিন্ন সার্কুলারে ওয়ান-ক্লিক করা প্রবাসী আবেদনকারীদের তথ্য যাচাই করুন।</p>
              </div>

              {/* Status filter dropdown */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 font-light">ফিল্টার:</span>
                <select 
                  value={applicantsFilter} 
                  onChange={(e) => setApplicantsFilter(e.target.value as any)} 
                  className="p-1.5 bg-slate-50 border rounded-xl font-bold text-slate-700"
                >
                  <option value="All">সকল আবেদনকারী</option>
                  <option value="New">নতুন (New)</option>
                  <option value="Under Review">পর্যালোচনাধীন</option>
                  <option value="Shortlisted">শর্টলিস্টেড</option>
                  <option value="Selected">নির্বাচিত (Selected)</option>
                  <option value="Rejected">বাতিলকৃত</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {activeCompanyApplications
                .filter(app => applicantsFilter === 'All' || app.status === applicantsFilter)
                .map((app) => {
                  const statusStyles = {
                    Pending: 'bg-amber-50 text-amber-600 border-amber-100',
                    Shortlisted: 'bg-indigo-50 text-indigo-600 border-indigo-100',
                    Rejected: 'bg-rose-50 text-rose-600 border-rose-100',
                    Selected: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                    Hired: 'bg-pink-50 text-pink-600 border-pink-100'
                  };
                  return (
                    <div key={app.id} className="p-4 border border-slate-200 rounded-2.5xl bg-white flex flex-col md:flex-row justify-between gap-4 hover:shadow-sm transition text-xs font-semibold text-slate-700">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-slate-100 border text-base flex items-center justify-center select-none font-bold">
                            {app.candidateName.charAt(0)}
                          </span>
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-sm">{app.candidateName}</h4>
                            <p className="text-[10px] text-slate-400 font-light">আবেদনের পদ: <span className="font-bold text-slate-600">{app.jobTitle}</span></p>
                          </div>
                        </div>

                        {/* Candidate technical info */}
                        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t text-[10px] text-slate-500 font-light leading-none">
                          <p>পাসপোর্ট ভেরিফাইড: <span className="font-bold text-emerald-600">✓ YES</span></p>
                          <p>পুলিশ ক্লিয়ারেন্স: <span className="font-bold text-emerald-600">✓ YES</span></p>
                          <p>মেডিকেল স্ট্যাটাস: <span className="font-bold text-emerald-600">FIT (GAMCA)</span></p>
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex flex-col justify-between items-end gap-2 shrink-0">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-[8.5px] font-black uppercase ${statusStyles[app.status as keyof typeof statusStyles] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                          {app.status === 'Pending' ? 'New Application' : app.status}
                        </span>
                        
                        <div className="flex flex-wrap gap-1 items-center">
                          <button 
                            onClick={() => onUpdateApplicationStatus(app.id, 'Shortlisted')} 
                            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black transition"
                          >
                            শর্টলিস্ট
                          </button>
                          <button 
                            onClick={() => onUpdateApplicationStatus(app.id, 'Rejected')} 
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-black transition"
                          >
                            বাতিল
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedVisaId(app.id);
                              setEmployerTab('interview');
                            }} 
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black transition flex items-center gap-0.5"
                          >
                            <Video className="w-3 h-3" /> ইন্টারভিউ কল
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 7: VISA MANAGEMENT */}
        {employerTab === 'visa' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
            <div className="border-b pb-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4.5 h-4.5 text-blue-600" /> ক্যান্ডিডেট ওয়ার্ক ভিসা প্রসেস ও ট্র্যাকার
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">অফিসিয়াল অফার লেটার আপলোড ও এম্বেসিতে পাসপোর্ট স্ট্যাম্পিং ট্র্যাকিং হাব।</p>
              </div>

              {/* Subtab selection */}
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200 self-stretch sm:self-auto">
                <button
                  type="button"
                  onClick={() => setVisaSubTab('general')}
                  className={`py-1.5 px-3 rounded-lg text-[10px] font-black uppercase transition-all ${
                    visaSubTab === 'general'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  📋 সাধারণ ট্র্যাকার
                </button>
                <button
                  type="button"
                  onClick={() => setVisaSubTab('italy')}
                  className={`py-1.5 px-3 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 ${
                    visaSubTab === 'italy'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  💼 চুক্তি ও পেমেন্ট ওয়ার্কফ্লো ({(italyPackages || []).filter(p => p.agencyId === currentEmployerCompanyId).length})
                </button>
              </div>
            </div>

            {visaSubTab === 'general' ? (
              <div className="space-y-6">
                <div className="overflow-x-auto border border-slate-150 rounded-2xl shadow-sm text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-black">
                        <th className="p-3">আবেদনকারী</th>
                        <th className="p-3">নিয়োগের পদ</th>
                        <th className="p-3">বর্তমান ওয়ার্ক ভিসা ধাপ</th>
                        <th className="p-3">ধাপের বিবরণ ও স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {visaProcessList.map((cand) => {
                        const statusPercents = {
                          'Offer Letter': 'w-1/5 bg-blue-500',
                          'Visa Permit': 'w-2/5 bg-indigo-500',
                          'Embassy Stamping': 'w-3/5 bg-purple-500',
                          'BMET Card': 'w-4/5 bg-teal-500',
                          'Flight Ready': 'w-full bg-emerald-500'
                        };
                        return (
                          <tr key={cand.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-3 font-bold text-slate-800">{cand.candidateName}</td>
                            <td className="p-3 text-slate-500 font-light">{cand.jobTitle}</td>
                            <td className="p-3">
                              <div className="space-y-1">
                                <span className="text-[9.5px] font-black text-blue-600 block uppercase">{cand.status}</span>
                                <div className="w-24 bg-slate-100 rounded-full h-1">
                                  <div className={`h-1 rounded-full ${statusPercents[cand.status as keyof typeof statusPercents] || 'w-0'}`}></div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-[10.5px] text-slate-400 font-normal leading-normal">{cand.statusDetail}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Document upload / Status advancer */}
                <form onSubmit={handleVisaUpdateSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4 text-xs font-semibold text-slate-700">
                  <h4 className="text-[10.5px] font-black uppercase text-slate-500 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-emerald-500" /> অফার লেটার ও ওয়ার্ক পারমিট আপলোড করে স্ট্যাটাস অগ্রগতি করুন
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-500">প্রার্থী নির্বাচন করুন</label>
                      <select value={selectedVisaId} onChange={(e) => setSelectedVisaId(e.target.value)} className="w-full p-2 bg-white border border-slate-250 rounded-xl">
                        <option value="">-- প্রার্থী নির্বাচন --</option>
                        {visaProcessList.map(v => (
                          <option key={v.id} value={v.id}>{v.candidateName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500">ডকুমেন্ট প্রকার</label>
                      <select value={visaDocType} onChange={(e) => setVisaDocType(e.target.value as any)} className="w-full p-2 bg-white border border-slate-250 rounded-xl">
                        <option value="offer">অফার লেটার (Offer Letter)</option>
                        <option value="permit">ওয়ার্ক পারমিট (Visa Permit)</option>
                        <option value="contract">চুক্তিপত্র (Employment Contract)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500">আপলোড ফাইলপাথ</label>
                      <input type="text" placeholder="যেমন: Stamp_Permit_Ariful.pdf" value={visaDocName} onChange={(e) => setVisaDocName(e.target.value)} className="w-full p-2 bg-white border border-slate-250 rounded-xl font-mono text-[11px]" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl transition shadow">
                      আপলোড ও ভেরিফাই করুন
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Italy Special Package: Contract Payment & Document Verification Module */
              (() => {
                const agencyPkgs = (italyPackages || []).filter(p => p.agencyId === currentEmployerCompanyId);

                const filteredAgencyPkgs = agencyPkgs.filter(pkg => {
                  const matchSearch = !searchCandidate || 
                    pkg.candidateName.toLowerCase().includes(searchCandidate.toLowerCase()) ||
                    pkg.passportNumber.toLowerCase().includes(searchCandidate.toLowerCase()) ||
                    (pkg.contractNumber && pkg.contractNumber.toLowerCase().includes(searchCandidate.toLowerCase()));

                  const matchCountry = filterCountry === 'all' || pkg.country === filterCountry;
                  
                  const matchStatus = filterStatus === 'all' || pkg.status === filterStatus;
                  
                  let matchPayment = true;
                  if (filterPayment === 'Paid' || filterPayment === 'paid') {
                    matchPayment = (pkg.dueAmount || 0) <= 0;
                  } else if (filterPayment === 'Due' || filterPayment === 'due') {
                    matchPayment = (pkg.dueAmount || 0) > 0;
                  } else if (filterPayment === 'Unpaid' || filterPayment === 'unpaid') {
                    matchPayment = (pkg.paidAmount || 0) === 0;
                  }
                  
                  return matchSearch && matchCountry && matchStatus && matchPayment;
                });

                return (
                  <div className="space-y-6">
                    {/* Agency Role KPI Dashboard Statistics */}
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl shadow-sm text-center">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">মোট চুক্তি (Contracts)</span>
                    <strong className="text-lg font-black text-slate-800">
                      {agencyPkgs.length} জন
                    </strong>
                  </div>
                  <div className="bg-indigo-50/50 border border-indigo-500/10 p-3.5 rounded-2xl shadow-sm text-center">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-wider block">চুক্তির মোট মূল্য (Total Value)</span>
                    <strong className="text-base font-black text-indigo-700">
                      ৳{agencyPkgs.reduce((sum, p) => sum + (p.totalAmount || 0), 0).toLocaleString()}
                    </strong>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-500/10 p-3.5 rounded-2xl shadow-sm text-center">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">মোট সংগৃহীত (Total Paid)</span>
                    <strong className="text-base font-black text-emerald-700">
                      ৳{agencyPkgs.reduce((sum, p) => sum + (p.paidAmount || 0), 0).toLocaleString()}
                    </strong>
                  </div>
                  <div className="bg-rose-50/50 border border-rose-500/10 p-3.5 rounded-2xl shadow-sm text-center">
                    <span className="text-[9px] font-black text-rose-600 uppercase tracking-wider block">মোট বকেয়া (Total Due)</span>
                    <strong className="text-base font-black text-rose-700">
                      ৳{agencyPkgs.reduce((sum, p) => sum + (p.dueAmount || 0), 0).toLocaleString()}
                    </strong>
                  </div>
                  <div className="bg-amber-50/50 border border-amber-500/10 p-3.5 rounded-2xl shadow-sm text-center">
                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider block">অনুমোদন পেন্ডিং</span>
                    <strong className="text-lg font-black text-amber-700">
                      {agencyPkgs.filter(p => p.status === 'Pending').length} জন
                    </strong>
                  </div>
                  <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-2xl shadow-sm text-center">
                    <span className="text-[9px] font-black text-sky-600 uppercase tracking-wider block">অনুমোদিত চুক্তি</span>
                    <strong className="text-lg font-black text-sky-700">
                      {agencyPkgs.filter(p => p.status === 'Approved').length} জন
                    </strong>
                  </div>
                </div>

                {/* Quick Actions & Export Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingPkg(!isCreatingPkg)}
                      className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-black transition flex items-center gap-1.5 shadow"
                    >
                      {isCreatingPkg ? '✕ ফর্ম বন্ধ করুন' : '➕ নতুন কন্ট্রাক্ট তৈরি করুন (Create Contract)'}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">রিপোর্ট ডাউনলোড:</span>
                    <button
                      type="button"
                      onClick={() => {
                        // PDF Print Report
                        const printWindow = window.open("", "_blank");
                        if (!printWindow) {
                          alert("পপ-আপ উইন্ডো ব্লক করা হয়েছে। অনুগ্রহ করে পপ-আপ অনুমোদন করুন।");
                          return;
                        }
                        let html = `
                          <html>
                            <head>
                              <title>Agency Contract Payment & Verification Report</title>
                              <style>
                                body { font-family: 'Helvetica', sans-serif; padding: 25px; color: #1e293b; }
                                h1 { text-align: center; color: #0f172a; margin-bottom: 5px; font-size: 20px; }
                                p { text-align: center; font-size: 11px; color: #64748b; margin-top: 0; }
                                table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
                                th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
                                th { background-color: #f8fafc; font-weight: bold; }
                                tr:nth-child(even) { background-color: #fbfcfe; }
                                .summary-box { display: flex; justify-content: space-around; background: #f8fafc; padding: 15px; border: 1px dashed #cbd5e1; border-radius: 12px; margin-top: 30px; font-weight: bold; font-size: 12px; }
                              </style>
                            </head>
                            <body>
                              <h1>বিশেষ চুক্তি ও পেমেন্ট যাচাইকরণ রিপোর্ট</h1>
                              <p>এজেন্সি আইডি: ${currentEmployerCompanyId} • জেনারেট তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
                              <table>
                                <thead>
                                  <tr>
                                    <th>প্রার্থীর নাম ও ইমেইল</th>
                                    <th>পাসপোর্ট নং</th>
                                    <th>প্যাকেজ</th>
                                    <th>কন্ট্রাক্ট নং</th>
                                    <th>টোটাল বাজেট</th>
                                    <th>পরিশোধিত</th>
                                    <th>বকেয়া</th>
                                    <th>চুক্তির স্ট্যাটাস</th>
                                  </tr>
                                </thead>
                                <tbody>
                        `;
                        agencyPkgs.forEach(p => {
                          html += `
                            <tr>
                              <td><strong>${p.candidateName}</strong><br>${p.candidateEmail}</td>
                              <td>${p.passportNumber}</td>
                              <td>${p.packageName}</td>
                              <td>${p.contractNumber || 'N/A'}</td>
                              <td>৳${(p.totalAmount || 0).toLocaleString()}</td>
                              <td>৳${(p.paidAmount || 0).toLocaleString()}</td>
                              <td>৳${(p.dueAmount || 0).toLocaleString()}</td>
                              <td>${p.contractStatus || 'Active'} (${p.status})</td>
                            </tr>
                          `;
                        });
                        html += `
                                </tbody>
                              </table>
                              <div class="summary-box">
                                <div>মোট প্রার্থী: ${agencyPkgs.length} জন</div>
                                <div>মোট চুক্তির মূল্য: ৳${agencyPkgs.reduce((s, p) => s + (p.totalAmount || 0), 0).toLocaleString()}</div>
                                <div>মোট পরিশোধিত: ৳${agencyPkgs.reduce((s, p) => s + (p.paidAmount || 0), 0).toLocaleString()}</div>
                                <div>মোট বকেয়া: ৳${agencyPkgs.reduce((s, p) => s + (p.dueAmount || 0), 0).toLocaleString()}</div>
                              </div>
                              <script>
                                window.onload = function() { window.print(); window.close(); }
                              </script>
                            </body>
                          </html>
                        `;
                        printWindow.document.write(html);
                        printWindow.document.close();
                      }}
                      className="py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-[10px] font-black transition flex items-center gap-1"
                    >
                      📄 Export PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Excel/CSV Exporter
                        let csvContent = "data:text/csv;charset=utf-8,";
                        csvContent += "Candidate Name,Email,Phone,Passport Number,Company,Country,Job Position,Salary,Contract Number,Total Contract Amount,Paid,Due,Contract Status,Verification Status\n";
                        agencyPkgs.forEach(p => {
                          csvContent += `"${p.candidateName}","${p.candidateEmail}","${p.candidatePhone}","${p.passportNumber}","${p.company || ''}","${p.country || ''}","${p.jobPosition || ''}","${p.salary || ''}","${p.contractNumber || ''}",${p.totalAmount || 0},${p.paidAmount || 0},${p.dueAmount || 0},"${p.contractStatus || 'Active'}","${p.status}"\n`;
                        });
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `Agency_Contracts_Report_${Date.now()}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        alert("এজেন্সি কন্ট্রাক্ট রিপোর্ট Excel/CSV সফলভাবে ডাউনলোড হয়েছে!");
                      }}
                      className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-black transition flex items-center gap-1"
                    >
                      📊 Export Excel
                    </button>
                  </div>
                </div>

                {/* Create Contract Package Form */}
                {isCreatingPkg && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!candName || !candPassport || !candEmail || !candPhone) {
                        alert("দয়া করে প্রার্থীর নাম, পাসপোর্ট, ইমেইল এবং মোবাইল নাম্বার প্রদান করুন।");
                        return;
                      }
                      
                      // Calculate Recruitment Payment Workflow Totals
                      const employerTotal = feeVisaProcessing + feeMedical + feeAgencyService + feeEmbassy + feeInsurance + feeBmet + feeAirTicket + feeOtherCharges;
                      const grandTotal = employerTotal + feeAdminCommission;
                      
                      // Generate default timeline
                      const appliedDate = new Date().toISOString().split('T')[0];
                      const newTimeline = [
                        { key: 'registration', label: 'Registration', status: 'Approved' as const, date: appliedDate },
                        { key: 'offer_letter', label: 'Offer Letter', status: 'Pending' as const },
                        { key: 'contract_uploaded', label: 'Contract Uploaded', status: 'Pending' as const },
                        { key: 'admin_verify', label: 'Admin Verification', status: 'Pending' as const },
                        { key: 'work_permit', label: 'Work Permit', status: 'Pending' as const },
                        { key: 'mofa', label: 'MOFA', status: 'Pending' as const },
                        { key: 'invitation_letter', label: 'Invitation Letter', status: 'Pending' as const },
                        { key: 'visa_submission', label: 'Visa Submission', status: 'Pending' as const },
                        { key: 'visa_approved', label: 'Visa Approved', status: 'Pending' as const },
                        { key: 'visa_printed', label: 'Visa Printed', status: 'Pending' as const },
                        { key: 'air_ticket', label: 'Air Ticket', status: 'Pending' as const },
                        { key: 'departure', label: 'Departure', status: 'Pending' as const },
                        { key: 'arrived', label: 'Arrived', status: 'Pending' as const }
                      ];

                      // Form unique ID
                      const newId = `it_pkg_agency_${Date.now()}`;
                      const newContractNo = candContractNum || `CON-2026-${Math.floor(Math.random() * 90000 + 10000)}`;

                      const newPkg: ItalyPackageApplication = {
                        id: newId,
                        packageName: candPkgName,
                        candidateName: candName,
                        candidateEmail: candEmail,
                        candidatePhone: candPhone,
                        passportNumber: candPassport,
                        status: 'Pending',
                        appliedAt: appliedDate,
                        notes: candNotes || 'নতুন প্রসেসিং চুক্তি সফলভাবে তৈরি করা হয়েছে।',
                        priceAmount: `৳${grandTotal.toLocaleString()}`,
                        agencyId: currentEmployerCompanyId,
                        commission: feeAdminCommission,
                        contractStatus: 'Pending',
                        company: candCompany,
                        country: candCountry,
                        jobPosition: candJob,
                        salary: candSalary,
                        contractNumber: newContractNo,
                        
                        // Fees Set
                        registrationFee: feeRegistration,
                        offerLetterFee: feeOfferLetter,
                        workPermitFee: feeWorkPermit,
                        mofaFee: feeMofa,
                        invitationLetterFee: feeInvitation,
                        
                        // Granular Recruitment fields
                        visaProcessingFee: feeVisaProcessing,
                        medicalFee: feeMedical,
                        agencyServiceFee: feeAgencyService,
                        embassyFee: feeEmbassy,
                        insuranceFee: feeInsurance,
                        bmetFee: feeBmet,
                        airTicketFee: feeAirTicket,
                        otherCharges: feeOtherCharges,
                        adminCommission: feeAdminCommission,
                        employerTotal: employerTotal,
                        grandTotal: grandTotal,
                        paymentPlanStatus: 'Pending Admin Review',

                        totalAmount: grandTotal,
                        paidAmount: 0,
                        dueAmount: grandTotal,
                        paymentHistory: [],

                        // Bank Info (Defaults to pending employer details)
                        bankDetails: {
                          bankName: 'City Bank PLC',
                          accountName: 'Euro Bangla Manpower Services Ltd.',
                          accountNumber: '1102938475001',
                          branch: 'Gulshan Branch, Dhaka',
                          routingNumber: '220150153',
                          swiftCode: 'CIBKBDDH',
                          bkashMerchant: '01700998877',
                          nagadMerchant: '01700998877',
                          rocketNumber: '01700998877-3',
                          status: 'Pending',
                          approvedBy: 'N/A',
                          qrCode: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=150'
                        },

                        auditLogs: [
                          { id: 'log_init_' + newId, action: 'Payment Workflow Initialized', user: 'Employer', timestamp: appliedDate, details: 'Employer submitted initial cost structure for verification.' }
                        ],
                        
                        // Documents Verification Initial Set
                        documents: {
                          offerLetter: { status: 'Pending', fileUrl: 'italy_offer_letter.pdf' },
                          employmentContract: { status: 'Pending', fileUrl: 'italy_employment_contract.pdf' },
                          workPermit: { status: 'Pending', fileUrl: 'italy_work_permit.pdf' },
                          passportCopy: { status: 'Approved', fileUrl: 'candidate_passport_scan.pdf' },
                          visaDocuments: { status: 'Pending', fileUrl: 'visa_document_scan.pdf' },
                          paymentReceipts: { status: 'Pending', fileUrl: 'payment_receipt_copy.png' }
                        },
                        timeline: newTimeline
                      };

                      onUpdateItalyPackage?.(newPkg);
                      alert(`সফলভাবে প্রার্থীর কন্ট্রাক্ট প্যাকেজ তৈরি করা হয়েছে!\nকন্ট্রাক্ট নাম্বার: ${newContractNo}\nমোট চুক্তির মূল্য: ৳${grandTotal.toLocaleString()}\n(এডমিন কমিশনের জন্য পেন্ডিং রিভিউতে পাঠানো হয়েছে)`);
                      
                      // Clear forms
                      setCandName('');
                      setCandEmail('');
                      setCandPhone('');
                      setCandPassport('');
                      setCandContractNum('');
                      setCandNotes('');
                      setIsCreatingPkg(false);
                    }}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-xs text-slate-700 font-semibold"
                  >
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                        📝 নতুন ক্যান্ডিডেট কন্ট্রাক্ট প্যাকেজ তৈরি করুন
                      </h4>
                      <p className="text-[10.5px] text-slate-400 font-normal mt-0.5">
                        প্রার্থীর মূল বিবরণ এবং ভিসা প্রসেসের ৯টি ধাপের জন্য আলাদা ফি (Payment Plan) নির্ধারণ করুন।
                      </p>
                    </div>

                    {/* Search & Auto-fill from Existing Registered Candidates */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/85 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                          <Search className="w-3.5 h-3.5" /> নিবন্ধিত প্রার্থী অনুসন্ধান ও অটো-ফিল (Registered Candidate Search & Autofill)
                        </span>
                        {autofillSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setAutofillSearchQuery('')}
                            className="text-[10px] text-rose-500 font-bold hover:underline cursor-pointer"
                          >
                            মুছে ফেলুন (Clear)
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={autofillSearchQuery}
                          onChange={(e) => setAutofillSearchQuery(e.target.value)}
                          placeholder="প্রার্থীর নাম অথবা পাসপোর্ট নম্বর লিখে খুঁজুন..."
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                        {autofillSearchQuery && (() => {
                          const matchedApps = applications.filter(app => 
                            (app.candidateName && app.candidateName.toLowerCase().includes(autofillSearchQuery.toLowerCase())) ||
                            (app.passportNumber && app.passportNumber.toLowerCase().includes(autofillSearchQuery.toLowerCase()))
                          );

                          if (matchedApps.length === 0) {
                            return (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-slate-400 text-center font-normal">
                                কোনো নিবন্ধিত প্রার্থী খুঁজে পাওয়া যায়নি।
                              </div>
                            );
                          }

                          return (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100">
                              {matchedApps.map((app) => (
                                <button
                                  key={app.id}
                                  type="button"
                                  onClick={() => {
                                    setCandName(app.candidateName || '');
                                    setCandPassport(app.passportNumber || '');
                                    setCandEmail(app.candidateEmail || '');
                                    setCandPhone(app.candidatePhone || '');
                                    setCandJob(app.jobTitle || 'Construction Worker');
                                    setCandCompany(app.companyName || 'Euro Bangla Manpower Services');
                                    setCandCountry('Italy');
                                    setAutofillSearchQuery('');
                                    alert(`🎉 প্রার্থীর তথ্য লোড হয়েছে:\nনাম: ${app.candidateName}\nপাসপোর্ট নম্বর: ${app.passportNumber}`);
                                  }}
                                  className="w-full text-left p-3 hover:bg-slate-50 transition flex justify-between items-center cursor-pointer"
                                >
                                  <div>
                                    <p className="font-bold text-slate-800">{app.candidateName}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">ইমেইল: {app.candidateEmail} • মোবাইল: {app.candidatePhone}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 px-2.5 py-1 rounded-lg text-[9.5px] font-mono font-bold block">
                                      {app.passportNumber}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-medium block mt-0.5">{app.jobTitle}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Candidate Info Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">প্রার্থীর নাম (Candidate Name) *</label>
                        <input
                          type="text"
                          required
                          value={candName}
                          onChange={(e) => setCandName(e.target.value)}
                          placeholder="আরিফুল ইসলাম"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">পাসপোর্ট নম্বর (Passport Number) *</label>
                        <input
                          type="text"
                          required
                          value={candPassport}
                          onChange={(e) => setCandPassport(e.target.value)}
                          placeholder="e.g. EH0987654"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">ক্যান্ডিডেট ইমেইল (Email) *</label>
                        <input
                          type="email"
                          required
                          value={candEmail}
                          onChange={(e) => setCandEmail(e.target.value)}
                          placeholder="ariful@example.com"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">মোবাইল নম্বর (Phone) *</label>
                        <input
                          type="text"
                          required
                          value={candPhone}
                          onChange={(e) => setCandPhone(e.target.value)}
                          placeholder="e.g. 01712345678"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">নিয়োগকারী প্রতিষ্ঠান (Employer Company)</label>
                        <input
                          type="text"
                          value={candCompany}
                          onChange={(e) => setCandCompany(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">দেশ (Country)</label>
                        <input
                          type="text"
                          value={candCountry}
                          onChange={(e) => setCandCountry(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">পদবী (Job Position)</label>
                        <input
                          type="text"
                          value={candJob}
                          onChange={(e) => setCandJob(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">মাসিক বেতন (Salary Package)</label>
                        <input
                          type="text"
                          value={candSalary}
                          onChange={(e) => setCandSalary(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">চুক্তি নাম্বার (Contract No.) [ঐচ্ছিক]</label>
                        <input
                          type="text"
                          value={candContractNum}
                          onChange={(e) => setCandContractNum(e.target.value)}
                          placeholder="ফাঁকা রাখলে অটো জেনারেট হবে"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">প্যাকেজের প্রকার (Package Tier)</label>
                        <select
                          value={candPkgName}
                          onChange={(e) => setCandPkgName(e.target.value as any)}
                          className="w-full p-2.5 bg-white border border-slate-250 rounded-xl"
                        >
                          <option value="Premium">Premium Package</option>
                          <option value="Standard">Standard Package</option>
                          <option value="Basic">Basic Package</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">অতিরিক্ত নোট / বিবরণ</label>
                        <input
                          type="text"
                          value={candNotes}
                          onChange={(e) => setCandNotes(e.target.value)}
                          placeholder="যেমন: রোমে কন্সট্রাকশন প্রজেক্ট..."
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Payment Plan Layout Step by Step Fees */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div className="border-b border-slate-200 pb-2 flex flex-wrap items-center justify-between gap-2">
                        <h5 className="text-[11px] font-black uppercase text-indigo-600 flex items-center gap-1.5">
                          <span>💰 Recruitment Payment Workflow (নিয়োগ খরচ নির্ধারণ করুন)</span>
                        </h5>
                        <div className="flex gap-4 text-xs font-mono">
                          <span className="text-slate-500">
                            নিয়োগকর্তা বাজেট: <strong className="text-slate-800">৳{(feeVisaProcessing + feeMedical + feeAgencyService + feeEmbassy + feeInsurance + feeBmet + feeAirTicket + feeOtherCharges).toLocaleString()}</strong>
                          </span>
                          <span className="text-indigo-600">
                            এডমিন কমিশন: <strong className="text-indigo-700">৳{feeAdminCommission.toLocaleString()}</strong>
                          </span>
                          <span className="text-emerald-600 font-bold">
                            মোট চুক্তির মূল্য: <strong className="text-emerald-700">৳{(feeVisaProcessing + feeMedical + feeAgencyService + feeEmbassy + feeInsurance + feeBmet + feeAirTicket + feeOtherCharges + feeAdminCommission).toLocaleString()}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Granular Employer Cost Fields */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                        <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
                          <label className="text-slate-400 text-[9px] block font-extrabold uppercase">1. Visa Processing Fee</label>
                          <input
                            type="number"
                            value={feeVisaProcessing}
                            onChange={(e) => setFeeVisaProcessing(Number(e.target.value))}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs"
                          />
                        </div>
                        <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
                          <label className="text-slate-400 text-[9px] block font-extrabold uppercase">2. Medical Fee</label>
                          <input
                            type="number"
                            value={feeMedical}
                            onChange={(e) => setFeeMedical(Number(e.target.value))}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs"
                          />
                        </div>
                        <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
                          <label className="text-slate-400 text-[9px] block font-extrabold uppercase">3. Agency Service Fee</label>
                          <input
                            type="number"
                            value={feeAgencyService}
                            onChange={(e) => setFeeAgencyService(Number(e.target.value))}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs"
                          />
                        </div>
                        <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
                          <label className="text-slate-400 text-[9px] block font-extrabold uppercase">4. Embassy Fee</label>
                          <input
                            type="number"
                            value={feeEmbassy}
                            onChange={(e) => setFeeEmbassy(Number(e.target.value))}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs"
                          />
                        </div>
                        <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
                          <label className="text-slate-400 text-[9px] block font-extrabold uppercase">5. Insurance Fee</label>
                          <input
                            type="number"
                            value={feeInsurance}
                            onChange={(e) => setFeeInsurance(Number(e.target.value))}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs"
                          />
                        </div>
                        <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
                          <label className="text-slate-400 text-[9px] block font-extrabold uppercase">6. BMET Fee</label>
                          <input
                            type="number"
                            value={feeBmet}
                            onChange={(e) => setFeeBmet(Number(e.target.value))}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs"
                          />
                        </div>
                        <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
                          <label className="text-slate-400 text-[9px] block font-extrabold uppercase">7. Air Ticket Fee</label>
                          <input
                            type="number"
                            value={feeAirTicket}
                            onChange={(e) => setFeeAirTicket(Number(e.target.value))}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs"
                          />
                        </div>
                        <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
                          <label className="text-slate-400 text-[9px] block font-extrabold uppercase">8. Other Charges</label>
                          <input
                            type="number"
                            value={feeOtherCharges}
                            onChange={(e) => setFeeOtherCharges(Number(e.target.value))}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs"
                          />
                        </div>
                      </div>

                      {/* Admin Commission Settings & Installments Preview */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                        <div className="md:col-span-4 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-200/60 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-extrabold text-indigo-700 uppercase">🛡️ Admin Commission</span>
                            <span className="text-[9px] bg-indigo-200/70 text-indigo-800 px-1.5 py-0.5 rounded-md font-bold">Auto Added</span>
                          </div>
                          <input
                            type="number"
                            value={feeAdminCommission}
                            onChange={(e) => setFeeAdminCommission(Number(e.target.value))}
                            className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-indigo-800 font-mono font-black text-sm"
                          />
                          <p className="text-[9.5px] text-slate-400 font-normal leading-relaxed">
                            নিয়োগ খরচের সাথে এই কমিশন ফি যোগ করে চাকরিপ্রার্থীর মোট চুক্তিমূল্য (Grand Total) তৈরি হবে।
                          </p>
                        </div>

                        <div className="md:col-span-8 bg-emerald-50/20 p-3.5 rounded-xl border border-emerald-500/10 grid grid-cols-4 gap-2.5">
                          {(() => {
                            const empTotal = feeVisaProcessing + feeMedical + feeAgencyService + feeEmbassy + feeInsurance + feeBmet + feeAirTicket + feeOtherCharges;
                            const grTotal = empTotal + feeAdminCommission;
                            const inst1 = Math.round(grTotal * 0.26315);
                            const inst2 = Math.round(grTotal * 0.10526);
                            const inst3 = Math.round(grTotal * 0.21052);
                            const inst4 = grTotal - inst1 - inst2 - inst3;

                            return (
                              <>
                                <div className="col-span-4 border-b border-emerald-500/10 pb-1.5">
                                  <span className="text-[9.5px] font-extrabold text-emerald-700 uppercase block tracking-wider">
                                    📋 Candidate Payment Plan Preview (চাকরিপ্রার্থীর ৪টি কিস্তি বিবরণী)
                                  </span>
                                </div>
                                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                                  <span className="text-[8.5px] text-slate-400 block font-bold">১ম কিস্তি (26.3%)</span>
                                  <strong className="text-[11px] font-mono text-slate-700 block">৳{inst1.toLocaleString()}</strong>
                                  <span className="text-[7.5px] text-indigo-600 block">রেজিস্ট্রেশন</span>
                                </div>
                                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                                  <span className="text-[8.5px] text-slate-400 block font-bold">২য় কিস্তি (10.5%)</span>
                                  <strong className="text-[11px] font-mono text-slate-700 block">৳{inst2.toLocaleString()}</strong>
                                  <span className="text-[7.5px] text-indigo-600 block">মেডিকেল</span>
                                </div>
                                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                                  <span className="text-[8.5px] text-slate-400 block font-bold">৩য় কিস্তি (21.1%)</span>
                                  <strong className="text-[11px] font-mono text-slate-700 block">৳{inst3.toLocaleString()}</strong>
                                  <span className="text-[7.5px] text-indigo-600 block">এম্বেসি ক্লিয়ারেন্স</span>
                                </div>
                                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                                  <span className="text-[8.5px] text-slate-400 block font-bold">৪র্থ কিস্তি (অবশিষ্ট)</span>
                                  <strong className="text-[11px] font-mono text-slate-700 block">৳{inst4.toLocaleString()}</strong>
                                  <span className="text-[7.5px] text-indigo-600 block">ফ্লাইট টিকিট</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingPkg(false)}
                        className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                      >
                        বাতিল করুন
                      </button>
                      <button
                        type="submit"
                        className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl transition shadow"
                      >
                        ✓ কন্ট্রাক্ট সংরক্ষণ ও সাবমিট করুন
                      </button>
                    </div>
                  </form>
                )}

                {/* Filters & Search Panel */}
                <div className="p-4 rounded-3xl bg-white border border-slate-200/80 grid grid-cols-1 sm:grid-cols-4 gap-3.5 text-xs">
                  <div className="space-y-1 col-span-1 sm:col-span-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[8px] block">🔍 প্রার্থী / পাসপোর্ট খুঁজুন</label>
                    <input
                      type="text"
                      value={searchCandidate}
                      onChange={(e) => setSearchCandidate(e.target.value)}
                      placeholder="নাম বা পাসপোর্ট নম্বর দিন..."
                      className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[8px] block">🌍 গন্তব্য দেশ (Country)</label>
                    <select
                      value={filterCountry}
                      onChange={(e) => setFilterCountry(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-700"
                    >
                      <option value="all">সব দেশ (All Countries)</option>
                      <option value="italy">ইতালি (Italy)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[8px] block">⚡ চুক্তির অবস্থা (Contract Status)</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-700"
                    >
                      <option value="all">সব অবস্থা (All Tiers)</option>
                      <option value="pending">পেন্ডিং (Pending)</option>
                      <option value="active">সক্রিয় (Active)</option>
                      <option value="completed">সম্পন্ন (Completed)</option>
                      <option value="terminated">বাতিলকৃত (Terminated)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[8px] block">💳 পেমেন্ট স্ট্যাটাস (Payment State)</label>
                    <select
                      value={filterPayment}
                      onChange={(e) => setFilterPayment(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-700"
                    >
                      <option value="all">সব পেমেন্ট (All payments)</option>
                      <option value="paid">পরিশোধিত (Fully Paid)</option>
                      <option value="due">বকেয়া আছে (Dues Outstanding)</option>
                    </select>
                  </div>
                </div>

                {/* Table for assigned Candidates */}
                <div className="overflow-x-auto border border-slate-150 rounded-2xl shadow-sm text-xs bg-white animate-fade-in">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-black">
                        <th className="p-3">প্রার্থী বিবরণ</th>
                        <th className="p-3">পাসপোর্ট ও কন্ট্রাক্ট নং</th>
                        <th className="p-3">কোম্পানি ও পদবী</th>
                        <th className="p-3">প্যাকেজ ও চুক্তির মূল্য</th>
                        <th className="p-3 text-center">অগ্রগতি (Timeline)</th>
                        <th className="p-3 text-center">পরিশোধ ও বকেয়া</th>
                        <th className="p-3">চুক্তির অবস্থা</th>
                        <th className="p-3 text-center">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {filteredAgencyPkgs.length > 0 ? (
                        filteredAgencyPkgs.map((pkg) => {
                          const completedCount = pkg.visaSteps?.filter(s => s.status === 'Completed').length || 0;
                          const progressPct = Math.round((completedCount / 9) * 100);
                          
                          return (
                            <tr key={pkg.id} className="hover:bg-slate-50/30 transition text-[11px]">
                              <td className="p-3">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-slate-800 text-xs">{pkg.candidateName}</p>
                                  <p className="text-[9.5px] text-slate-400 font-normal">{pkg.candidateEmail}</p>
                                  <p className="text-[9.5px] text-slate-400 font-mono">{pkg.candidatePhone}</p>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="space-y-0.5 font-mono text-[10.5px]">
                                  <p className="font-bold text-slate-700">🛂 {pkg.passportNumber}</p>
                                  <p className="text-[9px] text-slate-400">📄 {pkg.contractNumber || 'N/A'}</p>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="space-y-0.5 text-[10.5px]">
                                  <p className="font-bold text-slate-800 truncate max-w-[130px]">{pkg.company || 'ইতালি স্পেশাল নিয়োগকর্তা'}</p>
                                  <p className="text-slate-500 font-normal">{pkg.jobPosition || 'Construction Mason'}</p>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="space-y-0.5">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                    pkg.packageName === 'Premium' ? 'bg-amber-100 text-amber-800' :
                                    pkg.packageName === 'Standard' ? 'bg-blue-100 text-blue-800' :
                                    'bg-slate-100 text-slate-700'
                                  }`}>
                                    {pkg.packageName}
                                  </span>
                                  <p className="text-[10px] text-emerald-600 font-bold mt-1">
                                    মূল্য: ৳{(pkg.totalAmount || 150000).toLocaleString()}
                                  </p>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                <div className="inline-flex flex-col items-center gap-1 w-full max-w-[100px]">
                                  <span className="text-[10px] font-black text-indigo-600">{progressPct}% ({completedCount}/9)</span>
                                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div className="h-1.5 bg-indigo-600 rounded-full" style={{ width: `${progressPct}%` }}></div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                <div className="space-y-1 text-center font-mono">
                                  <p className="text-[10px] text-slate-700 font-bold">পরিশোধ: <span className="text-emerald-600">৳{(pkg.paidAmount || 0).toLocaleString()}</span></p>
                                  <p className="text-[9.5px] text-rose-500 font-bold">বকেয়া: ৳{(pkg.dueAmount || 0).toLocaleString()}</p>
                                </div>
                              </td>
                              <td className="p-3">
                                <select
                                  value={pkg.contractStatus || 'Active'}
                                  onChange={(e) => {
                                    const nextVal = e.target.value as any;
                                    onUpdateItalyPackage?.({ ...pkg, contractStatus: nextVal });
                                    alert(`চুক্তির স্ট্যাটাস পরিবর্তন করে '${nextVal}' করা হয়েছে!`);
                                  }}
                                  className="p-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700 outline-none"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Active">Active</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Terminated">Terminated</option>
                                </select>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => setSelectedItPkgDetail(pkg)}
                                  className="py-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-black transition flex items-center justify-center gap-1 mx-auto"
                                >
                                  <Eye className="w-3 h-3 text-emerald-400" /> ট্র্যাকার
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                            অনুসন্ধান ও ফিল্টারিং শর্ত অনুযায়ী কোনো চুক্তিপত্র পাওয়া যায়নি।
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
                );
              })()
            )}
          </div>
        )}

        {/* TAB 8: MESSAGES */}
        {employerTab === 'messages' && (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row h-[500px] animate-fade-in text-xs">
            
            {/* Left selector */}
            <div className="w-full md:w-64 border-r border-slate-200 flex flex-col bg-slate-50 shrink-0">
              <div className="p-3.5 border-b bg-white space-y-2">
                <span className="text-[9.5px] font-black text-slate-400 uppercase block tracking-wider">বার্তালাপ চ্যানেল</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'applicants', label: 'প্রার্থী চ্যাট' },
                    { id: 'admin', label: 'এডমিন' },
                    { id: 'staff', label: 'পরিদর্শক' }
                  ].map(chan => (
                    <button 
                      key={chan.id} 
                      onClick={() => setChatChannel(chan.id as any)} 
                      className={`p-1.5 text-[9.5px] font-black rounded-lg transition ${
                        chatChannel === chan.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {chan.label}
                    </button>
                  ))}
                </div>
              </div>

              {chatChannel === 'applicants' ? (
                <div className="overflow-y-auto flex-1 divide-y divide-slate-100 font-semibold text-slate-700">
                  {activeCompanyApplications.map((app) => {
                    const isSelected = activeChatCandidateId === app.id;
                    return (
                      <div 
                        key={app.id} 
                        onClick={() => setActiveChatCandidateId(app.id)}
                        className={`p-3 flex items-center gap-2 cursor-pointer transition ${
                          isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-100 bg-white'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-200 border flex items-center justify-center font-bold text-slate-700 select-none shrink-0">
                          {app.candidateName.charAt(0)}
                        </div>
                        <div className="truncate flex-1 space-y-0.5 leading-none">
                          <h4 className="font-extrabold text-slate-800 truncate">{app.candidateName}</h4>
                          <span className="text-[9px] text-slate-400 font-light truncate block">{app.jobTitle}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-slate-400 font-light text-[10.5px]">
                  <p className="font-bold text-slate-600 mb-1">অফিসিয়াল যোগাযোগ চ্যানেল</p>
                  {chatChannel === 'admin' ? 'প্রবাসী পোর্টাল হেড অফিস সাপোর্ট চ্যাট রুম' : 'ভেরিফিকেশন ফিল্ড এজেন্টস ফিডব্যাক রুম'}
                </div>
              )}
            </div>

            {/* Right chat logs */}
            <div className="flex-1 flex flex-col justify-between bg-slate-50/50">
              {chatChannel === 'applicants' ? (
                activeChatCandidateId ? (
                  <React.Fragment>
                    <div className="bg-white p-3 border-b flex justify-between items-center shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-600 text-xs">👤</span>
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-xs">{activeCompanyApplications.find(a => a.id === activeChatCandidateId)?.candidateName}</h4>
                          <span className="text-[9px] text-emerald-500 font-bold block">● অনলাইন (Simulated)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                      <div className="bg-white p-3 rounded-2xl border text-slate-600 max-w-xs leading-normal">
                        আসসালামু আলাইকুম স্যার, আমি ড্রাইভিং পদের জন্য আবেদন করেছি। আমার আকামা আছে এবং রিয়াদের ৫ বছরের এক্সপেরিয়েন্স আছে।
                      </div>
                    </div>

                    <div className="p-3 bg-white border-t flex gap-2">
                      <input 
                        type="text" 
                        placeholder="বার্তাটি বাংলায় লিখুন..." 
                        value={chatInputText} 
                        onChange={(e) => setChatInputText(e.target.value)} 
                        className="flex-1 p-2 border rounded-xl"
                      />
                      <button onClick={() => handleSendMessage(activeChatCandidateId)} className="px-4 py-2 bg-blue-600 text-white font-extrabold rounded-xl">পাঠান</button>
                    </div>
                  </React.Fragment>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <MessageSquare className="w-10 h-10 text-slate-300 mb-1" />
                    <h4 className="font-bold text-slate-700">লাইভ চ্যাট সিমুলেটর</h4>
                    <p className="text-[10px] text-slate-400">বাম দিকের তালিকা থেকে ক্যান্ডিডেট নির্বাচন করে বার্তালাপ করুন।</p>
                  </div>
                )
              ) : (
                <React.Fragment>
                  <div className="bg-white p-3 border-b shrink-0 font-bold text-slate-800">
                    {chatChannel === 'admin' ? '👮 এডমিন অফিশিয়াল সাপোর্ট ইনবক্স' : '👷 মাঠ পরিদর্শন স্টাফ চ্যাট'}
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 font-semibold">
                    {(chatChannel === 'admin' ? adminMessages : staffMessages).map((m, idx) => (
                      <div key={idx} className={`flex flex-col ${m.sender === 'agency' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-xs leading-normal ${
                          m.sender === 'agency' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[8.5px] text-slate-400 font-light mt-0.5">{m.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-white border-t flex gap-2">
                    <input 
                      type="text" 
                      placeholder="অফিসিয়াল চ্যাট মেসেজ..." 
                      value={customMsgText} 
                      onChange={(e) => setCustomMsgText(e.target.value)} 
                      className="flex-1 p-2 border rounded-xl"
                    />
                    <button onClick={handleSendCustomMessage} className="px-4 py-2 bg-blue-600 text-white font-extrabold rounded-xl">পাঠান</button>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        )}

        {/* TAB 9: INTERVIEW MANAGEMENT */}
        {employerTab === 'interview' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in text-xs font-semibold text-slate-700">
            <div className="border-b pb-3.5">
              <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                <Video className="w-4.5 h-4.5 text-blue-600" /> ইন্টারভিউ শিডিউলার ও রেজাল্ট ক্যালেন্ডার
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">শর্টলিস্টেড প্রার্থীদের সাথে অনলাইন জুম মিটিং বা সরাসরি অফিসে ইন্টারভিউ শিডিউল করুন।</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form (Left) */}
              <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4 bg-slate-50 p-4 rounded-2xl border">
                <span className="text-[10.5px] font-black text-slate-500 block uppercase">নতুন ইন্টারভিউ শিডিউল</span>
                <div className="space-y-1">
                  <label className="text-slate-500">প্রার্থী নাম</label>
                  <input type="text" required placeholder="যেমন: আরিফুল ইসলাম" value={newIntCandName} onChange={(e) => setNewIntCandName(e.target.value)} className="w-full p-2 bg-white border rounded-xl" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500">পদের নাম</label>
                  <input type="text" required placeholder="যেমন: Heavy Truck Driver" value={newIntJobTitle} onChange={(e) => setNewIntJobTitle(e.target.value)} className="w-full p-2 bg-white border rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-500">তারিখ</label>
                    <input type="date" value={newIntDateVal} onChange={(e) => setNewIntDateVal(e.target.value)} className="w-full p-2 bg-white border rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500">সময়</label>
                    <input type="text" value={newIntTimeVal} onChange={(e) => setNewIntTimeVal(e.target.value)} className="w-full p-2 bg-white border rounded-xl font-mono" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500">পদ্ধতি</label>
                  <select value={newIntMethodVal} onChange={(e) => setNewIntMethodVal(e.target.value)} className="w-full p-2 bg-white border rounded-xl">
                    <option value="Online Zoom">অনলাইন জুম মিটিং (Online Zoom)</option>
                    <option value="Online Google Meet">গুগল মিট (Google Meet)</option>
                    <option value="In-Person HQ">হেড অফিস সরাসরি (In-Person HQ)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500">বিশেষ নোট</label>
                  <textarea rows={2} value={newIntNotesVal} onChange={(e) => setNewIntNotesVal(e.target.value)} className="w-full p-2 bg-white border rounded-xl" />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition">
                  শিডিউল নির্ধারণ করুন
                </button>
              </form>

              {/* Table list (Right) */}
              <div className="lg:col-span-2 space-y-4">
                <span className="text-[10.5px] font-black text-slate-500 block uppercase">আগামী নির্ধারিত ইন্টারভিউ তালিকা</span>
                <div className="space-y-3">
                  {scheduledInterviews.map((item) => (
                    <div key={item.id} className="p-3.5 bg-white border border-slate-150 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between gap-3 text-xs leading-normal">
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-extrabold text-slate-800 text-[13px]">{item.candidateName}</h4>
                          <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg border border-blue-100 font-black">{item.method}</span>
                        </div>
                        <p className="text-slate-400 font-light">পদের নাম: <span className="font-bold text-slate-600">{item.jobTitle}</span></p>
                        <p className="text-slate-400 font-light flex items-center gap-1">📅 {item.date} • 🕒 {item.time}</p>
                        {item.notes && <p className="text-[10.5px] text-slate-400 italic">নোট: {item.notes}</p>}
                      </div>
                      <div className="flex flex-col justify-between items-end gap-2 shrink-0">
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer" className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold rounded-lg shrink-0 transition">
                            মিটিং জয়েন
                          </a>
                        )}
                        <select 
                          value={item.status} 
                          onChange={(e) => {
                            setScheduledInterviews(scheduledInterviews.map(i => i.id === item.id ? { ...i, status: e.target.value } : i));
                          }}
                          className="p-1 bg-slate-50 border rounded-lg font-bold text-[9.5px]"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Passed">Passed (নির্বাচিত)</option>
                          <option value="Failed">Failed (বাতিল)</option>
                        </select>

                        {item.status === 'Passed' && !item.isPushed && (
                          <button
                            type="button"
                            onClick={() => {
                              const passportNum = prompt(`"${item.candidateName}" এর জন্য পাসপোর্ট নম্বর প্রদান করুন:`);
                              if (passportNum && passportNum.trim()) {
                                handlePushCandidateToWorkflow(undefined, {
                                  name: item.candidateName,
                                  job: item.jobTitle,
                                  passport: passportNum,
                                  result: 'Passed',
                                  interviewId: item.id
                                });
                              } else if (passportNum !== null) {
                                alert('পাসপোর্ট নম্বর প্রদান করা আবশ্যক!');
                              }
                            }}
                            className="mt-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-[10px] transition-colors flex items-center gap-1 cursor-pointer shadow-sm animate-pulse"
                          >
                            🚀 প্রগতি পুশ করুন
                          </button>
                        )}
                        {item.isPushed && (
                          <span className="mt-1.5 text-[9.5px] text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                            ✓ পুশড (Pushed)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* INTERVIEW RESULT SUBMISSION & WORKFLOW PUSH FORM */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mt-6 space-y-4">
              <div className="border-b border-slate-150 pb-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    📝 ম্যানুয়াল ইন্টারভিউ রেজাল্ট ও পাসপোর্ট ওয়ার্কফ্লো প্রগতি পুশ
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    সরাসরি ইন্টারভিউয়ের ফলাফল নথিভুক্ত করুন এবং প্রার্থীকে চুক্তি ও ভিসা প্রসেস ড্যাশবোর্ডে পুশ করুন।
                  </p>
                </div>
                <span className="bg-blue-50 border border-blue-150 text-blue-700 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase">
                  ইমিগ্রেশন রেডি
                </span>
              </div>

              <form onSubmit={handlePushCandidateToWorkflow} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-500 block">প্রার্থীর নাম (Candidate Name) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মাসুম বিল্লাহ"
                    value={pushCandName}
                    onChange={(e) => setPushCandName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 block">পাসপোর্ট নম্বর (Passport Number) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: EE0987654"
                    value={pushCandPassport}
                    onChange={(e) => setPushCandPassport(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 block">নিয়োগের পদবী (Job Position) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: Heavy Truck Driver"
                    value={pushCandJob}
                    onChange={(e) => setPushCandJob(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 block">ইমেইল (Email - ঐচ্ছিক)</label>
                  <input
                    type="email"
                    placeholder="যেমন: masum@example.com"
                    value={pushCandEmail}
                    onChange={(e) => setPushCandEmail(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 block">মোবাইল নম্বর (Phone - ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="যেমন: 01712345678"
                    value={pushCandPhone}
                    onChange={(e) => setPushCandPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 block">ইন্টারভিউ রেজাল্ট (Interview Result)</label>
                  <select
                    value={pushCandResult}
                    onChange={(e) => setPushCandResult(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="Passed">Passed (নির্বাচিত / উত্তীর্ণ)</option>
                    <option value="Failed">Failed (বাতিল / অনুত্তীর্ণ)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 block">পাসপোর্ট প্রসেস প্যাকেজ (Package Tier)</label>
                  <select
                    value={pushCandPkgType}
                    onChange={(e) => setPushCandPkgType(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="Basic">Basic Package</option>
                    <option value="Standard">Standard Package</option>
                    <option value="Premium">Premium Package</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 block">গন্তব্য দেশ (Country)</label>
                  <select
                    value={pushCandCountry}
                    onChange={(e) => setPushCandCountry(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="Italy">ইতালি (Italy)</option>
                    <option value="Romania">রোমানিয়া (Romania)</option>
                    <option value="Saudi Arabia">সৌদি আরব (Saudi Arabia)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 block">চুক্তির মূল্য (Chukti Contract Price)</label>
                  <input
                    type="number"
                    value={pushCandPrice}
                    onChange={(e) => setPushCandPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="col-span-1 md:col-span-3 flex justify-end pt-2">
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    ✓ সাবমিট ও ওয়ার্কফ্লোতে পুশ করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB: AGENT BANK ACCOUNTS & RBAC */}
        {employerTab === 'agent_bank_accounts' && (
          <AgentBankAccountManager
            currentEmployerCompanyId={currentEmployerCompanyId}
            companies={companies}
            bankAccounts={bankAccounts}
            clientPayments={clientPayments}
            onAddAgentBankAccount={onAddAgentBankAccount}
            onUpdateAgentBankAccount={onUpdateAgentBankAccount}
            onDeleteAgentBankAccount={onDeleteAgentBankAccount}
            onConfirmClientPaymentByAgent={onConfirmClientPaymentByAgent}
          />
        )}

        {/* TAB 10: PAYMENTS */}
        {employerTab === 'payments' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in text-xs font-semibold text-slate-700">
            <div className="border-b pb-3.5">
              <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                <CreditCard className="w-4.5 h-4.5 text-blue-600" /> পেমেন্ট খতিয়ান ও সাবস্ক্রিপশন বিলিং
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">আপনার এজেন্সির বুস্ট সার্কুলার চার্জ ও মেম্বারশিপ লেজারসমূহ।</p>
            </div>

            {/* Plan display card */}
            <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl relative overflow-hidden shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                <div className="space-y-1">
                  <span className="bg-white text-blue-900 font-black text-[9px] px-2 py-0.5 rounded uppercase">PREMIUM RECRUITER PRO</span>
                  <h4 className="text-sm font-black">জিজিসি প্রিমিয়াম মেম্বারশিপ সক্রিয়</h4>
                  <p className="text-[10.5px] text-blue-100 font-light">৩০ জুন, ২০২৭ তারিখে রিনিউ করতে হবে। সার্কুলার বুস্টিং কোটা বাকি: ১০টি।</p>
                </div>
                <button onClick={() => alert('রিক্রুটার লাইসেন্স প্যাক রিনিউ প্রসেস চলমান...')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl transition shadow text-xs">
                  মেম্বারশিপ রিনিউ / আপগ্রেড
                </button>
              </div>
            </div>

            {/* Pricing cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Basic Recruiter', price: '৳০ (ফ্রি)', desc: '৩টি চাকরি সার্কুলার, বেসিক স্ক্রিনিং' },
                { name: 'Standard Recruiter', price: '৳৫,০০০/মাস', desc: '৮টি সার্কুলার, হোয়াটসঅ্যাপ নোটিফিকেশন' },
                { name: 'Premium Recruiter Pro', price: '৳১২,০০০/মাস', desc: 'সীমাহীন সার্কুলার, BMET প্রিমিয়াম বুস্ট', active: true }
              ].map((p, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${p.active ? 'border-blue-500 bg-blue-50/20' : 'border-slate-150'} space-y-2`}>
                  <p className="text-[10px] font-bold text-slate-500">{p.name}</p>
                  <p className="text-base font-black text-slate-800">{p.price}</p>
                  <p className="text-[10px] text-slate-400 font-light leading-normal">{p.desc}</p>
                  {p.active && <span className="inline-block bg-blue-600 text-white text-[8px] px-2 py-0.5 rounded font-black uppercase">সক্রিয় প্ল্যান</span>}
                </div>
              ))}
            </div>

            {/* Candidate Contact Pack purchasing block */}
            <div className="bg-[#0B1329] border border-slate-800 rounded-3xl p-5 space-y-4 text-slate-200">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                    🔑 ক্যান্ডিডেট কন্টাক্ট প্যাক হাব (Candidate Contact Packs)
                  </h4>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    প্রবাসী প্রার্থীদের সরাসরি মোবাইল নম্বর, ইমেইল এবং পূর্ণাঙ্গ বায়োডাটা সিভি আনলক করার ক্রেডিট সংগ্রহ।
                  </p>
                </div>
                <div className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10.5px] font-black">
                  বর্তমান কন্টাক্ট ব্যালেন্স: {contactCredits} ক্রেডিট
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'silver', name: '🥈 সিলভার কন্টাক্ট প্যাক', credits: 5, price: 2000, desc: 'ছোট এজেন্সির জন্য উপযোগী। ৫ জন প্রার্থীর ফোন/ইমেইল ও সিভি আনলক কোটা।' },
                  { id: 'gold', name: '🥇 গোল্ড কন্টাক্ট প্যাক', credits: 15, price: 5000, desc: 'মাঝারি এজেন্সির প্রিয় পছন্দ। ১৫ জন প্রার্থীর ডাটা আনলক কোটা।', popular: true },
                  { id: 'diamond', name: '💎 ডায়মন্ড কন্টাক্ট প্যাক', credits: 40, price: 10000, desc: 'বড় ও সক্রিয় এজেন্সির জন্য। ৪০ জন প্রার্থীর সরাসরি কন্টাক্ট ডাটা আনলক কোটা।' }
                ].map((pack) => (
                  <div 
                    key={pack.id} 
                    className={`p-4 bg-[#111A2E] border rounded-2xl flex flex-col justify-between gap-3 relative ${
                      pack.popular ? 'border-amber-500/80 shadow-inner' : 'border-slate-800'
                    }`}
                  >
                    {pack.popular && (
                      <span className="absolute -top-2.5 right-4 bg-amber-500 text-slate-950 text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                        POPULAR
                      </span>
                    )}
                    <div className="space-y-1.5">
                      <h5 className="font-extrabold text-white text-[11px]">{pack.name}</h5>
                      <p className="text-[10.5px] font-light text-slate-400 leading-relaxed">{pack.desc}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-black">
                          +{pack.credits} Credits
                        </span>
                        <span className="text-xs font-black text-slate-200">
                          ৳{pack.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const mthd = prompt('পেমেন্ট গেটওয়ে নির্বাচন করুন (bKash, Nagad, Rocket):', 'bKash');
                        if (!mthd) return;
                        const tx = prompt(`${mthd} এ ৳${pack.price} প্রেরণ করে ট্রানজেকশন আইডি (TxID) প্রদান করুন (যেমন: TRX102837):`, 'TRX' + Math.floor(Math.random() * 900000 + 100000));
                        if (tx) {
                          setContactCredits(prev => prev + pack.credits);
                          alert(`পেমেন্ট সফল হয়েছে!\n${pack.name} সফলভাবে ক্রয় করা হয়েছে।\n can আনলক করতে আপনার অ্যাকাউন্টে ${pack.credits} কন্টাক্ট ক্রেডিট যুক্ত হয়েছে।\nবর্তমান ব্যালেন্স: ${contactCredits + pack.credits} ক্রেডিট।`);
                        }
                      }}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-[10px] font-black rounded-xl transition mt-1"
                    >
                      💳 প্যাকটি কিনুন
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions Table */}
            <div className="space-y-2.5">
              <span className="text-[10.5px] font-black text-slate-500 block uppercase">পেমেন্ট লেজার ও ইনভয়েস</span>
              <div className="overflow-x-auto border border-slate-150 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-black">
                      <th className="p-3">তারিখ</th>
                      <th className="p-3">লেনদেন আইডি</th>
                      <th className="p-3">বিবরণ</th>
                      <th className="p-3">পদ্ধতি</th>
                      <th className="p-3">পরিমাণ</th>
                      <th className="p-3 text-right">ডাউনলোড</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {[
                      { date: '২০২৬-০৬-২৫', txid: 'BKX9918273E', desc: 'Premium Recruiter Membership', method: 'bKash', amount: '৳১২,০০০' },
                      { date: '২০২৬-০৬-২০', txid: 'NGD1123419C', desc: 'Truck Driver Circular Boost Charge', method: 'Nagad', amount: '৳৫,০০০' }
                    ].map((tx, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="p-3 font-light text-slate-400">{tx.date}</td>
                        <td className="p-3 font-mono text-[10px] text-slate-500">{tx.txid}</td>
                        <td className="p-3 font-bold text-slate-800">{tx.desc}</td>
                        <td className="p-3 font-light text-slate-400">{tx.method}</td>
                        <td className="p-3 font-black text-slate-800">{tx.amount}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => alert(`ডাউনলোড সম্পন্ন: invoice-${tx.txid}.pdf`)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] transition">
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CV SCREENING & APPLICANT MANAGEMENT */}
        {employerTab === 'cv_screening' && (
          <CandidateCvScreeningTab
            applications={applications}
            jobs={jobs}
          />
        )}

        {/* TAB 12: AGENT BANK ACCOUNTS & RBAC MANAGEMENT */}
        {employerTab === 'agent_bank_accounts' && (
          <AgentBankAccountManager
            currentEmployerCompanyId={currentEmployerCompanyId}
            companies={companies}
            bankAccounts={bankAccounts}
            clientPayments={clientPayments}
            onAddAgentBankAccount={onAddAgentBankAccount}
            onUpdateAgentBankAccount={onUpdateAgentBankAccount}
            onDeleteAgentBankAccount={onDeleteAgentBankAccount}
            onConfirmClientPaymentByAgent={onConfirmClientPaymentByAgent}
          />
        )}
        {employerTab === 'reports' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in text-xs font-semibold text-slate-700">
            <div className="border-b pb-3.5 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                  <BarChart2 className="w-4.5 h-4.5 text-blue-600" /> এজেন্সির নিয়োগ ও পারফরম্যান্স রিপোর্ট
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">বিজ্ঞাপনের ক্লিক, সিভি ডাউনলোডের মাসিক পরিসংখ্যান ও বিশ্লেষণ কেন্দ্র।</p>
              </div>

              <select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value as any)} 
                className="p-1.5 bg-slate-50 border rounded-xl font-bold"
              >
                <option value="job">বিজ্ঞাপন ক্লিক রিপোর্ট</option>
                <option value="demographics">ডেমোগ্রাফিক সিভি রিপোর্ট</option>
                <option value="visa">ভিসা প্রসেস টাইমিং রিপোর্ট</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {[
                { title: 'মোট সার্কুলার ভিউ', val: '১২,৪৫০ বার', desc: 'বিগত ৩০ দিনে ১৫% বৃদ্ধি' },
                { title: 'গড় সিভি স্ক্রিনিং সময়', val: '২.৪ দিন', desc: 'বিগত মাসের চেয়ে দ্রুততর' },
                { title: 'ভিসা এপ্রুভাল সাকসেস', val: '৯৮.৫%', desc: 'সর্বমোট ১০৩ জন বিদেশগামী' }
              ].map((r, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-1">
                  <p className="text-[10px] font-bold text-slate-400">{r.title}</p>
                  <p className="text-lg font-black text-slate-800">{r.val}</p>
                  <p className="text-[9.5px] text-slate-400 font-light">{r.desc}</p>
                </div>
              ))}
            </div>

            {/* Dynamic Report Content based on selector */}
            <div className="p-5 border border-dashed border-slate-200 rounded-3xl space-y-3 bg-slate-50/20">
              {reportType === 'job' && (
                <div className="space-y-2">
                  <span className="text-[10.5px] font-black text-slate-600 block uppercase">পদের ক্যাটাগরিভিত্তিক ক্যান্ডিডেট ইন্টারঅ্যাকশন</span>
                  <div className="space-y-3 pt-2">
                    {[
                      { name: 'Driving & Logistics (ভারী চালক)', val: '৪,৫০০ বার ক্লিক', bar: 'w-4/5 bg-emerald-500' },
                      { name: 'Hospitality & Culinary (শেফ ও বাবুর্চি)', val: '২,৮০০ বার ক্লিক', bar: 'w-3/5 bg-blue-500' },
                      { name: 'Garments & Textile (দর্জি ও মেকার)', val: '১,২০০ বার ক্লিক', bar: 'w-1/4 bg-amber-500' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[10.5px]">
                          <span className="font-bold text-slate-700">{item.name}</span>
                          <span className="text-slate-400">{item.val}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                          <div className={`h-2 rounded-full ${item.bar}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reportType === 'demographics' && (
                <div className="space-y-2">
                  <span className="text-[10.5px] font-black text-slate-600 block uppercase">আবেদনকারীদের শিক্ষাগত যোগ্যতা ও কাজের মেয়াদ বিন্যাস</span>
                  <div className="grid grid-cols-2 gap-4 pt-2 font-medium">
                    <div className="p-3 bg-white border rounded-2xl space-y-1.5">
                      <p className="text-[10px] text-slate-400 font-bold border-b pb-1">শিক্ষাগত যোগ্যতা বিন্যাস</p>
                      <p>• SSC / সমমান - ৬০%</p>
                      <p>• HSC / ডিপ্লোমা - ৩০%</p>
                      <p>• অনার্স ও তদুর্ধ - ১০%</p>
                    </div>
                    <div className="p-3 bg-white border rounded-2xl space-y-1.5">
                      <p className="text-[10px] text-slate-400 font-bold border-b pb-1">বিদেশে কাজের অভিজ্ঞতা</p>
                      <p>• পূর্ব অভিজ্ঞতা নেই - ৪৫%</p>
                      <p>• ১ থেকে ৩ বছর - ৩৫%</p>
                      <p>• জিসিসি (GCC) অভিজ্ঞ - ২০%</p>
                    </div>
                  </div>
                </div>
              )}

              {reportType === 'visa' && (
                <div className="space-y-2">
                  <span className="text-[10.5px] font-black text-slate-600 block uppercase">মেডিকেল ফিটনেস থেকে ফ্লাইট দিন গণনা গড় (Lead Time)</span>
                  <div className="space-y-2 pt-2">
                    {[
                      { step: 'মেডিকেল ভেরিফিকেশন সম্পন্ন', duration: 'গড় ৩ দিন' },
                      { step: 'এম্বেসি ভিসা স্ট্যাম্পিং সময়কাল', duration: 'গড় ৭ দিন' },
                      { step: 'BMET ওয়ান-স্টপ ইমিগ্রেশন কার্ড প্রস্তুত', duration: 'গড় ৪ দিন' }
                    ].map((l, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-white border rounded-xl">
                        <span>{l.step}</span>
                        <span className="font-bold text-slate-700">{l.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button 
                onClick={() => alert('আপনার এজেন্সির পূর্ণাঙ্গ নিয়োগ পারফরম্যান্স রিপোর্ট স্প্রেডশিট ডাউনলোড সম্পন্ন হয়েছে।')}
                className="py-2 px-4 bg-slate-900 hover:bg-slate-950 text-white font-extrabold rounded-xl transition"
              >
                পিডিএফ রিপোর্ট ডাউনলোড করুন
              </button>
            </div>
          </div>
        )}

        {/* TAB 12: REVIEWS & RATINGS */}
        {employerTab === 'reviews' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in text-xs font-semibold text-slate-700">
            <div className="border-b pb-3.5">
              <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                <Star className="w-4.5 h-4.5 text-blue-600" /> কোম্পানির রিভিউ, রেটিং ও ক্যান্ডিডেট ফিডব্যাক
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">আপনার রিক্রুটিং এজেন্সির অফিস এবং প্রক্রিয়াকরণ নিয়ে বিদেশগামী কর্মীদের সত্যিকারের মতামত।</p>
            </div>

            {/* Scorecard banner */}
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2.5xl flex items-center gap-4">
              <div className="text-3xl font-black text-slate-800 shrink-0">৪.৮ <span className="text-sm font-normal text-slate-400">/ ৫</span></div>
              <div className="space-y-0.5 leading-normal">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <p className="text-[10px] text-slate-400 font-light">সর্বমোট ১৪২ জন চাকরিপ্রার্থী এবং কর্মী জিজিসি এজেন্সির ওপর রিভিউ দিয়েছেন।</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { id: 'REV-01', name: 'জহিরুল ইসলাম', job: 'Professional General Cook', date: '২০২৬-০৬-২৫', rating: '★★★★★', text: 'অনেক এজেন্সির মতো তারা অযথা বিলম্ব করেনি। অফার লেটার পাওয়ার পর ৭ দিনের মধ্যে রিয়াদের ওয়ার্ক পারমিট এনে দিয়েছে।' },
                { id: 'REV-02', name: 'মাসুম বিল্লাহ', job: 'CNC Machine Operator', date: '২০২৬-০৭-০১', rating: '★★★★☆', text: 'তাদের চট্টগ্রামের শাখার কার্যালয়ে সশরীরে সাক্ষাৎকার দেওয়ার ব্যবস্থা খুব চমৎকার। প্রবাসীদের সম্মান করে কথা বলেন।' }
              ].map((rev) => (
                <div key={rev.id} className="p-4 bg-white border border-slate-200 rounded-2.5xl space-y-3 transition hover:shadow-sm">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-extrabold text-slate-800">{rev.name}</h4>
                      <p className="text-[9.5px] text-slate-400 font-light">পদের নাম: <span className="font-bold text-slate-600">{rev.job}</span> • {rev.date}</p>
                    </div>
                    <span className="text-amber-400 font-mono tracking-wider">{rev.rating}</span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed italic">"{rev.text}"</p>

                  {/* Reply Log */}
                  {reviewReplies[rev.id] && (
                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-[10.5px] leading-relaxed text-blue-900 mt-2">
                      <span className="font-black">↩️ আপনার অফিসিয়াল এজেন্সি রেসপন্স:</span>
                      <p className="font-medium text-slate-700 mt-0.5">{reviewReplies[rev.id]}</p>
                    </div>
                  )}

                  {/* Add Reply Input */}
                  {!reviewReplies[rev.id] && (
                    <div className="flex gap-2.5 pt-2 border-t">
                      <input 
                        type="text" 
                        placeholder="আপনার অফিসিয়াল এজেন্সি উত্তর পোস্ট করুন..." 
                        value={tempReplyText[rev.id] || ''} 
                        onChange={(e) => setTempReplyText({ ...tempReplyText, [rev.id]: e.target.value })} 
                        className="flex-1 p-2 bg-slate-50 border rounded-xl focus:bg-white text-xs"
                      />
                      <button 
                        onClick={() => handleAddReviewReply(rev.id)}
                        className="px-4 py-2 bg-slate-900 text-white font-extrabold rounded-xl text-[10px]"
                      >
                        উত্তর দিন
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 13: SETTINGS */}
        {employerTab === 'settings' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in text-xs font-semibold text-slate-700">
            <div className="border-b pb-3.5">
              <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                <Lock className="w-4.5 h-4.5 text-blue-600" /> এজেন্সি অ্যাডমিন সেটিংস ও নিরাপত্তা সেন্টার
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">আপনার অ্যাকাউন্ট অ্যাক্সেস নিরাপত্তা, পাসওয়ার্ড আপডেট এবং ২-ফ্যাক্টর সক্রিয়করণ প্যানেল।</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Notification Toggles (Left) */}
              <div className="space-y-4 bg-slate-50 p-4 border rounded-2xl">
                <span className="text-[10.5px] font-black text-slate-500 block uppercase">ভাষা ও নোটিফিকেশন সেটিংস</span>
                <div className="space-y-3 font-semibold text-slate-700">
                  <div className="flex justify-between items-center">
                    <label>এসএমএস অ্যালার্ট (নতুন আবেদন)</label>
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label>ইমেইল নোটিফিকেশন (সাপ্তাহিক রিপোর্ট)</label>
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label>হোয়াটসঅ্যাপ চ্যাট নোটিফিকেশন</label>
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                  </div>
                </div>

                {/* 2FA block */}
                <div className="border-t pt-4 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">দ্বি-স্তর বিশিষ্ট নিরাপত্তা (2FA)</p>
                      <p className="text-[9.5px] text-slate-400 font-light mt-0.5 leading-normal">লগইনের সময় ফোনে ওটিপি কোড বাধ্যতামূলক করে একাউন্ট সুরক্ষিত রাখুন।</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleToggle2FA} 
                      className={`px-3 py-1.5 font-extrabold text-[10px] rounded-lg border transition ${
                        twoFactorEnabled ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}
                    >
                      {twoFactorEnabled ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                    </button>
                  </div>

                  {/* 2FA activation mockup QR */}
                  {is2FASetupActive && (
                    <form onSubmit={handleConfirm2FA} className="p-3 bg-white border border-slate-200 rounded-xl space-y-3">
                      <p className="text-[9.5px] text-slate-400 font-medium">নিচের কিউআর কোডটি আপনার Google Authenticator অ্যাপ দিয়ে স্ক্যান করুন এবং ৬ সংখ্যার কোডটি দিন।</p>
                      <div className="flex justify-center p-2 bg-slate-50 rounded-lg w-28 mx-auto border select-none">
                        {/* Mock QR */}
                        <div className="w-24 h-24 bg-slate-900 border-4 border-white flex flex-wrap justify-between p-1.5 rounded shadow">
                          <div className="w-5 h-5 bg-white rounded-sm"></div>
                          <div className="w-5 h-5 bg-white rounded-sm"></div>
                          <div className="w-full flex justify-between">
                            <div className="w-3 h-3 bg-white rounded-sm"></div>
                            <div className="w-3 h-3 bg-white rounded-sm"></div>
                          </div>
                          <p className="text-[6px] text-white font-mono tracking-tighter w-full text-center mt-1 select-none">2FA SECURE KEY</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <input 
                          type="text" 
                          placeholder="৬ সংখ্যার কোড (যেমন: ১২৩৪৫৬)" 
                          maxLength={6}
                          value={twoFactorCodeInput} 
                          onChange={(e) => setTwoFactorCodeInput(e.target.value)} 
                          className="w-full p-2 bg-slate-50 border rounded-lg text-center font-mono text-[13px] tracking-widest font-black" 
                        />
                      </div>
                      <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-lg">
                        ওটিপি কোড দিয়ে সক্রিয় করুন
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Password change (Right) */}
              <form onSubmit={(e) => { e.preventDefault(); alert('পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!'); setOldPassword(''); setNewPassword(''); }} className="space-y-3.5 bg-slate-50 p-4 border rounded-2xl">
                <span className="text-[10.5px] font-black text-slate-500 block uppercase">পাসওয়ার্ড পরিবর্তন করুন</span>
                <div className="space-y-1">
                  <label className="text-slate-500">পূর্বের পাসওয়ার্ড (Old Password)</label>
                  <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-2 bg-white border rounded-xl" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500">নতুন পাসওয়ার্ড (New Password)</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 bg-white border rounded-xl" />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition">
                  পাসওয়ার্ড আপডেট করুন
                </button>

                <div className="border-t pt-3 space-y-1 leading-normal font-light text-slate-400 text-[10px]">
                  <p className="font-bold text-slate-600">নিরাপত্তা পরামর্শ:</p>
                  <p>• পাসওয়ার্ডে সংখ্যা, বর্ণ ও প্রতীক মিশ্রণ ব্যবহার করুন।</p>
                  <p>• অন্য কোনো সেবায় ব্যবহৃত পাসওয়ার্ড বর্জন করুন।</p>
                </div>
              </form>
            </div>

            {/* Login history logs */}
            <div className="border-t pt-4 space-y-3">
              <span className="text-[10.5px] font-black text-slate-500 block uppercase">সাম্প্রতিক লগইন হিস্ট্রি ও অ্যাক্টিভ ডিভাইস</span>
              <div className="overflow-x-auto border border-slate-150 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-black">
                      <th className="p-3">ডিভাইস ও ব্রাউজার</th>
                      <th className="p-3">আইপি ঠিকানা</th>
                      <th className="p-3">লোকেশন</th>
                      <th className="p-3">লগইন সময়</th>
                      <th className="p-3 text-right">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {[
                      { dev: 'Chrome - Windows PC', ip: '103.220.10.45', loc: 'Gulshan, Dhaka, BD', time: 'আজ দুপুর ১২:৪৫' },
                      { dev: 'Safari - iPhone 14', ip: '103.220.12.89', loc: 'GEC Complex, Chittagong, BD', time: 'গতকাল বিকাল ০৪:১৫' }
                    ].map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="p-3 font-bold text-slate-800">{log.dev}</td>
                        <td className="p-3 font-mono text-[10px] text-slate-500">{log.ip}</td>
                        <td className="p-3 font-light text-slate-400">{log.loc}</td>
                        <td className="p-3 font-light text-slate-400">{log.time}</td>
                        <td className="p-3 text-right">
                          <span className="inline-block bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-lg text-[9px] font-black">ACTIVE</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 14: SUPPORT CENTER */}
        {employerTab === 'support' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in text-xs font-semibold text-slate-700">
            <div className="border-b pb-3.5">
              <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                <LifeBuoy className="w-4.5 h-4.5 text-blue-600" /> নিয়োগকর্তা ও এজেন্সির অফিশিয়াল সহায়তা কেন্দ্র
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">কারিগরি বা লাইসেন্স সমস্যা সমাধানে টিকিট খুলুন এবং নির্দেশিকাগুলো চেক করুন।</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Support ticket submission form */}
              <form onSubmit={handlePostSupportTicket} className="space-y-4 bg-slate-50 p-4 rounded-2xl border">
                <span className="text-[10.5px] font-black text-slate-500 block uppercase">সহায়তার জন্য টিকিট খুলুন</span>
                <div className="space-y-1">
                  <label className="text-slate-500">টিকিটের বিষয়</label>
                  <input type="text" required placeholder="সংক্ষেপে আপনার ইস্যু লিখুন" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} className="w-full p-2 bg-white border rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-500">ক্যাটাগরি</label>
                    <select value={ticketCategory} onChange={(e) => setTicketCategory(e.target.value)} className="w-full p-2 bg-white border rounded-xl">
                      <option value="License verification">লাইসেন্স ভেরিফিকেশন</option>
                      <option value="Payment & Subscription">পেমেন্ট ও বিলিং</option>
                      <option value="Technical Error">টেকনিক্যাল ত্রুটি</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500">অগ্রাধিকার</label>
                    <select value={ticketPriority} onChange={(e) => setTicketPriority(e.target.value)} className="w-full p-2 bg-white border rounded-xl">
                      <option value="High">High (জরুরি)</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500">বিস্তারিত বিবরণী</label>
                  <textarea rows={3} required placeholder="মেইলপ্যাকেট বা লাইসেন্স আপলোড ভুলের বিশদ তথ্য" value={ticketDesc} onChange={(e) => setTicketDesc(e.target.value)} className="w-full p-2 bg-white border rounded-xl" />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition">
                  টিকিট সাবমিট করুন
                </button>
              </form>

              {/* Active tickets logs (Right) */}
              <div className="lg:col-span-2 space-y-4">
                <span className="text-[10.5px] font-black text-slate-500 block uppercase">আপনার খোলা পূর্ববর্তী টিকিটসমূহ</span>
                <div className="overflow-x-auto border border-slate-150 rounded-2xl shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-black">
                        <th className="p-3">টিকিট আইডি</th>
                        <th className="p-3">বিষয়</th>
                        <th className="p-3">অগ্রাধিকার</th>
                        <th className="p-3">তারিখ</th>
                        <th className="p-3 text-right">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {supportTickets.map((tkt) => (
                        <tr key={tkt.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-3 font-mono text-slate-500 text-[10px]">{tkt.id}</td>
                          <td className="p-3 font-bold text-slate-800">{tkt.subject}</td>
                          <td className="p-3 font-light text-slate-400">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${tkt.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>{tkt.priority}</span>
                          </td>
                          <td className="p-3 font-light text-slate-400">{tkt.date}</td>
                          <td className="p-3 text-right">
                            <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-[9px] font-black ${tkt.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                              {tkt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* FAQ Accordions for agencies */}
                <div className="space-y-2.5 mt-4">
                  <span className="text-[10.5px] font-black text-slate-500 block uppercase">রিক্রুটিং এজেন্সি সচরাচর জিজ্ঞাসা (FAQ)</span>
                  {[
                    { q: 'কিভাবে BMET ওয়ান-স্টপ ভেরিফিকেশন সম্পন্ন করব?', a: 'কোম্পানি প্রোফাইল এবং ডকুমেন্টস ট্যাবে গিয়ে আপনার ভ্যালিড ট্রেড লাইসেন্স ও BMET Recruiting License আপলোড করুন। মাঠ পরিদর্শনের পর আপনার স্ট্যাটাস অটোমেটিক ভেরিফাইড দেখাবে।' },
                    { q: 'সার্কুলার বুস্ট চার্জ পরিশোধের নিয়ম কি?', a: 'চাকরি সার্কুলার পোস্টিংয়ের সময় "প্রিমিয়াম বুস্ট প্যাক" টিকমার্ক করলে পেমেন্ট গেটওয়ে প্যানেল ওপেন হবে যেখানে আপনি বিকাশ, নগদ বা রকেটের মাধ্যমে ট্রানজেকশন সম্পন্ন করতে পারবেন।' }
                  ].map((faq, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border rounded-2xl space-y-1">
                      <p className="font-extrabold text-slate-800">❓ {faq.q}</p>
                      <p className="text-slate-500 font-light leading-normal">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

            </div>
          )}

        </div>
      </main>

      {/* MODAL OVERLAY: SELECTED ITALY PACKAGE TRACKER DETAIL */}
      {selectedItPkgDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl h-[85vh] max-h-[640px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col animate-fade-in text-white">
            <VerifiedSystemHub 
              application={selectedItPkgDetail as any} 
              userRole="Employer"
              onUpdateItalyPackage={(updatedPkg) => {
                setSelectedItPkgDetail(updatedPkg);
                onUpdateItalyPackage?.(updatedPkg);
              }}
              onClose={() => setSelectedItPkgDetail(null)} 
              isMobile={false} 
            />
          </div>
        </div>
      )}

    </div>
  );
}

// Compact helper components to avoid linter errors:
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
