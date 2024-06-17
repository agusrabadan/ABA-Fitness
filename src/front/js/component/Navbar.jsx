import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";


export const Navbar = () => {
	const { store, actions } = useContext(Context)

	const logout = () => {
		console.log('estoy en logout')
		actions.setIsLogin(false)
		localStorage.removeItem('token')
	}

	const profile = () => {
		actions.profile()
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Home</span>
				</Link>
				<div className="ml-auto">
					{store.isLogin ?
						<>
							<div class="dropdown">
								<button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
									Welcome {store.user.first_name}
								</button>
								<ul class="dropdown-menu">
									<li><Link to="/profile"><span onClick={profile} className="text-secondary">Profile</span></Link></li>
									<li><Link to="/"><span onClick={logout} className="text-danger">Logout</span></Link></li>
								</ul>
							</div>

						</>
						:
						<>
							<Link to="/login"><button className="btn btn-primary ms-2">Login</button></Link>
							
						</>
					}
				</div>
			</div>
		</nav>
	);
};