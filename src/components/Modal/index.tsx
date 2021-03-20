import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.scss';
import { PropsWithChildren } from 'react';

type IModalProps = PropsWithChildren<{
    show: boolean;
    onOverlayClick?: () => void;
}>;

type IModalTitle = PropsWithChildren<unknown>;
type IModalContent = PropsWithChildren<unknown>;
type IModalFooter = PropsWithChildren<unknown>;

export const Title: React.FC<IModalTitle> = ({ children }: IModalTitle) => (
    <div className="modal-title">{children}</div>
);

export const Content: React.FC<IModalContent> = ({ children }: IModalContent) => (
    <div className="modal-content">{children}</div>
);

export const Footer: React.FC<IModalFooter> = ({ children }: IModalFooter) => (
    <div className="modal-footer">{children}</div>
);

export const Window: React.FC<IModalProps> = (props: IModalProps) => {
    React.useEffect(() => {
        document.body.style.overflow = props.show ? 'hidden' : '';
    }, [props.show]);

    if (!props.show) {
        return null;
    }

    return ReactDOM.createPortal(
        <div
            className="modal-wrapper"
            onClick={props.onOverlayClick}>
            <div
                className="modal-window"
                onClick={e => e.stopPropagation()}>
                {props.children}
            </div>
        </div>,
        document.getElementById('modal-root'),
    );
};
