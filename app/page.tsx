'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useShapesAnimation } from '../hooks/useShapesAnimation';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { canvasRef, transformToColorful, transformToGrey, exitShapes } = useShapesAnimation();
  
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

    // Exit shapes when reaching content section
    ScrollTrigger.create({
      trigger: ".content-section",
      start: "top center",
      onEnter: () => {
        exitShapes();
      }
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [transformToColorful, transformToGrey, exitShapes]);

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Cloudflare Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded" />
            <span className="text-white font-bold text-lg">CLOUDFLARE</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-white">
            <a href="#" className="hover:text-orange-500 transition-colors">How it AI works</a>
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
      <section className="content-section relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Your content fuels AI
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed">
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
