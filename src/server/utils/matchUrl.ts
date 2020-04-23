import { RouterState, RouterParams } from '../../store/router/types';
import { RouteNames, Routes } from '../../routes';
import { matchPath } from 'react-router';

export function matchUrl(url: string): RouterState {
    for (const route of Object.keys(Routes) as RouteNames[]) {
        const result = matchPath<RouterParams>(url, Routes[route]);

        if (result) {
            return { route, ...result };
        }
    }
}
