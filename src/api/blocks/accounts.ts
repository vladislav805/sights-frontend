import { UserSex } from '../types';
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

export const account = {
    create: async(props: AccountRegisterProps): Promise<true> => api('account.create', props),

    editInfo: async(props: AccountEditInfoProps): Promise<true> => api('account.editInfo', props),
};