import * as React from 'react';
import './style.scss';
import { LatLngTuple } from 'leaflet';
import { ISight } from '../../../api';
import TextInput, { TextInputType } from '../../../components/TextInput';
import { CLASS_COMPACT, CLASS_WIDE, withCheckForAuthorizedUser, withClassBody } from '../../../hoc';

interface ISightEditProps {
    sight: ISight;
}

interface ISightEditState {
    position?: LatLngTuple;
    busy?: boolean;

    title?: string;
    description?: string;
}

class SightEdit extends React.Component<ISightEditProps, ISightEditState> {
    constructor(props: ISightEditProps) {
        super(props);

        const sight = props.sight;

        this.state = {
            position: sight ? [sight.latitude, sight.longitude] : undefined,
            title: sight?.title ?? '',
            description: sight?.description ?? '',
        };
    }

    /*private onMapClick = (position: LatLngTuple) => {
        this.setState({ position });
    };

    private onDragEnd = (event: Leaflet.DragEndEvent) => {
        const { lat, lng } = (event.target as L.Marker).getLatLng();
        this.setState({ position: [lat, lng] });
    };*/

    private onChangeText = (name: string, value: string) => {
        this.setState({
            [name as keyof ISightEditState]: value,
        } as Partial<ISightEditState>);
    };

    render(): JSX.Element {
        const { busy, title, description } = this.state;
        return (
            <form className="sight-edit-page">
                <div className="sight-edit-map">
                    { /*<MapX
                        saveLocation={true}
                        onMapClick={this.onMapClick}>
                        {position && (
                            <Marker
                                draggable
                                position={position}
                                eventHandlers={{
                                    drag: this.onDragEnd
                                }}>
                                <Tooltip>{position.map(n => n.toFixed(7)).join(', ')}</Tooltip>
                            </Marker>
                        )}
                    </MapX> */ }
                </div>
                <div className="sight-edit-form">
                    <TextInput
                        name="title"
                        type={TextInputType.text}
                        defaultValue={title}
                        value={title}
                        required
                        disabled={busy}
                        label="Название"
                        onChange={this.onChangeText} />
                    <TextInput
                        name="description"
                        type={TextInputType.textarea}
                        defaultValue={description}
                        value={description}
                        required
                        disabled={busy}
                        label="Описание (не обязательно, но желательно)"
                        onChange={this.onChangeText} />
                </div>
            </form>
        );
    }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default withClassBody([CLASS_WIDE, CLASS_COMPACT])(withCheckForAuthorizedUser(SightEdit));
