/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentBankAccount, ClientPaymentSubmission, AdminBankSettings, DEFAULT_ADMIN_BANK_SETTINGS } from './types/bank';

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  category: string;
  country: string; // e.g. 'Saudi Arabia 🇸🇦'
  location: string; // e.g. 'Riyadh' or 'Dubai'
  salary: string; // e.g. '৳৫০,০০০ - ৳৮০,০০০ equivalent to 1800 SAR'
  type: 'Full-time' | 'Contract' | 'Free Visa' | 'Company Visa';
  visaType: 'Work Visa' | 'Employment Visa' | 'Sponsorship Visa' | 'Resident Visa';
  description: string;
  requirements: string[];
  status: 'Approved' | 'Pending' | 'Rejected';
  isPremium: boolean;
  isFeatured: boolean;
  postedAt: string;
  deadline: string;
  applicationsCount: number;
  circularPdfName?: string;
}

export interface Company {
  id: string;
  name: string; // Agency Name
  logo: string;
  licenseNumber: string; // RL-XXXX License Info
  industry: string;
  employees: string;
  location: string; // Dhaka address
  description: string;
  isApproved: boolean;
  email: string;
  coverBanner?: string;
  establishedYear?: string;
  website?: string;
  googleMap?: string;
  phone?: string;
  facebookLink?: string;
  linkedInLink?: string;
  registrationNumber?: string;
  tradeLicenseNumber?: string;
  vatTin?: string;
  city?: string;
  ownerName?: string;
  ownerNid?: string;
  ownerMobile?: string;
  ownerEmail?: string;
  ownerPhoto?: string;
  companyStatus?: 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'Suspended' | 'Blacklisted';
  verifiedBy?: string;
  verificationDate?: string;
  verificationRemarks?: string;
  subscriptionPlan?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  officeVerified?: boolean;
  videoCallStatus?: 'Not Scheduled' | 'Scheduled' | 'Pending' | 'Completed' | 'Failed';
  videoCallDate?: string;
  tradeLicense?: string;
  recruitingLicense?: string;
  activityLog?: { action: string; user: string; date: string; remarks?: string }[];
  versionHistory?: { documentName: string; version: string; date: string; updatedBy: string; remarks?: string }[];
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string; // Agency name
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  passportNumber: string;
  passportExpiry: string;
  bmetCardNumber?: string;
  medicalStatus: 'Fit' | 'Pending' | 'Unfit';
  policeClearance: 'Verified' | 'Pending' | 'Not Provided';
  skills: string;
  experience: string;
  languages: string;
  resumeName: string;
  photoName?: string;
  status: 'Pending' | 'Shortlisted' | 'Rejected' | 'Interview Scheduled' | 'Passed' | 'Failed' | 'Waiting';
  interviewDate?: string;
  coverLetter?: string;
  appliedAt: string;

  // Rich Interview details
  interviewTime?: string;
  interviewLocation?: string;
  interviewLink?: string;
  interviewNotes?: string;
  interviewResult?: 'Passed' | 'Failed' | 'Waiting' | null;

  // Package attributes
  packageCreated?: boolean;
  packageCountry?: string;
  packageTotalAmount?: number;
  packageItems?: { name: string; amount: number }[];
  packageDueDate?: string;
  packageInstallments?: { name: string; amount: number; dueDate: string; status: 'Unpaid' | 'Paid' | 'Pending Verification' }[];
  
  // Payment history for this application
  payments?: {
    id: string;
    amount: number;
    method: string;
    txID: string;
    screenshot?: string;
    receiptUrl?: string;
    status: 'Pending Verification' | 'Paid' | 'Rejected';
    date: string;
    notes?: string;
  }[];

  // Document Verification tracker
  documents?: {
    passport?: { url: string; status: 'Pending' | 'Approved' | 'Rejected' | 'Not Uploaded' | 'Need Re-upload'; notes?: string };
    photo?: { url: string; status: 'Pending' | 'Approved' | 'Rejected' | 'Not Uploaded' | 'Need Re-upload'; notes?: string };
    policeClearance?: { url: string; status: 'Pending' | 'Approved' | 'Rejected' | 'Not Uploaded' | 'Need Re-upload'; notes?: string };
    medical?: { url: string; status: 'Pending' | 'Approved' | 'Rejected' | 'Not Uploaded' | 'Need Re-upload'; notes?: string };
    education?: { url: string; status: 'Pending' | 'Approved' | 'Rejected' | 'Not Uploaded' | 'Need Re-upload'; notes?: string };
    experience?: { url: string; status: 'Pending' | 'Approved' | 'Rejected' | 'Not Uploaded' | 'Need Re-upload'; notes?: string };
    visaCopy?: { url: string; status: 'Pending' | 'Approved' | 'Rejected' | 'Not Uploaded' | 'Need Re-upload'; notes?: string };
    workPermit?: { url: string; status: 'Pending' | 'Approved' | 'Rejected' | 'Not Uploaded' | 'Need Re-upload'; notes?: string };
    others?: { url: string; status: 'Pending' | 'Approved' | 'Rejected' | 'Not Uploaded' | 'Need Re-upload'; notes?: string };
  };

  currentMilestone?: 'Applied' | 'Interview Scheduled' | 'Interview Passed' | 'Package Created' | 'First Payment Paid' | 'Payment Verified' | 'Documents Uploaded' | 'Documents Approved' | 'Medical' | 'Work Permit' | 'Visa Processing' | 'Visa Approved' | 'Flight Ticket' | 'Departure';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  isRead: boolean;
}

export interface Transaction {
  id: string;
  companyName: string; // Agency name (or applicant name)
  planName: string;
  amount: number;
  method: string; // e.g. bKash, Nagad, Bank Transfer, SSLCommerz, etc.
  txID: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Under Review' | 'Refunded' | 'Correction Requested';
  date: string;
  
  // New user verification fields
  applicantName?: string;
  employerName?: string;
  jobTitle?: string;
  screenshot?: string; // custom simulated image or payment screenshot
  remarks?: string;
  history?: { changedBy: string; oldStatus: string; newStatus: string; date: string; remarks?: string }[];
  paymentType?: 'Online' | 'Office';
  receiptNumber?: string;
  staffName?: string;
  officeBranch?: string;
  isArchived?: boolean;
}

export interface PaymentMethodSetting {
  id: string;
  name: string;
  type: 'manual' | 'api';
  status: 'Enabled' | 'Disabled';
  
  // Manual configurations
  accountType?: 'Personal' | 'Merchant';
  accountNumber?: string;
  accountHolderName?: string;
  qrCodeUrl?: string;
  branchName?: string;
  routingNumber?: string;
  swiftCode?: string;
  paymentInstructions?: string;

  // API configurations
  apiEnabled?: boolean;
  apiKey?: string;
  apiSecret?: string;
  merchantId?: string;
  storeId?: string;
  storePassword?: string;
  callbackUrl?: string;
  sandboxMode?: boolean; // true = Sandbox, false = Live
}

export interface PaymentAuditLog {
  id: string;
  user: string;
  methodId: string;
  methodName: string;
  changeType: 'Status Change' | 'Number Change' | 'API Key Change' | 'QR Code Change' | 'General Edit' | 'Method Added' | 'Method Deleted';
  oldValue: string;
  newValue: string;
  date: string;
  ipAddress?: string;
}

export interface VisaProcessStep {
  key: string;
  name: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Rejected';
  date: string;
  staffName: string;
  documentUrl?: string;
  adminNotes?: string;
  requiredDocs?: string;
  isPaymentRequired?: boolean;
  agencyCanUpdate?: boolean;
  amount?: number;
}

export interface PaymentStep {
  key: string;
  name: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Partial' | 'Overdue';
  paidAmount: number;
  dueDate: string;
  paidDate?: string;
  agencyCanUpdate?: boolean;
}

export interface ItalyPackageApplication {
  id: string;
  packageName: 'Basic' | 'Standard' | 'Premium';
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  passportNumber: string;
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
  notes?: string;
  priceAmount?: string;
  
  // Visa Process & Payment Tracker Module additions
  visaSteps?: VisaProcessStep[];
  paymentSteps?: PaymentStep[];
  totalAmount?: number;
  discount?: number;
  extraCharges?: number;
  paidAmount?: number;
  dueAmount?: number;
  paymentHistory?: {
    id: string;
    amount: number;
    date: string;
    method: string;
    invoiceId: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    stepKey: string;
  }[];
  agencyId?: string;
  commission?: number;
  contractStatus?: 'Active' | 'Completed' | 'Pending' | 'Terminated';

  // Contract Payment & Document Verification additions
  company?: string;
  country?: string;
  jobPosition?: string;
  salary?: string;
  contractNumber?: string;
  
  registrationFee?: number;
  offerLetterFee?: number;
  workPermitFee?: number;
  mofaFee?: number;
  invitationLetterFee?: number;
  visaProcessingFee?: number;
  visaApprovalFee?: number;
  visaPrintingFee?: number;
  airTicketFee?: number;
  
  // Recruitment Payment Workflow fields
  medicalFee?: number;
  agencyServiceFee?: number;
  embassyFee?: number;
  insuranceFee?: number;
  bmetFee?: number;
  otherCharges?: number;
  adminCommission?: number;
  employerTotal?: number;
  grandTotal?: number;
  paymentPlanStatus?: 'Draft' | 'Pending Admin Review' | 'Approved' | 'Rejected' | 'Correction Required';
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    routingNumber: string;
    swiftCode?: string;
    bkashMerchant?: string;
    nagadMerchant?: string;
    rocketNumber?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    approvedBy?: string;
    qrCode?: string;
  };
  auditLogs?: {
    id: string;
    action: string;
    user: string;
    timestamp: string;
    details?: string;
  }[];
  
  documents?: {
    offerLetter?: { status: 'Pending' | 'Approved' | 'Rejected' | 'Correction Required'; fileUrl?: string; notes?: string };
    employmentContract?: { status: 'Pending' | 'Approved' | 'Rejected' | 'Correction Required'; fileUrl?: string; notes?: string };
    workPermit?: { status: 'Pending' | 'Approved' | 'Rejected' | 'Correction Required'; fileUrl?: string; notes?: string };
    passportCopy?: { status: 'Pending' | 'Approved' | 'Rejected' | 'Correction Required'; fileUrl?: string; notes?: string };
    visaDocuments?: { status: 'Pending' | 'Approved' | 'Rejected' | 'Correction Required'; fileUrl?: string; notes?: string };
    paymentReceipts?: { status: 'Pending' | 'Approved' | 'Rejected' | 'Correction Required'; fileUrl?: string; notes?: string };
  };
  timeline?: Array<{ key: string; label: string; status: 'Pending' | 'Processing' | 'Approved' | 'Rejected'; date?: string }>;
}

