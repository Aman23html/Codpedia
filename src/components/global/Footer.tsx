"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import Logo from "./Logo";

const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 5.012 3.657 9.159 8.438 9.879v-6.988H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33V21.88C18.343 21.159 22 17.012 22 12z" />
  </svg>
);

const TwitterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const LinkedinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const YoutubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const Footer: React.FC = () => {
  const companyLinks = [
    { title: "About Us", href: "/about" },
    { title: "Our Mission", href: "/about#mission" },
    { title: "Our Vision", href: "/about#vision" },
    { title: "Careers", href: "/careers" },
  ];

  const brandsLinks = [
    {
      title: "Codepedia Academy",
      subtitle: "(Tutor4Study)",
      href: "https://www.tutor4study.com/",
    },
    {
      title: "Codepedia Research",
      subtitle: "(Assignments Wallah)",
      href: "https://www.assignmentswallah.com/",
    },
    {
      title: "Codepedia Languages",
      subtitle: "(Language Education)",
      href: "https://www.assignmentswallah.com/branch/languages-homework-help",
    },
    {
      title: "Career Support",
      subtitle: "(Infinite Solutions)",
      href: "https://www.assignmentswallah.com/job-support",
    },
    {
      title: "Codepedia Skills",
      subtitle: "(Gandharva School of Music)",
      href: "https://www.gandharvaschoolofmusic.com/",
    },
  ];

  const quickLinks = [
    { title: "Our Brands", href: "/brands" },
    { title: "Global Reach", href: "/global-reach" },
    { title: "Resources", href: "/resources" },
    { title: "Contact Us", href: "/contact" },
  ];

  const supportLinks = [
    { title: "Help Center", href: "/help" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Use", href: "/terms" },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: "#",
      icon: FacebookIcon,
      className: "bg-[#1877F2]",
    },
    {
      label: "LinkedIn",
      href: "#",
      icon: LinkedinIcon,
      className: "bg-[#0A66C2]",
    },
    {
      label: "Twitter",
      href: "#",
      icon: TwitterIcon,
      className: "bg-[#1DA1F2]",
    },
    {
      label: "Instagram",
      href: "#",
      icon: InstagramIcon,
      className:
        "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]",
    },
    {
      label: "YouTube",
      href: "#",
      icon: YoutubeIcon,
      className: "bg-[#FF0000]",
    },
  ];

  return (
    <footer className="relative bg-[var(--background)] pt-20 pb-10 overflow-hidden font-sans border-t border-[var(--border)] transition-colors duration-500">
      <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-14">
          <div className="lg:col-span-2 pr-4">
            <Link
              href="/"
              aria-label="Codepedia Solutions Home"
              className="inline-block -translate-x-6"
            >
              <Logo />
            </Link>

            <h3 className="text-xl font-bold text-[var(--foreground)] mb-1 transition-colors duration-500">
              Codepedia Solutions
            </h3>

            <p className="text-[var(--primary)] text-sm font-medium mb-6 transition-colors duration-500">
              Registered Education & Knowledge
              <br />
              Services Company
            </p>

            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-8 pr-4 transition-colors duration-500">
              The parent company behind specialized education and
              knowledge-service brands, empowering learners, researchers and
              professionals worldwide.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-full ${social.className} flex items-center justify-center hover:opacity-80 transition-opacity`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-[var(--foreground)] text-sm font-bold tracking-wider mb-6 uppercase transition-colors duration-500">
              Company
            </h4>

            <ul className="space-y-4">
              {companyLinks.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-[var(--muted-foreground)] text-sm hover:text-[var(--primary)] transition-colors duration-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-[var(--foreground)] text-sm font-bold tracking-wider mb-6 uppercase transition-colors duration-500">
              Our Brands
            </h4>

            <ul className="space-y-4">
              {brandsLinks.map((brand) => (
                <li key={brand.title}>
                  <a
                    href={brand.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col"
                  >
                    <span className="text-[var(--foreground)]/80 text-sm group-hover:text-[var(--primary)] transition-colors duration-300">
                      {brand.title}
                    </span>
                    <span className="text-[var(--muted-foreground)] text-xs group-hover:text-[var(--foreground)]/80 transition-colors duration-300">
                      {brand.subtitle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-[var(--foreground)] text-sm font-bold tracking-wider mb-6 uppercase transition-colors duration-500">
              Quick Links
            </h4>

            <ul className="space-y-4">
              {quickLinks.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-[var(--muted-foreground)] text-sm hover:text-[var(--primary)] transition-colors duration-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-[var(--foreground)] text-sm font-bold tracking-wider mb-6 uppercase transition-colors duration-500">
              Support
            </h4>

            <ul className="space-y-4">
              {supportLinks.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-[var(--muted-foreground)] text-sm hover:text-[var(--primary)] transition-colors duration-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative w-full h-[1px] bg-[var(--border)] mb-12 transition-colors duration-500">
          <div className="absolute left-[15%] top-0 h-[1px] w-64 bg-[var(--primary)] shadow-[0_0_20px_3px_rgba(0,102,255,0.4)] dark:shadow-[0_0_20px_3px_rgba(0,102,255,0.8)] transition-all duration-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 relative z-10">
          <div className="flex gap-5">
            <div className="w-[52px] h-[52px] shrink-0 rounded-full border border-[var(--border)] bg-[var(--card)] flex items-center justify-center transition-colors duration-500">
              <ShieldCheck
                className="w-6 h-6 text-[var(--secondary)] transition-colors duration-500"
                strokeWidth={1.5}
              />
            </div>

            <div>
              <h5 className="text-[var(--foreground)] font-bold text-[15px] mb-2 leading-snug transition-colors duration-500">
                Government Registered
                <br />
                Business
              </h5>

              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed pr-4 transition-colors duration-500">
                A legally registered education and knowledge services company,
                operating with professional business standards.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-[52px] h-[52px] shrink-0 rounded-full border border-[var(--border)] bg-[var(--card)] flex items-center justify-center transition-colors duration-500">
              <Mail
                className="w-6 h-6 text-[var(--primary)] transition-colors duration-500"
                strokeWidth={1.5}
              />
            </div>

            <div>
              <h5 className="text-[var(--foreground)] font-bold text-[15px] mb-3 transition-colors duration-500">
                Get In Touch
              </h5>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-[var(--muted-foreground)] transition-colors duration-500">
                  <Mail className="w-4 h-4 text-[var(--primary)] opacity-70 mt-0.5 shrink-0 transition-colors duration-500" />
                  <a
                    href="mailto:info@codepediasolutions.com"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    info@codepediasolutions.com
                  </a>
                </li>

                <li className="flex items-start gap-3 text-sm text-[var(--muted-foreground)] transition-colors duration-500">
                  <Phone className="w-4 h-4 text-[var(--primary)] opacity-70 mt-0.5 shrink-0 transition-colors duration-500" />
                  <a
                    href="tel:+13022002144"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    +91 62876 72229
                  </a>
                </li>

                <li className="flex items-start gap-3 text-sm text-[var(--muted-foreground)] transition-colors duration-500">
                  <MapPin className="w-4 h-4 text-[var(--primary)] opacity-70 mt-0.5 shrink-0 transition-colors duration-500" />
                  <a
                    href="https://maps.google.com/?q=8+The+Green,+Suite+A,+Dover,+DE+19901,+USA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="leading-snug hover:text-[var(--primary)] transition-colors"
                  >
                    Vikash Nagar,
                    <br />
                    DHANBAD, 826007
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-[52px] h-[52px] shrink-0 rounded-full border border-[var(--border)] bg-[var(--card)] flex items-center justify-center transition-colors duration-500">
              <Clock
                className="w-6 h-6 text-[var(--primary)] transition-colors duration-500"
                strokeWidth={1.5}
              />
            </div>

            <div>
              <h5 className="text-[var(--foreground)] font-bold text-[15px] mb-3 transition-colors duration-500">
                Office Hours
              </h5>
              <p className="text-[var(--muted-foreground)] text-sm mb-1 transition-colors duration-500">
                Monday – Saturday
              </p>
              <p className="text-[var(--muted-foreground)] text-sm transition-colors duration-500">
                9:00 AM – 9:00 PM IST
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]">
          <p>
            © {new Date().getFullYear()} Codepedia Solutions. All Rights
            Reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="hover:text-[var(--primary)] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[var(--primary)] transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="hover:text-[var(--primary)] transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-[350px] opacity-[0.04] dark:opacity-[0.03] mix-blend-normal dark:mix-blend-screen pointer-events-none bg-cover bg-bottom bg-no-repeat transition-all duration-500"
        style={{ backgroundImage: "url(/api/placeholder/1920/400)" }}
      />
    </footer>
  );
};

export default Footer;