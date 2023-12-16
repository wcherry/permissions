import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div style={{ float: 'left', width: '200px', height: '100vh'}}>
      <nav className="menu">
        <ul>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/roles">Roles</Link>
          </li>
          <li>
            <Link to="/permissions">Permissions</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;


/*
*/