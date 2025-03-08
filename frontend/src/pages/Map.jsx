import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import streetlight from '../assets/streetlight2.png';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import HeatmapLayer from '../components/HeatmapLayer';


const customIcon = L.icon({
  iconUrl: streetlight,
  iconSize: [80, 80],
  iconAnchor: [40, 40],
  popupAnchor: [0, -32],
});

const points = [
  [40.4406, -79.9959, 0.2], 
  [40.4374, -80.0014, 0.5], 
  [40.4456, -79.9823, 0.8], 
  [40.4295, -79.9585, 0.6], 
  [40.4530, -79.9335, 0.4], 
  [40.4386, -79.9773, 0.7], 
  [40.4690, -79.9491, 0.5], 
  [40.4123, -79.9936, 0.6], 
  [40.4822, -80.0350, 0.3], 
  [40.4236, -79.9792, 0.4], 
  [40.4916, -80.0023, 0.31],
  [40.4902, -80.0885, 0.39],
  [40.4379, -79.9094, 0.11],
  [40.4873, -79.9301, 0.23],
  [40.4445, -79.9618, 0.26],
  [40.3187, -80.0657, 0.57],
  [40.3383, -80.0204, 0.65],
  [40.4475, -79.9171, 0.31],
  [40.3420, -80.0244, 0.68],
  [40.3905, -79.9225, 0.33],
  [40.3298, -80.0172, 0.75],
  [40.4667, -80.0503, 0.24],
  [40.4992, -79.9594, 0.29],
  [40.4596, -79.9514, 0.66],
  [40.3833, -79.9042, 0.65],
  [40.3432, -80.0135, 0.5],
  [40.4874, -80.0003, 0.7],
  [40.3076, -79.9208, 0.87],
  [40.3703, -79.9847, 0.71],
  [40.3831, -79.9175, 0.81],
  [40.3812, -79.9764, 0.84],
  [40.4462, -80.0598, 0.86],
  [40.4136, -79.9274, 0.69],
  [40.3720, -80.0996, 0.24],
  [40.4324, -80.0373, 0.85],
  [40.4290, -80.0007, 0.55],
  [40.3857, -79.9602, 0.15],
  [40.3316, -80.0124, 0.38],
  [40.3267, -80.0084, 0.83],
  [40.3878, -80.0838, 0.82],
  [39.9365, -74.9928, 0.4],
  [39.9986, -75.0509, 0.78],
  [39.9853, -75.0009, 0.88],
  [40.0749, -75.0384, 0.9],
  [39.9441, -75.2035, 0.61],
  [40.0435, -75.0595, 0.31],
  [39.8834, -74.9914, 0.77],
  [39.9529, -75.0462, 0.83],
  [40.0174, -75.2198, 0.29],
  [39.8275, -75.2826, 0.52],
  [40.0402, -74.9722, 0.39],
  [39.9436, -74.9461, 0.73],
  [40.0843, -75.0316, 0.22],
  [39.8399, -74.9666, 0.59],
  [39.8474, -74.9081, 0.28],
  [40.0607, -75.0570, 0.76],
  [39.8907, -75.0714, 0.42],
  [39.8388, -74.9622, 0.46],
  [39.9862, -75.0314, 0.76],
  [39.9922, -75.1443, 0.79],
  [40.2630, -76.9142, 0.67],
  [39.9467, -79.9712, 0.31],
  [41.7426, -75.3087, 0.69],
  [40.1084, -78.7739, 0.44],
  [40.6473, -79.5480, 0.81],
  [41.6805, -77.2498, 0.41],
  [40.7704, -76.4190, 0.33],
  [41.2101, -79.0250, 0.46],
  [39.9555, -80.1741, 0.55],
  [40.7752, -77.3745, 0.95],
  [40.0702, -74.9411, 0.92],
  [40.0548, -77.1581, 0.03],
  [40.0276, -78.8525, 0.81],
  [41.8171, -79.1206, 0.28],
  [40.4509, -76.6317, 0.65],
  [40.6277, -79.7253, 0.8],
  [39.9928, -76.4381, 0.81],
  [39.9316, -76.3696, 0.2],
  [41.4306, -75.3671, 0.17],
  [40.1015, -74.7596, 0.14],
  [42.2577, -75.4177, 0.93],
  [41.3471, -78.2431, 0.72],
  [41.8534, -79.4711, 0.52],
  [41.4228, -74.7287, 0.73],
  [40.9310, -75.0246, 0.36],
  [41.5721, -75.6957, 0.06],
  [41.6649, -80.1341, 0.77],
  [39.7949, -77.9457, 0.46],
  [41.0755, -80.4127, 0.57],
  [41.6896, -75.7867, 0.94],
  [40.5617, -79.3182, 0.84],
  [41.1772, -75.9905, 0.25],
  [40.9347, -77.4400, 0.46],
  [41.8623, -78.4846, 0.99],
  [41.5599, -77.1447, 0.44],
  [42.2015, -78.0907, 0.31],
  [40.6444, -76.7601, 0.14],
  [40.3420, -77.2448, 0.52],
  [39.8211, -78.3245, 0.35],
  [41.7512, -78.6821, 0.33],
  [41.5825, -75.2673, 0.71],
  [40.6854, -78.4278, 0.6],
  [41.0636, -77.1008, 0.59],
  [40.3492, -79.2433, 0.61],
  [41.2853, -75.2077, 0.5],
  [41.4269, -77.0202, 0.06],
  [41.3899, -78.8691, 0.28],
  [40.6379, -80.4480, 0.68],
  [40.2067, -78.5734, 0.94],
  [40.4361, -77.4230, 0.83]
];




