import "./Header.css";
import { Link } from "react-router-dom";
import Logo from "../logo.png";
import LoginButton from "./LoginButton";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="header-title">
          <img src={Logo} alt="" width="300" />
        </Link>
        <ul className="nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/reservations" className="nav-link">
              My reservations
            </Link>
          </li>
          <li className="nav-item">
            <LoginButton />
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
