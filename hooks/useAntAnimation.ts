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
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.2, // Faster horizontal speed
      vy: (Math.random() - 0.5) * 1.2, // Faster vertical speed
      size: 35 + Math.random() * 15, // Much larger ant size 35-50px
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

      // Bounce off edges
      if (ant.x < 0 || ant.x > canvas.width) ant.vx *= -1;
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
