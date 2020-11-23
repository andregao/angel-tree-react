import React from 'react';
import styled from 'styled-components';

const Light = ({ index }) => {
  const length = Math.random() * 0.6 + 0.2;
  const delay = Math.random() * 0.4 + 0.5;
  return <StyledLight key={index} length={length} delay={delay} />;
};
const StyledLight = styled.li`
  display: inline-block;
  --width: 5%;
  width: var(--width);
  height: var(--width);
  margin: calc(var(--width) * 0.3) calc(var(--width) * 0.4);
  border-radius: 50%;
  background-color: #fce43c;
  animation: twinkle ${p => p.length}s alternate infinite;
  animation-delay: ${p => p.delay}s;
  opacity: 0;
  @keyframes twinkle {
    0% {
      opacity: 0.15;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const Twinkle = () => {
  const count = 50;
  const lights = new Array(count).fill({});
  return lights.map((noop, index) => <Light key={index} />);
};

export default Twinkle;
