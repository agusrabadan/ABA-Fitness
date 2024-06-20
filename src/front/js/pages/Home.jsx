import React from "react";
import "../../styles/home.css";
import SubirImagen from "../component/SubirImagen.jsx";
import tumbada from "../../img/tumbada.jpg";
import { Link } from "react-router-dom";

const textStyle = {
	position: "absolute",
	top: "30%",
	left: "20%",
	transform: "translate(-50%, -50%)",
	color: "white",
	textAlign: "center"
};

export const Home = () => {
	return (
		<div className="position-relative d-flex justify-content-center">
			{/* Contenedor de la imagen */}
			<div className="position-relative">
				{/* Usar la clase img-fluid para ajustar la imagen */}
				<img src={tumbada} alt="Descripción de la imagen" className="img-fluid" />
				{/* Texto superpuesto */}
				<div style={textStyle} >
					<h2>Tu cambio empieza hoy </h2>
					<h2>Unete a ABA Fitness</h2>
					<ul className="mt-5 text-start">
						<li> Únete y accede a más de 1000 ejercicios</li>
						<li> Elíge que grupo muscular quieres ejercitar hoy</li>
						<li> Crea tus propias rutinas diarias y semanales</li>
						<li> Instrucciones 100% animadas</li>
						<li> Distintos niveles de dificultad</li>
						<li> Desde casa o en el gimnasio</li>
					</ul>
					<h2 className="mt-3">No importa tu edad</h2>
					<Link to="/login"><button type="button" className="btn btn-secondary text-white btn-lg mt-3 rounded-pill border border-dark border-1">Unete Ya!</button></Link>
				</div>
				{/* Todo esto va abajo de la imagen */}
				<div className="container-fluid d-flex justify-content-around mt-5">
					<div className="text-white col-3 d-flex flex-column align-items-center">
						<div><i className="fa-solid fa-heartbeat fs-5"></i></div>
						<div className="text-center">
							<p className="smaller-text mt-3">
								Mejora la salud de tu corazón con nuestros ejercicios, 
								siente como tu calidad de vida aumenta significativamente
							</p>
						</div>
					</div>
					<div className="text-white col-3 d-flex flex-column align-items-center">
						<div><i className="fa-solid fa-dumbbell fs-5"></i></div>
						<div className="text-center">
							<p className="smaller-text mt-3">
								No te preocupes si no tienes el gimnasio cerca, nuestra gran variedad de 
								ejercicios incluye bastantes que podrás realizar en casa con tu propio peso
							</p>
						</div>
					</div>
					<div className="text-white col-3 d-flex flex-column align-items-center">
						<div><i className="fa-solid fa-fire-flame-curved fs-5"></i></div>
						<div className="text-center">
							<p className="smaller-text mt-3">
								Lleva un control de tu quema de calorías con tus rutinas personalizadas,
								con una alimentación adecuada y el déficit calórico puedes conseguirlo.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
