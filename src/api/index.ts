import account from './blocks/account';
import categories from './blocks/categories';
import cities from './blocks/cities';
import comments from './blocks/comments';
import collections from './blocks/collections';
import feed from './blocks/feed';
import internal from './blocks/internal';
import map from './blocks/map';
import notifications from './blocks/notifications';
import photos from './blocks/photos';
import rating from './blocks/rating';
import sights from './blocks/sights';
import tags from './blocks/tags';
import users from './blocks/users';

const API = {
    account,
    categories,
    cities,
    comments,
    collections,
    feed,
    internal,
    map,
    notifications,
    photos,
    rating,
    sights,
    tags,
    users,
};

export default API;

export { default as apiRequest, apiExecute } from './request';
export * from './auth-key';
