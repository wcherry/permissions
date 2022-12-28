import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import Notification from './Notification';

type Role = {
  id: number;
  name: string;
  active: boolean;
  company_name: string;
};

type Permission = {
  id: number;
  name: string;
  active: boolean;
};

export default function RolePage() {
  const params = useParams();

  const loadData = async () => {
    const role = await (await axios.get(`/api/role/${params.id}`)).data;
    const rolePermissions = await (await axios.get(`/api/role/${params.id}/permissions`)).data;
    const allPermissions = await (await axios.get(`/api/permissions`)).data;
    setRolePermissions(rolePermissions);
    setRole(role);
    setAllPermissions(allPermissions);

    const selectedIds = rolePermissions.map((it: Permission) => it.id);
    setUnselectedPermissions(
      allPermissions.filter((it: Permission) => !selectedIds.includes(it.id) && !it.name.startsWith('_'))
    );
  };

  const saveData = async () => {
    try {
      const results = await (await axios.put(`/api/role/${params.id}/permissions`, rolePermissions)).data;
      console.log(results);
      setNotification('Saved');
    } catch (e: any) {
      console.log(e);
      setNotification(e.message);
    }
  };

  useCallback(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [params]);

  const [role, setRole] = useState<Role | null>();
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [unselectedPermissions, setUnselectedPermissions] = useState<Permission[]>([]);
  const [removeSelectedOptions, setRemoveSelectedOptions] = useState<string[]>([]);
  const [addSelectedOptions, setAddSelectedOptions] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [notification, setNotification] = useState('Hello');

  const dummyPermission = { id: 0, name: '', active: true };

  const handleAdd = () => {
    const selectedPermissions: Permission[] = addSelectedOptions.map(
      (add) => allPermissions.find((it) => it.id.toString() === add) || dummyPermission
    );
    setRolePermissions([...rolePermissions, ...selectedPermissions]);
    setUnselectedPermissions(unselectedPermissions.filter((it) => !selectedPermissions.includes(it)));
    setAddSelectedOptions([]);
  };

  const handleRemove = () => {
    const selectedPermissions: Permission[] = removeSelectedOptions.map(
      (add) => allPermissions.find((it) => it.id.toString() === add) || dummyPermission
    );
    setUnselectedPermissions([...unselectedPermissions, ...selectedPermissions]);
    const newList = rolePermissions.filter((it) => !selectedPermissions.find((x) => it.id === x.id));
    setRolePermissions(newList);
    setRemoveSelectedOptions([]);
  };

  const handleChangeRemove = (e: any) => {
    let selected = [...e.target.selectedOptions].map((it) => it.value);
    setRemoveSelectedOptions(selected);
  };

  const handleChangeAdd = (e: any) => {
    let selected = [...e.target.selectedOptions].map((it) => it.value);
    setAddSelectedOptions(selected);
  };

  const handleChangeSearch = (e: any) => {
    const text = e.target.value;
    setSearchText(text);

    const selectedIds = rolePermissions.map((it: Permission) => it.id);
    setUnselectedPermissions(
      allPermissions.filter(
        (it: Permission) => !selectedIds.includes(it.id) && !it.name.startsWith('_') && it.name.includes(text)
      )
    );
  };

  const handleSave = () => {
    setNotification(`Saving...${Date()}`);
    console.log('Saving...');
    saveData();
  };

  const loading = role == null || allPermissions.length === 0;
  return (
    <div>
      <Notification message={notification} />
      <NavBar />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div>
            <div>{role.company_name}</div>
            <div>{role.name}</div>
            <Link to="/roleAssignedUsers">Assigned Users</Link>
          </div>
          <div>
            <select multiple size={20} value={removeSelectedOptions} onChange={handleChangeRemove}>
              {rolePermissions.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>
            <button onClick={handleRemove}>Remove</button>
            <input type="text" onChange={handleChangeSearch} value={searchText} placeholder="Search..." />
            <select multiple size={20} value={addSelectedOptions} onChange={handleChangeAdd}>
              {unselectedPermissions.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>
            <button onClick={handleAdd}>Add</button>
          </div>
          <button onClick={handleSave}>Save</button>
        </>
      )}
    </div>
  );
}
