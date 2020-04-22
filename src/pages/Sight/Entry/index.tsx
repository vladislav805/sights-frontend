import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import SightPageLayout from '../../../components/SightPageLayout';
import Comments from '../../../components/Comments';
import { withAwaitForUser, IComponentWithUserProps } from '../../../hoc/withAwaitForUser';

interface ISightPageRouteProps {
    id?: string;
}

type ISightEntryProps = RouteComponentProps<ISightPageRouteProps> & IComponentWithUserProps;

interface ISightEntryState {

}

class SightEntry extends React.Component<ISightEntryProps, ISightEntryState> {
    render() {
        const sightId: number = +this.props.match.params.id;
        return (
            <div className="sight-page" key={sightId}>
                <SightPageLayout sightId={sightId} />
                <Comments sightId={sightId} showForm={!!this.props.currentUser} />
            </div>
        );
    }
}

export default withAwaitForUser(withRouter(SightEntry));
