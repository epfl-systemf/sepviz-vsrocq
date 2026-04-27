import { FunctionComponent, useRef, useEffect, RefObject } from 'react';
import { Render, ExtHTMLElement } from 'sepviz';
import { transition } from 'd3-transition';
import { easeCubicInOut } from 'd3-ease';
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
  const prevDotsRef = useRef<Map<string, string | undefined>>(new Map());

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

    if(!animate) return;
    ['PRE', 'POST'].forEach((stream) => {
      const vizNode = host.querySelector(`.sep-visualization.sep-stream-${stream}`); 
      const svgNode = vizNode?.querySelector<ExtHTMLElement>('.sep-svg');
      const gviz = svgNode?.__graphviz__;
      const currDot = svgNode?.dot;
      const prevDot = prevDotsRef.current.get(stream);
      prevDotsRef.current.set(stream, currDot);

      if (!gviz || !currDot || !prevDot || prevDot === currDot) return;

      gviz.renderDot(prevDot);
      requestAnimationFrame(() => {
        gviz
          // FIXME: except for the first triggered animation, the transition turns out to be much faster
          .transition(() => (transition().duration(1000).ease(easeCubicInOut)) as any)
          .renderDot(currDot);
      });
    });
  }, [goalText, ppRef, render, onFallback]);

  return <div ref={hostRef} className="sepviz-display" />;
};

export default SepvizDisplay;