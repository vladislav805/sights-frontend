import { IProfile } from '.';
import pluralize, { IPluralForms } from '../../utils/pluralize';
import { UserSex } from '../../api';

const genderifiedActions: Record<string, Record<UserSex, string>> = {
    added: { MALE: 'добавил', FEMALE: 'добавила', NOT_SET: 'добавило' },
    visited: { MALE: 'посетил', FEMALE: 'посетила', NOT_SET: 'посетило' },
    uploaded: { MALE: 'зарузил', FEMALE: 'загрузила', NOT_SET: 'загрузило' },
    wrote: { MALE: 'написал', FEMALE: 'написала', NOT_SET: 'написало' },
};

const places = {
    one: 'место',
    some: 'места',
    many: 'мест',
};

const renderAchievements = ({ user, achievements: a }: IProfile) => {
    const line = (action: string, value: number, noun: IPluralForms) => {
        return `${genderifiedActions[action][user.sex]} ${value} ${pluralize(value, noun)}`
    }
    const lines: string[] = [
        line('added', a.authorOfAllSights, places),
        line('visited', a.visitedSights, places),
        line('uploaded', a.photosOfSights, {
            one: 'фотографию',
            some: 'фотографии',
            many: 'фотографий',
        }),
        line('wrote', a.comments, {
            one: 'комментарий',
            some: 'комментария',
            many: 'комментариев',
        }),
    ];

    return lines.join('\n');
};

export { renderAchievements };
