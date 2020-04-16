import * as React from 'react';
import { ISight } from '../../api';
import './sight-layout.scss';
import { Link } from 'react-router-dom';

interface ISightLayoutProps {
    sight: ISight;
}

interface ISightLayoutState {

}

class SightLayout extends React.Component<ISightLayoutProps, ISightLayoutState> {
    render() {
        const { sightId, title, description } = this.props.sight;
        return (
            <>
                <h4 className="map-sight-popup--title">
                    <Link
                        to={`/sight/${sightId}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        {title}
                    </Link>
                </h4>
                <p className="map-sight-popup--description">{description}</p>
            </>
        );
    }
}

export default SightLayout;
