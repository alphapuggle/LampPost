import './stats.css';
import { MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Bar_Census from '../assets/Bar_Census.jpeg';

const Stats = () => {
    return (
    <main>
      <div className='bg [#333333] flex flex-col h-lvh'>
      <div className="bg-[#333333] flex w-screen justify-evenly">
        <div className ="bg-[#333333] flex flex-col w-50%">
          <div className = 'flex flex-col justify-center'>
            <h1 className = "text-2xl text-[#FF8C01]">Graph of Data</h1>
            <img className = "w-lg h-lg" src={Bar_Census} alt="Bar Census" />
          </div>
          <div className = 'flex flex-col justify-center'>
            <h1 className = "text-2xl text-[#FF8C01]"> Map of Area?</h1>
                    <MapContainer
                        center={[41.2, -77.19]}
                        zoom={6}
                        style={{height:'500px', width: '500px'}}
                        >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                    </MapContainer>
          </div>
        </div>
        
        <div className="bg-[#333333] flex flex-col w-50% justify-evenly">
          <div className = "m-3 align-center bg-[#C62C2C] ">
            <ul className = "text-2xl text-[#FF8C01]" >Crimes by popularity</ul>
              <li className = "align-center text">this is a area set aside for data in the future</li>
              <li className = "align-center">it will probably be going down the page like this</li>
              <li className = "align-center">it will probably be hard to get the data to work properly</li>
              <li className = "align-center">but with our group im sure its possible!</li>
          </div>
          <div className = "m-3 bg-[#C62C2C]">
            <ul className = "text-2xl text-[#FF8C01]" >Most Recent Crimes</ul>
              <li className = "align-center">this is a area set aside for data in the future</li>
              <li className = "align-center">it will probably be going down the page like this</li>
              <li className = "align-center">it will probably be hard to get the data to work properly</li>
              <li className = "align-center">but with our group im sure its possible!</li>
          </div>
        </div>
      </div>  
      <footer className = "bg-[#420D09] w-screen">
        <p>this is in the footer</p>
      </footer>

    </div>
    </main> 
    );
  };
  
export default Stats;