import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { getChildInfo } from '../services/api';
import { actions } from '../services/state';
import dayjs from 'dayjs';

const PickAnother = () => {
  // get information from state
  const { appState, appDispatch } = useContext(AppContext);
  const { name, childId } = appState.donorInfo;
  const { date } = appState[childId];

  // Fetch latest child information on render
  useEffect(() => {
    getChildInfo(childId).then(data =>
      appDispatch({ type: actions.receiveChildInfo, payload: data })
    );
  }, [childId]);

  return (
    <Container>
      <Typography variant='h4'>Oops</Typography>
      <Typography variant='body1'>
        Sorry{name && ` ${name}`}. Someone else had just made a commitment to
        this child{date && ` ${dayjs(date).fromNow()}`}, Let's go back and pick
        another one!
      </Typography>
      <Button variant='text' color='primary' component={Link} to='/'>
        Back
      </Button>
    </Container>
  );
};
const Container = styled.section`
  height: 100vh;
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > * {
    margin-bottom: 1rem;
  }
`;
export default PickAnother;
