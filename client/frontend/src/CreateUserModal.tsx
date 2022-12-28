import React, { useState, useEffect } from 'react';

function CreateUserModal({
  value,
  onSubmit,
  onCancel,
  show,
}: {
  value?: string;
  onSubmit: Function;
  onCancel?: Function;
  show: boolean;
}) {
  const [username, setUsername] = useState('');
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    setUsername(value || '');
  }, [show, value]);

  const handleChange = (e: any) => {
    setUsername(e.target.value);
  };

  const handleSave = () => {
    setVisible(false);
    onSubmit(username);
  };

  const handleClose = () => {
    setVisible(false);
    onCancel == null || onCancel();
  };

  return !visible ? (
    <div />
  ) : (
    <div
      style={{
        position: 'fixed',
        left: '40%',
        top: '20%',
        width: '300px',
        height: '120px',
        backgroundColor: 'orange',
        padding: '12px',
        borderRadius: '8px',
      }}
    >
      <label>Username</label>
      <input type="text" placeholder="Username" onChange={handleChange} value={username} />
      <button onClick={handleClose}>Cancel</button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default CreateUserModal;