const options = {
  radius: 50,
  blur: 15,
  minOpacity: 0.3,
  max: 1.0,
  gradient: {
    0.2: "blue", 
    0.4: "cyan",  
    0.6: "lime", 
    0.8: "yellow", 
    1.0: "red" 
  }
};

const Map = () => {
  const [open, setOpen] = React.useState(false);
  const [location, setLocation] = useState("");
  const [incident, setIncident] = useState([]);
  const [coordinates, setCoordinates] = useState([]);

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { format: "json", q: address },
      });

      if (response.data.length > 0) {
        return { lat: parseFloat(response.data[0].lat), lon: parseFloat(response.data[0].lon) };
      } else {
        throw new Error("Location not found");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  return (
    <main className="flex flex-1">
      <section className="w-[20%] bg-[#333333] text-white text-left">
        <h1 className="text-white text-center mt-5 mb-5">Recent Crimes</h1>
        <p className="text-Left ml-10 text-xl mb-2">🔴 Grand theft reported in Indiana!</p>
        <p className="text-Left ml-10 text-xl mb-2">🟠 Robbery reported in Pittsburgh!</p>
        <p className="text-Left ml-10 text-xl mb-2">🔴 Burglary reported in Erie!</p>
        <p className="text-Left ml-10 text-xl mb-2">🟠 Vandalism reported in Scranton!</p>
        <p className="text-Left ml-10 text-xl mb-2">🔴 Assault reported in Philadelphia!</p>
        <span className="w-full flex justify-center mt-5">
          <Button
            sx={{
              color: '#FF8C01',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
            onClick={() => setOpen(true)}
          >
            Want to report an incident? Click here
          </Button>
        </span>
      </section>
      <section className="flex-1 min-h-[calc(100vh-4.5rem)] bg-black">
        <MapContainer center={[41.2, -77.19]} zoom={8} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <HeatmapLayer points={points} options={options} />
          {coordinates.map((coord, index) => (
            <Marker key={index} icon={customIcon} position={[coord.lat, coord.lon]}>
              <Popup>
                <h1>Reported Incident</h1>
                <p>{coord.description}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Report an Incident</DialogTitle>
        <DialogContent>
          <TextField
            label="Location"
            fullWidth
            margin="dense"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{
              '& label.Mui-focused': { color: '#C62C2C' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#C62C2C' },
              },
            }}
          />

          <TextField
            label="Incident Details"
            multiline
            rows={4}
            fullWidth
            margin="dense"
            variant="outlined"
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
            sx={{
              '& label.Mui-focused': { color: '#C62C2C' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#C62C2C' },
              },
            }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: 'black', color: 'white' }}
            onClick={async () => {
              if (!location.trim()) {
                alert("Please enter a location.");
                return;
              }

              try {
                const result = await getCoordinates(location);
                if (result) {
                  setCoordinates((prevCoords) => [
                    ...prevCoords,
                    { lat: result.lat, lon: result.lon, description: incident },
                  ]);
                  setLocation("");
                  setIncident("");
                } else {
                  alert("Location not found.");
                }
              } catch (error) {
                console.error("Error fetching coordinates:", error);
                alert("Something went wrong. Please try again.");
              }
              setOpen(false);
            }}
          >
            Submit Report
          </Button>

          <p className="mt-4 text-sm text-[#C62C2C]">
            If you witness or are a victim of a crime or see an emergency situation, please call 911
            immediately.
          </p>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Map;
