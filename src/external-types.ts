declare module 'react-leaflet-markercluster' {
    // TODO update typings
    // https://github.com/YUzhva/react-leaflet-markercluster
    // https://github.com/yuzhva/react-leaflet-markercluster/blob/master/src/react-leaflet-markercluster.js
    // https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-leaflet-markercluster

    /**
     * function createPathComponent
     * <E extends FeatureGroup | Path, P extends PathWithChildrenProps>
 *     (
     *     createElement: (props: P, context: LeafletContextInterface) => LeafletElement<E>,
     *     updateElement?: (instance: E, props: P, prevProps: P) => void
 *     ):
     *     import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<P> & import("react").RefAttributes<E>>;
     */

    import * as React from 'react';

    type IProps = {
        onClusterClick?: (cluster: unknown) => void;
        showCoverageOnHover?: boolean;
        spiderfyDistanceMultiplier?: number;
        iconCreateFunction?: L.Icon;
        maxClusterRadius?: number | ((zoom: number) => number);
    };

    export default class MarkerClusterGroup extends React.Component<IProps> {}
}

declare module 'react-telegram-login' {
    import * as React from 'react';

    export type TelegramUser = {
        auth_date: number;
        id: number;
        first_name: string;
        last_name: string;
        hash: string;
    };

    type Props = {
        botName: string;
        dataOnauth?: (user: TelegramUser) => void;
        buttonSize?: "large" | "medium" | "small";
        cornerRadius?: number;
        requestAccess?: string;
        usePic?: boolean;
        lang?: string;
    };
    export default class TelegramLoginButton extends React.Component<Props> {}
}
