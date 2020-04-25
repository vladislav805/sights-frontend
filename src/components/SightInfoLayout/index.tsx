import * as React from 'react';
import './style.scss';
import { IMark, ISight, IUsableSightWithDistance, IUser, IVisitStateStats } from '../../api';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Format, humanizeDateTime } from '../../utils';
import TextIconified from '../TextIconified';
import { mdiAccountCheck, mdiCheckDecagram, mdiCity, mdiClockCheckOutline, mdiEmoticonSadOutline, mdiHelpRhombus, mdiPound, mdiText } from '@mdi/js';

interface ISightPageLayoutProps {
    sight: ISight;
    author: IUser;
    marks: Map<number, IMark>;
}

interface ISightPageLayoutState {
    loading: boolean;
    sight?: ISight;
}

interface ISightPageLayoutState {
    sight?: ISight;
    visits?: IVisitStateStats;
    author?: IUser;
    near?: IUsableSightWithDistance[];
}

const humanizedState = [
    { icon: mdiHelpRhombus, label: 'Нет информации по подтверждению', className: 'unknown' },
    { icon: mdiCheckDecagram, label: 'Подтверждено', className: 'verified' },
    { icon: mdiEmoticonSadOutline, label: 'Более не существует', className: 'archived' },
];

class SightPageLayout extends React.Component<ISightPageLayoutProps, ISightPageLayoutState> {
    state: ISightPageLayoutState = {
        loading: true,
    };

    private renderState = () => {
        const { isVerified, isArchived } = this.props.sight;

        // 0 - unknown, 1 - verified, 2 - archived
        const state = isVerified ? 1 : (isArchived ? 2 : 0);
        const { icon, label, className } = humanizedState[state];

        return (
            <TextIconified className={`sight-info-layout--state-${className}`} icon={icon}>{label}</TextIconified>
        );
    }

    render() {
        const { sight, author, marks } = this.props;

        const {
            title,
            description,
            markIds,
            dateCreated,
            dateUpdated,
            canModify,
            city,
            photo,
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
                    {this.renderState()}
                    {city && (
                        <TextIconified icon={mdiCity}>
                            <Link to={`/sight/search?cityId=${city.cityId}`}>{city.name}</Link>
                        </TextIconified>
                    )}
                    {description && (
                        <TextIconified icon={mdiText}>{description}</TextIconified>
                    )}
                    <TextIconified icon={mdiAccountCheck}>
                        <Link to={`/user/${login}`}>{firstName} {lastName}</Link>
                    </TextIconified>
                    <TextIconified icon={mdiClockCheckOutline}>
                        Добавлено {humanizeDateTime(dateCreated, Format.FULL)}
                        {dateUpdated ? `, обновлено ${humanizeDateTime(dateUpdated, Format.FULL)}` : ''}
                    </TextIconified>
                    {markIds?.length && (
                        <TextIconified
                            icon={mdiPound}>
                            {markIds.map(id => marks.get(id)).map(mark => (
                                <Link key={mark.markId} to={`/sight/search?markIds=${mark.markId}`}>#{mark.title}</Link>
                            )).reduce((acc, el, i) => { i && acc.push(', '); acc.push(el); return acc; }, [])}
                        </TextIconified>
                    )}
                </div>
            </div>
        );
    }
}

export default SightPageLayout;
