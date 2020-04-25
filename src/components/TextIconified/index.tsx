import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import Icon from '@mdi/react';

interface ITextIconifiedProps {
    icon: string;
    className?: string;
}

const TextIconified = ({ icon, children, className }: React.PropsWithChildren<ITextIconifiedProps>) => (
    <div className={classNames('textIconified', className)}>
        <Icon
            className="textIconified-icon"
            path={icon} />
        <div className="textIconified-content">{children}</div>
    </div>
);

export default TextIconified;
