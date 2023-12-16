import React, { useEffect, useState } from 'react';
import {Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import axios from 'axios';
import CreateUserModal from './CreateUserModal';
import { BaseProps, User } from './schema';
import NavBar from './NavBar';

export default function UsersPage(props : BaseProps) {
  const getUsers = async () => {
    const users = await (await axios.get('/api/users')).data;
    setUsers(users);
  };

  const createUser = async (user: User) => {
    try {
      await (
        await axios.post('/api/user', user)
      ).data;
      props.setNotification('Successfully created or updated user');
    } catch (e: any) {
      console.log(e);
      props.setNotification(e.message);
    }
  };

  const empty_user: User[] = [];

  const [users, setUsers] = useState<User[]>(empty_user);
  useEffect(() => {
    console.log('Loading...');
    getUsers();
  }, []);

  const [showUserModal, setShowUserModal] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const handleCreateUser = async (user: User) => {
    setShowUserModal(false);
    await createUser(user);
    await getUsers();
  };

  const handleEditUser = (u: User) => {
    setSelectedUser(u);
    setShowUserModal(true);
  };

  const handleCancelCreateUser = () => {
    setShowUserModal(false);
  };

  const handleShowCreateModal = () => {
    setShowUserModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <NavBar />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <CreateUserModal value={selectedUser} show={showUserModal} onSubmit={handleCreateUser} onCancel={handleCancelCreateUser} setNotification={props.setNotification}/>
        <Button variant='outlined' onClick={handleShowCreateModal}>Create User</Button>
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
              {users.map((it) => (
                <TableRow role="checkbox" tabIndex={-1} key={it.id} onClick={() => handleEditUser(it)} style={{ cursor: 'pointer' }}>
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
