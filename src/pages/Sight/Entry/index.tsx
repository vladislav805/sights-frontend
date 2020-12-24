import * as React from 'react';
import './style.scss';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import SightPageLayout from '../../../components/SightInfoLayout';
import Comments from '../../../components/Comments';
import { IComponentWithUserProps, withAwaitForUser } from '../../../hoc/withAwaitForUser';
import SightMapLayout from '../../../components/SightMapLayout';
import { apiExecute, IPhoto, ISight, ITag, IUser, IVisitStateStats } from '../../../api';
import InfoSplash from '../../../components/InfoSplash';
import { mdiAlien } from '@mdi/js';
import { entriesToMap } from '../../../utils';
import SightPhotoLayout from '../../../components/SightPhotoLayout';
// import VisitStateSelector from '../../../components/VisitStateSelector';
import LoadingSpinner from '../../../components/LoadingSpinner';
import withSpinnerWrapper from '../../../components/LoadingSpinner/wrapper';
import VisitStateSelector from '../../../components/VisitStateSelector';

export type ISightEntryProps = RouteComponentProps<{
    id?: string;
}> & IComponentWithUserProps;

enum SightPageStage {
    LOADING,
    DONE,
    ERROR,
}

interface ISightEntryState {
    stage: SightPageStage;
    sight?: ISight;
    visits?: IVisitStateStats;
    users?: Map<number, IUser>;
    photos?: IPhoto[];
    tags?: ITag[];
}

class SightEntry extends React.Component<ISightEntryProps, ISightEntryState> {
    state: ISightEntryState = {
        stage: SightPageStage.LOADING,
    };

    private getId = (from: ISightEntryProps = this.props): number => +from.match.params.id;

    public componentDidMount() {
        this.tryFetchSightInfo();
    }

    public componentDidUpdate(prevProps: Readonly<ISightEntryProps>) {
        if (this.getId() !== this.getId(prevProps)) {
            this.setState({
                stage: SightPageStage.LOADING,
                sight: undefined,
                visits: undefined,
            }, this.tryFetchSightInfo);
            return;
        }
    }

    private tryFetchSightInfo = () => {
        const id = this.getId();

        if (isNaN(id)) {
            this.setState(() => ({
                stage: SightPageStage.ERROR,
            }));
            return;
        }

        void this.fetchSightInfo(id);
    };

    private fetchSightInfo = async(sightId: number) => {
        type IExecuteResult = {
            sight: ISight;
            photos: IPhoto[];
            tags: ITag[];
            users: IUser[];
            visits: IVisitStateStats;
        };

        const { sight, photos, tags, users, visits } = await apiExecute<IExecuteResult>(
            'const i=+A.id,s=API.sights.getById({sightIds:i,fields:A.sf}).items[0],p=API.photos.get({sightId:i}).items,t=API.tags.getById({tagIds:s.tags});return{sight:s,photos:p,tags:t,users:API.users.get({userIds:concat(s.ownerId,col(p, "ownerId")),fields:A.uf}),near:API.sights.getNearby({latitude:s.latitude,longitude:s.longitude,count:7,distance:1000}),visits:API.sights.getVisitStat({sightId:i})};',
            {
                id: sightId,
                sf: ['author', 'tags', 'city', 'visitState', 'rating'],
                uf: ['ava'],
            },
        );

        this.setState({
            stage: SightPageStage.DONE,
            sight,
            tags,
            photos,
            users: entriesToMap(users, 'userId'),
            visits,
        });
    };

    public render() {
        const { match, currentUser } = this.props;
        const { stage, sight, users, tags, photos, visits } = this.state;
        const sightId: number = +match.params.id;

        if (stage === SightPageStage.LOADING) {
            return withSpinnerWrapper(<LoadingSpinner size="l" />, 'Загрузка информации о достопримечательности...');
        }

        if (stage === SightPageStage.ERROR) {
            return (
                <InfoSplash
                    icon={mdiAlien}
                    title="Место не найдено"
                    description="Возможно, его похитили злые администраторы, либо Вам дали неправильную ссылку на страницу" />
            )
        }

        const author = users.get(sight.ownerId);
        const photo = photos[0];

        return (
            <div className="sight-page" key={sightId}>
                <SightPageLayout
                    sight={sight}
                    photo={photo}
                    author={author}
                    tags={tags} />
                <div className="sight-page-cols">
                    <div className="sight-page-map">
                        <SightMapLayout
                            sight={sight}
                            nearSights={[]} />
                    </div>
                    <div className="sight-page-userdata">
                        <VisitStateSelector
                            stats={visits}
                            selected={sight.visitState}
                            canChange={!!currentUser}
                            sightId={sightId} />
                        <SightPhotoLayout
                            sightId={sightId}
                            currentUser={currentUser}
                            users={users}
                            photos={photos}/>
                        <Comments
                            sightId={sightId}
                            showForm={!!currentUser} />
                    </div>
                </div>
            </div>
        );
    }
}

export default withAwaitForUser(withRouter(SightEntry));
