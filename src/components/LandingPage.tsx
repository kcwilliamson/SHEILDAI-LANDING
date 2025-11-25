import { useEffect, useRef, useState } from 'react';
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
      <section className="relative bg-transparent flex items-center justify-center px-6 pt-16 pb-32 z-10">
        <div className="max-w-4xl text-center">
          <div className="bg-black/40 backdrop-blur-sm p-10 rounded-lg">
            <p className="font-bold text-white mb-10 leading-tight" style={{fontSize: '40px'}}>
              Generative AI doesn't create ideas out of thin air—it builds them based on yours
            </p>
            
            <p className="text-gray-200 leading-relaxed mb-16" style={{fontSize: '18px'}}>
              Imagine every photo, article, video, and line of code you have ever created. AI models are trained by analyzing these vast collections of human work. They scan your unique content to learn the fundamental rules of style, language, and structure. Essentially, your high-quality work serves as the training data that teaches the AI how to be creative.
            </p>

            <h3 className="font-bold text-white mb-6 leading-tight" style={{fontSize: '40px'}}>In this model, you lose</h3>
            
            <p className="text-gray-200 leading-relaxed mb-8" style={{fontSize: '18px'}}>
              While your content is what makes these systems intelligent, the value is flowing in only one direction. 
              <span 
                className="highlight-phrase relative inline-block font-semibold text-white ml-1" 
                style={{position: 'relative'}}
              >
                <span className="highlight-bg absolute inset-0 w-full opacity-60" style={{backgroundColor: '#FF8C00', zIndex: -1, transform: 'scaleX(0)', transformOrigin: 'left center'}}></span>
                <span className="relative z-10">Unauthorized Scraping</span>
              </span> means your work is being harvested to build commercial models without your credit, attribution, or consent. 
              <span 
                className="highlight-phrase relative inline-block font-semibold text-white ml-1" 
                style={{position: 'relative'}}
              >
                <span className="highlight-bg absolute inset-0 w-full opacity-60" style={{backgroundColor: '#4A90E2', zIndex: -1, transform: 'scaleX(0)', transformOrigin: 'left center'}}></span>
                <span className="relative z-10">No Compensation</span>
              </span> occurs as tech giants profit from your creativity without offering direct payment. Most dangerously, 
              <span 
                className="highlight-phrase relative inline-block font-semibold text-white ml-1" 
                style={{position: 'relative'}}
              >
                <span className="highlight-bg absolute inset-0 w-full opacity-60" style={{backgroundColor: '#E91E63', zIndex: -1, transform: 'scaleX(0)', transformOrigin: 'left center'}}></span>
                <span className="relative z-10">Lost Monetization</span>
              </span> happens when AI models use your own style to generate competing content, bypassing your platform entirely and diverting traffic while breaking your traditional revenue streams.
            </p>
            
            <p className="text-white font-semibold mt-8 leading-relaxed" style={{fontSize: '20px'}}>
              In short: You provide the intelligence, but the AI captures the value.
            </p>
          </div>
        </div>
      </section>


      {/* Section 3: How to fight back - FAQ Style */}
      <section className="relative py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold text-black text-center mb-16 leading-tight" style={{fontSize: '40px'}}>
            How to fight back
          </h2>
          
          <div className="p-10 bg-white shadow-lg">
            {[
              {
                title: "Tell the good bots what not to see",
                tech: "robots.txt",
                what: "Have a small, hidden file on your website that politely tells major search engines (like Google) not to show certain pages in their search results.",
                result: "Prevents pages you don't want public (like your admin area or duplicate content) from being indexed, but won't stop bad guys.",
                color: "#E80954", number: "1"
              },
              {
                title: "Set a speed limit for visitors",
                tech: "Rate Limiting",
                what: "Program your website to notice when one computer asks for content too quickly, too many times in a row.",
                result: "If a computer tries to download your whole site in a minute, your site will slow them down or temporarily block them, protecting your bandwidth.",
                color: "#CCFF00", number: "2"
              },
              {
                title: "Block known troublemakers",
                tech: "IP and User-Agent Blocking",
                what: "If you see a specific computer address (IP) or software signature (User-Agent) that keeps stealing content, use a security tool to block them completely.",
                result: "Stops known scrapers and their tools from ever loading your pages again.",
                color: "#0764E5", number: "3"
              },
              {
                title: "Require a \"secret handshake\"",
                tech: "JavaScript and API Keys",
                what: "For special, programmatic access to your content, only allow it if the user provides a unique, authorized digital code (the API Key). You can also add hidden code that only a standard web browser can execute.",
                result: "Ensures only approved users or apps can access your data, and simple scrapers that don't run website code fail to load the content.",
                color: "#F6821F", number: "4"
              },
              {
                title: "Make the stolen content useless",
                tech: "Content Obfuscation",
                what: "Add invisible digital watermarks or unique tracking codes to your text and images.",
                result: "If someone steals your content and puts it on their site, you can prove it's yours and trace exactly where they got it.",
                color: "#2DB35E", number: "5"
              },
              {
                title: "Watch for suspicious activity",
                tech: "Monitoring and Analysis",
                what: "Regularly look at your website traffic reports to spot strange behavior—like one user visiting 5,000 pages in an hour or accessing pages in a weird order.",
                result: "Allows you to catch new scrapers before they cause major damage and block them quickly.",
                color: "#8D1EB1", number: "6"
              }
            ].map((item, index, array) => (
              <SlidingCard key={index} item={item} isLast={index === array.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Get Started with Cloudflare */}
      <section className="relative py-20 px-6 bg-gray-50">
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
          </div>

          <div className="text-center">
            <p className="text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed" style={{fontSize: '18px'}}>
              Ready to take control of your content protection? 
              <a 
                href="https://www.cloudflare.com/plans/enterprise/contact/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 font-semibold underline mx-1"
              >
                Reach out to Cloudflare
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
          </div>
        </div>
      </section>

    </div>
  );
}

// Sliding Card Component
function SlidingCard({ item, isLast }: { item: any; isLast: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-xl mb-6 ${!isLast ? '' : 'mb-0'} cursor-pointer`} onClick={() => setIsExpanded(!isExpanded)}>
      {/* Background colored section */}
      <div 
        className="p-8 text-white transition-all duration-500 ease-in-out"
        style={{ backgroundColor: item.color }}
      >
        <div className="flex items-start">
          <div 
            className="font-bold mr-6 flex-shrink-0"
            style={{ fontSize: '120px', lineHeight: '1' }}
          >
            {item.number}
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-3" style={{fontSize: '28px'}}>
              {item.title}
            </h3>
            <span className="bg-white/20 px-4 py-2 rounded text-white font-semibold" style={{fontSize: '14px'}}>
              Using: {item.tech}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded content section */}
      <div 
        className={`bg-white p-8 transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-gray-800 mb-3" style={{fontSize: '18px'}}>What to do:</h4>
            <p className="text-gray-700 leading-relaxed" style={{fontSize: '16px'}}>{item.what}</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-3" style={{fontSize: '18px'}}>Result:</h4>
            <p className="text-gray-700 leading-relaxed" style={{fontSize: '16px'}}>{item.result}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

