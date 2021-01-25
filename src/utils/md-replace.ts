const sightRe = /\[sight:(\d+)]([^[]+)\[\/sight]/img;
const collectionRe = /\[collection:(\d+)]([^[]+)\[\/collection]/img;
const userRe = /@([A-Za-z0-9_]+)/img;

const escapeTextInLink = (str: string) => str.replace(/]/img, '\\]');

export const mdReplace = (str: string): string => str
    // @foobar -> [/user/foobar](@foobar)
    .replace(userRe, (_, username: string) => `[@${username}](/user/${username})`)

    // [sight:578]this place[/sight] -> [/sight/578](this place)
    .replace(sightRe, (_, sightId: string, inner: string) => `[${escapeTextInLink(inner)}](/sight/${sightId})`)

    // [collection:12]this collect[/sight] -> [/collection/12](this collect)
    .replace(collectionRe, (_, collectionId: string, inner: string) => `[${escapeTextInLink(inner)}](/collection/${collectionId})`);
