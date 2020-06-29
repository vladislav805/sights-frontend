export const parseQueryString = (search: string): URLSearchParams => new URLSearchParams(search);
export const stringifyQueryString = (props: Record<string, string | number | boolean>): string => {
    return Object.keys(props).reduce((acc, cur) => {
        acc.set(cur, String(props[cur]));
        return acc;
    }, new URLSearchParams()).toString();
};
