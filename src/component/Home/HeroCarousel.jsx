import { useState, useEffect } from 'react';


const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3',
      title: 'Your Health Matters',
      description: 'Get vaccinated and stay protected',
      cta: 'Book Appointment'
    },
    {
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3',
      title: 'Professional Care',
      description: 'Our certified doctors are ready to help',
      cta: 'Meet Our Team'
    },
    {
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3',
      title: 'Vaccine Campaigns',
      description: 'Free vaccination programs available',
      cta: 'Learn More'
    },

  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '70vh', overflow: 'hidden' }}>
      <div 
        style={{ 
          display: 'flex',
          height: '100%',
          transition: 'transform 0.5s ease-in-out',
          transform: `translateX(-${currentSlide * 100}%)`
        }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index}
            style={{ 
              width: '100%',
              flexShrink: 0,
              height: '100%',
              position: 'relative'
            }}
          >
            <div 
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
              }}></div>
            </div>
            
            <div style={{ 
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              padding: '0 1rem',
              textAlign: 'center'
            }}>
              <h1 style={{ 
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>
                {slide.title}
              </h1>
              <p style={{ 
                fontSize: '1.25rem',
                marginBottom: '2rem',
                maxWidth: '36rem'
              }}>
                {slide.description}
              </p>
              <button style={{ 
                backgroundColor: '#f59e0b',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem 2rem',
                borderRadius: '9999px',
                fontSize: '1.125rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}>
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        position: 'absolute',
        bottom: '2rem',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{ 
              width: currentSlide === index ? '1.5rem' : '0.75rem',
              height: '0.75rem',
              borderRadius: '9999px',
              backgroundColor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      <button 
        onClick={goToPrev}
        style={{ 
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '9999px',
          padding: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={goToNext}
        style={{ 
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '9999px',
          padding: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroCarousel;