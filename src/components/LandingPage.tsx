import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useShapesAnimation } from '../hooks/useShapesAnimation';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isColorfulRef = useRef(false);
  const { canvasRef, transformToColorful, transformToGrey, continueShapesInBackground, exitShapes } = useShapesAnimation();
  const [protectionLevel, setProtectionLevel] = useState(0);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const prevProtectionLevelRef = useRef(0);

  const protectionHeadingGradientClass = useMemo(() => {
    switch (protectionLevel) {
      case 0:
        return 'from-orange-500 to-red-500';
      case 1:
        return 'from-blue-500 to-purple-500';
      case 2:
        return 'from-green-500 to-teal-500';
      case 3:
      default:
        return 'from-pink-500 to-fuchsia-500';
    }
  }, [protectionLevel]);

  const protectionLevelGradientClass = useMemo(() => {
    return [
      'from-orange-500 to-red-500',
      'from-blue-500 to-purple-500',
      'from-green-500 to-teal-500',
      'from-pink-500 to-fuchsia-500'
    ];
  }, []);

  const protectionConfigs = useMemo(
    () => [
      {
        name: 'Open for AI',
        summary: 'Maximize discoverability. Allow known AI crawlers, but keep basic visibility into what is happening.',
        products: ['AI Crawl Control (Allow rules)', 'Bot analytics / basic visibility'],
        tips: ['Publish a clear AI policy page and link it in robots.txt', 'Monitor top user agents and crawl volume weekly']
      },
      {
        name: 'Selective Access',
        summary: 'Allow some bots and shape access to high-value routes. Protect sensitive paths without locking down your entire site.',
        products: ['AI Crawl Control (Allow/Block by bot)', 'WAF rules for sensitive paths', 'Rate Limiting (moderate)'],
        tips: ['Separate policies for /public vs /premium paths', 'Maintain an allowlist for beneficial crawlers']
      },
      {
        name: 'Controlled',
        summary: 'Default to deny for unknown automation. Challenge suspicious requests and tighten thresholds to reduce scraping at scale.',
        products: ['Bot Management (advanced)', 'Challenge / Turnstile for suspicious traffic', 'Stricter anomaly thresholds'],
        tips: ['Alert on spikes in bot-originated 2xx responses', 'Use session-based access to distinguish humans vs automation']
      },
      {
        name: 'Locked down unless paid',
        summary: 'Monetize access. If an AI agent wants content, require payment or a contract before granting crawl permission.',
        products: ['Pay Per Crawl / Charge rules', '402 Payment Required enforcement', 'Contract-based API access (keys + quotas)'],
        tips: ['Define pricing by route/value (e.g., premium archives)', 'Provide a paid API as the “right way” to access content']
      }
    ],
    []
  );

  const visibleConfigs = protectionConfigs.slice(0, protectionLevel + 1);

  const blogPosts = useMemo(() => [
    { 
      title: "Content Signals Policy", 
      url: "https://blog.cloudflare.com/content-signals-policy/",
      author: "Cloudflare Team",
      blurb: "Learn how Cloudflare's Content Signals help creators control how their content is used by AI models."
    },
    { 
      title: "Good AI Bots", 
      url: "https://goodaibots.com/",
      author: "Good AI Bots Team",
      blurb: "A comprehensive directory and guide to identifying helpful AI crawlers versus harmful scrapers."
    },
    { 
      title: "AI Insights from Cloudflare Radar", 
      url: "https://radar.cloudflare.com/ai-insights",
      author: "Cloudflare Radar",
      blurb: "Explore real-time data and global trends on AI traffic, bot activity, and Internet usage patterns."
    },
    { 
      title: "Perplexity Case Study", 
      url: "https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/",
      author: "Security Team",
      blurb: "An analysis of how undeclared crawlers attempt to bypass standard robot exclusion protocols to access content."
    },
    { 
      title: "People Inc.'s commentary", 
      url: "https://techcrunch.com/2025/11/04/people-inc-forges-ai-licensing-deal-with-microsoft-as-google-traffic-drops/",
      author: "TechCrunch",
      blurb: "Insights on the shifting landscape of search traffic, AI licensing deals, and the future of web monetization."
    },
    { 
      title: "Content Independence Day", 
      url: "https://blog.cloudflare.com/content-independence-day-no-ai-crawl-without-compensation/",
      author: "Matthew Prince",
      blurb: "Why creators deserve fair compensation and complete control over if and how their work trains AI models."
    },
    { 
      title: "An AI Index for all our customers", 
      url: "https://blog.cloudflare.com/an-ai-index-for-all-our-customers/",
      author: "Product Team",
      blurb: "Providing visibility into which AI bots are accessing your site, how often, and what they are doing."
    },
    { 
      title: "Choice: the path to AI sovereignty", 
      url: "https://blog.cloudflare.com/sovereign-ai-and-choice/",
      author: "Sam Rhea",
      blurb: "Empowering website owners to decide if and how their data is used for training, ensuring data sovereignty."
    },
    { 
      title: "Building unique, per-customer defenses against advanced bot threats in the AI era", 
      url: "https://blog.cloudflare.com/per-customer-bot-defenses/",
      author: "Engineering Team",
      blurb: "How tailored security measures protect against sophisticated, targeted AI scraping attacks."
    },
    { 
      title: "Cloudflare Confidence Scorecards - making AI safer for the Internet", 
      url: "https://blog.cloudflare.com/cloudflare-confidence-scorecards-making-ai-safer-for-the-internet/",
      author: "Trust & Safety",
      blurb: "A new standard for evaluating the safety, reliability, and transparency of AI agents on the web."
    },
    { 
      title: "Helping protect journalists and local news from AI crawlers with Project Galileo", 
      url: "https://blog.cloudflare.com/ai-crawl-control-for-project-galileo/",
      author: "Impact Team",
      blurb: "Project Galileo's initiative to safeguard news organizations from uncompensated scraping and data theft."
    },
    { 
      title: "The crawl-to-click gap: Cloudflare data on AI bots, training, and referrals", 
      url: "https://blog.cloudflare.com/crawlers-click-ai-bots-training/",
      author: "Data Science Team",
      blurb: "Analyzing the disparity between how much AI bots crawl content versus how much traffic they refer back to creators."
    }
  ], []);

  const visibleBlogPosts = showAllBlogs ? blogPosts : blogPosts.slice(0, 6);

  
  useEffect(() => {
    try {
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

    } catch (e) {
      console.error('LandingPage animation error:', e);
    }

    return () => {
      try {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, [transformToColorful, transformToGrey, continueShapesInBackground, exitShapes]);

  useEffect(() => {
    const prev = prevProtectionLevelRef.current;

    if (protectionLevel > prev) {
      const newLevels = Array.from({ length: protectionLevel - prev }, (_, i) => prev + i + 1);
      gsap.delayedCall(0, () => {
        newLevels.forEach((levelIdx) => {
          const el = document.querySelector(`[data-protection-col="${levelIdx}"]`);
          if (!el) return;
          gsap.fromTo(
            el,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
          );
        });
      });
    }

    prevProtectionLevelRef.current = protectionLevel;
  }, [protectionLevel]);

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
            {/* Left Arrow */}
            <button 
              id="carousel-left"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-orange-500/80 transition-all duration-300 hover:border-orange-400"
              onClick={() => {
                const carousel = document.getElementById('video-carousel');
                if (carousel) {
                  carousel.scrollBy({ left: -320, behavior: 'smooth' });
                }
              }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button 
              id="carousel-right"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-orange-500/80 transition-all duration-300 hover:border-orange-400"
              onClick={() => {
                const carousel = document.getElementById('video-carousel');
                if (carousel) {
                  carousel.scrollBy({ left: 320, behavior: 'smooth' });
                }
              }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div id="video-carousel" className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
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
        </div>
      </section>

      {/* Section 4: Protect your content */}
      <section id="section-4" className="relative py-20 bg-white">
        <div className="w-full">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-bold text-center mb-8 leading-tight" style={{fontSize: '40px'}}>
              <span className={`bg-gradient-to-r ${protectionHeadingGradientClass} bg-clip-text text-transparent`}>
                How much protection do you need?
              </span>
            </h2>
          </div>

          <div className="max-w-6xl mx-auto px-6">
            <div className="relative py-4">
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={protectionLevel}
                onChange={(e) => setProtectionLevel(Number(e.target.value))}
                aria-label="Protection level"
                className="w-full accent-orange-500 h-2 cursor-grab active:cursor-grabbing"
                style={{ touchAction: 'pan-y' }}
              />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {protectionConfigs.map((c, idx) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setProtectionLevel(idx)}
                  className="text-center"
                >
                  <div
                    className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      idx === protectionLevel
                        ? `bg-gradient-to-r ${protectionLevelGradientClass[idx]} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className={`mt-2 text-[11px] font-semibold leading-tight ${idx === protectionLevel ? 'text-gray-900' : 'text-gray-600'}`}>
                    {c.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleConfigs.map((cfg, cfgIdx) => (
                <div
                  key={cfg.name}
                  data-protection-col={cfgIdx}
                  className="border border-gray-200 rounded-2xl p-6 bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-gray-500">Level {cfgIdx + 1}</div>
                      <h3 className="font-bold text-gray-900 mt-1" style={{fontSize: '20px'}}>
                        {cfg.name}
                      </h3>
                    </div>
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-r ${protectionLevelGradientClass[cfgIdx]} text-white font-bold flex items-center justify-center flex-shrink-0`}>
                      {cfgIdx + 1}
                    </div>
                  </div>

                  <p className="text-gray-700 mt-3 leading-relaxed" style={{fontSize: '14px'}}>
                    {cfg.summary}
                  </p>

                  <div className="mt-5">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Products</div>
                    <div className="mt-3 space-y-3">
                      {cfg.products.map((p, i) => (
                        <div key={`${cfg.name}-p-${i}`} className="flex items-start gap-3">
                          <div
                            className={`mt-1 w-3 h-3 rounded-full bg-gradient-to-r ${
                              (cfgIdx + i) % 4 === 0
                                ? 'from-orange-500 to-red-500'
                                : (cfgIdx + i) % 4 === 1
                                  ? 'from-blue-500 to-purple-500'
                                  : (cfgIdx + i) % 4 === 2
                                    ? 'from-green-500 to-teal-500'
                                    : 'from-pink-500 to-fuchsia-500'
                            } flex-shrink-0`}
                          />
                          <div className="text-gray-800" style={{fontSize: '14px'}}>
                            {p}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 text-[11px] font-bold uppercase tracking-wide text-gray-500">Tips</div>
                    <div className="mt-3 space-y-3">
                      {cfg.tips.map((t, i) => (
                        <div key={`${cfg.name}-t-${i}`} className="flex items-start gap-3">
                          <div
                            className={`mt-1 w-3 h-3 rounded-full bg-gradient-to-r ${
                              (cfgIdx + i + 2) % 4 === 0
                                ? 'from-orange-500 to-red-500'
                                : (cfgIdx + i + 2) % 4 === 1
                                  ? 'from-blue-500 to-purple-500'
                                  : (cfgIdx + i + 2) % 4 === 2
                                    ? 'from-green-500 to-teal-500'
                                    : 'from-pink-500 to-fuchsia-500'
                            } flex-shrink-0`}
                          />
                          <div className="text-gray-800" style={{fontSize: '14px'}}>
                            {t}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mt-12">
              <a
                href="#resources-section"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg hover:from-orange-600 hover:to-red-600 font-bold transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
                style={{fontSize: '18px'}}
              >
                Learn How to Protect Your Content
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Blog/Resources */}
      <section id="resources-section" className="relative py-20 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-bold text-center mb-12 text-gray-900 leading-tight" style={{fontSize: '40px'}}>
            Learn more about AI & Content Protection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleBlogPosts.map((post, index) => (
              <a 
                key={index}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-orange-200 group h-full"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">
                      {post.author}
                    </span>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transform group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-orange-600 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {post.blurb}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAllBlogs(!showAllBlogs)}
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              {showAllBlogs ? 'Show Less' : 'Show More Resources'}
              <svg className={`ml-2 -mr-1 h-4 w-4 transform transition-transform ${showAllBlogs ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
