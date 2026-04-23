import React, {FunctionComponent, MouseEvent, KeyboardEvent, useRef, useState, useEffect} from 'react';

import classes from './PpString.module.css';
import { PpDisplay, PpString } from 'pp-display';
import SepvizDisplay from '../sepviz/display';
import { Render } from '../sepviz/render';

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

    useEffect(() => {
        const el = ppRef.current;
        if (!el) return;

        // In order to avoid getting the stale (intermediate) goal text (when jumping through sentences), 
        // wait for the goal to stop changing, and only start observing after that, 
        // TODO: is there a better way?
        const timer = setTimeout(() => {
            const tryCapture = () => {
                const text = el.textContent ?? '';
                if (text.trim()) {
                    setGoalText(text);
                    return true;
                }
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

    // Note: for the ppRef node, using `display: none` instead will result in missing whitespaces in its textContent.
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
        >
            <div ref={ppRef} style={{
                visibility: 'hidden', 
                position: 'absolute',
                pointerEvents: 'none',
                top: 0,
                left: 0,
            }}> 
                <PpDisplay 
                    pp={goal}
                    rocqCss={classes}
                    maxDepth={maxDepth}
                />
            </div>
            <SepvizDisplay goalText={goalText} ppRef={ppRef} render={sepvizRender} />
        </div>
    );
};

export default goal;

