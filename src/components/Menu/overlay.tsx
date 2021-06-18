import * as React from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import Config from '../../config';

type IMenuOverlayProps = {
    show: boolean;
    close: () => void;
};

const MenuOverlay: React.FC<IMenuOverlayProps> = (props: IMenuOverlayProps) => {
    if (Config.isServer) {
        return null;
    }

    React.useEffect(() => {
        document.body.style.overflow = props.show ? 'hidden' : 'auto';
    }, [props.show]);

    return createPortal(
        (
            <div
                onClick={props.close}
                className={classNames('menu-overlay', {
                    'menu-overlay__open': props.show,
                })} />
        ),
        document.body,
    );
};

export default MenuOverlay;
