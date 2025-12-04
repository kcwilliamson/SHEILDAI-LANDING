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
          ease: "power2.out",
          onComplete: () => {
            // Show attribution after main text appears
            gsap.to("#attribution-text", {
              duration: 0.5,
              opacity: 1,
              delay: 0.5,
              ease: "power2.out"
            });
          }
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

    // Video carousel animation
    ScrollTrigger.create({
      trigger: "#state-of-ai",
      start: "top center",
      onEnter: () => {
        const videoCards = document.querySelectorAll('.video-card');
        
        // Animate each video card sliding up with staggered timing
        videoCards.forEach((card, cardIndex) => {
          gsap.to(card, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            delay: cardIndex * 0.15 // Stagger by 150ms
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
      <div className="absolute top-6 left-6 z-50 flex items-center">
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
      <nav className="absolute top-6 right-6 z-50 hidden md:flex items-center space-x-6 h-32">
        <a 
          href="#section-2" 
          className="text-white hover:text-orange-400 font-semibold transition-colors px-3 py-2 rounded-md hover:bg-white/10"
        >
          Generative AI
        </a>
        <a 
          href="#state-of-ai" 
          className="text-white hover:text-orange-400 font-semibold transition-colors px-3 py-2 rounded-md hover:bg-white/10"
        >
          The State of AI
        </a>
        <a 
          href="#section-4" 
          className="text-white hover:text-orange-400 font-semibold transition-colors px-3 py-2 rounded-md hover:bg-white/10"
        >
          Best Practices
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
            <p 
              id="attribution-text"
              className="text-gray-300 mt-8 opacity-0"
              style={{fontSize: '20px'}}
            >
              - Matthew Prince, Cloudflare CEO and Founder
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Content with highlight effects */}
      <section id="section-2" className="relative pt-20 pb-40 px-6 bg-transparent z-10">
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

      {/* Section 3: The State of AI - Video Carousel */}
      <section id="state-of-ai" className="relative py-20 px-6 bg-transparent z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-bold text-white mb-8 leading-tight" style={{fontSize: '48px'}}>
              The State of AI
            </h2>
            <p className="text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed" style={{fontSize: '18px'}}>
              Hear from industry leaders, creators, and experts about how AI is reshaping our digital landscape today
            </p>
          </div>

          {/* Video Carousel */}
          <div className="relative mb-16">
            <div id="video-carousel" className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
              {[
                {
                  id: 1,
                  title: "Content Creator's Perspective",
                  subtitle: "Sarah Chen, Digital Artist",
                  description: "How AI training on creative work affects independent artists and the future of digital creativity",
                  thumbnail: "https://images.unsplash.com/photo-1494790108755-2616c17c643c?w=400&h=225&fit=crop&crop=face",
                  duration: "4:32"
                },
                {
                  id: 2,
                  title: "The Technical Reality",
                  subtitle: "Dr. Marcus Rodriguez, AI Researcher",
                  description: "Breaking down how large language models actually work and what data they really need",
                  thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop&crop=face",
                  duration: "6:18"
                },
                {
                  id: 3,
                  title: "Legal Implications",
                  subtitle: "Jennifer Walsh, IP Attorney",
                  description: "Current copyright law, fair use, and what content creators need to know about their rights",
                  thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=225&fit=crop&crop=face",
                  duration: "5:45"
                },
                {
                  id: 4,
                  title: "Industry Response",
                  subtitle: "Alex Thompson, Tech Journalist",
                  description: "How major platforms are responding to AI training concerns and what changes are coming",
                  thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=225&fit=crop&crop=face",
                  duration: "3:57"
                },
                {
                  id: 5,
                  title: "Future of Content",
                  subtitle: "Lisa Park, Digital Strategist",
                  description: "Strategies for creators to adapt, protect their work, and thrive in the AI era",
                  thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=225&fit=crop&crop=face",
                  duration: "7:23"
                }
              ].map((video) => (
                <div 
                  key={video.id} 
                  className={`video-card flex-none w-80 bg-black/60 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-orange-400/50 transition-all duration-300 cursor-pointer transform hover:scale-105 opacity-0`}
                  style={{transform: `translateY(50px)`}}
                >
                  <div className="relative">
                    <img 
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 5v10l8-5z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-white mb-2 text-lg leading-tight">
                      {video.title}
                    </h3>
                    <p className="text-orange-400 font-semibold mb-3 text-sm">
                      {video.subtitle}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <p className="text-gray-200 mb-6 leading-relaxed" style={{fontSize: '18px'}}>
                These conversations highlight the urgent need for content protection in the age of AI
              </p>
              <a 
                href="#section-4"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg hover:from-orange-600 hover:to-red-600 font-bold transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
                style={{fontSize: '18px'}}
              >
                Learn How to Protect Your Content
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: How to fight back */}
      <section id="section-4" className="relative py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-bold text-black text-center mb-16 leading-tight" style={{fontSize: '40px'}}>
            How to fight back
          </h2>
          
          <div className="space-y-8">
            {[
              {
                title: "robots.txt",
                icon: "⚙️",
                gradient: "from-orange-400 to-red-500",
                description: "Have a small, hidden file on your website that politely tells major search engines (like Google) not to show certain pages in their search results."
              },
              {
                title: "Rate Limiting",
                icon: "⚡",
                gradient: "from-blue-400 to-purple-500",
                description: "Program your website to notice when one computer asks for content too quickly, too many times in a row."
              },
              {
                title: "IP & User-Agent Blocking",
                icon: "🛡️",
                gradient: "from-green-400 to-teal-500",
                description: "If you see a specific computer address (IP) or software signature (User-Agent) that keeps stealing content, use a security tool to block them completely."
              },
              {
                title: "JavaScript & API Keys",
                icon: "🔐",
                gradient: "from-purple-400 to-pink-500",
                description: "For special, programmatic access to your content, only allow it if the user provides a unique, authorized digital code (the API Key)."
              },
              {
                title: "Content Obfuscation",
                icon: "👁️",
                gradient: "from-yellow-400 to-orange-500",
                description: "Add invisible digital watermarks or unique tracking codes to your text and images."
              },
              {
                title: "Monitoring & Analysis",
                icon: "📊",
                gradient: "from-indigo-400 to-blue-500",
                description: "Regularly look at your website traffic reports to spot strange behavior—like one user visiting 5,000 pages in an hour or accessing pages in a weird order."
              }
            ].map((item, index) => (
              <ProtectionMethod key={index} item={item} />
            ))}
          </div>

          {/* Blog Posts Section */}
          <div className="mt-20">
            <h3 className="font-bold text-black text-center mb-12 leading-tight" style={{fontSize: '32px'}}>
              Learn More: Cloudflare AI Protection Resources
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Introducing Bot Fight Mode",
                  description: "How Cloudflare's free bot protection helps block malicious crawlers and scrapers from your website",
                  date: "December 2024",
                  readTime: "5 min read",
                  category: "Security"
                },
                {
                  title: "Rate Limiting for AI Scraping Prevention", 
                  description: "Configure advanced rate limiting rules to protect your content from automated data collection",
                  date: "November 2024",
                  readTime: "7 min read",
                  category: "Protection"
                },
                {
                  title: "WAF Rules Against AI Crawlers",
                  description: "Custom Web Application Firewall rules to identify and block AI training bots",
                  date: "November 2024", 
                  readTime: "8 min read",
                  category: "Security"
                },
                {
                  title: "Analytics for Bot Detection",
                  description: "Use Cloudflare Analytics to identify suspicious traffic patterns and potential AI scrapers",
                  date: "October 2024",
                  readTime: "6 min read",
                  category: "Analytics"
                },
                {
                  title: "IP Intelligence and Reputation",
                  description: "Leverage Cloudflare's threat intelligence to automatically block known scraping IPs",
                  date: "October 2024",
                  readTime: "4 min read",
                  category: "Intelligence"
                },
                {
                  title: "Page Rules for Content Protection",
                  description: "Strategic page rules and redirects to prevent unauthorized access to valuable content",
                  date: "September 2024",
                  readTime: "5 min read",
                  category: "Configuration"
                }
              ].map((post, index) => (
                <article 
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 hover:border-orange-200"
                >
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      post.category === 'Security' ? 'bg-red-100 text-red-800' :
                      post.category === 'Protection' ? 'bg-orange-100 text-orange-800' :
                      post.category === 'Analytics' ? 'bg-blue-100 text-blue-800' :
                      post.category === 'Intelligence' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.category}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-3 text-lg leading-tight hover:text-orange-600 cursor-pointer">
                    {post.title}
                  </h4>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {post.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <a 
                href="https://blog.cloudflare.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg inline-block"
              >
                View All Blog Posts
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
          className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center text-white text-xl`}
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

