import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import Icon from '@mdi/react';
import { VisitStateIcon } from '../../shorthand/icons';
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
        icon: VisitStateIcon[VisitState.NOT_VISITED],
    },
    {
        key: VisitState.VISITED,
        statKey: 'visited',
        title: 'Посещено',
        icon: VisitStateIcon[VisitState.VISITED],
    },
];

const VisitStateSelector: React.FC<IVisitStateSelectorProps> = ({
    stats: lStats,
    selected: lSelected,
    sightId,
    canChange,
    onChange,
    mini,
}: IVisitStateSelectorProps) => {
    const [wait, setWait] = React.useState<boolean>(false);
    const [stats, setStats] = React.useState<IVisitStateStats>(lStats);
    const [selected, setSelected] = React.useState<VisitState>(lSelected);
    const [obsolete, setObsolete] = React.useState<[number, number]>([NaN, NaN]);

    const send = async(state: VisitState) => {
        const { stat } = await API.sights.setVisitState({ sightId, state });

        setStats(stat);
        setSelected(state);
        setWait(false);
        setObsolete([NaN, NaN]);
    };

    const onClick = (_selected: VisitState) => {
        setWait(true);
        setObsolete([selected, _selected]);
        onChange?.(_selected);
        send(_selected);
    };

    const click = (state: VisitState) => () => canChange && onClick(state);

    return (
        <div
            className={classNames('visitStateSelector', {
                visitStateSelector__enabled: canChange,
                visitStateSelector__wait: wait,
                visitStateSelector__mini: mini,
            })}
            data-visit-state-selected={canChange ? selected : -1}>
            {states.map(({ title, icon, key, statKey }) => (
                <div
                    aria-label={title}
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
                            )}
                    </div>
                    <span className="visitStateSelector-label">{title}</span>
                </div>
            ))}
        </div>
    );
};

export default VisitStateSelector;
