import React from 'react';
import "./Home.css";
import centerImage from '../../assets/coscto.png'; // Replace with the path to your image

export default function Home() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const usernameSession = localStorage.getItem("username");

  return (
    <div className="home-content">
      {isLoggedIn ? (
        <h1>Hello, {usernameSession}!</h1>
      ) : (
        <h3>Please login to access the Costco Stock Predictions</h3>
      )}

      <img src={centerImage} alt="Center Image" className="center-image" />
      <div className="image-source">
        Source: <a href="https://www.costco.com/logo-media-requests.html" target="_blank" rel="noopener noreferrer">Costco Wholesale - Logo & Media Requests</a>
      </div>
      
    </div>
  );
}
