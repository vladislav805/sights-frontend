import { apiRequest } from '../index';
import { Sex } from '../types/user';
import { IAuthSession } from '../types/auth';
import { ISession } from '../types/session';

type IAccountCreateParamsUser = {
    firstName: string;
    lastName: string;
    sex: Sex;
    email: string;
    login: string;
    password: string;
    captchaId: string;
};

type IAccountCreateParamsTelegram = {
    telegramData: string;
};

type IAccountCreateParams = IAccountCreateParamsTelegram | IAccountCreateParamsUser;

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

type IAccountActivationParams = {
    hash: string;
};

function create(params: IAccountCreateParamsUser): Promise<true>;
function create(params: IAccountCreateParamsTelegram): Promise<ISession>;
function create(params: IAccountCreateParams): Promise<true | ISession> {
    return apiRequest('account.create', params);
}

export const account = {
    create,

    edit: async(props: IAccountEditInfoParams): Promise<true> =>
        apiRequest('account.edit', props),

    authorize: async(params: IAccountAuthorizeParams): Promise<IAuthSession> =>
        apiRequest('account.authorize', params),

    logout: async(): Promise<true> => apiRequest('account.logout'),

    activate: async(params: IAccountActivationParams): Promise<true> =>
        apiRequest('account.activate', params),
};
