export const objectKeys = <T>(object: T): (keyof T)[] => Object.keys(object) as (keyof T)[];

export const objectFilter = <T>(object: T): T => {
    const result = {} as T;

    objectKeys(object).map(key => {
        if (object[key]) {
            result[key] = object[key];
        }
    })

    return result;
};
