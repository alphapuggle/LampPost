import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import streetlight from '../assets/streetlight2.png';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import axios from 'axios';


const customIcon = L.icon({
  iconUrl: streetlight,
  iconSize: [80, 80],       
  iconAnchor: [40, 40],
  popupAnchor: [0, -32],
});

const Map = () => {

  const [open, setOpen] = React.useState(false);
  const [location, setLocation] = useState("");
  const [incident, setIncident] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [data, setData] = useState([
    ["Assault","Indiana"],["Robbery","Pittsburgh"],["Grand theft", "Erie"],["Vandalism","Scranton"]
  ]);


  const getCoordinates = async (address) => {
    try {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: { format: "json", q: address }
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
        {data.map((data, index) => (
          <p className='text-Left ml-10 text-xl mb-2'>{ index % 2 === 0 ? "🔴" : "🟠" } {data[0]} reported in {data[1]}!</p>
        ))}
        <span className='w-full flex justify-center mt-5'>
          <Button 
            sx={{
              color: '#FF8C01',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
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
            style={{ height: '100%', width: '100%' }}
            >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
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
                '&.Mui-focused fieldset': { borderColor: '#C62C2C' }
              }
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
                '&.Mui-focused fieldset': { borderColor: '#C62C2C' }
              }
            }}
          />
          <Button variant="contained" 
          sx={{ mt: 2, backgroundColor: 'black', color: 'white' }}
          onClick={
            async () => {
              if (!location.trim()) {
              alert("Please enter a location.");
              return;
            }

            try {
              const result = await getCoordinates(location);
              if (result) {
                setCoordinates(prevCoords => [
                  ...prevCoords,
                  { lat: result.lat, lon: result.lon, description: incident }
                ]);
                setLocation("")
                setIncident("")
              } else {
                alert("Location not found.")
              }
            }
            catch (error) {
              console.error("Error fetching coordinates:", error);
              alert("Something went wrong. Please try again.");
            }
            setOpen(false)
          }}
          >
            Submit Report
          </Button>

          <p className="mt-4 text-sm text-[#C62C2C]">If you witness or are a victim of a crime or see an emergency situation, please call 911 immediately.</p>
        </DialogContent>
      </Dialog>
      
    </main>
  );
};

export default Map;