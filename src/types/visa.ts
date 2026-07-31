import { ItalyPackageApplication, VisaProcessStep, PaymentStep } from '../mockData';

export interface CustomVisaStepTemplate {
  key: string;
  name: string;
  label: string;
  order: number;
  amount: number;
  currency: 'BDT' | 'EUR' | 'USD';
  dueDate: string;
  description: string;
  requiredDocs: string;
  status: 'Active' | 'Inactive';
  avgProcessingDays?: number;
  conditions?: string; // e.g. "Pre-requisite: registration"
  isPaymentRequired?: boolean;
  vatPercent?: number;
  lateFeeFlat?: number;
  iconName?: string;
  isMandatory?: boolean;
  autoNotificationEnabled?: boolean;
  candidateCanUpload?: boolean;
  agencyCanUpdate?: boolean;
  adminApprovalRequired?: boolean;
  nextStepAutomationCode?: string;
  smsEmailTemplateId?: string;
  colorBadgeClass?: string;
  visibilityScope?: 'Candidate' | 'Agency' | 'Admin' | 'All';
}

export interface VisaProcessTemplate {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
  steps: CustomVisaStepTemplate[];
  country?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  msg: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  recipient: 'Candidate' | 'Agency' | 'Staff' | 'Admin';
  channels?: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  channels: { email: boolean; sms: boolean; whatsapp: boolean; push: boolean };
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface CurrencySetting {
  code: 'BDT' | 'EUR' | 'USD';
  symbol: string;
  rateToBDT: number;
}

export interface SystemSettings {
  statusColors: {
    Pending: string;
    Processing: string;
    Completed: string;
    Rejected: string;
  };
  workflowRules: WorkflowRule[];
  allowedDocTypes: string[];
  currencySettings: CurrencySetting[];
  smsGatewayEnabled: boolean;
  smtpGatewayEnabled: boolean;
}

// Preset Default Steps
export const PRESET_STEPS: CustomVisaStepTemplate[] = [
  { key: 'registration', name: 'Registration', label: 'নিবন্ধন (Registration)', order: 1, amount: 10000, currency: 'BDT', dueDate: '2026-07-15', description: 'প্রাথমিক প্রোফাইল ও বায়োমেট্রিক নিবন্ধন।', requiredDocs: 'পাসপোর্ট স্ক্যান, ছবি', status: 'Active', avgProcessingDays: 5, conditions: '', isPaymentRequired: true, vatPercent: 5, lateFeeFlat: 1000, iconName: 'User' },
  { key: 'offer_letter', name: 'Offer Letter', label: 'অফার লেটার (Offer Letter)', order: 2, amount: 15000, currency: 'BDT', dueDate: '2026-08-01', description: 'কোম্পানি থেকে অফার লেটার সংগ্রহ ও যাচাই।', requiredDocs: 'অফার লেটার', status: 'Active', avgProcessingDays: 15, conditions: 'registration', isPaymentRequired: true, vatPercent: 5, lateFeeFlat: 1500, iconName: 'FileText' },
  { key: 'contract', name: 'Contract Signing', label: 'চুক্তিপত্র (Contract Sign)', order: 3, amount: 30000, currency: 'BDT', dueDate: '2026-08-15', description: 'দ্বিপাক্ষিক চুক্তি সম্পাদন ও স্ট্যাম্পিং।', requiredDocs: 'চুক্তিপত্র কপি', status: 'Active', avgProcessingDays: 7, conditions: 'offer_letter', isPaymentRequired: true, vatPercent: 5, lateFeeFlat: 2000, iconName: 'Save' },
  { key: 'work_permit', name: 'Work Permit', label: 'ওয়ার্ক পারমিট (Work Permit)', order: 4, amount: 50000, currency: 'BDT', dueDate: '2026-09-01', description: 'ইতালি সরকারের অনুমোদিত নুলা ওস্তা প্রাপ্তি।', requiredDocs: 'নুলা ওস্তা কপি', status: 'Active', avgProcessingDays: 45, conditions: 'contract', isPaymentRequired: true, vatPercent: 5, lateFeeFlat: 3000, iconName: 'Briefcase' },
  { key: 'mofa', name: 'MOFA', label: 'মুফা সত্যায়ন (MOFA)', order: 5, amount: 20000, currency: 'BDT', dueDate: '2026-09-15', description: 'পররাষ্ট্র মন্ত্রণালয় সত্যায়ন সম্পন্নকরণ।', requiredDocs: 'সত্যায়িত ডকুমেন্টস', status: 'Active', avgProcessingDays: 10, conditions: 'work_permit', isPaymentRequired: true, vatPercent: 5, lateFeeFlat: 1000, iconName: 'ShieldCheck' },
  { key: 'invitation', name: 'Invitation Letter', label: 'ইনভিটেশন লেটার (Invitation)', order: 6, amount: 15000, currency: 'BDT', dueDate: '2026-10-01', description: 'স্পন্সর আমন্ত্রণপত্র চূড়ান্ত অনুমোদন।', requiredDocs: 'আমন্ত্রণপত্র', status: 'Active', avgProcessingDays: 7, conditions: 'mofa', isPaymentRequired: true, vatPercent: 5, lateFeeFlat: 1000, iconName: 'Bell' },
  { key: 'visa_submission', name: 'Visa Submission', label: 'ভিসা সাবমিশন (Embassy)', order: 7, amount: 25000, currency: 'BDT', dueDate: '2026-10-15', description: 'এম্বেসি বা ভিএফএস গলোবালে ফাইল জমা।', requiredDocs: 'জমা রশিদ', status: 'Active', avgProcessingDays: 30, conditions: 'invitation', isPaymentRequired: true, vatPercent: 5, lateFeeFlat: 2500, iconName: 'Upload' },
  { key: 'visa_approved', name: 'Visa Approved', label: 'ভিসা অনুমোদন (Approved)', order: 8, amount: 40000, currency: 'BDT', dueDate: '2026-11-01', description: 'দূতাবাস কর্তৃক ভিসা মঞ্জুর।', requiredDocs: 'ভিসা কপি', status: 'Active', avgProcessingDays: 20, conditions: 'visa_submission', isPaymentRequired: true, vatPercent: 5, lateFeeFlat: 4000, iconName: 'CheckCircle2' },
  { key: 'visa_printed', name: 'Visa Printed', label: 'ভিসা প্রিন্ট (Printed)', order: 9, amount: 10000, currency: 'BDT', dueDate: '2026-11-15', description: 'পাসপোর্টে ভিসা স্টিকার প্রিন্ট।', requiredDocs: 'ভিসা স্টিকার ছবি', status: 'Active', avgProcessingDays: 5, conditions: 'visa_approved', isPaymentRequired: true, vatPercent: 5, lateFeeFlat: 1000, iconName: 'Printer' },
  { key: 'air_ticket', name: 'Air Ticket', label: 'ফ্লাইট টিকিট (Air Ticket)', order: 10, amount: 50000, currency: 'BDT', dueDate: '2026-12-01', description: 'ফ্লাইট বুকিং ও কনফার্মেশন।', requiredDocs: 'টিকিট কপি', status: 'Active', avgProcessingDays: 7, conditions: 'visa_printed', isPaymentRequired: true, vatPercent: 5, lateFeeFlat: 5000, iconName: 'Clock' },
  { key: 'departure', name: 'Departure', label: 'ডিপার্চার (Departure)', order: 11, amount: 20000, currency: 'BDT', dueDate: '2026-12-15', description: 'বাংলাদেশ থেকে বিমানযোগে যাত্রা।', requiredDocs: 'বোর্ডিং পাস', status: 'Active', avgProcessingDays: 1, conditions: 'air_ticket', isPaymentRequired: true, vatPercent: 5, lateFeeFlat: 2000, iconName: 'ArrowRight' },
];

export const PRESET_TEMPLATES: VisaProcessTemplate[] = [
  {
    id: 'italy_std',
    name: 'Standard Italy Nula Osta',
    description: 'ইতালি সিজনাল ও নন-সিজনাল স্পন্সর উইন্ডো এবং নুলা ওস্তা ভিসা প্রসেস।',
    status: 'Active',
    steps: [...PRESET_STEPS],
    country: 'Italy'
  },
  {
    id: 'schengen_premium',
    name: 'Premium Schengen Tourist/Business',
    description: 'ইউরোপের সেনজেনভুক্ত দেশের জন্য হাই-ভ্যালু প্রিমিয়াম ডক্ট্রিন ও ইন্টারভিউ প্রস্তুতি।',
    status: 'Active',
    steps: PRESET_STEPS.slice(0, 8).map((s, i) => ({ ...s, order: i+1, amount: s.amount * 1.5 })),
    country: 'Germany'
  },
  {
    id: 'gulf_work',
    name: 'Gulf Countries Express Recruitment',
    description: 'সৌদি আরব, ওমান ও দুবাইয়ের জন্য এক্সপ্রেস মেডিকেল ও বায়োমেট্রিক ভিত্তিক ভিসা প্রসেস।',
    status: 'Active',
    steps: PRESET_STEPS.slice(0, 5).map((s, i) => ({ ...s, order: i+1, amount: s.amount * 0.8 })),
    country: 'Saudi Arabia'
  }
];

export const PRESET_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  { id: 'pay_confirm', name: 'Payment Confirmation', subject: 'পেমেন্ট রিসিভড ও ভেরিফাইড', body: 'প্রিয় {{CANDIDATE_NAME}}, আপনার {{STEP_NAME}} ধাপের কিস্তির জন্য জমাকৃত ৳{{AMOUNT}} সফলভাবে যাচাই ও সিস্টেমে অনুমোদন করা হয়েছে। ধন্যবাদ!', channels: { email: true, sms: true, whatsapp: true, push: true } },
  { id: 'step_complete', name: 'Step Completed Alert', subject: 'ভিসা প্রসেস ধাপ সম্পন্ন!', body: 'অভিনন্দন {{CANDIDATE_NAME}}! আপনার ফাইল ট্র্যাকার অনুযায়ী "{{STEP_NAME}}" ধাপটি সফলভাবে সম্পন্ন হয়েছে। পরবর্তী ধাপের জন্য আপনার প্রস্তুতি নিন।', channels: { email: true, sms: false, whatsapp: true, push: true } },
  { id: 'due_remind', name: 'Due Payment Reminder', subject: 'পেমেন্ট কিস্তির বকেয়া এলার্ট', body: 'জরুরি নোটিশ: {{CANDIDATE_NAME}}, আপনার "{{STEP_NAME}}" ধাপের জন্য ধার্যকৃত কিস্তির পরিমাণ ৳{{AMOUNT}} বকেয়া রয়েছে। শেষ সময় অতিবাহিত হচ্ছে। দ্রুত পরিশোধ করুন।', channels: { email: true, sms: true, whatsapp: true, push: true } }
];

