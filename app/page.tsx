'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useShapesAnimation } from '../hooks/useShapesAnimation';
import { useAntAnimation } from '../hooks/useAntAnimation';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isColorfulRef = useRef(false);
  const { canvasRef, transformToColorful, transformToGrey, turnGreyWithConnections, continueShapesInBackground, exitShapes } = useShapesAnimation();
  const { canvasRef: antCanvasRef, startSingleAnt, addMoreAnts, addAntsFromOffScreen, resetToSingleAnt } = useAntAnimation();

  
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

    // Scroll-triggered animation system
    const createScrollTriggeredAnimation = () => {
      // Transform to colorful when scrolling down
      ScrollTrigger.create({
        trigger: "body",
        start: "top top-=50",
        onEnter: () => {
          if (!isColorfulRef.current) {
            const transformTimeline = gsap.timeline();
            
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
                // Make shapes continue in background for sections 1, 2, 3
                continueShapesInBackground();
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
          }
        },
        onLeaveBack: () => {
          if (isColorfulRef.current) {
            const transformTimeline = gsap.timeline();
            
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
        }
      });

      // Fade animation to grey when reaching "In this model, you lose" section
      ScrollTrigger.create({
        trigger: "#lose-section",
        start: "top center",
        onEnter: () => {
          if (isColorfulRef.current) {
            // Gradually transform shapes back to grey
            transformToGrey();
            isColorfulRef.current = false;
          }
        },
        onLeaveBack: () => {
          if (!isColorfulRef.current) {
            // Return to colorful when scrolling back up
            transformToColorful();
            continueShapesInBackground();
            isColorfulRef.current = true;
          }
        }
      });
    };

    // Initialize the page
    initializeShapes();
    createScrollTriggeredAnimation();

    
    // Set initial ant box position off-screen to the right
    gsap.set("#ant-container", { x: "100vw" });

    // Ant box float in from right on scroll
    ScrollTrigger.create({
      trigger: ".ant-section",
      start: "top bottom",
      end: "center center", 
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        // Float in from right (100vw to 0)
        gsap.set("#ant-container", {
          x: (1 - progress) * window.innerWidth
        });
      },
      onEnter: () => {
        startSingleAnt();
        // Continue adding ants gradually
        gsap.delayedCall(1, () => addAntsFromOffScreen(3));
        gsap.delayedCall(3, () => addAntsFromOffScreen(5));
        gsap.delayedCall(5, () => addAntsFromOffScreen(8));
        gsap.delayedCall(7, () => addAntsFromOffScreen(12));
      }
    });

    // Ant box float out to left after center
    ScrollTrigger.create({
      trigger: ".ant-section",
      start: "center center",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        // Float out to left (0 to -600px)
        gsap.set("#ant-container", {
          x: -progress * 600
        });
      }
    });

    // Protection pills animation
    ScrollTrigger.create({
      trigger: "#protection-section",
      start: "top center",
      onEnter: () => {
        const pills = document.querySelectorAll('.protection-pill');
        
        // Animate each pill moving up with 3-second delays
        pills.forEach((pill, index) => {
          gsap.to(pill, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            delay: index * 3 // 3 seconds between each pill
          });
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

      {/* Shapes canvas for background */}
      <canvas 
        ref={canvasRef}
        id="shapes-canvas" 
        className="fixed top-0 left-0 w-full h-full z-0"
      />

      {/* Section 1: Transforming Shapes */}
      <section id="hero-section" className="relative overflow-hidden" style={{minHeight: '90vh'}}>
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

      {/* Section 2: Think of AI like ants */}
      <section className="ant-section relative z-10" style={{backgroundColor: 'transparent', height: '80vh', marginTop: 0}}>
        <div className="relative z-20 h-full flex items-center justify-center p-6 overflow-hidden">
          <div 
            id="ant-container"
            className="bg-purple-600 shadow-2xl transition-transform duration-1000 ease-out"
            style={{backgroundColor: '#8B5CF6', width: '70vh', height: '70vh', position: 'relative', borderRadius: '60px'}}
          >
            <canvas 
              ref={antCanvasRef}
              className="absolute inset-0 w-full h-full"
              style={{borderRadius: '60px'}}
            />
            <div className="relative z-20 h-full flex items-center justify-center px-6">
              <div className="grid grid-cols-12 w-full">
                <div className="col-start-3 col-span-8 text-center flex flex-col items-center justify-center">
                  <h2 className="font-bold text-white mb-6 leading-[0.85] p-4" style={{fontSize: '48px'}}>
                    Think of AI like ants
                  </h2>
                  <div className="max-w-4xl space-y-4">
                    <p className="text-white text-lg leading-relaxed text-center max-w-[60ch] mx-auto">
                      No single ant is a genius, but together they create complex systems, 
                      build intricate colonies, and solve problems that would be impossible 
                      for any individual ant to tackle alone.
                    </p>
                    <p className="text-white text-lg leading-relaxed text-center max-w-[60ch] mx-auto">
                      Just like an ant colony, AI is now leveraging multi-agent systems. Instead of one brain, 
                      multiple, specialized AI agents collaborate, share data, and follow simple rules to solve 
                      complex problems. This creates a "swarm intelligence" that dramatically boosts performance 
                      and forms a powerful collective machine intelligence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: In this model, you lose */}
      <section id="lose-section" className="relative min-h-screen bg-transparent flex items-center justify-center px-6 z-10">
        <div className="grid grid-cols-12 w-full">
          <div className="col-start-3 col-span-8 text-center flex flex-col items-center justify-center">
            <h2 className="font-bold text-white mb-12 leading-[0.9] p-4" style={{fontSize: '72px'}}>
              In this model, you lose
            </h2>
            <div className="max-w-4xl">
              <p className="text-white text-xl leading-relaxed text-center max-w-[60ch] mx-auto">
                Your <span 
                  className="highlight-phrase relative inline-block" 
                  data-highlight="orange"
                  style={{position: 'relative'}}
                >
                  <span className="highlight-bg absolute inset-0 w-full opacity-60" style={{backgroundColor: '#FF8C00', zIndex: 0}}></span>
                  original content
                </span> fundamentally enables modern AI by serving as the massive training 
                data set from which systems learn human creativity and style. The core issue is that your 
                work <span 
                  className="highlight-phrase relative inline-block" 
                  data-highlight="purple"
                  style={{position: 'relative'}}
                >
                  <span className="highlight-bg absolute inset-0 w-full opacity-60" style={{backgroundColor: '#C147E9', zIndex: 0}}></span>
                  is being scraped
                </span> and used commercially to build these AI models <span 
                  className="highlight-phrase relative inline-block" 
                  data-highlight="green"
                  style={{position: 'relative'}}
                >
                  <span className="highlight-bg absolute inset-0 w-full opacity-60" style={{backgroundColor: '#00CED1', zIndex: 0}}></span>
                  without credit
                </span>, <span 
                  className="highlight-phrase relative inline-block" 
                  data-highlight="blue"
                  style={{position: 'relative'}}
                >
                  <span className="highlight-bg absolute inset-0 w-full opacity-60" style={{backgroundColor: '#4A90E2', zIndex: 0}}></span>
                  attribution
                </span>, or <span 
                  className="highlight-phrase relative inline-block" 
                  data-highlight="pink"
                  style={{position: 'relative'}}
                >
                  <span className="highlight-bg absolute inset-0 w-full opacity-60" style={{backgroundColor: '#E91E63', zIndex: 0}}></span>
                  direct payment
                </span>, allowing the AI to generate competing content that 
                bypasses your platform and effectively breaks your traditional monetization stream.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Content Protection Options */}
      <section id="protection-section" className="relative min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bold text-black text-center mb-16 leading-tight" style={{fontSize: '56px'}}>
            It's not too late to protect your content
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Block Pill */}
            <div 
              className="protection-pill bg-pink-500 text-white p-8 rounded-3xl shadow-lg"
              style={{transform: 'translateY(0px)', opacity: 1}}
            >
              <div className="text-center mb-6">
                <h3 className="text-4xl font-bold mb-4">Block</h3>
                <div className="text-6xl font-bold">✕</div>
              </div>
              <p className="text-white text-sm leading-relaxed">
                Cloudflare's AI Crawl Control integrates seamlessly with Bot Management and your WAF (Web Application Firewall): simply block bots like GPTBot or ClaudeBot, and the Cloudflare dashboard will confirm your refusal by showing an increase in $4xx$ status codes (like $403$ or $402$), verifying that your content is protected.
              </p>
            </div>

            {/* Allow Pill */}
            <div 
              className="protection-pill bg-blue-500 text-white p-8 rounded-3xl shadow-lg"
              style={{transform: 'translateY(0px)', opacity: 1}}
            >
              <div className="text-center mb-6">
                <h3 className="text-4xl font-bold mb-4">Allow</h3>
                <div className="text-6xl font-bold">✓</div>
              </div>
              <p className="text-white text-sm leading-relaxed">
                When you Allow an AI agent via AI Crawl Control, the Bot Management system provides detailed tracking: the Metrics tab displays their successful requests (with $2xx$ status codes), and the Most popular paths table reveals exactly which of your pages these allowed AI agents value most.
              </p>
            </div>

            {/* Charge Pill */}
            <div 
              className="protection-pill bg-green-500 text-white p-8 rounded-3xl shadow-lg"
              style={{transform: 'translateY(0px)', opacity: 1}}
            >
              <div className="text-center mb-6">
                <h3 className="text-4xl font-bold mb-4">Charge</h3>
                <div className="text-6xl font-bold">$</div>
              </div>
              <p className="text-white text-sm leading-relaxed">
                Enable the Charge rule through the Pay Per Crawl feature in AI Crawl Control, which uses Bot Management for accurate identification. The system enforces your pricing policy by signaling a $402$ Payment Required status, correctly logging every monetized request for subsequent billing and payout.
              </p>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-4xl font-bold text-black mb-8">Get started today</h3>
            <button className="bg-orange-500 text-white px-12 py-4 rounded-full text-xl font-semibold hover:bg-orange-600 transition-colors duration-200">
              Contact Cloudflare
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
