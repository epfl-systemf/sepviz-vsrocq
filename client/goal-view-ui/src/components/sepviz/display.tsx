import { FunctionComponent, useRef, useState, useEffect, RefObject } from 'react';
import { Render } from './render';
import { defaultRenderConfig, readRenderConfig, RenderConfig } from './config';
import { isEqual } from 'lodash'; 
import "./sep.css";
import { vscode } from '../../utilities/vscode';

interface SepvizDisplayProps {
  goalText: string;
  ppRef: RefObject<HTMLDivElement>;
}

const SepvizDisplay: FunctionComponent<SepvizDisplayProps> = ({ goalText, ppRef }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<RenderConfig>(defaultRenderConfig());
  const [render, setRender] = useState<Render>(new Render(config));

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data;
      if (msg.command === 'sepvizConfigUpdate') {
        try {
          const newConfig = readRenderConfig(msg.text);
          if (isEqual(config, newConfig)) return;
          setConfig(newConfig);
          setRender(new Render(newConfig));
        } catch (e) {
          console.error('SepvizDisplay: failed to parse config and setup new render ', e);
        }
      }
    };
    window.addEventListener('message', handler);
    vscode.postMessage({ command: 'requestSepvizConfig' });

    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !goalText) return;
    host.innerHTML = ''; 
    try {
      render.render(goalText, host, true);
    } catch (e) {
      console.error('SepvizDisplay: failed to render, falling back to PpDisplay: ', e);
      const pp = ppRef.current;
      if (pp) {
        pp.style.display = ''; // FIXME
      } else {
        host.textContent = goalText; 
      }
    }
  }, [goalText, ppRef, render]);

  return <div ref={hostRef} className="sepviz-display" />;
};

export default SepvizDisplay;