import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import SightPageLayout from '../../../components/SightInfoLayout';
import Comments from '../../../components/Comments';
import { withAwaitForUser, IComponentWithUserProps } from '../../../hoc/withAwaitForUser';
import SightMapLayout from '../../../components/SightMapLayout';
import API, { ISight, IUser, IVisitStateStats } from '../../../api';
import LoadingWrapper from '../../../components/LoadingWrapper';

interface ISightPageRouteProps {
    id?: string;
}

type ISightEntryProps = RouteComponentProps<ISightPageRouteProps> & IComponentWithUserProps;

interface ISightEntryState {
    sight?: ISight;
    visits?: IVisitStateStats;
    author?: IUser;
}

class SightEntry extends React.Component<ISightEntryProps, ISightEntryState> {
    state: ISightEntryState = {};

    private getId = (from: ISightEntryProps = this.props): number => +from.match.params.id;

    componentDidMount() {
        this.tryFetchSightInfo();
    }

    componentDidUpdate(prevProps: Readonly<ISightEntryProps>) {
        if (this.getId() !== this.getId(prevProps)) {
            this.setState({
                sight: undefined,
                visits: undefined,
                author: undefined,
            }, this.tryFetchSightInfo);
            return;
        }
    }

    private tryFetchSightInfo = () => {
        const id = this.getId();

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
        const { match, currentUser } = this.props;
        const { sight, visits, author } = this.state;
        const sightId: number = +match.params.id;
        return (
            <div className="sight-page" key={sightId}>
                <LoadingWrapper
                    loading={!sight}
                    render={() => (
                        <>
                            <SightPageLayout sight={sight} author={author} />
                            <SightMapLayout sight={sight} visits={visits} isUser={!!currentUser} />
                        </>
                    )} />
                <Comments sightId={sightId} showForm={!!currentUser} />
            </div>
        );
    }
}

export default withAwaitForUser(withRouter(SightEntry));
