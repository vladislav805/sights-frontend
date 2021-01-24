import * as React from 'react';
import { useLocation } from 'react-router-dom';

const useOffset = (): number => {
    const location = useLocation();
    const search = location.search;

    return React.useMemo(() => {
        const params = new URLSearchParams(search);
        const offset = params.get('offset');

        return offset ? Number(offset) : 0;
    }, [search]);
};

export default useOffset;
