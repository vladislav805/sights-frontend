import * as React from 'react';
import { saveAs } from 'file-saver';
import { ISight } from '../../../api/types/sight';
import Button from '../../../components/Button';
import { ICollection } from '../../../api/types/collection';

type ICollectionEntryRouteProps = {
    items: ISight[];
    collection: ICollection;
};

const mkXml = (content: string) =>
    `<gpx creator="WTracks" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" version="1.1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
${content}<trk><name>0</name><trkseg></trkseg></trk></gpx>`;

export const CollectionEntryRoute: React.FC<ICollectionEntryRouteProps> = (props: ICollectionEntryRouteProps) => {
    const { items, collection } = props;

    const onClickExport = React.useMemo(() => () => {
        const xmlItems = items.map(item => `<wpt lat="${item.latitude}" lon="${item.longitude}"><name>${item.title}</name><desc>${item.description}</desc></wpt>`).join('\n');

        saveAs(new Blob([mkXml(xmlItems)]), `${collection.title}_${collection.collectionId}.xml`);
    }, [items]);

    return (
        <Button
            label="Export to GPX"
            type="button"
            onClick={onClickExport} />
    );
};
