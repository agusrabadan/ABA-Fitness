import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";

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
          <h2 className="mb-4">Perfil de Usuario</h2>
          <div className="card">
            <div className="card-body">
              <img src={store.user.profile_picture} className="rounded mx-auto d-block h-25 w-25" alt="..." />
              <p className="text-success"><strong>Nombre:</strong> {store.user.first_name}</p>
              <p className="text-success"><strong>Apellido:</strong> {store.user.last_name}</p>
              <p className="text-success"><strong>Email:</strong> {store.user.email}</p>
              <p className="text-success"><strong>Género:</strong> {store.user.gender}</p>
              <p className="text-success"><strong>Peso:</strong> {store.user.weight} kg</p>
              <p className="text-success"><strong>Altura:</strong> {store.user.height} cm</p>
              <p className="text-success"><strong>Fecha de nacimiento:</strong> {formatDate(store.user.birth_date)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            La sesión ha expirado
          </div>
          <Link to="/login">
            <button className="btn btn-success">Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};
