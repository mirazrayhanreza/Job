import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit3, Save, Check, X, AlertCircle, Calendar, 
  DollarSign, FileText, CheckCircle2, Clock, ArrowRight, Download, 
  Sparkles, ShieldCheck, RefreshCw, Eye, Settings, Upload, Globe, 
  Building2, UserCheck, ChevronRight, AlertTriangle, Send, CreditCard,
  FileCheck, ShieldAlert, CheckCircle, Info, Filter, ArrowUpRight, Lock, CheckSquare
} from 'lucide-react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface WorkflowStepSetting {
  id: string;
  stepName: string;
  enabled: boolean;
  amount: number;
  currency: string;
  dueDate: string;
  description: string;
  requiredDocuments: string[];
  paymentType: 'Bank' | 'Mobile Banking' | 'Cash' | 'All';
  stepOrder: number;
}

export interface StepDocument {
  id: string;
  docName: string;
  fileUrl: string;
  uploadedBy: 'Agency' | 'Admin' | 'Client';
  uploadDate: string;
  fileSize?: string;
}

export interface CandidateStepProgress {
  stepId: string;
  // Agency status
  agencyStatus: 'Not Started' | 'Documents Uploaded' | 'Verification Pending' | 'Approved' | 'Rejected' | 'Reupload Requested';
  agencyUploadedDocs: StepDocument[];
  agencyRemarks: string;
  agencySubmittedDate?: string;

  // Admin Verification
  adminVerificationStatus: 'Pending' | 'Approved' | 'Rejected' | 'Reupload Requested';
  adminRemarks?: string;
  adminVerifiedDate?: string;

  // Client Payment
  clientPaymentStatus: 'Locked' | 'Payment Pending' | 'Payment Submitted' | 'Payment Completed' | 'Payment Rejected';
  clientPaymentDetails?: {
    paidAmount: number;
    paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'Cash';
    agencyBankAccount: string;
    txId: string;
    receiptFileUrl: string;
    screenshotUrl?: string;
    paymentDate: string;
  };

  // Admin Payment Verification
  adminPaymentVerified: boolean;
  adminPaymentVerifiedDate?: string;
}

export interface ContractWorkflowCandidate {
  id: string;
  name: string;
  passport: string;
  phone: string;
  jobPosition: string;
  country: string;
  agencyName: string;
  contractTotal: number;
  currency: string;
  stepProgress: Record<string, CandidateStepProgress>;
}

// ==========================================
// DEFAULT WORKFLOW STEPS (Admin Configurable)
// ==========================================
export const DEFAULT_WORKFLOW_STEPS: WorkflowStepSetting[] = [
  {
    id: 'step_medical',
    stepName: 'Medical Test & Clearance',
    enabled: true,
    amount: 3500,
    currency: 'BDT',
    dueDate: '2026-08-10',
    description: 'মেডিকেল ফিটনেস টেস্ট ও রিপোর্ট স্ক্যান কপি সংগ্রহ',
    requiredDocuments: ['Medical Report', 'Medical Receipt'],
    paymentType: 'All',
    stepOrder: 1
  },
  {
    id: 'step_calling',
    stepName: 'Calling Visa Application',
    enabled: true,
    amount: 12000,
    currency: 'BDT',
    dueDate: '2026-08-20',
    description: 'কলিং ভিসা প্রসেসিং ও সংশ্লিষ্ট সরকারি ফি',
    requiredDocuments: ['Calling Copy', 'Submission Receipt'],
    paymentType: 'All',
    stepOrder: 2
  },
  {
    id: 'step_visa',
    stepName: 'Visa Stamping & Fee',
    enabled: true,
    amount: 25000,
    currency: 'BDT',
    dueDate: '2026-09-01',
    description: 'দূতাবাস ভিসা স্ট্যাম্পিং ফি ও সার্ভিস চার্জ',
    requiredDocuments: ['Visa Copy', 'Embassy Receipt'],
    paymentType: 'All',
    stepOrder: 3
  },
  {
    id: 'step_mofa',
    stepName: 'MOFA Verification',
    enabled: true,
    amount: 8000,
    currency: 'BDT',
    dueDate: '2026-09-10',
    description: 'পররাষ্ট্র মন্ত্রণালয় (MOFA) নথিপত্র সত্যায়ন',
    requiredDocuments: ['MOFA Certificate'],
    paymentType: 'All',
    stepOrder: 4
  },
  {
    id: 'step_fingerprint',
    stepName: 'Fingerprint & Bio Enrolment',
    enabled: true,
    amount: 2500,
    currency: 'BDT',
    dueDate: '2026-09-18',
    description: 'বায়োমেট্রিক ফিঙ্গারপ্রিন্ট ও মেডিকেল বায়োডাটা',
    requiredDocuments: ['Fingerprint Slip', 'Bio Confirmation'],
    paymentType: 'All',
    stepOrder: 5
  },
  {
    id: 'step_online_submission',
    stepName: 'Online Portal Submission',
    enabled: true,
    amount: 5000,
    currency: 'BDT',
    dueDate: '2026-09-25',
    description: 'অনলাইন ই-ভিসা পোর্টালে তথ্য ও ফাইল জমাদান',
    requiredDocuments: ['Online Submission Receipt'],
    paymentType: 'All',
    stepOrder: 6
  },
  {
    id: 'step_invitation',
    stepName: 'Invitation Letter',
    enabled: true,
    amount: 15000,
    currency: 'BDT',
    dueDate: '2026-10-02',
    description: 'বিদেশী নিয়োগকর্তার অফিশিয়াল আমন্ত্রণপত্র গ্রহণ',
    requiredDocuments: ['Invitation Letter Copy'],
    paymentType: 'All',
    stepOrder: 7
  },
  {
    id: 'step_visa_print',
    stepName: 'Visa Print & Attestation',
    enabled: true,
    amount: 10000,
    currency: 'BDT',
    dueDate: '2026-10-10',
    description: 'চূড়ান্ত ভিসা প্রিন্ট আউট এবং দূতাবাস ক্লিয়ারেন্স',
    requiredDocuments: ['Printed Visa Copy'],
    paymentType: 'All',
    stepOrder: 8
  },
  {
    id: 'step_online_approval',
    stepName: 'Online Ministry Approval (BMET)',
    enabled: true,
    amount: 6000,
    currency: 'BDT',
    dueDate: '2026-10-18',
    description: 'বিএমইটি স্মার্ট কার্ড ও অনলাইন মন্ত্রণালয় অনুমোদন',
    requiredDocuments: ['BMET Clearance Card'],
    paymentType: 'All',
    stepOrder: 9
  },
  {
    id: 'step_flight_ticket',
    stepName: 'Flight Ticket & Departure',
    enabled: true,
    amount: 45000,
    currency: 'BDT',
    dueDate: '2026-10-25',
    description: 'বিমান টিকিট বুকিং এবং ফ্লাইট কনফার্মেশন',
    requiredDocuments: ['Air Ticket PDF', 'Boarding Pass Slip'],
    paymentType: 'All',
    stepOrder: 10
  }
];

