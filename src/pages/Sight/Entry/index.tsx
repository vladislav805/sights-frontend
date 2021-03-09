import * as React from 'react';
import './style.scss';
import { useParams } from 'react-router-dom';
import SightPageLayout from '../../../components/SightInfoLayout';
import Comments from '../../../components/Comments';
import SightMapLayout from '../../../components/SightMapLayout';
import API, { apiExecute } from '../../../api';
import InfoSplash from '../../../components/InfoSplash';
import { mdiAlien } from '@mdi/js';
import { entriesToMap } from '../../../utils/entriesToMap';
import SightPhotoLayout from '../../../components/SightPhotoLayout';
// import VisitStateSelector from '../../../components/VisitStateSelector';
import LoadingSpinner from '../../../components/LoadingSpinner';
import VisitStateSelector from '../../../components/VisitStateSelector';
import { ISight, IVisitStateStats } from '../../../api/types/sight';
import { IUser } from '../../../api/types/user';
import { IPhoto } from '../../../api/types/photo';
import { ITag } from '../../../api/types/tag';
import PageTitle from '../../../components/PageTitle';
import StarRating from '../../../components/StarRating';
import useCurrentUser from '../../../hook/useCurrentUser';

export type ISightEntryParams = {
    id?: string;
};

enum SightPageStage {
    LOADING,
    DONE,
    ERROR,
}

const SightEntry: React.FC = () => {
    const [stage, setStage] = React.useState<SightPageStage>(SightPageStage.LOADING);
    const [sight, setSight] = React.useState<ISight>();
    const [tags, setTags] = React.useState<ITag[]>([]);
    const [photos, setPhotos] = React.useState<IPhoto[]>([]);
    const [users, setUsers] = React.useState<Map<number, IUser>>();
    const [visits, setVisits] = React.useState<IVisitStateStats>();
    const currentUser = useCurrentUser();
    const match = useParams<ISightEntryParams>();

    const getId = React.useMemo(() => () => +match.id, []);

    const onRatingChange = React.useMemo(() => {
        return (rating: number) =>
            API.rating.set({ sightId, rating })
                .then(rating => setSight({
                    ...sight,
                    rating,
                }));
    }, [sight]);

    React.useEffect(() => {
        const id = getId();

        if (isNaN(id)) {
            setStage(SightPageStage.ERROR);
            return;
        }

        type IExecuteResult = {
            sight: ISight;
            photos: IPhoto[];
            tags: ITag[];
            users: IUser[];
            near: ISight[];
            visits: IVisitStateStats;
        };

        void apiExecute<IExecuteResult>(
            'const i=+A.id,s=API.sights.getById({sightIds:i,fields:A.sf}).items[0],p=API.photos.get({sightId:i}).items,t=API.tags.getById({tagIds:s.tags});return{sight:s,photos:p,tags:t,users:API.users.get({userIds:concat(s.ownerId,col(p,"ownerId")),fields:A.uf}),near:API.sights.getNearby({latitude:s.latitude,longitude:s.longitude,count:7,distance:1000}),visits:API.sights.getVisitStat({sightId:i})};',
            {
                id,
                sf: ['tags', 'city', 'visitState', 'rating'],
                uf: ['ava'],
            },
        ).then(({ sight, photos, tags, users, visits }) => {
            setSight(sight);
            setUsers(entriesToMap(users, 'userId'));
            setPhotos(photos);
            setTags(tags);
            setVisits(visits);
            setStage(SightPageStage.DONE);
        });
    }, [])

    const sightId = getId();

    if (stage === SightPageStage.LOADING) {
        return (
            <LoadingSpinner
                block
                subtitle="Загрузка информации о достопримечательности..."
                size="l" />
        );
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
            <PageTitle>Достопримечательность {sight && sight.title}</PageTitle>
            <SightPageLayout
                sight={sight}
                photo={photo}
                author={author}
                tags={tags}
                onChangeSight={setSight} />
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
                    <StarRating
                        value={sight.rating.value}
                        count={sight.rating.count}
                        rated={sight.rating.rated}
                        enabled={!!currentUser}
                        onRatingChange={onRatingChange} />
                    <SightPhotoLayout
                        sightId={sightId}
                        currentUser={currentUser}
                        users={users}
                        photos={photos}/>
                    <Comments
                        type="sight"
                        sightId={sightId}
                        showForm={!!currentUser} />
                </div>
            </div>
        </div>
    );
}

export default SightEntry;
