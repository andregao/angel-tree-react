import React from 'react';
import styled from 'styled-components';
import Heart from '../components/Heart';

const Loading = () => {
  return (
    <Container>
      <Heart children={<div />} />
      <Text>just a sec</Text>
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

const Text = styled.h2`
  color: #cc231e;
`;

export default Loading;
