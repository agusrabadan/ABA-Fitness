const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			isLogin: false,
			user: '',
			exercises: [],
      exercisesLoading: false 
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
			  
			exampleFunction: () => { getActions().changeColor(0, "green"); },  // Use getActions to call a function within a fuction
			changeColor: (index, color) => {
				const store = getStore();  // Get the store
				// We have to loop the entire demo array to look for the respective index and change its color
				const demo = store.demo.map((element, i) => {
					if (i === index) element.background = color;
					return element;
				});
				setStore({ demo: demo });  // Reset the global store
			},
			getMessage: async () => {
				const response = await fetch(process.env.BACKEND_URL + "/api/hello")
				if (!response.ok) {
					console.log("Error loading message from backend", response.status, response.statusText)
					return
				}
				const data = await response.json()
				setStore({ message: data.message })
				return data;  // Don't forget to return something, that is how the async resolves
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

			}
		}
	};
};


export default getState;
