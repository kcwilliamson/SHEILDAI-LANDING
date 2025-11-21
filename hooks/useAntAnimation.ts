'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Ant {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  id: number;
}

export const useAntAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const antsRef = useRef<Ant[]>([]);
  const animationRef = useRef<number>(0);
  const backgroundColorRef = useRef('#8B5CF6'); // Start with purple
  const antImageRef = useRef<HTMLImageElement | null>(null);

  const antColor = '#F6821F'; // Orange color for ants

  const createAnt = (id: number): Ant => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not found');

    return {
      x: canvas.width * 0.6 + Math.random() * (canvas.width * 0.3), // Start from right side
      y: canvas.height * 0.3 + Math.random() * (canvas.height * 0.4), // Middle vertical area
      vx: -0.8 - Math.random() * 0.4, // Always move left
      vy: (Math.random() - 0.5) * 0.5, // Slower vertical movement
      size: 30 + Math.random() * 10, // Ant size 30-40px
      rotation: Math.random() * Math.PI * 2,
      id
    };
  };

  const drawAnt = (ctx: CanvasRenderingContext2D, ant: Ant) => {
    if (!antImageRef.current) return;

    ctx.save();
    ctx.translate(ant.x, ant.y);
    ctx.rotate(ant.rotation);

    // Draw the PNG image centered at the ant's position
    const imageSize = ant.size;
    ctx.drawImage(
      antImageRef.current,
      -imageSize / 2,
      -imageSize / 2,
      imageSize,
      imageSize
    );

    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with current background color
    ctx.fillStyle = backgroundColorRef.current;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw ants
    antsRef.current.forEach(ant => {
      // Update position
      ant.x += ant.vx;
      ant.y += ant.vy;

      // Update rotation based on movement
      ant.rotation = Math.atan2(ant.vy, ant.vx);

      // Stack behavior: when ants reach the left edge, they stack up
      if (ant.x <= 30) {
        ant.x = 30; // Stop at left edge
        ant.vx = 0; // Stop horizontal movement
        ant.vy *= 0.9; // Gradually slow down vertical movement
        
        // Stack ants on top of each other
        const stackHeight = 40;
        const antsAtEdge = antsRef.current.filter(a => a.x <= 35).length;
        ant.y = canvas.height * 0.7 - (antsAtEdge * stackHeight * 0.3);
      }

      // Bounce off top/bottom edges only
      if (ant.y < 0 || ant.y > canvas.height) ant.vy *= -1;

      // Keep within bounds
      ant.x = Math.max(0, Math.min(canvas.width, ant.x));
      ant.y = Math.max(0, Math.min(canvas.height, ant.y));

      drawAnt(ctx, ant);
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  const startSingleAnt = () => {
    antsRef.current = [createAnt(0)];
  };

  const addMoreAnts = (count: number = 5) => {
    const currentCount = antsRef.current.length;
    for (let i = 0; i < count; i++) {
      antsRef.current.push(createAnt(currentCount + i));
    }
  };

  const addAntsFromOffScreen = (count: number = 10) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const currentCount = antsRef.current.length;
    for (let i = 0; i < count; i++) {
      const ant = createAnt(currentCount + i);
      // Position ants off-screen initially
      const side = Math.floor(Math.random() * 4);
      switch (side) {
        case 0: // top
          ant.x = Math.random() * canvas.width;
          ant.y = -50;
          break;
        case 1: // right
          ant.x = canvas.width + 50;
          ant.y = Math.random() * canvas.height;
          break;
        case 2: // bottom
          ant.x = Math.random() * canvas.width;
          ant.y = canvas.height + 50;
          break;
        case 3: // left
          ant.x = -50;
          ant.y = Math.random() * canvas.height;
          break;
      }
      antsRef.current.push(ant);
    }
  };

  const resetToSingleAnt = () => {
    antsRef.current = [createAnt(0)];
    backgroundColorRef.current = '#8B5CF6'; // Reset to purple
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load the ant PNG image
    const loadAntImage = () => {
      const img = new Image();
      img.onload = () => {
        antImageRef.current = img;
        // Start animation after image is loaded
        startSingleAnt();
        animate();
      };
      img.onerror = () => {
        console.error('Failed to load ant image');
        // Fallback: start animation anyway (will not show ants but prevent errors)
        startSingleAnt();
        animate();
      };
      img.src = 'https://pub-aa908c10829e4ed6b353da031aeb7c2b.r2.dev/Content%20Protection/ant.png';
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    loadAntImage();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    canvasRef,
    startSingleAnt,
    addMoreAnts,
    addAntsFromOffScreen,
    resetToSingleAnt
  };
};
