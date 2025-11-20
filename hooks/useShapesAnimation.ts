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

    const shapeTypes: Shape['type'][] = ['circle', 'triangle', 'roundedRect'];
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const colorfulColor = colors.colorful[Math.floor(Math.random() * colors.colorful.length)];

    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 40 + Math.random() * 60,
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
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;

    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const dx = shapes[i].x - shapes[j].x;
        const dy = shapes[i].y - shapes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          ctx.beginPath();
          ctx.moveTo(shapes[i].x, shapes[i].y);
          ctx.lineTo(shapes[j].x, shapes[j].y);
          ctx.stroke();
        }
      }
    }
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
    shapesRef.current = Array.from({ length: 6 }, (_, i) => createShape(i));
  };

  const transformToColorful = () => {
    isColorfulRef.current = true;
    
    shapesRef.current.forEach(shape => {
      gsap.to(shape, {
        duration: 1.5,
        color: shape.originalColor,
        vx: shape.vx * 2, // Increase movement speed
        vy: shape.vy * 2,
        ease: "power2.out"
      });
    });
  };

  const transformToGrey = () => {
    isColorfulRef.current = false;
    
    shapesRef.current.forEach(shape => {
      gsap.to(shape, {
        duration: 1.5,
        color: colors.grey,
        vx: shape.vx * 0.5, // Decrease movement speed
        vy: shape.vy * 0.5,
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
    exitShapes
  };
};
