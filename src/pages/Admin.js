import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
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
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import AddChildModal from '../modals/AddChildModal';
import dayjs from 'dayjs';
import EditChildModal from '../modals/EditChildModal';
import DonationModal from '../modals/DonationModal';
import DonationsAccordion from '../components/DonationsAccordion';
import ChildrenAccordion from '../components/ChildrenAccordion';

const Admin = () => {
  const { appState, appDispatch } = useContext(AppContext);
  const { adminSecret, children, donations } = appState;
  // console.log('app state:', appState);
  // fetch summary data on render
  const history = useHistory();
  const [needRefresh, setRefresh] = useState(true);
  const [isLoading, setLoading] = useState(false);

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
  const handleDonationReceived = (e, data) => {
    const updatedDonation = { ...data, received: !data.received };
    setLoading(true);
    updateDonation(updatedDonation, adminSecret).then(result => {
      setLoading(false);
      if (result.status === 200) {
        result.json().then(({ receiveDate }) => {
          appDispatch({
            type: actions.updateDonationDetails,
            payload: { ...updatedDonation, receiveDate },
          });
        });
      }
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
            variant='outlined'
            size='small'
            onClick={() => handleEditChildClick(data.id)}
          >
            Edit
          </Button>
        ),
    },
    { field: 'donated', headerName: 'Donated', width: 90 },
    {
      field: 'viewDonor',
      headerName: 'Donor Info',
      width: 120,
      sortable: false,
      renderCell: ({ data }) =>
        data.donated ? (
          <Button
            color='primary'
            size='small'
            disabled={!data.donated}
            onClick={() => handleDonationInfoClick(data.donationId)}
          >
            {data.donorName.split(' ')[0]}
          </Button>
        ) : (
          'No Donation'
        ),
    },
    {
      field: 'receiveDate',
      headerName: 'Items Received',
      width: 140,
      valueGetter: ({ data: { receiveDate } }) => {
        return receiveDate
          ? dayjs(receiveDate).format('MM/DD h:mma')
          : 'Not Received';
      },
    },
  ];
  let childrenRows = [];
  if (children) {
    childrenRows = children.ids.map(id => {
      // inject id, receive donation status
      let child = children[id];
      child.id = id;
      if (child.donationId) {
        child.receiveDate = donations[child.donationId].receiveDate || 0;
      }
      return child;
    });
  }

  //donation data grid
  const donationColumns = [
    { field: 'id', headerName: 'ID', width: 130, type: 'number' },
    { field: 'name', headerName: 'Donor Name', width: 160 },
    { field: 'phone', headerName: 'Phone Number', width: 130 },
    {
      field: 'viewDonation',
      headerName: 'Donor',
      width: 80,
      sortable: false,
      renderCell: ({ data }) => (
        <Button
          variant='outlined'
          color='primary'
          size='small'
          onClick={() => handleEditDonationClick(data.id)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: 'viewChild',
      headerName: 'Donate To',
      width: 120,
      sortable: false,
      renderCell: ({ data }) => (
        <Button
          color='primary'
          size='small'
          onClick={() => handleViewChildClick(data.childId)}
        >
          {data.childName.split(' ')[0]}
        </Button>
      ),
    },
    {
      field: 'markReceived',
      headerName: 'Received',
      width: 95,
      sortable: false,
      renderCell: ({ data }) => (
        <Checkbox
          color='primary'
          checked={data.received}
          onClick={e => handleDonationReceived(e, data)}
          inputProps={{ 'aria-label': 'received checkbox' }}
        />
      ),
    },
    {
      field: 'date',
      headerName: 'Donation Date',
      width: 130,
      valueGetter: params => dayjs(params.data.date).format('MM/DD h:mma'),
    },
    {
      field: 'receiveDate',
      headerName: 'Receive Date',
      width: 130,
      valueGetter: ({ data: { receiveDate } }) => {
        return receiveDate
          ? dayjs(receiveDate).format('MM/DD h:mma')
          : 'Not Received';
      },
    },
  ];
  let donationRows = [];
  if (donations?.ids?.length > 0 && children?.ids?.length > 0) {
    donationRows = donations.ids.map(id => {
      // inject id, child name and populate received attributes
      let donation = donations[id];
      donation.id = id;
      donation.childName = children[donation.childId].name;
      donation.received === undefined && (donation.received = false);
      donation.receiveDate === undefined && (donation.receiveDate = 0);
      return donation;
    });
  }

  return (
    <>
      <Container>
        <PageHeader text='Admin Area' />
        {/*children accordion*/}
        <ChildrenAccordion
          isLoading={isLoading}
          setRefresh={setRefresh}
          handleAddChild={handleAddChild}
          columns={childrenColumns}
          rows={childrenRows}
        />
        {/*donations accordion*/}
        {donationRows.length > 0 && (
          <DonationsAccordion
            setRefresh={setRefresh}
            isLoading={isLoading}
            rows={donationRows}
            columns={donationColumns}
          />
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

const ActionArea = styled.footer`
  padding: 1rem;
  display: flex;
  justify-content: center;
`;
export default Admin;
