import * as React from 'react';
import { IUser } from '../api/types/user';
import { addSessionResolveListener } from '../hoc/utils-session-resolver';

const useCurrentUser = (): IUser => {
    const [user, setUser] = React.useState<IUser>(undefined);

    React.useEffect(() => {
        void addSessionResolveListener().then(user => {
            setUser(user);
        });
    }, []);

    return user;
};

export default useCurrentUser;