export const getDefaultVisaSteps = (staffName: string = 'আহমেদ রনি (Staff)'): VisaProcessStep[] => [
  { key: 'mofa', name: 'MOFA', status: 'Pending', date: '', staffName: '' },
  { key: 'work_permit', name: 'Work Permit', status: 'Pending', date: '', staffName: '' },
  { key: 'invitation_letter', name: 'Invitation Letter', status: 'Pending', date: '', staffName: '' },
  { key: 'visa_submission', name: 'Visa Submission', status: 'Pending', date: '', staffName: '' },
  { key: 'visa_approved', name: 'Visa Approved', status: 'Pending', date: '', staffName: '' },
  { key: 'visa_printed', name: 'Visa Printed', status: 'Pending', date: '', staffName: '' },
  { key: 'ticket_issued', name: 'Ticket Issued', status: 'Pending', date: '', staffName: '' },
  { key: 'departure', name: 'Departure', status: 'Pending', date: '', staffName: '' },
  { key: 'arrived', name: 'Arrived', status: 'Pending', date: '', staffName: '' }
];

export const getDefaultPaymentSteps = (): PaymentStep[] => [
  { key: 'registration', name: 'Registration', amount: 10000, status: 'Unpaid', paidAmount: 0, dueDate: '2026-07-10' },
  { key: 'mofa', name: 'MOFA', amount: 20000, status: 'Unpaid', paidAmount: 0, dueDate: '2026-07-25' },
  { key: 'work_permit', name: 'Work Permit', amount: 30000, status: 'Unpaid', paidAmount: 0, dueDate: '2026-08-15' },
  { key: 'invitation_letter', name: 'Invitation Letter', amount: 15000, status: 'Unpaid', paidAmount: 0, dueDate: '2026-09-01' },
  { key: 'visa_submission', name: 'Visa Submission', amount: 25000, status: 'Unpaid', paidAmount: 0, dueDate: '2026-09-20' },
  { key: 'visa_approved', name: 'Visa Approved', amount: 40000, status: 'Unpaid', paidAmount: 0, dueDate: '2026-10-10' },
  { key: 'visa_printed', name: 'Visa Printed', amount: 10000, status: 'Unpaid', paidAmount: 0, dueDate: '2026-10-25' },
  { key: 'air_ticket', name: 'Air Ticket', amount: 50000, status: 'Unpaid', paidAmount: 0, dueDate: '2026-11-15' }
];

export interface CompanyReport {
  id: string;
  companyId: string;
  companyName: string;
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  category: 'Fake Job' | 'Fake Visa' | 'Payment Fraud' | 'Scam' | 'Abuse' | 'Other';
  description: string;
  evidenceUrl?: string;
  status: 'Pending' | 'Investigating' | 'Resolved' | 'Dismissed';
  actionTaken?: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  adminNotes?: string;
}

export interface BlacklistedItem {
  id: string;
  type: 'NID' | 'Passport' | 'User' | 'Company';
  value: string;
  holderName: string;
  reason: string;
  blacklistedBy: string;
  blacklistedAt: string;
}

export interface SystemAuditLog {
  id: string;
  action: string;
  user: string;
  targetId: string;
  targetName: string;
  details: string;
  date: string;
}

export const INITIAL_COMPANY_REPORTS: CompanyReport[] = [
  {
    id: 'rep_1',
    companyId: 'c1',
    companyName: 'Gulf Careers recruiting agency',
    reporterName: 'কামাল উদ্দিন',
    reporterEmail: 'kamal.ud@gmail.com',
    reporterPhone: '01711122233',
    category: 'Fake Job',
    description: 'তারা পোল্যান্ডের যে রাজমিস্ত্রির সার্কুলারটি দিয়েছে, আমি তাদের অফিসে গিয়ে জেনেছি সেটি আসলে ভলেন্টিয়ার বা টেম্পোরারি কন্ট্রাক্ট, অথচ ফুল-টাইম পার্মানেন্ট ভিসা দাবি করছে।',
    status: 'Pending',
    createdAt: '2026-07-01'
  },
  {
    id: 'rep_2',
    companyId: 'c5',
    companyName: 'Delta Global Overseas Ltd',
    reporterName: 'মোঃ রাশেদ',
    reporterEmail: 'rashed.ctg@yahoo.com',
    reporterPhone: '01819998877',
    category: 'Payment Fraud',
    description: 'ভিসা প্রসেসিং ফি বাবদ ৫০,০০০ টাকা ক্যাশ নিয়ে তারা কোনো সঠিক রসিদ দিচ্ছে না এবং এখন বলছে আর কোনো সিট খালি নেই। টাকাও ফেরত দিচ্ছে না।',
    status: 'Investigating',
    createdAt: '2026-07-02'
  }
];

export const INITIAL_BLACKLIST_ITEMS: BlacklistedItem[] = [
  {
    id: 'bl_1',
    type: 'Passport',
    value: 'EF1029384',
    holderName: 'সোহেল রানা',
    reason: 'পোল্যান্ড রাজমিস্ত্রি জবে ডুপ্লিকেট পাসপোর্ট নাম্বার ও ফেক এনআইডি সাবমিট করেছিল।',
    blacklistedBy: 'মীররাজ রেজা (Super Admin)',
    blacklistedAt: '2026-06-25'
  },
  {
    id: 'bl_2',
    type: 'NID',
    value: '199201928374',
    holderName: 'জাকির হোসেন',
    reason: 'মেডিকেল রিপোর্টে জাল সার্টিফিকেট এবং ভুয়া ফিটনেস সনদ জমা দিয়ে প্রতারণার চেষ্টা।',
    blacklistedBy: 'আনিসুর রহমান (Office Admin)',
    blacklistedAt: '2026-06-27'
  }
];

