export type PaymentMethodType = 'Bank Transfer' | 'bKash' | 'Nagad' | 'Rocket' | 'USDT' | 'SSLCommerz' | 'Other';

export type BankAccountStatus = 'Pending' | 'Approved' | 'Rejected' | 'Suspended';

export interface AgentBankAccount {
  id: string;
  agencyId: string; // companyId (e.g., 'c1', 'c2') or 'admin'
  agencyName: string;
  bankName: string; // e.g. 'Dutch Bangla Bank Ltd', 'Islami Bank Bangladesh', 'bKash Merchant'
  accountName: string; // e.g. 'ABC Overseas Ltd' or 'Official Escrow'
  accountNumber: string; // e.g. '110-120-49201' or '01711223344'
  branchName?: string;
  routingNumber?: string;
  swiftCode?: string;
  paymentMethod: PaymentMethodType;
  country: string; // e.g., 'Singapore 🇸🇬', 'Saudi Arabia 🇸🇦', 'Italy 🇮🇹', 'UAE 🇦🇪', 'Malaysia 🇲🇾', 'All'
  status: BankAccountStatus; // 'Pending' | 'Approved' | 'Rejected' | 'Suspended'
  isActive: boolean;
  isPriority: boolean; // Set as primary/default account for agency
  isVerifiedBadge: boolean;
  isAdminCompanyAccount?: boolean;
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientPaymentSubmission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  passportNumber?: string;
  agencyId: string;
  agencyName: string;
  bankAccountId: string;
  bankName: string;
  accountNumber: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  txID: string;
  slipFileUrl?: string; // Slip image/PDF name or preview
  stepName?: string; // e.g. "Medical Fee", "MoFA Attestation", "Visa Processing Deposit"
  agentConfirmation: 'Pending' | 'Confirmed' | 'Rejected';
  agentNotes?: string;
  agentConfirmedAt?: string;
  adminVerification: 'Pending' | 'Verified' | 'Rejected';
  adminNotes?: string;
  adminVerifiedAt?: string;
  createdAt: string;
}

export interface AdminBankSettings {
  showOnlyAssignedAgencyAccount: boolean; // Only assigned agency account shown to client
  showAdminCompanyAccount: boolean;       // Show admin fallback escrow account
  priorityAccountEnabled: boolean;        // Allow setting default priority account
  verifyBadgeEnabled: boolean;            // Show verified badge on accounts
  countryWiseAccountEnabled: boolean;     // Filter by candidate destination country
  requireDoubleVerification: boolean;     // Agent confirm -> Admin final verify
}

export const DEFAULT_ADMIN_BANK_SETTINGS: AdminBankSettings = {
  showOnlyAssignedAgencyAccount: true,
  showAdminCompanyAccount: true,
  priorityAccountEnabled: true,
  verifyBadgeEnabled: true,
  countryWiseAccountEnabled: true,
  requireDoubleVerification: true,
};
