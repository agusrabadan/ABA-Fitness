import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap"; 
import "../../styles/carousel.css";

const ImageCarousel = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para gestionar la carga

  useEffect(() => {
    // Simulación de carga de imágenes desde la carpeta '/img/myh'
    const importAll = (r) => r.keys().map(r);
    const imageFiles = importAll(require.context("../../img/myh", false, /\.(png|jpe?g|svg)$/));

    // Mapea las imágenes importadas a una estructura con URL y un ID único basado en el índice
    const mappedImages = imageFiles.map((image, index) => ({
      id: `image_${index}`,
      url: image.default,
    }));

    setTimeout(() => {
      setImages(mappedImages);
      setIsLoading(false); 
    }, 2000); 
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
    
        const newIndex = Math.floor(Math.random() * images.length);
        setImageIndex(newIndex);
      }, 7000); 

      return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }
  }, [images]);

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <Spinner animation="border" role="status" variant="info" className="spinner-border">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div id="imageCarousel" className="carousel slide mb-2 mx-auto" data-bs-ride="carousel">
          <div className="carousel-inner">
            {images.map((image, index) => (
              <div key={image.id} className={index === imageIndex ? "carousel-item active" : "carousel-item"}>
                <img 
                  src={image.url} 
                  className="d-block mx-auto"
                  alt={`Image ${index}`} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
