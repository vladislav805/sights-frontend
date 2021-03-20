import * as React from 'react';
import './style.scss';
import { Popup } from 'react-leaflet';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { ISight, VisitState } from '../../api/types/sight';
import TextIconified from '../TextIconified';
import { AddressIcon, VisitStateIcon } from '../../shorthand/icons';
import { VisitStateLabel } from '../../shorthand/labels';
import { renderSightMaskExplanation } from '../../shorthand/sight-mask';

type ISightPopupProps = {
    sight: ISight;
};

const SightPopup: React.FC<ISightPopupProps> = ({ sight }: ISightPopupProps) => {
    const { sightId, title, description, photo, address, visitState } = sight;
    return (
        <Popup
            minWidth={300}
            autoPan={false}
            closeOnEscapeKey
            closeButton>
            <div
                className={classNames('map-sight-popup', {
                    'map-sight-popup__withPhoto': !!photo,
                })}>
                {photo && (
                    <Link
                        className="map-sight-popup--photo"
                        to={`/sight/${sightId}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <img
                            src={photo.photo200}
                            alt="User ava" />
                    </Link>
                )}
                <div className="map-sight-popup--content">
                    <h4 className="map-sight-popup--title">
                        <Link
                            to={`/sight/${sightId}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            {title}
                        </Link>
                    </h4>
                    {}
                    {visitState !== undefined && visitState !== VisitState.NOT_VISITED && (
                        <TextIconified
                            className={`map-sight-popup--visitState map-sight-popup--visitState__${visitState}`}
                            icon={VisitStateIcon[visitState]}>
                            {VisitStateLabel[visitState]}
                        </TextIconified>
                    )}
                    {renderSightMaskExplanation(sight.mask)}
                    <TextIconified
                        className="map-sight-popup--address"
                        icon={AddressIcon}>
                        {address}
                    </TextIconified>
                    <p className="map-sight-popup--description">{description}</p>
                </div>
            </div>
        </Popup>
    );
};

export default SightPopup;
