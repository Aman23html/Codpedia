import React from 'react';
import Image from "next/image";
import CodpLogo from "../../../public/Codlogo.png"; // Adjust path if needed

export default function Logo() {
  return (
    // Main container stacks the image and the tagline with a small gap
    <div className="flex flex-col items-center justify-center w-full">
      
      {/* 1. Main Logo Image */}
      <Image
        src={CodpLogo}
        alt="Codepedia Logo"
        width={180}
        
        priority
        className="object-contain height=auto"
      />

      {/* 2. Tagline & Lines Section (Using Flexbox for perfect alignment) */}
      <div className="flex items-center justify-center w-full gap-2 max-w-[600px] pl-10 -translate-y-1">
        
        {/* Left Line & Dot */}
        <div className="relative flex-1 flex items-center">
          <div className="w-full h-[1px] bg-blue-500 shadow-[0_0_8px_#009dff]" />
          {/* Dot placed precisely at the end of the line */}
          <div className="absolute right-0 w-1.5 h-1.5 rounded-full border-[1.5px] border-blue-500 bg-[var(--background)] translate-x-1/2" />
        </div>

        {/* Tagline Text */}
        <span className="
          text-zinc-500 dark:text-zinc-400 
          uppercase 
          tracking-[0.2em] md:tracking-[0.4em] 
          text-[8px] md:text-[10px] 
          font-medium 
          whitespace-nowrap 
          px-0
        ">
          Solutions
        </span>

        {/* Right Line & Dot */}
        <div className="relative flex-1 flex items-center">
          {/* Dot placed precisely at the start of the line */}
          <div className="absolute left-0 w-1.5 h-1.5 rounded-full border-[1.5px] border-orange-500 bg-[var(--background)] -translate-x-1/2" />
          <div className="w-full h-[1px] bg-orange-500 shadow-[0_0_8px_#ff8c00]" />
        </div>

      </div>
      
    </div>
  );
}