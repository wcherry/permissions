import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import {TableContainer, TableHead, Table, TableCell, TableRow, TableBody, Paper } from '@material-ui/core';
import {Role, BaseProps} from './schema';
import CreateRoleModal from './CreateRoleModal';

export default function RolesPage({setNotification}: BaseProps) {
  const getRoles = async () => {
    const roles = await (await axios.get('/api/roles')).data;
    setRoles(roles);
  };

  const [roles, setRoles] = useState<Role[]>([]);
  useEffect(() => {
    getRoles();
  }, []);

  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);

  const createRole = async (name: string) => {
    try {
      await (
        await axios.post('/api/roles', { name, active: true })
      ).data;
      setNotification('Successfully created role');
    } catch (e: any) {
      console.log(e);
      setNotification(e.message);
    }
  };

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateRole = async (text: string) => {
    setShowCreateModal(false);
    await createRole(text);
    await getRoles();
  };
  
  const handleEdit = (r: Role) => {
    setSelectedRole(r);
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
      <CreateRoleModal value={selectedRole} show={showCreateModal} onSubmit={handleCreateRole} onCancel={handleCancelCreate} setNotification={setNotification}/>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
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
              {roles.map((it) => (
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
