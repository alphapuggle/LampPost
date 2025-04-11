import './stats.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Bar_Census from '../assets/Bar_Census.jpeg';
import DarkAlley from '../assets/darkAlley.jpg'; // Import the background image
import { PieChart } from '@mui/x-charts/PieChart';
import { useLocation } from 'react-router-dom'; // Import useLocation

const Stats = () => {
  const location = useLocation(); // Retrieve the location object
  const selectedResult = location.state?.selectedResult; // Get the selected result from state

  return (
    <main 
      className="relative flex flex-col h-full bg-cover bg-center" 
      style={{ backgroundImage: `url(${DarkAlley})` }}
    >
      {/* Overlay for blur effect */}
      <div className="absolute inset-0 bg-opacity-100 backdrop-blur-md"></div>

      {/* Main Content */}
      <div className="relative flex flex-col h-screen place-content-evenly">
        <div className="flex w-screen justify-evenly p-4 items-evenly">
          
          {/* Left Section */}
          <div className="flex flex-col w-[750px] space-y-6 content-evenly items-center align-evenly p-[50px]">
            <div className="flex flex-col justify-center items-center bg-[#333333] bg-opacity-80 rounded-lg shadow-lg max-w-[800px] mx-auto">
              <h1 className="text-2xl text-[#FF8C01]">Graph of Crimes in Indiana</h1>
              <PieChart 
                className="border border-[#FF8C01] bg-white"
                series={[{
                  data: [
                    { id: 0, value: 7, label: 'Burglary' },
                    { id: 1, value: 6, label: 'Assault' },
                    { id: 2, value: 6, label: 'Drug Possession' },
                    { id: 3, value: 6, label: 'Theft' },
                    { id: 4, value: 6, label: 'DUI' },
                    { id: 5, value: 6, label: 'Vandalism' },
                  ],
                  cx: 245,
                  innerRadius: 50,  // Adjusts the inner cutout to position labels better
                  outerRadius: 240, // Adjusts the pie chart's size
                }]}
                width={800}
                height={520}
              />
            </div>

            <div className="flex flex-col justify-center items-center bg-[#333333] bg-opacity-80 rounded-lg shadow-lg max-w-[800px]">
              <h1 className="text-2xl text-[#FF8C01]">Map of Area</h1>
              <MapContainer center={[41.2, -77.19]} zoom={6} className="w-[500px] h-[300px] md:w-[800px] md:h-[400px] rounded-md">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              </MapContainer>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col w-[400px] space-y-6 justify-evenly">
            {/* Crimes by Popularity Section */}
            <div className="m-3 p-4 bg-[#333333] bg-opacity-90 rounded-lg shadow-lg">
              <h2 className="text-2xl text-[#FF8C01] text-center border-t border-r border-l border-[#FF8C01]">Top 6 Crimes in Indiana</h2>
              <table className="min-w-full text-white">
                <thead>
                  <tr className="border border-[#FF8C01]">
                    <th className="p-2 text-left border border-[#FF8C01]">Crime Type</th>
                    <th className="p-2 text-left">Registered Offenses</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-[#FF8C01]">
                    <td className="p-2 border border-[#FF8C01]">Burglary</td>
                    <td className="p-2">7</td>
                  </tr>
                  <tr className="border border-[#FF8C01]">
                    <td className="p-2 border border-[#FF8C01]">Robbery</td>
                    <td className="p-2">6</td>
                  </tr>
                  <tr className="border border-[#FF8C01]">
                    <td className="p-2 border border-[#FF8C01]">Assault</td>
                    <td className="p-2">6</td>
                  </tr>
                  <tr className="border border-[#FF8C01]">
                    <td className="p-2 border border-[#FF8C01]">Fraud</td>
                    <td className="p-2">6</td>
                  </tr>
                  <tr className="border border-[#FF8C01]">
                    <td className="p-2 border border-[#FF8C01]">Drug Offenses</td>
                    <td className="p-2">6</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[#FF8C01]">Vandalism</td>
                    <td className="p-2 border border-[#FF8C01]">6</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Most Recent Crimes Section */}
            <div className="m-3 p-4 bg-[#333333] bg-opacity-90 rounded-lg shadow-lg">
              <h2 className="text-2xl text-[#FF8C01] text-center border-t border-r border-l border-[#FF8C01]">Most Recent Crimes In Indiana</h2>
              <table className="min-w-full text-white">
                <thead>
                  <tr className="border border-[#FF8C01]">
                    <th className="p-2 text-left border border-[#FF8C01]">Crime Type</th>
                    <th className="p-2 text-left">Time Reported</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-[#FF8C01]">
                    <td className="p-2 border border-[#FF8C01]">Arson</td>
                    <td className="p-2">2 hours ago</td>
                  </tr>
                  <tr className="border border-[#FF8C01]">
                    <td className="p-2 border border-[#FF8C01]">Theft</td>
                    <td className="p-2 border border-[#FF8C01]">4 hours ago</td>
                  </tr>
                  <tr className="border border-[#FF8C01]">
                    <td className="p-2 border border-[#FF8C01]">Battery</td>
                    <td className="p-2">6 hours ago</td>
                  </tr>
                  <tr className="border border-[#FF8C01]">
                    <td className="p-2 border border-[#FF8C01]">Kidnapping</td>
                    <td className="p-2">8 hours ago</td>
                  </tr>
                  <tr className="border border-[#FF8C01]">
                    <td className="p-2 border border-[#FF8C01]">Homicide</td>
                    <td className="p-2">12 hours ago</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[#FF8C01]">Sexual Assault</td>
                    <td className="p-2 border border-[#FF8C01]">15 hours ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-4 text-white text-center bg-[#1f1f1f] bg-opacity-80 rounded-t-lg">
          {selectedResult ? (
            <div>
              <h2 className="text-lg text-[#FF8C01] font-semibold">Selected Location:</h2>
              <p>{selectedResult.name}</p>
            </div>
          ) : (
            <p className="text-gray-400">No location selected.</p>
          )}
        </footer>

      </div>
    </main>
  );
};

export default Stats;
