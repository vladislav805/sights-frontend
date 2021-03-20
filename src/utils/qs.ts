export const parseQueryString = (search: string): URLSearchParams => new URLSearchParams(search);

export const stringifyQueryString = (props: Record<string, string | number | boolean>): string =>
    Object.keys(props).reduce((acc, cur) => {
        if (props[cur] !== null && props[cur] !== undefined) {
            acc.set(cur, String(props[cur]));
        }
        return acc;
    }, new URLSearchParams()).toString();

// eslint-disable-next-line max-len
export const parseQueryStringToObject = <S extends Record<string, string>, K extends string & keyof S>(search: string): Record<K, string> => {
    const result = {} as Record<K, string>;

    parseQueryString(search).forEach((value: string, key: K) => {
        result[key] = value;
    });

    return result;
};
