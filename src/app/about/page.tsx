"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Compass,
  Globe2,
  GraduationCap,
  Layers,
  Lightbulb,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const staggerContainer: Variants = {
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const ecosystemItems = [
  {
    title: "Education Brands",
    description:
      "Structured learning support through specialized brands focused on students, tutors, and academic excellence.",
    icon: GraduationCap,
  },
  {
    title: "Research & Assignment Support",
    description:
      "Academic guidance, research assistance, project support, and expert-led knowledge services.",
    icon: Lightbulb,
  },
  {
    title: "Career Growth Solutions",
    description:
      "Professional upskilling, job support, resume building, interview preparation, and career-focused services.",
    icon: Compass,
  },
  {
    title: "Global Knowledge Network",
    description:
      "A connected ecosystem designed to serve learners and professionals across multiple countries and domains.",
    icon: Globe2,
  },
];

const values = [
  {
    title: "Trust First",
    description:
      "We build every service with transparency, responsibility, and long-term reliability.",
    icon: ShieldCheck,
  },
  {
    title: "Global Vision",
    description:
      "Our work is designed for international learners, professionals, and knowledge seekers.",
    icon: Globe2,
  },
  {
    title: "Specialized Execution",
    description:
      "Each brand focuses on a specific need instead of forcing every service under one platform.",
    icon: Layers,
  },
];

export default function About() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] py-24 text-[var(--foreground)] transition-colors duration-500 lg:py-32">
      
      {/* Background Ambient Glows & Grid */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888815_1px,transparent_1px),linear-gradient(to_bottom,#88888815_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:72px_72px] transition-colors duration-500" />
        <div className="absolute left-[-12%] top-[8%] h-[520px] w-[520px] rounded-full bg-[var(--primary)]/10 dark:bg-[var(--primary)]/15 blur-[140px] mix-blend-normal dark:mix-blend-screen transition-all duration-500" />
        <div className="absolute right-[-10%] top-[42%] h-[480px] w-[480px] rounded-full bg-[var(--secondary)]/10 dark:bg-[var(--secondary)]/15 blur-[130px] mix-blend-normal dark:mix-blend-screen transition-all duration-500" />
        <div className="absolute bottom-[-12%] left-[30%] h-[420px] w-[420px] rounded-full bg-[var(--primary)]/5 dark:bg-[var(--primary)]/15 blur-[150px] mix-blend-normal dark:mix-blend-screen transition-all duration-500" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1320px] px-6 lg:px-12">
        
        <section className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16 pt-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7"
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)] transition-colors duration-500"
            >
              {/* <Sparkles className="h-3.5 w-3.5" /> */}
              About Codepedia Solutions
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-[var(--foreground)] md:text-6xl lg:text-7xl transition-colors duration-500"
            >
              Building a Global Ecosystem of{" "}
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                Knowledge, Learning & Growth
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-3xl text-base font-medium leading-8 text-[var(--muted-foreground)] md:text-lg transition-colors duration-500"
            >
              Codepedia Solutions is a government-registered parent company that
              powers multiple specialized education and knowledge-service brands.
              We are not limited to one tutoring platform; we operate as the core
              organization behind a wider ecosystem of learning, research,
              language, academic, and career-growth solutions.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <a
                href="#ecosystem"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg dark:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                Explore Ecosystem
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#mission"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-4 text-sm font-black uppercase tracking-widest text-[var(--foreground)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--foreground)]/5"
              >
                Our Purpose
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5"
          >
            <div className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl dark:shadow-none transition-colors duration-500">
              <div className="absolute right-[-90px] top-[-90px] h-64 w-64 rounded-full bg-[var(--primary)]/20 blur-[90px]" />
              <div className="absolute bottom-[-100px] left-[-80px] h-64 w-64 rounded-full bg-[var(--secondary)]/20 blur-[90px]" />

              <div className="relative z-10 rounded-[28px] border border-[var(--border)] bg-[var(--background)] p-7 transition-colors duration-500">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-lg">
                    <Building2 className="h-7 w-7" />
                  </div>

                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Registered Company
                  </span>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)] transition-colors duration-500">
                  Core Company. Multiple Brands. One Knowledge Mission.
                </h2>

                <p className="mt-4 text-sm font-medium leading-7 text-[var(--muted-foreground)] transition-colors duration-500">
                  Our structure allows every service brand to remain focused,
                  professional, and specialized while Codepedia Solutions manages
                  the larger vision, systems, quality, and direction.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <MiniInfo title="Structure" value="Parent Company" />
                  <MiniInfo title="Focus" value="Knowledge Services" />
                  <MiniInfo title="Reach" value="Global" />
                  <MiniInfo title="Approach" value="Brand Ecosystem" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section
          id="mission"
          className="mt-28 grid gap-8 md:grid-cols-2 lg:mt-36"
        >
          <InfoCard
            label="Our Mission"
            title="To illuminate pathways to education and career success."
            description="We create and manage specialized learning and knowledge-service brands that help students, researchers, professionals, and global learners achieve meaningful academic and career growth."
            icon={Target}
            tone="blue"
          />

          <InfoCard
            label="Our Vision"
            title="To build a global ecosystem of learning, research, and growth."
            description="Our vision is to connect individuals at every stage of life with the right learning support, academic guidance, professional upskilling, and global opportunities."
            icon={Lightbulb}
            tone="orange"
          />
        </section>

        <section id="ecosystem" className="mt-28 lg:mt-36">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={staggerContainer}
            className="mb-12 max-w-3xl"
          >
            <motion.div
              variants={fadeUp}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--muted-foreground)] transition-colors duration-500"
            >
              <Network className="h-3.5 w-3.5 text-[var(--primary)]" />
              Our Ecosystem
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl font-black tracking-tight text-[var(--foreground)] md:text-5xl transition-colors duration-500"
            >
              One organization powering multiple specialized solutions.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-base font-medium leading-8 text-[var(--muted-foreground)] transition-colors duration-500"
            >
              Codepedia Solutions works as the foundation behind different
              focused brands. This keeps every service clear, specialized, and
              trusted while maintaining one strong organizational backbone.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {ecosystemItems.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="group rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-none dark:hover:border-[var(--primary)]/40 duration-500"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)] transition group-hover:scale-105 duration-300">
                  <item.icon className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-black text-[var(--foreground)] transition-colors duration-500">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm font-medium leading-7 text-[var(--muted-foreground)] transition-colors duration-500">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Highlight Section seamlessly adapting to Light/Dark Mode */}
        <section className="mt-28 overflow-hidden rounded-[40px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl dark:shadow-none transition-colors duration-500 lg:mt-36 lg:p-14">
          <div className="relative">
            <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 blur-[100px]" />
            <div className="absolute bottom-[-140px] left-[-120px] h-80 w-80 rounded-full bg-[var(--secondary)]/10 dark:bg-[var(--secondary)]/20 blur-[100px]" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)] transition-colors duration-500">
                  <Layers className="h-3.5 w-3.5" />
                  More Than A Single Service
                </div>

                <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)] md:text-5xl transition-colors duration-500">
                  We are the central hub behind a growing knowledge ecosystem.
                </h2>

                <p className="mt-6 text-base font-medium leading-8 text-[var(--muted-foreground)] transition-colors duration-500">
                  Just as a single source of light can illuminate many paths,
                  Codepedia Solutions supports multiple brands that serve
                  different academic, learning, research, and career needs. Our
                  purpose is to organize these services into one reliable,
                  scalable, and professional ecosystem.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="grid gap-4">
                  <StoryPoint
                    icon={Workflow}
                    title="Integrated Operations"
                    text="Strong internal systems, quality control, and process-driven execution."
                  />
                  <StoryPoint
                    icon={Users}
                    title="People-Centered Growth"
                    text="Solutions designed around students, professionals, and global learners."
                  />
                  <StoryPoint
                    icon={Compass}
                    title="Clear Direction"
                    text="Every brand has a focused purpose while moving under one vision."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-28 lg:mt-36">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[var(--primary)] transition-colors duration-500">
              What We Stand For
            </p>

            <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)] md:text-5xl transition-colors duration-500">
              Professional values that guide every brand we build.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-7 shadow-sm transition-colors duration-500"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--primary)] transition-colors duration-500">
                  <value.icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-black text-[var(--foreground)] transition-colors duration-500">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm font-medium leading-7 text-[var(--muted-foreground)] transition-colors duration-500">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Global Reach Call-To-Action */}
        <section className="mt-28 rounded-[36px] border border-[var(--primary)]/20 bg-[var(--primary)] p-8 text-center text-white shadow-xl dark:shadow-[0_0_30px_rgba(0,102,255,0.3)] lg:mt-36 lg:p-12 transition-all duration-500">
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            Spreading Knowledge Across the World
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-white/90">
            Codepedia Solutions continues to grow as a trusted parent company for
            education, research, professional learning, and knowledge-service
            brands.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black uppercase tracking-widest text-[var(--primary)] shadow-lg transition-colors">
            {/* <Sparkles className="h-4 w-4" /> */}
            Codepedia Solutions
          </div>
        </section>
      </div>
    </main>
  );
}

