import * as React from 'react';
import { connect } from 'react-redux';
import { RootStore, setPageInfo, TypeOfConnect } from '../../redux';

const withStore = connect(
    (state: RootStore) => ({ pageBackLink: state.pageBackLink }),
    { setPageInfo },
);

type IPageTitleProps = TypeOfConnect<typeof withStore> & React.PropsWithChildren<{
    backLink?: string;
}>;

const PageTitle: React.FC<IPageTitleProps> = ({ children, setPageInfo, backLink }: IPageTitleProps) => {
    React.useEffect(() => {
        document.title = React.Children.toArray(children).join('');
    }, [children]);

    React.useEffect(() => {
        setPageInfo({
            pageBackLink: backLink,
        });
    }, [backLink]);
    return null;
};

export default withStore(PageTitle);
