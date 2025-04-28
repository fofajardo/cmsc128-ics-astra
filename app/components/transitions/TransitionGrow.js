import { InView } from 'react-intersection-observer';
import { useState } from 'react';

const TransitionGrow = ({
  children,
  className = '',
  threshold = 0,
  delay = 0.1,
  navbarHeight = 100,
  onClick = () => {},
}) => {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  return (
    <InView
      as="div"
      onChange={(inView) => {
        if (inView && !hasBeenVisible) {
          setHasBeenVisible(true); // Lock animation after first view
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
            duration-500
            ease-in-out
            ${className}
            ${
              hasBeenVisible
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-85'
            }
          `}
          style={{
            transitionDelay: `${delay}s`,
            position: 'relative',
            transformOrigin: 'bottom',
            willChange: 'opacity, transform',
          }}
        >
          {children}
        </div>
      )}
    </InView>
  );
};

export default TransitionGrow;