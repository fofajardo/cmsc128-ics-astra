import React from "react";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

function Slideshow() {
  const heroImages = [
    "/showcase1.jpg",
    "/showcase2.jpg",
    "/showcase3.jpg"
  ];

  const delay = 5000;

  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setTimeout(
      () =>
        setIndex((prevIndex) =>
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
    <div className="w-full h-screen" style={{ transform: `translated3d(${-index * 100}%, 0, 0)` }}>
      <Fade {...FadeProperties}>
        {heroImages.map((image, index) => (
          <div key={index}>
            <div
              className="flex items-center justify-center bg-cover bg-center h-screen"
              style={{ backgroundImage: `url(${image})` }}
            >
              <div style = {{width: "100%", position: "absolute" ,
                bottom: 0, left: 0, paddingBottom:"50px", paddingLeft: "50px",
                paddingTop: "30px",
                background:"linear-gradient(transparent,rgba(14, 108, 243, 0.35))"}}>

                <div className="app-title">
                  <div className="float-left pb-10">
                    <h1 className="text-astrawhite text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold">ICS-</h1>
                    <h1 className="text-astraprimary text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold">ASTRA</h1>

                  </div>

                </div>

              </div>
            </div>
          </div>
        ))}
      </Fade>
    </div>
  );
}

export default Slideshow;
