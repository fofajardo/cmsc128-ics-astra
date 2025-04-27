import { InView } from 'react-intersection-observer';
import { useState } from 'react';

const TransitionGrow = ({
  children,
  className = '',
  threshold = 0,
  delay = 0,
  navbarHeight = 100,
  onClick = () => {},
}) => {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [currentDelay, setCurrentDelay] = useState(delay); 

  return (
    <InView
      as="div"
      onChange={(inView) => {
        if (inView && !hasBeenVisible) {
          setHasBeenVisible(true);
          setTimeout(() => {
            setCurrentDelay(0); 
          }, 1000);
        }
      }}
      threshold={threshold}
      rootMargin={`-${navbarHeight}px 0px 0px 0px`}
    >
      {({ ref }) => (
        <div
          ref={ref}
          onClick={onClick}
          className={`
            size-full
            transition-all
            duration-250
            ease-in-out
            ${className}
            ${hasBeenVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-85'}
          `}
          style={{
            transitionDelay: `${currentDelay}s`,
            position: 'relative',
            transformOrigin: 'bottom',
            willChange: 'opacity, transform',
            animation: hasBeenVisible
              ? 'breathe 5s ease-in-out infinite'
              : 'none',
          }}
        >
          <style>
            {`
              @keyframes breathe {
                0%, 100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.01);
                }
              }
            `}
          </style>
          {children}
        </div>
      )}
    </InView>
  );
};

export default TransitionGrow;
