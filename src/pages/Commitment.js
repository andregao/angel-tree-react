import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { children } from '../mock/mock';
import ChildDetails from '../components/ChildDetails';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InstructionModal from '../modals/InstructionModal';
import PageHeader from '../components/PageHeader';

const Commitment = () => {
  const { childId } = useParams();
  console.log('in commitment page', childId);
  const [isModalOpen, setModalOpen] = useState(false);
  const childInfo = children[childId];
  return (
    <>
      <Container maxWidth='sm' component='section'>
        <PageHeader text='Commitment Form' />
        <form>
          <InputArea>
            <TextField label='Full Name' variant='outlined' required />
            <TextField label='Email' variant='outlined' required />
            <TextField label='Phone' variant='outlined' />
          </InputArea>
          <InfoArea>
            <Typography variant='h6' align='center' gutterBottom>
              Buying for a {childInfo?.age} year old{' '}
              {childInfo?.gender.toLowerCase() === 'male' ? 'boy' : 'girl'}
            </Typography>
            {childInfo && <ChildDetails childInfo={childInfo} />}
            <Button
              variant='text'
              color='primary'
              onClick={() => setModalOpen(true)}
            >
              Instructions
            </Button>
          </InfoArea>
          <ActionArea>
            <FormControlLabel
              control={<Checkbox checked name='agreement' />}
              label='I commit to give to this child'
            />
            <Button variant='contained' color='primary'>
              submit
            </Button>
            <Button variant='text' component={Link} to='/'>
              back
            </Button>
          </ActionArea>
        </form>
      </Container>
      <InstructionModal {...{ isModalOpen, setModalOpen }} />
    </>
  );
};

const InputArea = styled.section`
  display: flex;
  flex-direction: column;
  & > * {
    margin-bottom: 0.8rem;
  }
`;
const InfoArea = styled.section`
  padding: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
const ActionArea = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    margin-bottom: 1rem;
  }
`;

export default Commitment;
