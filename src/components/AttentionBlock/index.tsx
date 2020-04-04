import * as React from 'react';
import './style.scss';
import classNames from 'classnames';

interface IAttentionBlockProps {
    show?: boolean;
    type: 'error' | 'warning' | 'info';
    text?: () => string;
}

const noop = () => '';
const AttentionBlock = ({ show = false, type = 'error', text = noop}: IAttentionBlockProps) => {
    return show
        ? <div className={classNames('attention', `attention__${type}`)}>{text()}</div>
        : null;
};

export default AttentionBlock;
