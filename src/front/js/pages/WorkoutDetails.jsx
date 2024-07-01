import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const WorkoutDetails = () => {
    const { id } = useParams(); // Obtener el id del parámetro de la URL
    const [workout, setWorkout] = useState(null); // Inicializar como null para manejar la carga
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkoutDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found in localStorage.');
                }

                const response = await fetch(`${process.env.BACKEND_URL}/api/workoutdetails/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setWorkout(data.results); // Asignar directamente data.results según la estructura de la respuesta
                setLoading(false);
            } catch (error) {
                console.error('Error fetching workout details:', error.message);
                setLoading(false);
            }
        };

        fetchWorkoutDetails();
    }, [id]); // Dependencia id para que se actualice cuando cambia

    if (loading) return <div>Loading...</div>;

    // Verificar si workout es null antes de acceder a sus propiedades
    if (!workout) {
        return <div>No workout found.</div>;
    }

    return (
        <div className="container">
            <h1 className="text-white">{workout.name}</h1>
            <p className="text-white">Duration: {formatDuration(workout.duration)}</p>
            <h2 className="text-white">Exercises</h2>
            <ul>
                {workout.exercises && workout.exercises.map(exercise => (
                    <li key={exercise.id}>
                        <h4 className="text-white">{exercise.name}</h4>
                        <p className="text-white">Reps: {exercise.reps_num}</p>
                        <p className="text-white">Sets: {exercise.series_num}</p>
                        <p className="text-white">Rest: {exercise.rest_seconds} sec</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Helper function to format the duration
function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec`;
}
