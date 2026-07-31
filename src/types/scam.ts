export type ScamAlertCategory = 'fake_job' | 'visa_fraud' | 'payment_fraud' | 'fake_agent' | 'document_fraud' | 'other';

export interface ScamAlert {
  id: string;
  title: string;              // ব্যক্তি বা প্রতিষ্ঠানের নাম / পরিচিতি
  category: ScamAlertCategory; // প্রতারণার ধরন
  phoneNumber: string;        // ফোন নম্বর
  location: string;           // ঠিকানা বা এলাকা
  description: string;        // বিস্তারিত বিবরণ
  photoUrl: string;           // প্রাসঙ্গিক প্রমাণের ছবি
  evidenceFiles: {            // প্রমাণের ফাইল (স্ক্রিনশট, PDF, রসিদ ইত্যাদি)
    name: string;
    url: string;
    type: string;
  }[];
  evidenceText?: string;      // অতিরিক্ত নথি/তথ্য
  postedBy: {                 // কোন Admin বা Staff পোস্টটি প্রকাশ করেছেন
    name: string;
    role: string;
    email: string;
  };
  createdAt: string;          // কখন পোস্টটি প্রকাশ করা হয়েছে
  approved: boolean;          // Admin Approval ছাড়া কোনো পোস্ট Public Tab-এ দেখানো হবে না
  archived: boolean;          // Archive করার ব্যবস্থা থাকবে, যাতে পুরোনো পোস্ট মুছে না গিয়ে সংরক্ষিত থাকে
  deleted?: boolean;          // Flag to indicate deletion
}

export interface ScamAuditLog {
  id: string;
  alertId: string;
  action: 'create' | 'update' | 'approve' | 'archive' | 'unarchive' | 'delete';
  performedBy: {
    name: string;
    role: string;
    email: string;
  };
  details: string;
  timestamp: string;
}
