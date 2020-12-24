import { IPhoto, PhotoType } from '../../api/types/photo';
import { IPhotosUploadResult } from '../../api/blocks/photos';
import API from '../../api';

const getPostBody = (file: File): FormData => {
    const fd = new FormData();
    fd.set('file', file);
    return fd;
};

export const uploadPhoto = (file: File, type: PhotoType): Promise<IPhoto> =>
    API.photos.getUploadUri({ type })
        .then(({ uri }) => uri)
        .then(uri => fetch(uri, {
            method: 'post',
            body: getPostBody(file),
        }))
        .then(res => res.json() as Promise<IPhotosUploadResult>)
        .then(res => {
            if ('error' in res) {
                throw res.error;
            }

            return res;
        })
        .then(payload => API.photos.save(payload))
        .then(photo => {
            console.log(photo);
            return photo;
        })
        .catch((error: Error) => {
            alert(error.message);
            return undefined as IPhoto;
        });
