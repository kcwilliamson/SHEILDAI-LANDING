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

    // Time-based animation that switches every 7 minutes
    const createTimedAnimation = () => {
      const switchStates = () => {
        const transformTimeline = gsap.timeline({
          onComplete: () => {
            // Schedule next switch in 7 minutes (420 seconds)
            gsap.delayedCall(420, switchStates);
          }
        });
        
        if (!isColorfulRef.current) {
          // Transform to colorful - text and animation perfectly synchronized
          transformTimeline
            .to("#main-text", {
              duration: 0.8,
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
              duration: 1,
              opacity: 1,
              ease: "power2.out"
            });
          
          isColorfulRef.current = true;
        } else {
          // Transform back to grey - text and animation perfectly synchronized
          transformTimeline
            .to("#main-text", {
              duration: 0.8,
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
              duration: 1,
              opacity: 1,
              ease: "power2.out"
            });
          
          isColorfulRef.current = false;
        }
      };
      
      // Start the first switch after 7 minutes (420 seconds)
      gsap.delayedCall(420, switchStates);
    };

    // Initialize the page
    initializeShapes();
    createTimedAnimation();

    // Float colorful shapes into content section
    ScrollTrigger.create({
      trigger: ".content-section",
      start: "top center",
      onEnter: () => {
        // Create floating colorful shapes in the second section
        const floatingCanvas = document.getElementById('floating-shapes-canvas') as HTMLCanvasElement;
        if (floatingCanvas && isColorfulRef.current) {
          const ctx = floatingCanvas.getContext('2d');
          if (ctx) {
            // Set canvas size
            floatingCanvas.width = window.innerWidth;
            floatingCanvas.height = window.innerHeight;
            
            // Animate colorful shapes floating down from the first section
            const floatingShapes = Array.from({length: 8}, (_, i) => ({
              x: Math.random() * floatingCanvas.width,
              y: -50 - Math.random() * 100, // Start above the canvas
              vx: (Math.random() - 0.5) * 2,
              vy: 1 + Math.random() * 2, // Float downward
              size: 8 + Math.random() * 12,
              color: ['#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3'][Math.floor(Math.random() * 5)]
            }));
            
            const animateFloatingShapes = () => {
              ctx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);
              
              floatingShapes.forEach(shape => {
                shape.x += shape.vx;
                shape.y += shape.vy;
                
                // Wrap around horizontally
                if (shape.x < 0) shape.x = floatingCanvas.width;
                if (shape.x > floatingCanvas.width) shape.x = 0;
                
                // Reset when reaching bottom
                if (shape.y > floatingCanvas.height + 50) {
                  shape.y = -50;
                  shape.x = Math.random() * floatingCanvas.width;
                }
                
                // Draw shape
                ctx.fillStyle = shape.color;
                ctx.beginPath();
                ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
                ctx.fill();
              });
              
              requestAnimationFrame(animateFloatingShapes);
            };
            
            animateFloatingShapes();
          }
        }
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

      {/* Section 2: Your content fuels AI */}
      <section className="content-section relative min-h-screen pt-24">
        {/* Floating colorful shapes canvas */}
        <canvas 
          id="floating-shapes-canvas"
          className="absolute inset-0 w-full h-full z-1"
        />
        <canvas 
          ref={parallaxCanvasRef}
          className="absolute inset-0 w-full h-full z-5"
          style={{ opacity: 0.8 }}
        />
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
