import React, { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { ReactComponent as AngelSvg } from './assets/angel.svg';
import { getRandomColor, getTimeFromNow } from './services/ornament';
import OrnamentSvg from './OrnamentSvg';
import Typography from '@material-ui/core/Typography';
import { AppContext } from './App';
import { actions } from './services/state';

const Ornament = ({ width, child, onDetailsClick, allDonated }) => {
  const fill = useMemo(() => getRandomColor(), []);
  const ornamentShapeIndex = useMemo(() => Math.floor(Math.random() * 3), []);
  const ornamentRotation = useMemo(
    () => Math.floor(Math.random() * 20) - 10,
    []
  );
  const angelRotation = useMemo(() => Math.floor(Math.random() * 40) - 20, []);
  const glowConfig = useMemo(
    () => ({
      length: Math.random() + 0.8,
    }),
    []
  );
  const tooltipContent = (
    <TooltipContentContainer>
      <h3 className='info'>
        <span className='age'>{child.age} YEAR OLD</span>
        <span className='gender'>
          {child.gender.toLowerCase() === 'male' ? '👦' : '👧'}
        </span>
      </h3>
      <div className='actions'>
        {child.donated ? (
          <Typography variant='subtitle1'>
            Donated {getTimeFromNow(child.date)}
          </Typography>
        ) : (
          <>
            <StyledButton size='small' onClick={onDetailsClick}>
              Info
            </StyledButton>
            <StyledButton
              size='small'
              component={Link}
              variant='outlined'
              to={`/donate/${child.id}`}
            >
              Donate
            </StyledButton>
          </>
        )}
      </div>
    </TooltipContentContainer>
  );
  const { appState, appDispatch } = useContext(AppContext);
  const handleTooltipOpen = () => {
    !appState[child.id] &&
      appDispatch({ type: actions.receiveChildInfo, payload: child });
  };
  return (
    <Tooltip
      title={tooltipContent}
      enterTouchDelay={0}
      arrow
      interactive
      leaveTouchDelay={60000}
      onOpen={handleTooltipOpen}
    >
      <Container width={width} showShadow={!allDonated}>
        {allDonated ? (
          <FlashingOrnament
            fill={fill}
            rotation={ornamentRotation}
            index={ornamentShapeIndex}
            glowConfig={glowConfig}
          />
        ) : child.donated ? (
          <StyledOrnament
            fill={fill}
            rotation={ornamentRotation}
            index={ornamentShapeIndex}
          />
        ) : (
          <Angel rotation={angelRotation} />
        )}
      </Container>
    </Tooltip>
  );
};

const Container = styled.li`
  display: inline-block;
  --width: ${({ width }) => width};
  margin: calc(var(--width) * 0.3) calc(var(--width) * 0.4);
  width: var(--width);
  ${({ showShadow }) =>
    showShadow ? 'filter: drop-shadow(0.3vmin 0.3vmin 0.3vmin #545454);' : ''}
  :hover {
    filter: drop-shadow(0 0 0.7vmin white);
  }
  animation: fadeIn 2s;
  opacity: 1;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  }
`;

const Angel = styled(AngelSvg)`
  fill: white;
  transform: rotate(${({ rotation }) => rotation}deg);
`;
const StyledOrnament = styled(OrnamentSvg)`
  transform: rotate(${({ rotation }) => rotation}deg);

  > :first-child {
    fill: ${({ fill }) => fill};
  }
`;
const FlashingOrnament = styled(StyledOrnament)`
  opacity: 0;
  @keyframes flashOrnament {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  animation: flashOrnament ${p => p.glowConfig.length}s alternate infinite;
`;

const TooltipContentContainer = styled.section`
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
  margin: 0.5rem 0.2rem;
`;

export default Ornament;
