import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ChildInfo from '../components/ChildInfo';
import DialogContent from '@material-ui/core/DialogContent';
import { Link } from 'react-router-dom';

const ChildInfoModal = ({ currentChildInfo, isModalOpen, setModalOpen }) => {
  console.log('in child detail modal');
  const handleCloseModal = () => setModalOpen(false);
  return (
    <Dialog
      aria-labelledby='child information popup'
      onClose={handleCloseModal}
      open={isModalOpen}
      scroll='paper'
    >
      <DialogTitle id='child-information'>
        {currentChildInfo.age} year old{' '}
        {currentChildInfo.gender.toLowerCase() === 'male' ? 'boy' : 'girl'}
      </DialogTitle>
      <DialogContent dividers style={{ backgroundColor: '#f5f5f5' }}>
        <ChildInfo childInfo={currentChildInfo} />
      </DialogContent>
      <DialogActions>
        <Button
          color='primary'
          onClick={handleCloseModal}
          disabled={currentChildInfo.committed}
        >
          Back
        </Button>
        <Button
          variant='contained'
          color='primary'
          autoFocus
          component={Link}
          to={`/pledge/${currentChildInfo.id}`}
          disabled={currentChildInfo.committed}
        >
          Help this child
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChildInfoModal;
