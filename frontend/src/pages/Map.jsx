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
import Papa from 'papaparse'


const customIcon = L.icon({
  iconUrl: streetlight,
  iconSize: [80, 80],
  iconAnchor: [40, 40],
  popupAnchor: [0, -32],
});

// const points = [
//   [40.4406, -79.9959, 0.2], 
//   [40.4374, -80.0014, 0.5], 
//   [40.4456, -79.9823, 0.8], 
//   [40.4295, -79.9585, 0.6], 
//   [40.4530, -79.9335, 0.4], 
//   [40.4386, -79.9773, 0.7], 
//   [40.4690, -79.9491, 0.5], 
//   [40.4123, -79.9936, 0.6], 
//   [40.4822, -80.0350, 0.3], 
//   [40.4236, -79.9792, 0.4], 
//   [40.4916, -80.0023, 0.31],
//   [40.4902, -80.0885, 0.39],
//   [40.4379, -79.9094, 0.11],
//   [40.4873, -79.9301, 0.23],
//   [40.4445, -79.9618, 0.26],
//   [40.3187, -80.0657, 0.57],
//   [40.3383, -80.0204, 0.65],
//   [40.4475, -79.9171, 0.31],
//   [40.3420, -80.0244, 0.68],
//   [40.3905, -79.9225, 0.33],
//   [40.3298, -80.0172, 0.75],
//   [40.4667, -80.0503, 0.24],
//   [40.4992, -79.9594, 0.29],
//   [40.4596, -79.9514, 0.66],
//   [40.3833, -79.9042, 0.65],
//   [40.3432, -80.0135, 0.5],
//   [40.4874, -80.0003, 0.7],
//   [40.3076, -79.9208, 0.87],
//   [40.3703, -79.9847, 0.71],
//   [40.3831, -79.9175, 0.81],
//   [40.3812, -79.9764, 0.84],
//   [40.4462, -80.0598, 0.86],
//   [40.4136, -79.9274, 0.69],
//   [40.3720, -80.0996, 0.24],
//   [40.4324, -80.0373, 0.85],
//   [40.4290, -80.0007, 0.55],
//   [40.3857, -79.9602, 0.15],
//   [40.3316, -80.0124, 0.38],
//   [40.3267, -80.0084, 0.83],
//   [40.3878, -80.0838, 0.82],
//   [39.9365, -74.9928, 0.4],
//   [39.9986, -75.0509, 0.78],
//   [39.9853, -75.0009, 0.88],
//   [40.0749, -75.0384, 0.9],
//   [39.9441, -75.2035, 0.61],
//   [40.0435, -75.0595, 0.31],
//   [39.8834, -74.9914, 0.77],
//   [39.9529, -75.0462, 0.83],
//   [40.0174, -75.2198, 0.29],
//   [39.8275, -75.2826, 0.52],
//   [40.0402, -74.9722, 0.39],
//   [39.9436, -74.9461, 0.73],
//   [40.0843, -75.0316, 0.22],
//   [39.8399, -74.9666, 0.59],
//   [39.8474, -74.9081, 0.28],
//   [40.0607, -75.0570, 0.76],
//   [39.8907, -75.0714, 0.42],
//   [39.8388, -74.9622, 0.46],
//   [39.9862, -75.0314, 0.76],
//   [39.9922, -75.1443, 0.79],
//   [40.2630, -76.9142, 0.67],
//   [39.9467, -79.9712, 0.31],
//   [41.7426, -75.3087, 0.69],
//   [40.1084, -78.7739, 0.44],
//   [40.6473, -79.5480, 0.81],
//   [41.6805, -77.2498, 0.41],
//   [40.7704, -76.4190, 0.33],
//   [41.2101, -79.0250, 0.46],
//   [39.9555, -80.1741, 0.55],
//   [40.7752, -77.3745, 0.95],
//   [40.0702, -74.9411, 0.92],
//   [40.0548, -77.1581, 0.03],
//   [40.0276, -78.8525, 0.81],
//   [41.8171, -79.1206, 0.28],
//   [40.4509, -76.6317, 0.65],
//   [40.6277, -79.7253, 0.8],
//   [39.9928, -76.4381, 0.81],
//   [39.9316, -76.3696, 0.2],
//   [41.4306, -75.3671, 0.17],
//   [40.1015, -74.7596, 0.14],
//   [42.2577, -75.4177, 0.93],
//   [41.3471, -78.2431, 0.72],
//   [41.8534, -79.4711, 0.52],
//   [41.4228, -74.7287, 0.73],
//   [40.9310, -75.0246, 0.36],
//   [41.5721, -75.6957, 0.06],
//   [41.6649, -80.1341, 0.77],
//   [39.7949, -77.9457, 0.46],
//   [41.0755, -80.4127, 0.57],
//   [41.6896, -75.7867, 0.94],
//   [40.5617, -79.3182, 0.84],
//   [41.1772, -75.9905, 0.25],
//   [40.9347, -77.4400, 0.46],
//   [41.8623, -78.4846, 0.99],
//   [41.5599, -77.1447, 0.44],
//   [42.2015, -78.0907, 0.31],
//   [40.6444, -76.7601, 0.14],
//   [40.3420, -77.2448, 0.52],
//   [39.8211, -78.3245, 0.35],
//   [41.7512, -78.6821, 0.33],
//   [41.5825, -75.2673, 0.71],
//   [40.6854, -78.4278, 0.6],
//   [41.0636, -77.1008, 0.59],
//   [40.3492, -79.2433, 0.61],
//   [41.2853, -75.2077, 0.5],
//   [41.4269, -77.0202, 0.06],
//   [41.3899, -78.8691, 0.28],
//   [40.6379, -80.4480, 0.68],
//   [40.2067, -78.5734, 0.94],
//   [40.4361, -77.4230, 0.83]
// ];

