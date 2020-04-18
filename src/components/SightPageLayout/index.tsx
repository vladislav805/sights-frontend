import * as React from 'react';
import './style.scss';
import { ISight, IUser, IVisitStateStats } from '../../api';
import { getStaticMapImageUri } from '../../utils/getStaticMapImageUri';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import VisitStateSelector from '../VisitStateSelector';

interface ISightPageLayoutProps {
    sight: ISight;
    author: IUser;
    visits: IVisitStateStats;
}

interface ISightPageLayoutState {

}

export default class SightPageLayout extends React.Component<ISightPageLayoutProps, ISightPageLayoutState> {
    render() {
        const {
            sightId,
            title,
            description,
            lat,
            lng,
            isVisited,
            dateCreated,
            dateUpdated,
            canModify,
            city,
            photo,
            visitState,
        } = this.props.sight;
        const {
            firstName,
            lastName,
            login,
        } = this.props.author;

        return (
            <div className={classNames('sight-page-layout', {
                'sight-page-layout__withPhoto': !!photo,
            })}>
                {photo && (
                    <div
                        className="sight-page-layout-photo"
                        style={{
                            '--sight-photo': `url(${photo.photoMax})`,
                            '--sight-photo-ratio': photo.height && `${Math.min(55, photo.height / photo.width * 100)}%`,
                        } as React.CSSProperties} />
                )}
                <div className="sight-page-layout-info">
                    <h1>{title}</h1>
                    <h4>{city && city.name}</h4>
                    <p>{description}</p>
                    <p>
                        Добавлено пользователем <Link to={`/user/${login}`}>{firstName} {lastName}</Link>
                    </p>
                </div>
                <div className="sight-page-layout-map">
                    <img src={getStaticMapImageUri({
                        width: 320,
                        height: 220,
                        lat,
                        lng,
                        zoom: 16,
                    })} alt="Map" />
                </div>
                <VisitStateSelector
                    stats={this.props.visits}
                    selected={visitState}
                    canChange={true}
                    sightId={sightId} />
            </div>
        );
    }
}
