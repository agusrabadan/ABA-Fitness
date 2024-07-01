const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			isLogin: false,
			user: '',
			exercises: [],
			exercisesLoading: false,
			favorites: [] // Añadido para almacenar los favoritos
		},
		actions: {
			fetchExercises: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/exercises/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-rapidapi-key': 'f335c9d4a1mshf5aa931e8c58f0ep101b9djsn062339dbf8b5',
							'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
                        },
                        body: JSON.stringify({ limit: 2000, offset: 0 })
                    });
                    const data = await response.json();
                    setStore({ exercises: data });
                } catch (error) {
                    console.error('Error fetching exercises:', error); 
                }
            },

			setIsLogin: (login) => { setStore({ isLogin: login }) },

			setCurrentUser: (user) => { setStore({ user: user }) },

			profile: async () => {
				const token = localStorage.getItem('token');
				const url = `${process.env.BACKEND_URL}/api/profile`;
				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				}
				const response = await fetch(url, options)
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return
				}
				const data = await response.json()
				console.log(data);

			},

			addFavorite: async (exercise) => {
				const store = getStore();
				const userId = store.user.id; // Suponiendo que tienes el ID del usuario en el store
			
				const favorites = [...store.favorites, exercise];
				setStore({ favorites });
			
				// Hacer el fetch para guardar en la base de datos
				try {
					const token = localStorage.getItem('token'); // Asumiendo que usas el token para autenticación
			
					const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify({
							user_id: userId,
							exercise_id: exercise.id
						})
					});
			
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
			
					const data = await response.json();
					console.log('Favorite added:', data);
				} catch (error) {
					console.error('Error adding favorite:', error.message);
				}
			},
			

			removeFavorite: async (favoriteId) => {
				const store = getStore();
				console.log('ID to be removed (favorite):', favoriteId); // Verificar el ID del favorito
			
				try {
					const token = localStorage.getItem('token');
					if (!token) {
						throw new Error('Token not found in localStorage.');
					}
			
					const response = await fetch(`${process.env.BACKEND_URL}/api/favorites/${favoriteId}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						}
					});
			
					if (response.ok) {
						// Filtrar el favorito eliminado por el ID correcto
						const updatedFavorites = store.favorites.filter(fav => fav.id !== favoriteId);
						setStore({ favorites: updatedFavorites }); // Actualizar el store después de eliminar
						console.log('Favorito eliminado:', favoriteId);
					} else {
						// Capturar el error de la respuesta y mostrar el mensaje
						const errorResponse = await response.json();
						console.error('Error removing favorite:', errorResponse.message);
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
				} catch (error) {
					console.error('Error removing favorite:', error.message);
				}
			},
			
			
			
			setUser: (userData) => {
				setStore({ user: userData });
				// Si es necesario, también puedes actualizar el estado de `isLogin` aquí
				// Por ejemplo, si el usuario se considera "loggeado" después de actualizar sus datos
				setStore({ isLogin: true }); // Esto es opcional y depende de tu lógica
			},
		}
	};
};

export default getState;
