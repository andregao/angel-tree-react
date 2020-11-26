import React from 'react';
import Typography from '@material-ui/core/Typography';
import dayjs from 'dayjs';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import Paper from '@material-ui/core/Paper';

const DonatedNotice = ({ date }) => {
  return (
    <DonatedNoticeContainer>
      <DonatedNoticePaper>
        <Typography variant='h5' gutterBottom>
          GREAT NEWS!
        </Typography>
        <Typography variant='body1' gutterBottom>
          {' '}
          Someone just made a commitment donating to this child{' '}
          {dayjs(date).fromNow()}
        </Typography>
        <Button variant='contained' color='primary' component={Link} to='/'>
          Pick another
        </Button>
      </DonatedNoticePaper>
    </DonatedNoticeContainer>
  );
};
const DonatedNoticeContainer = styled.section`
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 1rem;
  > * {
    z-index: 101;
  }
`;

const DonatedNoticePaper = styled(Paper)`
  padding: 2rem 1rem;
  text-align: center;
  > :last-child {
    margin-top: 1rem;
  }
`;
export default DonatedNotice;
