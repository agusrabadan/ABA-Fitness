import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center text-white p-3 fs-6">
		<p>
			Copyright 2024  <i className="far fa-registered"></i> |
			<Link to="/" className="ms-2 text-white ml-2"> ABA Fitness |</Link> 
			<Link to="/privacy-policy" className="ms-2 text-white ml-2"> Política de Privacidad | </Link> 
			<Link to="/conditions-terms" className="ms-2 text-white ml-2"> Términos y condiciones | </Link> 
			<Link to="/contact" className="ms-2 text-white ml-2"> Contacto </Link> 
		</p>
	</footer>
);
