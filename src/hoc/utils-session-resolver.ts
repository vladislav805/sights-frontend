import { IUser } from '../api';
import { store } from '../redux';

export type SessionResolveListener = (user?: IUser) => void | Promise<void>;

export interface IWithSessionListener {
    onSessionResolved?: (listener: SessionResolveListener) => void;
}

const _sessionListener: SessionResolveListener[] = [];

export const addSessionResolveListener = async() => new Promise<IUser | undefined>(resolve => {
    if ('user' in store.getState()) {
        resolve(store.getState().user);
    } else {
        _sessionListener.push(resolve);
    }
});

export const fireSessionListeners = (user?: IUser) => {
    while (_sessionListener.length > 0) {
        _sessionListener.pop()(user);
    }
};
