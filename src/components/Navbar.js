import React from 'react';
import { Link } from 'react-router-dom';


function Navbar() {
    return (
      <nav className="navbar">
        <Link to="/home">Home</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/projects">Projects</Link>
      </nav>
    );
  }

export default Navbar;
