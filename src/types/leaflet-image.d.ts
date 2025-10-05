declare module 'leaflet-image' {
  import * as L from 'leaflet';

  function leafletImage(
    map: L.Map,
    callback: (err: Error | null, canvas: HTMLCanvasElement) => void
  ): void;

  export default leafletImage;
}
