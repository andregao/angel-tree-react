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
import { ChildrenContext } from '../App';

const ChildInfoModal = ({ currentChildId, isModalOpen, setModalOpen }) => {
  const handleCloseModal = () => setModalOpen(false);

  const { childrenState, childrenDispatch } = useContext(ChildrenContext);
  useEffect(() => {
    !childrenState[currentChildId].wishes &&
      getChildInfo(currentChildId).then(data =>
        childrenDispatch({ type: actions.receiveChildInfo, payload: data })
      );
  }, [currentChildId]);

  console.log('children state', childrenState);
  return (
    <Dialog
      aria-labelledby='child information popup'
      onClose={handleCloseModal}
      open={isModalOpen}
      scroll='paper'
    >
      <DialogTitle id='child-information'>
        {childrenState[currentChildId].age} YEAR OLD{' '}
        {childrenState[currentChildId].gender.toLowerCase() === 'male'
          ? 'BOY'
          : 'GIRL'}
      </DialogTitle>
      <DialogContent dividers style={{ backgroundColor: '#f5f5f5' }}>
        <ChildInfo childInfo={childrenState[currentChildId]} />
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
