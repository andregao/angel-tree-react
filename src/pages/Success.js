import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

const supportEmail = 'example@school.com';

const Success = () => {
  const {
    appState: { donorInfo },
  } = useContext(AppContext);
  const { name, email } = donorInfo;
  return (
    <Container>
      <Typography variant='h4'>Thanks{name && ` ${name}`}!</Typography>
      <Typography variant='body1'>
        We are sending an email with information regarding your donation
        commitment
        <em>{email && ` to ${email}`}</em>. Look forward to seeing you at the
        school!
      </Typography>
      <Typography variant='body2'>
        any question please email us at{' '}
        <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
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
export default Success;
