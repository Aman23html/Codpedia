"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpenText, Languages, BriefcaseBusiness, MonitorPlay } from 'lucide-react';

const AreasOfImpact: React.FC = () => {
  const impacts = [
    {
      title: "Tutor4Study",
      description: "Live online tutoring and academic support for students in classes 6-12 across all subjects.",
      icon: <GraduationCap className="w-5 h-5 text-white" strokeWidth={2} />,
      bgClass: "bg-[#0066FF]", 
      textClass: "text-[#0066FF]",
      image: "/t4s.png" // Replace with your actual image paths
    },
    {
      title: "Assignment Wallah",
      description: "Assignment help and research assistance for Masters and PhD students across various disciplines.",
      icon: <BookOpenText className="w-5 h-5 text-white" strokeWidth={2} />,
      bgClass: "bg-[#10B981]",
      textClass: "text-[#10B981]",
      image: "/aw.png"
    },
    {
      title: "Language Education",
      description: "Language learning programs including English, IELTS, and other global languages.",
      icon: <Languages className="w-5 h-5 text-white" strokeWidth={2} />,
      bgClass: "bg-[#F59E0B]",
      textClass: "text-[#F59E0B]",
      image: "/Lang.png"
    },
    {
      title: "Infinite Solution",
      description: "Job support, resume building, interview preparation and upskilling programs for working professionals.",
      icon: <BriefcaseBusiness className="w-5 h-5 text-white" strokeWidth={2} />,
      bgClass: "bg-[#8B5CF6]",
      textClass: "text-[#8B5CF6]",
      image: "/Ifs.png"
    },
    {
      title: "Gandharva School Of Music",
      description: "Inspiring musical journeys through expert guidance and personalized learning.",
      icon: <MonitorPlay className="w-5 h-5 text-white" strokeWidth={2} />,
      bgClass: "bg-[#06B6D4]",
      textClass: "text-[#06B6D4]",
      image: "/gsm.png"
    }
  ];

  return (
    <section className="py-24 bg-[var(--background)] px-6 md:px-12 lg:px-24 transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-[var(--border)] transition-colors duration-500"></div>
            <h4 className="text-[var(--primary)] text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-500">
              Areas of Impact
            </h4>
            <div className="w-12 h-[1px] bg-[var(--border)] transition-colors duration-500"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-[44px] font-bold text-[var(--foreground)] mb-6 tracking-tight transition-colors duration-500">
            Comprehensive Solutions. <span className="text-[var(--primary)]">Real Impact.</span>
          </h2>
          
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-base md:text-lg leading-relaxed transition-colors duration-500">
            Our ecosystem of specialized brands creates meaningful impact across education, research, language learning and professional growth.
          </p>
        </div>

        {/* Top Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {impacts.slice(0, 3).map((item, index) => (
            <ImpactCard key={`top-${index}`} item={item} />
          ))}
        </div>

        {/* Bottom Row - 2 Cards Centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
          {impacts.slice(3, 5).map((item, index) => (
            <ImpactCard key={`bottom-${index}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Extracted Card Component - Redesigned for strict separation of image and text
const ImpactCard = ({ item }: { item: any }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group flex flex-col h-[450px] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-md hover:shadow-xl dark:shadow-none transition-all duration-500"
    >
      {/* 1. Top Image Section (Strictly defined height, no overlapping) */}
      <div className="relative h-[250px] w-[400px] overflow-hidden shrink-0 bg-[var(--muted)]">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
        />
        {/* Subtle inner shadow to blend the image border with the card */}
        <div className="absolute inset-0 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_-10px_20px_rgba(0,0,0,0.2)] pointer-events-none" />
      </div>

      {/* 2. Bottom Content Section (Grows to fill remaining space) */}
      <div className="flex flex-col flex-grow p-6 relative">
        
        {/* Floating Icon overlapping the boundary perfectly */}
        <div className={`absolute -top-7 left-6 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg border-[3px] border-[var(--card)] transition-colors duration-500 ${item.bgClass}`}>
          {item.icon}
        </div>

        {/* Spacer to push content down below the floating icon */}
        <div className="mt-8 flex flex-col h-full">
          
          <h3 className="text-xl font-bold text-[var(--card-foreground)] tracking-wide mb-3 transition-colors duration-500">
            {item.title}
          </h3>

          <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-6 line-clamp-3 transition-colors duration-500">
            {item.description}
          </p>

          {/* Action Link pushed to the very bottom */}
          <div className="mt-auto">
            <a 
              href="#" 
              className={`inline-flex items-center text-xs font-bold tracking-[0.1em] uppercase hover:opacity-70 transition-opacity ${item.textClass}`}
            >
              Learn More <span className="ml-1 text-lg leading-none">&rarr;</span>
            </a>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};

export default AreasOfImpact;