import React, { useContext, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components/macro';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { itemsFromArray, itemsToArray } from '../services/utils';
import { postNewChild } from '../services/api';
import LinearProgress from '@material-ui/core/LinearProgress';
import { AppContext } from '../App';
import { actions } from '../services/state';
import { useHistory } from 'react-router-dom';

const initialChildState = {
  name: '',
  age: '',
  gender: '',
  wishes: [],
  sizes: [],
};

const EditChildModal = ({ isModalOpen, setModalOpen, childData, setData }) => {
  // const { name, gender, age, wishes, sizes, id, donated } = childData;
  const history = useHistory();

  // add a child
  const { appState, appDispatch } = useContext(AppContext);
  const [currentChild, setCurrentChild] = useState(initialChildState);
  const [isSubmitting, setSubmitting] = useState(false);
  console.log({ currentChild });
  const { name, gender, age, wishes, sizes } = currentChild;
  const handleCloseModal = () => {
    setCurrentChild(initialChildState);
    setSubmitting(false);
    setModalOpen(false);
  };
  const [defaultValues] = useState(() => ({
    wishes: itemsFromArray(wishes),
    sizes: itemsFromArray(sizes),
  }));
  const handleChange = ({ target: { name, value } }) => {
    if (name === 'wishes' || name === 'sizes') {
      value = itemsToArray(value);
    }
    setCurrentChild({ ...currentChild, [name]: value });
  };
  const handleSave = () => {
    setSubmitting(true);
    const { adminSecret } = appState;
    postNewChild(currentChild, adminSecret).then(result => {
      if (result.status === 200) {
        result.json().then(child => {
          appDispatch({ type: actions.receiveChildDetails, payload: child });
          handleCloseModal();
        });
      }
      // not authorized redirect
      if (result.status === 403) {
        history.push('/login');
      }
    });
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
            />
            <FormControl variant='outlined'>
              <InputLabel id='select-gender-label'>Gender</InputLabel>
              <Select
                labelId='select-gender-label'
                id='select-gender'
                value={gender}
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
              value={age}
              type='number'
              name={'age'}
              onChange={handleChange}
            />
            <TextField
              label='Wishes'
              variant='outlined'
              required
              defaultValue={defaultValues.wishes}
              helperText='Use commas to separate the items'
              name={'wishes'}
              onChange={handleChange}
            />
            <TextField
              label='Sizes'
              variant='outlined'
              defaultValue={defaultValues.sizes}
              helperText='Use commas to separate each size'
              name={'sizes'}
              onChange={handleChange}
            />
          </InputArea>
          <ActionArea>
            {/*{id !== undefined && (*/}
            {/*  <Button*/}
            {/*    variant='text'*/}
            {/*    color='secondary'*/}
            {/*    onClick={handleCloseModal}*/}
            {/*    disabled={donated}*/}
            {/*  >*/}
            {/*    delete*/}
            {/*  </Button>*/}
            {/*)}*/}
            <Button variant='text' onClick={handleCloseModal}>
              cancel
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSave}
              disabled={isSubmitting}
            >
              save
            </Button>
          </ActionArea>
        </form>
        {isSubmitting && <ProgressBar />}
      </Container>
    </Dialog>
  );
};

const Container = styled.section`
  padding: 1rem;
  position: relative;
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
const ProgressBar = styled(LinearProgress)`
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
`;
export default EditChildModal;
