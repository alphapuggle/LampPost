import './stats.css';
import 'leaflet/dist/leaflet.css';
import DarkAlley from '../assets/darkAlley.jpg';
import { PieChart } from '@mui/x-charts/PieChart';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const Stats = () => {
  const location = useLocation();
  const selectedResult = location.state?.selectedResult;

  const [topCrimes, setTopCrimes] = useState([]);
  const [recentCrimes, setRecentCrimes] = useState([]);

  useEffect(() => {
    const fetchCrimeData = async () => {
      try {
        console.log("Fetching..")
        const response = await axios.get(`http://localhost:3001/api/ucr-crimes/county?name=${selectedResult.name}`);
        const allData = response.data;


        if (selectedResult) {
          const filtered = allData.filter(
            item => item.County?.toLowerCase() === selectedResult.name?.toLowerCase()
          );

          // Count top offenses
          const crimeCounts = {};
          filtered.forEach(item => {
            const type = (item.OffenseType || 'Unknown').replace(/^"|"$/g, '').trim();
            crimeCounts[type] = (crimeCounts[type] || 0) + 1;
          });

          const sorted = Object.entries(crimeCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([type, count], index) => ({
              id: index,
              label: type,
              value: count,
            }));
          setTopCrimes(sorted);

          const recent = filtered
            .filter(item => item.ReportedOn)
            .sort((a, b) => dayjs(b.ReportedOn).valueOf() - dayjs(a.ReportedOn).valueOf())
            .slice(0, 5)
            .map(item => {
              const reportedDate = dayjs(item.ReportedOn);
              const today = dayjs();
              const diff = today.diff(reportedDate, 'day');
              return {
                type: (item.OffenseType || 'Unknown').replace(/^"|"$/g, '').trim(),
                timeAgo: diff === 0 ? 'Today' : `${diff} day${diff > 1 ? 's' : ''} ago`,
              };
            });

          setRecentCrimes(recent);
        }
      } catch (err) {
        console.error('Error fetching UCR data:', err);
      }
    };

    fetchCrimeData();
  }, [selectedResult]);
  

  return (
    <main 
      className="relative flex flex-col h-full bg-cover bg-center" 
      style={{ backgroundImage: `url(${DarkAlley})` }}
    >
      <div className="absolute inset-0 bg-opacity-100 backdrop-blur-md"></div>

      <div className="relative flex flex-col h-screen place-content-evenly">
        <div className="flex w-screen justify-evenly p-4 items-evenly">
          
          {/* Left Section */}
          <div className="flex flex-col w-[750px] space-y-6 content-evenly items-center align-evenly p-[50px]">
            <div className="flex flex-col justify-center items-center bg-[#333333] bg-opacity-80 rounded-lg shadow-lg w-[1000px] mx-auto">
              {selectedResult ? (
                <h2 className="text-2xl text-[#FF8C01] text-center w-[1000px] border-b border-[#FF8C01] pb-2 mb-4">
                  Crimes in {selectedResult.name}
                </h2>
              
              ) : (
                <h2 className="text-gray-400">No location selected.</h2>
              )}

            <PieChart
              className="border border-[#FF8C01] bg-white"
              series={[{
                data: topCrimes,
                cx: 280,
                innerRadius: 50,
                outerRadius: 240,
              }]}
              width={1000}
              height={580}
              legend={{
                direction: 'column',
                position: { vertical: 'middle', horizontal: 'right' },
                itemMarkWidth: 14,
                itemMarkHeight: 14,
                itemGap: 8,
                padding: 12,
                labelStyle: {
                  fontSize: 14,
                  fontWeight: 500,
                },
                sx: {
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  padding: 1,
                },
              }}
            />

            </div>
          </div>

          <div className="flex flex-col w-[400px] space-y-6 justify-evenly">
            <div className="m-3 p-4 bg-[#333333] bg-opacity-90 rounded-lg shadow-lg">
              {selectedResult ? (
                <h2 className="text-2xl text-[#FF8C01] border-t border-r border-l border-[#FF8C01]">
                  Top 5 Crimes in {selectedResult.name}
                </h2>
              ) : (
                <h2 className="text-gray-400 border-t border-r border-l border-[#FF8C01]">No location selected.</h2>
              )}
              <table className="min-w-full text-white">
                <thead>
                  <tr className="border border-[#FF8C01]">
                    <th className="p-2 text-left border border-[#FF8C01]">Crime Type</th>
                    <th className="p-2 text-left">Registered Offenses</th>
                  </tr>
                </thead>
                <tbody>
                  {topCrimes.map((crime, idx) => (
                    <tr key={idx} className="border border-[#FF8C01]">
                      <td className="p-2 border border-[#FF8C01]">{crime.label}</td>
                      <td className="p-2">{crime.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="m-3 p-4 bg-[#333333] bg-opacity-90 rounded-lg shadow-lg">
              <h2 className="text-2xl text-[#FF8C01] border-t border-r border-l border-[#FF8C01]">Most Recent Crimes</h2>
              <table className="min-w-full text-white">
                <thead>
                  <tr className="border border-[#FF8C01]">
                    <th className="p-2 text-left border border-[#FF8C01]">Crime Type</th>
                    <th className="p-2 text-left">Time Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCrimes.map((crime, idx) => (
                    <tr key={idx} className="border border-[#FF8C01]">
                      <td className="p-2 border border-[#FF8C01]">{crime.type}</td>
                      <td className="p-2">{crime.timeAgo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <footer className="p-4 text-white text-center bg-[#1f1f1f] bg-opacity-80 rounded-t-lg">
          {selectedResult ? (
            <>
              <h2 className="text-lg text-[#FF8C01] font-semibold">Selected Location:</h2>
              <p>{selectedResult.name}</p>
            </>
          ) : (
            <p className="text-gray-400">No location selected.</p>
          )}
        </footer>
      </div>
    </main>
  );
};

export default Stats;
