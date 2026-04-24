import React, {FunctionComponent, MouseEvent, KeyboardEvent, useRef, useState, useEffect} from 'react';

import classes from './PpString.module.css';
import { PpDisplay, PpString } from 'pp-display';
import SepvizDisplay from './SepvizDisplay';
import { Render } from 'sep-viz';

type GoalProps = {
    goal: PpString,
    maxDepth: number,
    setHelpMessage: (message: string) => void;
    sepvizRender: Render;
};

function domToText(el: HTMLElement, charWidthPx: number = 7): string {
    let res = '';
    function rec(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) { res += node.textContent; return; }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const elem = node as HTMLElement;
        if (elem.tagName === 'BR') { res += '\n'; return;}
        // indentation span
        if (elem.tagName === 'SPAN' && elem.style.marginLeft) {
            const px = parseFloat(elem.style.marginLeft);
            const spaces = Math.round(px / charWidthPx);
            res += ' '.repeat(spaces);
            return; 
        }
        elem.childNodes.forEach(rec);
    }
    el.childNodes.forEach(rec);
    return res;
}

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
                // Note: innerText is not enough because it ignores indentation spans.
                const text = domToText(el); 
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
            <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: '100%', top: 0, left: 0 }}>
                <div ref={ppRef}>
                    <PpDisplay pp={goal} rocqCss={classes} maxDepth={maxDepth} />
                </div>
            </div>
            <SepvizDisplay goalText={goalText} ppRef={ppRef} render={sepvizRender} />
        </div>
    );
};

export default goal;

