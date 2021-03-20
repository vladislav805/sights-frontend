import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import API from '../../../api';
import LoadingSpinner from '../../../components/LoadingSpinner';

type IRandomProps = RouteComponentProps;

const Random: React.FC<IRandomProps> = (props: IRandomProps) => {
    React.useEffect(() => {
        API.sights.getRandomSightId().then(sightId => {
            props.history.replace(`/sight/${sightId}`);
        });
    }, []);

    return <LoadingSpinner block />;
};

export default withRouter(Random);
