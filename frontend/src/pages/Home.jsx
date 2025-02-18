import darkAlley from "../assets/darkAlley.jpg";
import paFlag from "../assets/pa_flag.png";
import streetLt2 from "../assets/streetlight2.png";



const Home = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-cover bg-center flex-auto" 
        style={{ backgroundImage: `url(${darkAlley})`,
        backgroundAttachment: 'scroll'
    }}>
      
      
      <div style={{
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          backdropFilter: "blur(10px)", 
          WebkitBackdropFilter: "blur(4px)", 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "50px",
        }}
      >
      {/* Header */}
      <div className="relative text-white p-6 ">
        <h1 className="text-3xl">Home Page</h1>
        <p className="m-1.5">Welcome to LampPost!</p>
        <p className="text-4xl tracking-widest m-3.5 bg-gradient-to-r from-[#C62C2C] to-[#FF8C01] p-1 rounded-lg">Our Mission:</p>
      </div>

      {/* Mission Statement */}
      <div className="relative w-1/2 mx-auto text-center top-1/16">
        <div className="text-white p-10 m-4 rounded-lg" style={{ backgroundColor: "#333333" }}>
          LampPost's goal at LampPost is simple: Make the world a safer place. We strive to provide the most accurate and up-to-date crime information for citizens to utilize. No one else does it quite like us, as we provide you as a user, an interactive heat map of recent criminal activity. Not to mention an efficient self-reporting section for the fastest live updates. Check out our stats page for an in-depth summary on various crimes, areas, or even statewide stats.
        </div>
      </div>

      {/* Pa Flag with american stripes */}
      <div 
        className="relative mx-auto left-1/5" 
        style={{ 
          backgroundImage: `url(${paFlag})`, 
          backgroundSize: 'contain', 
          backgroundPosition: 'center', 
          width: '60%', 
          height: '200px', 
          borderRadius: '10px',
          backgroundRepeat: 'no-repeat',
          top: '50px',
          left: '-150px' 
        }}>
        
      </div>

      {/* LampPost Logo picture */}
      <div 
        className="relative mx-auto right-1/5" 
        style={{ 
          backgroundImage: `url(${streetLt2})`, 
          backgroundSize: 'contain', 
          backgroundPosition: 'center', 
          width: '60%', 
          height: '150px',          
          backgroundRepeat: 'no-repeat',          
          bottom: '135px',
          left:'150px'           
        }}>
          <div className="h-40 relative" style={{
            bottom: '-300px'
          }}>
            <p className="text-white p-10 m-4 rounded-lg" style={{ backgroundColor: "#333333" }}>Text for testing only</p>
          </div>
        
      </div>      
      </div>
    </div>     
    
  );
};

export default Home;
