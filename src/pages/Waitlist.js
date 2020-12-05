import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { TreeContext } from '../App';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import { postWaitlist } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import { dayjsExtended } from '../services/utils';

const formInitialValues = { name: '', email: '', phone: '' };
const Waitlist = () => {
  const {
    treeState: { children, updated },
  } = useContext(TreeContext);
  const count = children?.length || 0;
  const [values, setValues] = useState(formInitialValues);
  const { name, email, phone } = values;
  const [isSubmitting, setSubmitting] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const handleSubmit = e => {
    setSubmitting(true);
    e.preventDefault();
    console.log(values);
    postWaitlist(values).then(result => {
      if (result.status === 200) {
        // success modal
        setDialogOpen(true);
      } else {
        // try again snackbar
        setSnackbarOpen(true);
      }
      setSubmitting(false);
    });
  };
  const handleChange = ({ target: { name, value } }) => {
    setValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  return (
    <Container>
      <Typography variant='h2' color='primary'>
        WE DID IT!
      </Typography>
      <Typography variant='h6' gutterBottom>
        All {count > 0 && `${count} `}angels has been donated
        {updated && ` ${dayjsExtended(updated).fromNow()}`}!
      </Typography>
      <Typography variant='body1'>
        If you would like us to contact you when more angels become available
        for donation. Please enter your information below. Thank you and happy
        holidays!
      </Typography>
      <form onSubmit={handleSubmit}>
        <InputArea>
          <TextField
            label='Full Name'
            variant='outlined'
            required
            name='name'
            value={name}
            onChange={handleChange}
          />
          <TextField
            label='Email'
            type='email'
            variant='outlined'
            required
            name='email'
            value={email}
            onChange={handleChange}
          />
          <TextField
            label='Phone Number'
            type='tel'
            variant='outlined'
            required
            name='phone'
            value={phone}
            onChange={handleChange}
          />
        </InputArea>
        <Button
          color='primary'
          variant='contained'
          type='submit'
          disabled={!name || isSubmitting}
        >
          Submit
        </Button>
      </form>
      <Button
        variant='text'
        color='primary'
        component={Link}
        to='/'
        disabled={isSubmitting}
      >
        Back
      </Button>
      <Dialog open={isDialogOpen}>
        <DialogTitle>Thank You</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>We received your information</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' component={Link} to='/'>
            Back
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transitionDuration={800}
        autoHideDuration={3000}
        open={isSnackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message='An error occurred, please try again'
      />
      {isSubmitting && <ProgressBar position='fixed' />}
    </Container>
  );
};

const Container = styled.section`
  margin: auto;
  padding: 0 1rem;
  min-height: 100vh;
  max-width: 600px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  > :last-child {
    margin-top: 0.5rem;
  }
`;
const InputArea = styled.section`
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  & > * {
    margin-bottom: 0.8rem;
  }
`;
export default Waitlist;
