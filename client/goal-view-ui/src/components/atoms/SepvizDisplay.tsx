import { FunctionComponent, useRef, useEffect, RefObject } from 'react';
import { Render } from 'sepviz';
import "sepviz/sepviz.css";

interface SepvizDisplayProps {
  goalText: string;
  ppRef: RefObject<HTMLDivElement>;
  render: Render;
  onFallback: () => void;
  animate: boolean
}

const SepvizDisplay: FunctionComponent<SepvizDisplayProps> = (props) => {
  const {goalText, ppRef, render, onFallback, animate} = props;
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !goalText) return;
    host.innerHTML = '';
    try {
      render.render(goalText, host, animate);
    } catch (e) {
      console.error('SepvizDisplay: failed to render, falling back to PpDisplay: ', e);
      onFallback();
      return;
    }
    if(animate) render.animate(host);
  }, [goalText, ppRef, render, onFallback]);

  return <div ref={hostRef} className="sepviz-display" />;
};

export default SepvizDisplay;