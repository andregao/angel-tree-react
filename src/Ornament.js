import React from 'react';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { ReactComponent as AngelSvg } from './assets/angel.svg';
import { getRandomColor } from './services/ornament';
import OrnamentSvg from './OrnamentSvg';

const Ornament = ({ variant, width, color, child, onDetailsClick }) => {
  const config = { variant, width, color };
  const childInfo = (
    <ChildInfoContainer>
      <h3 className='info'>
        <span className='age'>{child.age} YEAR OLD</span>
        <span className='gender'>
          {child.gender.toLowerCase() === 'male' ? '👦' : '👧'}
        </span>
      </h3>
      <div className='actions'>
        <StyledButton size='small' onClick={onDetailsClick}>
          Info
        </StyledButton>
        <StyledButton size='small' component={Link} to={`/pledge/${child.id}`}>
          Donate
        </StyledButton>
      </div>
    </ChildInfoContainer>
  );

  return (
    <Tooltip
      title={childInfo}
      enterTouchDelay={0}
      arrow
      interactive
      leaveTouchDelay={60000}
    >
      <Container width={width}>
        {child.committed ? (
          <StyledOrnament
            fill={getRandomColor()}
            rotation={Math.floor(Math.random() * 20) - 10}
          />
        ) : (
          <Angel rotation={Math.floor(Math.random() * 50) - 25} />
        )}
      </Container>
    </Tooltip>
  );
};

const Container = styled.li`
  display: inline-block;
  --width: ${({ width }) => width};
  margin: calc(var(--width) * 0.3) calc(var(--width) * 0.4); //TODO: Random values within average range
  width: var(--width);
  :hover {
    filter: drop-shadow(0 0 0.7vmin white);
  }
`;

const Angel = styled(AngelSvg)`
  fill: white;
  transform: rotate(${({ rotation }) => rotation}deg);
  filter: drop-shadow(0.3vmin 0.3vmin 0.3vmin #545454);
`;
const StyledOrnament = styled(OrnamentSvg)`
  filter: drop-shadow(0.3vmin 0.3vmin 0.3vmin #545454);
  transform: rotate(${({ rotation }) => rotation}deg);

  > :first-child {
    fill: ${({ fill }) => fill};
  }
`;

const ChildInfoContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  --font-size: 1rem;
  & > .info {
    margin: 1rem 1rem 0.5rem;
    display: flex;
    align-items: center;
    & > :not(:last-child) {
      margin-right: 0.5rem;
    }
    & > .gender {
      font-size: calc(var(--font-size) * 1.5);
    }
    & > .age {
      font-size: var(--font-size);
    }
  }
  & > .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > :not(:last-child) {
      margin-right: 0.6rem;
    }
    & .gift-emoji {
      font-size: 1.8rem;
    }
  }
`;
const StyledButton = styled(Button)`
  color: inherit;
  border-color: inherit;
`;

export default Ornament;
