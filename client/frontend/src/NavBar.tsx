import React from 'react';
import { Link as NavLink } from 'react-router-dom';
import { Link } from "@material-ui/core"; 
import { Stack } from "@mui/system"; 

function NavBar() {
  return (
    <div style={{ float: 'left', width: '200px', height: '100vh'}}>
      <Stack spacing={1} direction="column" justifyContent="center">
        <Link to="/users" component={NavLink}>Users</Link>
        <Link to="/roles" component={NavLink}>Roles</Link>
        <Link to="/permissions" component={NavLink}>Permissions</Link>
        <Link to="/companies" component={NavLink}>Companies</Link>
        <Link to="/logout" component={NavLink}>Logout</Link>        
      </Stack>
    </div>
  );
}

export default NavBar;


/*
*/