import * as React from 'react';
import { VK } from '../../utils/vk/open-api';

type IVkLoginButtonProps = {
    className?: string;
    clientId: number;
    onAuthorized: (user: VK.OnAuthUserData) => void;
    width?: number;
};

declare global {
    // noinspection JSUnusedGlobalSymbols
    const VK: VK.VKOpenAPI;
}

const VkLoginButton: React.FC<IVkLoginButtonProps> = ({ width, onAuthorized, clientId, className }: IVkLoginButtonProps) => {
    const divRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://vk.com/js/api/openapi.js?168';

        script.addEventListener('load', () => {
            VK.init({
                apiId: clientId,
                onlyWidgets: true,
            });
            VK.Widgets.Auth('vk_auth', {
                width,
                onAuth: data => onAuthorized(data),
            });
        });

        script.async = true;
        divRef.current.appendChild(script);
    }, []);

    return (
        <div
            ref={divRef}
            className={className}
            id="vk_auth"
            style={{ margin: '1rem auto 0' }} />
    );
};

export default VkLoginButton;