export const INITIAL_SYSTEM_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'aud_1',
    action: 'Company Status Changed',
    user: 'মীররাজ রেজা (Super Admin)',
    targetId: 'c1',
    targetName: 'Gulf Careers recruiting agency',
    details: 'কোম্পানি স্ট্যাটাস পরিবর্তন করে Verified করা হয়েছে। লাইসেন্স সঠিক পাওয়া গেছে।',
    date: '2026-07-01 10:00 AM'
  },
  {
    id: 'aud_2',
    action: 'User Blacklisted',
    user: 'আনিসুর রহমান (Office Admin)',
    targetId: 'bl_1',
    targetName: 'সোহেল রানা',
    details: 'পাসপোর্ট নাম্বার EF1029384 কালো তালিকাভুক্ত করা হয়েছে।',
    date: '2026-06-25 04:30 PM'
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'Gulf Careers recruiting agency',
    logo: '✈️',
    licenseNumber: 'RL-1452',
    industry: 'Overseas Manpower Placement',
    employees: '50-100',
    location: 'Gulshan-2, Dhaka, Bangladesh',
    description: 'Government approved recruiting agency specialized in human resource supply to Gulf Countries including Saudi Arabia, UAE, and Qatar.',
    isApproved: true,
    email: 'hr@gulfcareers.com'
  },
  {
    id: 'c2',
    name: 'Sena Kalyan Overseas Employment',
    logo: '🎖️',
    licenseNumber: 'RL-1082',
    industry: 'Government & Private Joint Placement',
    employees: '200+',
    location: 'Banani, Dhaka, Bangladesh',
    description: 'Providing premium, reliable jobs in Poland, Romania, Singapore, and Japan with strict compliance and minimal processing costs.',
    isApproved: true,
    email: 'careers@skoverseas.com'
  },
  {
    id: 'c3',
    name: 'Euro Bangla Manpower Services',
    logo: '🇪🇺',
    licenseNumber: 'RL-1920',
    industry: 'Schengen & Eastern Europe Placement',
    employees: '30-50',
    location: 'Uttara, Dhaka, Bangladesh',
    description: 'Specialized in European work visa processing, particularly for construction workers, culinary staff, and transport operators in Romania & Poland.',
    isApproved: true,
    email: 'info@eurobangla.com'
  },
  {
    id: 'c4',
    name: 'Asia Tech Recruiting Agency',
    logo: '🌏',
    licenseNumber: 'RL-2104',
    industry: 'Far-East Technical Placement',
    employees: '80-120',
    location: 'Arambagh, Motijheel, Dhaka',
    description: 'We connect skilled Bangladeshi technicians, IT workers, and nurses to high-paying jobs in South Korea, Japan, and Singapore.',
    isApproved: true,
    email: 'contact@asiatechrecruiting.com'
  },
  {
    id: 'c5',
    name: 'Delta Global Overseas Ltd',
    logo: '📐',
    licenseNumber: 'RL-0955',
    industry: 'General Overseas Manpower',
    employees: '40-60',
    location: 'Moghbazar, Dhaka',
    description: 'A pioneer recruiting partner offering diverse opportunities in Malaysia and Middle Eastern countries for over 15 years.',
    isApproved: false,
    email: 'apply@deltaglobal.com'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Professional Heavy Truck Driver',
    companyId: 'c1',
    companyName: 'Gulf Careers recruiting agency',
    companyLogo: '✈️',
    category: 'Driving & Logistics',
    country: 'Saudi Arabia 🇸🇦',
    location: 'Riyadh & Jeddah',
    salary: '৳৭০,০০০ - ৳৯৫,০০০ (2400 SAR - 3200 SAR)',
    type: 'Company Visa',
    visaType: 'Work Visa',
    description: 'Urgent requirement for professional trailer drivers for a logistics multinational company. Accommodation, medical, and transport will be provided by the employer.',
    requirements: [
      'Valid Bangladeshi heavy driving license / GCC license preferred',
      'Minimum 3 years driving trailers or heavy duty trucks',
      'Basic Arabic speaking skills are highly appreciated',
      'Age limit: 25 to 42 years old'
    ],
    status: 'Approved',
    isPremium: true,
    isFeatured: true,
    postedAt: '2026-06-28',
    deadline: '2026-08-15',
    applicationsCount: 4,
    circularPdfName: 'Heavy_Truck_Driver_Riyadh_Circular.pdf'
  },
  {
    id: 'j2',
    title: 'CNC Machine Operator',
    companyId: 'c4',
    companyName: 'Asia Tech Recruiting Agency',
    companyLogo: '🌏',
    category: 'Technical & Engineering',
    country: 'Japan 🇯🇵',
    location: 'Nagoya & Osaka',
    salary: '৳১,৫০,০০০ - ৳১,৮০,০০০ (200,000 JPY)',
    type: 'Contract',
    visaType: 'Resident Visa',
    description: 'We are recruiting technical interns and CNC machine operators for high-tech manufacturing units in Nagoya under the SSW (Specified Skilled Worker) program.',
    requirements: [
      'N4 level Japanese Language Proficiency (JLPT/NAT-TEST)',
      'CNC operation skill certificate or 2 years related experience',
      'Diploma in Mechanical/Automobile Engineering is a major advantage',
      'Clean background and medical fitness test cleared'
    ],
    status: 'Approved',
    isPremium: true,
    isFeatured: true,
    postedAt: '2026-06-30',
    deadline: '2026-09-01',
    applicationsCount: 2,
    circularPdfName: 'CNC_Operator_SSW_Japan_Circular.pdf'
  },
  {
    id: 'j3',
    title: 'Commercial Construction Mason',
    companyId: 'c3',
    companyName: 'Euro Bangla Manpower Services',
    companyLogo: '🇪🇺',
    category: 'Construction & Labor',
    country: 'Romania 🇷🇴',
    location: 'Bucharest & Brasov',
    salary: '৳৮৫,০০০ - ৳১,১০,০০০ (800 USD - 1000 USD)',
    type: 'Contract',
    visaType: 'Employment Visa',
    description: 'Schengen-neighboring Romania is hiring skilled masons for large-scale apartment and highway structural construction. 2 years renewable contract, free accommodation, food allowance.',
    requirements: [
      'Proven experience as a bricklayer or mason (Trade Test is mandatory)',
      'Ability to read simple construction drafts',
      'Basic conversational English level is required',
      'Valid passport with at least 2.5 years of remaining validity'
    ],
    status: 'Approved',
    isPremium: false,
    isFeatured: true,
    postedAt: '2026-07-01',
    deadline: '2026-08-30',
    applicationsCount: 1,
    circularPdfName: 'Romania_Masons_Construction_Aram.pdf'
  },
  {
    id: 'j4',
    title: 'Hospitality Service Assistant (Hotel & Rest)',
    companyId: 'c1',
    companyName: 'Gulf Careers recruiting agency',
    companyLogo: '✈️',
    category: 'Hotel & Hospitality',
    country: 'UAE 🇦🇪',
    location: 'Dubai Marina',
    salary: '৳৬০,০০০ - ৳৭৫,০০০ (2000 AED - 2500 AED)',
    type: 'Company Visa',
    visaType: 'Work Visa',
    description: '5-star boutique resort in Dubai is recruiting service assistants, waiters, and bellboys. Food, uniform, and residence cards provided.',
    requirements: [
      'Smart personality with conversational English skills',
      'Experience in 3-star or 5-star hotel service is a big plus',
      'SSC or HSC passed certificate',
      'BMET registration can be completed after selection'
    ],
    status: 'Approved',
    isPremium: true,
    isFeatured: false,
    postedAt: '2026-07-01',
    deadline: '2026-08-10',
    applicationsCount: 0,
    circularPdfName: 'Dubai_Resort_Hotel_Staff_Circular.pdf'
  },
  {
    id: 'j5',
    title: 'Agriculture Farm Worker',
    companyId: 'c5',
    companyName: 'Delta Global Overseas Ltd',
    companyLogo: '📐',
    category: 'Agriculture & Farm',
    country: 'South Korea 🇰🇷',
    location: 'Jeonnam Province',
    salary: '৳১,৪০,০০০ - ৳১,৬০,০০০ (1,900,000 KRW)',
    type: 'Contract',
    visaType: 'Employment Visa',
    description: 'Urgent hiring of workers for smart agricultural greenhouse farms in South Korea. Seasonal work program (E-8 visa) or E-9 visa support. Fast document approvals.',
    requirements: [
      'Prior experience in farming, harvest, or packing is beneficial',
      'Excellent physical health (high stamina, no history of joint pain)',
      'No illegal stay record in South Korea or other countries',
      'HSC passed or equivalent standard'
    ],
    status: 'Pending',
    isPremium: false,
    isFeatured: false,
    postedAt: '2026-07-02',
    deadline: '2026-08-20',
    applicationsCount: 0,
    circularPdfName: 'South_Korea_E8_Farm_Worker_Recruitment.pdf'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    jobTitle: 'Professional Heavy Truck Driver',
    companyName: 'Gulf Careers recruiting agency',
    candidateName: 'আরিফুল ইসলাম (Ariful Islam)',
    candidateEmail: 'ariful@example.com',
    candidatePhone: '01712345678',
    passportNumber: 'EH0987654',
    passportExpiry: '2031-05-12',
    bmetCardNumber: 'BMET-2026-44321',
    medicalStatus: 'Fit',
    policeClearance: 'Verified',
    skills: 'Heavy Vehicle Driving, Route Planning, Air Brake Systems',
    experience: '4 years driving trailers in Saudi Arabia, 2 years in Bangladesh',
    languages: 'Bangla (Native), Arabic (Conversational)',
    resumeName: 'Ariful_Islam_Driving_Resume.pdf',
    photoName: 'ariful_passport_photo.jpg',
    status: 'Shortlisted',
    interviewDate: '2026-07-08T10:30',
    coverLetter: 'আসসালামু আলাইকুম। আমি সৌদি আরবে ৪ বছর রিয়াদে ট্রেইলার চালিয়েছি। আমার আকামা এবং লাইসেন্স সব বৈধ ছিল। পুনরায় সৌদিতে ভালো কোম্পানিতে কাজ করার জন্য আবেদন করছি।',
    appliedAt: '2026-06-29'
  },
  {
    id: 'a2',
    jobId: 'j2',
    jobTitle: 'CNC Machine Operator',
    companyName: 'Asia Tech Recruiting Agency',
    candidateName: 'শামিম আহমেদ (Shamim Ahmed)',
    candidateEmail: 'shamim@example.com',
    candidatePhone: '01812345679',
    passportNumber: 'EK1234567',
    passportExpiry: '2029-11-20',
    bmetCardNumber: 'BMET-2026-99081',
    medicalStatus: 'Fit',
    policeClearance: 'Pending',
    skills: 'CNC Milling, Lathe Machine Operation, G-Code reading',
    experience: 'Diploma in Mechanical Engineering, 1.5 years CNC shop experience',
    languages: 'Bangla, Japanese (N5 Level Cleared, preparing for N4)',
    resumeName: 'Shamim_CNC_Operator_CV.pdf',
    photoName: 'shamim_photo.jpg',
    status: 'Pending',
    coverLetter: 'জাপানে মেকানিক্যাল এবং সিএনসি অপারেটর হিসেবে ক্যারিয়ার গড়তে চাই। ইতিমধ্যে জাপানি ভাষা এন৫ কমপ্লিট করেছি। ইন্টারভিউ দেওয়ার জন্য প্রস্তুত।',
    appliedAt: '2026-06-29'
  },
  {
    id: 'a3',
    jobId: 'j3',
    jobTitle: 'Commercial Construction Mason',
    companyName: 'Euro Bangla Manpower Services',
    candidateName: 'মোঃ রফিক মিয়া (Rafiq Miah)',
    candidateEmail: 'rafiq@example.com',
    candidatePhone: '01512345680',
    passportNumber: 'EL7788990',
    passportExpiry: '2027-02-14',
    bmetCardNumber: '',
    medicalStatus: 'Pending',
    policeClearance: 'Not Provided',
    skills: 'Bricklaying, Cement Mixing, Plastering, Scaffolding',
    experience: '8 years construction experience in Dhaka and Chittagong',
    languages: 'Bangla (Native)',
    resumeName: 'Rafiq_Mason_Trade_Test.pdf',
    photoName: 'rafiq_photo.jpg',
    status: 'Rejected',
    coverLetter: 'আমার পাসপোর্ট মেয়াদ কম আছে। আবেদন করছি যদি নতুন পাসপোর্ট রিনিউ করে কাজের সুযোগ দেওয়া যায়।',
    appliedAt: '2026-07-01'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    companyName: 'Gulf Careers recruiting agency',
    planName: 'Featured Job Post (Middle East Pack)',
    amount: 3000,
    method: 'bKash',
    txID: 'BKX847A918D',
    status: 'Approved',
    date: '2026-06-28 10:15 AM',
    employerName: 'Gulf Careers recruiting agency',
    jobTitle: 'Professional Heavy Truck Driver',
    screenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&h=300&fit=crop&q=80',
    remarks: 'পেমেন্ট ভেরিফাইড এবং রকেট গতিতে অনুমোদন দেয়া হয়েছে।'
  },
  {
    id: 't2',
    companyName: 'Asia Tech Recruiting Agency',
    planName: 'Premium Fast-Track Recruiting Pack',
    amount: 7500,
    method: 'Nagad',
    txID: 'NGD312E456C',
    status: 'Approved',
    date: '2026-06-30 02:45 PM',
    employerName: 'Asia Tech Recruiting Agency',
    jobTitle: 'CNC Machine Operator',
    screenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&h=300&fit=crop&q=80',
    remarks: 'নগদ মার্চেন্ট পেমেন্ট সফলভাবে পাওয়া গেছে এবং ডাটাবেজ ভ্যালিডেট করা হয়েছে।'
  },
  {
    id: 't3',
    companyName: 'Delta Global Overseas Ltd',
    planName: 'Standard Single Job Post',
    amount: 1500,
    method: 'Manual',
    txID: 'MAN_DELTA_OVERSEAS_99',
    status: 'Pending',
    date: '2026-07-02 09:12 AM',
    employerName: 'Delta Global Overseas Ltd',
    jobTitle: 'Agriculture Farm Worker',
    screenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&h=300&fit=crop&q=80',
    remarks: 'ম্যানুয়াল ব্যাংক ডিপোজিট স্লিপ রিভিউ করা হচ্ছে।'
  },
  {
    id: 't4',
    companyName: 'আরিফুল ইসলাম (Ariful Islam)',
    planName: 'Standard Italy Processing Package Booking',
    amount: 6000,
    method: 'bKash',
    txID: 'BKX9918273E',
    status: 'Pending',
    date: '2026-07-03 11:20 PM',
    applicantName: 'আরিফুল ইসলাম (Ariful Islam)',
    jobTitle: '🇮🇹 Standard Work Visa Package Booking',
    screenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&h=300&fit=crop&q=80',
    remarks: 'ইতালি স্ট্যান্ডার্ড প্যাকেজের জন্য প্রথম ধাপে পাঠানো বুকিং পেমেন্ট।'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: '🎉 ইন্টারভিউ কল ও ট্রেড টেস্ট আহ্বান!',
    message: 'Gulf Careers agency আপনার Heavy Truck Driver পদের জন্য ৮ জুলাই সকাল ১০:৩০ মিনিটে ইন্টারভিউ ও ড্রাইভিং টেস্টের জন্য ডেকেছে। স্থান: গুলশান অফিস।',
    sentAt: '2026-07-01 10:00 AM',
    isRead: false
  },
  {
    id: 'n2',
    title: '✈️ নতুন মালয়েশিয়া/ইউরোপ চাকরি প্রকাশ',
    message: 'ইউরো বাংলা ম্যানপাওয়ার সার্ভিস রোমানিয়ার জন্য রাজমিস্ত্রি পদের নতুন বিজ্ঞপ্তি প্রকাশ করেছে।',
    sentAt: '2026-07-01 02:15 PM',
    isRead: false
  },
  {
    id: 'n3',
    title: '📢 প্রবাসী পোর্টাল লঞ্চিং অফার',
    message: 'সরকারি লাইসেন্সধারী সকল রিক্রুটিং এজেন্সিকে প্রবাসী জবস প্রোতে স্বাগতম! ফ্রি-তে পোস্ট করুন বিজ্ঞপ্তিসমূহ।',
    sentAt: '2026-07-02 08:30 AM',
    isRead: true
  }
];

