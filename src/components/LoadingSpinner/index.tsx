import * as React from 'react';
import './style.scss';
import * as classNames from 'classnames';
import { ICssThemeColorDefault } from '../../scss/provider';

type ICssThemeColorSpinner = 'white' | 'gray' | 'auto';
type ISpinnerSize = 'xs'| 's' | 'm' | 'l' | 'xl';

interface ISpinnerProps {
    color?: ICssThemeColorDefault | ICssThemeColorSpinner;
    size?: ISpinnerSize;
    block?: boolean;
    subtitle?: string;
    className?: string;
}

const radius = 30;
const width = 8;

const maxRadius = radius + width;

const LoadingSpinner: React.FC<ISpinnerProps> = ({ color = 'auto', size = 'm', block, subtitle, className }: ISpinnerProps) => {
    const spinner = (
        <svg
            className={classNames('progress', 'spinner', {
                [`progress__${color}`]: color,
                [`progress__${size}`]: size,
            }, className)}
            viewBox={`0 0 ${maxRadius * 2} ${maxRadius * 2}`}>
            <circle
                className="progress-path spinner-path"
                cx={maxRadius}
                cy={maxRadius}
                r={radius} />
        </svg>
    );

    if (!block) {
        return spinner;
    }

    return (
        <div className="spinner-wrap">
            {spinner}
            {subtitle && <span className="spinner-wrap--subtitle">{subtitle}</span>}
        </div>
    );
};

export default LoadingSpinner;
