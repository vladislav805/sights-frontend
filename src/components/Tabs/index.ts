import { ReactChild, ComponentType } from 'react';

export interface ITab {
    name: string;
    title: ReactChild;
    content: ComponentType;
    disabled?: boolean;
}

export * from './Host';
export * from './Tab';
export * from './Content';
