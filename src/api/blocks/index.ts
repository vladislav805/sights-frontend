import { api } from '../index';

export * from './users';
export * from './accounts';
export * from './map';
export * from './sights';
export * from './events';
export * from './photos';
export * from './comments';
export * from './internal';

export const execute = async<T>(code: string, props: Record<string, string | number> = {}): Promise<T> => api('execute.compile', { code, ...props });
