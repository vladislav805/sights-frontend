import { RouteNames } from '../../routes';
import { AppState } from '../../store';

export function getRoute(state: Partial<AppState>): RouteNames {
    if (state && state.router && state.router.route) {
        return state.router.route;
    }

    return RouteNames.NOT_FOUND;
}
