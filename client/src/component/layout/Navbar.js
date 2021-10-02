import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/auth";

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const authLinks = (
    <ul>
      <li>
        <Link onClick={()=>dispatch(logout())}
        to="/#!">
          <i className='fas fa-sign-out-alt' /> {' '}
          <span className='hide-sm'>
            Logout
          </span>
        </Link>
      </li>
    </ul>
  );
  
  const guestLinks = (
    <ul>
      <li>
        <Link to="/#!">Developers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code" /> Social Media
        </Link>
      </h1>
      {!loading && (
        <React.Fragment>
          {isAuthenticated ? authLinks : guestLinks}
        </React.Fragment>
      )}
    </nav>
  );
};

export default Navbar;
