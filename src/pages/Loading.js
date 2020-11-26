import React from 'react';
import styled from 'styled-components';
import Heart from '../components/Heart';

const Loading = () => {
  return (
    <Container>
      <Heart children={<div />} />
      <FullPageText>just a sec</FullPageText>
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

export const FullPageText = styled.h2`
  color: #cc231e;
`;

export default Loading;
