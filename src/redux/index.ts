import { Action, AnyAction, applyMiddleware, createStore } from 'redux';
import { InferableComponentEnhancerWithProps } from 'react-redux';
import thunk, { ThunkAction } from 'redux-thunk';
import { apiNew, IApiError, IUser, setAuthKey, ISiteStats } from '../api';
import { SKL_AUTH_KEY, SKL_THEME } from '../config';
import { fireSessionListeners } from '../hoc/utils-session-resolver';

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

export type RootStore = Readonly<StoreSession & StoreTheme & HomeCacheStat>;

const initialStore: RootStore = {
    theme: localStorage.getItem(SKL_THEME) as ITheme ?? 'light',
};



/**
 * Actions
 */

type SetSessionAction = Action<'SESSION'> & StoreSession;
type SetTheme = Action<'THEME'> & StoreTheme;
type SetCacheHomeStats = Action<'HOME_CACHE'> & HomeCacheStat;

type Actions = SetSessionAction | SetTheme | SetCacheHomeStats;




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
        [user] = await apiNew<IUser[]>('users.get', { authKey, fields: 'ava' });
    } catch (e) {
        if ((e as IApiError).errorId) {
            console.error('expired token');
        }
    } finally {
        applyAuth(user);
    }
};

export const setTheme = (theme: ITheme): SetTheme => ({ type: 'THEME', theme });

export const setHomeCache = (stats: ISiteStats): SetCacheHomeStats => ({ type: 'HOME_CACHE', homeStats: stats });



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

        default: {
            return state;
        }
    }
};

export const store = createStore(
    reducer,
    applyMiddleware(thunk)
);
