import { useCallback, useEffect, useRef, useState } from 'react';
import { wrapInDebounce, wrapInThrottle } from '@talkohavy/lodash';
import useEventListener from '../../hooks/useEventListener';
import { engine } from './logic/engine';

export default function StarShower() {
  // all useRefs:
  const canvasWrapperRef = useRef(null); // the canvas will get its width from this element! it can't be done any other way.
  const bgCanvasRef = useRef(null); // The engine needs the canvas's ref in order to draw.
  const canvasRef = useRef(null); // The engine needs the canvas's ref in order to draw.
  const canvasSize = useRef(null); // The canvasWrapperRef's width & height will be stored here.

  // all useStates:
  const [isCanvasVisible, setIsCanvasVisible] = useState(true);

  // all useEffects:
  useEffect(() => {
    // Should always be true onload:
    if (canvasRef.current && canvasWrapperRef.current) {
      const observer = new ResizeObserver((entries) => {
        // Step 1: get the width & height of the wrapper (will be used as the width & height for the canvas element)
        const wrapperContentRect = entries[0].contentRect;

        // Step 2: store them as the canvas' width & height
        canvasSize.current = { width: wrapperContentRect.width, height: wrapperContentRect.height };
      });
      observer.observe(canvasWrapperRef.current);
      return () => observer.disconnect();
    }
  }, []);

  // all functions:
  const startEngine = () => {
    if (canvasRef.current && canvasSize.current) {
      canvasRef.current.removeAttribute('style');
      canvasRef.current.setAttribute('width', `${canvasSize.current.width}`);
      canvasRef.current.setAttribute('height', `${canvasSize.current.height}`);
      engine(canvasRef.current, bgCanvasRef.current, canvasSize.current);
    } else {
      console.log('something was false!');
    }
  };
  const hideCanvasNow = wrapInThrottle(() => setIsCanvasVisible(false), 500);
  const showCanvasLater = wrapInDebounce(() => setIsCanvasVisible(true), 500);
  const startEngineLater = wrapInDebounce(startEngine, 600);

  // all useCallbacks:
  const hideAndThenShowCanvas = useCallback(
    () => (hideCanvasNow(), showCanvasLater(), startEngineLater()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // all customHooks:
  useEventListener({ eventType: 'resize', fnToRun: hideAndThenShowCanvas });

  return (
    <div className='size-full' ref={canvasWrapperRef}>
      <div className='absolute left-0 top-0 flex gap-x-2 p-2'>
        <button
          type='button'
          onClick={startEngine}
          className='z-50 h-10 rounded-lg border border-black bg-red-300 px-1 text-white hover:rounded-xl hover:bg-red-500 active:bg-red-600'
        >
          Start engine
        </button>

        <button
          type='button'
          onClick={() => setIsCanvasVisible(!isCanvasVisible)}
          className='z-50 h-10 rounded-lg border border-black bg-red-300 px-1 text-white hover:rounded-xl hover:bg-red-500 active:bg-red-600'
        >
          {isCanvasVisible ? 'Hide Canvas' : 'Show canvas'}
        </button>
      </div>

      {isCanvasVisible && (
        <div className='relative'>
          <canvas
            className='absolute left-0 top-0'
            ref={bgCanvasRef}
            width={canvasSize.current?.width}
            height={canvasSize.current?.height}
            style={canvasSize.current}
          />
          <canvas
            className='absolute left-0 top-0'
            ref={canvasRef}
            width={canvasSize.current?.width}
            height={canvasSize.current?.height}
            style={canvasSize.current}
          />
        </div>
      )}
    </div>
  );
}
