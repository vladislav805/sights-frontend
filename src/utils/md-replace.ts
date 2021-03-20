const sightRe = /\[sight:(\d+)]([^[]+)\[\/sight]/img;
const collectionRe = /\[collection:(\d+)]([^[]+)\[\/collection]/img;
const photoRe = /\[photo:(\d+)_(\d+)(:([a-z]+=[^\]]+)+)?]([^[]*)\[\/photo]/img;
const photoRowRe = /\[photorow]([^]+?)\[\/photorow]/img;
const userRe = /@([A-Za-z0-9_]+)/img;

const escapeTextInLink = (str: string) => str.replace(/]/img, '\\]');

export const mdReplace = (str: string): string => str
    // @foobar
    .replace(userRe, (_, username: string) => `<userlink username="${username}" />`)

    // [sight:578]this place[/sight]
    .replace(sightRe, (_, sightId: string, inner: string) => `<sightlink sightId='${sightId}'>${escapeTextInLink(inner)}</sightlink>`)

    // [collection:12]this collect[/collection]
    .replace(collectionRe, (_, collectionId: string, inner: string) => `[${escapeTextInLink(inner)}](/collection/${collectionId})`)

    // [photo:123_456:param1=value1:param2=value2][/photo]
    .replace(photoRe, (...args: string[]) => {
        const [, photoId, sightId, , paramsStr, inner] = args;
        const params = paramsStr?.split(':').map(prop => {
            const equal = prop.indexOf('=');
            return { name: prop.slice(0, equal), value: prop.slice(equal + 1) };
        }).reduce((acc, { name, value }) => {
            acc[name] = value;
            return acc;
        }, {} as Record<string, string>) ?? {};

        const attr = JSON.stringify(params);
        const content = escapeTextInLink(inner);

        return `<photoview sightId='${sightId}' photoId='${photoId}' params={${attr}}>${content}</photoview>`;
    })

    // [photorow][/photorow]
    .replace(photoRowRe, (_: string, inner: string) => `<photorow>${inner}</photorow>`);
