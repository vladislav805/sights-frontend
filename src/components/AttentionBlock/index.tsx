import * as React from 'react';
import './style.scss';
import classNames from 'classnames';

export type IAttentionBlockProps = {
    show?: boolean;
    type: 'error' | 'warning' | 'info';
    text?: string | (() => string);
};

const AttentionBlock: React.FC<IAttentionBlockProps> = ({ show = false, type = 'error', text = '' }: IAttentionBlockProps) => {
    // eslint-disable-next-line no-nested-ternary
    const str = show ? (typeof text === 'function' ? text() : text) : undefined;
    return show
        ? <div className={classNames('attention', `attention__${type}`)}>{str}</div>
        : null;
};

export default AttentionBlock;
