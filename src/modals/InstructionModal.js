import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const instructions = `If you would like to donate to one of our angels please check which angel by clicking on the ornament. (Or angel if you change it) please fill out your name, email and phone number and be sure to click submit. 

The information will be emailed to you. Please make sure to drop off the gifts to Mater Bonanza’s front office no later than December 14th.

4760 East Bonanza Road, Las Vegas, NV 89110.

Thank you for your giving hearts and participation. Happy Holidays!
`;
const InstructionModal = ({ isModalOpen, setModalOpen }) => {
  const handleCloseModal = () => setModalOpen(false);
  return (
    <Dialog
      aria-labelledby='instructions popup'
      onClose={handleCloseModal}
      open={isModalOpen}
      scroll='paper'
    >
      <DialogTitle>
        Welcome to Mater Academy Bonanza’s 2020 Virtual Angel Tree
      </DialogTitle>
      <StyledContent dividers>
        <DialogContentText tabIndex={-1}>{instructions}</DialogContentText>
      </StyledContent>
      <ActionArea>
        <Button
          variant='text'
          color='primary'
          onClick={() => setModalOpen(false)}
        >
          ok
        </Button>
      </ActionArea>
    </Dialog>
  );
};
const StyledContent = styled(DialogContent)`
  white-space: pre-wrap;
`;

const ActionArea = styled(DialogActions)`
  display: flex;
  justify-content: center;
`;
export default InstructionModal;
