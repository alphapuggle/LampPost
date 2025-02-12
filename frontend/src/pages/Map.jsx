import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  return (
    <main className="flex flex-1">
      <section className="w-[20%] bg-[#333333]">
        <h1 className="text-white mt-5">Recent Crimes</h1>
      </section>
      <section className="flex-1 min-h-[calc(100vh-4.5rem)] bg-black">
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                Test popup
                </Popup>
            </Marker>
        </MapContainer>
      </section>
      
    </main>
  );
};

export default Map;