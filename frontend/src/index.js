import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from "./pages/home/Home";
import Pred from "./pages/pred/Pred";
import Login from "./pages/login/Login";
import Logout from "./pages/logout/Logout";
import SignUp from "./pages/signup/SignUp";

import { createBrowserRouter , RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/pred",
    element: <Pred />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <RouterProvider router = {router} />
    <Footer />
  </React.StrictMode>
);