import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ChildInfo from '../components/ChildInfo';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InstructionModal from '../modals/InstructionModal';
import PageHeader from '../components/PageHeader';
import { ChildrenContext } from '../App';
import { getChildInfo, sendSubmission } from '../services/api';
import { actions } from '../services/state';
import Heart from '../components/Heart';
import dayjs from 'dayjs';
import Paper from '@material-ui/core/Paper';
import { validateForm } from '../services/utils';
import useForm from '../services/useForm';

const formInitialValues = { name: '', email: '', phone: '' };

const Donation = () => {
  const { childId } = useParams(); // id from path parameter
  const { childrenState, childrenDispatch } = useContext(ChildrenContext);
  console.log('childrenState:', childrenState);
  const childInfo = childrenState[childId];

  // form control
  const donorInfo = childrenState.donorInfo || formInitialValues;
  donorInfo.childId = childId; // embed current child id for post request
  const [isSubmitting, setSubmitting] = useState(false);
  const { values, handleChange, handleBlur, handleSubmit, errors } = useForm(
    donorInfo,
    validateForm,
    isSubmitting,
    submitting => setSubmitting(submitting),
    sendSubmission
  );
  console.log('errors', errors);

  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch latest child information on render
  useEffect(() => {
    getChildInfo(childId).then(data =>
      childrenDispatch({ type: actions.receiveChildInfo, payload: data })
    );
  }, [childId]);

  // save form data to app state on unmount
  const formValues = useRef(values);
  formValues.current = values;
  const saveForm = () =>
    childrenDispatch({
      type: actions.receiveDonorInfo,
      payload: formValues.current,
    });
  useEffect(() => saveForm, []);

  return (
    <>
      <Container>
        {childInfo?.donated && (
          <DonatedNoticeContainer>
            <DonatedNoticePaper>
              <Typography variant='h5' gutterBottom>
                GREAT NEWS!
              </Typography>
              <Typography variant='body1' gutterBottom>
                {' '}
                Someone just made a commitment donating to this child{' '}
                {dayjs(childInfo.date).fromNow()}
              </Typography>
              <Button
                variant='contained'
                color='primary'
                component={Link}
                to='/'
              >
                Pick another
              </Button>
            </DonatedNoticePaper>
          </DonatedNoticeContainer>
        )}
        <PageHeader text='Commitment Form' />
        <form onSubmit={handleSubmit}>
          <InputArea>
            <TextField
              autoFocus
              label='Full Name'
              variant='outlined'
              required
              name='name'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              helperText={errors.name}
              error={!!errors.name}
            />
            <TextField
              label='Email'
              variant='outlined'
              required
              name='email'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              helperText={errors.email}
              error={!!errors.email}
            />
            <TextField
              label='Phone'
              variant='outlined'
              required
              name='phone'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.phone}
              helperText={errors.phone}
              error={!!errors.phone}
            />
          </InputArea>
          {childInfo ? (
            <InfoArea>
              <Typography variant='h6' align='center' gutterBottom>
                Donating to a {childInfo?.age} year old{' '}
                {childInfo.gender.toLowerCase() === 'male' ? 'boy' : 'girl'}
              </Typography>
              <ChildInfo childInfo={childInfo} />
              <Button
                variant='text'
                color='primary'
                onClick={() => setModalOpen(true)}
              >
                Instructions
              </Button>
            </InfoArea>
          ) : (
            <InfoAreaSkeleton>
              <Heart />
              <h2>Getting Child Info</h2>
            </InfoAreaSkeleton>
          )}
          <ActionArea>
            <FormControlLabel
              control={<Checkbox checked name='agreement' />}
              label='I commit to give to this child'
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={
                childInfo?.donated ||
                isSubmitting ||
                Object.keys(errors).length !== 0
              }
            >
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

const Container = styled.section`
  max-width: 600px;
  margin: auto;
  padding: 0 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

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
  > :last-child {
    margin-top: 1rem;
  }
`;
const InfoAreaSkeleton = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  > h2 {
    color: #cc231e;
  }
`;
const ActionArea = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    margin-bottom: 1rem;
  }
`;

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

export default Donation;
