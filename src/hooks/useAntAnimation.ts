'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

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

  const createAnt = (id: number): Ant => {
    const canvas = canvasRef.current;
    
    // Fallback if canvas is not ready
    if (!canvas) {
      return {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 0,
        rotation: 0,
        id
      };
    }

    return {
      x: canvas.width * 0.7 + Math.random() * (canvas.width * 0.25), // Start from right side of larger canvas
      y: canvas.height * 0.2 + Math.random() * (canvas.height * 0.6), // Spread across more vertical area
      vx: -1.5 - Math.random() * 0.8, // Faster leftward movement for larger space
      vy: (Math.random() - 0.5) * 0.8, // Slightly more vertical movement
      size: 40 + Math.random() * 20, // Larger ants for bigger canvas (40-60px)
      rotation: Math.random() * Math.PI * 2,
      id
    };
  };

  const drawAnt = (ctx: CanvasRenderingContext2D, ant: Ant) => {
    if (!antImageRef.current) return;

    ctx.save();
    ctx.translate(ant.x, ant.y);
    ctx.rotate(ant.rotation);

    // Draw the PNG image centered at the ant's position (original orange color)
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
      if (ant.x <= 60) {
        ant.x = 60; // Stop at left edge (more space for larger canvas)
        ant.vx = 0; // Stop horizontal movement
        ant.vy *= 0.9; // Gradually slow down vertical movement
        
        // Stack ants more densely for pushing effect
        const stackHeight = 50;
        const antsAtEdge = antsRef.current.filter(a => a.x <= 70).length;
        const stackLayers = Math.floor(antsAtEdge / 8) + 1; // Create layers
        const positionInLayer = antsAtEdge % 8;
        
        ant.x = 60 + (positionInLayer * 15); // Spread ants horizontally in stack
        ant.y = canvas.height * 0.8 - (stackLayers * stackHeight * 0.6);
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

  const startSequentialAntAnimation = () => {
    // Clear any existing ants
    antsRef.current = [];
    
    // Start with one ant crawling across
    const firstAnt = createAnt(0);
    antsRef.current = [firstAnt];
    
    // Add several more ants over time - they'll just crawl naturally
    gsap.delayedCall(1, () => {
      addMoreAnts(5); // Add some ants
    });
    
    gsap.delayedCall(2, () => {
      addMoreAnts(8); // Add more ants
    });
    
    gsap.delayedCall(3, () => {
      addMoreAnts(10); // Add even more ants
    });
    
    gsap.delayedCall(4, () => {
      addMoreAnts(12); // Final batch of ants
    });
    
    // No coordinated movement - ants just crawl naturally across the box
    // The box movement will be handled separately in the main component
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
    resetToSingleAnt,
    startSequentialAntAnimation
  };
};