export const CATEGORIES = [
  { name: 'Driving & Logistics', icon: 'Truck', count: 18 },
  { name: 'Construction & Labor', icon: 'Hammer', count: 32 },
  { name: 'Technical & Engineering', icon: 'Wrench', count: 24 },
  { name: 'Hotel & Hospitality', icon: 'Utensils', count: 15 },
  { name: 'Healthcare & Nursing', icon: 'Stethoscope', count: 9 },
  { name: 'Agriculture & Farm', icon: 'Sprout', count: 14 },
  { name: 'Garments & Textile', icon: 'Scissors', count: 11 },
  { name: 'Office, IT & Admin', icon: 'Laptop', count: 8 }
];

export const COUNTRIES = [
  { name: 'Saudi Arabia 🇸🇦', code: 'SA' },
  { name: 'UAE 🇦🇪', code: 'AE' },
  { name: 'Oman 🇴🇲', code: 'OM' },
  { name: 'Qatar 🇶🇦', code: 'QA' },
  { name: 'Kuwait 🇰🇼', code: 'KW' },
  { name: 'Bahrain 🇧🇭', code: 'BH' },
  { name: 'Malaysia 🇲🇾', code: 'MY' },
  { name: 'Singapore 🇸🇬', code: 'SG' },
  { name: 'Japan 🇯🇵', code: 'JP' },
  { name: 'South Korea 🇰🇷', code: 'KR' },
  { name: 'Romania 🇷🇴', code: 'RO' },
  { name: 'Poland 🇵🇱', code: 'PL' }
];

export const LOCATIONS = [
  'Saudi Arabia 🇸🇦',
  'UAE 🇦🇪',
  'Oman 🇴🇲',
  'Qatar 🇶🇦',
  'Kuwait 🇰🇼',
  'Bahrain 🇧🇭',
  'Malaysia 🇲🇾',
  'Singapore 🇸🇬',
  'Japan 🇯🇵',
  'South Korea 🇰🇷',
  'Romania 🇷🇴',
  'Poland 🇵🇱'
];

export const VISA_TYPES = [
  'Work Visa',
  'Employment Visa',
  'Sponsorship Visa',
  'Resident Visa'
];

export const createInitialPackage = (
  id: string,
  packageName: 'Basic' | 'Standard' | 'Premium',
  candidateName: string,
  candidateEmail: string,
  candidatePhone: string,
  passportNumber: string,
  status: 'Pending' | 'Approved' | 'Rejected',
  appliedAt: string,
  message: string,
  notes: string,
  priceAmount: string,
  completedSteps: string[] = [],
  processingSteps: string[] = [],
  paidPaymentSteps: { [key: string]: number } = {},
  agencyId: string = 'c1',
  commission: number = 15000,
  contractStatus: 'Active' | 'Completed' | 'Pending' | 'Terminated' = 'Active'
): ItalyPackageApplication => {
  const visaSteps = getDefaultVisaSteps();
  visaSteps.forEach(step => {
    if (completedSteps.includes(step.key)) {
      step.status = 'Completed';
      step.date = appliedAt;
      step.staffName = 'আহমেদ রনি (Staff)';
      step.adminNotes = `${step.name} completed successfully.`;
    } else if (processingSteps.includes(step.key)) {
      step.status = 'Processing';
      step.date = appliedAt;
      step.staffName = 'আহমেদ রনি (Staff)';
      step.adminNotes = `${step.name} process started.`;
    }
  });

  const paymentSteps = getDefaultPaymentSteps();
  let paidSum = 0;
  paymentSteps.forEach(pStep => {
    if (paidPaymentSteps[pStep.key] !== undefined) {
      const amountPaid = paidPaymentSteps[pStep.key];
      pStep.paidAmount = amountPaid;
      if (amountPaid >= pStep.amount) {
        pStep.status = 'Paid';
        pStep.paidDate = appliedAt;
      } else if (amountPaid > 0) {
        pStep.status = 'Partial';
        pStep.paidDate = appliedAt;
      } else {
        pStep.status = 'Unpaid';
      }
      paidSum += amountPaid;
    }
  });

  const totalAmount = paymentSteps.reduce((sum, p) => sum + p.amount, 0);

  const history = Object.keys(paidPaymentSteps).map((stepKey, i) => ({
    id: `tx_hist_${id}_${stepKey}`,
    amount: paidPaymentSteps[stepKey],
    date: appliedAt,
    method: 'bKash / Manual',
    invoiceId: `INV-2026-${id.slice(-4).toUpperCase()}-${100 + i}`,
    status: 'Verified' as const,
    stepKey
  }));

  const defaultTimeline = [
    { key: 'registration', label: 'Registration', status: 'Approved' as const, date: appliedAt },
    { key: 'offer_letter', label: 'Offer Letter', status: status === 'Approved' ? 'Approved' as const : 'Pending' as const, date: status === 'Approved' ? appliedAt : '' },
    { key: 'contract_uploaded', label: 'Contract Uploaded', status: status === 'Approved' ? 'Approved' as const : 'Pending' as const, date: status === 'Approved' ? appliedAt : '' },
    { key: 'admin_verify', label: 'Admin Verification', status: status === 'Approved' ? 'Approved' as const : 'Pending' as const, date: status === 'Approved' ? appliedAt : '' },
    { key: 'work_permit', label: 'Work Permit', status: completedSteps.includes('work_permit') ? 'Approved' as const : (processingSteps.includes('work_permit') ? 'Processing' as const : 'Pending' as const), date: completedSteps.includes('work_permit') ? appliedAt : '' },
    { key: 'mofa', label: 'MOFA', status: completedSteps.includes('mofa') ? 'Approved' as const : (processingSteps.includes('mofa') ? 'Processing' as const : 'Pending' as const), date: completedSteps.includes('mofa') ? appliedAt : '' },
    { key: 'invitation_letter', label: 'Invitation Letter', status: completedSteps.includes('invitation_letter') ? 'Approved' as const : (processingSteps.includes('invitation_letter') ? 'Processing' as const : 'Pending' as const), date: completedSteps.includes('invitation_letter') ? appliedAt : '' },
    { key: 'visa_submission', label: 'Visa Submission', status: completedSteps.includes('visa_submission') ? 'Approved' as const : 'Pending' as const },
    { key: 'visa_approved', label: 'Visa Approved', status: completedSteps.includes('visa_approved') ? 'Approved' as const : 'Pending' as const },
    { key: 'visa_printed', label: 'Visa Printed', status: completedSteps.includes('visa_printed') ? 'Approved' as const : 'Pending' as const },
    { key: 'air_ticket', label: 'Air Ticket', status: completedSteps.includes('ticket_issued') ? 'Approved' as const : 'Pending' as const },
    { key: 'departure', label: 'Departure', status: completedSteps.includes('departure') ? 'Approved' as const : 'Pending' as const },
    { key: 'arrived', label: 'Arrived', status: completedSteps.includes('arrived') ? 'Approved' as const : 'Pending' as const }
  ];

  return {
    id,
    packageName,
    candidateName,
    candidateEmail,
    candidatePhone,
    passportNumber,
    message,
    status,
    appliedAt,
    notes,
    priceAmount: `৳${totalAmount.toLocaleString()}`,
    visaSteps,
    paymentSteps,
    totalAmount,
    discount: 0,
    extraCharges: 0,
    paidAmount: paidSum,
    dueAmount: totalAmount - paidSum,
    paymentHistory: history,
    agencyId,
    commission,
    contractStatus,
    company: packageName === 'Premium' ? 'Impresa Pizzarotti & C. S.p.A.' : 'Astaldi S.p.A.',
    country: 'Italy',
    jobPosition: packageName === 'Premium' ? 'Construction Mason' : 'Electrician Helper',
    salary: packageName === 'Premium' ? '€1,450 / month' : '€1,200 / month',
    contractNumber: `CON-2026-${id.slice(-4).toUpperCase()}`,
    registrationFee: 10000,
    offerLetterFee: 15000,
    workPermitFee: 30000,
    mofaFee: 20000,
    invitationLetterFee: 15000,
    visaProcessingFee: 80000, // Updated for Workflow
    visaApprovalFee: 40000,
    visaPrintingFee: 10000,
    airTicketFee: 40000,      // Updated for Workflow
    
    // Recruitment workflow fields
    medicalFee: 8000,
    agencyServiceFee: 15000,
    embassyFee: 12000,
    insuranceFee: 5000,
    bmetFee: 4000,
    otherCharges: 10000,
    adminCommission: 20000,
    employerTotal: 170000,
    grandTotal: 190000,
    paymentPlanStatus: status === 'Approved' ? 'Approved' : 'Pending Admin Review',
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
      approvedBy: 'Admin Moderator',
      qrCode: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=150'
    },
    auditLogs: [
      { id: 'log_init_' + id, action: 'Payment Workflow Configured', user: 'Employer', timestamp: appliedAt, details: 'Initial cost breakdown submitted for review.' }
    ],
    documents: {
      offerLetter: { status: status === 'Approved' ? 'Approved' : 'Pending', fileUrl: 'italy_offer_letter.pdf' },
      employmentContract: { status: status === 'Approved' ? 'Approved' : 'Pending', fileUrl: 'italy_employment_contract.pdf' },
      workPermit: { status: completedSteps.includes('work_permit') ? 'Approved' : 'Pending', fileUrl: 'italy_work_permit.pdf' },
      passportCopy: { status: 'Approved', fileUrl: 'candidate_passport_scan.pdf' },
      visaDocuments: { status: completedSteps.includes('visa_approved') ? 'Approved' : 'Pending', fileUrl: 'visa_document_scan.pdf' },
      paymentReceipts: { status: paidSum > 0 ? 'Approved' : 'Pending', fileUrl: 'payment_receipt_copy.png' }
    },
    timeline: defaultTimeline
  };
};

