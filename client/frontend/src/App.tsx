import React,{useState}  from 'react';
// import './App.css';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import UsersPage from './UsersPage';
import RolesPage from './RolesPage';
import RolePage from './RolePage';
import { AuthUser } from './schema';
import PermissionsPage from './PermissionsPage';
import LoginPage from './LoginPage';
import NavBar from './NavBar';
import Notification from './Notification';

function App() {
  const [user, setAuthUser] = useState<AuthUser|null>(null)
  const [notification, setNotification] = useState('');

  const applyNotification = (s : string) =>{
    setNotification(s);
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <UsersPage setNotification={applyNotification}/>,
    },
    {
      path: '/users',
      element: <UsersPage setNotification={applyNotification}/>,
    },
    {
      path: '/roles',
      element: <RolesPage />,
    },
    {
      path: '/permissions',
      element: <PermissionsPage />,
    },
    {
      path: '/role/:id',
      element: <RolePage />,
    },
    {
      path: '/logout',
      element: <LoginPage setUser={setAuthUser} logout={true} setNotification={applyNotification}/>,
    }
  ]);

  return user == null ?<LoginPage setUser={setAuthUser} setNotification={applyNotification}/> : 
  (<div>
    <Notification message={notification} />
    <RouterProvider router={router} /> 
  </div>);
}

export default App;
