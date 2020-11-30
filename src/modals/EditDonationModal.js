import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styled from 'styled-components/macro';

const EditDonationModal = ({
  isModalOpen,
  setModalOpen,
  data,
  setData,
  readOnly,
}) => {
  const { name, phone, email } = data;

  const handleCloseModal = () => {
    setModalOpen(false);
    setData(null);
  };
  const handleChange = ({ target: { name, value } }) => {
    setData({ ...data, [name]: value });
  };
  return (
    <Dialog
      aria-labelledby='edit data popup'
      onClose={handleCloseModal}
      open={isModalOpen}
      scroll='paper'
    >
      <Container>
        <form>
          <InputArea>
            <TextField
              label='Full Name'
              variant='outlined'
              required
              value={name}
              name={'name'}
              onChange={handleChange}
              InputProps={{
                readOnly,
              }}
            />
            <TextField
              label='Email'
              variant='outlined'
              required
              value={email}
              name={'email'}
              onChange={handleChange}
              InputProps={{
                readOnly,
              }}
            />
            <TextField
              label='Phone'
              variant='outlined'
              required
              value={phone}
              name={'phone'}
              onChange={handleChange}
              InputProps={{
                readOnly,
              }}
            />
          </InputArea>
          <ActionArea>
            {readOnly ? (
              <Button variant='text' onClick={handleCloseModal} fullWidth>
                close
              </Button>
            ) : (
              <>
                <Button
                  variant='text'
                  color='secondary'
                  size='small'
                  onClick={() => setModalOpen(false)}
                >
                  delete
                </Button>
                <Button variant='text' size='small' onClick={handleCloseModal}>
                  cancel
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  size='small'
                  onClick={() => setModalOpen(false)}
                >
                  save
                </Button>
              </>
            )}
          </ActionArea>
        </form>
      </Container>
    </Dialog>
  );
};

const Container = styled.section`
  padding: 1rem;
`;
const InputArea = styled.section`
  display: flex;
  flex-direction: column;
  & > * {
    margin-bottom: 0.8rem;
  }
`;
const ActionArea = styled.footer`
  display: flex;
  justify-content: space-between;
`;

export default EditDonationModal;
