import React, { useState } from 'react';
import "./Login.css";

export default function Login() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const usernameSession = localStorage.getItem("username");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  
  if (isLoggedIn && usernameSession !== null) {
    window.location.href = "/";
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    if (username === "admin" && password === "password") {
      localStorage.setItem("username", username);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("isAdmin", "true");
      window.location.href = "/";
    } else {
      alert("Invalid username or password.");
    }
  };
  
  return (
    <div className="logincontent">
      <div className="form">
        <h1>Login :</h1>
        <form className="form justify-content-center" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username :</label>
            <input
              type="text"
              className="forminput"
              id="username"
              aria-describedby="emailHelp"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              className="forminput"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
