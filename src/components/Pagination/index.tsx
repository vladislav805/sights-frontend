import * as React from 'react';
import './style.scss';
import PaginationItem from './Item';

type IPaginationProps = {
    offset: number;
    count: number;
    by: number;
    onOffsetChange?: (offset: number) => void;
};

const Pagination: React.FC<IPaginationProps> = (props: IPaginationProps) => {
    const [pages, links]: React.ReactNode[] = React.useMemo(() => {
        const pages = Math.ceil(props.count / props.by);
        const currentPage = (props.offset / props.by) + 1;
        const range = 3;

        const links: React.ReactNode[] = [];

        const left = Math.max(currentPage - range, 1);
        const right = Math.min(currentPage + range, pages);

        const onPageChange = (page: number) => props.onOffsetChange((page - 1) * props.by);

        if (left !== 1) {
            links.push(
                <PaginationItem
                    key={1}
                    page={1}
                    target={onPageChange} />
            );
            left - 1 !== 1 && links.push('...');
        }

        for (let page = left; page <= right; ++page) {
            links.push(
                <PaginationItem
                    key={page}
                    page={page}
                    target={onPageChange}
                    active={page === currentPage} />
            );
        }

        if (right !== pages) {
            right + 1 !== pages && links.push('...');
            links.push(
                <PaginationItem
                    key={pages}
                    page={pages}
                    target={onPageChange} />
            );
        }

        return [pages, links];
    }, [props.offset, props.count]);


    return pages > 1 && (
        <div className="pagination">
            <div className="pagination--links">
                {links}
            </div>
        </div>
    );
};

export default Pagination;