// PRESET STEP TEMPLATES FOR QUICK ADDITION
const PRESET_NEW_STEPS = [
  { name: 'Embassy Fee', defaultAmount: 15000, docs: ['Embassy Payment Chalan'] },
  { name: 'Insurance Premium', defaultAmount: 4000, docs: ['Insurance Policy Certificate'] },
  { name: 'BMET Smart Card', defaultAmount: 3500, docs: ['BMET Smart Card Scan'] },
  { name: 'Police Clearance', defaultAmount: 2000, docs: ['Police Verification Report'] },
  { name: 'Smart Card Delivery', defaultAmount: 1500, docs: ['Smart Card Receipt'] },
  { name: 'Residence Permit (Iqama)', defaultAmount: 20000, docs: ['Residency Approval Slip'] },
  { name: 'Work Permit (Nulla Osta)', defaultAmount: 30000, docs: ['Work Permit Document'] },
  { name: 'Labour Card Registration', defaultAmount: 5000, docs: ['Labour Card Copy'] }
];

// MOCK INITIAL CANDIDATE WORKFLOW DATA
const INITIAL_CANDIDATE: ContractWorkflowCandidate = {
  id: 'cand_101',
  name: 'মোঃ আরিফুল ইসলাম',
  passport: 'A09876543',
  phone: '+8801711-223344',
  jobPosition: 'Factory Technician',
  country: 'Romania 🇷🇴',
  agencyName: 'Euro Global Recruitment Agency',
  contractTotal: 250000,
  currency: 'BDT',
  stepProgress: {
    step_medical: {
      stepId: 'step_medical',
      agencyStatus: 'Approved',
      agencyUploadedDocs: [
        { id: 'doc_1', docName: 'Medical Report', fileUrl: 'medical_report_ariful.pdf', uploadedBy: 'Agency', uploadDate: '2026-07-20' },
        { id: 'doc_2', docName: 'Medical Receipt', fileUrl: 'medical_receipt_3500.pdf', uploadedBy: 'Agency', uploadDate: '2026-07-20' }
      ],
      agencyRemarks: 'মেডিকেল ফিটনেস ১০০% ওকে পাওয়া গেছে।',
      adminVerificationStatus: 'Approved',
      adminRemarks: 'ডকুমেন্ট ও ফিটনেস ভেরিফাইড। ক্যান্ডিডেট পেমেন্ট পেজ আনলক করা হয়েছে।',
      clientPaymentStatus: 'Payment Completed',
      clientPaymentDetails: {
        paidAmount: 3500,
        paymentMethod: 'bKash',
        agencyBankAccount: 'bKash Merchant: 01700000000',
        txId: 'BK992817263',
        receiptFileUrl: 'bkash_receipt_3500.png',
        paymentDate: '2026-07-21'
      },
      adminPaymentVerified: true,
      adminPaymentVerifiedDate: '2026-07-21'
    },
    step_calling: {
      stepId: 'step_calling',
      agencyStatus: 'Approved',
      agencyUploadedDocs: [
        { id: 'doc_3', docName: 'Calling Copy', fileUrl: 'calling_visa_romania.pdf', uploadedBy: 'Agency', uploadDate: '2026-07-25' }
      ],
      agencyRemarks: 'কলিং ভিসা কপি রেডি।',
      adminVerificationStatus: 'Approved',
      adminRemarks: 'অনুমোদিত। ক্যান্ডিডেটকে পেমেন্টের জন্য মেসেজ পাঠানো হয়েছে।',
      clientPaymentStatus: 'Payment Pending',
      adminPaymentVerified: false
    }
  }
};

// MOCK AGENCY BANK ACCOUNTS FOR PAYMENT
const AGENCY_VERIFIED_ACCOUNTS = [
  { id: 'acc_1', type: 'Bank Transfer', name: 'City Bank Ltd', accNo: '1102938475001', branch: 'Gulshan Branch', accName: 'Euro Global Recruitment Agency' },
  { id: 'acc_2', type: 'bKash Merchant', name: 'bKash Merchant', accNo: '01712-998877', accName: 'Euro Global Rec' },
  { id: 'acc_3', type: 'Nagad Merchant', name: 'Nagad Merchant', accNo: '01819-554433', accName: 'Euro Global Rec' }
];

interface DynamicContractWorkflowManagerProps {
  initialRole?: 'Admin' | 'Agency' | 'Candidate';
  onUpdateCandidateWorkflow?: (candidate: ContractWorkflowCandidate) => void;
}

