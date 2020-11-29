import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import styled from 'styled-components/macro';
import { itemsFromArray } from '../services/utils';

const ChildForm = ({
  data,
  isSubmitting,
  handleChange,
  handleSave,
  handleCloseModal,
  handleDelete,
}) => {
  const { name, gender, age, wishes, sizes } = data;
  return (
    <form>
      <InputArea>
        <TextField
          label='Full Name'
          variant='outlined'
          required
          defaultValue={name}
          name={'name'}
          onChange={handleChange}
        />
        <FormControl variant='outlined' required>
          <InputLabel id='select-gender-label'>Gender</InputLabel>
          <Select
            labelId='select-gender-label'
            id='select-gender'
            defaultValue={gender}
            name='gender'
            label='Gender'
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
          defaultValue={age}
          type='number'
          name={'age'}
          onChange={handleChange}
        />
        <TextField
          label='Wishes'
          variant='outlined'
          required
          defaultValue={itemsFromArray(wishes)}
          helperText='Use commas to separate the items'
          name={'wishes'}
          onChange={handleChange}
        />
        <TextField
          label='Sizes'
          variant='outlined'
          defaultValue={itemsFromArray(sizes)}
          helperText='Use commas to separate each size'
          name={'sizes'}
          onChange={handleChange}
        />
      </InputArea>
      <ActionArea>
        {handleDelete && (
          <Button
            variant='text'
            color='secondary'
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            delete
          </Button>
        )}
        <Button
          variant='text'
          onClick={handleCloseModal}
          disabled={isSubmitting}
        >
          cancel
        </Button>
        <Button
          variant='contained'
          color='primary'
          type='submit'
          onClick={handleSave}
          disabled={isSubmitting}
        >
          save
        </Button>
      </ActionArea>
    </form>
  );
};
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
export default ChildForm;
