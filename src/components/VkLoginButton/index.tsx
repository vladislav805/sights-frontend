import * as React from 'react';
import { VK } from '../../utils/vk/open-api';

type IVkLoginButtonProps = {
    className?: string;
    clientId: number;
    onAuthorized: (user: VK.OnAuthUserData) => void;
};

declare global  {
    // noinspection JSUnusedGlobalSymbols
    const VK: VK.VKOpenAPI;
}

const VkLoginButton: React.FC<IVkLoginButtonProps> = (props: IVkLoginButtonProps) => {
    const divRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://vk.com/js/api/openapi.js?168';

        script.addEventListener('load', () => {
            VK.init({
                apiId: props.clientId,
                onlyWidgets: true,
            });
            VK.Widgets.Auth('vk_auth', {
                onAuth: data => props.onAuthorized(data),
            });
        });

        script.async = true;
        divRef.current.appendChild(script);
    }, []);

    return (
        <div
            ref={divRef}
            className={props.className}
            id="vk_auth" />
    );
};

export default VkLoginButton;
