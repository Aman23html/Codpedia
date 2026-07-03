"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, FileText, Mail, ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "July 2, 2026";

  const sections = [
    {
      id: "intro",
      title: "1. Introduction",
      content: "At Codepedia Solutions, we value your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platforms or utilize our knowledge services. Please read this policy carefully."
    },
    {
      id: "collection",
      title: "2. Information We Collect",
      content: "We collect information that identifies you personally, such as your name, email address, phone number, and academic/professional background, when you voluntarily register on our platforms. We also collect technical data including IP addresses and browser types to improve our ecosystem's performance."
    },
    {
      id: "usage",
      title: "3. How We Use Your Information",
      content: "Your data is used to provide our core services, including tutoring, research support, and career guidance. We also use your contact information to communicate updates, respond to inquiries, and improve our platform security."
    },
    {
      id: "disclosure",
      title: "4. Disclosure of Information",
      content: "We do not sell your personal data. We may share information with trusted third-party service providers who assist us in operating our platform, conducting business, or servicing you, provided those parties agree to keep this information confidential."
    },
    {
      id: "security",
      title: "5. Data Security",
      content: "We implement industry-standard security measures, including encryption and secure server access, to protect your personal data from unauthorized access, alteration, or disclosure."
    },
    {
      id: "rights",
      title: "6. Your Privacy Rights",
      content: "Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data. You may also opt-out of certain data processing activities by contacting our support team."
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-[var(--background)] font-sans transition-colors duration-500 overflow-hidden pt-32 pb-24">
      
      {/* Background Cinematic Accents */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888810_1px,transparent_1px),linear-gradient(to_bottom,#88888810_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-[-5%] left-[10%] w-[500px] h-[500px] rounded-full bg-[var(--primary)]/5 blur-[150px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[var(--secondary)]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-md mb-6">
            <Lock className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Last Updated: <span className="font-semibold text-[var(--foreground)]">{lastUpdated}</span>
          </p>
        </motion.div>

        {/* Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-[32px] shadow-lg p-8 md:p-12 lg:p-16 transition-colors duration-500"
        >
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {sections.map((section, index) => (
              <div key={section.id} className="mb-10">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-3">
                  <span className="text-[var(--primary)]">{index + 1}.</span> {section.title}
                </h2>
                <p className="text-[var(--muted-foreground)] text-[15px] leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Box */}
          <div className="mt-16 bg-[var(--background)] border border-[var(--border)] rounded-2xl p-8 text-center transition-colors duration-500">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-3">Questions about Privacy?</h3>
            <p className="text-[var(--muted-foreground)] text-sm mb-6 max-w-sm mx-auto">
              Our privacy team is available to assist you with any questions regarding your data and our policies.
            </p>
            <a 
              href="mailto:privacy@codepediasolutions.com" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-bold shadow-md hover:opacity-90 transition-all"
            >
              <Mail className="w-4 h-4" />
              Contact Privacy Officer
            </a>
          </div>

        </motion.div>
      </div>
    </div>
  );
}