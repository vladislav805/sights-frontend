import * as React from 'react';
import useCurrentUser from '../hook/useCurrentUser';
import { useHistory, useLocation } from 'react-router-dom';

export const withSessionOnly = (Child: React.FC, needSession = true): React.FC => {
    return (props: unknown) => {
        const currentUser = useCurrentUser();
        const history = useHistory();
        const location = useLocation();

        console.log('session only', currentUser, needSession);
        if (needSession && currentUser || !needSession && !currentUser) {
            return <Child {...props} />;
        } else {
            history.replace(currentUser
                ? '/'
                : '/island/login?repath=' + encodeURIComponent(location.pathname + location.search)
            );
            return null;
        }
    };
};
