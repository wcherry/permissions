import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';

type Role = {
  id: number;
  name: string;
  active: boolean;
  company_name: string;
};

export default function RolesPage() {
  const getUsers = async () => {
    const users = await (await axios.get('/api/roles')).data;
    setUsers(users);
  };
  const empty_roles: Role[] = [];

  const [users, setUsers] = useState<Role[]>(empty_roles);
  useEffect(() => {
    getUsers();
  }, []);

  const nav = useNavigate();

  return (
    <div>
      <NavBar />
      <div>
        <table>
          <thead>
            <tr>
              <td>Id</td>
              <td>Name</td>
              <td>Active</td>
              <td>Company</td>
            </tr>
          </thead>
          <tbody>
            {users.map((it) => (
              <tr key={it.id} onClick={() => nav(`/role/${it.id}`)} style={{ cursor: 'pointer' }}>
                <td>{it.id}</td>
                <td>{it.name}</td>
                <td>{it.active.toString()}</td>
                <td>{it.company_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
