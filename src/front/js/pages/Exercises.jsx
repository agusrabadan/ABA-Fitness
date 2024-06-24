import React, { useState, useEffect } from 'react';
import "../../styles/exercises.css";

export const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const exercisesPerPage = 9;

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('https://exercisedb.p.rapidapi.com/exercises?limit=2000&offset=0', {
          method: 'GET',
          headers: {
            'x-rapidapi-key': 'b81b9ed226mshd87412341f3634ap143e3bjsnad7f3f6ce509',
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
          }
        });
        const data = await response.json();
        setExercises(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the exercises:', error);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filtrar ejercicios por término de búsqueda
  const filteredExercises = exercises.filter(exercise => {
    return exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           exercise.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
           exercise.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
           exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Obtener los ejercicios de la página actual
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);

  // Cambiar la página
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Calcular el número total de páginas
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredExercises.length / exercisesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mt-4">
      <h2>Exercises</h2>
      <form className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </form>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            {currentExercises.map((exercise) => (
              <div key={exercise.id} className="col-12 col-md-6 col-lg-4 mb-4">
                <ExerciseCard exercise={exercise} />
              </div>
            ))}
          </div>
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              {pageNumbers.map((number) => (
                <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

const ExerciseCard = ({ exercise }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`exercise-card ${isFlipped ? 'flipped' : ''}`}>
      <div className="card front">
        <img className="card-img-top" src={exercise.gifUrl} alt={exercise.name} />
        <div className="card-body">
          <h5 className="card-title">{exercise.name}</h5>
          <p className="card-text"><strong>Body Part:</strong> {exercise.bodyPart}</p>
          <p className="card-text"><strong>Target:</strong> {exercise.target}</p>
          <p className="card-text"><strong>Equipment:</strong> {exercise.equipment}</p>
          <button className="btn btn-primary" onClick={handleFlip}>Details</button>
        </div>
      </div>

      <div className="card back">
        <div className="card-body">
          <h5 className="card-title">Instructions</h5>
          <ul>
            {exercise.instructions && exercise.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
          <button className="btn btn-secondary" onClick={handleFlip}>Back</button>
        </div>
      </div>
    </div>
  );
};


