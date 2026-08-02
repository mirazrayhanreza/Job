/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  getLocalStorageState, 
  saveLocalStorageState, 
  Job, 
  Company, 
  Application, 
  Transaction, 
  Notification, 
  PaymentMethodSetting,
  PaymentAuditLog,
  CATEGORIES, 
  LOCATIONS,
  CompanyReport,
  BlacklistedItem,
  SystemAuditLog,
  ItalyPackageApplication,
  getDefaultVisaSteps,
  getDefaultPaymentSteps
} from './mockData';
import WebPortal from './components/WebPortal';
import AndroidSimulator from './components/AndroidSimulator';
import CandidateApp from './app/CandidateApp';
import AdminPanel from './components/AdminPanel';
import { PortalUser, LoginActivity } from './types/auth';
import { ScamAlert, ScamAuditLog } from './types/scam';
import { AgentBankAccount, ClientPaymentSubmission, AdminBankSettings, BankAccountStatus, DEFAULT_ADMIN_BANK_SETTINGS } from './types/bank';
import AuthSystem from './components/AuthSystem';
import { generateLocalFallbackSeo, updateGlobalSeo } from './utils/seoHelper';
import { 
  Laptop, Smartphone, ShieldCheck, Github, BookOpen, AlertCircle,
  TrendingUp, Users, HeartPulse, Palette, Info, CheckCircle2, Sparkles, Code
} from 'lucide-react';

