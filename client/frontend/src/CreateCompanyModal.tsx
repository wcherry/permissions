import React, { useState, useEffect } from 'react';
import {Button, Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'; 
import { Company, BaseProps } from './schema';

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

interface CreateCompanyModalProps extends BaseProps {
  value : Company | undefined;
  onSubmit: Function;
  onCancel?: Function;
  show: boolean;
}

export default function CreateCompanyModal({
  value,
  onSubmit,
  onCancel,
  show,
}: CreateCompanyModalProps) {
  const classes = useStyles(); 
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    setName(value ? value.name : '');
  }, [show, value]);

  const handleChange = (e: any) => {
    setName(e.target.value);
  };

  const handleSave = () => {
    setVisible(false);
    onSubmit({name, active: true});
  };

  const handleClose = () => {
    setVisible(false);
    onCancel == null || onCancel();
  };

  return (
    <Dialog open={visible}>
      <DialogTitle>Create Company</DialogTitle>
      <DialogContent dividers>
      <label>Name</label>
      <input type="text" placeholder="Company Name" onChange={handleChange} value={name} />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={name.length < 3}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}
