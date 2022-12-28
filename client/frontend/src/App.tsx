import React from 'react';
// import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UsersPage from './UsersPage';
import RolesPage from './RolesPage';
import RolePage from './RolePage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <UsersPage />,
    },
    {
      path: '/users',
      element: <UsersPage />,
    },
    {
      path: '/roles',
      element: <RolesPage />,
    },
    {
      path: '/role/:id',
      element: <RolePage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
