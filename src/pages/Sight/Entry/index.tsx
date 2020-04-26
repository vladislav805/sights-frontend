import * as React from 'react';
import './style.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import SightPageLayout from '../../../components/SightInfoLayout';
import Comments from '../../../components/Comments';
import { withAwaitForUser, IComponentWithUserProps } from '../../../hoc/withAwaitForUser';
import SightMapLayout from '../../../components/SightMapLayout';
import API, { IApiError, IMark, ISight, IUser, IVisitStateStats } from '../../../api';
import LoadingWrapper from '../../../components/LoadingWrapper';
import InfoSplash from '../../../components/InfoSplash';
import { mdiAlien } from '@mdi/js';
import { entriesToMap } from '../../../utils';
import SightPhotoLayout from '../../../components/SightPhotoLayout';
import VisitStateSelector from '../../../components/VisitStateSelector';

interface ISightPageRouteProps {
    id?: string;
}

type ISightEntryProps = RouteComponentProps<ISightPageRouteProps> & IComponentWithUserProps;

enum SightPageStage {
    LOADING,
    DONE,
    ERROR,
}

interface ISightEntryState {
    stage: SightPageStage;
    sight?: ISight;
    visits?: IVisitStateStats;
    author?: IUser;
    marks?: Map<number, IMark>;
}

class SightEntry extends React.Component<ISightEntryProps, ISightEntryState> {
    state: ISightEntryState = {
        stage: SightPageStage.LOADING,
    };

    private getId = (from: ISightEntryProps = this.props): number => +from.match.params.id;

    componentDidMount() {
        this.tryFetchSightInfo();
    }

    componentDidUpdate(prevProps: Readonly<ISightEntryProps>) {
        if (this.getId() !== this.getId(prevProps)) {
            this.setState({
                stage: SightPageStage.LOADING,
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
            this.setState(() => ({
                stage: SightPageStage.ERROR,
            }));
            return;
        }

        this.fetchSightInfo(id);
    };

    private fetchSightInfo = async(sightId: number) => {
        const { sight, author, visits, marks } = await API.execute<{
            sight: ISight | IApiError;
            author: IUser;
            visits: IVisitStateStats;
            marks: IMark[];
        }>('i=getArg sightId;i=int $i;s=call sights.getById -sightId $i;a=call users.get -userIds $s/ownerId;v=call sights.getVisitCount -sightId $i;m=call marks.getById -markIds $s/markIds;res=new object;set $res -f sight,author,visits,marks -v $s,$a/0,$v,$m;ret $res', {
            sightId
        });

        if ((sight as IApiError).errorId) {
            this.setState({ stage: SightPageStage.ERROR });
            return;
        }

        this.setState({
            stage: SightPageStage.DONE,
            sight: sight as ISight,
            author,
            visits,
            marks: entriesToMap(marks, 'markId'),
        });
    };

    render() {
        const { match, currentUser } = this.props;
        const { stage, sight, visits, author, marks } = this.state;
        const sightId: number = +match.params.id;

        if (stage === SightPageStage.ERROR) {
            return (
                <InfoSplash
                    icon={mdiAlien}
                    title="Место не найдено"
                    description="Возможно, его похитили злые администраторы, либо Вам дали неправильную ссылку на страницу" />
            )
        }

        return (
            <div className="sight-page" key={sightId}>
                <LoadingWrapper
                    loading={stage === SightPageStage.LOADING}
                    subtitle="Загрузка информации о достопримечательности..."
                    render={() => (
                        <>
                            <SightPageLayout sight={sight} author={author} marks={marks} />
                            <div className="sight-page-cols">
                                <div className="sight-page-map">
                                    <SightMapLayout sight={sight} />
                                </div>
                                <div className="sight-page-userdata">
                                    <VisitStateSelector
                                        stats={visits}
                                        selected={sight.visitState}
                                        canChange={!!currentUser}
                                        sightId={sightId} />
                                    <SightPhotoLayout sightId={sightId} currentUser={currentUser} />
                                    <Comments sightId={sightId} showForm={!!currentUser} />
                                </div>
                            </div>
                        </>
                    )} />
            </div>
        );
    }
}

export default withAwaitForUser(withRouter(SightEntry));
