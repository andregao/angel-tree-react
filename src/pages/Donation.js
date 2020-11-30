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
import { AppContext } from '../App';
import { getChildInfo, sendSubmission } from '../services/api';
import { actions } from '../services/state';
import Heart from '../components/Heart';
import { validateForm } from '../services/utils';
import useForm from '../services/useForm';
import DonatedNotice from '../DonatedNotice';
import dayjs from 'dayjs';
import ProgressBar from '../components/ProgressBar';

const formInitialValues = { name: '', email: '', phone: '' };

const Donation = () => {
  const { childId } = useParams(); // id from path parameter
  const { appState, appDispatch } = useContext(AppContext);
  // console.log('appState:', appState);
  const childInfo = appState[childId];

  // form control
  const donorInfo = appState.donorInfo || formInitialValues;
  donorInfo.childId = childId; // embed current child id for post request
  const [isSubmitting, setSubmitting] = useState(false);
  const [doAgree, setAgree] = useState(false);
  const { values, handleChange, handleBlur, handleSubmit, errors } = useForm(
    donorInfo,
    validateForm,
    isSubmitting,
    submitting => setSubmitting(submitting),
    sendSubmission
  );
  // console.log('errors', errors);

  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch latest child information on render
  useEffect(() => {
    getChildInfo(childId).then(data =>
      appDispatch({ type: actions.receiveChildInfo, payload: data })
    );
  }, [childId]);

  // save form data to app state on unmount
  const formValues = useRef(values);
  formValues.current = values;
  const saveForm = () =>
    appDispatch({
      type: actions.receiveDonorInfo,
      payload: formValues.current,
    });
  useEffect(() => saveForm, []);

  return (
    <>
      <Container>
        <PageHeader text='Commitment Form' />
        <form onSubmit={handleSubmit}>
          <InputArea>
            <StyledTextField
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
            <StyledTextField
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
            <StyledTextField
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
              control={
                <Checkbox
                  checked={doAgree}
                  onClick={() => setAgree(prev => !prev)}
                  name='agreement'
                />
              }
              label={`I agree to drop off all donations by Dec 14th (${dayjs().to(
                dayjs('2020-12-14:12', 'YYYY-MM-DD:H')
              )})`}
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={
                childInfo?.donated ||
                !doAgree ||
                isSubmitting ||
                Object.keys(errors).length !== 0
              }
            >
              submit
            </Button>
            <Button
              variant='text'
              component={Link}
              to='/'
              disabled={isSubmitting}
            >
              back
            </Button>
          </ActionArea>
        </form>
      </Container>
      <InstructionModal {...{ isModalOpen, setModalOpen }} />

      {/*already donated notice*/}
      {childInfo?.donated && <DonatedNotice date={childInfo.date} />}

      {/*submitting indicator*/}
      {isSubmitting && <ProgressBar position='fixed' />}
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
  padding: 0.5rem 1rem;
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

const StyledTextField = styled(TextField)`
  min-height: 5rem;
`;

export default Donation;
