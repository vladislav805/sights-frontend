import api, { IUser, IAuthSession } from '../api';

export interface ISession {
    isAuthorized: () => boolean;
    getAuthKey: () => string;
    setAuthKey: (authKey: string) => ISession;
    getUser: () => Promise<IUser | undefined>;
}

type IAuthentorizeProps = Partial<{
    captchaId: string;
    captchaValue: string;
}>;

export interface IAuthenticator {
    authorize: (login: string, password: string, options?: IAuthentorizeProps) => Promise<IAuthSession>;
    logout: () => Promise<boolean>;
}

const AUTH_KEY = 'authKey';

export class Session implements ISession, IAuthenticator {
    private authKey: string | undefined;
    private user: IUser | undefined;


    public constructor(authKey: string = localStorage.getItem(AUTH_KEY)) {
        this.authKey = authKey || undefined;
    }

    public authorize = (login: string, password: string, options: IAuthentorizeProps = {}) => {
        return api<IAuthSession>('users.getAuthKey', {
            login,
            password,
            ...options,
        });
    };

    public logout = () => api<boolean>('users.logout', { authKey: this.authKey });

    public isAuthorized = () => this.authKey !== undefined;

    public setAuthKey = (authKey: string) => {
        localStorage.setItem(AUTH_KEY, authKey);
        this.authKey = authKey;
        return this;
    }

    public getAuthKey = () => this.authKey;

    public getUser = async() => {
        if (!this.user) {
            [this.user] = await api<IUser[]>('users.get', { authKey: this.authKey });
        }

        return this.user;
    };
}
