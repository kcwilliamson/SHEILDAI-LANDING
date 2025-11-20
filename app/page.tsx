'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useShapesAnimation } from '../hooks/useShapesAnimation';
import { useAntAnimation } from '../hooks/useAntAnimation';
import { useParallaxBars } from '../hooks/useParallaxBars';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { canvasRef, transformToColorful, transformToGrey, turnGreyWithConnections, continueShapesInBackground, exitShapes } = useShapesAnimation();
  const { canvasRef: antCanvasRef, startSingleAnt, addMoreAnts, addAntsFromOffScreen, resetToSingleAnt } = useAntAnimation();
  const { canvasRef: parallaxCanvasRef } = useParallaxBars();
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Simple one-time animation: 5 seconds grey, then colorful indefinitely
    const createShapesAnimation = () => {
      const masterTimeline = gsap.timeline();
      
      // Phase 1: Start with grey network (0s)
      masterTimeline.add(() => {
        transformToGrey();
      }, 0);
      
      // Phase 2: Set initial grey text (1.5s - when shapes are settled)
      masterTimeline.to("#main-text", {
        duration: 0.3,
        opacity: 0,
        ease: "power2.out"
      }, 1.5)
      .call(() => {
        gsap.set("#main-text", {
          innerHTML: "It's<br/>not Artificial<br/>Intelligence"
        });
      })
      .to("#main-text", {
        duration: 0.3,
        opacity: 1,
        ease: "power2.out"
      });
      
      // Phase 3: Transform to colorful after 5 seconds (5s)
      masterTimeline.to("#main-text", {
        duration: 0.3,
        opacity: 0,
        ease: "power2.out"
      }, 5)
      .add(() => {
        transformToColorful();
        gsap.set("#main-text", {
          innerHTML: "It's<br/>Collective<br/>Intelligence"
        });
      })
      .to("#main-text", {
        duration: 0.3,
        opacity: 1,
        ease: "power2.out"
      });
      // Stay colorful indefinitely - no more phases
    };

    // Start the animation when component mounts
    createShapesAnimation();

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
    
    // Ant animation triggers with staged timing
    ScrollTrigger.create({
      trigger: ".ant-section",
      start: "top center",
      onEnter: () => {
        startSingleAnt();
        // Show first text immediately
        gsap.to(".first-text", {
          duration: 1,
          opacity: 1,
          y: 0,
          ease: "power2.out"
        });
        // Wait 5 seconds, then add more ants and show second text
        gsap.delayedCall(5, () => {
          addAntsFromOffScreen(5);
          gsap.to(".second-text", {
            duration: 1.5,
            opacity: 1,
            y: 0,
            ease: "power2.out"
          });
        });
        // Continue adding ants gradually
        gsap.delayedCall(8, () => addAntsFromOffScreen(8));
        gsap.delayedCall(12, () => addAntsFromOffScreen(10));
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [transformToColorful, transformToGrey, continueShapesInBackground, exitShapes, startSingleAnt, addMoreAnts, addAntsFromOffScreen, resetToSingleAnt]);

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* White Sticky Menu */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Cloudflare Logo - Far Left */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 bg-orange-500 rounded-sm" />
              <div className="w-7 h-7 bg-orange-400 rounded-sm -ml-3" />
            </div>
            <span className="text-black font-bold text-xl ml-2">CLOUDFLARE</span>
          </div>
          
          {/* Navigation Menu - Far Right */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200">
              What is AI?
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200">
              How to protect your content
            </a>
            <a href="#" className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 font-medium transition-colors duration-200">
              Get Started
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-700 hover:text-orange-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Section 1: Transforming Shapes */}
      <section className="relative min-h-screen overflow-hidden">
        <canvas 
          ref={canvasRef}
          id="shapes-canvas" 
          className="absolute inset-0 w-full h-full"
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="grid grid-cols-12 w-full">
            <div className="col-start-4 col-span-6 text-center flex flex-col items-center justify-center">
              <h1 
                id="main-text"
                className="font-bold text-white leading-[0.8] p-6"
                style={{fontSize: '100px'}}
              >
                It&apos;s not<br />
                Artificial<br />
                Intelligence
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Your content fuels AI */}
      <section className="content-section relative min-h-screen pt-24">
        <canvas 
          ref={parallaxCanvasRef}
          className="absolute inset-0 w-full h-full z-0"
        />
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <div className="grid grid-cols-12 w-full">
            <div className="col-start-4 col-span-6 flex flex-col items-center justify-center">
              <h2 className="font-bold text-white mb-12 text-center leading-tight p-6" style={{fontSize: '60px'}}>
                Your content fuels AI
              </h2>
              <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed text-center max-w-[65ch] mx-auto p-6 bg-black/30 backdrop-blur-sm rounded-lg">
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
          </div>
        </div>
      </section>

      {/* Section 3: Think of AI like ants */}
      <section className="ant-section relative min-h-screen" style={{backgroundColor: '#8B5CF6'}}>
        <canvas 
          ref={antCanvasRef}
          className="absolute inset-0 w-full h-full"
        />
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <div className="grid grid-cols-12 w-full">
            <div className="col-start-4 col-span-6 flex flex-col items-center justify-center">
              <div className="first-text opacity-0 translate-y-8 text-center">
                <h2 className="font-bold text-white mb-8 leading-[0.85] p-6" style={{fontSize: '60px'}}>
                  Think of AI like ants
                </h2>
                <p className="text-3xl md:text-4xl lg:text-5xl text-white/90 mb-12 leading-tight p-6">
                  no single ant is a genius
                </p>
              </div>
              
              <div className="second-text opacity-0 translate-y-8 mt-16 text-center">
                <p className="text-2xl md:text-3xl text-white leading-relaxed p-6">
                  but together, through simple rules and constant interaction, they build 
                  complex tunnels, find food, and achieve incredible feats. AI is developing 
                  similar capabilities through multi-agent and swarm architectures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
