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
}

export const useShapesAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const animationRef = useRef<number>();
  const isColorfulRef = useRef(false);

  const colors = {
    grey: '#666666',
    colorful: ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'] // purple, green, yellow, blue, red
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
    ];

    const shapeTypes: Shape['type'][] = ['circle', 'triangle', 'roundedRect'];
    const shapes = [
      'triangle', 'triangle', 'roundedRect', 'roundedRect', 
      'roundedRect', 'circle', 'circle', 'roundedRect'
    ];
    
    const position = networkPositions[id] || networkPositions[0];
    const type = shapes[id] as Shape['type'] || 'circle';
    const colorfulColor = colors.colorful[id % colors.colorful.length];

    return {
      x: position.x * canvas.width,
      y: position.y * canvas.height,
      vx: 0, // Start stationary
      vy: 0,
      size: id < 2 ? 80 : (id < 4 ? 100 : 70), // Varied sizes like the image
      type,
      color: colors.grey,
      originalColor: colorfulColor,
      id
    };
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

    // Predefined network connections to match the reference image
    const connections = [
      [0, 1], [1, 2], [2, 7], [7, 6], [6, 5], [5, 4], [4, 3], [3, 0], // outer ring
      [0, 4], [1, 7], [2, 5], [3, 6], // cross connections
      [1, 4], [2, 6] // additional strategic connections
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
      // Update position
      shape.x += shape.vx;
      shape.y += shape.vy;

      // Wrap around edges
      if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
      if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
      if (shape.y > canvas.height + shape.size) shape.y = -shape.size;
      if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
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
    shapesRef.current = Array.from({ length: 8 }, (_, i) => createShape(i));
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

  const transformToGrey = () => {
    isColorfulRef.current = false;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const networkPositions = [
      { x: 0.15, y: 0.25 }, { x: 0.5, y: 0.15 }, { x: 0.85, y: 0.3 },
      { x: 0.12, y: 0.65 }, { x: 0.3, y: 0.8 }, { x: 0.7, y: 0.75 },
      { x: 0.88, y: 0.6 }, { x: 0.6, y: 0.45 }
    ];
    
    shapesRef.current.forEach((shape, index) => {
      const position = networkPositions[index] || networkPositions[0];
      
      gsap.to(shape, {
        duration: 1.5,
        color: colors.grey,
        x: position.x * canvas.width,
        y: position.y * canvas.height,
        vx: 0, // Stop movement
        vy: 0,
        ease: "power2.out"
      });
    });
  };

  const continueShapesInBackground = () => {
    // Keep shapes moving but more subtly in the background
    shapesRef.current.forEach((shape, index) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.3; // Slower movement
      
      gsap.to(shape, {
        duration: 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ease: "power2.out"
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
    continueShapesInBackground,
    exitShapes
  };
};
