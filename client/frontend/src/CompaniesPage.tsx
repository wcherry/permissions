import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { BaseProps, Company } from './schema';
import CreateCompanyModal from './CreateCompanyModal';
import { Button, TableContainer, TableHead, Table, TableCell, TableRow, TableBody, Paper } from '@material-ui/core';

interface CompaniesPageProps extends BaseProps {
}


export default function CompaniesPage(props : CompaniesPageProps) {
  const getCompanies = async () => {
    const companies = await (await axios.get('/api/companies')).data;
    setCompanies(companies);
  };
  
  const createCompany = async (company: Company) => {
    try {
      await (
        await axios.post('/api/company', company)
      ).data;
      props.setNotification('Successfully created or updated company');
    } catch (e: any) {
      console.log(e);
      props.setNotification(e.message);
    }
  };


  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => {
    getCompanies();
  }, []);

  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>(undefined);

  const handleCreateCompany = async (company: Company) => {
    setShowCreateModal(false);
    await createCompany(company);
    await getCompanies();
  };

  const handleEdit = (c: Company) => {
    setSelectedCompany(c);
    setShowCreateModal(true);
  };

  const handleCancelCreateUser = () => {
    setShowCreateModal(false);
  };

  const handleShowCreateModal = () => {
    setShowCreateModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <NavBar />
      <CreateCompanyModal value={selectedCompany} show={showCreateModal} onSubmit={handleCreateCompany} onCancel={handleCancelCreateUser} setNotification={props.setNotification}/>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div><Button variant='outlined' onClick={handleShowCreateModal}>Create Company</Button></div>
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
              {companies.map((it) => (
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
