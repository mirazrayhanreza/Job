/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, LayoutDashboard, Building2, Briefcase, Plus, Check, X, 
  Send, Users, Landmark, FileText, Bell, MapPin, Layers, DollarSign,
  AlertCircle, ChevronRight, Activity, Percent, Sparkles, Filter,
  Lock, Unlock, Settings, Database, Download, RefreshCw, FileDown, 
  HelpCircle, MessageSquare, Clock, CreditCard, ArrowUpRight, Menu,
  Eye, Globe, User, History, Trash2, ClipboardList, ShieldAlert,
  Search, ChevronDown, Calendar, TrendingUp, LogOut
} from 'lucide-react';
import { Job, Company, Transaction, Notification, ItalyPackageApplication, Application, PaymentMethodSetting, PaymentAuditLog, CompanyReport, BlacklistedItem, SystemAuditLog } from '../mockData';
import VisaProcessingStepsTab from './VisaProcessingStepsTab';
import VisaStepManagerTab from './VisaStepManagerTab';
import { CrmWorkflowSection } from './CrmWorkflowSection';
import { PortalUser, LoginActivity } from '../types/auth';
import AdminSeoPanel from './AdminSeoPanel';
import { SeoPageConfig, GlobalSeoSettings } from '../types/seo';
import { ScamAlert, ScamAuditLog, ScamAlertCategory } from '../types/scam';
import VerifiedSystemHub from './VerifiedSystemHub';
import { AgentBankAccount, ClientPaymentSubmission, AdminBankSettings, BankAccountStatus, DEFAULT_ADMIN_BANK_SETTINGS } from '../types/bank';
import AdminBankVerifier from './bank/AdminBankVerifier';

// Staff Member Interface
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Office Admin' | 'Staff';
  avatar: string;
  permissions: {
    view_jobs: boolean;
    add_jobs: boolean;
    edit_jobs: boolean;
    delete_jobs: boolean;
    view_applications: boolean;
    payment_access: boolean;
    chat_support: boolean;
    verify_documents: boolean;
    website_settings: boolean;
    database_access: boolean;
  };
  addedAt: string;
  status: 'Active' | 'Inactive';
}

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'staff_1',
    name: 'Ariful Islam',
    email: 'ariful@bdjobs.pro',
    role: 'Super Admin',
    avatar: '👨‍💼',
    permissions: {
      view_jobs: true, add_jobs: true, edit_jobs: true, delete_jobs: true,
      view_applications: true, payment_access: true, chat_support: true,
      verify_documents: true, website_settings: true, database_access: true
    },
    addedAt: '2026-01-01',
    status: 'Active'
  },
  {
    id: 'staff_2',
    name: 'আনিসুর রহমান (Anisur)',
    email: 'anisur@probashi.gov.bd',
    role: 'Office Admin',
    avatar: '🧑‍💼',
    permissions: {
      view_jobs: true, add_jobs: true, edit_jobs: true, delete_jobs: false,
      view_applications: true, payment_access: false, chat_support: true,
      verify_documents: true, website_settings: false, database_access: false
    },
    addedAt: '2026-03-15',
    status: 'Active'
  },
  {
    id: 'staff_3',
    name: 'তারিকুল ইসলাম (Tariqul)',
    email: 'tariq@probashi.gov.bd',
    role: 'Staff',
    avatar: '👨‍💻',
    permissions: {
      view_jobs: true, add_jobs: false, edit_jobs: false, delete_jobs: false,
      view_applications: true, payment_access: false, chat_support: true,
      verify_documents: true, website_settings: false, database_access: false
    },
    addedAt: '2026-05-10',
    status: 'Active'
  }
];

interface AdminPanelProps {
  jobs: Job[];
  companies: Company[];
  transactions: Transaction[];
  italyPackages: ItalyPackageApplication[];
  applications: Application[];
  paymentMethods?: PaymentMethodSetting[];
  paymentAuditLogs?: PaymentAuditLog[];
  companyReports?: CompanyReport[];
  blacklistItems?: BlacklistedItem[];
  systemAuditLogs?: SystemAuditLog[];
  onUpdateReportStatus: (id: string, status: 'Pending' | 'Investigating' | 'Resolved' | 'Dismissed', adminNotes?: string, actionTaken?: string, resolvedBy?: string) => void;
  onAddBlacklistItem: (item: Omit<BlacklistedItem, 'id' | 'blacklistedAt'>) => void;
  onRemoveBlacklistItem: (id: string, removedBy: string) => void;
  onAddSystemAuditLog: (action: string, user: string, targetId: string, targetName: string, details: string) => void;
  onUpdatePaymentMethods?: (methods: PaymentMethodSetting[], log?: PaymentAuditLog) => void;
  onApproveJob: (id: string) => void;
  onRejectJob: (id: string) => void;
  onApproveCompany: (id: string) => void;
  onRejectCompany: (id: string) => void;
  onVerifyTransaction: (id: string, status: any, remarks?: string, verifiedBy?: string) => void;
  onAddTransaction?: (tx: Transaction) => void;
  onUpdateItalyPackageStatus: (id: string, status: 'Approved' | 'Rejected' | 'Pending', notes?: string, priceAmount?: string) => void;
  onUpdateItalyPackage: (updatedPkg: ItalyPackageApplication) => void;
  onUpdateApplicationDoc: (appId: string, field: 'passportNumber' | 'bmetCardNumber' | 'medicalStatus' | 'policeClearance' | 'status', value: any) => void;
  onUpdateApplicationStatus: (appId: string, status: 'Pending' | 'Shortlisted' | 'Rejected', interviewDate?: string) => void;
  onBroadcastNotification: (title: string, message: string) => void;
  categories: { name: string; icon: string; count: number }[];
  locations: string[];
  onAddCategory: (name: string) => void;
  onAddLocation: (name: string) => void;
  onUpdateCompany?: (updatedCompany: Company) => void;
  
  // SEO STATE PROPS
  seoConfigs?: SeoPageConfig[];
  globalSeo?: GlobalSeoSettings;
  onUpdateSeoConfigs?: (configs: SeoPageConfig[]) => void;
  onUpdateGlobalSeo?: (settings: GlobalSeoSettings) => void;
  
  // SECURE AUTH PROPS
  users?: PortalUser[];
  currentUser?: PortalUser | null;
  loginActivities?: LoginActivity[];
  onUpdateUsers?: (users: PortalUser[]) => void;
  onLogout?: () => void;
  onOpenAuthModal?: () => void;

  scamAlerts?: ScamAlert[];
  scamAuditLogs?: ScamAuditLog[];
  onAddScamAlert?: (newAlert: ScamAlert) => void;
  onUpdateScamAlert?: (id: string, updated: Partial<ScamAlert>) => void;
  onUpdateApplication?: (updatedApp: Application) => void;

