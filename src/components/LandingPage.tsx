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


      {/* Section 3: How to fight back - FAQ Style */}
      <section className="relative py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold text-black text-center mb-16 leading-tight" style={{fontSize: '40px'}}>
            How to fight back
          </h2>
          
          <div className="border-2 border-black rounded-2xl overflow-hidden shadow-lg">
            {[
              {
                title: "Tell the good bots what not to see",
                tech: "robots.txt",
                what: "Have a small, hidden file on your website that politely tells major search engines (like Google) not to show certain pages in their search results.",
                result: "Prevents pages you don't want public (like your admin area or duplicate content) from being indexed, but won't stop bad guys.",
                color: "bg-red-100 border-red-400 hover:bg-red-200"
              },
              {
                title: "Set a speed limit for visitors",
                tech: "Rate Limiting",
                what: "Program your website to notice when one computer asks for content too quickly, too many times in a row.",
                result: "If a computer tries to download your whole site in a minute, your site will slow them down or temporarily block them, protecting your bandwidth.",
                color: "bg-blue-100 border-blue-400 hover:bg-blue-200"
              },
              {
                title: "Block known troublemakers",
                tech: "IP and User-Agent Blocking",
                what: "If you see a specific computer address (IP) or software signature (User-Agent) that keeps stealing content, use a security tool to block them completely.",
                result: "Stops known scrapers and their tools from ever loading your pages again.",
                color: "bg-green-100 border-green-400 hover:bg-green-200"
              },
              {
                title: "Ask a simple human test question",
                tech: "CAPTCHAs",
                what: "Put up a simple challenge (like \"click all the traffic lights\" or \"type the wavy letters\") before someone can access the content.",
                result: "Stops basic automated programs, because they can't see or solve the visual puzzle.",
                color: "bg-purple-100 border-purple-400 hover:bg-purple-200"
              },
              {
                title: "Require a \"secret handshake\"",
                tech: "JavaScript and API Keys",
                what: "For special, programmatic access to your content, only allow it if the user provides a unique, authorized digital code (the API Key). You can also add hidden code that only a standard web browser can execute.",
                result: "Ensures only approved users or apps can access your data, and simple scrapers that don't run website code fail to load the content.",
                color: "bg-yellow-100 border-yellow-400 hover:bg-yellow-200"
              },
              {
                title: "Make the stolen content useless",
                tech: "Content Obfuscation",
                what: "Add invisible digital watermarks or unique tracking codes to your text and images.",
                result: "If someone steals your content and puts it on their site, you can prove it's yours and trace exactly where they got it.",
                color: "bg-pink-100 border-pink-400 hover:bg-pink-200"
              },
              {
                title: "Watch for suspicious activity",
                tech: "Monitoring and Analysis",
                what: "Regularly look at your website traffic reports to spot strange behavior—like one user visiting 5,000 pages in an hour or accessing pages in a weird order.",
                result: "Allows you to catch new scrapers before they cause major damage and block them quickly.",
                color: "bg-teal-100 border-teal-400 hover:bg-teal-200"
              }
            ].map((item, index, array) => (
              <AccordionItem key={index} item={item} isLast={index === array.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Get Started with Cloudflare */}
      <section className="relative py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-bold text-black mb-8 leading-tight" style={{fontSize: '40px'}}>
              It's not too late to protect your content
            </h2>
            <p className="text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed" style={{fontSize: '16px'}}>
              Cloudflare can help you implement these best practices and take advantage of our advanced tools. From basic protection methods to enterprise-grade AI content control, we'll set you up with the right solution for your needs.
            </p>
          </div>

          <RisingShapes />

          <div className="text-center mt-16">
            <a 
              href="https://www.cloudflare.com/plans/enterprise/contact/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-orange-500 text-white font-bold px-12 py-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-200"
              style={{fontSize: '16px'}}
            >
              Connect with Cloudflare
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

// Accordion Item Component
function AccordionItem({ item, isLast }: { item: any; isLast: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${item.color || 'bg-white'} ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-6 py-5 flex items-center justify-between transition-colors group ${item.color ? item.color.split(' ')[2] : 'hover:bg-gray-50'}`}
      >
        <div>
          <h3 className="font-bold text-gray-900 transition-colors" style={{fontSize: '18px'}}>
            {item.title}
          </h3>
          <span className="text-gray-500 bg-white px-2 py-1 rounded mt-1 inline-block border border-gray-300" style={{fontSize: '12px'}}>
            Using: {item.tech}
          </span>
        </div>
        <div className={`transform transition-transform duration-300 text-gray-600 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`px-6 pb-6 pt-2 text-gray-700 space-y-4 ${item.color || 'bg-gray-50'}`}>
          <div>
            <span className="font-bold text-gray-800 block mb-1" style={{fontSize: '14px'}}>What to do:</span>
            <p style={{fontSize: '14px'}}>{item.what}</p>
          </div>
          <div>
            <span className="font-bold text-gray-800 block mb-1" style={{fontSize: '14px'}}>Result:</span>
            <p style={{fontSize: '14px'}}>{item.result}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Static Rectangles Component
function RisingShapes() {
  const shapes = [
    {
      id: 1,
      icon: "✕",
      title: "Block AI Bots",
      color: "bg-pink-500",
      desc: "AI Crawl Control integrates with Bot Management to block bots like GPTBot and ClaudeBot. Dashboard shows blocked requests with 4xx status codes."
    },
    {
      id: 2,
      icon: "✓",
      title: "Control Access", 
      color: "bg-blue-500",
      desc: "Allow trusted AI agents through AI Crawl Control. Bot Management tracks successful requests with 2xx status codes and shows which pages AI values most."
    },
    {
      id: 3,
      icon: "$",
      title: "Pay Per Crawl",
      color: "bg-green-500", 
      desc: "Use Pay Per Crawl with AI Crawl Control to charge AI crawlers. System enforces pricing with 402 Payment Required status and logs all monetized requests."
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {shapes.map((shape) => {
        return (
          <div 
            key={shape.id}
            className={`
              rounded-2xl shadow-lg p-8 text-white h-80
              ${shape.color}
            `}
          >
            <div className="flex flex-col items-center text-center h-full">
              <div className="text-6xl font-bold mb-4">{shape.icon}</div>
              <h3 className="font-bold text-xl mb-6">
                {shape.title}
              </h3>
              
              <div className="w-16 h-1 bg-white/50 rounded mb-6"></div>
              
              <p className="text-white leading-relaxed text-sm flex-1 flex items-center">
                {shape.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
