import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as React from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import withSpinnerWrapper from '../../components/LoadingSpinner/wrapper';
import API from '../../api';
import { parseQueryString } from '../../utils';
import { IApiError } from '../../api/types/base';

type IActivationProps = RouteComponentProps;

const Activation: React.FC<IActivationProps> = (props: IActivationProps) => {
    React.useEffect(() => {
        const query = parseQueryString(props.location.search);
        void API.account.activate({ hash: query.get('hash') })
            .then(() => {
                props.history.replace('/island/login?from=activation');
            })
            .catch((e: IApiError) => {
                alert(`Ошибка:\n${e.message}`);
            });
    }, []);
    return withSpinnerWrapper(<LoadingSpinner size="xl" />);
};

export default withRouter(Activation);
