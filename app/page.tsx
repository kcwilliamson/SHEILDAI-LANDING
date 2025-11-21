'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useShapesAnimation } from '../hooks/useShapesAnimation';
import { useAntAnimation } from '../hooks/useAntAnimation';
import { useParallaxBars } from '../hooks/useParallaxBars';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isColorfulRef = useRef(false);
  const { canvasRef, transformToColorful, transformToGrey, turnGreyWithConnections, continueShapesInBackground, exitShapes } = useShapesAnimation();
  const { canvasRef: antCanvasRef, startSingleAnt, addMoreAnts, addAntsFromOffScreen, resetToSingleAnt } = useAntAnimation();
  const { canvasRef: parallaxCanvasRef } = useParallaxBars();

  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize with grey shapes and text
    const initializeShapes = () => {
      // Start with grey connected shapes
      transformToGrey();
      
      // Set initial text after shapes are settled
      gsap.delayedCall(1.5, () => {
        gsap.set("#main-text", {
          innerHTML: "It's<br/>not Artificial<br/>Intelligence"
        });
        gsap.to("#main-text", {
          duration: 0.3,
          opacity: 1,
          ease: "power2.out"
        });
      });
    };

    // Time-based animation that switches every 6 seconds
    const createTimedAnimation = () => {
      const switchStates = () => {
        const transformTimeline = gsap.timeline({
          onComplete: () => {
            // Schedule next switch in 6 seconds
            gsap.delayedCall(6, switchStates);
          }
        });
        
        if (!isColorfulRef.current) {
          // Transform to colorful - text and animation perfectly synchronized
          transformTimeline
            .to("#main-text", {
              duration: 0.6,
              opacity: 0,
              ease: "power2.out"
            })
            .add(() => {
              // Text and animation change simultaneously
              transformToColorful();
              gsap.set("#main-text", {
                innerHTML: "It's<br/>Collective<br/>Intelligence"
              });
            })
            .to("#main-text", {
              duration: 0.8,
              opacity: 1,
              ease: "power2.out"
            });
          
          isColorfulRef.current = true;
        } else {
          // Transform back to grey - text and animation perfectly synchronized
          transformTimeline
            .to("#main-text", {
              duration: 0.6,
              opacity: 0,
              ease: "power2.out"
            })
            .add(() => {
              // Text and animation change simultaneously
              transformToGrey();
              gsap.set("#main-text", {
                innerHTML: "It's<br/>not Artificial<br/>Intelligence"
              });
            })
            .to("#main-text", {
              duration: 0.8,
              opacity: 1,
              ease: "power2.out"
            });
          
          isColorfulRef.current = false;
        }
      };
      
      // Start the first switch after 6 seconds
      gsap.delayedCall(6, switchStates);
    };

    // Initialize the page
    initializeShapes();
    createTimedAnimation();
    
    // Set initial state for ant section
    gsap.set(".ant-section", { y: "20%", opacity: 0.8 });

    
    // Ant animation triggers after all bars complete
    ScrollTrigger.create({
      trigger: ".content-section",
      start: "bottom top+=50px",
      onEnter: () => {
        // Animate ant section into view
        gsap.to(".ant-section", {
          duration: 1.5,
          y: "0%",
          opacity: 1,
          ease: "power2.out"
        });
        
        startSingleAnt();
        // Continue adding ants gradually (text is already visible)
        gsap.delayedCall(2, () => addAntsFromOffScreen(5));
        gsap.delayedCall(5, () => addAntsFromOffScreen(8));
        gsap.delayedCall(8, () => addAntsFromOffScreen(10));
      },
      onLeaveBack: () => {
        // Reset ant section position when scrolling back up
        gsap.to(".ant-section", {
          duration: 1,
          y: "20%",
          opacity: 0.8,
          ease: "power2.out"
        });
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
      <section id="hero-section" className="relative overflow-hidden" style={{minHeight: '90vh'}}>
        <canvas 
          ref={canvasRef}
          id="shapes-canvas" 
          className="absolute inset-0 w-full h-full"
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="grid grid-cols-12 w-full">
            <div className="col-start-3 col-span-8 text-center flex flex-col items-center justify-center">
              <h1 
                id="main-text"
                className="font-bold text-white leading-[0.8] p-4 mb-6"
                style={{fontSize: '85px'}}
              >
                It&apos;s not<br />
                Artificial<br />
                Intelligence
              </h1>
              
              {/* Content below main text */}
              <div className="mt-4 max-w-4xl">
                <h2 className="font-bold text-white mb-4 text-center leading-tight" style={{fontSize: '32px'}}>
                  Your content fuels AI
                </h2>
                <div className="space-y-3 text-base text-gray-200 leading-relaxed text-center max-w-[60ch] mx-auto p-5 bg-black/40 backdrop-blur-sm rounded-lg">
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
        </div>
      </section>

      {/* Section 2: Parallax Bars */}
      <section className="content-section relative" style={{ height: '50vh' }}>
        <canvas 
          ref={parallaxCanvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </section>

      {/* Section 3: Think of AI like ants */}
      <section className="ant-section relative" style={{backgroundColor: '#000000', height: '70vh', marginTop: 0}}>
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <div className="bg-purple-600 rounded-3xl p-12 max-w-5xl mx-auto shadow-2xl" style={{backgroundColor: '#8B5CF6'}}>
            <canvas 
              ref={antCanvasRef}
              className="absolute inset-0 w-full h-full rounded-3xl"
            />
            <div className="relative z-20 text-center">
              <h2 className="font-bold text-white mb-8 leading-[0.85]" style={{fontSize: '48px'}}>
                Think of AI like ants
              </h2>
              <p className="text-white text-lg leading-relaxed max-w-3xl mx-auto">
                No single ant is a genius, but together they create complex systems, 
                build intricate colonies, and solve problems that would be impossible 
                for any individual ant to tackle alone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
