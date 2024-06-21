import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";
import "../../styles/profile.css";

export const Profile = () => {
  const { store } = useContext(Context);

  // Formatear la fecha de nacimiento de ISO a un formato más legible
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mt-5">
      {store.isLogin ? (
        <div>
          <h2 className="mb-4 text-white">Perfil de Usuario</h2>
          <div className="card bg-dark text-white">
            <div className="card-body">
              <img src={store.user.profile_picture} className="rounded mx-auto d-block h-25 w-25 mb-3" alt="Foto de perfil" />
              <p><strong>Nombre:</strong> {store.user.first_name}</p>
              <p><strong>Apellido:</strong> {store.user.last_name}</p>
              <p><strong>Email:</strong> {store.user.email}</p>
              <p><strong>Género:</strong> {store.user.gender}</p>
              <p><strong>Peso:</strong> {store.user.weight} kg</p>
              <p><strong>Altura:</strong> {store.user.height} cm</p>
              <p><strong>Fecha de nacimiento:</strong> {formatDate(store.user.birth_date)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="container text-center">
          <div className="alert alert-secondary col-6 d-flex justify-content-center mx-auto" role="alert">
            La sesión ha expirado
          </div>
          <Link to="/login">
            <button className="btn btn-outline-light">Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};


