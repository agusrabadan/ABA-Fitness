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
					setStore({ exercisesLoading: true });

					const response = await fetch('https://exercisedb.p.rapidapi.com/exercises?limit=2000&offset=0', {
						method: 'GET',
						headers: {
							'x-rapidapi-key': '4153567bccmsh1a02517c622e4f0p15a422jsna4f43fd7b304',
							'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
						}
					});

					if (!response.ok) {
						console.error('Error fetching exercises:', response.status, response.statusText);
						setStore({ exercisesLoading: false });
						return;
					}

					const data = await response.json();
					setStore({ exercises: data, exercisesLoading: false });
				} catch (error) {
					console.error('Error fetching exercises:', error);
					setStore({ exercisesLoading: false });
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

			addFavorite: (exercise) => {
				const store = getStore();
				const favorites = [...store.favorites, exercise];
				setStore({ favorites }); // Añadido para agregar favoritos
			},

			removeFavorite: (id) => {
				const store = getStore();
				const favorites = store.favorites.filter(fav => fav.id !== id);
				setStore({ favorites }); // Añadido para eliminar favoritos
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
