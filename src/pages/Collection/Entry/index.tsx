import * as React from 'react';
import './style.scss';
import { ICollectionExtended } from '../../../api/types/collection';
import { Link, useParams } from 'react-router-dom';
import { apiExecute } from '../../../api';
import StickyHeader from '../../../components/StickyHeader';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Format, humanizeDateTime } from '../../../utils';
import { TabHost } from '../../../components/Tabs';
import MarkdownRenderer from '../../../components/MarkdownRenderer';
import { CollectionEntrySightsList } from './sights';

type ICollectionEntryPageProps = never;

type ICollectionEntryMatch = {
    collectionId: string;
};

type ICollectionEntryApiResult = {
    c: ICollectionExtended;
};

const CollectionEntryPage: React.FC<ICollectionEntryPageProps> = ( /*props: ICollectionEntryPageProps*/ ) => {
    const [collection, setCollection] = React.useState<ICollectionExtended>(null);

    const match = useParams<ICollectionEntryMatch>();

    React.useEffect(() => {
        void apiExecute<ICollectionEntryApiResult>('const id=+A.id,c=API.collections.getById({collectionId:id,fields:A.f}),p=c?.cityId&&API.cities.get({cityIds:c.cityId});return{c,p};', {
            id: +match.collectionId,
            f: 'photo',
        }).then(result => {
            setCollection(result.c);
        });
    }, [match]);

    if (!collection) {
        return <LoadingSpinner block subtitle="Загрузка..." />
    }

    return (
        <div>
            <StickyHeader left={collection.title}>
                <MarkdownRenderer className="collection-entry--content">
                    {collection.content}
                </MarkdownRenderer>
                {collection.cityId !== null && (
                    <p>Город: <Link to={`/search/?cityId=${collection.cityId}`}>{collection.cityId}</Link></p>
                )}
                <p className="collection-entry--date">
                    Создано {humanizeDateTime(collection.dateCreated, Format.FULL)}
                    {collection.dateUpdated > 0 && `, обновлено ${humanizeDateTime(collection.dateUpdated, Format.FULL)}`}
                </p>
            </StickyHeader>
            <StickyHeader left="Достопримечательности">
                <TabHost tabs={[
                    {
                        name: 'list',
                        title: 'Списком',
                        // eslint-disable-next-line react/display-name
                        content: () => (
                            <CollectionEntrySightsList items={collection.items} />
                        ),
                    },
                    {
                        name: 'map',
                        title: 'Карта',
                        content: null,
                    }
                ]} />
            </StickyHeader>
        </div>
    );
};

export default CollectionEntryPage;
