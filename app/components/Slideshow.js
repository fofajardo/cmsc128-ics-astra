import React from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';



function Slideshow(){
    const heroImages = 
    ['/showcase1.jpg',
      '/showcase2.jpg',
      '/showcase3.jpg',
      '/showcase4.jpg'
    ]; 

    const delay = 2000;

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
        duration: 5000,
        transitionDuration: 800,
        infinity: true,
        arrows: false
    }

    return (
        <div className = 'w-full h-screen' style = {{transform: `translated3d (${-index * 100}%,0,0)`}}>
            <Fade {...FadeProperties}>
                {heroImages.map((image, index) => (
                    <div key = {index}> 
                         <div style = {{  display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', backgroundSize: 'cover', 
                            height: '100vh', backgroundImage: `url(${image})`}}>
                        </div>
                    </div>
                ))}
            </Fade>
        </div>
    )
}

export default Slideshow