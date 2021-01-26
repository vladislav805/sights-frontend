import * as React from 'react';
import { IUser } from '../api/types/user';
import SessionContext from '../utils/session-context';

const useCurrentUser = (): IUser => React.useContext(SessionContext);

export default useCurrentUser;
