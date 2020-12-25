import { Action, AnyAction, applyMiddleware, createStore } from 'redux';
import { InferableComponentEnhancerWithProps } from 'react-redux';
import thunk, { ThunkAction } from 'redux-thunk';
import { SKL_AUTH_KEY, SKL_THEME } from '../config';
import { fireSessionListeners } from '../hoc/utils-session-resolver';
import { IUser } from '../api/types/user';
import { ISiteStats } from '../api/local-types';
import { apiRequest, setAuthKey } from '../api';
import { IApiError } from '../api/types/base';

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

type HomeCacheStat = {
    homeStats?: ISiteStats;
};

type PageInfo = {
    pageTitle?: string;
    pageBackLink?: string;
};

export type RootStore = Readonly<StoreSession & StoreTheme & HomeCacheStat & PageInfo>;

const initialStore: RootStore = {
    theme: localStorage.getItem(SKL_THEME) as ITheme ?? 'light',
};



/**
 * Actions
 */

type SetSessionAction = Action<'SESSION'> & StoreSession;
type SetTheme = Action<'THEME'> & StoreTheme;
type SetCacheHomeStats = Action<'HOME_CACHE'> & HomeCacheStat;
type SetPageInfo = Action<'PAGE_INFO'> & PageInfo;

type Actions = SetSessionAction | SetTheme | SetCacheHomeStats | SetPageInfo;




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

    const authKey = localStorage.getItem(SKL_AUTH_KEY);

    const applyAuth = (user: IUser) => {
        authKey && setAuthKey(authKey);
        dispatch(setSession(authKey, user));
        fireSessionListeners(user);
    };

    if (!authKey) {
        applyAuth(undefined);
        return;
    }

    let user: IUser = undefined;
    try {
        [user] = await apiRequest<IUser[]>('users.get', { authKey, fields: 'ava' });
    } catch (e) {
        if ((e as IApiError).code) {
            console.error('expired token');
        }
    } finally {
        applyAuth(user);
    }
};

export const setTheme = (theme: ITheme): SetTheme => ({ type: 'THEME', theme });

export const setHomeCache = (stats: ISiteStats): SetCacheHomeStats => ({ type: 'HOME_CACHE', homeStats: stats });

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
                homeStats: action.homeStats,
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
    applyMiddleware(thunk)
);
