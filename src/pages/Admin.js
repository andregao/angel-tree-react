import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { AppContext } from '../App';
import { Link, useHistory } from 'react-router-dom';
import {
  deleteDonation,
  getChildrenData,
  getDonationsData,
  updateDonation,
} from '../services/api';
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
import CachedIcon from '@material-ui/icons/Cached';
import DonationModal from '../modals/DonationModal';

const Admin = () => {
  const { appState, appDispatch } = useContext(AppContext);
  const { adminSecret, children, donations } = appState;
  // console.log('app state:', appState);
  // fetch summary data on render
  const history = useHistory();
  const [needRefresh, setRefresh] = useState(true);
  const [isLoading, setLoading] = useState(false);

  // donation data grid depends on children data for the child name
  // this flag counter act the race condition of two fetch requests
  const [childrenReady, setChildrenReady] = useState(false);
  useEffect(() => {
    if (needRefresh) {
      setLoading(true);
      let receivedChildren = false;
      let receivedDonations = false;
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
        setChildrenReady(true);
        receivedChildren = true;
        receivedDonations && setLoading(false);
      });
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
        receivedDonations = true;
        receivedChildren && setLoading(false);
      });
      setRefresh(false);
    }
  }, [needRefresh]);

  // add, edit and view children
  const [isAddChildModalOpen, setAddChildModalOpen] = useState(false);
  const [isEditChildModalOpen, setEditChildModalOpen] = useState(false);
  const [childId, setChildId] = useState(null);
  const [childReadOnly, setChildReadOnly] = useState(false);

  const handleAddChild = () => setAddChildModalOpen(true);
  const handleEditChildClick = id => {
    setChildReadOnly(false);
    setChildId(id);
    setEditChildModalOpen(true);
  };
  const handleViewChildClick = id => {
    setChildReadOnly(true);
    setChildId(id);
    setEditChildModalOpen(true);
  };

  // view and edit donation info
  const [isDonationModalOpen, setDonationModalOpen] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [donationReadOnly, setDonationReadOnly] = useState(true);
  const [donationModalSubmitting, setDonationModalSubmitting] = useState(false);
  // console.log('current donation:', currentDonation);
  const handleDonationInfoClick = id => {
    setDonationReadOnly(true);
    setCurrentDonation(appState.donations[id]);
    setDonationModalOpen(true);
  };
  const handleEditDonationClick = id => {
    setDonationReadOnly(false);
    setCurrentDonation(appState.donations[id]);
    setDonationModalOpen(true);
  };
  const handleDeleteDonation = () => {
    setDonationModalSubmitting(true);
    const { id } = currentDonation;
    deleteDonation(id, adminSecret).then(result => {
      setDonationModalSubmitting(false);
      if (result.status === 200) {
        appDispatch({
          type: actions.deleteDonation,
          payload: id,
        });
        setDonationModalOpen(false);
        setCurrentDonation(null);
      }
      // not authorized redirect
      if (result.status === 403) {
        history.push('/login');
      }
    });
  };
  const handleSaveDonation = () => {
    setDonationModalSubmitting(true);

    updateDonation(currentDonation, adminSecret).then(result => {
      setDonationModalSubmitting(false);
      if (result.status === 200) {
        appDispatch({
          type: actions.updateDonationDetails,
          payload: currentDonation,
        });
        setDonationModalOpen(false);
        setCurrentDonation(null);
      }
      // not authorized redirect
      if (result.status === 403) {
        history.push('/login');
      }
    });
  };

  // children data grid
  const childrenColumns = [
    { field: 'id', headerName: 'ID', width: 130, type: 'number' },
    { field: 'name', headerName: 'Child Name', width: 170 },
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      sortable: false,
      renderCell: ({ data }) =>
        data.donated ? (
          <Button size='small' onClick={() => handleViewChildClick(data.id)}>
            View
          </Button>
        ) : (
          <Button
            color='primary'
            size='small'
            onClick={() => handleEditChildClick(data.id)}
          >
            Edit
          </Button>
        ),
    },
    { field: 'donated', headerName: 'Donated', width: 90 },
    { field: 'donorName', headerName: 'Donor Name', width: 170 },
    {
      field: 'viewDonor',
      headerName: 'Donation',
      width: 90,
      sortable: false,
      renderCell: ({ data }) => (
        <Button
          color='primary'
          size='small'
          disabled={!data.donated}
          onClick={() => handleDonationInfoClick(data.donationId)}
        >
          Info
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
  const getChildName = params => {
    const childId = params.getValue('childId');
    return appState.children[childId].name;
  };
  const donationColumns = [
    { field: 'id', headerName: 'ID', width: 130, type: 'number' },
    { field: 'name', headerName: 'Donor Name', width: 160 },
    { field: 'phone', headerName: 'Phone Number', width: 130 },
    {
      field: 'viewDonation',
      headerName: 'Action',
      width: 80,
      sortable: false,
      renderCell: ({ data }) => (
        <Button
          color='primary'
          size='small'
          onClick={() => handleEditDonationClick(data.id)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: 'childName',
      headerName: 'Donate To',
      width: 160,
      valueGetter: getChildName,
    },
    {
      field: 'viewChild',
      headerName: 'More',
      width: 120,
      sortable: false,
      renderCell: ({ data }) => (
        <Button
          variant='outlined'
          size='small'
          onClick={() => handleViewChildClick(data.childId)}
        >
          Child Info
        </Button>
      ),
    },
    {
      field: 'date',
      headerName: 'Donation Date',
      width: 130,
      valueGetter: params => dayjs(params.data.date).format('MM/DD h:mma'),
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

  return (
    <>
      <Container>
        <PageHeader text='Admin Area' />
        {/*children accordion*/}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id='children-expansion'
          >
            <Typography variant='h6'>Children List</Typography>
          </AccordionSummary>
          <AccordionAction>
            <Button
              size='small'
              startIcon={<CachedIcon />}
              variant='outlined'
              color='primary'
              onClick={() => setRefresh(true)}
              disabled={isLoading}
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
              loading={isLoading}
            />
          </div>
        </Accordion>
        {/*donations accordion*/}
        {childrenReady && (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id='children-expansion'
            >
              <Typography variant='h6'>Donations List</Typography>
            </AccordionSummary>
            <AccordionAction>
              <Button
                color='primary'
                size='small'
                startIcon={<CachedIcon />}
                variant='outlined'
                onClick={() => setRefresh(true)}
                disabled={isLoading}
              >
                Refresh
              </Button>
            </AccordionAction>
            <div style={{ height: 660, width: '100%' }}>
              <DataGrid
                rows={donationRows}
                columns={donationColumns}
                pageSize={10}
                autoHeight
                loading={isLoading}
              />
            </div>
          </Accordion>
        )}
        <ActionArea>
          <Button variant='text' color='primary' component={Link} to='/'>
            back
          </Button>
        </ActionArea>
      </Container>

      {isAddChildModalOpen && (
        <AddChildModal
          isModalOpen={isAddChildModalOpen}
          setModalOpen={setAddChildModalOpen}
        />
      )}
      {isEditChildModalOpen && (
        <EditChildModal
          isModalOpen={isEditChildModalOpen}
          setModalOpen={setEditChildModalOpen}
          id={childId}
          readOnly={childReadOnly}
        />
      )}
      {isDonationModalOpen && (
        <DonationModal
          isModalOpen={isDonationModalOpen}
          setModalOpen={setDonationModalOpen}
          data={currentDonation}
          setData={setCurrentDonation}
          handleDelete={handleDeleteDonation}
          handleSave={handleSaveDonation}
          readOnly={donationReadOnly}
          isSubmitting={donationModalSubmitting}
        />
      )}
    </>
  );
};

const Container = styled.section`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #fbf5e9;
  min-height: 100vh;
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
