import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Dashboard = () => {
    const { store } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        if (!store.isLogin) {
            navigate('/home')
        }
    }, [])



    return (
        <div className="container">
            {store.isLogin ?
                <div className="container">
                    <h2 className="text-white text-start mt-5">Hola {store.user.first_name}!</h2>
                    <Link to="/workouts"><button type="button" className="btn btn-secondary text-white btn-lg mt-3 rounded-pill border border-dark border-1">Crea tu rutina aquí</button></Link>
                </div>
                :
                <div>
                    <h1>No tienes acceso</h1>
                </div>

            }
        </div>
    )
}