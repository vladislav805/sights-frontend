export const replaceUrl = (url: string): void => {
    window.history.replaceState(null, null, url);
};

export type ISearchEntryProps = {
    onOffsetChange: (offset: number) => void;
    params: Record<string, string>;
    offset: number;
    onFormSubmit: (params: Record<string, string>) => void;
};
