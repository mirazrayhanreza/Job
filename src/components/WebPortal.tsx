/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Search, MapPin, DollarSign, Clock, Bookmark, Building,
  TrendingUp, Users, Calendar, ArrowUpRight, Plus, CheckCircle, HelpCircle,
  FileText, Star, CreditCard, Send, ShieldAlert, Sparkles, Filter, Trash2, 
  BookOpen, Info, PhoneCall, ChevronRight, Check, X, ShieldCheck, Upload,
  User, LogOut, LayoutDashboard, MessageSquare, BarChart2, Globe, Edit,
  Lock, Video, Award, LifeBuoy, Shield, ChevronDown, Bell, Key, Camera, Landmark
} from 'lucide-react';
import { Job, Company, Application, Transaction, Notification, ItalyPackageApplication, CATEGORIES, LOCATIONS, COUNTRIES, VISA_TYPES, CompanyReport, BlacklistedItem } from '../mockData';
import VerifiedSystemHub from './VerifiedSystemHub';
import AgencyPanel from './AgencyPanel';
import { PortalUser } from '../types/auth';
import { SeekerDashboardView } from './SeekerDashboardView';
import { CrmWorkflowSection } from './CrmWorkflowSection';
import { ScamAlert, ScamAuditLog, ScamAlertCategory } from '../types/scam';
import { AgentBankAccount, ClientPaymentSubmission, AdminBankSettings, BankAccountStatus, DEFAULT_ADMIN_BANK_SETTINGS } from '../types/bank';
import CandidateBankViewer from './bank/CandidateBankViewer';

interface WebPortalProps {
  jobs: Job[];
  companies: Company[];
  applications: Application[];
  savedJobs: string[];
  currentUserType: 'seeker' | 'employer';
  currentSeekerEmail: string;
  currentEmployerCompanyId: string;
  appliedJobIds: string[];
  notifications: Notification[];
  italyPackages: ItalyPackageApplication[];
  companyReports?: CompanyReport[];
  blacklistItems?: BlacklistedItem[];
  onReportCompany?: (report: Omit<CompanyReport, 'id' | 'status' | 'createdAt'>) => void;
  onToggleUserType: () => void;
  onSetUserType: (type: 'seeker' | 'employer') => void;
  onToggleSaveJob: (id: string) => void;
  onApplyJob: (
    jobId: string, 
    name: string, 
    email: string, 
    phone: string, 
    cvName: string, 
    coverLetter: string,
    passportNumber?: string,
    passportExpiry?: string,
    bmetCardNumber?: string,
    medicalStatus?: 'Fit' | 'Pending' | 'Unfit',
    policeClearance?: 'Verified' | 'Pending' | 'Not Provided',
    skills?: string,
    experience?: string,
    languages?: string,
    photoName?: string
  ) => void;
  onApplyItalyPackage: (
    packageName: 'Basic' | 'Standard' | 'Premium',
    name: string,
    email: string,
    phone: string,
    passportNumber: string,
    message?: string
  ) => void;
  onPostJob: (jobData: Omit<Job, 'id' | 'postedAt' | 'applicationsCount'>, planAmount: number, payMethod: string, txID: string) => void;
  onUpdateApplicationStatus: (appId: string, status: 'Pending' | 'Shortlisted' | 'Rejected', interviewDate?: string) => void;
  onDeleteJob: (jobId: string) => void;
  onMarkNotificationAsRead: (id: string) => void;
  onUpdateJob: (updatedJob: Job) => void;
  onUpdateCompany: (updatedCompany: Company) => void;
  onSetEmployerCompanyId?: (id: string) => void;
  onRegisterCompany?: (newCompany: Company) => void;
  transactions?: Transaction[];
  onAddTransaction?: (tx: Transaction) => void;
  onVerifyTransaction?: (id: string, status: any, remarks?: string, verifiedBy?: string) => void;
  onUpdateItalyPackage?: (updatedPkg: ItalyPackageApplication) => void;
  
  // SECURE AUTH PROPS
  currentUser?: PortalUser | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  onSwitchWorkspace?: (mode: 'portal' | 'admin') => void;

  scamAlerts?: ScamAlert[];
  scamAuditLogs?: ScamAuditLog[];
  onAddScamAlert?: (newAlert: ScamAlert) => void;
  onUpdateScamAlert?: (id: string, updated: Partial<ScamAlert>) => void;
  isAgencyOnly?: boolean;
  onNavigateToAgency?: (route: 'login' | 'dashboard' | null) => void;
  onUpdateApplication?: (updatedApp: Application) => void;

  // BANK SYSTEM PROPS
  bankAccounts?: AgentBankAccount[];
  clientPayments?: ClientPaymentSubmission[];
  adminBankSettings?: AdminBankSettings;
  onSubmitClientPayment?: (payment: Omit<ClientPaymentSubmission, 'id' | 'agentConfirmation' | 'adminVerification' | 'createdAt'>) => void;
  onUpdateAgentBankAccountStatus?: (id: string, status: BankAccountStatus, rejectionReason?: string) => void;
  onUpdateAgentBankAccount?: (id: string, updates: Partial<AgentBankAccount>) => void;
  onAddAgentBankAccount?: (account: Omit<AgentBankAccount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteAgentBankAccount?: (id: string) => void;
  onConfirmClientPaymentByAgent?: (id: string, notes?: string) => void;
}

export default function WebPortal({
  jobs,
  companies,
  applications,
  savedJobs,
  currentUserType,
  currentSeekerEmail,
  currentEmployerCompanyId,
  appliedJobIds,
  notifications,
  italyPackages,
  companyReports = [],
  blacklistItems = [],

  // BANK SYSTEM PROPS
  bankAccounts = [],
  clientPayments = [],
  adminBankSettings = DEFAULT_ADMIN_BANK_SETTINGS,
  onSubmitClientPayment = () => {},
  onUpdateAgentBankAccountStatus = () => {},
  onUpdateAgentBankAccount = () => {},
  onAddAgentBankAccount = () => {},
  onDeleteAgentBankAccount = () => {},
  onConfirmClientPaymentByAgent = () => {},
  onReportCompany,
  onToggleUserType,
  onSetUserType,
  onToggleSaveJob,
  onApplyJob,
  onApplyItalyPackage,
  onPostJob,
  onUpdateApplicationStatus,
  onDeleteJob,
  onMarkNotificationAsRead,
  onUpdateJob,
  onUpdateCompany,
  onSetEmployerCompanyId,
  onRegisterCompany,
  transactions = [],
  onAddTransaction,
  onVerifyTransaction,
  onUpdateItalyPackage,
  currentUser = null,
  onOpenAuthModal = () => {},
  onLogout = () => {},
  onSwitchWorkspace = () => {},
  scamAlerts = [],
  scamAuditLogs = [],
  onAddScamAlert = () => {},
  onUpdateScamAlert = () => {},
  isAgencyOnly = false,
  onNavigateToAgency,
  onUpdateApplication = () => {}
}: WebPortalProps) {
  
  // Navigation
  const [currentPage, setCurrentPage] = useState<'home' | 'jobs' | 'companies' | 'dashboard' | 'about' | 'contact' | 'blog' | 'italy-package' | 'scam-alerts'>('home');

  // Sync to dashboard when isAgencyOnly is true
  useEffect(() => {
    if (isAgencyOnly) {
      setCurrentPage('dashboard');
      onSetUserType('employer');
    }
  }, [isAgencyOnly]);

  // Sync to dashboard when any currentUser is logged in, and reset to home when logged out
  useEffect(() => {
    if (currentUser) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('home');
    }
  }, [currentUser]);

  // Scam Alert Public Tab States
  const [scamSearchQuery, setScamSearchQuery] = useState('');
  const [scamSelectedCategory, setScamSelectedCategory] = useState<'all' | ScamAlertCategory>('all');
  const [scamViewTab, setScamViewTab] = useState<'active' | 'archived'>('active');
  const [selectedScamAlert, setSelectedScamAlert] = useState<ScamAlert | null>(null);
  const [showScamDetailModal, setShowScamDetailModal] = useState(false);

