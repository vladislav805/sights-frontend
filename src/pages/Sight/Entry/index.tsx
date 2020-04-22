import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import API, { IPhoto, ISight, IUser, IVisitStateStats } from '../../../api';
import SightPageLayout from '../../../components/SightPageLayout';
import LoadingWrapper from '../../../components/LoadingWrapper';
import Comments from '../../../components/Comments';
import { withAwaitForUser, IComponentWithUserProps } from '../../../hoc/withAwaitForUser';

interface ISightPageRouteProps {
    id?: string;
}

type ISightEntryProps = RouteComponentProps<ISightPageRouteProps> & IComponentWithUserProps;

interface ISightEntryState {
    sight?: ISight;
    visits?: IVisitStateStats;
    photos?: IPhoto[];
    author?: IUser;
}

class SightEntry extends React.Component<ISightEntryProps, ISightEntryState> {
    state: ISightEntryState = {};

    private getId = (from: ISightEntryProps = this.props): number => +from.match.params.id;

    componentDidMount() {
        this.tryFetchSightInfo()
    }

    componentDidUpdate(prevProps: ISightEntryProps) {
        if (this.getId() !== this.getId(prevProps)) {
            this.setState({
                sight: undefined,
                author: undefined,
                photos: undefined,
            }, this.tryFetchSightInfo);
        }
    }

    private tryFetchSightInfo = () => {
        const id = Number(this.props.match.params.id);
        if (isNaN(id)) {
            console.error('string passed');
            return;
        }
        this.fetchSightInfo(id);
    };

    private fetchSightInfo = async(sightId: number) => {
        const { sight, author, visits } = await API.execute<{
            sight: ISight;
            author: IUser;
            visits: IVisitStateStats;
        }>('i=getArg sightId;i=int $i;s=call sights.getById -sightId $i;a=call users.get -userIds $s/ownerId;v=call sights.getVisitCount -sightId $i;res=new object;set $res -f sight,author,visits -v $s,$a/0,$v;ret $res', {
            sightId
        });
        this.setState({ sight, author, visits });
    };

    render() {
        const sightId: number = +this.props.match.params.id;
        return (
            <div className="sight-page" key={sightId}>
                <LoadingWrapper
                    loading={!this.state.sight}
                    render={() => (
                        <SightPageLayout
                            sight={this.state.sight}
                            author={this.state.author}
                            visits={this.state.visits} />
                    )} />
                <Comments sightId={sightId} showForm={!!this.props.currentUser} />
            </div>
        );
    }
}

export default withAwaitForUser(withRouter(SightEntry));
