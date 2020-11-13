import React from 'react';
import styled from 'styled-components';
import OrnamentCollections from './OrnamentCollections';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';

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
        <StyledButton size='small' href={`/pledge/${child.id}`}>
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
      <Container width={width} glow={child.committed}>
        <OrnamentCollections {...config} />
      </Container>
    </Tooltip>
  );
};

const Container = styled.li`
  display: inline-block;
  --width: ${({ width }) => width};
  margin: calc(var(--width) * 0.25) calc(var(--width) * 0.55); //TODO: Random values within average range
  width: var(--width);
  ${({ glow }) => (glow ? '' : `filter: drop-shadow(0 0 0.7vmin white);`)}

  @keyframes pulse {
    50% {
      //filter: brightness(120%); //high gpu
      transform: scale(1.5);
    }
  }
  &:hover {
    cursor: pointer;
    animation: pulse 5 ease-in-out 1.2s;
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
const GiftIcon = styled(CardGiftcardIcon)`
  color: white;
`;
export default Ornament;
