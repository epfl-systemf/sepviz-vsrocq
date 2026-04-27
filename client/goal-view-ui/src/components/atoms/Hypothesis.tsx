import React, {FunctionComponent, useRef, useState, useEffect} from 'react';

import classes from './PpString.module.css';
import { PpDisplay, PpString } from 'pp-display';
import { domToText } from './Utilities';
import SepvizDisplay from './SepvizDisplay';
import { Render } from 'sepviz';

type HypothesisProps = {
    content: PpString;
    maxDepth: number;
    sepvizRender: Render
};

const hypothesis: FunctionComponent<HypothesisProps> = (props) => {
    
    const {content, maxDepth, sepvizRender} = props;
    const ppRef = useRef<HTMLDivElement>(null);
    const [goalText, setGoalText] = useState<string>('');
    const [fallbackActive, setFallbackActive] = useState(false);

    useEffect(() => { setFallbackActive(false); }, [content, maxDepth]);

    // See Goal.tsx
    useEffect(() => {
        const el = ppRef.current;
        if (!el) return;
        const timer = setTimeout(() => {
            const tryCapture = () => {
                const text = domToText(el); 
                if (text.trim()) { setGoalText(text); return true; }
                return false;
            };
            if (tryCapture()) return;
            const observer = new MutationObserver(() => {
                if (tryCapture()) observer.disconnect();
            });
            observer.observe(el, { childList: true, subtree: true, characterData: true });
        }, 50); 
       return () => clearTimeout(timer);
    }, [content, maxDepth]);

    return (
        <div className={classes.Hypothesis}>
            {/* hidden PpDisplay for goalText extraction */}
            <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: '100%', top: 0, left: 0 }}>
                <div ref={ppRef}>
                    <PpDisplay pp={content} rocqCss={classes} maxDepth={maxDepth} />
                </div>
            </div>

            { fallbackActive 
                ? ( <PpDisplay pp={content} rocqCss={classes} maxDepth={maxDepth} />) 
                : ( <SepvizDisplay 
                        goalText={goalText} 
                        ppRef={ppRef} 
                        render={sepvizRender} 
                        onFallback={() => setFallbackActive(true)}
                        animate={false}
                    />) }
        </div>
    );
};

export default hypothesis;