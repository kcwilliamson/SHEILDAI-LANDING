import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useShapesAnimation } from '../hooks/useShapesAnimation';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isColorfulRef = useRef(false);
  const { canvasRef, transformToColorful, transformToGrey, continueShapesInBackground, exitShapes } = useShapesAnimation();

  
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
        start: "top top-=10",
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

      // Keep shapes colorful throughout - no transformation back to grey
    };

    // Initialize the page
    initializeShapes();
    createScrollTriggeredAnimation();

    // Transform shapes after 5 seconds and keep them colorful
    gsap.delayedCall(5, () => {
      if (!isColorfulRef.current) {
        transformToColorful();
        isColorfulRef.current = true;
      }
    });

    // Looping highlight animations for lose section
    const startHighlightLoop = () => {
      const highlights = document.querySelectorAll('.highlight-bg');
      
      const animateHighlights = () => {
        highlights.forEach((highlight, index) => {
          gsap.fromTo(highlight, 
            {
              scaleX: 0,
              transformOrigin: "left center"
            },
            {
              duration: 0.8,
              scaleX: 1,
              ease: "power2.out",
              delay: index * 0.3,
              onComplete: index === highlights.length - 1 ? () => {
                // Reset all highlights after the last one completes, then wait for 5-second cycle
                gsap.delayedCall(2, () => {
                  gsap.set(highlights, { scaleX: 0 });
                  gsap.delayedCall(0.5, animateHighlights); // Restart the loop every 5 seconds total
                });
              } : undefined
            }
          );
        });
      };
      
      animateHighlights();
    };
    
    // Start the loop when the component loads
    gsap.delayedCall(2, startHighlightLoop);

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
  }, [transformToColorful, transformToGrey, continueShapesInBackground, exitShapes]);

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Header */}
      <header className="w-full bg-white shadow-lg border-b border-gray-200">
        <nav className="flex items-center justify-between px-8 py-4 w-full">
          {/* Left Side - Cloudflare Logo */}
          <div className="flex items-center">
            <a href="https://cloudflare.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="https://pub-aa908c10829e4ed6b353da031aeb7c2b.r2.dev/Content%20Protection/1pixel-down__1_.svg" 
                alt="Cloudflare Logo" 
                className="h-10"
              />
            </a>
          </div>

          {/* Right Side - Navigation Menu */}
          <div className="flex items-center">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#hero-section" className="text-gray-800 hover:text-orange-500 font-semibold transition-colors px-3 py-2 rounded-md hover:bg-gray-50">
                What is AI
              </a>
              <a href="#protection-section" className="text-gray-800 hover:text-orange-500 font-semibold transition-colors px-3 py-2 rounded-md hover:bg-gray-50">
                How to protect your content
              </a>
              <a href="#connect-section" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg ml-4">
                Connect with Cloudflare
              </a>
            </div>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-800 hover:text-orange-500 transition-colors ml-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Shapes canvas for background */}
      <canvas 
        ref={canvasRef}
        id="shapes-canvas" 
        className="fixed top-0 left-0 w-full h-full z-0"
      />

      {/* Section 1: Transforming Shapes */}
      <section id="hero-section" className="relative overflow-hidden flex items-center justify-center" style={{minHeight: '90vh'}}>
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="text-center">
            <h1 
              id="main-text"
              className="font-bold text-white leading-[0.8]"
              style={{fontSize: '100px'}}
            >
              It&apos;s not<br />
              Artificial<br />
              Intelligence
            </h1>
          </div>
        </div>
      </section>

      {/* Section 2: Understanding the Threat */}
      <section className="relative bg-transparent flex items-center justify-center px-6 py-16 z-10">
        <div className="max-w-4xl text-center">
          <div className="bg-black/40 backdrop-blur-sm p-10 rounded-lg">
            <p className="font-bold text-white mb-10 leading-tight" style={{fontSize: '40px'}}>
              Generative AI doesn't create ideas out of thin air—it builds them based on yours
            </p>
            
            <p className="text-gray-200 leading-relaxed mb-10" style={{fontSize: '18px'}}>
              Imagine every photo, article, video, and line of code you have ever created. AI models are trained by analyzing these vast collections of human work. They scan your unique content to learn the fundamental rules of style, language, and structure. Essentially, your high-quality work serves as the training data that teaches the AI how to be creative.
            </p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm p-10 rounded-lg mt-8">
            <h3 className="font-bold text-white mb-6 leading-tight" style={{fontSize: '40px'}}>In this model, you lose</h3>
            <p className="text-gray-200 leading-relaxed mb-8" style={{fontSize: '18px'}}>
              While your content is what makes these systems intelligent, the value is flowing in only one direction.
            </p>
            
            <ul className="space-y-6 text-gray-200 max-w-3xl mx-auto" style={{fontSize: '18px'}}>
              <li className="flex items-start text-left">
                <span className="text-orange-400 font-bold mr-4 mt-1" style={{fontSize: '24px'}}>•</span>
                <div>
                  <span 
                    className="highlight-phrase relative inline-block font-semibold text-white" 
                    style={{position: 'relative'}}
                  >
                    <span className="highlight-bg absolute inset-0 w-full opacity-60" style={{backgroundColor: '#FF8C00', zIndex: -1, transform: 'scaleX(0)', transformOrigin: 'left center'}}></span>
                    <span className="relative z-10">Unauthorized Scraping:</span>
                  </span> Your work is being harvested to build commercial models without your credit, attribution, or consent.
                </div>
              </li>
              <li className="flex items-start text-left">
                <span className="text-blue-400 font-bold mr-4 mt-1" style={{fontSize: '24px'}}>•</span>
                <div>
                  <span 
                    className="highlight-phrase relative inline-block font-semibold text-white" 
                    style={{position: 'relative'}}
                  >
                    <span className="highlight-bg absolute inset-0 w-full opacity-60" style={{backgroundColor: '#4A90E2', zIndex: -1, transform: 'scaleX(0)', transformOrigin: 'left center'}}></span>
                    <span className="relative z-10">No Compensation:</span>
                  </span> Tech giants are profiting from your creativity without offering direct payment.
                </div>
              </li>
              <li className="flex items-start text-left">
                <span className="text-red-400 font-bold mr-4 mt-1" style={{fontSize: '24px'}}>•</span>
                <div>
                  <span 
                    className="highlight-phrase relative inline-block font-semibold text-white" 
                    style={{position: 'relative'}}
                  >
                    <span className="highlight-bg absolute inset-0 w-full opacity-60" style={{backgroundColor: '#E91E63', zIndex: -1, transform: 'scaleX(0)', transformOrigin: 'left center'}}></span>
                    <span className="relative z-10">Lost Monetization:</span>
                  </span> Most dangerously, these AI models use your own style to generate competing content. This bypasses your platform entirely, diverting traffic and breaking your traditional revenue streams.
                </div>
              </li>
            </ul>
            
            <p className="text-white font-semibold mt-8 leading-relaxed" style={{fontSize: '20px'}}>
              In short: You provide the intelligence, but the AI captures the value.
            </p>
          </div>
        </div>
      </section>


      {/* Section 3: Content Protection Options */}
      <section id="protection-section" className="relative min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bold text-black text-center mb-16 leading-tight" style={{fontSize: '26px'}}>
            It's not too late to protect your content
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Block Pill */}
            <div className="protection-pill relative h-80" style={{transform: 'translateY(0px)', opacity: 1}}>
              <div className="absolute inset-0 bg-pink-500 rounded-3xl shadow-lg"></div>
              <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                <div className="text-center">
                  <h3 className="font-bold mb-4" style={{fontSize: '20px'}}>Block</h3>
                  <div className="text-6xl font-bold">✕</div>
                </div>
                <p className="text-white leading-relaxed mt-4" style={{fontSize: '16px'}}>
                  Cloudflare's AI Crawl Control integrates seamlessly with Bot Management and your WAF: simply block bots like GPTBot or ClaudeBot, and the dashboard will confirm your refusal with $4xx$ status codes.
                </p>
              </div>
            </div>

            {/* Allow Pill */}
            <div className="protection-pill relative h-80" style={{transform: 'translateY(0px)', opacity: 1}}>
              <div className="absolute inset-0 bg-blue-500 rounded-3xl shadow-lg"></div>
              <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                <div className="text-center">
                  <h3 className="font-bold mb-4" style={{fontSize: '20px'}}>Allow</h3>
                  <div className="text-6xl font-bold">✓</div>
                </div>
                <p className="text-white leading-relaxed mt-4" style={{fontSize: '16px'}}>
                  When you Allow an AI agent via AI Crawl Control, the Bot Management system provides detailed tracking with $2xx$ status codes and reveals which pages these allowed AI agents value most.
                </p>
              </div>
            </div>

            {/* Charge Pill */}
            <div className="protection-pill relative h-80" style={{transform: 'translateY(0px)', opacity: 1}}>
              <div className="absolute inset-0 bg-green-500 rounded-3xl shadow-lg"></div>
              <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                <div className="text-center">
                  <h3 className="font-bold mb-4" style={{fontSize: '20px'}}>Charge</h3>
                  <div className="text-6xl font-bold">$</div>
                </div>
                <p className="text-white leading-relaxed mt-4" style={{fontSize: '16px'}}>
                  Enable the Charge rule through Pay Per Crawl feature in AI Crawl Control, which enforces your pricing policy by signaling $402$ Payment Required status for monetized requests.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="font-bold text-black mb-8" style={{fontSize: '20px'}}>Get started today</h3>
            <button className="bg-orange-500 text-white px-12 py-4 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200" style={{fontSize: '16px'}}>
              Contact Cloudflare
            </button>
          </div>
        </div>
      </section>

      {/* Section 4: Connect with Cloudflare */}
      <section id="connect-section" className="relative min-h-screen bg-white flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Cloudflare Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="https://pub-aa908c10829e4ed6b353da031aeb7c2b.r2.dev/Content%20Protection/1pixel-down__1_.svg" 
              alt="Cloudflare Logo" 
              className="h-12"
            />
          </div>
          
          <h2 className="font-bold text-gray-900 mb-8 leading-tight" style={{fontSize: '26px'}}>
            Connect with Cloudflare
          </h2>
          <p className="text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed" style={{fontSize: '16px'}}>
            Ready to protect your content and monetize your AI interactions? Our team of experts is standing by 
            to help you implement the perfect solution for your business needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border">
              <div className="text-blue-500 text-4xl mb-4">🛡️</div>
              <h3 className="font-bold text-gray-900 mb-4" style={{fontSize: '20px'}}>Content Protection</h3>
              <p className="text-gray-600" style={{fontSize: '16px'}}>Secure your intellectual property from unauthorized AI scraping</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border">
              <div className="text-green-500 text-4xl mb-4">💰</div>
              <h3 className="font-bold text-gray-900 mb-4" style={{fontSize: '20px'}}>Monetization</h3>
              <p className="text-gray-600" style={{fontSize: '16px'}}>Generate revenue from AI companies accessing your content</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border">
              <div className="text-orange-500 text-4xl mb-4">⚡</div>
              <h3 className="font-bold text-gray-900 mb-4" style={{fontSize: '20px'}}>Easy Setup</h3>
              <p className="text-gray-600" style={{fontSize: '16px'}}>Get up and running in minutes with our expert guidance</p>
            </div>
          </div>
          
          <a 
            href="https://www.cloudflare.com/plans/enterprise/contact/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-orange-500 text-white px-12 py-4 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 shadow-lg"
            style={{fontSize: '16px'}}
          >
            Connect with Cloudflare Sales
          </a>
        </div>
      </section>
    </div>
  );
}
