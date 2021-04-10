import { saveAs } from 'file-saver';
import { ISight } from '../api/types/sight';
import { IUser } from '../api/types/user';
import { THIS_DOMAIN } from '../config';

type IMakeGpxProps = {
    sights: ISight[];
    title: string;
    description?: string;
    filename: string;
    author?: IUser;
};

export default async function generateAndDownloadGPX(options: IMakeGpxProps): Promise<void> {
    const xmlbuilder = await import('xmlbuilder');

    const root = xmlbuilder.create('gpx', {
        version: '1.1',
        encoding: 'utf-8',
        standalone: false,
    });

    root.attribute('version', '1.1');
    root.attribute('creator', 'Sights Map');
    root.attribute('xmlns', 'http://www.topografix.com/GPX/1/1');
    root.attribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
    root.attribute('xmlns:schemaLocation', 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd');

    const metadata = root.element('metadata');
    metadata.element('name', {}, options.title);

    if (options.description) {
        metadata.element('desc', {}, options.description);
    }

    if (options.author) {
        const { author } = options;

        metadata.element('author')
            .element('name', {}, `${author.firstName} ${author.lastName} (@${author.login})`)
            .up()
            .element('link', {
                href: `https://${THIS_DOMAIN}/user/${author.login}`,
            })
            .element('type', {}, 'text/html')
            .up()
            .element('text', {}, `Профиль @${author.login}`);
    }

    metadata.element('time', {}, new Date().toISOString());

    for (const { sightId, latitude, longitude, title, description } of options.sights) {
        const wpt = root.element('wpt', {
            lat: latitude,
            lon: longitude,
        });
        wpt.element('name', {}, title);
        wpt.element('desc', {}, description);
        const link = wpt.element('link', {
            href: `https://${THIS_DOMAIN}/sight/${sightId}`,
        });

        link.element('text', {}, 'На Sights Map');
        link.element('type', {}, 'text/html');
    }

    saveAs(new Blob([root.end({ pretty: true })]), `${options.filename}.gpx`);
}
