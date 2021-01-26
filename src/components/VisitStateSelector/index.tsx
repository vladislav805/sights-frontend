import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import { mdiCheck, mdiClose, mdiRun } from '@mdi/js';
import Icon from '@mdi/react';
import API from '../../api';
import LoadingSpinner from '../LoadingSpinner';
import { IVisitStateStats, VisitState } from '../../api/types/sight';

type IVisitStateSelectorProps = {
    sightId: number;
    stats: IVisitStateStats;
    selected?: VisitState;
    canChange: boolean;
    onChange?: (state: VisitState) => void;
    mini?: boolean;
};

type IState = {
    key: VisitState;
    statKey: undefined | keyof IVisitStateStats;
    title: string;
    icon: string;
};

const states: IState[] = [
    {
        key: VisitState.NOT_VISITED,
        statKey: undefined,
        title: 'Не посещено',
        icon: mdiClose,
    },
    {
        key: VisitState.VISITED,
        statKey: 'visited',
        title: 'Посещено',
        icon: mdiCheck,
    },
    {
        key: VisitState.DESIRED,
        statKey: 'desired',
        title: 'Желаемое',
        icon: mdiRun,
    },
];

const VisitStateSelector: React.FC<IVisitStateSelectorProps> = (props: IVisitStateSelectorProps) => {
    const [wait, setWait] = React.useState<boolean>(false);
    const [stats, setStats] = React.useState<IVisitStateStats>(props.stats);
    const [selected, setSelected] = React.useState<VisitState>(props.selected);
    const [obsolete, setObsolete] = React.useState<[number, number]>([NaN, NaN]);

    const click = (state: VisitState) => () => props.canChange && onClick(state);

    const onClick = (_selected: VisitState) => {
        setWait(true);
        setObsolete([selected, _selected]);
        props.onChange?.(_selected);
        void send(_selected);
    };

    const send = async(state: VisitState) => {
        const { stat } = await API.sights.setVisitState({
            sightId: props.sightId,
            state,
        });

        setStats(stat);
        setSelected(state);
        setWait(false);
        setObsolete([NaN, NaN]);
    };

    const canChange = props.canChange;
    return (
        <div
            className={classNames('visitStateSelector', {
                'visitStateSelector__enabled': canChange,
                'visitStateSelector__wait': wait,
                'visitStateSelector__mini': props.mini,
            })}
            data-visit-state-selected={canChange ? selected : -1}>
            {states.map(({ title, icon, key, statKey }) => (
                <div
                    key={key}
                    className="visitStateSelector-item"
                    onClick={click(key)}>
                    <div
                        className="visitStateSelector-graph">
                        {wait && obsolete.includes(key)
                            ? <LoadingSpinner size="s" />
                            : (
                                <>
                                    <Icon
                                        className="visitStateSelector-icon"
                                        path={icon} />
                                    <var className="visitStateSelector-count">
                                        {statKey ? stats[statKey] : '∞'}
                                    </var>
                                </>
                            )
                        }
                    </div>
                    <span className="visitStateSelector-label">{title}</span>
                </div>
            ))}
        </div>
    );
}

export default VisitStateSelector;
