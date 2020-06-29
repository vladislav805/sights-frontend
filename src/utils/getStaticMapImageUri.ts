type StaticMapProps = {
    width: number;
    height: number;
    lat: number;
    lng: number;
    zoom: number;
}
export const getStaticMapImageUri = ({ width, height, lat, lng, zoom }: StaticMapProps): string => `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(${JSON.stringify({
    type: 'Point',
    coordinates: [lng, lat]
})})/${lng},${lat},${zoom},0/${width}x${height}?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;
