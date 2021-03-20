import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as React from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../api';
import { parseQueryString } from '../../utils/qs';
import { IApiError } from '../../api/types/base';

type IActivationProps = RouteComponentProps;

const Activation: React.FC<IActivationProps> = (props: IActivationProps) => {
    React.useEffect(() => {
        const query = parseQueryString(props.location.search);

        API.account.activate({ hash: query.get('hash') })
            .then(() => {
                props.history.replace('/island/login?from=activation');
            })
            .catch((e: IApiError) => {
                alert(`Ошибка:\n${e.message}`);
            });
    }, []);
    return <LoadingSpinner size="xl" block subtitle="Активация..." />;
};

export default withRouter(Activation);
