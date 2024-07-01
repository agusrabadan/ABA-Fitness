import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const WorkoutDetails = () => {
    const { id } = useParams();
    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkoutDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found in localStorage.');
                }

                const response = await fetch(`${process.env.BACKEND_URL}/api/workouts/${id}`, {
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
                setWorkout(data.results);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching workout details:', error.message);
                setLoading(false);
            }
        };

        fetchWorkoutDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>;

    if (!workout) {
        return <div>No workout found.</div>;
    }

    // Si workout tiene la propiedad exercises, úsala; de lo contrario, asume que workout es una lista de ejercicios
    const exercises = workout.exercises ? workout.exercises : Array.isArray(workout) ? workout : [workout];

    return (
        <div className="container">
            <h1 className="text-white">{workout.name || 'Workout Details'}</h1>
            <p className="text-white">Duration: {workout.duration ? formatDuration(workout.duration) : 'N/A'}</p>
            <h2 className="text-white">Exercises</h2>
            <ul>
                {exercises.map(exercise => (
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

function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec`;
}
