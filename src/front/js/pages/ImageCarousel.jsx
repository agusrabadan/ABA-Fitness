import React, { useState, useEffect } from "react";

const ImageCarousel = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Simulación de carga de imágenes desde la carpeta '/img/myh'
    const importAll = (r) => r.keys().map(r);
    const imageFiles = importAll(require.context("../../img/myh", false, /\.(png|jpe?g|svg)$/));

    // Mapea las imágenes importadas a una estructura con URL y un ID único basado en el índice
    const mappedImages = imageFiles.map((image, index) => ({
      id: `image_${index}`, // Genera un ID único para cada imagen
      url: image.default, // URL de la imagen
    }));

    setImages(mappedImages); // Establece las imágenes en el estado
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        // Genera un índice aleatorio diferente al actual
        const newIndex = Math.floor(Math.random() * images.length);
        setImageIndex(newIndex);
      }, 7000); // Cambia cada 7 segundos (ajusta el intervalo según tus preferencias)

      return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }
  }, [images]);

  return (
    <div id="imageCarousel" className="carousel slide mb-2 mx-auto" data-bs-ride="carousel">
    <div className="carousel-inner">
      {images.map((image, index) => (
        <div key={image.id} className={index === imageIndex ? "carousel-item active" : "carousel-item"}>
          <img 
            src={image.url} 
            className="d-block mx-auto" 
            style={{ width: "600px", height: "400px", borderRadius: "30px", border: "3px solid orange" }}
            alt={`Image ${index}`} 
          />
        </div>
      ))}
    </div>
  </div>
  );
};

export default ImageCarousel;
