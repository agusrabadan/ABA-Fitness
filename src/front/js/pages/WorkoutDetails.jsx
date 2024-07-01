import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import "../../styles/workoutdetails.css";

export const WorkoutDetails = () => {
    const { id } = useParams();
    const [workoutDetails, setWorkoutDetails] = useState([]);
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
                console.log('Fetched data:', data);
                setWorkoutDetails(data.results); 
                setLoading(false);
            } catch (error) {
                console.error('Error fetching workout details:', error.message);
                setLoading(false);
            }
        };

        fetchWorkoutDetails();
    }, [id]);

    const handleEdit = (exerciseId) => {
        // Manejar la edición del ejercicio
        console.log(`Edit exercise with ID: ${exerciseId}`);
    };

    const handleDelete = async (exerciseId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found in localStorage.');
            }

            const response = await fetch(`${process.env.BACKEND_URL}/api/workoutdetails/${exerciseId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Actualizar la lista de detalles del workout después de eliminar un ejercicio
            setWorkoutDetails(workoutDetails.filter(exercise => exercise.id !== exerciseId));
        } catch (error) {
            console.error('Error deleting exercise:', error.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    if (workoutDetails.length === 0) {
        return <div>No workout details found.</div>;
    }

    return (
        <div className="container">
            <h1 className="text-white">Workout Details</h1>
            <ul>
                {workoutDetails.map((workout) => (
                    <li key={workout.id} className="workout-detail-item">
                        <div className="exercise-info">
                            <h4 className="text-white">{workout.exercise_name}</h4>
                            <img src={workout.exercise_gif} alt={workout.exercise_name} onError={(e) => {e.target.onerror = null; e.target.src="fallback-image-url"}} />
                            <p className="text-white">Reps: {workout.reps_num}</p>
                            <p className="text-white">Sets: {workout.series_num}</p>
                            <p className="text-white">Rest: {workout.rest_seconds} sec</p>
                        </div>
                        <div className="exercise-actions">
                            <FaEdit onClick={() => handleEdit(workout.id)} className="edit-icon" />
                            <FaTrash onClick={() => handleDelete(workout.id)} className="delete-icon" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
