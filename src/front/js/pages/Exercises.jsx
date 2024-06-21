import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Pagination, Spinner, Form } from 'react-bootstrap';
import './Exercises.css';

const Exercises = () => {
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
            'x-rapidapi-key': '4153567bccmsh1a02517c622e4f0p15a422jsna4f43fd7b304',
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
                <ExerciseCard exercise={exercise} />
              </Col>
            ))}
          </Row>
          <Pagination className="justify-content-center mt-4">
            {pageNumbers.map((number) => (
              <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </Container>
  );
};

const ExerciseCard = ({ exercise }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`exercise-card ${isFlipped ? 'flipped' : ''}`}>
      <Card className="front">
        <Card.Img variant="top" src={exercise.gifUrl} alt={exercise.name} />
        <Card.Body>
          <Card.Title>{exercise.name}</Card.Title>
          <Card.Text><strong>Body Part:</strong> {exercise.bodyPart}</Card.Text>
          <Card.Text><strong>Target:</strong> {exercise.target}</Card.Text>
          <Card.Text><strong>Equipment:</strong> {exercise.equipment}</Card.Text>
          <Button variant="primary" onClick={handleFlip}>Details</Button>
        </Card.Body>
      </Card>

      <Card className="back">
        <Card.Body>
          <Card.Title>Instrucciones</Card.Title>
          <ul>
            {exercise.instructions && exercise.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
          <Button variant="secondary" onClick={handleFlip}>Volver</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Exercises;