const countyCoordinates = {
  "Adams": { lat: 39.8719, lng: -77.2167 },
  "Allegheny": { lat: 40.4458, lng: -80.0100 },
  "Armstrong": { lat: 40.8790, lng: -79.4704 },
  "Beaver": { lat: 40.6820, lng: -80.3494 },
  "Bedford": { lat: 39.9860, lng: -78.4909 },
  "Berks": { lat: 40.3452, lng: -75.9928 },
  "Blair": { lat: 40.4840, lng: -78.3497 },
  "Bradford": { lat: 41.7889, lng: -76.5113 },
  "Bucks": { lat: 40.3363, lng: -75.1240 },
  "Butler": { lat: 40.9115, lng: -79.8840 },
  "Cambria": { lat: 40.4958, lng: -78.7138 },
  "Cameron": { lat: 41.4273, lng: -78.1832 },
  "Carbon": { lat: 40.9010, lng: -75.6674 },
  "Centre": { lat: 40.9226, lng: -77.8367 },
  "Chester": { lat: 39.9726, lng: -75.7471 },
  "Clarion": { lat: 41.1980, lng: -79.4404 },
  "Clearfield": { lat: 41.0275, lng: -78.4390 },
  "Clinton": { lat: 41.3332, lng: -77.6536 },
  "Columbia": { lat: 41.0270, lng: -76.3637 },
  "Crawford": { lat: 41.6661, lng: -80.1076 },
  "Cumberland": { lat: 40.1579, lng: -77.2610 },
  "Dauphin": { lat: 40.2737, lng: -76.7337 },
  "Delaware": { lat: 39.9168, lng: -75.3879 },
  "Elk": { lat: 41.4280, lng: -78.5840 },
  "Erie": { lat: 42.0522, lng: -80.1875 },
  "Fayette": { lat: 39.9200, lng: -79.7196 },
  "Forest": { lat: 41.5034, lng: -79.2187 },
  "Franklin": { lat: 39.9242, lng: -77.6536 },
  "Fulton": { lat: 39.9369, lng: -78.1564 },
  "Greene": { lat: 39.8440, lng: -80.1875 },
  "Huntingdon": { lat: 40.4150, lng: -78.0195 },
  "Indiana": { lat: 40.6218, lng: -79.1525 },
  "Jefferson": { lat: 41.1250, lng: -79.0558 },
  "Juniata": { lat: 40.5333, lng: -77.4170 },
  "Lackawanna": { lat: 41.4421, lng: -75.5743 },
  "Lancaster": { lat: 40.0379, lng: -76.3055 },
  "Lawrence": { lat: 40.9921, lng: -80.3659 },
  "Lebanon": { lat: 40.3667, lng: -76.5026 },
  "Lehigh": { lat: 40.6510, lng: -75.5743 },
  "Luzerne": { lat: 41.1839, lng: -75.9747 },
  "Lycoming": { lat: 41.3432, lng: -77.0450 },
  "McKean": { lat: 41.8133, lng: -78.4750 },
  "Mercer": { lat: 41.2619, lng: -80.1875 },
  "Mifflin": { lat: 40.6521, lng: -77.6078 },
  "Monroe": { lat: 41.0452, lng: -75.2479 },
  "Montgomery": { lat: 40.2290, lng: -75.3879 },
  "Montour": { lat: 41.0275, lng: -76.6875 },
  "Northampton": { lat: 40.7749, lng: -75.2946 },
  "Northumberland": { lat: 40.8916, lng: -76.7277 },
  "Perry": { lat: 40.3980, lng: -77.2405 },
  "Philadelphia": { lat: 39.9526, lng: -75.1652 },
  "Pike": { lat: 41.3369, lng: -75.0611 },
  "Potter": { lat: 41.6683, lng: -77.8367 },
  "Schuylkill": { lat: 40.7060, lng: -76.1784 },
  "Snyder": { lat: 40.7667, lng: -77.0667 },
  "Somerset": { lat: 39.9590, lng: -79.0806 },
  "Sullivan": { lat: 41.4332, lng: -76.5026 },
  "Susquehanna": { lat: 41.9437, lng: -75.9150 },
  "Tioga": { lat: 41.7735, lng: -77.2540 },
  "Union": { lat: 40.9667, lng: -77.0667 },
  "Venango": { lat: 41.4044, lng: -79.8101 },
  "Warren": { lat: 41.8334, lng: -79.2902 },
  "Washington": { lat: 40.1739, lng: -80.2466 },
  "Wayne": { lat: 41.6739, lng: -75.2479 },
  "Westmoreland": { lat: 40.2989, lng: -79.5930 },
  "Wyoming": { lat: 41.5158, lng: -76.0000 },
  "York": { lat: 39.9510, lng: -76.7337 }
};





