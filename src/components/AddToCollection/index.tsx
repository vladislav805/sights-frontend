import * as React from 'react';
import { ICollection } from '../../api/types/collection';
import API, { apiExecute } from '../../api';
import { IApiList } from '../../api/types/api';
import Button from '../Button';

type IAddToCollectionProps = {
    sightId: number;
};

const AddToCollection: React.FC<IAddToCollectionProps> = (props: IAddToCollectionProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [collections, setCollections] = React.useState<ICollection[]>(null);
    const [affiliates, setAffiliate] = React.useState<Set<number>>(new Set());

    const toggleOpen = () => setOpen(!open);

    React.useEffect(() => {
        if (!open || collections) {
            return;
        }

        setLoading(true);

        type Result = {
            c: IApiList<ICollection>;
            a: number[];
        };
        void apiExecute<Result>('const c=API.collections.get({count:200}),a=col(API.collections.getBySight({sightId:+A.sid}), "collectionId");return{c,a};', {
            sid: props.sightId,
        })
            .then(result => {
                setCollections(result.c.items);
                setAffiliate(new Set(result.a));
                setLoading(false);
            });
    }, [open]);

    const setterAffiliate = (collection: ICollection) => () => {
        setOpen(false);
        setLoading(true);

        const isAffiliate = affiliates.has(collection.collectionId);

        if (isAffiliate) {
            affiliates.delete(collection.collectionId);
        } else {
            affiliates.add(collection.collectionId);
        }

        void API.collections.setAffiliate({
            sightId: props.sightId,
            collectionId: collection.collectionId,
            affiliate: !isAffiliate,
        }).then(() => {
            setAffiliate(new Set(affiliates));
            setLoading(false);
        });
    };

    return (
        <div>
            <Button
                label="В коллекцию"
                onClick={toggleOpen}
                loading={loading} />
            <div hidden={!open}>
                {collections?.map(collection => {
                    const isAffiliate = affiliates.has(collection.collectionId);
                    return (
                        <div key={collection.collectionId} onClick={setterAffiliate(collection)}>{isAffiliate && '[affiliate]'} {collection.title}</div>
                    );
                })}
            </div>
        </div>
    );
};

export default AddToCollection;
