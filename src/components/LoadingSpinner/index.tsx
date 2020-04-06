import * as React from 'react';
import './style.scss';
import { ICssThemeColorDefault } from '../../scss/provider';
import * as classNames from 'classnames';

type ICssThemeColorSpinner = 'white' | 'gray' | 'auto';
type ISpinnerSize = 'xs'| 's' | 'm' | 'l' | 'xl';

interface ISpinnerProps {
    color?: ICssThemeColorDefault | ICssThemeColorSpinner;
    size?: ISpinnerSize;
}

const radius = 30;
const width = 8;

const maxRadius = radius + width;

const LoadingSpinner = ({ color = 'auto', size = 'm' }: ISpinnerProps) => (
    <svg
        className={classNames('progress', 'spinner', {
            [`progress__${color}`]: color,
            [`progress__${size}`]: size,
        })}
        viewBox={`0 0 ${maxRadius * 2} ${maxRadius * 2}`}>
        <circle
            className="progress-path spinner-path"
            cx={maxRadius}
            cy={maxRadius}
            r={radius} />
    </svg>
);

export default LoadingSpinner;
