import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import { ICssThemeColorDefault } from '../../scss/provider';
import { toRange } from '../../utils/toRange';

type ICssThemeColorProgress = 'white' | 'gray';
type IProgressSize = 'xs'| 's' | 'm' | 'l' | 'xl';

interface IProgressProps {
    value: number;
    color?: ICssThemeColorDefault | ICssThemeColorProgress;
    size?: IProgressSize;
    spin?: boolean;
}

const dasharray = 187;
const radius = 30;
const width = 8;

const maxRadius = radius + width;

const Progress: React.FC<IProgressProps> = ({ value, color = 'primary', spin = false, size = 'm' }: IProgressProps) => (
    <svg
        className={classNames('progress', {
            'progress__spin': spin,
            [`progress__${color}`]: color,
            [`progress__${size}`]: size
        })}
        viewBox={`0 0 ${maxRadius * 2} ${maxRadius * 2}`}>
        <circle
            className="progress-path"
            strokeDashoffset={toRange(dasharray - (dasharray * value / 100), 0, dasharray)}
            cx={maxRadius}
            cy={maxRadius}
            r={radius} />
    </svg>
);

export default Progress;
