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
import Papa from 'papaparse';

const customIcon = L.icon({
  iconUrl: streetlight,
  iconSize: [80, 80],
  iconAnchor: [40, 40],
  popupAnchor: [0, -32],
});

const countyCoordinates = {
  "Adams": { lat: 39.8719, lng: -77.2167 },
  // Add more counties as needed...
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

const TimeSince = ({ timestamp, now }) => {
  if (!timestamp || isNaN(timestamp)) return <span>time unknown</span>;
  const millisecondsAgo = now - timestamp;
  const secondsAgo = Math.floor(millisecondsAgo / 1000);
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (secondsAgo < 60) return <span>just now</span>;
  if (minutesAgo < 60) return <span>{minutesAgo} min ago</span>;
  const hoursAgo = Math.floor(minutesAgo / 60);
  return <span>{hoursAgo} {hoursAgo === 1 ? 'hour' : 'hours'} ago</span>;
};


const Map = () => {
  const [open, setOpen] = useState(false);
  const [incident, setIncident] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const [currentCrime, setCurrentCrime] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [counties, setCounties] = useState([]);
  const [countyCoordinatesArray, setCountyCoordinatesArray] = useState([]);
  const [reports, setReports] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [ucrHeatPoints, setUcrHeatPoints] = useState([]);


  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  const parsePostgresTimestamp = (timestampStr) => {
    if (!timestampStr) return null;
    try {

      const isoTimestamp = timestampStr.replace(' ', 'T');
      const date = new Date(isoTimestamp);
  
      const estOffsetInMs = 4 * 60 * 60 * 1000; 
      const localTimestamp = date.getTime() - estOffsetInMs;
  
      return isNaN(localTimestamp) ? null : localTimestamp;
    } catch {
      return null;
    }
  };
  

  const fetchReports = () => {
    axios.get("http://localhost:3001/api/reports")
      .then(res => {
        const data = res.data;
        const processedReports = data.map(report => {
          const timestamp = parsePostgresTimestamp(report.reported_at);
          return {
            ...report,
            timestamp: timestamp || Date.now() - 300000,
            crime: report.crime || "Unknown incident",
            location: report.location || "Unknown location"
          };
        });

        setReports(processedReports);
        setCoordinates(processedReports.map(report => ({
          lat: report.lat,
          lon: report.lon,
          description: report.incident
        })));
      })
      .catch(err => console.error("Failed to load reports:", err));
  };

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
    fetchReports();
    const refreshInterval = setInterval(fetchReports, 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (counties.length > 0) {
      const coords = counties.map((county) => {
        const cleanCounty = county.trim();
        const point = countyCoordinates[cleanCounty];
        return point ? [point.lat, point.lng, 0.99] : null;
      }).filter(Boolean);
      setCountyCoordinatesArray(coords);
    }
  }, [counties]);

  useEffect(() => {
    const interval = setInterval(() => {
      setReports((prevReports) =>
        prevReports.filter((report) => now - report.timestamp < 60 * 60 * 1000)
      );
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [now]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/ucr-crimes')
      .then(res => {
        const heatPoints = res.data
          .filter(d => d.latitude && d.longitude)
          .map(d => [parseFloat(d.latitude), parseFloat(d.longitude), 0.7]); // 0.7 is intensity
        setUcrHeatPoints(heatPoints);
        console.log("points:", heatPoints);
      })
      .catch(err => console.error("Failed to fetch UCR heatmap data:", err));
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

  const submitReport = async () => {
    if (!currentLocation.trim()) {
      alert("Please enter a location.");
      return;
    }
    try {
      const result = await getCoordinates(currentLocation);
      if (result) {
        await axios.post("http://localhost:3001/api/reports", {
          location: currentLocation,
          crime: currentCrime,
          incident: incident,
          lat: result.lat,
          lon: result.lon
        });
        fetchReports();
        setCurrentLocation("");
        setCurrentCrime("");
        setIncident("");
        setOpen(false);
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Something went wrong. Please try again.");
    }
  };



  return (
    <main className="flex flex-1">
      <section className="w-full md:w-1/4 lg:w-1/5 bg-[#333333] text-white text-left p-4 md:p-6">
        <h1 className="text-white text-center mt-5 mb-5 text-lg md:text-xl lg:text-2xl">
          Recent Crimes
        </h1>
        {reports.length > 0 ? (
          reports.sort((a, b) => b.timestamp - a.timestamp).map((report, index) => (
            <div key={`${report.timestamp}-${index}`} className="relative ml-4 mb-4 pr-4 text-sm md:text-base lg:text-lg">
              <p>{index % 2 === 0 ? '🔴' : '🟠'} {report.crime} reported in {report.location}</p>
              <span className="absolute right-0 bottom-0 text-xs text-gray-400">
              (<TimeSince timestamp={report.timestamp} now={now} />)
              </span>
            </div>
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
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
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
          <HeatmapLayer points={ucrHeatPoints} options={options} />
          {coordinates.map((coord, index) => (
            <Marker key={index} icon={customIcon} position={[coord.lat, coord.lon]}>
              <Popup>
                <div className="w-64 bg-gradient-to-br from-black via-[#1a1a1a] to-[#2a2a2a] text-white border border-[#c6952c] p-4 rounded-lg shadow-md space-y-2">
                  <h2 className="text-lg font-semibold text-orange-400">Reported Incident</h2>
                  <p className="text-sm text-white leading-snug">
                    {coord.description}
                  </p>
                </div>
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
            sx={{ '& label.Mui-focused': { color: '#C62C2C' }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#C62C2C' } } }}
          />
          <TextField
            label="Crime"
            fullWidth
            margin="dense"
            variant="outlined"
            value={currentCrime}
            onChange={(e) => setCurrentCrime(e.target.value)}
            sx={{ '& label.Mui-focused': { color: '#C62C2C' }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#C62C2C' } } }}
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
            sx={{ '& label.Mui-focused': { color: '#C62C2C' }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#C62C2C' } } }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: 'black', color: 'white' }}
            onClick={submitReport}
          >
            Submit Report
          </Button>
          <p className="mt-4 text-sm text-[#C62C2C]">
            If you witness or are a victim of a crime or see an emergency situation, please call 911 immediately.
          </p>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Map;
