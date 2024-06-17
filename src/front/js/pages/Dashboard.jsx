import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";


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
                <div className="text-center">
                    <h1>ESTAS LOGUEADO, PAGINA RESTRINGIDA SOLO PARA USUARIOS</h1>
                    <div className="spinner-grow text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-grow text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-grow text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-grow text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-grow text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-grow text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-grow text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-grow text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                :
                <div>
                    <h1>No tienes acceso</h1>
                </div>

            }
        </div>
    )
}