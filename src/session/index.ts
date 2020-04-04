import { createStore, Action, applyMiddleware, AnyAction } from 'redux';
import { InferableComponentEnhancerWithProps } from 'react-redux';
import thunk, { ThunkAction } from 'redux-thunk';
import api, { IUser, setAuthKey } from '../api';

export type TypeOfConnect<T> = T extends InferableComponentEnhancerWithProps<infer Props, infer _>
  ? Props
  : never;

export type CutMiddleFunction<T> = T extends (...arg: infer Args) => (...args: unknown[]) => infer R
  ? (...arg: Args) => R
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unboxThunk = <Args extends any[], R, S, E, A extends Action<any>>(
    thunkFn: (...args: Args) => ThunkAction<R, S, E, A>,
) => (
    thunkFn as unknown as CutMiddleFunction<typeof thunkFn>
);



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
    const authKey = localStorage.getItem('authKey');
    if (!authKey) {
        return;
    }
    const [user] = await api<IUser[]>('users.get', { authKey });
    setAuthKey(authKey);
    dispatch(setSession(authKey, user));
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
