import { apiNew, IPhoto, PhotoType } from '../index';

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

export const photos = {
    getUploadUri: async(params: IPhotosGetUploadUriParams): Promise<IPhotosGetUploadUriResult> =>
        apiNew<IPhotosGetUploadUriResult>('photos.getUploadUri', params),

    save: async(params: IPhotosSaveParams): Promise<IPhoto> =>
        apiNew<IPhoto>('photos.save', params),

    remove: async(params: IPhotoRemoveParams): Promise<boolean> =>
        apiNew<boolean>('photos.remove', params),
};
