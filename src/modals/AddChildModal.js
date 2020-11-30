import React, { useContext, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import styled from 'styled-components/macro';
import { itemsToArray } from '../services/utils';
import { postNewChild } from '../services/api';
import { AppContext } from '../App';
import { actions } from '../services/state';
import { useHistory } from 'react-router-dom';
import ChildForm from '../components/ChildForm';
import ProgressBar from '../components/ProgressBar';

const initialChildState = {
  name: '',
  age: '',
  gender: '',
  wishes: [],
  sizes: [],
};

const AddChildModal = ({ isModalOpen, setModalOpen }) => {
  const history = useHistory();

  // add a child
  const { appState, appDispatch } = useContext(AppContext);
  const [currentChild, setCurrentChild] = useState(initialChildState);
  const [isSubmitting, setSubmitting] = useState(false);
  // console.log({ currentChild });
  const handleCloseModal = () => {
    setCurrentChild(initialChildState);
    setSubmitting(false);
    setModalOpen(false);
  };
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
        <ChildForm
          handleCloseModal={handleCloseModal}
          isSubmitting={isSubmitting}
          handleSave={handleSave}
          handleChange={handleChange}
          data={currentChild}
          readOnly={false}
        />

        {isSubmitting && <ProgressBar position='absolute' />}
      </Container>
    </Dialog>
  );
};

const Container = styled.section`
  padding: 1rem;
  position: relative;
`;

export default AddChildModal;
