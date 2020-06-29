import * as React from 'react';
import './style.scss';
import { IVisitStateStats, VisitState } from '../../api';
import classNames from 'classnames';
import { mdiCheck, mdiClose, mdiRun } from '@mdi/js';
import Icon from '@mdi/react';
import API from '../../api';
import LoadingSpinner from '../LoadingSpinner';

interface IVisitStateSelectorProps {
    sightId: number;
    stats: IVisitStateStats;
    selected?: VisitState;
    canChange: boolean;
    onChange?: (state: VisitState) => void;
}

interface IVisitStateSelectorState {
    wait: boolean;
    stats: IVisitStateStats;
    selected: VisitState;
    obsolete: VisitState[];
}

const states = [
    {
        key: VisitState.DEFAULT,
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

class VisitStateSelector extends React.Component<IVisitStateSelectorProps, IVisitStateSelectorState> {
    constructor(props: IVisitStateSelectorProps) {
        super(props);

        this.state = {
            wait: false,
            stats: props.stats,
            selected: props.selected,
            obsolete: [],
        };
    }

    private click = (state: VisitState) => () => this.props.canChange && this.onClick(state);

    private onClick = (selected: VisitState) => {
        const obsolete = [this.state.selected, selected];

        this.setState({
            wait: true,
            obsolete,
        }, () => {
            this.props.onChange?.(selected);
            void this.send(selected);
        });
    };

    private send = async(selected: VisitState) => {
        const { state: stats } = await API.sights.setVisitState(this.props.sightId, selected);
        this.setState({
            stats,
            selected,
            wait: false,
            obsolete: [],
        });
    }

    render(): JSX.Element {
        const canChange = this.props.canChange;
        const { selected, wait, obsolete, stats } = this.state;
        return (
            <div
                className={classNames('visitStateSelector', {
                    'visitStateSelector__enabled': canChange,
                    'visitStateSelector__wait': wait,
                })}
                data-visit-state-selected={canChange ? selected : -1}>
                {states.map(({ title, icon, key, statKey }) => (
                    <div
                        key={key}
                        className="visitStateSelector-item"
                        onClick={this.click(key)}>
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
                                            {statKey ? stats[statKey as keyof IVisitStateStats] : '∞'}
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
}

export default VisitStateSelector;
