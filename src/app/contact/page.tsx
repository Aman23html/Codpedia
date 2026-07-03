"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Check, Loader2, Globe } from "lucide-react";

const countryCodes = [
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "IN" },
  { code: "+61", country: "AU" },
  { code: "+971", country: "AE" },
];

export default function Contact() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    countryCode: "+1",
    phone: "", 
    subject: "", 
    message: "" 
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Human Verification States
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    if (isVerified) return;
    setIsVerifying(true);
    // Simulate network delay for verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) return; // Prevent submission if not verified

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", countryCode: "+1", phone: "", subject: "", message: "" });
      setIsVerified(false); // Reset verification after sending
      
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <main className="relative min-h-screen bg-[var(--background)] overflow-hidden transition-colors duration-500 pt-24 pb-20 font-sans">
      
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888810_1px,transparent_1px),linear-gradient(to_bottom,#88888810_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[var(--primary)]/10 dark:bg-[var(--primary)]/15 rounded-full blur-[150px] mix-blend-normal dark:mix-blend-screen transition-all duration-500" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[var(--secondary)]/10 dark:bg-[var(--secondary)]/15 rounded-full blur-[150px] mix-blend-normal dark:mix-blend-screen transition-all duration-500" />
      </div>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-16 items-center">
        
        {/* ========================================== */}
        {/* LEFT SIDE: Contact Information             */}
        {/* ========================================== */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-5/12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--secondary)]/10 text-[var(--secondary)] text-xs font-bold tracking-widest uppercase mb-6 border border-[var(--secondary)]/20">
            <MessageSquare className="w-4 h-4" /> Get in Touch
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black text-[var(--foreground)] leading-[1.1] mb-6 tracking-tight transition-colors duration-500">
            Let's Start a <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
              Conversation.
            </span>
          </h1>
          
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed mb-12 transition-colors duration-500">
            Whether you want to partner with us, explore our brands, or access support, our global team is ready to connect.
          </p>

          <div className="space-y-6">
            {[
              { icon: Mail, title: "Email Us", detail: "info@codepediasolutions.com", link: "mailto:info@codepediasolutions.com" },
              { icon: Phone, title: "Call Us", detail: "+91", link: "tel:+13022002144" },
              { icon: MapPin, title: "Global HQ", detail: "8 The Green, Suite A, Dover, DE 19901, USA", link: "#" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                className="flex items-start gap-5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-sm group-hover:border-[var(--primary)]/50 group-hover:bg-[var(--primary)]/5 transition-all duration-300">
                  <item.icon className="w-6 h-6 text-[var(--primary)] transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="pt-1">
                  <h4 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5 transition-colors duration-500">{item.title}</h4>
                  <a href={item.link} className="text-[17px] font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300 leading-snug">
                    {item.detail}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ========================================== */}
        {/* RIGHT SIDE: Interactive Contact Form       */}
        {/* ========================================== */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-7/12"
        >
          <div className="p-8 md:p-10 rounded-[32px] bg-[var(--card)] border border-[var(--border)] shadow-xl dark:shadow-none transition-colors duration-500">
            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-8 transition-colors duration-500">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)]/80 mb-2 ml-1 transition-colors">Your Name</label>
                  <input 
                    required type="text" placeholder="John Doe"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--muted-foreground)]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)]/80 mb-2 ml-1 transition-colors">Email Address</label>
                  <input 
                    required type="email" placeholder="john@example.com"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--muted-foreground)]/50"
                  />
                </div>
              </div>

              {/* International Phone Field */}
              <div>
                <label className="block text-xs font-bold text-[var(--foreground)]/80 mb-2 ml-1 transition-colors">Phone Number (Optional)</label>
                <div className="flex gap-3">
                  <div className="relative shrink-0 w-[110px]">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                    <select 
                      value={formData.countryCode} 
                      onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pl-9 pr-2 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all appearance-none cursor-pointer"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                      ))}
                    </select>
                  </div>
                  <input 
                    type="tel" placeholder="Phone number"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--muted-foreground)]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)]/80 mb-2 ml-1 transition-colors">Subject</label>
                <input 
                  required type="text" placeholder="How can we help you?"
                  value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--muted-foreground)]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)]/80 mb-2 ml-1 transition-colors">Message</label>
                <textarea 
                  required rows={4} placeholder="Type your message here..."
                  value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--muted-foreground)]/50 resize-none"
                />
              </div>

              {/* Smart Human Verification Widget */}
              <div 
                onClick={handleVerify}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 ${isVerified ? 'border-[#2ECC71]/30 bg-[#2ECC71]/5' : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${isVerified ? 'bg-[#2ECC71] border-[#2ECC71]' : 'border-[var(--muted-foreground)]/30 bg-[var(--card)]'}`}>
                    {isVerifying && <Loader2 className="w-4 h-4 text-[var(--primary)] animate-spin" />}
                    {isVerified && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                  </div>
                  <span className={`text-sm font-semibold transition-colors ${isVerified ? 'text-[#2ECC71]' : 'text-[var(--foreground)]'}`}>
                    {isVerified ? "Verification Complete" : "Verify you are human"}
                  </span>
                </div>
                <ShieldCheck className={`w-6 h-6 transition-colors ${isVerified ? 'text-[#2ECC71]' : 'text-[var(--muted-foreground)]/40'}`} />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting || !isVerified}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 overflow-hidden relative ${
                  isSuccess ? 'bg-[#2ECC71] shadow-[#2ECC71]/20' : 
                  !isVerified ? 'bg-[var(--muted-foreground)]/40 cursor-not-allowed shadow-none' : 
                  'bg-[var(--primary)] shadow-[var(--primary)]/20 hover:opacity-90 hover:-translate-y-0.5'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                  ) : isSuccess ? (
                    <motion.div key="success" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2">
                      MESSAGE SENT <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      SEND MESSAGE <Send className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

            </form>
          </div>
        </motion.div>

      </div>
    </main>
  );
}