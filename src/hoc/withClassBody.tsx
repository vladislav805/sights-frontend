import * as React from 'react';

export type WithClassBodyReturn = <T>(Child: React.ComponentType<T>) => React.ComponentType<React.PropsWithChildren<T>>;

export function withClassBody(_cls: string | string[]): WithClassBodyReturn {
    const classes = Array.isArray(_cls) ? _cls : [_cls];
    const toggle = (state: boolean) => classes.forEach(cls => document.body.classList.toggle(cls, state));

    return function<T>(Child: React.ComponentType<T>) {
        const Component = (props: React.PropsWithChildren<T>) => {
            const [done, setDone] = React.useState(false);

            React.useEffect(() => {
                toggle(true);
                setDone(true);
                return () => toggle(false);
            }, []);
            return done ? <Child {...props} /> : null;
        };

        Component.displayName = `withClassBody(${Child.displayName || Child.name})`;

        return Component;
    }
}
