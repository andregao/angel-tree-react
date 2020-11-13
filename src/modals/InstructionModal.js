import React from 'react';
import styled from 'styled-components/macro';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { instructions } from '../mock';
import Button from '@material-ui/core/Button';

const InstructionModal = ({ isModalOpen, setModalOpen }) => {
  const handleCloseModal = () => setModalOpen(false);
  return (
    <Dialog
      aria-labelledby='instructions popup'
      onClose={handleCloseModal}
      open={isModalOpen}
      scroll='paper'
    >
      <Container>
        <Typography variant='h4' gutterBottom>
          How it works
        </Typography>
        <Typography variant='body1'>{instructions}</Typography>
        <ActionArea>
          <Button
            variant='text'
            color='primary'
            onClick={() => setModalOpen(false)}
          >
            ok
          </Button>
        </ActionArea>
      </Container>
    </Dialog>
  );
};
const Container = styled.section`
  padding: 1rem;
  white-space: pre-wrap;
`;
const ActionArea = styled.footer`
  display: flex;
  justify-content: center;
`;
export default InstructionModal;
