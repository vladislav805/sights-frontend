import * as React from 'react';
import * as classNames from 'classnames';
import { Link } from 'react-router-dom';

type PaginationTargetCallback = (page: number) => void;

type IPaginationItemProps = {
    page: number;
    active?: boolean;
    target: string | PaginationTargetCallback;
};

const PaginationItem: React.FC<IPaginationItemProps> = (props: IPaginationItemProps) => {
    const event = typeof props.target !== 'string' && ((event: React.MouseEvent) => {
        event.preventDefault();
        (props.target as PaginationTargetCallback)(props.page);
    });

    const className = classNames('pagination--item', {
        'pagination--item__active': props.active,
    });

    return typeof props.target === 'string'
        ? (
            <Link
                to={props.target}
                className={className}>
                {props.page}
            </Link>
        )
        : (
            <div
                onClick={event}
                className={className}>
                {props.page}
            </div>
        );
};

export default PaginationItem;
