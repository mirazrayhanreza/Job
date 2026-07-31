/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Bell, Bookmark, User, Search, MapPin, Clock, DollarSign,
  ChevronRight, ArrowLeft, Send, CheckCircle2, Shield, Eye, SmartphoneCharging,
  Wifi, Battery, Moon, Sun, Lock, Play, Download, CloudUpload, Sparkles, Briefcase,
  LogOut, BookOpen, Upload, Plus, Trash2, Calendar, ClipboardList, FileText,
  Home, MessageSquare, Menu, SlidersHorizontal, Mail, Phone, Settings, Pencil,
  GraduationCap, CreditCard, Camera, Check, CheckCircle
} from 'lucide-react';
import { Job, Notification, Application, getLocalStorageState, COUNTRIES, CATEGORIES, ItalyPackageApplication } from '../mockData';
import VerifiedSystemHub from './VerifiedSystemHub';
import ProfileSheets from './ProfileSheets';

interface AndroidSimulatorProps {
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
}

export default function AndroidSimulator({
  jobs,
  savedJobs,
  notifications,
  onToggleSaveJob,
  onApplyJob,
  appliedJobIds,
  onAddNotification,
  onMarkNotificationsAsRead,
  onMarkNotificationAsRead,
  applications = [],
  currentSeekerEmail,
  italyPackages = [],
  onApplyItalyPackage,
  onUpdateItalyPackage
}: AndroidSimulatorProps) {
  // App-specific internal states (permanently locked to dark mode)
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'login' | 'otp' | 'home' | 'search' | 'job_detail' | 'saved' | 'profile' | 'italy_packages_list' | 'italy_package_apply' | 'visa_process'>('home');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedNotifDetail, setSelectedNotifDetail] = useState<Notification | null>(null);
  const [selectedAppDetail, setSelectedAppDetail] = useState<Application | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [selectedItalyPackage, setSelectedItalyPackage] = useState<'Basic' | 'Standard' | 'Premium' | null>(null);
  const [italyMessage, setItalyMessage] = useState('');
  
  // Apply form fields
  const [applicantName, setApplicantName] = useState('আরিফুল ইসলাম (Ariful Islam)');
  const [applicantEmail, setApplicantEmail] = useState('ariful@example.com');
  const [applicantPhone, setApplicantPhone] = useState('01712345678');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState('Ariful_Islam_Driving_Resume.pdf');
  const [coverText, setCoverText] = useState('আমি সৌদি আরবে ৪ বছর রিয়াদে ট্রেইলার চালিয়েছি। আমার আকামা এবং লাইসেন্স সব বৈধ ছিল। পুনরায় সৌদিতে ভালো কোম্পানিতে কাজ করার জন্য আবেদন করছি।');
  const [applicantPassportNumber, setApplicantPassportNumber] = useState('EH0987654');
  const [applicantPassportExpiry, setApplicantPassportExpiry] = useState('2031-05-12');
  const [applicantBmetNumber, setApplicantBmetNumber] = useState('BMET-2026-44321');
  const [applicantMedicalStatus, setApplicantMedicalStatus] = useState<'Fit' | 'Pending' | 'Unfit'>('Fit');
  const [applicantPoliceClearance, setApplicantPoliceClearance] = useState<'Verified' | 'Pending' | 'Not Provided'>('Verified');
  const [applicantSkills, setApplicantSkills] = useState('Heavy Vehicle Driving, Route Planning, Air Brakes');
  const [applicantExperience, setApplicantExperience] = useState('4 Years in Saudi Arabia, 2 Years in Bangladesh');
  const [applicantLanguages, setApplicantLanguages] = useState('Bangla (Native), Arabic (Conversational)');
  const [uploadedPhotoName, setUploadedPhotoName] = useState('ariful_passport_photo.jpg');

  // New Profile specific states
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
  const [passportCopyName, setPassportCopyName] = useState('Ariful_Passport_Scan_Page.pdf');
  const [medicalCertName, setMedicalCertName] = useState('GAMCA_Medical_Report_Fit.pdf');
  const [policeCertName, setPoliceCertName] = useState('Police_Clearance_Certificate.pdf');
  const [profileTab, setProfileTab] = useState<'form' | 'dashboard' | 'payments'>('payments');
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [profileSheet, setProfileSheet] = useState<string | null>(null);
  const [paymentList, setPaymentList] = useState<{ id: string; title: string; amount: string; date: string; status: 'Success' | 'Pending' | 'Failed' }[]>([
    { id: 'pay_1', title: '📄 প্রাথমিক আবেদন ফি (Initial App Fee)', amount: '৳৫,০০০', date: '০২ জুলাই ২০২৪', status: 'Success' },
    { id: 'pay_2', title: '⚕️ মেডিকেল ফি (GAMCA Medical Fee)', amount: '৳৮,৫০০', date: '০৫ জুলাই ২০২৪', status: 'Success' },
    { id: 'pay_3', title: '🛂 পুলিশ ক্লিয়ারেন্স ভেরিফিকেশন ফি (Police Clearance Fee)', amount: '৳১,৫০০', date: '০৮ জুলাই ২০২৪', status: 'Success' },
    { id: 'pay_4', title: '✈️ এয়ারলাইন ফ্লাইট টিকিট চার্জ (Airline Flight Ticket)', amount: '৳৪৫,০০০', date: '১২ জুলাই ২০২৪', status: 'Success' },
  ]);
  const [savedTab, setSavedTab] = useState<'records' | 'saved'>('records');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  // Login simulations
  const [loginMethod, setLoginMethod] = useState<'google' | 'phone' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Time and status bar states
  const [currentTime, setCurrentTime] = useState('08:50 AM');
  const [activePush, setActivePush] = useState<Notification | null>(null);

  // Audio effect for notification
  const playNotificationSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio context might be blocked or unsupported in iframe
    }
  };

  // Keep track of time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Listen for newly added notifications to trigger sliding Toast Banner!
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1];
      // Only show push banner if it is less than 5 seconds old or recently triggered
      setActivePush(latest);
      playNotificationSound();
      
      const hideTimer = setTimeout(() => {
        setActivePush(null);
      }, 5000);
      return () => clearTimeout(hideTimer);
    }
  }, [notifications]);

  // Auto transition splash screen
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('login');
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Sync applicantEmail with currentSeekerEmail prop
  useEffect(() => {
    if (currentSeekerEmail) {
      setApplicantEmail(currentSeekerEmail);
    }
  }, [currentSeekerEmail]);

  // Filters
  const approvedJobs = jobs.filter(j => j.status === 'Approved');
  const filteredJobs = approvedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesCountry = selectedCountry === 'All' || job.country === selectedCountry;
    return matchesSearch && matchesCategory && matchesCountry;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    
    onApplyJob(
      selectedJob.id,
      applicantName,
      applicantEmail,
      applicantPhone,
      cvFileName,
      coverText,
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
    
    setIsApplying(false);
    
    // Show instant success banner in Android Simulator
    const successNotif: Notification = {
      id: 'app_applied_' + Date.now(),
      title: '💼 Application Successful!',
      message: `আপনার আবেদনটি "${selectedJob.title}" পদের জন্য ${selectedJob.companyName} এ সফলভাবে জমা হয়েছে।`,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    onAddNotification(successNotif);
    
    // Go to home or confirmation
    setCurrentScreen('home');
  };

  const handleLogin = (method: 'google' | 'phone') => {
    if (method === 'google') {
      setIsLoggedIn(true);
      setCurrentScreen('home');
    } else {
      setLoginMethod('phone');
      setCurrentScreen('otp');
    }
  };

  const handleOtpVerify = () => {
    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  // Dynamic Theme Styling helper (permanently dark mode)
  const isDark = true;
  const themeBg = 'bg-[#121212] text-slate-100';
  const themeCard = 'bg-[#1e1e1e] border-slate-800';
  const themeSubtext = 'text-slate-400';
  const themeInput = 'bg-[#2d2d2d] border-slate-700 text-slate-100';
  const themeLabel = 'text-slate-400';
  const themeMuted = 'text-slate-400';
  const profileInput = 'bg-slate-950/70 border-slate-800 text-slate-200';
  const profileLabel = 'text-slate-400 font-semibold block';

  return (
    <div className="relative mx-auto w-[360px] h-[720px] bg-slate-950 rounded-[45px] border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col select-none ring-4 ring-slate-900/30">
      
      {/* Dynamic Signal/Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-black z-40 flex items-center justify-between px-6 text-[11px] text-white font-medium">
        <span>{currentTime}</span>
        
        {/* Android Punch Hole Camera */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-3.5 h-3.5 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center">
          <div className="w-1 h-1 bg-[#1a237e] rounded-full"></div>
        </div>

        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] text-emerald-400">5G</span>
          <Battery className="w-4 h-4 text-emerald-400" />
          <SmartphoneCharging className="w-3 h-3 text-amber-400 -ml-1" />
        </div>
      </div>

      {/* Floating Push Notification Dropdown Banner */}
      {activePush && (
        <div 
          id="android-push-banner"
          className="absolute top-8 left-2.5 right-2.5 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-xl z-50 flex gap-2.5 animate-bounce ring-2 ring-emerald-500/50 backdrop-blur-md"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-inner">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-pulse" /> BDJobs App
              </span>
              <span className="text-[9px] text-slate-400">{activePush.sentAt}</span>
            </div>
            <p className="text-xs font-semibold text-white truncate mt-0.5">{activePush.title}</p>
            <p className="text-[10.5px] text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">{activePush.message}</p>
          </div>
        </div>
      )}

      {/* App Body Container */}
      <div className={`flex-1 flex flex-col pt-7 pb-12 overflow-y-auto overflow-x-hidden ${themeBg} font-sans transition-colors duration-200`}>
        
        {/* Splash Screen */}
        {currentScreen === 'splash' && (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-6 relative">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 shadow-xl animate-pulse">
              <Smartphone className="w-12 h-12 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-1">
              BDJobs <span className="text-emerald-400 font-medium text-lg">PRO</span>
            </h1>
            <p className="text-xs text-slate-300 font-light mt-1">সবচেয়ে দ্রুততম জব পোর্টাল অ্যাপ</p>
            <div className="absolute bottom-16 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              <span>লোডিং হচ্ছে...</span>
            </div>
          </div>
        )}

        {/* Login Screen */}
        {currentScreen === 'login' && (
          <div className="flex-1 flex flex-col justify-between p-6">
            <div className="flex justify-end pt-2">
              {/* Theme toggle removed for pure dark mode */}
            </div>

            <div className="my-auto flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mb-3 shadow-md">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold">লগইন করুন</h2>
              <p className="text-xs mt-1 text-slate-400 px-4">আপনার চাকরির ক্যারিয়ার শুরু করুন সহজে ও দ্রুত</p>

              {/* Login Options */}
              <div className="w-full mt-8 flex flex-col gap-3">
                <button 
                  id="google-login-btn"
                  onClick={() => handleLogin('google')}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-xs transition duration-150 shadow-sm bg-white dark:bg-[#1a1a1a] hover:opacity-90 text-slate-800 dark:text-white"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.96 1 12 1 7.35 1 3.39 3.68 1.41 7.59l3.77 2.93c.9-2.73 3.44-4.48 6.82-4.48z"/>
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.46h6.45c-.28 1.48-1.12 2.74-2.38 3.58l3.68 2.85c2.16-1.99 3.41-4.91 3.41-8.53z"/>
                    <path fill="#FBBC05" d="M5.18 10.52c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18L1.41 3.23C.51 5.03 0 7.04 0 9.17s.51 4.14 1.41 5.94l3.77-2.93z"/>
                    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.68-2.85c-1.02.68-2.33 1.09-4.28 1.09-3.38 0-5.92-1.75-6.82-4.48L1.41 16.77C3.39 20.68 7.35 23 12 23z"/>
                  </svg>
                  Google দিয়ে লগইন করুন
                </button>

                <div className="relative my-2 flex py-1 items-center justify-center">
                  <div className="flex-grow border-t border-slate-300 dark:border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase">অথবা</span>
                  <div className="flex-grow border-t border-slate-300 dark:border-slate-800"></div>
                </div>

                <div>
                  <label className="block text-left text-[10px] font-semibold mb-1 text-slate-400">মোবাইল নম্বর</label>
                  <div className="flex">
                    <span className="flex items-center px-3 bg-slate-200 dark:bg-slate-800 text-xs rounded-l-xl font-medium">+৮৮০</span>
                    <input 
                      id="app-login-phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="১৭১২৩৪৫৬৭৮"
                      className={`flex-1 py-2 px-3 text-xs rounded-r-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${themeInput}`}
                    />
                  </div>
                </div>

                <button 
                  id="app-login-otp-send-btn"
                  onClick={() => handleLogin('phone')}
                  disabled={phoneNumber.length < 10}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400/50 disabled:cursor-not-allowed font-bold text-xs text-white shadow-sm flex items-center justify-center gap-1.5 transition-colors mt-2"
                >
                  <Send className="w-3.5 h-3.5" /> OTP কোড পাঠান
                </button>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-400">
              এগিয়ে যাওয়ার মাধ্যমে, আপনি আমাদের <span className="underline">শর্তাবলী</span> ও <span className="underline">গোপনীয়তা নীতি</span> স্বীকার করছেন।
            </p>
          </div>
        )}

        {/* OTP Verification Screen */}
        {currentScreen === 'otp' && (
          <div className="flex-1 flex flex-col p-6 justify-between">
            <div>
              <button 
                id="otp-back-btn"
                onClick={() => setCurrentScreen('login')}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 self-start"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="my-auto flex flex-col items-center text-center">
              <Lock className="w-12 h-12 text-emerald-400 mb-3" />
              <h2 className="text-xl font-bold">ভেরিফিকেশন কোড</h2>
              <p className="text-xs mt-1 text-slate-400 px-2">
                আমরা +৮৮০ {phoneNumber} নম্বরে ৪ ডিজিটের একটি ভেরিফিকেশন কোড পাঠিয়েছি।
              </p>

              {/* OTP Simulation Input */}
              <div className="flex gap-2.5 justify-center mt-8 mb-6">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={otpCode[idx] || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val) {
                        const newOtp = otpCode + val;
                        setOtpCode(newOtp.slice(0, 4));
                      } else {
                        setOtpCode(otpCode.slice(0, -1));
                      }
                    }}
                    placeholder="-"
                    className="w-11 h-11 text-center font-bold text-lg rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white"
                  />
                ))}
              </div>

              {/* Demo Fill Helper */}
              <button 
                id="otp-fill-demo-btn"
                onClick={() => setOtpCode('2026')}
                className="text-[11px] text-emerald-500 hover:underline mb-4 font-medium"
              >
                [অটো-ফিল করুন: 2026]
              </button>

              <button 
                id="otp-verify-btn"
                onClick={handleOtpVerify}
                disabled={otpCode.length < 4}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400/50 text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1 transition-colors"
              >
                নিশ্চিত করুন
              </button>
            </div>

            <div className="text-xs text-center text-slate-400">
              কোড পাননি? <span className="text-emerald-500 cursor-pointer font-semibold hover:underline">আবার পাঠান</span> (৩০ সেকেন্ড)
            </div>
          </div>
        )}

        {/* APP CORE PAGES (Requires Logged-In) */}
        {isLoggedIn && (
          <div className="flex-grow flex flex-col">
            
            {/* Top Toolbar */}
            {currentScreen === 'home' ? (
              <div className="px-4 py-3 bg-[#0d131e] border-b border-slate-800/60 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                  <button className="text-slate-300 hover:text-white">
                    <Menu className="w-5 h-5 text-slate-300" />
                  </button>
                  <div>
                    <h1 className="text-[13px] font-black text-slate-100 tracking-wide">Probashi Jobs Portal</h1>
                    <p className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-emerald-500/15 text-emerald-400 text-[7px] font-black">✓</span>
                      Verified by Admin/Staff
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    id="app-notif-bell"
                    onClick={() => {
                      onMarkNotificationsAsRead();
                      setCurrentScreen('profile');
                      setProfileTab('dashboard');
                    }}
                    className="p-1 text-slate-300 relative"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[8.5px] font-black text-white rounded-full flex items-center justify-center">
                      3
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentScreen('profile');
                      setProfileTab('form');
                    }}
                    className="w-8 h-8 rounded-full border border-slate-700 overflow-hidden shrink-0 bg-slate-800"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop" 
                      alt="User Avatar" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                </div>
              </div>
            ) : currentScreen === 'job_detail' ? (
              <div className="px-4 py-3 bg-[#0d131e] border-b border-slate-800/60 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                  <button 
                    id="detail-back-btn"
                    onClick={() => setCurrentScreen('home')}
                    className="text-slate-300 hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-xs font-black text-slate-100 tracking-wide">Job Details</h1>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => selectedJob && onToggleSaveJob(selectedJob.id)}
                    className="text-slate-300 hover:text-white"
                  >
                    <Bookmark className={`w-4.5 h-4.5 ${selectedJob && savedJobs.includes(selectedJob.id) ? 'fill-current text-amber-500' : 'text-slate-300'}`} />
                  </button>
                  <button 
                    onClick={() => {
                      onAddNotification({
                        id: 'notif_share_' + Date.now(),
                        title: '🔗 Link Copied',
                        message: 'Job details link has been copied to clipboard!',
                        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isRead: false
                      });
                    }}
                    className="text-slate-300 hover:text-white"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.136-1.722M8.684 13.258l4.136 1.722M15 11.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-6 4a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6-8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className={`px-4 py-2 border-b flex items-center justify-between ${themeCard} sticky top-0 z-30`}>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setCurrentScreen('home')}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  {currentScreen === 'profile' ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[11.5px] font-black tracking-tight text-slate-100">My Profile</span>
                      <span className="flex items-center gap-0.5 bg-emerald-500/15 border border-emerald-500/30 text-[7px] font-black text-emerald-400 px-1.5 py-0.5 rounded-full">
                        <Check className="w-1.5 h-1.5 text-emerald-400 stroke-[3]" /> Verified
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-black tracking-tight text-slate-100">
                      {currentScreen === 'visa_process' ? 'Visa Progress' : currentScreen === 'search' ? 'Search Jobs' : currentScreen === 'saved' ? 'Saved Applications' : 'Profile'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {currentScreen === 'profile' ? (
                    <>
                      <button 
                        onClick={() => setProfileSheet('security')}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Security & Settings"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setProfileSheet('notifications')}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 relative transition-colors"
                        title="Notifications"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        {notifications.some(n => !n.isRead) && (
                          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose-500 text-white rounded-full text-[6.5px] font-black flex items-center justify-center border border-slate-900">
                            {notifications.filter(n => !n.isRead).length}
                          </span>
                        )}
                      </button>
                    </>
                  ) : (
                    /* Theme toggle removed for pure dark mode */
                    null
                  )}
                </div>
              </div>
            )}

            {/* SCREEN: HOME */}
            {currentScreen === 'home' && (
              <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto max-h-[620px] scrollbar-none">
                
                {/* Search Input Pill */}
                <div className="relative flex items-center bg-[#121926]/90 rounded-full px-4 py-2.5 border border-slate-800/80">
                  <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input 
                    type="text"
                    placeholder="Search jobs by title, company, country..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-xs text-slate-200 w-full focus:outline-none placeholder-slate-500 font-semibold"
                  />
                  <button 
                    onClick={() => {
                      onAddNotification({
                        id: 'notif_filter_' + Date.now(),
                        title: '⚡ Advanced Filters',
                        message: 'Advanced job filter panel opened! You can filter by salary, visa type, and contract duration.',
                        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isRead: false
                      });
                    }}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Banner Card */}
                <div className="bg-gradient-to-br from-indigo-700 via-indigo-900 to-[#0e1420] rounded-2xl p-4.5 relative overflow-hidden flex flex-col justify-between h-[135px] border border-indigo-500/25 shadow-lg">
                  <div className="z-10 flex flex-col">
                    <span className="text-[10px] font-black tracking-wider text-indigo-300 uppercase">Find Your Dream Job</span>
                    <h2 className="text-2xl font-black text-white leading-none mt-1 tracking-tight">Abroad</h2>
                    <p className="text-[9.5px] text-slate-300 font-bold leading-normal mt-2.5 max-w-[200px]">
                      Apply for verified jobs & build your better future
                    </p>
                  </div>
                  
                  {/* Floating Plane Art */}
                  <div className="absolute -right-3.5 -top-1.5 opacity-20 pointer-events-none transform rotate-[15deg]">
                    <svg className="w-36 h-36 text-white" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  
                  {/* Carousel Dots */}
                  <div className="flex gap-1.5 justify-center z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                    <span className="w-3.5 h-1.5 rounded-full bg-emerald-400 transition-all"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                  </div>
                </div>

                {/* Popular Categories Section */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11.5px] font-black uppercase text-slate-300 tracking-wide">Popular Categories</h3>
                    <button 
                      onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                      className="text-[10px] text-indigo-400 font-black hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { name: 'All Jobs', realCat: 'All', icon: '💼', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', count: '1250' },
                      { name: 'Construction', realCat: 'Construction & Labor', icon: '🏗️', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', count: '320' },
                      { name: 'Engineering', realCat: 'Technical & Engineering', icon: '⚡', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', count: '210' },
                      { name: 'Hotel & Rest.', realCat: 'Hotel & Hospitality', icon: '🏨', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', count: '180' },
                      { name: 'More', realCat: 'All', icon: '➕', bg: 'bg-teal-500/10 text-teal-400 border-teal-500/20', count: '340' }
                    ].map((cat, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setSelectedCategory(cat.realCat);
                          if (cat.name === 'More') {
                            onAddNotification({
                              id: 'notif_cat_more_' + Date.now(),
                              title: '📂 Categories Loaded',
                              message: 'All 24 overseas job categories are successfully loaded. Try searching to filter them!',
                              sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              isRead: false
                            });
                          }
                        }}
                        className={`flex flex-col items-center p-2 rounded-xl border shrink-0 w-[64px] transition-all ${
                          selectedCategory === cat.realCat && cat.realCat !== 'All'
                            ? 'bg-indigo-600/20 border-indigo-500 scale-[1.03]'
                            : 'bg-[#121926]/90 border-slate-800/60 hover:bg-slate-850/30'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border ${cat.bg} mb-1.5 shadow-inner`}>
                          {cat.icon}
                        </span>
                        <span className="text-[8px] font-black text-slate-200 text-center truncate w-full tracking-tight">
                          {cat.name}
                        </span>
                        <span className="text-[7.5px] font-mono text-slate-500 mt-0.5">
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured Jobs Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11.5px] font-black uppercase text-slate-300 tracking-wide">Featured Jobs</h3>
                    <button 
                      onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                      className="text-[10px] text-indigo-400 font-black hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {[
                      {
                        id: 'fj1',
                        title: 'Construction Worker',
                        companyId: 'c_npcc',
                        companyName: 'NPCC Company',
                        companyLogo: '🏗️',
                        category: 'Construction & Labor',
                        country: 'Saudi Arabia 🇸🇦',
                        location: 'Saudi Arabia',
                        salary: '৳ 45,000 - 55,000',
                        type: 'Company Visa',
                        visaType: 'Work Visa',
                        description: 'We are hiring Construction Workers for our ongoing projects in Saudi Arabia. Candidates should have experience in construction field and be physically fit for outdoor physical labor.',
                        requirements: [
                          'Minimum 2 years work experience in civil construction',
                          'Basic knowledge in construction work and safety equipment usage',
                          'Physically fit and able to work in hard environment & high temperatures',
                          'Age between 21 to 40 years old'
                        ],
                        status: 'Approved',
                        isPremium: true,
                        isFeatured: true,
                        postedAt: '2h ago',
                        deadline: '31 July 2024',
                        applicationsCount: 15
                      },
                      {
                        id: 'fj2',
                        title: 'Electrical Technician',
                        companyId: 'c_gulf_power',
                        companyName: 'Gulf Power Co. Ltd.',
                        companyLogo: '⚡',
                        category: 'Technical & Engineering',
                        country: 'Qatar 🇶🇦',
                        location: 'Doha, Qatar',
                        salary: '৳ 60,000 - 75,000',
                        type: 'Company Visa',
                        visaType: 'Work Visa',
                        description: 'Gulf Power Co. Ltd. is recruiting Electrical Technicians for power plant maintenance. Candidates must hold a diploma or trade certification and know industrial wiring.',
                        requirements: [
                          'Minimum 3 years experience as industrial or commercial electrician',
                          'Diploma in Electrical Engineering or Trade Test Certificate',
                          'Familiarity with wiring diagrams, testing instruments and safety rules',
                          'Age limit: 22 to 38 years old'
                        ],
                        status: 'Approved',
                        isPremium: true,
                        isFeatured: true,
                        postedAt: '5h ago',
                        deadline: '15 August 2024',
                        applicationsCount: 22
                      },
                      {
                        id: 'fj3',
                        title: 'Hotel Cleaner',
                        companyId: 'c_accor',
                        companyName: 'Accor Hotels',
                        companyLogo: '🏨',
                        category: 'Hotel & Hospitality',
                        country: 'UAE 🇦🇪',
                        location: 'Dubai, UAE',
                        salary: '৳ 38,000 - 45,000',
                        type: 'Company Visa',
                        visaType: 'Work Visa',
                        description: 'Accor Hotels UAE is looking for professional and diligent Hotel Cleaners for room maintenance. Free accommodation, transport and food allowances will be provided by the company.',
                        requirements: [
                          'Previous cleaning or housekeeping experience in a hotel is preferred',
                          'Basic conversational English skills to interact with guests',
                          'Hardworking, clean, and disciplined behavior',
                          'Age limit: 20 to 35 years old'
                        ],
                        status: 'Approved',
                        isPremium: true,
                        isFeatured: true,
                        postedAt: '1d ago',
                        deadline: '10 August 2024',
                        applicationsCount: 8
                      },
                      {
                        id: 'fj4',
                        title: 'Driver (Light Vehicle)',
                        companyId: 'c_salik',
                        companyName: 'Salik Group',
                        companyLogo: '🚗',
                        category: 'Driving & Logistics',
                        country: 'Kuwait 🇰🇼',
                        location: 'Kuwait City, Kuwait',
                        salary: '৳ 40,000 - 48,000',
                        type: 'Company Visa',
                        visaType: 'Work Visa',
                        description: 'Salik Group Kuwait is hiring Light Vehicle Drivers. Candidate must possess a valid Kuwaiti/GCC driving license or a valid Bangladeshi license with strong driving skills.',
                        requirements: [
                          'Valid driving license (GCC license is highly preferred)',
                          'Familiarity with Kuwait routes and traffic rules',
                          'Conversational English or Arabic language skills',
                          'Age limit: 23 to 42 years old'
                        ],
                        status: 'Approved',
                        isPremium: true,
                        isFeatured: true,
                        postedAt: '1d ago',
                        deadline: '20 August 2024',
                        applicationsCount: 12
                      }
                    ].filter(job => {
                      const matchesSearch = searchQuery === '' || 
                        job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        job.country.toLowerCase().includes(searchQuery.toLowerCase());
                      
                      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
                      return matchesSearch && matchesCategory;
                    }).map((job) => (
                      <div 
                        key={job.id}
                        onClick={() => {
                          setSelectedJob(job as any);
                          setCurrentScreen('job_detail');
                        }}
                        className="bg-[#121926]/90 p-3.5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-850/40 cursor-pointer transition-all flex flex-col gap-2.5 relative group"
                      >
                        {/* Header: Logo & Company & Country */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-base">
                              {job.companyLogo}
                            </span>
                            <div>
                              <h4 className="text-[10.5px] font-bold text-slate-400 group-hover:text-indigo-400 transition-colors">
                                {job.companyName}
                              </h4>
                              <p className="text-[9.5px] text-slate-500 font-medium flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" /> {job.country}
                              </p>
                            </div>
                          </div>
                          
                          <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full font-black border border-indigo-500/20 flex items-center gap-1 shrink-0">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                            Verified
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xs font-black text-slate-100 group-hover:text-white leading-snug">
                          {job.title}
                        </h3>

                        {/* Bottom Row: Salary & Badges */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
                          <span className="text-[11.5px] font-black text-emerald-400">
                            {job.salary}
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8.5px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                              {job.type}
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">
                              {job.postedAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Browse All Button */}
                  <button 
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                    className="w-full py-2.5 rounded-xl bg-[#121926]/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-[10.5px] flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98] mt-1"
                  >
                    Browse All Jobs <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Why Choose Us Section */}
                <div className="flex flex-col gap-2.5 mt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-wide">Why Choose Us?</h3>
                    <span className="text-[8px] text-slate-500 font-mono uppercase">Verified Protocol</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { title: '100% Verified Jobs', desc: 'Verified by administrative staff', icon: '🛡️', color: 'text-emerald-400' },
                      { title: 'Safe & Secure', desc: 'Audited transparent accounts', icon: '🔒', color: 'text-blue-400' },
                      { title: '24/7 Support Desk', desc: 'Always active visa helpline', icon: '🎧', color: 'text-purple-400' },
                      { title: 'Fast Approvals', desc: 'Rapid workflow validations', icon: '⚡', color: 'text-amber-400' }
                    ].map((feat, idx) => (
                      <div 
                        key={idx}
                        className="bg-[#121926]/90 p-3 rounded-xl border border-slate-800/80 flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{feat.icon}</span>
                          <h4 className="text-[10px] font-black text-slate-200">{feat.title}</h4>
                        </div>
                        <p className="text-[8.5px] text-slate-500 font-medium leading-normal">
                          {feat.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SCREEN: VISA PROCESS */}
            {currentScreen === 'visa_process' && (
              <div className="p-4 flex-grow flex flex-col gap-3.5 overflow-y-auto max-h-[620px] scrollbar-none">
                {/* Header Back Button Row */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentScreen('home')}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h2 className="text-xs font-black text-slate-100">Visa Process</h2>
                  </div>
                  <span className="text-[9.5px] font-black text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    Verified
                  </span>
                </div>

                {/* Application Details Card */}
                <div className="bg-[#121926]/95 p-4 rounded-2xl border border-slate-800/80 relative overflow-hidden">
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg font-black">
                    📄
                  </div>
                  <div className="space-y-2 text-[10.5px]">
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Application ID</span>
                      <span className="text-emerald-400 font-black text-xs font-mono">PJ-2024-5748</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Applied for</span>
                      <span className="text-slate-200 font-black text-xs">Cleaner (Saudi Arabia)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Employer</span>
                      <span className="text-slate-200 font-black text-xs">Al Madina Group</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Applied Date</span>
                      <span className="text-slate-200 font-black text-xs font-mono">01 July 2024</span>
                    </div>
                  </div>
                </div>

                {/* Process Progress Card */}
                <div className="bg-[#121926]/95 p-4 rounded-2xl border border-slate-800/80 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-300">Process Progress</span>
                    <span className="text-[10px] font-black text-emerald-400">86% Complete</span>
                  </div>
                  
                  {/* Horizontal Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '86%' }}></div>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="relative pl-6 space-y-4 pt-1">
                    {/* Progress Connecting Line */}
                    <div className="absolute left-2.5 top-2 bottom-2 w-[1.5px] bg-emerald-500"></div>

                    {[
                      { title: 'Application Submitted', date: '01 July 2024, 09:00 AM' },
                      { title: 'Employer Review', date: '03 July 2024, 11:30 AM' },
                      { title: 'Payment Confirmed', date: '05 July 2024, 02:15 PM' },
                      { title: 'Documents Verified', date: '06 July 2024, 10:45 AM' },
                      { title: 'Medical Completed', date: '08 July 2024, 09:20 AM' },
                      { title: 'Visa Approved', date: '12 July 2024, 03:40 PM' },
                    ].map((step, idx) => (
                      <div key={idx} className="relative flex flex-col">
                        {/* Circle bullet */}
                        <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                          <div className="w-1 h-1 bg-slate-950 rounded-full"></div>
                        </div>
                        <h4 className="text-[10.5px] font-black text-slate-200">{step.title}</h4>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{step.date}</p>
                      </div>
                    ))}

                    {/* Pending steps */}
                    <div className="relative flex flex-col">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full border border-slate-600 bg-slate-950 flex items-center justify-center"></div>
                      <h4 className="text-[10.5px] font-black text-slate-500">Flight Ticket</h4>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">Pending</p>
                    </div>
                  </div>
                </div>

                {/* Payment Summary Card */}
                <div className="bg-[#121926]/95 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                  <h3 className="text-[11px] font-black uppercase text-slate-300 tracking-wide">Payment Summary</h3>
                  
                  <div className="space-y-2 text-[10.5px] font-bold">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Cost</span>
                      <span className="text-slate-200 font-mono">৳ 45,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Paid Amount</span>
                      <span className="text-emerald-400 font-mono">৳ 30,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Due Amount</span>
                      <span className="text-amber-500 font-mono">৳ 15,000</span>
                    </div>
                  </div>

                  <button 
                    id="make-visa-process-payment-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      onAddNotification({
                        id: 'notif_payment_' + Date.now(),
                        title: '💳 Payment Success',
                        message: 'Your remaining payment of ৳15,000 has been recorded successfully. Receipts are available in your portal.',
                        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isRead: false
                      });
                    }}
                    className="w-full bg-[#10b981] hover:bg-emerald-600 text-slate-950 font-black text-[11px] py-2.5 rounded-xl transition shadow-md text-center"
                  >
                    Make Payment
                  </button>
                </div>

                {/* Important Notice */}
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl flex gap-2.5">
                  <div className="text-amber-500 text-sm mt-0.5">⚠️</div>
                  <div className="space-y-1">
                    <h5 className="text-[10px] font-black text-amber-400">Important Notice</h5>
                    <p className="text-[9px] text-amber-400/90 leading-relaxed font-bold">
                      Please keep your phone on and check your email regularly for updates.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN: SEARCH / FILTER */}
            {currentScreen === 'search' && (
              <div className="p-4 flex-grow flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <button 
                    id="search-screen-back"
                    onClick={() => setCurrentScreen('home')}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-xs font-bold">চাকরি সার্চ ফিল্টার</h3>
                </div>

                {/* Input Search inside app */}
                <div className={`flex items-center gap-2 p-1.5 rounded-xl border ${themeCard}`}>
                  <Search className="w-4 h-4 text-emerald-500 shrink-0 ml-1" />
                  <input 
                    id="app-search-input"
                    type="text"
                    placeholder="কোম্পানি বা পদবি লিখে সার্চ করুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-xs w-full focus:outline-none focus:ring-0"
                  />
                  {searchQuery && (
                    <button 
                      id="clear-app-search-btn"
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-slate-100 font-bold px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Slider inside Search Screen */}
                <div className="space-y-1">
                  <span className={`text-[9px] font-black block uppercase tracking-wider ${themeLabel}`}>ক্যাটাগরি:</span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                    {['All', ...CATEGORIES.map(c => c.name)].map((cat) => (
                      <button
                        key={cat}
                        id={`app-search-cat-${cat.replace(/\s+/g, '-')}`}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded-full text-[9.5px] whitespace-nowrap border font-black transition ${
                          selectedCategory === cat 
                            ? 'bg-emerald-500 text-white border-emerald-500' 
                            : isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-200' : 'bg-slate-100 border-slate-400 text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'All' ? 'সব ক্যাটাগরি' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country Slider inside Search Screen */}
                <div className="space-y-1">
                  <span className={`text-[9px] font-black block uppercase tracking-wider ${themeLabel}`}>গন্তব্য দেশ:</span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                    {['All', ...COUNTRIES.map(c => c.name)].map((country) => (
                      <button
                        key={country}
                        id={`app-search-country-${country.replace(/\s+/g, '-')}`}
                        onClick={() => setSelectedCountry(country)}
                        className={`px-2.5 py-1 rounded-full text-[9.5px] whitespace-nowrap border font-black transition ${
                          selectedCountry === country 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-200' : 'bg-slate-100 border-slate-400 text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {country === 'All' ? 'সব দেশ 🌍' : country}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Count indicator */}
                <p className={`text-[10px] font-black ${themeLabel}`}>মোট {filteredJobs.length} টি চাকরি পাওয়া গেছে</p>

                {/* Filtered Jobs List */}
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[360px] pr-0.5">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <div 
                        key={job.id}
                        id={`app-search-job-card-${job.id}`}
                        onClick={() => {
                          setSelectedJob(job);
                          setCurrentScreen('job_detail');
                        }}
                        className={`p-3 rounded-xl border flex gap-3 cursor-pointer hover:scale-[1.01] transition-transform ${themeCard} ${job.isPremium ? 'border-amber-500/50' : ''}`}
                      >
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0">
                          {job.companyLogo}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs font-black truncate">{job.title}</h4>
                            {job.isPremium && (
                              <span className="text-[7.5px] bg-amber-500 text-slate-950 font-extrabold px-1 py-0.2 rounded shrink-0">P</span>
                            )}
                          </div>
                          <p className={`text-[9.5px] font-bold truncate mt-0.5 ${themeMuted}`}>{job.companyName}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-900'}`}>{job.type}</span>
                            <span className={`text-[8.5px] font-bold flex items-center gap-0.5 ${themeMuted}`}>
                              <MapPin className="w-2.5 h-2.5 text-rose-500" /> {job.location.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 self-center ${themeMuted}`} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <Search className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                      <p className="text-xs">কোন চাকরি খুঁজে পাওয়া যায়নি</p>
                      <button 
                        id="reset-search-btn"
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedCountry('All'); }}
                        className="text-xs text-emerald-500 hover:underline font-bold mt-2"
                      >
                        ফিল্টার রিসেট করুন
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* SCREEN: JOB DETAILS */}
            {currentScreen === 'job_detail' && selectedJob && (
              <div className="flex-grow flex flex-col justify-between">
                
                {/* Detail Body */}

                {/* Detail Body */}
                <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[430px]">
                  
                  {/* Top Header Card */}
                  <div className="bg-[#121926]/90 p-4 rounded-2xl border border-slate-800/80 relative flex flex-col">
                    <span className="absolute top-3 right-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Verified Job
                    </span>
                    
                    <div className="flex items-center gap-3 text-left">
                      <span className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xl shrink-0">
                        {selectedJob.companyLogo || '💼'}
                      </span>
                      <div>
                        <h3 className="text-xs font-black text-slate-100 pr-16">{selectedJob.title}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{selectedJob.companyName}</p>
                        <p className="text-[9px] text-slate-500 font-semibold flex items-center gap-1 mt-1">
                          <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" /> {selectedJob.location || selectedJob.country}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/40 my-3"></div>

                    <div className="flex items-center justify-between text-left">
                      <div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-wide">Monthly Salary</span>
                        <p className="text-xs font-black text-emerald-400 mt-0.5">{selectedJob.salary}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-wide text-right block">Job Reference ID</span>
                        <p className="text-[9.5px] font-mono text-slate-300 mt-1 text-right block">
                          {selectedJob.id.startsWith('fj') ? 'PJ-2024-5784' : 'PJ-2024-' + selectedJob.id.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div className="bg-[#121926]/90 p-3 rounded-2xl border border-slate-800/80 grid grid-cols-4 gap-1.5 text-center">
                    <div>
                      <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-wider block">Category</span>
                      <p className="text-[9.5px] font-extrabold text-slate-200 mt-1 truncate">
                        {selectedJob.category.replace(' & Labor', '').replace(' & Hospitality', '').replace(' & Engineering', '')}
                      </p>
                    </div>
                    <div>
                      <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-wider block">Job Type</span>
                      <p className="text-[9.5px] font-extrabold text-slate-200 mt-1 truncate">{selectedJob.type || 'Full Time'}</p>
                    </div>
                    <div>
                      <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-wider block">Experience</span>
                      <p className="text-[9.5px] font-extrabold text-slate-200 mt-1 truncate">2 - 3 Years</p>
                    </div>
                    <div>
                      <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-wider block">Vacancy</span>
                      <p className="text-[9.5px] font-extrabold text-slate-200 mt-1 truncate">50+ Pos.</p>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="bg-[#121926]/90 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-wider border-l-2 border-indigo-500 pl-2">Job Description</h4>
                    <p className="text-[11px] leading-relaxed font-bold text-slate-300 text-left">{selectedJob.description}</p>
                  </div>

                  {/* Responsibilities Section */}
                  <div className="bg-[#121926]/90 p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-wider border-l-2 border-indigo-500 pl-2">Job Responsibilities</h4>
                    <ul className="space-y-1.5 pl-0.5">
                      {[
                        "Assist in all construction activities",
                        "Load and unload construction materials",
                        "Follow safety rules and regulations",
                        "Keep the working area clean and safe"
                      ].map((resp, i) => (
                        <li key={i} className="text-[11px] font-bold text-slate-300 flex items-start gap-2 leading-relaxed">
                          <span className="text-emerald-400 font-extrabold mt-0.5">✓</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements Section */}
                  <div className="bg-[#121926]/90 p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-wider border-l-2 border-indigo-500 pl-2">Requirements</h4>
                    <ul className="space-y-1.5 pl-0.5">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className="text-[11px] font-bold text-slate-300 flex items-start gap-2 leading-relaxed">
                          <span className="text-emerald-400 font-extrabold mt-0.5">✓</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Row of 4 visual columns containing round icon badges */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Gender', val: 'Male Only', icon: <User className="w-3.5 h-3.5 text-indigo-400" /> },
                      { label: 'Age Limit', val: '21 - 40 Yrs', icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
                      { label: 'Education', val: 'Min SSC', icon: <BookOpen className="w-3.5 h-3.5 text-rose-400" /> },
                      { label: 'Language', val: 'Basic Eng.', icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> }
                    ].map((spec, idx) => (
                      <div key={idx} className="bg-[#121926]/90 border border-slate-800/80 rounded-xl p-2.5 flex flex-col items-center text-center gap-1 shadow-sm">
                        <span className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700/60 shadow-inner">
                          {spec.icon}
                        </span>
                        <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-wide">{spec.label}</span>
                        <span className="text-[8.5px] font-extrabold text-slate-200 mt-0.5">{spec.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Benefits Section */}
                  <div className="bg-[#121926]/90 p-3.5 rounded-2xl border border-slate-800/80 space-y-3">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-wider border-l-2 border-indigo-500 pl-2">Benefits & Perks</h4>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        'Free Accommodation',
                        'Medical Provided',
                        'Free Transportation',
                        'Overtime Available'
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10.5px] font-bold text-slate-300 bg-slate-800/45 p-2 rounded-xl border border-slate-800/50">
                          <span className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold text-[10px] shrink-0">✓</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom CTA Actions */}
                <div className="p-3 bg-[#0d131e] border-t border-slate-800/60 flex items-center justify-between sticky bottom-0 z-10">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-wide">Application Deadline</span>
                    <div className="flex items-center gap-1.5 text-rose-400 font-black text-[10.5px] mt-0.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{selectedJob.deadline || '31 July 2024'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      id="app-job-bookmark-btn"
                      onClick={() => onToggleSaveJob(selectedJob.id)}
                      className={`p-2.5 rounded-xl border transition ${
                        savedJobs.includes(selectedJob.id)
                          ? 'bg-amber-500/15 border-amber-500 text-amber-500'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>

                    {appliedJobIds.includes(selectedJob.id) ? (
                      <div className="py-2.5 px-6 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-xs flex items-center justify-center gap-1 shadow-md">
                        <CheckCircle2 className="w-4 h-4" /> applied
                      </div>
                    ) : (
                      <button 
                        id="app-apply-trigger-btn"
                        onClick={() => setIsApplying(true)}
                        className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-black text-xs text-white shadow-md flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
                      >
                        Apply Now <Send className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sliding Full-Sheet Cover for Quick Apply */}
                {isApplying && (
                  <div className="absolute inset-x-0 bottom-12 top-7 bg-slate-950/80 backdrop-blur-sm z-40 flex flex-col justify-end">
                    <form 
                      id="app-quick-apply-form"
                      onSubmit={handleApplySubmit}
                      className={`p-4 rounded-t-[30px] border-t border-slate-800 flex flex-col space-y-3.5 max-h-[90%] overflow-y-auto ${themeCard}`}
                    >
                      <div className="flex justify-between items-center pb-1">
                        <h3 className="text-xs font-bold text-emerald-400">আবেদন ফর্ম পূরণ করুন</h3>
                        <button 
                          id="app-apply-cancel"
                          type="button" 
                          onClick={() => setIsApplying(false)}
                          className="text-slate-400 hover:text-slate-100 text-xs font-bold px-1.5"
                        >
                          বাতিল
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-semibold">নাম (Full Name)</label>
                        <input 
                          type="text" 
                          required
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          className={`w-full py-2 px-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${themeInput}`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold">ইমেইল</label>
                          <input 
                            type="email" 
                            required
                            value={applicantEmail}
                            onChange={(e) => setApplicantEmail(e.target.value)}
                            className={`w-full py-2 px-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${themeInput}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold">মোবাইল</label>
                          <input 
                            type="tel" 
                            required
                            value={applicantPhone}
                            onChange={(e) => setApplicantPhone(e.target.value)}
                            className={`w-full py-2 px-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${themeInput}`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold">পাসপোর্ট নম্বর</label>
                          <input 
                            type="text" 
                            required
                            placeholder="EH1234567"
                            value={applicantPassportNumber}
                            onChange={(e) => setApplicantPassportNumber(e.target.value)}
                            className={`w-full py-2 px-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${themeInput}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold">মেয়াদোত্তীর্ণের তারিখ</label>
                          <input 
                            type="date" 
                            required
                            value={applicantPassportExpiry}
                            onChange={(e) => setApplicantPassportExpiry(e.target.value)}
                            className={`w-full py-2 px-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${themeInput}`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold">BMET স্মার্ট কার্ড নম্বর</label>
                          <input 
                            type="text" 
                            placeholder="BMET-2026-XXXXX"
                            value={applicantBmetNumber}
                            onChange={(e) => setApplicantBmetNumber(e.target.value)}
                            className={`w-full py-2 px-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${themeInput}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold">মেডিকেল ফিট স্ট্যাটাস</label>
                          <select 
                            value={applicantMedicalStatus}
                            onChange={(e) => setApplicantMedicalStatus(e.target.value as any)}
                            className={`w-full py-2 px-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${themeInput}`}
                          >
                            <option value="Fit">Fit (ফিট)</option>
                            <option value="Pending">Pending (অপেক্ষমান)</option>
                            <option value="Unfit">Unfit (আনফিট)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold">কাজের দক্ষতা (Skills)</label>
                          <input 
                            type="text" 
                            value={applicantSkills}
                            onChange={(e) => setApplicantSkills(e.target.value)}
                            className={`w-full py-2 px-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${themeInput}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold">অভিজ্ঞতা (GCC Experience)</label>
                          <input 
                            type="text" 
                            value={applicantExperience}
                            onChange={(e) => setApplicantExperience(e.target.value)}
                            className={`w-full py-2 px-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${themeInput}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-semibold">সিভি / জীবনবৃত্তান্ত (CV)</label>
                        <div className={`p-3 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition ${
                          cvFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 bg-slate-900/40 hover:bg-slate-900'
                        }`}>
                          <CloudUpload className={`w-6 h-6 mb-1 ${cvFile ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <span className="text-[10px] font-medium block truncate max-w-full">
                            {cvFileName || 'সিভি ফাইল সিলেক্ট করুন'}
                          </span>
                          <span className="text-[8.5px] text-slate-500 mt-0.5">PDF or DOC (Max 5MB)</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-semibold">কভার লেটার</label>
                        <textarea 
                          rows={2}
                          value={coverText}
                          onChange={(e) => setCoverText(e.target.value)}
                          className={`w-full py-2 px-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none ${themeInput}`}
                        />
                      </div>

                      <button 
                        id="app-apply-submit-btn"
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md mt-2 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> আবেদন জমা দিন
                      </button>
                    </form>
                  </div>
                )}

              </div>
            )}

            {/* SCREEN: SAVED JOBS (Now application record and saved jobs) */}
            {currentScreen === 'saved' && (
              <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto max-h-[500px]">
                
                {/* Segmented Sub-Tabs */}
                <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800 shrink-0">
                  <button 
                    id="app-saved-tab-records"
                    onClick={() => setSavedTab('records')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black text-center transition-all flex items-center justify-center gap-1.5 ${savedTab === 'records' ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : isDark ? 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800' : 'bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200'}`}
                  >
                    📋 আবেদন রেকর্ড ({appliedJobIds.length + (italyPackages || []).filter(p => p.candidateEmail.toLowerCase() === applicantEmail.toLowerCase() || p.candidateEmail.toLowerCase() === 'ariful@example.com' || p.candidateEmail.toLowerCase() === 'seeker@example.com').length})
                  </button>
                  <button 
                    id="app-saved-tab-saved"
                    onClick={() => setSavedTab('saved')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black text-center transition-all flex items-center justify-center gap-1.5 ${savedTab === 'saved' ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : isDark ? 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800' : 'bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200'}`}
                  >
                    ⭐ সংরক্ষিত চাকরি ({savedJobs.length})
                  </button>
                </div>

                {/* TAB 1: APPLICATION RECORDS & WORKFLOWS */}
                {savedTab === 'records' && (
                  <div className="flex-1 flex flex-col gap-3">
                    
                    {/* Jobs Application Section */}
                    <div>
                      <h4 className={`text-[10px] font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b pb-1.5 ${isDark ? 'text-emerald-400 border-slate-800' : 'text-emerald-600 border-slate-300'}`}>
                        💼 ADMIN POSTED JOBS (সাধারণ চাকরির আবেদন রেকর্ড)
                      </h4>
                      <div className="flex flex-col gap-2">
                        {appliedJobIds.length > 0 ? (
                          jobs.filter(j => appliedJobIds.includes(j.id)).map((job) => {
                            const app = applications.find(a => a.jobId === job.id && a.candidateEmail.toLowerCase() === applicantEmail.toLowerCase());
                            const status = app ? app.status : 'Pending';
                            return (
                              <div 
                                key={job.id}
                                id={`app-record-job-item-${job.id}`}
                                onClick={() => {
                                  if (app) {
                                    setSelectedAppDetail(app);
                                  } else {
                                    const fallbackApp: Application = {
                                      id: 'mock_' + job.id,
                                      jobId: job.id,
                                      jobTitle: job.title,
                                      companyName: job.companyName,
                                      candidateName: applicantName,
                                      candidateEmail: applicantEmail,
                                      candidatePhone: applicantPhone,
                                      passportNumber: applicantPassportNumber,
                                      passportExpiry: applicantPassportExpiry,
                                      medicalStatus: applicantMedicalStatus,
                                      policeClearance: applicantPoliceClearance,
                                      skills: applicantSkills,
                                      experience: applicantExperience,
                                      languages: applicantLanguages,
                                      resumeName: cvFileName,
                                      status: 'Pending',
                                      appliedAt: '2026-07-03'
                                    };
                                    setSelectedAppDetail(fallbackApp);
                                  }
                                }}
                                className={`p-2.5 rounded-xl border flex justify-between items-center cursor-pointer transition-all hover:border-emerald-500/40 ${themeCard}`}
                              >
                                <div className="min-w-0 flex-1">
                                  <h5 className={`text-[11.5px] font-black tracking-tight truncate ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>{job.title}</h5>
                                  <p className={`text-[9.5px] font-extrabold truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{job.companyName}</p>
                                </div>
                                <div className="ml-2 shrink-0">
                                  <span className={`px-2 py-0.5 text-[8.5px] font-black rounded-full border ${
                                    status === 'Shortlisted' ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' :
                                    status === 'Rejected' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                                    'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                  }`}>
                                    {status === 'Shortlisted' ? 'শর্টলিস্টেড' : status === 'Rejected' ? 'নাকচকৃত' : 'প্রক্রিয়াধীন'}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center py-4 text-[9.5px] font-black text-slate-500">কোনো চাকরি আবেদন রেকর্ড পাওয়া যায়নি।</p>
                        )}
                      </div>
                    </div>

                    {/* Italy Package Processing Section */}
                    <div className="border-t border-slate-800 pt-3">
                      <h4 className={`text-[10px] font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b pb-1.5 ${isDark ? 'text-emerald-400 border-slate-800' : 'text-emerald-600 border-slate-300'}`}>
                        🇮🇹 ITALY WORK VISA APPLY PACKAGES (ইতালি প্রসেসিং রেকর্ড)
                      </h4>
                      <div className="flex flex-col gap-2.5">
                        {(() => {
                          const userItPkgs = (italyPackages || []).filter(p => 
                            p.candidateEmail.toLowerCase() === applicantEmail.toLowerCase() || 
                            p.candidateEmail.toLowerCase() === 'ariful@example.com' || 
                            p.candidateEmail.toLowerCase() === 'seeker@example.com'
                          );

                          if (userItPkgs.length > 0) {
                            return userItPkgs.map((pkg) => {
                              const isApproved = pkg.status === 'Approved';
                              const isRejected = pkg.status === 'Rejected';
                              return (
                                <div 
                                  key={pkg.id} 
                                  onClick={() => setSelectedAppDetail({
                                    ...pkg,
                                    jobId: 'italy-pkg',
                                    jobTitle: `🇮🇹 ${pkg.packageName} Work Visa Package`,
                                    companyName: 'Euro Bangla Manpower Services',
                                    status: pkg.status === 'Approved' ? 'Shortlisted' : pkg.status,
                                    priceAmount: pkg.priceAmount || `৳${(pkg.grandTotal || 190000).toLocaleString()}`
                                  } as any)}
                                  className={`p-3 rounded-xl border space-y-2.5 cursor-pointer hover:border-emerald-500/50 transition-all ${themeCard}`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className={`text-[10.5px] font-black uppercase ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                      🇮🇹 {pkg.packageName} Package
                                    </span>
                                    <span className={`px-2.5 py-0.5 text-[8.5px] font-black rounded-full border ${
                                      isApproved ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                      isRejected ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                                      'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                    }`}>
                                      {isApproved ? 'অনুমোদিত' : isRejected ? 'বাতিল' : 'পেন্ডিং'}
                                    </span>
                                  </div>

                                  {/* Price set by admin displayed to candidate in app */}
                                  <div className={`p-2.5 rounded-xl border space-y-1 ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                                    <p className={`text-[9px] font-black ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>নির্ধারিত প্রসেসিং চার্জ ও ফি:</p>
                                    <p className={`text-[11.5px] font-black flex items-center gap-1 font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                      💸 {pkg.priceAmount || 'অ্যাডমিন পর্যালোচনার পর টাকার পরিমাণ নির্ধারণ করা হবে'}
                                    </p>
                                  </div>

                                  {pkg.notes && (
                                    <p className={`text-[9.5px] leading-normal p-2.5 rounded-lg border font-bold ${isDark ? 'text-slate-200 bg-slate-900/40 border-slate-800' : 'text-slate-900 bg-amber-50/40 border-amber-200/50'}`}>
                                      <strong className="text-amber-500 font-black">ফিডব্যাক:</strong> {pkg.notes}
                                    </p>
                                  )}

                                  {/* Simple progress roadmap for mobile */}
                                  <div className="grid grid-cols-3 gap-1 pt-1 text-[8.5px] text-center font-black">
                                    <div className={`p-1.5 rounded border ${isApproved ? (isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200') : (isDark ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-slate-100 text-slate-400 border-slate-200')}`}>
                                      নথি যাচাই {isApproved ? '✓' : ''}
                                    </div>
                                    <div className={`p-1.5 rounded border ${isApproved && pkg.notes?.includes('সিভি') ? (isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200') : (isDark ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-slate-100 text-slate-400 border-slate-200')}`}>
                                      সিভি প্রস্তুত
                                    </div>
                                    <div className={`p-1.5 rounded border ${isApproved && pkg.notes?.includes('জবে সাবমিট') ? (isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200') : (isDark ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-slate-100 text-slate-400 border-slate-200')}`}>
                                      জবে সাবমিট
                                    </div>
                                  </div>
                                </div>
                              );
                            });
                          } else {
                            return (
                              <div className={`text-center py-5 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                <p className="text-[9.5px] font-black text-slate-500">কোনো ইতালি সার্ভিস বুকিং রেকর্ড পাওয়া যায়নি।</p>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 2: SAVED JOBS LIST */}
                {savedTab === 'saved' && (
                  <div className="flex-1 flex flex-col gap-2">
                    {savedJobs.length > 0 ? (
                      jobs.filter(j => savedJobs.includes(j.id)).map((job) => (
                        <div 
                          key={job.id}
                          id={`app-saved-job-card-${job.id}`}
                          className={`p-3 rounded-xl border flex gap-3 items-center ${themeCard}`}
                        >
                          <div 
                            onClick={() => { setSelectedJob(job); setCurrentScreen('job_detail'); }}
                            className="w-8.5 h-8.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0 cursor-pointer"
                          >
                            {job.companyLogo}
                          </div>
                          <div 
                            onClick={() => { setSelectedJob(job); setCurrentScreen('job_detail'); }}
                            className="flex-1 min-w-0 cursor-pointer"
                          >
                            <h4 className="text-[11.5px] font-bold truncate">{job.title}</h4>
                            <p className="text-[9.5px] text-slate-400 truncate mt-0.5">{job.companyName}</p>
                          </div>
                          <button 
                            id={`app-unsave-btn-${job.id}`}
                            onClick={() => onToggleSaveJob(job.id)}
                            className="text-xs text-rose-500 hover:text-rose-400 font-bold px-2 py-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 text-slate-400">
                        <Bookmark className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                        <p className="text-xs">কোন চাকরি সংরক্ষিত করা হয়নি।</p>
                        <button 
                          id="app-saved-explore-btn-tab"
                          onClick={() => setCurrentScreen('home')}
                          className="text-xs text-emerald-500 hover:underline font-bold mt-2"
                        >
                          চাকরি খুঁজুন
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* SCREEN: NOTIFICATIONS & PROFILE HISTORY */}
            {currentScreen === 'profile' && (
              <div className="p-3 flex-grow flex flex-col gap-3 overflow-y-auto max-h-[500px]">
                
                {/* Profile Section Tab Toggle */}
                <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800 shrink-0 gap-1">
                  <button 
                    id="app-profile-tab-edit"
                    onClick={() => setProfileTab('form')}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold text-center transition flex items-center justify-center gap-1 ${profileTab === 'form' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    📝 প্রোফাইল (Edit)
                  </button>
                  <button 
                    id="app-profile-tab-payments"
                    onClick={() => setProfileTab('payments')}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold text-center transition flex items-center justify-center gap-1 ${profileTab === 'payments' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    💳 পেমেন্ট তথ্য (Payment)
                  </button>
                  <button 
                    id="app-profile-tab-stats"
                    onClick={() => setProfileTab('dashboard')}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold text-center transition flex items-center justify-center gap-1 ${profileTab === 'dashboard' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    🔔 নোটিফিকেশন ({notifications.filter(n => !n.isRead).length})
                  </button>
                </div>

                {/* Tab 1: Profile Edit Form (Refactored to Settings Dashboard) */}
                {profileTab === 'form' && (
                  <div className="space-y-3 pb-6 flex-grow overflow-y-auto max-h-[460px] pr-0.5">
                    {/* Tiny Save Toast Notification */}
                    {showSaveToast && (
                      <div className="p-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[9px] text-center animate-bounce shadow-lg flex items-center justify-center gap-1">
                        ✨ প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে!
                      </div>
                    )}

                    {/* Profile Header Block */}
                    <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                      <div className="absolute top-2 right-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[7px] px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                        <Check className="w-2 h-2 stroke-[3]" /> Verified
                      </div>

                      <div className="relative w-14 h-14 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl group shadow-inner">
                        👤
                        <button 
                          onClick={() => setProfileSheet('documents')}
                          className="absolute bottom-0 right-0 p-1 bg-emerald-500 text-slate-950 rounded-full shadow-md hover:bg-emerald-600 transition"
                          title="Change Photo"
                        >
                          <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
                        </button>
                      </div>

                      <h3 className="text-xs font-black text-slate-100 mt-2">{applicantName}</h3>
                      <p className="text-[9px] text-slate-400 font-semibold font-mono mt-0.5">{applicantPhone} • {applicantEmail}</p>
                      
                      {/* Profile Strength Progress Bar */}
                      <div className="w-full mt-3 space-y-1">
                        <div className="flex justify-between items-center text-[8.5px] font-bold">
                          <span className="text-slate-400">প্রোফাইল তথ্য সম্পন্নতা (Strength)</span>
                          <span className="text-emerald-400">৯৫%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[95%]" />
                        </div>
                      </div>
                    </div>

                    {/* Settings List Menu */}
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-850">
                      
                      {/* Item 1: Personal details */}
                      <button 
                        id="profile-menu-personal"
                        onClick={() => setProfileSheet('personal')}
                        className="w-full p-2.5 text-left flex items-center justify-between hover:bg-slate-800/40 active:bg-slate-800/60 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[10px] font-black text-slate-200">ব্যক্তিগত তথ্য (Personal Info)</h4>
                            <p className="text-[8px] text-slate-400 truncate mt-0.5">{applicantName.split(' ')[0]} • {applicantLanguages}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                      </button>

                      {/* Item 2: Passport details */}
                      <button 
                        id="profile-menu-passport"
                        onClick={() => setProfileSheet('passport')}
                        className="w-full p-2.5 text-left flex items-center justify-between hover:bg-slate-800/40 active:bg-slate-800/60 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <CreditCard className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[10px] font-black text-slate-200">পাসপোর্ট ও BMET তথ্য (Passport)</h4>
                            <p className="text-[8px] text-slate-400 truncate mt-0.5">পাসপোর্ট: {applicantPassportNumber} • {applicantMedicalStatus}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                      </button>

                      {/* Item 3: Educational details */}
                      <button 
                        id="profile-menu-education"
                        onClick={() => setProfileSheet('education')}
                        className="w-full p-2.5 text-left flex items-center justify-between hover:bg-slate-800/40 active:bg-slate-800/60 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <GraduationCap className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[10px] font-black text-slate-200">শিক্ষাগত যোগ্যতা (Education)</h4>
                            <p className="text-[8px] text-slate-400 truncate mt-0.5">{applicantDegree}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                      </button>

                      {/* Item 4: Experience details */}
                      <button 
                        id="profile-menu-experience"
                        onClick={() => setProfileSheet('experience')}
                        className="w-full p-2.5 text-left flex items-center justify-between hover:bg-slate-800/40 active:bg-slate-800/60 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <Briefcase className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[10px] font-black text-slate-200">কাজের অভিজ্ঞতা (Work History)</h4>
                            <p className="text-[8px] text-slate-400 truncate mt-0.5">{applicantGccExp}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                      </button>

                      {/* Item 5: Skills details */}
                      <button 
                        id="profile-menu-skills"
                        onClick={() => setProfileSheet('skills')}
                        className="w-full p-2.5 text-left flex items-center justify-between hover:bg-slate-800/40 active:bg-slate-800/60 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <Settings className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[10px] font-black text-slate-200">দক্ষতা সমূহ (Specialty Skills)</h4>
                            <p className="text-[8px] text-slate-400 truncate mt-0.5">{applicantSkills}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                      </button>

                      {/* Item 6: Documents Upload */}
                      <button 
                        id="profile-menu-documents"
                        onClick={() => setProfileSheet('documents')}
                        className="w-full p-2.5 text-left flex items-center justify-between hover:bg-slate-800/40 active:bg-slate-800/60 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[10px] font-black text-slate-200">জীবনবৃত্তান্ত ও ফাইল (Documents)</h4>
                            <p className="text-[8px] text-slate-400 truncate mt-0.5">CV, Passport, GAMCA Medical scan pages</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                      </button>

                      {/* Item 7: Payment Records */}
                      <button 
                        id="profile-menu-payments"
                        onClick={() => setProfileSheet('payments')}
                        className="w-full p-2.5 text-left flex items-center justify-between hover:bg-slate-800/40 active:bg-slate-800/60 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[10px] font-black text-slate-200">পেমেন্ট হিস্ট্রি ও রশিদ (Payments)</h4>
                            <p className="text-[8px] text-emerald-400 font-mono tracking-tight mt-0.5">{paymentList.length} receipts • Total Paid: ৳৬০,০০০</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                      </button>
                    </div>

                    {/* App Logout Control */}
                    <div className="pt-1">
                      <button 
                        id="app-profile-logout-btn"
                        onClick={() => {
                          setIsLoggedIn(false);
                          setCurrentScreen('home');
                        }}
                        className="w-full py-2 bg-slate-900 border border-rose-500/30 hover:bg-rose-950/20 text-rose-400 font-bold text-[10.5px] rounded-xl flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
                      >
                        <LogOut className="w-3 h-3 text-rose-500" /> লগআউট (Logout)
                      </button>
                    </div>
                  </div>
                )}


                {/* Tab: Payment Information & Receipts Hub */}
                {profileTab === 'payments' && (
                  <div className="space-y-3 pb-6 flex-grow overflow-y-auto max-h-[460px] pr-0.5 animate-fade-in">
                    {/* Total Cost & Status Banner */}
                    <div className="p-3.5 bg-gradient-to-br from-emerald-950/80 via-slate-900 to-indigo-950/70 border border-emerald-500/30 rounded-2xl shadow-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          💳 পেমেন্ট ও সার্ভিস ফি সামারি
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[8px] font-black uppercase">
                          ভেরিফাইড হিসাব
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-center pt-1">
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                          <p className="text-[7.5px] text-slate-400 font-bold">মোট প্যাকেজ ফি</p>
                          <p className="text-[11px] font-black text-slate-100 font-mono mt-0.5">৳১,৫০,০০০</p>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-emerald-500/20">
                          <p className="text-[7.5px] text-emerald-400 font-bold">পরিশোধিত টাকা</p>
                          <p className="text-[11px] font-black text-emerald-400 font-mono mt-0.5">৳৬০,০০০</p>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-rose-500/20">
                          <p className="text-[7.5px] text-rose-400 font-bold">বকেয়া পরিমাণ</p>
                          <p className="text-[11px] font-black text-rose-400 font-mono mt-0.5">৳৯০,০০০</p>
                        </div>
                      </div>
                    </div>

                    {/* Agency Official Bank & Payment Accounts */}
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-black text-slate-200 flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="flex items-center gap-1.5">🏦 পেমেন্ট জমা দেওয়ার ব্যাংক ও মোবাইল হিসাব</span>
                        <span className="text-[8px] text-amber-400 font-mono">Official</span>
                      </h4>

                      <div className="space-y-1.5 text-[9px]">
                        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-200">🇳🇱 Dutch-Bangla Bank PLC</p>
                            <p className="text-[8px] text-slate-400 font-mono">A/C: 148-110-294021 • গুলশান শাখা</p>
                          </div>
                          <span className="text-[8px] bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded font-mono">DBBL</span>
                        </div>

                        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-200">🕌 Islami Bank Bangladesh</p>
                            <p className="text-[8px] text-slate-400 font-mono">A/C: 2050-38101-009 • বৈদেশিক শাখা</p>
                          </div>
                          <span className="text-[8px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-mono">IBBL</span>
                        </div>

                        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-200">📱 bKash / Nagad Merchant</p>
                            <p className="text-[8px] text-slate-400 font-mono">01711-000000 (রেফারেন্স: পাসপোর্টের ১ম ৫ ডিজিট)</p>
                          </div>
                          <span className="text-[8px] bg-pink-500/15 text-pink-400 px-1.5 py-0.5 rounded font-mono">bKash</span>
                        </div>
                      </div>
                    </div>

                    {/* Paid Receipts & Transactions */}
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-black text-slate-200 flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span>🧾 পরিশোধিত কিস্তি ও রিসিপ্ট সমূহ</span>
                        <span className="text-[8px] text-emerald-400 font-bold">{paymentList.length} টি প্রাপ্তিস্বীকার</span>
                      </h4>

                      <div className="space-y-1.5">
                        {paymentList.map((pay) => (
                          <div key={pay.id} className="p-2 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center text-[9px]">
                            <div className="min-w-0 pr-2">
                              <p className="font-bold text-slate-200 truncate">{pay.title}</p>
                              <p className="text-[8px] text-slate-500 font-mono mt-0.5">তারিখ: {pay.date}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-black text-emerald-400 font-mono block">{pay.amount}</span>
                              <span className="text-[7.5px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.2 rounded font-bold uppercase inline-block mt-0.5">
                                ✓ {pay.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit New Payment Receipt Button */}
                    <button 
                      onClick={() => setProfileSheet('payments')}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-[10px] rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>নতুন পেমেন্ট ট্রানজেকশন জমা দিন (Submit TxID)</span>
                    </button>
                  </div>
                )}

                {/* Tab 2: Dashboard Statistics, notifications, history (The existing default) */}
                {profileTab === 'dashboard' && (
                  <div className="space-y-3 pb-6">
                    {/* Profile Header Block */}
                    <div className={`p-3 rounded-xl border flex gap-3 items-center ${themeCard}`}>
                      <div className="relative w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-sm text-white font-bold overflow-hidden border border-slate-700">
                        👤
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-black truncate">{applicantName}</h3>
                        <p className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">✈️ প্রবাসী চাকরিপ্রার্থী (GCC Seeker)</p>
                        <p className="text-[8.5px] text-slate-400 truncate">{applicantEmail} • {applicantPhone}</p>
                      </div>
                    </div>

                    {/* BMET Smart Card & Passport Info Dashboard */}
                    <div className={`p-3 rounded-xl border text-[9.5px] space-y-2 bg-slate-900/50 ${themeCard}`}>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                        <span className="font-bold text-slate-300">🎫 বিএমইটি ও পাসপোর্ট তথ্য</span>
                        <span className="text-[8px] bg-emerald-500/15 text-emerald-500 px-1 rounded font-bold uppercase">Verified</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
                        <div>
                          <span className="text-slate-500 block text-[7.5px] font-sans">পাসপোর্ট নম্বর</span>
                          <span className="text-slate-300">🛂 {applicantPassportNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[7.5px] font-sans">মেয়াদোত্তীর্ণের তারিখ</span>
                          <span className="text-slate-300">📅 {applicantPassportExpiry}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[7.5px] font-sans">BMET রেজিস্ট্রেশন</span>
                          <span className="text-slate-300">💳 {applicantBmetNumber || 'প্রক্রিয়াধীন'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[7.5px] font-sans">মেডিকেল স্ট্যাটাস</span>
                          <span className={`font-bold ${applicantMedicalStatus === 'Fit' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            ⚕️ {applicantMedicalStatus}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-800 grid grid-cols-2 gap-1 text-[8.5px] font-sans text-slate-400">
                        <p>👮 পুলিশ ক্লিয়ারেন্স: <strong className="text-blue-400">{applicantPoliceClearance}</strong></p>
                        <p>💼 জিসিসি অভিজ্ঞতা: <strong className="text-slate-200 truncate block">{applicantGccExp}</strong></p>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div>
                      <h3 className="text-xs font-bold border-l-2 border-emerald-500 pl-2 mb-2 flex items-center justify-between">
                        <span>🔔 নোটিফিকেশন সমূহ ({notifications.filter(n => !n.isRead).length})</span>
                      </h3>

                      <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-0.5">
                        {notifications.length > 0 ? (
                          notifications.slice().reverse().map((notif) => (
                            <div 
                              key={notif.id}
                              id={`app-notif-item-${notif.id}`}
                              onClick={() => {
                                if (onMarkNotificationAsRead) {
                                  onMarkNotificationAsRead(notif.id);
                                }
                                setSelectedNotifDetail(notif);
                              }}
                              className={`p-2 rounded-lg border text-[9.5px] flex gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 ${themeCard} ${!notif.isRead ? 'border-emerald-500/50 bg-emerald-500/10 shadow-sm' : 'border-slate-800'}`}
                              title="Click to view notification details"
                            >
                              <span className="text-xs shrink-0 mt-0.5">🔔</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <span className={`font-bold truncate ${!notif.isRead ? 'text-emerald-400' : 'text-slate-200'}`}>{notif.title}</span>
                                  <span className="text-[8px] text-slate-500 shrink-0 ml-1">{notif.sentAt}</span>
                                </div>
                                <p className="text-[9px] text-slate-400 mt-0.5 leading-normal truncate">{notif.message}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-4 text-[9px] text-slate-500">কোন নোটিফিকেশন নেই</p>
                        )}
                      </div>
                    </div>

                    {/* Job Application History */}
                    <div className="flex-grow flex flex-col min-h-[120px]">
                      <h3 className="text-xs font-black border-l-2 border-emerald-500 pl-2 mb-2 flex justify-between items-center">
                        <span className={`${isDark ? 'text-slate-100' : 'text-slate-950'}`}>📋 আবেদন রেকর্ড ({appliedJobIds.length})</span>
                        <span className="text-[8px] text-slate-400 font-bold">বিস্তারিত দেখতে ক্লিক করুন</span>
                      </h3>

                      <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[140px] pr-0.5">
                        {appliedJobIds.length > 0 ? (
                          jobs.filter(j => appliedJobIds.includes(j.id)).map((job) => {
                            const app = applications.find(a => a.jobId === job.id && a.candidateEmail.toLowerCase() === applicantEmail.toLowerCase());
                            const status = app ? app.status : 'Pending';
                            return (
                              <div 
                                key={job.id}
                                id={`app-history-item-${job.id}`}
                                onClick={() => {
                                  if (app) {
                                    setSelectedAppDetail(app);
                                  } else {
                                    // Fallback mock app detail if somehow not created in sync
                                    const fallbackApp: Application = {
                                      id: 'mock_' + job.id,
                                      jobId: job.id,
                                      jobTitle: job.title,
                                      companyName: job.companyName,
                                      candidateName: applicantName,
                                      candidateEmail: applicantEmail,
                                      candidatePhone: applicantPhone,
                                      passportNumber: applicantPassportNumber,
                                      passportExpiry: applicantPassportExpiry,
                                      medicalStatus: applicantMedicalStatus,
                                      policeClearance: applicantPoliceClearance,
                                      skills: applicantSkills,
                                      experience: applicantExperience,
                                      languages: applicantLanguages,
                                      resumeName: cvFileName,
                                      status: 'Pending',
                                      appliedAt: new Date().toISOString().split('T')[0]
                                    };
                                    setSelectedAppDetail(fallbackApp);
                                  }
                                }}
                                className={`p-2 rounded-lg border flex justify-between items-center text-[10px] cursor-pointer hover:bg-slate-800/60 active:scale-[0.98] transition-all ${themeCard} ${
                                  status === 'Shortlisted' ? 'border-emerald-500/30 hover:border-emerald-500/60' :
                                  status === 'Rejected' ? 'border-rose-500/20 hover:border-rose-500/50' :
                                  'border-slate-800'
                                }`}
                                title="আবেদনের স্থিতি দেখুন"
                              >
                                <div className="min-w-0 flex-1">
                                  <h4 className={`text-[11px] font-black truncate ${isDark ? 'text-slate-100' : 'text-slate-950 font-black'}`}>{job.title}</h4>
                                  <p className={`text-[9px] font-extrabold mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-700 font-extrabold'}`}>{job.companyName}</p>
                                </div>
                                
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border shrink-0 uppercase tracking-wider ${
                                  status === 'Shortlisted' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/35' :
                                  status === 'Rejected' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                                  'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                }`}>
                                  {status === 'Shortlisted' ? 'শর্টলিস্টেড' : status === 'Rejected' ? 'নাকচকৃত' : 'প্রক্রিয়াধীন'}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-6 text-slate-500 text-[9.5px]">
                            কোন আবেদন হিস্ট্রি পাওয়া যায়নি
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile Modular Sheets Container */}
                <ProfileSheets 
                  profileSheet={profileSheet}
                  onClose={() => setProfileSheet(null)}
                  isDark={true}
                  applicantName={applicantName}
                  setApplicantName={setApplicantName}
                  applicantEmail={applicantEmail}
                  setApplicantEmail={setApplicantEmail}
                  applicantPhone={applicantPhone}
                  setApplicantPhone={setApplicantPhone}
                  applicantLanguages={applicantLanguages}
                  setApplicantLanguages={setApplicantLanguages}
                  applicantPassportNumber={applicantPassportNumber}
                  setApplicantPassportNumber={setApplicantPassportNumber}
                  applicantPassportExpiry={applicantPassportExpiry}
                  setApplicantPassportExpiry={setApplicantPassportExpiry}
                  applicantBmetNumber={applicantBmetNumber}
                  setApplicantBmetNumber={setApplicantBmetNumber}
                  applicantMedicalStatus={applicantMedicalStatus}
                  setApplicantMedicalStatus={setApplicantMedicalStatus}
                  applicantPoliceClearance={applicantPoliceClearance}
                  setApplicantPoliceClearance={setApplicantPoliceClearance}
                  additionalPassports={additionalPassports}
                  setAdditionalPassports={setAdditionalPassports}
                  applicantDegree={applicantDegree}
                  setApplicantDegree={setApplicantDegree}
                  applicantInstitution={applicantInstitution}
                  setApplicantInstitution={setApplicantInstitution}
                  applicantPassingYear={applicantPassingYear}
                  setApplicantPassingYear={setApplicantPassingYear}
                  applicantGccExp={applicantGccExp}
                  setApplicantGccExp={setApplicantGccExp}
                  applicantBdExp={applicantBdExp}
                  setApplicantBdExp={setApplicantBdExp}
                  applicantPrevCompany={applicantPrevCompany}
                  setApplicantPrevCompany={setApplicantPrevCompany}
                  additionalExperiences={additionalExperiences}
                  setAdditionalExperiences={setAdditionalExperiences}
                  applicantSkills={applicantSkills}
                  setApplicantSkills={setApplicantSkills}
                  cvFileName={cvFileName}
                  setCvFileName={setCvFileName}
                  passportCopyName={passportCopyName}
                  setPassportCopyName={setPassportCopyName}
                  medicalCertName={medicalCertName}
                  setMedicalCertName={setMedicalCertName}
                  policeCertName={policeCertName}
                  setPoliceCertName={setPoliceCertName}
                  uploadedPhotoName={uploadedPhotoName}
                  setUploadedPhotoName={setUploadedPhotoName}
                  paymentList={paymentList}
                  setPaymentList={setPaymentList}
                  onSave={() => {
                    setShowSaveToast(true);
                    setTimeout(() => setShowSaveToast(false), 4000);
                  }}
                />

              </div>
            )}

            {/* SCREEN: ITALY PACKAGES LIST */}
            {currentScreen === 'italy_packages_list' && (
              <div className="p-4 flex-grow flex flex-col gap-3 overflow-y-auto max-h-[500px]">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800">
                  <button 
                    id="italy-list-back"
                    onClick={() => setCurrentScreen('home')}
                    className="p-1 rounded-lg hover:bg-slate-800 shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className={`text-xs font-black flex items-center gap-1 ${isDark ? 'text-slate-100' : 'text-slate-950 font-black'}`}>
                    🇮🇹 ইতালি প্রসেসিং প্যাকেজ সমূহ
                  </h3>
                </div>

                {/* Disclaimer Alert Card */}
                <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[8.5px] leading-normal font-bold">
                  ⚠️ <strong className="text-amber-500 font-black">সতর্কতা:</strong> নুলা ওস্তা বা ভিসার শতভাগ গ্যারান্টি কোনো প্রতিষ্ঠান দিতে পারে না। আমরা প্রফেশনাল ডকুমেন্টেশন, ইউরোপাস সিভি-কভার লেটার রাইটিং ও কোম্পানি আবেদন সাপোর্ট দিয়ে থাকি।
                </div>

                <div className="flex flex-col gap-3">
                  {/* BASIC */}
                  <div className={`p-3 rounded-xl border ${themeCard} relative flex flex-col gap-2`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded border border-slate-700 tracking-wider">Basic Pack</span>
                        <h4 className={`text-xs font-black mt-1 ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>প্রাথমিক আবেদন প্রিপারেশন</h4>
                      </div>
                      <span className="text-xs font-black text-emerald-500 font-mono">৳২,৫০০</span>
                    </div>
                    <ul className={`space-y-1 text-[8.5px] list-disc pl-3 font-bold ${isDark ? 'text-slate-400' : 'text-slate-800'}`}>
                      <li>ইউরোপাস (Europass) সিভি তৈরি</li>
                      <li>প্রফেশনাল কভার লেটার রাইটিং</li>
                      <li>পাসপোর্ট ও অন্যান্য নথি নিরীক্ষা</li>
                      <li>চাকরি খোঁজার পরামর্শ ও গাইডলাইন</li>
                    </ul>
                    <button 
                      id="pkg-btn-basic"
                      onClick={() => {
                        setSelectedItalyPackage('Basic');
                        setItalyMessage('আমি ইতালির প্রাথমিক আবেদন প্যাকেজে আগ্রহী।');
                        setCurrentScreen('italy_package_apply');
                      }}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-[9px] font-black transition-colors"
                    >
                      বেসিক বুক করুন
                    </button>
                  </div>

                  {/* STANDARD */}
                  <div className={`p-3 rounded-xl border-2 border-emerald-500 relative flex flex-col gap-2 ${themeCard}`}>
                    <div className="absolute -top-2 left-4 px-1.5 py-0.2 bg-emerald-500 text-slate-950 text-[7px] font-black uppercase rounded">
                      ★ মোস্ট পপুলার
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.2 bg-emerald-500/15 text-emerald-400 rounded border border-emerald-500/25 tracking-wider">Standard Pack</span>
                        <h4 className={`text-xs font-black mt-1 ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>স্মার্ট জব সিকিং সাপোর্ট</h4>
                      </div>
                      <span className="text-xs font-black text-emerald-500 font-mono">৳৬,০০০</span>
                    </div>
                    <ul className={`space-y-1 text-[8.5px] list-disc pl-3 font-bold ${isDark ? 'text-slate-400' : 'text-slate-800'}`}>
                      <li>বেসিক প্যাকেজের সমস্ত সুবিধা</li>
                      <li>ইতালির ১টি নির্দিষ্ট খাতে সরাসরি আবেদন</li>
                      <li>আবেদনের স্ক্রিনশট ও প্রমাণ শেয়ার</li>
                      <li>ইন্টারভিউ টিপস ও ফলো-আপ সাপোর্ট</li>
                    </ul>
                    <button 
                      id="pkg-btn-standard"
                      onClick={() => {
                        setSelectedItalyPackage('Standard');
                        setItalyMessage('আমি স্ট্যান্ডার্ড প্যাকেজ বুকিং করতে চাই।');
                        setCurrentScreen('italy_package_apply');
                      }}
                      className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[9px] font-black transition-colors shadow-sm"
                    >
                      স্ট্যান্ডার্ড বুক করুন
                    </button>
                  </div>

                  {/* PREMIUM */}
                  <div className={`p-3 rounded-xl border border-amber-500/50 bg-slate-950/20 relative flex flex-col gap-2 ${themeCard}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.2 bg-amber-500/15 text-amber-500 rounded border border-amber-500/25 tracking-wider">Premium VIP</span>
                        <h4 className={`text-xs font-black mt-1 ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>ভিআইপি সম্পূর্ণ প্রসেসিং</h4>
                      </div>
                      <span className="text-xs font-black text-amber-400 font-mono">৳১২,৫০০</span>
                    </div>
                    <ul className={`space-y-1 text-[8.5px] list-disc pl-3 font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                      <li>স্ট্যান্ডার্ড প্যাকেজের সমস্ত সুবিধা</li>
                      <li>ইতালির একাধিক খাতে সরাসরি কোম্পানি আবেদন</li>
                      <li>Nulla Osta সরকারি ট্র্যাকিং সহায়তা</li>
                      <li>অনলাইন ওয়ান-টু-ওয়ান ইন্টারভিউ প্রিপারেশন</li>
                      <li>২৪/৭ ডেডিকেটেড হোয়াটসঅ্যাপ সাপোর্ট</li>
                    </ul>
                    <button 
                      id="pkg-btn-premium"
                      onClick={() => {
                        setSelectedItalyPackage('Premium');
                        setItalyMessage('আমি ভিআইপি ইতালি প্রসেসিং প্যাকেজে আবেদন করতে আগ্রহী। আমার প্রয়োজনীয় কাগজপত্র রেডি আছে।');
                        setCurrentScreen('italy_package_apply');
                      }}
                      className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 rounded-lg text-[9px] font-black transition-colors"
                    >
                      ভিআইপি বুক করুন
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN: ITALY PACKAGE APPLY FORM */}
            {currentScreen === 'italy_package_apply' && selectedItalyPackage && (
              <div className="p-4 flex-grow flex flex-col gap-3 overflow-y-auto max-h-[500px]">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800">
                  <button 
                    id="italy-apply-back"
                    onClick={() => setCurrentScreen('italy_packages_list')}
                    className="p-1 rounded-lg hover:bg-slate-800 shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className={`text-xs font-black ${isDark ? 'text-slate-100' : 'text-slate-950 font-black'}`}>
                    বুকিং ফর্ম: {selectedItalyPackage} Package
                  </h3>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <p className="text-[8.5px] text-slate-400 font-bold">নির্বাচিত প্যাকেজ ফি:</p>
                  <p className="text-xs font-black text-emerald-500 font-mono">
                    💸 {selectedItalyPackage === 'Basic' ? '৳২,৫০০' : selectedItalyPackage === 'Standard' ? '৳৬,০০০' : '৳১২,৫০০'} (এককালীন)
                  </p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (onApplyItalyPackage) {
                      onApplyItalyPackage(
                        selectedItalyPackage,
                        applicantName,
                        applicantEmail,
                        applicantPhone,
                        applicantPassportNumber,
                        italyMessage
                      );
                    }

                    // Trigger mobile notification and update local states
                    const successNotif: Notification = {
                      id: 'notif_it_' + Date.now(),
                      title: '🇮🇹 ইতালি প্যাকেজ বুকিং সফল!',
                      message: `আপনার ${selectedItalyPackage} প্যাকেজ আবেদনটি সফলভাবে জমা হয়েছে। আমাদের প্রতিনিধি ২৪ ঘণ্টার মধ্যে যোগাযোগ করবেন।`,
                      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      isRead: false
                    };
                    onAddNotification(successNotif);

                    // Redirect to applications tab
                    setSavedTab('records');
                    setCurrentScreen('saved');
                  }}
                  className="space-y-3 text-[10px]"
                >
                  <div className="space-y-1">
                    <label className={profileLabel}>আবেদনকারীর নাম (Candidate Name)</label>
                    <input 
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className={`w-full py-1.5 px-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${profileInput}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={profileLabel}>ইমেইল (Email Address)</label>
                    <input 
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className={`w-full py-1.5 px-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${profileInput}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={profileLabel}>মোবাইল নম্বর (Phone Number)</label>
                    <input 
                      type="text"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className={`w-full py-1.5 px-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${profileInput}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={profileLabel}>পাসপোর্ট নম্বর (Passport Number)</label>
                    <input 
                      type="text"
                      required
                      value={applicantPassportNumber}
                      onChange={(e) => setApplicantPassportNumber(e.target.value)}
                      className={`w-full py-1.5 px-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono uppercase ${profileInput}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={profileLabel}>বার্তা / নথিপত্র সংক্রান্ত নোট (Message)</label>
                    <textarea 
                      rows={2}
                      value={italyMessage}
                      onChange={(e) => setItalyMessage(e.target.value)}
                      className={`w-full py-1.5 px-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none ${profileInput}`}
                      placeholder="আপনার কাজের অভিজ্ঞতা বা নথিপত্র নিয়ে কোনো জিজ্ঞাসা থাকলে লিখুন..."
                    />
                  </div>

                  <button 
                    id="submit-italy-app-btn"
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-md mt-2 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> আবেদন নিশ্চিত করুন
                  </button>
                </form>
              </div>
            )}

            {/* Bottom Android App Native Navigation Bar */}
            <div className="mt-auto border-t border-slate-850/80 py-2 px-3 flex items-center justify-between sticky bottom-0 z-30 bg-[#0d131e]">
              <button 
                id="app-nav-home"
                onClick={() => setCurrentScreen('home')}
                className={`flex flex-col items-center gap-1 text-[9px] transition-all flex-1 ${currentScreen === 'home' ? 'text-emerald-400 font-black scale-105' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>

              <button 
                id="app-nav-saved"
                onClick={() => {
                  setCurrentScreen('saved');
                  setSavedTab('records');
                }}
                className={`flex flex-col items-center gap-1 text-[9px] transition-all flex-1 ${currentScreen === 'saved' ? 'text-emerald-400 font-black scale-105' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <FileText className="w-4 h-4" />
                <span>Application</span>
              </button>

              <button 
                id="app-nav-chat"
                onClick={() => {
                  onAddNotification({
                    id: 'notif_chat_' + Date.now(),
                    title: '💬 Chat Connected',
                    message: 'Support chat is active. Feel free to talk directly with our recruitment agency via the left Portal view!',
                    sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isRead: false
                  });
                }}
                className="flex flex-col items-center gap-1 text-[9px] text-slate-400 hover:text-slate-200 transition-all flex-1"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button>

              <button 
                id="app-nav-notifications"
                onClick={() => {
                  setCurrentScreen('profile');
                  setProfileTab('payments');
                }}
                className={`flex flex-col items-center gap-1 text-[9px] transition-all flex-1 ${currentScreen === 'profile' && profileTab === 'payments' ? 'text-emerald-400 font-black scale-105' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <div className="relative">
                  <CreditCard className="w-4 h-4" />
                  {notifications.some(n => !n.isRead) && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  )}
                </div>
                <span>Payment</span>
              </button>

              <button 
                id="app-nav-profile"
                onClick={() => {
                  setCurrentScreen('profile');
                  setProfileTab('form');
                }}
                className={`flex flex-col items-center gap-1 text-[9px] transition-all flex-1 ${currentScreen === 'profile' && profileTab === 'form' ? 'text-emerald-400 font-black scale-105' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </div>

            {/* Notification Detail Modal overlay inside simulator screen */}
            {selectedNotifDetail && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
                <div className={`w-full max-w-[290px] rounded-2xl border p-4 space-y-4 shadow-2xl ${themeCard} border-slate-700/60`}>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-base flex items-center gap-1.5 font-bold text-slate-100">
                      <span>🔔 নোটিফিকেশন</span>
                    </span>
                    <button 
                      onClick={() => setSelectedNotifDetail(null)}
                      className="text-slate-400 hover:text-white transition-colors text-[10px] font-bold bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg"
                    >
                      বন্ধ করুন (X)
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[8.5px] text-slate-500 font-mono block">🕒 পাঠানো হয়েছে: {selectedNotifDetail.sentAt}</span>
                    <h4 className="text-xs font-black text-emerald-400 leading-snug">{selectedNotifDetail.title}</h4>
                  </div>
                  
                  <p className="text-[10px] text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 font-light whitespace-pre-wrap max-h-[180px] overflow-y-auto">
                    {selectedNotifDetail.message}
                  </p>
                  
                  <button 
                    onClick={() => setSelectedNotifDetail(null)}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-[11px] rounded-xl transition-colors text-center block shadow-md hover:shadow-emerald-500/10"
                  >
                    পড়া শেষ (Close)
                  </button>
                </div>
              </div>
            )}

            {/* Application Detail Modal overlay inside simulator screen */}
            {selectedAppDetail && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-[3px] z-50 flex items-center justify-center p-1.5">
                <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col">
                  <VerifiedSystemHub 
                    application={selectedAppDetail as any} 
                    userRole="Candidate"
                    onUpdateItalyPackage={(updatedPkg) => {
                      setSelectedAppDetail(updatedPkg);
                      onUpdateItalyPackage?.(updatedPkg);
                    }}
                    onClose={() => setSelectedAppDetail(null)} 
                    isMobile={true} 
                  />
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Physical Navigation Pills at Bottom of Screen Frame */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-700 rounded-full z-40"></div>
    </div>
  );
}
