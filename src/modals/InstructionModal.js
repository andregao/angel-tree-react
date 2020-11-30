import React from 'react';
import styled from 'styled-components/macro';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
      <Container>
        <Typography variant='h5' color='primary' gutterBottom>
          Welcome to Mater Academy Bonanza’s 2020 Virtual Angel Tree
        </Typography>
        <Typography variant='body1' gutterBottom>
          {instructions}
        </Typography>
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
