"use client";

import { useState, useTransition } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Eye, 
  EyeOff, 
  AtSign,
  Users,
  ClipboardList,
  Star,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  Sparkles,
  Clock
} from "lucide-react";

// 1. Restored the actual server action import
import { registerUser } from "@/actions/auth/register";

type Department = {
  id: string;
  name: string;
  type: string;
};

interface RegisterFormProps {
  departments: Department[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 120, damping: 25, mass: 1 } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

export default function RegisterForm({ departments }: RegisterFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    departmentId: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSuccess(false);

    // Front-end validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Security mismatch: Passwords do not align.");
      return;
    }

    startTransition(async () => {
      try {
        // 2. Re-connected real server action with exact original payload
        const result = await registerUser({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          departmentId: formData.departmentId,
        });

        if (result.success) {
          // Trigger the success UI screen
          setIsSuccess(true);
          
          // Clear form data
          setFormData({
            fullName: "", username: "", email: "", phone: "", departmentId: "", password: "", confirmPassword: "",
          });
        } else {
          // Show the error message returned from the backend
          setErrorMsg(result.message || "Registration failed. Please try again.");
        }
      } catch (error) {
        // Failsafe if the server action throws an error
        setErrorMsg("An unexpected network error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--background)] font-sans flex flex-col text-[var(--foreground)] selection:bg-[var(--primary)] selection:text-white">
      
      {/* ========================================== */}
      {/* SECURE BACKGROUND LAYER                    */}
      {/* ========================================== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888812_1px,transparent_1px),linear-gradient(to_bottom,#88888812_1px,transparent_1px)] bg-[size:40px_40px] mask-image-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-[var(--primary)] blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-[var(--secondary)] blur-[160px]" 
        />
      </div>

      {/* Main Grid Layout */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 min-h-screen overflow-x-hidden pt-24 lg:pt-32">
        
        {/* ========================================== */}
        {/* LEFT COLUMN: BRANDING & METRICS            */}
        {/* ========================================== */}
        <div className="lg:col-span-7 flex flex-col pt-8 lg:pt-16 pb-16 lg:pr-24">
          
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner cursor-default">
              {/* <Sparkles className="w-4 h-4 text-[var(--secondary)]" /> */}
              <span className="text-[var(--foreground)] text-[11px] font-bold tracking-[0.15em] uppercase opacity-90">Next-Gen Workspace</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
              System <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] bg-[length:200%_auto] animate-[gradient_6s_linear_infinite]">
                Initialization.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg text-[var(--muted-foreground)] font-medium max-w-lg mb-14 leading-relaxed">
              Deploy faster, scale globally, and command your digital infrastructure from a single, unified command center.
            </motion.p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {[
              { label: "Active Nodes", value: "20k+", icon: <Users className="w-5 h-5" /> },
              { label: "Throughput", value: "5k/s", icon: <ClipboardList className="w-5 h-5" /> },
              { label: "Uptime", value: "99.9%", icon: <Star className="w-5 h-5" /> },
              { label: "Latency", value: "<12ms", icon: <TrendingUp className="w-5 h-5" /> },
            ].map((stat, i) => (
              <motion.div 
                key={i} variants={fadeUp} whileHover={{ y: -6, scale: 1.02 }}
                className="group flex flex-col p-6 rounded-[24px] bg-[var(--background)]/30 border border-[var(--border)] backdrop-blur-xl shadow-sm transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-[0_0_30px_rgba(0,102,255,0.1)]"
              >
                <div className="mb-4 w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <h4 className="text-2xl font-black">{stat.value}</h4>
                <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mt-1.5">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: REGISTRATION TERMINAL        */}
        {/* ========================================== */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end items-start lg:items-center pb-16 w-full">
          
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.2 }}
            className="w-full max-w-[520px] relative group"
          >
            {/* Animated Gradient Border Layer */}
            <div className="absolute -inset-[1.5px] rounded-[2.5rem] bg-gradient-to-br from-[var(--primary)]/50 via-transparent to-[var(--secondary)]/50 opacity-50 blur-[2px] group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Main Form Card */}
            <div className="relative rounded-[2.5rem] bg-[var(--card)]/60 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
              
              <AnimatePresence mode="wait">
                
                {/* -------------------------------------- */}
                {/* STATE 1: THE REGISTRATION FORM         */}
                {/* -------------------------------------- */}
                {!isSuccess ? (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.4 } }}
                    className="p-8 lg:p-10 flex-1 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-8 border-b border-[var(--border)] pb-6">
                      <div>
                        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
                          Provision Access
                        </h2>
                        <p className="text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-widest mt-2">Step 1 of 3: Identity</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[var(--background)] flex items-center justify-center border border-[var(--border)] shadow-inner">
                        <Lock className="w-5 h-5 text-[var(--primary)]" />
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 relative flex-1 flex flex-col justify-between">
                      
                      {/* Dynamic Error Banner */}
                      {errorMsg && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-4 rounded-2xl border text-sm font-semibold shadow-sm bg-red-500/10 border-red-500/30 text-red-500"
                        >
                          <ShieldCheck className="w-5 h-5 shrink-0" />
                          {errorMsg}
                        </motion.div>
                      )}

                      <div className={`space-y-5 transition-all duration-300 ${isPending ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[var(--foreground)]/70 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group/input">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within/input:text-[var(--primary)] transition-colors duration-300" />
                              <input name="fullName" placeholder="John Doe" required value={formData.fullName} onChange={handleChange} className="w-full rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] pl-11 pr-4 py-3.5 text-sm outline-none shadow-inner focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[var(--foreground)]/70 uppercase tracking-widest ml-1">Username</label>
                            <div className="relative group/input">
                              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within/input:text-[var(--primary)] transition-colors duration-300" />
                              <input name="username" placeholder="johndoe" required value={formData.username} onChange={handleChange} className="w-full rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] pl-11 pr-4 py-3.5 text-sm outline-none shadow-inner focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[var(--foreground)]/70 uppercase tracking-widest ml-1">Workspace Email</label>
                          <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within/input:text-[var(--primary)] transition-colors duration-300" />
                            <input name="email" type="email" placeholder="name@company.com" required value={formData.email} onChange={handleChange} className="w-full rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] pl-11 pr-4 py-3.5 text-sm outline-none shadow-inner focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[var(--foreground)]/70 uppercase tracking-widest ml-1">Phone</label>
                            <div className="relative group/input">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within/input:text-[var(--primary)] transition-colors duration-300" />
                              <input name="phone" placeholder="+1 (555) 000" required value={formData.phone} onChange={handleChange} className="w-full rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] pl-11 pr-4 py-3.5 text-sm outline-none shadow-inner focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[var(--foreground)]/70 uppercase tracking-widest ml-1">Department</label>
                            <div className="relative group/input">
                              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within/input:text-[var(--primary)] transition-colors duration-300 pointer-events-none" />
                              <select name="departmentId" required value={formData.departmentId} onChange={handleChange} className="w-full rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] pl-11 pr-10 py-3.5 text-sm outline-none shadow-inner focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all cursor-pointer appearance-none">
                                <option value="" disabled>Select Dept</option>
                                {departments?.map((dept) => (
                                  <option key={dept.id} value={dept.id} className="bg-[var(--background)] text-[var(--foreground)]">{dept.name}</option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted-foreground)] group-focus-within/input:text-[var(--primary)] transition-colors"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[var(--foreground)]/70 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group/input">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within/input:text-[var(--primary)] transition-colors duration-300" />
                              <input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required value={formData.password} onChange={handleChange} className="w-full rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] pl-11 pr-12 py-3.5 text-sm outline-none shadow-inner focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] outline-none">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[var(--foreground)]/70 uppercase tracking-widest ml-1">Confirm</label>
                            <div className="relative group/input">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within/input:text-[var(--primary)] transition-colors duration-300" />
                              <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" required value={formData.confirmPassword} onChange={handleChange} className="w-full rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] pl-11 pr-12 py-3.5 text-sm outline-none shadow-inner focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
                              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] outline-none">
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 relative z-20">
                        <motion.button
                          whileHover={!isPending ? { scale: 1.01, boxShadow: "0 10px 40px -10px var(--primary)" } : {}}
                          whileTap={!isPending ? { scale: 0.98 } : {}}
                          type="submit"
                          disabled={isPending}
                          className="w-full relative overflow-hidden rounded-2xl py-4.5 text-sm font-bold transition-all duration-500 flex items-center justify-center gap-3 group/btn bg-[var(--foreground)] dark:bg-[var(--primary)] text-[var(--background)] dark:text-white hover:bg-[var(--primary)]"
                        >
                          <span className="relative z-10 flex items-center gap-2 tracking-[0.1em]">
                            {isPending ? (
                              <><Loader2 className="w-5 h-5 animate-spin" /> EXECUTING...</>
                            ) : (
                              <>
                                INITIALIZE ACCOUNT
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                              </>
                            )}
                          </span>
                          {!isPending && (
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                          )}
                        </motion.button>
                        
                        <div className="flex justify-center items-center text-xs font-bold pt-6 opacity-70 hover:opacity-100 transition-opacity">
                          <a href="/login" className="flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                            <User className="w-4 h-4" /> Existing Identity? Authenticate Here
                          </a>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  
                  /* -------------------------------------- */
                  /* STATE 2: THE SUCCESS & APPROVAL SCREEN */
                  /* -------------------------------------- */
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                    className="p-8 lg:p-12 flex-1 flex flex-col items-center justify-center text-center h-full"
                  >
                    <div className="relative mb-8">
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
                        className="w-24 h-24 rounded-full bg-[#2ECC71]/10 flex items-center justify-center border border-[#2ECC71]/30 shadow-[0_0_40px_rgba(46,204,113,0.2)]"
                      >
                        <CheckCircle2 className="w-12 h-12 text-[#2ECC71]" />
                      </motion.div>
                      <motion.div 
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                        className="absolute inset-0 rounded-full border-2 border-[#2ECC71]"
                      />
                    </div>

                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                      className="text-3xl font-extrabold tracking-tight mb-3"
                    >
                      Registration Done
                    </motion.h3>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                      className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)] font-medium mb-10 bg-[var(--background)]/50 px-4 py-2 rounded-full border border-[var(--border)]"
                    >
                      <Clock className="w-4 h-4 text-[var(--secondary)]" />
                      Please wait for administrator approval
                    </motion.div>

                    <motion.p 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                      className="text-[13px] text-[var(--muted-foreground)] max-w-[300px] mb-12 leading-relaxed"
                    >
                      Your workspace identity has been securely configured. You will receive an email notification once your clearance level is approved.
                    </motion.p>

                    <motion.a 
                      href="/"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full relative overflow-hidden rounded-2xl py-4 text-sm font-bold text-black bg-[var(--foreground)] dark:bg-white/10 dark:hover:bg-white/20 border border-transparent dark:border-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      RETURN TO SYSTEM HOME
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}