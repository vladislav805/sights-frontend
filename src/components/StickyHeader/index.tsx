import * as React from 'react';
import './style.scss';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';

type IStickyHeaderProps = {
    showHeader?: boolean;
    left?: React.ReactChild;
    right?: React.ReactChild;
    collapsable?: boolean;
    defaultCollapsed?: boolean;
};

const StickyHeader = ({
    children,
    showHeader = true,
    left,
    right,
    collapsable = false,
    defaultCollapsed = false,
}: PropsWithChildren<IStickyHeaderProps>) => {
    const [collapsed, setCollapsed] = React.useState<boolean>(defaultCollapsed);
    const toggleCollapse = () => setCollapsed(!collapsed);
    const contentRef = React.useRef<HTMLDivElement>();
    React.useEffect(() => {
        const div = contentRef.current;
        const height = Array.prototype.reduce.call(div.children, (acc: number, child: HTMLElement) => acc + child.offsetHeight, 0);
        div.style.setProperty('--content-height', `${height}px`);
    }, [collapsed, children]);
    return (
        <div className={classNames('stickyHeader', {
            'stickyHeader__empty': !showHeader,
            'stickyHeader__collapsable': collapsable,
            'stickyHeader__uncollapsed': collapsable && !collapsed,
        })}>
            <div className="stickyHeader-header" onClick={collapsable ? toggleCollapse : undefined}>
                <h3 className="stickyHeader-header--left">{left}</h3>
                {right && (
                    <div className="stickyHeader-header--right">{right}</div>
                )}
            </div>
            <div ref={contentRef} className="stickyHeader-content">
                {children}
            </div>
        </div>
    );
};

export default StickyHeader;
