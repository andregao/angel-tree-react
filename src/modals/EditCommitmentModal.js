import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import { itemsToArray } from '../services/utils';
import Button from '@material-ui/core/Button';
import styled from 'styled-components/macro';

const EditCommitmentModal = ({
  isModalOpen,
  setModalOpen,
  commitmentData,
  setData,
  clickedField,
}) => {
  const { name, email, phone, id } = commitmentData;
  const handleCloseModal = () => setModalOpen(false);
  const handleChange = ({ target: { name, value } }) => {
    if (name === 'wishes' || name === 'sizes') {
      value = itemsToArray(value);
    }
    setData({ ...commitmentData, [name]: value });
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
              autoFocus={clickedField === 'name'}
            />
            <TextField
              label='Email'
              variant='outlined'
              required
              value={email}
              name={'email'}
              onChange={handleChange}
              autoFocus={clickedField === 'email'}
            />
            <TextField
              label='Phone'
              variant='outlined'
              required
              value={phone}
              name={'phone'}
              onChange={handleChange}
              autoFocus={clickedField === 'phone'}
            />
          </InputArea>
          <ActionArea>
            {/*{id !== undefined && (*/}
            {/*  <Button*/}
            {/*    variant='text'*/}
            {/*    color='secondary'*/}
            {/*    onClick={() => setModalOpen(false)}*/}
            {/*  >*/}
            {/*    delete*/}
            {/*  </Button>*/}
            {/*)}*/}
            <Button variant='text' onClick={() => setModalOpen(false)}>
              cancel
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => setModalOpen(false)}
            >
              save
            </Button>
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

export default EditCommitmentModal;
