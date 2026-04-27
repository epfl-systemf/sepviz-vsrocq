import React, {FunctionComponent} from 'react';

import HypothesesBlock from './HypothesesBlock';
import GoalComponent from '../atoms/Goal';
import Separator from '../atoms/Separator';

import classes from './GoalBlock.module.css';
import { Goal } from '../../types';
import { Render } from 'sepviz';

type GoalBlockProps = {
    goal: Goal
    goalIndicator?: string,
    maxDepth: number,
    helpMessageHandler: (message: string) => void,
    displayHyps: boolean
    sepvizRender: Render
};

const goalBlock: FunctionComponent<GoalBlockProps> = (props) => {
    
    const {goal, goalIndicator, maxDepth, displayHyps, helpMessageHandler, sepvizRender} = props;
    const indicator = goalIndicator ? <span className={classes.GoalIndex} >({goalIndicator})</span> : null;
    const hyps = displayHyps ? <HypothesesBlock hypotheses={goal.hypotheses} maxDepth={maxDepth} sepvizRender={sepvizRender}/> : null;

    return (
        <div className={classes.Block}>
            {hyps}
            <div className={classes.SeparatorZone}> 
                {indicator} 
                <Separator />
            </div>
            <GoalComponent goal={goal.goal} maxDepth={maxDepth} setHelpMessage={helpMessageHandler} sepvizRender={sepvizRender}/>
        </div>
    );
};

export default goalBlock;