import * as React from 'react';

/**
 * Hook that handle clicks outside of the passed ref
 */
export default function useOutsideAlerter(ref: React.MutableRefObject<HTMLElement>, callback: () => void): void {
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);
}
