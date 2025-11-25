'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Shape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'circle' | 'triangle' | 'roundedRect';
  color: string;
  originalColor: string;
  id: number;
  centerX?: number;
  centerY?: number;
  floatRadius?: number;
  floatSpeed?: number;
  floatAngle?: number;
}

export const useShapesAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const animationRef = useRef<number | null>(null);
  const isColorfulRef = useRef(false);

  const colors = {
    grey: '#666666',
    colorful: ['#E80954', '#CCFF00', '#0764E5', '#F6821F', '#2DB35E', '#8D1EB1']
  };

  const createShape = (id: number): Shape => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not found');

    // Predefined network positions around the center text area
    const networkPositions = [
      { x: 0.15, y: 0.25 }, // top-left
      { x: 0.5, y: 0.15 },  // top-center  
      { x: 0.85, y: 0.3 },  // top-right
      { x: 0.12, y: 0.65 }, // bottom-left
      { x: 0.3, y: 0.8 },   // bottom-left-center
      { x: 0.7, y: 0.75 },  // bottom-right-center
      { x: 0.88, y: 0.6 },  // bottom-right
      { x: 0.6, y: 0.45 },  // right-middle
      { x: 0.08, y: 0.45 }, // left-middle
      { x: 0.25, y: 0.35 }, // left-center
      { x: 0.75, y: 0.25 }, // top-right-center
      { x: 0.4, y: 0.6 },   // center-bottom
      { x: 0.92, y: 0.4 },  // far-right
      { x: 0.05, y: 0.8 },  // far-bottom-left
    ];

    const shapeTypes: Shape['type'][] = ['circle', 'triangle', 'roundedRect'];
    const shapes = [
      'triangle', 'triangle', 'roundedRect', 'roundedRect', 
      'roundedRect', 'circle', 'circle', 'roundedRect',
      'circle', 'triangle', 'roundedRect', 'triangle',
      'circle', 'roundedRect'
    ];
    
    const position = networkPositions[id] || networkPositions[0];
    const type = shapes[id] as Shape['type'] || 'circle';
    const colorfulColor = colors.colorful[id % colors.colorful.length];

    // Add subtle floating movement for grey network state
    const floatRadius = 15 + (id % 4) * 5; // Varied radius for floating (15-30px)
    const angle = (id / 14) * Math.PI * 2; // Distribute angles evenly for 14 shapes
    const speed = 0.015 + (id % 4) * 0.008; // Varied speeds

    return {
      x: position.x * canvas.width,
      y: position.y * canvas.height,
      vx: Math.cos(angle) * speed, // Gentle floating movement
      vy: Math.sin(angle) * speed,
      size: id < 2 ? 80 : (id < 6 ? 90 : (id < 10 ? 75 : 65)), // More varied sizes
      type,
      color: colors.grey,
      originalColor: colorfulColor,
      id,
      // Add properties for floating animation
      centerX: position.x * canvas.width,
      centerY: position.y * canvas.height,
      floatRadius,
      floatSpeed: speed,
      floatAngle: angle
    } as Shape & { centerX: number; centerY: number; floatRadius: number; floatSpeed: number; floatAngle: number };
  };

  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.fillStyle = shape.color;
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 2;

    switch (shape.type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y - shape.size / 2);
        ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size / 2);
        ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size / 2);
        ctx.closePath();
        ctx.fill();
        break;
      
      case 'roundedRect':
        const radius = 12;
        const x = shape.x - shape.size / 2;
        const y = shape.y - shape.size / 2;
        ctx.beginPath();
        ctx.roundRect(x, y, shape.size, shape.size, radius);
        ctx.fill();
        break;
    }
  };

  const drawConnections = (ctx: CanvasRenderingContext2D, shapes: Shape[]) => {
    if (isColorfulRef.current) return; // Don't draw connections when colorful

    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;

    // Predefined network connections for enhanced network
    const connections = [
      // Original outer ring
      [0, 1], [1, 2], [2, 7], [7, 6], [6, 5], [5, 4], [4, 3], [3, 0],
      // Original cross connections
      [0, 4], [1, 7], [2, 5], [3, 6], [1, 4], [2, 6],
      // New connections for additional shapes
      [8, 9], [9, 0], [9, 3], [8, 4], // left side connections
      [10, 1], [10, 2], [10, 7], [11, 7], [11, 5], // top and center connections
      [12, 2], [12, 7], [12, 6], // right side connections
      [13, 3], [13, 4], [13, 5], // bottom connections
      [8, 11], [9, 11], [11, 6] // interconnections
    ];

    connections.forEach(([i, j]) => {
      if (shapes[i] && shapes[j]) {
        ctx.beginPath();
        ctx.moveTo(shapes[i].x, shapes[i].y);
        ctx.lineTo(shapes[j].x, shapes[j].y);
        ctx.stroke();
      }
    });
    
    ctx.globalAlpha = 1;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw shapes
    shapesRef.current.forEach(shape => {
      if (!isColorfulRef.current && shape.centerX && shape.centerY && shape.floatRadius && shape.floatSpeed) {
        // Floating animation for grey network state
        shape.floatAngle! += shape.floatSpeed;
        shape.x = shape.centerX + Math.cos(shape.floatAngle!) * shape.floatRadius;
        shape.y = shape.centerY + Math.sin(shape.floatAngle!) * shape.floatRadius;
      } else {
        // Normal movement for colorful state
        shape.x += shape.vx;
        shape.y += shape.vy;

        // Wrap around edges for colorful state
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        // For vertical wrapping, only wrap from bottom to top (downward flow)
        if (shape.y > canvas.height + shape.size) {
          shape.y = -shape.size;
          shape.x = Math.random() * canvas.width; // Randomize horizontal position when wrapping
        }
        if (shape.y < -shape.size * 2) shape.y = -shape.size; // Prevent going too high up
      }
    });

    // Draw connections first (behind shapes)
    drawConnections(ctx, shapesRef.current);

    // Draw shapes
    shapesRef.current.forEach(shape => {
      drawShape(ctx, shape);
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  const initializeShapes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create initial shapes
    shapesRef.current = Array.from({ length: 14 }, (_, i) => createShape(i));
  };

  const transformToColorful = () => {
    isColorfulRef.current = true;
    
    shapesRef.current.forEach((shape, index) => {
      // Generate random movement direction for separation
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.0;
      
      gsap.to(shape, {
        duration: 1.5,
        color: shape.originalColor,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ease: "power2.out"
      });
    });
  };

  const turnGreyWithConnections = () => {
    isColorfulRef.current = false;
    
    shapesRef.current.forEach((shape, index) => {
      // Turn shapes grey at their current positions and stop movement
      gsap.to(shape, {
        duration: 1.5,
        color: colors.grey,
        vx: 0, // Stop movement
        vy: 0,
        ease: "power2.out"
      });
    });
  };

  const transformToGrey = () => {
    isColorfulRef.current = false;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const networkPositions = [
      { x: 0.15, y: 0.25 }, { x: 0.5, y: 0.15 }, { x: 0.85, y: 0.3 },
      { x: 0.12, y: 0.65 }, { x: 0.3, y: 0.8 }, { x: 0.7, y: 0.75 },
      { x: 0.88, y: 0.6 }, { x: 0.6, y: 0.45 }, { x: 0.08, y: 0.45 },
      { x: 0.25, y: 0.35 }, { x: 0.75, y: 0.25 }, { x: 0.4, y: 0.6 },
      { x: 0.92, y: 0.4 }, { x: 0.05, y: 0.8 }
    ];
    
    shapesRef.current.forEach((shape, index) => {
      const position = networkPositions[index] || networkPositions[0];
      
      // Reset floating properties
      shape.centerX = position.x * canvas.width;
      shape.centerY = position.y * canvas.height;
      shape.floatRadius = 15 + (index % 4) * 5;
      shape.floatSpeed = 0.015 + (index % 4) * 0.008;
      shape.floatAngle = (index / 14) * Math.PI * 2;
      
      gsap.to(shape, {
        duration: 1.5,
        color: colors.grey,
        x: position.x * canvas.width,
        y: position.y * canvas.height,
        vx: 0, // Stop linear movement
        vy: 0,
        ease: "power2.out"
      });
    });
  };

  const continueShapesInBackground = () => {
    // Make shapes float energetically in all directions like creative people
    shapesRef.current.forEach((shape, index) => {
      // Random direction and speed - energetic but smooth
      const angle = Math.random() * Math.PI * 2; // Any direction
      const speed = 0.5 + Math.random() * 0.8; // More energetic movement
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      
      gsap.to(shape, {
        duration: 2 + Math.random() * 3, // Varied timing for organic feel
        vx: vx,
        vy: vy,
        ease: "power2.inOut",
        onComplete: () => {
          // Recursively continue the energetic movement
          if (isColorfulRef.current) {
            const newAngle = Math.random() * Math.PI * 2;
            const newSpeed = 0.5 + Math.random() * 0.8;
            gsap.to(shape, {
              duration: 2 + Math.random() * 3,
              vx: Math.cos(newAngle) * newSpeed,
              vy: Math.sin(newAngle) * newSpeed,
              ease: "power2.inOut"
            });
          }
        }
      });
    });
  };

  const exitShapes = () => {
    shapesRef.current.forEach((shape, index) => {
      gsap.to(shape, {
        duration: 2,
        x: Math.random() > 0.5 ? -200 : window.innerWidth + 200,
        y: Math.random() > 0.5 ? -200 : window.innerHeight + 200,
        delay: index * 0.1,
        ease: "power2.in"
      });
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    initializeShapes();
    animate();

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
    transformToColorful,
    transformToGrey,
    turnGreyWithConnections,
    continueShapesInBackground,
    exitShapes
  };
};
