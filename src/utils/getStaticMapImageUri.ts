type StaticMapProps = {
    width: number;
    height: number;
    lat: number;
    lng: number;
    zoom: number;
    x2?: boolean;
};

export const getStaticMapImageUri = ({ width, height, lat, lng, zoom, x2 }: StaticMapProps): string => `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(${JSON.stringify({
    type: 'Point',
    coordinates: [lng, lat]
})})/${lng},${lat},${zoom},0/${width}x${height}${x2 ? '@2x' : ''}?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;
