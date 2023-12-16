import React, { useState, useEffect } from 'react';
import {Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {BaseProps, User} from './schema'; 
import axios from 'axios';

type Company = {
  id: number;
  name: string;
}

const useStyles = makeStyles((theme) => ({ 
  root: { 
    textAlign: "center", 
    marginTop: "50px"
  }, 
  btns:{ 
      '& > *': { 
      margin: theme.spacing(1), 
    }, 
      marginTop: "40px"
  } 
})); 

interface CreateUserModalProps extends BaseProps {
  value?: User;
  onSubmit: Function;
  onCancel?: Function;
  show: boolean;
}

export default function CreateUserModal({
  value,
  onSubmit,
  onCancel,
  show,
  setNotification
}: CreateUserModalProps 
) {
  const classes = useStyles(); 
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]); 
  const [visible, setVisible] = useState(show);

  const readCompanies = () => {
    axios.get('/api/companies')
        .then((response) => {
            setCompanies(response.data);
        })
        .catch((error) => {
            // Handle logout error
            console.error(error);
            setNotification(`An error occurred during logout. ${error}`);
        });
  };

  useEffect(() => {
    setVisible(show);
    setUsername(value ? value.name : '');
    readCompanies();
  }, [show, value]);

  const handleChange = (e: any) => {
    setUsername(e.target.value);
  };

  const handleSave = () => {
    setVisible(false);
    let user = value ? {...value, name: username} : {name: username, active: true}
    onSubmit(user);
  };

  const handleClose = () => {
    setVisible(false);
    onCancel == null || onCancel();
  };

  return (
    <Dialog open={visible}>
      <DialogTitle>Create User</DialogTitle>
      <DialogContent dividers>
      <div style={{display: 'flex', flexDirection: 'row', width: '650px', alignContent: 'space-evenly'}}>
        <div style={{display: 'flex', flex: 2, flexDirection: 'column'}}>
      <label>Username</label>
      <input type="text" placeholder="Username" onChange={handleChange} value={username} />
      <label>Password</label>
      <input type="password" onChange={handleChange} value={password} />
      <label>Companies</label>
      <Select value={[]} multiple>
        {companies.map((it) => (<MenuItem key={it.id}>{it.name}</MenuItem>))}
      </Select>
      <label>Roles</label>
      <Select value={[]} multiple>
        {roles.map((it) => (<MenuItem key={it}>{it}</MenuItem>))}
      </Select>
      <label>Permissions</label>
      <Select value={[]} multiple>
        {roles.map((it) => (<MenuItem key={it}>{it}</MenuItem>))}
      </Select>
      </div>
      <div style={{display: 'flex', flex: 3, flexDirection: 'column', backgroundColor: 'blue', marginLeft: '40px'}}>

      </div>
      </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={username.length < 3}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}