export const INITIAL_ITALY_PACKAGES: ItalyPackageApplication[] = [
  createInitialPackage(
    'it_pkg_ariful_1',
    'Premium',
    'আরিফুল ইসলাম (Ariful Islam)',
    'ariful@example.com',
    '01712345678',
    'EH0987654',
    'Approved',
    '2026-07-02',
    'আমি ইতালির কন্সট্রাকশন জবের প্রিমিয়াম প্যাকেজে আবেদন করতে আগ্রহী। আমার প্রয়োজনীয় কাগজপত্র সংযুক্ত করেছি।',
    'আপনার কাগজপত্র সঠিক পাওয়া গেছে। ইউরপাস ফরম্যাটে সিভি তৈরি করা হয়েছে এবং আমরা ইতালির ৩টি কোম্পানিতে সিভি সাবমিট করেছি।',
    '৳২,০০,০০০',
    ['mofa', 'work_permit'],
    ['invitation_letter'],
    { registration: 10000, mofa: 20000 },
    'c1',
    15000,
    'Active'
  ),
  createInitialPackage(
    'it_pkg_seeker_1',
    'Standard',
    'আরিফুল ইসলাম (Ariful Islam)',
    'seeker@example.com',
    '01712345678',
    'EH0987654',
    'Pending',
    '2026-07-03',
    'ইতালি স্ট্যান্ডার্ড প্যাকেজ প্রসেসিংয়ের জন্য বুকিং করেছি।',
    'আপনার ডকুমেন্টস যাচাইকরণ পেন্ডিং আছে। অনুগ্রহ করে পাসপোর্ট কপি প্রদান করুন।',
    '৳২,০০,০০০',
    [],
    [],
    {},
    'c1',
    15000,
    'Pending'
  ),
  createInitialPackage(
    'it_pkg_1',
    'Standard',
    'মোহাম্মদ রাশেদ (Mohammad Rashed)',
    'rashed@example.com',
    '01712345678',
    'EH4817265',
    'Pending',
    '2026-07-02',
    'আমি ইতালির কনস্ট্রাকশন কোম্পানিতে আবেদন করতে আগ্রহী। আমার ৪ বছরের অভিজ্ঞতা আছে।',
    '',
    '৳২,০০,০০০',
    [],
    [],
    {},
    'c1',
    15000,
    'Pending'
  ),
  createInitialPackage(
    'it_pkg_2',
    'Premium',
    'মাসুম বিল্লাহ (Masum Billah)',
    'masum@example.com',
    '01811223344',
    'EH8827361',
    'Approved',
    '2026-07-01',
    'দয়া করে আমার সিভিটি ইউরোপাস ফরম্যাটে তৈরি করতে সাহায্য করুন এবং ইতালির জবে সাবমিট করুন।',
    '',
    '৳২,০০,০০০',
    ['mofa', 'work_permit', 'invitation_letter', 'visa_submission'],
    ['visa_approved'],
    { registration: 10000, mofa: 20000, work_permit: 30000, invitation_letter: 15000 },
    'c1',
    20000,
    'Active'
  ),
  createInitialPackage(
    'it_pkg_3',
    'Basic',
    'সজীব মাহমুদ (Sajib Mahmud)',
    'sajib@example.com',
    '01912349876',
    'EH9988221',
    'Rejected',
    '2026-06-29',
    'আমি নিজে আবেদন করার গাইড এবং Europass CV চাই।',
    'পাসপোর্টের ছবি স্পষ্ট ছিল না, গ্রাহক পুনরায় আবেদন করবেন।',
    '৳২,০০,০০০',
    [],
    [],
    {},
    'c2',
    10000,
    'Terminated'
  )
];

export const INITIAL_PAYMENT_METHODS: PaymentMethodSetting[] = [
  {
    id: 'bkash',
    name: 'bKash',
    type: 'manual',
    status: 'Enabled',
    accountType: 'Merchant',
    accountNumber: '01712345678',
    accountHolderName: 'Probashi Jobs Portal Ltd',
    paymentInstructions: 'বিকাশ অ্যাপ থেকে "Make Payment" অপশনে গিয়ে মার্চেন্ট নম্বরে পে করুন। পেমেন্ট শেষে ট্রানজেকশন আইডি ও স্ক্রিনশট সাবমিট করুন।',
    qrCodeUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=200&h=200&fit=crop&q=80',
    apiEnabled: true,
    apiKey: 'bks_api_key_847291a',
    apiSecret: 'bks_api_secret_991823bc',
    merchantId: 'PROBASHI_CORP_01',
    callbackUrl: 'https://ais-dev-gyom3lqawjsrydtjmbxkei-847705056863.asia-east1.run.app/api/bkash/callback',
    sandboxMode: true
  },
  {
    id: 'nagad',
    name: 'Nagad',
    type: 'manual',
    status: 'Enabled',
    accountType: 'Merchant',
    accountNumber: '01812345679',
    accountHolderName: 'Probashi Jobs Portal Ltd',
    paymentInstructions: 'নগদ অ্যাপ থেকে "Pay Bill" অথবা "Merchant Pay" অপশনে গিয়ে টাকা পরিশোধ করুন এবং সঠিক Transaction ID নিশ্চিত করুন।',
    qrCodeUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=200&h=200&fit=crop&q=80',
    apiEnabled: false,
    apiKey: 'ngd_api_key_112093e',
    apiSecret: 'ngd_api_secret_449182ff',
    merchantId: 'PROBASHI_NAGAD_02',
    callbackUrl: 'https://ais-dev-gyom3lqawjsrydtjmbxkei-847705056863.asia-east1.run.app/api/nagad/callback',
    sandboxMode: true
  },
  {
    id: 'rocket',
    name: 'Rocket',
    type: 'manual',
    status: 'Enabled',
    accountType: 'Personal',
    accountNumber: '019123456801',
    accountHolderName: 'Miraz Reza (Director)',
    paymentInstructions: 'রকেট পার্সোনাল নম্বরে "Send Money" করে পেমেন্ট সম্পূর্ণ করুন। লাস্ট ডিজিটসহ সম্পূর্ণ নম্বর ও Txn ID সাবমিট করুন।',
    qrCodeUrl: '',
    apiEnabled: false
  },
  {
    id: 'upay',
    name: 'Upay',
    type: 'manual',
    status: 'Enabled',
    accountType: 'Personal',
    accountNumber: '01612345681',
    accountHolderName: 'Probashi Finance',
    paymentInstructions: 'উপায় অ্যাপ থেকে উক্ত পার্সোনাল নম্বরে ক্যাশ-ইন অথবা সেন্ড মানি করুন। পেমেন্ট ক্লিয়ার হওয়ার পর সাবমিট করুন।',
    qrCodeUrl: '',
    apiEnabled: false
  },
  {
    id: 'cellfin',
    name: 'CellFin',
    type: 'manual',
    status: 'Enabled',
    accountType: 'Personal',
    accountNumber: '01512345682',
    accountHolderName: 'Islami Bank Account Transfer',
    paymentInstructions: 'ইসলামী ব্যাংকের সেলফিন অ্যাপ ব্যবহার করে উক্ত সেলফিন নম্বরে ফান্ড ট্রান্সফার বা অ্যাড মানি করুন।',
    qrCodeUrl: '',
    apiEnabled: false
  },
  {
    id: 'tap',
    name: 'Tap',
    type: 'manual',
    status: 'Disabled',
    accountType: 'Personal',
    accountNumber: '01312345683',
    accountHolderName: 'Probashi Tap Account',
    paymentInstructions: 'ট্যাপ একাউন্টে সেন্ড মানি করুন। ট্রানজেকশন ক্লিয়ারেন্স দিন।',
    qrCodeUrl: '',
    apiEnabled: false
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    type: 'manual',
    status: 'Enabled',
    accountHolderName: 'Probashi Jobs Portal Ltd',
    accountNumber: '123-456-7890123',
    branchName: 'Uttara Main Branch',
    routingNumber: '090261123',
    swiftCode: 'DBBLBDDHXXX',
    paymentInstructions: 'ডাচ-বাংলা ব্যাংক (DBBL) অ্যাকাউন্টে সরাসরি ব্রাঞ্চ ডিপোজিট, অনলাইন ফান্ড ট্রান্সফার (EFTN/NPSB) করুন এবং ডিপোজিট স্লিপ সংযুক্ত করুন।'
  },
  {
    id: 'sslcommerz',
    name: 'SSLCommerz',
    type: 'api',
    status: 'Enabled',
    apiEnabled: true,
    apiKey: 'ssl_api_key_probashi_sec_99a',
    apiSecret: 'ssl_api_secret_44321',
    merchantId: 'SSL_PROBASHI_CORP',
    storeId: 'probashijobstest001',
    storePassword: 'probashijobstest001@ssl',
    callbackUrl: 'https://ais-dev-gyom3lqawjsrydtjmbxkei-847705056863.asia-east1.run.app/api/sslcommerz/callback',
    sandboxMode: true
  },
  {
    id: 'portwallet',
    name: 'PortWallet',
    type: 'api',
    status: 'Disabled',
    apiEnabled: false,
    apiKey: 'port_api_key_44321a',
    apiSecret: 'port_secret_88271',
    merchantId: 'PORT_PROBASHI',
    callbackUrl: 'https://ais-dev-gyom3lqawjsrydtjmbxkei-847705056863.asia-east1.run.app/api/portwallet/callback',
    sandboxMode: true
  },
  {
    id: 'aamarpay',
    name: 'aamarPay',
    type: 'api',
    status: 'Disabled',
    apiEnabled: false,
    apiKey: 'aamar_api_key_55321',
    apiSecret: 'aamar_secret_88192a',
    merchantId: 'AAMAR_PROBASHI',
    storeId: 'aamarpay_probashi_store',
    callbackUrl: 'https://ais-dev-gyom3lqawjsrydtjmbxkei-847705056863.asia-east1.run.app/api/aamarpay/callback',
    sandboxMode: true
  }
];

