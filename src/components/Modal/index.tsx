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

export const Title: React.FC<IModalTitle> = (props: IModalTitle) => (
    <div className="modal-title">{props.children}</div>
);

export const Content: React.FC<IModalContent> = (props: IModalContent) => (
    <div className="modal-content">{props.children}</div>
);

export const Footer: React.FC<IModalFooter> = (props: IModalFooter) => (
    <div className="modal-footer">{props.children}</div>
);

export const Window: React.FC<IModalProps> = (props: IModalProps) => {
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
