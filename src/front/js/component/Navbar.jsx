import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/navbar.css";
import logo from "../../img/Logo1.webp";

export const Navbar = () => {
    const { store, actions } = useContext(Context);

    const logout = () => {
        console.log('estoy en logout');
        actions.setIsLogin(false);
        localStorage.removeItem('token');
    };

    const profile = () => {
        actions.profile();
    };

    return (
        <nav className="navbar navbar-expand-lg text-white shadow-sm bg-dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img src={logo} alt="Logo" width="60" height="60" className="d-inline-block align-text-top rounded-circle mx-2" />
                    <h2 className="ms-2 text-white ml-2">ABA Fitness</h2>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    {store.isLogin && (
                        <ul className="navbar-nav mx-auto d-flex justify-content-center align-items-center">
                            <li className="nav-item mx-3">
                                <Link to="/exercises" className="text-white">Exercises</Link>
                            </li>
                            <li className="nav-item mx-3 text-white">
                                <Link to="/workouts" className="text-white">Workouts</Link>
                            </li>
                            <li className="nav-item mx-3">
                                <Link to="/favorites" className="text-white">Favorites</Link>
                            </li>
                            <li className="nav-item mx-3">
                                Activity Log
                            </li>
                        </ul>
                    )}
                    <ul className="navbar-nav ms-auto d-flex align-items-center">
                        {store.isLogin ? (
                            <li className="nav-item">
                                <button className="btn btn-outline-light dropdown-toggle" type="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    Welcome, {store.user.first_name}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li><Link to="/profile" className="dropdown-item" onClick={profile}>Profile</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link to="/" className="dropdown-item text-danger" onClick={logout}>Logout</Link></li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">
                                        <button className="btn btn-outline-secondary ms-2">Login</button>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/signup" className="nav-link">
                                        <button className="btn btn-outline-light ms-2">Regístrate</button>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
