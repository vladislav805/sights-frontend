import * as React from 'react';
import { RootStore, setPageInfo, TypeOfConnect } from '../../redux';
import { connect } from 'react-redux';

type IPageTitleProps = TypeOfConnect<typeof withStore> & React.PropsWithChildren<{
    backLink?: string;
}>;

const withStore = connect(
    (state: RootStore) => ({ ...state }),
    { setPageInfo },
    null,
    { pure: false },
);


const PageTitle: React.FC<IPageTitleProps> = (props: IPageTitleProps) => {
    React.useEffect(() => {
        document.title = React.Children.toArray(props.children).join(' ');
    }, [props.children]);

    React.useEffect(() => {
        props.setPageInfo({
            pageBackLink: props.backLink,
        });
    }, [props.backLink]);
    return null;
};

export default withStore(PageTitle);
