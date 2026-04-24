import React, {FunctionComponent, useEffect, useRef} from 'react';

import GoalCollapsibleSection from './GoalCollapsibles';
import GoalTabSection from './GoalTabs';
import EmptyState from '../atoms/EmptyState';
import { CollapsibleGoal } from '../../types';

import classes from './GoalSection.module.css';
import { Render } from 'sep-viz';

type GoalSectionProps = {
    goals: CollapsibleGoal[],
    collapseGoalHandler: (id: string) => void,
    toggleContextHandler: (id: string) => void,
    displaySetting: string;
    emptyMessage: string;
    emptyIcon?: JSX.Element;
    unfocusedGoals?: CollapsibleGoal[],
    maxDepth: number;
    helpMessageHandler: (message: string) => void;
    sepvizRender: Render
};

const goalSection: FunctionComponent<GoalSectionProps> = (props) => {
    
    const {goals, collapseGoalHandler, toggleContextHandler, displaySetting, unfocusedGoals, emptyMessage, emptyIcon, maxDepth, helpMessageHandler, sepvizRender} = props;
    const emptyMessageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(emptyMessageRef.current) {
            emptyMessageRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest"
            });
        }
    }, [goals]);

    //This case should not happen
    if (goals === null) {
        return null;
    }

    const section = goals.length === 0 ?
        unfocusedGoals !== undefined && unfocusedGoals.length > 0 ?
        <div className={classes.UnfocusedView}>
            <EmptyState message={emptyMessage} icon={emptyIcon} />
            <div className={classes.HintText}>
                Next unfocused goals (focus with bullet):
            </div>
            <div ref={emptyMessageRef}/>
            <GoalCollapsibleSection goals={unfocusedGoals} 
                collapseGoalHandler={collapseGoalHandler}
                toggleContextHandler={toggleContextHandler}
                maxDepth={maxDepth} 
                helpMessageHandler={helpMessageHandler}
                sepvizRender={sepvizRender}
            />
        </div>
        : <>
            <EmptyState message={emptyMessage} icon={emptyIcon} />
            <div ref={emptyMessageRef}/>
          </>
    : displaySetting === 'Tabs' ?
        <GoalTabSection goals={goals} maxDepth={maxDepth} helpMessageHandler={helpMessageHandler} sepvizRender={sepvizRender}/>
        : <GoalCollapsibleSection goals={goals} 
            collapseGoalHandler={collapseGoalHandler} 
            maxDepth={maxDepth} helpMessageHandler={helpMessageHandler}
            toggleContextHandler={toggleContextHandler}
            sepvizRender={sepvizRender}
        />;

    return section;
};

export default goalSection;