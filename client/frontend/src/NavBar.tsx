import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div style={{ float: 'left', width: '200px' }}>
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
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
