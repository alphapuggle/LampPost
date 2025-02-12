import './App.css'
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Map from "./pages/Map"
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <div className="max-h-screen overflow-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} /> 
        <Route path="/map" element={<Map />} /> 
      </Routes>
    </div>
  );
}

export default App;