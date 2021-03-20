import apiRequest from '../request';
import { IPhoto, PhotoType } from '../types/photo';

type IPhotosGetUploadUriParams = {
    type: PhotoType;
};

type IPhotosGetUploadUriResult = {
    uri: string;
};

export type IPhotosUploadResultSuccess = IPhotosSaveParams;
export type IPhotosUploadResultError = {
    error: string;
};

export type IPhotosUploadResult = IPhotosUploadResultSuccess | IPhotosUploadResultError;

type IPhotosSaveParams = {
    payload: string;
    sig: string;
};

type IPhotoRemoveParams = {
    photoId: number;
};

const photos = {
    getUploadUri: async(params: IPhotosGetUploadUriParams): Promise<IPhotosGetUploadUriResult> =>
        apiRequest<IPhotosGetUploadUriResult>('photos.getUploadUri', params),

    save: async(params: IPhotosSaveParams): Promise<IPhoto> =>
        apiRequest<IPhoto>('photos.save', params),

    remove: async(params: IPhotoRemoveParams): Promise<boolean> =>
        apiRequest<boolean>('photos.remove', params),
};

export default photos;
