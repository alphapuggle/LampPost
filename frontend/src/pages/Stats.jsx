import './stats.css';
import Bar_Census from '../assets/Bar_Census.jpeg';

const Stats = () => {
    return (
    <main className='bg [#333333] flex flex-col'>
      <div className="bg-[#333333] flex w-screen justify-evenly h-60%">
        <div className ="bg-[#333333] flex flex-col w-50%">
          <div className = 'flex flex-col justify-center'>
            <h1 className = "text-2xl text-[#FF8C01]">Graph of Data</h1>
            <img className = "w-lg h-lg" src={Bar_Census} alt="Bar Census" />
          </div>
          <div className = 'flex flex-col justify-center'>
            <h1 className = "text-2xl text-[#FF8C01]"> Map of Area?</h1>
            <img className = "w-lg h-lg" src = {Bar_Census} alt = "Future heatmap?" />
          </div>
        </div>
        
        <div className="bg-[#333333] flex flex-col w-50% justify-evenly justify-evenly content-evenly">
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

      
    </main> 
    );
  };
  
export default Stats;