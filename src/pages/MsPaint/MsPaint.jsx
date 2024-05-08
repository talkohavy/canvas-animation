import React, { useEffect, useRef, useState } from 'react';

export default function MsPaint() {
  // all useRefs:
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // all useStates:
  const [isDrawing, setIsDrawing] = useState(false);

  // all useEffects:
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  // all functions:
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  // const [mainSize, setMainSize] = useState(false);

  // useEffect(() => {
  //   const debouncedHandleResize = wrapInDebounce(function handleResize() {
  //     const rect = canvasRef.current.getBoundingClientRect();
  //     setMainSize({ width: rect.width, height: rect.height });
  //   }, 300);
  //   if (!mainSize) {
  //     const rect = canvasRef.current.getBoundingClientRect();
  //     setMainSize({ width: rect.width, height: rect.height });
  //   }
  //   window.addEventListener('resize', debouncedHandleResize);
  //   return () => window.removeEventListener('resize', debouncedHandleResize);
  // }, [mainSize]);

  return (
    <canvas
      // style={{ width: mainSize?.width, height: mainSize?.height }}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      ref={canvasRef}
    />
  );
}
