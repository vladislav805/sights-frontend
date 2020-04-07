import { ISelectOption } from '../../components/Select';
import { UserSex } from '../../api';

export const genders: ISelectOption<UserSex>[] = [
    { title: 'не указано', value: UserSex.NOT_SET, data: UserSex.NOT_SET },
    { title: 'женский', value: UserSex.FEMALE, data: UserSex.FEMALE },
    { title: 'мужской', value: UserSex.MALE, data: UserSex.MALE },
];
