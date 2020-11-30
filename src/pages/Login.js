import React, { useContext } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../App';
import { actions } from '../services/state';
import PageHeader from '../components/PageHeader';

const Login = () => {
  const history = useHistory();
  const {
    appState: { adminSecret },
    appDispatch,
  } = useContext(AppContext);

  const handleLogin = e => {
    e.preventDefault();
    history.push('/admin');
  };
  const handleBack = () => {
    history.push('/');
  };
  const handleChange = ({ target: { value } }) =>
    appDispatch({ type: actions.receiveAdminSecret, payload: value });
  return (
    <Container>
      <PageHeader text='Admin Login' />
      <TextField
        label='enter secret phrase'
        variant='outlined'
        fullWidth
        value={adminSecret}
        onChange={handleChange}
        required
      />
      <Button
        variant='outlined'
        color='primary'
        onClick={handleLogin}
        type='submit'
        disabled={!adminSecret}
      >
        Let me in
      </Button>
      <Button variant='contained' color='primary' onClick={handleBack}>
        Oops, back to tree
      </Button>
    </Container>
  );
};
const Container = styled.form`
  height: 100vh;
  padding: 20% 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > * {
    max-width: 600px;
  }
  > button {
    margin-top: 1rem;
  }
`;

export default Login;
