"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, Mail, Shield, ChevronRight, FileText } from "lucide-react";

export default function TermsAndConditions() {
  const lastUpdated = "July 2, 2026";

  const sections = [
    {
      id: "about",
      title: "About Codepedia Solutions",
      paragraphs: [
        "Codepedia Solutions is a government-registered parent company that operates and manages multiple specialized online education, career development, and professional support brands. Our ecosystem may include services related to online tutoring, academic guidance, language education, interview preparation, resume support, job readiness training, hiring support, career guidance, professional upskilling, and placement-oriented learning programs.",
        "Our services may be provided directly through Codepedia Solutions or through our associated brands, platforms, teams, or service divisions.",
      ],
    },
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      paragraphs: [
        "By visiting our website, submitting an inquiry, registering for any service, applying for an opportunity, making a payment, or communicating with our team, you confirm that you have read, understood, and agreed to these Terms & Conditions.",
        "If you do not agree with any part of these terms, you should not use our website or services.",
        "Codepedia Solutions reserves the right to update, modify, or revise these Terms & Conditions at any time. Any changes will be effective once posted on our website. Continued use of our website or services after changes are posted will mean that you accept the updated terms.",
      ],
    },
    {
      id: "services",
      title: "Services We Provide",
      paragraphs: [
        "Codepedia Solutions and its ecosystem brands may provide services including, but not limited to:",
      ],
      list: [
        "Live online tutoring for school students.",
        "Academic support and subject guidance.",
        "Language learning and exam preparation support.",
        "Interview preparation and career mentoring.",
        "Resume building, profile improvement, and portfolio guidance.",
        "Job readiness training and professional upskilling.",
        "Hiring support, placement-oriented guidance, and career development programs.",
        "Other online education, training, and professional learning services.",
      ],
      postParagraphs: [
        "All services are delivered online unless specifically mentioned otherwise. We reserve the right to modify, improve, suspend, or discontinue any service at our discretion.",
      ],
    },
    {
      id: "responsibilities",
      title: "User Responsibilities",
      paragraphs: [
        "Users agree to provide accurate, complete, and updated information while contacting us, registering for services, applying for opportunities, submitting career or academic requirements, or making payments.",
        "Users are responsible for ensuring that the information, documents, resumes, profiles, instructions, or materials shared with us are correct and lawful.",
        "Users must not misuse our website, services, communication channels, payment systems, learning resources, career resources, or hiring-support processes in any way that may harm Codepedia Solutions, its team, other users, partner platforms, or third-party service providers.",
      ],
    },
    {
      id: "ethics",
      title: "Academic Integrity, Career Ethics, and Fair Use",
      paragraphs: [
        "Codepedia Solutions supports ethical learning, professional development, and responsible career growth. Our tutoring, academic guidance, language learning, interview preparation, resume support, hiring support, and professional training services are intended to help users improve their knowledge, skills, confidence, communication, employability, and career readiness.",
        "Users agree not to:",
      ],
      list: [
        "Use our services for plagiarism, cheating, impersonation, academic fraud, professional fraud, or any unlawful activity.",
        "Submit false, misleading, or manipulated academic, professional, resume, portfolio, experience, or identity information.",
        "Misrepresent our support as guaranteed academic performance, guaranteed job placement, guaranteed interview selection, or guaranteed salary improvement.",
        "Use our platform to send spam, abusive messages, harmful files, malicious code, illegal content, or offensive material.",
        "Misuse career support, hiring support, training materials, or professional guidance provided by Codepedia Solutions.",
      ],
      postParagraphs: [
        "Any misuse of our services may result in refusal of service, suspension, cancellation, or termination without refund.",
      ],
    },
    {
      id: "payments",
      title: "Payments and Fees",
      paragraphs: [
        "Fees for services may vary depending on the brand, service type, subject, training duration, academic level, career support requirement, professional level, complexity, timeline, mentor availability, tutor availability, or project requirements.",
        "Users must complete payment as agreed before the commencement of the service, unless otherwise approved by Codepedia Solutions management.",
        "Payments made to Codepedia Solutions or its associated brands are subject to our payment confirmation, service approval, and refund policy.",
      ],
    },
    {
      id: "refunds",
      title: "Refund and Cancellation",
      paragraphs: [
        "Refunds, if applicable, will be handled according to our Refund Policy or as decided by Codepedia Solutions management based on the nature of the service, work completed, training delivered, session completed, timeline, and reason for cancellation.",
        "Users must raise any service-related concern within 7 days of service delivery, session completion, or scheduled service date. Requests raised after this period may not be eligible for review.",
        "Codepedia Solutions reserves the right to deny refunds in cases of completed service delivery, user delay, misuse, violation of terms, change of mind after work has started, missed sessions, incorrect information, incomplete information, or non-cooperation from the user.",
      ],
    },
    {
      id: "guarantee",
      title: "No Guarantee of Results",
      paragraphs: [
        "Codepedia Solutions aims to provide high-quality educational guidance, training, career support, and professional development services. However, we do not guarantee specific academic grades, exam scores, university acceptance, job placement, interview selection, salary improvement, promotion, client project allocation, or any fixed outcome.",
        "Results may vary depending on the user’s effort, background knowledge, skills, communication ability, institution rules, exam performance, market conditions, employer decisions, interview performance, and other external factors beyond our control.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      paragraphs: [
        "All content available on our website and platforms, including logos, brand names, text, graphics, designs, images, videos, training materials, learning materials, documents, software, career resources, and other resources, belongs to Codepedia Solutions or its respective licensors.",
        "Users may not copy, reproduce, resell, distribute, publish, modify, or use our intellectual property for commercial or unauthorized purposes without written permission from Codepedia Solutions.",
        "Materials shared with users are for personal learning, training, and reference purposes only and must not be redistributed, uploaded publicly, or sold to third parties.",
      ],
    },
    {
      id: "third-party",
      title: "Third-Party Tools and Platforms",
      paragraphs: [
        "Our services may involve the use of third-party tools, communication platforms, payment gateways, video conferencing platforms, cloud storage, recruitment platforms, career tools, or external learning tools.",
        "Codepedia Solutions is not responsible for technical errors, downtime, data loss, payment gateway issues, recruitment platform decisions, employer decisions, or service interruptions caused by third-party platforms.",
        "Users are also required to follow the terms and policies of any third-party platform used during service delivery.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy and Data Protection",
      paragraphs: [
        "We may collect and process user information such as name, contact details, academic requirements, career goals, resumes, professional profiles, service preferences, payment details, and communication records for service delivery, support, security, business operations, and legal compliance.",
        "Use of personal information is governed by our Privacy Policy. By using our services, you agree to the collection and use of information as described in our Privacy Policy.",
      ],
    },
    {
      id: "communication",
      title: "Communication",
      paragraphs: [
        "By contacting Codepedia Solutions or using our services, users agree to receive communication through email, phone, WhatsApp, SMS, website forms, or other official communication channels.",
        "Users must ensure that their contact details are correct and active. Codepedia Solutions will not be responsible for missed updates due to incorrect contact information, inactive communication channels, or failure to check messages.",
      ],
    },
    {
      id: "termination",
      title: "Service Refusal and Termination",
      paragraphs: [
        "Codepedia Solutions reserves the right to refuse, suspend, cancel, or terminate services if a user:",
      ],
      list: [
        "Violates these Terms & Conditions.",
        "Engages in abusive, fraudulent, illegal, unethical, or unprofessional behavior.",
        "Misuses our services, materials, career support, hiring support, or communication channels.",
        "Fails to make payment as agreed.",
        "Provides false, misleading, or incomplete academic, personal, professional, or payment information.",
        "Attempts to harm the reputation, systems, team, users, partners, or operations of Codepedia Solutions.",
      ],
      postParagraphs: [
        "In such cases, refunds may not be provided.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      paragraphs: [
        "To the maximum extent permitted by applicable law, Codepedia Solutions shall not be liable for any indirect, incidental, special, consequential, financial, academic, professional, reputational, employment-related, or business-related loss arising from the use of our website or services.",
        "Our total liability, if any, shall be limited to the amount paid by the user for the specific service in question.",
      ],
    },
    {
      id: "governing-law",
      title: "Governing Law and Jurisdiction",
      paragraphs: [
        "These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India.",
        "Any dispute arising from the use of our website, services, payments, or these Terms & Conditions shall be subject to the jurisdiction of the competent courts in India, unless otherwise required by applicable law.",
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      paragraphs: [
        "For any questions, concerns, complaints, or legal notices related to these Terms & Conditions, users may contact Codepedia Solutions through the official contact details provided on our website.",
        "Codepedia Solutions reserves the right to update its contact information from time to time on the official website.",
      ],
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[var(--background)] font-sans text-[var(--foreground)] transition-colors duration-500 overflow-hidden pt-28 pb-24 md:pt-32">
      
      {/* Background Cinematic Accents */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8888880a_1px,transparent_1px),linear-gradient(to_bottom,#8888880a_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-[-5%] left-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-[var(--primary)]/5 blur-[120px] md:blur-[150px]" />
        <div className="absolute top-[40%] right-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-[var(--secondary)]/5 blur-[120px] md:blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm mb-6">
            <Scale className="w-6 h-6 md:w-8 md:h-8 text-[var(--primary)]" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--foreground)] tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--muted)]/50 border border-[var(--border)]/50 text-sm font-medium text-[var(--muted-foreground)]">
            <Shield className="w-4 h-4 text-[var(--primary)]" />
            Last Updated: <span className="font-bold text-[var(--foreground)]">{lastUpdated}</span>
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)]/60 rounded-[24px] md:rounded-[32px] shadow-sm p-6 sm:p-10 md:p-12 lg:p-16"
        >
          
          {/* Quick Summary Box */}
          <div className="bg-[var(--background)]/50 border border-[var(--primary)]/20 rounded-2xl p-6 mb-12 flex gap-4 items-start">
            <Shield className="w-6 h-6 text-[var(--primary)] shrink-0 mt-1" />
            <div>
              <h3 className="text-[var(--foreground)] font-bold mb-2">Quick Summary</h3>
              <p className="text-[var(--muted-foreground)] text-[14px] md:text-[15px] leading-relaxed">
                Welcome to Codepedia Solutions. These terms govern your use of our ecosystem. By using our platform, you agree to maintain academic integrity, adhere to our payment policies, and understand that we support ethical learning and career growth without guaranteed outcomes. Please read the full document carefully.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <section key={section.id} className="scroll-mt-24" id={section.id}>
                <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-4 tracking-tight flex items-center gap-2">
                  <span className="text-[var(--primary)] text-lg">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  {section.title}
                </h2>
                
                <div className="space-y-4 text-[15px] md:text-base text-[var(--muted-foreground)] leading-relaxed">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={`p-${pIndex}`}>{paragraph}</p>
                  ))}

                  {/* Bulleted List (if available) */}
                  {section.list && (
                    <ul className="space-y-3 mt-4 mb-4 pl-2">
                      {section.list.map((item, lIndex) => (
                        <li key={`l-${lIndex}`} className="flex items-start gap-3">
                          <div className="mt-1.5 flex shrink-0 items-center justify-center w-4 h-4 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                            <ChevronRight className="w-3 h-3" />
                          </div>
                          <span className="text-[var(--foreground)] font-medium text-[14px] md:text-[15px]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Post List Paragraphs (if available) */}
                  {section.postParagraphs && section.postParagraphs.map((paragraph, pIndex) => (
                    <p key={`post-p-${pIndex}`} className="mt-4">{paragraph}</p>
                  ))}
                </div>

                {/* Internal Section Divider */}
                {index !== sections.length - 1 && (
                  <div className="w-full h-px bg-[var(--border)]/60 mt-12" />
                )}
              </section>
            ))}
          </div>

          {/* Contact Box */}
          <div className="mt-16 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-2xl p-8 text-center">
            <FileText className="w-8 h-8 text-[var(--primary)] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Questions About These Terms?</h3>
            <p className="text-[var(--muted-foreground)] text-sm mb-6 max-w-sm mx-auto">
              If you have any questions, concerns, or require clarification regarding these terms, our legal and support teams are here to help.
            </p>
            <a 
              href="mailto:legal@codepediasolutions.com" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-bold shadow-lg shadow-[var(--primary)]/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--primary)]/30 active:scale-95 transition-all"
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