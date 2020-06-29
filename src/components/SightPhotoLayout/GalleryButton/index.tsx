import * as React from 'react';
import './style.scss';
import Icon from '@mdi/react';

interface IGalleryButtonProps {
    icon: string;
    label: string;
    onClick: () => void;
}

const GalleryButton: React.FC<IGalleryButtonProps> = ({ icon, label, onClick }: IGalleryButtonProps) => (
    <button
        type="button"
        title={label}
        aria-label={label}
        onClick={onClick}
        className="ril__toolbarItemChild gallery-button">
        <Icon
            path={icon} />
    </button>
);

export default GalleryButton;
