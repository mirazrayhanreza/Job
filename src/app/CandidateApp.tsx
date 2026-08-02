/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import AndroidSimulator from '../components/AndroidSimulator';
import { Job, Notification, Application, ItalyPackageApplication } from '../mockData';

export interface CandidateAppProps {
  jobs: Job[];
  savedJobs: string[];
  notifications: Notification[];
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
  appliedJobIds: string[];
  onAddNotification: (notif: Notification) => void;
  onMarkNotificationsAsRead: () => void;
  onMarkNotificationAsRead?: (id: string) => void;
  applications?: Application[];
  currentSeekerEmail?: string;
  italyPackages?: ItalyPackageApplication[];
  onApplyItalyPackage?: (
    packageName: 'Basic' | 'Standard' | 'Premium',
    name: string,
    email: string,
    phone: string,
    passportNumber: string,
    message?: string
  ) => void;
  onUpdateItalyPackage?: (updatedPkg: ItalyPackageApplication) => void;
  isStandaloneMobileView?: boolean;
}

/**
 * Dedicated Candidate Mobile Application Module (System 2)
 * Cleanly organizes all mobile app interfaces, notifications, job applications,
 * payment history, and profile management into a single file module.
 */
export default function CandidateApp(props: CandidateAppProps) {
  const { isStandaloneMobileView = false } = props;

  if (isStandaloneMobileView) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <AndroidSimulator {...props} />
        </div>
      </div>
    );
  }

  return <AndroidSimulator {...props} />;
}
