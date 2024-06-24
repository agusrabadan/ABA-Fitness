import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ChicaPesas from "../../img/ChicaPesas.webp";

export const Dashboard = () => {
    const { store } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        if (!store.isLogin) {
            navigate('/')
        }
    }, [])



    return (
        <div className="container">
            {store.isLogin ?
                <div className="container">
                    <h2 className="text-white text-start mt-5">Hi {store.user.first_name}!</h2>
                    <Link to="/workouts"><button type="button" className="btn btn-outline-light  mt-3 rounded-pill">Crea tu rutina aquí</button></Link>
                    
                </div>
                :
                <div>
                    <h1>You dont have access</h1>
                </div>

            }
        </div>
    )
}