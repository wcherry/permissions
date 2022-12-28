import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import CreateUserModal from './CreateUserModal';
import Notification from './Notification';

type User = {
  id: number;
  name: string;
  active: boolean;
  companies: string;
};

export default function UsersPage() {
  const getUsers = async () => {
    const users = await (await axios.get('/api/users')).data;
    setUsers(users);
  };

  const createUser = async (username: string) => {
    try {
      await (
        await axios.post('/api/user', { name: username, active: true })
      ).data;
      setNotification('Successfully created user');
    } catch (e: any) {
      console.log(e);
      setNotification(e.message);
    }
  };

  const empty_user: User[] = [];

  const [users, setUsers] = useState<User[]>(empty_user);
  useEffect(() => {
    console.log('Loading...');
    getUsers();
  }, []);

  const [showUserModal, setShowUserModal] = useState(false);
  const [notification, setNotification] = useState('Hello');
  const handleCreateUser = async (text: string) => {
    setShowUserModal(false);
    await createUser(text);
    await getUsers();
  };

  const handleCancelCreateUser = () => {
    setShowUserModal(false);
  };

  const handleShowCreateModal = () => {
    setShowUserModal(true);
  };

  return (
    <div>
      <Notification message={notification} />
      <NavBar />
      <CreateUserModal show={showUserModal} onSubmit={handleCreateUser} onCancel={handleCancelCreateUser} />
      <div>
        <button onClick={handleShowCreateModal}>Create User</button>
        <table>
          <thead>
            <tr>
              <td>Id</td>
              <td>Name</td>
              <td>Active</td>
            </tr>
          </thead>
          <tbody>
            {users.map((it) => (
              <tr key={it.id} onClick={() => console.log('Pressed')} style={{ cursor: 'pointer' }}>
                <td>{it.id}</td>
                <td>{it.name}</td>
                <td>{it.active.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
