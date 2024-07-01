import React, { useState, useEffect, useRef } from 'react';

const Chrono = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [backgroundTime, setBackgroundTime] = useState(0);
  const [isBackgroundRunning, setIsBackgroundRunning] = useState(false);
  const intervalRef = useRef(null);
  const backgroundIntervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 10); // Actualiza cada 10 milisegundos
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (isBackgroundRunning) {
      backgroundIntervalRef.current = setInterval(() => {
        setBackgroundTime((prevTime) => prevTime + 1);
      }, 10); // Actualiza cada 10 milisegundos en segundo plano
    } else {
      clearInterval(backgroundIntervalRef.current);
    }

    return () => clearInterval(backgroundIntervalRef.current);
  }, [isBackgroundRunning]);

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setIsBackgroundRunning(true);
    } else {
      setIsRunning(true);
      setIsBackgroundRunning(false);
      setBackgroundTime(0); // Reinicia el tiempo en segundo plano
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBackgroundRunning(false);
    setTime(0);
    setBackgroundTime(0);
  };

  return (
    <div className='text-white text-center'>
      <h2>Chr<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-stopwatch" viewBox="0 0 16 16">
  <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z"/>
  <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3"/>
</svg>n<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-stopwatch" viewBox="0 0 16 16">
  <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z"/>
  <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3"/>
</svg></h2>
      <div className='d-flex justify-content-center align-items-center'>
        <p className='mb-0'>Active Time:&nbsp; </p>
        {/* Ancho fijo añadido para evitar movimiento */}
        <p className='mr-3 mb-0' style={{ width: '100px' }}>
          {Math.floor(time / 6000)}:{('0' + Math.floor((time / 100) % 60)).slice(-2)}.{('0' + (time % 100)).slice(-2)}
        </p>
        <div className="px-4">
          <button 
            onClick={handleStartStop} 
            className="btn btn-outline-white rounded-pill text-orange border-orange mx-2">
              {isRunning ? 'Stop' : 'Start'}
          </button>
          <button 
            onClick={handleReset} 
            className="btn btn-outline-white rounded-pill text-orange border-orange mx-2">
              Reset
          </button>
        </div>
        <p className='mb-0'>Rest Time:&nbsp; </p>
        {/* Ancho fijo añadido para evitar movimiento */}
        <p className='mb-0' style={{ width: '100px' }}>
          {Math.floor(backgroundTime / 6000)}:{('0' + Math.floor((backgroundTime / 100) % 60)).slice(-2)}.{('0' + (backgroundTime % 100)).slice(-2)}
        </p>
      </div>
    </div>
  );
};

export default Chrono;
