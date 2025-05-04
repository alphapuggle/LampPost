import './stats.css';
import 'leaflet/dist/leaflet.css';
import DarkAlley from '../assets/darkAlley.jpg';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';

ChartJS.register(ArcElement, Tooltip, Legend);

const Stats = () => {
  const location = useLocation();
  const selectedResult = location.state?.selectedResult;

  const [topCrimes, setTopCrimes] = useState([]);
  const [recentCrimes, setRecentCrimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrimeData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/ucr-crimes/county?name=${selectedResult.name}`);
        const allData = response.data;

        if (selectedResult) {
          const filtered = allData.filter(
            item => item.County?.toLowerCase() === selectedResult.name?.toLowerCase()
          );

          const crimeCounts = {};
          filtered.forEach(item => {
            const type = (item.OffenseType || 'Unknown').replace(/^"|"$/g, '').trim();
            crimeCounts[type] = (crimeCounts[type] || 0) + 1;
          });

          const sorted = Object.entries(crimeCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([type, count]) => ({
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
      } finally {
        setLoading(false);
      }
    };

    fetchCrimeData();
  }, [selectedResult]);

  const pieData = {
    labels: topCrimes.map(c => c.label),
    datasets: [{
      data: topCrimes.map(c => c.value),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      borderColor: '#333',
      borderWidth: 1
    }]
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#ffffff',
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        bodyColor: '#ffffff',
        backgroundColor: '#1f1f1f',
        titleColor: '#FF8C01',
      }
    },
    layout: {
      padding: 20
    }
  };

  return (
    <main 
      className="relative flex flex-col h-full bg-cover bg-center" 
      style={{ backgroundImage: `url(${DarkAlley})` }}
    >
      <div className="absolute inset-0 bg-opacity-100 backdrop-blur-md"></div>

      <div className="relative flex flex-col h-screen justify-evenly">
        <div className="flex flex-col lg:flex-row w-full justify-evenly p-4 items-start gap-6">

          {/* Left Section */}
          <div className="flex flex-col w-full lg:w-[750px] space-y-6 items-center p-4">
            <div className="flex flex-col justify-center items-center bg-[#333333] bg-opacity-80 rounded-lg shadow-lg w-full">
              {selectedResult ? (
                <h2 className="text-2xl text-[#FF8C01] text-center w-full border-b border-[#FF8C01] pb-2 mb-4">
                  Crimes in {selectedResult.name}
                </h2>
              ) : (
                <h2 className="text-gray-400">No location selected.</h2>
              )}

              <div className="w-full flex justify-center p-4">
                <div className="bg-black rounded-lg p-6 w-full max-w-[1200px] flex justify-center items-center min-h-[300px]">
                  {loading ? (
                    <CircularProgress style={{ color: '#FF8C01' }} />
                  ) : (
                    <Pie data={pieData} options={pieOptions} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col w-full lg:w-[400px] space-y-6">
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
