import React from "react";
import "../../styles/home.css";
import SubirImagen from "../component/SubirImagen.jsx";
import logo from "../../img/Logo1.webp"; 
import tumbada from "../../img/tumbada.jpg";
import hombre from "../../img/hombre-bn.webp";
import chica from "../../img/ChicaNegro.webp";
import { Link } from "react-router-dom";

const textStyle = {
	position: "absolute",
	top: "20%",
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
				<img src={tumbada} alt="Descripción de la imagen" className="img-fluid reduced-height" />
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
				{/* Linea separación */}
				<div className="row my-4 text-white">
					<div className="col">
						<hr className="separator" />
					</div>
				</div>
				{/* Siguiente bloque */}
				<div className="container mt-5">
					<div className="row">
						<div className="col text-center">
							<h2 className="text-white mt-3">Transforma tu cuerpo con nuestros ejercicios personalizados</h2>
							<p className="lead text-white mt-5">Te ayudaremos a organizar tus ejercicios, sé tu propio coach diseñando rutinas de trabajo para cada dia de la semana, registrate ya gratis y disfruta de todos nuestros servicios</p>
							<Link to="/signup" className="nav-link">
								<button className="btn btn-outline-light mt-4 ms-2 fs-5 rounded-pill">Regístrate ya!</button>
							</Link>
						</div>
						<div className="col-auto">
							{/* Imagen del hombre pequeña y alineada a la derecha */}
							<img src={hombre} alt="Hombre en ABA Fitness" className="img-fluid hombre-pequeno-derecha" />
						</div>
					</div>
					{/* Línea de separación */}
					<div className="row my-4 text-white">
						<div className="col">
							<hr className="separator" />
						</div>
					</div>
					{/* Carrusel */}
					<div id="carouselExampleControls" className="carousel slide mb-5" data-bs-ride="carousel">
						<div className="carousel-inner">
							<div className="carousel-item active ">
								<h6 className="text-white text-center"> "Desde que uso ABA fitness mi motivación se ha multiplicado por 1000, <br/>
								 ir al gimnasio ya no es un sacrificio para mi" </h6>
								<div className="d-flex justify-content-center">
									<i className="far fa-star text-white text-center"></i>
									<i className="far fa-star text-white text-center"></i>
									<i className="far fa-star text-white text-center"></i>
									<i className="far fa-star text-white text-center"></i>
									<i className="far fa-star text-white text-center"></i>
								</div>
							</div>
							<div className="carousel-item">
								<h6 className="text-white text-center"> "Estaba cansado de hacer siempre los mismos ejercicios y de no saber ejecutarlos, <br/>ABA Fitness terminó con esos dos problemas" </h6>
								<div className="d-flex justify-content-center">
									<i className="far fa-star text-white text-center"></i>
									<i className="far fa-star text-white text-center"></i>
									<i className="far fa-star text-white text-center"></i>
									<i className="far fa-star text-white text-center"></i>
									<i className="far fa-star text-white text-center"></i>
								</div>
							</div>
							<div className="carousel-item">
								<h6 className="text-white text-center"> "Excelente aplicación, muy recomendable, da igual tu nivel o tu edad, <br/> 
								apto para toda la familia, ellos te dan las herramientas, tu marcas tu ritmo." </h6>
								<div className="d-flex justify-content-center">
									<i className="far fa-star text-white text-center"></i>
									<i className="far fa-star text-white text-center"></i>
									<i className="far fa-star text-white text-center"></i>
									<i className="far fa-star text-white text-center"></i>
									<i className="far fa-star text-white text-center"></i>
								</div>
							</div>
						</div>
						<button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
							<span className="carousel-control-prev-icon" aria-hidden="true"></span>
							<span className="visually-hidden">Anterior</span>
						</button>
						<button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
							<span className="carousel-control-next-icon" aria-hidden="true"></span>
							<span className="visually-hidden">Siguiente</span>
						</button>
					</div>
					
					<div className="d-flex justify-content-center">
						<img src={logo} alt="Logo" width="200" height="200" className="d-inline-block align-text-top rounded-circle mx-2" />
					</div>
					<p className="text-white text-center mt-1 mb-5"> ABA Fitness Company</p>

				</div>
			</div>
		</div>
	);
};
