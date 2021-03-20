import * as React from 'react';
import './style.scss';
import PaginationItem from './Item';

type IPaginationProps = {
    offset: number;
    count: number;
    by: number;
    onOffsetChange?: (offset: number) => void;
};

const Pagination: React.FC<IPaginationProps> = ({ offset, count, by, onOffsetChange }: IPaginationProps) => {
    const [pages, links]: React.ReactNode[] = React.useMemo(() => {
        const pages = Math.ceil(count / by);
        const currentPage = (offset / by) + 1;
        const range = 3;

        const links: React.ReactNode[] = [];

        const left = Math.max(currentPage - range, 1);
        const right = Math.min(currentPage + range, pages);

        const onPageChange = (page: number) => onOffsetChange((page - 1) * by);

        if (left !== 1) {
            links.push(
                <PaginationItem
                    key={1}
                    page={1}
                    target={onPageChange} />,
            );
            if (left - 1 !== 1) {
                links.push('...');
            }
        }

        for (let page = left; page <= right; ++page) {
            links.push(
                <PaginationItem
                    key={page}
                    page={page}
                    target={onPageChange}
                    active={page === currentPage} />,
            );
        }

        if (right !== pages) {
            if (right + 1 !== pages) {
                links.push('...');
            }

            links.push(
                <PaginationItem
                    key={pages}
                    page={pages}
                    target={onPageChange} />,
            );
        }

        return [pages, links];
    }, [offset, count]);

    return pages > 1 && (
        <div className="pagination">
            <div className="pagination--links">
                {links}
            </div>
        </div>
    );
};

export default Pagination;
