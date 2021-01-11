import { IUser } from '../api/types/user';

declare global {
    type IPreloadedState = {
        user?: IUser;
    };

    interface Window {
        __PRELOADED_STATE__: IPreloadedState;
    }
}

export function getPreloadedState(): IPreloadedState {
    return window.__PRELOADED_STATE__;
}
