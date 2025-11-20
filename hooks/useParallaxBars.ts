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

    // Draw bars
    barsRef.current.forEach(bar => {
      ctx.fillStyle = bar.color;
      ctx.fillRect(0, bar.y, bar.width, bar.height);
    });
  };

  const animateBars = (progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update bar widths based on scroll progress
    barsRef.current.forEach((bar, index) => {
      // Stagger the animation - each bar starts at a different progress point
      const startProgress = index * 0.1;
      const barProgress = Math.max(0, (progress - startProgress) / (1 - startProgress));
      
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
