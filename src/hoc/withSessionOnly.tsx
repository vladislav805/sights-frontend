import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useCurrentUser from '../hook/useCurrentUser';

export const withSessionOnly = (Child: React.FC, needSession = true): React.FC => (props: unknown) => {
    const currentUser = useCurrentUser();
    const history = useHistory();
    const location = useLocation();

    if ((needSession && currentUser) || (!needSession && !currentUser)) {
        return <Child {...props} />;
    }

    history.replace(currentUser
        ? '/'
        : `/island/login?repath=${encodeURIComponent(location.pathname + location.search)}`);
    return null;
};