export default function App() {
  // Master states loaded from LocalStorage
  const [state, setState] = useState(() => getLocalStorageState());

  // Left side workspace switcher
  const [workspaceMode, setWorkspaceMode] = useState<'portal' | 'admin'>('portal');

  // Multi-System Selector: 'dual' (Web + App side-by-side) | 'web' (System 1: Web Agency Portal) | 'app' (System 2: Candidate Mobile App in /src/app)
  const [activeSystemView, setActiveSystemView] = useState<'dual' | 'web' | 'app'>(() => {
    const saved = localStorage.getItem('probashi_system_view');
    if (saved === 'web' || saved === 'app' || saved === 'dual') return saved;
    return 'web';
  });

  const isDualPane = activeSystemView === 'dual';

  // Agency dedicated routes: 'login' | 'dashboard' | null
  const [agencyRoute, setAgencyRoute] = useState<'login' | 'dashboard' | null>(null);

  // Synchronize Agency Routes based on pathname and hash
  useEffect(() => {
    const handleRouteSync = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      if (path === '/agency/login' || hash === '#/agency/login') {
        setAgencyRoute('login');
      } else if (path === '/agency/dashboard' || hash === '#/agency/dashboard') {
        setAgencyRoute('dashboard');
      } else {
        setAgencyRoute(null);
      }
    };

    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    handleRouteSync(); // check initially

    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  const navigateToAgency = (route: 'login' | 'dashboard' | null) => {
    if (route === 'login') {
      window.history.pushState(null, '', '/agency/login');
      window.location.hash = '#/agency/login';
      setAgencyRoute('login');
    } else if (route === 'dashboard') {
      window.history.pushState(null, '', '/agency/dashboard');
      window.location.hash = '#/agency/dashboard';
      setAgencyRoute('dashboard');
    } else {
      window.history.pushState(null, '', '/');
      window.location.hash = '';
      setAgencyRoute(null);
    }
  };

  // Handle redirect if logged in / not logged in
  useEffect(() => {
    const isEmployer = state.currentUser?.role === 'employer';
    
    if (agencyRoute === 'login' && isEmployer) {
      navigateToAgency('dashboard');
    } else if (agencyRoute === 'dashboard' && !isEmployer) {
      navigateToAgency('login');
    }
  }, [agencyRoute, state.currentUser]);

  // Auth modal control
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Dynamic lists from state
  const [categoriesList, setCategoriesList] = useState(() => CATEGORIES);
  const [locationsList, setLocationsList] = useState(() => LOCATIONS);

  // Sync state to LocalStorage on every update
  useEffect(() => {
    saveLocalStorageState(state);
  }, [state]);

  // Auth helper handlers
  const handleLogin = (user: PortalUser, activity: LoginActivity) => {
    setState(prev => {
      // De-active previous sessions for this user
      const cleanActivities = prev.loginActivities.map(act => {
        if (act.userId === user.id && act.status === 'Active Session') {
          return {
            ...act,
            status: 'Success' as const,
            logoutTime: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString('bn-BD')
          };
        }
        return act;
      });

      return {
        ...prev,
        currentUser: user,
        currentUserType: (user.role === 'employer' ? 'employer' : 'seeker') as 'seeker' | 'employer',
        currentSeekerEmail: user.email,
        currentEmployerCompanyId: user.companyName ? (prev.companies.find(c => c.name.toLowerCase() === user.companyName?.toLowerCase())?.id || 'c1') : 'c1',
        loginActivities: [activity, ...cleanActivities]
      };
    });

    // Automatically toggle workspace if Admin/Super Admin/Staff logs in
    if (user.role === 'super_admin' || user.role === 'admin' || user.role === 'staff') {
      setWorkspaceMode('admin');
    }
  };

  const handleLogout = () => {
    setState(prev => {
      const updatedActivities = prev.loginActivities.map(act => {
        if (act.userId === prev.currentUser?.id && act.status === 'Active Session') {
          return {
            ...act,
            status: 'Success' as const,
            logoutTime: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString('bn-BD')
          };
        }
        return act;
      });

      return {
        ...prev,
        currentUser: null,
        currentUserType: 'seeker' as const,
        currentSeekerEmail: '',
        loginActivities: updatedActivities
      };
    });
    setWorkspaceMode('portal');
    navigateToAgency(null);
  };

  const handleRegister = (newUser: PortalUser) => {
    setState(prev => {
      // If the registered user is an employer, create their Company profile automatically
      let updatedCompanies = prev.companies;
      if (newUser.role === 'employer' && newUser.companyName) {
        const newComp: Company = {
          id: 'c_' + Date.now(),
          name: newUser.companyName,
          logo: '✈️',
          licenseNumber: newUser.registrationNumber || 'RL-PENDING',
          industry: 'Overseas Manpower Placement',
          employees: '1-10',
          location: 'Dhaka, Bangladesh',
          description: 'A newly registered recruiting agency in the Probashi Jobs portal.',
          isApproved: false, // Pending Super Admin verification
          email: newUser.email,
          companyStatus: 'Pending' // Role status
        };
        updatedCompanies = [...prev.companies, newComp];
      }

      return {
        ...prev,
        users: [...prev.users, newUser],
        companies: updatedCompanies
      };
    });
  };

  const handleUpdateUsers = (updatedUsers: PortalUser[]) => {
    setState(prev => ({
      ...prev,
      users: updatedUsers
    }));
  };

  // Seeker's applied job IDs derived from applications
  const seekerAppliedJobIds = state.applications
    .filter(app => app.candidateEmail.toLowerCase() === state.currentSeekerEmail.toLowerCase())
    .map(app => app.jobId);

  // Toggle/Save job for Seeker bookmarks
  const handleToggleSaveJob = (id: string) => {
    setState(prev => {
      const isSaved = prev.savedJobs.includes(id);
      const savedJobs = isSaved 
        ? prev.savedJobs.filter(item => item !== id)
        : [...prev.savedJobs, id];
      return { ...prev, savedJobs };
    });
  };

  // Seeker apply job
  const handleApplyJob = (
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
  ) => {
    const jobObj = state.jobs.find(j => j.id === jobId);
    if (!jobObj) return;

    const newApp: Application = {
      id: 'app_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      jobId,
      jobTitle: jobObj.title,
      companyName: jobObj.companyName,
      candidateName: name,
      candidateEmail: email,
      candidatePhone: phone,
      resumeName: cvName,
      passportNumber: passportNumber || 'EH' + Math.floor(1000000 + Math.random() * 9000000),
      passportExpiry: passportExpiry || '2031-12-31',
      bmetCardNumber: bmetCardNumber || '',
      medicalStatus: medicalStatus || 'Pending',
      policeClearance: policeClearance || 'Pending',
      skills: skills || 'General Labor',
      experience: experience || 'Not specified',
      languages: languages || 'Bangla',
      photoName: photoName || 'candidate_avatar.png',
      status: 'Pending',
      coverLetter,
      appliedAt: new Date().toISOString().split('T')[0]
    };

    setState(prev => {
      // Increase applications count on job object
      const updatedJobs = prev.jobs.map(j => {
        if (j.id === jobId) {
          return { ...j, applicationsCount: (j.applicationsCount || 0) + 1 };
        }
        return j;
      });

      return {
        ...prev,
        jobs: updatedJobs,
        applications: [...prev.applications, newApp]
      };
    });
  };

  // Employer post new job
  const handlePostJob = (
    jobData: Omit<Job, 'id' | 'postedAt' | 'applicationsCount'>,
    planAmount: number,
    payMethod: string,
    txID: string
  ) => {
    const newJobId = 'job_' + Date.now();
    const newJob: Job = {
      ...jobData,
      id: newJobId,
      postedAt: new Date().toISOString().split('T')[0],
      applicationsCount: 0
    };

    const seoConfig = generateLocalFallbackSeo('job', newJobId, jobData.title, jobData.description);

    setState(prev => {
      let updatedTx = prev.transactions;
      
      // If there is a premium checkout plan
      if (planAmount > 0) {
        const newTx: Transaction = {
          id: 'tx_' + Date.now(),
          companyName: jobData.companyName,
          planName: 'Featured Job Post Upgrade',
          amount: planAmount,
          method: payMethod as any,
          txID,
          status: 'Pending',
          date: new Date().toISOString().split('T')[0]
        };
        updatedTx = [...prev.transactions, newTx];
      }

      const updatedSeoConfigs = [...(prev.seoConfigs || []), seoConfig];
      const updatedGlobalSeo = updateGlobalSeo(updatedSeoConfigs, prev.globalSeo);

      return {
        ...prev,
        jobs: [...prev.jobs, newJob],
        transactions: updatedTx,
        seoConfigs: updatedSeoConfigs,
        globalSeo: updatedGlobalSeo
      };
    });
  };

  // Employer delete job posting
  const handleDeleteJob = (jobId: string) => {
    setState(prev => {
      return {
        ...prev,
        jobs: prev.jobs.filter(j => j.id !== jobId),
        applications: prev.applications.filter(app => app.jobId !== jobId)
      };
    });
  };

  // Employer update job posting
  const handleUpdateJob = (updatedJob: Job) => {
    setState(prev => {
      const updatedJobs = prev.jobs.map(j => j.id === updatedJob.id ? updatedJob : j);
      return { ...prev, jobs: updatedJobs };
    });
  };

  // Employer update company details
  const handleUpdateCompany = (updatedCompany: Company) => {
    setState(prev => {
      const updatedCompanies = prev.companies.map(c => c.id === updatedCompany.id ? updatedCompany : c);
      
      // If status changed to Verified/Suspended/Blacklisted, log it in system audit logs
      const oldCompany = prev.companies.find(c => c.id === updatedCompany.id);
      let updatedAuditLogs = prev.systemAuditLogs || [];
      if (oldCompany && oldCompany.companyStatus !== updatedCompany.companyStatus) {
        const newLog: SystemAuditLog = {
          id: 'aud_' + Date.now(),
          action: 'Company Status Updated',
          user: 'সুপার এডমিন (Admin)',
          targetId: updatedCompany.id,
          targetName: updatedCompany.name,
          details: `কোম্পানির স্ট্যাটাস "${oldCompany.companyStatus || 'Pending'}" থেকে "${updatedCompany.companyStatus}" এ পরিবর্তন করা হয়েছে। মন্তব্য: "${updatedCompany.verificationRemarks || 'N/A'}"`,
          date: new Date().toLocaleString('bn-BD')
        };
        updatedAuditLogs = [newLog, ...updatedAuditLogs];
      }

      return { 
        ...prev, 
        companies: updatedCompanies,
        systemAuditLogs: updatedAuditLogs
      };
    });
  };

  // Seeker or general user report a company
  const handleReportCompany = (report: Omit<CompanyReport, 'id' | 'status' | 'createdAt'>) => {
    const newReport: CompanyReport = {
      ...report,
      id: 'rep_' + Date.now(),
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setState(prev => {
      const newLog: SystemAuditLog = {
        id: 'aud_' + Date.now(),
        action: 'Company Reported',
        user: report.reporterName + ' (ব্যবহারকারী)',
        targetId: report.companyId,
        targetName: report.companyName,
        details: `শ্রেণী: ${report.category}। বর্ণনা: "${report.description.slice(0, 60)}..."`,
        date: new Date().toLocaleString('bn-BD')
      };
      return {
        ...prev,
        companyReports: [newReport, ...(prev.companyReports || [])],
        systemAuditLogs: [newLog, ...(prev.systemAuditLogs || [])]
      };
    });
  };

  // Admin update report status
  const handleUpdateReportStatus = (
    reportId: string, 
    status: 'Pending' | 'Investigating' | 'Resolved' | 'Dismissed', 
    adminNotes?: string, 
    actionTaken?: string, 
    resolvedBy?: string
  ) => {
    setState(prev => {
      const updatedReports = (prev.companyReports || []).map(rep => {
        if (rep.id === reportId) {
          return {
            ...rep,
            status,
            adminNotes,
            actionTaken,
            resolvedBy,
            resolvedAt: new Date().toISOString().split('T')[0]
          };
        }
        return rep;
      });

      const reportObj = (prev.companyReports || []).find(r => r.id === reportId);
      const newLog: SystemAuditLog = {
        id: 'aud_' + Date.now(),
        action: 'Report Status Updated',
        user: resolvedBy || 'সুপার এডমিন (Admin)',
        targetId: reportId,
        targetName: reportObj?.companyName || 'Unknown Company',
        details: `অভিযোগ নম্বর #${reportId} এর স্ট্যাটাস পরিবর্তন করে "${status}" করা হয়েছে। অ্যাকশন: "${actionTaken || 'N/A'}"`,
        date: new Date().toLocaleString('bn-BD')
      };

      return {
        ...prev,
        companyReports: updatedReports,
        systemAuditLogs: [newLog, ...(prev.systemAuditLogs || [])]
      };
    });
  };

  // Admin blacklist NID, Passport, User or Company
  const handleAddBlacklistItem = (item: Omit<BlacklistedItem, 'id' | 'blacklistedAt'>) => {
    const newItem: BlacklistedItem = {
      ...item,
      id: 'bl_' + Date.now(),
      blacklistedAt: new Date().toISOString().split('T')[0]
    };
    setState(prev => {
      let updatedCompanies = prev.companies;
      if (item.type === 'Company') {
        updatedCompanies = prev.companies.map(c => {
          if (c.id === item.value || c.name === item.value) {
            return {
              ...c,
              companyStatus: 'Blacklisted' as const,
              isApproved: false,
              verificationRemarks: `কালো তালিকাভুক্ত করা হয়েছে। কারণ: ${item.reason}`
            };
          }
          return c;
        });
      }

      const newLog: SystemAuditLog = {
        id: 'aud_' + Date.now(),
        action: `${item.type} Blacklisted`,
        user: item.blacklistedBy,
        targetId: item.value,
        targetName: item.holderName,
        details: `কালো তালিকায় যোগ করা হয়েছে (${item.type}: ${item.value})। কারণ: "${item.reason}"`,
        date: new Date().toLocaleString('bn-BD')
      };

      return {
        ...prev,
        companies: updatedCompanies,
        blacklistItems: [newItem, ...(prev.blacklistItems || [])],
        systemAuditLogs: [newLog, ...(prev.systemAuditLogs || [])]
      };
    });
  };

  const handleRemoveBlacklistItem = (id: string, removedBy: string) => {
    setState(prev => {
      const item = (prev.blacklistItems || []).find(i => i.id === id);
      const updatedBlacklist = (prev.blacklistItems || []).filter(i => i.id !== id);
      
      let updatedCompanies = prev.companies;
      if (item && item.type === 'Company') {
        updatedCompanies = prev.companies.map(c => {
          if (c.id === item.value || c.name === item.value) {
            return {
              ...c,
              companyStatus: 'Pending' as const,
              isApproved: false,
              verificationRemarks: `কালো তালিকা থেকে প্রত্যাহার করা হয়েছে।`
            };
          }
          return c;
        });
      }

      const newLog: SystemAuditLog = {
        id: 'aud_' + Date.now(),
        action: `${item ? item.type : 'Item'} Unblacklisted`,
        user: removedBy,
        targetId: item ? item.value : '',
        targetName: item ? item.holderName : '',
        details: `কালো তালিকা থেকে প্রত্যাহার করা হয়েছে (${item ? item.type : 'Item'}: ${item ? item.value : ''})`,
        date: new Date().toLocaleString('bn-BD')
      };

      return {
        ...prev,
        companies: updatedCompanies,
        blacklistItems: updatedBlacklist,
        systemAuditLogs: [newLog, ...(prev.systemAuditLogs || [])]
      };
    });
  };

  // Log system action
  const handleAddSystemAuditLog = (action: string, user: string, targetId: string, targetName: string, details: string) => {
    setState(prev => {
      const newLog: SystemAuditLog = {
        id: 'aud_' + Date.now(),
        action,
        user,
        targetId,
        targetName,
        details,
        date: new Date().toLocaleString('bn-BD')
      };
      return {
        ...prev,
        systemAuditLogs: [newLog, ...(prev.systemAuditLogs || [])]
      };
    });
  };

  // Employer register new company
  const handleRegisterCompany = (newCompany: Company) => {
    const seoConfig = generateLocalFallbackSeo('company', newCompany.id, newCompany.name, newCompany.description);
    setState(prev => {
      const updatedSeoConfigs = [...(prev.seoConfigs || []), seoConfig];
      const updatedGlobalSeo = updateGlobalSeo(updatedSeoConfigs, prev.globalSeo);
      return {
        ...prev,
        companies: [...prev.companies, newCompany],
        currentEmployerCompanyId: newCompany.id,
        seoConfigs: updatedSeoConfigs,
        globalSeo: updatedGlobalSeo
      };
    });
  };

  const handleUpdateApplication = (updatedApp: Application) => {
    setState(prev => {
      const updatedApps = prev.applications.map(app => app.id === updatedApp.id ? updatedApp : app);
      return {
        ...prev,
        applications: updatedApps
      };
    });
  };

  // BANK SYSTEM HANDLERS
  const handleAddAgentBankAccount = (account: Omit<AgentBankAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: AgentBankAccount = {
      ...account,
      id: 'bank_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setState(prev => ({
      ...prev,
      agentBankAccounts: [newAccount, ...(prev.agentBankAccounts || [])]
    }));
  };

  const handleUpdateAgentBankAccountStatus = (id: string, status: BankAccountStatus, rejectionReason?: string) => {
    setState(prev => ({
      ...prev,
      agentBankAccounts: (prev.agentBankAccounts || []).map(acc => 
        acc.id === id ? { 
          ...acc, 
          status, 
          rejectionReason: rejectionReason || acc.rejectionReason, 
          isVerifiedBadge: status === 'Approved' ? true : acc.isVerifiedBadge,
          updatedAt: new Date().toISOString().split('T')[0] 
        } : acc
      )
    }));
  };

  const handleUpdateAgentBankAccount = (id: string, updates: Partial<AgentBankAccount>) => {
    setState(prev => ({
      ...prev,
      agentBankAccounts: (prev.agentBankAccounts || []).map(acc => 
        acc.id === id ? { ...acc, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : acc
      )
    }));
  };

  const handleDeleteAgentBankAccount = (id: string) => {
    setState(prev => ({
      ...prev,
      agentBankAccounts: (prev.agentBankAccounts || []).filter(acc => acc.id !== id)
    }));
  };

  const handleSubmitClientPayment = (payment: Omit<ClientPaymentSubmission, 'id' | 'agentConfirmation' | 'adminVerification' | 'createdAt'>) => {
    const newSubmission: ClientPaymentSubmission = {
      ...payment,
      id: 'pay_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      agentConfirmation: 'Pending',
      adminVerification: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setState(prev => ({
      ...prev,
      clientPayments: [newSubmission, ...(prev.clientPayments || [])]
    }));
  };

  const handleConfirmClientPaymentByAgent = (id: string, notes?: string) => {
    setState(prev => ({
      ...prev,
      clientPayments: (prev.clientPayments || []).map(p => 
        p.id === id ? { 
          ...p, 
          agentConfirmation: 'Confirmed', 
          agentNotes: notes || p.agentNotes,
          agentConfirmedAt: new Date().toISOString().split('T')[0]
        } : p
      )
    }));
  };

  const handleVerifyClientPaymentByAdmin = (id: string, notes?: string) => {
    setState(prev => ({
      ...prev,
      clientPayments: (prev.clientPayments || []).map(p => 
        p.id === id ? { 
          ...p, 
          adminVerification: 'Verified', 
          adminNotes: notes || p.adminNotes,
          adminVerifiedAt: new Date().toISOString().split('T')[0]
        } : p
      )
    }));
  };

  const handleUpdateAdminBankSettings = (settings: Partial<AdminBankSettings>) => {
    setState(prev => ({
      ...prev,
      adminBankSettings: {
        ...(prev.adminBankSettings || DEFAULT_ADMIN_BANK_SETTINGS),
        ...settings
      }
    }));
  };

  // Employer update application status (Shortlist/Reject)
  const handleUpdateApplicationStatus = (
    appId: string, 
    status: 'Pending' | 'Shortlisted' | 'Rejected',
    interviewDate?: string
  ) => {
    setState(prev => {
      const updatedApps = prev.applications.map(app => {
        if (app.id === appId) {
          return { ...app, status, interviewDate };
        }
        return app;
      });

      // Find candidate details to trigger immediate Mobile Notification
      const activeApp = prev.applications.find(app => app.id === appId);
      let updatedNotifications = prev.notifications;
      
      if (activeApp) {
        const notifTitle = status === 'Shortlisted' ? '🎉 ইন্টারভিউ কল!' : '💼 আবেদনের আপডেট';
        const notifMsg = status === 'Shortlisted'
          ? `${activeApp.companyName} আপনার "${activeApp.jobTitle}" পদের আবেদন শর্টলিস্ট করেছে ও সাক্ষাত্কারের তারিখ নির্ধারণ করেছে।`
          : `আমরা দুঃখিত যে ${activeApp.companyName} আপনার আবেদনটি এই মুহূর্তে বিবেচনা করছে না। আপনার ভবিষ্যৎ পেশার সাফল্য কামনা করি।`;

        const newNotif: Notification = {
          id: 'notif_' + Date.now(),
          title: notifTitle,
          message: notifMsg,
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        };
        updatedNotifications = [...prev.notifications, newNotif];
      }

      return {
        ...prev,
        applications: updatedApps,
        notifications: updatedNotifications
      };
    });
  };

  // Apply for Italy Package
  const handleApplyItalyPackage = (
    packageName: 'Basic' | 'Standard' | 'Premium',
    name: string,
    email: string,
    phone: string,
    passportNumber: string,
    message?: string
  ) => {
    const paySteps = getDefaultPaymentSteps();
    const totAmount = paySteps.reduce((sum, p) => sum + p.amount, 0);

    const newPkgApp: ItalyPackageApplication = {
      id: 'it_pkg_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      packageName,
      candidateName: name,
      candidateEmail: email,
      candidatePhone: phone,
      passportNumber: passportNumber || 'EH' + Math.floor(1000000 + Math.random() * 9000000),
      message: message || '',
      status: 'Pending',
      appliedAt: new Date().toISOString().split('T')[0],
      notes: '',
      priceAmount: `৳${totAmount.toLocaleString()}`,
      visaSteps: getDefaultVisaSteps(),
      paymentSteps: paySteps,
      totalAmount: totAmount,
      discount: 0,
      extraCharges: 0,
      paidAmount: 0,
      dueAmount: totAmount,
      paymentHistory: [],
      agencyId: 'c1', // default agency
      commission: 15000,
      contractStatus: 'Pending'
    };

    setState(prev => {
      // Create a nice system notification as well
      const newNotif = {
        id: 'notif_' + Date.now(),
        title: '🇮🇹 ইতালি প্যাকেজ সাবমিশন',
        message: `${name} নামের একজন প্রার্থী ইতালির ${packageName} প্যাকেজে আবেদন করেছেন।`,
        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      
      return {
        ...prev,
        italyPackages: [...(prev.italyPackages || []), newPkgApp],
        notifications: [...prev.notifications, newNotif]
      };
    });
  };

  // Update Italy Package status
  const handleUpdateItalyPackageStatus = (
    pkgAppId: string,
    status: 'Approved' | 'Rejected' | 'Pending',
    notes?: string,
    priceAmount?: string
  ) => {
    setState(prev => {
      const updatedPackages = (prev.italyPackages || []).map(p => {
        if (p.id === pkgAppId) {
          return { ...p, status, notes, priceAmount };
        }
        return p;
      });
      return {
        ...prev,
        italyPackages: updatedPackages
      };
    });
  };

  // Generic update/add for Italy Package Application
  const handleUpdateItalyPackage = (updatedPkg: ItalyPackageApplication) => {
    setState(prev => {
      const exists = (prev.italyPackages || []).some(p => p.id === updatedPkg.id);
      const updatedPackages = exists
        ? (prev.italyPackages || []).map(p => (p.id === updatedPkg.id ? updatedPkg : p))
        : [...(prev.italyPackages || []), updatedPkg];
      return {
        ...prev,
        italyPackages: updatedPackages
      };
    });
  };

  // Admin approves job
  const handleApproveJob = (id: string) => {
    setState(prev => {
      const updatedJobs = prev.jobs.map(j => {
        if (j.id === id) return { ...j, status: 'Approved' as const };
        return j;
      });
      return { ...prev, jobs: updatedJobs };
    });
  };

  // Admin rejects job
  const handleRejectJob = (id: string) => {
    setState(prev => {
      const updatedJobs = prev.jobs.map(j => {
        if (j.id === id) return { ...j, status: 'Rejected' as const };
        return j;
      });
      return { ...prev, jobs: updatedJobs };
    });
  };

  // Admin approves company
  const handleApproveCompany = (id: string) => {
    setState(prev => {
      const updatedComps = prev.companies.map(c => {
        if (c.id === id) return { ...c, isApproved: true };
        return c;
      });
      return { ...prev, companies: updatedComps };
    });
  };

  // Admin rejects company
  const handleRejectCompany = (id: string) => {
    setState(prev => {
      const updatedComps = prev.companies.map(c => {
        if (c.id === id) return { ...c, isApproved: false };
        return c;
      });
      return { ...prev, companies: updatedComps };
    });
  };

  // Admin verifies manual payment with remarks and advanced status support
  const handleVerifyTransaction = (id: string, status: any, remarks?: string, verifiedBy?: string) => {
    setState(prev => {
      const updatedTxs = prev.transactions.map(t => {
        if (t.id === id) {
          if (status === 'ArchiveToggle') {
            return {
              ...t,
              isArchived: !t.isArchived
            };
          }
          const history = t.history || [];
          return { 
            ...t, 
            status, 
            remarks: remarks || t.remarks || '',
            verifiedBy: verifiedBy || t.verifiedBy || 'Admin/Staff',
            verificationDate: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
            history: [
              ...history,
              {
                changedBy: verifiedBy || 'Admin/Staff',
                oldStatus: t.status,
                newStatus: status,
                date: new Date().toLocaleString('bn-BD', { hour12: true }),
                remarks: remarks || ''
              }
            ]
          };
        }
        return t;
      });

      // Find the transaction and approve the matching company's newly added job too!
      const targetTx = prev.transactions.find(t => t.id === id);
      let updatedJobs = prev.jobs;

      if (targetTx && status === 'Approved') {
        // Find latest pending job of that company
        const latestCompanyJob = prev.jobs
          .filter(j => j.companyName === targetTx.companyName && j.status === 'Pending')
          .pop();

        if (latestCompanyJob) {
          updatedJobs = prev.jobs.map(j => {
            if (j.id === latestCompanyJob.id) {
              return { ...j, status: 'Approved' as const, isPremium: true, isFeatured: true };
            }
            return j;
          });
        }
      }

      return {
        ...prev,
        transactions: updatedTxs,
        jobs: updatedJobs
      };
    });
  };

  // Add new transaction (both Seeker online payment & Admin office payment entry)
  const handleAddTransaction = (newTx: Transaction) => {
    setState(prev => {
      const newLog: SystemAuditLog = {
        id: 'aud_' + Date.now(),
        action: 'Payment Recorded',
        user: newTx.staffName || newTx.applicantName || 'সিস্টেম',
        targetId: newTx.id,
        targetName: newTx.planName || newTx.jobTitle || 'পেমেন্ট',
        details: `নতুন পেমেন্ট রেকর্ড করা হয়েছে। মেথড: ${newTx.method}, পরিমাণ: ৳${newTx.amount.toLocaleString()}, ধরণ: ${newTx.paymentType || 'Online'}${newTx.txID ? ', TxID: ' + newTx.txID : ''}${newTx.receiptNumber ? ', রশিদ নম্বর: ' + newTx.receiptNumber : ''}`,
        date: new Date().toLocaleString('bn-BD')
      };
      return {
        ...prev,
        transactions: [newTx, ...prev.transactions],
        systemAuditLogs: [newLog, ...(prev.systemAuditLogs || [])]
      };
    });
  };

  // Handle updating payment methods (enabled/disabled/API configurations) by Super Admin
  const handleUpdatePaymentMethods = (methods: PaymentMethodSetting[], log?: PaymentAuditLog) => {
    setState(prev => {
      const logs = prev.paymentAuditLogs || [];
      const updatedLogs = log ? [log, ...logs] : logs;
      return {
        ...prev,
        paymentMethods: methods,
        paymentAuditLogs: updatedLogs
      };
    });
  };

  // Admin broadcasts instant push notification to Android
  const handleBroadcastNotification = (title: string, message: string) => {
    const newNotif: Notification = {
      id: 'notif_' + Date.now(),
      title,
      message,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setState(prev => {
      return {
        ...prev,
        notifications: [...prev.notifications, newNotif]
      };
    });
  };

  // Mark all notifications as read inside Android app
  const handleMarkNotificationsAsRead = () => {
    setState(prev => {
      const updatedNotifs = prev.notifications.map(n => ({ ...n, isRead: true }));
      return { ...prev, notifications: updatedNotifs };
    });
  };

  // Mark a single notification as read when clicked to view
  const handleMarkNotificationAsRead = (id: string) => {
    setState(prev => {
      const updatedNotifs = prev.notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      return { ...prev, notifications: updatedNotifs };
    });
  };

  // Admin dynamic updates
  const handleAddCategory = (name: string) => {
    setCategoriesList(prev => [...prev, { name, icon: 'Laptop', count: 0 }]);
  };

  const handleAddLocation = (name: string) => {
    setLocationsList(prev => [...prev, name]);
  };

  if (agencyRoute === 'login') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-slate-900 font-sans antialiased">
        <AgencyLoginScreen 
          state={state}
          onLogin={handleLogin}
          onNavigateHome={() => navigateToAgency(null)}
        />
      </div>
    );
  }

  if (agencyRoute === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-900 font-sans antialiased font-sans">
        <WebPortal 
          jobs={state.jobs}
          companies={state.companies}
          applications={state.applications}
          savedJobs={state.savedJobs}
          currentUserType={state.currentUserType}
          currentSeekerEmail={state.currentSeekerEmail}
          currentEmployerCompanyId={state.currentEmployerCompanyId}
          appliedJobIds={seekerAppliedJobIds}
          notifications={state.notifications}
          italyPackages={state.italyPackages || []}
          companyReports={state.companyReports || []}
          blacklistItems={state.blacklistItems || []}
          transactions={state.transactions}
          onAddTransaction={handleAddTransaction}
          onVerifyTransaction={handleVerifyTransaction}
          onReportCompany={handleReportCompany}
          onToggleUserType={() => setState(p => ({ ...p, currentUserType: p.currentUserType === 'seeker' ? 'employer' : 'seeker' }))}
          onSetUserType={(type) => setState(p => ({ ...p, currentUserType: type }))}
          onToggleSaveJob={handleToggleSaveJob}
          onApplyJob={handleApplyJob}
          onApplyItalyPackage={handleApplyItalyPackage}
          onPostJob={handlePostJob}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onDeleteJob={handleDeleteJob}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onUpdateJob={handleUpdateJob}
          onUpdateCompany={handleUpdateCompany}
          onSetEmployerCompanyId={(id) => setState(p => ({ ...p, currentEmployerCompanyId: id }))}
          onRegisterCompany={handleRegisterCompany}
          onUpdateItalyPackage={handleUpdateItalyPackage}
          currentUser={state.currentUser}
          onOpenAuthModal={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          onSwitchWorkspace={(mode) => setWorkspaceMode(mode)}
          isAgencyOnly={true}
          onNavigateToAgency={navigateToAgency}
        />
      </div>
    );
  }

  // ALWAYS RENDER THE DEDICATED SIMULATOR MULTI-CHANNEL LAYOUT WITH DUAL-PANE OPTION TO SHOW APP OR FULL-WIDTH SCREEN
  const isEmployer = state.currentUser?.role === 'employer';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-900 font-sans antialiased">
      
      {/* Main Production View */}
      {activeSystemView === 'app' ? (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col items-center justify-center animate-fade-in">
          <CandidateApp 
            jobs={state.jobs}
            savedJobs={state.savedJobs}
            notifications={state.notifications}
            onToggleSaveJob={handleToggleSaveJob}
            onApplyJob={handleApplyJob}
            appliedJobIds={seekerAppliedJobIds}
            onAddNotification={(n) => setState(p => ({ ...p, notifications: [...p.notifications, n] }))}
            onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
            onMarkNotificationAsRead={handleMarkNotificationAsRead}
            applications={state.applications}
            currentSeekerEmail={state.currentSeekerEmail}
            italyPackages={state.italyPackages || []}
            onApplyItalyPackage={handleApplyItalyPackage}
            onUpdateItalyPackage={handleUpdateItalyPackage}
            isStandaloneMobileView={true}
          />
        </div>
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Hand Column: Portal or Admin Panel (e.g. 8 cols wide or full width depending on isDualPane) */}
          <div className={isDualPane ? "lg:col-span-8 h-[740px] overflow-y-auto pr-1" : "lg:col-span-12 w-full transition-all duration-300"}>
            {workspaceMode === 'portal' ? (
              <WebPortal 
                jobs={state.jobs}
                companies={state.companies}
                applications={state.applications}
                savedJobs={state.savedJobs}
                currentUserType={state.currentUserType}
                currentSeekerEmail={state.currentSeekerEmail}
                currentEmployerCompanyId={state.currentEmployerCompanyId}
                appliedJobIds={seekerAppliedJobIds}
                notifications={state.notifications}
                italyPackages={state.italyPackages || []}
                companyReports={state.companyReports || []}
                blacklistItems={state.blacklistItems || []}
                transactions={state.transactions}
                onAddTransaction={handleAddTransaction}
                onVerifyTransaction={handleVerifyTransaction}
                onReportCompany={handleReportCompany}
                onToggleUserType={() => setState(p => ({ ...p, currentUserType: p.currentUserType === 'seeker' ? 'employer' : 'seeker' }))}
                onSetUserType={(type) => setState(p => ({ ...p, currentUserType: type }))}
                onToggleSaveJob={handleToggleSaveJob}
                onApplyJob={handleApplyJob}
                onApplyItalyPackage={handleApplyItalyPackage}
                onPostJob={handlePostJob}
                onUpdateApplicationStatus={handleUpdateApplicationStatus}
                onDeleteJob={handleDeleteJob}
                onMarkNotificationAsRead={handleMarkNotificationAsRead}
                onUpdateJob={handleUpdateJob}
                onUpdateCompany={handleUpdateCompany}
                onUpdateApplication={handleUpdateApplication}
                onSetEmployerCompanyId={(id) => setState(p => ({ ...p, currentEmployerCompanyId: id }))}
                onRegisterCompany={handleRegisterCompany}
                onUpdateItalyPackage={handleUpdateItalyPackage}
                currentUser={state.currentUser}
                onOpenAuthModal={() => setAuthModalOpen(true)}
                onLogout={handleLogout}
                onSwitchWorkspace={(mode) => setWorkspaceMode(mode)}
                isAgencyOnly={isEmployer}
                onNavigateToAgency={navigateToAgency}
                bankAccounts={state.agentBankAccounts || []}
                clientPayments={state.clientPayments || []}
                adminBankSettings={state.adminBankSettings || DEFAULT_ADMIN_BANK_SETTINGS}
                onSubmitClientPayment={handleSubmitClientPayment}
                onUpdateAgentBankAccountStatus={handleUpdateAgentBankAccountStatus}
                onUpdateAgentBankAccount={handleUpdateAgentBankAccount}
                onAddAgentBankAccount={handleAddAgentBankAccount}
                onDeleteAgentBankAccount={handleDeleteAgentBankAccount}
                onConfirmClientPaymentByAgent={handleConfirmClientPaymentByAgent}
              />
            ) : (
              <AdminPanel 
                jobs={state.jobs}
                companies={state.companies}
                transactions={state.transactions}
                italyPackages={state.italyPackages || []}
                applications={state.applications}
                paymentMethods={state.paymentMethods}
                paymentAuditLogs={state.paymentAuditLogs || []}
                companyReports={state.companyReports || []}
                blacklistItems={state.blacklistItems || []}
                systemAuditLogs={state.systemAuditLogs || []}
                bankAccounts={state.agentBankAccounts || []}
                clientPayments={state.clientPayments || []}
                adminBankSettings={state.adminBankSettings || DEFAULT_ADMIN_BANK_SETTINGS}
                onUpdateAgentBankAccountStatus={handleUpdateAgentBankAccountStatus}
                onUpdateAgentBankAccount={handleUpdateAgentBankAccount}
                onAddAgentBankAccount={handleAddAgentBankAccount}
                onDeleteAgentBankAccount={handleDeleteAgentBankAccount}
                onVerifyClientPaymentByAdmin={handleVerifyClientPaymentByAdmin}
                onUpdateAdminBankSettings={handleUpdateAdminBankSettings}
                onAddTransaction={handleAddTransaction}
                onUpdateReportStatus={handleUpdateReportStatus}
                onAddBlacklistItem={handleAddBlacklistItem}
                onRemoveBlacklistItem={handleRemoveBlacklistItem}
                onAddSystemAuditLog={handleAddSystemAuditLog}
                onUpdatePaymentMethods={handleUpdatePaymentMethods}
                onApproveJob={handleApproveJob}
                onRejectJob={handleRejectJob}
                onApproveCompany={handleApproveCompany}
                onRejectCompany={handleRejectCompany}
                onVerifyTransaction={handleVerifyTransaction}
                onUpdateItalyPackageStatus={handleUpdateItalyPackageStatus}
                onUpdateItalyPackage={handleUpdateItalyPackage}
                onUpdateApplication={handleUpdateApplication}
                onUpdateApplicationDoc={(appId, field, value) => {
                  setState(prev => {
                    const updatedApps = prev.applications.map(app => {
                      if (app.id === appId) {
                        return { ...app, [field]: value };
                      }
                      return app;
                    });
                    return { ...prev, applications: updatedApps };
                  });
                }}
                onUpdateApplicationStatus={handleUpdateApplicationStatus}
                onBroadcastNotification={handleBroadcastNotification}
                categories={categoriesList}
                locations={locationsList}
                onAddCategory={handleAddCategory}
                onAddLocation={handleAddLocation}
                onUpdateCompany={handleUpdateCompany}
                users={state.users}
                currentUser={state.currentUser}
                loginActivities={state.loginActivities}
                onUpdateUsers={handleUpdateUsers}
                onLogout={handleLogout}
                onOpenAuthModal={() => setAuthModalOpen(true)}
                seoConfigs={state.seoConfigs}
                globalSeo={state.globalSeo}
                onUpdateSeoConfigs={(configs) => setState(prev => ({ ...prev, seoConfigs: configs }))}
                onUpdateGlobalSeo={(settings) => setState(prev => ({ ...prev, globalSeo: settings }))}
                scamAlerts={state.scamAlerts || []}
                scamAuditLogs={state.scamAuditLogs || []}
                onAddScamAlert={(newAlert) => {
                  setState(prev => ({
                    ...prev,
                    scamAlerts: [...(prev.scamAlerts || []), newAlert]
                  }));
                }}
                onUpdateScamAlert={(id, updated) => {
                  setState(prev => {
                    const updatedAlerts = (prev.scamAlerts || []).map(alert => {
                      if (alert.id === id) {
                        return { ...alert, ...updated };
                      }
                      return alert;
                    }).filter(alert => !alert.deleted);
                    
                    let actionType: 'create' | 'approve' | 'archive' | 'unarchive' | 'delete' = 'approve';
                    if (updated.archived === true) actionType = 'archive';
                    else if (updated.archived === false) actionType = 'unarchive';
                    else if (updated.deleted === true) actionType = 'delete';
                    
                    const targetAlert = (prev.scamAlerts || []).find(alert => alert.id === id);
                    const newAuditLog: ScamAuditLog = {
                      id: 'sal_' + Math.floor(1000 + Math.random() * 9000),
                      alertId: id,
                      action: actionType,
                      performedBy: {
                        name: prev.currentUser?.name || 'অফিস স্টাফ',
                        role: (prev.currentUser?.role as any) || 'staff',
                        email: prev.currentUser?.email || 'admin@probashi.gov.bd'
                      },
                      details: `${actionType.toUpperCase()} action taken on fraud alert: ${targetAlert?.title || id}`,
                      timestamp: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
                    };
                    
                    return {
                      ...prev,
                      scamAlerts: updatedAlerts,
                      scamAuditLogs: [...(prev.scamAuditLogs || []), newAuditLog]
                    };
                  });
                }}
              />
            )}
          </div>

          {/* Right Hand Column: Smartphone Mockup Simulator (4 cols wide on large screens) */}
          {isDualPane && (
            <div className="lg:col-span-4 flex justify-center lg:sticky lg:top-24">
              <div className="flex flex-col items-center space-y-3">
                <CandidateApp 
                  jobs={state.jobs}
                  savedJobs={state.savedJobs}
                  notifications={state.notifications}
                  onToggleSaveJob={handleToggleSaveJob}
                  onApplyJob={handleApplyJob}
                  appliedJobIds={seekerAppliedJobIds}
                  onAddNotification={(n) => setState(p => ({ ...p, notifications: [...p.notifications, n] }))}
                  onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
                  onMarkNotificationAsRead={handleMarkNotificationAsRead}
                  applications={state.applications}
                  currentSeekerEmail={state.currentSeekerEmail}
                  italyPackages={state.italyPackages || []}
                  onApplyItalyPackage={handleApplyItalyPackage}
                  onUpdateItalyPackage={handleUpdateItalyPackage}
                />
                
                {/* Phone helper tag */}
                <span className="text-[10px] text-slate-400 font-bold text-center flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> প্রবাসী ক্যান্ডিডেট মোবাইল অ্যাপ
                </span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Footer Branding Info */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500 font-light">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© 2026 Probashi Jobs Pro - প্রবাসী জবস। Designed & Engineered using React + Tailwind CSS + Lucide Icons + Local Database Persistence.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">API Docs</span>
          </div>
        </div>
      </footer>

      {/* Real-time Role-Based Auth System */}
      <AuthSystem 
        lang="bn"
        users={state.users}
        currentUser={state.currentUser}
        loginActivities={state.loginActivities}
        companies={state.companies}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onRegister={handleRegister}
        onUpdateUsers={handleUpdateUsers}
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

    </div>
  );
}

function AgencyLoginScreen({ 
  state, 
  onLogin, 
  onNavigateHome 
}: { 
  state: any; 
  onLogin: (user: PortalUser, activity: LoginActivity) => void; 
  onNavigateHome: () => void; 
}) {
  const [email, setEmail] = useState('employer@example.com');
  const [password, setPassword] = useState('password123');
  const [licenseNumber, setLicenseNumber] = useState('RL-1452');
  const [isTwoFactor, setIsTwoFactor] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !licenseNumber) {
      setError('দয়া করে সব কয়টি ঘর পূরণ করুন।');
      return;
    }

    // Lookup user in state
    const matchedUser = state.users.find(
      (u: PortalUser) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
    );

    if (!matchedUser) {
      setError('ভুল ইমেইল বা পাসওয়ার্ড। দয়া করে সঠিক তথ্য দিন।');
      return;
    }

    if (matchedUser.role !== 'employer') {
      setError('এই অ্যাকাউন্টটি এজেন্সি হিসেবে নিবন্ধিত নয়।');
      return;
    }

    // Success! Generate activity log and login
    const activity: LoginActivity = {
      id: 'act_' + Date.now(),
      userId: matchedUser.id,
      userEmail: matchedUser.email,
      userRole: matchedUser.role,
      loginTime: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString('bn-BD'),
      ipAddress: '103.88.22.45',
      browser: 'Chrome 125',
      device: 'Desktop / Windows',
      country: 'Bangladesh 🇧🇩',
      status: 'Active Session'
    };

    onLogin(matchedUser, activity);
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
      <div className="absolute top-4 right-4">
        <button 
          onClick={onNavigateHome}
          className="text-slate-400 hover:text-white text-xs font-bold transition flex items-center gap-1"
        >
          ← হোম পেজ
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">এজেন্সি রিক্রুটিং পোর্টাল</h2>
        <p className="text-xs text-slate-400 mt-1 font-light">বিএমইটি অনুমোদিত লাইসেন্সধারী এজেন্সিদের জন্য সুরক্ষিত প্যানেল</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">এজেন্সি ইমেইল ঠিকানা</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition font-mono"
            placeholder="agency@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">পাসওয়ার্ড</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition font-mono"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>বিএমইটি আরএল (RL) লাইসেন্স নম্বর</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded">অনুমোদিত</span>
          </label>
          <input 
            type="text" 
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition font-mono"
            placeholder="RL-XXXX"
          />
        </div>

        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={isTwoFactor}
              onChange={(e) => setIsTwoFactor(e.target.checked)}
              className="w-4 h-4 rounded-lg bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
            />
            <span className="text-[11px] text-slate-400">সিকিউর 2FA লগইন সক্রিয় করুন</span>
          </label>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-blue-600/15 transition flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>এজেন্সি প্যানেলে লগইন করুন</span>
        </button>
      </form>
    </div>
  );
}
