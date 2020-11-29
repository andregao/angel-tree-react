import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { AppContext } from '../App';
import { Link, useHistory } from 'react-router-dom';
import { getChildrenData, getDonationsData } from '../services/api';
import { actions } from '../services/state';
import PageHeader from '../components/PageHeader';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddChildModal from '../modals/AddChildModal';
import { DataGrid } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import EditChildModal from '../modals/EditChildModal';
import ProgressBar from '../components/ProgressBar';
import CachedIcon from '@material-ui/icons/Cached';

const Admin = () => {
  const { appState, appDispatch } = useContext(AppContext);
  console.log('app state:', appState);
  // eagerly fetch children summary data on render
  const history = useHistory();
  const { adminSecret, children, donations } = appState;
  const [needRefresh, setRefresh] = useState(true);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (needRefresh) {
      setLoading(true);
      getChildrenData(adminSecret).then(result => {
        if (result.status === 200) {
          result.json().then(({ content }) => {
            appDispatch({
              type: actions.receiveChildrenData,
              payload: content,
            });
          });
        }
        // not authorized redirect
        if (result.status === 403) {
          history.push('/login');
        }
        setLoading(false);
      });
      setRefresh(false);
    }
  }, [needRefresh]);

  // add and edit children
  const [isAddChildModalOpen, setAddChildModalOpen] = useState(false);
  const [isEditChildModalOpen, setEditChildModalOpen] = useState(false);
  const [childId, setChildId] = useState(null);

  const handleAddChild = () => setAddChildModalOpen(true);

  // children data grid
  const handleEditChildClick = id => {
    setChildId(id);
    setEditChildModalOpen(true);
  };
  console.log('child id in admin', childId);
  const childrenColumns = [
    { field: 'id', headerName: 'ID', width: 130, type: 'number' },
    { field: 'name', headerName: 'Name', width: 170 },
    { field: 'donated', headerName: 'Donated', width: 90 },
    { field: 'donorName', headerName: 'Donor', width: 170 },
    {
      field: 'editChild',
      headerName: 'Action',
      width: 80,
      sortable: false,
      renderCell: ({ data }) => (
        <Button
          color='primary'
          size='small'
          disabled={data.donated}
          onClick={() => handleEditChildClick(data.id)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: 'viewDonor',
      headerName: 'Donation',
      width: 120,
      sortable: false,
      renderCell: ({ data }) => (
        <Button color='primary' size='small' disabled={!data.donated}>
          Donor info
        </Button>
      ),
    },
  ];
  let childrenRows = [];
  if (children) {
    childrenRows = children.ids.map(id => {
      // inject id
      let child = children[id];
      child.id = id;
      return child;
    });
  }

  //donation data grid
  const donationColumns = [
    { field: 'id', headerName: 'ID', width: 130, type: 'number' },
    { field: 'name', headerName: 'Donor Name', width: 160 },
    { field: 'phone', headerName: 'Phone Number', width: 130 },
    { field: 'childName', headerName: 'Donate To', width: 160 },
    {
      field: 'date',
      headerName: 'Donation Date',
      width: 130,
      valueGetter: params => dayjs(params.data.date).format('h:mma MMM DD'),
    },
    {
      field: 'viewDonation',
      headerName: 'More',
      width: 80,
      sortable: false,
      renderCell: ({ data }) => (
        <Button
          color='primary'
          size='small'
          onClick={() => handleEditDonationClick(data.id)}
        >
          Details
        </Button>
      ),
    },
    {
      field: 'viewChild',
      headerName: 'Child',
      width: 120,
      sortable: false,
      renderCell: ({ data }) => (
        <Button
          color='primary'
          size='small'
          onClick={() => handleEditDonationClick(data.id)}
        >
          Child Info
        </Button>
      ),
    },
  ];
  let donationRows = [];
  if (donations) {
    donationRows = donations.ids.map(id => {
      // inject id
      let donation = donations[id];
      donation.id = id;
      return donation;
    });
  }
  const handleExpansion = (event, expanded) => {
    if (expanded) {
      getDonationsData(adminSecret).then(result => {
        if (result.status === 200) {
          result.json().then(({ content }) => {
            appDispatch({
              type: actions.receiveDonationsData,
              payload: content,
            });
          });
        }
        // not authorized redirect
        if (result.status === 403) {
          history.push('/login');
        }
      });
    }
  };
  const handleEditDonationClick = id => {
    console.log('edit donation button clicked, donation id:', id);
  };
  return (
    <>
      <Container>
        <PageHeader text='Admin Area' />
        {/*children accordion*/}
        <Accordion expanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id='children-expansion'
          >
            <Typography variant='h6'>Children</Typography>
          </AccordionSummary>
          <AccordionAction>
            <Button
              color='primary'
              size='small'
              startIcon={<CachedIcon />}
              variant='contained'
              onClick={() => setRefresh(true)}
            >
              Refresh
            </Button>
            <Button
              color='primary'
              size='small'
              variant='contained'
              onClick={handleAddChild}
            >
              Add a child
            </Button>
          </AccordionAction>
          <div style={{ height: 660, width: '100%' }}>
            <DataGrid
              rows={childrenRows}
              columns={childrenColumns}
              pageSize={10}
              autoHeight
              loading={childrenRows.length === 0}
            />
          </div>
        </Accordion>
        {/*donations accordion*/}
        <Accordion onChange={handleExpansion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id='children-expansion'
          >
            <Typography variant='h6'>Donations</Typography>
          </AccordionSummary>
          <div style={{ height: 660, width: '100%' }}>
            <DataGrid
              rows={donationRows}
              columns={donationColumns}
              pageSize={10}
              autoHeight
              loading={donationRows.length === 0}
            />
          </div>
        </Accordion>
        <ActionArea>
          <Button variant='text' color='primary' component={Link} to='/'>
            back
          </Button>
        </ActionArea>
      </Container>

      <AddChildModal
        isModalOpen={isAddChildModalOpen}
        setModalOpen={setAddChildModalOpen}
      />
      <EditChildModal
        isModalOpen={isEditChildModalOpen}
        setModalOpen={setEditChildModalOpen}
        id={childId}
      />
      {isLoading && <ProgressBar position='fixed' />}
    </>
  );
};

const Container = styled.section`
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
const AccordionAction = styled.div`
  padding: 0 1rem 1rem;
  display: flex;
  justify-content: flex-end;
  > * {
    margin-left: 1rem;
  }
`;
const ActionArea = styled.footer`
  padding: 1rem;
  display: flex;
  justify-content: center;
`;
export default Admin;