export const DEFAULT_SETTINGS: SystemSettings = {
  statusColors: {
    Pending: '#F59E0B',
    Processing: '#3B82F6',
    Completed: '#10B981',
    Rejected: '#EF4444'
  },
  workflowRules: [
    { id: 'lock_unpaid', name: 'Restrict unpaid steps', description: 'পূর্ববর্তী ধাপের পেমেন্ট ক্লিয়ার না হওয়া পর্যন্ত পরবর্তী ধাপের প্রসেস শুরু করা যাবে না।', enabled: true },
    { id: 'auto_notif', name: 'Auto Notify on Step Change', description: 'ভিসার যেকোনো ধাপের স্ট্যাটাস পরিবর্তন হলে প্রার্থী ও এজেন্সিকে ইমেইল/এসএমএস পাঠানো হবে।', enabled: true },
    { id: 'agency_upload', name: 'Force Document Upload on Agency Update', description: 'এজেন্সি যখন ক্যান্ডিডেটের ধাপ আপডেট করবে, তখন আবশ্যিকভাবে ডকুমেন্ট আপলোড করতে হবে।', enabled: true }
  ],
  allowedDocTypes: ['PDF', 'JPEG', 'PNG', 'DOCX'],
  currencySettings: [
    { code: 'BDT', symbol: '৳', rateToBDT: 1 },
    { code: 'EUR', symbol: '€', rateToBDT: 132.50 },
    { code: 'USD', symbol: '$', rateToBDT: 121.20 }
  ],
  smsGatewayEnabled: true,
  smtpGatewayEnabled: true
};

