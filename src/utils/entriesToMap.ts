/* eslint-disable implicit-arrow-linebreak */
export const entriesToMap = <Type, Key extends keyof Type>(objects: Type[], key: Key): Map<Type[Key], Type> =>
    objects.reduce((map, item) => map.set(item[key], item), new Map<Type[Key], Type>());
