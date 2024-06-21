import React from "react";

export const Contact = () => {
    return (
        <div className="container mt-3  text-center">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="mb-4 text-white">Contacto</h2>
                    <p className="text-white">
                        ¿Tienes preguntas o comentarios? Estamos aquí para ayudarte. Por favor, contáctanos utilizando la información a continuación:
                    </p>
                    <div className="card bg-light mt-5 mb-5">
                        <div className="card-body">
                            <h5 className="card-title">Información de Contacto</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>Correo Electrónico:</strong> <a href="mailto:contacto@abafitness.com">contacto@ejemplo.com</a></li>
                                <li className="list-group-item"><strong>Teléfono:</strong> +34 679 657 912</li>
                                <li className="list-group-item"><strong>Dirección:</strong> 4Geeks Academy, Madrid, España</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
