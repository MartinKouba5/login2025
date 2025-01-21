import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, isAdmin, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {/* Always visible links */}
            <Link className="nav-link" to="/">
              Home
            </Link>

            {!isLoggedIn && (
              <>
                <Link className="nav-link" to="/register">
                  Register
                </Link>
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <Link className="nav-link" to="/user">
                  User
                </Link>

                {/* Admin Menu: Visible only to admins */}
                {isAdmin && (

                  <Link className="nav-link" to="/admin">
                  Admin
                </Link>
                )}

                <button className="nav-link btn btn-link" onClick={onLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
