import BackgroundUI from '../assets/background-ui.png';

const LandingBackground = () => {
  return (
    <div 
      className="h-screen w-full"
      style={{
        backgroundImage: `url(${BackgroundUI})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0
      }}
    >
    </div>
  );
};

export default LandingBackground;
