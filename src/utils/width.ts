import * as React from 'react';

const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

export const useCurrentWidth = () => {
    const [width, setWidth] = React.useState(getWidth());

    React.useEffect(() => {
        let timeoutId: number = null;
        const resizeListener = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setWidth(getWidth()), 150) as unknown as number;
        };
        window.addEventListener('resize', resizeListener);

        return () => window.removeEventListener('resize', resizeListener);
    }, []);

    return width;
};
