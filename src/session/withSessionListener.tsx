import * as React from 'react';
import { addSessionResolveListener, SessionResolveListener } from '.';

export type IWithSessionListener = {
    onSessionResolved?: (listener: SessionResolveListener) => void;
}

export const withSessionListener = <T extends IWithSessionListener>(Child: React.ComponentType<T>) => {
    const Component = (props: T & IWithSessionListener) => {
        return <Child {...props} onSessionResolved={addSessionResolveListener} />;
    };

    Component.displayName = `withSessionListener(${Child.displayName || Child.name})`;

    return Component;
};