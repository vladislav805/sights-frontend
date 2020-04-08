import { createStore, Action, applyMiddleware, AnyAction } from 'redux';
import { InferableComponentEnhancerWithProps } from 'react-redux';
import thunk, { ThunkAction } from 'redux-thunk';
import api, { IUser, setAuthKey } from '../api';
import Config from '../config';
import { fireSessionListeners } from '../hoc/utils-session-resolver';

export type TypeOfConnect<T> = T extends InferableComponentEnhancerWithProps<infer Props, infer _>
    ? Props
    : never;


/**
 * State
 */

export type RootStore = Readonly<{
    authKey?: string;
    user?: IUser;
}>;

const initialStore: RootStore = {
};



/**
 * Actions
 */

type SetSessionAction = Action<'SESSION'> & Partial<RootStore>;

type Actions = SetSessionAction; // | a2 | a3




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

    const authKey = localStorage.getItem(Config.SKL_AUTH_KEY);

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
        [user] = await api<IUser[]>('users.get', { authKey, extra: 'photo' });
    } catch (e) {
        if (e.errorId) {
            console.error('expired token');
        }
    } finally {
        applyAuth(user);
    }
};



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

        default: {
            return state;
        }
    }
};

export const store = createStore(
    reducer,
    applyMiddleware(thunk)
);
