import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import CreatePermissionModal from './CreatePermissonModal';
import { Button, TableContainer, TableHead, Table, TableCell, TableRow, TableBody, Paper } from '@material-ui/core';
import { BaseProps } from './schema';

type Permission = {
  id: number;
  name: string;
  active: boolean;
};

export default function PermissionsPage({setNotification}: BaseProps) {
  const getPermissions = async () => {
    const permissions = await (await axios.get('/api/permissions')).data;
    setPermissions(permissions);
  };
  const empty_permissions: Permission[] = [];

  const [permissions, setPermissions] = useState<Permission[]>(empty_permissions);
  useEffect(() => {
    getPermissions();
  }, []);

  const [selectedPermission, setSelectedPermission] = useState<Permission | undefined>(undefined);

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

  const handleCreatePermission = async (text: string) => {
    setShowCreateModal(false);
    await createPermission(text);
    await getPermissions();
  };
  
  const handleEdit = (p: Permission) => {
    setSelectedPermission(p);
    setShowCreateModal(true);
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
  };

  const handleShowCreateModal = () => {
    setShowCreateModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
    <NavBar />
    <CreatePermissionModal value={selectedPermission} show={showCreateModal} onSubmit={handleCreatePermission} onCancel={handleCancelCreate} setNotification={setNotification}/>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div><Button variant='outlined' onClick={handleShowCreateModal}>Create Permission</Button></div>
      <TableContainer component={Paper}>
        <Table style={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((it) => (
              <TableRow role="checkbox" tabIndex={-1} key={it.id} onClick={() => handleEdit(it)} style={{ cursor: 'pointer' }}>
                <TableCell component="th" scope="row">{it.id}</TableCell>
                <TableCell>{it.name}</TableCell>
                <TableCell>{it.active.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  </div>
  );
}
