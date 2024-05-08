import React, { useEffect, useRef } from 'react';

/**
 * @param {{
 *    eventType: string,
 *    fnToRun: (props: any) => void,
 *    dependencies?: Array,
 *    element?: any
 *    shouldNotRender?: boolean
 * }} props
 */
export default function useEventListener({ eventType, fnToRun, dependencies = [], element = window, shouldNotRender }) {
  const callbackRef = useRef(fnToRun);

  useEffect(() => ((callbackRef.current = fnToRun), undefined), [fnToRun]);

  useEffect(() => {
    if (shouldNotRender) return;

    element.addEventListener(eventType, callbackRef.current);

    callbackRef.current();

    return () => element.removeEventListener(eventType, callbackRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
