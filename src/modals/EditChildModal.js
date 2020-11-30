import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { deleteChild, getChildInfo, updateChild } from '../services/api';
import { actions } from '../services/state';
import Dialog from '@material-ui/core/Dialog';
import styled from 'styled-components/macro';
import ChildForm from '../components/ChildForm';
import { itemsToArray } from '../services/utils';
import { useHistory } from 'react-router-dom';
import Heart from '../components/Heart';
import ProgressBar from '../components/ProgressBar';
import { LoadingText } from '../pages/Loading';

const EditChildModal = ({ isModalOpen, setModalOpen, id, readOnly }) => {
  const history = useHistory();
  const { appState, appDispatch } = useContext(AppContext);
  const [isSubmitting, setSubmitting] = useState(false);
  const [currentChild, setCurrentChild] = useState(null);

  let dataReady = !!(
    appState.children &&
    appState.children[id] &&
    appState.children[id].wishes
  );
  // console.log({ dataReady });
  // console.log('currentChild', currentChild);
  // fetch child info on load
  useEffect(() => {
    id &&
      getChildInfo(id).then(data => {
        appDispatch({ type: actions.receiveChildInfoAdmin, payload: data });
      });
  }, [id]);
  // update local state after fetching from app state
  useEffect(() => {
    dataReady && setCurrentChild(appState.children[id]);
    // console.log('current child id: in effect', id);
  }, [dataReady, id]);
  const handleCloseModal = () => {
    setSubmitting(false);
    dataReady = false;
    setModalOpen(false);
  };
  const handleSave = () => {
    setSubmitting(true);
    const { adminSecret } = appState;
    updateChild(currentChild, adminSecret).then(result => {
      if (result.status === 200) {
        appDispatch({
          type: actions.updateChildDetails,
          payload: currentChild,
        });
        handleCloseModal();
      }
      // not authorized redirect
      if (result.status === 403) {
        history.push('/login');
      }
    });
  };
  const handleChange = ({ target: { name, value } }) => {
    if (name === 'wishes' || name === 'sizes') {
      value = itemsToArray(value);
    }
    setCurrentChild({ ...currentChild, [name]: value });
  };
  const handleDelete = () => {
    setSubmitting(true);
    const { adminSecret } = appState;
    const { id } = currentChild;
    deleteChild(id, adminSecret).then(result => {
      setSubmitting(false);
      if (result.status === 200) {
        appDispatch({
          type: actions.deleteChild,
          payload: id,
        });
        handleCloseModal();
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
        {dataReady ? (
          <ChildForm
            handleCloseModal={handleCloseModal}
            isSubmitting={isSubmitting}
            data={appState.children[id]}
            handleSave={handleSave}
            handleChange={handleChange}
            handleDelete={handleDelete}
            readOnly={readOnly}
          />
        ) : (
          <section style={{ textAlign: 'center' }}>
            <Heart />
            <LoadingText>Loading Child Info</LoadingText>
          </section>
        )}
        {isSubmitting && <ProgressBar position='absolute' />}
      </Container>
    </Dialog>
  );
};
const Container = styled.section`
  padding: 1rem;
  position: relative;
`;
export default EditChildModal;
