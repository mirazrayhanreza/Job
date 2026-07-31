import React, { useState, useEffect } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Mail, 
  Lock, 
  Phone, 
  User, 
  Shield, 
  Building, 
  Key, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  ShieldAlert, 
  Laptop, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  LogIn, 
  LogOut, 
  Upload, 
  Globe, 
  Compass, 
  Smartphone,
  Info,
  ShieldCheck,
  Activity,
  UserCheck
} from 'lucide-react';
import { PortalUser, LoginActivity } from '../types/auth';

interface AuthSystemProps {
  lang: 'bn' | 'en';
  users: PortalUser[];
  currentUser: PortalUser | null;
  loginActivities: LoginActivity[];
  companies: any[];
  onLogin: (user: PortalUser, activity: LoginActivity) => void;
  onLogout: () => void;
  onRegister: (newUser: PortalUser) => void;
  onUpdateUsers: (updatedUsers: PortalUser[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthSystem({
  lang,
  users,
  currentUser,
  loginActivities,
  companies,
  onLogin,
  onLogout,
  onRegister,
  onUpdateUsers,
  isOpen,
  onClose
}: AuthSystemProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register-seeker' | 'register-employer' | 'forgot'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile' | 'otp'>('email');
  
  // Input fields for Login
  const [emailInput, setEmailInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP Simulation states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sentOtpValue, setSentOtpValue] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpError, setOtpError] = useState('');

  // Seeker Registration fields
  const [seekerName, setSeekerName] = useState('');
  const [seekerMobile, setSeekerMobile] = useState('');
  const [seekerEmail, setSeekerEmail] = useState('');
  const [seekerPassword, setSeekerPassword] = useState('');
  const [seekerConfirmPassword, setSeekerConfirmPassword] = useState('');
  const [seekerCountry, setSeekerCountry] = useState('Italy 🇮🇹');
  const [seekerAgree, setSeekerAgree] = useState(false);
  const [seekerOtpVerified, setSeekerOtpVerified] = useState(false);

  // Employer Registration fields
  const [empCompanyName, setEmpCompanyName] = useState('');
  const [empOwnerName, setEmpOwnerName] = useState('');
  const [empMobile, setEmpMobile] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empRegNo, setEmpRegNo] = useState('');
  const [tradeLicenseName, setTradeLicenseName] = useState('');
  const [companyDocsName, setCompanyDocsName] = useState('');
  const [isLicenseDragging, setIsLicenseDragging] = useState(false);
  const [isDocsDragging, setIsDocsDragging] = useState(false);

  // Forgot password fields
  const [forgotMethod, setForgotMethod] = useState<'email' | 'mobile'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

  // Alert message banner states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP Timer countdown
  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Helper: detect device metadata
  const getSimulatedClientDetails = () => {
    const userAgent = navigator.userAgent;
    let browser = 'Chrome 126.0';
    if (userAgent.includes('Firefox')) browser = 'Firefox 125.0';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari 17.5';
    else if (userAgent.includes('Edge')) browser = 'Edge 124.0';

    return {
      ipAddress: '103.230.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
      browser,
      device: window.innerWidth < 768 ? 'Mobile (Android Phone)' : 'Desktop (macOS)',
      country: lang === 'bn' ? 'বাংলাদেশ 🇧🇩' : 'Bangladesh 🇧🇩'
    };
  };

  // Action: Send OTP Login SMS
  const handleSendOtpLogin = (mobile: string) => {
    if (!mobile || mobile.length < 11) {
      setErrorMsg(lang === 'bn' ? 'সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন!' : 'Enter a valid 11-digit mobile number!');
      return;
    }
    setErrorMsg('');
    const randomOtp = String(Math.floor(1000 + Math.random() * 9000));
    setSentOtpValue(randomOtp);
    setOtpSent(true);
    setOtpTimer(60);
    
    // Simulate SMS delivery in visual toast
    setSuccessMsg(lang === 'bn' 
      ? `💬 এসএমএস পাঠানো হয়েছে! আপনার ৪-সংখ্যার সিকিউর ওটিপি কোড: ${randomOtp}`
      : `💬 SMS Sent! Your 4-digit verification OTP is: ${randomOtp}`
    );
    setTimeout(() => setSuccessMsg(''), 10000);
  };

  // Action: Handle Seeker Registration Mobile Verification
  const handleSendSeekerRegOtp = () => {
    if (!seekerMobile || seekerMobile.length < 11) {
      setErrorMsg(lang === 'bn' ? 'আগে একটি সঠিক মোবাইল নম্বর লিখুন!' : 'Please enter a valid mobile number first!');
      return;
    }
    setErrorMsg('');
    const randomOtp = String(Math.floor(1000 + Math.random() * 9000));
    setSentOtpValue(randomOtp);
    setOtpSent(true);
    setOtpTimer(60);
    setSuccessMsg(lang === 'bn'
      ? `💬 আপনার মোবাইলে ভেরিফিকেশন ওটিপি পাঠানো হয়েছে: ${randomOtp}`
      : `💬 Mobile verification OTP sent: ${randomOtp}`
    );
    setTimeout(() => setSuccessMsg(''), 10000);
  };

  // Action: Verify Seeker OTP
  const handleVerifySeekerOtp = () => {
    if (otpCode === sentOtpValue) {
      setSeekerOtpVerified(true);
      setOtpSent(false);
      setSuccessMsg(lang === 'bn' ? '✅ মোবাইল নম্বর সফলভাবে ভেরিফাইড হয়েছে!' : '✅ Mobile number successfully verified!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setOtpError(lang === 'bn' ? 'ভুল ওটিপি কোড! পুনরায় চেষ্টা করুন।' : 'Invalid OTP code! Please try again.');
    }
  };

  // Action: Submit Seeker Registration
  const handleRegisterSeekerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!seekerName || !seekerEmail || !seekerMobile || !seekerPassword) {
      setErrorMsg(lang === 'bn' ? 'সবগুলো ঘর পূরণ করা আবশ্যক!' : 'All fields are required!');
      return;
    }

    if (seekerPassword !== seekerConfirmPassword) {
      setErrorMsg(lang === 'bn' ? 'পাসওয়ার্ড দুটি মেলেনি!' : 'Passwords do not match!');
      return;
    }

    if (!seekerAgree) {
      setErrorMsg(lang === 'bn' ? 'আমাদের শর্তাবলীর সাথে একমত হওয়া আবশ্যক!' : 'You must agree to the Terms of Service!');
      return;
    }

    if (!seekerOtpVerified) {
      setErrorMsg(lang === 'bn' ? 'অনুগ্রহ করে মোবাইল ওটিপি ভেরিফিকেশন সম্পন্ন করুন!' : 'Please complete mobile OTP verification!');
      return;
    }

    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === seekerEmail.toLowerCase() || u.mobile === seekerMobile)) {
      setErrorMsg(lang === 'bn' ? 'এই ইমেইল বা মোবাইল নম্বরটি দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে!' : 'Email or Mobile number already registered!');
      return;
    }

    const newUser: PortalUser = {
      id: 'usr_' + Date.now(),
      name: seekerName,
      email: seekerEmail,
      mobile: seekerMobile,
      passwordHash: seekerPassword, // Plain password as simulation
      role: 'seeker',
      status: 'Active',
      country: seekerCountry,
      isLocked: false,
      failedAttempts: 0,
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onRegister(newUser);
    setSuccessMsg(lang === 'bn' ? '🎉 অ্যাকাউন্ট তৈরি সফল হয়েছে! এখন লগইন করুন।' : '🎉 Account created successfully! Please login now.');
    
    // Switch to login tab
    setTimeout(() => {
      setActiveTab('login');
      setEmailInput(seekerEmail);
      setPasswordInput(seekerPassword);
      setSuccessMsg('');
    }, 2000);
  };

  // Action: Submit Employer Registration
  const handleRegisterEmployerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!empCompanyName || !empOwnerName || !empMobile || !empEmail || !empPassword) {
      setErrorMsg(lang === 'bn' ? 'সবগুলো ঘর পূরণ করুন!' : 'Please fill all required fields!');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === empEmail.toLowerCase() || u.mobile === empMobile)) {
      setErrorMsg(lang === 'bn' ? 'এই ইমেইল বা মোবাইলটি ইতিমধ্যে ব্যবহৃত হয়েছে!' : 'Email or Mobile already registered!');
      return;
    }

    const newUser: PortalUser = {
      id: 'usr_' + Date.now(),
      name: empOwnerName,
      email: empEmail,
      mobile: empMobile,
      passwordHash: empPassword,
      role: 'employer',
      status: 'Pending Verification', // Pending Admin Verification
      companyName: empCompanyName,
      ownerName: empOwnerName,
      registrationNumber: empRegNo || 'REG-' + Math.floor(100000 + Math.random() * 900000),
      tradeLicenseName: tradeLicenseName || 'trade_license_pending.pdf',
      companyDocumentsName: companyDocsName || 'company_profile.pdf',
      isLocked: false,
      failedAttempts: 0,
      emailVerified: false,
      phoneVerified: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onRegister(newUser);
    setSuccessMsg(lang === 'bn' 
      ? '🏢 আবেদন জমা হয়েছে! সুপার অ্যাডমিন ভেরিফিকেশনের পর আপনার কোম্পানি পোর্টাল চালু হবে।' 
      : '🏢 Registration submitted! Your Company Portal will be active after Super Admin verification.'
    );

    setTimeout(() => {
      setActiveTab('login');
      setEmailInput(empEmail);
      setPasswordInput(empPassword);
      setSuccessMsg('');
    }, 4000);
  };

  // Action: Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    let foundUser: PortalUser | undefined;

    if (loginMethod === 'email') {
      if (!emailInput || !passwordInput) {
        setErrorMsg(lang === 'bn' ? 'ইমেইল ও পাসওয়ার্ড প্রদান করুন!' : 'Enter both email and password!');
        return;
      }
      foundUser = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
    } else if (loginMethod === 'mobile') {
      if (!mobileInput || !passwordInput) {
        setErrorMsg(lang === 'bn' ? 'মোবাইল নম্বর ও পাসওয়ার্ড প্রদান করুন!' : 'Enter both mobile number and password!');
        return;
      }
      foundUser = users.find(u => u.mobile === mobileInput);
    } else {
      // OTP Login
      if (!mobileInput || !otpCode) {
        setErrorMsg(lang === 'bn' ? 'মোবাইল ও ওটিপি কোড নিশ্চিত করুন!' : 'Enter mobile and OTP code!');
        return;
      }
      if (otpCode !== sentOtpValue) {
        setErrorMsg(lang === 'bn' ? 'ভুল ওটিপি কোড!' : 'Incorrect OTP code!');
        return;
      }
      foundUser = users.find(u => u.mobile === mobileInput);
    }

    if (!foundUser) {
      setErrorMsg(lang === 'bn' ? 'ব্যবহারকারীকে খুঁজে পাওয়া যায়নি!' : 'User account not found!');
      return;
    }

    // Check Account Lock Status
    if (foundUser.isLocked || foundUser.status === 'Blocked') {
      setErrorMsg(lang === 'bn' 
        ? '⚠️ এই অ্যাকাউন্টটি অতিরিক্ত ভুল পাসওয়ার্ডের কারণে লক করা হয়েছে! এডমিন এটি খুলে দিতে পারবেন।'
        : '⚠️ This account is locked due to too many failed attempts! Admin can unlock it.'
      );
      return;
    }

    // Check password if not OTP login
    if (loginMethod !== 'otp') {
      if (foundUser.passwordHash !== passwordInput) {
        const updatedUsers = users.map(u => {
          if (u.id === foundUser!.id) {
            const attempts = u.failedAttempts + 1;
            const isLocked = attempts >= 3;
            return {
              ...u,
              failedAttempts: attempts,
              isLocked,
              status: isLocked ? 'Blocked' as const : u.status
            };
          }
          return u;
        });
        onUpdateUsers(updatedUsers);

        const currentAttempts = foundUser.failedAttempts + 1;
        if (currentAttempts >= 3) {
          setErrorMsg(lang === 'bn' 
            ? '🚨 ৩ বার ভুল পাসওয়ার্ড দেওয়ার কারণে অ্যাকাউন্ট লক করা হয়েছে!' 
            : '🚨 Account locked after 3 failed password attempts!'
          );
        } else {
          setErrorMsg(lang === 'bn' 
            ? `ভুল পাসওয়ার্ড! আর ${3 - currentAttempts} বার চেষ্টা করা যাবে।` 
            : `Wrong password! ${3 - currentAttempts} attempts remaining.`
          );
        }
        return;
      }
    }

    // Reset failed attempts on success
    const updatedUsers = users.map(u => {
      if (u.id === foundUser!.id) {
        return { ...u, failedAttempts: 0 };
      }
      return u;
    });
    onUpdateUsers(updatedUsers);

    // Dynamic Activity Logger
    const client = getSimulatedClientDetails();
    const activity: LoginActivity = {
      id: 'act_' + Date.now(),
      userId: foundUser.id,
      userEmail: foundUser.email,
      userRole: foundUser.role,
      loginTime: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString('bn-BD'),
      ipAddress: client.ipAddress,
      browser: client.browser,
      device: client.device,
      country: client.country,
      status: 'Active Session'
    };

    onLogin(foundUser, activity);
    setSuccessMsg(lang === 'bn' 
      ? `🔑 স্বাগতম ${foundUser.name}! আপনার ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...`
      : `🔑 Welcome back ${foundUser.name}! Redirecting to dashboard...`
    );

    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1500);
  };

  // Action: Forgot Password Submit
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (forgotMethod === 'email') {
      if (!forgotEmail) {
        setErrorMsg(lang === 'bn' ? 'সঠিক ইমেইল দিন!' : 'Please enter your email!');
        return;
      }
      const found = users.find(u => u.email.toLowerCase() === forgotEmail.toLowerCase());
      if (!found) {
        setErrorMsg(lang === 'bn' ? 'এই ইমেইলটি আমাদের সিস্টেমে নেই!' : 'Email not found in our system!');
        return;
      }
      setSuccessMsg(lang === 'bn' 
        ? `📧 পাসওয়ার্ড রিসেট লিংক ${forgotEmail} ঠিকানায় পাঠানো হয়েছে!` 
        : `📧 Reset password link has been sent to ${forgotEmail}!`
      );
    } else {
      if (!forgotOtpSent) {
        if (!forgotMobile) {
          setErrorMsg(lang === 'bn' ? 'মোবাইল নম্বর দিন!' : 'Please enter mobile number!');
          return;
        }
        const found = users.find(u => u.mobile === forgotMobile);
        if (!found) {
          setErrorMsg(lang === 'bn' ? 'এই মোবাইল নম্বরটি নিবন্ধিত নয়!' : 'Mobile number not registered!');
          return;
        }
        const rOtp = String(Math.floor(1000 + Math.random() * 9000));
        setSentOtpValue(rOtp);
        setForgotOtpSent(true);
        setOtpTimer(60);
        setSuccessMsg(lang === 'bn' 
          ? `💬 এসএমএস কোড পাঠানো হয়েছে! রিসেট ওটিপি: ${rOtp}`
          : `💬 SMS code sent! Reset OTP code is: ${rOtp}`
        );
      } else {
        if (forgotOtpCode !== sentOtpValue) {
          setErrorMsg(lang === 'bn' ? 'ভুল ওটিপি কোড!' : 'Incorrect OTP code!');
          return;
        }
        if (!forgotNewPassword) {
          setErrorMsg(lang === 'bn' ? 'নতুন পাসওয়ার্ড দিন!' : 'Enter new password!');
          return;
        }
        
        // Update user password
        const updated = users.map(u => {
          if (u.mobile === forgotMobile) {
            return { ...u, passwordHash: forgotNewPassword, isLocked: false, failedAttempts: 0, status: u.status === 'Blocked' ? 'Active' as const : u.status };
          }
          return u;
        });
        onUpdateUsers(updated);
        setSuccessMsg(lang === 'bn' ? '✅ পাসওয়ার্ড সফলভাবে রিসেট হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।' : '✅ Password successfully reset! Please login now.');
        
        setTimeout(() => {
          setForgotOtpSent(false);
          setActiveTab('login');
          setEmailInput('');
          setMobileInput(forgotMobile);
          setPasswordInput(forgotNewPassword);
          setSuccessMsg('');
        }, 3000);
      }
    }
  };

  // Helper: quick login profiles for demonstration
  const handleDemoQuickLogin = (role: 'seeker' | 'employer' | 'staff' | 'admin' | 'super_admin') => {
    let email = '';
    if (role === 'seeker') email = 'seeker@example.com';
    else if (role === 'employer') email = 'employer@example.com';
    else if (role === 'staff') email = 'staff@probashi.com';
    else if (role === 'admin') email = 'admin@probashi.com';
    else if (role === 'super_admin') email = 'superadmin@probashi.com';

    const user = users.find(u => u.email === email);
    if (user) {
      const client = getSimulatedClientDetails();
      const act: LoginActivity = {
        id: 'act_' + Date.now(),
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        loginTime: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString('bn-BD'),
        ipAddress: client.ipAddress,
        browser: client.browser,
        device: client.device,
        country: client.country,
        status: 'Active Session'
      };
      onLogin(user, act);
      setSuccessMsg(lang === 'bn' ? `🚀 লগইন সফল হয়েছে: ${user.name}` : `🚀 Login Successful: ${user.name}`);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row my-8"
      >
        {/* Left pane: Security Branding */}
        <div className="md:w-5/12 bg-slate-900 text-white p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black tracking-wider uppercase">
              <Shield className="w-3.5 h-3.5" /> SECURE AUTH v2.4
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white leading-tight">
                {lang === 'bn' ? 'প্রবাসী জবস সিকিউর কানেক্ট' : 'Probashi Jobs Secure Connect'}
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                {lang === 'bn' 
                  ? 'আপনার বায়োমেট্রিক, এনআইডি ও পাসপোর্ট ভেরিফাইড তথ্যের সর্বোচ্চ নিরাপত্তা আমরা নিশ্চিত করছি।' 
                  : 'Ensuring state-of-the-art protection for your biographical passport and BMET registered profiles.'
                }
              </p>
            </div>
          </div>

          {/* Quick Demo Assist Block */}
          <div className="relative mt-8 space-y-3 pt-6 border-t border-slate-800">
            <p className="text-[10px] text-emerald-400 font-black tracking-widest uppercase flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> {lang === 'bn' ? 'দ্রুত রোল টেস্ট প্যানেল' : 'Quick Role Access Panel'}
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[9.5px]">
              <button 
                onClick={() => handleDemoQuickLogin('seeker')}
                className="py-1 px-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 rounded text-left transition font-bold"
              >
                👤 Candidate Seeker
              </button>
              <button 
                onClick={() => handleDemoQuickLogin('employer')}
                className="py-1 px-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 rounded text-left transition font-bold"
              >
                🏢 Agency Employer
              </button>
              <button 
                onClick={() => handleDemoQuickLogin('staff')}
                className="py-1 px-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 rounded text-left transition font-bold"
              >
                👨‍💼 Staff Officer
              </button>
              <button 
                onClick={() => handleDemoQuickLogin('super_admin')}
                className="py-1 px-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 rounded text-left transition font-bold"
              >
                👑 Super Admin
              </button>
            </div>
            <p className="text-[9px] text-slate-500 italic">
              * Password is <b>password123</b> for all users.
            </p>
          </div>
        </div>

        {/* Right pane: Auth Form */}
        <div className="md:w-7/12 p-6 flex flex-col justify-between bg-white">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
          >
            <XCircle className="w-6 h-6" />
          </button>

          {/* Tab Selector */}
          {activeTab !== 'forgot' && (
            <div className="flex border-b border-slate-100 text-xs font-black mb-4">
              <button 
                onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 pb-2.5 text-center transition ${activeTab === 'login' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {lang === 'bn' ? 'লগইন করুন' : 'Sign In'}
              </button>
              <button 
                onClick={() => { setActiveTab('register-seeker'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 pb-2.5 text-center transition ${activeTab === 'register-seeker' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {lang === 'bn' ? 'প্রার্থী রেজিস্ট্রেশন' : 'Seeker Register'}
              </button>
              <button 
                onClick={() => { setActiveTab('register-employer'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 pb-2.5 text-center transition ${activeTab === 'register-employer' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {lang === 'bn' ? 'নিয়োগকর্তা' : 'Employer'}
              </button>
            </div>
          )}

          {/* Feedback banners */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-[11px] font-bold flex items-center gap-2 leading-snug"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="mb-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[11px] font-bold flex items-center gap-2 leading-snug"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* VIEW: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Login Method Sub tabs */}
              <div className="flex bg-slate-50 p-1 rounded-xl text-[10px] font-black border border-slate-150 gap-1">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('email'); setErrorMsg(''); }}
                  className={`flex-1 py-1.5 rounded-lg text-center transition ${loginMethod === 'email' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
                >
                  ✉️ Email
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('mobile'); setErrorMsg(''); }}
                  className={`flex-1 py-1.5 rounded-lg text-center transition ${loginMethod === 'mobile' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
                >
                  📱 Mobile
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('otp'); setErrorMsg(''); }}
                  className={`flex-1 py-1.5 rounded-lg text-center transition ${loginMethod === 'otp' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
                >
                  💬 SMS OTP
                </button>
              </div>

              {loginMethod === 'email' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 block mb-1">EMAIL ADDRESS</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        value={emailInput} 
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="example@probashi.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-extrabold text-slate-500">PASSWORD</label>
                      <button 
                        type="button"
                        onClick={() => setActiveTab('forgot')}
                        className="text-[10px] font-black text-emerald-600 hover:underline"
                      >
                        {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={passwordInput} 
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {loginMethod === 'mobile' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 block mb-1">MOBILE NUMBER</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={mobileInput} 
                        onChange={(e) => setMobileInput(e.target.value)}
                        placeholder="017XXXXXXXX"
                        maxLength={11}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-extrabold text-slate-500">PASSWORD</label>
                      <button 
                        type="button"
                        onClick={() => setActiveTab('forgot')}
                        className="text-[10px] font-black text-emerald-600 hover:underline"
                      >
                        {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={passwordInput} 
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {loginMethod === 'otp' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 block mb-1">MOBILE NUMBER</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          value={mobileInput} 
                          onChange={(e) => setMobileInput(e.target.value)}
                          placeholder="017XXXXXXXX"
                          maxLength={11}
                          disabled={otpSent}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition disabled:opacity-75"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSendOtpLogin(mobileInput)}
                        disabled={otpTimer > 0}
                        className="px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black rounded-xl shadow-xs transition disabled:bg-slate-200 disabled:text-slate-400 shrink-0"
                      >
                        {otpTimer > 0 ? `${otpTimer}s` : (otpSent ? 'Resend' : 'Send OTP')}
                      </button>
                    </div>
                  </div>

                  {otpSent && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1.5"
                    >
                      <label className="text-[10px] font-extrabold text-emerald-600 block">ENTER 4-DIGIT CODE</label>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-3 w-4 h-4 text-emerald-500" />
                        <input 
                          type="text" 
                          value={otpCode} 
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Demo code was shown above"
                          maxLength={4}
                          className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-black text-slate-800 tracking-widest focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                        />
                      </div>
                      {otpError && <p className="text-[10px] text-red-600 font-bold">{otpError}</p>}
                    </motion.div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{lang === 'bn' ? 'লগইন করুন' : 'Secure Login'}</span>
              </button>

              <div className="text-center pt-3 border-t border-slate-50 mt-2">
                <span className="text-[10.5px] text-slate-400 font-light">
                  {lang === 'bn' ? 'নতুন প্রার্থীর অ্যাকাউন্ট খুলুন?' : 'Are you a candidate?'}
                </span>{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('register-seeker'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-[10.5px] font-extrabold text-emerald-600 hover:underline"
                >
                  {lang === 'bn' ? 'ফ্রি সাইন আপ' : 'Register Free'}
                </button>
              </div>
            </form>
          )}

          {/* VIEW: JOB SEEKER REGISTER */}
          {activeTab === 'register-seeker' && (
            <form onSubmit={handleRegisterSeekerSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 block mb-1">FULL NAME</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={seekerName} 
                      onChange={(e) => setSeekerName(e.target.value)}
                      placeholder="Md. Ariful Islam"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 block mb-1">DESIRED COUNTRY</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <select 
                      value={seekerCountry} 
                      onChange={(e) => setSeekerCountry(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition appearance-none"
                    >
                      <option value="Italy 🇮🇹">Italy 🇮🇹</option>
                      <option value="Saudi Arabia 🇸🇦">Saudi Arabia 🇸🇦</option>
                      <option value="Poland 🇵🇱">Poland 🇵🇱</option>
                      <option value="Croatia 🇭🇷">Croatia 🇭🇷</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 block mb-1">MOBILE NUMBER</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={seekerMobile} 
                      onChange={(e) => setSeekerMobile(e.target.value)}
                      placeholder="017XXXXXXXX"
                      maxLength={11}
                      disabled={seekerOtpVerified}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                  {!seekerOtpVerified ? (
                    <button
                      type="button"
                      onClick={handleSendSeekerRegOtp}
                      disabled={otpTimer > 0}
                      className="px-3 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black rounded-xl transition"
                    >
                      {otpTimer > 0 ? `${otpTimer}s` : 'Verify Mobile'}
                    </button>
                  ) : (
                    <div className="px-3 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-xl flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified
                    </div>
                  )}
                </div>
              </div>

              {otpSent && !seekerOtpVerified && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5"
                >
                  <label className="text-[10px] font-extrabold text-emerald-600 block">ENTER 4-DIGIT REGISTER OTP</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={otpCode} 
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Demo code in top banner"
                      maxLength={4}
                      className="flex-1 px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs font-black tracking-wider text-center"
                    />
                    <button
                      type="button"
                      onClick={handleVerifySeekerOtp}
                      className="px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl"
                    >
                      Confirm
                    </button>
                  </div>
                  {otpError && <p className="text-[9.5px] text-red-600 font-bold">{otpError}</p>}
                </motion.div>
              )}

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 block mb-1">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={seekerEmail} 
                    onChange={(e) => setSeekerEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 block mb-1">PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      value={seekerPassword} 
                      onChange={(e) => setSeekerPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 block mb-1">CONFIRM PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      value={seekerConfirmPassword} 
                      onChange={(e) => setSeekerConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="seekerAgree" 
                  checked={seekerAgree}
                  onChange={(e) => setSeekerAgree(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="seekerAgree" className="text-[10.5px] text-slate-500 font-light leading-snug">
                  {lang === 'bn' 
                    ? 'আমি সরকারি প্রবাসী নীতি অনুযায়ী শর্তাবলী ও তথ্য সুরক্ষার সাথে একমত।' 
                    : 'I agree to the Government Overseas Policy Terms and Data Protection Regulations.'
                  }
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition"
              >
                {lang === 'bn' ? 'প্রার্থী অ্যাকাউন্ট তৈরি করুন' : 'Create Seeker Account'}
              </button>
            </form>
          )}

          {/* VIEW: EMPLOYER REGISTER */}
          {activeTab === 'register-employer' && (
            <form onSubmit={handleRegisterEmployerSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 block mb-0.5">COMPANY NAME (AGENCY)</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={empCompanyName} 
                      onChange={(e) => setEmpCompanyName(e.target.value)}
                      placeholder="Euro Bangla Manpower"
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 block mb-0.5">OWNER NAME</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={empOwnerName} 
                      onChange={(e) => setEmpOwnerName(e.target.value)}
                      placeholder="Miraz Reza"
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 block mb-0.5">MOBILE NUMBER</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={empMobile} 
                      onChange={(e) => setEmpMobile(e.target.value)}
                      placeholder="017XXXXXXXX"
                      maxLength={11}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 block mb-0.5">REGISTRATION / LICENSE NO</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={empRegNo} 
                      onChange={(e) => setEmpRegNo(e.target.value)}
                      placeholder="RL-1452"
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 block mb-0.5">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={empEmail} 
                    onChange={(e) => setEmpEmail(e.target.value)}
                    placeholder="hr@agency.com"
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 block mb-0.5">COMPANY ACCOUNT PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    value={empPassword} 
                    onChange={(e) => setEmpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Upload license controls */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-extrabold text-slate-500 block mb-0.5">TRADE LICENSE UPLOAD</label>
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsLicenseDragging(true); }}
                    onDragLeave={() => setIsLicenseDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsLicenseDragging(false);
                      if (e.dataTransfer.files.length > 0) {
                        setTradeLicenseName(e.dataTransfer.files[0].name);
                      }
                    }}
                    onClick={() => {
                      const name = 'trade_license_' + Math.floor(100 + Math.random() * 900) + '.pdf';
                      setTradeLicenseName(name);
                    }}
                    className={`p-2.5 rounded-xl border border-dashed text-center cursor-pointer transition ${isLicenseDragging ? 'border-emerald-500 bg-emerald-50/25' : 'border-slate-250 bg-slate-50/50'} hover:border-emerald-400`}
                  >
                    <Upload className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-[9.5px] font-bold text-slate-600 truncate">
                      {tradeLicenseName || 'Drag / Click to mock upload'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[9.5px] font-extrabold text-slate-500 block mb-0.5">RECRUITING DOCUMENTS</label>
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDocsDragging(true); }}
                    onDragLeave={() => setIsDocsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDocsDragging(false);
                      if (e.dataTransfer.files.length > 0) {
                        setCompanyDocsName(e.dataTransfer.files[0].name);
                      }
                    }}
                    onClick={() => {
                      const name = 'recruiting_license_bmet_' + Math.floor(100 + Math.random() * 900) + '.pdf';
                      setCompanyDocsName(name);
                    }}
                    className={`p-2.5 rounded-xl border border-dashed text-center cursor-pointer transition ${isDocsDragging ? 'border-emerald-500 bg-emerald-50/25' : 'border-slate-250 bg-slate-50/50'} hover:border-emerald-400`}
                  >
                    <Upload className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-[9.5px] font-bold text-slate-600 truncate">
                      {companyDocsName || 'Drag / Click to mock upload'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs rounded-xl shadow-md transition"
              >
                {lang === 'bn' ? 'নিয়োগকর্তা হিসেবে আবেদন সাবমিট করুন' : 'Submit Employer Registration'}
              </button>
            </form>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-xs font-extrabold text-slate-800">
                  {lang === 'bn' ? 'পাসওয়ার্ড রিসেট প্যানেল' : 'Forgot Password Assistance'}
                </h4>
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-[10px] font-extrabold text-emerald-600 hover:underline"
                >
                  {lang === 'bn' ? 'লগইনে ফিরে যান' : 'Back to Login'}
                </button>
              </div>

              {/* Forgot password method switcher */}
              <div className="flex bg-slate-50 p-1 rounded-xl text-[10px] font-black border border-slate-150 gap-1">
                <button
                  type="button"
                  onClick={() => { setForgotMethod('email'); setErrorMsg(''); setSuccessMsg(''); setForgotOtpSent(false); }}
                  className={`flex-1 py-1 text-center transition rounded ${forgotMethod === 'email' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
                >
                  ✉️ Email Link
                </button>
                <button
                  type="button"
                  onClick={() => { setForgotMethod('mobile'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-1 text-center transition rounded ${forgotMethod === 'mobile' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
                >
                  📱 Mobile OTP
                </button>
              </div>

              {forgotMethod === 'email' ? (
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 block mb-1">ENTER YOUR REGISTERED EMAIL</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={forgotEmail} 
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="example@probashi.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 block mb-1">MOBILE NUMBER</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={forgotMobile} 
                        onChange={(e) => setForgotMobile(e.target.value)}
                        placeholder="017XXXXXXXX"
                        maxLength={11}
                        disabled={forgotOtpSent}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition disabled:opacity-75"
                      />
                    </div>
                  </div>

                  {forgotOtpSent && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="text-[10px] font-extrabold text-emerald-600 block mb-1">ENTER 4-DIGIT RESET OTP</label>
                        <input 
                          type="text" 
                          value={forgotOtpCode} 
                          onChange={(e) => setForgotOtpCode(e.target.value)}
                          placeholder="Demo OTP code"
                          maxLength={4}
                          className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-black text-center tracking-widest"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 block mb-1">ENTER NEW PASSWORD</label>
                        <input 
                          type="password" 
                          value={forgotNewPassword} 
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition"
              >
                {forgotMethod === 'email' ? 'Send Reset Link' : (forgotOtpSent ? 'Save & Login' : 'Send Verification OTP')}
              </button>
            </form>
          )}

        </div>
      </motion.div>
    </div>
  );
}
