import * as React from 'react';
import API from '../../../api';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import LoadingSpinner from '../../../components/LoadingSpinner';

type IRandomProps = RouteComponentProps;

const Random: React.FC<IRandomProps> = (props: IRandomProps) => {
    React.useEffect(() => {
        void API.sights.getRandomSightId().then(sightId => {
            props.history.replace(`/sight/${sightId}`);
        });
    }, []);

    return <LoadingSpinner block />;
};

export default withRouter(Random);
