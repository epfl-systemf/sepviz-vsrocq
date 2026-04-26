import React, {FunctionComponent} from 'react';

import { PpString } from 'pp-display';

import Hypothesis from '../atoms/Hypothesis';

import classes from './HypothesesBlock.module.css';
import { Render } from 'sep-viz';

type HypothesesBlockProps = {
    hypotheses: PpString[];
    maxDepth: number,
    sepvizRender: Render
};

const hypothesesBlock: FunctionComponent<HypothesesBlockProps> = (props) => {

    const {hypotheses, maxDepth, sepvizRender} = props;

    const hypothesesComponents = hypotheses.map((hyp, index) => {
        return <Hypothesis key={index} content={hyp} maxDepth={maxDepth} sepvizRender={sepvizRender}/>;
    });

    return (
        <ul className={classes.Block}>
            {hypothesesComponents}
        </ul>
    );
};

export default hypothesesBlock;