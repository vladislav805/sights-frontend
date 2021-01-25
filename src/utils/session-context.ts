import * as React from 'react';
import { IUser } from '../api/types/user';

const SessionContext = React.createContext<IUser>(undefined);

export default SessionContext;
