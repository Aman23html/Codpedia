"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Compass,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Laptop,
  MapPin,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { div } from "framer-motion/client";
import HeroSection from "@/components/careers/hero";
import EcosystemSection from "@/components/careers/Ecosystem";
import HiringProcess from "@/components/careers/Hiring";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const jobs = [
  {
    title: "Senior Academic Researcher",
    dept: "Research Brands",
    type: "Remote",
    loc: "Global",
    tag: "Research",
  },
  {
    title: "IELTS Instructor",
    dept: "Language Brands",
    type: "Full-time",
    loc: "India / Remote",
    tag: "Teaching",
  },
  {
    title: "K-12 Subject Matter Expert",
    dept: "K-12 Brands",
    type: "Contract",
    loc: "Remote",
    tag: "Academics",
  },
  {
    title: "Career Growth Counselor",
    dept: "Career Brands",
    type: "Full-time",
    loc: "Hybrid",
    tag: "Counseling",
  },
];

const perks = [
  {
    icon: Globe2,
    title: "Global Impact",
    desc: "Work with learners, professionals, and academic teams across international markets.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Grow through structured roles, mentorship, responsibility, and performance-driven opportunities.",
  },
  {
    icon: Laptop,
    title: "Flexible Working",
    desc: "Remote-first opportunities across selected brands with practical collaboration systems.",
  },
];

const hiringSteps = [
  {
    title: "Apply",
    desc: "Submit your profile for the role that matches your expertise.",
    icon: Search,
  },
  {
    title: "Screening",
    desc: "Our team reviews your background, skills, and role alignment.",
    icon: ShieldCheck,
  },
  {
    title: "Interaction",
    desc: "Short discussion or assessment depending on the department.",
    icon: Users,
  },
  {
    title: "Onboarding",
    desc: "Selected candidates are guided into the right brand or internal team.",
    icon: Rocket,
  },
];

export default function Careers() {
  return (
    <div>
      <HeroSection />
      <EcosystemSection />
      <HiringProcess />
    </div>
  );
}