import * as React from 'react';
import { THIS_DOMAIN } from '../../config';
import Icon from '@mdi/react';
import './style.scss';
import { mdiTelegram } from '@mdi/js';

type ISharePanel = {
    link: string;
    text: string;
};

// не <Button /> потому, что отсутствует target и rel
const SharePanel: React.FC<ISharePanel> = ({ link, text }: ISharePanel) => (
    <a
        className='xButton xButton__size-m xButton__primary shareButton'
        href={`https://t.me/share/url?url=${encodeURIComponent(`https://${THIS_DOMAIN}${link}`)}&text=${encodeURIComponent(text)}`}
        target='_blank'
        rel='noreferrer noopener'>
        <Icon
            size={1}
            path={mdiTelegram} />
        Поделиться
    </a>
);

export default SharePanel;
