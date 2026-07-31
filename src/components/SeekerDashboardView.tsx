import React from 'react';
import { 
  Briefcase, CheckCircle, Clock, ShieldAlert, Star, FileText, Globe, Edit, Camera, MapPin, Phone, Mail, Calendar, Bell, ChevronRight, Check
} from 'lucide-react';
import { Job, Application } from '../mockData';

interface SeekerDashboardViewProps {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  appliedJobIds: string[];
  jobs: Job[];
  applications?: Application[];
  setCurrentPage: (page: any) => void;
  setSeekerDashboardTab: (tab: 'dashboard' | 'profile' | 'italy') => void;
  profilePhotoUrl: string;
  setProfilePhotoUrl: (url: string) => void;
  uploadedPhotoName: string;
  setUploadedPhotoName: (name: string) => void;
  onApplyJob?: (
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
}

export const SeekerDashboardView: React.FC<SeekerDashboardViewProps> = ({
  applicantName,
  applicantEmail,
  applicantPhone,
  appliedJobIds,
  jobs,
  applications = [],
  setCurrentPage,
  setSeekerDashboardTab,
  profilePhotoUrl,
  setProfilePhotoUrl,
  uploadedPhotoName,
  setUploadedPhotoName,
  onApplyJob,
}) => {
  return (
    <div className="space-y-6 animate-fade-in" id="seeker-dashboard-high-fidelity">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id="seeker-welcome-banner">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="relative z-10 space-y-1">
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2" id="seeker-banner-title">
            Hello, Ariful Islam 👋
          </h2>
          <p className="text-xs md:text-sm text-blue-100 font-light max-w-xl" id="seeker-banner-subtitle">
            Welcome back! Explore new opportunities and build your better future.
          </p>
          <button 
            id="seeker-banner-browse-btn"
            onClick={() => setCurrentPage('jobs')}
            className="px-5 py-2.5 bg-white text-blue-600 font-extrabold text-xs rounded-xl hover:bg-blue-50 transition shadow-md w-fit mt-3 flex items-center gap-1.5 cursor-pointer"
          >
            Browse Jobs <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="hidden md:block relative z-10" id="seeker-banner-icon-box">
          <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-xs">
            <Briefcase className="w-12 h-12 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="seeker-stat-cards">
        {/* Card 1: Total Applications */}
        <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-xs flex items-center gap-4" id="seeker-stat-total">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Applications</p>
            <h3 className="text-lg font-black text-slate-800">{Math.max(12, appliedJobIds.length)}</h3>
            <button id="seeker-stat-total-link" onClick={() => setSeekerDashboardTab('profile')} className="text-[10px] text-blue-600 hover:underline font-bold block mt-0.5">
              View all →
            </button>
          </div>
        </div>

        {/* Card 2: Approved */}
        <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-xs flex items-center gap-4" id="seeker-stat-approved">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Approved</p>
            <h3 className="text-lg font-black text-slate-800">5</h3>
            <button id="seeker-stat-approved-link" onClick={() => setSeekerDashboardTab('italy')} className="text-[10px] text-emerald-600 hover:underline font-bold block mt-0.5">
              View all →
            </button>
          </div>
        </div>

        {/* Card 3: In Process */}
        <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-xs flex items-center gap-4" id="seeker-stat-process">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">In Process</p>
            <h3 className="text-lg font-black text-slate-800 font-mono">4</h3>
            <button id="seeker-stat-process-link" onClick={() => setSeekerDashboardTab('italy')} className="text-[10px] text-amber-600 hover:underline font-bold block mt-0.5">
              View all →
            </button>
          </div>
        </div>

        {/* Card 4: Rejected */}
        <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-xs flex items-center gap-4" id="seeker-stat-rejected">
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rejected</p>
            <h3 className="text-lg font-black text-slate-800">3</h3>
            <button id="seeker-stat-rejected-link" onClick={() => setSeekerDashboardTab('profile')} className="text-[10px] text-rose-600 hover:underline font-bold block mt-0.5">
              View all →
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="seeker-dashboard-split">
        
        {/* Left Side: Recommended Jobs & Applications & Stepper */}
        <div className="lg:col-span-2 space-y-6" id="seeker-dashboard-left-panel">
          
          {/* Recommended Jobs */}
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs space-y-4" id="seeker-recommended-jobs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Recommended Jobs
              </h3>
              <button id="seeker-recommended-viewall" onClick={() => setCurrentPage('jobs')} className="text-xs text-blue-600 hover:underline font-bold">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {(() => {
                const activeJobs = (jobs || []).filter(j => j.status === 'Approved').slice(0, 4);

                const getCategoryEmoji = (category: string) => {
                  const cat = (category || '').toLowerCase();
                  if (cat.includes('construct') || cat.includes('labor') || cat.includes('mason')) return '🏗️';
                  if (cat.includes('tech') || cat.includes('engineer') || cat.includes('cnc')) return '⚡';
                  if (cat.includes('drive') || cat.includes('logistic') || cat.includes('truck')) return '🚗';
                  if (cat.includes('hotel') || cat.includes('hospital') || cat.includes('clean') || cat.includes('service')) return '🧹';
                  if (cat.includes('farm') || cat.includes('agri')) return '🌾';
                  return '💼';
                };

                const isJobApplied = (jobId: string) => {
                  return appliedJobIds.includes(jobId) || (applications || []).some(
                    app => app.jobId === jobId && app.candidateEmail.toLowerCase() === applicantEmail.toLowerCase()
                  );
                };

                if (activeJobs.length === 0) {
                  return (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      কোনো রিকমেন্ডেড চাকরি খুঁজে পাওয়া যায়নি।
                    </div>
                  );
                }

                return activeJobs.map((job) => {
                  const isApplied = isJobApplied(job.id);
                  return (
                    <div 
                      key={job.id}
                      className="p-4 border border-slate-100 hover:border-blue-500/30 hover:bg-slate-50/50 rounded-xl transition duration-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3" 
                      id={`rec-job-card-${job.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-lg font-bold text-indigo-600">
                          {getCategoryEmoji(job.category)}
                        </div>
                        <div>
                          <h4 
                            onClick={() => setCurrentPage('jobs')}
                            className="text-xs font-black text-slate-800 hover:text-blue-600 cursor-pointer"
                          >
                            {job.title}
                          </h4>
                          <p className="text-[10.5px] text-slate-500 font-medium">{job.companyName} • {job.country}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] font-bold">
                              {job.type || 'Full Time'}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-100 rounded text-[9px] font-medium">
                              {job.category}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-black">
                              {job.salary}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-50 justify-between">
                        <span className="text-[9.5px] text-slate-400 font-medium">Recently posted</span>
                        {isApplied ? (
                          <button 
                            disabled
                            className="px-3.5 py-1.5 bg-emerald-100 text-emerald-700 font-bold text-[10.5px] rounded-lg border border-emerald-200 cursor-not-allowed flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Applied
                          </button>
                        ) : (
                          <button 
                            id={`rec-job-apply-${job.id}`}
                            onClick={() => {
                              if (onApplyJob) {
                                onApplyJob(
                                  job.id, 
                                  applicantName, 
                                  applicantEmail, 
                                  applicantPhone, 
                                  'CV_Ariful_Islam.pdf', 
                                  `Applying for ${job.title} recommended position.`
                                );
                                alert(`🎉 ${job.title} পদে সফলভাবে আপনার আবেদন জমা নেওয়া হয়েছে!`);
                              } else {
                                alert(`${job.title} পদে সফলভাবে আপনার আবেদন জমা নেওয়া হয়েছে!`);
                              }
                            }}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10.5px] rounded-lg transition"
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* My Applications */}
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs space-y-4" id="seeker-my-applications">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" /> My Applications
              </h3>
              <button id="seeker-applications-viewall" onClick={() => setSeekerDashboardTab('profile')} className="text-xs text-blue-600 hover:underline font-bold">
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {(() => {
                const candidateApps = (applications || []).filter(
                  app => app.candidateEmail.toLowerCase() === applicantEmail.toLowerCase()
                );

                if (candidateApps.length === 0) {
                  return (
                    <div className="text-center py-8 text-slate-400 text-xs font-medium bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      কোনো আবেদনকৃত চাকরি খুঁজে পাওয়া যায়নি। নিচে রিকমেন্ডেড চাকরি থেকে আবেদন করুন।
                    </div>
                  );
                }

                // Show up to 4 most recent applications
                return candidateApps.slice().reverse().slice(0, 4).map((app) => {
                  const statusColors: Record<string, string> = {
                    'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-100',
                    'Pending': 'bg-slate-100 text-slate-600 border-slate-200',
                    'Rejected': 'bg-rose-50 text-rose-700 border-rose-100',
                    'Under Review': 'bg-blue-50 text-blue-700 border-blue-100',
                    'Shortlisted': 'bg-indigo-50 text-indigo-700 border-indigo-100',
                    'Review': 'bg-amber-50 text-amber-700 border-amber-150',
                  };

                  const colorClass = statusColors[app.status] || 'bg-slate-100 text-slate-600 border-slate-200';

                  return (
                    <div 
                      key={app.id} 
                      className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/40 flex items-center justify-between gap-4 animate-fade-in" 
                      id={`my-app-card-${app.id}`}
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black text-slate-800">{app.jobTitle}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{app.companyName}</p>
                        <p className="text-[9.5px] text-slate-400 font-light mt-0.5">
                          Applied on: <strong className="font-medium text-slate-600">{app.appliedAt}</strong>
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 text-[9.5px] font-black tracking-wide uppercase rounded-full border shrink-0 ${colorClass}`}>
                        {app.status}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Visa Process Progress */}
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs space-y-5" id="seeker-visa-progress">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-500" /> Visa Process Progress
              </h3>
              <button id="seeker-visa-viewdetails" onClick={() => setSeekerDashboardTab('italy')} className="text-xs text-blue-600 hover:underline font-bold">
                View Details
              </button>
            </div>

            {/* Stepper progress indicator */}
            <div className="relative pt-2 pb-4">
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -translate-y-1/2 z-0 hidden sm:block"></div>
              
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2">
                {/* Step 1 */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center" id="visa-step-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-md border-4 border-white">
                    ✓
                  </div>
                  <div className="text-left sm:text-center">
                    <p className="text-xs font-black text-slate-800">1. Application</p>
                    <p className="text-[9.5px] text-emerald-600 font-bold uppercase mt-0.5">Completed</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center" id="visa-step-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-md border-4 border-white">
                    ✓
                  </div>
                  <div className="text-left sm:text-center">
                    <p className="text-xs font-black text-slate-800">2. Medical</p>
                    <p className="text-[9.5px] text-emerald-600 font-bold uppercase mt-0.5">Completed</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center" id="visa-step-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md border-4 border-white animate-pulse">
                    3
                  </div>
                  <div className="text-left sm:text-center">
                    <p className="text-xs font-black text-slate-800">3. MOFA</p>
                    <p className="text-[9.5px] text-blue-600 font-extrabold uppercase mt-0.5 animate-pulse">In Progress</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center opacity-60" id="visa-step-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black text-xs border-4 border-white">
                    4
                  </div>
                  <div className="text-left sm:text-center">
                    <p className="text-xs font-black text-slate-800">4. Embassy</p>
                    <p className="text-[9.5px] text-slate-400 font-bold uppercase mt-0.5">Pending</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center opacity-60" id="visa-step-5">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black text-xs border-4 border-white">
                    5
                  </div>
                  <div className="text-left sm:text-center">
                    <p className="text-xs font-black text-slate-800">5. Approved</p>
                    <p className="text-[9.5px] text-slate-400 font-bold uppercase mt-0.5">Pending</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Profile Summary & Progress Circle & Interview & Notices */}
        <div className="space-y-6" id="seeker-dashboard-right-panel">
          
          {/* Profile Summary with Photo Upload */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center relative" id="seeker-profile-summary-card">
            <button 
              id="seeker-profile-edit-trigger"
              onClick={() => setSeekerDashboardTab('profile')}
              className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 transition cursor-pointer"
              title="Edit Profile"
            >
              <Edit className="w-4 h-4" />
            </button>

            <div className="relative group/avatar mb-3.5" id="seeker-profile-avatar-container">
              <img 
                id="seeker-profile-avatar-img"
                src={profilePhotoUrl} 
                alt="Ariful Islam" 
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                referrerPolicy="no-referrer"
              />
              <input 
                type="file" 
                accept="image/*" 
                id="profile-avatar-upload" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        setProfilePhotoUrl(event.target.result as string);
                        setUploadedPhotoName(file.name);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label 
                htmlFor="profile-avatar-upload" 
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition duration-150 border-2 border-white"
                title="ছবি আপলোড করুন"
              >
                <Camera className="w-4 h-4" />
              </label>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800 flex items-center justify-center gap-1.5" id="seeker-profile-full-name">
                Ariful Islam
                <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8.5px] text-white font-bold" title="Verified Candidate">✓</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">Job Seeker</p>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 space-y-2 text-left text-xs font-light text-slate-600 leading-normal" id="seeker-profile-contact-info">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono">{applicantPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono truncate">{applicantEmail}</span>
              </div>
            </div>
          </div>

          {/* Keep Your Profile Updated with Circular Gauge */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4" id="seeker-profile-update-prompt">
            <div className="space-y-2 flex-1">
              <h4 className="text-xs font-black text-slate-800">Keep Your Profile Updated</h4>
              <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                Increase your chances to get hired by top employers.
              </p>
              <button 
                id="seeker-profile-update-now-btn"
                onClick={() => setSeekerDashboardTab('profile')}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] rounded-lg transition"
              >
                Update Now
              </button>
            </div>
            
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center" id="seeker-profile-progress-gauge">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="#e0e7ff" strokeWidth="5" fill="transparent" />
                <circle cx="32" cy="32" r="26" stroke="#2563eb" strokeWidth="5" fill="transparent" strokeDasharray="163.3" strokeDashoffset="40.8" strokeLinecap="round" />
              </svg>
              <span className="absolute text-xs font-black text-blue-700 font-mono">75%</span>
            </div>
          </div>

          {/* Upcoming Interview */}
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs space-y-4" id="seeker-upcoming-interview">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" /> Upcoming Interview
              </h4>
              <button id="seeker-interviews-viewall" onClick={() => setSeekerDashboardTab('profile')} className="text-[10px] text-blue-600 hover:underline font-bold">
                View All
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2.5 text-xs text-slate-600" id="seeker-interview-details-card">
              <div>
                <h5 className="font-extrabold text-slate-850">Construction Worker</h5>
                <p className="text-[10.5px] text-slate-400 font-medium">NPCC Company</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10.5px] leading-tight font-light border-t border-b border-slate-100 py-2">
                <div>
                  <span className="text-slate-400 block font-medium">Date:</span>
                  <strong className="text-slate-800 font-bold">02 Jul 2024</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Time:</span>
                  <strong className="text-slate-800 font-bold">10:00 AM</strong>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10.5px] block font-medium">Location:</span>
                <strong className="text-slate-800 text-[11px] font-bold">Riyadh, Saudi Arabia (Zoom Virtual Call)</strong>
              </div>
              <button 
                id="seeker-interview-link-btn"
                onClick={() => alert('NPCC Company ইন্টারভিউ লিংকে আপনাকে রিডাইরেক্ট করা হচ্ছে...')}
                className="w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 font-bold text-[10.5px] rounded-lg transition text-center block cursor-pointer"
              >
                View Details
              </button>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs space-y-4" id="seeker-important-notice">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-500" /> Important Notice
              </h4>
              <button id="seeker-notices-viewall" onClick={() => setSeekerDashboardTab('profile')} className="text-[10px] text-blue-600 hover:underline font-bold">
                View All
              </button>
            </div>

            <div className="space-y-3" id="seeker-notice-list">
              <div className="flex gap-2.5 items-start">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                <div className="space-y-0.5">
                  <p className="text-[11px] text-slate-700 font-medium">New jobs available in Saudi Arabia</p>
                  <span className="text-[9.5px] text-slate-400 block">2 hours ago</span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                <div className="space-y-0.5">
                  <p className="text-[11px] text-slate-700 font-medium">Interview schedule for NPCC Company</p>
                  <span className="text-[9.5px] text-slate-400 block">5 hours ago</span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                <div className="space-y-0.5">
                  <p className="text-[11px] text-slate-700 font-light">Visa process update</p>
                  <span className="text-[9.5px] text-slate-400 block">1 day ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
