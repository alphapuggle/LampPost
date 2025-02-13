import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import streetlight from '../assets/streetlight.png';

const customIcon = L.icon({
  iconUrl: streetlight,
  iconSize: [80, 80],       
  iconAnchor: [40, 40],
  popupAnchor: [0, -32],
});

const Map = () => {
  return (
    <main className="flex flex-1">
      <section className="w-[20%] bg-[#333333] text-white text-left">
        <h1 className="text-white text-center mt-5 mb-5">Recent Crimes</h1>
        <p className='text-Left ml-10 text-xl mb-2'>🔴 Grand theft reported in Indiana!</p>
        <p className='text-Left ml-10 text-xl mb-2'>🟠 Robbery reported in Pittsburgh!</p>
        <p className='text-Left ml-10 text-xl mb-2'>🔴 Burglary reported in Erie!</p>
        <p className='text-Left ml-10 text-xl mb-2'>🟠 Vandalism reported in Scranton!</p>
        <p className='text-Left ml-10 text-xl mb-2'>🔴 Assault reported in Philadelphia!</p>
      </section>
      <section className="flex-1 min-h-[calc(100vh-4.5rem)] bg-black">
        <MapContainer
            center={[41.2, -77.19]}
            zoom={8}
            style={{ height: '100%', width: '100%' }}
            >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <Marker icon={customIcon} position={[51.505, -0.09]}>
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