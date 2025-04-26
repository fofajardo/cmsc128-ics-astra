import { InView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

const TransitionGrow = ({
  children,
  className = '',
  threshold = 0.10,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastY, setLastY] = useState(0);

  // Track scroll direction more reliably
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollDirection(currentY > lastY ? 'down' : 'up');
      setLastY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastY]);

  return (
    <InView
      as="div"
      onChange={(inView, entry) => {
        setIsVisible(inView);
        // Only update scroll direction when element is out of view
        if (!inView) {
          setScrollDirection(entry.boundingClientRect.y > 0 ? 'up' : 'down');
        }
      }}
      threshold={scrollDirection === 'up' ? 0 : threshold}
      className={`
        size-full
        transition-[opacity,transform]
        duration-250
        ease-out
        ${className}
        ${isVisible
          ? 'opacity-100 blur-none translate-y-0'
          : scrollDirection === 'up'
          ? 'opacity-0 blur-sm -translate-y-12'
          : 'opacity-0 blur-sm translate-y-12'
        }
      `}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </InView>
  );
};

export default TransitionGrow;