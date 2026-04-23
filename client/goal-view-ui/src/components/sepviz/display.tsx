import { FunctionComponent, useRef, useEffect, RefObject } from 'react';
import { Render } from './render';
import { defaultRenderConfig } from './config';

interface SepvizDisplayProps {
  goalText: string;
  ppRef: RefObject<HTMLDivElement>;
}

const SepvizDisplay: FunctionComponent<SepvizDisplayProps> = ({ goalText, ppRef }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !goalText) return;
    host.innerHTML = ''; 
    try {
      const render = new Render({ ...defaultRenderConfig(), 
        constr: {   
        '$MCell': {
            label: 'MCell',
            argNum: 2,
            args: {
                '0': {
                forceEdge: false,
                inPort: 'in$0',
                inTable: true,
                outPort: 'out$0',
                },
                '1': {
                forceEdge: false,
                inPort: 'in$1',
                inTable: true,
                outPort: 'out$1',
                },
            },
            drawBorder: true,
            inPort: 'in$0',
            },
        }
      });
      render.render(goalText, host, true);
    } catch (e) {
      console.error('SepvizDisplay: failed to render, falling back to PpDisplay: ', e);
      const pp = ppRef.current;
      if (pp) {
        pp.style.display = ''; // unhide
      } else {
        host.textContent = goalText; 
      }
    }
  }, [goalText, ppRef]);

  return <div ref={hostRef} className="sepviz-display" />;
};

export default SepvizDisplay;