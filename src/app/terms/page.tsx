"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Scale, FileText, Mail } from "lucide-react";

export default function TermsAndConditions() {
  const lastUpdated = "July 2, 2026";

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: (
        <>
          <p>
            By accessing and using the websites, platforms, and services provided by <strong>Codepedia Solutions</strong> ("we," "us," or "our"), including but not limited to Tutor4Study, Assignment Wallah, and other ecosystem brands, you agree to comply with and be bound by these Terms and Conditions.
          </p>
          <p>
            If you do not agree to these terms, you must immediately cease using our services. We reserve the right to update these terms at any time, and your continued use of the platform signifies your acceptance of the updated terms.
          </p>
        </>
      ),
    },
    {
      id: "services",
      title: "2. Description of Services",
      content: (
        <>
          <p>
            Codepedia Solutions operates a global ecosystem of education and knowledge-service brands. Our services include, but are not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
            <li>Live online tutoring and academic support.</li>
            <li>Research assistance and academic writing guidance.</li>
            <li>Language education and certification preparation.</li>
            <li>Professional career growth and upskilling programs.</li>
          </ul>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of our services at our sole discretion without prior notice.
          </p>
        </>
      ),
    },
    {
      id: "accounts",
      title: "3. User Accounts & Security",
      content: (
        <>
          <p>
            To access certain features of our platform, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process.
          </p>
          <p>
            You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use or security breach.
          </p>
        </>
      ),
    },
    {
      id: "academic-integrity",
      title: "4. Academic Integrity & Acceptable Use",
      content: (
        <>
          <p>
            Codepedia Solutions strictly upholds principles of academic integrity. Our research assistance, tutoring, and assignment support services are designed to facilitate learning, provide structural guidance, and serve as reference material.
          </p>
          <p>
            <strong>Users agree NOT to:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
            <li>Submit our reference materials as their own original work to any academic institution.</li>
            <li>Use our platform to engage in plagiarism, cheating, or any form of academic fraud.</li>
            <li>Upload or distribute malicious code, viruses, or illegal content through our platform.</li>
          </ul>
          <p>
            Violation of these terms will result in immediate account termination without a refund.
          </p>
        </>
      ),
    },
    {
      id: "payments",
      title: "5. Payments & Refunds",
      content: (
        <>
          <p>
            All fees for services are clearly displayed on our respective brand platforms. Payments must be made in full before the commencement of tutoring sessions or the delivery of research materials.
          </p>
          <p>
            Refunds are issued solely at the discretion of Codepedia Solutions management and are subject to our dedicated Refund Policy. Disputes regarding service quality must be raised within 7 days of service delivery.
          </p>
        </>
      ),
    },
    {
      id: "intellectual-property",
      title: "6. Intellectual Property",
      content: (
        <>
          <p>
            All content, logos, graphics, text, software, and educational materials provided on our platform are the exclusive intellectual property of Codepedia Solutions or its licensors. You may not reproduce, distribute, modify, or create derivative works without our explicit written consent.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      title: "7. Limitation of Liability",
      content: (
        <>
          <p>
            To the maximum extent permitted by law, Codepedia Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services. We do not guarantee specific academic grades, test scores, or employment outcomes resulting from the use of our educational services.
          </p>
        </>
      ),
    },
    {
      id: "governing-law",
      title: "8. Governing Law",
      content: (
        <>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in Delaware.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[var(--background)] font-sans transition-colors duration-500 overflow-hidden pt-32 pb-24">
      
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888810_1px,transparent_1px),linear-gradient(to_bottom,#88888810_1px,transparent_1px)] bg-[size:40px_40px] transition-colors duration-500" />
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-[var(--primary)]/5 blur-[150px] mix-blend-normal dark:mix-blend-screen transition-colors duration-500" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--secondary)]/5 blur-[150px] mix-blend-normal dark:mix-blend-screen transition-colors duration-500" />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-12">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-md mb-6 transition-colors duration-500">
            <Scale className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] tracking-tight mb-4 transition-colors duration-500">
            Terms & Conditions
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm md:text-base transition-colors duration-500">
            Last Updated: <span className="font-semibold text-[var(--foreground)]">{lastUpdated}</span>
          </p>
        </motion.div>

        {/* Legal Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-[32px] shadow-xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-8 md:p-12 lg:p-16 transition-colors duration-500"
        >
          
          {/* Quick Summary Box */}
          <div className="bg-[var(--background)] border border-[var(--primary)]/20 rounded-2xl p-6 mb-12 flex gap-4 items-start transition-colors duration-500">
            <Shield className="w-6 h-6 text-[var(--primary)] shrink-0 mt-1" />
            <div>
              <h3 className="text-[var(--foreground)] font-bold mb-2 transition-colors duration-500">Quick Summary</h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed transition-colors duration-500">
                These terms govern your use of the Codepedia Solutions ecosystem. By using our platform, you agree to maintain academic integrity, protect your account credentials, and adhere to our payment and acceptable use policies. Please read the full document carefully.
              </p>
            </div>
          </div>

          {/* Render Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={section.id} className="scroll-mt-32" id={section.id}>
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 tracking-tight transition-colors duration-500">
                  {section.title}
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none text-[var(--muted-foreground)] text-[15px] md:text-base leading-loose transition-colors duration-500">
                  {section.content}
                </div>
                
                {/* Section Divider */}
                {index !== sections.length - 1 && (
                  <div className="w-full h-px bg-[var(--border)] mt-12 transition-colors duration-500" />
                )}
              </div>
            ))}
          </div>

          {/* Contact Section inside Card */}
          <div className="mt-16 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-2xl p-8 text-center transition-colors duration-500">
            <FileText className="w-8 h-8 text-[var(--primary)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-3 transition-colors duration-500">
              Questions About These Terms?
            </h3>
            <p className="text-[var(--muted-foreground)] text-sm mb-6 max-w-md mx-auto transition-colors duration-500">
              If you have any questions, concerns, or require clarification regarding these terms, our legal and support teams are here to help.
            </p>
            <a 
              href="mailto:legal@codepediasolutions.com" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-bold shadow-md hover:opacity-90 transition-all"
            >
              <Mail className="w-4 h-4" />
              Contact Legal Team
            </a>
          </div>

        </motion.div>
      </div>
    </div>
  );
}