import { IAuthSession, IUser, UserSex } from '../types';
import { api } from '../index';

type AccountRegisterProps = {
    firstName: string;
    lastName: string;
    sex: UserSex;
    email: string;
    login: string;
    password: string;
    captchaId: string;
};

type AccountEditInfoProps = {
    firstName: string;
    lastName: string;
    sex: UserSex;
    cityId?: number;
};

type AccountCheckForVkUserResult = {
    session: IAuthSession | null;
    current?: Pick<IUser, 'firstName' | 'lastName' | 'sex' | 'login' | 'vkId'>;
};

export const account = {
    create: async(props: AccountRegisterProps): Promise<true> => api('account.create', props),

    editInfo: async(props: AccountEditInfoProps): Promise<true> => api('account.editInfo', props),

    checkForVkUser: async(code: string): Promise<AccountCheckForVkUserResult> => api('account.checkForVkUser', { code }),
};
