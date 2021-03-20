import {
    Action,
    AnyAction,
    applyMiddleware,
    createStore,
} from 'redux';
import { InferableComponentEnhancerWithProps } from 'react-redux';
import thunk, { ThunkAction } from 'redux-thunk';
import Config, { SKL_AUTH_KEY, SKL_THEME } from '../config';
import { IUser } from '../api/types/user';
import { IHomeCache } from '../api/local-types';
import { apiRequest, setAuthKey } from '../api';
import { IApiError } from '../api/types/base';
import { getCookie } from '../utils/cookie';
import { getPreloadedState } from '../utils/preloaded-state';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type TypeOfConnect<T> = T extends InferableComponentEnhancerWithProps<infer Props, infer _>
    ? Props
    : never;

type ITheme = 'light' | 'dark';

/**
 * State
 */

type StoreSession = {
    authKey?: string;
    user?: IUser;
};

type StoreTheme = {
    theme: ITheme;
};

type HomeCache = {
    homeCache?: IHomeCache;
};

type PageInfo = {
    pageTitle?: string;
    pageBackLink?: string;
};

export type RootStore = Readonly<StoreSession & StoreTheme & HomeCache & PageInfo>;

const initialStore: RootStore = {
    theme: !Config.isServer ? (localStorage.getItem(SKL_THEME) as ITheme ?? 'light') : 'light',
};

/**
 * Actions
 */

type SetSessionAction = Action<'SESSION'> & StoreSession;
type SetTheme = Action<'THEME'> & StoreTheme;
type SetCacheHome = Action<'HOME_CACHE'> & HomeCache;
type SetPageInfo = Action<'PAGE_INFO'> & PageInfo;

type Actions = SetSessionAction | SetTheme | SetCacheHome | SetPageInfo;

/**
 * Action creators
 */

export const setSession = (authKey: string, user: IUser): SetSessionAction => ({
    type: 'SESSION',
    authKey,
    user,
});

let inited = false;
export const init = (): ThunkAction<void, RootStore, void, AnyAction> => async dispatch => {
    if (inited) {
        return;
    }
    inited = true;

    const authKey = !Config.isServer && getCookie(SKL_AUTH_KEY);

    const applyAuth = (user: IUser) => {
        if (authKey) {
            setAuthKey(authKey);
        }

        dispatch(setSession(authKey, user));
    };

    if (!authKey) {
        applyAuth(null);
        return;
    }

    const preloaded = getPreloadedState();

    let user: IUser = null;

    try {
        if (preloaded?.user) {
            user = preloaded.user;
        } else {
            [user] = await apiRequest<IUser[]>('users.get', { authKey, fields: 'ava' });
        }
    } catch (e) {
        if ((e as IApiError).code) {
            console.error('expired token');
        }
    } finally {
        applyAuth(user);
    }
};

export const setTheme = (theme: ITheme): SetTheme => ({ type: 'THEME', theme });

export const setHomeCache = (cache: IHomeCache): SetCacheHome => ({ type: 'HOME_CACHE', homeCache: cache });

export const setPageInfo = (info: PageInfo): SetPageInfo => ({ type: 'PAGE_INFO', ...info });

/**
 * Reducers
 */
const reducer = (state = initialStore, action: Actions) => {
    switch (action.type) {
        case 'SESSION': {
            return {
                ...state,
                authKey: action.authKey,
                user: action.user,
            };
        }

        case 'THEME': {
            return {
                ...state,
                theme: action.theme,
            };
        }

        case 'HOME_CACHE': {
            return {
                ...state,
                homeCache: action.homeCache,
            };
        }

        case 'PAGE_INFO': {
            const { pageBackLink, pageTitle } = action;
            return {
                ...state,
                pageBackLink,
                pageTitle,
            };
        }

        default: {
            return state;
        }
    }
};

export const store = createStore(
    reducer,
    applyMiddleware(thunk),
);
