import "./Header.css";
import logo from '../../assets/logo.jpeg';

export default function Header() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const isAdmin = localStorage.getItem("isAdmin");

  return (
    <div className="mainheader">
      <img src={logo} alt="Logo" className="header-logo" />
      <nav className="mainnav">
        <a href="/">Home</a>

        {isLoggedIn ? (
          <a href="/pred">Predictions</a>
        ) : null}

        {!isLoggedIn && <a href="/login">Login</a>} 

        {isLoggedIn && isAdmin === "true" ? (
          <a href="/signup">Create Account</a>
        ) : null}

        {isLoggedIn ? (
          <a href="/logout">Logout</a>
        ) : null}
      </nav>
    </div>
  );
}