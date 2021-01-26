import * as React from 'react';
import './style.scss';
import classNames from 'classnames';

interface ITabContentProps {
    content: React.ReactChild;
    selected: boolean;
}

const TabContent: React.FC<ITabContentProps> = ({ content, selected }: ITabContentProps) => (
    <div className={classNames('tab-content', {
        'tab-content__selected': selected,
    })}>
        {selected && content}
    </div>
);

export { TabContent };