  // BANK SYSTEM PROPS
  bankAccounts?: AgentBankAccount[];
  clientPayments?: ClientPaymentSubmission[];
  adminBankSettings?: AdminBankSettings;
  onUpdateAgentBankAccountStatus?: (id: string, status: BankAccountStatus, rejectionReason?: string) => void;
  onUpdateAgentBankAccount?: (id: string, updates: Partial<AgentBankAccount>) => void;
  onAddAgentBankAccount?: (account: Omit<AgentBankAccount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteAgentBankAccount?: (id: string) => void;
  onVerifyClientPaymentByAdmin?: (id: string, notes?: string) => void;
  onUpdateAdminBankSettings?: (settings: Partial<AdminBankSettings>) => void;
}

export default function AdminPanel({
  jobs,
  companies,
  transactions,
  italyPackages,
  applications,
  paymentMethods = [],
  paymentAuditLogs = [],
  companyReports = [],
  blacklistItems = [],
  systemAuditLogs = [],
  onUpdateReportStatus,
  onAddBlacklistItem,
  onRemoveBlacklistItem,
  onAddSystemAuditLog,
  onUpdatePaymentMethods,

  // BANK SYSTEM PROPS
  bankAccounts = [],
  clientPayments = [],
  adminBankSettings = DEFAULT_ADMIN_BANK_SETTINGS,
  onUpdateAgentBankAccountStatus = () => {},
  onUpdateAgentBankAccount = () => {},
  onAddAgentBankAccount = () => {},
  onDeleteAgentBankAccount = () => {},
  onVerifyClientPaymentByAdmin = () => {},
  onUpdateAdminBankSettings = () => {},
  onApproveJob,
  onRejectJob,
  onApproveCompany,
  onRejectCompany,
  onVerifyTransaction,
  onAddTransaction,
  onUpdateItalyPackageStatus,
  onUpdateItalyPackage,
  onUpdateApplicationDoc,
  onUpdateApplication,
  onUpdateApplicationStatus,
  onBroadcastNotification,
  categories,
  locations,
  onAddCategory,
  onAddLocation,
  onUpdateCompany,
  users = [],
  currentUser = null,
  loginActivities = [],
  onUpdateUsers = () => {},
  onLogout = () => {},
  onOpenAuthModal = () => {},
  seoConfigs = [],
  globalSeo = {
    sitemapXml: "",
    sitemapHtml: "",
    robotsTxt: "",
    googleVerificationCode: "",
    bingVerificationCode: "",
    isSitemapPinged: false,
    searchEngineIndexingEnabled: true
  },
  onUpdateSeoConfigs = () => {},
  onUpdateGlobalSeo = () => {},
  scamAlerts = [],
  scamAuditLogs = [],
  onAddScamAlert = () => {},
  onUpdateScamAlert = () => {}
}: AdminPanelProps) {
  // Staff state saved in localStorage
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('probashi_staff_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as StaffMember[];
        // Complete missing permissions gracefully for backward compatibility or local changes
        return parsed.map(s => {
          const defaultRef = DEFAULT_STAFF.find(d => d.role === s.role) || DEFAULT_STAFF[0];
          return {
            ...s,
            permissions: {
              ...defaultRef.permissions,
              ...(s.permissions || {})
            }
          };
        });
      } catch (e) {
        return DEFAULT_STAFF;
      }
    }
    return DEFAULT_STAFF;
  });

  const [activeStaffId, setActiveStaffId] = useState<string>(() => {
    return localStorage.getItem('probashi_active_staff_id') || 'staff_1';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchItalyCandidate, setSearchItalyCandidate] = useState('');
  
  const [expandedPkgId, setExpandedPkgId] = useState<string | null>(null);
  const [selectedItPkgDetail, setSelectedItPkgDetail] = useState<ItalyPackageApplication | null>(null);
  const [editingStepKey, setEditingStepKey] = useState<string | null>(null);
  const [stepStatus, setStepStatus] = useState<'Pending' | 'Processing' | 'Completed' | 'Rejected'>('Pending');
  const [stepDate, setStepDate] = useState('');
  const [stepStaff, setStepStaff] = useState('');
  const [stepNotes, setStepNotes] = useState('');
  const [stepDocName, setStepDocName] = useState('');

  // Input states for Staff Creator
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Office Admin' | 'Staff'>('Staff');

  // Activity Log State
  const [activityLogs, setActivityLogs] = useState(() => [
    { id: '1', time: '11:40 AM', user: 'মীররাজ রেজা (Super Admin)', action: 'রিস্টোর পয়েন্ট তৈরি করেছেন এবং ডাটাবেজ অপ্টিমাইজ করেছেন।', type: 'success' },
    { id: '2', time: '11:35 AM', user: 'আনিসুর রহমান (Office Admin)', action: 'কোম্পানি "Gulf Careers" এর লাইসেন্স RL-1452 ভেরিফাই করেছেন।', type: 'info' },
    { id: '3', time: '11:22 AM', user: 'তারিকুল ইসলাম (Staff)', action: 'আবেদনকারী কামাল উদ্দিনের পাসপোর্ট ও BMET স্মার্ট কার্ড অনুমোদন করেছেন।', type: 'info' }
  ]);

  // Support Ticketing State
  const [tickets, setTickets] = useState([
    { id: 't1', sender: 'কামাল উদ্দিন', role: 'Seeker', topic: 'পাসপোর্ট আপলোড হচ্ছে না', text: 'আমার পাসপোর্টের সাইজ ১ এমবির চেয়ে বেশি হওয়ায় আপলোড ব্যর্থ হচ্ছে। দয়া করে সমাধান করুন।', date: 'আজ ১০:১৫', status: 'Pending', chat: [{ from: 'user', text: 'আমার পাসপোর্টের সাইজ ১ এমবির চেয়ে বেশি হওয়ায় আপলোড ব্যর্থ হচ্ছে।' }] },
    { id: 't2', sender: 'আহমেদ রনি', role: 'Seeker', topic: 'BMET স্ট্যাটাস পেন্ডিং', text: 'আমি গতকাল স্মার্ট কার্ড যুক্ত করেছি কিন্তু এখনও ভেরিফিকেশন পেন্ডিং দেখাচ্ছে।', date: 'আজ ০৯:৩০', status: 'Pending', chat: [{ from: 'user', text: 'আমি গতকাল স্মার্ট কার্ড যুক্ত করেছি কিন্তু এখনও ভেরিফিকেশন পেন্ডিং দেখাচ্ছে।' }] },
    { id: 't3', sender: 'Gulf Careers HR', role: 'Employer', topic: 'পেমেন্ট ভেরিফাই হয়নি', text: 'আমরা বিকাশ দিয়ে ৫০০ টাকার প্রিমিয়াম পেমেন্ট করেছি কিন্তু ভিসা পোস্ট একটিভ হচ্ছে না।', date: 'গতকাল', status: 'Open', chat: [{ from: 'user', text: 'আমরা বিকাশ দিয়ে ৫০০ টাকার প্রিমিয়াম পেমেন্ট করেছি কিন্তু ভিসা পোস্ট একটিভ হচ্ছে না।' }] }
  ]);
  const [activeTicketId, setActiveTicketId] = useState('t1');
  const [replyText, setReplyText] = useState('');

  // Backup / Settings simulation
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [siteTitle, setSiteTitle] = useState('প্রবাসী জবস প্রফেশনাল পোর্টাল');
  const [hotline, setHotline] = useState('০৯৬১২৩৪৫৬৭৮');

  // Push notification states
  const [notifTitle, setNotifTitle] = useState('💼 নতুন চাকরির খোঁজ!');
  const [notifMessage, setNotifMessage] = useState('চমৎকার সুযোগ! আল-ইয়ামামা গ্রুপ (সৌদি আরব) ড্রাইভার পদের জন্য ইন্টারভিউ ঘোষণা করেছে।');

  // Category and Location addition states
  const [newCatName, setNewCatName] = useState('');
  const [newLocName, setNewLocName] = useState('');

  // Advanced Company Verification States
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState<Company | null>(null);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [companyStatusFilter, setCompanyStatusFilter] = useState<'All' | 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'Suspended'>('All');
  const [verificationRemarksInput, setVerificationRemarksInput] = useState('');
  const [companyActiveSubTab, setCompanyActiveSubTab] = useState<'profile' | 'owner' | 'documents' | 'jobs' | 'payments' | 'history'>('profile');
  const [selectedDocumentView, setSelectedDocumentView] = useState<{ name: string; fileType: string; status: string; uploadDate: string; verifiedBy?: string; url?: string } | null>(null);
  const [customDocStatuses, setCustomDocStatuses] = useState<Record<string, { status: 'Verified' | 'Pending' | 'Rejected'; remarks: string; verifiedBy: string; date: string }>>(() => {
    const saved = localStorage.getItem('probashi_custom_doc_statuses');
    return saved ? JSON.parse(saved) : {};
  });

  // Track version history of documents
  const [docVersionHistory, setDocVersionHistory] = useState<Record<string, { version: string; date: string; updatedBy: string; remarks: string }[]>>(() => {
    const saved = localStorage.getItem('probashi_doc_version_history');
    return saved ? JSON.parse(saved) : {
      'c5_trade_license': [
        { version: 'v1.0', date: '2026-06-12 10:30 AM', updatedBy: 'কোম্পানি রিক্রুটার', remarks: 'প্রাথমিক আপলোড' }
      ]
    };
  });

  // Anti-fraud / Scam management states
  const [newScamTitle, setNewScamTitle] = useState('');
  const [newScamPhone, setNewScamPhone] = useState('');
  const [newScamLocation, setNewScamLocation] = useState('');
  const [newScamCategory, setNewScamCategory] = useState<ScamAlertCategory>('fake_agent');
  const [newScamDescription, setNewScamDescription] = useState('');
  const [newScamPhoto, setNewScamPhoto] = useState('');
  const [newScamEvidenceName, setNewScamEvidenceName] = useState('');
  const [scamAlertsFilter, setScamAlertsFilter] = useState<'all' | 'pending' | 'approved' | 'archived'>('all');

  // Save custom doc statuses & version histories to localStorage when updated
  useEffect(() => {
    localStorage.setItem('probashi_custom_doc_statuses', JSON.stringify(customDocStatuses));
  }, [customDocStatuses]);

  useEffect(() => {
    localStorage.setItem('probashi_doc_version_history', JSON.stringify(docVersionHistory));
  }, [docVersionHistory]);

  // Payment Management Local States
  const [paymentSubTab, setPaymentSubTab] = useState<'verification' | 'methods' | 'reports' | 'audit'>('verification');
  const [txFilter, setTxFilter] = useState<'All' | 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'Refunded' | 'Correction Requested'>('All');
  const [txTypeFilter, setTxTypeFilter] = useState<'All' | 'Online' | 'Office'>('All');
  const [showArchived, setShowArchived] = useState(false);
  const [showAddOfficePayment, setShowAddOfficePayment] = useState(false);

  // Office payment entry fields
  const [officePayName, setOfficePayName] = useState('');
  const [officePayPhone, setOfficePayPhone] = useState('');
  const [officePayEmail, setOfficePayEmail] = useState('');
  const [officePayJobTitle, setOfficePayJobTitle] = useState('Italy Basic Work Visa Package');
  const [officePayCompanyName, setOfficePayCompanyName] = useState('Euro Bangla Manpower Services');
  const [officePayReceipt, setOfficePayReceipt] = useState('');
  const [officePayAmount, setOfficePayAmount] = useState('2500');
  const [officePayMethod, setOfficePayMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Bank'>('Cash');
  const [officePayBranch, setOfficePayBranch] = useState('Dhaka Main Branch');
  const [officePayDate, setOfficePayDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [officePayScreenshot, setOfficePayScreenshot] = useState('/assets/receipt_cash.png');
  const [officePayRemarks, setOfficePayRemarks] = useState('');

  const [selectedTxForDetail, setSelectedTxForDetail] = useState<Transaction | null>(null);
  const [verificationRemarks, setVerificationRemarks] = useState('');
  const [activeEditMethodId, setActiveEditMethodId] = useState<string | null>(null);
  const [editingMethodData, setEditingMethodData] = useState<PaymentMethodSetting | null>(null);
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [newMethodData, setNewMethodData] = useState<Partial<PaymentMethodSetting>>({
    name: '',
    type: 'manual',
    status: 'Enabled',
    accountType: 'Personal',
    accountNumber: '',
    accountHolderName: '',
    paymentInstructions: ''
  });

  // Live selected staff object (dynamically maps to real logged-in Admin/Staff)
  const activeStaff: StaffMember = React.useMemo(() => {
    if (currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'staff')) {
      return {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role === 'super_admin' ? 'Super Admin' : (currentUser.role === 'admin' ? 'Office Admin' : 'Staff'),
        avatar: currentUser.role === 'super_admin' ? '👑' : '👨‍💼',
        permissions: {
          view_jobs: true,
          add_jobs: true,
          edit_jobs: true,
          delete_jobs: currentUser.role === 'super_admin',
          view_applications: true,
          payment_access: currentUser.role === 'super_admin' || currentUser.role === 'admin',
          chat_support: true,
          verify_documents: true,
          website_settings: currentUser.role === 'super_admin',
          database_access: currentUser.role === 'super_admin',
        },
        addedAt: currentUser.createdAt || '2026-07-08',
        status: 'Active' as const
      };
    }
    return staffList.find(s => s.id === activeStaffId) || staffList[0] || DEFAULT_STAFF[0];
  }, [currentUser, staffList, activeStaffId]);

  // Save staff updates
  useEffect(() => {
    localStorage.setItem('probashi_staff_list', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('probashi_active_staff_id', activeStaffId);
  }, [activeStaffId]);

  // Logging Helper
  const addLog = (user: string, action: string, type: string = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLogs(prev => [
      { id: Date.now().toString(), time, user, action, type },
      ...prev
    ]);
    if (onAddSystemAuditLog) {
      onAddSystemAuditLog(action, user, 'N/A', 'N/A', action);
    }
  };

  // Permission Verification Helper
  const hasPermission = (permissionKey: keyof StaffMember['permissions']) => {
    if (activeStaff.role === 'Super Admin') return true;
    return activeStaff.permissions[permissionKey];
  };

  // Save selected company verification changes
  const handleSaveCompanyVerification = () => {
    if (!selectedCompanyDetail) return;
    if (!verificationRemarksInput.trim()) {
      alert("ভেরিফিকেশন সম্পন্ন করতে মন্তব্য লেখা আবশ্যক!");
      return;
    }

    const finalStatus = companyStatusFilter === 'All' ? 'Pending' : companyStatusFilter;
    const isApproved = finalStatus === 'Verified';

    const updatedComp: Company = {
      ...selectedCompanyDetail,
      companyStatus: finalStatus,
      isApproved: isApproved,
      verificationRemarks: verificationRemarksInput,
      verifiedBy: activeStaff.name,
      verificationDate: new Date().toLocaleString('bn-BD'),
      activityLog: [
        {
          action: `স্ট্যাটাস পরিবর্তন করা হয়েছে: ${finalStatus}`,
          user: activeStaff.name,
          date: new Date().toLocaleString('bn-BD'),
          remarks: verificationRemarksInput
        },
        ...(selectedCompanyDetail.activityLog || [])
      ]
    };

    if (onUpdateCompany) {
      onUpdateCompany(updatedComp);
    }
    
    if (isApproved && onApproveCompany) {
      onApproveCompany(selectedCompanyDetail.id);
    } else if ((finalStatus === 'Rejected' || finalStatus === 'Suspended') && onRejectCompany) {
      onRejectCompany(selectedCompanyDetail.id);
    }

    addLog(activeStaff.name, `এজেন্সি "${selectedCompanyDetail.name}" এর ভেরিফিকেশন স্থিতি '${finalStatus}' হিসেবে আপডেট করেছেন।`, isApproved ? 'success' : 'info');
    setSelectedCompanyDetail(updatedComp);
    alert("ভেরিফিকেশন রেকর্ড সফলভাবে সংরক্ষিত হয়েছে!");
  };

  // Add staff
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeStaff.role !== 'Super Admin') return;
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;

    // Default permissions based on role
    const isOffice = newStaffRole === 'Office Admin';
    const newStaff: StaffMember = {
      id: 'staff_' + Date.now(),
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      avatar: isOffice ? '🧑‍💼' : '👨‍💻',
      permissions: {
        view_jobs: true,
        add_jobs: isOffice,
        edit_jobs: isOffice,
        delete_jobs: false,
        view_applications: true,
        payment_access: false,
        chat_support: true,
        verify_documents: true,
        website_settings: false,
        database_access: false
      },
      addedAt: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    setStaffList(prev => [...prev, newStaff]);
    addLog(activeStaff.name, `নতুন স্টাফ "${newStaffName}" (${newStaffRole}) নিয়োগ দিয়েছেন।`, 'success');
    setNewStaffName('');
    setNewStaffEmail('');
  };

  // Toggle dynamic permission checkbox
  const handleTogglePermission = (staffId: string, key: keyof StaffMember['permissions']) => {
    if (activeStaff.role !== 'Super Admin') return;
    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        const updated = { ...s.permissions, [key]: !s.permissions[key] };
        addLog(activeStaff.name, `স্টাফ "${s.name}" এর "${key}" পারমিশন পরিবর্তন করেছেন।`, 'warning');
        return { ...s, permissions: updated };
      }
      return s;
    }));
  };

  // Delete staff member
  const handleDeleteStaff = (id: string) => {
    if (activeStaff.role !== 'Super Admin') return;
    const target = staffList.find(s => s.id === id);
    if (!target) return;
    if (target.role === 'Super Admin') {
      alert('সুপার অ্যাডমিন ডিলিট করা সম্ভব নয়!');
      return;
    }
    setStaffList(prev => prev.filter(s => s.id !== id));
    addLog(activeStaff.name, `স্টাফ "${target.name}" কে বরখাস্ত করেছেন।`, 'error');
  };

  // Handle support ticketing replies
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (!hasPermission('chat_support')) return;

    setTickets(prev => prev.map(t => {
      if (t.id === activeTicketId) {
        const updatedChat = [...t.chat, { from: 'admin', text: replyText }];
        // Simulate immediate response
        setTimeout(() => {
          setTickets(curr => curr.map(item => {
            if (item.id === activeTicketId) {
              return {
                ...item,
                chat: [...item.chat, { from: 'user', text: 'বুঝতে পেরেছি। ধন্যবাদ দ্রুত উত্তর দেওয়ার জন্য!' }]
              };
            }
            return item;
          }));
        }, 1200);

        return { ...t, status: 'Answered', chat: updatedChat };
      }
      return t;
    }));

    addLog(activeStaff.name, `সাপোর্ট টিকিট #${activeTicketId} এ উত্তর প্রদান করেছেন।`, 'info');
    setReplyText('');
  };

  // Verify Document simulator
  const handleVerifyApplicantDoc = (appId: string, docType: 'passport' | 'bmet' | 'medical') => {
    if (!hasPermission('verify_documents')) return;
    
    if (docType === 'passport') {
      onUpdateApplicationDoc(appId, 'policeClearance', 'Verified');
    } else if (docType === 'bmet') {
      onUpdateApplicationDoc(appId, 'bmetCardNumber', 'BMET-2026-' + Math.floor(10000 + Math.random() * 90000));
    } else if (docType === 'medical') {
      onUpdateApplicationDoc(appId, 'medicalStatus', 'Fit');
    }

    alert(`আবেদনকারীর ${docType === 'passport' ? 'পাসপোর্ট (পুলিশ ক্লিয়ারেন্স)' : docType === 'bmet' ? 'BMET কার্ড' : 'মেডিকেল চেক'} সফলভাবে যাচাই করা হয়েছে!`);
    addLog(activeStaff.name, `আবেদনপত্র #${appId} এর ${docType} যাচাই সম্পন্ন করেছেন।`, 'success');
  };

  // Database Backup simulation
  const handleDatabaseBackup = () => {
    if (!hasPermission('database_access')) return;
    setBackupLoading(true);
    setBackupProgress(10);
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackupLoading(false);
          addLog(activeStaff.name, `সিস্টেম ডাটাবেজ ব্যাকআপ সম্পন্ন করেছেন (Probashi_DB_Backup.json)`, 'success');
          alert('ডাটাবেজ ফাইল ব্যাকআপ সম্পূর্ণ হয়েছে এবং ডাউনলোড করা হয়েছে!');
          return 0;
        }
        return prev + 30;
      });
    }, 400);
  };

  // Standard checks
  const totalRevenue = transactions
    .filter(t => t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPaymentsCount = transactions.filter(t => t.status === 'Pending').length;
  const pendingJobsCount = jobs.filter(j => j.status === 'Pending').length;
  const pendingCompaniesCount = companies.filter(c => !c.isApproved).length;

  // Render Lock Card
  const renderLockOverlay = (permissionLabel: string, key: keyof StaffMember['permissions']) => (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center max-w-lg mx-auto my-12 space-y-6">
      <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-500 animate-pulse">
        <Lock className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-black text-slate-900">অ্যাক্সেস লকড (Access Restricted)</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          আপনার স্টাফ প্রোফাইল <strong className="text-slate-800">"{activeStaff.name}"</strong> এর জন্য <strong className="text-rose-600 font-black">"{permissionLabel}"</strong> অ্যাক্সেস নিষ্ক্রিয় রয়েছে।
        </p>
      </div>
      <div className="p-3 bg-slate-50 rounded-xl text-[10.5px] text-slate-500 border border-slate-100 leading-relaxed font-light">
        নিরাপত্তা বজায় রাখতে এবং প্রবাসী সিস্টেমের ডেটা সুরক্ষায় এই সেকশনটি শুধুমাত্র অনুমোদন প্রাপ্ত অ্যাডমিনদের জন্য উন্মুক্ত।
      </div>
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => {
            const admin = staffList.find(s => s.role === 'Super Admin');
            if (admin) setActiveStaffId(admin.id);
          }}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
        >
          <Unlock className="w-3.5 h-3.5 text-amber-400" /> সুপার অ্যাডমিনে স্যুইচ করুন
        </button>
      </div>
    </div>
  );

  const sidebarGroups = [
    {
      title: 'MANAGEMENT',
      items: [
        { id: 'jobs', label: 'Job Management', icon: Briefcase },
        { id: 'crm_workflow', label: 'Recruitment CRM', icon: Sparkles },
        { id: 'applications', label: 'Applications', icon: ClipboardList },
        { id: 'employers', label: 'Employers', icon: Building2 },
        { id: 'seeker-applications', label: 'Job Seekers', icon: Users, tabId: 'applications' },
        { id: 'staff', label: 'Staff Management', icon: Users },
        { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck, tabId: 'staff' },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'payments', label: 'Payments & Transactions', icon: CreditCard },
        { id: 'agent_banks', label: 'Agent Bank Accounts (RBAC)', icon: Landmark },
        { id: 'visa-steps', label: 'Visa Process', icon: ShieldCheck },
        { id: 'documents', label: 'Documents', icon: FileText, tabId: 'applications' },
        { id: 'countries', label: 'Countries', icon: Globe, tabId: 'categories' },
        { id: 'support', label: 'Email & SMS', icon: MessageSquare },
        { id: 'notifications', label: 'Notifications', icon: Bell },
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: Percent },
        { id: 'audit-logs', label: 'Activity Logs', icon: History },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { id: 'settings-general', label: 'General Settings', icon: Settings, tabId: 'settings' },
        { id: 'settings-payment', label: 'Payment Settings', icon: CreditCard, tabId: 'payments' },
        { id: 'settings-website', label: 'Website Settings', icon: Globe, tabId: 'seo' },
        { id: 'settings-backup', label: 'Backup & Restore', icon: Database, tabId: 'settings' },
      ]
    }
  ];

  return (
    <div className="bg-[#0B1329] text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full font-sans">
      
      {/* Redesigned Premium Top Header */}
      <div className="bg-[#080D1A] px-6 py-4 flex items-center justify-between border-b border-slate-900/60 shrink-0 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 bg-slate-800 border border-slate-700 rounded-xl hover:text-emerald-400 text-slate-200 transition focus:outline-none"
            title="মেনু বাটন"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Search bar (matching screen) */}
          <div className="relative hidden md:flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input 
              type="text" 
              placeholder="সার্চ করুন..." 
              className="bg-[#111A2E] text-xs text-white pl-9 pr-4 py-1.5 rounded-xl border border-slate-800/80 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-64"
            />
          </div>
        </div>

        {/* Right tools: Simulation selector, Notification, Language, Profile */}
        <div className="flex items-center gap-4">
          
          {/* Simulation Switcher */}
          <div className="flex items-center gap-1.5 bg-[#111A2E] p-1 rounded-xl border border-slate-850">
            <span className="text-[10px] text-slate-400 font-bold px-1.5 hidden sm:inline">স্টাফ একাউন্ট:</span>
            <select
              id="role-simulation-switcher"
              value={activeStaffId}
              onChange={(e) => {
                setActiveStaffId(e.target.value);
                addLog('System Switcher', `স্টাফ পরিবর্তন করে "${staffList.find(s=>s.id === e.target.value)?.name}" সেট করা হয়েছে।`, 'info');
              }}
              className="bg-[#080D1A] text-white font-semibold text-[11px] py-1 px-2 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {staffList.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Notification bell */}
          <button className="relative p-1.5 bg-[#111A2E] border border-[#1E294B] rounded-xl text-slate-300 hover:text-white hover:border-slate-700 transition">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center">8</span>
          </button>

          {/* Language selector */}
          <div className="flex items-center gap-1.5 bg-[#111A2E] border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300">
            <span>EN</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* User profile avatar info / Login trigger */}
          {currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'staff') ? (
            <div className="flex items-center gap-2 bg-[#111A2E]/60 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-emerald-500 border border-emerald-400 flex items-center justify-center text-xs text-white font-black overflow-hidden shadow-md">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#080D1A] rounded-full" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-white leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-400 font-bold mt-0.5 leading-none">Logged In ({currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role === 'admin' ? 'Admin' : 'Staff'})</p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuthModal?.()}
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-[11px] transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              🔐 লগইন করুন (Staff Login)
            </button>
          )}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Drawer Backdrop on Mobile/Tablet */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden absolute inset-0 bg-slate-950/60 z-40 backdrop-blur-xs transition-opacity duration-200" 
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* Left Sidebar Navigation */}
        <div className={`bg-[#080D1A] text-slate-300 flex flex-col justify-between overflow-y-auto shrink-0 py-4 transition-all duration-200 border-r border-slate-900/80 ${
          mobileMenuOpen 
            ? 'absolute inset-y-0 left-0 w-64 h-full z-50 border-r border-slate-800 shadow-2xl' 
            : 'hidden lg:flex lg:relative lg:w-64'
        }`}>
          <div className="space-y-6">
            
            {/* Logo */}
            <div className="px-6 pb-2 flex items-center gap-2 border-b border-slate-900/60">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-black text-white tracking-wide">BDJobs <span className="text-emerald-400">Pro</span></span>
            </div>

            {/* Active User Mini Widget */}
            <div className="px-4">
              <div className="flex items-center justify-between p-3 bg-[#111A2E]/50 rounded-xl border border-slate-850/60">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-slate-850 border border-slate-700 flex items-center justify-center text-lg overflow-hidden shadow-inner">
                      {activeStaff.avatar}
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#080D1A] rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-100 truncate">{activeStaff.name}</p>
                    <p className={`text-[9px] font-bold mt-0.5 inline-block px-1.5 py-0.2 rounded-full ${
                      activeStaff.role === 'Super Admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      activeStaff.role === 'Office Admin' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {activeStaff.role}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                  }}
                  title="Logout Account"
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 transition cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Nav Groups */}
            <div className="px-3 space-y-4">
              {/* Dashboard tab directly */}
              <div>
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    <span>Dashboard</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeTab === 'dashboard' ? 'text-slate-950' : ''}`} />
                </button>
              </div>

              {sidebarGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-3 mb-1.5">{group.title}</p>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isItemActive = activeTab === (item.tabId || item.id);
                    return (
                      <button
                        key={item.id}
                        id={`sidebar-tab-${item.id}`}
                        onClick={() => {
                          setActiveTab(item.tabId || item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                          isItemActive 
                            ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform ${isItemActive ? 'text-slate-950' : ''}`} />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

          </div>

          {/* System status widget & footer */}
          <div className="px-4 py-2 space-y-4 border-t border-slate-900/80 pt-4 mt-auto">
            <div className="p-3 bg-[#111A2E]/40 rounded-xl border border-slate-850/40 space-y-2.5">
              <p className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest">SYSTEM STATUS</p>
              
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-medium">Server</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-medium">Database</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>

              {/* Storage bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>Storage Usage</span>
                  <span className="text-slate-200 font-semibold">72%</span>
                </div>
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>

              {/* Bandwidth bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>Bandwidth Usage</span>
                  <span className="text-slate-200 font-semibold">48%</span>
                </div>
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '48%' }} />
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-600 font-medium text-center">
              © 2024 BDJobs Pro. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Content Workspace */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#0B111E] text-slate-100">
          
          {/* TAB 1.5: VISA PROCESSING STEPS CENTRAL CONTROLLER */}
          {activeTab === 'visa-steps' && (
            <VisaProcessingStepsTab 
              italyPackages={italyPackages}
              onUpdateItalyPackage={onUpdateItalyPackage}
              activeStaff={activeStaff}
              addLog={addLog}
              onBroadcastNotification={onBroadcastNotification}
            />
          )}
          
          {/* TAB 1.6: VISA STEP MANAGER & AMOUNT ENTRY */}
          {activeTab === 'visa-step-manager' && (
            <VisaStepManagerTab 
              italyPackages={italyPackages}
              onUpdateItalyPackage={onUpdateItalyPackage}
              activeStaff={activeStaff}
              addLog={addLog}
              onBroadcastNotification={onBroadcastNotification}
              companies={companies}
              transactions={transactions}
            />
          )}
          
          {activeTab === 'crm_workflow' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm animate-fade-in space-y-6">
              <CrmWorkflowSection 
                viewType="admin" 
                applications={applications} 
                onUpdateApplication={onUpdateApplication || (() => {})} 
              />
            </div>
          )}
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Date Header & Quick Actions row */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900/40 pb-5">
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Dashboard</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Home / Dashboard</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button className="flex items-center gap-2 bg-[#111A2E] text-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-800 hover:text-white hover:border-slate-700 transition">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>01 July 2024 - 31 July 2024</span>
                  </button>
                  <button onClick={() => setActiveTab('jobs')} className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/15 transition">
                    <span>Quick Actions</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveTab('settings')} className="bg-[#111A2E] border border-slate-800 p-2 text-slate-400 hover:text-white hover:border-slate-700 rounded-xl transition">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bento KPI Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Jobs */}
                <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-850 shadow-md flex items-center justify-between">
                  <div className="space-y-1.5">
                    <span className="text-xs text-slate-400 font-bold tracking-wide uppercase">Total Jobs</span>
                    <p className="text-2xl font-black text-white">1,250</p>
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> +12.5% <span className="text-slate-500 font-normal">from last month</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/15">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>

                {/* Total Applications */}
                <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-850 shadow-md flex items-center justify-between">
                  <div className="space-y-1.5">
                    <span className="text-xs text-slate-400 font-bold tracking-wide uppercase">Total Applications</span>
                    <p className="text-2xl font-black text-white">8,542</p>
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> +18.3% <span className="text-slate-500 font-normal">from last month</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/15">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                {/* Total Employers */}
                <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-850 shadow-md flex items-center justify-between">
                  <div className="space-y-1.5">
                    <span className="text-xs text-slate-400 font-bold tracking-wide uppercase">Total Employers</span>
                    <p className="text-2xl font-black text-white">532</p>
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> +8.7% <span className="text-slate-500 font-normal">from last month</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center border border-purple-500/15">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Total Job Seekers */}
                <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-850 shadow-md flex items-center justify-between">
                  <div className="space-y-1.5">
                    <span className="text-xs text-slate-400 font-bold tracking-wide uppercase">Total Job Seekers</span>
                    <p className="text-2xl font-black text-white">12,850</p>
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> +15.2% <span className="text-slate-500 font-normal">from last month</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/15">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Bento Row 1: Applications Overview Chart & Recent Applications */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chart Column */}
                <div className="lg:col-span-2 bg-[#131C31] p-5 rounded-2xl border border-slate-850/80 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Applications Overview</h3>
                      <p className="text-[11px] text-slate-400">Monthly applicant trend comparison</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        Total Applications
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Approved
                      </span>
                    </div>
                  </div>

                  {/* Elegant SVG Area Chart */}
                  <div className="relative h-60 w-full pt-4">
                    {/* Gridlines */}
                    <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none pb-6">
                      {['2.5K', '2.0K', '1.5K', '1.0K', '500', '0'].map((label, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                          <span className="w-8 text-right pr-2">{label}</span>
                          <div className="flex-1 border-t border-slate-800/40 border-dashed" />
                        </div>
                      ))}
                    </div>

                    {/* SVG Line path & Areas */}
                    <div className="absolute inset-y-0 left-8 right-0 pb-6">
                      <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Total Applications Area & Path */}
                        <path d="M 0 110 Q 40 100, 80 95 T 160 80 T 240 85 T 320 60 T 400 45 T 480 30" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                        <path d="M 0 110 Q 40 100, 80 95 T 160 80 T 240 85 T 320 60 T 400 45 T 480 30 L 480 150 L 0 150 Z" fill="url(#gradBlue)" />

                        {/* Approved Area & Path */}
                        <path d="M 0 130 Q 40 120, 80 115 T 160 100 T 240 105 T 320 80 T 400 65 T 480 50" fill="none" stroke="#10b981" strokeWidth="2.5" />
                        <path d="M 0 130 Q 40 120, 80 115 T 160 100 T 240 105 T 320 80 T 400 65 T 480 50 L 480 150 L 0 150 Z" fill="url(#gradGreen)" />

                        {/* Hover circles at data points */}
                        {[0, 80, 160, 240, 320, 400, 480].map((cx, i) => {
                          const blueYs = [110, 95, 80, 85, 60, 45, 30];
                          const greenYs = [130, 115, 100, 105, 80, 65, 50];
                          return (
                            <g key={i}>
                              <circle cx={cx} cy={blueYs[i]} r="4" fill="#3b82f6" stroke="#131C31" strokeWidth="1.5" className="hover:scale-125 transition-transform cursor-pointer" />
                              <circle cx={cx} cy={greenYs[i]} r="4" fill="#10b981" stroke="#131C31" strokeWidth="1.5" className="hover:scale-125 transition-transform cursor-pointer" />
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Months X-Axis Labels */}
                    <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[9px] font-mono text-slate-500">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Applicants Column */}
                <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-850/80 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Recent Applications</h3>
                      <p className="text-[11px] text-slate-400">Latest applicants across roles</p>
                    </div>
                    <button onClick={() => setActiveTab('applications')} className="text-xs font-bold text-emerald-400 hover:underline">View All</button>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { name: 'Md. Saiful Islam', role: 'Construction Worker', status: 'Pending', time: '2 min ago', color: 'amber' },
                      { name: 'Akter Hossain', role: 'Hotel Cleaner', status: 'Review', time: '10 min ago', color: 'blue' },
                      { name: 'Rina Akter', role: 'Nurse', status: 'Approved', time: '25 min ago', color: 'emerald' },
                      { name: 'Jahid Hasan', role: 'Driver', status: 'Pending', time: '35 min ago', color: 'amber' },
                      { name: 'Mizanur Rahman', role: 'Electrician', status: 'Rejected', time: '1 hour ago', color: 'rose' }
                    ].map((app, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-slate-800/40 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-850 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                            {app.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{app.name}</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{app.role}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                            app.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            app.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            app.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {app.status}
                          </span>
                          <p className="text-[9px] text-slate-500 mt-1">{app.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bento Row 2: Donut Charts & Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Job Status Overview (Donut) */}
                <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-850/80 shadow-md space-y-4">
                  <h3 className="text-sm font-bold text-white">Job Status Overview</h3>
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                      <svg width="112" height="112" viewBox="0 0 42 42" className="transform -rotate-90">
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#1E294B" strokeWidth="4" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="52.2 47.8" strokeDashoffset="0" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-52.2" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="14.9 85.1" strokeDashoffset="-77.2" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeDasharray="7.9 92.1" strokeDashoffset="-92.1" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-black text-white">1,250</span>
                        <span className="text-[9px] text-slate-400 font-medium leading-none">Total Jobs</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-400 truncate"><span className="w-2 h-2 rounded-full bg-emerald-500" />Active</span>
                        <span className="text-white font-bold pl-2">652</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-400 truncate"><span className="w-2 h-2 rounded-full bg-rose-500" />Expired</span>
                        <span className="text-white font-bold pl-2">312</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-400 truncate"><span className="w-2 h-2 rounded-full bg-amber-500" />Draft</span>
                        <span className="text-white font-bold pl-2">186</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-400 truncate"><span className="w-2 h-2 rounded-full bg-blue-500" />Pending</span>
                        <span className="text-white font-bold pl-2">100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applications By Status (Donut) */}
                <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-850/80 shadow-md space-y-4">
                  <h3 className="text-sm font-bold text-white">Applications By Status</h3>
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                      <svg width="112" height="112" viewBox="0 0 42 42" className="transform -rotate-90">
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#1E294B" strokeWidth="4" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="42.7 57.3" strokeDashoffset="0" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="33.4 66.6" strokeDashoffset="-42.7" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeDasharray="14.7 85.3" strokeDashoffset="-76.1" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray="9.2 90.8" strokeDashoffset="-90.8" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-black text-white">8,542</span>
                        <span className="text-[9px] text-slate-400 font-medium leading-none">Total</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-400 truncate"><span className="w-2 h-2 rounded-full bg-emerald-500" />Approved</span>
                        <span className="text-white font-bold pl-2">3,652</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-400 truncate"><span className="w-2 h-2 rounded-full bg-amber-500" />Pending</span>
                        <span className="text-white font-bold pl-2">2,854</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-400 truncate"><span className="w-2 h-2 rounded-full bg-blue-500" />In Review</span>
                        <span className="text-white font-bold pl-2">1,256</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-400 truncate"><span className="w-2 h-2 rounded-full bg-rose-500" />Rejected</span>
                        <span className="text-white font-bold pl-2">780</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links Column */}
                <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-850/80 shadow-md space-y-3.5">
                  <h3 className="text-sm font-bold text-white">Quick Links</h3>
                  
                  <div className="space-y-2 flex flex-col">
                    {[
                      { label: 'Add New Job', icon: Plus, color: 'text-emerald-400 bg-emerald-500/10', action: () => setActiveTab('jobs') },
                      { label: 'Manage Employers', icon: Building2, color: 'text-purple-400 bg-purple-500/10', action: () => setActiveTab('employers') },
                      { label: 'Manage Job Seekers', icon: Users, color: 'text-orange-400 bg-orange-500/10', action: () => setActiveTab('applications') },
                      { label: 'Visa Process', icon: ClipboardList, color: 'text-blue-400 bg-blue-500/10', action: () => setActiveTab('visa-steps') },
                      { label: 'Payments & Transactions', icon: CreditCard, color: 'text-emerald-400 bg-emerald-500/10', action: () => setActiveTab('payments') },
                      { label: 'System Settings', icon: Settings, color: 'text-slate-400 bg-slate-500/10', action: () => setActiveTab('settings') },
                    ].map((link, i) => {
                      const LinkIcon = link.icon;
                      return (
                        <button key={i} onClick={link.action} className="w-full flex items-center justify-between p-2 bg-[#1a253f]/40 hover:bg-[#1a253f]/80 rounded-xl border border-slate-800/40 transition text-left group">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${link.color}`}>
                              <LinkIcon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{link.label}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bento Row 3: Latest Jobs & Top Employers */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Latest Jobs Table Card */}
                <div className="lg:col-span-2 bg-[#131C31] p-5 rounded-2xl border border-slate-850/80 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Latest Jobs</h3>
                      <p className="text-[11px] text-slate-400">Newly posted job openings</p>
                    </div>
                    <button onClick={() => setActiveTab('jobs')} className="text-xs font-bold text-emerald-400 hover:underline">View All</button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-800/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider pb-2">
                          <th className="py-2.5">Job Title</th>
                          <th className="py-2.5">Employer</th>
                          <th className="py-2.5 text-center">Apps</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5 text-right">Posted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {[
                          { title: 'Construction Worker', employer: 'Al Madina Group', apps: 45, status: 'Active', posted: '1 hour ago', color: 'emerald' },
                          { title: 'Hotel Cleaner', employer: 'Accor Hotels', apps: 32, status: 'Active', posted: '3 hours ago', color: 'emerald' },
                          { title: 'Driver (Light Vehicle)', employer: 'Salik Group', apps: 28, status: 'Active', posted: '5 hours ago', color: 'emerald' },
                          { title: 'Nurse (Clinical Support)', employer: 'Medicare Hospital', apps: 25, status: 'Active', posted: '7 hours ago', color: 'emerald' },
                          { title: 'Electrician Assistant', employer: 'Power Tech Ltd.', apps: 20, status: 'Pending', posted: '9 hours ago', color: 'amber' }
                        ].map((job, i) => (
                          <tr key={i} className="hover:bg-slate-800/10 transition-colors">
                            <td className="py-2.5 font-bold text-white max-w-[150px] truncate">{job.title}</td>
                            <td className="py-2.5 text-slate-400">{job.employer}</td>
                            <td className="py-2.5 text-center font-mono font-bold text-slate-200">{job.apps}</td>
                            <td className="py-2.5">
                              <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                job.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>{job.status}</span>
                            </td>
                            <td className="py-2.5 text-right text-slate-500 font-medium">{job.posted}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Employers List Card */}
                <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-850/80 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Top Employers</h3>
                      <p className="text-[11px] text-slate-400">Agencies with highest activity</p>
                    </div>
                    <button onClick={() => setActiveTab('employers')} className="text-xs font-bold text-emerald-400 hover:underline">View All</button>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { name: 'Al Madina Group', jobs: 120, apps: 350 },
                      { name: 'Accor Hotels', jobs: 85, apps: 280 },
                      { name: 'Salik Group', jobs: 95, apps: 210 },
                      { name: 'NPCC Company', jobs: 60, apps: 190 },
                      { name: 'Power Tech Ltd.', jobs: 55, apps: 160 }
                    ].map((emp, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-slate-800/40 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#1e294b] flex items-center justify-center font-black text-xs text-indigo-400">
                            {emp.name.split(' ')[0].substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{emp.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{emp.jobs} Jobs Posted</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-mono font-bold text-slate-100">{emp.apps}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">Applications</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bento Row 4: Recent Transactions & System Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Transactions Table Card */}
                <div className="lg:col-span-2 bg-[#131C31] p-5 rounded-2xl border border-slate-850/80 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
                      <p className="text-[11px] text-slate-400">Latest payment entries recorded</p>
                    </div>
                    <button onClick={() => setActiveTab('payments')} className="text-xs font-bold text-emerald-400 hover:underline">View All</button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-800/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider pb-2">
                          <th className="py-2.5">Tx ID</th>
                          <th className="py-2.5">Type</th>
                          <th className="py-2.5">Amount</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5 text-right">Date/Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {[
                          { id: 'TRX-2024-001', type: 'Job Post Premium', amount: '৳3,500', status: 'Completed', color: 'emerald', time: '2 min ago' },
                          { id: 'TRX-2024-002', type: 'Application Processing', amount: '৳500', status: 'Completed', color: 'emerald', time: '10 min ago' },
                          { id: 'TRX-2024-003', type: 'Agency Premium Plan', amount: '৳2,000', status: 'Completed', color: 'emerald', time: '30 min ago' },
                          { id: 'TRX-2024-004', type: 'Job Post Featured', amount: '৳4,500', status: 'Pending', color: 'amber', time: '45 min ago' },
                          { id: 'TRX-2024-005', type: 'Featured Carousel Placement', amount: '৳1,200', status: 'Completed', color: 'emerald', time: '1 hour ago' }
                        ].map((tx, i) => (
                          <tr key={i} className="hover:bg-slate-800/10 transition-colors">
                            <td className="py-2.5 font-mono font-bold text-slate-200">{tx.id}</td>
                            <td className="py-2.5 text-slate-400 font-medium">{tx.type}</td>
                            <td className="py-2.5 font-mono font-black text-emerald-400">{tx.amount}</td>
                            <td className="py-2.5">
                              <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                tx.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>{tx.status}</span>
                            </td>
                            <td className="py-2.5 text-right text-slate-500 font-medium">{tx.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* System Activity Feed Card */}
                <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-850/80 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">System Activity</h3>
                      <p className="text-[11px] text-slate-400">Live operational event log</p>
                    </div>
                    <button onClick={() => setActiveTab('audit-logs')} className="text-xs font-bold text-emerald-400 hover:underline">View Logs</button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { text: 'New job "Construction Worker" approved', time: '2 min ago', type: 'success' },
                      { text: 'Payment verification requested for TRX-2024-004', time: '5 min ago', type: 'info' },
                      { text: 'Scam alert flag triggered for visa permit no. 4812', time: '12 min ago', type: 'warning' },
                      { text: 'User profile Ariful Islam updated system settings', time: '15 min ago', type: 'info' },
                      { text: 'System automatic backup script completed', time: '1 hour ago', type: 'success' }
                    ].map((act, i) => (
                      <div key={i} className="flex gap-3 text-xs">
                        <div className="relative flex flex-col items-center shrink-0">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                            act.type === 'success' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' :
                            act.type === 'warning' ? 'bg-rose-500 shadow-lg shadow-rose-500/30' :
                            'bg-blue-500 shadow-lg shadow-blue-500/30'
                          }`} />
                          {i < 4 && <div className="w-0.5 flex-1 bg-slate-800/80 my-1" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-slate-200 font-medium leading-normal">{act.text}</p>
                          <p className="text-[9.5px] text-slate-500 mt-0.5">{act.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: STAFF & PERMISSIONS */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              {activeStaff.role !== 'Super Admin' ? (
                renderLockOverlay('স্টাফ তৈরি ও পারমিশন কন্ট্রোল', 'website_settings')
              ) : (
                <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Staff List & Creator */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">কর্মকর্তা ও স্টাফ ম্যানেজমেন্ট</h3>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">প্রবাসী পোর্টালে যুক্ত সব স্টাফদের তালিকা ও ভূমিকা</p>
                      </div>
                      <span className="text-[10px] bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full text-indigo-700 font-bold">
                        সক্রিয় স্টাফ: {staffList.length} জন
                      </span>
                    </div>

                    {/* New Staff Creator */}
                    <form onSubmit={handleAddStaff} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
                      <p className="text-[11px] font-bold text-slate-700">🆕 নতুন অফিস স্টাফ/অ্যাডমিন যোগ করুন</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="পূর্ণ নাম (যেমন: আনিসুর রহমান)"
                          value={newStaffName}
                          onChange={(e) => setNewStaffName(e.target.value)}
                          className="bg-white text-xs py-1.5 px-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <input
                          type="email"
                          required
                          placeholder="ইমেইল (name@probashi.gov.bd)"
                          value={newStaffEmail}
                          onChange={(e) => setNewStaffEmail(e.target.value)}
                          className="bg-white text-xs py-1.5 px-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <div className="flex gap-1">
                          <select
                            value={newStaffRole}
                            onChange={(e: any) => setNewStaffRole(e.target.value)}
                            className="bg-white text-xs py-1.5 px-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1 cursor-pointer"
                          >
                            <option value="Office Admin">Office Admin</option>
                            <option value="Staff">Staff</option>
                          </select>
                          <button
                            type="submit"
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 rounded-lg flex items-center justify-center shrink-0"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Staff Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                            <th className="p-2.5">স্টাফ</th>
                            <th className="p-2.5">রোল (Role)</th>
                            <th className="p-2.5 text-right">পদক্ষেপ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150">
                          {staffList.map((st) => (
                            <tr key={st.id} className="hover:bg-slate-50/40">
                              <td className="p-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg bg-slate-100 p-1 rounded-full">{st.avatar}</span>
                                  <div>
                                    <p className="font-bold text-slate-800">{st.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{st.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 rounded text-[9.5px] font-black ${
                                  st.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' :
                                  st.role === 'Office Admin' ? 'bg-blue-100 text-blue-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {st.role}
                                </span>
                              </td>
                              <td className="p-2.5 text-right">
                                {st.role !== 'Super Admin' ? (
                                  <button
                                    onClick={() => handleDeleteStaff(st.id)}
                                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                                    title="বরখাস্ত করুন"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-400">মাস্টার</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: Permissions Control Center Matrix */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div>
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">রোল ও পারমিশন ম্যাট্রিক্স (Interactive)</h3>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">যেকোনো স্টাফের জন্য নির্দিষ্ট কাজের এক্সেস চালু বা বন্ধ করুন</p>
                    </div>

                    <div className="space-y-3.5">
                      {staffList.filter(s => s.role !== 'Super Admin').map((st) => (
                        <div key={st.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{st.avatar}</span>
                              <strong className="text-xs text-slate-800">{st.name} ({st.role})</strong>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">ID: {st.id.slice(0, 8)}</span>
                          </div>

                          {/* Specific Checklist */}
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10.5px]">
                            {[
                              { key: 'view_jobs', label: '✅ View Jobs' },
                              { key: 'add_jobs', label: '✅ Add/Approve Jobs' },
                              { key: 'edit_jobs', label: '✅ Edit Jobs' },
                              { key: 'delete_jobs', label: '❌ Delete Jobs' },
                              { key: 'view_applications', label: '✅ View Applications' },
                              { key: 'payment_access', label: '❌ Payment Access' },
                              { key: 'chat_support', label: '✅ Chat Support' },
                              { key: 'verify_documents', label: '✅ Verify Documents' },
                              { key: 'website_settings', label: '❌ Website Settings' },
                              { key: 'database_access', label: '❌ Database Access' }
                            ].map((perm) => {
                              const isChecked = st.permissions[perm.key as keyof StaffMember['permissions']];
                              return (
                                <label 
                                  key={perm.key} 
                                  className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-100 rounded-lg transition"
                                >
                                  <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleTogglePermission(st.id, perm.key as keyof StaffMember['permissions'])}
                                    className="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                                  />
                                  <span className={`font-semibold ${isChecked ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                                    {perm.label}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      <div className="p-3.5 bg-indigo-50 border border-indigo-150 rounded-xl text-[10px] text-indigo-900 leading-normal font-light">
                        <strong>💡 রিয়েল-টাইম রোল এনফোর্সমেন্ট:</strong><br/>
                        ১. এখানে কোনো স্টাফের পারমিশন আনচেক করলে তা তৎক্ষণাৎ কার্যকর হবে।<br/>
                        ২. উপর ডানপাশের সিমুলেটর ড্রপডাউনে সেই স্টাফকে সিলেক্ট করলে তার জন্য নির্দিষ্ট সেকশন লক হয়ে যাবে।
                      </div>
                    </div>
                  </div>

                </div>

                {/* Secure Authentication Management Suite */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 pt-6 border-t border-slate-200">
                  
                  {/* Left: Account Unlock Center */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div>
                      <h3 className="text-xs font-black uppercase text-rose-500 tracking-wider flex items-center gap-1.5">
                        <Unlock className="w-4 h-4" />
                        লকড একাউন্ট ও নিরাপত্তা আনলকার (Account Unlocker)
                      </h3>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">অসফল লগইন চেষ্টা বা সাসপেন্ডেড একাউন্ট আনলক ও পুনরুদ্ধার করুন</p>
                    </div>

                    <div className="space-y-3">
                      {users.filter(u => u.status === 'Suspended' || u.failedAttempts > 0).length === 0 ? (
                        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-center text-xs text-emerald-800 flex flex-col items-center gap-2">
                          <ShieldCheck className="w-8 h-8 text-emerald-500" />
                          <span className="font-bold">বর্তমানে কোনো লকড বা অবরুদ্ধ একাউন্ট নেই!</span>
                          <span className="text-[10px] text-slate-400 font-light">সব ব্যবহারকারীর একাউন্ট বর্তমানে নিরাপদ ও সচল রয়েছে।</span>
                        </div>
                      ) : (
                        users.filter(u => u.status === 'Suspended' || u.failedAttempts > 0).map((u) => {
                          const isTempLock = u.failedAttempts >= 5;
                          return (
                            <div key={u.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center gap-2">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                                  <strong className="text-xs text-slate-800">{u.name}</strong>
                                  <span className="bg-rose-100 text-rose-700 text-[8.5px] font-black px-1.5 py-0.2 rounded uppercase">
                                    {u.role === 'seeker' ? 'প্রার্থী' : 'নিয়োগকর্তা'}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{u.email || u.mobile}</p>
                                <p className="text-[9.5px] text-rose-600 font-bold mt-1.5 bg-rose-50 border border-rose-100 p-1 rounded">
                                  ⚠️ {isTempLock ? `৫ বার ভুল পাসওয়ার্ডের কারণে লকড (অসফল চেষ্টা: ${u.failedAttempts})` : 'সাসপেন্ডেড/অসচল একাউন্ট'}
                                </p>
                              </div>
                              
                              <button
                                onClick={() => {
                                  const confirmUnlock = window.confirm(`আপনি কি নিশ্চিতভাবে ${u.name} এর একাউন্টটি আনলক করে সচল করতে চান?`);
                                  if (confirmUnlock) {
                                    const updated = users.map(item => {
                                      if (item.id === u.id) {
                                        return {
                                          ...item,
                                          status: 'Active' as const,
                                          failedAttempts: 0,
                                          isLocked: false
                                        };
                                      }
                                      return item;
                                    });
                                    onUpdateUsers(updated);
                                    addLog(activeStaff.name, `ব্যবহারকারী "${u.name}" (${u.email || u.mobile}) এর একাউন্ট আনলক করেছেন।`, 'success');
                                    alert('একাউন্টটি সফলভাবে সচল করা হয়েছে!');
                                  }
                                }}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10.5px] rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                                আনলক করুন
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right: Security & Login Audit Log browsable feed */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                          <History className="w-4 h-4 text-slate-600" />
                          নিরাপত্তা ও লগইন অডিট হিস্ট্রি (Security Login Audit Feed)
                        </h3>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">রিয়েল-টাইম সফল, অসফল এবং পাসওয়ার্ড ভুলের অডিট ট্রেইল</p>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono">
                        মোট লগ: {loginActivities.length} টি
                      </span>
                    </div>

                    <div className="overflow-hidden border border-slate-200 rounded-xl max-h-[300px] overflow-y-auto">
                      <table className="w-full text-left text-[10.5px] border-collapse">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0 z-10">
                          <tr>
                            <th className="p-2">সময় ও তারিখ</th>
                            <th className="p-2">আইডি/ইমেইল</th>
                            <th className="p-2">ভূমিকা</th>
                            <th className="p-2">ডিভাইস ও ব্রাউজার</th>
                            <th className="p-2 text-right">স্ট্যাটাস</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150">
                          {loginActivities.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-400">
                                অডিট লগে কোনো নতুন অ্যাক্টিভিটি রেকর্ড পাওয়া যায়নি।
                              </td>
                            </tr>
                          ) : (
                            loginActivities.map((act) => {
                              return (
                                <tr key={act.id} className="hover:bg-slate-50/40 font-mono">
                                  <td className="p-2 text-slate-500 whitespace-nowrap">{act.loginTime}</td>
                                  <td className="p-2 text-slate-700 max-w-[120px] truncate" title={act.userEmail || act.userId}>
                                    {act.userEmail || act.userId}
                                  </td>
                                  <td className="p-2">
                                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">
                                      {act.userRole}
                                    </span>
                                  </td>
                                  <td className="p-2 text-slate-400 truncate max-w-[110px]" title={act.browser + ' / ' + act.ipAddress}>
                                    {act.device} ({act.ipAddress})
                                  </td>
                                  <td className="p-2 text-right">
                                    <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold ${
                                      act.status === 'Active Session' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                      act.status === 'Success' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                      act.status === 'Failed' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                      'bg-rose-100 text-rose-800 border border-rose-200'
                                    }`}>
                                      {act.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: JOB APPROVALS */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              {!hasPermission('view_jobs') ? (
                renderLockOverlay('চাকরি দেখার অনুমতি', 'view_jobs')
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-700">অনুমোদনের অপেক্ষায় থাকা প্রবাসী চাকরির তালিকা ({pendingJobsCount})</h3>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {jobs.filter(j => j.status === 'Pending').length > 0 ? (
                      jobs.filter(j => j.status === 'Pending').map((job) => (
                        <div key={job.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/40">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                              {job.companyLogo || '✈️'}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                {job.title}
                                {job.isPremium && (
                                  <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[8.5px] font-black px-1.5 py-0.2 rounded">PREMIUM AGENCY</span>
                                )}
                              </h4>
                              <p className="text-[11px] text-emerald-500 font-medium mt-0.5">{job.companyName}</p>
                              <div className="flex items-center gap-2.5 text-[10px] text-slate-500 mt-1.5 flex-wrap">
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold">{job.type}</span>
                                <span>📍 গন্তব্য: <strong>{job.country}</strong> ({job.location})</span>
                                <span className="text-indigo-600">🛂 ভিসা: <strong>{job.visaType}</strong></span>
                                <span className="text-emerald-600">💰 বেতন: {job.salary}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0 w-full md:w-auto justify-end">
                            <button
                              disabled={!hasPermission('delete_jobs')}
                              onClick={() => {
                                onRejectJob(job.id);
                                addLog(activeStaff.name, `চাকরি #${job.id} ("${job.title}") বাতিল বা নাকচ করেছেন।`, 'error');
                              }}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition ${
                                !hasPermission('delete_jobs') 
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  : 'border-slate-200 hover:bg-rose-50 text-rose-500'
                              }`}
                              title={!hasPermission('delete_jobs') ? 'চাকরি মুছে ফেলার পারমিশন আপনার নেই' : ''}
                            >
                              <X className="w-3.5 h-3.5" /> নাকচ করুন
                            </button>

                            <button
                              disabled={!hasPermission('add_jobs')}
                              onClick={() => {
                                onApproveJob(job.id);
                                onBroadcastNotification(
                                  '🆕 নতুন চাকরি অনুমোদিত!',
                                  `${job.companyName} এ নতুন পদ "${job.title}" এ আবেদনের জন্য যোগ করা হয়েছে।`
                                );
                                addLog(activeStaff.name, `চাকরি #${job.id} ("${job.title}") অনুমোদন করেছেন।`, 'success');
                              }}
                              className={`px-3 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-1 shadow-sm transition ${
                                !hasPermission('add_jobs')
                                  ? 'bg-slate-300 cursor-not-allowed'
                                  : 'bg-emerald-500 hover:bg-emerald-600'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" /> অনুমোদন দিন
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-slate-400">
                        <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-semibold">কোন চাকরির পোস্ট অনুমোদনের অপেক্ষায় নেই!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EMPLOYER APPROVALS */}
          {activeTab === 'employers' && (
            <div className="space-y-6">
              {activeStaff.role === 'Staff' && !activeStaff.permissions.verify_documents ? (
                renderLockOverlay('কোম্পানি বা রিক্রুটার অনুমোদন ও অডিট', 'verify_documents')
              ) : (
                <div className="space-y-6">
                  {/* Stats Cards Bento Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <button 
                      onClick={() => setCompanyStatusFilter('All')}
                      className={`border p-4 rounded-2xl shadow-sm flex flex-col justify-between text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none ${
                        companyStatusFilter === 'All' 
                          ? 'bg-slate-50 border-slate-400 ring-1 ring-slate-400' 
                          : 'bg-white border-slate-200 hover:border-slate-350'
                      }`}
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">মোট এজেন্সি (Agencies)</span>
                      <div className="flex items-baseline justify-between mt-2 w-full">
                        <span className="text-xl font-extrabold text-slate-900">{companies.length}</span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">নিবন্ধিত</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => setCompanyStatusFilter('Pending')}
                      className={`border p-4 rounded-2xl shadow-sm flex flex-col justify-between text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none ${
                        companyStatusFilter === 'Pending' 
                          ? 'bg-amber-50/40 border-amber-400 ring-1 ring-amber-400' 
                          : 'bg-white border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-amber-600">পেন্ডিং অডিট (Pending)</span>
                      <div className="flex items-baseline justify-between mt-2 w-full">
                        <span className="text-xl font-extrabold text-amber-600">
                          {companies.filter(c => (c.companyStatus === 'Pending' || (!c.companyStatus && !c.isApproved))).length}
                        </span>
                        <span className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">যাচাই বাকি</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => setCompanyStatusFilter('Under Review')}
                      className={`border p-4 rounded-2xl shadow-sm flex flex-col justify-between text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none ${
                        companyStatusFilter === 'Under Review' 
                          ? 'bg-indigo-50/40 border-indigo-400 ring-1 ring-indigo-400' 
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-indigo-600">চলতি পর্যালোচনা (Review)</span>
                      <div className="flex items-baseline justify-between mt-2 w-full">
                        <span className="text-xl font-extrabold text-indigo-600">
                          {companies.filter(c => c.companyStatus === 'Under Review').length}
                        </span>
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">অডিট চলছে</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => setCompanyStatusFilter('Verified')}
                      className={`border p-4 rounded-2xl shadow-sm flex flex-col justify-between text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none ${
                        companyStatusFilter === 'Verified' 
                          ? 'bg-emerald-50/40 border-emerald-400 ring-1 ring-emerald-400' 
                          : 'bg-white border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-emerald-600 font-bold">ভেরিফাইড পার্টনার (Verified)</span>
                      <div className="flex items-baseline justify-between mt-2 w-full">
                        <span className="text-xl font-extrabold text-emerald-600">
                          {companies.filter(c => (c.companyStatus === 'Verified' || c.isApproved)).length}
                        </span>
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">অনুমোদিত</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => setCompanyStatusFilter('Suspended')}
                      className={`border p-4 rounded-2xl shadow-sm flex flex-col justify-between text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none ${
                        companyStatusFilter === 'Suspended' 
                          ? 'bg-rose-50/40 border-rose-400 ring-1 ring-rose-400' 
                          : 'bg-white border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-rose-600">স্থগিত/নাকচ (Suspended)</span>
                      <div className="flex items-baseline justify-between mt-2 w-full">
                        <span className="text-xl font-extrabold text-rose-600">
                          {companies.filter(c => (c.companyStatus === 'Suspended' || c.companyStatus === 'Rejected')).length}
                        </span>
                        <span className="text-xs bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-bold">ব্লকলিস্টেড</span>
                      </div>
                    </button>
                  </div>

                  {/* Search and Advanced Filters Row */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                      <Building2 className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="এজেন্সির নাম, ইমেইল বা লাইসেন্স (RL) নম্বর দিয়ে খুঁজুন..."
                        value={companySearchQuery}
                        onChange={(e) => setCompanySearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-xl text-xs text-slate-700 placeholder-slate-400 outline-none transition"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                      {(['All', 'Pending', 'Under Review', 'Verified', 'Rejected', 'Suspended'] as const).map((filter) => {
                        const count = filter === 'All' ? companies.length :
                          filter === 'Pending' ? companies.filter(c => !c.companyStatus ? !c.isApproved : c.companyStatus === 'Pending').length :
                          companies.filter(c => c.companyStatus === filter || (filter === 'Verified' && c.isApproved && !c.companyStatus)).length;

                        return (
                          <button
                            key={filter}
                            onClick={() => setCompanyStatusFilter(filter)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition ${
                              companyStatusFilter === filter 
                                ? 'bg-slate-800 text-white shadow-sm' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {filter === 'All' ? 'সব এজেন্সি' :
                             filter === 'Pending' ? 'পেন্ডিং' :
                             filter === 'Under Review' ? 'রিভিউ চলছে' :
                             filter === 'Verified' ? 'ভেরিফাইড' :
                             filter === 'Rejected' ? 'নাকচকৃত' : 'স্থগিত'} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Agencies Interactive List Grid */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/40 flex justify-between items-center">
                      <h3 className="text-xs font-black text-slate-700 tracking-wide flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        ওভারসিস রিক্রুটিং এজেন্সি অডিট তালিকা
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">লাইভ রিয়েলটাইম ভেরিফিকেশন ডাটাবেজ</span>
                    </div>

                    <div className="divide-y divide-slate-150">
                      {companies.filter(c => {
                        const matchesSearch = c.name.toLowerCase().includes(companySearchQuery.toLowerCase()) || 
                          c.licenseNumber.toLowerCase().includes(companySearchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(companySearchQuery.toLowerCase());
                        
                        const status = c.companyStatus || (c.isApproved ? 'Verified' : 'Pending');
                        const matchesFilter = companyStatusFilter === 'All' || status === companyStatusFilter;
                        
                        return matchesSearch && matchesFilter;
                      }).length > 0 ? (
                        companies.filter(c => {
                          const matchesSearch = c.name.toLowerCase().includes(companySearchQuery.toLowerCase()) || 
                            c.licenseNumber.toLowerCase().includes(companySearchQuery.toLowerCase()) ||
                            c.email.toLowerCase().includes(companySearchQuery.toLowerCase());
                          
                          const status = c.companyStatus || (c.isApproved ? 'Verified' : 'Pending');
                          const matchesFilter = companyStatusFilter === 'All' || status === companyStatusFilter;
                          
                          return matchesSearch && matchesFilter;
                        }).map((comp) => {
                          const status = comp.companyStatus || (comp.isApproved ? 'Verified' : 'Pending');
                          const activeJobsCount = jobs.filter(j => j.companyId === comp.id).length;

                          return (
                            <div key={comp.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/60 transition-all">
                              <div className="flex gap-3.5 items-start">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-250 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                                  {comp.logo || '✈️'}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="text-xs font-extrabold text-slate-900">{comp.name}</h4>
                                    <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[9px] font-extrabold px-2 py-0.5 rounded-full font-mono">
                                      RL: {comp.licenseNumber}
                                    </span>
                                    <span className={`text-[8.5px] font-black px-2 py-0.5 rounded border font-mono ${
                                      status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                      status === 'Under Review' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                      status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                      'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}>
                                      {status === 'Verified' ? '✔️ ভেরিফাইড (Verified)' :
                                       status === 'Under Review' ? '🔎 অডিট রিভিউ (Under Review)' :
                                       status === 'Pending' ? '⏳ পেন্ডিং (Pending)' :
                                       status === 'Rejected' ? '❌ নাকচকৃত (Rejected)' : '🚫 স্থগিত (Suspended)'}
                                    </span>
                                  </div>
                                  <p className="text-[10.5px] text-slate-500 font-semibold">{comp.industry} • 📍 {comp.location}</p>
                                  <div className="flex gap-4 text-[9.5px] text-slate-400 font-mono">
                                    <span>✉️ {comp.email}</span>
                                    <span>📞 {comp.phone || '+880 1712-345678'}</span>
                                    <span className="text-indigo-600 font-extrabold">💼 মোট জব পোস্ট: {activeJobsCount}টি</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 shrink-0 w-full md:w-auto justify-end">
                                <button
                                  onClick={() => {
                                    setSelectedCompanyDetail(comp);
                                    setCompanyActiveSubTab('profile');
                                    setVerificationRemarksInput(comp.verificationRemarks || '');
                                    setCompanyStatusFilter(status as any);
                                  }}
                                  className="w-full md:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-sm transition-all duration-150"
                                >
                                  <Eye className="w-3.5 h-3.5" /> ভেরিফিকেশন ও ফাইল চেক করুন (Verify)
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-16 text-slate-400">
                          <Building2 className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                          <p className="text-xs font-black text-slate-600">ভেরিফিকেশনের জন্য কোনো এজেন্সি খুঁজে পাওয়া যায়নি।</p>
                          <p className="text-[10px] text-slate-400 mt-1">অনুগ্রহ করে সার্চ কুয়েরি পরিবর্তন করুন বা অন্য ফিল্টারে চেক করুন।</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MODAL / SPLIT DRAWER: COMPREHENSIVE COMPANY VERIFICATION PANEL */}
                  {selectedCompanyDetail && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-3xl max-w-6xl w-full h-[90vh] max-h-[750px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col text-xs text-slate-700 animate-fade-in animate-scale-up">
                        
                        {/* Header Area */}
                        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{selectedCompanyDetail.logo || '🏢'}</span>
                            <div>
                              <h3 className="text-sm font-black tracking-wide flex items-center gap-2 text-white">
                                {selectedCompanyDetail.name} 
                                <span className="bg-emerald-500/20 text-emerald-400 text-[9.5px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/20">
                                  RL-{selectedCompanyDetail.licenseNumber}
                                </span>
                              </h3>
                              <p className="text-[10px] text-slate-400">এজেন্সি আইডি: #{selectedCompanyDetail.id} • অফিসিয়াল ভেরিফিকেশন পোর্টাল</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedCompanyDetail(null)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl font-extrabold transition-all"
                          >
                            ✕ বন্ধ করুন (Close)
                          </button>
                        </div>

                        {/* Split Body Layout */}
                        <div className="flex-1 flex overflow-hidden">
                          
                          {/* Left Navigation Sidebar */}
                          <div className="w-56 bg-slate-50 border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
                            <div className="space-y-1">
                              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block mb-2 px-2">অডিট মেন্যু (Audit Sections)</span>
                              {[
                                { id: 'profile', label: '🏢 কোম্পানির প্রোফাইল', desc: 'নিবন্ধিত তথ্য ও বিবরণ' },
                                { id: 'owner', label: '👤 মালিক বা প্রতিনিধি', desc: 'এনআইডি ও যোগাযোগ' },
                                { id: 'documents', label: '📄 ডকুমেন্টস ভল্ট', desc: 'ট্রেড লাইসেন্স ও সার্টিফিকেট' },
                                { id: 'jobs', label: '💼 চাকরির সার্কুলার', desc: 'মোট পোস্ট ও অ্যাক্টিভ জবস' },
                                { id: 'payments', label: '💳 পেমেন্ট ও ইনভয়েস', desc: 'সাবস্ক্রিপশন ও ফি ট্র্যাকিং' },
                                { id: 'history', label: '📜 সিকিউরিটি ও সংস্করণ', desc: 'অডিট লগ ও সংস্করণ ইতিহাস' }
                              ].map((subTab) => (
                                <button
                                  key={subTab.id}
                                  onClick={() => setCompanyActiveSubTab(subTab.id as any)}
                                  className={`w-full text-left px-3 py-2.5 rounded-xl flex flex-col transition-all ${
                                    companyActiveSubTab === subTab.id 
                                      ? 'bg-emerald-600 text-white shadow-sm' 
                                      : 'text-slate-700 hover:bg-slate-200/60'
                                  }`}
                                >
                                  <span className="font-extrabold text-[11px]">{subTab.label}</span>
                                  <span className={`text-[8.5px] mt-0.5 ${companyActiveSubTab === subTab.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                                    {subTab.desc}
                                  </span>
                                </button>
                              ))}
                            </div>

                            {/* Verification Summary Badge */}
                            <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 text-center space-y-1">
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase">বর্তমান অনুমোদন অবস্থা</span>
                              <p className="font-black text-slate-800 text-xs">
                                {selectedCompanyDetail.companyStatus || (selectedCompanyDetail.isApproved ? 'Verified' : 'Pending')}
                              </p>
                              {selectedCompanyDetail.verifiedBy && (
                                <p className="text-[8.5px] text-slate-400 font-mono leading-tight">যাচাইকারী: {selectedCompanyDetail.verifiedBy}</p>
                              )}
                            </div>
                          </div>

                          {/* Right Content Pane (Scrollable) */}
                          <div className="flex-1 p-6 overflow-y-auto space-y-6">

                            {/* Sub-Tab 1: Company Profile */}
                            {companyActiveSubTab === 'profile' && (
                              <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">কোম্পানির বিস্তারিত প্রোফাইল (Company Details)</h4>
                                  <p className="text-[10px] text-slate-400">সরকারি নিবন্ধন ও যোগাযোগ সংক্রান্ত অফিশিয়াল তথ্য বিবরণী</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                                    <span className="text-slate-400 text-[9px] block">অফিশিয়াল এজেন্সির নাম</span>
                                    <span className="font-bold text-slate-800 text-xs">{selectedCompanyDetail.name}</span>
                                  </div>
                                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                                    <span className="text-slate-400 text-[9px] block">কোম্পানি রেজিস্ট্রেশন নম্বর</span>
                                    <span className="font-bold text-slate-800 font-mono text-xs">{selectedCompanyDetail.registrationNumber || 'REG-2026-08172'}</span>
                                  </div>
                                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                                    <span className="text-slate-400 text-[9px] block">প্রবাসী কল্যাণ রিক্রুটিং লাইসেন্স (RL No)</span>
                                    <span className="font-bold text-emerald-600 font-mono text-xs">RL-{selectedCompanyDetail.licenseNumber}</span>
                                  </div>
                                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                                    <span className="text-slate-400 text-[9px] block">ট্রেড লাইসেন্স নম্বর (Trade License)</span>
                                    <span className="font-bold text-slate-800 font-mono text-xs">{selectedCompanyDetail.tradeLicenseNumber || 'TR-99827-2026'}</span>
                                  </div>
                                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                                    <span className="text-slate-400 text-[9px] block">ভ্যাট / টিআইএন সার্টিফিকেট (VAT/TIN)</span>
                                    <span className="font-bold text-slate-800 font-mono text-xs">{selectedCompanyDetail.vatTin || 'TIN-54321980'}</span>
                                  </div>
                                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                                    <span className="text-slate-400 text-[9px] block">প্রতিষ্ঠার বছর (Established Year)</span>
                                    <span className="font-bold text-slate-800 font-mono text-xs">{selectedCompanyDetail.establishedYear || '২০১২'}</span>
                                  </div>
                                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                                    <span className="text-slate-400 text-[9px] block">অফিশিয়াল ওয়েবসাইট</span>
                                    <a href="#" className="font-bold text-blue-600 hover:underline block">{selectedCompanyDetail.website || 'www.eurobangla-placement.com'}</a>
                                  </div>
                                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                                    <span className="text-slate-400 text-[9px] block">অফিসিয়াল ফোন নম্বর</span>
                                    <span className="font-bold text-slate-800 font-mono text-xs">{selectedCompanyDetail.phone || '+880 1712-345678'}</span>
                                  </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-1">
                                  <span className="text-slate-400 text-[9px] block">অফিস ঠিকানা (Office Address)</span>
                                  <p className="font-bold text-slate-800 leading-relaxed">📍 {selectedCompanyDetail.location}</p>
                                  <div className="mt-2.5">
                                    <span className="text-[9px] bg-red-50 text-red-700 border border-red-100 rounded px-2 py-0.5 font-bold font-mono">
                                      🗺️ Google Maps URL: Verified Coordinates
                                    </span>
                                  </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-1">
                                  <span className="text-slate-400 text-[9px] block">কোম্পানির বিবরণ (Description)</span>
                                  <p className="text-slate-600 leading-relaxed font-semibold">{selectedCompanyDetail.description}</p>
                                </div>

                                {/* Interactive Sub-Verification checklist for administrators */}
                                <div className="p-5 bg-blue-50/50 border border-blue-150 rounded-2xl space-y-4">
                                  <div>
                                    <h5 className="text-[11px] font-black text-slate-800 flex items-center gap-1.5">
                                      🛡️ অ্যাডমিন সিকিউরিটি ও ভেরিফিকেশন কন্ট্রোল প্যানেল
                                    </h5>
                                    <p className="text-[9.5px] text-slate-500 mt-0.5">কোম্পানির প্রতিটি ব্যক্তিগত ও আইনি তথ্য সশরীরে/ডিজিটালি যাচাই করে ইন্ডিভিজুয়াল টিকমার্ক দিন।</p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {/* Parameter 1: Trade License */}
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                                      <div className="space-y-0.5">
                                        <p className="font-bold text-slate-800 text-[10.5px]">১. সরকারি ট্রেড লাইসেন্স</p>
                                        <p className="text-[9px] text-slate-400">অবস্থা: {selectedCompanyDetail.tradeLicense ? `🟢 সাবমিটেড (${selectedCompanyDetail.tradeLicense})` : '🔴 পেন্ডিং / জমা দেওয়া হয়নি'}</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const l = prompt('ট্রেড লাইসেন্স নম্বর দিন বা এডিট করুন:', selectedCompanyDetail.tradeLicense || 'TR-2026-DHAKA');
                                          if (l) {
                                            const updated = { ...selectedCompanyDetail, tradeLicense: l };
                                            setSelectedCompanyDetail(updated);
                                            if (onUpdateCompany) onUpdateCompany(updated);
                                            addLog(activeStaff.name, `এজেন্সি "${selectedCompanyDetail.name}" এর ট্রেড লাইসেন্স নম্বর "${l}" ভেরিফাই করেছেন।`, 'success');
                                          }
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded text-[9.5px] transition"
                                      >
                                        যাচাই করুন
                                      </button>
                                    </div>

                                    {/* Parameter 2: Recruiting License */}
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                                      <div className="space-y-0.5">
                                        <p className="font-bold text-slate-800 text-[10.5px]">২. রিক্রুটিং লাইসেন্স (RL No)</p>
                                        <p className="text-[9px] text-slate-400">অবস্থা: {selectedCompanyDetail.recruitingLicense ? `🟢 সাবমিটেড (${selectedCompanyDetail.recruitingLicense})` : '🔴 পেন্ডিং / জমা দেওয়া হয়নি'}</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const rl = prompt('রিক্রুটিং লাইসেন্স (RL) নম্বর দিন বা এডিট করুন:', selectedCompanyDetail.recruitingLicense || 'RL-9922');
                                          if (rl) {
                                            const updated = { ...selectedCompanyDetail, recruitingLicense: rl };
                                            setSelectedCompanyDetail(updated);
                                            if (onUpdateCompany) onUpdateCompany(updated);
                                            addLog(activeStaff.name, `এজেন্সি "${selectedCompanyDetail.name}" এর রিক্রুটিং লাইসেন্স "RL-${rl}" ভেরিফাই করেছেন।`, 'success');
                                          }
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded text-[9.5px] transition"
                                      >
                                        যাচাই করুন
                                      </button>
                                    </div>

                                    {/* Parameter 3: Phone OTP Status */}
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                                      <div className="space-y-0.5">
                                        <p className="font-bold text-slate-800 text-[10.5px]">৩. ফোন OTP ভেরিফিকেশন</p>
                                        <p className="text-[9px] text-slate-400 font-medium">অবস্থা: {selectedCompanyDetail.phoneVerified ? '🟢 ভেরিফাইড (OTP Matching)' : '🟡 যাচাই করা হয়নি (Pending)'}</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = { ...selectedCompanyDetail, phoneVerified: !selectedCompanyDetail.phoneVerified };
                                          setSelectedCompanyDetail(updated);
                                          if (onUpdateCompany) onUpdateCompany(updated);
                                          addLog(activeStaff.name, `এজেন্সি "${selectedCompanyDetail.name}" এর ফোন ভেরিফিকেশন অবস্থা "${updated.phoneVerified ? 'ভেরিফাইড' : 'পেন্ডিং'}" এ পরিবর্তন করেছেন।`, 'warning');
                                        }}
                                        className={`font-bold px-2.5 py-1 rounded text-[9.5px] text-white transition ${selectedCompanyDetail.phoneVerified ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                      >
                                        {selectedCompanyDetail.phoneVerified ? 'রিসেট' : 'ভেরিফাই'}
                                      </button>
                                    </div>

                                    {/* Parameter 4: Email Verified Status */}
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                                      <div className="space-y-0.5">
                                        <p className="font-bold text-slate-800 text-[10.5px]">৪. কর্পোরেট ইমেইল যাচাইকরণ</p>
                                        <p className="text-[9px] text-slate-400 font-medium">অবস্থা: {selectedCompanyDetail.emailVerified ? '🟢 লিংক ভেরিফাইড (Checked)' : '🟡 যাচাই করা হয়নি (Pending)'}</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = { ...selectedCompanyDetail, emailVerified: !selectedCompanyDetail.emailVerified };
                                          setSelectedCompanyDetail(updated);
                                          if (onUpdateCompany) onUpdateCompany(updated);
                                          addLog(activeStaff.name, `এজেন্সি "${selectedCompanyDetail.name}" এর ইমেইল ভেরিফিকেশন অবস্থা "${updated.emailVerified ? 'ভেরিফাইড' : 'পেন্ডিং'}" এ পরিবর্তন করেছেন।`, 'warning');
                                        }}
                                        className={`font-bold px-2.5 py-1 rounded text-[9.5px] text-white transition ${selectedCompanyDetail.emailVerified ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                      >
                                        {selectedCompanyDetail.emailVerified ? 'রিসেট' : 'ভেরিফাই'}
                                      </button>
                                    </div>

                                    {/* Parameter 5: Physical Office Verification */}
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 col-span-1 md:col-span-2">
                                      <div className="space-y-0.5">
                                        <p className="font-bold text-slate-800 text-[10.5px]">৫. অফিসের সশরীরে ঠিকানা ও সাইনবোর্ড যাচাই (Field Audit)</p>
                                        <p className="text-[9px] text-slate-400">অবস্থা: {selectedCompanyDetail.officeVerified ? '🟢 পরিদর্শিত (হেড অফিস ও লাইভ সাইনবোর্ড ভেরিফাইড)' : '🟡 সশরীরে মাঠ পরিদর্শন অপেক্ষমান'}</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = { ...selectedCompanyDetail, officeVerified: !selectedCompanyDetail.officeVerified };
                                          setSelectedCompanyDetail(updated);
                                          if (onUpdateCompany) onUpdateCompany(updated);
                                          addLog(activeStaff.name, `এজেন্সি "${selectedCompanyDetail.name}" এর অফিস পরিদর্শন অবস্থা "${updated.officeVerified ? 'ভেরিফাইড পরিদর্শিত' : 'অসম্পন্ন'}" হিসেবে আপডেট করেছেন।`, 'info');
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded text-[9.5px] transition"
                                      >
                                        {selectedCompanyDetail.officeVerified ? 'রিসেট করুন' : 'পরিদর্শন সফল মার্ক করুন'}
                                      </button>
                                    </div>


                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Sub-Tab 2: Owner Information */}
                            {companyActiveSubTab === 'owner' && (
                              <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">মালিক বা বৈধ প্রতিনিধির তথ্য (Owner Details)</h4>
                                  <p className="text-[10px] text-slate-400">এজেন্সির লাইসেন্সধারী স্বত্বাধিকারী বা চেয়ারম্যানের এনআইডি ও বিস্তারিত বায়োডাটা</p>
                                </div>

                                <div className="flex gap-5 items-start bg-slate-50 p-5 rounded-2xl border border-slate-150">
                                  <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-4xl shadow-inner shrink-0">
                                    {selectedCompanyDetail.ownerPhoto || '👨‍💼'}
                                  </div>
                                  <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                      <h5 className="text-sm font-black text-slate-900">{selectedCompanyDetail.ownerName || 'জনাব আরিফুর রহমান'}</h5>
                                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8.5px] font-extrabold px-2 py-0.5 rounded">
                                        NID-ভেরিফাইড (NID Matching)
                                      </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                                      <div>
                                        <span className="text-slate-400 text-[9px] block">জাতীয় পরিচয়পত্র নম্বর (NID)</span>
                                        <span className="font-bold text-slate-800 font-mono">{selectedCompanyDetail.ownerNid || '5543219803'}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 text-[9px] block">পাসপোর্ট নম্বর</span>
                                        <span className="font-bold text-slate-800 font-mono">🛂 {selectedCompanyDetail.ownerNid ? 'BD'+selectedCompanyDetail.ownerNid.slice(2,9) : 'BD08831'}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 text-[9px] block">মোবাইল নম্বর</span>
                                        <span className="font-bold text-slate-800 font-mono">{selectedCompanyDetail.ownerMobile || '+880 1819-223344'}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 text-[9px] block">ব্যক্তিগত ইমেইল এড্রেস</span>
                                        <span className="font-bold text-slate-800 font-mono">{selectedCompanyDetail.ownerEmail || 'arifur.rahman@eurobangla.com'}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-1.5 shadow-sm">
                                  <p className="text-[10px] uppercase font-bold tracking-wide flex items-center gap-1.5 text-emerald-400">
                                    <span>🛡️ নির্বাচন কমিশন ডাটাবেজ স্থিতি (EC Checking Log)</span>
                                  </p>
                                  <p className="text-[10.5px] text-slate-300">
                                    উক্ত মালিকের জাতীয় পরিচয়পত্র নম্বরটি নির্বাচন কমিশনের ডাটাবেজের সাথে সফলভাবে মিল পাওয়া গেছে। বায়োমেট্রিক ও ছবি শতভাগ সঠিক।
                                  </p>
                                  <p className="text-[9px] text-slate-400 italic pt-1">
                                    * সর্বশেষ মেলানো হয়েছে: আজ ১২:১৫ PM • যাচাইকারী: সরকারি এপিআই সংযোগকারী
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Sub-Tab 3: Company Documents Vault */}
                            {companyActiveSubTab === 'documents' && (
                              <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                                  <div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">কোম্পানি অফিসিয়াল ডকুমেন্টস ভল্ট</h4>
                                    <p className="text-[10px] text-slate-400">আপলোডকৃত সব লাইসেন্স, ট্রেড ডকুমেন্ট এবং এনআইডির ডিজিটাল অডিট কপি</p>
                                  </div>
                                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] font-bold rounded">
                                    ৮টি ডকুমেন্ট সংযুক্ত
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {[
                                    { key: 'trade_license', label: 'ট্রেড লাইসেন্স (Trade License)', file: 'Trade_License_2026_EuroBangla.pdf', size: '১.৮ MB', date: '2026-06-15' },
                                    { key: 'rl_license', label: 'রিক্রুটিং এজেন্সি লাইসেন্স (RL License)', file: 'RL_Gov_License_1920_Active.pdf', size: '২.৪ MB', date: '2026-06-15' },
                                    { key: 'company_registration', label: 'কোম্পানি জয়েন্ট স্টক রেজিস্ট্রেশন', file: 'RJSC_Certificate_EuroBangla.pdf', size: '৩.১ MB', date: '2026-06-14' },
                                    { key: 'tin_certificate', label: 'ট্যাক্স ক্লিয়ারেন্স / টিআইএন সার্টিফিকেট', file: 'TIN_Tax_Clearance_2026.pdf', size: '১.১ MB', date: '2026-06-16' },
                                    { key: 'owner_passport', label: 'পাসপোর্ট স্ক্যান কপি (মালিক)', file: 'Owner_Passport_Arifur.pdf', size: '১.৫ MB', date: '2026-06-12' },
                                    { key: 'owner_nid', label: 'এনআইডি ফ্রন্ট-ব্যাক (মালিক)', file: 'Owner_NID_Card_Gov.jpg', size: '৭৮০ KB', date: '2026-06-12' },
                                    { key: 'office_premises', label: 'অফিস প্রাঙ্গণের ছবি (Premises Proof)', file: 'Office_Setup_Uttara_Main.jpg', size: '৪.২ MB', date: '2026-06-18' },
                                    { key: 'authorization_letter', label: 'স্মার্ট কার্ড ইউজার অথরাইজেশন লেটার', file: 'Authorized_Staff_Declaration.pdf', size: '১.২ MB', date: '2026-06-15' }
                                  ].map((doc) => {
                                    const docKey = `${selectedCompanyDetail.id}_${doc.key}`;
                                    const customStatus = customDocStatuses[docKey] || { status: 'Pending', remarks: '', verifiedBy: '', date: '' };
                                    
                                    return (
                                      <div key={doc.key} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition">
                                        <div className="flex justify-between items-start">
                                          <div className="space-y-1">
                                            <span className="text-[10.5px] font-black text-slate-800 block">{doc.label}</span>
                                            <span className="text-[9.5px] text-slate-500 font-mono block truncate max-w-[200px]">📄 {doc.file}</span>
                                            <span className="text-[8.5px] text-slate-400 block">আপলোড: {doc.date} • সাইজ: {doc.size}</span>
                                          </div>

                                          <span className={`text-[8px] font-black px-2 py-0.5 rounded border font-mono ${
                                            customStatus.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            customStatus.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                            'bg-amber-50 text-amber-700 border-amber-200'
                                          }`}>
                                            {customStatus.status === 'Verified' ? '✔️ ভেরিফাইড' :
                                             customStatus.status === 'Rejected' ? '❌ প্রত্যাখ্যাত' : '⏳ অনির্ধারিত'}
                                          </span>
                                        </div>

                                        {customStatus.verifiedBy && (
                                          <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-150 text-[8.5px] text-slate-500 font-mono">
                                            <span className="font-extrabold text-slate-700">অডিট লগ:</span> {customStatus.verifiedBy} কর্তৃক ভেরিফাইড ({customStatus.date})
                                            {customStatus.remarks && <p className="italic text-slate-400 mt-0.5">"{customStatus.remarks}"</p>}
                                          </div>
                                        )}

                                        <div className="flex gap-1.5 pt-1 border-t border-slate-100">
                                          <button
                                            onClick={() => setSelectedDocumentView({
                                              name: doc.label,
                                              fileType: doc.file.endsWith('.jpg') ? 'image' : 'pdf',
                                              status: customStatus.status,
                                              uploadDate: doc.date,
                                              verifiedBy: customStatus.verifiedBy || undefined,
                                              url: docKey // reference
                                            })}
                                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[9.5px] rounded-lg transition text-center flex items-center justify-center gap-1"
                                          >
                                            <Eye className="w-3 h-3" /> ফাইল দেখুন
                                          </button>
                                          <a
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              alert(`ফাইল "${doc.file}" ডাউনলোড শুরু হয়েছে!`);
                                            }}
                                            className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 text-[9.5px] font-extrabold transition flex items-center justify-center"
                                            title="ডাউনলোড ডকুমেন্ট"
                                          >
                                            <Download className="w-3.5 h-3.5" />
                                          </a>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Sub-Tab 4: Recruitment Jobs Posted */}
                            {companyActiveSubTab === 'jobs' && (
                              <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                                  <div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">সার্কুলার ও নিয়োগ স্থিতি (Jobs Dashboard)</h4>
                                    <p className="text-[10px] text-slate-400">এই এজেন্সির মাধ্যমে প্রবাসী চাকরির আবেদনের মোট সার্কুলার তালিকা</p>
                                  </div>
                                  <span className="bg-emerald-500/10 text-emerald-700 px-3 py-1 text-[10px] font-black rounded-full">
                                    মোট জব পোস্ট: {jobs.filter(j => j.companyId === selectedCompanyDetail.id).length}টি
                                  </span>
                                </div>

                                <div className="grid grid-cols-4 gap-3">
                                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                                    <span className="text-[9px] text-slate-400 font-extrabold block uppercase">সক্রিয় জবস (Active)</span>
                                    <span className="text-base font-extrabold text-emerald-600">
                                      {jobs.filter(j => j.companyId === selectedCompanyDetail.id).length}
                                    </span>
                                  </div>
                                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                                    <span className="text-[9px] text-slate-400 font-extrabold block uppercase">পেন্ডিং সার্কুলার</span>
                                    <span className="text-base font-extrabold text-amber-500">০</span>
                                  </div>
                                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                                    <span className="text-[9px] text-slate-400 font-extrabold block uppercase">পূর্ণ মেয়াদোত্তীর্ণ</span>
                                    <span className="text-base font-extrabold text-slate-500 font-mono">০</span>
                                  </div>
                                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                                    <span className="text-[9px] text-slate-400 font-extrabold block uppercase">নাকচকৃত সার্কুলার</span>
                                    <span className="text-base font-extrabold text-rose-500 font-mono">০</span>
                                  </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                                  <div className="p-3 bg-slate-50 border-b border-slate-100 font-extrabold text-slate-700 text-[10px]">সার্কুলার তালিকা (Published Jobs)</div>
                                  <div className="divide-y divide-slate-100">
                                    {jobs.filter(j => j.companyId === selectedCompanyDetail.id).length > 0 ? (
                                      jobs.filter(j => j.companyId === selectedCompanyDetail.id).map((job) => (
                                        <div key={job.id} className="p-3.5 flex justify-between items-center hover:bg-slate-50/50">
                                          <div>
                                            <span className="font-extrabold text-slate-800 text-xs block">{job.title}</span>
                                            <span className="text-[9.5px] text-slate-400 block mt-0.5">📍 {job.country} | শ্রেণী: {job.category}</span>
                                          </div>
                                          <div className="text-right">
                                            <span className="font-mono text-emerald-600 font-extrabold text-xs block">{job.salary}</span>
                                            <span className="text-[8.5px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.2 rounded-full">সক্রিয় (Active)</span>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center py-8 text-slate-400 italic">কোনো নিয়োগ বিজ্ঞপ্তি পোস্ট করা হয়নি।</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Sub-Tab 5: Subscription Plan and Payments */}
                            {companyActiveSubTab === 'payments' && (
                              <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">সাবস্ক্রিপশন ও ব্যাংক পেমেন্ট লেজার</h4>
                                  <p className="text-[10px] text-slate-400">এজেন্সির পেমেন্ট ইতিহাস, সাবস্ক্রিপশন প্ল্যান ও রসিদ ডাউনলোড</p>
                                </div>

                                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-sm space-y-2 flex justify-between items-center">
                                  <div className="space-y-1">
                                    <span className="text-[9.5px] bg-white/20 text-white uppercase font-black px-2 py-0.5 rounded-full font-mono">
                                      PREMIUM RECRUITING PARTNER
                                    </span>
                                    <h5 className="text-sm font-black">ইউরোপ গোল্ডেন সাবস্ক্রিপশন প্ল্যান (Europe Gold Tier)</h5>
                                    <p className="text-[10.5px] text-emerald-100">মেয়াদ: ৩০ই ডিসেম্বর ২০২৬ পর্যন্ত • আনলিমিটেড পোস্ট অনুমোদিত</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs block text-emerald-200">বার্ষিক ফি</span>
                                    <span className="text-xl font-extrabold font-mono">৳২৫,০০০</span>
                                  </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                                  <div className="p-3 bg-slate-50 border-b border-slate-150 font-extrabold text-slate-700 text-[10.5px] flex justify-between">
                                    <span>লেনদেন লেজার (Transaction History)</span>
                                    <span className="text-[9px] text-slate-400">মোট পরিশোধিত: ৩টি</span>
                                  </div>
                                  <div className="divide-y divide-slate-100 text-[11px]">
                                    {[
                                      { id: 'TX-30291', desc: 'বাৎসরিক পোর্টাল প্রিমিয়াম পার্টনার ফি', amt: '৳১২,৫০০', channel: 'bKash Merchant', date: '২০২৬-০৬-১০', stat: 'Approved' },
                                      { id: 'TX-29910', desc: 'স্পেশাল ইতালি প্যাকেজ ভিসা স্পন্সর লিস্টিং', amt: '৳৫,০০০', channel: 'Nagad Pay', date: '২০২৬-০৬-১২', stat: 'Approved' },
                                      { id: 'TX-27712', desc: 'মেডিকেল ভেরিফিকেশন বাল্ক টোকেন রিচার্জ', amt: '৳৭,৫০০', channel: 'Bank Transfer (EBL)', date: '২০২৬-০৬-১৪', stat: 'Approved' }
                                    ].map((tx) => (
                                      <div key={tx.id} className="p-3 flex justify-between items-center hover:bg-slate-50/40">
                                        <div className="space-y-0.5">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-slate-800">{tx.desc}</span>
                                            <span className="text-[9.5px] font-mono text-slate-400">({tx.id})</span>
                                          </div>
                                          <span className="text-[9px] text-slate-400">{tx.date} • পেমেন্ট চ্যানেল: {tx.channel}</span>
                                        </div>
                                        <div className="text-right flex items-center gap-3">
                                          <div>
                                            <span className="font-extrabold text-slate-900 font-mono block">{tx.amt}</span>
                                            <span className="text-[8px] text-emerald-600 font-black font-mono">✓ VERIFIED BY ADMIN</span>
                                          </div>
                                          <button
                                            onClick={() => alert(`ডাউনলোড রসিদ: ${tx.id}.pdf জেনারেট সম্পন্ন!`)}
                                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 transition"
                                            title="ডাউনলোড ইনভয়েস"
                                          >
                                            <FileDown className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Sub-Tab 6: Security Audit Logs & Versions */}
                            {companyActiveSubTab === 'history' && (
                              <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">নিরাপত্তা লগ এবং ডকুমেন্ট সংস্করণ ইতিহাস</h4>
                                  <p className="text-[10px] text-slate-400">এজেন্সির নথিপত্র অডিট টেইল এবং ডাটা পরিবর্তন ট্র্যাকিং লগ</p>
                                </div>

                                {/* Version History Box */}
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                  <div className="p-3 bg-slate-50 border-b border-slate-100 font-extrabold text-slate-700 text-[10px] flex items-center gap-1.5">
                                    <History className="w-3.5 h-3.5 text-indigo-500" />
                                    ডকুমেন্ট সংস্করণ ইতিহাস (Version History)
                                  </div>
                                  <div className="divide-y divide-slate-100 text-[10.5px]">
                                    {Object.entries(docVersionHistory).map(([key, list]) => {
                                      const versionList = (list || []) as { version: string; date: string; updatedBy: string; remarks: string }[];
                                      return (
                                        <div key={key} className="p-3 space-y-1.5">
                                          <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wide block bg-slate-100 px-2 py-0.5 rounded w-max">
                                            নথি কী: {key.replace(`${selectedCompanyDetail.id}_`, '').replace('_', ' ')}
                                          </span>
                                          <div className="space-y-1 pl-2">
                                            {versionList.map((ver, idx) => (
                                              <div key={idx} className="flex justify-between items-center text-[10px] border-l-2 border-slate-200 pl-2">
                                                <div>
                                                  <span className="font-bold text-indigo-600 font-mono">{ver.version}</span> - {ver.remarks}
                                                  <span className="text-[9px] text-slate-400 block mt-0.5">আপডেটকারী: {ver.updatedBy}</span>
                                                </div>
                                                <span className="text-[9px] text-slate-400 font-mono">{ver.date}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Activity Log list */}
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                  <div className="p-3 bg-slate-50 border-b border-slate-100 font-extrabold text-slate-700 text-[10px] flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                                    অ্যাক্টিভিটি হিস্ট্রি লগ (Activity Log)
                                  </div>
                                  <div className="divide-y divide-slate-100 text-[10.5px]">
                                    {selectedCompanyDetail.activityLog && selectedCompanyDetail.activityLog.length > 0 ? (
                                      selectedCompanyDetail.activityLog.map((log, idx) => (
                                        <div key={idx} className="p-3 flex justify-between items-start gap-4">
                                          <div className="space-y-0.5">
                                            <span className="font-bold text-slate-800 block">{log.action}</span>
                                            {log.remarks && <p className="text-slate-500 italic mt-0.5">"মন্তব্য: {log.remarks}"</p>}
                                            <span className="text-[9px] text-slate-400 block">কার্যকর্তা: {log.user}</span>
                                          </div>
                                          <span className="text-[9px] text-slate-400 font-mono shrink-0">{log.date}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-start text-[10px]">
                                          <div>
                                            <span className="font-bold text-slate-800 block">কোম্পানি রেজিস্ট্রেশন সম্পন্ন (Company Registered)</span>
                                            <span className="text-slate-400 block">মালিক কর্তৃক প্রাথমিক তথ্য জমা</span>
                                          </div>
                                          <span className="text-slate-400 font-mono">2026-06-10 10:00 AM</span>
                                        </div>
                                        <div className="flex justify-between items-start text-[10px] pt-2 border-t border-slate-100">
                                          <div>
                                            <span className="font-bold text-slate-800 block">সরকারি লাইসেন্স কপি সংযুক্তকরণ (TIN & RL Uploaded)</span>
                                            <span className="text-slate-400 block">পিডিএফ ফাইলসমূহ সফলভাবে আপলোড সম্পন্ন</span>
                                          </div>
                                          <span className="text-slate-400 font-mono">2026-06-12 11:15 AM</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Verification & Action Workspace Section */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                              <div className="border-b border-slate-200 pb-2.5">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                                  🛡️ রিভিউ ও অনুমোদন ওয়ার্কস্পেস (Admin / Staff Verification)
                                </h4>
                                <p className="text-[10px] text-slate-500">এজেন্সির সব ফাইল যাচাই শেষে চূড়ান্ত সিদ্ধান্ত প্রদান করুন। প্রতিটি পদক্ষেপ ট্র্যাক করা হবে।</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">চূড়ান্ত ভেরিফিকেশন স্থিতি (Company Status)</label>
                                  <select
                                    value={companyStatusFilter}
                                    onChange={(e) => setCompanyStatusFilter(e.target.value as any)}
                                    className="w-full p-2.5 bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl text-xs text-slate-700 outline-none"
                                  >
                                    <option value="Pending">⏳ পেন্ডিং (Pending Approval)</option>
                                    <option value="Under Review">🔎 অডিট রিভিউ (Under Active Review)</option>
                                    <option value="Verified">✔️ ভেরিফাইড (Approve / Verified Partner)</option>
                                    <option value="Rejected">❌ নাকচকৃত (Reject Recruitment License)</option>
                                    <option value="Suspended">🚫 স্থগিত (Suspend Agency Access)</option>
                                  </select>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">যাচাইকারী স্টাফ / কর্মকর্তা (Audit Signed By)</label>
                                  <input 
                                    type="text"
                                    value={`${activeStaff.name} (${activeStaff.role})`}
                                    disabled
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 text-xs text-slate-500 rounded-xl font-bold cursor-not-allowed"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">ভেরিফিকেশন রিমার্কস ও নির্দেশনাবলী (Verification Remarks)</label>
                                <textarea
                                  value={verificationRemarksInput}
                                  onChange={(e) => setVerificationRemarksInput(e.target.value)}
                                  placeholder="এজেন্সির ট্রেড লাইসেন্স ও অন্যান্য তথ্য বিস্তারিত চেক করে এখানে মন্তব্য লিখুন..."
                                  className="w-full p-3 bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl text-xs text-slate-700 outline-none h-20 resize-none font-medium"
                                />
                              </div>

                              <div className="flex justify-end gap-2.5 pt-2">
                                <button
                                  onClick={() => {
                                    handleSaveCompanyVerification();
                                    if (!selectedCompanyDetail) return;
                                    // Save company status locally
                                    const savedComp = localStorage.getItem('probashi_registered_company');
                                    if (savedComp) {
                                      try {
                                        const parsed = JSON.parse(savedComp);
                                        parsed.status = companyStatusFilter === 'All' ? 'Pending' : companyStatusFilter;
                                        parsed.verificationRemarks = verificationRemarksInput;
                                        localStorage.setItem('probashi_registered_company', JSON.stringify(parsed));
                                        window.dispatchEvent(new Event('storage'));
                                      } catch (e) {
                                        console.error(e);
                                      }
                                    }
                                  }}
                                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow-sm text-xs flex items-center gap-1.5"
                                >
                                  <Check className="w-4 h-4" /> আপডেট সংরক্ষণ করুন (Save Audit Status)
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODAL OVERLAY: SECONDARY DETAILED DOCUMENT INTERACTIVE VIEW */}
                  {selectedDocumentView && (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col text-xs text-white animate-fade-in">
                        
                        <div className="px-5 py-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
                          <div className="flex items-center gap-2 text-white">
                            <span className="text-lg">📄</span>
                            <span className="font-extrabold text-xs uppercase tracking-wider">{selectedDocumentView.name} - লাইভ অডিট কপি</span>
                          </div>
                          <button 
                            onClick={() => setSelectedDocumentView(null)}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white px-3 py-1 rounded-lg font-bold text-[10.5px] transition"
                          >
                            ✕ বন্ধ করুন (Close)
                          </button>
                        </div>

                        {/* Interactive Viewport */}
                        <div className="p-6 flex flex-col items-center justify-center bg-slate-950 min-h-[300px] border-b border-slate-800 relative group overflow-hidden">
                          {/* Simulated document layout */}
                          <div className="w-full max-w-sm bg-white text-slate-800 p-8 rounded-xl shadow-xl border border-slate-200 font-sans space-y-4 relative transition-all duration-300">
                            
                            {/* Watermark logo */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none">
                              <span className="text-7xl font-black text-slate-900">GOVT OK</span>
                            </div>

                            <div className="text-center pb-2 border-b border-slate-100">
                              <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</span>
                              <h5 className="font-extrabold text-sm text-slate-900">{selectedDocumentView.name}</h5>
                              <span className="text-[8px] text-slate-400 font-mono">লাইসেন্স আইডি: #RL-1920-REG-2026</span>
                            </div>

                            <div className="space-y-2 text-[10px]">
                              <p className="flex justify-between border-b border-slate-50 pb-1">
                                <span className="text-slate-400">অনুমোদিত প্রতিষ্ঠান:</span>
                                <span className="font-bold text-slate-800">{selectedCompanyDetail?.name}</span>
                              </p>
                              <p className="flex justify-between border-b border-slate-50 pb-1">
                                <span className="text-slate-400">স্বত্বাধিকারী নাম:</span>
                                <span className="font-bold text-slate-800">{selectedCompanyDetail?.ownerName || 'জনাব আরিফুর রহমান'}</span>
                              </p>
                              <p className="flex justify-between border-b border-slate-50 pb-1">
                                <span className="text-slate-400">আপলোড সংস্করণ:</span>
                                <span className="font-bold text-indigo-600 font-mono">v1.1 (সর্বশেষ)</span>
                              </p>
                              <p className="flex justify-between border-b border-slate-50 pb-1">
                                <span className="text-slate-400">সনদপত্রের ফাইল টাইপ:</span>
                                <span className="font-bold text-slate-600 font-mono uppercase">{selectedDocumentView.fileType}</span>
                              </p>
                              <p className="flex justify-between pb-1">
                                <span className="text-slate-400">আপলোড তারিখ:</span>
                                <span className="font-bold text-slate-800 font-mono">{selectedDocumentView.uploadDate}</span>
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                              <div className="text-left">
                                <span className="text-[7.5px] uppercase font-black text-slate-400 block">স্মার্ট কিউআর কোড</span>
                                <span className="text-[12px]">🔳</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[7.5px] uppercase font-black text-slate-400 block">ডিজিটাল ভেরিফাইড সিল</span>
                                <span className="text-[9px] text-emerald-600 font-black border border-emerald-300 px-1 py-0.2 rounded font-mono">GOVT_VERIFIED</span>
                              </div>
                            </div>
                          </div>

                          {/* Control HUD Overlay */}
                          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700 flex gap-2 text-[9px] font-mono">
                            <button onClick={() => alert("Zoom In 120%")} className="hover:text-emerald-400 font-extrabold">➕ Zoom In</button>
                            <span className="text-slate-600">|</span>
                            <button onClick={() => alert("Zoom Out 80%")} className="hover:text-emerald-400 font-extrabold">➖ Zoom Out</button>
                            <span className="text-slate-600">|</span>
                            <button onClick={() => alert("অনুমোদিত সনদের প্রিন্ট কপি জেনারেট করা হচ্ছে...")} className="hover:text-emerald-400 font-extrabold">🖨️ Print Doc</button>
                          </div>
                        </div>

                        {/* Audit Verification workspace at document level */}
                        <div className="p-5 bg-slate-800 space-y-3 shrink-0">
                          <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider block">এই ডকুমেন্টের একক অডিট সিদ্ধান্ত (Document Review Outcome)</span>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const remarks = prompt("ট্রেড লাইসেন্সটির ভেরিফিকেশন মন্তব্য লিখুন:", "ম্যানুয়ালি চেক করা হয়েছে এবং সরকারি ডাটাবেজে সঠিক পাওয়া গেছে।");
                                if (remarks !== null) {
                                  const docKey = selectedDocumentView.url!;
                                  const newStat = {
                                    status: 'Verified' as const,
                                    remarks,
                                    verifiedBy: activeStaff.name,
                                    date: new Date().toLocaleDateString('bn-BD')
                                  };
                                  setCustomDocStatuses(prev => ({
                                    ...prev,
                                    [docKey]: newStat
                                  }));
                                  
                                  // Update version history
                                  setDocVersionHistory(prev => {
                                    const list = prev[docKey] || [];
                                    const nextVerNum = `v1.${list.length + 1}`;
                                    return {
                                      ...prev,
                                      [docKey]: [
                                        ...list,
                                        { version: nextVerNum, date: new Date().toLocaleString('bn-BD'), updatedBy: activeStaff.name, remarks }
                                      ]
                                    };
                                  });

                                  setSelectedDocumentView(null);
                                  alert("ডকুমেন্ট সফলভাবে অনুমোদন করা হয়েছে!");
                                }
                              }}
                              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition flex items-center justify-center gap-1 text-[11px]"
                            >
                              <Check className="w-3.5 h-3.5" /> ডকুমেন্ট অনুমোদন করুন (Approve File)
                            </button>

                            <button
                              onClick={() => {
                                const remarks = prompt("ডকুমেন্ট প্রত্যাখ্যান করার কারণ লিখুন (বাধ্যতামূলক):");
                                if (remarks) {
                                  const docKey = selectedDocumentView.url!;
                                  const newStat = {
                                    status: 'Rejected' as const,
                                    remarks,
                                    verifiedBy: activeStaff.name,
                                    date: new Date().toLocaleDateString('bn-BD')
                                  };
                                  setCustomDocStatuses(prev => ({
                                    ...prev,
                                    [docKey]: newStat
                                  }));
                                  setSelectedDocumentView(null);
                                  alert("ডকুমেন্টটি প্রত্যাখ্যান করা হয়েছে!");
                                } else if (remarks === "") {
                                  alert("মন্তব্য লেখা বাধ্যতামূলক!");
                                }
                              }}
                              className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl transition flex items-center justify-center gap-1 text-[11px]"
                            >
                              <X className="w-3.5 h-3.5" /> ডকুমেন্ট প্রত্যাখ্যান করুন (Reject File)
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* TAB 5: APPLICATIONS & DOC CHECK */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              {!hasPermission('view_applications') ? (
                renderLockOverlay('আবেদনকারী ও সিভি দেখার অনুমতি', 'view_applications')
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">প্রবাসী আবেদনকারীদের পাসপোর্ট ও ডকুমেন্ট চেক</h3>
                      <p className="text-[10.5px] text-slate-400 font-light mt-0.5">আবেদনকারীদের পাসপোর্ট, BMET স্মার্ট কার্ড এবং মেডিকেল চেক স্ট্যাটাস লাইভ আপডেট ও অনুমোদন করুন।</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
                      মোট আবেদন: {applications.length}টি
                    </span>
                  </div>

                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {applications.length > 0 ? (
                      applications.slice().reverse().map(app => (
                        <div key={app.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5 hover:border-slate-300 transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong className="text-sm text-slate-900 block">{app.candidateName}</strong>
                              <span className="text-[10.5px] text-emerald-600 font-bold">{app.jobTitle}</span>
                              <span className="text-[9.5px] text-slate-400 font-light block mt-0.5">যোগাযোগ: {app.candidatePhone} | {app.candidateEmail}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-[9.5px] bg-slate-200 px-2 py-0.5 rounded-full font-mono text-slate-650">{app.id.toUpperCase()}</span>
                              <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                                app.status === 'Shortlisted' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 animate-pulse' :
                                app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                                {app.status === 'Shortlisted' ? 'শর্টলিস্টেড' : app.status === 'Rejected' ? 'নাকচকৃত' : 'প্রক্রিয়াধীন'}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 text-[11px] text-slate-600 border-t border-slate-200 pt-2.5">
                            <div className="flex justify-between items-center">
                              <span>🛂 পাসপোর্ট নম্বর: <strong className="font-mono text-slate-800">{app.passportNumber}</strong></span>
                              <button
                                disabled={!hasPermission('verify_documents')}
                                onClick={() => handleVerifyApplicantDoc(app.id, 'passport')}
                                className={`px-2 py-0.5 text-[9px] rounded font-bold transition ${
                                  !hasPermission('verify_documents') ? 'bg-slate-200 text-slate-400' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                }`}
                              >
                                ✓ ভেরিফাই
                              </button>
                            </div>

                            <div className="flex justify-between items-center">
                              <span>💳 BMET স্মার্ট কার্ড: <strong className="font-mono text-slate-800">{app.bmetCardNumber || 'Not Provided'}</strong></span>
                              <button
                                disabled={!hasPermission('verify_documents')}
                                onClick={() => handleVerifyApplicantDoc(app.id, 'bmet')}
                                className={`px-2 py-0.5 text-[9px] rounded font-bold transition ${
                                  !hasPermission('verify_documents') ? 'bg-slate-200 text-slate-400' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                }`}
                              >
                                ✓ অনুমোদন
                              </button>
                            </div>

                            <div className="flex justify-between items-center">
                              <span>🩺 মেডিকেল চেক স্ট্যাটাস: 
                                <strong className={`ml-1 px-1.5 py-0.2 rounded ${
                                  app.medicalStatus === 'Fit' ? 'bg-emerald-100 text-emerald-700 font-extrabold' : 
                                  app.medicalStatus === 'Unfit' ? 'bg-rose-100 text-rose-700 font-extrabold' :
                                  'bg-amber-100 text-amber-700 font-extrabold'
                                }`}>{app.medicalStatus === 'Fit' ? 'Fit' : app.medicalStatus === 'Unfit' ? 'Unfit' : 'Pending'}</strong>
                              </span>
                              <button
                                disabled={!hasPermission('verify_documents') || app.medicalStatus === 'Fit'}
                                onClick={() => handleVerifyApplicantDoc(app.id, 'medical')}
                                className={`px-2 py-0.5 text-[9px] rounded font-bold transition ${
                                  !hasPermission('verify_documents') || app.medicalStatus === 'Fit' ? 'bg-slate-200 text-slate-400' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                }`}
                              >
                                ✓ ফিট করুন
                              </button>
                            </div>
                          </div>

                          {/* Interview Schedule Button */}
                          <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-medium font-mono">এজেন্সি: {app.companyName}</span>
                            <div className="flex gap-1.5">
                              {app.status !== 'Rejected' && (
                                <button
                                  onClick={() => {
                                    onUpdateApplicationStatus(app.id, 'Rejected');
                                    onBroadcastNotification('💼 আবেদনের আপডেট', `${app.candidateName}, আপনার আবেদনটি এই মুহূর্তে বিবেচনা করা হয়নি।`);
                                    addLog(activeStaff.name, `${app.candidateName} এর আবেদন বাতিল করেছেন।`, 'info');
                                    alert('আবেদনটি বাতিল করা হয়েছে।');
                                  }}
                                  className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-[10px] px-2 py-1 rounded transition text-[9px]"
                                >
                                  বাতিল করুন
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  const date = prompt('ইন্টারভিউ ও মেডিকেল টেস্টের তারিখ এবং সময় লিখুন (যেমন: ১০ই জুলাই, সকাল ১০টা):', app.interviewDate || '');
                                  if (date) {
                                    onUpdateApplicationStatus(app.id, 'Shortlisted', date);
                                    onBroadcastNotification('🎉 ইন্টারভিউ কল!', `${app.candidateName}, আপনার "${app.jobTitle}" পদের জন্য ইন্টারভিউ এবং মেডিকেল টেস্টের তারিখ নির্ধারণ করা হয়েছে।`);
                                    addLog(activeStaff.name, `${app.candidateName} এর ইন্টারভিউ সিডিউল (${date}) নির্ধারণ করেছেন।`, 'success');
                                    alert(`${app.candidateName} এর ইন্টারভিউ সিডিউল নিশ্চিত করা হয়েছে: ${date}`);
                                  }
                                }}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-2.5 py-1 rounded transition text-[9px]"
                              >
                                {app.interviewDate ? '📅 ইন্টারভিউ আপডেট' : '📅 সিডিউল ইন্টারভিউ'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-10 text-slate-400">
                        কোনো চাকরির আবেদন খুঁজে পাওয়া যায়নি।
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5.5: ITALY WORK VISA PACKAGES MANAGEMENT */}
          {activeTab === 'italy-packages' && (
            <div className="space-y-6">
              {!hasPermission('view_applications') ? (
                renderLockOverlay('ইতালি প্রসেসিং প্যাকেজ দেখার অনুমতি', 'view_applications')
              ) : (
                <div className="space-y-6">
                  {/* Summary / Stats Bar - 11 Premium Cards Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {/* Card 1: Total Visa Contracts */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0">📋</div>
                      <div className="min-w-0">
                        <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider truncate">Total Contracts</p>
                        <p className="text-sm font-black text-slate-800">{italyPackages.filter(p => p.status === 'Approved').length}টি</p>
                      </div>
                    </div>
                    {/* Card 2: Active Contracts */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs shrink-0">⚡</div>
                      <div className="min-w-0">
                        <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider truncate">Active Contracts</p>
                        <p className="text-sm font-black text-slate-800">{italyPackages.filter(p => p.status === 'Approved' && p.contractStatus === 'Active').length}টি</p>
                      </div>
                    </div>
                    {/* Card 3: Completed Contracts */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs shrink-0">✅</div>
                      <div className="min-w-0">
                        <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider truncate">Completed Visa</p>
                        <p className="text-sm font-black text-slate-800">{italyPackages.filter(p => p.status === 'Approved' && p.contractStatus === 'Completed').length}টি</p>
                      </div>
                    </div>
                    {/* Card 4: Total Revenue */}
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 shadow-sm flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs shrink-0">💰</div>
                      <div className="min-w-0">
                        <p className="text-[8.5px] text-emerald-800 font-bold uppercase tracking-wider truncate">Total Revenue</p>
                        <p className="text-sm font-black text-emerald-600">৳{italyPackages.reduce((sum, p) => sum + (p.paidAmount || 0), 0).toLocaleString()}</p>
                      </div>
                    </div>
                    {/* Card 5: Total Due Amount */}
                    <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3 shadow-sm flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs shrink-0">⏳</div>
                      <div className="min-w-0">
                        <p className="text-[8.5px] text-rose-800 font-bold uppercase tracking-wider truncate">Total Due</p>
                        <p className="text-sm font-black text-rose-600">৳{italyPackages.reduce((sum, p) => sum + (p.dueAmount || 0), 0).toLocaleString()}</p>
                      </div>
                    </div>
                    {/* Card 6: Today Collection */}
                    <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 shadow-sm flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs shrink-0">📅</div>
                      <div className="min-w-0">
                        <p className="text-[8.5px] text-amber-800 font-bold uppercase tracking-wider truncate">Today Coll.</p>
                        <p className="text-sm font-black text-amber-700">৳{(25000).toLocaleString()}</p>
                      </div>
                    </div>
                    {/* Card 7: Monthly Collection */}
                    <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 shadow-sm flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs shrink-0">📊</div>
                      <div className="min-w-0">
                        <p className="text-[8.5px] text-sky-800 font-bold uppercase tracking-wider truncate">Monthly Coll.</p>
                        <p className="text-sm font-black text-sky-700">৳{(145000).toLocaleString()}</p>
                      </div>
                    </div>
                    {/* Card 8: Pending Payments */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xs shrink-0">⚠️</div>
                      <div className="min-w-0">
                        <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider truncate">Pending Pay</p>
                        <p className="text-sm font-black text-slate-800">{italyPackages.filter(p => (p.dueAmount || 0) > 0).length}টি</p>
                      </div>
                    </div>
                    {/* Card 9: Visa Approved */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs shrink-0">🎓</div>
                      <div className="min-w-0">
                        <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider truncate">Visa Approved</p>
                        <p className="text-sm font-black text-slate-800">{italyPackages.filter(p => p.visaSteps?.some(s => s.key === 'visa_approved' && s.status === 'Completed')).length}টি</p>
                      </div>
                    </div>
                    {/* Card 10: Visa Printed */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center text-xs shrink-0">🖨️</div>
                      <div className="min-w-0">
                        <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider truncate">Visa Printed</p>
                        <p className="text-sm font-black text-slate-800">{italyPackages.filter(p => p.visaSteps?.some(s => s.key === 'visa_printed' && s.status === 'Completed')).length}টি</p>
                      </div>
                    </div>
                    {/* Card 11: Ready for Departure */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-2 text-white col-span-2 md:col-span-1 lg:col-span-1">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs shrink-0">✈️</div>
                      <div className="min-w-0">
                        <p className="text-[8.5px] text-emerald-400 font-bold uppercase tracking-wider truncate">Departure Ready</p>
                        <p className="text-sm font-black">{italyPackages.filter(p => p.visaSteps?.some(s => s.key === 'ticket_issued' && s.status === 'Completed')).length}টি</p>
                      </div>
                    </div>
                  </div>

                  {/* Italy Packages List */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <span>🇮🇹 ইতালি প্রসেসিং প্যাকেজ আবেদন তালিকা (Italy Work Visa Processing Packages)</span>
                        </h3>
                        <p className="text-[10.5px] text-slate-400 font-light mt-0.5">
                          প্রবাসী চাকরিপ্রার্থীদের ইউরোপাস সিভি, পাসপোর্ট চেক এবং ইতালির নিয়োগকর্তার সাথে সরাসরি মেইলিং প্রসেস অনুমোদন ও ট্র্যাকিং করুন।
                        </p>
                      </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
                      <div className="relative w-full sm:w-80">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={searchItalyCandidate}
                          onChange={(e) => setSearchItalyCandidate(e.target.value)}
                          placeholder="প্রার্থীর নাম বা পাসপোর্ট নম্বর লিখে খুঁজুন..."
                          className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-slate-850"
                        />
                      </div>
                      <div className="text-[10px] text-slate-450 font-black uppercase tracking-wider">
                        মোট প্রসেসিং প্যাকেজ: {italyPackages.length}টি
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {italyPackages.length > 0 ? (() => {
                        const filtered = italyPackages.filter(pkg => 
                          !searchItalyCandidate ||
                          (pkg.candidateName && pkg.candidateName.toLowerCase().includes(searchItalyCandidate.toLowerCase())) ||
                          (pkg.passportNumber && pkg.passportNumber.toLowerCase().includes(searchItalyCandidate.toLowerCase()))
                        );

                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-12 text-slate-400 text-xs font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                              সার্চের সাথে মিলে যায় এমন কোনো ইতালি প্রসেসিং প্যাকেজ খুঁজে পাওয়া যায়নি।
                            </div>
                          );
                        }

                        return filtered.slice().reverse().map((pkg) => {
                          const isPending = pkg.status === 'Pending';
                          const isApproved = pkg.status === 'Approved';
                          const isRejected = pkg.status === 'Rejected';

                          return (
                            <div key={pkg.id} className="p-5 border border-slate-200 hover:border-slate-350 rounded-2xl bg-slate-50/40 hover:bg-white transition-all duration-200 space-y-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-150/60">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-slate-850">ID: {pkg.id}</span>
                                    <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase ${
                                      pkg.packageName === 'Premium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                      pkg.packageName === 'Standard' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                      'bg-slate-150 text-slate-700 border border-slate-200'
                                    }`}>
                                      {pkg.packageName} Package
                                    </span>
                                    {pkg.priceAmount && (
                                      <span className="px-2 py-0.5 text-[9.5px] font-extrabold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        💸 মূল্য: {pkg.priceAmount}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-400 font-mono">আবেদনের তারিখ: {pkg.appliedAt}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <span>গ্রাহকের ইমেইল:</span>
                                    <strong className="text-slate-750 font-bold">{pkg.candidateEmail}</strong>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                                    isApproved ? 'bg-emerald-100 text-emerald-850' :
                                    isRejected ? 'bg-rose-100 text-rose-850' :
                                    'bg-amber-100 text-amber-850'
                                  }`}>
                                    {isApproved ? 'অনুমোদিত ও ভেরিফাইড' : isRejected ? 'রিকোয়েস্ট বাতিলকৃত' : 'পেন্ডিং (অপেক্ষমাণ)'}
                                  </span>
                                </div>
                              </div>

                              {/* Candidate Info Columns */}
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                                <div className="space-y-0.5">
                                  <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">আবেদনকারীর নাম</span>
                                  <span className="text-slate-850 font-black">{pkg.candidateName}</span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">পাসপোর্ট নম্বর</span>
                                  <span className="text-slate-800 font-bold font-mono">{pkg.passportNumber}</span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">মোবাইল নম্বর</span>
                                  <span className="text-slate-800 font-bold font-mono">{pkg.candidatePhone}</span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">যোগাযোগ মাধ্যম (ইমেইল)</span>
                                  <span className="text-slate-800 font-medium font-mono truncate block">{pkg.candidateEmail}</span>
                                </div>
                              </div>

                              {pkg.message && (
                                <div className="p-3 bg-white border border-slate-150 rounded-xl text-xs text-slate-650 leading-relaxed font-light">
                                  <span className="font-bold text-slate-700">ব্যবহারকারীর মেসেজ/অনুরোধ:</span> {pkg.message}
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => setExpandedPkgId(expandedPkgId === pkg.id ? null : pkg.id)}
                                  className="py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                                >
                                  🛂 ভিসা প্রসেস ও পেমেন্ট প্ল্যান ট্র্যাকার ({pkg.visaSteps?.length || 9} স্টেপস, {pkg.paymentSteps?.length || 6} পেমেন্ট প্ল্যান) {expandedPkgId === pkg.id ? '▲ বন্ধ করুন' : '▼ ম্যানেজ করুন'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedItPkgDetail(pkg)}
                                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                                >
                                  🛡️ ভেরিফাইড ট্র্যাকিং প্যানেল খুলুন (Verified Tracking Panel)
                                </button>
                              </div>

                              {/* Visa Process & Payment Plan Tracker Module (Admin View) */}
                              {expandedPkgId === pkg.id && (
                                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 space-y-6">
                                  <div className="border-b border-slate-200 pb-3">
                                    <h4 className="text-xs font-black uppercase text-indigo-700 tracking-wider">🛂 ভিসা প্রসেস ও পেমেন্ট ট্র্যাকার মডিউল</h4>
                                    <p className="text-[10.5px] text-slate-500 mt-0.5">
                                      এই প্রসেসের মোট ৯টি ভিসা প্রসেসিং স্টেপ এবং ৮টি পেমেন্ট কিস্তি রয়েছে।
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Left Column: Visa Processing Steps */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                                      <h5 className="text-[11px] font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
                                        <span>🛂 ভিসা প্রসেসিং ধাপসমূহ (Visa Processing Steps)</span>
                                        <span className="text-[9.5px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">স্টেপ আপডেট করুন</span>
                                      </h5>

                                      <div className="space-y-3">
                                        {(pkg.visaSteps || []).map((step) => {
                                          const isEditing = editingStepKey === `${pkg.id}_${step.key}`;
                                          return (
                                            <div key={step.key} className="p-3 border border-slate-150 rounded-xl bg-slate-50/50 space-y-2">
                                              <div className="flex justify-between items-center">
                                                <span className="font-bold text-[11.5px] text-slate-800">
                                                  {step.name}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                  <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${
                                                    step.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                                    step.status === 'Processing' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                                                    step.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                                                    'bg-slate-200 text-slate-600'
                                                  }`}>
                                                    {step.status}
                                                  </span>
                                                  {!isEditing && (
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        setEditingStepKey(`${pkg.id}_${step.key}`);
                                                        setStepStatus(step.status as any || 'Pending');
                                                        setStepDate(step.date || new Date().toISOString().split('T')[0]);
                                                        setStepStaff(step.staffName || activeStaff.name);
                                                        setStepDocName(step.documentUrl || '');
                                                        setStepNotes(step.adminNotes || '');
                                                      }}
                                                      className="p-1 text-indigo-600 hover:bg-indigo-55 border border-indigo-150 rounded text-[9.5px] font-black cursor-pointer"
                                                      title="স্টেপ এডিট"
                                                    >
                                                      ✍️ এডিট
                                                    </button>
                                                  )}
                                                </div>
                                              </div>

                                              {/* Step metadata */}
                                              {!isEditing && (
                                                <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500 font-bold border-t border-slate-150/60 pt-1.5">
                                                  {step.date && <p>📅 আপডেট তারিখ: <span className="text-slate-800 font-mono">{step.date}</span></p>}
                                                  {step.staffName && <p>🧑‍💻 স্টাফ: <span className="text-slate-800">{step.staffName}</span></p>}
                                                  {step.documentUrl && <p className="col-span-2 text-indigo-600">📄 ফাইল: <span className="font-mono text-indigo-700">{step.documentUrl}</span></p>}
                                                  {step.adminNotes && <p className="col-span-2 bg-slate-100 p-1.5 rounded text-slate-600 italic">✍️ অফিসিয়াল নোট: "${step.adminNotes}"</p>}
                                                </div>
                                              )}

                                              {/* Editing Form */}
                                              {isEditing && (
                                                <div className="space-y-2 bg-white p-2.5 rounded-xl border border-indigo-100 mt-2 text-[10px]">
                                                  <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                      <label className="text-[8.5px] text-slate-400 font-bold block uppercase">স্ট্যাটাস (Status)</label>
                                                      <select
                                                        value={stepStatus}
                                                        onChange={(e) => setStepStatus(e.target.value)}
                                                        className="w-full p-1 border border-slate-250 bg-white rounded text-[10px]"
                                                      >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Rejected">Rejected</option>
                                                      </select>
                                                    </div>
                                                    <div>
                                                      <label className="text-[8.5px] text-slate-400 font-bold block uppercase">আপডেট তারিখ</label>
                                                      <input
                                                        type="date"
                                                        value={stepDate}
                                                        onChange={(e) => setStepDate(e.target.value)}
                                                        className="w-full p-1 border border-slate-250 bg-white rounded text-[10px]"
                                                      />
                                                    </div>
                                                    <div>
                                                      <label className="text-[8.5px] text-slate-400 font-bold block uppercase">দায়িত্বপ্রাপ্ত স্টাফ</label>
                                                      <input
                                                        type="text"
                                                        value={stepStaff}
                                                        onChange={(e) => setStepStaff(e.target.value)}
                                                        className="w-full p-1 border border-slate-250 bg-white rounded text-[10px]"
                                                      />
                                                    </div>
                                                    <div>
                                                      <label className="text-[8.5px] text-slate-400 font-bold block uppercase">স্ক্যান কপি ফাইল নাম</label>
                                                      <input
                                                        type="text"
                                                        value={stepDocName}
                                                        onChange={(e) => setStepDocName(e.target.value)}
                                                        placeholder="যেমন: mofa_approved_seal.pdf"
                                                        className="w-full p-1 border border-slate-250 bg-white rounded text-[10px]"
                                                      />
                                                    </div>
                                                  </div>

                                                  <div>
                                                    <label className="text-[8.5px] text-slate-400 font-bold block uppercase">অফিসিয়াল নোট (Admin Notes)</label>
                                                    <textarea
                                                      rows={2}
                                                      placeholder="যেমন: MOFA Attestation completed successfully from foreign ministry."
                                                      value={stepNotes}
                                                      onChange={(e) => setStepNotes(e.target.value)}
                                                      className="w-full p-1.5 border border-slate-250 bg-white rounded text-[10px]"
                                                    />
                                                  </div>

                                                  <div className="flex gap-2 justify-end pt-1">
                                                    <button
                                                      type="button"
                                                      onClick={() => setEditingStepKey(null)}
                                                      className="py-1 px-2 border border-slate-250 text-slate-500 hover:bg-slate-100 rounded text-[9.5px] font-bold cursor-pointer"
                                                    >
                                                      বাতিল
                                                    </button>
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        const updatedVisaSteps = (pkg.visaSteps || []).map(s => {
                                                          if (s.key === step.key) {
                                                            return {
                                                              ...s,
                                                              status: stepStatus,
                                                              date: stepDate,
                                                              staffName: stepStaff,
                                                              documentUrl: stepDocName,
                                                              adminNotes: stepNotes
                                                            };
                                                          }
                                                          return s;
                                                        });
                                                        const updatedPkg = { ...pkg, visaSteps: updatedVisaSteps };
                                                        onUpdateItalyPackage(updatedPkg);
                                                        setEditingStepKey(null);
                                                        addLog(activeStaff.name, `প্যাকেজ #${pkg.id} এর "${step.name}"  ধাপের তথ্য ও স্ট্যাটাস '${stepStatus}' আপডেট করেছেন।`, 'success');
                                                        
                                                        // Automated notification trigger on completion
                                                        if (stepStatus === 'Completed' && step.status !== 'Completed') {
                                                          let customNotifTitle = `🔔 ${step.name} Completed`;
                                                          let customNotifMsg = `${pkg.candidateName} এর "${step.name}"  ধাপটি সফলভাবে সম্পন্ন হয়েছে।`;
                                                          if (step.key === 'mofa') {
                                                            customNotifTitle = '🔔 MOFA Completed';
                                                            customNotifMsg = `${pkg.candidateName} এর MOFA Attestation সফলভাবে সম্পন্ন হয়েছে।`;
                                                          } else if (step.key === 'work_permit') {
                                                            customNotifTitle = '🔔 Work Permit Ready';
                                                            customNotifMsg = `${pkg.candidateName} এর ইতালির ওয়ার্ক পারমিট (Nulla Osta) সফলভাবে অনুমোদিত ও রিসিভ হয়েছে!`;
                                                          } else if (step.key === 'invitation_letter') {
                                                            customNotifTitle = '🔔 Invitation Letter Uploaded';
                                                            customNotifMsg = `${pkg.candidateName} এর স্পন্সর ইনভিটেশন লেটার সফলভাবে সিস্টেমে আপলোড করা হয়েছে।`;
                                                          } else if (step.key === 'visa_submission') {
                                                            customNotifTitle = '🔔 Visa Submitted';
                                                            customNotifMsg = `${pkg.candidateName} এর পাসপোর্ট ও নথিপত্র ইতালির দূতাবাসে সাবমিট করা হয়েছে।`;
                                                          } else if (step.key === 'visa_approved') {
                                                            customNotifTitle = '🔔 Visa Approved';
                                                            customNotifMsg = `🎉 অভিনন্দন! ${pkg.candidateName} এর ইতালির কাজের ভিসা সফলভাবে embassy কর্তৃক অনুমোদিত হয়েছে!`;
                                                          } else if (step.key === 'visa_printed') {
                                                            customNotifTitle = '🔔 Visa Printed';
                                                            customNotifMsg = `🎉 ${pkg.candidateName} এর পাসপোর্ট ও ভিসা সফলভাবে প্রিন্ট হয়েছে এবং প্রধান কার্যালয়ে পৌঁছেছে।`;
                                                          } else if (step.key === 'ticket_issued') {
                                                            customNotifTitle = '🔔 Flight Ticket Ready';
                                                            customNotifMsg = `✈️ ${pkg.candidateName} এর ফ্লাইটের টিকিট ও ট্রাভেল শিডিউল চূড়ান্ত করা হয়েছে।`;
                                                          } else if (step.key === 'departure') {
                                                            customNotifTitle = '🔔 Departure Reminder';
                                                            customNotifMsg = `✈️ শুভকামনা! ${pkg.candidateName} এর বিমান যাত্রা আজ সম্পন্ন হচ্ছে। ফ্লাইট সময়ের ৪ ঘণ্টা আগে উপস্থিত থাকুন।`;
                                                          }
                                                          onBroadcastNotification?.(customNotifTitle, customNotifMsg);
                                                        }

                                                        alert(`"${step.name}" সফলভাবে সংরক্ষিত হয়েছে!`);
                                                      }}
                                                      className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[9.5px] font-bold cursor-pointer"
                                                    >
                                                      সংরক্ষণ করুন
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                    {/* Right Column: Payment Plan Management */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                                      <h5 className="text-[11px] font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
                                        <span>💰 পেমেন্ট প্ল্যান ও ইন্সটলমেন্ট ট্র্যাকার</span>
                                        <span className="text-[9.5px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">পেমেন্ট প্ল্যান নির্ধারণ</span>
                                      </h5>

                                      <div className="space-y-4">
                                        <div className="overflow-x-auto">
                                          <table className="w-full text-left text-[11px] border-collapse">
                                            <thead>
                                              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                                                <th className="p-2">ধাপ (Payment Installment Step)</th>
                                                <th className="p-2 text-right">নির্ধারিত টাকা (Amount)</th>
                                                <th className="p-2 text-center">স্ট্যাটাস</th>
                                                <th className="p-2 text-right">প্রাপ্ত টাকা</th>
                                              </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                              {(pkg.paymentSteps || []).map((pStep, pIdx) => {
                                                return (
                                                  <tr key={pStep.key} className="hover:bg-slate-50/20">
                                                    <td className="p-2 font-bold text-slate-700">
                                                      {pIdx + 1}. {pStep.name}
                                                    </td>
                                                    <td className="p-2 text-right">
                                                      <input
                                                        type="number"
                                                        className="w-16 p-0.5 text-right border border-slate-250 bg-white rounded font-mono font-bold text-slate-850"
                                                        defaultValue={pStep.amount}
                                                        onBlur={(e) => {
                                                          const newAmt = parseFloat(e.target.value) || 0;
                                                          if (newAmt !== pStep.amount) {
                                                            const updatedPaymentSteps = (pkg.paymentSteps || []).map(ps => {
                                                              if (ps.key === pStep.key) {
                                                                return { ...ps, amount: newAmt };
                                                              }
                                                              return ps;
                                                            });
                                                            const nextTotal = updatedPaymentSteps.reduce((sum, p) => sum + p.amount, 0);
                                                            const updatedPkg = {
                                                              ...pkg,
                                                              paymentSteps: updatedPaymentSteps,
                                                              totalAmount: nextTotal,
                                                              priceAmount: `৳${nextTotal.toLocaleString()}`,
                                                              dueAmount: nextTotal - pkg.paidAmount
                                                            };
                                                            onUpdateItalyPackage(updatedPkg);
                                                            addLog(activeStaff.name, `প্যাকেজ #${pkg.id} এর পেমেন্ট ধাপ "${pStep.name}" এর টাকা ৳${newAmt.toLocaleString()} সেট করেছেন।`, 'info');
                                                          }
                                                        }}
                                                      />
                                                    </td>
                                                    <td className="p-2 text-center">
                                                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                                        pStep.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                                                        pStep.status === 'Partial' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                                                        'bg-slate-150 text-slate-500'
                                                      }`}>
                                                        {pStep.status}
                                                      </span>
                                                    </td>
                                                    <td className="p-2 text-right">
                                                      <div className="flex items-center justify-end gap-1 font-mono">
                                                        <span>৳{(pStep.paidAmount || 0).toLocaleString()}</span>
                                                        <button
                                                          type="button"
                                                          onClick={() => {
                                                            const inputVal = prompt(`"${pStep.name}" এর জন্য নতুন প্রাপ্ত টাকার পরিমাণ লিখুন (টাকায়):`, (pStep.paidAmount || 0).toString());
                                                            if (inputVal !== null) {
                                                              const nextPaidAmt = parseFloat(inputVal) || 0;
                                                              const updatedPaymentSteps = (pkg.paymentSteps || []).map(ps => {
                                                                if (ps.key === pStep.key) {
                                                                  let nextStat: 'Unpaid' | 'Partial' | 'Paid' = 'Unpaid';
                                                                  if (nextPaidAmt >= ps.amount) nextStat = 'Paid';
                                                                  else if (nextPaidAmt > 0) nextStat = 'Partial';
                                                                  return {
                                                                    ...ps,
                                                                    paidAmount: nextPaidAmt,
                                                                    status: nextStat,
                                                                    paidDate: new Date().toISOString().split('T')[0]
                                                                  };
                                                                }
                                                                return ps;
                                                              });

                                                              const nextPaidSum = updatedPaymentSteps.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
                                                              const nextTotal = updatedPaymentSteps.reduce((sum, p) => sum + p.amount, 0);

                                                              // Create payment history log
                                                              const newLog = {
                                                                id: `tx_hist_${pkg.id}_${pStep.key}_${Date.now()}`,
                                                                amount: nextPaidAmt - (pStep.paidAmount || 0),
                                                                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                                                                method: 'Cash / Manual Office',
                                                                invoiceId: `INV-2026-${pkg.id.slice(-4).toUpperCase()}-${100 + (pkg.paymentHistory?.length || 0)}`,
                                                                status: 'Verified' as const,
                                                                stepKey: pStep.key
                                                              };

                                                              const updatedPkg = {
                                                                ...pkg,
                                                                paymentSteps: updatedPaymentSteps,
                                                                paidAmount: nextPaidSum,
                                                                dueAmount: nextTotal - nextPaidSum,
                                                                paymentHistory: [newLog, ...(pkg.paymentHistory || [])]
                                                              };

                                                              onUpdateItalyPackage(updatedPkg);
                                                              addLog(activeStaff.name, `প্যাকেজ #${pkg.id} এর "${pStep.name}" এর পেমেন্ট ৳${nextPaidAmt.toLocaleString()} রেকর্ড করেছেন।`, 'success');
                                                              alert('পেমেন্ট সফলভাবে রেকর্ড করা হয়েছে!');
                                                            }
                                                          }}
                                                          className="p-0.5 text-indigo-600 hover:bg-indigo-55 border border-indigo-150 rounded text-[9px] font-black cursor-pointer"
                                                          title="পেমেন্ট এন্ট্রি"
                                                        >
                                                          ✍️
                                                        </button>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                          </table>
                                        </div>

                                        {/* Payments Summary Cards */}
                                        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-150 rounded-xl text-center text-[11px] font-mono">
                                          <div>
                                            <span className="text-[9px] text-slate-400 font-sans block uppercase">মোট বাজেট</span>
                                            <strong className="text-slate-800 text-xs font-black">৳{(pkg.totalAmount || 0).toLocaleString()}</strong>
                                          </div>
                                          <div className="border-x border-slate-200">
                                            <span className="text-[9px] text-emerald-500 font-sans block uppercase">মোট পেইড</span>
                                            <strong className="text-emerald-700 text-xs font-black">৳{(pkg.paidAmount || 0).toLocaleString()}</strong>
                                          </div>
                                          <div>
                                            <span className="text-[9px] text-rose-500 font-sans block uppercase">বকেয়া টাকা</span>
                                            <strong className="text-rose-700 text-xs font-black">৳{(pkg.dueAmount || 0).toLocaleString()}</strong>
                                          </div>
                                        </div>

                                        {/* Commission & Contract status */}
                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-slate-500 block font-bold">এজেন্সি কমিশন (৳):</label>
                                            <input
                                              type="number"
                                              className="w-full p-1.5 border border-slate-250 bg-white rounded font-mono font-bold"
                                              defaultValue={pkg.commission || 15000}
                                              onBlur={(e) => {
                                                const val = parseFloat(e.target.value) || 0;
                                                onUpdateItalyPackage({ ...pkg, commission: val });
                                                addLog(activeStaff.name, `প্যাকেজ #${pkg.id} এর এজেন্সি কমিশন ৳${val.toLocaleString()} সেট করেছেন।`, 'info');
                                              }}
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-slate-500 block font-bold">চুক্তি স্ট্যাটাস (Contract):</label>
                                            <select
                                              value={pkg.contractStatus || 'Active'}
                                              onChange={(e) => {
                                                const nextVal = e.target.value as any;
                                                onUpdateItalyPackage({ ...pkg, contractStatus: nextVal });
                                                addLog(activeStaff.name, `প্যাকেজ #${pkg.id} এর চুক্তি স্থিতি '${nextVal}' এ পরিবর্তন করেছেন।`, 'warning');
                                                alert(`চুক্তি স্থিতি '${nextVal}' এ সেট করা হয়েছে!`);
                                              }}
                                              className="w-full p-1.5 border border-slate-250 bg-white rounded cursor-pointer font-bold text-slate-700"
                                            >
                                              <option value="Pending">Pending (অপেক্ষমান)</option>
                                              <option value="Active">Active (চলমান চুক্তি)</option>
                                              <option value="Completed">Completed (সম্পন্ন চুক্তি)</option>
                                              <option value="Terminated">Terminated (বাতিলকৃত চুক্তি)</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Actions and Internal Notes form */}
                              <div className="bg-white/60 p-4 rounded-xl border border-slate-150 space-y-3">
                                {/* Document Verification Checklist */}
                                <div className="border-b border-slate-150 pb-3 mb-3 space-y-2.5">
                                  <h4 className="text-[10.5px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                                    📁 চুক্তিপত্র ও ডকুমেন্টস ভেরিফিকেশন বোর্ড (Contract & Document Verification Checklist)
                                  </h4>
                                  <p className="text-[10px] text-slate-400 font-normal">
                                    এজেন্সি ও ক্যান্ডিডেট কর্তৃক আপলোডকৃত প্রতিটি ডকুমেন্ট পরীক্ষা করে আলাদা আলাদা সিদ্ধান্ত দিন। সিদ্ধান্তসমূহ ক্যান্ডিডেটের ড্যাশবোর্ডে রিয়েল-টাইমে আপডেট হবে।
                                  </p>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {[
                                      { key: 'offerLetter', label: 'Offer Letter (অফার লেটার)', file: pkg.documents?.offerLetter?.fileUrl || 'italy_offer_letter.pdf', current: pkg.documents?.offerLetter },
                                      { key: 'employmentContract', label: 'Employment Contract (চুক্তিপত্র)', file: pkg.documents?.employmentContract?.fileUrl || 'italy_employment_contract.pdf', current: pkg.documents?.employmentContract },
                                      { key: 'workPermit', label: 'Work Permit (ওয়ার্ক পারমিট)', file: pkg.documents?.workPermit?.fileUrl || 'italy_work_permit.pdf', current: pkg.documents?.workPermit },
                                      { key: 'passportCopy', label: 'Passport Copy (পাসপোর্ট স্ক্যান)', file: pkg.documents?.passportCopy?.fileUrl || 'candidate_passport_scan.pdf', current: pkg.documents?.passportCopy },
                                      { key: 'visaDocuments', label: 'Visa Documents (ভিসা ডকুমেন্টস)', file: pkg.documents?.visaDocuments?.fileUrl || 'visa_document_scan.pdf', current: pkg.documents?.visaDocuments },
                                      { key: 'paymentReceipts', label: 'Payment Receipts (পেমেন্ট স্লিপ)', file: pkg.documents?.paymentReceipts?.fileUrl || 'payment_receipt_copy.png', current: pkg.documents?.paymentReceipts },
                                    ].map((doc) => {
                                      const docState = doc.current || { status: 'Pending', notes: '' };
                                      return (
                                        <div key={doc.key} className="p-2.5 border border-slate-200/60 rounded-xl bg-slate-50 flex flex-col justify-between gap-2 text-[10.5px]">
                                          <div className="flex justify-between items-start">
                                            <div className="space-y-0.5">
                                              <span className="font-bold text-slate-800">{doc.label}</span>
                                              <p className="text-[9.5px] text-slate-400 font-mono">📂 {doc.file}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 text-[8.5px] font-black rounded-full ${
                                              docState.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                              docState.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                                              docState.status === 'Correction Required' ? 'bg-amber-100 text-amber-800' :
                                              'bg-blue-100 text-blue-800'
                                            }`}>
                                              {docState.status}
                                            </span>
                                          </div>

                                          {/* Verification Notes */}
                                          <div className="space-y-1">
                                            <input
                                              type="text"
                                              placeholder="যাচাই মন্তব্য (যেমন: স্ট্যাম্প ও স্বাক্ষর সঠিক আছে)"
                                              defaultValue={docState.notes || ''}
                                              id={`doc-notes-${pkg.id}-${doc.key}`}
                                              className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-[9.5px] focus:outline-none"
                                            />
                                          </div>

                                          {/* Action Row */}
                                          <div className="flex justify-end gap-1 border-t border-slate-200/50 pt-1.5">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const noteInput = document.getElementById(`doc-notes-${pkg.id}-${doc.key}`) as HTMLInputElement;
                                                const nextNotes = noteInput ? noteInput.value : '';
                                                
                                                const updatedDocs = {
                                                  ...(pkg.documents || {}),
                                                  [doc.key]: {
                                                    status: 'Approved',
                                                    notes: nextNotes || 'ডкоменটটি সফলভাবে অ্যাডমিন দ্বারা অনুমোদিত হয়েছে।'
                                                  }
                                                };

                                                // Auto update timeline steps on approval
                                                let updatedTimeline = pkg.timeline ? [...pkg.timeline] : [];
                                                if (doc.key === 'employmentContract') {
                                                  updatedTimeline = updatedTimeline.map(step => {
                                                    if (step.key === 'contract_uploaded') {
                                                      return { ...step, status: 'Approved' };
                                                    }
                                                    return step;
                                                  });
                                                } else if (doc.key === 'offerLetter') {
                                                  updatedTimeline = updatedTimeline.map(step => {
                                                    if (step.key === 'offer_letter') {
                                                      return { ...step, status: 'Approved' };
                                                    }
                                                    return step;
                                                  });
                                                }

                                                const updatedPkg = { ...pkg, documents: updatedDocs, timeline: updatedTimeline };
                                                onUpdateItalyPackage(updatedPkg);
                                                addLog(activeStaff.name, `কন্ট্রাক্ট #${pkg.id} এর '${doc.key}' ডকুমেন্টটি সফলভাবে অনুমোদন করেছেন।`, 'success');
                                                alert(`'${doc.label}' সফলভাবে অনুমোদন করা হয়েছে!`);
                                              }}
                                              className="py-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[9.5px] font-bold"
                                            >
                                              ✓ Approve
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const noteInput = document.getElementById(`doc-notes-${pkg.id}-${doc.key}`) as HTMLInputElement;
                                                const nextNotes = noteInput ? noteInput.value : '';
                                                if (!nextNotes) {
                                                  alert('সংশোধনের অনুরোধ করার জন্য অনুগ্রহ করে কমেন্টে সুনির্দিষ্ট কারণ উল্লেখ করুন।');
                                                  return;
                                                }
                                                
                                                const updatedDocs = {
                                                  ...(pkg.documents || {}),
                                                  [doc.key]: {
                                                    status: 'Correction Required',
                                                    notes: nextNotes
                                                  }
                                                };
                                                
                                                const updatedPkg = { ...pkg, documents: updatedDocs };
                                                onUpdateItalyPackage(updatedPkg);
                                                addLog(activeStaff.name, `কন্ট্রাক্ট #${pkg.id} এর '${doc.key}' সংশোধন করতে অনুরোধ করেছেন: "${nextNotes}"`, 'warning');
                                                alert(`'${doc.label}' সংশোধন করার জন্য এজেন্সি ও ক্যান্ডিডেটকে অবহিত করা হয়েছে।`);
                                              }}
                                              className="py-1 px-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-[9.5px] font-bold"
                                            >
                                              ⚠️ Correction Request
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const noteInput = document.getElementById(`doc-notes-${pkg.id}-${doc.key}`) as HTMLInputElement;
                                                const nextNotes = noteInput ? noteInput.value : '';
                                                
                                                const updatedDocs = {
                                                  ...(pkg.documents || {}),
                                                  [doc.key]: {
                                                    status: 'Rejected',
                                                    notes: nextNotes || 'ডকুমেন্টটি বাতিল করা হয়েছে।'
                                                  }
                                                };
                                                
                                                const updatedPkg = { ...pkg, documents: updatedDocs };
                                                onUpdateItalyPackage(updatedPkg);
                                                addLog(activeStaff.name, `কন্ট্রাক্ট #${pkg.id} এর '${doc.key}' ডকুমেন্টটি বাতিল করেছেন।`, 'danger');
                                                alert(`'${doc.label}' ডকুমেন্টটি বাতিল করা হয়েছে!`);
                                              }}
                                              className="py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[9.5px] font-bold"
                                            >
                                              ✕ Reject
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">অভ্যন্তরীণ ফিডব্যাক নোট (গ্রাহক তার ড্যাশবোর্ডে দেখতে পাবেন)</label>
                                    <textarea
                                      id={`admin-pkg-notes-${pkg.id}`}
                                      className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                      rows={2}
                                      placeholder="যেমন: ইউরোপাস ফরম্যাটে আপনার সিভি প্রস্তুত করা হয়েছে এবং ২ টি ইতালির নিয়োগকর্তার কাছে পাঠানো হয়েছে।"
                                      defaultValue={pkg.notes || ''}
                                      onBlur={(e) => {
                                        const text = e.target.value;
                                        pkg.notes = text;
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">প্যাকেজের নির্ধারিত সার্ভিস চার্জ / টাকার পরিমাণ (টাকায়)</label>
                                    <input
                                      id={`admin-pkg-price-${pkg.id}`}
                                      type="text"
                                      className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-emerald-700"
                                      placeholder="যেমন: ৫,৫০,০০০ টাকা"
                                      defaultValue={pkg.priceAmount || ''}
                                      onBlur={(e) => {
                                        const text = e.target.value;
                                        pkg.priceAmount = text;
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="flex justify-end items-center gap-2">
                                  <button
                                    id={`admin-pkg-update-${pkg.id}`}
                                    onClick={() => {
                                      const noteInput = document.getElementById(`admin-pkg-notes-${pkg.id}`) as HTMLTextAreaElement;
                                      const noteVal = noteInput ? noteInput.value : '';
                                      const priceInput = document.getElementById(`admin-pkg-price-${pkg.id}`) as HTMLInputElement;
                                      const priceVal = priceInput ? priceInput.value : '';
                                      onUpdateItalyPackageStatus(pkg.id, pkg.status, noteVal, priceVal);
                                      onBroadcastNotification('📝 ইতালি প্যাকেজ আপডেট', `${pkg.candidateName}, আপনার ইতালি প্যাকেজ প্রসেসিং ফি ও ফিডব্যাক আপডেট করা হয়েছে।`);
                                      alert('ফি ও ফিডব্যাক তথ্য সফলভাবে আপডেট করা হয়েছে!');
                                    }}
                                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                                  >
                                    💾 শুধু তথ্য ও ফি আপডেট করুন
                                  </button>
                                  <button
                                    id={`admin-pkg-reject-${pkg.id}`}
                                    onClick={() => {
                                      const noteInput = document.getElementById(`admin-pkg-notes-${pkg.id}`) as HTMLTextAreaElement;
                                      const noteVal = noteInput ? noteInput.value : '';
                                      const priceInput = document.getElementById(`admin-pkg-price-${pkg.id}`) as HTMLInputElement;
                                      const priceVal = priceInput ? priceInput.value : '';
                                      onUpdateItalyPackageStatus(pkg.id, 'Rejected', noteVal, priceVal);
                                      onBroadcastNotification('❌ ইতালি প্যাকেজ বাতিল', `${pkg.candidateName}, আপনার ইতালি প্যাকেজ রিকোয়েস্টটি বাতিল করা হয়েছে। বিস্তারিত ফিডব্যাক দেখুন।`);
                                      alert('প্যাকেজ আবেদন সফলভাবে বাতিল করা হয়েছে!');
                                    }}
                                    className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                                  >
                                    ✕ আবেদন বাতিল করুন
                                  </button>
                                  <button
                                    id={`admin-pkg-approve-${pkg.id}`}
                                    onClick={() => {
                                      const noteInput = document.getElementById(`admin-pkg-notes-${pkg.id}`) as HTMLTextAreaElement;
                                      const noteVal = noteInput ? noteInput.value : '';
                                      const priceInput = document.getElementById(`admin-pkg-price-${pkg.id}`) as HTMLInputElement;
                                      const priceVal = priceInput ? priceInput.value : '';
                                      onUpdateItalyPackageStatus(pkg.id, 'Approved', noteVal, priceVal);
                                      onBroadcastNotification('🎉 ইতালি প্যাকেজ অনুমোদিত!', `অভিনন্দন ${pkg.candidateName}, আপনার ইতালি প্রসেসিং প্যাকেজ ভেরিফাইড করা হয়েছে এবং প্রসেসিং শুরু হয়েছে। টাকার পরিমাণ: ${priceVal || 'নির্ধারিত নয়'}`);
                                      alert('প্যাকেজ আবেদন সফলভাবে অনুমোদিত ও ফিডব্যাক/টাকার পরিমাণ আপডেট করা হয়েছে!');
                                    }}
                                    className="py-1.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                                  >
                                    ✓ অনুমোদন ও ফিডব্যাক আপডেট করুন
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      })() : (
                        <div className="text-center py-16 text-slate-400">
                          <ShieldCheck className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                          <p className="text-sm font-bold text-slate-700">কোনো ইতালি প্রসেসিং প্যাকেজ বুকিং রিকোয়েস্ট নেই।</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PAYMENTS TRACKER */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {!hasPermission('payment_access') ? (
                renderLockOverlay('পেমেন্ট ও রাজস্ব ট্র্যাকার অ্যাক্সেস', 'payment_access')
              ) : (
                <div className="space-y-6">
                  {/* Payments Dashboard Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                    <button 
                      onClick={() => {
                        setPaymentSubTab('verification');
                        setTxFilter('Verified');
                      }}
                      className="bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-650 hover:to-indigo-750 active:scale-[0.98] hover:scale-[1.02] transition-all duration-200 cursor-pointer rounded-xl p-3 text-white shadow-sm flex flex-col justify-between text-left focus:outline-none w-full"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] opacity-80 font-bold uppercase tracking-wider">মোট রাজস্ব</span>
                        <DollarSign className="w-4 h-4 opacity-75" />
                      </div>
                      <div className="mt-2">
                        <span className="text-lg md:text-xl font-black">৳{transactions.filter(t => t.status === 'Approved').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</span>
                        <p className="text-[9px] opacity-85 mt-0.5">অনুমোদিত পেমেন্ট সমূহ</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setPaymentSubTab('verification');
                        setTxFilter('Pending');
                      }}
                      className={`rounded-xl p-3 border shadow-sm flex flex-col justify-between text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none w-full ${
                        paymentSubTab === 'verification' && txFilter === 'Pending'
                          ? 'bg-amber-50/40 border-amber-400 ring-1 ring-amber-400'
                          : 'bg-white border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex justify-between items-center text-slate-500 w-full">
                        <span className="text-[10px] font-bold uppercase tracking-wider">পেন্ডিং যাচাই</span>
                        <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                      </div>
                      <div className="mt-2">
                        <span className="text-lg md:text-xl font-black text-slate-800">{transactions.filter(t => t.status === 'Pending').length}</span>
                        <p className="text-[9px] text-slate-400 mt-0.5">যাচাইয়ের অপেক্ষায়</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setPaymentSubTab('verification');
                        setTxFilter('Verified');
                      }}
                      className={`rounded-xl p-3 border shadow-sm flex flex-col justify-between text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none w-full ${
                        paymentSubTab === 'verification' && txFilter === 'Verified'
                          ? 'bg-emerald-50/40 border-emerald-400 ring-1 ring-emerald-400'
                          : 'bg-white border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex justify-between items-center text-slate-500 w-full">
                        <span className="text-[10px] font-bold uppercase tracking-wider">ভেরিফাইড পেমেন্ট</span>
                        <Check className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="mt-2">
                        <span className="text-lg md:text-xl font-black text-slate-800">{transactions.filter(t => t.status === 'Approved').length}</span>
                        <p className="text-[9px] text-slate-400 mt-0.5">সফলভাবে অনুমোদিত</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setPaymentSubTab('verification');
                        setTxFilter('Rejected');
                      }}
                      className={`rounded-xl p-3 border shadow-sm flex flex-col justify-between text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none w-full ${
                        paymentSubTab === 'verification' && txFilter === 'Rejected'
                          ? 'bg-rose-50/40 border-rose-400 ring-1 ring-rose-400'
                          : 'bg-white border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      <div className="flex justify-between items-center text-slate-500 w-full">
                        <span className="text-[10px] font-bold uppercase tracking-wider">নাকচকৃত পেমেন্ট</span>
                        <X className="w-4 h-4 text-rose-500" />
                      </div>
                      <div className="mt-2">
                        <span className="text-lg md:text-xl font-black text-slate-800">{transactions.filter(t => t.status === 'Rejected').length}</span>
                        <p className="text-[9px] text-slate-400 mt-0.5">বাতিল করা ট্রানজেকশন</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setPaymentSubTab('verification');
                        setTxFilter('All');
                      }}
                      className={`rounded-xl p-3 border shadow-sm col-span-2 md:col-span-1 flex flex-col justify-between text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none w-full ${
                        paymentSubTab === 'verification' && txFilter === 'All'
                          ? 'bg-slate-50 border-slate-400 ring-1 ring-slate-400'
                          : 'bg-white border-slate-200 hover:border-slate-350'
                      }`}
                    >
                      <div className="flex justify-between items-center text-slate-500 w-full">
                        <span className="text-[10px] font-bold uppercase tracking-wider">মোট ট্রানজেকশন</span>
                        <Activity className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="mt-2">
                        <span className="text-lg md:text-xl font-black text-slate-800">{transactions.length}</span>
                        <p className="text-[9px] text-slate-400 mt-0.5">সর্বমোট আবেদন সংখ্যা</p>
                      </div>
                    </button>
                  </div>

                  {/* Sub-Navigation for Payments Section */}
                  <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-xs gap-1">
                    <button
                      onClick={() => setPaymentSubTab('verification')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
                        paymentSubTab === 'verification'
                          ? 'bg-indigo-50 text-indigo-600 shadow-2xs border border-indigo-100'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      পেমেন্ট যাচাইকরণ ও ইতিহাস
                    </button>
                    <button
                      onClick={() => setPaymentSubTab('methods')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
                        paymentSubTab === 'methods'
                          ? 'bg-indigo-50 text-indigo-600 shadow-2xs border border-indigo-100'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      পেমেন্ট মেথড সেটিংস (বাংলাদেশ)
                    </button>
                    <button
                      onClick={() => setPaymentSubTab('reports')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
                        paymentSubTab === 'reports'
                          ? 'bg-indigo-50 text-indigo-600 shadow-2xs border border-indigo-100'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      রাজস্ব ও ফাইন্যান্সিয়াল রিপোর্টস
                    </button>
                    <button
                      onClick={() => setPaymentSubTab('audit')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
                        paymentSubTab === 'audit'
                          ? 'bg-indigo-50 text-indigo-600 shadow-2xs border border-indigo-100'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <History className="w-4 h-4" />
                      পেমেন্ট অডিট লগ
                    </button>
                  </div>

                  {/* SUB-TAB 1: VERIFICATION & TRACKING */}
                  {paymentSubTab === 'verification' && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-800">পেমেন্ট ভেরিফিকেশন সিস্টেম</h3>
                          <p className="text-[10.5px] text-slate-400 mt-0.5">ম্যানুয়াল বিকাশ, নগদ, রকেট, ব্যাংক পেমেন্ট রিকোয়েস্ট পর্যালোচনা করুন</p>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <span className="text-xs text-slate-500 whitespace-nowrap">ফিল্টার:</span>
                          <select
                            value={txFilter}
                            onChange={(e) => setTxFilter(e.target.value as any)}
                            className="bg-white border border-slate-200 text-xs rounded-lg py-1 px-2.5 text-slate-700 outline-none focus:border-indigo-500"
                          >
                            <option value="All">সর্বমোট ({transactions.length})</option>
                            <option value="Pending">পেন্ডিং ({transactions.filter(t=>t.status === 'Pending').length})</option>
                            <option value="Under Review">যাচাইধীন ({transactions.filter(t=>t.status === 'Under Review').length})</option>
                            <option value="Verified">অনুমোদিত ({transactions.filter(t=>t.status === 'Approved').length})</option>
                            <option value="Rejected">নাকচকৃত ({transactions.filter(t=>t.status === 'Rejected').length})</option>
                            <option value="Correction Requested">সংশোধন আবশ্যক ({transactions.filter(t=>t.status === 'Correction Requested').length})</option>
                            <option value="Refunded">রিফান্ডেড ({transactions.filter(t=>t.status === 'Refunded').length})</option>
                          </select>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-150">
                              <th className="p-3">কোম্পানি / আবেদনকারী</th>
                              <th className="p-3">টাকার পরিমাণ</th>
                              <th className="p-3">পেমেন্ট মেথড</th>
                              <th className="p-3">ট্রানজেকশন ID</th>
                              <th className="p-3">তারিখ ও সময়</th>
                              <th className="p-3">স্ট্যাটাস</th>
                              <th className="p-3 text-right">পদক্ষেপ</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {transactions
                              .filter(tx => {
                                if (txFilter === 'All') return true;
                                if (txFilter === 'Verified') return tx.status === 'Approved';
                                return tx.status === txFilter;
                              })
                              .map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50/30">
                                  <td className="p-3">
                                    <div>
                                      <span className="font-semibold text-slate-800 text-[12px]">{tx.companyName || tx.applicantName || 'সাধারণ ব্যবহারকারী'}</span>
                                      {tx.jobTitle && <p className="text-[10px] text-slate-400">পদবী: {tx.jobTitle}</p>}
                                      {tx.employerName && <p className="text-[10px] text-slate-400">রিক্রুটার: {tx.employerName}</p>}
                                    </div>
                                  </td>
                                  <td className="p-3 font-bold text-slate-900 text-[12px]">৳{tx.amount.toLocaleString()}</td>
                                  <td className="p-3">
                                    <span className="font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-sm uppercase tracking-wider text-[10px]">
                                      {tx.method}
                                    </span>
                                  </td>
                                  <td className="p-3 font-mono font-medium text-slate-600">{tx.txID}</td>
                                  <td className="p-3 text-slate-500 text-[11px]">{tx.date || '২০২৬-০৭-০৩ ১১:০০'}</td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] inline-block ${
                                      tx.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                      tx.status === 'Pending' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                                      tx.status === 'Under Review' ? 'bg-purple-100 text-purple-700' :
                                      tx.status === 'Correction Requested' ? 'bg-orange-100 text-orange-700' :
                                      tx.status === 'Refunded' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                                    }`}>
                                      {tx.status === 'Approved' ? 'অনুমোদিত' :
                                       tx.status === 'Pending' ? 'পেন্ডিং' :
                                       tx.status === 'Under Review' ? 'যাচাইধীন' :
                                       tx.status === 'Correction Requested' ? 'সংশোধন আবশ্যক' :
                                       tx.status === 'Refunded' ? 'রিফান্ডেড' : 'নাকচকৃত'}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <button
                                      onClick={() => {
                                        setSelectedTxForDetail(tx);
                                        setVerificationRemarks(tx.remarks || '');
                                      }}
                                      className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-md text-[11px] font-bold transition inline-flex items-center gap-1"
                                    >
                                      <Eye className="w-3 h-3" />
                                      রিভিউ ও যাচাই
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            {transactions.filter(tx => txFilter === 'All' ? true : txFilter === 'Verified' ? tx.status === 'Approved' : tx.status === txFilter).length === 0 && (
                              <tr>
                                <td colSpan={7} className="text-center py-8 text-slate-400 font-bold">
                                  কোনো পেমেন্ট রেকর্ড খুঁজে পাওয়া যায়নি।
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 2: PAYMENT METHOD SETTINGS */}
                  {paymentSubTab === 'methods' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
                          <div>
                            <h3 className="text-xs font-black text-slate-800">পেমেন্ট মেথড গেটওয়ে সেটিংস</h3>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">বাংলাদেশি মোবাইল ব্যাংকিং, এপিআই গেটওয়ে এবং অফলাইন ব্যাংক পেমেন্ট চ্যানেল কনফিগার করুন</p>
                          </div>
                          {activeStaff.role === 'Super Admin' && (
                            <button
                              onClick={() => {
                                setNewMethodData({
                                  name: '',
                                  type: 'manual',
                                  status: 'Enabled',
                                  accountType: 'Personal',
                                  accountNumber: '',
                                  accountHolderName: '',
                                  paymentInstructions: ''
                                });
                                setShowAddMethodModal(true);
                              }}
                              className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              নতুন মেথড যোগ করুন
                            </button>
                          )}
                        </div>

                        {activeStaff.role !== 'Super Admin' && (
                          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] flex items-start gap-2">
                            <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                            <div>
                              <span className="font-bold">সতর্কতা:</span> আপনি শুধুমাত্র পেমেন্ট কনফিগারেশন দেখতে পারবেন। পরিবর্তন বা নতুন পেমেন্ট মেথড নিষ্ক্রিয় করার ক্ষমতা শুধুমাত্র <span className="underline font-bold">সুপার এডমিনের</span> রয়েছে।
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {paymentMethods.map((method) => (
                            <div key={method.id} className={`border rounded-xl p-4 transition ${method.status === 'Enabled' ? 'border-indigo-100 bg-indigo-50/10' : 'border-slate-200 bg-slate-50/50 grayscale opacity-75'}`}>
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-black text-indigo-700">
                                    {method.name.charAt(0)}
                                  </div>
                                  <div>
                                    <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                                      {method.name}
                                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-sm ${method.type === 'api' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {method.type === 'api' ? 'স্বয়ংক্রিয় API' : 'ম্যানুয়াল পেমেন্ট'}
                                      </span>
                                    </h4>
                                    <p className="text-[10px] text-slate-400">{method.type === 'manual' ? `${method.accountType} - ${method.accountNumber || 'ব্যাংক তথ্য'}` : 'স্বয়ংক্রিয় এপিআই ইন্টিগ্রেশন চ্যানেল'}</p>
                                  </div>
                                </div>
                                <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${method.status === 'Enabled' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                  {method.status === 'Enabled' ? 'চলতি' : 'বন্ধ'}
                                </span>
                              </div>

                              <div className="mt-3 text-[11px] text-slate-600 line-clamp-2 bg-white/60 p-2 rounded-lg border border-slate-100">
                                <span className="font-bold">নির্দেশনা: </span>{method.paymentInstructions || 'গ্রাহকদের জন্য কোনো নির্দেশনা উল্লেখ করা নেই।'}
                              </div>

                              {method.type === 'api' && method.apiEnabled && (
                                <div className="mt-2 text-[9.5px] text-purple-700 font-semibold bg-purple-50/50 p-1.5 rounded-lg border border-purple-100 flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                  <span>এপিআই গেটওয়ে সক্রিয় আছে (Sandbox {method.sandboxMode ? 'চালু' : 'বন্ধ'})</span>
                                </div>
                              )}

                              <div className="mt-4 flex justify-between items-center">
                                <span className="text-[10px] text-slate-400">শেষ পরিবর্তন: ২৬ জুলাই, ২০২৬</span>
                                <button
                                  onClick={() => {
                                    setActiveEditMethodId(method.id);
                                    setEditingMethodData({ ...method });
                                  }}
                                  className="py-1 px-2.5 text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg transition font-bold flex items-center gap-1 shadow-2xs"
                                >
                                  ⚙ পরিবর্তন করুন
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 3: REVENUE & FINANCE REPORTS */}
                  {paymentSubTab === 'reports' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex justify-between items-center flex-wrap gap-3 border-b border-slate-100 pb-3 mb-4">
                          <div>
                            <h3 className="text-xs font-black text-slate-800">রাজস্ব ও ফাইন্যান্সিয়াল রিপোর্টস</h3>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">প্রবাসী জবস পোর্টালের সম্পূর্ণ রাজস্ব উপার্জনের নিখুঁত স্ট্যাটিস্টিকস</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">সময়সীমা:</span>
                            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
                                <button
                                  key={period}
                                  onClick={() => setReportPeriod(period)}
                                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition capitalize ${
                                    reportPeriod === period ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-500 hover:text-slate-700'
                                  }`}
                                >
                                  {period === 'daily' ? 'আজ' : period === 'weekly' ? 'সপ্তাহ' : period === 'monthly' ? 'মাস' : 'বছর'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Analytic report layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-4">
                            <h4 className="text-xs font-extrabold text-slate-700">চ্যানেল ভিত্তিক রাজস্ব বন্টন (Revenue Distribution)</h4>
                            <div className="space-y-3">
                              {/* Calculate revenues for channels */}
                              {['bKash', 'Nagad', 'Rocket', 'Bank Transfer', 'SSLCommerz'].map((channel) => {
                                const sum = transactions
                                  .filter(t => t.status === 'Approved' && t.method.toLowerCase().includes(channel.toLowerCase()))
                                  .reduce((s, t) => s + t.amount, 0);
                                const total = transactions.filter(t => t.status === 'Approved').reduce((s, t) => s + t.amount, 0) || 1;
                                const percentage = Math.round((sum / total) * 100);
                                return (
                                  <div key={channel} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="font-semibold text-slate-700">{channel}</span>
                                      <span className="font-bold text-slate-900">৳{sum.toLocaleString()} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                      <div
                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage || 2}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs font-black text-slate-700 mb-3">ফাইন্যান্সিয়াল অডিট ওভারভিউ</h4>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                                  <span className="text-slate-500">গড় পেমেন্ট সাইজ:</span>
                                  <span className="font-bold text-slate-800">
                                    ৳{Math.round(
                                      (transactions.filter(t => t.status === 'Approved').reduce((s, t) => s + t.amount, 0) /
                                      (transactions.filter(t => t.status === 'Approved').length || 1))
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                                  <span className="text-slate-500">অটোমেটিক এপিআই গেটওয়ে:</span>
                                  <span className="font-bold text-emerald-600">১টি সচল</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                                  <span className="text-slate-500">যাচাইয়ের গড় সময়:</span>
                                  <span className="font-bold text-slate-800">৪.৫ মিনিট</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">রিফান্ড অনুপাত:</span>
                                  <span className="font-bold text-rose-600">০.০% (০টি)</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col gap-2">
                              <button
                                onClick={() => {
                                  // Excel report generator
                                  const headers = "Transaction ID,Company,Method,Amount,Status,Date,Remarks\n";
                                  const csvRows = transactions.map(t => 
                                    `"${t.txID}","${t.companyName || t.applicantName || 'Seeker'}","${t.method}",${t.amount},"${t.status}","${t.date || ''}","${(t.remarks || '').replace(/"/g, '""')}"`
                                  ).join("\n");
                                  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(headers + csvRows);
                                  const link = document.createElement("a");
                                  link.setAttribute("href", csvContent);
                                  link.setAttribute("download", `Probashi_Revenue_Report_${reportPeriod}.csv`);
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  addLog(activeStaff.name, `রাজস্ব রিপোর্ট ডাউনলোড করেছেন (${reportPeriod})`, 'success');
                                  alert('পেমেন্ট ও রাজস্ব রিপোর্ট CSV ফরম্যাটে সফলভাবে ডাউনলোড করা হয়েছে!');
                                }}
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-sm"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                                এক্সেল রিপোর্ট (.CSV) ডাউনলোড
                              </button>

                              <button
                                onClick={() => {
                                  alert('রাজস্ব রিপোর্ট এর পিডিএফ কপি প্রস্তুত করা হচ্ছে... আপনার ব্রাউজার প্রিন্ট ডায়ালগে নিয়ে যাওয়া হচ্ছে।');
                                  window.print();
                                }}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1"
                              >
                                <Download className="w-3.5 h-3.5" />
                                পিডিএফ রিপোর্ট ডাউনলোড করুন
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 4: SYSTEM AUDIT LOG */}
                  {paymentSubTab === 'audit' && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-xs font-black text-slate-800">পেমেন্ট মেথড অডিট ট্রেইল</h3>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">নিরাপত্তা ও স্বচ্ছতা নিশ্চিত করতে মেথড বা এপিআই-তে সুপার এডমিনের যেকোনো পরিবর্তনের বিবরণ দেখুন</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-150">
                              <th className="p-3">ইউজার / এডমিন</th>
                              <th className="p-3">পেমেন্ট মেথড</th>
                              <th className="p-3">পরিবর্তনের ধরণ</th>
                              <th className="p-3">পূর্ববর্তী মান</th>
                              <th className="p-3">নতুন মান</th>
                              <th className="p-3">তারিখ ও সময়</th>
                              <th className="p-3">আইপি অ্যাড্রেস</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {paymentAuditLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50/30 font-mono text-[10.5px]">
                                <td className="p-3 font-sans font-semibold text-slate-800 text-xs">{log.user}</td>
                                <td className="p-3 font-sans font-bold text-indigo-600">{log.methodName}</td>
                                <td className="p-3 font-sans text-slate-700">{log.changeType}</td>
                                <td className="p-3 text-rose-600 line-through max-w-[120px] truncate" title={log.oldValue}>{log.oldValue}</td>
                                <td className="p-3 text-emerald-600 font-bold max-w-[120px] truncate" title={log.newValue}>{log.newValue}</td>
                                <td className="p-3 font-sans text-slate-500">{log.date}</td>
                                <td className="p-3 text-indigo-500">{log.ipAddress}</td>
                              </tr>
                            ))}
                            {paymentAuditLogs.length === 0 && (
                              <tr>
                                <td colSpan={7} className="text-center py-6 text-slate-400 font-bold font-sans">
                                  এখনও কোনো অডিট লগ নিবন্ধিত হয়নি।
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* MODAL: VERIFICATION & REVIEW TIMELINE */}
                  {selectedTxForDetail && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-150 max-w-lg w-full overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                          <h3 className="text-xs font-black text-slate-800">পেমেন্ট ট্রানজেকশন যাচাই (# {selectedTxForDetail.txID})</h3>
                          <button
                            onClick={() => setSelectedTxForDetail(null)}
                            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
                          {/* Payment Receipt / Card Mockup */}
                          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-xl p-4 shadow-md space-y-3 relative overflow-hidden">
                            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
                              <Landmark className="w-48 h-48" />
                            </div>
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-indigo-200">প্রবাসী পেমেন্ট ক্লিয়ারেন্স</span>
                                <h4 className="font-bold text-sm text-indigo-100">{selectedTxForDetail.companyName || selectedTxForDetail.applicantName || 'আরিফুল ইসলাম'}</h4>
                              </div>
                              <span className="text-lg font-black text-emerald-400">৳{selectedTxForDetail.amount.toLocaleString()}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                              <div>
                                <span className="text-[8.5px] opacity-75 block text-indigo-200">মেথড / গেটওয়ে</span>
                                <span className="font-bold uppercase tracking-wider text-[11px]">{selectedTxForDetail.method}</span>
                              </div>
                              <div>
                                <span className="text-[8.5px] opacity-75 block text-indigo-200">ট্রানজেকশন ID</span>
                                <span className="font-mono font-bold text-yellow-300 text-[11px]">{selectedTxForDetail.txID}</span>
                              </div>
                            </div>
                          </div>

                          {/* Screenshot visual mockup */}
                          {selectedTxForDetail.screenshot ? (
                            <div className="space-y-1.5">
                              <span className="text-slate-500 font-bold block">পেমেন্ট স্ক্রিনশট / প্রমাণপত্র:</span>
                              <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center justify-center relative group">
                                <img
                                  src={selectedTxForDetail.screenshot}
                                  alt="Transaction Proof"
                                  className="rounded-lg max-h-48 object-contain"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                                  <a
                                    href={selectedTxForDetail.screenshot}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-white text-slate-800 rounded-lg text-[10px] font-bold shadow-md hover:bg-slate-50 transition"
                                  >
                                    আসল ছবি দেখুন ↗
                                  </a>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="border border-indigo-100 bg-indigo-50/40 p-3 rounded-xl flex items-center gap-2 text-indigo-800">
                              <ShieldCheck className="w-4 h-4 text-indigo-500" />
                              <span>এই ট্রানজেকশনটির জন্য কোনো প্রমাণপত্র আপলোড করা হয়নি। ট্রানজেকশন আইডি দিয়ে ভেরিফাই করুন।</span>
                            </div>
                          )}

                          {/* Status History / Timeline */}
                          <div className="space-y-2">
                            <span className="text-slate-500 font-bold block">ভেরিফিকেশন স্ট্যাটাস হিস্টোরি (Timeline):</span>
                            <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-3">
                              {/* Initial Submission */}
                              <div className="flex gap-2.5 items-start">
                                <div className="w-5 h-5 bg-indigo-100 border border-indigo-200 rounded-full flex items-center justify-center text-[10px] text-indigo-700 font-bold shrink-0 mt-0.5">
                                  ১
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-extrabold text-slate-700">পেমেন্ট সাবমিশন সম্পন্ন</span>
                                    <span className="text-slate-400 font-mono">{selectedTxForDetail.date || '২০২৬-০৭-০৩ ১১:০০'}</span>
                                  </div>
                                  <p className="text-slate-500 text-[10px] mt-0.5">গ্রাহক দ্বারা ট্রানজেকশন আইডি সাবমিট করা হয়েছে।</p>
                                </div>
                              </div>

                              {/* Live History logs if any */}
                              {selectedTxForDetail.history && selectedTxForDetail.history.map((hist, index) => (
                                <div key={index} className="flex gap-2.5 items-start border-t border-slate-150 pt-2.5">
                                  <div className="w-5 h-5 bg-indigo-500 border border-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0 mt-0.5">
                                    {index + 2}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center text-[10px]">
                                      <span className="font-extrabold text-slate-800">স্ট্যাটাস পরিবর্তন: <span className="text-indigo-600">{hist.newStatus}</span></span>
                                      <span className="text-slate-400 font-mono">{hist.date}</span>
                                    </div>
                                    <p className="text-slate-500 text-[10px] mt-0.5">কার্যকারী: <span className="font-semibold text-slate-700">{hist.changedBy}</span></p>
                                    {hist.remarks && (
                                      <p className="bg-indigo-50 text-indigo-800 p-1.5 rounded-sm text-[10px] mt-1 italic">
                                        মন্তব্য: "{hist.remarks}"
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Verification Panel */}
                          <div className="border-t border-slate-100 pt-4 space-y-3">
                            <div className="space-y-1">
                              <label className="text-slate-500 font-bold block">যাচাইকরণ মন্তব্য / নোট (গ্রাহক দেখতে পাবেন):</label>
                              <textarea
                                value={verificationRemarks}
                                onChange={(e) => setVerificationRemarks(e.target.value)}
                                placeholder="উদাহরণ: পেমেন্ট সঠিক পাওয়া গেছে, চাকরিটি লাইভ করা হয়েছে / ট্রানজেকশন আইডি সঠিক নয়, সঠিক প্রমাণ সরবরাহ করুন।"
                                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 text-xs min-h-[60px]"
                              ></textarea>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2 justify-end">
                              <button
                                onClick={() => {
                                  onVerifyTransaction(selectedTxForDetail.id, 'Correction Requested', verificationRemarks);
                                  addLog(activeStaff.name, `পেমেন্ট #${selectedTxForDetail.txID} সংশোধনীর অনুরোধ পাঠিয়েছেন।`, 'warning');
                                  setSelectedTxForDetail(null);
                                  alert('সংশোধনীর অনুরোধ পাঠানো হয়েছে!');
                                }}
                                className="py-1.5 px-3 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg font-bold text-[11px] transition"
                              >
                                ⚠ সংশোধন চান
                              </button>

                              <button
                                onClick={() => {
                                  onVerifyTransaction(selectedTxForDetail.id, 'Under Review', verificationRemarks);
                                  addLog(activeStaff.name, `পেমেন্ট #${selectedTxForDetail.txID} যাচাইধীনের তালিকায় রেখেছেন।`, 'info');
                                  setSelectedTxForDetail(null);
                                }}
                                className="py-1.5 px-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg font-bold text-[11px] transition"
                              >
                                ⏳ যাচাইয়ের জন্য রাখুন
                              </button>

                              <button
                                onClick={() => {
                                  onVerifyTransaction(selectedTxForDetail.id, 'Rejected', verificationRemarks);
                                  addLog(activeStaff.name, `পেমেন্ট #${selectedTxForDetail.txID} নাকচ করেছেন।`, 'error');
                                  setSelectedTxForDetail(null);
                                  alert('পেমেন্ট ট্রানজেকশন নাকচ করা হয়েছে!');
                                }}
                                className="py-1.5 px-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold text-[11px] transition shadow-xs"
                              >
                                ✗ বাতিল করুন
                              </button>

                              <button
                                onClick={() => {
                                  onVerifyTransaction(selectedTxForDetail.id, 'Approved', verificationRemarks);
                                  addLog(activeStaff.name, `পেমেন্ট #${selectedTxForDetail.txID} অনুমোদন করেছেন।`, 'success');
                                  if (onBroadcastNotification) {
                                    onBroadcastNotification('🎉 পেমেন্ট অনুমোদিত ও ভেরিফাইড!', `আপনার পেমেন্ট সফলভাবে ভেরিফাই করা হয়েছে। ট্রানজেকশন ID: ${selectedTxForDetail.txID}`);
                                  }
                                  setSelectedTxForDetail(null);
                                  alert('পেমেন্ট সফলভাবে অনুমোদিত ও জব প্রমোট করা হয়েছে!');
                                }}
                                className="py-1.5 px-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[11px] transition shadow-xs"
                              >
                                ✓ অনুমোদন করুন
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODAL: ADD MANUAL OFFICE PAYMENT */}
                  {showAddOfficePayment && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                      <div className="bg-white rounded-3xl shadow-2xl border border-slate-150 max-w-2xl w-full overflow-hidden">
                        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                          <div>
                            <h3 className="text-sm font-black text-slate-800">🏢 নতুন ম্যানুয়াল অফিস পেমেন্ট রশিদ তৈরি করুন</h3>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">অফিসে ম্যানুয়ালি প্রাপ্ত ফি-সমূহের ডিজিটাল রশিদ এন্ট্রি করুন।</p>
                          </div>
                          <button
                            onClick={() => setShowAddOfficePayment(false)}
                            className="p-1.5 hover:bg-slate-200/70 rounded-full text-slate-400 hover:text-slate-700 transition"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                          {/* Client / Seeker Details */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
                            <h4 className="text-[11px] font-black uppercase text-indigo-600 tracking-wider">১. গ্রাহক ও সেবার বিবরণ (Customer & Service Info)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 block">গ্রাহক / আবেদনকারীর নাম <span className="text-rose-500">*</span></label>
                                <input
                                  type="text"
                                  required
                                  value={officePayName}
                                  onChange={(e) => setOfficePayName(e.target.value)}
                                  placeholder="যেমন: আরিফুল ইসলাম"
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/25 font-semibold text-slate-800"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 block">মোবাইল নম্বর <span className="text-rose-500">*</span></label>
                                <input
                                  type="text"
                                  required
                                  value={officePayPhone}
                                  onChange={(e) => setOfficePayPhone(e.target.value)}
                                  placeholder="যেমন: ০১৭XXXXXXXX"
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/25 font-mono font-bold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 block">ইমেইল এড্রেস</label>
                                <input
                                  type="email"
                                  value={officePayEmail}
                                  onChange={(e) => setOfficePayEmail(e.target.value)}
                                  placeholder="যেমন: ariful@example.com"
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/25 font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 block">এজেন্সি / কোম্পানির নাম</label>
                                <input
                                  type="text"
                                  value={officePayCompanyName}
                                  onChange={(e) => setOfficePayCompanyName(e.target.value)}
                                  placeholder="যেমন: ইউরো বাংলা ম্যানপাওয়ার সার্ভিসেস"
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/25 text-slate-700"
                                />
                              </div>
                              <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 block">প্রদেয় সেবার বিবরণ / প্যাকেজ নাম <span className="text-rose-500">*</span></label>
                                <input
                                  type="text"
                                  list="service-packages-list"
                                  required
                                  value={officePayJobTitle}
                                  onChange={(e) => setOfficePayJobTitle(e.target.value)}
                                  placeholder="যেমন: Italy Basic Processing Package (নতুন সেবার নামও টাইপ করতে পারবেন)"
                                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/25 text-slate-800 font-bold bg-white"
                                />
                                <datalist id="service-packages-list">
                                  <option value="Italy Basic Work Visa Package" />
                                  <option value="Italy Standard Work Visa Package" />
                                  <option value="Italy Premium Work Visa Package" />
                                  <option value="Company Verification Fee" />
                                  <option value="Premium Job Posting Fee" />
                                  <option value="Europe Resume & Cover Letter CV Box" />
                                  <option value="BMET Card Registration" />
                                  <option value="Medical Process Fee" />
                                  <option value="Police Clearance Attestation" />
                                </datalist>
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                  {[
                                    'Italy Basic Work Visa Package',
                                    'Italy Standard Work Visa Package',
                                    'Italy Premium Work Visa Package',
                                    'Company Verification Fee',
                                    'Premium Job Posting Fee',
                                    'Europe Resume & Cover Letter CV Box',
                                    'BMET Card Registration',
                                    'Medical Process Fee',
                                    'Police Clearance Attestation'
                                  ].map((pkgName) => (
                                    <button
                                      key={pkgName}
                                      type="button"
                                      onClick={() => setOfficePayJobTitle(pkgName)}
                                      className={`px-2 py-1 rounded-md text-[10px] font-semibold transition border ${
                                        officePayJobTitle === pkgName
                                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold shadow-2xs'
                                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                      }`}
                                    >
                                      {pkgName === 'Italy Basic Work Visa Package' ? '🇮🇹 Basic Package' :
                                       pkgName === 'Italy Standard Work Visa Package' ? '🇮🇹 Standard Package' :
                                       pkgName === 'Italy Premium Work Visa Package' ? '🇮🇹 Premium Package' :
                                       pkgName === 'Company Verification Fee' ? '🏢 Agency Verify' :
                                       pkgName === 'Premium Job Posting Fee' ? '💼 Job Post Fee' :
                                       pkgName === 'Europe Resume & Cover Letter CV Box' ? '📄 CV/Resume' :
                                       pkgName === 'BMET Card Registration' ? '💳 BMET Reg' :
                                       pkgName === 'Medical Process Fee' ? '🏥 Medical Fee' : '🚓 Police Clearance'}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Payment / Receipt Details */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
                            <h4 className="text-[11px] font-black uppercase text-emerald-600 tracking-wider">২. পেমেন্ট ও রশিদ তথ্য (Payment & Receipt Info)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 block">ম্যানুয়াল রশিদ নম্বর <span className="text-rose-500">*</span></label>
                                <input
                                  type="text"
                                  required
                                  value={officePayReceipt}
                                  onChange={(e) => setOfficePayReceipt(e.target.value)}
                                  placeholder="যেমন: REC-482932"
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/25 font-mono font-bold text-slate-800"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 block">টাকার পরিমাণ (টাকায়) <span className="text-rose-500">*</span></label>
                                <input
                                  type="number"
                                  required
                                  value={officePayAmount}
                                  onChange={(e) => setOfficePayAmount(e.target.value)}
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/25 font-black text-emerald-700"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 block">পেমেন্ট মাধ্যম</label>
                                <select
                                  value={officePayMethod}
                                  onChange={(e) => setOfficePayMethod(e.target.value as any)}
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/25 font-bold text-slate-700"
                                >
                                  <option value="Cash">💵 Cash (নগদ টাকা)</option>
                                  <option value="bKash">📱 bKash (বিকাশ ম্যানুয়াল)</option>
                                  <option value="Nagad">📱 Nagad (নগদ ম্যানুয়াল)</option>
                                  <option value="Bank">🏦 Bank Transfer (ব্যাংক জমা)</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 block">অফিস শাখা <span className="text-rose-500">*</span></label>
                                <select
                                  value={officePayBranch}
                                  onChange={(e) => setOfficePayBranch(e.target.value)}
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/25 font-semibold text-slate-700"
                                >
                                  <option value="Dhaka Main Branch">ঢাকা প্রধান কার্যালয় (Dhaka Main)</option>
                                  <option value="Chittagong Regional Branch">চট্টগ্রাম শাখা (Chittagong)</option>
                                  <option value="Sylhet Desk Branch">সিলেট ডেস্ক শাখা (Sylhet)</option>
                                  <option value="Barisal Office Unit">বরিশাল শাখা (Barisal)</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 block">গ্রহণের তারিখ</label>
                                <input
                                  type="date"
                                  value={officePayDate}
                                  onChange={(e) => setOfficePayDate(e.target.value)}
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/25 font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 block">রসিদ ফাইল/স্ক্যান কপি (ঐচ্ছিক)</label>
                                <input
                                  type="text"
                                  value={officePayScreenshot}
                                  onChange={(e) => setOfficePayScreenshot(e.target.value)}
                                  placeholder="রশিদ ফাইলের লিঙ্ক"
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/25 font-mono text-slate-400"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 block">অতিরিক্ত মন্তব্য / ভেরিফিকেশন নোট</label>
                            <textarea
                              value={officePayRemarks}
                              onChange={(e) => setOfficePayRemarks(e.target.value)}
                              rows={2}
                              placeholder="যেমন: দ্বিতীয় কিস্তির পাসপোর্ট প্রসেসিং ফি বাবদ নগদ প্রাপ্তি।"
                              className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/25 text-slate-650"
                            />
                          </div>
                        </div>

                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => setShowAddOfficePayment(false)}
                            className="py-2 px-4 border border-slate-250 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition"
                          >
                            বাতিল করুন
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!officePayName || !officePayPhone || !officePayReceipt || !officePayAmount) {
                                alert('দয়া করে সব আবশ্যক (*) তথ্য পূরণ করুন!');
                                return;
                              }

                              const newTx: Transaction = {
                                id: 'tx-' + Date.now(),
                                companyName: officePayCompanyName || 'N/A',
                                planName: officePayJobTitle || 'সার্ভিস ফি',
                                amount: parseFloat(officePayAmount) || 0,
                                method: officePayMethod,
                                txID: officePayReceipt,
                                status: 'Approved',
                                date: officePayDate + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5),
                                applicantName: officePayName,
                                employerName: officePayCompanyName || undefined,
                                jobTitle: officePayJobTitle || undefined,
                                remarks: officePayRemarks || 'অফিস ম্যানুয়াল পেমেন্ট সফলভাবে এন্ট্রি সম্পন্ন হয়েছে।',
                                paymentType: 'Office',
                                receiptNumber: officePayReceipt,
                                staffName: activeStaff.name,
                                officeBranch: officePayBranch,
                                isArchived: false,
                                history: [
                                  {
                                    changedBy: activeStaff.name,
                                    oldStatus: 'Pending',
                                    newStatus: 'Approved',
                                    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                                    remarks: 'ম্যানুয়াল অফিস পেমেন্ট সরাসরি অনুমোদিত করা হয়েছে।'
                                  }
                                ]
                              };

                              if (onAddTransaction) {
                                onAddTransaction(newTx);
                                addLog(activeStaff.name, `নতুন অফিস পেমেন্ট রশিদ #${officePayReceipt} যুক্ত করেছেন।`, 'success');
                                alert('ম্যানুয়াল অফিস পেমেন্ট রশিদ সফলভাবে যুক্ত এবং স্বয়ংক্রিয়ভাবে অনুমোদিত করা হয়েছে!');
                                setShowAddOfficePayment(false);
                              } else {
                                alert('পেমেন্ট সেভার ইন্টিগ্রেশন পাওয়া যায়নি।');
                              }
                            }}
                            className="py-2 px-5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                          >
                            💾 রশিদ সংরক্ষণ ও অনুমোদন করুন
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODAL: GATEWAY CONFIGURATION EDIT (SUPER ADMIN ONLY) */}
                  {activeEditMethodId && editingMethodData && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-150 max-w-lg w-full overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                          <h3 className="text-xs font-black text-slate-800">গেটওয়ে কনফিগারেশন সংশোধন ({editingMethodData.name})</h3>
                          <button
                            onClick={() => {
                              setActiveEditMethodId(null);
                              setEditingMethodData(null);
                            }}
                            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
                          {activeStaff.role !== 'Super Admin' && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-bold mb-2">
                              সতর্কতা: আপনার এই সেটিংস সংরক্ষণ করার অনুমতি নেই! আপনি শুধুমাত্র দেখতে পারবেন।
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-slate-500 font-bold block mb-1">গেটওয়ে নাম:</label>
                              <input
                                type="text"
                                value={editingMethodData.name}
                                onChange={(e) => setEditingMethodData({ ...editingMethodData, name: e.target.value })}
                                disabled={activeStaff.role !== 'Super Admin'}
                                className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="text-slate-500 font-bold block mb-1">স্ট্যাটাস:</label>
                              <select
                                value={editingMethodData.status}
                                onChange={(e) => setEditingMethodData({ ...editingMethodData, status: e.target.value as any })}
                                disabled={activeStaff.role !== 'Super Admin'}
                                className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
                              >
                                <option value="Enabled">চলতি (Enabled)</option>
                                <option value="Disabled">বন্ধ (Disabled)</option>
                              </select>
                            </div>
                          </div>

                          {editingMethodData.type === 'manual' ? (
                            <div className="space-y-3">
                              {/* Manual Bank / mobile banking settings */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-slate-500 font-bold block mb-1">হিসাবের ধরণ (Account Type):</label>
                                  <select
                                    value={editingMethodData.accountType}
                                    onChange={(e) => setEditingMethodData({ ...editingMethodData, accountType: e.target.value as any })}
                                    disabled={activeStaff.role !== 'Super Admin'}
                                    className="w-full border border-slate-200 rounded-lg p-2 outline-none"
                                  >
                                    <option value="Personal">পার্সোনাল (Personal)</option>
                                    <option value="Merchant">মার্চেন্ট (Merchant)</option>
                                    <option value="Agent">এজেন্ট (Agent)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-slate-500 font-bold block mb-1">অ্যাকাউন্ট / মোবাইল নম্বর:</label>
                                  <input
                                    type="text"
                                    value={editingMethodData.accountNumber || ''}
                                    onChange={(e) => setEditingMethodData({ ...editingMethodData, accountNumber: e.target.value })}
                                    disabled={activeStaff.role !== 'Super Admin'}
                                    className="w-full border border-slate-200 rounded-lg p-2 outline-none"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-slate-500 font-bold block mb-1">হিসাবধারীর নাম (Account Holder Name):</label>
                                <input
                                  type="text"
                                  value={editingMethodData.accountHolderName || ''}
                                  onChange={(e) => setEditingMethodData({ ...editingMethodData, accountHolderName: e.target.value })}
                                  disabled={activeStaff.role !== 'Super Admin'}
                                  className="w-full border border-slate-200 rounded-lg p-2 outline-none"
                                />
                              </div>

                              {editingMethodData.id === 'bank' && (
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                  <span className="font-black text-slate-700 block text-[10px] uppercase">ব্যাংক ডিটেইলস</span>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-slate-400 font-bold block mb-0.5 text-[9.5px]">শাখার নাম (Branch):</label>
                                      <input
                                        type="text"
                                        value={editingMethodData.branchName || ''}
                                        onChange={(e) => setEditingMethodData({ ...editingMethodData, branchName: e.target.value })}
                                        disabled={activeStaff.role !== 'Super Admin'}
                                        className="w-full border border-slate-200 rounded-lg p-1.5 text-[11px] bg-white outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-400 font-bold block mb-0.5 text-[9.5px]">রাউটিং নম্বর:</label>
                                      <input
                                        type="text"
                                        value={editingMethodData.routingNumber || ''}
                                        onChange={(e) => setEditingMethodData({ ...editingMethodData, routingNumber: e.target.value })}
                                        disabled={activeStaff.role !== 'Super Admin'}
                                        className="w-full border border-slate-200 rounded-lg p-1.5 text-[11px] bg-white outline-none"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-slate-400 font-bold block mb-0.5 text-[9.5px]">সুইফট কোড (Swift Code):</label>
                                    <input
                                      type="text"
                                      value={editingMethodData.swiftCode || ''}
                                      onChange={(e) => setEditingMethodData({ ...editingMethodData, swiftCode: e.target.value })}
                                      disabled={activeStaff.role !== 'Super Admin'}
                                      className="w-full border border-slate-200 rounded-lg p-1.5 text-[11px] bg-white outline-none"
                                    />
                                  </div>
                                </div>
                              )}

                              <div>
                                <label className="text-slate-500 font-bold block mb-1">কিউআর কোড (QR Code URL):</label>
                                <input
                                  type="text"
                                  value={editingMethodData.qrCodeUrl || ''}
                                  onChange={(e) => setEditingMethodData({ ...editingMethodData, qrCodeUrl: e.target.value })}
                                  placeholder="https://example.com/bkash_qr.png"
                                  disabled={activeStaff.role !== 'Super Admin'}
                                  className="w-full border border-slate-200 rounded-lg p-2 outline-none text-[11px]"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 bg-purple-50/20 p-3.5 border border-purple-100 rounded-xl">
                              <span className="font-extrabold text-purple-800 block text-[10.5px]">স্বয়ংক্রিয় API গেটওয়ে প্যারামিটারস</span>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-1.5 mt-2 col-span-2">
                                  <input
                                    type="checkbox"
                                    id="apiEnabled"
                                    checked={editingMethodData.apiEnabled || false}
                                    onChange={(e) => setEditingMethodData({ ...editingMethodData, apiEnabled: e.target.checked })}
                                    disabled={activeStaff.role !== 'Super Admin'}
                                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                  />
                                  <label htmlFor="apiEnabled" className="font-bold text-slate-700">অনলাইন API গেটওয়ে চালু করুন</label>
                                </div>
                                <div className="flex items-center gap-1.5 mt-2 col-span-2">
                                  <input
                                    type="checkbox"
                                    id="sandboxMode"
                                    checked={editingMethodData.sandboxMode || false}
                                    onChange={(e) => setEditingMethodData({ ...editingMethodData, sandboxMode: e.target.checked })}
                                    disabled={activeStaff.role !== 'Super Admin'}
                                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                  />
                                  <label htmlFor="sandboxMode" className="font-bold text-slate-700">স্যালন্ডবক্স / টেস্ট মোড (Sandbox Mode)</label>
                                </div>
                              </div>

                              <div className="space-y-3 mt-3">
                                <div>
                                  <label className="text-slate-500 font-bold block mb-1">এপিআই কী (API Key / Client ID):</label>
                                  <input
                                    type="password"
                                    value={editingMethodData.apiKey || ''}
                                    onChange={(e) => setEditingMethodData({ ...editingMethodData, apiKey: e.target.value })}
                                    disabled={activeStaff.role !== 'Super Admin'}
                                    className="w-full border border-slate-200 rounded-lg p-2 font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="text-slate-500 font-bold block mb-1">এপিআই সিক্রেট (API Secret / Password):</label>
                                  <input
                                    type="password"
                                    value={editingMethodData.apiSecret || ''}
                                    onChange={(e) => setEditingMethodData({ ...editingMethodData, apiSecret: e.target.value })}
                                    disabled={activeStaff.role !== 'Super Admin'}
                                    className="w-full border border-slate-200 rounded-lg p-2 font-mono"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-slate-500 font-bold block mb-1">মার্চেন্ট ID:</label>
                                    <input
                                      type="text"
                                      value={editingMethodData.merchantId || ''}
                                      onChange={(e) => setEditingMethodData({ ...editingMethodData, merchantId: e.target.value })}
                                      disabled={activeStaff.role !== 'Super Admin'}
                                      className="w-full border border-slate-200 rounded-lg p-2"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-slate-500 font-bold block mb-1">স্টোর ID (যদি থাকে):</label>
                                    <input
                                      type="text"
                                      value={editingMethodData.storeId || ''}
                                      onChange={(e) => setEditingMethodData({ ...editingMethodData, storeId: e.target.value })}
                                      disabled={activeStaff.role !== 'Super Admin'}
                                      className="w-full border border-slate-200 rounded-lg p-2"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-slate-500 font-bold block mb-1">ইনস্ট্যান্ট আইপিএন কলব্যাক URL:</label>
                                  <input
                                    type="text"
                                    value={editingMethodData.callbackUrl || ''}
                                    onChange={(e) => setEditingMethodData({ ...editingMethodData, callbackUrl: e.target.value })}
                                    disabled={activeStaff.role !== 'Super Admin'}
                                    className="w-full border border-slate-200 rounded-lg p-2 font-mono text-[10px]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="text-slate-500 font-bold block mb-1">গ্রাহকের পেমেন্ট নির্দেশনাবলী (Instructions):</label>
                            <textarea
                              value={editingMethodData.paymentInstructions || ''}
                              onChange={(e) => setEditingMethodData({ ...editingMethodData, paymentInstructions: e.target.value })}
                              rows={3}
                              disabled={activeStaff.role !== 'Super Admin'}
                              placeholder="বিকাশ অ্যাপে কিভাবে পে করতে হবে তা এখানে লিখুন..."
                              className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
                            ></textarea>
                          </div>

                          {activeStaff.role === 'Super Admin' && (
                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveEditMethodId(null);
                                  setEditingMethodData(null);
                                }}
                                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                              >
                                বাতিল
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!onUpdatePaymentMethods) return;
                                  // Locate original method
                                  const original = paymentMethods.find(p => p.id === editingMethodData.id);
                                  if (!original) return;

                                  // Track differences for audit log
                                  let changeType: 'Status Change' | 'Number Change' | 'API Key Change' | 'QR Code Change' | 'General Edit' | 'Method Added' | 'Method Deleted' = 'General Edit';
                                  let oldVal = '';
                                  let newVal = '';

                                  if (original.accountNumber !== editingMethodData.accountNumber) {
                                    changeType = 'Number Change';
                                    oldVal = original.accountNumber || 'None';
                                    newVal = editingMethodData.accountNumber || 'None';
                                  } else if (original.status !== editingMethodData.status) {
                                    changeType = 'Status Change';
                                    oldVal = original.status;
                                    newVal = editingMethodData.status;
                                  } else if (original.apiEnabled !== editingMethodData.apiEnabled) {
                                    changeType = 'API Key Change';
                                    oldVal = original.apiEnabled ? 'Enabled' : 'Disabled';
                                    newVal = editingMethodData.apiEnabled ? 'Enabled' : 'Disabled';
                                  } else {
                                    oldVal = 'পূর্বের প্যারামিটারস';
                                    newVal = 'সংশোধিত গেটওয়ে প্রপার্টিজ';
                                  }

                                  const updated = paymentMethods.map(p => p.id === editingMethodData.id ? editingMethodData : p);
                                  
                                  const auditLog: PaymentAuditLog = {
                                    id: 'log_' + Date.now(),
                                    user: `${activeStaff.name} (${activeStaff.role})`,
                                    methodId: editingMethodData.id,
                                    methodName: editingMethodData.name,
                                    changeType,
                                    oldValue: oldVal,
                                    newValue: newVal,
                                    date: new Date().toLocaleString('bn-BD', { hour12: true }),
                                    ipAddress: '103.88.22.' + Math.floor(Math.random() * 254 + 1)
                                  };

                                  onUpdatePaymentMethods(updated, auditLog);
                                  addLog(activeStaff.name, `${editingMethodData.name} এর পেমেন্ট কনফিগারেশন সংশোধন করেছেন।`, 'warning');
                                  setActiveEditMethodId(null);
                                  setEditingMethodData(null);
                                  alert('পেমেন্ট গেটওয়ে কনফিগারেশন সফলভাবে আপডেট করা হয়েছে এবং সিস্টেমে লিপিবদ্ধ করা হয়েছে!');
                                }}
                                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs"
                              >
                                সংরক্ষণ করুন
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODAL: ADD CUSTOM PAYMENT METHOD (SUPER ADMIN ONLY) */}
                  {showAddMethodModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-150 max-w-lg w-full overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                          <h3 className="text-xs font-black text-slate-800">নতুন কাস্টম পেমেন্ট মেথড তৈরি</h3>
                          <button
                            onClick={() => setShowAddMethodModal(false)}
                            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-slate-500 font-bold block mb-1">পেমেন্ট মেথডের নাম:</label>
                              <input
                                type="text"
                                placeholder="যেমন: Rocket, Upay, Trust Bank"
                                value={newMethodData.name || ''}
                                onChange={(e) => setNewMethodData({ ...newMethodData, name: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="text-slate-500 font-bold block mb-1">মেথড টাইপ:</label>
                              <select
                                value={newMethodData.type}
                                onChange={(e) => setNewMethodData({ ...newMethodData, type: e.target.value as any })}
                                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
                              >
                                <option value="manual">ম্যানুয়াল পেমেন্ট (Manual)</option>
                                <option value="api">স্বয়ংক্রিয় এপিআই গেটওয়ে (API)</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-slate-500 font-bold block mb-1">হিসাবের ধরণ (Account Type):</label>
                              <select
                                value={newMethodData.accountType}
                                onChange={(e) => setNewMethodData({ ...newMethodData, accountType: e.target.value as any })}
                                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
                              >
                                <option value="Personal">পার্সোনাল</option>
                                <option value="Merchant">মার্চেন্ট</option>
                                <option value="Agent">এজেন্ট</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-slate-500 font-bold block mb-1">মোবাইল / অ্যাকাউন্ট নম্বর:</label>
                              <input
                                type="text"
                                placeholder="যেমন: ০১৯১২৩৪৫৬৭৮"
                                value={newMethodData.accountNumber || ''}
                                onChange={(e) => setNewMethodData({ ...newMethodData, accountNumber: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg p-2"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-slate-500 font-bold block mb-1">হিসাবধারীর নাম (Account Holder Name):</label>
                            <input
                              type="text"
                              placeholder="যেমন: Probashi Jobs Portal Ltd"
                              value={newMethodData.accountHolderName || ''}
                              onChange={(e) => setNewMethodData({ ...newMethodData, accountHolderName: e.target.value })}
                              className="w-full border border-slate-200 rounded-lg p-2"
                            />
                          </div>

                          <div>
                            <label className="text-slate-500 font-bold block mb-1">পেমেন্ট করার নির্দেশনাবলী:</label>
                            <textarea
                              placeholder="পেমেন্ট করার নিয়মাবলী ও ট্রানজেকশন ক্লিয়ারেন্স সংক্রান্ত তথ্য প্রদান করুন।"
                              value={newMethodData.paymentInstructions || ''}
                              onChange={(e) => setNewMethodData({ ...newMethodData, paymentInstructions: e.target.value })}
                              rows={3}
                              className="w-full border border-slate-200 rounded-lg p-2 outline-none"
                            ></textarea>
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setShowAddMethodModal(false)}
                              className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                            >
                              বাতিল
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!newMethodData.name) {
                                  alert('দয়া করে মেথডের নাম উল্লেখ করুন!');
                                  return;
                                }
                                if (!onUpdatePaymentMethods) return;

                                const generatedId = newMethodData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                                const methodObj: PaymentMethodSetting = {
                                  id: generatedId,
                                  name: newMethodData.name,
                                  type: newMethodData.type || 'manual',
                                  status: 'Enabled',
                                  accountType: newMethodData.accountType || 'Personal',
                                  accountNumber: newMethodData.accountNumber || '',
                                  accountHolderName: newMethodData.accountHolderName || '',
                                  paymentInstructions: newMethodData.paymentInstructions || '',
                                  qrCodeUrl: ''
                                };

                                const updated = [...paymentMethods, methodObj];
                                const auditLog: PaymentAuditLog = {
                                  id: 'log_' + Date.now(),
                                  user: `${activeStaff.name} (${activeStaff.role})`,
                                  methodId: generatedId,
                                  methodName: methodObj.name,
                                  changeType: 'Method Added',
                                  oldValue: 'None',
                                  newValue: `Created ${methodObj.name} (${methodObj.accountType})`,
                                  date: new Date().toLocaleString('bn-BD', { hour12: true }),
                                  ipAddress: '103.88.22.' + Math.floor(Math.random() * 254 + 1)
                                };

                                onUpdatePaymentMethods(updated, auditLog);
                                addLog(activeStaff.name, `নতুন পেমেন্ট মেথড "${methodObj.name}" যোগ করেছেন।`, 'success');
                                setShowAddMethodModal(false);
                                alert('নতুন কাস্টম পেমেন্ট মেথডটি সফলভাবে যুক্ত করা হয়েছে!');
                              }}
                              className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs"
                            >
                              যোগ করুন
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: AGENT BANK ACCOUNTS VERIFIER & RBAC */}
          {activeTab === 'agent_banks' && (
            <AdminBankVerifier
              bankAccounts={bankAccounts}
              clientPayments={clientPayments}
              adminBankSettings={adminBankSettings}
              companies={companies}
              onUpdateAgentBankAccountStatus={onUpdateAgentBankAccountStatus}
              onUpdateAgentBankAccount={onUpdateAgentBankAccount}
              onAddAgentBankAccount={onAddAgentBankAccount}
              onDeleteAgentBankAccount={onDeleteAgentBankAccount}
              onVerifyClientPaymentByAdmin={onVerifyClientPaymentByAdmin}
              onUpdateAdminBankSettings={onUpdateAdminBankSettings}
            />
          )}

          {/* TAB 7: SUPPORT TICKETS & LIVE CHAT */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              {!hasPermission('chat_support') ? (
                renderLockOverlay('গ্রাহক সেবা ও লাইভ চ্যাট', 'chat_support')
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* Ticket List */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">সহায়তা টিকিট (Support Queue)</h3>
                    <div className="space-y-2 max-h-[420px] overflow-y-auto">
                      {tickets.map(t => (
                        <div
                          key={t.id}
                          onClick={() => setActiveTicketId(t.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                            activeTicketId === t.id 
                              ? 'bg-emerald-500/5 border-emerald-500 text-slate-900' 
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-800">{t.sender} ({t.role === 'Seeker' ? 'প্রার্থী' : 'এজেন্সি'})</span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              t.status === 'Pending' ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-200 text-slate-700'
                            }`}>{t.status}</span>
                          </div>
                          <p className="font-semibold text-slate-700">{t.topic}</p>
                          <p className="text-[10.5px] text-slate-400 mt-1 line-clamp-1">{t.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Panel */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between h-[450px]">
                    
                    {/* Chat Header */}
                    {(() => {
                      const currentTicket = tickets.find(t => t.id === activeTicketId);
                      if (!currentTicket) return <div className="text-center text-slate-400 text-xs py-8">কোন চ্যাট নির্বাচিত নেই</div>;
                      return (
                        <>
                          <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                            <div>
                              <strong className="text-xs text-slate-900 block">{currentTicket.sender} ({currentTicket.role})</strong>
                              <span className="text-[10px] text-slate-400">টিকিট প্রসঙ্গ: <strong>{currentTicket.topic}</strong></span>
                            </div>
                            <span className="text-[9.5px] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full text-indigo-700 font-bold font-mono">LIVE CHAT</span>
                          </div>

                          {/* Chat Messages */}
                          <div className="flex-1 overflow-y-auto py-4 space-y-2">
                            {currentTicket.chat.map((msg, idx) => (
                              <div
                                key={idx}
                                className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`p-2.5 rounded-xl max-w-sm text-xs ${
                                  msg.from === 'admin' 
                                    ? 'bg-slate-900 text-white rounded-tr-none' 
                                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                                }`}>
                                  {msg.text}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Reply Form */}
                          <form onSubmit={handleSendReply} className="flex gap-2 border-t border-slate-200 pt-3">
                            <input
                              type="text"
                              required
                              placeholder="সহায়তা বার্তাটির উত্তর এখানে লিখুন..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="flex-1 text-xs py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition"
                            >
                              <Send className="w-3.5 h-3.5" /> পাঠান
                            </button>
                          </form>
                        </>
                      );
                    })()}

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: CATEGORIES & LOCATIONS */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Category Manager Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-500" /> ক্যাটাগরি ম্যানেজমেন্ট
                </h3>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCatName.trim()) return;
                  onAddCategory(newCatName.trim());
                  addLog(activeStaff.name, `নতুন ক্যাটাগরি "${newCatName}" যুক্ত করেছেন।`, 'success');
                  setNewCatName('');
                }} className="flex gap-2">
                  <input 
                    type="text" 
                    required
                    placeholder="যেমন: UI/UX Design"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 text-xs py-2 px-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50"
                  />
                  <button 
                    type="submit" 
                    className="px-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-4 h-4" /> যুক্ত করুন
                  </button>
                </form>

                <div className="border border-slate-150 rounded-xl divide-y divide-slate-100 max-h-[220px] overflow-y-auto">
                  {categories.map((cat, i) => (
                    <div key={i} className="p-2.5 flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">{cat.name}</span>
                      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                        {cat.count} টি চাকরি
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Manager Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-500" /> অবস্থান / গন্তব্য রিজিয়ন
                </h3>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newLocName.trim()) return;
                  onAddLocation(newLocName.trim());
                  addLog(activeStaff.name, `নতুন দেশ বা শহর "${newLocName}" যুক্ত করেছেন।`, 'success');
                  setNewLocName('');
                }} className="flex gap-2">
                  <input 
                    type="text" 
                    required
                    placeholder="যেমন: কুয়েত সিটি"
                    value={newLocName}
                    onChange={(e) => setNewLocName(e.target.value)}
                    className="flex-1 text-xs py-2 px-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50"
                  />
                  <button 
                    type="submit" 
                    className="px-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-4 h-4" /> যুক্ত করুন
                  </button>
                </form>

                <div className="border border-slate-150 rounded-xl p-3 flex flex-wrap gap-1.5 max-h-[220px] overflow-y-auto">
                  {locations.map((loc, i) => (
                    <span key={i} className="bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                      📍 {loc}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 9: PUSH BROADCAST */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-emerald-500" /> পুষ নোটিফিকেশন ব্রডকাস্টার (Siren/Drop alerts)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">এখানে কোনো বার্তা লিখলে তা তাত্ক্ষণিকভাবে অ্যান্ড্রয়েড মোবাইল অ্যাপের স্ক্রিনে সাইরেন হিসেবে ভেসে উঠবে।</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!notifTitle.trim() || !notifMessage.trim()) return;
                  onBroadcastNotification(notifTitle, notifMessage);
                  addLog(activeStaff.name, `পুষ নোটিফিকেশন ব্রডকাস্ট করেছেন: "${notifTitle}"`, 'success');
                  alert('পুষ নোটিফিকেশন সফলভাবে ব্রডকাস্ট করা হয়েছে এবং Android অ্যাপ সিমুলেটরে পাঠানো হয়েছে!');
                }} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[11.5px] font-bold text-slate-700">টাইটেল (Title)</label>
                    <input 
                      type="text" required value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)}
                      className="w-full text-xs py-2 px-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11.5px] font-bold text-slate-700">বার্তা (Message)</label>
                    <textarea 
                      rows={3} required value={notifMessage} onChange={(e) => setNotifMessage(e.target.value)}
                      className="w-full text-xs py-2 px-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> ব্রডকাস্ট করুন
                  </button>
                </form>

                <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col justify-between space-y-4">
                  <span className="text-[9.5px] text-emerald-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span> Live Broadcast Preview
                  </span>
                  
                  <div className="border border-slate-800 bg-slate-950/80 p-3.5 rounded-xl space-y-1.5 shadow-lg">
                    <div className="flex justify-between items-center text-[9px] text-slate-500">
                      <span className="font-bold text-emerald-400">BDJobs App</span>
                      <span>Just Now</span>
                    </div>
                    <p className="text-xs font-black text-slate-100 truncate">{notifTitle || 'No Title'}</p>
                    <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">{notifMessage || 'No Message'}</p>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-normal font-light">
                    💡 <strong>ইন্টারঅ্যাকশন:</strong> "ব্রডকাস্ট" বাটনে ক্লিক করলে ডানপাশের অ্যান্ড্রয়েড মোবাইলের ভেতর একটি নোটিফিকেশন অ্যানিমেশন চালু হবে এবং সাউন্ড প্লে হবে।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: COMPANY REPORTS / COMPLAINTS */}
          {activeTab === 'complaints' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div>
                  <h3 className="text-sm font-black text-slate-950 flex items-center gap-1.5 uppercase tracking-wide">
                    🚨 কোম্পানি ও एजेंसी অভিযোগ রিপোর্টিং সেন্টার
                  </h3>
                  <p className="text-[10.5px] text-slate-500 mt-1">
                    চাকরিপ্রার্থী ও সাধারণ ব্যবহারকারীদের থেকে প্রাপ্ত বিভিন্ন ফ্রড বা প্রতারণার বিরুদ্ধে আসা অভিযোগ যাচাই ও ব্যবস্থা গ্রহণ।
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black px-3 py-1.5 rounded-xl">
                    মোট একটিভ রিপোর্ট: {companyReports.filter(r => r.status === 'Pending' || r.status === 'Investigating').length}টি
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-3 py-1.5 rounded-xl">
                    মীমাংসিত রিপোর্ট: {companyReports.filter(r => r.status === 'Resolved').length}টি
                  </span>
                </div>
              </div>

              {/* Reports List */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50/60 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-700">দাখিলকৃত অভিযোগের তালিকা (Company Reports Database)</span>
                  <span className="text-[10px] text-slate-400 font-mono">লাইভ রিয়েলটাইম ডাটা আপডেট</span>
                </div>

                <div className="divide-y divide-slate-150">
                  {companyReports && companyReports.length > 0 ? (
                    companyReports.map((report) => {
                      const comp = companies.find(c => c.id === report.companyId);
                      const isActiveReport = report.status === 'Pending' || report.status === 'Investigating';
                      return (
                        <div key={report.id} className="p-5 space-y-4 hover:bg-slate-50/50 transition">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-rose-500 text-white text-[9.5px] font-black px-2 py-0.5 rounded-full font-mono">
                                  REPORT #{report.id}
                                </span>
                                <span className="bg-slate-100 text-slate-700 text-[9.5px] font-extrabold px-2 py-0.5 rounded border border-slate-200">
                                  ক্যাটাগরি: {report.category === 'Fake Job' ? 'ভুয়া সার্কুলার / চাকরি' :
                                             report.category === 'Fake Visa' ? 'ভুয়া ভিসা অফার' :
                                             report.category === 'Payment Fraud' ? 'আর্থিক প্রতারণা ও স্ক্যাম' :
                                             report.category === 'Scam' ? 'লাইসেন্স জালিয়াতি' : 'দুর্ব্যবহার / অন্যান্য'}
                                </span>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border font-mono ${
                                  isActiveReport ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' :
                                  report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  'bg-slate-50 text-slate-600 border-slate-200'
                                }`}>
                                  {isActiveReport ? '🔴 সক্রিয় (Active)' :
                                   report.status === 'Resolved' ? '✔️ সমাধানকৃত (Resolved)' : '🔘 বাতিলকৃত (Dismissed)'}
                                </span>
                              </div>

                              <h4 className="text-xs font-black text-slate-900 leading-snug">
                                অভিযুক্ত এজেন্সি: <strong className="text-rose-600 font-black">{report.companyName}</strong> (RL No: {comp?.licenseNumber || 'N/A'})
                              </h4>

                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500 font-mono">
                                <span>👤 অভিযোগকারী: {report.reporterName}</span>
                                <span>✉️ ইমেইল: {report.reporterEmail}</span>
                                <span>📞 ফোন: {report.reporterPhone}</span>
                                <span className="text-slate-400">📅 তারিখ: {report.createdAt}</span>
                              </div>
                            </div>

                            {/* Actions Column */}
                            {isActiveReport && (
                              <div className="flex flex-wrap gap-1.5 shrink-0 w-full md:w-auto">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('অভিযোগটি বাতিল করতে চান?')) {
                                      if (onUpdateReportStatus) onUpdateReportStatus(report.id, 'Dismissed');
                                      addLog(activeStaff.name, `অভিযোগ #${report.id} বাতিল করেছেন।`, 'info');
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black rounded-lg transition"
                                >
                                  অভিযোগ বাতিল
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('অভিযোগটি সমাধানকৃত হিসেবে চিহ্নিত করতে চান?')) {
                                      if (onUpdateReportStatus) onUpdateReportStatus(report.id, 'Resolved');
                                      addLog(activeStaff.name, `অভিযোগ #${report.id} সমাধান সম্পন্ন করেছেন।`, 'success');
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg transition shadow-sm"
                                >
                                  সমাধানকৃত চিহ্নিত করুন
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`অভিযোগের প্রেক্ষিতে কোম্পানি "${report.companyName}" কে স্থগিত করতে চান?`)) {
                                      if (comp) {
                                        const updatedComp = { ...comp, companyStatus: 'Suspended' as const, isApproved: false };
                                        if (onUpdateCompany) onUpdateCompany(updatedComp);
                                      }
                                      if (onUpdateReportStatus) onUpdateReportStatus(report.id, 'Resolved');
                                      addLog(activeStaff.name, `অভিযোগ #${report.id} এর সুবাদে এজেন্সি "${report.companyName}" স্থগিত করেছেন।`, 'error');
                                      alert('এজেন্সি সফলভাবে স্থগিত করা হয়েছে!');
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-black rounded-lg transition shadow-sm"
                                >
                                  🚫 এজেন্সি স্থগিত করুন
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`অভিযোগের প্রেক্ষিতে কোম্পানি "${report.companyName}" কে কালো তালিকাভুক্ত (Blacklist) করতে চান?`)) {
                                      if (comp) {
                                        const updatedComp = { ...comp, companyStatus: 'Suspended' as const, isApproved: false };
                                        if (onUpdateCompany) onUpdateCompany(updatedComp);
                                      }
                                      if (onAddBlacklistItem) {
                                        onAddBlacklistItem({
                                          type: 'Company',
                                          value: report.companyName,
                                          holderName: report.companyName,
                                          reason: `Payment Fraud or Scam reported by ${report.reporterName}: ${report.description}`,
                                          blacklistedBy: activeStaff.name
                                        });
                                      }
                                      if (onUpdateReportStatus) onUpdateReportStatus(report.id, 'Resolved');
                                      addLog(activeStaff.name, `অভিযোগ #${report.id} এর সুবাদে এজেন্সি "${report.companyName}" কালো তালিকাভুক্ত করেছেন।`, 'error');
                                      alert('এজেন্সি সফলভাবে কালো তালিকাভুক্ত করা হয়েছে!');
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[10px] font-black rounded-lg transition shadow-md"
                                >
                                  💀 কালো তালিকাভুক্ত (Blacklist)
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Complaint Details */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-2">
                            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">অভিযোগের বর্ণনা (Complaint Details)</span>
                            <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-line">{report.description}</p>
                            {report.evidenceUrl && (
                              <div className="pt-2">
                                <span className="text-[8.5px] font-bold text-slate-400 uppercase block">প্রমাণক / নথি লিংক:</span>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    alert('প্রমাণক ফাইলের স্ক্যান কপি ডাউনলোড হচ্ছে...');
                                  }}
                                  className="text-[10px] text-blue-600 font-extrabold hover:underline inline-flex items-center gap-1 mt-1 bg-white border border-slate-200 px-3 py-1 rounded-lg"
                                >
                                  📎 {report.evidenceUrl}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-20 text-slate-400">
                      <AlertCircle className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                      <p className="text-xs font-black text-slate-600">কোনো অভিযোগ বা রিপোর্ট দাখিল করা হয়নি।</p>
                      <p className="text-[10px] text-slate-400 mt-1">সব কোম্পানি চমৎকার নীতি মেনে ফ্রডমুক্ত সার্ভিস প্রদান করছে।</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANTI-FRAUD / SCAM ALERTS MANAGEMENT */}
          {activeTab === 'scam-management' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-lg border border-slate-800">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-red-600/10 blur-3xl" />
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-black rounded-full uppercase tracking-wider">
                      🚨 ANTI-FRAUD CONTROL HUB
                    </span>
                    <h2 className="text-lg font-black text-white">প্রতারক চিনে রাখুন — কন্ট্রোল ও সতর্কবার্তা প্যানেল</h2>
                    <p className="text-[11px] text-slate-300 font-light">
                      ভুয়া ভিসা, ভুয়া নিয়োগপত্র এবং অননুমোদিত পেমেন্ট জালিয়াতি করা ব্যক্তি বা প্রতিষ্ঠানের তথ্য প্রমাণসহ প্রকাশ করুন, বাতিল বা অনুমোদন করুন।
                    </p>
                  </div>
                  <span className="text-2xl bg-red-600/20 border border-red-500/30 p-2.5 rounded-2xl">⚠️</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* COLUMN 1: POST WARNING FORM */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-red-500" /> নতুন প্রতারণার রেকর্ড প্রকাশ
                    </h3>
                    <p className="text-[10px] text-slate-500 font-light">
                      নতুন সতর্কবার্তা যুক্ত করতে নিচের ফর্মটি পূরণ করুন। সঠিক মোবাইল নম্বর ও প্রমাণ আপলোড করা নিশ্চিত করুন।
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newScamTitle.trim()) { alert('ব্যক্তি বা প্রতিষ্ঠানের নাম দিতে হবে!'); return; }
                      if (!newScamPhone.trim()) { alert('মোবাইল নম্বর দেওয়া আবশ্যক!'); return; }
                      if (!newScamLocation.trim()) { alert('ঠিকানা বা এলাকা লিখুন!'); return; }
                      if (!newScamDescription.trim()) { alert('घटना ও প্রতারণার বিবরণ দিন!'); return; }

                      const mockFiles = [];
                      if (newScamEvidenceName) {
                        mockFiles.push({
                          name: newScamEvidenceName,
                          type: newScamEvidenceName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
                          url: '#'
                        });
                      } else {
                        // Standard dummy file for compliance
                        mockFiles.push({
                          name: 'অভিযোগ_লিখিত_বিবৃতি.pdf',
                          type: 'pdf',
                          url: '#'
                        });
                      }

                      const newAlert: ScamAlert = {
                        id: 'sa_' + Math.floor(1000 + Math.random() * 9000),
                        title: newScamTitle,
                        phoneNumber: newScamPhone,
                        location: newScamLocation,
                        category: newScamCategory,
                        description: newScamDescription,
                        photoUrl: newScamPhoto || undefined,
                        evidenceFiles: mockFiles,
                        postedBy: {
                          name: currentUser?.name || 'অফিস স্টাফ',
                          role: (currentUser?.role as any) || 'staff',
                          email: currentUser?.email || 'admin@probashi.gov.bd'
                        },
                        approved: true, // Default to true since posted directly by Admin/Staff!
                        archived: false,
                        createdAt: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
                      };

                      if (onAddScamAlert) {
                        onAddScamAlert(newAlert);
                        // Trigger Audit log
                        onAddSystemAuditLog(
                          'FRAUD_ALERT_CREATED',
                          currentUser?.name || 'Admin',
                          newAlert.id,
                          newAlert.title,
                          `Published verified scam warning for ${newAlert.title} (${newAlert.phoneNumber})`
                        );
                        alert('সতর্কবার্তাটি সফলভাবে প্রকাশ ও অনুমোদন করা হয়েছে!');
                        
                        // Clear states
                        setNewScamTitle('');
                        setNewScamPhone('');
                        setNewScamLocation('');
                        setNewScamCategory('fake_agent');
                        setNewScamDescription('');
                        setNewScamPhoto('');
                        setNewScamEvidenceName('');
                      }
                    }}
                    className="space-y-3"
                  >
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase">ব্যক্তি বা প্রতিষ্ঠানের নাম (অভিযুক্ত)</label>
                      <input
                        type="text"
                        value={newScamTitle}
                        onChange={(e) => setNewScamTitle(e.target.value)}
                        placeholder="যেমন: আকাশ ওভারসিজ / মফিজুল ইসলাম"
                        className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase">অভিযুক্তের মোবাইল নম্বর(সমূহ)</label>
                      <input
                        type="text"
                        value={newScamPhone}
                        onChange={(e) => setNewScamPhone(e.target.value)}
                        placeholder="যেমন: +৮৮০১৭XXXXXXXX, +৮৮০১৮XXXXXXXX"
                        className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800"
                        required
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase">ঠিকানা বা এলাকা</label>
                      <input
                        type="text"
                        value={newScamLocation}
                        onChange={(e) => setNewScamLocation(e.target.value)}
                        placeholder="যেমন: পল্টন, ঢাকা / কুমারখালী, কুষ্টিয়া"
                        className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800"
                        required
                      />
                    </div>

                    {/* Category Select */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase">প্রতারণার ধরন</label>
                      <select
                        value={newScamCategory}
                        onChange={(e) => setNewScamCategory(e.target.value as ScamAlertCategory)}
                        className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800"
                      >
                        <option value="fake_agent">ভুয়া এজেন্ট (Fake Agent)</option>
                        <option value="fake_job">ভুয়া চাকরি (Fake Job Offer)</option>
                        <option value="visa_fraud">ভিসা প্রতারণা (Visa Fraud)</option>
                        <option value="payment_fraud">পেমেন্ট জালিয়াতি (Payment Fraud)</option>
                        <option value="document_fraud">ডকুমেন্ট জালিয়াতি (Document Fraud)</option>
                        <option value="other">অন্যান্য (Other Issues)</option>
                      </select>
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase">অভিযোগ ও ঘটনার বিবরণ</label>
                      <textarea
                        rows={3}
                        value={newScamDescription}
                        onChange={(e) => setNewScamDescription(e.target.value)}
                        placeholder="ভুক্তভোগীর অভিযোগের বিবরণ ও টাকা হাতানোর বিবরণ লিখুন..."
                        className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 leading-relaxed"
                        required
                      />
                    </div>

                    {/* Photo URL (Optional) */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase">ছবি লিঙ্ক / স্ক্রিনশট ইউআরএল (ঐচ্ছিক)</label>
                      <input
                        type="text"
                        value={newScamPhoto}
                        onChange={(e) => setNewScamPhoto(e.target.value)}
                        placeholder="যেমন: https://example.com/scam.jpg"
                        className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800"
                      />
                    </div>

                    {/* Upload Evidence Section */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase">প্রমাণ বা রসিদ আপলোড করুন (PDF / PNG)</label>
                      <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center hover:bg-slate-50 transition relative">
                        <input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setNewScamEvidenceName(e.target.files[0].name);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <span className="text-base block">📁</span>
                        <p className="font-bold text-[9px] text-slate-500">
                          {newScamEvidenceName ? `ফাইল: ${newScamEvidenceName}` : 'ক্লিক করুন বা ফাইল ড্র্যাগ করুন'}
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4 text-white" /> প্রকাশ ও অনুমোদন দিন
                    </button>
                  </form>
                </div>

                {/* COLUMN 2 & 3: MANAGE LIST */}
                <div className="lg:col-span-2 space-y-5">
                  {/* Filter Sub-nav */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-black text-slate-800">মোট সতর্কতা তালিকা</h3>
                      <p className="text-[10px] text-slate-500 font-light">ডাটাবেজে থাকা অনুমোদিত, পেন্ডিং ও আর্কাইভড সতর্কতা রেকর্ডসমূহ।</p>
                    </div>

                    {/* Filter pills */}
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                      {[
                        { id: 'all', label: 'সকল' },
                        { id: 'pending', label: 'পেন্ডিং' },
                        { id: 'approved', label: 'অনুমোদিত' },
                        { id: 'archived', label: 'আর্কাইভকৃত' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setScamAlertsFilter(item.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black transition ${
                            scamAlertsFilter === item.id 
                              ? 'bg-white text-slate-800 shadow-xs' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {item.label} ({(scamAlerts || []).filter(s => {
                            if (item.id === 'pending') return !s.approved;
                            if (item.id === 'approved') return s.approved && !s.archived;
                            if (item.id === 'archived') return s.archived;
                            return true;
                          }).length})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Warning Alerts Cards container */}
                  <div className="space-y-4">
                    {(scamAlerts || [])
                      .filter(scam => {
                        if (scamAlertsFilter === 'pending') return !scam.approved;
                        if (scamAlertsFilter === 'approved') return scam.approved && !scam.archived;
                        if (scamAlertsFilter === 'archived') return scam.archived;
                        return true;
                      })
                      .map((scam) => (
                        <div 
                          key={scam.id}
                          className={`bg-white rounded-2xl border-2 p-5 shadow-xs space-y-4 transition ${
                            !scam.approved 
                              ? 'border-amber-200 bg-amber-50/10' 
                              : scam.archived 
                              ? 'border-slate-200 bg-slate-50/50 opacity-75' 
                              : 'border-red-100'
                          }`}
                        >
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase ${
                                  !scam.approved 
                                    ? 'bg-amber-100 text-amber-800' 
                                    : scam.archived 
                                    ? 'bg-slate-200 text-slate-700' 
                                    : 'bg-red-100 text-red-600'
                                }`}>
                                  {!scam.approved ? 'পেন্ডিং অনুমোদন' : scam.archived ? 'আর্কাইভকৃত' : 'অনুমোদিত ও সক্রিয়'}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold">আইডি: {scam.id.toUpperCase()}</span>
                              </div>
                              <h4 className="text-xs font-black text-slate-950 flex items-center gap-1">
                                {scam.title}
                              </h4>
                            </div>
                            
                            <span className="text-[9.5px] text-slate-400 font-semibold">{scam.createdAt}</span>
                          </div>

                          {/* Quick details grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-700">
                            <div>
                              <span className="text-slate-400 block text-[9.5px] font-black">মোবাইল নম্বর(সমূহ):</span>
                              <span className="font-bold text-slate-800 tracking-wide">{scam.phoneNumber}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9.5px] font-black">ঠিকানা বা এলাকা:</span>
                              <span className="font-bold text-slate-800">{scam.location}</span>
                            </div>
                          </div>

                          <div className="space-y-1 text-xs">
                            <span className="text-[9px] text-slate-400 font-black uppercase">অভিযোগ ও ঘটনার বিবরণ:</span>
                            <p className="text-slate-600 font-light leading-relaxed">{scam.description}</p>
                          </div>

                          {/* Evidence list rendering */}
                          {scam.evidenceFiles && scam.evidenceFiles.length > 0 && (
                            <div className="pt-1">
                              <span className="text-[9px] text-slate-400 font-black uppercase block mb-1">সংযুক্ত প্রামাণ্য ফাইল:</span>
                              <div className="flex flex-wrap gap-2">
                                {scam.evidenceFiles.map((file, idx) => (
                                  <div key={idx} className="bg-slate-100/80 border border-slate-200 rounded-lg px-2 py-1 text-[9.5px] font-semibold text-slate-600 flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{file.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions Bar */}
                          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className="text-[9px] text-slate-400 font-semibold">
                              পোস্ট করেছেন: <span className="font-bold text-slate-700">{scam.postedBy.name} ({scam.postedBy.role})</span>
                            </div>

                            <div className="flex gap-2 self-end sm:self-auto">
                              {/* Approve Button */}
                              {!scam.approved && (
                                <button
                                  onClick={() => {
                                    if (onUpdateScamAlert) {
                                      onUpdateScamAlert(scam.id, { approved: true });
                                      onAddSystemAuditLog(
                                        'FRAUD_ALERT_APPROVED',
                                        currentUser?.name || 'Admin',
                                        scam.id,
                                        scam.title,
                                        `Approved fraud alert post for ${scam.title}`
                                      );
                                      alert('পোস্টটি সফলভাবে অনুমোদন ও প্রকাশ করা হয়েছে!');
                                    }
                                  }}
                                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10.5px] font-black rounded-lg transition flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" /> অনুমোদন দিন
                                </button>
                              )}

                              {/* Archive Button */}
                              {scam.approved && !scam.archived && (
                                <button
                                  onClick={() => {
                                    if (onUpdateScamAlert) {
                                      onUpdateScamAlert(scam.id, { archived: true });
                                      onAddSystemAuditLog(
                                        'FRAUD_ALERT_ARCHIVED',
                                        currentUser?.name || 'Admin',
                                        scam.id,
                                        scam.title,
                                        `Archived fraud alert post for ${scam.title}`
                                      );
                                      alert('সতর্কবার্তাটি সফলভাবে মহাফেজখানায় (আর্কাইভ) পাঠানো হয়েছে!');
                                    }
                                  }}
                                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10.5px] font-black rounded-lg transition"
                                >
                                  আর্কাইভ করুন
                                </button>
                              )}

                              {/* Unarchive Button (for archived ones) */}
                              {scam.archived && (
                                <button
                                  onClick={() => {
                                    if (onUpdateScamAlert) {
                                      onUpdateScamAlert(scam.id, { archived: false });
                                      onAddSystemAuditLog(
                                        'FRAUD_ALERT_UNARCHIVED',
                                        currentUser?.name || 'Admin',
                                        scam.id,
                                        scam.title,
                                        `Unarchived fraud alert post for ${scam.title}`
                                      );
                                      alert('সতর্কবার্তাটি পুনরায় সক্রিয় ও চালু করা হয়েছে!');
                                    }
                                  }}
                                  className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10.5px] font-black rounded-lg transition"
                                >
                                  সক্রিয় করুন
                                </button>
                              )}

                              {/* Permanent Delete Button */}
                              <button
                                onClick={() => {
                                  if (confirm('আপনি কি নিশ্চিত যে এই সতর্কবার্তা রেকর্ডটি স্থায়ীভাবে মুছে ফেলতে চান? এটি আর ফেরত আনা যাবে না।')) {
                                    if (onUpdateScamAlert) {
                                      onUpdateScamAlert(scam.id, { deleted: true });
                                      onAddSystemAuditLog(
                                        'FRAUD_ALERT_DELETED',
                                        currentUser?.name || 'Admin',
                                        scam.id,
                                        scam.title,
                                        `Permanently deleted fraud alert warning for ${scam.title}`
                                      );
                                      alert('সতর্কবার্তাটি স্থায়ীভাবে ডিলিট করা হয়েছে!');
                                    }
                                  }
                                }}
                                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 text-[10.5px] font-black rounded-lg transition flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> মুছুন
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                    {/* No records placeholder */}
                    {(scamAlerts || []).filter(scam => {
                      if (scamAlertsFilter === 'pending') return !scam.approved;
                      if (scamAlertsFilter === 'approved') return scam.approved && !scam.archived;
                      if (scamAlertsFilter === 'archived') return scam.archived;
                      return true;
                    }).length === 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                        🔍 কোনো রেকর্ড পাওয়া যায়নি।
                      </div>
                    )}
                  </div>

                  {/* Chronological Fraud Logs Section */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3.5">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-slate-400" />
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">অ্যান্টি-ফ্রড অ্যাকশন লগ ও ইতিহাস</h4>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {(scamAuditLogs || [])
                        .slice()
                        .reverse()
                        .map((log) => (
                          <div key={log.id} className="text-[10px] py-2 border-b border-slate-100 last:border-0 flex justify-between gap-3 text-slate-600">
                            <div className="space-y-0.5">
                              <p className="font-medium">
                                <span className="font-bold text-slate-800">{log.performedBy?.name || 'অফিস স্টাফ'}</span> ({log.performedBy?.role || 'staff'}){' '}
                                <span className="font-semibold text-blue-600">
                                  {log.action?.toLowerCase() === 'create' ? 'নতুন সতর্কতা লিখেছেন' : log.action?.toLowerCase() === 'approve' ? 'অনুমোদন দিয়েছেন' : log.action?.toLowerCase() === 'archive' ? 'আর্কাইভ করেছেন' : log.action?.toLowerCase() === 'unarchive' ? 'আর্কাইভ থেকে ফিরিয়েছেন' : 'ডিলিট করেছেন'}
                                </span>: {log.details}
                              </p>
                              <p className="text-[9px] text-slate-400">সংশ্লিষ্ট আইডি: {log.alertId}</p>
                            </div>
                            <span className="text-[9px] text-slate-400 font-semibold shrink-0">{log.timestamp}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BLACKLIST MANAGEMENT */}
          {activeTab === 'blacklist' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form to add manual item */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-rose-500" /> নতুন কালো তালিকা আইটেম
                  </h3>
                  <p className="text-[10.5px] text-slate-500 leading-normal">
                    সিস্টেমে কোনো প্রতারক কোম্পানি, ফেক ইউজার, জালিয়াতি পাসপোর্ট বা ফেক এনআইডি স্থায়ী ব্লক করতে এখানে তথ্য লিখুন।
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const type = (form.elements.namedItem('entityType') as HTMLSelectElement).value;
                      const value = (form.elements.namedItem('entityValue') as HTMLInputElement).value;
                      const reason = (form.elements.namedItem('entityReason') as HTMLTextAreaElement).value;

                      if (!value.trim() || !reason.trim()) {
                        alert('সব ফিল্ড পূরণ করা আবশ্যক!');
                        return;
                      }

                      if (onAddBlacklistItem) {
                        onAddBlacklistItem({
                          type: type as any,
                          value: value.trim(),
                          holderName: '-',
                          reason: reason.trim(),
                          blacklistedBy: activeStaff.name
                        });
                        addLog(activeStaff.name, `কালো তালিকায় নতুন আইটেম যোগ করেছেন: [${type}] ${value}`, 'error');
                        alert('আইটেমটি সফলভাবে কালো তালিকায় যুক্ত করা হয়েছে!');
                        form.reset();
                      }
                    }}
                    className="space-y-3.5 text-xs text-slate-700"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase block">আইটেম টাইপ (Entity Type)</label>
                      <select
                        name="entityType"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-xl text-xs outline-none"
                      >
                        <option value="Company">🏢 রিক্রুটিং কোম্পানি (Recruiting Company)</option>
                        <option value="User">👤 চাকরিপ্রার্থী / ব্যবহারকারী (Seeker / User)</option>
                        <option value="Passport">🛂 পাসপোর্ট নম্বর (Passport Number)</option>
                        <option value="NID">📇 জাতীয় পরিচয়পত্র (NID Number)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase block">টার্গেট ভ্যালু (Value)</label>
                      <input
                        type="text"
                        name="entityValue"
                        placeholder="যেমন: পাসপোর্ট নম্বর, ফোন বা এজেন্সির নাম"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-xl text-xs outline-none font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase block">ব্লক করার কারণ (Block Reason)</label>
                      <textarea
                        name="entityReason"
                        placeholder="ভুয়া ট্রেড লাইসেন্স ব্যবহার, আর্থিক প্রতারণা, ইত্যাদি..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-xl text-xs outline-none h-20 resize-none font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl transition shadow-md text-xs flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> কালো তালিকায় যুক্ত করুন
                    </button>
                  </form>
                </div>

                {/* Blacklisted list database */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 col-span-2">
                  <div className="flex justify-between items-center border-b pb-3.5 border-slate-100">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      💀 কালো তালিকা ভিউ পোর্টাল (Blacklist Registry)
                    </h3>
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      মোট নিষিদ্ধ রেকর্ড: {blacklistItems.length}টি
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold text-[10.5px]">
                          <th className="p-3">টাইপ (Type)</th>
                          <th className="p-3">টার্গেট ভ্যালু (Value)</th>
                          <th className="p-3">নিষেধাজ্ঞার কারণ</th>
                          <th className="p-3">কর্মকর্তা & তারিখ</th>
                          <th className="p-3 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {blacklistItems && blacklistItems.length > 0 ? (
                          blacklistItems.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition font-medium">
                              <td className="p-3">
                                <span className={`text-[9.5px] font-black px-2 py-0.5 rounded border ${
                                  item.type === 'Company' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                  item.type === 'User' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                  item.type === 'Passport' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-slate-50 text-slate-700 border-slate-200'
                                }`}>
                                  {item.type === 'Company' ? '🏢 কোম্পানি' :
                                   item.type === 'User' ? '👤 ব্যবহারকারী' :
                                   item.type === 'Passport' ? '🛂 পাসপোর্ট' : '📇 এনআইডি'}
                                </span>
                              </td>
                              <td className="p-3 font-mono font-bold text-slate-900 break-all max-w-[150px]">{item.value}</td>
                              <td className="p-3 text-slate-500 text-[10.5px] leading-relaxed max-w-[200px] break-words">{item.reason}</td>
                              <td className="p-3 text-[9.5px] text-slate-400 font-mono">
                                <p className="font-extrabold text-slate-600">{item.blacklistedBy}</p>
                                <p className="text-[8px]">{item.blacklistedAt}</p>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`আইটেম "${item.value}" কে কালো তালিকা থেকে অবমুক্ত করতে চান?`)) {
                                      if (onRemoveBlacklistItem) onRemoveBlacklistItem(item.id, activeStaff.name);
                                      addLog(activeStaff.name, `কালো তালিকা থেকে আইটেম অবমুক্ত করেছেন: ${item.value}`, 'warning');
                                      alert('সফলভাবে কালো তালিকা থেকে অবমুক্ত করা হয়েছে!');
                                    }
                                  }}
                                  className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-lg transition"
                                  title="তালিকা থেকে মুছুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-16 text-slate-400">
                              <Lock className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                              <p className="font-bold text-slate-500">কালো তালিকায় কোনো রেকর্ড নেই।</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SYSTEM AUDIT LOGS */}
          {activeTab === 'audit-logs' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-950 flex items-center gap-1.5 uppercase tracking-wide">
                      🛡️ নিরাপত্তা ও অ্যাডমিন অডিট লগ (Security Audit Trails)
                    </h3>
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      পোর্টালে সম্পাদিত প্রতিটি প্রশাসনিক পদক্ষেপ, পাস অনুমোদন, পেমেন্ট সংশোধন, এবং সিকিউরিটি অ্যালার্ট ট্র্যাকিং ইতিহাস।
                    </p>
                  </div>
                  {activeStaff.role === 'Super Admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('সব সিকিউরিটি লগ ক্লিয়ার করতে চান? এই প্রক্রিয়া অপরিবর্তনযোগ্য।')) {
                          localStorage.removeItem('probashi_audit_logs');
                          alert('সিকিউরিটি অডিট ট্রেইল সফলভাবে রিসেট করা হয়েছে!');
                          window.location.reload();
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-[10px] font-black rounded-lg transition"
                    >
                      ক্লিয়ার লগ (Reset Logs)
                    </button>
                  )}
                </div>
              </div>

              {/* Timeline Display */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-center border-b pb-3 border-slate-150">
                  <span className="text-xs font-black text-slate-700">রিয়েল-টাইম সিকিউরিটি ট্রেইল লগ</span>
                  <span className="text-[9.5px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    মোট রেকর্ড: {systemAuditLogs.length}টি
                  </span>
                </div>

                <div className="space-y-4">
                  {systemAuditLogs && systemAuditLogs.length > 0 ? (
                    systemAuditLogs.map((log) => {
                      const isSuccess = log.details?.toLowerCase().includes('success') || log.action.includes('অনুমোদন') || log.action.includes('সফল');
                      const isError = log.details?.toLowerCase().includes('error') || log.action.includes('বরখাস্ত') || log.action.includes('স্থগিত') || log.action.includes('নাকচ') || log.action.includes('কালো তালিকাভুক্ত');
                      const isWarning = log.details?.toLowerCase().includes('warning') || log.action.includes('পরিবর্তন') || log.action.includes('রিসেট') || log.action.includes('অবমুক্ত');
                      
                      return (
                        <div key={log.id} className="flex gap-4 items-start border-l-2 border-slate-200 pl-4 relative">
                          <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${
                            isSuccess ? 'bg-emerald-500 ring-4 ring-emerald-500/10' :
                            isError ? 'bg-rose-500 ring-4 ring-rose-500/10' :
                            isWarning ? 'bg-amber-500 ring-4 ring-amber-500/10' :
                            'bg-blue-500 ring-4 ring-blue-500/10'
                          }`} />

                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start gap-4 flex-wrap">
                              <p className="text-xs font-bold text-slate-800 leading-normal">{log.action}</p>
                              <span className="text-[9.5px] text-slate-400 font-mono shrink-0">{log.date}</span>
                            </div>

                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                              <span className="bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-slate-600">👤 {log.user}</span>
                              <span>🌐 IP: 192.168.1.1</span>
                              {log.details && (
                                <span className="text-slate-400 italic">({log.details})</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-16 text-slate-400">
                      <History className="w-12 h-12 mx-auto text-slate-200 mb-2" />
                      <p className="font-bold text-xs">কোনো সিকিউরিটি অডিট ট্রেইল রেকর্ড নেই।</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: REPORTS & ANALYTICS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Reports page is available to Super Admin and Office Admin */}
              {activeStaff.role === 'Staff' ? (
                renderLockOverlay('রিপোর্ট ও এনালাইটিক্স ভিউ', 'view_jobs')
              ) : (
                <div className="space-y-6">
                  
                  {/* Visual reports simulated using SVG/HTML */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                      <p className="text-xs font-bold text-slate-700">📍 গন্তব্য দেশ ভিত্তিক প্রবাসী সংখ্যা</p>
                      <div className="space-y-2">
                        {[
                          { label: 'সৌদি আরব 🇸🇦', value: '৬৫%', bg: 'bg-emerald-500' },
                          { label: 'পোল্যান্ড 🇵🇱', value: '১৫%', bg: 'bg-indigo-500' },
                          { label: 'মালয়েশিয়া 🇲🇾', value: '১০%', bg: 'bg-amber-500' },
                          { label: 'রোমানিয়া 🇷🇴', value: '১০%', bg: 'bg-rose-500' }
                        ].map((item, idx) => (
                          <div key={idx} className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="font-semibold text-slate-600">{item.label}</span>
                              <span className="font-bold text-slate-900">{item.value}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className={`${item.bg} h-full`} style={{ width: item.value }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                      <p className="text-xs font-bold text-slate-700">💼 ক্যাটাগরি ভিত্তিক আবেদনের ঝোঁক</p>
                      <div className="space-y-2">
                        {[
                          { label: 'ড্রাইভিং ও লজিস্টিকস', value: '৪৫%', bg: 'bg-sky-500' },
                          { label: 'কনস্ট্রাকশন ও রাজমিস্ত্রি', value: '৩০%', bg: 'bg-amber-500' },
                          { label: 'ক্লিনার ও হোটেল সার্ভিস', value: '১৫%', bg: 'bg-purple-500' },
                          { label: 'অন্যান্য কারিগরি কাজ', value: '১০%', bg: 'bg-slate-400' }
                        ].map((item, idx) => (
                          <div key={idx} className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="font-semibold text-slate-600">{item.label}</span>
                              <span className="font-bold text-slate-900">{item.value}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className={`${item.bg} h-full`} style={{ width: item.value }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-700">📂 পিডিপি/এক্সেল এক্সপোর্ট কন্ট্রোল</h4>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          নিয়মাবলী অনুযায়ী, <strong className="text-slate-800">Office Admin</strong> শুধুমাত্র রিপোর্টগুলো দেখতে পারবেন কিন্তু এক্সপোর্ট ডাউনলোড ফাইল প্রস্তুত করতে পারবেন না।
                        </p>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-slate-100">
                        <button
                          disabled={activeStaff.role === 'Office Admin'}
                          onClick={() => {
                            alert('Excel রিপোর্ট সফলভাবে রেন্ডার করা হয়েছে এবং ডাউনলোড সম্পন্ন হয়েছে!');
                            addLog(activeStaff.name, 'রাজস্ব ও এজেন্সির তালিকা এক্সেল ফাইলে এক্সপোর্ট করেছেন।', 'success');
                          }}
                          className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                            activeStaff.role === 'Office Admin'
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          <FileDown className="w-4 h-4 text-emerald-400" /> এক্সেল ডাউনলোড করুন (Excel)
                        </button>
                        <button
                          disabled={activeStaff.role === 'Office Admin'}
                          onClick={() => {
                            alert('PDF রিপোর্ট প্রস্তুত করা হয়েছে এবং ডাউনলোড সম্পূর্ণ হয়েছে!');
                            addLog(activeStaff.name, 'গ্লোবাল প্রবাসী এনালাইটিক্স পিডিএফ এ ডাউনলোড করেছেন।', 'success');
                          }}
                          className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                            activeStaff.role === 'Office Admin'
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                          }`}
                        >
                          <Download className="w-4 h-4 text-white" /> পিডিএফ রিপোর্ট নিন (PDF)
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 11: SETTINGS, CMS, BACKUPS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {!hasPermission('database_access') ? (
                renderLockOverlay('সিস্টেম সেটিংস ও ডাটাবেজ এক্সেস', 'database_access')
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* Left CMS Panel */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-emerald-500" /> ওয়েবসাইট CMS ও তথ্য সেটিংস
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600">ওয়েবসাইট বা পোর্টালে প্রধান লোগো লেখা</label>
                        <input
                          type="text" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)}
                          className="w-full text-xs py-1.5 px-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600">জরুরি প্রবাসী হেল্পলাইন নম্বর</label>
                        <input
                          type="text" value={hotline} onChange={(e) => setHotline(e.target.value)}
                          className="w-full text-xs py-1.5 px-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <button
                        onClick={() => {
                          alert('ওয়েবসাইট CMS সেটিংস সফলভাবে আপডেট ও রিয়েল-টাইম সিঙ্ক করা হয়েছে!');
                          addLog(activeStaff.name, `ওয়েবসাইটের শিরোনাম ও হেল্পলাইন পরিবর্তন করেছেন।`, 'success');
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                      >
                        আপডেট করুন
                      </button>
                    </div>
                  </div>

                  {/* Right Database Panel */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 mb-2">
                        <Database className="w-4 h-4 text-emerald-500" /> ডাটাবেজ ব্যাকআপ ও অপ্টিমাইজেশন
                      </h3>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed font-light">
                        আপনার বর্তমান সুপার অ্যাডমিন স্তরের ক্ষমতা দিয়ে আপনি সম্পূর্ণ পোর্টালের ডাটাবেজ JSON ফরম্যাটে ক্লাউড ব্যাকআপ হিসেবে স্টোর করতে পারবেন এবং রিস্টোর করতে পারবেন।
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      {backupLoading && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-500">
                            <span>কম্প্রেস হচ্ছে...</span>
                            <span>{backupProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${backupProgress}%` }} />
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleDatabaseBackup}
                        className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                      >
                        <RefreshCw className={`w-4 h-4 ${backupLoading ? 'animate-spin' : ''}`} /> ক্লাউড ডাটাবেজ ব্যাকআপ নিন (Backup)
                      </button>

                      <button
                        onClick={() => {
                          const file = prompt('ডাটাবেজ ব্যাকআপ রিস্টোর কোড বা টোকেন লিখুন:');
                          if (file) {
                            alert('সিস্টেম ডাটাবেজ রিস্টোর করা হয়েছে এবং ডাটা সিঙ্ক করা হয়েছে!');
                            addLog(activeStaff.name, `ডাটাবেজ রিস্টোর টোকেন #${file} দিয়ে রিস্টোর সম্পন্ন করেছেন।`, 'warning');
                          }
                        }}
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 transition"
                      >
                        <Download className="w-4 h-4" /> ব্যাকআপ রিস্টোর ফাইল আপলোড (Restore)
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 12: AI SEO MANAGER */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              {!hasPermission('website_settings') ? (
                renderLockOverlay('AI এসইও ড্যাশবোর্ড ও মেটা সেটিংস', 'website_settings')
              ) : (
                <AdminSeoPanel
                  seoConfigs={seoConfigs}
                  globalSeo={globalSeo}
                  onUpdateSeoConfigs={onUpdateSeoConfigs}
                  onUpdateGlobalSeo={onUpdateGlobalSeo}
                  jobs={jobs}
                  companies={companies}
                />
              )}
            </div>
          )}

        </div>
      </div>

      {/* MODAL OVERLAY: SELECTED ITALY PACKAGE TRACKER DETAIL */}
      {selectedItPkgDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl h-[85vh] max-h-[640px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col animate-fade-in text-white">
            <VerifiedSystemHub 
              application={selectedItPkgDetail as any} 
              userRole="Admin"
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
