'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Microscope, Languages, Briefcase } from 'lucide-react';
import Logo from '../global/Logo';

const EcosystemTree: React.FC = () => {
  const branches = [
    { name: "K-12 Brands", icon: <BookOpen className="w-6 h-6" />, color: "border-blue-500" },
    { name: "Research Brands", icon: <Microscope className="w-6 h-6" />, color: "border-emerald-500" },
    { name: "Languages", icon: <Languages className="w-6 h-6" />, color: "border-purple-500" },
    { name: "Career Brands", icon: <Briefcase className="w-6 h-6" />, color: "border-orange-500" },
  ];

  return (
    <section className="py-24 bg-[#020617] px-6 text-white overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">

        <div className='uppercase p-2 text-[#0088FF]  font-semibold text-2xl '>
          Our Ecosystem
          <div className='bg-amber-600 w-[80%] h-[2px] mx-auto rounded-3xl' />

          
        </div>

        <div className='text-4xl font-bold'>
          <span>Our Vision. </span>
          <span className='text-[#0088ff]'>Multiple Brands. </span>
          <span>Global Impact. </span>
        </div>

        <div className='p-1'>
          <p>Codepedia Solutintion is the parent Company behind the</p>
        </div>
        
        {/* Root Node */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 2 }}
          className="relative z-10 p-4 rounded-2xl bg-gradient-to-b from-blue-900/40 to-blue-950/20 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-md text-center mt-15"
        >
          <Logo />
        </motion.div>

        {/* Connecting Lines */}
        <div className="h-20 w-[1px] bg-gradient-to-b from-blue-500/50 to-transparent" />

        {/* Tree Branches */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full"
        >
          {branches.map((branch, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex flex-col items-center group"
            >
              {/* Connector line for each branch */}
              <div className="w-[1px] h-8 bg-blue-500/30 group-hover:bg-blue-400 transition-colors" />
              
              <div className={`p-6 w-full rounded-2xl bg-[#0a0f1c] border-t-2 ${branch.color} border-slate-800 hover:border-slate-600 transition-all shadow-xl hover:shadow-2xl`}>
                <div className="text-blue-400 mb-4">{branch.icon}</div>
                <h3 className="font-semibold text-sm text-slate-200">{branch.name}</h3>
                <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-wider">Managed Brand</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default EcosystemTree;