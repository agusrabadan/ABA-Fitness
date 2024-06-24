import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";

export const Workouts = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false); // Estado para mostrar/ocultar el dropdown
    const [selectedBodyPart, setSelectedBodyPart] = useState(""); // Estado para la parte del cuerpo seleccionada
    const [selectedEquipment, setSelectedEquipment] = useState(""); // Estado para el equipo seleccionado
    const [selectedReps, setSelectedReps] = useState(""); // Estado para el número de repeticiones
    const [selectedSets, setSelectedSets] = useState(""); // Estado para el número de series
    const [exercises, setExercises] = useState([]); // Estado para almacenar la lista de ejercicios desde la API
    const [filteredExercises, setFilteredExercises] = useState([]); // Estado para los ejercicios filtrados
    const [selectedExercise, setSelectedExercise] = useState(null); // Estado para el ejercicio seleccionado

    // URL de la API y opciones de cabecera
    const url = 'https://exercisedb.p.rapidapi.com/exercises?limit=3000&offset=0';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'f335c9d4a1mshf5aa931e8c58f0ep101b9djsn062339dbf8b5',
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
    };

    // Llamada a la API cuando el componente se monta
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await fetch(url, options);
                const data = await response.json(); // Parsear la respuesta a JSON
                setExercises(data); // Guardar los datos en el estado
            } catch (error) {
                console.error("Error al obtener los ejercicios de la API:", error);
            }
        };

        fetchExercises();
    }, []); // [] asegura que esto se ejecute solo una vez, cuando el componente se monta

    useEffect(() => {
        if (!store.isLogin) {
            navigate('/home');
        }
    }, [store.isLogin, navigate]);

    const handleAddExerciseClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleBodyPartChange = (event) => {
        setSelectedBodyPart(event.target.value);
        setSelectedExercise(null); // Limpiar el ejercicio seleccionado al cambiar la parte del cuerpo
    };

    const handleEquipmentChange = (event) => {
        setSelectedEquipment(event.target.value);
        setSelectedExercise(null); // Limpiar el ejercicio seleccionado al cambiar el equipo
    };

    const handleRepsChange = (event) => {
        setSelectedReps(event.target.value);
    };

    const handleSetsChange = (event) => {
        setSelectedSets(event.target.value);
    };

    const handleAddExercise = () => {
        // Lógica para añadir el ejercicio a la rutina
        console.log(`Añadiendo ejercicio para ${selectedBodyPart} usando ${selectedEquipment}, ${selectedReps} repeticiones, ${selectedSets} series`);
        // Por ejemplo, podrías actualizar el estado o hacer alguna otra acción

        // Resetear las selecciones y ocultar el dropdown después de añadir
        setSelectedBodyPart("");
        setSelectedEquipment("");
        setSelectedReps("");
        setSelectedSets("");
        setShowDropdown(false);
    };

    // Filtrar ejercicios basados en la parte del cuerpo y el equipo seleccionados
    useEffect(() => {
        if (selectedBodyPart && selectedEquipment) {
            const filtered = exercises.filter(exercise =>
                exercise.bodyPart === selectedBodyPart && exercise.equipment === selectedEquipment
            );
            setFilteredExercises(filtered);
        } else {
            setFilteredExercises([]);
        }
    }, [selectedBodyPart, selectedEquipment, exercises]); // Dependencias actualizadas para incluir 'exercises'

    // Obtener las opciones únicas de body part y equipment disponibles en los ejercicios
    const bodyPartOptions = Array.from(new Set(exercises.map(exercise => exercise.bodyPart)));
    const equipmentOptions = Array.from(new Set(exercises.map(exercise => exercise.equipment)));

    // Función para seleccionar un ejercicio y mostrar su gif
    const selectExercise = (exercise) => {
        setSelectedExercise(exercise);
    };

    return (
        <div className="container">
            {store.isLogin ? (
                <div className="container">
                    <h2 className="text-white text-start mt-5">Mis workouts!</h2>
                    <div className="card text-center bg-dark text-white">
                        <div className="card-header justify-content-around d-flex">
                            <h2>Rutina 1</h2>
                            <h5 className="mt-2">Total ejercicios: </h5>
                            <h5 className="mt-2">Total calorias: </h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex align-start">
                                {/* Aquí puedes añadir contenido relacionado con los ejercicios */}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p
                                    className="card-text mx-3 mt-2 cursor-pointer"
                                    onClick={handleAddExerciseClick}
                                >
                                    + Añadir ejercicio
                                </p>
                                <button className="btn btn-success">Guardar rutina</button>
                            </div>
                            {showDropdown && (
                                <div className="d-flex mt-3">
                                    <div className="d-flex flex-column p-4 bg-dark border border-secondary">
                                        <h5 className="text-white mb-3">Añadir Ejercicio</h5>
                                        <div className="form-group mb-3">
                                            <label htmlFor="bodyPart" className="text-white">Target Body Part</label>
                                            <select
                                                id="bodyPart"
                                                className="form-control"
                                                value={selectedBodyPart}
                                                onChange={handleBodyPartChange}
                                            >
                                                <option value="">Select body part</option>
                                                {bodyPartOptions.map((bodyPart, index) => (
                                                    <option key={index} value={bodyPart}>{bodyPart}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="equipment" className="text-white">Equipment</label>
                                            <select
                                                id="equipment"
                                                className="form-control"
                                                value={selectedEquipment}
                                                onChange={handleEquipmentChange}
                                            >
                                                <option value="">Select equipment</option>
                                                {equipmentOptions.map((equipment, index) => (
                                                    <option key={index} value={equipment}>{equipment}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="reps" className="text-white">Number of Reps</label>
                                            <select
                                                id="reps"
                                                className="form-control"
                                                value={selectedReps}
                                                onChange={handleRepsChange}
                                            >
                                                <option value="">Select number of reps</option>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="12">12</option>
                                                <option value="15">15</option>
                                                <option value="20">20</option>
                                            </select>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="sets" className="text-white">Number of Sets</label>
                                            <select
                                                id="sets"
                                                className="form-control"
                                                value={selectedSets}
                                                onChange={handleSetsChange}
                                            >
                                                <option value="">Select number of sets</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                        </div>
                                        <button
                                            className="btn btn-outline-success mt-3"
                                            onClick={handleAddExercise}
                                        >
                                            Add Exercise
                                        </button>
                                    </div>
                                    <div className="ml-4" style={{ width: '50%' }}>  {/* Ajustar el ancho de la lista de ejercicios */}
                                        <h6 className="text-white mx-5">Ejercicios disponibles: presiona para ver la animación </h6>
                                        <ul className="list-group mx-5">
                                            {filteredExercises.map((exercise, index) => (
                                                <li key={index} className="list-group-item bg-dark text-white cursor-pointer"
                                                    onClick={() => selectExercise(exercise)}>
                                                    {exercise.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {selectedExercise && (
                                        <div className="mx-5 d-flex align-items-center">
                                            <img
                                                src={selectedExercise.gifUrl}
                                                alt={selectedExercise.name}
                                                style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>No tienes acceso</h1>
                </div>
            )}
        </div>
    );
};
