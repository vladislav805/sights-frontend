import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import { ITabCurrentStyle } from '../Host';

interface ITabProps {
    title: React.ReactChild;
    selected: boolean;
    disabled: boolean;
    select: () => unknown;
    onSelect: (style: ITabCurrentStyle) => unknown;
}

const TabTitle: React.FC<ITabProps> = ({ title, selected, disabled, select, onSelect }: ITabProps) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const onClick = () => {
        if (disabled) {
            return;
        }

        select();
    };

    React.useEffect(() => {
        if (!selected || !ref.current) {
            return;
        }

        const { offsetWidth, offsetLeft } = ref.current;
        onSelect({
            left: offsetLeft,
            width: offsetWidth,
        });
    }, [selected]);

    return (
        <div
            ref={ref}
            className={classNames('tab-title', {
                'tab-title__selected': selected,
                'tab-title__disabled': disabled,
            })}
            onClick={onClick}>
            {title}
        </div>
    );
};

export { TabTitle };
