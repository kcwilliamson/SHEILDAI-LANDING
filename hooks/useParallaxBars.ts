'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const useParallaxBars = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barsRef = useRef<Array<{
    color: string;
    width: number;
    height: number;
    y: number;
    progress: number;
  }>>([]);

  const colors = [
    '#E91E63', // Pink
    '#CDDC39', // Yellow-Green  
    '#2196F3', // Blue
    '#FF5722', // Orange
    '#4CAF50', // Green
    '#8B5CF6', // Purple (matches ant section)
  ];

  const initializeBars = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    barsRef.current = colors.map((color, index) => ({
      color,
      width: 0, // Start with no width
      height: canvas.height / colors.length,
      y: (canvas.height / colors.length) * index,
      progress: 0
    }));
  };

  const renderBars = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bars with rounded right edges
    barsRef.current.forEach(bar => {
      ctx.fillStyle = bar.color;
      
      const radius = bar.height / 2; // Radius for rounded right edge
      
      if (bar.width <= radius) {
        // If width is less than radius, just draw a circle
        ctx.beginPath();
        ctx.arc(radius, bar.y + radius, Math.min(radius, bar.width), 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw rectangle with rounded right edge
        ctx.beginPath();
        ctx.moveTo(0, bar.y);
        ctx.lineTo(bar.width - radius, bar.y); // Top edge
        ctx.arc(bar.width - radius, bar.y + radius, radius, -Math.PI / 2, Math.PI / 2); // Right rounded edge
        ctx.lineTo(0, bar.y + bar.height); // Bottom edge
        ctx.lineTo(0, bar.y); // Left edge
        ctx.closePath();
        ctx.fill();
      }
    });
  };

  const animateBars = (progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update bar widths based on scroll progress
    barsRef.current.forEach((bar, index) => {
      // Reverse stagger - bottom bars (higher index) start first, all reach full width
      const totalBars = barsRef.current.length;
      const reverseIndex = totalBars - 1 - index; // Flip the order
      const startProgress = reverseIndex * 0.08;
      const endProgress = 0.85; // All bars complete by 85% of scroll progress
      const barProgress = Math.max(0, Math.min(1, (progress - startProgress) / (endProgress - startProgress)));
      
      // Ease the progress for smoother animation
      const easedProgress = gsap.parseEase("power2.out")(Math.min(1, barProgress));
      
      bar.width = canvas.width * easedProgress;
      bar.progress = easedProgress;
    });

    renderBars();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gsap.registerPlugin(ScrollTrigger);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeBars();
      renderBars();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create ScrollTrigger for parallax animation
    ScrollTrigger.create({
      trigger: ".content-section",
      start: "center bottom", // Start when halfway through section
      end: "bottom top",
      scrub: 1, // Smooth scrubbing
      onUpdate: (self) => {
        animateBars(self.progress);
      },
      onRefresh: () => {
        initializeBars();
        renderBars();
      }
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      ScrollTrigger.getAll().forEach(trigger => {
        const triggerElement = trigger.trigger;
        if (triggerElement && typeof triggerElement === 'object' && 'classList' in triggerElement) {
          if ((triggerElement as Element).classList.contains('content-section')) {
            trigger.kill();
          }
        }
      });
    };
  }, []);

  return {
    canvasRef
  };
};
