import * as React from 'react';
import Config from '../config';

const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

export const useCurrentWidth = (): number => {
    if (Config.isServer) {
        return 0;
    }

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