  // Selected details modal
  const [selectedWebJob, setSelectedWebJob] = useState<Job | null>(null);
  const [isApplyingWeb, setIsApplyingWeb] = useState(false);
  const [selectedNotifDetail, setSelectedNotifDetail] = useState<Notification | null>(null);
  const [selectedWebApplicationDetail, setSelectedWebApplicationDetail] = useState<Application | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterType, setFilterType] = useState<string[]>([]);
  const [onlyPremium, setOnlyPremium] = useState(false);

  // Quick Apply states
  const [applicantName, setApplicantName] = useState('আরিফুল ইসলাম (Ariful Islam)');
  const [applicantEmail, setApplicantEmail] = useState('ariful@example.com');
  const [applicantPhone, setApplicantPhone] = useState('01712345678');
  const [applicantCover, setApplicantCover] = useState('আমি সৌদি আরবে ৪ বছর রিয়াদে ট্রেইলার চালিয়েছি। আমার আকামা এবং লাইসেন্স সব বৈধ ছিল। পুনরায় সৌদিতে ভালো কোম্পানিতে কাজ করার জন্য আবেদন করছি।');
  const [uploadedCVName, setUploadedCVName] = useState('Ariful_Islam_Driving_Resume.pdf');
  const [applicantPassportNumber, setApplicantPassportNumber] = useState('EH0987654');
  const [applicantPassportExpiry, setApplicantPassportExpiry] = useState('2031-05-12');

  // Report Company Modal States
  const [reportCompanyObj, setReportCompanyObj] = useState<Company | null>(null);
  const [reportCategory, setReportCategory] = useState<'Fake Job' | 'Fake Visa' | 'Payment Fraud' | 'Scam' | 'Abuse' | 'Other'>('Fake Job');
  const [reportDescription, setReportDescription] = useState('');
  const [reportReporterName, setReportReporterName] = useState('আরিফুল ইসলাম');
  const [reportReporterEmail, setReportReporterEmail] = useState('ariful@example.com');
  const [reportReporterPhone, setReportReporterPhone] = useState('01712345678');
  const [reportEvidenceName, setReportEvidenceName] = useState('');

  // Italy Package apply states
  const [selectedPackageForApply, setSelectedPackageForApply] = useState<'Basic' | 'Standard' | 'Premium' | null>(null);
  const [italyApplyName, setItalyApplyName] = useState('আরিফুল ইসলাম');
  const [italyApplyEmail, setItalyApplyEmail] = useState(currentSeekerEmail || 'ariful@example.com');
  const [italyApplyPhone, setItalyApplyPhone] = useState('01712345678');
  const [italyApplyPassport, setItalyApplyPassport] = useState('EH0987654');
  const [italyApplyMsg, setItalyApplyMsg] = useState('');
  const [italyApplySuccess, setItalyApplySuccess] = useState(false);
  const [applicantBmetNumber, setApplicantBmetNumber] = useState('BMET-2026-44321');
  const [applicantMedicalStatus, setApplicantMedicalStatus] = useState<'Fit' | 'Pending' | 'Unfit'>('Fit');
  const [applicantPoliceClearance, setApplicantPoliceClearance] = useState<'Verified' | 'Pending' | 'Not Provided'>('Verified');
  const [applicantSkills, setApplicantSkills] = useState('Heavy Vehicle Driving, Route Planning, Air Brakes');
  const [applicantExperience, setApplicantExperience] = useState('4 Years in Saudi Arabia, 2 Years in Bangladesh');
  const [applicantLanguages, setApplicantLanguages] = useState('Bangla (Native), Arabic (Conversational)');
  const [uploadedPhotoName, setUploadedPhotoName] = useState('ariful_passport_photo.jpg');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop');

  // New Seeker Profile specific states
  const [applicantDegree, setApplicantDegree] = useState('HSC / Vocational Trade Certificate');
  const [applicantInstitution, setApplicantInstitution] = useState('Barisal Technical School & College');
  const [applicantPassingYear, setApplicantPassingYear] = useState('2018');
  const [applicantGccExp, setApplicantGccExp] = useState('4 Years in Riyadh, Saudi Arabia');
  const [applicantBdExp, setApplicantBdExp] = useState('2 Years in Dhaka (Local)');
  const [applicantPrevCompany, setApplicantPrevCompany] = useState('Al-Adil Transport Group (Heavy Driver)');
  const [additionalExperiences, setAdditionalExperiences] = useState<{ id: string; gccExp: string; bdExp: string; prevCompany: string }[]>([]);
  const [additionalPassports, setAdditionalPassports] = useState<{
    id: string;
    passportNumber: string;
    passportExpiry: string;
    bmetNumber: string;
    medicalStatus: 'Fit' | 'Pending' | 'Unfit';
    policeClearance: 'Verified' | 'Pending' | 'Not Provided';
  }[]>([]);
  const [uploadedPassportCopyName, setUploadedPassportCopyName] = useState('Ariful_Passport_Scan_Page.pdf');
  const [uploadedMedicalReportName, setUploadedMedicalReportName] = useState('GAMCA_Medical_Report_Fit.pdf');
  const [uploadedPoliceClearanceName, setUploadedPoliceClearanceName] = useState('Police_Clearance_Certificate.pdf');
  const [seekerDashboardTab, setSeekerDashboardTab] = useState<'dashboard' | 'profile' | 'italy' | 'documents' | 'messages' | 'settings'>('dashboard');
  const [showWebSaveToast, setShowWebSaveToast] = useState(false);

  // Employer Dashboard sub-tabs and states
  const [employerTab, setEmployerTab] = useState<'dashboard' | 'profile' | 'documents' | 'verification' | 'jobs' | 'applicants' | 'visa' | 'messages' | 'interview' | 'payments' | 'reports' | 'reviews' | 'settings' | 'support'>('dashboard');
  
  // Rich interactive states for new Company Panel features
  const [supportTickets, setSupportTickets] = useState<{ id: string; subject: string; category: string; priority: string; status: string; date: string }[]>([
    { id: 'TKT-8291', subject: 'রিক্রুটিং লাইসেন্স ভ্যালিডেশন ইস্যু', category: 'License verification', priority: 'High', status: 'Resolved', date: '২০২৬-০৬-২৫' },
    { id: 'TKT-9102', subject: 'পেমেন্ট মেথড গেটওয়ে অ্যাক্টিভেশন', category: 'Payment & Subscription', priority: 'Medium', status: 'Open', date: '২০২৬-০৭-০২' }
  ]);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('General Query');
  const [newTicketPriority, setNewTicketPriority] = useState('Medium');
  const [newTicketDesc, setNewTicketDesc] = useState('');

  const [scheduledInterviews, setScheduledInterviews] = useState<{ id: string; candidateName: string; jobTitle: string; date: string; time: string; method: string; link?: string; notes?: string; status: string }[]>([
    { id: 'INT-01', candidateName: 'আরিফুল ইসলাম (Ariful Islam)', jobTitle: 'Professional Heavy Truck Driver', date: '2026-07-10', time: '11:00 AM', method: 'Online Zoom', link: 'https://zoom.us/j/9876543210', notes: 'রিয়াদ ড্রাইভিং লাইসেন্স ভেরিফাই করতে হবে।', status: 'Scheduled' },
    { id: 'INT-02', candidateName: 'মাসুম বিল্লাহ (Masum Billah)', jobTitle: 'CNC Machine Operator', date: '2026-07-12', time: '02:30 PM', method: 'Online Google Meet', link: 'https://meet.google.com/abc-defg-hij', notes: '৩ বছরের ওমান কাজের অভিজ্ঞতা মূল্যায়ন।', status: 'Scheduled' }
  ]);
  const [newIntCandidate, setNewIntCandidate] = useState('');
  const [newIntDate, setNewIntDate] = useState('');
  const [newIntTime, setNewIntTime] = useState('');
  const [newIntMethod, setNewIntMethod] = useState('Online Zoom');
  const [newIntNotes, setNewIntNotes] = useState('');

  const [uploadedDocs, setUploadedDocs] = useState<{ id: string; type: string; name: string; size: string; date: string; status: 'Verified' | 'Pending' | 'Correction' | 'Missing' }[]>([
    { id: 'DOC-01', type: 'Trade License', name: 'Trade_License_2026_Approved.pdf', size: '2.4 MB', date: '২০২৬-০৬-২০', status: 'Verified' },
    { id: 'DOC-02', type: 'Recruiting Agency License', name: 'BMET_Recruiting_License_RL1452.pdf', size: '3.1 MB', date: '২০২৬-০৬-২০', status: 'Verified' },
    { id: 'DOC-03', type: 'Company Registration Certificate', name: 'RJSC_Reg_Cert_GulfCareers.pdf', size: '1.8 MB', date: '২০২৬-০৬-২২', status: 'Verified' },
    { id: 'DOC-04', type: 'Tax/VAT Certificate', name: 'Tax_Tin_Certificate_2026.pdf', size: '950 KB', date: '২০২৬-০৬-২২', status: 'Verified' },
    { id: 'DOC-05', type: 'Owner NID/Passport', name: 'Owner_NID_Scan.pdf', size: '1.2 MB', date: '২০২৬-০৬-২০', status: 'Verified' },
    { id: 'DOC-06', type: 'Office Photos', name: 'Gulshan_Office_Entrance.jpg', size: '4.2 MB', date: '২০২৬-০৬-২৫', status: 'Pending' },
    { id: 'DOC-07', type: 'Authorization Letter', name: 'Draft_Auth_Letter_Sign.pdf', size: '1.1 MB', date: '২০২৬-০৬-২৬', status: 'Correction' }
  ]);

  const [visaProcessList, setVisaProcessList] = useState<{ id: string; candidateName: string; jobTitle: string; status: 'Offer Letter' | 'Visa Permit' | 'Embassy Stamping' | 'BMET Card' | 'Flight Ready'; offerLetterUrl?: string; visaPermitUrl?: string; contractUrl?: string; statusDetail: string }[]>([
    { id: 'VISA-101', candidateName: 'আরিফুল ইসলাম (Ariful Islam)', jobTitle: 'Professional Heavy Truck Driver', status: 'Embassy Stamping', offerLetterUrl: 'Offer_Letter_Ariful.pdf', visaPermitUrl: 'Saudi_Visa_Permit_Ariful.pdf', statusDetail: 'রিয়াদ হাইওয়ে মিনিস্ট্রি পোর্টালে মেডিকেল টেস্ট ফিট রিপোর্ট ও ফিঙ্গারপ্রিন্ট সম্পন্ন করে পাসপোর্ট এম্বেসিতে পাঠানো হয়েছে।' },
    { id: 'VISA-102', candidateName: 'মাসুম বিল্লাহ (Masum Billah)', jobTitle: 'CNC Machine Operator', status: 'Offer Letter', offerLetterUrl: 'Offer_Letter_Masum.pdf', statusDetail: 'কোম্পানি অফার লেটারে প্রার্থী স্বাক্ষর করেছেন। এখন ওয়ার্ক পারমিট প্রসেস চলমান।' }
  ]);
  const [selectedVisaCand, setSelectedVisaCand] = useState('');
  const [visaUploadType, setVisaUploadType] = useState<'offer' | 'permit' | 'contract'>('offer');
  const [visaFileName, setVisaFileName] = useState('');

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [changePassOld, setChangePassOld] = useState('');
  const [changePassNew, setChangePassNew] = useState('');
  
  const [branchOffices, setBranchOffices] = useState<{ id: string; location: string; manager: string; phone: string }[]>([
    { id: 'BR-01', location: 'চট্টগ্রাম শাখা - জিজিসি শপিং কমপ্লেক্স, জিইসি মোড়', manager: 'মাহমুদ আলম', phone: '০১৮১২৩৪৫৬৭৯' },
    { id: 'BR-02', location: 'সিলেট শাখা - কদমতলী পয়েন্ট, বিমানবন্দর রোড', manager: 'মোঃ জহিরুল ইসলাম', phone: '০১৭১১৩৪৫৬৭৮' }
  ]);
  const [newBranchLocation, setNewBranchLocation] = useState('');
  const [newBranchManager, setNewBranchManager] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');

  const [jobsFilter, setJobsFilter] = useState<'All' | 'Active' | 'Draft' | 'Pending' | 'Expired' | 'Rejected' | 'Closed'>('All');
  const [applicantsFilter, setApplicantsFilter] = useState<'All' | 'New' | 'Under Review' | 'Shortlisted' | 'Selected' | 'Rejected' | 'Hired'>('All');
  
  // Job editing states
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingCategory, setEditingCategory] = useState('Driving & Logistics');
  const [editingCountry, setEditingCountry] = useState('Saudi Arabia 🇸🇦');
  const [editingLocation, setEditingLocation] = useState('Riyadh');
  const [editingType, setEditingType] = useState<string>('Company Visa');
  const [editingVisaType, setEditingVisaType] = useState<'Work Visa' | 'Employment Visa' | 'Sponsorship Visa' | 'Resident Visa'>('Work Visa');
  const [editingSalary, setEditingSalary] = useState('৳৭০,০০০ - ৳৯৫,০০০');
  const [editingDeadline, setEditingDeadline] = useState('2026-08-15');
  const [editingDesc, setEditingDesc] = useState('');
  const [editingReqs, setEditingReqs] = useState('');

  // Company Profile states (synced when activeCompanyObj is loaded)
  const [profileCover, setProfileCover] = useState('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop');
  const [profileEstYear, setProfileEstYear] = useState('2015');
  const [profileWebsite, setProfileWebsite] = useState('https://www.gulfrecruitmentbd.com');
  const [profileGoogleMap, setProfileGoogleMap] = useState('https://maps.google.com/maps?q=Gulshan-2,Dhaka');
  const [profilePhone, setProfilePhone] = useState('+880 2-9884511');
  const [profileFbLinkedIn, setProfileFbLinkedIn] = useState('facebook.com/gulfrecruitbd');

  // Company Verification state
  const [tradeLicenseName, setTradeLicenseName] = useState('Trade_License_2026_Approved.pdf');
  const [bmetLicenseName, setBmetLicenseName] = useState('BMET_Recruiting_License_RL1452.pdf');
  const [nidPassportName, setNidPassportName] = useState('Owner_NID_Scan.pdf');
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  // Chat Simulated State
  const [activeChatCandidateId, setActiveChatCandidateId] = useState<string | null>(null);
  
  // Visa Process & Payment Tracking specific state hooks
  const [expandedPkgId, setExpandedPkgId] = useState<string | null>(null);
  const [paymentModalPkg, setPaymentModalPkg] = useState<ItalyPackageApplication | null>(null);
  const [paymentModalStep, setPaymentModalStep] = useState<any | null>(null);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  const [payingAmount, setPayingAmount] = useState<number>(0);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('bkash');
  const [invoiceToPrint, setInvoiceToPrint] = useState<{ pkg: ItalyPackageApplication; tx: any } | null>(null);
  const [simulatedChats, setSimulatedChats] = useState<{ [candId: string]: { sender: 'employer' | 'candidate'; text: string; time: string }[] }>({
    'app_default': [
      { sender: 'candidate', text: 'আসসালামু আলাইকুম স্যার, আমি ড্রাইভিং পদের জন্য আবেদন করেছি। আমার আকামা আছে।', time: '১০:৩০ AM' },
      { sender: 'employer', text: 'ওয়ালাইকুম আসসালাম। আপনার হেভি ড্রাইভিং লাইসেন্সটি কি সৌদি আরবের?', time: '১০:৩৫ AM' },
      { sender: 'candidate', text: 'জ্বি স্যার, আমার রিয়াদের লাইসেন্স আছে এবং মেয়াদ ২০৮০ সাল পর্যন্ত আছে।', time: '১০:৩৭ AM' },
    ]
  });
  const [chatInputText, setChatInputText] = useState('');

  // Post Job form state
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCategory, setNewJobCategory] = useState('Driving & Logistics');
  const [newJobCountry, setNewJobCountry] = useState('Saudi Arabia 🇸🇦');
  const [newJobLocation, setNewJobLocation] = useState('Riyadh');
  const [newJobType, setNewJobType] = useState<string>('Company Visa');
  const [newJobVisaType, setNewJobVisaType] = useState<'Work Visa' | 'Employment Visa' | 'Sponsorship Visa' | 'Resident Visa'>('Work Visa');
  const [newJobSalary, setNewJobSalary] = useState('৳৭০,০০০ - ৳৯৫,০০০ (2400 SAR)');
  const [newJobDeadline, setNewJobDeadline] = useState('2026-08-15');
  const [newJobCircularPdf, setNewJobCircularPdf] = useState('Official_Recruitment_Circular_Approved.pdf');
  const [newJobDesc, setNewJobDesc] = useState('সৌদি আরবের শীর্ষস্থানীয় লজিস্টিকস কোম্পানিতে ভারী আকৃতির ট্রেইলার চালক আবশ্যক। থাকা, খাওয়া ও মেডিকেল কোম্পানি কর্তৃক প্রদান করা হবে।');
  const [newJobReqs, setNewJobReqs] = useState('• হেভি ড্রাইভিং লাইসেন্স থাকতে হবে\n• অন্তত ৩ বছরের জিসিসি (GCC) দেশে কাজের অভিজ্ঞতা বাঞ্ছনীয়\n• বয়স ২৫ থেকে ৪২ এর মধ্যে হতে হবে');
  const [isPremiumPack, setIsPremiumPack] = useState(false);

  // Checkout modal state
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutMethod, setCheckoutMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [checkoutTxID, setCheckoutTxID] = useState('');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Language state (simple display toggle)
  const [lang, setLang] = useState<'bn' | 'en'>('bn');

  // Filter computation
  const activeCompanyObj = companies.find(c => c.id === currentEmployerCompanyId);
  const activeCompanyJobs = jobs.filter(j => j.companyId === currentEmployerCompanyId);
  const activeCompanyApplications = applications.filter(app => 
    activeCompanyJobs.some(job => job.id === app.jobId)
  );

  const approvedJobs = jobs.filter(j => j.status === 'Approved');
  const filteredJobs = approvedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || job.category === filterCategory;
    const matchesLocation = filterLocation === 'All' || 
                            (job.country && job.country.includes(filterLocation)) || 
                            job.location.includes(filterLocation);
    const matchesType = filterType.length === 0 || filterType.includes(job.type);
    const matchesPremium = !onlyPremium || job.isPremium;
    return matchesSearch && matchesCategory && matchesLocation && matchesType && matchesPremium;
  });

  // Filter scam alerts
  const filteredScams = scamAlerts.filter(scam => {
    // Only show approved scams
    if (!scam.approved) return false;
    
    // Tab check (active vs archived)
    const matchesTab = scamViewTab === 'archived' ? scam.archived : !scam.archived;
    if (!matchesTab) return false;
    
    // Category check
    const matchesCategory = scamSelectedCategory === 'all' || scam.category === scamSelectedCategory;
    if (!matchesCategory) return false;
    
    // Search query check
    if (scamSearchQuery) {
      const q = scamSearchQuery.toLowerCase();
      const titleMatches = scam.title?.toLowerCase().includes(q);
      const phoneMatches = scam.phoneNumber?.toLowerCase().includes(q);
      const descMatches = scam.description?.toLowerCase().includes(q);
      const locMatches = scam.location?.toLowerCase().includes(q);
      return titleMatches || phoneMatches || descMatches || locMatches;
    }
    
    return true;
  });

  const handleApplyWebSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWebJob) return;
    onApplyJob(
      selectedWebJob.id,
      applicantName,
      applicantEmail,
      applicantPhone,
      uploadedCVName,
      applicantCover,
      applicantPassportNumber,
      applicantPassportExpiry,
      applicantBmetNumber,
      applicantMedicalStatus,
      applicantPoliceClearance,
      applicantSkills,
      applicantExperience,
      applicantLanguages,
      uploadedPhotoName
    );
    setIsApplyingWeb(false);
    alert(`আবেদন সফল হয়েছে! "${selectedWebJob.title}" পদের জন্য আপনার প্রবাসী প্রোফাইল ও নথি ওয়ান-ক্লিকে সাবমিট হয়েছে।`);
  };

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) {
      alert('অনুগ্রহ করে পদের নাম লিখুন');
      return;
    }

    if (isPremiumPack) {
      // Open manual bKash payment modal
      setShowCheckout(true);
    } else {
      // Post Standard Free Job immediately (Pending Approval)
      onPostJob({
        title: newJobTitle,
        companyId: currentEmployerCompanyId,
        companyName: activeCompanyObj?.name || 'Recruiting Agency',
        companyLogo: activeCompanyObj?.logo || '✈️',
        category: newJobCategory,
        country: newJobCountry,
        location: newJobLocation,
        salary: newJobSalary,
        type: newJobType,
        visaType: newJobVisaType,
        description: newJobDesc,
        requirements: newJobReqs.split('\n').filter(r => r.trim() !== '').map(r => r.replace(/^•\s*/, '')),
        status: 'Pending',
        isPremium: false,
        isFeatured: false,
        deadline: newJobDeadline,
        circularPdfName: newJobCircularPdf
      }, 0, 'Manual', '');

      alert('চাকরির বিজ্ঞাপনটি জমা দেওয়া হয়েছে এবং অ্যাডমিন অনুমোদনের অপেক্ষায় আছে!');
      resetPostJobForm();
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTxID.trim()) {
      alert('অনুগ্রহ করে ট্রানজেকশন ID প্রদান করুন');
      return;
    }

    const amount = isPremiumPack ? 2500 : 0;
    onPostJob({
      title: newJobTitle,
      companyId: currentEmployerCompanyId,
      companyName: activeCompanyObj?.name || 'Recruiting Agency',
      companyLogo: activeCompanyObj?.logo || '✈️',
      category: newJobCategory,
      country: newJobCountry,
      location: newJobLocation,
      salary: newJobSalary,
      type: newJobType,
      visaType: newJobVisaType,
      description: newJobDesc,
      requirements: newJobReqs.split('\n').filter(r => r.trim() !== '').map(r => r.replace(/^•\s*/, '')),
      status: 'Pending', // Pending admin verify
      isPremium: true,
      isFeatured: true,
      deadline: newJobDeadline,
      circularPdfName: newJobCircularPdf
    }, amount, checkoutMethod, checkoutTxID);

    setShowCheckout(false);
    alert('পেমেন্ট রিকোয়েস্ট ও প্রিমিয়াম চাকরির বিজ্ঞাপন সফলভাবে অ্যাডমিনের কাছে পাঠানো হয়েছে!');
    resetPostJobForm();
  };

  const resetPostJobForm = () => {
    setNewJobTitle('');
    setNewJobDesc('সৌদি আরবের শীর্ষস্থানীয় লজিস্টিকস কোম্পানিতে ভারী আকৃতির ট্রেইলার চালক আবশ্যক। থাকা, খাওয়া ও মেডিকেল কোম্পানি কর্তৃক প্রদান করা হবে।');
    setNewJobReqs('• হেভি ড্রাইভিং লাইসেন্স থাকতে হবে\n• অন্তত ৩ বছরের জিসিসি (GCC) দেশে কাজের অভিজ্ঞতা বাঞ্ছনীয়\n• বয়স ২৫ থেকে ৪২ এর মধ্যে হতে হবে');
    setIsPremiumPack(false);
    setCheckoutTxID('');
  };

  // Start editing a job
  const handleStartEditingJob = (job: Job) => {
    setEditingJob(job);
    setEditingTitle(job.title);
    setEditingCategory(job.category);
    setEditingCountry(job.country);
    setEditingLocation(job.location);
    setEditingType(job.type);
    setEditingVisaType(job.visaType);
    setEditingSalary(job.salary);
    setEditingDeadline(job.deadline);
    setEditingDesc(job.description);
    setEditingReqs(job.requirements.map(r => `• ${r}`).join('\n'));
    setEmployerTab('jobs'); // Switch view to jobs where post/edit forms are
  };

  const handleEditJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    
    const updatedJob: Job = {
      ...editingJob,
      title: editingTitle,
      category: editingCategory,
      country: editingCountry,
      location: editingLocation,
      type: editingType as any,
      visaType: editingVisaType,
      salary: editingSalary,
      deadline: editingDeadline,
      description: editingDesc,
      requirements: editingReqs.split('\n').filter(r => r.trim() !== '').map(r => r.replace(/^•\s*/, ''))
    };

    onUpdateJob(updatedJob);
    setEditingJob(null);
    alert('চাকরির তথ্য সফলভাবে আপডেট করা হয়েছে!');
  };

  // Sync company state fields when activeCompanyObj is loaded
  useEffect(() => {
    if (activeCompanyObj) {
      if (activeCompanyObj.coverBanner) setProfileCover(activeCompanyObj.coverBanner);
      if (activeCompanyObj.establishedYear) setProfileEstYear(activeCompanyObj.establishedYear);
      if (activeCompanyObj.website) setProfileWebsite(activeCompanyObj.website);
      if (activeCompanyObj.googleMap) setProfileGoogleMap(activeCompanyObj.googleMap);
      if (activeCompanyObj.phone) setProfilePhone(activeCompanyObj.phone);
      if (activeCompanyObj.facebookLink) setProfileFbLinkedIn(activeCompanyObj.facebookLink);
    }
  }, [activeCompanyObj]);

  const handleUpdateCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompanyObj) return;

    const updatedCompany: Company = {
      ...activeCompanyObj,
      coverBanner: profileCover,
      establishedYear: profileEstYear,
      website: profileWebsite,
      googleMap: profileGoogleMap,
      phone: profilePhone,
      facebookLink: profileFbLinkedIn
    };

    onUpdateCompany(updatedCompany);
    alert('কোম্পানি প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleSendMessage = (candId: string) => {
    if (!chatInputText.trim()) return;

    const userMsg = {
      sender: 'employer' as const,
      text: chatInputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update state with employer's message
    setSimulatedChats(prev => {
      const existing = prev[candId] || prev['app_default'] || [];
      return {
        ...prev,
        [candId]: [...existing, userMsg]
      };
    });

    setChatInputText('');

    // Set a timeout for simulated candidate response
    setTimeout(() => {
      const replies = [
        "জি স্যার, আমি তৈরি আছি। যেকোনো সময় ইন্টারভিউ দিতে পারব। ধন্যবাদ!",
        "স্যার, আমার সব কাগজপত্র (পাসপোর্ট, মেডিকেল রিপোর্ট) রেডি আছে।",
        "স্যার, ধন্যবাদ মেসেজ দেওয়ার জন্য। আমি আগামী রবিবার অফিসে সরাসরি দেখা করতে পারব কি?",
        "আপনার দেওয়া অফার ও সুযোগ সুবিধাগুলো চমৎকার। আমি দ্রুত যোগাযোগ করছি।"
      ];
      const randomReplyText = replies[Math.floor(Math.random() * replies.length)];
      
      const candidateMsg = {
        sender: 'candidate' as const,
        text: randomReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSimulatedChats(prev => {
        const existing = prev[candId] || [];
        return {
          ...prev,
          [candId]: [...existing, candidateMsg]
        };
      });
    }, 1500);
  };

  const handleProcessPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalPkg || !paymentModalStep) return;

    const baseAmount = payingAmount;
    const finalPaidAmount = Math.max(0, baseAmount - discountAmount);
    
    // Create new transaction
    const txId = 'TXN_' + Date.now().toString().slice(-6) + '_' + Math.floor(100 + Math.random() * 900);
    const newTx = {
      txID: txId,
      amount: finalPaidAmount,
      method: paymentMethod.toUpperCase(),
      date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Verified',
      stepId: paymentModalStep.stepId,
      stepName: paymentModalStep.stepName,
      discountCode: discountCode || undefined,
      discountAmount: discountAmount || undefined
    };

    // Update paymentSteps in package
    const updatedPaymentSteps = paymentModalPkg.paymentSteps.map(step => {
      if (step.stepId === paymentModalStep.stepId) {
        const newPaid = (step.paidAmount || 0) + finalPaidAmount;
        const isCompleted = newPaid >= step.amount;
        return {
          ...step,
          paidAmount: newPaid,
          status: isCompleted ? 'Paid' as const : 'Partially Paid' as const,
          paymentDate: new Date().toISOString().split('T')[0]
        };
      }
      return step;
    });

    // Recalculate package totals
    const totalPaid = (paymentModalPkg.paidAmount || 0) + finalPaidAmount;
    const totalDue = Math.max(0, paymentModalPkg.totalAmount - totalPaid);

    const updatedPkg: ItalyPackageApplication = {
      ...paymentModalPkg,
      paidAmount: totalPaid,
      dueAmount: totalDue,
      paymentSteps: updatedPaymentSteps,
      paymentHistory: [...(paymentModalPkg.paymentHistory || []), newTx]
    };

    if (onUpdateItalyPackage) {
      onUpdateItalyPackage(updatedPkg);
    }

    setPaymentSuccessMessage(`৳${finalPaidAmount.toLocaleString()} পেমেন্ট সফল হয়েছে! রশিদ ডাউনলোড করুন নিচে ক্লিক করে।`);
    setInvoiceToPrint({ pkg: updatedPkg, tx: newTx });
    
    // Update local modal package so the UI refreshes
    setPaymentModalPkg(updatedPkg);
    setDiscountCode('');
    setDiscountAmount(0);
  };

  const handleToggleType = (type: string) => {
    if (filterType.includes(type)) {
      setFilterType(filterType.filter(t => t !== type));
    } else {
      setFilterType([...filterType, type]);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportCompanyObj) return;

    if (onReportCompany) {
      onReportCompany({
        companyId: reportCompanyObj.id,
        companyName: reportCompanyObj.name,
        reporterName: reportReporterName,
        reporterEmail: reportReporterEmail,
        reporterPhone: reportReporterPhone,
        category: reportCategory,
        description: reportDescription,
        evidenceUrl: reportEvidenceName ? `evidence_${reportEvidenceName}` : undefined
      });
    }

    alert(`কোম্পানি "${reportCompanyObj.name}" এর বিরুদ্ধে আপনার ${reportCategory === 'Fake Job' ? 'ভুয়া সার্কুলার' : reportCategory === 'Fake Visa' ? 'ভুয়া ভিসা অফার' : reportCategory === 'Payment Fraud' ? 'পেমেন্ট প্রতারণা' : reportCategory === 'Scam' ? 'স্ক্যাম / চিটিং' : reportCategory === 'Abuse' ? 'অশালীন আচরণ' : 'অন্যান্য'} অভিযোগটি সফলভাবে রেকর্ড করা হয়েছে। আমাদের ভেরিফিকেশন টিম প্রমাণ যাচাই করে প্রয়োজনীয় কঠোর ব্যবস্থা গ্রহণ করবে।`);
    
    // Reset report form
    setReportCompanyObj(null);
    setReportDescription('');
    setReportCategory('Fake Job');
    setReportEvidenceName('');
  };



  return (
    <div className="bg-[#f8fafc] h-full flex flex-col font-sans border border-slate-200 shadow-sm rounded-3xl overflow-y-auto">
      
      {/* Top Banner Navigation Row */}
      {!isAgencyOnly && (
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        
        {/* Top utility row */}
        <div className="bg-slate-900 px-6 py-1.5 text-white flex justify-between items-center text-[11px] font-medium flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            <span>{lang === 'bn' ? 'বাংলাদেশ চাকরির নির্ভরযোগ্য সেরা পোর্টাল' : 'Bangladesh\'s Most Reliable Jobs Platform'}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switch */}
            <button 
              id="lang-switch-btn"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="hover:text-emerald-400 font-bold border-r border-slate-700 pr-3"
            >
              🌐 {lang === 'bn' ? 'English' : 'বাংলা'}
            </button>

            {/* Quick switcher between Seeker and Employer dashboards */}
            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button 
                id="role-switch-seeker"
                onClick={() => onSetUserType('seeker')}
                className={`px-2.5 py-0.5 rounded-md transition ${currentUserType === 'seeker' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                {lang === 'bn' ? 'চাকরিপ্রার্থী' : 'Job Seeker'}
              </button>
              <button 
                id="role-switch-employer"
                onClick={() => onSetUserType('employer')}
                className={`px-2.5 py-0.5 rounded-md transition ${currentUserType === 'employer' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                {lang === 'bn' ? 'নিয়োগকর্তা' : 'Employer'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Header Menu */}
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/15">
                BD
              </div>
              <span className="text-base font-black tracking-tight text-slate-800">
                BDJobs <span className="text-emerald-500">Pro</span>
              </span>
            </div>

            {/* Nav Menu */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-600">
              {[
                { id: 'home', label: lang === 'bn' ? 'হোম' : 'Home' },
                { id: 'jobs', label: lang === 'bn' ? 'চাকরি সমূহ' : 'Browse Jobs' },
                { id: 'employer-portal', label: lang === 'bn' ? '🏢 নিয়োগকর্তা পোর্টাল' : '🏢 Company Portal' },
                { id: 'dashboard', label: lang === 'bn' ? 'প্রার্থী প্যানেল' : 'Job Seeker Panel' },
                { id: 'italy-package', label: lang === 'bn' ? '🇮🇹 ইতালি প্যাকেজ' : '🇮🇹 Italy Package' },
                { id: 'blog', label: lang === 'bn' ? 'ক্যারিয়ার ব্লগ' : 'Career Blog' },
                { id: 'scam-alerts', label: lang === 'bn' ? '🚨 প্রতারক চিনে রাখুন' : '🚨 Scam Detector' },
                { id: 'about', label: lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us' },
                { id: 'contact', label: lang === 'bn' ? 'যোগাযোগ' : 'Contact' },
              ].map((item) => (
                <button
                  key={item.id}
                  id={`web-nav-${item.id}`}
                  onClick={() => {
                    if (item.id === 'employer-portal') {
                      onNavigateToAgency?.('login');
                    } else if (item.id === 'dashboard') {
                      onSetUserType('seeker');
                      setCurrentPage('dashboard');
                    } else {
                      setCurrentPage(item.id as any);
                    }
                  }}
                  className={`transition hover:text-emerald-500 ${
                    item.id === 'employer-portal'
                      ? (currentPage === 'dashboard' && currentUserType === 'employer' ? 'text-emerald-600 border-b-2 border-emerald-500 py-1 font-extrabold' : '')
                      : item.id === 'dashboard'
                      ? (currentPage === 'dashboard' && currentUserType === 'seeker' ? 'text-emerald-600 border-b-2 border-emerald-500 py-1 font-extrabold' : '')
                      : currentPage === item.id ? 'text-emerald-600 border-b-2 border-emerald-500 py-1 font-extrabold' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* User Info & Role Tag */}
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-800 leading-tight">{currentUser.name}</p>
                  <p className="text-[9.5px] text-emerald-600 font-bold tracking-wide uppercase flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {currentUser.role === 'seeker' && (lang === 'bn' ? 'প্রার্থী' : 'Candidate')}
                    {currentUser.role === 'employer' && (lang === 'bn' ? 'নিয়োগকর্তা' : 'Employer')}
                    {currentUser.role === 'staff' && (lang === 'bn' ? 'স্টাফ অফিসার' : 'Staff Officer')}
                    {currentUser.role === 'admin' && (lang === 'bn' ? 'অ্যাডমিন' : 'Admin')}
                    {currentUser.role === 'super_admin' && (lang === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin')}
                  </p>
                </div>

                {/* Dashboard Access Button */}
                <button 
                  id="web-header-dashboard-btn"
                  onClick={() => {
                    setCurrentPage('dashboard');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 transition shadow-xs text-slate-700 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span>
                    {currentUserType === 'seeker' 
                      ? (lang === 'bn' ? 'প্রার্থী প্যানেল' : 'Candidate Panel') 
                      : (lang === 'bn' ? 'কোম্পানি প্যানেল' : 'Employer Panel')
                    }
                  </span>
                </button>

                {/* Switch Workspace for Admin/Staff */}
                {(currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'staff') && (
                  <button
                    onClick={() => onSwitchWorkspace('admin')}
                    className="px-3 py-2 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                  >
                    🛠️ Workspace
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={() => {
                    onLogout();
                    setCurrentPage('home');
                  }}
                  className="p-2 rounded-xl text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition cursor-pointer"
                  title={lang === 'bn' ? 'লগআউট' : 'Logout'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                id="web-header-login-trigger-btn"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition shadow-md shadow-emerald-500/15 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>{lang === 'bn' ? 'লগইন / সাইন আপ' : 'Login / Register'}</span>
              </button>
            )}

            {currentUserType === 'employer' && currentUser && (
              <button 
                id="web-header-post-job-btn"
                onClick={() => { setCurrentPage('dashboard'); resetPostJobForm(); }}
                className="px-4 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'bn' ? 'চাকরি পোস্ট করুন' : 'Post a Job'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation tag bar */}
        <div className="lg:hidden border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
          {[
            { id: 'home', label: lang === 'bn' ? 'হোম' : 'Home' },
            { id: 'jobs', label: lang === 'bn' ? 'চাকরি সমূহ' : 'Browse Jobs' },
            { id: 'employer-portal', label: lang === 'bn' ? '🏢 নিয়োগকর্তা পোর্টাল' : '🏢 Company Portal' },
            { id: 'dashboard', label: lang === 'bn' ? 'প্রার্থী প্যানেল' : 'Job Seeker Panel' },
            { id: 'italy-package', label: lang === 'bn' ? '🇮🇹 ইতালি প্যাকেজ' : '🇮🇹 Italy Package' },
            { id: 'blog', label: lang === 'bn' ? 'ক্যারিয়ার ব্লগ' : 'Career Blog' },
            { id: 'scam-alerts', label: lang === 'bn' ? '🚨 প্রতারক চিনে রাখুন' : '🚨 Scam Detector' },
            { id: 'about', label: lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us' },
            { id: 'contact', label: lang === 'bn' ? 'যোগাযোগ' : 'Contact' },
          ].map((item) => {
            const isItemActive = item.id === 'employer-portal'
              ? (currentPage === 'dashboard' && currentUserType === 'employer')
              : item.id === 'dashboard'
              ? (currentPage === 'dashboard' && currentUserType === 'seeker')
              : currentPage === item.id;

            return (
              <button
                key={item.id}
                id={`web-nav-mobile-${item.id}`}
                onClick={() => {
                  if (item.id === 'employer-portal') {
                    onNavigateToAgency?.('login');
                  } else if (item.id === 'dashboard') {
                    onSetUserType('seeker');
                    setCurrentPage('dashboard');
                  } else {
                    setCurrentPage(item.id as any);
                  }
                }}
                className={`text-[11px] font-black px-2.5 py-1.5 rounded-lg transition shrink-0 ${
                  isItemActive 
                    ? 'bg-emerald-500 text-white shadow-xs' 
                    : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>
      )}

      {/* Main Core View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        
        {/* VIEW 1: HOME PAGE */}
        {currentPage === 'home' && (
          <div className="space-y-12">
            
            {/* Elegant Landing Hero */}
            <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
              
              <div className="max-w-2xl space-y-5 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-xs font-bold text-emerald-400 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  {lang === 'bn' ? 'নতুন ৫জি আল্ট্রা-ফাস্ট জব রিক্রুটমেন্ট অ্যাপ' : 'Next-Gen Job Matching Platform'}
                </span>

                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                  {lang === 'bn' ? (
                    <>আপনার স্বপ্নের পেশা খুঁজুন <br />আজই <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">BDJobs Pro</span> এ</>
                  ) : (
                    <>Discover The Best Career Opportunities In <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Bangladesh</span></>
                  )}
                </h1>

                <p className="text-slate-300 text-xs md:text-sm font-light leading-relaxed">
                  {lang === 'bn' 
                    ? 'হাজার হাজার শীর্ষস্থানীয় আইটি, ফাইন্যান্স এবং মাল্টিন্যাশনাল কোম্পানিগুলোতে আবেদন করুন মাত্র এক ক্লিকে। মোবাইল ও ওয়েবসাইট দুটোতেই পাবেন রিয়েল-টাইম নোটিফিকেশন!'
                    : 'Connect with top-tier technical and corporate organizations. Manage CVs, track applications, and attend live structured interviews easily.'
                  }
                </p>

                {/* Combined Search widget */}
                <div className="p-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex flex-col md:flex-row items-center gap-2 shadow-2xl">
                  <div className="flex items-center gap-2 bg-white text-slate-800 rounded-xl px-3 py-2.5 flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input 
                      id="web-hero-search-input"
                      type="text" 
                      placeholder={lang === 'bn' ? "পদবি বা কোম্পানি লিখুন (যেমন: React Developer)" : "Enter keyword, designation..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none text-xs w-full focus:outline-none focus:ring-0"
                    />
                  </div>

                  <button 
                    id="web-hero-search-submit"
                    onClick={() => { setCurrentPage('jobs'); }}
                    className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition duration-150"
                  >
                    <span>{lang === 'bn' ? 'সার্চ করুন' : 'Search Now'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Floater widgets represent app sync */}
              <div className="hidden lg:block absolute right-12 bottom-6 w-72 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-4 text-xs font-light text-slate-300">
                <strong className="block text-emerald-400 font-bold mb-1.5 flex items-center gap-1">📱 রিয়েল-টাইম স্টেট সিঙ্ক:</strong>
                নিয়োগকর্তা বা অ্যাডমিন প্যানেল থেকে চাকরি পোস্ট বা ভেরিফাই করা হলে তা তাত্ক্ষণিকভাবে অ্যান্ড্রয়েড মোবাইল অ্যাপ সিমুলেটরে আপডেট হবে!
              </div>
            </section>

            {/* Popular categories section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black text-slate-800">{lang === 'bn' ? 'শীর্ষ জব ক্যাটাগরি' : 'Explore by Categories'}</h2>
                  <p className="text-[11px] text-slate-500">{lang === 'bn' ? 'ক্যাটাগরি অনুযায়ী ফিল্টার করে আপনার পছন্দের ক্ষেত্রে কাজ খুঁজুন' : 'Find jobs inside top growing industrial sectors'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map((cat, i) => (
                  <div 
                    key={i}
                    id={`web-home-cat-${cat.name.replace(/\s+/g, '-')}`}
                    onClick={() => { setFilterCategory(cat.name); setCurrentPage('jobs'); }}
                    className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 truncate">{cat.name}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">{cat.count} {lang === 'bn' ? 'টি চাকরি খালি' : 'vacancies'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Hot Premium / Featured Jobs postings */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Premium featured jobs (Left 2/3) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
                      ⭐ {lang === 'bn' ? 'প্রিমিয়াম চাকরির সার্কুলার' : 'Premium Featured Circulars'}
                    </h2>
                    <p className="text-[11px] text-slate-500">{lang === 'bn' ? 'শীর্ষ কোম্পানি সমূহের প্রিমিয়াম এবং দ্রুত নিয়োগের সার্কুলার সমূহ' : 'Verified circulars with express hiring options'}</p>
                  </div>
                  <button 
                    id="web-view-all-jobs-btn"
                    onClick={() => { setOnlyPremium(true); setCurrentPage('jobs'); }}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    {lang === 'bn' ? 'সব প্রিমিয়াম দেখুন' : 'See all Premium'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {approvedJobs.filter(j => j.isPremium).map((job) => (
                    <div 
                      key={job.id}
                      id={`web-premium-job-card-${job.id}`}
                      onClick={() => { setSelectedWebJob(job); }}
                      className="bg-white border border-amber-500/30 hover:border-amber-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden group flex flex-col justify-between"
                    >
                      {/* Premium Ribbon */}
                      <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-black text-[9px] uppercase px-3 py-0.5 rounded-bl-xl shadow">
                        Premium
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-center text-2xl shrink-0">
                            {job.companyLogo}
                          </div>
                          <div>
                            <h3 className="text-xs font-black text-slate-800 group-hover:text-emerald-500 transition-colors line-clamp-1">{job.title}</h3>
                            <p className="text-[10.5px] text-slate-500 mt-0.5">{job.companyName}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[9.5px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{job.type}</span>
                          <span className="text-[9.5px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-bold">{job.salary}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                        <span className="text-[10px] text-slate-400">📍 {job.location}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side: Fast Statistics and Career guide (Right 1/3) */}
              <div className="space-y-4">
                <h2 className="text-lg font-black text-slate-800">{lang === 'bn' ? 'তাত্ক্ষণিক পরিসংখ্যান' : 'Quick Stats'}</h2>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">{lang === 'bn' ? 'মোট চাকরির পোস্টিং' : 'Total Live Jobs'}</span>
                    <span className="font-bold text-slate-800">{jobs.filter(j => j.status === 'Approved').length} টি</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">{lang === 'bn' ? 'নিবন্ধিত কোম্পানি' : 'Active Employers'}</span>
                    <span className="font-bold text-slate-800">{companies.length} টি</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">{lang === 'bn' ? 'আজকের আবেদন' : 'Today Applications'}</span>
                    <span className="font-bold text-emerald-600">{applications.length} টি</span>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] leading-relaxed text-blue-950 font-light">
                    🎯 <strong>{lang === 'bn' ? 'কিভাবে কাজ করে?' : 'How does it work?'}</strong><br />
                    ১. ডানপাশের অ্যান্ড্রয়েড মোবাইলে Google বা OTP দিয়ে লগইন করুন।<br />
                    ২. যেকোনো চাকরিতে এক ক্লিকে আবেদন করুন।<br />
                    ৩. নিয়োগকর্তা ড্যাশবোর্ড থেকে শর্টলিস্ট করলে সাথে সাথে মোবাইলে নোটিফিকেশন পাবেন।
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: JOBS PAGE */}
        {currentPage === 'jobs' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Sidebar Filters */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 h-fit">
              <div className="flex justify-between items-center pb-3 border-b border-slate-150">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-emerald-500" />
                  {lang === 'bn' ? 'ফিল্টার সমূহ' : 'Filter Options'}
                </span>
                <button 
                  id="reset-web-filters"
                  onClick={() => { setFilterCategory('All'); setFilterLocation('All'); setFilterType([]); setOnlyPremium(false); setSearchQuery(''); }}
                  className="text-[10px] text-rose-500 hover:underline font-bold"
                >
                  {lang === 'bn' ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              {/* Text Search inside Sidebar */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold block text-slate-500 uppercase tracking-wider">{lang === 'bn' ? 'অনুসন্ধান' : 'Search'}</label>
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-250 rounded-lg text-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input 
                    id="web-sidebar-search"
                    type="text" 
                    placeholder={lang === 'bn' ? 'পদবি বা কিওয়ার্ড...' : 'Designation...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-[11px] w-full focus:outline-none focus:ring-0 text-slate-800"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold block text-slate-500 uppercase tracking-wider">{lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}</label>
                <select 
                  id="web-sidebar-cat-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-250 rounded-lg text-slate-700"
                >
                  <option value="All">{lang === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
                  {CATEGORIES.map((cat, i) => (
                    <option key={i} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Location selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold block text-slate-500 uppercase tracking-wider">{lang === 'bn' ? 'গন্তব্য দেশ (Country)' : 'Destination Country'}</label>
                <select 
                  id="web-sidebar-loc-select"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-250 rounded-lg text-slate-700"
                >
                  <option value="All">{lang === 'bn' ? 'সকল দেশ' : 'All Countries'}</option>
                  {COUNTRIES.map((country, i) => (
                    <option key={i} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>

              {/* Job Type checklist */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold block text-slate-500 uppercase tracking-wider">{lang === 'bn' ? 'চাকরির ধরণ' : 'Job Type'}</label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {['Company Visa', 'Free Visa', 'Full-time', 'Contract'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={filterType.includes(type)}
                        onChange={() => handleToggleType(type)}
                        className="rounded text-emerald-500 border-slate-300 focus:ring-emerald-500"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Premium toggle */}
              <div className="pt-2 border-t border-slate-150">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={onlyPremium}
                    onChange={(e) => setOnlyPremium(e.target.checked)}
                    className="rounded text-amber-500 border-slate-300 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-slate-700">⭐ {lang === 'bn' ? 'শুধুমাত্র প্রিমিয়াম চাকরি' : 'Only Premium Jobs'}</span>
                </label>
              </div>

            </div>

            {/* Listings Grid (Right 3/4) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 font-semibold">
                  {lang === 'bn' ? `মোট ${filteredJobs.length} টি চাকরি পাওয়া গেছে` : `Found ${filteredJobs.length} live openings`}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => {
                    const isSaved = savedJobs.includes(job.id);
                    return (
                      <div 
                        key={job.id}
                        id={`web-job-list-card-${job.id}`}
                        className={`bg-white border rounded-2xl p-5 hover:shadow-md transition flex flex-col md:flex-row justify-between gap-4 items-start md:items-center relative overflow-hidden ${
                          job.isPremium ? 'border-amber-500/30 shadow-sm bg-amber-500/[0.01]' : 'border-slate-200'
                        }`}
                      >
                        {job.isPremium && (
                          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500"></div>
                        )}

                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-3xl shrink-0">
                            {job.companyLogo}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 
                                onClick={() => setSelectedWebJob(job)}
                                className="text-xs font-black text-slate-800 hover:text-emerald-500 cursor-pointer"
                              >
                                {job.title}
                              </h3>
                              {job.isPremium && (
                                <span className="bg-amber-500 text-slate-950 font-extrabold text-[8px] px-1.5 py-0.2 rounded shadow-sm">Premium</span>
                              )}
                            </div>
                            
                            <p className="text-[11px] text-emerald-500 font-bold mt-0.5">{job.companyName}</p>

                            <div className="flex items-center gap-3 text-[10.5px] text-slate-400 mt-2 flex-wrap font-medium">
                              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[9px] font-bold">{job.type}</span>
                              <span className="flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5 text-rose-500" /> {job.location}</span>
                              <span className="flex items-center gap-0.5"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> {job.salary}</span>
                            </div>
                          </div>
                        </div>

                        {/* CTA actions */}
                        <div className="flex gap-2 shrink-0 w-full md:w-auto justify-end">
                          <button
                            id={`web-save-btn-list-${job.id}`}
                            onClick={() => onToggleSaveJob(job.id)}
                            className={`p-2 rounded-xl border transition ${
                              isSaved 
                                ? 'bg-amber-500/15 border-amber-500 text-amber-500' 
                                : 'border-slate-200 hover:bg-slate-50 text-slate-400'
                            }`}
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>

                          <button
                            id={`web-view-detail-btn-list-${job.id}`}
                            onClick={() => setSelectedWebJob(job)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                          >
                            {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center text-slate-400">
                    <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-bold">{lang === 'bn' ? 'দুঃখিত! কোনো চাকরির ফলাফল পাওয়া যায়নি।' : 'No job matching filters found.'}</p>
                    <button 
                      id="reset-web-filters-none"
                      onClick={() => { setFilterCategory('All'); setFilterLocation('All'); setFilterType([]); setOnlyPremium(false); setSearchQuery(''); }}
                      className="text-xs text-emerald-500 hover:underline font-bold mt-2"
                    >
                      ফিল্টার ক্লিয়ার করুন
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: COMPANIES DIRECTORY */}
        {currentPage === 'companies' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-800">{lang === 'bn' ? 'নিবন্ধিত ও ভেরিফাইড কোম্পানি সমূহ' : 'Verified Companies Directory'}</h2>
              <p className="text-[11px] text-slate-500">{lang === 'bn' ? 'শীর্ষস্থানীয় নিয়োগকর্তা কোম্পানিগুলোর বায়ো এবং বর্তমান চাকরির সার্কুলার পর্যবেক্ষণ করুন' : 'Discover top corporate employers and their job counts'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {companies.map((company) => {
                const compJobs = jobs.filter(j => j.companyId === company.id && j.status === 'Approved');
                const compReports = companyReports.filter(r => r.companyId === company.id && (r.status === 'Pending' || r.status === 'Investigating'));
                return (
                  <div key={company.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start flex-wrap gap-1.5">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-center text-3xl">
                        {company.logo}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {(() => {
                          const status = company.companyStatus || (company.isApproved ? 'Verified' : 'Pending');
                          if (status === 'Verified') {
                            return (
                              <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 🟢 Verified
                              </span>
                            );
                          } else if (status === 'Under Review' || status === 'Pending') {
                            return (
                              <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> 🟡 Under Review
                              </span>
                            );
                          } else if (status === 'Suspended') {
                            return (
                              <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> 🔴 Suspended
                              </span>
                            );
                          } else {
                            return (
                              <span className="bg-slate-900 text-white border border-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span> ⚫ Blacklisted
                              </span>
                            );
                          }
                        })()}

                        {compReports.length > 0 && (
                          <span className="bg-rose-100 text-rose-700 text-[8.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                            ⚠️ {compReports.length}টি অভিযোগ রয়েছে
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-black text-slate-800 flex items-center gap-1">
                        {company.name}
                        {company.companyStatus === 'Blacklisted' && (
                          <span className="text-[9px] bg-red-600 text-white font-extrabold px-1 rounded">PROHIBITED</span>
                        )}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{company.industry} • {company.employees} {lang === 'bn' ? 'কর্মী' : 'Employees'}</p>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed font-light line-clamp-3">{company.description}</p>

                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-2">
                      <span className="text-slate-400 truncate max-w-[150px]">📍 {company.location}</span>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button 
                          onClick={() => setReportCompanyObj(company)}
                          className="text-[10px] text-rose-600 hover:text-rose-700 font-black bg-rose-50 hover:bg-rose-100/60 px-2 py-1 rounded-lg border border-rose-150 transition flex items-center gap-0.5"
                        >
                          <ShieldAlert className="w-3 h-3" /> অভিযোগ দিন
                        </button>
                        <button 
                          id={`web-view-comp-jobs-${company.id}`}
                          onClick={() => { setSearchQuery(company.name); setCurrentPage('jobs'); }}
                          className="text-[11.5px] text-blue-600 hover:underline font-bold shrink-0"
                        >
                          {compJobs.length} {lang === 'bn' ? 'টি চাকরি খালি' : 'circulars'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: CAREER BLOG */}
        {currentPage === 'blog' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-800">{lang === 'bn' ? 'ক্যারিয়ার ডেভেলপমেন্ট ব্লগ ও তথ্যভাণ্ডার' : 'Career Growth & CV Tips Blog'}</h2>
              <p className="text-[11px] text-slate-500">{lang === 'bn' ? 'চাকরি খোঁজা এবং নিজেকে দক্ষভাবে ইন্টারভিউয়ের জন্য প্রস্তুত করার নির্দেশনাবলি' : 'Tips to write impressive resumes and nail corporate interviews'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'কীভাবে একটি প্রফেশনাল সিভি (CV) তৈরি করবেন?',
                  desc: 'বাংলাদেশি গ্রাজুয়েটদের জন্য আধুনিক ATS-ফ্রেন্ডলি জীবনবৃত্তান্ত বা সিভি ফরম্যাটিং এবং কমন ভুলভ্রান্তি এড়ানোর সুনির্দিষ্ট গাইডলাইন।',
                  readTime: '৫ মিনিট পাঠ',
                  icon: FileText
                },
                {
                  title: 'কর্পোরেট ইন্টারভিউ বোর্ডে সফল হওয়ার গোপন ট্রিকস',
                  desc: 'প্রথম ইম্প্রেশন তৈরি করা, প্রশ্ন শুনে আত্মবিশ্বাসের সাথে বাংলা ও ইংরেজিতে উত্তর প্রদান করা এবং সেলফ ব্র্যান্ডিং-এর কলাকৌশল।',
                  readTime: '৭ মিনিট পাঠ',
                  icon: Sparkles
                },
                {
                  title: 'ফ্লাটার নাকি রিঅ্যাক্ট নেটিভ: ২০২৬ এর মোবাইল অ্যাপ গাইড',
                  desc: 'বর্তমানে ইন্ডাস্ট্রিতে কোন মেথডে বেশি বেতন ও কর্মসংস্থান রয়েছে তার বিস্তারিত তুলনা এবং লার্নিং পাথ রোডম্যাপ।',
                  readTime: '৪ মিনিট পাঠ',
                  icon: TrendingUp
                },
                {
                  title: 'ফ্রিল্যান্সিং নাকি দেশের টেক ফার্মে ফুল-টাইম চাকরি?',
                  desc: 'ক্যারিয়ার শুরুর ক্ষেত্রে কোন বিকল্পটি দীর্ঘমেয়াদে বেশি নিরাপদ এবং কীভাবে নিজের প্রোর্টফোলিও ও গিটহাব রিপ্রেজেন্ট করবেন।',
                  readTime: '৮ মিনিট পাঠ',
                  icon: BookOpen
                }
              ].map((blog, i) => {
                const Icon = blog.icon;
                return (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black">{blog.readTime}</span>
                      <h3 className="text-xs font-black text-slate-800">{blog.title}</h3>
                      <p className="text-[11px] text-slate-500 leading-normal font-light">{blog.desc}</p>
                      <button 
                        id={`blog-read-btn-${i}`}
                        onClick={() => alert('এই আর্টিকেলটি পুরো ডেমো গাইডলাইনের অংশ। BDJobs Pro ক্যারিয়ার মেথডে চোখ রাখুন!')}
                        className="text-xs text-emerald-500 hover:underline font-bold inline-flex items-center gap-0.5"
                      >
                        আর্টিকেলটি পড়ুন <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4.5: PUBLIC BLACKLIST & SCAM ALERTS */}
        {currentPage === 'scam-alerts' && (
          <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-slate-850">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-red-600/15 blur-3xl" />
              <div className="absolute left-1/3 bottom-0 w-48 h-48 rounded-full bg-blue-600/5 blur-2xl" />
              
              <div className="relative space-y-4 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black rounded-full uppercase tracking-widest">
                  <ShieldAlert className="w-3.5 h-3.5" /> পাবলিক নিরাপত্তা উইং (Anti-Fraud Portal)
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  প্রতারক চিনে রাখুন — সতর্ক থাকুন ও নিরাপদ থাকুন
                </h2>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  বৈদেশিক কর্মসংস্থান, ভিসা প্রসেসিং ও প্রবাসী কল্যাণ সংশ্লিষ্ট খাতের সম্ভাব্য প্রতারণা, ভুয়া কোম্পানি, ভুয়া এজেন্ট এবং পেমেন্ট জালিয়াতি সম্পর্কে প্রমাণসহ বিশদ তথ্য। কোনো প্রকার লেনদেন করার আগে অবশ্যই আমাদের সতর্কতা তালিকা দেখে নিন।
                </p>
              </div>
            </div>

            {/* Legal Notice / Warning Alert Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-slate-850 shadow-xs">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-amber-900">আইনি ও নীতিগত সতর্কবার্তা (Legal Disclaimer)</h4>
                <p className="text-[10.5px] text-amber-800 leading-relaxed font-light">
                  কাউকে “প্রতারক” হিসেবে তালিকাভুক্ত করার আগে BDJobs Pro টিম প্রতিটি অভিযোগের প্রমাণাদি, মোবাইল চ্যাট হিস্ট্রি, পেমেন্ট রসিদ এবং থানা জিডির অনুলিপি নিখুঁতভাবে যাচাই করে থাকে। উক্ত পোস্টসমূহ সাধারণ ব্যবহারকারীদের সচেতনতা বৃদ্ধির লক্ষ্যে এবং প্রশাসনিক তদন্ত/অভিযোগের ভিত্তিতে প্রকাশ করা হয়েছে। কোনো প্রকার ভুল তথ্য প্রকাশ পেলে অবিলম্বে আমাদের হেল্পলাইনে যোগাযোগ করার জন্য অনুরোধ করা হলো।
                </p>
              </div>
            </div>

            {/* Search & Category Filter Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={scamSearchQuery}
                    onChange={(e) => setScamSearchQuery(e.target.value)}
                    placeholder="ব্যক্তি/প্রতিষ্ঠানের নাম, মোবাইল নম্বর অথবা এলাকা দিয়ে খুঁজুন..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition text-slate-800"
                  />
                  {scamSearchQuery && (
                    <button 
                      onClick={() => setScamSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      মুছুন
                    </button>
                  )}
                </div>

                {/* Switch between Active and Archived */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start shrink-0">
                  <button
                    onClick={() => setScamViewTab('active')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${scamViewTab === 'active' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    চলতি সতর্কতা ({scamAlerts.filter(s => s.approved && !s.archived).length})
                  </button>
                  <button
                    onClick={() => setScamViewTab('archived')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${scamViewTab === 'archived' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    আর্কাইভ ({scamAlerts.filter(s => s.approved && s.archived).length})
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0">ফিল্টার:</span>
                {[
                  { id: 'all', label: 'সকল প্রকার' },
                  { id: 'fake_agent', label: 'ভুয়া এজেন্ট' },
                  { id: 'fake_job', label: 'ভুয়া চাকরি' },
                  { id: 'visa_fraud', label: 'ভিসা প্রতারণা' },
                  { id: 'payment_fraud', label: 'পেমেন্ট জালিয়াতি' },
                  { id: 'document_fraud', label: 'ডকুমেন্ট জালিয়াতি' },
                  { id: 'other', label: 'অন্যান্য' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setScamSelectedCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-full text-[10.5px] font-black transition shrink-0 ${
                      scamSelectedCategory === cat.id 
                        ? 'bg-red-500 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200/60 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Scam Alerts */}
            <div className="grid grid-cols-1 gap-6">
              {filteredScams.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mx-auto">
                    🔍
                  </div>
                  <h3 className="text-sm font-black text-slate-800">কোনো তথ্য পাওয়া যায়নি</h3>
                  <p className="text-xs text-slate-500 font-light max-w-md mx-auto">
                    আপনার সার্চ কুয়েরি অথবা ফিল্টারের সাথে মিলে যায় এমন কোনো প্রতারণার সতর্কতা বা রেকর্ড খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক তথ্য দিয়ে ট্রাই করুন।
                  </p>
                </div>
              ) : (
                filteredScams.map((scam) => (
                  <div 
                    key={scam.id}
                    className="bg-white border-2 border-red-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition flex flex-col md:flex-row"
                  >
                    {/* Visual Warning Left Column */}
                    <div className="md:w-64 bg-slate-900 relative shrink-0 flex items-center justify-center p-4 min-h-[160px] md:min-h-auto">
                      {scam.photoUrl ? (
                        <img 
                          src={scam.photoUrl} 
                          alt="Fraud warning"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-red-950 to-slate-900" />
                      )}
                      {/* Warning Tag Badge */}
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-md">
                        <ShieldAlert className="w-3 h-3 animate-pulse" /> CAUTION
                      </div>
                      
                      {/* Visual Center Alert */}
                      <div className="relative text-center space-y-1.5 z-10 py-6">
                        <span className="w-12 h-12 rounded-full bg-red-600/95 text-white flex items-center justify-center text-xl font-bold mx-auto border border-red-500 shadow-lg">
                          ⚠️
                        </span>
                        <p className="text-[10px] text-red-400 font-black tracking-widest uppercase">VERIFIED SCAM</p>
                        <p className="text-[9.5px] text-slate-300 font-bold bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs inline-block">
                          {scam.category === 'fake_agent' && 'ভুয়া এজেন্ট'}
                          {scam.category === 'fake_job' && 'ভুয়া চাকরি'}
                          {scam.category === 'visa_fraud' && 'ভিসা প্রতারণা'}
                          {scam.category === 'payment_fraud' && 'পেমেন্ট জালিয়াতি'}
                          {scam.category === 'document_fraud' && 'ডকুমেন্ট জালিয়াতি'}
                          {scam.category === 'other' && 'অন্যান্য'}
                        </p>
                      </div>
                    </div>

                    {/* Fraud Details Middle Column */}
                    <div className="flex-1 p-5 md:p-6 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2 justify-between">
                          <span className="text-[10px] text-slate-400 font-bold">আইডি: {scam.id.toUpperCase()}</span>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {scam.createdAt}
                          </span>
                        </div>
                        
                        <h3 className="text-sm font-black text-slate-900 hover:text-red-600 transition">
                          {scam.title}
                        </h3>

                        {/* Critical Quick Info Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="bg-red-50/50 border border-red-100/50 rounded-xl p-2.5 space-y-0.5">
                            <span className="text-[9px] text-slate-400 font-black uppercase flex items-center gap-1">
                              <PhoneCall className="w-3 h-3 text-red-500" /> ফোন নম্বর(সমূহ)
                            </span>
                            <span className="text-xs font-bold text-red-600 tracking-wide">{scam.phoneNumber}</span>
                          </div>
                          
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-0.5">
                            <span className="text-[9px] text-slate-400 font-black uppercase flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" /> ঠিকানা বা এলাকা
                            </span>
                            <span className="text-xs font-bold text-slate-700 line-clamp-1">{scam.location}</span>
                          </div>
                        </div>

                        {/* Detailed Description */}
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-400 font-black uppercase">অভিযোগ ও ঘটনার বিবরণ:</span>
                          <p className="text-xs text-slate-600 leading-relaxed font-light">
                            {scam.description}
                          </p>
                        </div>

                        {/* Evidence Files Preview snippet */}
                        {scam.evidenceFiles && scam.evidenceFiles.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-2">
                            <span className="text-[9.5px] font-black text-slate-500 flex items-center gap-1 self-center">
                              📁 সংগৃহীত প্রমাণ ({scam.evidenceFiles.length}):
                            </span>
                            {scam.evidenceFiles.map((file, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSelectedScamAlert(scam);
                                  setShowScamDetailModal(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition"
                              >
                                <FileText className="w-3 h-3 text-slate-500" />
                                <span className="max-w-[120px] truncate">{file.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer Info & Action row */}
                      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="text-[10px] text-slate-500">
                          <span>পোস্ট করেছেন: </span>
                          <span className="font-bold text-slate-700">{scam.postedBy.name}</span>
                          <span className="mx-1.5">•</span>
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wide">
                            {scam.postedBy.role === 'super_admin' ? 'সুপার অ্যাডমিন' : 'স্টাফ'}
                          </span>
                        </div>

                        <button
                          id={`scam-view-details-btn-${scam.id}`}
                          onClick={() => {
                            setSelectedScamAlert(scam);
                            setShowScamDetailModal(true);
                          }}
                          className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-red-500/10 self-end sm:self-auto"
                        >
                          <span>প্রমাণ ও বিস্তারিত দেখুন</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Submit Scam Report prompt box */}
            <div className="bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="text-sm font-black flex items-center justify-center md:justify-start gap-1">
                  💡 আপনি কি কোনো এজেন্ট বা এজেন্সির মাধ্যমে প্রতারণার শিকার হয়েছেন?
                </h3>
                <p className="text-[11px] text-white/90 leading-relaxed font-light">
                  আমাদের প্রমাণসহ লিখিত অভিযোগ জানান। আমাদের উইং আপনার অভিযোগ খতিয়ে দেখে সত্যতা পেলে প্রতারকদের তালিকা প্রকাশ করবে।
                </p>
              </div>
              <button
                onClick={() => {
                  alert('প্রতারণার অভিযোগ দায়ের করার জন্য দয়া করে support@probashi.com ইমেইলে সমস্ত রসিদ, ফোন রেকর্ড বা চ্যাট স্ক্রিনশট এবং লিখিত বিবৃতি পাঠিয়ে দিন। আমাদের অ্যান্টি-ফ্রড সেল ২৪ ঘণ্টার মধ্যে রিপ্লাই দেবে।');
                }}
                className="px-5 py-2.5 bg-white text-red-600 hover:bg-slate-100 rounded-xl text-xs font-black transition shadow-lg shrink-0"
              >
                প্রমাণসহ অভিযোগ পাঠান
              </button>
            </div>
          </div>
        )}

        {/* VIEW 5: ABOUT US */}
        {currentPage === 'about' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2.5">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-4xl mx-auto shadow-inner">
                🌏
              </div>
              <h2 className="text-xl font-black text-slate-800">আমাদের সম্পর্কে (About Us)</h2>
              <p className="text-xs text-indigo-600 font-bold">Probashi Jobs Portal-এ আপনাকে স্বাগতম</p>
            </div>

            {/* Intro statement */}
            <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100 text-slate-700 text-xs md:text-sm leading-relaxed text-center font-medium max-w-2xl mx-auto">
              আমাদের লক্ষ্য হলো বিদেশে চাকরি খুঁজছেন এমন চাকরিপ্রার্থীদের এবং বিশ্বস্ত নিয়োগকর্তা/রিক্রুটিং এজেন্সির মধ্যে একটি নিরাপদ, স্বচ্ছ এবং প্রযুক্তিনির্ভর সংযোগ তৈরি করা।
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 text-slate-700 text-xs flex gap-3 items-start max-w-2xl mx-auto">
              <span className="text-xl">🛡️</span>
              <div>
                <strong>যাচাইকরণ নিশ্চয়তা (Verification System):</strong> আমাদের প্ল্যাটফর্মে প্রতিটি কোম্পানি, চাকরির বিজ্ঞপ্তি, visa ডকুমেন্ট এবং পেমেন্ট ধাপে ধাপে <strong>Admin ও Staff দ্বারা যাচাই (Verification)</strong> করা হয়। এর ফলে প্রতারণার ঝুঁকি কমে এবং চাকরিপ্রার্থীরা আরও নিরাপদভাবে বিদেশে চাকরির জন্য আবেদন করতে পারেন।
              </div>
            </div>

            {/* Grid for Services and Why choose us */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Our Services */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1.5 border-b border-indigo-100 pb-2">
                  <span>💼</span> আমাদের সেবাসমূহ (Our Services)
                </h3>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex gap-2.5 items-start">
                    <span className="text-indigo-500 font-bold">🌍</span>
                    <span>বিভিন্ন দেশের বিদেশি চাকরির সুযোগ</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-indigo-500 font-bold">🏢</span>
                    <span>যাচাইকৃত (Verified) কোম্পানি ও রিক্রুটিং এজেন্সি</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-indigo-500 font-bold">📄</span>
                    <span>অনলাইনে চাকরির আবেদন</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-indigo-500 font-bold">🛂</span>
                    <span>ভিসা ও অফার লেটার যাচাইকরণ</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-indigo-500 font-bold">💳</span>
                    <span>নিরাপদ পেমেন্ট ট্র্যাকিং ও ভেরিফিকেশন</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-indigo-500 font-bold">📑</span>
                    <span>ডকুমেন্ট আপলোড ও সংরক্ষণ</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-indigo-500 font-bold">📊</span>
                    <span>আবেদন ও ভিসা প্রক্রিয়ার লাইভ স্ট্যাটাস</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-indigo-500 font-bold">💬</span>
                    <span>চাকরিপ্রার্থী, নিয়োগকর্তা ও অ্যাডমিনের মধ্যে সরাসরি যোগাযোগ</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-indigo-500 font-bold">📱</span>
                    <span>Website ও Mobile App থেকে সহজ ব্যবহার</span>
                  </li>
                </ul>
              </div>

              {/* Why choose us */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1.5 border-b border-indigo-100 pb-2">
                  <span>⭐</span> কেন আমাদের বেছে নেবেন? (Why Choose Us?)
                </h3>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex gap-2.5 items-start">
                    <span className="text-emerald-500">✅</span>
                    <span>যাচাইকৃত নিয়োগকর্তা</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-emerald-500">✅</span>
                    <span>স্বচ্ছ নিয়োগ প্রক্রিয়া</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-emerald-500">✅</span>
                    <span>নিরাপদ ডকুমেন্ট ব্যবস্থাপনা</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-emerald-500">✅</span>
                    <span>প্রতিটি পেমেন্টের প্রমাণ সংরক্ষণ</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-emerald-500">✅</span>
                    <span>Admin ও Staff Verification System</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-emerald-500">✅</span>
                    <span>রিয়েল-টাইম নোটিফিকেশন ও স্ট্যাটাস আপডেট</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="text-emerald-500">✅</span>
                    <span>আবেদন থেকে বিদেশে যাত্রা পর্যন্ত সম্পূর্ণ ট্র্যাকিং</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Target & Commitment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-left">
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                  🚀 আমাদের লক্ষ্য (Our Mission)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  প্রযুক্তির মাধ্যমে বিদেশে চাকরি পাওয়ার পুরো প্রক্রিয়াকে সহজ, নিরাপদ এবং স্বচ্ছ করা, যাতে চাকরিপ্রার্থী, নিয়োগকর্তা এবং রিক্রুটিং এজেন্সি একটি নির্ভরযোগ্য প্ল্যাটফর্মে কাজ করতে পারে।
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                  🤝 আমাদের অঙ্গীকার (Our Commitment)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  আমরা একটি নিরাপদ, নির্ভরযোগ্য এবং আধুনিক <strong>Probashi Jobs Portal</strong> গড়ে তুলতে প্রতিশ্রুতিবদ্ধ, যেখানে প্রতিটি চাকরির সুযোগ, ভিসা প্রক্রিয়া এবং পেমেন্ট যথাযথভাবে যাচাই করা হবে এবং প্রতিটি ধাপের ডিজিটাল রেকর্ড সংরক্ষিত থাকবে। আমাদের লক্ষ্য হলো প্রবাসে কর্মসংস্থান প্রক্রিয়াকে আরও স্বচ্ছ, সহজ এবং বিশ্বাসযোগ্য করে তোলা।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: CONTACT & PAYMENT GUIDELINES */}
        {currentPage === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Contact Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-500" /> যেকোনো জিজ্ঞাসায় বার্তা পাঠান
              </h3>

              {contactSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center space-y-1.5">
                  <CheckCircle className="w-8 h-8 mx-auto text-emerald-500" />
                  <p className="text-xs font-bold text-slate-800">বার্তা সফলভাবে পাঠানো হয়েছে!</p>
                  <p className="text-[10.5px] text-slate-500">আমাদের সাপোর্ট টিম অত্যন্ত দ্রুত আপনার ইমেইলে যোগাযোগ করবে।</p>
                </div>
              ) : (
                <form id="web-contact-form" onSubmit={handleContactSubmit} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">আপনার নাম</label>
                    <input 
                      type="text" 
                      required
                      placeholder="যেমন: সাকিব আল হাসান"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full py-2 px-3 border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">ইমেইল এড্রেস</label>
                    <input 
                      type="email" 
                      required
                      placeholder="sakib@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full py-2 px-3 border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">বার্তা / মেসেজ</label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="এখানে আপনার জিজ্ঞাসাটি বিস্তারিতভাবে লিখুন..."
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full py-2 px-3 border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 text-slate-800 resize-none"
                    />
                  </div>

                  <button 
                    id="web-contact-submit"
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center gap-1 transition"
                  >
                    <Send className="w-3.5 h-3.5" /> মেসেজ পাঠান
                  </button>
                </form>
              )}
            </div>

            {/* Payment manual instruction (bKash/Nagad) */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-400" /> বিকাশ ও নগদ পেমেন্ট নির্দেশিকা
                </h3>

                <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                  নিয়োগকর্তাগণ তাদের চাকরির সার্কুলারগুলোকে প্রিমিয়াম বা ফিচার্ড তালিকায় স্থান দিতে বিকাশ/নগদের মার্চেন্ট নম্বরে পেমেন্ট করতে পারবেন।
                </p>

                <div className="space-y-2 text-[10.5px] p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 font-mono">
                  <p className="text-pink-400 font-bold">📱 bKash Merchant (Manual/API):</p>
                  <p className="text-slate-300 pl-4">1. Dial *247# or open bKash App</p>
                  <p className="text-slate-300 pl-4">2. Choose "Payment" to <span className="text-white font-bold">01799887766</span></p>
                  <p className="text-slate-300 pl-4">3. Amount: <span className="text-white font-bold">৳২,৫০০</span></p>
                  
                  <p className="text-orange-400 font-bold mt-2">📱 Nagad Merchant:</p>
                  <p className="text-slate-300 pl-4">1. Pay to Merchant wallet <span className="text-white font-bold">01988776655</span></p>
                </div>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 text-[10.5px] text-slate-400 leading-normal font-light">
                ⚠️ <strong>নোট:</strong> পেমেন্ট করার পর প্রাপ্ত <strong className="text-slate-300 font-bold">TxID</strong> টি প্যানেলে প্রদান করতে হবে। অ্যাডমিন তাত্ক্ষণিকভাবে ড্যাশবোর্ড থেকে তা পর্যবেক্ষণ করে প্রিমিয়াম পোস্টিং লাইভ করে দেবেন।
              </div>
            </div>

          </div>
        )}

        {/* VIEW 6_2: ITALY WORK VISA APPLY PACKAGE */}
        {currentPage === 'italy-package' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-slate-100 to-rose-600 p-[1.5px] rounded-3xl shadow-lg">
              <div className="bg-slate-900 rounded-[22px] p-6 md:p-8 text-center space-y-4 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl"></div>
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] text-emerald-400 font-extrabold tracking-wider">
                  🇮🇹 ITALY WORK VISA APPLY PACKAGES
                </div>
                
                <h2 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-200">
                  ইতালি ওয়ার্ক ভিসা সেলফ-আবেদন প্রসেসিং অ্যাসিস্ট্যান্স
                </h2>
                
                <p className="text-[11px] text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
                  আমাদের প্রফেশনাল টিম আপনার সমস্ত নথিপত্র রিভিও করে আন্তর্জাতিক মানের ইউরোপাস সিভি ও কভার লেটার প্রস্তুত করবে এবং ইতালির স্বনামধন্য কোম্পানিতে ইমেইলে আবেদনের পূর্ণাঙ্গ সাপোর্ট প্রদান করবে।
                </p>
              </div>
            </div>

            {/* Guaranteed Visa Warning & Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 space-y-3 shadow-sm">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider">
                    🚨 গ্যারান্টি সতর্কতা ও লিগ্যাল নোটিশ (Disclaimer)
                  </h3>
                  <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    <strong>ইতালির ওয়ার্ক ভিসা বা নুলা ওস্তা (Nulla Osta) পাওয়ার কোনো শতভাগ গ্যারান্টি কোনো ব্যক্তি বা প্রতিষ্ঠান দিতে পারে না।</strong> নুলা ওস্তা জারির বিষয়টি সম্পূর্ণভাবে ইতালির শ্রম মন্ত্রণালয় ও প্রিফেকচুরা (Prefettura) এবং visa প্রদানের বিষয়টি ঢাকাস্থ ইতালি দূতাবাসের এখতিয়ারাধীন। 
                  </p>
                  <p className="text-[10.5px] text-amber-700 leading-relaxed font-light">
                    আমরা এখানে কোনো ভুয়া কাজের অফার বিক্রি করি না। আমরা আপনাকে ইতালির বৈধ স্পন্সরদের নিকট সঠিকভাবে আবেদন করার জন্য প্রফেশনাল ডকুমেন্টেশন, সিভি-কভার লেটার রাইটিং, চাকরি খোঁজার রিয়েল-টাইম পরামর্শ এবং আবেদন ট্র্যাকিং গাইডলাইন সরবরাহ করে থাকি। কোনো ধরনের প্রতারণামূলক বিজ্ঞাপনে বিভ্রান্ত হবেন না।
                  </p>
                </div>
              </div>
            </div>

            {/* Three Tiers Pricing Table */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* BASIC PACKAGE */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition relative flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full tracking-wider">
                      Basic Package
                    </span>
                    <h4 className="text-sm font-black text-slate-850">প্রাথমিক আবেদন প্যাকেজ</h4>
                    <p className="text-[10.5px] text-slate-400 font-light">নিজে নিজে আবেদনের জন্য প্রয়োজনীয় ডকুমেন্ট ও ফরম্যাট রেডি করুন।</p>
                  </div>

                  <div className="py-2 border-y border-slate-100">
                    <span className="text-xl font-black text-slate-800">৳২,৫০০</span>
                    <span className="text-[10px] text-slate-400 ml-1">/ এককালীন</span>
                  </div>

                  <ul className="space-y-2 text-[10.5px] text-slate-600 font-light">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>প্রফেশনাল <strong>Europass CV</strong> (ইতালি স্ট্যান্ডার্ড)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>প্রফেশনাল <strong>Cover Letter</strong> (জব ম্যাচিং)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>পাসপোর্ট এবং ডকুমেন্ট চেক</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>চাকরি খোঁজার পরামর্শ ও আবেদন গাইড</span>
                    </li>
                  </ul>
                </div>

                <button 
                  id="btn-apply-italy-basic"
                  onClick={() => {
                    setSelectedPackageForApply('Basic');
                    setItalyApplySuccess(false);
                    const element = document.getElementById('italy-apply-form-section');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-[11px] transition"
                >
                  বেসিক প্যাকেজ পছন্দ করুন
                </button>
              </div>

              {/* STANDARD PACKAGE */}
              <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 shadow-md hover:shadow-lg transition relative flex flex-col justify-between space-y-6">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-emerald-500 text-white text-[9px] font-extrabold uppercase rounded-full tracking-wider shadow-sm">
                  ★ সর্বাধিক জনপ্রিয় (Best Value)
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full tracking-wider">
                      Standard Package
                    </span>
                    <h4 className="text-sm font-black text-slate-850">স্মার্ট জব সিকিং সাপোর্ট</h4>
                    <p className="text-[10.5px] text-slate-400 font-light">আমাদের অ্যাসিস্ট্যান্স টিম ইতালির কোম্পানিতে সরাসরি আবেদন সাবমিট করবে।</p>
                  </div>

                  <div className="py-2 border-y border-slate-100">
                    <span className="text-xl font-black text-emerald-600">৳৬,০০০</span>
                    <span className="text-[10px] text-slate-400 ml-1">/ এককালীন</span>
                  </div>

                  <ul className="space-y-2 text-[10.5px] text-slate-600 font-light">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>প্রফেশনাল <strong>Europass CV</strong> তৈরি</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>প্রফেশনাল <strong>Cover Letter</strong> রাইটিং</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>ইতালির ১টি নির্ধারিত খাতে <strong>Job Application</strong></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>আবেদন ট্র্যাকিং ও স্ক্রিনশট শেয়ারিং</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>ইন্টারভিউ টিপস ও ইমেইল ফলো-আপ গাইড</span>
                    </li>
                  </ul>
                </div>

                <button 
                  id="btn-apply-italy-standard"
                  onClick={() => {
                    setSelectedPackageForApply('Standard');
                    setItalyApplySuccess(false);
                    const element = document.getElementById('italy-apply-form-section');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-[11px] shadow-sm transition"
                >
                  স্ট্যান্ডার্ড প্যাকেজ পছন্দ করুন
                </button>
              </div>

              {/* PREMIUM PACKAGE */}
              <div className="bg-slate-900 border border-slate-850 text-white rounded-3xl p-6 shadow-sm hover:shadow-md transition relative flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-amber-500/15 text-amber-400 rounded-full tracking-wider">
                      Premium Package
                    </span>
                    <h4 className="text-sm font-black text-slate-100">ভিআইপি আবেদন প্রসেসিং</h4>
                    <p className="text-[10.5px] text-slate-400 font-light">মাল্টিপল আবেদন, নুলা ওস্তা প্রসেস ট্র্যাকিং ও সম্পূর্ণ প্রফেশনাল গাইডেন্স।</p>
                  </div>

                  <div className="py-2 border-y border-slate-800">
                    <span className="text-xl font-black text-amber-400">৳১২,৫০০</span>
                    <span className="text-[10px] text-slate-400 ml-1">/ এককালীন</span>
                  </div>

                  <ul className="space-y-2 text-[10.5px] text-slate-300 font-light">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>প্রফেশনাল <strong>Europass CV</strong> ও স্পেশাল ডিজাইন</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>ইতালি/ইংরেজি উভয় ভাষায় <strong>Cover Letter</strong></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>ইতালির <strong>একাধিক সেক্টরের কোম্পানিতে</strong> সরাসরি আবেদন</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Nulla Osta</strong> সরকারি পোর্টাল ট্র্যাকিং গাইড</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>ভিআইপি ইন্টারভিউ প্রিপারেশন সেশন (অনлайн)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>২৪/৭ ডেডিকেটেড ইমেইল ও হোয়াটসঅ্যাপ সাপোর্ট</span>
                    </li>
                  </ul>
                </div>

                <button 
                  id="btn-apply-italy-premium"
                  onClick={() => {
                    setSelectedPackageForApply('Premium');
                    setItalyApplySuccess(false);
                    const element = document.getElementById('italy-apply-form-section');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-extrabold rounded-xl text-[11px] transition"
                >
                  প্রিমিয়াম প্যাকেজ পছন্দ করুন
                </button>
              </div>

            </div>

            {/* Interactive Apply Form Section */}
            <div id="italy-apply-form-section" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
              <div className="space-y-1 text-center">
                <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center text-xl mx-auto shadow-inner">
                  📝
                </div>
                <h3 className="text-xs font-black text-slate-800">
                  {selectedPackageForApply 
                    ? `আপনি "${selectedPackageForApply === 'Basic' ? 'প্রাথমিক আবেদন প্যাকেজ' : selectedPackageForApply === 'Standard' ? 'স্মার্ট জব সিকিং সাপোর্ট' : 'ভিআইপি আবেদন প্রসেসিং'}" সিলেক্ট করেছেন`
                    : 'ইতালি প্যাকেজ আবেদনের তথ্য ফরম'}
                </h3>
                <p className="text-[10.5px] text-slate-400 font-light">
                  নিচের ফরমে আপনার সঠিক তথ্য প্রদান করুন। আমাদের অ্যাসিস্ট্যান্ট টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।
                </p>
              </div>

              {italyApplySuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-3 animate-fade-in">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-lg shadow-sm">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-emerald-900">আপনার সাবমিশন সফল হয়েছে!</h4>
                    <p className="text-[10.5px] text-emerald-700 leading-normal font-light">
                      ধন্যবাদ! ইতালির ওয়ার্ক ভিসা আবেদন প্রসেসিংয়ের জন্য আপনার রিকোয়েস্টটি আমাদের সিস্টেমে সফলভাবে জমা হয়েছে। খুব শীঘ্রই আমাদের একজন কনসালট্যান্ট আপনার ইমেইল ({italyApplyEmail}) অথবা মোবাইল নম্বরে যোগাযোগ করবেন।
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] text-slate-400">
                    আপনি আপনার ড্যাশবোর্ডে গিয়ে এই আবেদনের লাইভ আপডেট ও অগ্রগতি ট্র্যাক করতে পারবেন।
                  </div>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!selectedPackageForApply) {
                      alert('দয়া করে প্রথমে উপর থেকে একটি প্যাকেজ নির্বাচন করুন।');
                      return;
                    }
                    if (!italyApplyName || !italyApplyPhone || !italyApplyPassport) {
                      alert('দয়া করে নাম, মোবাইল নম্বর এবং পাসপোর্ট নম্বর সঠিক লিখুন।');
                      return;
                    }
                    
                    onApplyItalyPackage(
                      selectedPackageForApply,
                      italyApplyName,
                      italyApplyEmail,
                      italyApplyPhone,
                      italyApplyPassport,
                      italyApplyMsg
                    );
                    setItalyApplySuccess(true);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-slate-750 flex items-center gap-1">
                        মনোনীত প্যাকেজ <span className="text-rose-500">*</span>
                      </label>
                      <select 
                        required
                        value={selectedPackageForApply || ''}
                        onChange={(e) => setSelectedPackageForApply(e.target.value as any || null)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- একটি প্যাকেজ বেছে নিন --</option>
                        <option value="Basic">Basic Package (৳২,৫০০)</option>
                        <option value="Standard">Standard Package (৳৬,০০০)</option>
                        <option value="Premium">Premium Package (৳১২,৫০০)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-slate-750">
                        পূর্ণ নাম (পাসপোর্ট অনুযায়ী) <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={italyApplyName}
                        onChange={(e) => setItalyApplyName(e.target.value)}
                        placeholder="যেমন: Ariful Islam"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-slate-755">ইমেইল ঠিকানা</label>
                      <input 
                        type="email"
                        value={italyApplyEmail}
                        onChange={(e) => setItalyApplyEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-slate-755">
                        মোবাইল নম্বর <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="tel"
                        required
                        value={italyApplyPhone}
                        onChange={(e) => setItalyApplyPhone(e.target.value)}
                        placeholder="017xxxxxxxx"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-slate-755">
                        পাসপোর্ট নম্বর <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={italyApplyPassport}
                        onChange={(e) => setItalyApplyPassport(e.target.value)}
                        placeholder="EH1234567"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-slate-750">অতিরিক্ত বিবরণ বা কোনো কাজের ক্যাটাগরি থাকলে উল্লেখ করুন</label>
                    <textarea 
                      value={italyApplyMsg}
                      onChange={(e) => setItalyApplyMsg(e.target.value)}
                      rows={3}
                      placeholder="যেমন: কনস্ট্রাকশন, ড্রাইভিং অথবা হোটেল বয় হিসেবে কাজ করতে চাই..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 resize-none"
                    ></textarea>
                  </div>

                  <button 
                    id="submit-italy-apply-btn"
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition"
                  >
                    <span>🇮🇹 সাবমিট করুন ও বুকিং সম্পূর্ণ করুন</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* VIEW 7: MULTI-ROLE DASHBOARDS */}
        {currentPage === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Seeker Dashboard */}
            {currentUserType === 'seeker' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Seeker Topbar Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-lg font-black shrink-0">
                      👤
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-800 leading-none">স্বাগতম, {currentUser?.name || applicantName}</h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        {lang === 'bn' ? 'প্রার্থী ড্যাশবোর্ড (Candidate Dashboard)' : 'Candidate Dashboard Panel'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSeekerDashboardTab('dashboard');
                      setCurrentPage('home');
                      onLogout();
                    }}
                    className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-[11px] font-black bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition cursor-pointer self-stretch sm:self-auto justify-center"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
                  </button>
                </div>
                
                {/* Seeker Dashboard Tab Selector */}
                <div className="grid grid-cols-2 md:grid-cols-7 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-2 w-full">
                  <button 
                    onClick={() => setSeekerDashboardTab('dashboard')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black text-center transition flex items-center justify-center gap-1.5 ${seekerDashboardTab === 'dashboard' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-850 hover:bg-slate-50'}`}
                  >
                    <Briefcase className="w-4 h-4 shrink-0" /> 
                    <span>{lang === 'bn' ? 'আবেদন ও রেকর্ড' : 'Applications'} ({appliedJobIds.length})</span>
                  </button>
                  <button 
                    id="seeker-italy-tracking-tab"
                    onClick={() => setSeekerDashboardTab('italy')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black text-center transition flex items-center justify-center gap-1.5 ${seekerDashboardTab === 'italy' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-850 hover:bg-slate-50'}`}
                  >
                    <span className="text-sm">🇮🇹</span>
                    <span>{lang === 'bn' ? 'ভিসা ও ট্র্যাকিং' : 'Visa & Italy'}</span>
                  </button>
                  <button 
                    onClick={() => setSeekerDashboardTab('bank')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black text-center transition flex items-center justify-center gap-1.5 ${seekerDashboardTab === 'bank' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-850 hover:bg-slate-50'}`}
                  >
                    <Landmark className="w-4 h-4 shrink-0" /> 
                    <span>{lang === 'bn' ? 'ব্যাংক হিসাব' : 'Agency Bank'}</span>
                  </button>
                  <button 
                    onClick={() => setSeekerDashboardTab('profile')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black text-center transition flex items-center justify-center gap-1.5 ${seekerDashboardTab === 'profile' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-850 hover:bg-slate-50'}`}
                  >
                    <User className="w-4 h-4 shrink-0" /> 
                    <span>{lang === 'bn' ? 'আমার প্রোফাইল' : 'My Profile'}</span>
                  </button>
                  <button 
                    onClick={() => setSeekerDashboardTab('documents')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black text-center transition flex items-center justify-center gap-1.5 ${seekerDashboardTab === 'documents' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-850 hover:bg-slate-50'}`}
                  >
                    <FileText className="w-4 h-4 shrink-0" /> 
                    <span>{lang === 'bn' ? 'আমার নথিপত্র' : 'My Documents'}</span>
                  </button>
                  <button 
                    onClick={() => setSeekerDashboardTab('messages')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black text-center transition flex items-center justify-center gap-1.5 ${seekerDashboardTab === 'messages' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-850 hover:bg-slate-50'}`}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" /> 
                    <span>{lang === 'bn' ? 'বার্তা ও ইনবক্স' : 'Messages'}</span>
                  </button>
                  <button 
                    onClick={() => setSeekerDashboardTab('settings')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black text-center transition flex items-center justify-center gap-1.5 ${seekerDashboardTab === 'settings' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-850 hover:bg-slate-50'}`}
                  >
                    <Key className="w-4 h-4 shrink-0" /> 
                    <span>{lang === 'bn' ? 'সেটিংস' : 'Settings'}</span>
                  </button>
                </div>

                {seekerDashboardTab === 'dashboard' ? (
                  <SeekerDashboardView
                    applicantName={applicantName}
                    applicantEmail={applicantEmail}
                    applicantPhone={applicantPhone}
                    appliedJobIds={appliedJobIds}
                    jobs={jobs}
                    applications={applications}
                    setCurrentPage={setCurrentPage}
                    setSeekerDashboardTab={setSeekerDashboardTab}
                    profilePhotoUrl={profilePhotoUrl}
                    setProfilePhotoUrl={setProfilePhotoUrl}
                    uploadedPhotoName={uploadedPhotoName}
                    setUploadedPhotoName={setUploadedPhotoName}
                    onApplyJob={onApplyJob}
                  />
                ) : seekerDashboardTab === 'bank' ? (
                  <CandidateBankViewer
                    bankAccounts={bankAccounts}
                    clientPayments={clientPayments}
                    adminBankSettings={adminBankSettings}
                    companies={companies}
                    assignedAgencyId={companies[0]?.id || currentEmployerCompanyId || 'comp_1'}
                    candidateEmail={currentSeekerEmail || currentUser?.email || 'seeker@example.com'}
                    candidateName={applicantName || currentUser?.name || 'চাকরিপ্রার্থী'}
                    onSubmitClientPayment={onSubmitClientPayment}
                  />
                ) : seekerDashboardTab === 'italy' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left col: Profile status and Resume Manager */}
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="text-center pb-2">
                          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-black mx-auto mb-3 shadow-inner">
                            👤
                          </div>
                          <h3 className="text-sm font-black text-slate-800">{applicantName}</h3>
                          <p className="text-[10.5px] text-slate-500 font-semibold mt-0.5">{applicantEmail} | {applicantPhone}</p>
                          <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold rounded-full">
                            ✈️ প্রবাসী চাকরিপ্রার্থী
                          </span>
                        </div>

                        <div className="pt-3 border-t border-slate-100 space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-semibold">প্রোফাইল সম্পন্নতা:</span>
                            <span className="font-extrabold text-emerald-600">১০০%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                      </div>

                      {/* CV Upload */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                        <span className="text-[10.5px] font-black block text-slate-400 uppercase tracking-wider">জীবনবৃত্তান্ত ফাইল (CV)</span>
                        
                        <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center">
                          <FileText className="w-7 h-7 text-emerald-500 mb-1" />
                          <span className="text-xs font-semibold text-slate-800 block truncate max-w-full">
                            {uploadedCVName}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-0.5">PDF ফরম্যাট • সাইজ: ১.২ MB</span>
                        </div>

                        <div className="flex gap-2 text-xs pt-1">
                          <input 
                            type="file" 
                            id="web-cv-file-input" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setUploadedCVName(file.name);
                            }}
                          />
                          <label 
                            htmlFor="web-cv-file-input"
                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 text-center transition"
                          >
                            <Upload className="w-3.5 h-3.5 text-slate-500" /> ফাইল আপডেট করুন
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Right col: Applications track and Bookmarks (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Applications History */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-emerald-500" /> আমার চাকরির আবেদনের অগ্রগতি ({appliedJobIds.length})
                        </h3>

                        <div className="space-y-3.5">
                          {appliedJobIds.length > 0 ? (
                            jobs.filter(j => appliedJobIds.includes(j.id)).map((job) => {
                              const appModel = applications.find(a => a.jobId === job.id && a.candidateEmail.toLowerCase() === currentSeekerEmail.toLowerCase());
                              const appStatus = appModel ? appModel.status : 'Pending';
                              const appInterviewDate = appModel ? appModel.interviewDate : undefined;

                              return (
                                <div 
                                  key={job.id} 
                                  id={`web-seeker-app-${job.id}`}
                                  onClick={() => {
                                    if (appModel) {
                                      setSelectedWebApplicationDetail(appModel);
                                    }
                                  }}
                                  className="p-4 border border-slate-150 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40 hover:bg-emerald-50/20 hover:border-emerald-200 cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-md"
                                  title="আবেদনের বিস্তারিত ও স্থিতি দেখতে ক্লিক করুন"
                                >
                                  <div className="flex gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-150 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform duration-200">
                                      {job.companyLogo}
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors">{job.title}</h4>
                                      <p className="text-[10px] text-slate-500 font-semibold">{job.companyName}</p>
                                      
                                      {appInterviewDate ? (
                                        <p className="text-[9.5px] text-indigo-600 font-bold mt-1.5 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md w-fit">
                                          <Calendar className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> সাক্ষাত্কার: {new Date(appInterviewDate).toLocaleString('bn-BD', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                        </p>
                                      ) : (
                                        <p className="text-[9px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                                          <span>📅 আবেদন তারিখ: {appModel ? appModel.appliedAt : job.postedAt}</span>
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 self-start sm:self-center">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                                      appStatus === 'Shortlisted' ? 'bg-indigo-50 text-indigo-600 border-indigo-200 animate-pulse' :
                                      appStatus === 'Rejected' ? 'bg-rose-50 text-rose-500 border-rose-200' :
                                      'bg-amber-50 text-amber-600 border-amber-200'
                                    }`}>
                                      {appStatus === 'Shortlisted' ? 'শর্টলিস্টেড' : appStatus === 'Rejected' ? 'নাকচকৃত' : 'প্রক্রিয়াধীন'}
                                    </span>
                                    <span className="text-[10px] text-emerald-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 hidden sm:inline">
                                      বিস্তারিত দেখুন →
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-10 text-slate-400">
                              <p className="text-xs">আপনি এখনো কোনো চাকরিতে আবেদন করেননি।</p>
                              <button 
                                id="dashboard-explore-jobs"
                                onClick={() => setCurrentPage('jobs')}
                                className="text-xs text-emerald-500 hover:underline font-bold mt-2"
                              >
                                চাকরি খুঁজুন ও আবেদন করুন
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Saved / Bookmarks List */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                          <Bookmark className="w-4 h-4 text-emerald-500" /> সংরক্ষিত চাকরির তালিকা ({savedJobs.length})
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {savedJobs.length > 0 ? (
                            jobs.filter(j => savedJobs.includes(j.id)).map((job) => (
                              <div key={job.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center text-xs hover:shadow-sm transition">
                                <div className="min-w-0">
                                  <h4 
                                    onClick={() => setSelectedWebJob(job)}
                                    className="font-bold text-slate-800 hover:text-emerald-500 cursor-pointer truncate"
                                  >
                                    {job.title}
                                  </h4>
                                  <p className="text-[9.5px] text-slate-400 truncate mt-0.5">{job.companyName}</p>
                                </div>
                                <button 
                                  id={`unsave-btn-dashboard-${job.id}`}
                                  onClick={() => onToggleSaveJob(job.id)}
                                  className="text-xs text-rose-500 hover:text-rose-600 font-bold px-2 py-1 transition"
                                >
                                  ✕
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-400 text-xs text-center py-6 col-span-2">কোনো চাকরি সংরক্ষিত নেই।</p>
                          )}
                        </div>
                      </div>

                      {/* Web Portal Notifications Feed */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                          <span>🔔 নোটিফিকেশন সমূহ ({notifications.filter(n => !n.isRead).length}টি অপঠিত)</span>
                        </h3>

                        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                          {notifications && notifications.length > 0 ? (
                            notifications.slice().reverse().map((notif) => (
                              <div 
                                key={notif.id}
                                id={`web-notif-item-${notif.id}`}
                                onClick={() => {
                                  onMarkNotificationAsRead(notif.id);
                                  setSelectedNotifDetail(notif);
                                }}
                                className={`p-3 border rounded-xl flex gap-3 cursor-pointer transition-all duration-200 group ${
                                  !notif.isRead 
                                    ? 'bg-emerald-50/40 border-emerald-200/60 hover:bg-emerald-50/80 hover:border-emerald-300 shadow-sm' 
                                    : 'bg-slate-50/30 border-slate-150 hover:bg-slate-50'
                                }`}
                                title="ক্লিক করে নোটিফিকেশনের বিস্তারিত দেখুন"
                              >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm ${
                                  !notif.isRead ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400'
                                }`}>
                                  🔔
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-2">
                                    <h4 className={`text-xs font-bold leading-tight truncate group-hover:text-emerald-600 transition-colors ${
                                      !notif.isRead ? 'text-slate-900 font-black' : 'text-slate-700'
                                    }`}>
                                      {notif.title}
                                    </h4>
                                    <span className="text-[9px] font-mono text-slate-400 shrink-0">{notif.sentAt}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 mt-1 truncate">{notif.message}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-slate-400">
                              <p className="text-xs">কোনো নোটিফিকেশন পাওয়া যায়নি।</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Seeker Payment & Receipts History */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                            <span>💳 আমার পেমেন্ট ও রশিদ রিসিট ইতিহাস (Payment History)</span>
                          </h3>
                          <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full">
                            মোট: {transactions.filter(t => t.applicantName?.toLowerCase().includes("ariful") || t.companyName?.toLowerCase().includes("ariful")).length}টি পেমেন্ট
                          </span>
                        </div>

                        <div className="space-y-3">
                          {transactions.filter(t => t.applicantName?.toLowerCase().includes("ariful") || t.companyName?.toLowerCase().includes("ariful")).length > 0 ? (
                            transactions
                              .filter(t => t.applicantName?.toLowerCase().includes("ariful") || t.companyName?.toLowerCase().includes("ariful"))
                              .slice()
                              .reverse()
                              .map((tx) => (
                                <div key={tx.id} className="p-4 border border-slate-150 rounded-2xl bg-slate-50/40 space-y-3">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div>
                                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                        tx.paymentType === 'Office' 
                                          ? 'bg-teal-50 text-teal-700 border border-teal-100'
                                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                      }`}>
                                        {tx.paymentType === 'Office' ? '🏢 অফিস ম্যানুয়াল রশিদ' : '🌐 অনলাইন পোর্টাল পেমেন্ট'}
                                      </span>
                                      <h4 className="text-xs font-extrabold text-slate-800 mt-1">{tx.planName || tx.jobTitle || 'প্যাকেজ বুকিং ও প্রসেসিং ফি'}</h4>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-black text-slate-800 font-mono">৳{tx.amount.toLocaleString()}</span>
                                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                                        tx.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                        tx.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-200 animate-pulse' :
                                        tx.status === 'Under Review' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                                        tx.status === 'Correction Requested' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                                        'bg-rose-50 text-rose-600 border border-rose-200'
                                      }`}>
                                        {tx.status === 'Approved' ? 'ভেরিফাইড ও অনুমোদিত' :
                                         tx.status === 'Pending' ? 'পেন্ডিং (অপেক্ষমাণ)' :
                                         tx.status === 'Under Review' ? 'যাচাই করা হচ্ছে' :
                                         tx.status === 'Correction Requested' ? 'সংশোধন আবশ্যক' : 'বাতিলকৃত'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-[10px]">
                                    <div>
                                      <span className="text-slate-400 block font-semibold">পেমেন্ট মাধ্যম</span>
                                      <span className="font-extrabold text-slate-700 uppercase">{tx.method}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block font-semibold">ট্রানজেকশন ID / রশিদ</span>
                                      <span className="font-mono font-bold text-slate-600">{tx.txID || tx.receiptNumber || 'N/A'}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block font-semibold">তারিখ ও সময়</span>
                                      <span className="text-slate-500 font-mono">{tx.date || '২০২৬-০৭-০৩ ১১:০০'}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block font-semibold">ভেরিফিকেশন কর্মী</span>
                                      <span className="font-bold text-slate-600">
                                        {tx.paymentType === 'Office' 
                                          ? (tx.staffName || 'অফিস স্টাফ') 
                                          : (tx.status === 'Approved' ? 'সিস্টেম এডমিন' : 'যাচাই পেন্ডিং')}
                                      </span>
                                    </div>
                                  </div>

                                  {tx.officeBranch && (
                                    <div className="text-[10px] bg-teal-500/5 text-teal-700 px-2 py-1 rounded-lg border border-teal-500/10 inline-block font-bold">
                                      🏢 অফিস শাখা: <span className="font-black">{tx.officeBranch}</span>
                                    </div>
                                  )}

                                  {tx.remarks && (
                                    <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl text-[10px] text-slate-600 leading-relaxed font-light">
                                      <span className="font-bold text-slate-700">ভেরিফিকেশন রিমার্কস ও তথ্য:</span> {tx.remarks}
                                    </div>
                                  )}
                                </div>
                              ))
                          ) : (
                            <div className="text-center py-6 text-slate-400">
                              <p className="text-xs">আপনার কোনো পেমেন্ট বা রশিদ ইতিহাস পাওয়া যায়নি।</p>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ) : seekerDashboardTab === 'profile' ? (
                  /* My Complete Profile Form (Multi-Section Form) */
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Left Panel: Completion status & navigation shortcut list */}
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-xl shadow-inner border border-emerald-500/20">
                            👤
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800">পেশাদার প্রোফাইল</h4>
                            <p className="text-[10.5px] text-slate-500">আপনার সম্পূর্ণ প্রোফাইল সিঙ্ক রয়েছে</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                            <span>প্রোফাইল পূরণ স্ট্যাটাস:</span>
                            <span className="text-emerald-600">১০০%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full">
                            <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-400 pt-1 leading-normal">
                          💡 পাসপোর্ট, মেডিকেল ফিট রিপোর্ট, পুলিশ ক্লিয়ারেন্স এবং BMET তথ্য সঠিকভাবে প্রদান করুন। সৌদি আরব, কাতার ও কুয়েতের নিয়োগকর্তারা এই তথ্যের ভিত্তিতেই নির্বাচন নিশ্চিত করবেন।
                        </div>
                      </div>

                      {/* Sticky Quick-Save / Quick-Logout Action Card */}
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">দ্রুত অ্যাকশন (Quick Actions)</h4>
                        
                        <button 
                          onClick={() => {
                            setShowWebSaveToast(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setTimeout(() => setShowWebSaveToast(false), 4000);
                          }}
                          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                        >
                          ✨ প্রোফাইল সংরক্ষণ করুন (Save Changes)
                        </button>

                        <button 
                          onClick={() => {
                            setSeekerDashboardTab('dashboard');
                            setCurrentPage('home');
                            onLogout();
                          }}
                          className="w-full py-3 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 hover:border-rose-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>লগআউট করুন (Logout)</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Panel: The actual forms (Personal, Passport, Edu, Work, Skills, Docs, Photo) */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {showWebSaveToast && (
                        <div className="p-4 bg-emerald-500 text-slate-950 font-black rounded-2xl text-xs text-center shadow-md animate-pulse flex items-center justify-center gap-2">
                          ✨ আপনার সম্পূর্ণ প্রোফাইল তথ্য এবং আপলোডকৃত ফাইলসমূহ সফলভাবে ডেটাবেজে সংরক্ষিত হয়েছে!
                        </div>
                      )}

                      {/* CARD 1: Personal Information */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                          <User className="w-4.5 h-4.5 text-emerald-500" /> ১. ব্যক্তিগত তথ্য (Personal Information)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">সম্পূর্ণ নাম (Full Name)</label>
                            <input 
                              type="text" 
                              value={applicantName} 
                              onChange={(e) => setApplicantName(e.target.value)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                              placeholder="আপনার পূর্ণ নাম বাংলায় লিখুন"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">ইমেইল ঠিকানা (Email Address)</label>
                            <input 
                              type="email" 
                              value={applicantEmail} 
                              onChange={(e) => setApplicantEmail(e.target.value)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-mono"
                              placeholder="যেমন: candidate@example.com"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">মোবাইল নম্বর (Phone Number)</label>
                            <input 
                              type="tel" 
                              value={applicantPhone} 
                              onChange={(e) => setApplicantPhone(e.target.value)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-mono"
                              placeholder="যেমন: 01712345678"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">প্রার্থীর ছবি ফাইলের নাম (Photo Filename)</label>
                            <div className="flex gap-2">
                              <input 
                                id="web-applicant-photo-name-input"
                                type="text" 
                                value={uploadedPhotoName} 
                                onChange={(e) => setUploadedPhotoName(e.target.value)}
                                className="flex-1 py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-mono"
                                placeholder="যেমন: my_passport_photo.jpg"
                              />
                              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer text-center flex items-center shrink-0 border border-slate-200 transition">
                                <input 
                                  id="web-applicant-photo-file-input"
                                  type="file" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setUploadedPhotoName(file.name);
                                  }}
                                />
                                📎 Choose
                              </label>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">কাজের দক্ষতা সমূহ (Skills)</label>
                            <input 
                              type="text" 
                              value={applicantSkills} 
                              onChange={(e) => setApplicantSkills(e.target.value)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                              placeholder="যেমন: Heavy Driving, Route Planning, Plumber"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">ভাষা জ্ঞান (Languages)</label>
                            <input 
                              type="text" 
                              value={applicantLanguages} 
                              onChange={(e) => setApplicantLanguages(e.target.value)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                              placeholder="যেমন: Bangla (Native), Arabic (Conversational)"
                            />
                          </div>

                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-slate-600 font-bold block">পেশাদার সংক্ষিপ্ত পরিচিতি (Professional Summary)</label>
                            <textarea 
                              rows={3}
                              value={applicantCover} 
                              onChange={(e) => setApplicantCover(e.target.value)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 resize-none font-light"
                              placeholder="আপনার কাজের অভিজ্ঞতা ও সংক্ষিপ্ত পরিচিতি এখানে লিখুন..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* CARD 2: Passport & Government Information */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                          <FileText className="w-4.5 h-4.5 text-emerald-500" /> ২. পাসপোর্ট ও সরকারি তথ্য (Passport & Gov Documents)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">পাসপোর্ট নম্বর (Passport Number)</label>
                            <input 
                              type="text" 
                              value={applicantPassportNumber} 
                              onChange={(e) => setApplicantPassportNumber(e.target.value.toUpperCase())}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-mono"
                              placeholder="যেমন: EH1234567"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">পাসপোর্ট মেয়াদোত্তীর্ণের তারিখ (Expiry Date)</label>
                            <input 
                              type="date" 
                              value={applicantPassportExpiry} 
                              onChange={(e) => setApplicantPassportExpiry(e.target.value)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">BMET স্মার্ট কার্ড নম্বর (BMET Card Number)</label>
                            <input 
                              type="text" 
                              value={applicantBmetNumber} 
                              onChange={(e) => setApplicantBmetNumber(e.target.value)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-mono"
                              placeholder="যেমন: BMET-2026-XXXXX"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">GAMCA মেডিকেল ফিটনেস স্ট্যাটাস</label>
                            <select 
                              value={applicantMedicalStatus} 
                              onChange={(e) => setApplicantMedicalStatus(e.target.value as any)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-bold"
                            >
                              <option value="Fit">Fit (মেডিকেল ফিট)</option>
                              <option value="Pending">Pending (অপেক্ষমান)</option>
                              <option value="Unfit">Unfit (মেডিকেল আনফিট)</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">পুলিশ ক্লিয়ারেন্স সার্টিফিকেট স্ট্যাটাস</label>
                            <select 
                              value={applicantPoliceClearance} 
                              onChange={(e) => setApplicantPoliceClearance(e.target.value as any)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-bold"
                            >
                              <option value="Verified">Verified (অনুমোদিত)</option>
                              <option value="Pending">Pending (চলমান)</option>
                              <option value="Not Provided">Not Provided (প্রদান করা হয়নি)</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">পাসপোর্ট স্ক্যান কপি ফাইল (Scan Page)</label>
                            <div className="flex gap-2">
                              <input 
                                id="web-applicant-passport-scan-input"
                                type="text" 
                                value={uploadedPassportCopyName} 
                                onChange={(e) => setUploadedPassportCopyName(e.target.value)}
                                className="flex-1 py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-mono"
                              />
                              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer text-center flex items-center shrink-0 border border-slate-200 transition">
                                <input 
                                  id="web-applicant-passport-file-input"
                                  type="file" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setUploadedPassportCopyName(file.name);
                                  }}
                                />
                                📎 Choose
                              </label>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">মেডিকেল রিপোর্ট ফাইল (GAMCA Report)</label>
                            <div className="flex gap-2">
                              <input 
                                id="web-applicant-medical-report-input"
                                type="text" 
                                value={uploadedMedicalReportName} 
                                onChange={(e) => setUploadedMedicalReportName(e.target.value)}
                                className="flex-1 py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-mono"
                              />
                              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer text-center flex items-center shrink-0 border border-slate-200 transition">
                                <input 
                                  id="web-applicant-medical-file-input"
                                  type="file" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setUploadedMedicalReportName(file.name);
                                  }}
                                />
                                📎 Choose
                              </label>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">পুলিশ ক্লিয়ারেন্স ফাইল (Police Certificate)</label>
                            <div className="flex gap-2">
                              <input 
                                id="web-applicant-police-clearance-input"
                                type="text" 
                                value={uploadedPoliceClearanceName} 
                                onChange={(e) => setUploadedPoliceClearanceName(e.target.value)}
                                className="flex-1 py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-mono"
                              />
                              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer text-center flex items-center shrink-0 border border-slate-200 transition">
                                <input 
                                  id="web-applicant-police-file-input"
                                  type="file" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setUploadedPoliceClearanceName(file.name);
                                  }}
                                />
                                📎 Choose
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Additional Passports (Map) */}
                        {additionalPassports.map((p, index) => (
                          <div key={p.id} className="space-y-4 pb-4 border-b border-slate-100 animate-fade-in pt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-indigo-600 font-extrabold uppercase tracking-wider text-[10px] bg-indigo-50 px-2 py-0.5 rounded-md">অতিরিক্ত পাসপোর্ট {index + 2}</span>
                              <button
                                type="button"
                                onClick={() => setAdditionalPassports(prev => prev.filter(item => item.id !== p.id))}
                                className="text-rose-600 hover:text-rose-500 font-bold flex items-center gap-1 text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> মুছুন (Delete)
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="space-y-1.5">
                                <label className="text-slate-600 font-bold block">পাসপোর্ট নম্বর</label>
                                <input 
                                  type="text" 
                                  value={p.passportNumber} 
                                  onChange={(e) => {
                                    const val = e.target.value.toUpperCase();
                                    setAdditionalPassports(prev => prev.map(item => item.id === p.id ? { ...item, passportNumber: val } : item));
                                  }}
                                  className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-mono"
                                  placeholder="EH1234567"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-slate-600 font-bold block">পাসপোর্ট মেয়াদ</label>
                                <input 
                                  type="date" 
                                  value={p.passportExpiry} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setAdditionalPassports(prev => prev.map(item => item.id === p.id ? { ...item, passportExpiry: val } : item));
                                  }}
                                  className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setAdditionalPassports(prev => [...prev, { id: Date.now().toString(), passportNumber: '', passportExpiry: '', bmetNumber: '', medicalStatus: 'Fit', policeClearance: 'Verified' }])}
                            className="w-full py-2.5 px-4 border border-dashed border-slate-350 hover:border-indigo-500 rounded-xl font-bold text-slate-600 hover:text-indigo-600 text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" /> অতিরিক্ত পাসপোর্ট রেকর্ড যোগ করুন (Add Additional Passport)
                          </button>
                        </div>
                      </div>

                      {/* CARD 3: Education */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                          <BookOpen className="w-4.5 h-4.5 text-emerald-500" /> ৩. শিক্ষাগত যোগ্যতা (Education)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">ডিগ্রি / সার্টিফিকেটের নাম (Degree)</label>
                            <input 
                              type="text" 
                              value={applicantDegree} 
                              onChange={(e) => setApplicantDegree(e.target.value)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                              placeholder="SSC / HSC / Trade Certificate"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">শিক্ষা প্রতিষ্ঠান (Institution)</label>
                            <input 
                              type="text" 
                              value={applicantInstitution} 
                              onChange={(e) => setApplicantInstitution(e.target.value)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                              placeholder="যেমন: ঢাকা টেকনিক্যাল স্কুল ও কলেজ"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold block">পাস করার বছর (Passing Year)</label>
                            <input 
                              type="text" 
                              value={applicantPassingYear} 
                              onChange={(e) => setApplicantPassingYear(e.target.value)}
                              className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-mono"
                              placeholder="যেমন: ২০১৮"
                            />
                          </div>
                        </div>
                      </div>

                      {/* CARD 4: Work Experience */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                          <Briefcase className="w-4.5 h-4.5 text-emerald-500" /> ৪. কাজের অভিজ্ঞতা (Work Experience)
                        </h3>

                        <div className="space-y-4 pb-4 border-b border-slate-100">
                          <span className="text-emerald-600 font-extrabold uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md">১ম অভিজ্ঞতা (Primary Work Experience)</span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                            <div className="space-y-1.5">
                              <label className="text-slate-600 font-bold block">জিসিসি প্রবাসী অভিজ্ঞতা (GCC / Overseas Experience)</label>
                              <input 
                                type="text" 
                                value={applicantGccExp} 
                                onChange={(e) => setApplicantGccExp(e.target.value)}
                                className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                                placeholder="যেমন: ৪ বছর (রিয়াদ, সৌদি আরব)"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-slate-600 font-bold block">বাংলাদেশে কাজের অভিজ্ঞতা (BD Local Experience)</label>
                              <input 
                                type="text" 
                                value={applicantBdExp} 
                                onChange={(e) => setApplicantBdExp(e.target.value)}
                                className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                                placeholder="যেমন: ১ বছর (লোকাল লজিস্টিকস)"
                              />
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                              <label className="text-slate-600 font-bold block">পূর্ববর্তী কোম্পানি ও পদবি (Previous Employer & Role)</label>
                              <input 
                                type="text" 
                                value={applicantPrevCompany} 
                                onChange={(e) => setApplicantPrevCompany(e.target.value)}
                                className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                                placeholder="যেমন: আল-আদিল লজিস্টিকস গ্রুপ (হেভি কমার্শিয়াল ট্রেইলার ড্রাইভার)"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Additional Experiences (Map) */}
                        {additionalExperiences.map((exp, index) => (
                          <div key={exp.id} className="space-y-4 pb-4 border-b border-slate-100 animate-fade-in pt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-emerald-600 font-extrabold uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md">অতিরিক্ত অভিজ্ঞতা {index + 2}</span>
                              <button
                                type="button"
                                onClick={() => setAdditionalExperiences(prev => prev.filter(item => item.id !== exp.id))}
                                className="text-rose-600 hover:text-rose-500 font-bold flex items-center gap-1 text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> মুছুন (Delete)
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="space-y-1.5">
                                <label className="text-slate-600 font-bold block">জিসিসি প্রবাসী অভিজ্ঞতা (GCC / Overseas Experience)</label>
                                <input 
                                  type="text" 
                                  value={exp.gccExp} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setAdditionalExperiences(prev => prev.map(item => item.id === exp.id ? { ...item, gccExp: val } : item));
                                  }}
                                  className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                                  placeholder="যেমন: ৩ বছর (দুবাই, ইউএই)"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-slate-600 font-bold block">বাংলাদেশে কাজের অভিজ্ঞতা (BD Local Experience)</label>
                                <input 
                                  type="text" 
                                  value={exp.bdExp} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setAdditionalExperiences(prev => prev.map(item => item.id === exp.id ? { ...item, bdExp: val } : item));
                                  }}
                                  className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                                  placeholder="যেমন: ১ বছর (লোকাল লজিস্টিকস)"
                                />
                              </div>

                              <div className="space-y-1.5 md:col-span-2">
                                <label className="text-slate-600 font-bold block">পূর্ববর্তী কোম্পানি ও পদবি (Previous Employer & Role)</label>
                                <input 
                                  type="text" 
                                  value={exp.prevCompany} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setAdditionalExperiences(prev => prev.map(item => item.id === exp.id ? { ...item, prevCompany: val } : item));
                                  }}
                                  className="w-full py-2 px-3 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                                  placeholder="যেমন: আল-আদিল লজিস্টিকস গ্রুপ (হেভি কমার্শিয়াল ট্রেইলার ড্রাইভার)"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add More Experience Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setAdditionalExperiences(prev => [...prev, { id: Date.now().toString(), gccExp: '', bdExp: '', prevCompany: '' }])}
                            className="w-full py-2.5 px-4 border border-dashed border-slate-350 hover:border-emerald-500 rounded-xl font-bold text-slate-600 hover:text-emerald-600 text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" /> আরও অভিজ্ঞতা যোগ করুন (Add More Experience)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : seekerDashboardTab === 'italy' ? (
                  <CrmWorkflowSection
                    viewType="candidate"
                    applications={applications}
                    onUpdateApplication={onUpdateApplication}
                    currentCandidateEmail={currentSeekerEmail}
                    lang={lang}
                  />
                ) : seekerDashboardTab === 'documents' ? (
                  /* Documents Panel */
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-150 pb-4 flex-wrap gap-2">
                      <div>
                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-emerald-500" />
                          {lang === 'bn' ? 'আমার নথিপত্র ও ভেরিফিকেশন' : 'My Documents & Verification'}
                        </h3>
                        <p className="text-[10.5px] text-slate-500 mt-1">
                          {lang === 'bn' ? 'সরকারি প্রবাসী চাকরির জন্য প্রয়োজনীয় সকল কাগজপত্রের তালিকা ও স্থিতি।' : 'List and verification status of all documents required for abroad jobs.'}
                        </p>
                      </div>
                      <span className="text-[10.5px] bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full border border-slate-200">
                        {lang === 'bn' ? 'ভেরিফিকেশন সম্পন্ন: ৭৫%' : 'Verification Complete: 75%'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Passport Card */}
                      <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col justify-between hover:border-slate-300 transition">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-lg">
                              🛂
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-800">{lang === 'bn' ? 'পাসপোর্ট স্ক্যান কপি' : 'Passport Scan Copy'}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{uploadedPassportCopyName || 'Ariful_Passport_Scan_Page.pdf'}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md text-emerald-700 font-black">
                            {lang === 'bn' ? '✓ ভেরিফাইড' : '✓ Verified'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-150">
                          <span className="text-[10px] text-slate-500">{lang === 'bn' ? 'মেয়াদ: ২০৩১-০৭-১২' : 'Expiry: 2031-07-12'}</span>
                          <button 
                            onClick={() => alert(lang === 'bn' ? 'ডাউনলোড শুরু হচ্ছে...' : 'Starting download...')}
                            className="text-[10.5px] text-emerald-600 hover:text-emerald-700 font-extrabold cursor-pointer border-none bg-transparent"
                          >
                            ⬇️ {lang === 'bn' ? 'ডাউনলোড' : 'Download'}
                          </button>
                        </div>
                      </div>

                      {/* Medical Certificate Card */}
                      <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col justify-between hover:border-slate-300 transition">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-lg">
                              🏥
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-800">{lang === 'bn' ? 'GAMCA মেডিকেল ফিট রিপোর্ট' : 'GAMCA Medical Fit Report'}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{uploadedMedicalReportName || 'GAMCA_Medical_Report_Fit.pdf'}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md text-emerald-700 font-black">
                            {lang === 'bn' ? '✓ ফিট (Fit)' : '✓ Fit'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-150">
                          <span className="text-[10px] text-slate-500">{lang === 'bn' ? 'ইস্যু: ২০২৬-০৬-০১' : 'Issued: 2026-06-01'}</span>
                          <button 
                            onClick={() => alert(lang === 'bn' ? 'ডাউনলোড শুরু হচ্ছে...' : 'Starting download...')}
                            className="text-[10.5px] text-emerald-600 hover:text-emerald-700 font-extrabold cursor-pointer border-none bg-transparent"
                          >
                            ⬇️ {lang === 'bn' ? 'ডাউনলোড' : 'Download'}
                          </button>
                        </div>
                      </div>

                      {/* Police Clearance */}
                      <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col justify-between hover:border-slate-300 transition">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-lg">
                              👮
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-800">{lang === 'bn' ? 'পুলিশ ক্লিয়ারেন্স সার্টিফিকেট' : 'Police Clearance Certificate'}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{uploadedPoliceClearanceName || 'Police_Clearance_Certificate.pdf'}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md text-amber-700 font-black animate-pulse">
                            {lang === 'bn' ? '⏳ যাচাই চলছে' : '⏳ Verifying'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-150">
                          <span className="text-[10px] text-slate-500">{lang === 'bn' ? 'দেশ: ইতালি' : 'Country: Italy'}</span>
                          <button 
                            onClick={() => alert(lang === 'bn' ? 'ডাউনলোড শুরু হচ্ছে...' : 'Starting download...')}
                            className="text-[10.5px] text-emerald-600 hover:text-emerald-700 font-extrabold cursor-pointer border-none bg-transparent"
                          >
                            ⬇️ {lang === 'bn' ? 'ডাউনলোড' : 'Download'}
                          </button>
                        </div>
                      </div>

                      {/* BMET Smart Card */}
                      <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col justify-between hover:border-slate-300 transition">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-lg">
                              💳
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-800">{lang === 'bn' ? 'BMET スマートカード (প্রবাসী কার্ড)' : 'BMET Smart Card'}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Ariful_BMET_Registration.pdf</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md text-emerald-700 font-black">
                            {lang === 'bn' ? '✓ নিবন্ধিত' : '✓ Registered'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-150">
                          <span className="text-[10px] text-slate-500">{lang === 'bn' ? 'নম্বর: BMET-8829102' : 'BMET ID: 8829102'}</span>
                          <button 
                            onClick={() => alert(lang === 'bn' ? 'ডাউনলোড শুরু হচ্ছে...' : 'Starting download...')}
                            className="text-[10.5px] text-emerald-600 hover:text-emerald-700 font-extrabold cursor-pointer border-none bg-transparent"
                          >
                            ⬇️ {lang === 'bn' ? 'ডাউনলোড' : 'Download'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Drag-and-drop Documents Uploader */}
                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-black text-slate-700 mb-1">
                        {lang === 'bn' ? 'নতুন ফাইল ড্র্যাগ করে ছাড়ুন অথবা ক্লিক করুন' : 'Drag & drop new document or click to browse'}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-normal mb-3">
                        {lang === 'bn' ? 'PDF, JPG বা PNG ফরম্যাটে সর্বোচ্চ ৫ এমবি ফাইল আপলোড করতে পারবেন।' : 'Supports PDF, JPG, or PNG up to 5 MB.'}
                      </p>
                      <label className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm transition">
                        {lang === 'bn' ? 'ফাইল নির্বাচন করুন' : 'Select File'}
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              alert(lang === 'bn' ? `"${e.target.files[0].name}" সফলভাবে আপলোড করা হয়েছে এবং রিভিউ এর জন্য পাঠানো হয়েছে!` : `"${e.target.files[0].name}" uploaded successfully and submitted for review!`);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : seekerDashboardTab === 'messages' ? (
                  /* Messages & Support Tickets Panel */
                  <div className="grid grid-cols-1 lg:grid-cols-12 border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm h-[500px]">
                    {/* Left: Chat list */}
                    <div className="lg:col-span-4 border-r border-slate-150 flex flex-col bg-slate-50/50">
                      <div className="p-4 border-b border-slate-150">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                          {lang === 'bn' ? 'বার্তা ও ইনবক্স' : 'Inbox & Support'}
                        </h3>
                      </div>
                      <div className="flex-1 overflow-y-auto divide-y divide-slate-150">
                        <div className="p-3.5 bg-white border-l-4 border-emerald-500 flex items-start gap-2.5 cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm shrink-0">
                            🛠️
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="text-[11px] font-black text-slate-800 truncate">{lang === 'bn' ? 'সিস্টেম সাপোর্ট অফিসার' : 'System Support'}</p>
                              <span className="text-[9px] text-slate-400 font-medium">১২:৩০</span>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">পুলিশ ক্লিয়ারেন্স সাবমিট হয়েছে।</p>
                          </div>
                        </div>

                        <div className="p-3.5 hover:bg-white flex items-start gap-2.5 cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm shrink-0">
                            🏢
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="text-[11px] font-black text-slate-800 truncate">Gulf Careers HR</p>
                              <span className="text-[9px] text-slate-400 font-medium">{lang === 'bn' ? 'গতকাল' : 'Yesterday'}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{lang === 'bn' ? 'শনিবার সকাল ১১ টায় আপনার সাক্ষাৎকার।' : 'Your interview is scheduled on Saturday at 11 AM.'}</p>
                          </div>
                        </div>

                        <div className="p-3.5 hover:bg-white flex items-start gap-2.5 cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm shrink-0">
                            🏢
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="text-[11px] font-black text-slate-800 truncate">Al-Adil Transport</p>
                              <span className="text-[9px] text-slate-400 font-medium">১০ জুলাই</span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{lang === 'bn' ? 'ধন্যবাদ, আপনার ডাটা সেভ করা হয়েছে।' : 'Thank you, your data has been saved.'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Active Chat Window */}
                    <div className="lg:col-span-8 flex flex-col h-full bg-white">
                      {/* Active Chat Header */}
                      <div className="px-5 py-3.5 border-b border-slate-150 flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm">
                            🛠️
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{lang === 'bn' ? 'সিস্টেম সাপোর্ট অফিসার' : 'System Support Officer'}</p>
                            <p className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                              {lang === 'bn' ? 'সক্রিয় (Online)' : 'Online'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">ID: ST-1082</span>
                      </div>

                      {/* Message History */}
                      <div className="flex-1 p-5 overflow-y-auto bg-slate-50/30 space-y-3.5">
                        <div className="flex justify-center">
                          <span className="bg-slate-100 text-slate-400 text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                            {lang === 'bn' ? 'আজকের মেসেজ সমূহ' : "Today's Messages"}
                          </span>
                        </div>

                        {/* Recipient Message */}
                        <div className="flex items-start gap-2.5 max-w-[80%]">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs shrink-0">
                            🛠️
                          </div>
                          <div className="p-3 bg-slate-100 rounded-2xl rounded-tl-none">
                            <p className="text-xs text-slate-800 leading-normal">
                              {lang === 'bn' ? 'আসসালামু আলাইকুম। প্রবাসী পোর্টালে স্বাগতম। আপনার ইতালি প্যাকেজ বুকিং সংক্রান্ত কোনো সাহায্য প্রয়োজন কি?' : 'Assalamu Alaikum. Welcome to Probashi Portal. Do you need help regarding your Italy Package booking?'}
                            </p>
                            <span className="text-[9px] text-slate-400 font-medium block mt-1 text-left">১২:১৫</span>
                          </div>
                        </div>

                        {/* Candidate Message */}
                        <div className="flex items-start gap-2.5 max-w-[80%] ml-auto justify-end">
                          <div className="p-3 bg-emerald-500 text-white rounded-2xl rounded-tr-none">
                            <p className="text-xs leading-normal">
                              {lang === 'bn' ? 'জি, ভাই। আমার পুলিশ ক্লিয়ারেন্স আপলোড করেছি। ওটা কখন ভেরিফাই হবে?' : 'Yes, brother. I uploaded my police clearance certificate. When will it be verified?'}
                            </p>
                            <span className="text-[9px] text-emerald-100 font-medium block mt-1 text-right">১২:২২</span>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {applicantName ? applicantName.charAt(0) : 'U'}
                          </div>
                        </div>

                        {/* Recipient Response */}
                        <div className="flex items-start gap-2.5 max-w-[80%]">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs shrink-0">
                            🛠️
                          </div>
                          <div className="p-3 bg-slate-100 rounded-2xl rounded-tl-none">
                            <p className="text-xs text-slate-800 leading-normal">
                              {lang === 'bn' ? 'আমরা আপনার পুলিশ ক্লিয়ারেন্স সার্টিফিকেট রিসিভ করেছি। এটি প্রবাসী ক্লিয়ারেন্স শাখার একজন স্টাফ মেম্বার দ্বারা আগামী ২৪ ঘণ্টার মধ্যে যাচাই করা হবে।' : 'We have received your police clearance certificate. It will be verified by our staff within 24 hours.'}
                            </p>
                            <span className="text-[9px] text-slate-400 font-medium block mt-1 text-left">১২:৩০</span>
                          </div>
                        </div>
                      </div>

                      {/* Message Input Box */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const input = (e.currentTarget.elements.namedItem('chatInput') as HTMLInputElement);
                          if (input.value.trim()) {
                            alert(lang === 'bn' ? `মেসেজ পাঠানো হয়েছে: "${input.value}"` : `Message sent: "${input.value}"`);
                            input.value = '';
                          }
                        }}
                        className="p-3 border-t border-slate-150 flex gap-2"
                      >
                        <input 
                          type="text" 
                          name="chatInput"
                          placeholder={lang === 'bn' ? 'এখানে টাইপ করুন...' : 'Type your message here...'}
                          className="flex-1 bg-slate-50 border border-slate-200 text-xs py-2 px-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
                        />
                        <button 
                          type="submit"
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl shadow-xs transition shrink-0 cursor-pointer border-none"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  /* Settings Panel (seekerDashboardTab === 'settings') */
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="border-b border-slate-150 pb-4">
                      <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <Key className="w-5 h-5 text-emerald-500" />
                        {lang === 'bn' ? 'অ্যাকাউন্ট সেটিংস ও নিরাপত্তা' : 'Account Settings & Security'}
                      </h3>
                      <p className="text-[10.5px] text-slate-500 mt-1">
                        {lang === 'bn' ? 'আপনার পাসওয়ার্ড, নোটিফিকেশন অগ্রাধিকার এবং প্রোফাইল সিকিউরিটি পরিবর্তন করুন।' : 'Update your password, notification preferences, and account security settings.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Security Form */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide">🔐 {lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password'}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">{lang === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}</label>
                            <input 
                              type="password" 
                              placeholder="••••••••"
                              className="w-full bg-slate-50 border border-slate-200 text-xs py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">{lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}</label>
                            <input 
                              type="password" 
                              placeholder="••••••••"
                              className="w-full bg-slate-50 border border-slate-200 text-xs py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => alert(lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!' : 'Password updated successfully!')}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer border-none"
                          >
                            {lang === 'bn' ? 'আপডেট পাসওয়ার্ড' : 'Update Password'}
                          </button>
                        </div>
                      </div>

                      {/* Notification Preferences */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide">🔔 {lang === 'bn' ? 'নোটিফিকেশন অগ্রাধিকার' : 'Notification Settings'}</h4>
                        <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                          <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-700">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500" />
                            <div>
                              <p className="text-[11px] font-bold text-slate-800">{lang === 'bn' ? 'ভিসা স্ট্যাটাস এলার্ট' : 'Visa Status Alerts'}</p>
                              <p className="text-[9.5px] text-slate-400 font-light">{lang === 'bn' ? 'ভিসা ও নথিপত্রের স্টেট পরিবর্তন হলে আমাদের জানান।' : 'Notify me when visa or documents status changes.'}</p>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-700">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500" />
                            <div>
                              <p className="text-[11px] font-bold text-slate-800">{lang === 'bn' ? 'চাকরি ম্যাচিং এলার্ট' : 'Job Matching Alerts'}</p>
                              <p className="text-[9.5px] text-slate-400 font-light">{lang === 'bn' ? 'আমার স্কিলের সাথে সামঞ্জস্যপূর্ণ নতুন সার্কুলার প্রকাশি হলে জানান।' : 'Notify me about new jobs matching my skills.'}</p>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-700">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500" />
                            <div>
                              <p className="text-[11px] font-bold text-slate-800">{lang === 'bn' ? 'মোবাইল এসএমএস নোটিফিকেশন' : 'Mobile SMS Notifications'}</p>
                              <p className="text-[9.5px] text-slate-400 font-light">{lang === 'bn' ? 'জরুরি সাক্ষাৎকারের তারিখ ফোনে এসএমএস আকারে দিন।' : 'Send important interview dates via SMS.'}</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          )}

          {/* Employer Dashboard */}
          {currentUserType === 'employer' && (
            <AgencyPanel
              jobs={jobs}
              companies={companies}
              applications={applications}
              currentEmployerCompanyId={currentEmployerCompanyId}
              bankAccounts={bankAccounts}
              clientPayments={clientPayments}
              adminBankSettings={adminBankSettings}
              onAddAgentBankAccount={onAddAgentBankAccount}
              onUpdateAgentBankAccount={onUpdateAgentBankAccount}
              onDeleteAgentBankAccount={onDeleteAgentBankAccount}
              onConfirmClientPaymentByAgent={onConfirmClientPaymentByAgent}
              onUpdateCompany={onUpdateCompany}
              onUpdateJob={onUpdateJob}
              onUpdateApplicationStatus={onUpdateApplicationStatus}
              onSetEmployerCompanyId={onSetEmployerCompanyId}
              onRegisterCompany={onRegisterCompany}
              companyReports={companyReports}
              blacklistItems={blacklistItems}
              italyPackages={italyPackages}
              onUpdateItalyPackage={onUpdateItalyPackage}
              onUpdateApplication={onUpdateApplication}
              
              employerTab={employerTab}
              setEmployerTab={setEmployerTab}

              supportTickets={supportTickets}
              setSupportTickets={setSupportTickets}
              scheduledInterviews={scheduledInterviews}
              setScheduledInterviews={setScheduledInterviews}
              newIntCandidate={newIntCandidate}
              setNewIntCandidate={setNewIntCandidate}
              uploadedDocs={uploadedDocs}
              setUploadedDocs={setUploadedDocs}
              visaProcessList={visaProcessList}
              setVisaProcessList={setVisaProcessList}

              twoFactorEnabled={twoFactorEnabled}
              setTwoFactorEnabled={setTwoFactorEnabled}
              branchOffices={branchOffices}
              setBranchOffices={setBranchOffices}

              jobsFilter={jobsFilter}
              setJobsFilter={setJobsFilter}
              applicantsFilter={applicantsFilter}
              setApplicantsFilter={setApplicantsFilter}

              editingJob={editingJob}
              setEditingJob={setEditingJob}
              editingTitle={editingTitle}
              setEditingTitle={setEditingTitle}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              editingCountry={editingCountry}
              setEditingCountry={setEditingCountry}
              editingLocation={editingLocation}
              setEditingLocation={setEditingLocation}
              editingType={editingType}
              setEditingType={setEditingType}
              editingVisaType={editingVisaType}
              setEditingVisaType={setEditingVisaType}
              editingSalary={editingSalary}
              setEditingSalary={setEditingSalary}
              editingDeadline={editingDeadline}
              setEditingDeadline={setEditingDeadline}
              editingDesc={editingDesc}
              setEditingDesc={setEditingDesc}
              editingReqs={editingReqs}
              setEditingReqs={setEditingReqs}

              profileCover={profileCover}
              setProfileCover={setProfileCover}
              profileEstYear={profileEstYear}
              setProfileEstYear={setProfileEstYear}
              profileWebsite={profileWebsite}
              setProfileWebsite={setProfileWebsite}
              profileGoogleMap={profileGoogleMap}
              setProfileGoogleMap={setProfileGoogleMap}
              profilePhone={profilePhone}
              setProfilePhone={setProfilePhone}
              profileFbLinkedIn={profileFbLinkedIn}
              setProfileFbLinkedIn={setProfileFbLinkedIn}

              chatInputText={chatInputText}
              setChatInputText={setChatInputText}
              activeChatCandidateId={activeChatCandidateId}
              setActiveChatCandidateId={setActiveChatCandidateId}
              handleSendMessage={handleSendMessage}
              handleStartEditingJob={handleStartEditingJob}
              handleEditJobSubmit={handleEditJobSubmit}
              handlePostJobSubmit={handlePostJobSubmit}
              handleUpdateCompanySubmit={handleUpdateCompanySubmit}

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
              onLogout={onLogout}
              lang={lang}
              setLang={setLang}
            />
          )}

          </div>
        )}

      </main>

      {/* MODAL 1: JOB DETAIL DIALOG */}
      {selectedWebJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedWebJob.companyLogo}</span>
                <div>
                  <h3 className="text-xs font-black truncate">{selectedWebJob.title}</h3>
                  <p className="text-[10px] text-emerald-400 font-bold">{selectedWebJob.companyName}</p>
                </div>
              </div>
              <button 
                id="close-web-job-modal"
                onClick={() => { setSelectedWebJob(null); setIsApplyingWeb(false); }}
                className="text-slate-400 hover:text-white text-base font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Scrollable details Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed font-light flex-1">
              
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-150 rounded-xl font-medium">
                <div>
                  <span className="text-slate-400 text-[10px] block">মাসিক বেতন (Salary)</span>
                  <span className="text-emerald-600 font-bold text-xs flex items-center gap-0.5 mt-0.5">
                    <DollarSign className="w-4 h-4 shrink-0" /> {selectedWebJob.salary}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">কর্মক্ষেত্র অবস্থান (Location)</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-0.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" /> {selectedWebJob.location}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 border-l-2 border-emerald-500 pl-2">চাকরির বিস্তারিত বিবরণ</h4>
                <p className="text-slate-600 leading-normal">{selectedWebJob.description}</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 border-l-2 border-emerald-500 pl-2">আবেদন করার যোগ্যতাসমূহ</h4>
                <ul className="space-y-1.5 pl-2">
                  {selectedWebJob.requirements.map((req, i) => (
                    <li key={i} className="flex gap-1.5 items-start">
                      <span className="text-emerald-500 font-extrabold shrink-0">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Collapsible Apply Form */}
              {isApplyingWeb ? (
                <form id="web-modal-apply-form" onSubmit={handleApplyWebSubmit} className="p-4 bg-slate-50 border rounded-2xl space-y-3 mt-4">
                  <h4 className="font-bold text-blue-600 text-xs">আবেদন ফরম</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold block">পূর্ণ নাম (Full Name)</label>
                    <input 
                      type="text" 
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold block">ইমেইল (Email)</label>
                      <input 
                        type="email" 
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold block">মোবাইল নম্বর (Phone)</label>
                      <input 
                        type="tel" 
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold block">পাসপোর্ট নম্বর (Passport No.)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="যেমন: EH1234567"
                        value={applicantPassportNumber}
                        onChange={(e) => setApplicantPassportNumber(e.target.value)}
                        className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-slate-800 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold block">মেয়াদোত্তীর্ণের তারিখ (Expiry Date)</label>
                      <input 
                        type="date" 
                        required
                        value={applicantPassportExpiry}
                        onChange={(e) => setApplicantPassportExpiry(e.target.value)}
                        className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold block">BMET কার্ড / রেজিস্ট্রেশন নম্বর</label>
                      <input 
                        type="text" 
                        placeholder="যেমন: BMET-2026-XXXXX"
                        value={applicantBmetNumber}
                        onChange={(e) => setApplicantBmetNumber(e.target.value)}
                        className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-slate-800 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold block">ছবি ফাইলের নাম (Photo File)</label>
                      <input 
                        type="text" 
                        required
                        value={uploadedPhotoName}
                        onChange={(e) => setUploadedPhotoName(e.target.value)}
                        className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-slate-800 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold block">মেডিকেল স্ট্যাটাস (Medical Status)</label>
                      <select 
                        value={applicantMedicalStatus}
                        onChange={(e) => setApplicantMedicalStatus(e.target.value as any)}
                        className="w-full py-1.5 px-2 border rounded-lg bg-white text-slate-800"
                      >
                        <option value="Fit">Fit (মেডিকেল ফিট)</option>
                        <option value="Pending">Pending (অপেক্ষমান)</option>
                        <option value="Unfit">Unfit (মেডিকেল আনফিট)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold block">পুলিশ ক্লিয়ারেন্স (Police Clearance)</label>
                      <select 
                        value={applicantPoliceClearance}
                        onChange={(e) => setApplicantPoliceClearance(e.target.value as any)}
                        className="w-full py-1.5 px-2 border rounded-lg bg-white text-slate-800"
                      >
                        <option value="Verified">Verified (অনুমোদিত)</option>
                        <option value="Pending">Pending (চলমান)</option>
                        <option value="Not Provided">Not Provided (প্রদান করা হয়নি)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold block">কাজের দক্ষতা সমূহ (Skills)</label>
                      <input 
                        type="text" 
                        placeholder="যেমন: Heavy driving, Plumber, Chef"
                        value={applicantSkills}
                        onChange={(e) => setApplicantSkills(e.target.value)}
                        className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold block">ভাষা জ্ঞান (Languages)</label>
                      <input 
                        type="text" 
                        placeholder="যেমন: Bangla, Arabic, English"
                        value={applicantLanguages}
                        onChange={(e) => setApplicantLanguages(e.target.value)}
                        className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold block">বিগত কাজের অভিজ্ঞতা (Experience)</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: 3 Years in Dubai, 2 Years in Qatar"
                      value={applicantExperience}
                      onChange={(e) => setApplicantExperience(e.target.value)}
                      className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold block">সিভি ফাইল নাম (CV Filename)</label>
                    <input 
                      type="text" 
                      required
                      value={uploadedCVName}
                      onChange={(e) => setUploadedCVName(e.target.value)}
                      className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-slate-800 font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold block">কভার লেটার (Cover Letter / আবেদনপত্র)</label>
                    <textarea 
                      rows={2}
                      value={applicantCover}
                      onChange={(e) => setApplicantCover(e.target.value)}
                      className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-slate-800 resize-none"
                    />
                  </div>

                  <button 
                    id="submit-web-job-modal-apply"
                    type="submit"
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-sm"
                  >
                    আবেদন সাবমিট করুন
                  </button>
                </form>
              ) : null}

            </div>

            {/* Bottom Actions CTA */}
            <div className="px-6 py-4 bg-slate-50 border-t flex gap-3.5 items-center justify-end">
              <button 
                id="modal-bookmark-btn"
                onClick={() => onToggleSaveJob(selectedWebJob.id)}
                className={`p-2 rounded-xl border transition ${
                  savedJobs.includes(selectedWebJob.id) 
                    ? 'bg-amber-500/15 border-amber-500 text-amber-500' 
                    : 'border-slate-200 text-slate-400 bg-white hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              {!isApplyingWeb && (
                appliedJobIds.includes(selectedWebJob.id) ? (
                  <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 font-bold text-center">
                    ✓ আবেদন করা হয়েছে
                  </div>
                ) : (
                  <button 
                    id="modal-apply-btn-trigger"
                    onClick={() => setIsApplyingWeb(true)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md"
                  >
                    সহজ আবেদন
                  </button>
                )
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: MFS MANUAL CHECKOUT DIALOG */}
      {showCheckout && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col text-xs text-slate-700">
            
            <div className="px-5 py-3.5 bg-pink-600 text-white flex justify-between items-center">
              <span className="font-extrabold">bKash/Nagad পেমেন্ট গেটওয়ে</span>
              <button 
                id="close-checkout"
                type="button" 
                onClick={() => setShowCheckout(false)}
                className="font-bold text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form id="web-checkout-form" onSubmit={handleCheckoutSubmit} className="p-5 space-y-4">
              
              <div className="p-3 bg-pink-50 border border-pink-100 rounded-xl space-y-1.5 leading-normal">
                <p className="font-bold text-pink-700">প্রিমিয়াম চাকরি বিজ্ঞাপন ফি: ৳২,৫০০</p>
                <p className="font-light text-[10.5px]">আমাদের বিকাশ মার্চেন্ট ওয়ালেট নম্বর <strong className="font-bold">01799887766</strong> এ "payment" সম্পন্ন করুন। এরপর প্রাপ্ত <strong className="font-bold">Transaction ID (TxID)</strong> টি নিচে প্রদান করে পোর্টালে সাবমিট করুন।</p>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">পেমেন্ট মেথড সিলেক্ট করুন</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bKash', 'Nagad', 'Rocket'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      id={`checkout-method-${method}`}
                      onClick={() => setCheckoutMethod(method)}
                      className={`py-1.5 rounded-lg border font-bold text-center ${
                        checkoutMethod === method 
                          ? 'border-pink-500 bg-pink-50 text-pink-600' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">মোবাইল ট্রানজেকশন ID (TxID)</label>
                <input 
                  type="text" 
                  required
                  placeholder="যেমন: BKX847A918D"
                  value={checkoutTxID}
                  onChange={(e) => setCheckoutTxID(e.target.value.toUpperCase())}
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl bg-slate-50 font-mono text-center text-sm font-bold tracking-wider uppercase text-slate-800"
                />
              </div>

              <button 
                id="checkout-submit-btn"
                type="submit"
                className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-1"
              >
                <CreditCard className="w-4 h-4" /> ট্রানজেকশন আইডি সাবমিট করুন
              </button>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 3: WEB PORTAL NOTIFICATION DETAILS */}
      {selectedNotifDetail && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-150 flex flex-col text-xs text-slate-700">
            
            <div className="px-5 py-4 bg-emerald-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-base">🔔</span>
                <span className="font-extrabold text-sm tracking-wide">নোটিফিকেশন বিবরণী (Notification Details)</span>
              </div>
              <button 
                id="close-web-notif-modal"
                type="button" 
                onClick={() => setSelectedNotifDetail(null)}
                className="font-bold text-slate-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 space-y-4">
              
              <div className="flex justify-between items-center text-[10.5px] text-slate-400 font-mono pb-2 border-b border-slate-100">
                <span>🕒 পাঠানো হয়েছে: {selectedNotifDetail.sentAt}</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[8.5px]">
                  {selectedNotifDetail.isRead ? 'পঠিত (Read)' : 'নতুন (New)'}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 leading-snug">{selectedNotifDetail.title}</h4>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 leading-relaxed text-slate-600 whitespace-pre-wrap text-[11px]">
                {selectedNotifDetail.message}
              </div>

              <button 
                id="web-notif-ok-btn"
                onClick={() => setSelectedNotifDetail(null)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow-md flex items-center justify-center gap-1 text-xs"
              >
                ঠিক আছে (Dismiss)
              </button>

            </div>

          </div>
        </div>
      )}

      {/* MODAL 4: WEB PORTAL APPLIED JOB DETAILS */}
      {selectedWebApplicationDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl h-[85vh] max-h-[640px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col animate-fade-in">
            <VerifiedSystemHub 
              application={selectedWebApplicationDetail as any} 
              userRole="Candidate"
              onUpdateItalyPackage={(updatedPkg) => {
                setSelectedWebApplicationDetail(updatedPkg);
                onUpdateItalyPackage?.(updatedPkg);
              }}
              onClose={() => setSelectedWebApplicationDetail(null)} 
              isMobile={false} 
            />
          </div>
        </div>
      )}

      {/* MODAL 5: REPORT COMPANY MODAL */}
      {reportCompanyObj && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-150 flex flex-col text-xs text-slate-700">
            
            <div className="px-5 py-4 bg-rose-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-white" />
                <span className="font-extrabold text-sm tracking-wide">অভিযোগ দায়ের করুন (File Abuse Report)</span>
              </div>
              <button 
                type="button" 
                onClick={() => setReportCompanyObj(null)}
                className="font-bold text-slate-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg text-xs"
              >
                ✕ বাতিল
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[80vh]">
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex gap-2 text-[11px] text-rose-800 font-medium leading-relaxed">
                <span className="text-sm">⚠️</span>
                <p>আপনি <strong>"{reportCompanyObj.name}"</strong> এর বিরুদ্ধে অভিযোগ করতে যাচ্ছেন। প্রমাণের ভিত্তিতে শুধুমাত্র সত্য অভিযোগ দায়ের করুন। ভুয়ো অভিযোগ করলে আপনার একাউন্ট স্থগিত হতে পারে।</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">অভিযোগকারীর নাম</label>
                  <input 
                    type="text" required value={reportReporterName} onChange={(e) => setReportReporterName(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">মোবাইল নম্বর</label>
                  <input 
                    type="text" required value={reportReporterPhone} onChange={(e) => setReportReporterPhone(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">ইমেইল ঠিকানা</label>
                <input 
                  type="email" required value={reportReporterEmail} onChange={(e) => setReportReporterEmail(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">অভিযোগের ধরন (Category)</label>
                <select 
                  value={reportCategory} onChange={(e) => setReportCategory(e.target.value as any)}
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl font-bold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none"
                >
                  <option value="Fake Job">ভুয়া সার্কুলার / চাকরি (Fake Job)</option>
                  <option value="Fake Visa">ভুয়া ভিসা অফার (Fake Visa)</option>
                  <option value="Payment Fraud">পেমেন্ট বা টাকা আত্মসাৎ (Payment Fraud)</option>
                  <option value="Scam">চিটিং বা স্ক্যাম (Scam/Cheating)</option>
                  <option value="Abuse">অশালীন আচরণ (Abuse/Harassment)</option>
                  <option value="Other">অন্যান্য (Other Issues)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">অভিযোগের বিবরণ (Details)</label>
                <textarea 
                  rows={3} required placeholder="কী ধরণের প্রতারণা বা সমস্যা হয়েছে তা বিস্তারিতভাবে লিখুন..."
                  value={reportDescription} onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 leading-relaxed font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">প্রমাণ সাবমিট (ফাইল / রসিদ / পিডিএফ স্ক্রিনশট)</label>
                <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition relative">
                  <input 
                    type="file" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setReportEvidenceName(e.target.files[0].name);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <span className="text-xl block mb-1">📁</span>
                  <p className="font-bold text-[10px] text-slate-500">
                    {reportEvidenceName ? `সংযুক্ত ফাইল: ${reportEvidenceName}` : 'ক্লিক করুন বা ফাইল ড্র্যাগ করে ছাড়ুন'}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5 font-light">JPG, PNG, PDF (সর্বোচ্চ ৫ মেগাবাইট)</p>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl transition shadow-md flex items-center justify-center gap-1.5 text-xs"
              >
                <ShieldAlert className="w-4 h-4 text-white" /> অভিযোগ সাবমিট করুন (File Report)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SCAM DETAILS & EVIDENCE MODAL */}
      {showScamDetailModal && selectedScamAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-red-500 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-scale-up my-8">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚨</span>
                <div>
                  <h3 className="text-xs font-black tracking-tight text-white uppercase">প্রতারণা তদন্ত রিপোর্ট ও সংগৃহীত প্রমাণ</h3>
                  <p className="text-[10px] text-red-400 font-bold">BDJobs Pro Anti-Fraud Wing</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowScamDetailModal(false);
                  setSelectedScamAlert(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition font-black text-xs"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Alert Status Banner */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                    VERIFIED & APPROVED
                  </span>
                  <h4 className="text-xs font-black text-red-950 mt-1">
                    {selectedScamAlert.title}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    অভিযোগের ধরন: {' '}
                    <span className="font-bold text-red-600">
                      {selectedScamAlert.category === 'fake_agent' && 'ভুয়া এজেন্ট'}
                      {selectedScamAlert.category === 'fake_job' && 'ভুয়া চাকরি'}
                      {selectedScamAlert.category === 'visa_fraud' && 'ভিসা প্রতারণা'}
                      {selectedScamAlert.category === 'payment_fraud' && 'পেমেন্ট জاليةতি'}
                      {selectedScamAlert.category === 'document_fraud' && 'ডকুমেন্ট জালিয়াতি'}
                      {selectedScamAlert.category === 'other' && 'অন্যান্য'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Grid metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-black uppercase">অভিযুক্ত ব্যক্তি বা এজেন্সি:</span>
                  <p className="text-xs font-bold text-slate-800">{selectedScamAlert.title}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-black uppercase">সংশ্লিষ্ট মোবাইল নম্বর:</span>
                  <p className="text-xs font-bold text-red-600 tracking-wide">{selectedScamAlert.phoneNumber}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-black uppercase">ঠিকানা বা লোকেশন:</span>
                  <p className="text-xs font-bold text-slate-700">{selectedScamAlert.location}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-black uppercase">তালিকাভুক্তির তারিখ:</span>
                  <p className="text-xs font-bold text-slate-700">{selectedScamAlert.createdAt}</p>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Full Description */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-400 font-black uppercase">অভিযোগ ও ঘটনার বিশদ বিবরণ (Incident Description):</span>
                <p className="text-xs text-slate-600 leading-relaxed font-light whitespace-pre-line">
                  {selectedScamAlert.description}
                </p>
              </div>

              {/* Evidence Section */}
              <div className="space-y-3 pt-2">
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-black text-slate-800 flex items-center gap-1">
                    📁 জমাকৃত প্রামাণ্য নথি ও ফাইলসমূহ (Evidence files):
                  </span>
                  <p className="text-[9px] text-slate-400 font-light mt-0.5">অভিযোগকারী কর্তৃক অ্যান্টি-ফ্রড উইংয়ে জমাকৃত ডকুমেন্টস, যা যাচাই করে অনুমোদন দেওয়া হয়েছে।</p>
                </div>

                {selectedScamAlert.evidenceFiles && selectedScamAlert.evidenceFiles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedScamAlert.evidenceFiles.map((file, i) => (
                      <div 
                        key={i}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-slate-700 truncate">{file.name}</p>
                            <p className="text-[9px] text-slate-400">টাইপ: {file.type.toUpperCase()}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            alert(`"${file.name}" প্রমাণটি একটি সিকিউরড ডেমো ফাইল। সাধারণ ব্যবহারকারীদের ব্যক্তিগত তথ্যের সুরক্ষার্থে ডাউনলোড শুধুমাত্র আইন প্রয়োগকারী সংস্থা বা ভুক্তভোগী নিজেই আমাদের সাপোর্ট প্যানেলে আইডি প্রুফ দিয়ে সংগ্রহ করতে পারবেন।`);
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition shrink-0"
                          title="ডাউনলোড করুন"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11.5px] text-slate-500 font-light italic">কোনো নথি সংযুক্ত করা হয়নি। তবে ঘটনার সত্যতা মৌখিক ও প্রযুক্তিগত অনুসন্ধানে নিশ্চিত করা হয়েছে।</p>
                )}
              </div>

              {/* Legal Warning Inside Modal */}
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-[9.5px] text-amber-800 leading-relaxed font-light">
                <span className="font-bold">আইনি বিজ্ঞপ্তি:</span> উক্ত অভিযুক্ত ব্যক্তি বা এজেন্সি যদি মনে করেন যে এখানে প্রদর্শিত তথ্য ভুল অথবা তারা ইতিমধ্যে অভিযোগকারীর ক্ষতিপূরণ মিটিয়ে দিয়েছেন, তবে দয়া করে উপযুক্ত প্রমাণসহ আমাদের কন্টাক্ট মেইলে আবেদন করুন। সত্যতা সাপেক্ষে রেকর্ড আপডেট বা আর্কাইভ করা হবে।
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-2.5">
              <button
                onClick={() => {
                  setShowScamDetailModal(false);
                  setSelectedScamAlert(null);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black rounded-xl transition"
              >
                বন্ধ করুন (Close)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
