"use client"
import React, { useState, useRef, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Header from './components/header';


const MathExplorer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [iterations, setIterations] = useState<number>(50);
  const [segments, setSegments] = useState<number>(500);
  const [boundary, setBoundary] = useState<number>(4);
  const [coords, setCoords] = useState<string>('');

  const checkIfBounded = (c: { real: number; imaginary: number }, maxIterations: number, boundary: number) => {
    let zOfNReal = 0;
    let zOfNImaginary = 0;
    // zOfNPlus1Real = zOfN^2 + c
    // zOfN = zOfNReal + i * zOfNImaginary
    // zOfN^2 = (zOfNReal^2 - zOfNImaginary^2) + i * (2 * zOfNReal * zOfNImaginary)
    // zOfN^2 + c = (zOfNReal^2 - zOfNImaginary^2 + c.real) + i * (2 * zOfNReal * zOfNImaginary + c.imaginary)
    // zOfNPlus1Real = zOfNReal^2 - zOfNImaginary^2 + c.real
    // zOfNPlus1Imaginary = 2 * zOfNReal * zOfNImaginary + c.imaginary
    for (let i = 0; i < maxIterations; i++) {
      const zOfNRealSquared = zOfNReal * zOfNReal;
      const zOfNImaginarySquared = zOfNImaginary * zOfNImaginary;
      if (zOfNRealSquared + zOfNImaginarySquared > boundary) {
        return false;
      }
      const zOfNPlus1Real = zOfNRealSquared - zOfNImaginarySquared + c.real;
      const zOfNPlus1Imaginary = 2 * zOfNReal * zOfNImaginary + c.imaginary;

      zOfNReal = zOfNPlus1Real;
      zOfNImaginary = zOfNPlus1Imaginary;
    }
    return true;
  };

  const generateVisualization = useMemo(() => {
    return () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      const imageData = context.createImageData(segments, segments);
      const data = imageData.data;

      for (let y = 0; y < segments; y++) {
        for (let x = 0; x < segments; x++) {
          const real = (x / segments) * 4 - 2;
          const imaginary = (y / segments) * 4 - 2;
          const c = { real, imaginary };
          const isBounded = checkIfBounded(c, iterations, boundary);
          const pixelIndex = (y * segments + x) * 4;

          if (isBounded) {
            // bg-sky-300
            data[pixelIndex] = 125;
            data[pixelIndex + 1] = 211;
            data[pixelIndex + 2] = 252;
            data[pixelIndex + 3] = 255;
          } else {
            // bg-sky-800
            data[pixelIndex] = 7;
            data[pixelIndex + 1] = 89;
            data[pixelIndex + 2] = 133;
            data[pixelIndex + 3] = 255;
          }
        }
      }
      context.putImageData(imageData, 0, 0);
    };
  }, [iterations, segments, boundary, checkIfBounded]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvasRef.current) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const realX = (x / canvasRef.current.width) * 4 - 2;
    const realY = -((y / canvasRef.current.height) * 4 - 2);

    setCoords(`Current point: (${realX.toFixed(3)}, ${realY.toFixed(3)}i)`);
  };

  return (
    <>
      <Header />
      <div className='flex flex-col md:flex-row space-x-4 ml-4'>
        <div className='flex flex-col space-y-4'>
          <div className="grid grid-cols-2 gap-4">
            <Label className='col-span-1 mt-2'>Iterations</Label>
            <Input className='col-span-1' type="number" value={iterations} min="10" max="1000" onChange={(e) => setIterations(Number(e.target.value))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Label className='col-span-1 mt-2'>Segments</Label>
            <Input className='col-span-1' type="number" value={segments} min="100" max="1000" onChange={(e) => setSegments(Number(e.target.value))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Label className='col-span-1 mt-2'>Bound</Label>
            <Input className='col-span-1' type="number" value={boundary} min="2" max="100" step="0.1" onChange={(e) => setBoundary(Number(e.target.value))} />
          </div>
          <Button className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700' onClick={generateVisualization}>Generate</Button>
        </div>
        <div>
          <div>{coords}</div>
          <div style={{ position: 'relative', marginLeft: '4px', marginRight: '4px' }}>
            <canvas
              key={`${iterations}-${segments}-${boundary}`}
              ref={canvasRef}
              width={800}
              height={800}
              onMouseMove={handleMouseMove}
              style={{ border: '1px solid #ccc' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MathExplorer;