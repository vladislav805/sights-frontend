import * as React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Format, humanizeDateTime } from '../../utils';
import TextIconified from '../TextIconified';
import {
    mdiAccountCheck,
    mdiCheckDecagram,
    mdiCity,
    mdiClockCheckOutline,
    mdiEmoticonSadOutline,
    mdiHelpRhombus,
    mdiMapMarker,
    mdiPound,
    mdiText,
} from '@mdi/js';
import { isBit } from '../../utils/is-bit';
import { ISight, SightMask } from '../../api/types/sight';
import { IPhoto } from '../../api/types/photo';
import { IUser } from '../../api/types/user';
import { ITag } from '../../api/types/tag';
import Actions from '../../pages/Sight/Entry/actions';
import StateActions from './state-actions';
import useCurrentUser from '../../hook/useCurrentUser';
import DynamicTooltip from '../DynamicTooltip';
import JoinWithComma from '../JoinWithComma';

type ISightPageLayoutProps = {
    sight: ISight;
    photo?: IPhoto;
    author: IUser;
    tags: ITag[];
    onChangeSight: (sight: ISight) => void;
};

const humanizedState = [
    { icon: mdiHelpRhombus, label: 'Нет информации по подтверждению', className: 'unknown' },
    { icon: mdiCheckDecagram, label: 'Подтверждено', className: 'verified' },
    { icon: mdiEmoticonSadOutline, label: 'Более не существует', className: 'archived' },
];

const renderVerifiedState = (mask: number): React.ReactNode => {
    // 0 - unknown, 1 - verified, 2 - archived
    const state = isBit(mask, SightMask.ARCHIVED) ? 2 : (isBit(mask, SightMask.VERIFIED) ? 1 : 0);
    const { icon, label, className } = humanizedState[state];

    return (
        <TextIconified className={`sight-info-layout--state-${className}`} icon={icon}>{label}</TextIconified>
    );
};

const SightPageLayout: React.FC<ISightPageLayoutProps> = (props: ISightPageLayoutProps) => {
    const { sight, photo, author, tags } = props;
    const currentUser = useCurrentUser();

    const {
        title,
        description,
        dateCreated,
        dateUpdated,
        city,
    } = sight;

    const {
        firstName,
        lastName,
        login,
    } = author;

    const canModify = currentUser && (currentUser.userId === sight.ownerId || currentUser.status === 'ADMIN');

    return (
        <div className={classNames('sight-info-layout', {
            'sight-info-layout__withPhoto': !!photo,
        })}>
            {photo && (
                <div
                    className="sight-info-layout-photo"
                    style={{
                        '--sight-photo': `url(${photo.photoMax})`,
                        '--sight-photo-ratio': photo.height && `${Math.min(55, photo.height / photo.width * 100)}%`,
                    } as React.CSSProperties} />
            )}
            <div className="sight-info-layout-content">
                <h1>{title}</h1>
                {renderVerifiedState(sight.mask)}
                {city && (
                    <TextIconified icon={mdiCity}>
                        <Link to={`/search/sights?cityId=${city.cityId}`}>{city.name}</Link>
                    </TextIconified>
                )}
                {sight.address && (
                    <TextIconified icon={mdiMapMarker}>
                        {sight.address}
                    </TextIconified>
                )}
                {description && (
                    <TextIconified
                        classNameContent="sight-info-layout-description"
                        icon={mdiText}>
                        {description}
                    </TextIconified>
                )}
                <TextIconified icon={mdiAccountCheck}>
                    <DynamicTooltip type="user" id={author.userId}>
                        <Link to={`/user/${login}`}>{firstName} {lastName}</Link>
                    </DynamicTooltip>
                </TextIconified>
                <TextIconified icon={mdiClockCheckOutline}>
                    Добавлено {humanizeDateTime(dateCreated, Format.FULL)}
                    {dateUpdated ? `, обновлено ${humanizeDateTime(dateUpdated, Format.FULL)}` : ''}
                </TextIconified>
                {tags.length > 0 && (
                    <TextIconified
                        icon={mdiPound}>
                        <JoinWithComma separator=" ">
                            {tags.map(tag => (
                                <Link
                                    key={tag.tagId}
                                    to={`/search/sights?query=${encodeURIComponent(`#${tag.title}`)}`}>
                                    #{tag.title}
                                </Link>
                            ))}
                        </JoinWithComma>
                    </TextIconified>
                )}
            </div>
            <div className="sight-info-layout-actions">
                {canModify && (
                    <div className="sight-info-layout-action-row">
                        <StateActions
                            sight={sight}
                            onChangeSight={props.onChangeSight} />
                    </div>
                )}
                <div className="sight-info-layout-action-row">
                    <Actions sight={sight} />
                </div>
            </div>
        </div>
    );
}

export default SightPageLayout;
