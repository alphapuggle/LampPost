import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import streetlight from '../assets/streetlight2.png';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';


const customIcon = L.icon({
  iconUrl: streetlight,
  iconSize: [80, 80],       
  iconAnchor: [40, 40],
  popupAnchor: [0, -32],
});

const Map = () => {

  const [open, setOpen] = React.useState(false);

  return (
    <main className="flex flex-1">
      <section className="w-[20%] bg-[#333333] text-white text-left">
        <h1 className="text-white text-center mt-5 mb-5">Recent Crimes</h1>
        <p className='text-Left ml-10 text-xl mb-2'>🔴 Grand theft reported in Indiana!</p>
        <p className='text-Left ml-10 text-xl mb-2'>🟠 Robbery reported in Pittsburgh!</p>
        <p className='text-Left ml-10 text-xl mb-2'>🔴 Burglary reported in Erie!</p>
        <p className='text-Left ml-10 text-xl mb-2'>🟠 Vandalism reported in Scranton!</p>
        <p className='text-Left ml-10 text-xl mb-2'>🔴 Assault reported in Philadelphia!</p>
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
            <Marker icon={customIcon} position={[40.6215, -79.1525]}>
                <Popup>
                <h1>Test popup!</h1>
                </Popup>
            </Marker>
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
            sx={{
              '& label.Mui-focused': { color: '#C62C2C' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#C62C2C' }
              }
            }}
          />
          <Button variant="contained" sx={{ mt: 2, backgroundColor: 'black', color: 'white' }}>Submit Report</Button>
          <p className="mt-4 text-sm text-[#C62C2C]">If you witness or are a victim of a crime or see an emergency situation, please call 911 immediately.</p>
        </DialogContent>
      </Dialog>
      
    </main>
  );
};

export default Map;