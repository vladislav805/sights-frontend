type IEntry<F> = {
    [key in string]: number; // todo
}

const entriesToMap = <T>(objects: T[], key: keyof T): Map<number, T> => {
    const map = new Map<number, T>();
    objects.forEach(item => {
        map.set(item[key] as unknown as number, item);
    });
    return map;
}

export default entriesToMap;
