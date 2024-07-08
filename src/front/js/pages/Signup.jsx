import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Signup = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);  // Estado para controlar la visibilidad de la contraseña
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [gender, setGender] = useState("");  // Valor predeterminado
    const [birthDate, setBirthDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");  // Para almacenar el mensaje de error
    const navigate = useNavigate();
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleFirstNameChange = (event) => setFirstName(event.target.value);
    const handleLastNameChange = (event) => setLastName(event.target.value);
    const handleWeight = (event) => setWeight(event.target.value);
    const handleHeight = (event) => setHeight(event.target.value);
    const handleGender = (event) => setGender(event.target.value);
    const handleBirthDate = (event) => setBirthDate(event.target.value);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = {
            email,
            password,
            // Solo incluir los valores adicionales si están presentes
            first_name: firstName || undefined,
            last_name: lastName || undefined,
            weight: weight || undefined,
            height: height || undefined,
            gender: gender || undefined,
            birth_date: birthDate || undefined
        };
        const url = `${process.env.BACKEND_URL}/api/signup`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        };
        try {
            const response = await fetch(url, options);
            if (response.status === 409) {
                setErrorMessage("El usuario ya existe");
            } else if (!response.ok) {
                console.log('Error:', response.status, response.statusText);
                setErrorMessage("Ha ocurrido un error, intentalo de nuevo.");
            } else {
                const data = await response.json();
                // Asegúrate de que todos los datos necesarios están en la respuesta
                localStorage.setItem('token', data.access_token);
                actions.setIsLogin(true);
                actions.setCurrentUser(data.results);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card text-white" style={{ backgroundColor: "rgba(1, 6, 16, 0.000)" }}>
                        <div className="card-body">
                            <h2 className="card-title text-center mb-3 display-5">Register</h2>
                            {errorMessage && <div className="alert alert-secondary" role="alert">{errorMessage}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mt-3 h6">
                                    <label htmlFor="email" className="mb-1">Email:</label>
                                    <input type="email" className="form-control" id="email"
                                        value={email} onChange={handleEmailChange} required />
                                </div>
                                <div className="form-group mt-3 h6 position-relative">
                                    <label htmlFor="password" className="mb-1">
                                        Password:
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}  // Cambiar tipo basado en showPassword
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <span
                                        onClick={togglePasswordVisibility}
                                        className="password-toggle-icon text-dark"
                                        style={{
                                            position: "absolute",
                                            right: "20px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {showPassword ? (
                                            <i className="fas fa-eye mt-4"></i>
                                        ) : (
                                            <i className="fas fa-eye-slash mt-4"></i>
                                        )}
                                    </span>
                                </div>
                                <div className="form-group mt-3 h6">
                                    <label htmlFor="firstName" className="mb-1">Name:</label>
                                    <input type="text" className="form-control" id="firstName"
                                        value={firstName} onChange={handleFirstNameChange} />
                                </div>
                                <div className="form-group mt-3 h6">
                                    <label htmlFor="lastName" className="mb-1">Last Name:</label>
                                    <input type="text" className="form-control" id="lastName"
                                        value={lastName} onChange={handleLastNameChange} />
                                </div>
                                <div className="form-group mt-3 h6">
                                    <label htmlFor="weight" className="mb-1">Weight(kg):</label>
                                    <input type="text" className="form-control" id="weight"
                                        value={weight} onChange={handleWeight} />
                                </div>
                                <div className="form-group mt-3 h6">
                                    <label htmlFor="height" className="mb-1">Height(cm):</label>
                                    <input type="text" className="form-control" id="height"
                                        value={height} onChange={handleHeight} />
                                </div>
                                <div className="form-group mt-3 h6">
                                    <label htmlFor="gender" className="mb-1">Gender:</label>
                                    <select className="form-control" id="gender"
                                        value={gender} onChange={handleGender} >
                                        <option value="">Select Gender</option> {/* Opción predeterminada vacía */}
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Not defined">Others</option>
                                    </select>
                                </div>
                                <div className="form-group mt-3 h6">
                                    <label htmlFor="birthDate" className="mb-1">Birth Date:</label>
                                    <input type="date" className="form-control" id="birthDate"
                                        value={birthDate} onChange={handleBirthDate} />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-outline-light ms-2 mt-4">Create Account</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};