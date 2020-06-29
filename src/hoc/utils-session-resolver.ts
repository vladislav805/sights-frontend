import { IUser } from '../api';
import { store } from '../redux';

export type SessionResolveListener = (user?: IUser) => void | Promise<void>;

export interface IWithSessionListener {
    onSessionResolved?: (listener: SessionResolveListener) => void;
}

const _sessionListener: SessionResolveListener[] = [];

export const addSessionResolveListener = (): Promise<IUser | undefined> => new Promise(resolve => {
    if ('user' in store.getState()) {
        resolve(store.getState().user);
    } else {
        _sessionListener.push(resolve);
    }
});

export const fireSessionListeners = (user?: IUser): void => {
    while (_sessionListener.length > 0) {
        void _sessionListener.pop()(user);
    }
};
