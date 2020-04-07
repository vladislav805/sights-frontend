import * as React from 'react';
import './style.scss';
import { ITab, TabTitle, TabContent } from '..';
import classNames from 'classnames';

interface ITabHostProps {
    tabs: ITab[];
    defaultSelected?: string;
    className?: string;
    center?: boolean;
    wide?: boolean;
    padding?: boolean;
}

export type ITabCurrentStyle = {
    left: number;
    width: number;
};

const TabHost = ({
    tabs,
    className = '',
    defaultSelected,
    center = false,
    wide = false,
    padding = false,
}: ITabHostProps) => {
    const [selectedTab, setSelectedTab] = React.useState<string>();
    const [selectedTabStyle, setSelectedTabStyle] = React.useState<ITabCurrentStyle>({ left: 0, width: 0 });

    const selectTab = (name: string) => () => setSelectedTab(name);

    const onSelectTab = (style: ITabCurrentStyle) => setSelectedTabStyle(style);

    const css = {
        '--tabs-title-selected-line-left': `${selectedTabStyle.left}px`,
        '--tabs-title-selected-line-width': `${selectedTabStyle.width}px`,
    } as React.CSSProperties;

    React.useEffect(() => setSelectedTab(selectedTab || defaultSelected || tabs[0]?.name));

    return (
        <div className={classNames('tab-host', {
            [className]: !!className,
            'tab-host__centering': center,
            'tab-host__wide': wide,
            'tab-host__padding': padding,
        })}>
            <div className="tab-titles" style={css}>
                {tabs.map(({ title, name, disabled }) => (
                    <TabTitle
                        select={selectTab(name)}
                        onSelect={onSelectTab}
                        key={name}
                        title={title}
                        selected={name === selectedTab}
                        disabled={disabled} />
                ))}
            </div>
            <div className="tab-contents">
                {tabs.map(({ content, name }) => (
                    <TabContent
                        key={name}
                        content={content}
                        selected={name === selectedTab} />
                ))}
            </div>
        </div>
    );
};

export { TabHost };
