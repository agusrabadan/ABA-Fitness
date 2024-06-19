import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";

export const Login = () => {
  const { actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Para almacenar el mensaje de error
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = { email, password };
    const url = `${process.env.BACKEND_URL}/api/login`;
    const options = {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          // Si las credenciales son incorrectas o el usuario no existe
          setErrorMessage("Usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.");
        } else {
          // Para otros errores
          setErrorMessage("Ocurrió un error. Por favor, inténtelo de nuevo más tarde.");
        }
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      actions.setIsLogin(true);
      actions.setCurrentUser(data.results);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error de fetch:', error);
      setErrorMessage("Ocurrió un error. Por favor, inténtelo de nuevo más tarde.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-3 display-5">
                Login
              </h2>
              {errorMessage && (
                <div className="alert alert-danger text-center" role="alert">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group mt-3 h6">
                  <label htmlFor="email" className="mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <div className="form-group mt-3 h6">
                  <label htmlFor="password" className="mb-1">
                    Contraseña:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-success mt-5">
                    Acceder
                  </button>
                  <Link to="/signup">
                    <p className="text-center mt-2">Todavía no te has registrado? Hazlo aquí!</p>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
