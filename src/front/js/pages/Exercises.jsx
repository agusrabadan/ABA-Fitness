import React, { useState, useEffect, useContext } from 'react'; // Añadido useContext
import { Container, Row, Col, Card, Button, Pagination, Spinner, Form } from 'react-bootstrap'; // Reemplazado el form por el de react-bootstrap
import { Context } from "../store/appContext"; // Añadido Context
import "../../styles/exercises.css";

export const Exercises = () => {
  const { store, actions } = useContext(Context); // Añadido para usar store y actions
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
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  // Limitar el número de páginas mostradas en la paginación
  const maxPageNumbersToShow = 20; // Cambiado límite para el número de páginas a mostrar a 20
  const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxPageNumbersToShow / 2), totalPages - maxPageNumbersToShow + 1));
  const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);
  const displayedPageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    displayedPageNumbers.push(i);
  }

  return (
    <Container className="mt-4">
      <h2>Exercises</h2>
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </Form>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Row>
            {currentExercises.map((exercise) => (
              <Col key={exercise.id} xs={12} md={6} lg={4} className="mb-4">
                <ExerciseCard exercise={exercise} isFavorite={store.favorites.some(fav => fav.id === exercise.id)} actions={actions} /> {/* Pasamos actions y isFavorite a ExerciseCard */}
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center mt-4">
            <div style={{ overflowX: 'auto' }}> {/* Añadido contenedor con scroll horizontal */}
              <Pagination>
                {currentPage > 1 && (
                  <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} /> // Botón para página anterior
                )}
                {startPage > 1 && (
                  <>
                    <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                    <Pagination.Ellipsis disabled /> {/* Ellipsis para indicar que hay más páginas */}
                  </>
                )}
                {displayedPageNumbers.map(number => (
                  <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </Pagination.Item>
                ))}
                {endPage < totalPages && (
                  <>
                    <Pagination.Ellipsis disabled /> {/* Ellipsis para indicar que hay más páginas */}
                    <Pagination.Item onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>
                  </>
                )}
                {currentPage < totalPages && (
                  <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} /> // Botón para página siguiente
                )}
              </Pagination>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

const ExerciseCard = ({ exercise, isFavorite, actions }) => { // Añadimos isFavorite y actions como props
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`exercise-card ${isFlipped ? 'flipped' : ''}`}>
      <Card className="front">
      <Card.Title className="text-center mt-3 fw-bold">{exercise.name}</Card.Title>
        <Card.Body>
        <Card.Img variant="top" src={exercise.gifUrl} alt={exercise.name} />
          <Card.Text><strong>Body Part:</strong> {exercise.bodyPart}</Card.Text>
          <Card.Text><strong>Target:</strong> {exercise.target}</Card.Text>
          <Card.Text><strong>Equipment:</strong> {exercise.equipment}</Card.Text>
          <Button variant="primary" onClick={handleFlip}>Details</Button>
          {isFavorite ? (
            <Button variant="danger" className="ml-2 float-end" onClick={() => actions.removeFavorite(exercise.id)}> {/* Botón para eliminar de favoritos */}
              Delete
            </Button>
          ) : (
            <Button variant="success" className="ml-2 float-end" onClick={() => actions.addFavorite(exercise)}> {/* Botón para añadir a favoritos */}
              Add
            </Button>
          )}
        </Card.Body>
      </Card>

      <Card className="back">
        <Card.Body>
          <Card.Title>Instructions</Card.Title>
          <ul>
            {exercise.instructions && exercise.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
          <Button variant="secondary" onClick={handleFlip}>Back</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

