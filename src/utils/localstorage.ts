import Config from '../config';

type IHostedLocalStorage = (key: string, value?: string | number) => string | undefined | null;
export const hostedLocalStorage = (prefix: string): IHostedLocalStorage => {
    const ls = Config.isServer ? {} as Storage : window.localStorage;
    return (key, value): string | undefined => {
        const fullKey = `${prefix}_${key}`;

        // get
        if (value === undefined) {
            return ls.getItem(fullKey);
        }

        // remove
        if (value === null) {
            ls.removeItem(fullKey);
            return undefined;
        }

        // set
        ls.setItem(fullKey, String(value));

        return undefined;
    };
};