export const DynamicContractWorkflowManager: React.FC<DynamicContractWorkflowManagerProps> = ({
  initialRole = 'Admin',
  onUpdateCandidateWorkflow
}) => {
  // Current active role perspective for interactive testing/viewing
  const [activeRole, setActiveRole] = useState<'Admin' | 'Agency' | 'Candidate'>(initialRole);

  // Active Tab inside Component
  const [mainTab, setMainTab] = useState<'workflow_builder' | 'candidate_tracker' | 'verification_queue'>('candidate_tracker');

  // Master Step Configuration State
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStepSetting[]>(DEFAULT_WORKFLOW_STEPS);

  // Candidate Data State
  const [candidateData, setCandidateData] = useState<ContractWorkflowCandidate>(INITIAL_CANDIDATE);

  // Modal States
  const [editingStep, setEditingStep] = useState<WorkflowStepSetting | null>(null);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [newStepNameInput, setNewStepNameInput] = useState('');
  const [newStepAmountInput, setNewStepAmountInput] = useState('5000');
  const [newStepDocInput, setNewStepDocInput] = useState('');
  const [newStepDescInput, setNewStepDescInput] = useState('');

  // Agency Upload Modal State
  const [agencyUploadStepId, setAgencyUploadStepId] = useState<string | null>(null);
  const [agencyDocName, setAgencyDocName] = useState('');
  const [agencyFileSimulated, setAgencyFileSimulated] = useState('');
  const [agencyRemarksInput, setAgencyRemarksInput] = useState('');

  // Admin Verification Action Modal State
  const [adminVerifyStepId, setAdminVerifyStepId] = useState<string | null>(null);
  const [adminRemarksInput, setAdminRemarksInput] = useState('');

  // Client Payment Modal State
  const [clientPayStepId, setClientPayStepId] = useState<string | null>(null);
  const [payMethodSelect, setPayMethodSelect] = useState<'bKash' | 'Nagad' | 'Bank Transfer'>('bKash');
  const [clientTxIdInput, setClientTxIdInput] = useState('');
  const [clientReceiptSimulated, setClientReceiptSimulated] = useState('');

  // Admin Payment Verify Modal State
  const [adminPayVerifyStepId, setAdminPayVerifyStepId] = useState<string | null>(null);

  // Filter State
  const [stepSearch, setStepSearch] = useState('');

  // ==========================================
  // FINANCIAL COMPUTATIONS (AUTOMATIC BALANCE)
  // ==========================================
  // Total Contract Amount
  const totalContractAmount = candidateData.contractTotal;

  // Calculate Paid Amount from Completed Steps
  const paidAmountSum = Object.keys(candidateData.stepProgress).reduce((acc, stepId) => {
    const prog = candidateData.stepProgress[stepId];
    if (prog && prog.adminPaymentVerified && prog.clientPaymentDetails) {
      return acc + prog.clientPaymentDetails.paidAmount;
    }
    return acc;
  }, 0);

  // Calculate Remaining Contract Balance
  const remainingBalance = Math.max(0, totalContractAmount - paidAmountSum);

  // Identify Next Due Step
  const enabledStepsSorted = [...workflowSteps].filter(s => s.enabled).sort((a, b) => a.stepOrder - b.stepOrder);
  const nextDueStep = enabledStepsSorted.find(s => {
    const prog = candidateData.stepProgress[s.id];
    return !prog || !prog.adminPaymentVerified;
  });

  // ==========================================
  // ADMIN WORKFLOW BUILDER HANDLERS
  // ==========================================
  const handleToggleStepEnable = (stepId: string) => {
    setWorkflowSteps(prev => prev.map(s => s.id === stepId ? { ...s, enabled: !s.enabled } : s));
  };

  const handleOpenEditStep = (step: WorkflowStepSetting) => {
    setEditingStep({ ...step });
  };

  const handleSaveEditedStep = () => {
    if (!editingStep) return;
    setWorkflowSteps(prev => prev.map(s => s.id === editingStep.id ? editingStep : s));
    setEditingStep(null);
    alert('✅ ওয়ার্কফ্লো ধাপের সেটিংস সফলভাবে সেভ করা হয়েছে!');
  };

  const handleAddNewStepCustom = (presetName?: string, presetAmount?: number, presetDocs?: string[]) => {
    const name = presetName || newStepNameInput;
    if (!name.trim()) {
      alert('ধাপের নাম প্রবেশ করুন!');
      return;
    }

    const newStepObj: WorkflowStepSetting = {
      id: `step_custom_${Date.now()}`,
      stepName: name,
      enabled: true,
      amount: presetAmount || Number(newStepAmountInput) || 5000,
      currency: 'BDT',
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      description: newStepDescInput || `${name} প্রক্রিয়াকরণ ধাপ`,
      requiredDocuments: presetDocs || (newStepDocInput ? newStepDocInput.split(',').map(d => d.trim()) : [`${name} Document`]),
      paymentType: 'All',
      stepOrder: workflowSteps.length + 1
    };

    setWorkflowSteps(prev => [...prev, newStepObj]);
    setNewStepNameInput('');
    setNewStepDocInput('');
    setNewStepDescInput('');
    setIsAddStepModalOpen(false);
    alert(`🎉 নতুন ওয়ার্কফ্লো ধাপ "${name}" যুক্ত করা হয়েছে!`);
  };

  const handleDeleteStep = (stepId: string) => {
    if (confirm('আপনি কি নিশ্চিত এই ওয়ার্কফ্লো ধাপটি মুছে ফেলতে চান?')) {
      setWorkflowSteps(prev => prev.filter(s => s.id !== stepId));
    }
  };

  // ==========================================
  // AGENCY HANDLERS
  // ==========================================
  const handleAgencySubmitDocs = () => {
    if (!agencyUploadStepId || !agencyDocName) {
      alert('দয়া করে ডকুমেন্টের নাম প্রদান করুন!');
      return;
    }

    setCandidateData(prev => {
      const stepProg = prev.stepProgress[agencyUploadStepId] || {
        stepId: agencyUploadStepId,
        agencyStatus: 'Not Started',
        agencyUploadedDocs: [],
        agencyRemarks: '',
        adminVerificationStatus: 'Pending',
        clientPaymentStatus: 'Locked',
        adminPaymentVerified: false
      };

      const newDoc: StepDocument = {
        id: `doc_${Date.now()}`,
        docName: agencyDocName,
        fileUrl: agencyFileSimulated || `${agencyDocName.toLowerCase().replace(/\s+/g, '_')}_copy.pdf`,
        uploadedBy: 'Agency',
        uploadDate: new Date().toISOString().split('T')[0]
      };

      const updatedProgress: CandidateStepProgress = {
        ...stepProg,
        agencyStatus: 'Verification Pending',
        agencyUploadedDocs: [...stepProg.agencyUploadedDocs, newDoc],
        agencyRemarks: agencyRemarksInput || 'নথিপত্র প্রস্তুত ও জমা দেওয়া হয়েছে।',
        agencySubmittedDate: new Date().toISOString().split('T')[0],
        adminVerificationStatus: 'Pending'
      };

      const updated = {
        ...prev,
        stepProgress: {
          ...prev.stepProgress,
          [agencyUploadStepId]: updatedProgress
        }
      };
      if (onUpdateCandidateWorkflow) onUpdateCandidateWorkflow(updated);
      return updated;
    });

    setAgencyUploadStepId(null);
    setAgencyDocName('');
    setAgencyRemarksInput('');
    alert('📄 এজেন্সি ডকুমেন্ট সফলভাবে জমা হয়েছে! স্ট্যাটাস: "Waiting for Admin Verification"');
  };

  // ==========================================
  // ADMIN DOCUMENT VERIFICATION HANDLERS
  // ==========================================
  const handleAdminVerifyDocs = (stepId: string, action: 'Approve' | 'Reject' | 'Reupload Requested') => {
    setCandidateData(prev => {
      const stepProg = prev.stepProgress[stepId];
      if (!stepProg) return prev;

      let newAgencyStatus = stepProg.agencyStatus;
      let newAdminVerifStatus: 'Pending' | 'Approved' | 'Rejected' | 'Reupload Requested' = 'Pending';
      let newClientPayStatus = stepProg.clientPaymentStatus;

      if (action === 'Approve') {
        newAgencyStatus = 'Approved';
        newAdminVerifStatus = 'Approved';
        newClientPayStatus = 'Payment Pending'; // Unlock step for client payment
      } else if (action === 'Reject') {
        newAgencyStatus = 'Rejected';
        newAdminVerifStatus = 'Rejected';
        newClientPayStatus = 'Locked';
      } else if (action === 'Reupload Requested') {
        newAgencyStatus = 'Reupload Requested';
        newAdminVerifStatus = 'Reupload Requested';
        newClientPayStatus = 'Locked';
      }

      const updatedProgress: CandidateStepProgress = {
        ...stepProg,
        agencyStatus: newAgencyStatus,
        adminVerificationStatus: newAdminVerifStatus,
        adminRemarks: adminRemarksInput || (action === 'Approve' ? 'ডকুমেন্ট ভেরিফাইড ও ক্লায়েন্ট ভিউ আনলক করা হয়েছে।' : 'ডকুমেন্টে সমস্যা পাওয়া গেছে।'),
        adminVerifiedDate: new Date().toISOString().split('T')[0],
        clientPaymentStatus: newClientPayStatus
      };

      const updated = {
        ...prev,
        stepProgress: {
          ...prev.stepProgress,
          [stepId]: updatedProgress
        }
      };
      if (onUpdateCandidateWorkflow) onUpdateCandidateWorkflow(updated);
      return updated;
    });

    setAdminVerifyStepId(null);
    setAdminRemarksInput('');
    alert(action === 'Approve' ? '✅ ডকুমেন্ট অনুমোদিত! ক্লায়েন্ট ড্যাশবোর্ডে "Pay Now" অপশন আনলক হয়েছে।' : '❌ ডকুমেন্ট রিজেক্ট/পুনরায় আপলোডের জন্য পাঠানো হয়েছে।');
  };

  // ==========================================
  // CLIENT PAYMENT HANDLERS
  // ==========================================
  const handleClientSubmitPayment = () => {
    if (!clientPayStepId || !clientTxIdInput) {
      alert('দয়া করে Transaction ID প্রদান করুন!');
      return;
    }

    const currentStepConfig = workflowSteps.find(s => s.id === clientPayStepId);

    setCandidateData(prev => {
      const stepProg = prev.stepProgress[clientPayStepId];
      if (!stepProg) return prev;

      const updatedProgress: CandidateStepProgress = {
        ...stepProg,
        clientPaymentStatus: 'Payment Submitted',
        clientPaymentDetails: {
          paidAmount: currentStepConfig?.amount || 0,
          paymentMethod: payMethodSelect,
          agencyBankAccount: 'Euro Global Verified Bank / Merchant Account',
          txId: clientTxIdInput,
          receiptFileUrl: clientReceiptSimulated || `payment_receipt_${clientTxIdInput}.png`,
          paymentDate: new Date().toISOString().split('T')[0]
        }
      };

      const updated = {
        ...prev,
        stepProgress: {
          ...prev.stepProgress,
          [clientPayStepId]: updatedProgress
        }
      };
      if (onUpdateCandidateWorkflow) onUpdateCandidateWorkflow(updated);
      return updated;
    });

    setClientPayStepId(null);
    setClientTxIdInput('');
    alert('💳 আপনার পেমেন্ট রসিদ ও Transaction ID জমা করা হয়েছে! এডমিন ভেরিফিকেশনের পর পেমেন্ট কনফার্ম হবে।');
  };

  // ==========================================
  // ADMIN PAYMENT VERIFICATION HANDLERS
  // ==========================================
  const handleAdminVerifyPayment = (stepId: string, isApprove: boolean) => {
    setCandidateData(prev => {
      const stepProg = prev.stepProgress[stepId];
      if (!stepProg) return prev;

      const updatedProgress: CandidateStepProgress = {
        ...stepProg,
        clientPaymentStatus: isApprove ? 'Payment Completed' : 'Payment Rejected',
        adminPaymentVerified: isApprove,
        adminPaymentVerifiedDate: isApprove ? new Date().toISOString().split('T')[0] : undefined
      };

      const updated = {
        ...prev,
        stepProgress: {
          ...prev.stepProgress,
          [stepId]: updatedProgress
        }
      };
      if (onUpdateCandidateWorkflow) onUpdateCandidateWorkflow(updated);
      return updated;
    });

    setAdminPayVerifyStepId(null);
    alert(isApprove ? '🎉 পেমেন্ট সফলভাবে ভেরিফাই করা হয়েছে! চুক্তির বকেয়া ব্যালেন্স স্বয়ংক্রিয়ভাবে আপডেট করা হলো।' : '❌ পেমেন্ট বাতিল করা হয়েছে।');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 text-slate-100 shadow-2xl space-y-6 font-sans animate-fade-in">
      
      {/* HEADER BAR & ROLE SWITCHER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Dynamic Contract & Payment Workflow Manager
            </h2>
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black px-2.5 py-0.5 rounded-full">
              Full System
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            প্রতিটি দেশ, এজেন্সি ও জব অনুযায়ী কাস্টমাইজযোগ্য ৯+ স্টেপ ওয়ার্কফ্লো এবং রিয়েল-টাইম ব্যালেন্স আপডেট
          </p>
        </div>

        {/* ROLE PERSPECTIVE SWITCHER */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-black text-slate-400 px-2">ভিউ মোড:</span>
          {(initialRole === 'Admin' 
            ? (['Admin', 'Agency', 'Candidate'] as const)
            : initialRole === 'Agency'
            ? (['Agency', 'Candidate'] as const)
            : (['Candidate'] as const)
          ).map(role => (
            <button
              key={role}
              onClick={() => {
                setActiveRole(role);
                if (role !== 'Admin' && (mainTab === 'workflow_builder' || mainTab === 'verification_queue')) {
                  setMainTab('candidate_tracker');
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                activeRole === role
                  ? role === 'Admin' ? 'bg-amber-500 text-slate-950 shadow-md'
                    : role === 'Agency' ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {role === 'Admin' && '🛡️ Admin / Staff'}
              {role === 'Agency' && '🏢 Agency'}
              {role === 'Candidate' && '👤 Client / Candidate'}
            </button>
          ))}
        </div>
      </div>

      {/* COMPONENT SUB-NAVIGATION */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setMainTab('candidate_tracker')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-2 cursor-pointer ${
            mainTab === 'candidate_tracker'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>প্রার্থীর চুক্তি ও ওয়ার্কফ্লো ট্র্যাকার (Candidate Tracker)</span>
        </button>

        {activeRole === 'Admin' && (
          <button
            onClick={() => setMainTab('workflow_builder')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-2 cursor-pointer ${
              mainTab === 'workflow_builder'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>⚙️ 1. Workflow Builder (Admin Step Manager)</span>
          </button>
        )}

        {activeRole === 'Admin' && (
          <button
            onClick={() => setMainTab('verification_queue')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-2 cursor-pointer ${
              mainTab === 'verification_queue'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>📋 ৪/৭. Verification Hub (Document & Payment Approval)</span>
          </button>
        )}
      </div>

      {/* REAL-TIME CONTRACT BALANCE KPI CARDS (SPECIFICATION 9) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">চুক্তির মোট মূল্য (Contract Total)</span>
          <div className="text-xl font-black text-white font-mono">
            ৳{totalContractAmount.toLocaleString()} {candidateData.currency}
          </div>
          <span className="text-[10px] text-slate-500">প্রার্থী: {candidateData.name} ({candidateData.country})</span>
        </div>

        <div className="bg-slate-950/90 p-4 rounded-2xl border border-emerald-900/50 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">মোট পরিশোধিত টাকা (Paid) ✔</span>
          <div className="text-xl font-black text-emerald-400 font-mono">
            ৳{paidAmountSum.toLocaleString()} BDT
          </div>
          <span className="text-[10px] text-emerald-300/80">স্বয়ংক্রিয় হিসাবকৃত পেইড স্ট্যাটাস</span>
        </div>

        <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-900/50 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400 block">অবশিষ্ট চুক্তির ব্যালেন্স (Remaining)</span>
          <div className="text-xl font-black text-amber-300 font-mono">
            ৳{remainingBalance.toLocaleString()} BDT
          </div>
          <span className="text-[10px] text-amber-400/80 font-bold">Auto Balance Updated</span>
        </div>

        <div className="bg-slate-950/90 p-4 rounded-2xl border border-blue-900/50 space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-400 block">পরবর্তী Due ধাপ (Next Due)</span>
          <div className="text-sm font-black text-blue-300 truncate">
            {nextDueStep ? `${nextDueStep.stepName}` : 'সব ধাপ সম্পন্ন! 🎉'}
          </div>
          <span className="text-[10px] text-blue-400 font-mono font-bold block">
            {nextDueStep ? `Due: ৳${nextDueStep.amount.toLocaleString()} BDT` : 'Payment Complete'}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. WORKFLOW BUILDER (ADMIN VIEW)                                          */}
      {/* ========================================================================= */}
      {mainTab === 'workflow_builder' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                ১. Workflow Builder & Settings (Admin)
              </h3>
              <p className="text-xs text-slate-400">
                প্রতিটি স্টেপের নাম, Enable/Disable, ফি এর পরিমাণ, প্রয়োজনীয় ডকুমেন্টস এবং ক্রম পরিবর্তন করুন
              </p>
            </div>

            <button
              onClick={() => setIsAddStepModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>➕ New Step যোগ করুন</span>
            </button>
          </div>

          {/* PRESET QUICK ADD SUGGESTIONS */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">⚡ দ্রুত কাস্টম নতুন ধাপ যুক্ত করার জন্য প্রি-সেট অপশন:</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_NEW_STEPS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddNewStepCustom(preset.name, preset.defaultAmount, preset.docs)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span>{preset.name}</span>
                  <span className="text-[9.5px] text-amber-300 font-mono">(৳{preset.defaultAmount.toLocaleString()})</span>
                </button>
              ))}
            </div>
          </div>

          {/* WORKFLOW STEPS LIST TABLE */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-black uppercase text-slate-400">মোট কনফিগার করা ধাপ ({workflowSteps.length} টি)</span>
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="ধাপ ফিল্টার করুন..."
                  value={stepSearch}
                  onChange={e => setStepSearch(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Order</th>
                    <th className="p-3">Step Name</th>
                    <th className="p-3">Enable/Disable</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Required Docs</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {workflowSteps
                    .filter(s => s.stepName.toLowerCase().includes(stepSearch.toLowerCase()))
                    .map((step) => (
                      <tr key={step.id} className="hover:bg-slate-900/50 transition">
                        <td className="p-3 font-mono font-bold text-slate-400">#{step.stepOrder}</td>
                        <td className="p-3">
                          <span className="font-extrabold text-white block">{step.stepName}</span>
                          <span className="text-[10.5px] text-slate-400">{step.description}</span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleStepEnable(step.id)}
                            className={`px-2.5 py-1 rounded-full text-[10.5px] font-black transition cursor-pointer ${
                              step.enabled 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {step.enabled ? '✔ Active' : '✖ Disabled'}
                          </button>
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-300">
                          ৳{step.amount.toLocaleString()} {step.currency}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {step.requiredDocuments.map((doc, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-[10px] text-slate-300 rounded font-mono">
                                📄 {doc}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 font-mono text-slate-400">{step.dueDate}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditStep(step)}
                              className="px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/30 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteStep(step.id)}
                              className="p-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CANDIDATE & AGENCY WORKFLOW TRACKER                                   */}
      {/* ========================================================================= */}
      {mainTab === 'candidate_tracker' && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                ক্যান্ডিডেট চুক্তি ও পেমেন্ট ট্র্যাকিং পেজ ({activeRole} View)
              </h3>
              <p className="text-xs text-slate-400">
                {activeRole === 'Agency' && 'এজেন্সি শুধুমাত্র চালু থাকা (Enabled) ধাপগুলো দেখবে এবং ফাইল আপলোড করতে পারবে।'}
                {activeRole === 'Candidate' && 'ক্লায়েন্ট শুধুমাত্র এডমিন অনুমোদিত (Approved) ধাপসমূহ দেখতে ও পেমেন্ট সম্পন্ন করতে পারবে।'}
                {activeRole === 'Admin' && 'এডমিন সকল ধাপের অগ্রগতি এবং পেমেন্ট রিয়েল-টাইমে তদারকি করতে পারে।'}
              </p>
            </div>
            
            <div className="text-xs bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-300 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">আবেদনকারী পাসপোর্ট & এজেন্সি:</span>
              <span className="font-extrabold text-white">{candidateData.name} ({candidateData.passport})</span>
              <span className="text-amber-400 block font-mono text-[11px]">🏢 {candidateData.agencyName}</span>
            </div>
          </div>

          {/* WORKFLOW STEPS GRID (ROLE SPECIFIC) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflowSteps
              .filter(step => step.enabled)
              .map((step) => {
                const prog = candidateData.stepProgress[step.id] || {
                  stepId: step.id,
                  agencyStatus: 'Not Started',
                  agencyUploadedDocs: [],
                  agencyRemarks: '',
                  adminVerificationStatus: 'Pending',
                  clientPaymentStatus: 'Locked',
                  adminPaymentVerified: false
                };

                // Visibility Rule for Client/Candidate (Specification 5):
                // Client cannot see step unless Admin approves agency documents
                const isClientApproved = prog.adminVerificationStatus === 'Approved';
                if (activeRole === 'Candidate' && !isClientApproved) {
                  return (
                    <div key={step.id} className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/50 opacity-60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center font-black text-slate-600">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-400 text-sm">{step.stepName}</h4>
                          <span className="text-[10px] text-slate-500 block">🔒 নথি ভেরিফিকেশন ও এডমিন অনুমোদন প্রক্রিয়াধীন</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-slate-900 text-slate-500 font-bold px-2.5 py-1 rounded-full border border-slate-800">
                        লকড (Pending Admin)
                      </span>
                    </div>
                  );
                }

                return (
                  <div 
                    key={step.id} 
                    className={`bg-slate-950 p-5 rounded-2xl border transition space-y-3 relative ${
                      prog.adminPaymentVerified 
                        ? 'border-emerald-600/40 bg-emerald-950/10' 
                        : isClientApproved 
                          ? 'border-blue-500/40 bg-blue-950/10' 
                          : 'border-slate-800'
                    }`}
                  >
                    {/* STEP TOP BADGE & NAME */}
                    <div className="flex justify-between items-start gap-2 border-b border-slate-800/80 pb-2.5">
                      <div>
                        <span className="text-[9.5px] uppercase font-black text-amber-400 font-mono">
                          Step #{step.stepOrder} • {step.dueDate}
                        </span>
                        <h4 className="font-black text-white text-base leading-snug">{step.stepName}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{step.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-amber-300 font-mono block">
                          ৳{step.amount.toLocaleString()} {step.currency}
                        </span>
                        {/* Status Label */}
                        {prog.adminPaymentVerified ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Paid ✔ (Verified)
                          </span>
                        ) : prog.clientPaymentStatus === 'Payment Submitted' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Payment Verification Pending
                          </span>
                        ) : isClientApproved ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-flex items-center gap-1">
                            <DollarSign className="w-3 h-3" /> Unlocked for Client Payment
                          </span>
                        ) : prog.agencyStatus === 'Verification Pending' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Waiting for Admin Verification
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                            {prog.agencyStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* UPLOADED DOCUMENTS SHOWCASE */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">নথিপত্র তালিকা (Attached Documents):</span>
                      {prog.agencyUploadedDocs.length === 0 ? (
                        <div className="text-[11px] text-slate-500 italic bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                          এখনো কোনো নথি আপলোড করা হয়নি।
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {prog.agencyUploadedDocs.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
                              <div className="flex items-center gap-2 truncate">
                                <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="font-bold text-slate-200 truncate">{doc.docName}</span>
                                <span className="text-[9.5px] text-slate-500 font-mono">({doc.uploadDate})</span>
                              </div>
                              <button 
                                onClick={() => alert(`ডকুমেন্ট "${doc.docName}" ডাউনলোড হচ্ছে...`)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer shrink-0"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ROLE-BASED ACTION BUTTONS */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      
                      {/* 1. AGENCY ACTIONS */}
                      {activeRole === 'Agency' && (
                        <div className="w-full flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {prog.agencyStatus === 'Approved' ? '✅ অনুমোদিত নথি' : 'ফাইল আপলোড করে এডমিনের নিকট পাঠান'}
                          </span>
                          <button
                            onClick={() => {
                              setAgencyUploadStepId(step.id);
                              setAgencyDocName(step.requiredDocuments[0] || 'Medical Report');
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Documents</span>
                          </button>
                        </div>
                      )}

                      {/* 2. ADMIN ACTIONS */}
                      {activeRole === 'Admin' && (
                        <div className="w-full flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setAgencyUploadStepId(step.id);
                                setAgencyDocName(step.requiredDocuments[0] || 'Step Document');
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload Doc</span>
                            </button>
                            <button
                              onClick={() => setAdminVerifyStepId(step.id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black rounded-lg transition flex items-center gap-1 cursor-pointer"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verify Docs ({prog.adminVerificationStatus})</span>
                            </button>
                          </div>

                          {prog.clientPaymentStatus === 'Payment Submitted' && (
                            <button
                              onClick={() => setAdminPayVerifyStepId(step.id)}
                              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black rounded-lg transition flex items-center gap-1 cursor-pointer shadow-md animate-pulse"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Verify Payment (৳{step.amount.toLocaleString()})</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* 3. CANDIDATE / CLIENT ACTIONS (SPECIFICATION 5 & 6) */}
                      {activeRole === 'Candidate' && (
                        <div className="w-full space-y-2">
                          {isClientApproved && !prog.adminPaymentVerified && (
                            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
                              <span className="text-[10.5px] text-amber-300 font-bold block">
                                💳 পরিশোধের মাধ্যম: এজেন্সির ভেরিফাইড ব্যাংক / বিকাশ
                              </span>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
                                {AGENCY_VERIFIED_ACCOUNTS.map(acc => (
                                  <div key={acc.id} className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                                    <span className="font-extrabold text-white block">{acc.name}</span>
                                    <span className="font-mono text-amber-300 block">{acc.accNo}</span>
                                    <span className="text-slate-400 block">{acc.accName}</span>
                                  </div>
                                ))}
                              </div>

                              {prog.clientPaymentStatus === 'Payment Submitted' ? (
                                <div className="p-2 bg-yellow-500/20 text-yellow-300 rounded-lg text-xs font-bold border border-yellow-500/30 flex items-center justify-between">
                                  <span>পেমেন্ট রসিদ ও TxID ({prog.clientPaymentDetails?.txId}) জমা হয়েছে। এডমিন ভেরিফিকেশনের অপেক্ষায়।</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setClientPayStepId(step.id)}
                                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                                >
                                  <CreditCard className="w-4 h-4" />
                                  <span>Pay Now (৳{step.amount.toLocaleString()} BDT) & Upload Receipt</span>
                                </button>
                              )}
                            </div>
                          )}

                          {prog.adminPaymentVerified && (
                            <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-extrabold rounded-xl flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                পেমেন্ট সম্পন্ন এবং এডমিন দ্বারা ভেরিফাইড!
                              </span>
                              <span className="font-mono text-[11px] text-slate-300">
                                Date: {prog.clientPaymentDetails?.paymentDate || '2026-07-21'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VERIFICATION HUB (ADMIN VERIFICATION QUEUE)                             */}
      {/* ========================================================================= */}
      {mainTab === 'verification_queue' && activeRole === 'Admin' && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              ৪ & ৭. Admin Verification Queue (নথিপত্র ও পেমেন্ট ভেরিফিকেশন)
            </h3>
            <p className="text-xs text-slate-400">
              এজেন্সি কর্তৃক জমাকৃত ডকুমেন্টস এবং ক্যান্ডিডেটের পেমেন্ট ট্রানজেকশন অনুমোদন বা রিজেক্ট করুন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* DOCUMENT VERIFICATION LIST */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <FileText className="w-4 h-4" />
                ১. এজেন্সি ডকুমেন্ট ভেরিফিকেশন অপেক্ষমান
              </h4>

              {Object.keys(candidateData.stepProgress).length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 text-center">কোনো নথি পেন্ডিং নেই</p>
              ) : (
                Object.keys(candidateData.stepProgress).map(stepId => {
                  const prog = candidateData.stepProgress[stepId];
                  const stepObj = workflowSteps.find(s => s.id === stepId);
                  if (!prog || !stepObj) return null;

                  return (
                    <div key={stepId} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-white">{stepObj.stepName}</span>
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-full">
                          {prog.adminVerificationStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">মন্তব্য: {prog.agencyRemarks || 'কোনো মন্তব্য নেই'}</p>
                      
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleAdminVerifyDocs(stepId, 'Approve')}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleAdminVerifyDocs(stepId, 'Reupload Requested')}
                          className="flex-1 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-[11px] rounded-lg transition"
                        >
                          🔄 Request Reupload
                        </button>
                        <button
                          onClick={() => handleAdminVerifyDocs(stepId, 'Reject')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-lg transition"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* PAYMENT VERIFICATION LIST */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <CreditCard className="w-4 h-4" />
                ২. ক্লায়েন্ট পেমেন্ট ভেরিফিকেশন (TxID Checking)
              </h4>

              {Object.keys(candidateData.stepProgress).filter(id => candidateData.stepProgress[id].clientPaymentStatus === 'Payment Submitted').length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs italic">
                  কোনো ক্লায়েন্ট পেমেন্ট পেন্ডিং নেই।
                </div>
              ) : (
                Object.keys(candidateData.stepProgress)
                  .filter(id => candidateData.stepProgress[id].clientPaymentStatus === 'Payment Submitted')
                  .map(stepId => {
                    const prog = candidateData.stepProgress[stepId];
                    const stepObj = workflowSteps.find(s => s.id === stepId);
                    if (!prog || !stepObj) return null;

                    return (
                      <div key={stepId} className="p-3 bg-slate-900 rounded-xl border border-emerald-900/60 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-white">{stepObj.stepName}</span>
                          <span className="font-mono text-emerald-400 font-black">
                            ৳{stepObj.amount.toLocaleString()} BDT
                          </span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-lg text-[11px] space-y-0.5">
                          <p className="text-slate-300 font-mono">
                            TxID: <strong className="text-amber-300">{prog.clientPaymentDetails?.txId}</strong>
                          </p>
                          <p className="text-slate-400">মেথড: {prog.clientPaymentDetails?.paymentMethod}</p>
                          <p className="text-slate-400">তারিখ: {prog.clientPaymentDetails?.paymentDate}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleAdminVerifyPayment(stepId, true)}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-lg transition cursor-pointer shadow-md"
                          >
                            ✅ Approve Payment & Update Balance
                          </button>
                          <button
                            onClick={() => handleAdminVerifyPayment(stepId, false)}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW STEP MODAL (ADMIN)                                       */}
      {/* ========================================================================= */}
      {isAddStepModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                নতুন ওয়ার্কফ্লো ধাপ যুক্ত করুন (➕ New Step)
              </h3>
              <button 
                onClick={() => setIsAddStepModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">ধাপের নাম (Step Name):</label>
                <input
                  type="text"
                  placeholder="যেমন: BMET Clearance Card, Police Verification..."
                  value={newStepNameInput}
                  onChange={e => setNewStepNameInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">ফি এর পরিমাণ (BDT):</label>
                  <input
                    type="number"
                    value={newStepAmountInput}
                    onChange={e => setNewStepAmountInput(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">প্রয়োজনীয় ডকুমেন্টস:</label>
                  <input
                    type="text"
                    placeholder="Report, Receipt (comma separated)"
                    value={newStepDocInput}
                    onChange={e => setNewStepDocInput(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">সংক্ষিপ্ত বিবরণ (Description):</label>
                <textarea
                  rows={2}
                  placeholder="ধাপটির বিস্তারিত বিবরণ লিখুন..."
                  value={newStepDescInput}
                  onChange={e => setNewStepDescInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsAddStepModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleAddNewStepCustom()}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-lg"
              >
                Save New Step
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT STEP SETTINGS MODAL (ADMIN)                                */}
      {/* ========================================================================= */}
      {editingStep && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                ধাপ সেটিংস এডিট করুন: {editingStep.stepName}
              </h3>
              <button 
                onClick={() => setEditingStep(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Step Name:</label>
                <input
                  type="text"
                  value={editingStep.stepName}
                  onChange={e => setEditingStep({ ...editingStep, stepName: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Amount ({editingStep.currency}):</label>
                  <input
                    type="number"
                    value={editingStep.amount}
                    onChange={e => setEditingStep({ ...editingStep, amount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Due Date:</label>
                  <input
                    type="date"
                    value={editingStep.dueDate}
                    onChange={e => setEditingStep({ ...editingStep, dueDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={editingStep.description}
                  onChange={e => setEditingStep({ ...editingStep, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingStep(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleSaveEditedStep}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-lg"
              >
                Update Step Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: AGENCY DOCUMENT UPLOAD MODAL                                      */}
      {/* ========================================================================= */}
      {agencyUploadStepId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-blue-400 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                এজেন্সি নথি আপলোড (Upload Step Documents)
              </h3>
              <button 
                onClick={() => setAgencyUploadStepId(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">ডকুমেন্টের নাম (Document Name):</label>
                <input
                  type="text"
                  placeholder="যেমন: Medical Report, Invoice..."
                  value={agencyDocName}
                  onChange={e => setAgencyDocName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">ফাইল সিলেক্ট করুন (PDF/PNG/JPG):</label>
                <div className="p-4 border-2 border-dashed border-slate-800 rounded-2xl text-center space-y-2 bg-slate-950/50 hover:border-blue-500 transition cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-500 mx-auto" />
                  <span className="text-[11px] text-slate-400 block font-medium">কম্পিউটার বা মোবাইল থেকে ড্র্যাগ করে ছাড়ুন বা ব্রাউজ করুন</span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">মন্তব্য (Remarks):</label>
                <input
                  type="text"
                  placeholder="যেমন: রিপোর্ট স্ক্যান কপি এবং রিসিপ্ট সংযুক্ত করা হলো"
                  value={agencyRemarksInput}
                  onChange={e => setAgencyRemarksInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setAgencyUploadStepId(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleAgencySubmitDocs}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl cursor-pointer shadow-lg"
              >
                Submit for Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CLIENT PAYMENT MODAL                                             */}
      {/* ========================================================================= */}
      {clientPayStepId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-emerald-400 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                ক্লায়েন্ট পেমেন্ট সম্পন্ন করুন (Pay Now)
              </h3>
              <button 
                onClick={() => setClientPayStepId(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl flex justify-between items-center font-bold text-emerald-300">
                <span>পরিশোধের মোট পরিমাণ:</span>
                <span className="font-mono text-base font-black">
                  ৳{workflowSteps.find(s => s.id === clientPayStepId)?.amount.toLocaleString()} BDT
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">পেমেন্ট মেথড:</label>
                <select
                  value={payMethodSelect}
                  onChange={e => setPayMethodSelect(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                >
                  <option value="bKash">bKash Merchant (01712-998877)</option>
                  <option value="Nagad">Nagad Merchant (01819-554433)</option>
                  <option value="Bank Transfer">City Bank Ltd (1102938475001)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Transaction ID (TxID):</label>
                <input
                  type="text"
                  placeholder="যেমন: BK992817263 বা Bank Ref No."
                  value={clientTxIdInput}
                  onChange={e => setClientTxIdInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">পেমেন্ট স্ক্রিনশট / রসিদ আপলোড:</label>
                <div className="p-3 border-2 border-dashed border-slate-800 rounded-xl text-center space-y-1 bg-slate-950">
                  <Upload className="w-5 h-5 text-slate-500 mx-auto" />
                  <span className="text-[10.5px] text-slate-400 block font-medium">রসিদের ছবি বা স্ক্রিনশট সংযুক্ত করুন</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setClientPayStepId(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleClientSubmitPayment}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl cursor-pointer shadow-lg"
              >
                Submit Payment Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: ADMIN DOCUMENT VERIFICATION MODAL                                */}
      {/* ========================================================================= */}
      {adminVerifyStepId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                এডমিন নথিপত্র ভেরিফিকেশন (Document Approval)
              </h3>
              <button 
                onClick={() => setAdminVerifyStepId(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-bold">স্টেপ: {workflowSteps.find(s => s.id === adminVerifyStepId)?.stepName}</span>
                <span className="text-slate-300 block">
                  এজেন্সি প্রেরিত নথিপত্র এবং ইনভয়েস যাচাই করুন। অনুমোদন করলে ক্যান্ডিডেটের পেমেন্ট অপশন উন্মুক্ত হবে।
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">এডমিন মন্তব্য / রিজন:</label>
                <textarea
                  rows={2}
                  placeholder="অনুমোদন বা রিজেক্টের কারণ লিখুন..."
                  value={adminRemarksInput}
                  onChange={e => setAdminRemarksInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleAdminVerifyDocs(adminVerifyStepId, 'Reject')}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                ❌ Reject
              </button>
              <button
                onClick={() => handleAdminVerifyDocs(adminVerifyStepId, 'Reupload Requested')}
                className="px-3 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                🔄 Reupload
              </button>
              <button
                onClick={() => handleAdminVerifyDocs(adminVerifyStepId, 'Approve')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl cursor-pointer shadow-lg"
              >
                ✅ Approve & Unlock Client
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DynamicContractWorkflowManager;