const options = {
  radius: 60,
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
  const [locationList, setLocationList] = useState([]);
  const [incident, setIncident] = useState([]);
  const [crimeList, setCrimeList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [currentCrime, setCurrentCrime] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [counties, setCounties] = useState([]);
  const [countyCoordinatesArray, setCountyCoordinatesArray] = useState([]);

  
  useEffect(() => {
    fetch('/crime_data.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const countyArray = results.data.map((row) => row['County']);
            setCounties(countyArray);
          },
        });
      })
      .catch((error) => console.error('Error loading CSV:', error));
  }, []);

  useEffect(() => {
    if (counties.length > 0) {
      const coords = counties.map((county) => {
        const cleanCounty = county.trim();
        const point = countyCoordinates[cleanCounty];
        return point ? [point.lat, point.lng, 0.99] : null;
      }).filter(Boolean);
  
      setCountyCoordinatesArray(coords);
      console.log("countyCoordinatesArray:", coords);
    }
  }, [counties]);
  



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
      <section className="w-full md:w-1/4 lg:w-1/5 bg-[#333333] text-white text-left p-4 md:p-6">
        <h1 className="text-white text-center mt-5 mb-5 text-lg md:text-xl lg:text-2xl">
          Recent Crimes
        </h1>

        {crimeList.length > 0 ? (
          crimeList.map((crime, index) => (
              <p
                key={index}
                className="ml-4 text-sm md:text-base lg:text-lg mb-2"
              >
                {index % 2 === 0 ? '🔴' : '🟠'} {crime} reported in {locationList[index]}!
              </p>
            ))
          ) : (
            <p className="ml-4 text-sm md:text-base lg:text-lg mb-2">
              😊 No recent crimes reported!
            </p>
          )}

        <span className="w-full flex justify-center mt-5">
          <Button
            sx={{
              color: '#FF8C01',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } // Adjust button text size
            }}
            onClick={() => setOpen(true)}
          >
            Want to report an incident? Click here
          </Button>
        </span>
      </section>

      <section className="flex-1 min-h-[calc(100vh-4.5rem)] bg-black">
      <MapContainer 
        center={[41.2, -77.19]} 
        zoom={8}
        minZoom={8}
        style={{ height: '100%', width: '100%' }}
        maxBounds={[[39.7198, -80.5199], [42.2698, -74.6895]]}
        maxBoundsViscosity={1.0}
      >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <HeatmapLayer points={countyCoordinatesArray} options={options} />
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
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            sx={{
              '& label.Mui-focused': { color: '#C62C2C' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#C62C2C' },
              },
            }}
          />

          <TextField
            label="Crime"
            fullWidth
            margin="dense"
            variant="outlined"
            value={currentCrime}
            onChange={(e) => setCurrentCrime(e.target.value)}
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
              if (!currentLocation.trim()) {
                alert("Please enter a location.");
                return;
              }

              try {
                const result = await getCoordinates(currentLocation);
                if (result) {
                  setCoordinates((prevCoords) => [
                    ...prevCoords,
                    { lat: result.lat, lon: result.lon, description: incident },
                  ]);
                  setLocationList((prev) => [...prev, currentLocation]);
                  setCrimeList((prev) => [...prev, currentCrime]);

                  setCurrentLocation("");
                  setCurrentCrime("");
                  setIncident("");
                  setOpen(false);
                } else {
                  alert("Location not found.");
                }
              } catch (error) {
                console.error("Error fetching coordinates:", error);
                alert("Something went wrong. Please try again.");
              }
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
