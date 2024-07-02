import React, { useState, useEffect } from "react";

const MotivationCarousel = () => {
  const [motivationIndex, setMotivationIndex] = useState(0);
  const [motivations, setMotivations] = useState([
    "'' It's not about having time, it's about making time ''",
    "'' Your only limit is your mind ''",
    "'' The gym is my therapy, iron is my medicine ''",
    "'' Greatness is not achieved when everything is easy, but when you face challenges that make you stronger ''",
    "'' Discipline is the key to achieving your fitness goals ''",
    "'' Don't compare yourself to anyone but the person you were yesterday ''",
    "'' Pain is temporary, glory is forever ''",
    "'' Consistency is the key to progress in fitness ''",
    "'' The body achieves what the mind believes ''",
    "'' Every drop of sweat brings you closer to your goal ''",
    "'' Your body can withstand almost anything. It's your mind you need to convince ''",
    "'' It's not about being perfect. It's about being better than yesterday ''",
    "'' Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't ''",
    "'' Limits exist only if you allow them to ''",
    "'' The pain you feel today will be the strength you feel tomorrow ''",
    "'' The difference between impossible and possible lies in a person's determination ''",
    "'' The key is to start, no matter how small the first step ''",
    "'' Don't wait for the perfect moment; take the moment and make it perfect ''",
    "'' Motivation is what gets you started, habit is what keeps you going ''",
    "'' Life begins at the end of your comfort zone ''"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Genera un índice aleatorio diferente al actual
      const newIndex = Math.floor(Math.random() * motivations.length);
      setMotivationIndex(newIndex);
    }, 7000); // Cambia cada 7 segundos 

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, [motivations.length]);

  return (
    <div id="motivationCarousel" className="carousel slide mb-2" data-bs-ride="carousel">
      <div className="carousel-inner">
        {motivations.map((motivation, index) => (
          <div key={index} className={index === motivationIndex ? "carousel-item active" : "carousel-item"}>
            <h2 className="text-white text-center" style={{ fontFamily:"'Arial', sans-serif"}}>{motivation}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MotivationCarousel;