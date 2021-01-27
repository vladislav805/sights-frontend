import * as React from 'react';
import { ICollection } from '../../api/types/collection';
import API, { apiExecute } from '../../api';
import { IApiList } from '../../api/types/api';
import DropDownButton, { IDropDownItemProps } from '../DropDownButton';
import { mdiBookPlusOutline } from '@mdi/js';

type IAddToCollectionProps = {
    sightId: number;
};

type Result = {
    c: IApiList<ICollection>;
    a: number[];
};

const request = (sightId: number) => apiExecute<Result>('const c=API.collections.get({count:200}),a=col(API.collections.getBySight({sightId:+A.sid}), "collectionId");return{c,a};', {
    sid: sightId,
}).then(result => {
    const collections = result.c.items;
    const affiliates = new Set(result.a);

    return collections.map(item => ({
        id: item.collectionId,
        title: item.title,
        checked: affiliates.has(item.collectionId),
    }));
});

const AddToCollection: React.FC<IAddToCollectionProps> = (props: IAddToCollectionProps) => {
    const [items, setItems] = React.useState<IDropDownItemProps[]>(null);
    const [loading, setLoading] = React.useState<boolean>(false);

    const onShow = () => {
        if (!items) {
            void request(props.sightId).then(result => {
                setItems(result);
                setLoading(false);
            });
        }
    };

    const onUpdate = (newList: IDropDownItemProps[], updated: IDropDownItemProps) => {
        setLoading(true);
        void API.collections.setAffiliate({
            sightId: props.sightId,
            collectionId: updated.id as number,
            affiliate: updated.checked,
        }).then(() => {
            setLoading(false);
        });
    };

    return (
        <DropDownButton
            onShow={onShow}
            onListChanged={onUpdate}
            items={items}
            loading={loading}
            title="В коллекцию"
            icon={mdiBookPlusOutline} />
    );
};

export default AddToCollection;
