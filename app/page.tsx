'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useShapesAnimation } from '../hooks/useShapesAnimation';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { canvasRef, transformToColorful, transformToGrey, continueShapesInBackground, exitShapes } = useShapesAnimation();
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Text transformation animation
    ScrollTrigger.create({
      trigger: "#main-text",
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        transformToColorful();
        gsap.to("#main-text", {
          duration: 1.5,
          innerHTML: "It's<br/>Collective<br/>Intelligence",
          ease: "power2.out"
        });
      },
      onLeaveBack: () => {
        transformToGrey();
        gsap.to("#main-text", {
          duration: 1.5,
          innerHTML: "It's not<br/>Artificial<br/>Intelligence",
          ease: "power2.out"
        });
      }
    });

    // Continue shapes in content section with reduced opacity
    ScrollTrigger.create({
      trigger: ".content-section",
      start: "top center",
      onEnter: () => {
        // Continue shapes moving in background
        continueShapesInBackground();
        gsap.to("#shapes-canvas", {
          duration: 1,
          opacity: 0.2,
          ease: "power2.out"
        });
      },
      onLeaveBack: () => {
        gsap.to("#shapes-canvas", {
          duration: 1,
          opacity: 1,
          ease: "power2.out"
        });
      }
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [transformToColorful, transformToGrey, continueShapesInBackground, exitShapes]);

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Cloudflare Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-orange-500 rounded-sm" />
              <div className="w-6 h-6 bg-orange-400 rounded-sm -ml-3" />
            </div>
            <span className="text-black font-bold text-xl ml-2">CLOUDFLARE</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
            <a href="#" className="hover:text-orange-500 transition-colors">How It AI works</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Protect your content</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Start with Cloudflare</a>
          </div>
        </nav>
      </header>

      {/* Section 1: It's not Artificial Intelligence */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <canvas 
          ref={canvasRef}
          id="shapes-canvas" 
          className="absolute inset-0 w-full h-full"
        />
        <div className="relative z-10 text-center">
          <h1 
            id="main-text"
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
          >
            It&apos;s not<br />
            Artificial<br />
            Intelligence
          </h1>
        </div>
      </section>

      {/* Section 2: Your content fuels AI */}
      <section className="content-section relative min-h-screen flex items-start justify-start px-6 pt-24">
        <div className="max-w-2xl ml-8 lg:ml-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 text-left">
            Your content fuels AI
          </h2>
          <div className="space-y-6 text-base md:text-lg text-gray-300 leading-relaxed text-left">
            <p>
              Imagine all the photos, articles, videos, and code you and 
              millions of others have ever created. Your unique, high-quality 
              work isn&apos;t just viewed by people—it&apos;s being analyzed and 
              absorbed by modern AI systems.
            </p>
            <p className="font-semibold text-white">
              Essentially, your content is the fuel for Generative AI.
            </p>
            <p>
              These systems look at the vast collection of human creativity to 
              learn the fundamental rules of style, language, and structure, 
              allowing the AI to then create its own intelligent content and 
              improve the collective knowledge base.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
