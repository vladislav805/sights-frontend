import * as React from 'react';

export type ITabHostProps = React.PropsWithChildren<{
    tabs: ITab[];
    defaultSelected?: string; // name of tags[number].tab
    className?: string;
    center?: boolean;
    wide?: boolean;
    padding?: boolean;
    saveSelectedInLocation?: boolean;
    onTabChanged?: <T extends string = string>(name: T) => void;
}>;

export interface ITab {
    name: string;
    title: React.ReactChild;
    disabled?: boolean;
}

export interface ITabProps {
    title: React.ReactChild;
    selected: boolean;
    disabled: boolean;
    select: () => unknown;
    onSelect: (style: ITabCurrentStyle) => unknown;
}

export type ITabCurrentStyle = {
    left: number;
    width: number;
};
