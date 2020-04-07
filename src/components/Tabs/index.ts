import { ReactChild } from 'react';

export interface ITab {
    name: string;
    title: ReactChild;
    content: ReactChild;
    disabled?: boolean;
}

export * from './Host';
export * from './Tab';
export * from './Content';

