import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import { parseQueryString } from '../../../utils/qs';
import Config from '../../../config';
import { ITabCurrentStyle, ITabHostProps } from '../common';
import { TabTitle } from '../Tab';

const TabHost: React.FC<ITabHostProps> = ({
    tabs,
    className,
    defaultSelected,
    center = false,
    wide = false,
    padding = false,
    saveSelectedInLocation = false,
    onTabChanged,
    children,
}: ITabHostProps) => {
    const [selectedTab, setSelectedTab] = React.useState<string>(defaultSelected ?? tabs[0]?.name);
    const [selectedTabStyle, setSelectedTabStyle] = React.useState<ITabCurrentStyle>({ left: 0, width: 0 });

    const selectTab = (name: string) => () => setSelectedTab(name);

    const onSelectTab = (style: ITabCurrentStyle) => setSelectedTabStyle(style);

    const css = {
        '--tabs-title-selected-line-left': `${selectedTabStyle.left}px`,
        '--tabs-title-selected-line-width': `${selectedTabStyle.width}px`,
    } as React.CSSProperties;

    if (!Config.isServer) {
        React.useEffect(() => {
            if (saveSelectedInLocation) {
                const params = parseQueryString(window.location.search.slice(1));
                params.set('tab', selectedTab);
                window.history.replaceState(null, null, `?${params.toString()}`);
            }

            onTabChanged?.(selectedTab);
        }, [selectedTab]);
    }

    return (
        <div className={classNames('tab-host', {
            'tab-host__centering': center,
            'tab-host__wide': wide,
            'tab-host__padding': padding,
        }, className)}>
            <div className="tab-titles" style={css}>
                {tabs.map((tab) => (
                    <TabTitle
                        select={selectTab(tab.name)}
                        onSelect={onSelectTab}
                        key={tab.name}
                        title={tab.title}
                        selected={tab.name === selectedTab}
                        disabled={tab.disabled} />
                ))}
            </div>
            <div className="tab-contents">{children}</div>
        </div>
    );
};

export { TabHost };
