export const replaceUrl = (url: string): void => {
    window.history.replaceState(null, null, url);
};