export const INITIAL_AGENT_BANK_ACCOUNTS: AgentBankAccount[] = [
  {
    id: 'bank_c1_1',
    agencyId: 'c1',
    agencyName: 'Gulf Careers recruiting agency',
    bankName: 'Dutch Bangla Bank Ltd',
    accountName: 'Gulf Careers Overseas Ltd',
    accountNumber: '110-120-4920193',
    branchName: 'Gulshan Branch, Dhaka',
    routingNumber: '09026173',
    swiftCode: 'DBBLBDDH',
    paymentMethod: 'Bank Transfer',
    country: 'All',
    status: 'Approved',
    isActive: true,
    isPriority: true,
    isVerifiedBadge: true,
    notes: 'Primary bank account for Gulf Countries visa process.',
    createdAt: '2026-06-01',
    updatedAt: '2026-06-01'
  },
  {
    id: 'bank_c1_2',
    agencyId: 'c1',
    agencyName: 'Gulf Careers recruiting agency',
    bankName: 'Islami Bank Bangladesh PLC',
    accountName: 'Gulf Careers Ltd',
    accountNumber: '20502180100456',
    branchName: 'Dhanmondi Branch, Dhaka',
    routingNumber: '12526180',
    paymentMethod: 'Bank Transfer',
    country: 'Saudi Arabia 🇸🇦',
    status: 'Approved',
    isActive: true,
    isPriority: false,
    isVerifiedBadge: true,
    notes: 'Saudi Arabia visa fee deposit account.',
    createdAt: '2026-06-10',
    updatedAt: '2026-06-10'
  },
  {
    id: 'bank_c1_3',
    agencyId: 'c1',
    agencyName: 'Gulf Careers recruiting agency',
    bankName: 'bKash Merchant Account',
    accountName: 'Gulf Careers bKash Pay',
    accountNumber: '01711223344',
    paymentMethod: 'bKash',
    country: 'All',
    status: 'Approved',
    isActive: true,
    isPriority: false,
    isVerifiedBadge: true,
    notes: 'Instant mobile merchant payment.',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-15'
  },
  {
    id: 'bank_c1_4',
    agencyId: 'c1',
    agencyName: 'Gulf Careers recruiting agency',
    bankName: 'City Bank PLC',
    accountName: 'Gulf Careers Expansion Account',
    accountNumber: '1109823412001',
    branchName: 'Banani Branch',
    paymentMethod: 'Bank Transfer',
    country: 'UAE 🇦🇪',
    status: 'Pending',
    isActive: true,
    isPriority: false,
    isVerifiedBadge: false,
    notes: 'Newly added account waiting for Admin verification.',
    createdAt: '2026-07-20',
    updatedAt: '2026-07-20'
  },
  {
    id: 'bank_c2_1',
    agencyId: 'c2',
    agencyName: 'Eastern Overseas',
    bankName: 'BRAC Bank PLC',
    accountName: 'Eastern Overseas Pvt Ltd',
    accountNumber: '1501209847120001',
    branchName: 'Uttara Branch, Dhaka',
    routingNumber: '06026221',
    paymentMethod: 'Bank Transfer',
    country: 'Singapore 🇸🇬',
    status: 'Approved',
    isActive: true,
    isPriority: true,
    isVerifiedBadge: true,
    notes: 'Singapore Work Permit candidate deposit account.',
    createdAt: '2026-06-05',
    updatedAt: '2026-06-05'
  },
  {
    id: 'bank_c2_2',
    agencyId: 'c2',
    agencyName: 'Eastern Overseas',
    bankName: 'Nagad Personal Account',
    accountName: 'Eastern Overseas Director',
    accountNumber: '01899887766',
    paymentMethod: 'Nagad',
    country: 'All',
    status: 'Pending',
    isActive: true,
    isPriority: false,
    isVerifiedBadge: false,
    notes: 'Nagad collection account.',
    createdAt: '2026-07-22',
    updatedAt: '2026-07-22'
  },
  {
    id: 'bank_admin_1',
    agencyId: 'admin',
    agencyName: 'Probashi Jobs Official Escrow',
    bankName: 'Sonali Bank Ltd (Central Escrow)',
    accountName: 'Probashi Jobs Portal Escrow Account',
    accountNumber: '4401201987623',
    branchName: 'Dhaka Main Branch',
    routingNumber: '20027001',
    paymentMethod: 'Bank Transfer',
    country: 'All',
    status: 'Approved',
    isActive: true,
    isPriority: true,
    isVerifiedBadge: true,
    isAdminCompanyAccount: true,
    notes: 'Official platform escrow account for maximum candidate safety.',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  }
];

export const INITIAL_CLIENT_PAYMENTS: ClientPaymentSubmission[] = [
  {
    id: 'pay_sub_101',
    candidateName: 'আরিফুল ইসলাম (Ariful Islam)',
    candidateEmail: 'ariful@example.com',
    candidatePhone: '01712345678',
    passportNumber: 'EH0987654',
    agencyId: 'c1',
    agencyName: 'Gulf Careers recruiting agency',
    bankAccountId: 'bank_c1_1',
    bankName: 'Dutch Bangla Bank Ltd',
    accountNumber: '110-120-4920193',
    paymentMethod: 'Bank Transfer',
    amount: 10000,
    currency: 'BDT',
    txID: 'DBBL-TXN-984721',
    slipFileUrl: 'dbbl_deposit_slip_ariful.pdf',
    stepName: 'Registration Fee Deposit',
    agentConfirmation: 'Confirmed',
    agentNotes: 'Deposit slip checked and matched with DBBL bank statement.',
    agentConfirmedAt: '2026-07-11 14:30',
    adminVerification: 'Verified',
    adminNotes: 'Admin verified and ledger updated.',
    adminVerifiedAt: '2026-07-11 16:00',
    createdAt: '2026-07-10 11:15'
  },
  {
    id: 'pay_sub_102',
    candidateName: 'মো: রফিকুল ইসলাম',
    candidateEmail: 'seeker@example.com',
    candidatePhone: '01811223344',
    passportNumber: 'A12345678',
    agencyId: 'c1',
    agencyName: 'Gulf Careers recruiting agency',
    bankAccountId: 'bank_c1_3',
    bankName: 'bKash Merchant Account',
    accountNumber: '01711223344',
    paymentMethod: 'bKash',
    amount: 20000,
    currency: 'BDT',
    txID: 'BKS-99182374612',
    slipFileUrl: 'bkash_payment_screenshot.jpg',
    stepName: 'MoFA Attestation Charge',
    agentConfirmation: 'Pending',
    adminVerification: 'Pending',
    createdAt: '2026-07-28 09:10'
  }
];

export const INITIAL_ADMIN_BANK_SETTINGS: AdminBankSettings = DEFAULT_ADMIN_BANK_SETTINGS;

export const INITIAL_PAYMENT_AUDIT_LOGS: PaymentAuditLog[] = [
  {
    id: 'log_1',
    user: 'hmmirazreza2@gmail.com (Super Admin)',
    methodId: 'bkash',
    methodName: 'bKash',
    changeType: 'Number Change',
    oldValue: '01711-111222',
    newValue: '01712-345678',
    date: '2026-07-01 11:30 AM',
    ipAddress: '103.88.22.45'
  },
  {
    id: 'log_2',
    user: 'hmmirazreza2@gmail.com (Super Admin)',
    methodId: 'sslcommerz',
    methodName: 'SSLCommerz',
    changeType: 'Status Change',
    oldValue: 'Disabled',
    newValue: 'Enabled',
    date: '2026-07-01 11:35 AM',
    ipAddress: '103.88.22.45'
  }
];

// Helper functions for state sync with LocalStorage
import { PortalUser, LoginActivity } from './types/auth';
import { SeoPageConfig, GlobalSeoSettings } from './types/seo';
import { getInitialSeoConfigs, generateInitialGlobalSeo } from './utils/seoHelper';
import { ScamAlert, ScamAuditLog } from './types/scam';

export const INITIAL_USERS: PortalUser[] = [
  {
    id: 'usr_super_admin',
    name: 'মীররাজ রেজা (Super Admin)',
    email: 'superadmin@probashi.com',
    mobile: '01700000001',
    passwordHash: 'password123',
    role: 'super_admin',
    status: 'Active',
    isLocked: false,
    failedAttempts: 0,
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2026-06-01'
  },
  {
    id: 'usr_admin',
    name: 'আনিসুর রহমান (Office Admin)',
    email: 'admin@probashi.com',
    mobile: '01700000002',
    passwordHash: 'password123',
    role: 'admin',
    status: 'Active',
    isLocked: false,
    failedAttempts: 0,
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2026-06-05'
  },
  {
    id: 'usr_staff',
    name: 'সজীব মাহমুদ (Visa Staff)',
    email: 'staff@probashi.com',
    mobile: '01700000003',
    passwordHash: 'password123',
    role: 'staff',
    status: 'Active',
    department: 'Visa Operations',
    permissions: ['Verify Payments', 'Update Visa Steps'],
    isLocked: false,
    failedAttempts: 0,
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2026-06-10'
  },
  {
    id: 'usr_employer',
    name: 'গালফ ক্যারিয়ারস এমপ্লয়ার',
    email: 'employer@example.com',
    mobile: '01712345679',
    passwordHash: 'password123',
    role: 'employer',
    status: 'Active',
    companyName: 'Gulf Careers recruiting agency',
    ownerName: 'মীররাজ রেজা',
    registrationNumber: 'RL-1452',
    isLocked: false,
    failedAttempts: 0,
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2026-06-15'
  },
  {
    id: 'usr_seeker',
    name: 'আরিফুল ইসলাম (Candidate)',
    email: 'seeker@example.com',
    mobile: '01712345678',
    passwordHash: 'password123',
    role: 'seeker',
    status: 'Active',
    country: 'Bangladesh 🇧🇩',
    isLocked: false,
    failedAttempts: 0,
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2026-06-20'
  }
];

export const INITIAL_LOGIN_ACTIVITIES: LoginActivity[] = [
  {
    id: 'act_1',
    userId: 'usr_seeker',
    userEmail: 'seeker@example.com',
    userRole: 'seeker',
    loginTime: '2026-07-08 09:30 AM',
    logoutTime: '2026-07-08 10:15 AM',
    ipAddress: '103.220.14.88',
    browser: 'Chrome 126.0',
    device: 'Desktop (Windows)',
    country: 'Bangladesh 🇧🇩',
    status: 'Success'
  },
  {
    id: 'act_2',
    userId: 'usr_employer',
    userEmail: 'employer@example.com',
    userRole: 'employer',
    loginTime: '2026-07-08 10:20 AM',
    ipAddress: '103.88.22.45',
    browser: 'Safari 17.4',
    device: 'iPhone 15 Pro',
    country: 'Bangladesh 🇧🇩',
    status: 'Active Session'
  }
];

