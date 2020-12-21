import { api } from '../index';

export * from './users';
export * from './account';
export * from './map';
export * from './sights';
export * from './feed';
export * from './notifications';
export * from './photos';
export * from './comments';
export * from './internal';

export const execute = async<T>(code: string, props: Record<string, string | number> = {}): Promise<T> => api('execute.compile', { code, ...props });
