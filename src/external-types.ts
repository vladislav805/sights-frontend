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

    export default class MarkerClusterGroup extends React.Component {}
}
