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
        if (ppRef.current) {
            setGoalText(ppRef.current.textContent ?? '');
        }
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
        >
            <div ref={ppRef} style={{display: 'none'}}>
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

