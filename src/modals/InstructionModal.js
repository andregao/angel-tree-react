import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { INSTRUCTIONS } from '../services/config';

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
        <DialogContentText tabIndex={-1}>{INSTRUCTIONS}</DialogContentText>
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
