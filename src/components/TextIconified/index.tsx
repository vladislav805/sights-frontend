import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import Icon from '@mdi/react';

interface ITextIconifiedProps {
    icon: string;
    className?: string;
    classNameContent?: string;
}

const TextIconified: React.FC<ITextIconifiedProps> = ({ icon, children, className, classNameContent }: React.PropsWithChildren<ITextIconifiedProps>) => (
    <div className={classNames('textIconified', className)}>
        <Icon
            className="textIconified-icon"
            path={icon} />
        <div className={classNames('textIconified-content', classNameContent)}>{children}</div>
    </div>
);

export default TextIconified;
