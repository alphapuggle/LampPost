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
  const [incident, setIncident] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [currentCrime, setCurrentCrime] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [counties, setCounties] = useState([]);
  const [countyCoordinatesArray, setCountyCoordinatesArray] = useState([]);
  const [reports, setReports] = useState([]);


  
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

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setReports((prevReports) =>
        prevReports.filter((report) => now - report.timestamp < 10 * 60 * 1000)
      );
    }, 60 * 1000); // Check every 1 minute
  
    return () => clearInterval(interval);
  }, []);
  
  



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

        {reports.length > 0 ? (
          reports.map((report, index) => {
            const minutesAgo = Math.floor((Date.now() - report.timestamp) / 60000);

            return (
              <div
                key={index}
                className="relative ml-4 mb-4 pr-4 text-sm md:text-base lg:text-lg"
              >
                <p>
                  {index % 2 === 0 ? '🔴' : '🟠'} {report.crime} reported in {report.location}
                </p>
                <span className="absolute right-0 bottom-0 text-xs text-gray-400">
                  ({minutesAgo} min ago)
                </span>
              </div>
            );
          })
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
                  setReports((prev) => [
                    ...prev,
                    {
                      crime: currentCrime,
                      location: currentLocation,
                      timestamp: Date.now(), // Store the current time
                    }
                  ]);
                  

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
