import * as React from 'react';
import { mdiFileDownloadOutline } from '@mdi/js';
import { ISight } from '../../../api/types/sight';
import Button from '../../../components/Button';
import { ICollection } from '../../../api/types/collection';
import { IUser } from '../../../api/types/user';
import generateAndDownloadGPX from '../../../utils/make-gpx';

type ICollectionEntryRouteProps = {
    items: ISight[];
    collection: ICollection;
    author: IUser;
};

export const CollectionEntryRoute: React.FC<ICollectionEntryRouteProps> = (props: ICollectionEntryRouteProps) => {
    const { items, collection, author } = props;

    const onClickExport = React.useMemo(() => () => {
        generateAndDownloadGPX({
            sights: items,
            title: collection.title,
            description: `Коллекция ${collection.title}`,
            filename: `${collection.collectionId}_${collection.title}`,
            author,
        });
    }, [items]);

    return (
        <div style={{ padding: '1rem' }}>
            <Button
                label="Скачать GPX-файл"
                type="button"
                icon={mdiFileDownloadOutline}
                onClick={onClickExport} />
        </div>
    );
};
