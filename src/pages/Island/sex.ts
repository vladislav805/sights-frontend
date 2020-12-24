import { ISelectOption } from '../../components/Select';
import { Sex } from '../../api/types/user';

export const genders: ISelectOption<Sex>[] = [
    { title: 'не указано', value: Sex.NONE, data: Sex.NONE },
    { title: 'женский', value: Sex.FEMALE, data: Sex.FEMALE },
    { title: 'мужской', value: Sex.MALE, data: Sex.MALE },
];
