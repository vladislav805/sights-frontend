export const humanizeDistance = (n: number, toKm = false) => {
    let value: string | number = ~~Math.max(n, 0);
    let unit = 'м';

    if (toKm && n > 1000) {
        value = (n / 1000).toFixed(2);
        unit = 'км';
    }

    return `${value} ${unit}`;
};
