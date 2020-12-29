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
    mdiPound,
    mdiText,
} from '@mdi/js';
import Button from '../Button';
import { isBit } from '../../utils/is-bit';
import { ISight, SightMask } from '../../api/types/sight';
import { IPhoto } from '../../api/types/photo';
import { IUser } from '../../api/types/user';
import { ITag } from '../../api/types/tag';

interface ISightPageLayoutProps {
    sight: ISight;
    photo?: IPhoto;
    author: IUser;
    tags: ITag[];
}

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

const renderActions = (sight: ISight): React.ReactNode => {
    const { sightId, canModify } = sight;

    if (canModify) {
        return [
            <Link className="xButton xButton__primary xButton__size-m" key="edit" to={`/sight/${sightId}/edit`}>Редактировать</Link>,
            <Button
                key="remove"
                label="Удалить"
                // onClick={this.onDeleteClick}
            />
        ];
    } else {
        return [
            <Button
                key="report"
                label="Пожаловаться"
                // onClick={this.onReportClick}
            />
        ];
    }
};

const SightPageLayout: React.FC<ISightPageLayoutProps> = (props: ISightPageLayoutProps) => {
    const { sight, photo, author, tags } = props;

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
                        <Link to={`/sight/search?cityId=${city.cityId}`}>{city.name}</Link>
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
                    <Link to={`/user/${login}`}>{firstName} {lastName}</Link>
                </TextIconified>
                <TextIconified icon={mdiClockCheckOutline}>
                    Добавлено {humanizeDateTime(dateCreated, Format.FULL)}
                    {dateUpdated ? `, обновлено ${humanizeDateTime(dateUpdated, Format.FULL)}` : ''}
                </TextIconified>
                {tags.length > 0 && (
                    <TextIconified
                        icon={mdiPound}>
                        {tags.map(tag => (
                                <Link
                                    key={tag.tagId}
                                    to={`/sight/search?tag=${tag.title}`}>
                                    #{tag.title}
                                </Link>
                            ))
                            .reduce<React.ReactChild[]>((acc, el, i) => {
                                i && acc.push(' ');
                                acc.push(el);
                                return acc;
                            }, [])
                        }
                    </TextIconified>
                )}
            </div>
            <div className="sight-info-layout-actions">{renderActions(sight)}</div>
        </div>
    );
}

export default SightPageLayout;
