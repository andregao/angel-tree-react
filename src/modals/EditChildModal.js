import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components/macro';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { itemsFromArray, itemsToArray } from '../utils';

const EditChildModal = ({
  isModalOpen,
  setModalOpen,
  childData,
  setData,
  clickedField,
}) => {
  const { name, gender, age, wishes, sizes, id, committed } = childData;

  const handleCloseModal = () => setModalOpen(false);
  const handleChange = ({ target: { name, value } }) => {
    if (name === 'wishes' || name === 'sizes') {
      value = itemsToArray(value);
    }
    setData({ ...childData, [name]: value });
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
            <FormControl variant='outlined'>
              <InputLabel id='select-gender-label'>Gender</InputLabel>
              <Select
                labelId='select-gender-label'
                id='select-gender'
                value={gender}
                name={'gender'}
                onChange={handleChange}
              >
                <MenuItem value='male'>Male</MenuItem>
                <MenuItem value='female'>Female</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label='Age'
              variant='outlined'
              required
              value={age}
              type='number'
              name={'age'}
              onChange={handleChange}
              autoFocus={clickedField === 'age'}
            />
            <TextField
              label='Wishes'
              variant='outlined'
              required
              defaultValue={itemsFromArray(wishes)}
              helperText='Use commas to separate the items'
              name={'wishes'}
              onChange={handleChange}
              autoFocus={clickedField === 'wishes'}
            />
            <TextField
              label='Sizes'
              variant='outlined'
              defaultValue={itemsFromArray(sizes)}
              helperText='Use commas to separate each size'
              name={'sizes'}
              onChange={handleChange}
              autoFocus={clickedField === 'sizes'}
            />
          </InputArea>
          <ActionArea>
            {id !== undefined && (
              <Button
                variant='text'
                color='secondary'
                onClick={handleCloseModal}
                disabled={committed}
              >
                delete
              </Button>
            )}
            <Button variant='text' onClick={handleCloseModal}>
              cancel
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleCloseModal}
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
export default EditChildModal;
