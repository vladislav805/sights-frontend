import * as React from 'react';
import './style.scss';
import API, { ISight, IUser, IVisitStateStats } from '../../api';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import VisitStateSelector from '../VisitStateSelector';
import LoadingWrapper from '../LoadingWrapper';
import MapX from '../Map';

interface ISightPageLayoutProps {
    sightId: number;
}

interface ISightPageLayoutState {
    loading: boolean;
    sight?: ISight;

}

interface ISightPageLayoutState {
    sight?: ISight;
    visits?: IVisitStateStats;
    author?: IUser;
}

export default class SightPageLayout extends React.Component<ISightPageLayoutProps, ISightPageLayoutState> {
    state: ISightPageLayoutState = {
        loading: true,
    };

    componentDidMount() {
        this.tryFetchSightInfo()
    }

    componentDidUpdate(prevProps: ISightPageLayoutProps) {
        if (this.props.sightId !== prevProps.sightId) {
            this.setState({
                sight: undefined,
                visits: undefined,
                author: undefined,
            }, this.tryFetchSightInfo);
        }
    }

    private tryFetchSightInfo = () => {
        const id = this.props.sightId;

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
        if (!this.state.sight) {
            return (
                <LoadingWrapper
                    loading
                    subtitle="Загрузка информации о достопримечательности..." />
            );
        }

        const {
            sightId,
            title,
            description,
            lat,
            lng,
            isVerified,
            isArchived,
            dateCreated,
            dateUpdated,
            canModify,
            city,
            photo,
            visitState,
        } = this.state.sight;
        const {
            firstName,
            lastName,
            login,
        } = this.state.author;

        return (
            <div className={classNames('sight-page-layout', {
                'sight-page-layout__withPhoto': !!photo,
            })}>
                {photo && (
                    <div
                        className="sight-page-layout-photo"
                        style={{
                            '--sight-photo': `url(${photo.photoMax})`,
                            '--sight-photo-ratio': photo.height && `${Math.min(55, photo.height / photo.width * 100)}%`,
                        } as React.CSSProperties} />
                )}
                <div className="sight-page-layout-info">
                    <h1>{title}</h1>
                    <h4>{city && city.name}</h4>
                    <p>{description}</p>
                    <p>
                        Добавлено пользователем <Link to={`/user/${login}`}>{firstName} {lastName}</Link>
                    </p>
                </div>
                <div className="sight-page-layout-advanced">
                    <div className="sight-page-layout-advanced-map">
                        <MapX
                            items={[{
                                id: 1,
                                title: 'Местопоожение',
                                position: [lat, lng],
                            }]}
                            position={{ center: [lat, lng], zoom: 15 }}
                            saveLocation={false} />
                    </div>
                    <div className="sight-page-layout-advanced-info">
                        <VisitStateSelector
                            stats={this.state.visits}
                            selected={visitState}
                            canChange={true}
                            sightId={sightId} />
                    </div>
                </div>
            </div>
        );
    }
}
