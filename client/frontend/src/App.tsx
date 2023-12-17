import React,{useState, useEffect}  from 'react';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import UsersPage from './UsersPage';
import RolesPage from './RolesPage';
import RolePage from './RolePage';
import { AuthUser } from './schema';
import PermissionsPage from './PermissionsPage';
import LoginPage from './LoginPage';
import Notification from './Notification';
import CompaniesPage from './CompaniesPage';

function App() {
  const [user, setAuthUser] = useState<AuthUser|null>(null)
  const [notification, setNotification] = useState('');

  const applyNotification = (s : string) =>{
    setNotification(s);
  }

  useEffect(()=> {
    if(!user) {
      let token = localStorage.getItem('user');
      if(token){
        let authUser : AuthUser = JSON.parse(token);
        setAuthUser(authUser);
      }
    }
  },[user]);

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
      element: <RolesPage setNotification={applyNotification}/>,
    },
    {
      path: '/permissions',
      element: <PermissionsPage setNotification={applyNotification}/>,
    },
    {
      path: '/role/:id',
      element: <RolePage />,
    },
    {
      path: '/logout',
      element: <LoginPage setUser={setAuthUser} logout={true} setNotification={applyNotification}/>,
    },
    {
      path: '/companies',
      element: <CompaniesPage setNotification={applyNotification}/>,
    }
  ]);

  return user == null ?<LoginPage setUser={setAuthUser} setNotification={applyNotification}/> : 
  (<div>
    <Notification message={notification} />
    <RouterProvider router={router} /> 
  </div>);
}

export default App;
