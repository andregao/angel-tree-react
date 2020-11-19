import React, { useState } from 'react';
import styled from 'styled-components/macro';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PageHeader from '../components/PageHeader';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import { children } from '../mock/mock';
import EditChildModal from '../modals/EditChildModal';
import Button from '@material-ui/core/Button';
import { commitments } from '../mock/mock';
import EditCommitmentModal from '../modals/EditCommitmentModal';
import ChildDetailModal from '../modals/ChildDetailModal';
import { Link } from 'react-router-dom';

const childColumns = [
  { field: 'id', headerName: 'ID', width: 50, type: 'number' },
  { field: 'name', headerName: 'Name', width: 170 },
  { field: 'gender', headerName: 'Gender', width: 80 },
  { field: 'age', headerName: 'Age', width: 60, type: 'number' },
  { field: 'wishes', headerName: 'Wishes', width: 200, sortable: false },
  { field: 'sizes', headerName: 'Sizes', width: 200, sortable: false },
  { field: 'committed', headerName: 'Committed', width: 110 },
  { field: 'sponsor', headerName: 'Sponsor', width: 170 },
];
const childRows = children;
const commitmentColumns = [
  { field: 'id', headerName: 'ID', width: 50, type: 'number' },
  { field: 'name', headerName: 'Name', width: 170 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'phone', headerName: 'Phone', width: 130 },
  { field: 'childName', headerName: 'Child Name', width: 170 },
  { field: 'childId', headerName: 'Child ID', width: 85, type: 'number' },
];
const commitmentRows = commitments;

const Admin = () => {
  const [isEditChildModalOpen, setEditChildModalOpen] = useState(false);
  const [isEditCommitmentModalOpen, setEditCommitmentModalOpen] = useState(
    false
  );
  const [currentRow, setCurrentRow] = useState(null);
  const [childInfo, setChildInfo] = useState(null);
  const [isChildDetailModalOpen, setChildDetailModalOpen] = useState(false);
  const setData = data => {
    setCurrentRow(prev => ({ ...prev, data }));
  };
  const handleCellClick = event => {
    const { field, data } = event;
    // ignore attempts to edit id and committed
    const ignores = ['id', 'committed'];
    if (ignores.some(f => f === field)) {
      return;
    }

    setCurrentRow({ data, field });
    console.log(data);
    // decide which modal to use
    if (data.email) {
      // commitment table
      if (field !== 'childName' && field !== 'childId') {
        setEditCommitmentModalOpen(true);
      } else {
        setChildInfo(children[data.childId]);
        setChildDetailModalOpen(true);
      }
    } else {
      setEditChildModalOpen(true);
    }
  };
  const handleAddChild = () => {
    setCurrentRow({
      data: {
        name: '',
        gender: 'female',
        age: 0,
        wishes: [],
        sizes: [],
      },
    });
    setEditChildModalOpen(true);
  };

  return (
    <>
      <section>
        <PageHeader text='Admin Area' />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id='children-expansion'
          >
            <Typography variant='h6'>Children</Typography>
          </AccordionSummary>
          <AccordionAction>
            <Button
              color='primary'
              variant='contained'
              onClick={handleAddChild}
            >
              Add a child
            </Button>
          </AccordionAction>
          <div style={{ height: 660, width: '100%' }}>
            <DataGrid
              rows={childRows}
              columns={childColumns}
              pageSize={10}
              onCellClick={handleCellClick}
            />
          </div>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id='commitments-expansion'
          >
            <Typography variant='h6'>Commitments</Typography>
          </AccordionSummary>
          <div style={{ height: 660, width: '100%' }}>
            <DataGrid
              rows={commitmentRows}
              columns={commitmentColumns}
              pageSize={10}
              onCellClick={handleCellClick}
            />
          </div>
        </Accordion>
        <ActionArea>
          <Button variant='text' color='primary' component={Link} to='/'>
            back
          </Button>
        </ActionArea>
      </section>
      {currentRow?.data?.wishes && (
        <EditChildModal
          isModalOpen={isEditChildModalOpen}
          setModalOpen={setEditChildModalOpen}
          childData={currentRow.data}
          setData={setData}
          clickedField={currentRow.field}
        />
      )}
      {currentRow?.data?.email && (
        <EditCommitmentModal
          isModalOpen={isEditCommitmentModalOpen}
          setModalOpen={setEditCommitmentModalOpen}
          commitmentData={currentRow.data}
          setData={setData}
          clickedField={currentRow.field}
        />
      )}
      {childInfo && (
        <ChildDetailModal
          currentChildInfo={childInfo}
          isModalOpen={isChildDetailModalOpen}
          setModalOpen={setChildDetailModalOpen}
        />
      )}
    </>
  );
};

const AccordionAction = styled.div`
  padding: 0 1rem 1rem;
  display: flex;
  justify-content: flex-end;
`;
const ActionArea = styled.footer`
  padding: 1rem;
  display: flex;
  justify-content: center;
`;

export default Admin;
