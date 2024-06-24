import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";
import { Pagination } from "react-bootstrap"; // Añadido para paginación

export const Favorites = () => {
    const { store, actions } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1); // Añadido estado para manejar la página actual
    const favoritesPerPage = 9; // 3 filas de 3

    const handleRemoveFavorite = (id) => {
        actions.removeFavorite(id);
    };

    // Calcular los favoritos de la página actual
    const indexOfLastFavorite = currentPage * favoritesPerPage;
    const indexOfFirstFavorite = indexOfLastFavorite - favoritesPerPage;
    const currentFavorites = store.favorites.slice(indexOfFirstFavorite, indexOfLastFavorite);

    // Calcular el número total de páginas
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(store.favorites.length / favoritesPerPage); i++) {
        pageNumbers.push(i);
    }

    // Manejar el cambio de página
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // Limitar el número de páginas mostradas en la paginación
    const maxPageNumbersToShow = 3; // Cambiado límite para el número de páginas a mostrar a 3
    const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxPageNumbersToShow / 2), pageNumbers.length - maxPageNumbersToShow + 1));
    const endPage = Math.min(pageNumbers.length, startPage + maxPageNumbersToShow - 1);
    const displayedPageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        displayedPageNumbers.push(i);
    }

    return (
        <>
            <div className="container mt-5">
                <h2 className="text-white bg-dark text-center">Mis Favoritos</h2>
                <div className="row">
                    {store.favorites.length === 0 ? (
                        <p className="text-white bg-dark text-center">No hay favoritos seleccionados.</p>
                    ) : (
                        currentFavorites.map((fav, index) => (
                            <div key={index} className="col-md-4">
                                <div className="card mb-4">
                                    <img src={fav.gifUrl} className="card-img-top" alt={fav.name} /> {/* Añadido el GIF en la parte superior */}
                                    <div className="card-body">
                                        <h5 className="card-title">{fav.name}</h5>
                                        <p className="card-text">
                                            {fav.body_part && `Body part: ${fav.body_part}`}<br />
                                            {fav.target && `Objective: ${fav.target}`}<br />
                                            {fav.equipment && `Equipment: ${fav.equipment}`}<br />
                                        </p>
                                        <button className="btn btn-danger" onClick={() => handleRemoveFavorite(fav.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {store.favorites.length > favoritesPerPage && (
                    <div className="d-flex justify-content-center mt-4">
                        <div style={{ overflowX: 'auto' }}> {/* Añadido contenedor con scroll horizontal */}
                            <Pagination>
                                {currentPage > 1 && (
                                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
                                )}
                                {startPage > 1 && (
                                    <>
                                        <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                                        <Pagination.Ellipsis disabled /> {/* Ellipsis para indicar que hay más páginas */}
                                    </>
                                )}
                                {displayedPageNumbers.map(number => (
                                    <Pagination.Item
                                        key={number}
                                        active={number === currentPage}
                                        onClick={() => handlePageChange(number)}
                                    >
                                        {number}
                                    </Pagination.Item>
                                ))}
                                {endPage < pageNumbers.length && (
                                    <>
                                        <Pagination.Ellipsis disabled /> {/* Ellipsis para indicar que hay más páginas */}
                                        <Pagination.Item onClick={() => handlePageChange(pageNumbers.length)}>{pageNumbers.length}</Pagination.Item>
                                    </>
                                )}
                                {currentPage < pageNumbers.length && (
                                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
                                )}
                            </Pagination>
                        </div>
                    </div>
                )}
            </div>
            <div className="d-flex justify-content-around">
                <Link to="/exercises">
                    <button className="btn btn-secondary mb-3">Add exercises</button>
                </Link>
                <Link to="/workouts">
                    <button className="btn btn-secondary mb-3">Add workouts</button>
                </Link>
            </div>
        </>
    );
};