export const calculateCandidateBalance = (cand: ItalyPackageApplication, steps: CustomVisaStepTemplate[], paymentConfig: any) => {
  if (!cand) return { totalContract: 0, totalPaid: 0, totalDue: 0, nextDue: 0, taxAmount: 0 };
  
  let baseStepsSum = 0;
  if (cand.visaSteps && cand.visaSteps.length > 0) {
    baseStepsSum = cand.visaSteps.reduce((sum, s) => {
      const stepTpl = steps.find(tpl => tpl.key === s.key);
      return sum + (stepTpl ? stepTpl.amount : 20000);
    }, 0);
  } else {
    baseStepsSum = steps.reduce((sum, s) => sum + s.amount, 0);
  }

  const contractBase = paymentConfig.pricingModel === 'fixed' ? paymentConfig.fixedAmount : baseStepsSum;
  const discount = cand.discount || paymentConfig.globalDiscount || 0;
  const extra = cand.extraCharges || paymentConfig.extraCharges || 0;

  // Let's add 5% global VAT if configured
  const taxPercent = 5;
  const taxAmount = Math.round((contractBase - discount) * (taxPercent / 100));

  const totalContract = contractBase - discount + extra + taxAmount;

  const totalPaid = cand.paymentHistory 
    ? cand.paymentHistory.filter(h => h.status === 'Verified').reduce((sum, h) => sum + h.amount, 0)
    : (cand.paidAmount || 0);

  const totalDue = totalContract - totalPaid;

  let nextDue = 0;
  const pendingStep = cand.visaSteps?.find(s => s.status === 'Pending' || s.status === 'Processing');
  if (pendingStep) {
    const stepTpl = steps.find(tpl => tpl.key === pendingStep.key);
    nextDue = stepTpl ? stepTpl.amount : 25000;
  }

  return {
    totalContract,
    totalPaid,
    totalDue: totalDue < 0 ? 0 : totalDue,
    nextDue,
    taxAmount
  };
};
