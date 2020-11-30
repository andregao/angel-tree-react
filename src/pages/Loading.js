import React from 'react';
import styled from 'styled-components';
import Heart from '../components/Heart';

const Loading = () => {
  return (
    <Container>
      <Heart children={<div />} />
      <LoadingText>just a sec</LoadingText>
    </Container>
  );
};
const Container = styled.section`
  height: 100vh;
  background-color: lightgray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LoadingText = styled.h2`
  color: #cc231e;
`;

export default Loading;
