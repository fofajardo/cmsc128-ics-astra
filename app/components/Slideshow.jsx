import React from "react";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";



function Slideshow(){
  const heroImages =
    ["/showcase1.jpg",
      "/showcase2.jpg",
      "/showcase3.jpg"
    ];

  const delay = 5000;

  const [index,setIndex] = React.useState(0);

  React.useEffect(() => {
    setTimeout(
      () =>
        setIndex ((prevIndex) =>
          prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {};
  }, [index]);

  const FadeProperties = {
    duration: 4000,
    transitionDuration: 800,
    infinity: true,
    arrows: false
  };

  return (
    <div className = 'w-full h-screen' style = {{transform: `translated3d (${-index * 100}%,0,0)`}}>
      <Fade {...FadeProperties}>
        {heroImages.map((image, index) => (
          <div key = {index}>
            <div style = {{  display: "flex", alignItems: "center",
              justifyContent: "cener", backgroundSize: "cover",
              height: "100vh", backgroundImage: `url(${image})`}}>

              <div style = {{width: "100%", position: "absolute" ,
                bottom: 0, left: 0, paddingBottom:"50px", paddingLeft: "50px",
                paddingTop: "30px",
                background:"linear-gradient(transparent,rgba(14, 108, 243, 0.35))"}}>

                <div className = "app-title">
                  <div className="float-left">
                    <h1 className ="text-astrawhite" style = {{fontSize: "130px", fontWeight: "bold"}}>ICS-</h1>
                  </div>
                  <div className="float-left">
                    <h1 className ="text-astraprimary" style = {{fontSize: "130px", fontWeight: "bold"}}>ASTRA</h1>
                  </div>
                </div>
                <h2 className ="text-astrawhite" style = {{fontSize: "40px", fontStyle:"Italic", position: "absolute", bottom: 25}}>Connecting the Stars</h2>
              </div>
            </div>
          </div>
        ))}
      </Fade>
    </div>
  );
}

export default Slideshow;