function MiniInfo({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition-colors duration-500">
      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] transition-colors duration-500">
        {title}
      </p>

      <p className="mt-1 text-sm font-black text-[var(--foreground)] transition-colors duration-500">
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  label,
  title,
  description,
  icon: Icon,
  tone,
}: {
  label: string;
  title: string;
  description: string;
  icon: React.ElementType;
  tone: "blue" | "orange";
}) {
  const toneStyles = {
    blue: "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20",
    orange: "bg-[var(--secondary)]/10 text-[var(--secondary)] border-[var(--secondary)]/20",
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      className="rounded-[34px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm dark:shadow-none lg:p-10 transition-colors duration-500"
    >
      <div
        className={`mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border transition-colors duration-500 ${toneStyles[tone]}`}
      >
        <Icon className="h-8 w-8" />
      </div>

      <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[var(--muted-foreground)] transition-colors duration-500">
        {label}
      </p>

      <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)] md:text-3xl transition-colors duration-500">
        {title}
      </h2>

      <p className="mt-5 text-sm font-medium leading-7 text-[var(--muted-foreground)] md:text-base transition-colors duration-500">
        {description}
      </p>
    </motion.div>
  );
}

function StoryPoint({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--background)] p-5 transition-colors duration-500">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] transition-colors duration-500">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h3 className="font-black text-[var(--foreground)] transition-colors duration-500">{title}</h3>

          <p className="mt-1 text-sm font-medium leading-6 text-[var(--muted-foreground)] transition-colors duration-500">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}