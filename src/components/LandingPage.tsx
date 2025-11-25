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
      {/* Cloudflare Logo - Top Left */}
      <div className="fixed top-6 left-6 z-50">
        <a 
          href="https://cloudflare.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block hover:opacity-80 transition-opacity"
        >
          <img 
            src="https://pub-aa908c10829e4ed6b353da031aeb7c2b.r2.dev/Content%20Protection/white%20cloudflare.png" 
            alt="Cloudflare Logo" 
            className="h-32"
          />
        </a>
      </div>

      {/* Navigation Items - Top Right */}
      <nav className="fixed top-6 right-6 z-50 hidden md:flex items-center space-x-6">
        <a 
          href="#section-2" 
          className="text-white hover:text-orange-400 font-semibold transition-colors px-3 py-2 rounded-md hover:bg-white/10"
        >
          Generative AI
        </a>
        <a 
          href="#section-3" 
          className="text-white hover:text-orange-400 font-semibold transition-colors px-3 py-2 rounded-md hover:bg-white/10"
        >
          Best Practices
        </a>
        <a 
          href="#section-4" 
          className="text-white hover:text-orange-400 font-semibold transition-colors px-3 py-2 rounded-md hover:bg-white/10"
        >
          Protect Your Content
        </a>
      </nav>

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

      {/* Section 2: Content with highlight effects */}
      <section id="section-2" className="relative py-20 px-6 bg-transparent z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-sm p-10 rounded-lg">
            <p className="font-bold text-white mb-10 leading-tight" style={{fontSize: '40px'}}>
              Generative AI doesn't create ideas out of thin air—it builds them based on yours
            </p>
            <p className="text-gray-200 leading-relaxed mb-16" style={{fontSize: '18px'}}>
              Imagine every photo, article, video, and line of code you have ever created being fed into a machine learning model. That's essentially what's happening. AI companies are scraping the web, building massive datasets from publicly available content, and training models that can then generate "new" content based on patterns they've learned from your work.
            </p>
            <h3 className="font-bold text-white mb-6 leading-tight" style={{fontSize: '40px'}}>
              In this model, you lose
            </h3>
            <p className="text-gray-200 leading-relaxed mb-8" style={{fontSize: '18px'}}>
              While your content is what makes these systems intelligent, the value is flowing in only one direction.
              <span className="highlight-phrase bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent font-bold mx-2">Unauthorized Scraping</span>
              takes your work without permission.
              <span className="highlight-phrase bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold mx-2">No Compensation</span>
              means you see nothing for your contribution.
              <span className="highlight-phrase bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent font-bold mx-2">Lost Monetization</span>
              as AI-generated alternatives compete directly with your original work.
            </p>
            <p className="text-white font-semibold mt-8 leading-relaxed" style={{fontSize: '20px'}}>
              In short: You provide the intelligence, but the AI captures the value.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: How to fight back */}
      <section id="section-3" className="relative py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-bold text-black text-center mb-16 leading-tight" style={{fontSize: '40px'}}>
            How to fight back
          </h2>
          
          <div className="space-y-8">
            {[
              {
                title: "robots.txt",
                icon: "🤖",
                description: "Have a small, hidden file on your website that politely tells major search engines (like Google) not to show certain pages in their search results."
              },
              {
                title: "Rate Limiting",
                icon: "⏱️",
                description: "Program your website to notice when one computer asks for content too quickly, too many times in a row."
              },
              {
                title: "IP & User-Agent Blocking",
                icon: "🚫",
                description: "If you see a specific computer address (IP) or software signature (User-Agent) that keeps stealing content, use a security tool to block them completely."
              },
              {
                title: "JavaScript & API Keys",
                icon: "🔑",
                description: "For special, programmatic access to your content, only allow it if the user provides a unique, authorized digital code (the API Key)."
              },
              {
                title: "Content Obfuscation",
                icon: "🛡️",
                description: "Add invisible digital watermarks or unique tracking codes to your text and images."
              },
              {
                title: "Monitoring & Analysis",
                icon: "📊",
                description: "Regularly look at your website traffic reports to spot strange behavior—like one user visiting 5,000 pages in an hour or accessing pages in a weird order."
              }
            ].map((item, index) => (
              <ProtectionMethod key={index} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Get Started with Cloudflare */}
      <section id="section-4" className="relative py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-bold text-black mb-8 leading-tight" style={{fontSize: '40px'}}>
              It's not too late to protect your content
            </h2>
            <p className="text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed" style={{fontSize: '16px'}}>
              Cloudflare can help you implement these best practices and take advantage of our advanced tools. From basic protection methods to enterprise-grade AI content control, we'll set you up with the right solution for your needs.
            </p>
          </div>

          {/* Embedded Video */}
          <div className="mb-16 max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-black">
              <video
                controls
                preload="metadata"
                className="w-full h-auto"
                style={{aspectRatio: '16/9'}}
              >
                <source 
                  src="https://customer-1mwganm1ma0xgnmj.cloudflarestream.com/c2f3d8aada64a53e6cc118e5af834601/manifest/video.m3u8" 
                  type="application/x-mpegURL"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-700 text-center mb-8 leading-relaxed" style={{fontSize: '16px'}}>
                Reach out to 
                <a 
                  href="https://cloudflare.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 font-semibold underline mx-1"
                >
                  Cloudflare
                </a>
                to learn more about how we can help, or 
                <a 
                  href="https://developers.cloudflare.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 font-semibold underline mx-1"
                >
                  read our documentation
                </a>
                to see what we can offer.
              </p>
              
              <a 
                href="https://cloudflare.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-orange-500 text-white px-8 py-4 rounded-lg hover:bg-orange-600 font-bold transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
                style={{fontSize: '18px'}}
              >
                Protect My Content
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Protection Method Component
function ProtectionMethod({ item }: { item: any }) {
  return (
    <div className="flex items-start space-x-6 py-6">
      {/* Icon */}
      <div className="flex-shrink-0">
        <div 
          className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold"
        >
          {item.icon}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 mb-3" style={{fontSize: '24px'}}>
          {item.title}
        </h3>
        <p className="text-gray-600 leading-relaxed" style={{fontSize: '16px'}}>
          {item.description}
        </p>
      </div>
    </div>
  );
}

