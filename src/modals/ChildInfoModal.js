import React, { useContext, useEffect } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ChildInfo from '../components/ChildInfo';
import DialogContent from '@material-ui/core/DialogContent';
import { Link } from 'react-router-dom';
import { getChildInfo } from '../services/api';
import { actions } from '../services/state';
import { AppContext } from '../App';

const ChildInfoModal = ({ currentChildId, isModalOpen, setModalOpen }) => {
  const handleCloseModal = () => setModalOpen(false);

  const { appState, appDispatch } = useContext(AppContext);
  useEffect(() => {
    !appState[currentChildId].wishes &&
      getChildInfo(currentChildId).then(data =>
        appDispatch({ type: actions.receiveChildInfo, payload: data })
      );
  }, [currentChildId]);

  console.log('children state', appState);
  return (
    <Dialog
      aria-labelledby='child information popup'
      onClose={handleCloseModal}
      open={isModalOpen}
      scroll='paper'
    >
      <DialogTitle id='child-information'>
        {appState[currentChildId].age} YEAR OLD{' '}
        {appState[currentChildId].gender.toLowerCase() === 'male'
          ? 'BOY'
          : 'GIRL'}
      </DialogTitle>
      <DialogContent dividers style={{ backgroundColor: '#f5f5f5' }}>
        <ChildInfo childInfo={appState[currentChildId]} />
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={handleCloseModal}>
          Back
        </Button>
        <Button
          variant='contained'
          color='primary'
          autoFocus
          component={Link}
          to={`/donate/${currentChildId}`}
        >
          Donate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChildInfoModal;
