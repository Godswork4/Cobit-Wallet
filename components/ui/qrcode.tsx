'use client';

import { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

export default function QRCode({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const drawQRCode = async () => {
      if (!canvasRef.current || !value) return;
      
      // This is a simple placeholder for a real QR code generator
      // In a real app, you would use a library like qrcode.react or qrcode
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
      
      // Draw fake QR code pattern
      ctx.fillStyle = '#000000';
      const blockSize = Math.floor(size / 25);
      
      // Draw position detection patterns (corners)
      // Top-left
      ctx.fillRect(0, 0, 7 * blockSize, 7 * blockSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(blockSize, blockSize, 5 * blockSize, 5 * blockSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(2 * blockSize, 2 * blockSize, 3 * blockSize, 3 * blockSize);
      
      // Top-right
      ctx.fillStyle = '#000000';
      ctx.fillRect(size - 7 * blockSize, 0, 7 * blockSize, 7 * blockSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(size - 6 * blockSize, blockSize, 5 * blockSize, 5 * blockSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(size - 5 * blockSize, 2 * blockSize, 3 * blockSize, 3 * blockSize);
      
      // Bottom-left
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, size - 7 * blockSize, 7 * blockSize, 7 * blockSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(blockSize, size - 6 * blockSize, 5 * blockSize, 5 * blockSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(2 * blockSize, size - 5 * blockSize, 3 * blockSize, 3 * blockSize);
      
      // Draw some random modules to look like a QR code
      ctx.fillStyle = '#000000';
      const hash = hashCode(value);
      const seededRandom = (i: number, j: number) => {
        return (((hash * 13) + i * 7 + j * 11) % 100) < 35;
      };
      
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          // Skip position detection patterns
          if ((i < 7 && j < 7) || (i < 7 && j > 17) || (i > 17 && j < 7)) {
            continue;
          }
          
          if (seededRandom(i, j)) {
            ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
          }
        }
      }
      
      // Add bitcoin logo in center
      if (value.includes('btc')) {
        ctx.save();
        ctx.fillStyle = '#F7931A';
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = 3 * blockSize;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${radius}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('₿', centerX, centerY);
        ctx.restore();
      }
    };
    
    drawQRCode();
  }, [value, size]);
  
  // Simple hash function for seeded randomness
  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size}
      className="w-full h-full"
    />
  );
}