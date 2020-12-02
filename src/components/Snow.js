import React from 'react';
import styled from 'styled-components';

// reference https://youtu.be/8eyAoBBucHk
const flakCount = { front: 15, mid: 20, back: 30 };
const zIndices = { front: 55, mid: 45, back: 35 };
const sizes = { front: '2.5vh', mid: '2vh', back: '1.5vh' };
const blurLevels = { front: '1.5px', mid: '3px', back: '6px' };
const speeds = { front: '12', mid: '15', back: '18' };
const iterationCount = { front: 1, mid: 2, back: 'infinite' };
const Snow = ({ layer }) => {
  const boxShadow = getBoxShadow(flakCount[layer]);
  const config = {
    size: sizes[layer],
    blur: blurLevels[layer],
    duration: speeds[layer],
    iterationCount: iterationCount[layer],
    boxShadow,
  };

  return (
    <Container zIndex={zIndices[layer]}>
      <Flakes config={config} />
      <Flakes config={config} delayed />
    </Container>
  );
};

const Container = styled.ul`
  position: fixed;
  top: -100vh;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${props => props.zIndex};

  @keyframes fall {
    100% {
      transform: translateY(200vh);
    }
  }
`;
const Flakes = styled.li`
  --size: ${props => props.config.size};
  border-radius: 50%;
  opacity: 0.8;
  width: var(--size);
  height: var(--size);
  filter: blur(${props => props.config.blur});

  box-shadow: ${props => props.config.boxShadow};
  animation: fall linear ${props => props.config.iterationCount};
  animation-duration: ${props => props.config.duration}s;
  animation-delay: -${props => (props.delayed ? props.config.duration / 2 : 0)}s;
`;

function getBoxShadow(flakeCount) {
  let result = '';
  for (let i = 0; i < flakeCount; i++) {
    result = `${result}${Math.floor(Math.random() * 1000) / 10}vw ${
      Math.floor(Math.random() * 900) / 10
    }vh 0 -${Math.floor(Math.random() * 5) / 10}rem white`;
    i !== flakeCount - 1 && (result += ',');
  }
  // console.log(result);
  return result;
}

export default Snow;
