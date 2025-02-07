import './stats.css';
import Bar_Census from '../assets/Bar_Census.jpeg';

const Stats = () => {
    return (
    <body>
      <div className="right-float-container">
        <h1 className= "graph-title">Graph of Data</h1>
        <img src={Bar_Census} alt="Bar Census" className="right-float-image" />
        <h1 className= "graph-title">Map of Area?</h1>
        <img src = 'blank' alt = "Future heatmap?" className="right-float-image" />
      </div>
      <div className='left-float-container'>
        <h1 className= "breakdown-title">Crimes by popularity</h1>
          <p>this is a area set aside for data in the future</p>
          <p>it will probably be going down the page like this</p>
          <p>it will probably be hard to get the data to work properly</p>
          <p>but with our group im sure its possible!</p>
        <h1 className= "breakdown-title">Most Recent Crimes</h1>
          <p>this is a area set aside for data in the future</p>
          <p>it will probably be going down the page like this</p>
          <p>it will probably be hard to get the data to work properly</p>
          <p>but with our group im sure its possible!</p>
      </div>
      <div>

      </div>
    </body> 
    );
  };
  
  export default Stats;