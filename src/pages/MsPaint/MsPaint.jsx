import React, { useEffect, useRef, useState } from 'react';

export default function MsPaint() {
  // all useRefs:
  const canvasWrapperRef = useRef(null); // the canvas will get its width from this element! it can't be done any other way.
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // all useStates:
  const [isCanvasVisible, setIsCanvasVisible] = useState(true);
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

  return (
    <div className='size-full' ref={canvasWrapperRef}>
      <div className='absolute left-0 top-0 flex gap-x-2 p-2'>
        <button
          type='button'
          onClick={() => setIsCanvasVisible(!isCanvasVisible)}
          className='z-50 h-10 rounded-lg border border-black bg-red-300 px-1 text-white hover:rounded-xl hover:bg-red-500 active:bg-red-600'
        >
          {isCanvasVisible ? 'Hide Canvas' : 'Show canvas'}
        </button>
      </div>

      {isCanvasVisible && (
        <canvas onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw} ref={canvasRef} />
      )}
    </div>
  );
}
