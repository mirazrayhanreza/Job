export interface PortalUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string; // Simulated hashed password
  role: 'seeker' | 'employer' | 'staff' | 'admin' | 'super_admin';
  status: 'Pending Verification' | 'Active' | 'Under Review' | 'Suspended' | 'Blocked';
  country?: string;
  
  // Employer / Company Specific
  companyName?: string;
  ownerName?: string;
  registrationNumber?: string;
  tradeLicenseName?: string;
  companyDocumentsName?: string;
  
  // Staff / Admin Specific
  department?: string;
  permissions?: string[];
  
  // Security Controls
  isLocked: boolean;
  failedAttempts: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

export interface LoginActivity {
  id: string;
  userId: string;
  userEmail: string;
  userRole: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  browser: string;
  device: string;
  country: string;
  status: 'Success' | 'Failed' | 'Locked' | 'Active Session';
}

export interface SecurityConfig {
  sessionTimeoutMinutes: number;
  maxFailedAttempts: number;
  otpExpirationSeconds: number;
}