export const INITIAL_SCAM_ALERTS: ScamAlert[] = [
  {
    id: 'scam_1',
    title: 'এস এস ওভারসিজ লিমিটেড / মজনু মিয়া (ভুয়া রিক্রুটিং এজেন্ট)',
    category: 'fake_agent',
    phoneNumber: '01712-345678',
    location: 'হাউজ ২৪, রোড ১২, সেক্টর ৩, উত্তরা, ঢাকা',
    description: 'অভিযোগ অনুযায়ী উক্ত ব্যক্তি/প্রতিষ্ঠান ইতালি ও রোমানিয়াতে কনস্ট্রাকশন কাজে ভালো বেতনে লোক পাঠানোর নামে ১০ জনের নিকট থেকে অগ্রিম ৫,০০,০০০ টাকা করে হাতিয়ে নিয়ে যোগাযোগ বন্ধ করেছে। বর্তমানে তাদের অফিস তালাবদ্ধ রয়েছে এবং কোনো বৈধ আরএল (RL) লাইসেন্স নেই।',
    photoUrl: 'https://images.openai.com/static-rsc-4/ftyHeHCXvypXR1jNV-xCsycq6TJwpiIXxBBRPyvrA1Y1IHS0poEQavbsBc9EftpSGm3vubtF4sbo7F81wHhWEurrVgf8zkDgwPmq9eG8My7FuALQ-cutThHOOnRw9y83pfzZdhEJI7rDag3Fwp9wxAkXNhWROP1yqSutqvsnSvJ58Tq2AzDHmKZyISIaR0tB?purpose=fullsize',
    evidenceFiles: [
      { name: 'টাকা গ্রহনের রসিদ.jpg', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400', type: 'image/jpeg' },
      { name: 'চ্যাটের স্ক্রিনশট.pdf', url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=400', type: 'application/pdf' }
    ],
    evidenceText: '১. অভিযোগকারী মহিউদ্দিনের পেমেন্ট রসিদ নং এসএস-১০৯৪। ২. হোয়াটসঅ্যাপে টাকা দাবি ও পাসপোর্টের ছবি আদান-প্রদানের স্ক্রিনশটসমূহ। ৩. উত্তরা পশ্চিম থানায় জিডি কপি নং ৪৪৫/২০২৬।',
    postedBy: {
      name: 'মীররাজ রেজা (Super Admin)',
      role: 'super_admin',
      email: 'superadmin@probashi.com'
    },
    createdAt: '2026-07-01 11:30 AM',
    approved: true,
    archived: false
  },
  {
    id: 'scam_2',
    title: 'ভুয়া সৌদি আরব ড্রাইভার ভিসা ও রিক্রুটমেন্ট সার্কুলার',
    category: 'fake_job',
    phoneNumber: '01911-987654',
    location: 'চৌদ্দগ্রাম, কুমিল্লা',
    description: 'সৌদি আরবে ফ্রি ভিসায় মাসে ৮০,০০০ টাকা বেতনের ভুয়া অফার লেটার দিয়ে সাধারণ চাকরিপ্রার্থীদের মেডিকেল টেস্ট ও প্রসেসিং ফি বাবদ ২৫,০০০ টাকা করে আদায় করা হচ্ছিল। অনুসন্ধানে জানা গেছে উক্ত রিক্রুটারের কোনো সরকারি লাইসেন্স বা রিক্রুটিং পারমিট নেই। অফার লেটারটি সম্পূর্ণ নকল।',
    photoUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop',
    evidenceFiles: [
      { name: 'Fake_Offer_Letter.png', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400', type: 'image/png' }
    ],
    evidenceText: '১. রিয়াদের কাল্পনিক কোম্পানির প্যাডে তৈরি ভুয়া চুক্তিপত্র। ২. সৌদি অ্যাম্বাসির কিউআর কোড জাল করে বানানো ভিসা স্ট্যাম্পিং পেপার।',
    postedBy: {
      name: 'সাকিব হাসান (Staff)',
      role: 'staff',
      email: 'staff@probashi.com'
    },
    createdAt: '2026-07-03 04:15 PM',
    approved: true,
    archived: false
  },
  {
    id: 'scam_3',
    title: 'ভিসা প্রসেসিং ফি বাবদ বিকাশ পেমেন্ট দাবি (জরুরি সতর্কতা)',
    category: 'payment_fraud',
    phoneNumber: '01822-111222',
    location: 'অনলাইন / মোবাইল ব্যাংকিং (বিকাশ)',
    description: 'প্রবাসী কল্যাণ ব্যাংক এবং জনশক্তি কর্মসংস্থান ও প্রশিক্ষণ ব্যুরো (BMET) এর কর্মকর্তাদের ভুয়া পরিচয় দিয়ে প্রার্থীদের মোবাইলে কল দিয়ে জানানো হচ্ছে যে তাদের রোমানিয়া বা ক্রোয়েশিয়ার সরকারি ফাইল সিলেক্ট হয়েছে এবং প্রসেসিং ফি বাবদ ১২,৫০০ টাকা অবিলম্বে বিকাশে পাঠাতে হবে। ব্যাংক বা বিএমইটি কখনোই এভাবে মোবাইলে বিকাশ পেমেন্ট চায় না।',
    photoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=600&auto=format&fit=crop',
    evidenceFiles: [
      { name: 'বিকাশ_ট্রানজেকশন_আইডি.jpg', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=400', type: 'image/jpeg' }
    ],
    evidenceText: 'বিকাশ পার্সোনাল নম্বর: ০১৮২২-১১১২২২ এবং ০১৭৮৯-৪৫৫৬৬৬। এরা সরকারি পোর্টালের চাকরিদাতাদের নাম ব্যবহার করে প্রার্থীদের প্রতারিত করছে।',
    postedBy: {
      name: 'সাকিব হাসান (Staff)',
      role: 'staff',
      email: 'staff@probashi.com'
    },
    createdAt: '2026-07-08 10:20 AM',
    approved: false, // Pending Admin approval
    archived: false
  },
  {
    id: 'scam_4',
    title: 'ভুয়া মালয়েশিয়া ফ্যাক্টরি ওয়ার্কার ভিসা প্রসেসিং চক্র',
    category: 'visa_fraud',
    phoneNumber: '01300-444555',
    location: 'সিলেট কোতোয়ালী ও মৌলভীবাজার',
    description: 'মৌলভীবাজারের একটি ভুয়া ট্রাভেলস মালয়েশিয়ার কলিং ভিসা দেওয়ার কথা বলে ২০ জন যুবকের পাসপোর্ট প্রায় ৬ মাস ধরে আটকে রেখে অতিরিক্ত অর্থ দাবি করে আসছিল। অভিযোগ পাওয়ার পর প্রশাসনিক তদন্ত ও জেরা করা হয়, তারা কোনো লাইসেন্স প্রদর্শন করতে পারেনি।',
    photoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop',
    evidenceFiles: [
      { name: 'পাসপোর্ট_জব্দ_তালিকা.pdf', url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=400', type: 'application/pdf' }
    ],
    evidenceText: 'ভুক্তভোগীদের পাসপোর্ট জব্দ করার লিখিত স্বীকারোক্তি এবং পরবর্তীতে আইনি চাপের মুখে পাসপোর্ট ফেরতের মুচলেকা পত্র।',
    postedBy: {
      name: 'মীররাজ রেজা (Super Admin)',
      role: 'super_admin',
      email: 'superadmin@probashi.com'
    },
    createdAt: '2026-06-15 02:30 PM',
    approved: true,
    archived: true // Archived post
  }
];

export const INITIAL_SCAM_AUDIT_LOGS: ScamAuditLog[] = [
  {
    id: 'slog_1',
    alertId: 'scam_1',
    action: 'create',
    performedBy: { name: 'মীররাজ রেজা (Super Admin)', role: 'super_admin', email: 'superadmin@probashi.com' },
    details: 'উত্তরা পশ্চিম থানার অভিযোগের ভিত্তিতে এস এস ওভারসিজ লিমিটেডের বিরুদ্ধে সতর্কতা পোস্ট তৈরি করা হয়েছে।',
    timestamp: '2026-07-01 11:30 AM'
  },
  {
    id: 'slog_2',
    alertId: 'scam_2',
    action: 'create',
    performedBy: { name: 'সাকিব হাসান (Staff)', role: 'staff', email: 'staff@probashi.com' },
    details: 'কুমিল্লার ভুয়া রিক্রুটারের বিরুদ্ধে ড্রাইভার ভিসার সতর্কতা তৈরি করা হয়েছে।',
    timestamp: '2026-07-03 04:15 PM'
  },
  {
    id: 'slog_3',
    alertId: 'scam_3',
    action: 'create',
    performedBy: { name: 'সাকিব হাসান (Staff)', role: 'staff', email: 'staff@probashi.com' },
    details: 'বিকাশ প্রতারক চক্রের ফোন নম্বরের বিবরণ ও বিবরণ সংযুক্ত করা হয়েছে (অনুমোদনের অপেক্ষায়)।',
    timestamp: '2026-07-08 10:20 AM'
  }
];

export function getLocalStorageState() {
  if (typeof window === 'undefined') {
    return {
      jobs: INITIAL_JOBS,
      companies: INITIAL_COMPANIES,
      applications: INITIAL_APPLICATIONS,
      transactions: INITIAL_TRANSACTIONS,
      notifications: INITIAL_NOTIFICATIONS,
      italyPackages: INITIAL_ITALY_PACKAGES,
      currentUserType: 'seeker' as 'seeker' | 'employer',
      currentSeekerEmail: 'seeker@example.com',
      currentEmployerCompanyId: 'c1', // default is Gulf Careers
      savedJobs: [] as string[],
      paymentMethods: INITIAL_PAYMENT_METHODS,
      paymentAuditLogs: INITIAL_PAYMENT_AUDIT_LOGS,
      companyReports: INITIAL_COMPANY_REPORTS,
      blacklistItems: INITIAL_BLACKLIST_ITEMS,
      systemAuditLogs: INITIAL_SYSTEM_AUDIT_LOGS,
      users: INITIAL_USERS as PortalUser[],
      currentUser: INITIAL_USERS[4] as PortalUser | null, // Preloaded seeker as active session
      loginActivities: INITIAL_LOGIN_ACTIVITIES as LoginActivity[],
      seoConfigs: [] as SeoPageConfig[],
      globalSeo: {
        sitemapXml: "",
        sitemapHtml: "",
        robotsTxt: "",
        googleVerificationCode: "",
        bingVerificationCode: "",
        isSitemapPinged: false,
        searchEngineIndexingEnabled: true
      } as GlobalSeoSettings,
      scamAlerts: INITIAL_SCAM_ALERTS as ScamAlert[],
      scamAuditLogs: INITIAL_SCAM_AUDIT_LOGS as ScamAuditLog[],
      agentBankAccounts: INITIAL_AGENT_BANK_ACCOUNTS as AgentBankAccount[],
      clientPayments: INITIAL_CLIENT_PAYMENTS as ClientPaymentSubmission[],
      adminBankSettings: INITIAL_ADMIN_BANK_SETTINGS as AdminBankSettings
    };
  }

  const jobs = JSON.parse(localStorage.getItem('probashi_jobs') || JSON.stringify(INITIAL_JOBS));
  const companies = JSON.parse(localStorage.getItem('probashi_companies') || JSON.stringify(INITIAL_COMPANIES));
  const applications = JSON.parse(localStorage.getItem('probashi_applications') || JSON.stringify(INITIAL_APPLICATIONS));
  const transactions = JSON.parse(localStorage.getItem('probashi_transactions') || JSON.stringify(INITIAL_TRANSACTIONS));
  const notifications = JSON.parse(localStorage.getItem('probashi_notifications') || JSON.stringify(INITIAL_NOTIFICATIONS));
  const paymentMethods = JSON.parse(localStorage.getItem('probashi_payment_methods') || JSON.stringify(INITIAL_PAYMENT_METHODS));
  const paymentAuditLogs = JSON.parse(localStorage.getItem('probashi_payment_audit_logs') || JSON.stringify(INITIAL_PAYMENT_AUDIT_LOGS));
  const companyReports = JSON.parse(localStorage.getItem('probashi_company_reports') || JSON.stringify(INITIAL_COMPANY_REPORTS));
  const blacklistItems = JSON.parse(localStorage.getItem('probashi_blacklist_items') || JSON.stringify(INITIAL_BLACKLIST_ITEMS));
  const systemAuditLogs = JSON.parse(localStorage.getItem('probashi_system_audit_logs') || JSON.stringify(INITIAL_SYSTEM_AUDIT_LOGS));
  
  let italyPackages = JSON.parse(localStorage.getItem('probashi_italy_packages') || JSON.stringify(INITIAL_ITALY_PACKAGES));
  
  // Make sure we have the Ariful and Seeker packages injected if they are missing
  if (!italyPackages.some((p: any) => p.candidateEmail === 'ariful@example.com') || 
      !italyPackages.some((p: any) => p.candidateEmail === 'seeker@example.com')) {
    const extraPkgs = [
      createInitialPackage(
        'it_pkg_ariful_1',
        'Premium',
        'আরিফুল ইসলাম (Ariful Islam)',
        'ariful@example.com',
        '01712345678',
        'EH0987654',
        'Approved',
        '2026-07-02',
        'আমি ইতালির কন্সট্রাকশন জবের প্রিমিয়াম প্যাকেজে আবেদন করতে আগ্রহী। আমার প্রয়োজনীয় কাগজপত্র সংযুক্ত করেছি।',
        'আপনার কাগজপত্র সঠিক পাওয়া গেছে। ইউরপাস ফরম্যাটে সিভি তৈরি করা হয়েছে এবং আমরা ইতালির ৩টি কোম্পানিতে সিভি সাবমিট করেছি।',
        '৳২,০০,০০০',
        ['mofa', 'work_permit'],
        ['invitation_letter'],
        { registration: 10000, mofa: 20000 },
        'c1',
        15000,
        'Active'
      ),
      createInitialPackage(
        'it_pkg_seeker_1',
        'Standard',
        'আরিফুল ইসলাম (Ariful Islam)',
        'seeker@example.com',
        '01712345678',
        'EH0987654',
        'Pending',
        '2026-07-03',
        'ইতালি স্ট্যান্ডার্ড প্যাকেজ প্রসেসিংয়ের জন্য বুকিং করেছি।',
        'আপনার ডকুমেন্টস যাচাইকরণ পেন্ডিং আছে। অনুগ্রহ করে পাসপোর্ট কপি প্রদান করুন।',
        '৳২,০০,০০০',
        [],
        [],
        {},
        'c1',
        15000,
        'Pending'
      )
    ];
    // Filter out duplicates if somehow there's already one with that exact id
    const filteredItPkgs = italyPackages.filter((p: any) => p.id !== 'it_pkg_ariful_1' && p.id !== 'it_pkg_seeker_1');
    italyPackages = [...extraPkgs, ...filteredItPkgs];
    localStorage.setItem('probashi_italy_packages', JSON.stringify(italyPackages));
  }

  const currentUserType = localStorage.getItem('probashi_userType') || 'seeker';
  const currentSeekerEmail = localStorage.getItem('probashi_seekerEmail') || 'seeker@example.com';
  const currentEmployerCompanyId = localStorage.getItem('probashi_employerCompanyId') || 'c1';
  const savedJobs = JSON.parse(localStorage.getItem('probashi_savedJobs') || '[]');

  let usersList: PortalUser[] = [];
  const storedUsersStr = localStorage.getItem('probashi_users');
  if (storedUsersStr) {
    try {
      usersList = JSON.parse(storedUsersStr);
      let listModified = false;
      INITIAL_USERS.forEach((initU) => {
        if (!usersList.some(u => u.email.toLowerCase() === initU.email.toLowerCase())) {
          usersList.push(initU);
          listModified = true;
        }
      });
      if (listModified) {
        localStorage.setItem('probashi_users', JSON.stringify(usersList));
      }
    } catch (e) {
      usersList = INITIAL_USERS;
      localStorage.setItem('probashi_users', JSON.stringify(INITIAL_USERS));
    }
  } else {
    usersList = INITIAL_USERS;
    localStorage.setItem('probashi_users', JSON.stringify(INITIAL_USERS));
  }
  const users = usersList;
  const currentUser = localStorage.getItem('probashi_current_user') 
    ? JSON.parse(localStorage.getItem('probashi_current_user')!) 
    : null; // Start logged out by default so the user sees the Web Portal landing page and Android Simulator
  const loginActivities = JSON.parse(localStorage.getItem('probashi_login_activities') || JSON.stringify(INITIAL_LOGIN_ACTIVITIES));

  const seoConfigsStr = localStorage.getItem('probashi_seo_configs');
  const seoConfigs: SeoPageConfig[] = seoConfigsStr 
    ? JSON.parse(seoConfigsStr) 
    : getInitialSeoConfigs(jobs, companies);

  const globalSeoStr = localStorage.getItem('probashi_global_seo');
  const globalSeo: GlobalSeoSettings = globalSeoStr 
    ? JSON.parse(globalSeoStr) 
    : generateInitialGlobalSeo(seoConfigs);

  const scamAlerts = JSON.parse(localStorage.getItem('probashi_scam_alerts') || JSON.stringify(INITIAL_SCAM_ALERTS));
  const scamAuditLogs = JSON.parse(localStorage.getItem('probashi_scam_audit_logs') || JSON.stringify(INITIAL_SCAM_AUDIT_LOGS));
  const agentBankAccounts = JSON.parse(localStorage.getItem('probashi_agent_bank_accounts') || JSON.stringify(INITIAL_AGENT_BANK_ACCOUNTS));
  const clientPayments = JSON.parse(localStorage.getItem('probashi_client_payments') || JSON.stringify(INITIAL_CLIENT_PAYMENTS));
  const adminBankSettings = JSON.parse(localStorage.getItem('probashi_admin_bank_settings') || JSON.stringify(INITIAL_ADMIN_BANK_SETTINGS));

  return {
    jobs,
    companies,
    applications,
    transactions,
    notifications,
    italyPackages,
    currentUserType: currentUserType as 'seeker' | 'employer',
    currentSeekerEmail,
    currentEmployerCompanyId,
    savedJobs: savedJobs as string[],
    paymentMethods,
    paymentAuditLogs,
    companyReports,
    blacklistItems,
    systemAuditLogs,
    users: users as PortalUser[],
    currentUser: currentUser as PortalUser | null,
    loginActivities: loginActivities as LoginActivity[],
    seoConfigs,
    globalSeo,
    scamAlerts: scamAlerts as ScamAlert[],
    scamAuditLogs: scamAuditLogs as ScamAuditLog[],
    agentBankAccounts: agentBankAccounts as AgentBankAccount[],
    clientPayments: clientPayments as ClientPaymentSubmission[],
    adminBankSettings: adminBankSettings as AdminBankSettings
  };
}

export function saveLocalStorageState(state: ReturnType<typeof getLocalStorageState>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('probashi_jobs', JSON.stringify(state.jobs));
  localStorage.setItem('probashi_companies', JSON.stringify(state.companies));
  localStorage.setItem('probashi_applications', JSON.stringify(state.applications));
  localStorage.setItem('probashi_transactions', JSON.stringify(state.transactions));
  localStorage.setItem('probashi_notifications', JSON.stringify(state.notifications));
  localStorage.setItem('probashi_italy_packages', JSON.stringify(state.italyPackages));
  localStorage.setItem('probashi_userType', state.currentUserType);
  localStorage.setItem('probashi_seekerEmail', state.currentSeekerEmail);
  localStorage.setItem('probashi_employerCompanyId', state.currentEmployerCompanyId);
  localStorage.setItem('probashi_savedJobs', JSON.stringify(state.savedJobs));
  localStorage.setItem('probashi_payment_methods', JSON.stringify(state.paymentMethods));
  localStorage.setItem('probashi_payment_audit_logs', JSON.stringify(state.paymentAuditLogs));
  localStorage.setItem('probashi_company_reports', JSON.stringify(state.companyReports));
  localStorage.setItem('probashi_blacklist_items', JSON.stringify(state.blacklistItems));
  localStorage.setItem('probashi_system_audit_logs', JSON.stringify(state.systemAuditLogs));
  localStorage.setItem('probashi_users', JSON.stringify(state.users));
  localStorage.setItem('probashi_current_user', state.currentUser ? JSON.stringify(state.currentUser) : '');
  localStorage.setItem('probashi_login_activities', JSON.stringify(state.loginActivities));
  localStorage.setItem('probashi_seo_configs', JSON.stringify(state.seoConfigs));
  localStorage.setItem('probashi_global_seo', JSON.stringify(state.globalSeo));
  localStorage.setItem('probashi_scam_alerts', JSON.stringify(state.scamAlerts));
  localStorage.setItem('probashi_scam_audit_logs', JSON.stringify(state.scamAuditLogs));
  localStorage.setItem('probashi_agent_bank_accounts', JSON.stringify(state.agentBankAccounts || []));
  localStorage.setItem('probashi_client_payments', JSON.stringify(state.clientPayments || []));
  localStorage.setItem('probashi_admin_bank_settings', JSON.stringify(state.adminBankSettings || DEFAULT_ADMIN_BANK_SETTINGS));
}
