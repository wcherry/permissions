import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import CreatePermissionModal from './CreatePermissonModal';
import { Button } from '@material-ui/core';

type Permission = {
  id: number;
  name: string;
  active: boolean;
};

export default function PermissionsPage() {
  const getPermissions = async () => {
    const permissions = await (await axios.get('/api/permissions')).data;
    setPermissions(permissions);
  };
  const empty_permissions: Permission[] = [];

  const [permissions, setPermissions] = useState<Permission[]>(empty_permissions);
  useEffect(() => {
    getPermissions();
  }, []);

  const createPermission = async (name: string) => {
    try {
      await (
        await axios.post('/api/permission', { name, active: true })
      ).data;
      setNotification('Successfully created permission');
    } catch (e: any) {
      console.log(e);
      setNotification(e.message);
    }
  };


  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState('');
  const handleCreatePermission = async (text: string) => {
    setShowCreateModal(false);
    await createPermission(text);
    await getPermissions();
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
  };

  const handleShowCreateModal = () => {
    setShowCreateModal(true);
  };



  const nav = useNavigate();

  return (
    <div>
      <NavBar />
      <CreatePermissionModal show={showCreateModal} onSubmit={handleCreatePermission} onCancel={handleCancelCreate} />
      <div>
      <Button variant='outlined' onClick={handleShowCreateModal}>Create Permission</Button>

        <table>
          <thead>
            <tr>
              <td>Id</td>
              <td>Name</td>
              <td>Active</td>
            </tr>
          </thead>
          <tbody>
            {permissions.map((it) => (
              <tr key={it.id} onClick={() => nav(`/permission/${it.id}`)} style={{ cursor: 'pointer' }}>
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
