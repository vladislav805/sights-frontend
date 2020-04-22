import * as React from 'react';
import './style.scss';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';

type IStickyHeaderProps = {
    showHeader?: boolean;
    left?: React.ReactChild;
    right?: React.ReactChild;
};

const StickyHeader = ({ children, showHeader = true, left, right }: PropsWithChildren<IStickyHeaderProps>) => {
    return (
        <div className={classNames('stickyHeader', {
            'stickyHeader__empty': !showHeader,
        })}>
            <div className="stickyHeader-header">
                <h3 className="stickyHeader-header--left">{left}</h3>
                {right && (
                    <div className="stickyHeader-header--right">{right}</div>
                )}
            </div>
            <div className="stickyHeader-content">
                {children}
            </div>
        </div>
    );
};

export default StickyHeader;
