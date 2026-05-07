import React, {FunctionComponent, MouseEvent, KeyboardEvent, useRef, useState, useEffect, useCallback} from 'react';

import classes from './PpString.module.css';
import { PpDisplay, PpString } from 'pp-display';
import SepvizDisplay from './SepvizDisplay';
import { Render } from 'sepviz';
import { domToText } from './Utilities';

type GoalProps = {
    goal: PpString,
    maxDepth: number,
    setHelpMessage: (message: string) => void;
    sepvizRender: Render;
};

const goal : FunctionComponent<GoalProps> = (props) => {
    
    const {goal, maxDepth, setHelpMessage, sepvizRender} = props;
    const ppRef = useRef<HTMLDivElement>(null);
    const [goalText, setGoalText] = useState<string>('');
    const [fallbackActive, setFallbackActive] = useState(false);

    const handleFallback = useCallback(() => {
        setFallbackActive(true);
    }, []);

    useEffect(() => {
        const el = ppRef.current;
        if (!el) return;

        // In order to avoid getting the stale (intermediate) goal text (when jumping through sentences), 
        // wait for the goal to stop changing, and only start observing after that, 
        // TODO: is there a better way?
        const timer = setTimeout(() => {
            const tryCapture = () => {
                // Note: innerText is not enough because it ignores indentation spans.
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
    }, [goal, maxDepth]);

    return (
        <div 
            className={classes.Goal} 
            onMouseOver={() => {
                if(setHelpMessage !== undefined) {
                    setHelpMessage("Click on the window and keep Alt pressed in to enable term eliding/expanding.");
                }
            }}
            onMouseOut={() => {
                if(setHelpMessage !== undefined) {
                    setHelpMessage("");
                }
            }}
            style={{ position: 'relative' }}
        >
             {/* hidden PpDisplay for goalText extraction */}
            <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: '100%', top: 0, left: 0 }}>
                <div ref={ppRef}>
                    <PpDisplay pp={goal} rocqCss={classes} maxDepth={maxDepth} />
                </div>
            </div>
            { fallbackActive 
                ? ( <PpDisplay pp={goal} rocqCss={classes} maxDepth={maxDepth} />) 
                : ( <SepvizDisplay 
                        goalText={goalText} 
                        ppRef={ppRef} 
                        render={sepvizRender} 
                        onFallback={handleFallback}
                        animate={true}
                    />) }
        </div>
    );
};

export default goal;

