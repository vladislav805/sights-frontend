import * as React from 'react';
import './style.scss';
import classNames from 'classnames';

interface IAttentionBlockProps {
    show?: boolean;
    type: 'error' | 'warning' | 'info';
    text?: string | (() => string);
}

const AttentionBlock = ({ show = false, type = 'error', text = ''}: IAttentionBlockProps) => {
    const str = show ? (typeof text === 'function' ? text() : text) : undefined;
    return show
        ? <div className={classNames('attention', `attention__${type}`)}>{str}</div>
        : null;
};

export default AttentionBlock;
