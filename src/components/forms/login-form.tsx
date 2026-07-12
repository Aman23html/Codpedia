"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Server,
} from "lucide-react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";
import { firebaseLogin } from "@/actions/auth/firebase-login";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 25, mass: 1 },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

function getFriendlyFirebaseError(error: any) {
  const code = error?.code || "";

  if (code.includes("auth/invalid-credential")) {
    return "Invalid email or password. Please check your credentials.";
  }

  if (code.includes("auth/user-not-found")) {
    return "No Firebase account found with this email.";
  }

  if (code.includes("auth/wrong-password")) {
    return "Incorrect password. Please try again.";
  }

  if (code.includes("auth/invalid-email")) {
    return "Please enter a valid email address.";
  }

  if (code.includes("auth/too-many-requests")) {
    return "Too many failed attempts. Please try again later.";
  }

  if (code.includes("auth/network-request-failed")) {
    return "Network error. Please check your internet connection.";
  }

  return "Login failed. Please check your email and password.";
}

export default function LoginForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setIsSuccess(false);

    const email = identifier.trim().toLowerCase();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Firebase login requires email address, not username.");
      return;
    }

    if (!password) {
      setMessage("Please enter your password.");
      return;
    }

    startTransition(async () => {
      try {
        const credential = await signInWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );

        const idToken = await credential.user.getIdToken();

        const result = await firebaseLogin(idToken);

        if (!result.success) {
          setMessage(
            result.message ||
              "Firebase login successful, but EMS access failed."
          );
          return;
        }

        setIsSuccess(true);
        setMessage("Authentication verified. Routing to dashboard...");

        setTimeout(() => {
          if (result.role === "OWNER") {
            router.push("/owner");
          } else if (result.role === "INCHARGE") {
            router.push("/incharge");
          } else {
            router.push("/employee");
          }

          router.refresh();
        }, 1000);
      } catch (error: any) {
        console.error("Firebase login client error:", error);
        setMessage(getFriendlyFirebaseError(error));
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--background)] font-sans flex flex-col text-[var(--foreground)] selection:bg-[var(--primary)] selection:text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888812_1px,transparent_1px),linear-gradient(to_bottom,#88888812_1px,transparent_1px)] bg-[size:40px_40px] mask-image-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] rounded-full bg-[var(--primary)] blur-[140px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[50%] rounded-full bg-[var(--secondary)] blur-[160px]"
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 min-h-screen overflow-x-hidden pt-20 lg:pt-32">
        <div className="lg:col-span-7 flex flex-col pt-8 lg:pt-16 pb-16 lg:pr-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >
            <motion.h1
              variants={fadeUp}
              className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]"
            >
              Welcome <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] bg-[length:200%_auto] animate-[gradient_6s_linear_infinite]">
                Back.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-[var(--muted-foreground)] font-medium max-w-lg mb-12 leading-relaxed"
            >
              Execution turns plans into results. Access your{" "}
              <strong className="text-[var(--foreground)]">
                Codepedia EMS
              </strong>{" "}
              dashboard to monitor operations, manage tasks, and drive global
              impact.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-[24px] bg-[var(--card)]/30 border border-[var(--border)] backdrop-blur-xl"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ECC71] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2ECC71]" />
                </span>

                <span className="text-[11px] font-bold text-[var(--foreground)] uppercase tracking-widest">
                  System Status: Operational
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" />
                  Database Online
                </div>

                <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" />
                  Task Engine Running
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />

                <span className="text-[11px] font-bold text-[var(--foreground)] uppercase tracking-widest">
                  Firebase Secured
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                  Email Password Auth
                </div>

                <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                  Role-Based EMS Access
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end items-start lg:items-center pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 20,
              delay: 0.2,
            }}
            className="w-full max-w-[480px] relative group"
          >
            <div className="absolute -inset-[1.5px] rounded-[2.5rem] bg-gradient-to-br from-[var(--primary)]/50 via-transparent to-[var(--secondary)]/50 opacity-50 blur-[2px] group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative rounded-[2.5rem] bg-[var(--card)]/60 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-2xl p-8 lg:p-10 z-10 overflow-hidden min-h-[500px] flex flex-col">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="login-form"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      filter: "blur(10px)",
                      transition: { duration: 0.4 },
                    }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="text-center mb-8">
                      <div className="mx-auto w-16 h-16 mb-4 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20 shadow-inner">
                        <Lock className="w-8 h-8 text-[var(--primary)]" />
                      </div>

                      <h2 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
                        Authenticate Identity
                      </h2>

                      <p className="text-sm text-[var(--muted-foreground)] font-medium mt-2">
                        Login securely with Firebase email and password
                      </p>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-5 flex-1 flex flex-col"
                    >
                      {message && !isSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          className="flex items-center gap-3 p-4 rounded-2xl border text-sm font-semibold shadow-sm bg-red-500/10 border-red-500/30 text-red-500"
                        >
                          <ShieldCheck className="w-5 h-5 shrink-0" />
                          {message}
                        </motion.div>
                      )}

                      <div
                        className={`space-y-5 transition-all duration-300 ${
                          isPending
                            ? "opacity-50 grayscale pointer-events-none"
                            : "opacity-100"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[var(--foreground)]/70 uppercase tracking-widest ml-1">
                            Email Address
                          </label>

                          <div className="relative group/input">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within/input:text-[var(--primary)] transition-colors duration-300" />

                            <input
                              name="email"
                              type="email"
                              value={identifier}
                              onChange={(e) => setIdentifier(e.target.value)}
                              placeholder="Enter your email"
                              required
                              className="w-full rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] pl-11 pr-4 py-4 text-sm outline-none shadow-inner focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-bold text-[var(--foreground)]/70 uppercase tracking-widest">
                              Password
                            </label>

                            <a
                              href="#"
                              className="text-[10px] font-bold text-[var(--primary)] hover:underline"
                            >
                              Forgot Password?
                            </a>
                          </div>

                          <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within/input:text-[var(--primary)] transition-colors duration-300" />

                            <input
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              required
                              className="w-full rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] pl-11 pr-12 py-4 text-sm outline-none shadow-inner focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
                            />

                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] outline-none"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-1">
                          <input
                            type="checkbox"
                            id="remember"
                            className="rounded bg-[var(--background)] border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]/20"
                          />

                          <label
                            htmlFor="remember"
                            className="text-xs text-[var(--muted-foreground)] font-medium cursor-pointer"
                          >
                            Keep me securely logged in
                          </label>
                        </div>
                      </div>

                      <div className="pt-4 mt-auto relative z-20">
                        <motion.button
                          whileHover={
                            !isPending
                              ? {
                                  scale: 1.01,
                                  boxShadow:
                                    "0 10px 40px -10px var(--primary)",
                                }
                              : {}
                          }
                          whileTap={!isPending ? { scale: 0.98 } : {}}
                          type="submit"
                          disabled={isPending}
                          className="w-full relative overflow-hidden rounded-2xl py-4.5 text-sm font-bold transition-all duration-500 flex items-center justify-center gap-3 group/btn bg-[var(--foreground)] dark:bg-[var(--primary)] text-[var(--background)] dark:text-white hover:bg-[var(--primary)]"
                        >
                          <span className="relative z-10 flex items-center gap-2 tracking-[0.1em]">
                            {isPending ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                VERIFYING...
                              </>
                            ) : (
                              <>
                                LOGIN TO DASHBOARD
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                              </>
                            )}
                          </span>

                          {!isPending && (
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                          )}
                        </motion.button>

                        <div className="mt-8 flex items-center gap-4">
                          <div className="h-px bg-[var(--border)] flex-1" />
                          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
                            Access Required?
                          </span>
                          <div className="h-px bg-[var(--border)] flex-1" />
                        </div>

                        <div className="flex justify-center items-center text-xs font-bold pt-6 opacity-70 hover:opacity-100 transition-opacity">
                          <a
                            href="/register"
                            className="flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                          >
                            <Server className="w-4 h-4" />
                            Request Workspace Provisioning
                          </a>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-routing"
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      delay: 0.2,
                    }}
                    className="flex-1 flex flex-col items-center justify-center text-center h-full py-12"
                  >
                    <div className="relative mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          bounce: 0.5,
                          delay: 0.4,
                        }}
                        className="w-24 h-24 rounded-full bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/30 shadow-[0_0_40px_var(--primary)]"
                      >
                        <ShieldCheck className="w-12 h-12 text-[var(--primary)]" />
                      </motion.div>

                      <motion.div
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: 0.6,
                        }}
                        className="absolute inset-0 rounded-full border-2 border-[var(--primary)]"
                      />
                    </div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-3xl font-extrabold tracking-tight mb-3"
                    >
                      Access Granted
                    </motion.h3>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center justify-center gap-2 text-sm text-[var(--primary)] font-bold mb-6 bg-[var(--background)]/50 px-4 py-2 rounded-full border border-[var(--border)]"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {message}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "200px" }}
                      transition={{
                        delay: 0.8,
                        duration: 1.5,
                        ease: "linear",
                      }}
                      className="h-1 bg-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)]"
                    />
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