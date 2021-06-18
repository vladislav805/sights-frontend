import * as React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

type PaginationTargetCallback = (page: number) => void;

type IPaginationItemProps = {
    page: number;
    active?: boolean;
    target: string | PaginationTargetCallback;
};

const PaginationItem: React.FC<IPaginationItemProps> = ({ page, target, active }: IPaginationItemProps) => {
    const event = typeof target !== 'string' && ((event: React.MouseEvent) => {
        event.preventDefault();
        (target as PaginationTargetCallback)(page);
    });

    const className = classNames('pagination--item', {
        'pagination--item__active': active,
    });

    return typeof target === 'string'
        ? (
            <Link
                to={target}
                className={className}>
                {page}
            </Link>
        )
        : (
            <div
                onClick={event}
                className={className}>
                {page}
            </div>
        );
};

export default PaginationItem;
