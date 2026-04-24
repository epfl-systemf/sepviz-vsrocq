import { FunctionComponent, useRef, useEffect, RefObject } from 'react';
import { Render, ExtHTMLElement } from './render';
import { transition } from 'd3-transition';
import { easeCubicInOut } from 'd3-ease';
import "./sep.css";

interface SepvizDisplayProps {
  goalText: string;
  ppRef: RefObject<HTMLDivElement>;
  render: Render;
}

const SepvizDisplay: FunctionComponent<SepvizDisplayProps> = ({ goalText, ppRef, render }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const prevDotRef = useRef<string>(''); 

  async function animate(
    host: HTMLElement,
    prevDot: string,
    currDot: string,
    duration = 2000
  ) {
    const svgNode = host.querySelector<ExtHTMLElement>('.sep-svg');
    const gviz = svgNode?.__graphviz__;
    if (!svgNode || !gviz) return;
    await new Promise<void>((resolve) => {
      gviz
        .transition(() => transition().duration(0) as any)
        .renderDot(prevDot)
        .on('end', resolve);
    });

    await new Promise<void>((resolve) => {
      gviz
        .transition(() => transition().duration(duration).ease(easeCubicInOut) as any)
        .renderDot(currDot)
        .on('end', resolve);
    });
 }

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !goalText) return;
    host.innerHTML = ''; 

    try {
      render.render(goalText, host, true);
      const svgNode = host.querySelector<ExtHTMLElement>('.sep-svg');
      const currDot = svgNode?.dot;
      const prevDot = prevDotRef.current;
      if (prevDot && currDot && prevDot !== currDot) {
        animate(host, prevDot, currDot);
      }
      if (currDot) prevDotRef.current = currDot;
    } catch (e) {
      console.error('SepvizDisplay: failed to render, falling back to PpDisplay: ', e);
      const pp = ppRef.current;
      if (pp) { // FIXME
        pp.style.visibility = ''; 
        pp.style.position = ''; 
      } else {
        host.textContent = goalText; 
      }
    }
  }, [goalText, ppRef, render]);

  return <div ref={hostRef} className="sepviz-display" />;
};

export default SepvizDisplay;