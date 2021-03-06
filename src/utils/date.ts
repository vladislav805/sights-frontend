export const Format = {
    DATE: 0x1,
    MONTH_NAME: 0x2,
    TIME: 0x4,

    FULL: 0x1 | 0x2 | 0x4,
};

const checkBit = (mode: number, bit: number) => (mode & bit) === bit;

function humanizeDateTime(date: Date, mode: number): string;
function humanizeDateTime(date: number, mode: number): string;
function humanizeDateTime(date: Date | number, mode: number): string {
    if (typeof date === 'number') {
        // eslint-disable-next-line no-param-reassign
        date = new Date(date * 1000);
    }
    const options: Intl.DateTimeFormatOptions = {};

    if (checkBit(mode, Format.DATE)) {
        options.year = 'numeric';
        options.month = checkBit(mode, Format.MONTH_NAME) ? 'long' : 'numeric';
        options.day = 'numeric';
    }

    if (checkBit(mode, Format.TIME)) {
        options.hour = 'numeric';
        options.minute = 'numeric';
        options.hour12 = false;
    }

    return date.toLocaleDateString(['ru', 'en-GB'], options);
}

export { humanizeDateTime };
