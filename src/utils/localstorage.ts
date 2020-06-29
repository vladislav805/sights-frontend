type IHostedLocalStorage = (key: string, value?: string | number) => string | undefined | null;
export const hostedLocalStorage = (prefix: string): IHostedLocalStorage => {
    const ls = window.localStorage;
    return (key, value) => {
        const fullKey = `${prefix}_${key}`;

        // get
        if (value === undefined) {
            return ls.getItem(fullKey);
        }

        // remove
        if (value === null) {
            ls.removeItem(fullKey);
            return;
        }

        // set
        ls.setItem(fullKey, String(value));
    };
};
