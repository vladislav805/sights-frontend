import * as React from 'react';
import { createPortal } from 'react-dom';
import * as classNames from 'classnames';

interface IMenuOverlayProps {
    show: boolean;
    close: () => void;
}

class MenuOverlay extends React.Component<IMenuOverlayProps> {
    private readonly overlay: HTMLDivElement;

    constructor(props: IMenuOverlayProps) {
        super(props);
        this.overlay = document.createElement('div');
    }

    componentDidMount(): void {
        document.body.appendChild(this.overlay);
    }

    componentDidUpdate(prevProps: IMenuOverlayProps): void {
        if (prevProps.show !== this.props.show) {
            document.body.style.overflow = this.props.show ? 'hidden' : 'auto';
        }
    }

    componentWillUnmount(): void {
        document.body.removeChild(this.overlay);
    }

    render(): JSX.Element {
        return createPortal(
            (
                <div
                    onClick={this.props.close}
                    className={classNames('menu-overlay', {
                        'menu-overlay__open': this.props.show,
                    })} />
            ),
            this.overlay
        );
    }
}

export default MenuOverlay;
