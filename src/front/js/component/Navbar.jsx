import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
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
        <nav className="navbar navbar-expand-lg text-white shadow-sm border-bottom">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img src={logo} alt="Logo" width="80" height="80" className="d-inline-block align-text-top rounded-circle mx-2" />
                    <h1 className="ms-2 text-info ml-2">ABA Fitness</h1>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    {store.isLogin && (
                        <ul className="navbar-nav mx-auto d-flex justify-content-center align-items-center">
                            <li className="nav-item mx-3">
                                <Link to="/exercises" className="btn btn-outline-light rounded-pill text-orange border-orange">Exercises</Link>
                            </li>
                            <li className="nav-item mx-3 text-white">
                                <Link to="/workouts" className="btn btn-outline-light rounded-pill text-orange border-orange">Workouts</Link>
                            </li>
                            <li className="nav-item mx-3">
                                <Link to="/favorites" className="btn btn-outline-light rounded-pill text-orange border-orange">Favorites</Link>
                            </li>
                            <li className="nav-item mx-3">
                                <Link to="/activity-log" className="btn btn-outline-light rounded-pill text-orange border-orange">Activity Log</Link>
                            </li>
                        </ul>
                    )}
                    <ul className="navbar-nav ms-auto d-flex align-items-center">
                        {store.isLogin ? (
                            <li className="nav-item">
                                <button className="btn btn-outline-light rounded-pill text-info border-info font-weight-bold fs-5 dropdown-toggle mx-3" type="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
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
                                        <button className="btn btn-outline-light rounded-pill text-orange border-orange font-weight-bold fs-5">
                                            Login
                                        </button>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/signup" className="nav-link">
                                        <button className="btn btn-outline-light rounded-pill text-orange border-orange font-weight-bold fs-5">
                                            Register
                                        </button>
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
