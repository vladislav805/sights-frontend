let authKey: string;

export const setAuthKey = (_authKey: string): void => {
    authKey = _authKey;
};

export const getAuthKey = (): string => authKey;
