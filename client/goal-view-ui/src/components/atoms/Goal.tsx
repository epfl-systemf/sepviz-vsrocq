import React, {FunctionComponent, MouseEvent, KeyboardEvent, useRef, useState, useEffect} from 'react';

import classes from './PpString.module.css';
import { PpDisplay, PpString } from 'pp-display';
import SepvizDisplay from '../sepviz/display';

type GoalProps = {
    goal: PpString,
    maxDepth: number,
    setHelpMessage: (message: string) => void;
};

const goal : FunctionComponent<GoalProps> = (props) => {
    
    const {goal, maxDepth, setHelpMessage} = props;
    const ppRef = useRef<HTMLDivElement>(null);
    const [goalText, setGoalText] = useState<string>('');

    useEffect(() => {
        const el = ppRef.current;
        if (!el) return;
        const text = el.textContent ?? '';
        if (text.trim()) {
            setGoalText(text);
            return;
        }
        // important: wait for PpDisplay to finish rendering 
        const observer = new MutationObserver(() => {
            const text = el.textContent ?? '';
            if (text.trim()) {
                setGoalText(text);
                observer.disconnect();
            }
        });
        observer.observe(el, { childList: true, subtree: true, characterData: true });
        return () => observer.disconnect();
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
            <SepvizDisplay goalText={goalText} ppRef={ppRef} />
        </div>
    );
};

export default goal;

