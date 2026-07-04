"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Shield, ChevronRight } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "July 2, 2026";

  const sections = [
    {
      id: "intro",
      title: "Introduction",
      paragraphs: [
        "At Codepedia Solutions, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, disclose, and safeguard your information when you visit our website, contact us, register for our services, or use any of our online education, career development, and knowledge-service platforms.",
        "By using our website or services, you agree to the practices described in this Privacy Policy.",
      ],
    },
    {
      id: "about",
      title: "About Codepedia Solutions",
      paragraphs: [
        "Codepedia Solutions is a government-registered parent company that operates and manages multiple online education, career development, and professional support brands. Our ecosystem may include services such as online tutoring, academic guidance, language learning, interview preparation, resume support, job readiness training, hiring support, career guidance, professional upskilling, and placement-oriented learning programs.",
        "This Privacy Policy applies to Codepedia Solutions and its associated brands, platforms, teams, and service divisions, unless a separate privacy policy is provided for a specific brand or service.",
      ],
    },
    {
      id: "collection",
      title: "Information We Collect",
      paragraphs: [
        "We may collect personal information that you voluntarily provide to us when you contact us, fill out a form, register for a service, apply for an opportunity, make a payment, communicate with our team, or use our platforms.",
        "The information we may collect includes:",
      ],
      list: [
        "Name.",
        "Email address.",
        "Phone number.",
        "Country or location.",
        "Academic level, subject, course, skills, experience, or professional background.",
        "Career goals, job preferences, training requirements, or service interests.",
        "Resume, portfolio, profile details, certificates, work samples, or other career-related documents shared by you.",
        "Payment-related information, such as payment status, transaction reference, or billing details.",
        "Communication records through email, phone, WhatsApp, website forms, or other official channels.",
      ],
      postParagraphs: [
        "We may also collect limited technical information automatically when you visit our website, such as IP address, browser type, device type, operating system, pages visited, date and time of access, and general usage data.",
      ],
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      paragraphs: [
        "We use the information we collect for purposes including, but not limited to:",
      ],
      list: [
        "Providing online tutoring, academic support, language learning, interview preparation, resume support, career guidance, hiring support, job readiness training, professional upskilling, and other education or career-focused services.",
        "Responding to inquiries, service requests, application submissions, and support messages.",
        "Processing registrations, bookings, payments, training enrollments, interview preparation requests, and service confirmations.",
        "Assigning suitable tutors, mentors, trainers, career advisors, hiring coordinators, experts, or service team members.",
        "Reviewing resumes, professional profiles, skills, experience, and service requirements to provide relevant career or hiring-related support.",
        "Communicating updates related to your service, schedule, payment, training session, application status, documents, or support request.",
        "Improving our website, platforms, services, user experience, training quality, hiring support process, and internal operations.",
        "Maintaining security, preventing fraud, and protecting our legal rights.",
        "Complying with applicable laws, regulations, legal obligations, or lawful requests.",
      ],
    },
    {
      id: "sharing",
      title: "Sharing and Disclosure of Information",
      paragraphs: [
        "Codepedia Solutions does not sell, rent, or trade your personal information to third parties.",
        "We may share your information only when necessary and appropriate, including with:",
      ],
      list: [
        "Tutors, mentors, trainers, career advisors, hiring coordinators, employees, or authorized team members involved in providing the requested service.",
        "Associated brands or service divisions within the Codepedia Solutions ecosystem.",
        "Trusted third-party service providers such as payment gateways, hosting providers, communication tools, cloud storage providers, analytics tools, or technical support providers.",
        "Recruitment, placement, or professional support partners, only when required for a service you have requested or consented to.",
        "Legal authorities, government bodies, or regulatory agencies if required by applicable law or legal process.",
        "Professional advisors, such as legal, accounting, or compliance consultants, when necessary for business or legal purposes.",
      ],
      postParagraphs: [
        "All such sharing is limited to what is necessary for service delivery, business operations, hiring support, security, compliance, or legal protection.",
      ],
    },
    {
      id: "security",
      title: "Data Security",
      paragraphs: [
        "We take reasonable technical, administrative, and organizational measures to protect your personal information from unauthorized access, misuse, alteration, loss, disclosure, or destruction.",
        "These measures may include secure server access, restricted internal access, password protection, data backup practices, encryption where applicable, and monitoring of systems for security purposes.",
        "However, no method of internet transmission or electronic storage is completely secure. Therefore, while we make reasonable efforts to protect your data, we cannot guarantee absolute security.",
      ],
    },
    {
      id: "retention",
      title: "Data Retention",
      paragraphs: [
        "We retain your personal information only for as long as necessary to provide services, complete transactions, resolve disputes, maintain records, comply with legal obligations, improve our services, and protect our legitimate business interests.",
        "Service-related records, communication history, training requirements, career support requests, payment records, resumes, professional profiles, or documents may be retained for internal reference, legal compliance, quality control, service improvement, or dispute resolution.",
        "When data is no longer required, we may securely delete, anonymize, or archive it in accordance with our internal policies.",
      ],
    },
    {
      id: "documents",
      title: "User Documents and Career Materials",
      paragraphs: [
        "Users may share academic documents, resumes, portfolios, professional profiles, certificates, project details, work samples, training requirements, or other files with us for service delivery.",
        "Such materials are used only for understanding the user’s requirements and providing the requested education, training, career guidance, or hiring-support service. We do not claim ownership of user-submitted documents.",
        "Users are responsible for ensuring that they have the right to share any documents, files, or information submitted to Codepedia Solutions.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      paragraphs: [
        "Our website may use cookies or similar technologies to improve user experience, understand website performance, remember preferences, analyze traffic, and support security functions.",
        "You may choose to disable cookies through your browser settings. However, disabling cookies may affect certain website features or functionality.",
      ],
    },
    {
      id: "third-party",
      title: "Third-Party Links and Platforms",
      paragraphs: [
        "Our website or services may contain links to third-party websites, tools, payment gateways, communication platforms, video conferencing platforms, recruitment platforms, career tools, or external learning resources.",
        "Codepedia Solutions is not responsible for the privacy practices, security, content, or policies of third-party platforms. Users are advised to review the privacy policies of third-party services before using them.",
      ],
    },
    {
      id: "communication",
      title: "Communication Consent",
      paragraphs: [
        "By contacting Codepedia Solutions, submitting an inquiry, registering for a service, applying for an opportunity, or using our services, you agree that we may contact you through email, phone, WhatsApp, SMS, website forms, or other official communication channels.",
        "These communications may include service updates, payment updates, training updates, schedule confirmations, hiring-related updates, application-related communication, support responses, important notices, or information related to our services.",
        "You may request to stop receiving non-essential promotional communication by contacting us through our official support channels.",
      ],
    },
    {
      id: "children",
      title: "Children’s Privacy",
      paragraphs: [
        "Some of our services may be designed for school students, including students below the age of 18. In such cases, we expect parents, guardians, or authorized representatives to provide consent and supervision where required.",
        "We do not knowingly collect personal information from minors without appropriate consent where such consent is required by applicable law.",
        "Parents or guardians may contact us if they believe that a minor has provided personal information without proper authorization.",
      ],
    },
    {
      id: "rights",
      title: "Your Privacy Rights",
      paragraphs: [
        "Depending on applicable law, you may have the right to:",
      ],
      list: [
        "Request access to the personal information we hold about you.",
        "Request correction of inaccurate or incomplete information.",
        "Request deletion of your personal information, subject to legal, contractual, or business requirements.",
        "Withdraw consent for certain types of data processing.",
        "Object to certain uses of your personal information.",
        "Request that we stop sending promotional communications.",
      ],
      postParagraphs: [
        "To exercise these rights, you may contact us through the official contact details provided on our website.",
      ],
    },
    {
      id: "international",
      title: "International Users",
      paragraphs: [
        "Codepedia Solutions may provide online services to users from different countries. By using our services, users understand that their information may be processed, stored, or accessed in India or through third-party service providers located in other jurisdictions.",
        "We take reasonable steps to ensure that personal information is handled securely and in accordance with this Privacy Policy.",
      ],
    },
    {
      id: "legal",
      title: "Legal Compliance",
      paragraphs: [
        "We may use or disclose your information when required to comply with applicable laws, legal processes, court orders, government requests, regulatory requirements, or to protect the rights, safety, property, and interests of Codepedia Solutions, its users, team members, or the public.",
      ],
    },
    {
      id: "changes",
      title: "Changes to This Privacy Policy",
      paragraphs: [
        "Codepedia Solutions reserves the right to update, modify, or revise this Privacy Policy at any time.",
        "Any changes will be posted on our website with the updated “Last Updated” date. Continued use of our website or services after changes are posted means that you accept the revised Privacy Policy.",
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      paragraphs: [
        "For any questions, concerns, requests, or complaints regarding this Privacy Policy or the handling of your personal information, you may contact Codepedia Solutions through the official contact details provided on our website.",
        "Codepedia Solutions will make reasonable efforts to respond to privacy-related requests in a timely and appropriate manner.",
      ],
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[var(--background)] font-sans text-[var(--foreground)] transition-colors duration-500 overflow-hidden pt-28 pb-24 md:pt-32">
      
      {/* Background Cinematic Accents */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8888880a_1px,transparent_1px),linear-gradient(to_bottom,#8888880a_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-[-5%] left-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-[var(--primary)]/5 blur-[120px] md:blur-[150px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-[var(--primary)]/5 blur-[120px] md:blur-[150px]" />
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
            <Lock className="w-6 h-6 md:w-8 md:h-8 text-[var(--primary)]" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--foreground)] tracking-tight mb-4">
            Privacy Policy
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
          <div className="space-y-12">
            {sections.map((section, index) => (
              <section key={section.id} className="scroll-mt-24">
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
              </section>
            ))}
          </div>

          {/* Contact Box */}
          <div className="mt-16 bg-[var(--background)]/50 border border-[var(--border)]/60 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Questions about Privacy?</h3>
            <p className="text-[var(--muted-foreground)] text-sm mb-6 max-w-sm mx-auto">
              Our privacy team is available to assist you with any questions regarding your data and our policies.
            </p>
            <a 
              href="mailto:privacy@codepediasolutions.com" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-bold shadow-lg shadow-[var(--primary)]/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--primary)]/30 active:scale-95 transition-all"
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