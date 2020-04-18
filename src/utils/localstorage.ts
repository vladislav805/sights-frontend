export const hostedLocalStorage = (prefix: string) => {
    const ls = window.localStorage;
    return (key: string, value?: string | number) => {
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
