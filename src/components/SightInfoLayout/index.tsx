import * as React from 'react';
import './style.scss';
import { ISight, IUsableSightWithDistance, IUser, IVisitStateStats } from '../../api';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import LoadingWrapper from '../LoadingWrapper';
import { Format, humanizeDateTime } from '../../utils';

interface ISightPageLayoutProps {
    sight: ISight;
    author: IUser;
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

class SightPageLayout extends React.Component<ISightPageLayoutProps, ISightPageLayoutState> {
    state: ISightPageLayoutState = {
        loading: true,
    };

    render() {
        const { sight, author } = this.props;

        if (!sight) {
            return (
                <LoadingWrapper
                    loading
                    subtitle="Загрузка информации о достопримечательности..." />
            );
        }

        const {
            sightId,
            title,
            description,
            lat,
            lng,
            isVerified,
            isArchived,
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
                    <h4>{city && city.name}</h4>
                    <p>{description}</p>
                    <p>Добавлено пользователем <Link to={`/user/${login}`}>{firstName} {lastName}</Link> {humanizeDateTime(dateCreated, Format.FULL)}</p>
                </div>
            </div>
        );
    }
}

export default SightPageLayout;
