// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace VK {
    type IVKAuthOptions = {
        width?: number;
        onAuth?: (user: OnAuthUserData) => void;
        authUrl?: string;
    };

    export type OnAuthUserData = {
        uid: number;
        first_name: string;
        last_name: string;
        photo: string;
        photo_rec: string;
        hash: string;
    };

    export interface VKOpenAPI {
        init(props: {
            apiId: number;
            status?: boolean;
            onlyWidgets?: boolean;
        }): void;


        Widgets: {
            Auth(id: string, options?: IVKAuthOptions): void;
        },
    }
}
