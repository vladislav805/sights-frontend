import * as React from 'react';

type IPageTitleProps = React.PropsWithChildren<unknown>;

const PageTitle: React.FC<IPageTitleProps> = (props: IPageTitleProps) => {
    React.useEffect(() => {
        document.title = React.Children.toArray(props.children).join(' ');
    }, [props.children]);
    return null;
};

export default PageTitle;
