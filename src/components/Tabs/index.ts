import * as React from 'react';

export interface ITab {
    name: string;
    title: React.ReactChild;
    disabled?: boolean;
}

export * from './Host';
export * from './Tab';
