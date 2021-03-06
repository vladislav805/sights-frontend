import * as React from 'react';
import { mdiTelegram } from '@mdi/js';
import Icon from '@mdi/react';
import './style.scss';
import { THIS_DOMAIN } from '../../config';

type ISharePanel = {
    link: string;
    text: string;
};

// не <Button /> потому, что отсутствует target и rel
const SharePanel: React.FC<ISharePanel> = ({ link, text }: ISharePanel) => (
    <a
        className="xButton shareButton"
        data-theme="primary"
        data-size="m"
        href={`https://t.me/share/url?url=${encodeURIComponent(`https://${THIS_DOMAIN}${link}`)}&text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noreferrer noopener">
        <Icon
            size={1}
            path={mdiTelegram} />
        Поделиться
    </a>
);

export default SharePanel;
