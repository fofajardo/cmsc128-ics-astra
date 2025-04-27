import { InView } from 'react-intersection-observer';
import { useState } from 'react';

const TransitionGrow = ({
  children,
  className = '',
  threshold = 0,
  delay = 0.1,
  navbarHeight = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InView
      as="div"
      onChange={(inView) => {
        setIsVisible(inView);
      }}
      threshold={threshold}
      rootMargin={`-${navbarHeight}px 0px 0px 0px`}
    >
      {({ ref }) => (
        <div
          ref={ref}
          className={`
            size-full
            transition-all
            duration-500
            ease-in-out
            ${className}
            ${
              isVisible
                ? 'opacity-100 translate-y-0'   // Fade in and move to normal position
                : 'opacity-0 -translate-y-5'    // Fade out and move up when hiding
            }
          `}
          style={{
            transitionDelay: `${delay}s`,
            position: 'relative',
            transformOrigin: 'bottom', // Ensures upward movement feels natural
          }}
        >
          {children}
        </div>
      )}
    </InView>
  );
};

export default TransitionGrow;