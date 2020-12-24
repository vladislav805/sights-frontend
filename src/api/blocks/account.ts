import { apiRequest } from '../index';
import { Sex } from '../types/user';
import { IAuthSession } from '../types/auth';

type IAccountRegisterParams = {
    firstName: string;
    lastName: string;
    sex: Sex;
    email: string;
    login: string;
    password: string;
    captchaId: string;
};

type IAccountEditInfoParams = {
    firstName: string;
    lastName: string;
    sex: Sex;
    cityId?: number;
};

type IAccountAuthorizeParams = {
    login: string;
    password: string;
};

export const account = {
    create: async(props: IAccountRegisterParams): Promise<true> =>
        apiRequest('account.create', props),

    edit: async(props: IAccountEditInfoParams): Promise<true> =>
        apiRequest('account.edit', props),

    authorize: async(params: IAccountAuthorizeParams): Promise<IAuthSession> =>
        apiRequest('account.authorize', params),

    logout: async(): Promise<true> => apiRequest('account.logout'),
};
