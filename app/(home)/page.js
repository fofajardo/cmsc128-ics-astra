export default function Page() {
    const backgroundImage = '/uplb.png'; 
    const title = ''; 
  
    return (
      <div
        className="landing-page"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="landing-container">
          <h1 className="landing-title">{title}</h1>
        </div>
      </div>
    );
  }
  