import * as React from 'react';
import LoadingWrapper from '../../../components/LoadingWrapper';
import api from '../../../api';
import { withRouter, RouteComponentProps } from 'react-router-dom';

type IRandomProps = RouteComponentProps;

class Random extends React.Component<IRandomProps> {
    componentDidMount() {
        api<number>('sights.getRandomSightId', {}).then(sightId => {
            this.props.history.replace(`/sight/${sightId}`);
        });
    }

    render() {
        return (
            <LoadingWrapper loading={true} />
        );
    }
}

export default withRouter(Random);
