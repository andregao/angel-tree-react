import React, { useContext } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { ChildrenContext } from '../App';
import { actions } from '../services/state';

const Login = () => {
  const history = useHistory();
  const {
    childrenState: { adminSecret },
    childrenDispatch,
  } = useContext(ChildrenContext);

  const handleClick = e => {
    e.preventDefault();
    history.push('/admin');
  };
  const handleChange = ({ target: { value } }) =>
    childrenDispatch({ type: actions.receiveAdminSecret, payload: value });
  return (
    <Container>
      <Typography variant='h2' gutterBottom>
        Admin Login
      </Typography>
      <TextField
        label='enter secret phrase'
        variant='outlined'
        fullWidth
        value={adminSecret}
        onChange={handleChange}
        required
      />
      <Button
        variant='contained'
        color='primary'
        onClick={handleClick}
        type='submit'
        disabled={!adminSecret}
      >
        Let me in
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
  text-align: center;
  > * {
    max-width: 600px;
  }
  > :last-child {
    margin-top: 1rem;
  }
`;

export default Login;
