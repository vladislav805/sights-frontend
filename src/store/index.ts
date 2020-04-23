import { combineReducers, createStore, Action, Store as ReduxStore } from 'redux';
import { photosReducer } from './photos/reducers';
import { routerReducer } from './router/reducers';
import { photoReducer } from './photo/reducers';
import { PhotoTypes } from './photo/types';
import { PhotosTypes } from './photos/types';

export const MERGE_STATE = 'MERGE_STATE';

const storeReducer = combineReducers({
    router: routerReducer,
    photos: photosReducer,
    photo: photoReducer,
});

export type AppState = ReturnType<typeof storeReducer>;

export type AppTypes = PhotoTypes | PhotosTypes | MergeStateAction;

export interface MergeStateAction {
    type: typeof MERGE_STATE;
    payload: Partial<AppState>;
}

export function mergeState(state: Partial<AppState>): MergeStateAction {
    return {
        type: MERGE_STATE,
        payload: state,
    };
}

export function rootReducer(state: AppState | undefined, action: Action): AppState {
    state = storeReducer(state, action);

    switch (action.type) {
        case 'MERGE_STATE':
            return { ...state, ...(action as MergeStateAction).payload };
        default:
            return state;
    }
}


export type Store = ReduxStore<AppState, Action>;

export function createAppStore(state: AppState): Store {
    return createStore<AppState, Action, {}, {}>(rootReducer, state);
}

