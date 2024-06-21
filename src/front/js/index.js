import React from "react";  // Import react into the bundle
import ReactDOM from "react-dom";
import "../styles/index.css";  // Include your index.scss file into the bundle
import Layout from "./Layout.jsx";  // Import your own components
import 'bootstrap/dist/css/bootstrap.min.css';
 
// Render your react application
ReactDOM.render(<Layout />, document.querySelector("#app"));
