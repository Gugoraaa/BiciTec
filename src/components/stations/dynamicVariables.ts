import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";

export const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

export const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

export const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
export const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export const ScaleControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ScaleControl),
  { ssr: false }
);

export const center: LatLngExpression = [25.6515, -100.2905];