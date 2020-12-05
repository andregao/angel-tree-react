import React, { useContext, useEffect, useRef, useState } from 'react';
import TreeSvg from '../assets/tree.svg';
import OrnamentArea from '../OrnamentArea';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { AppContext, TreeContext } from '../App';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import InstructionModal from '../modals/InstructionModal';
import Snow from '../components/Snow';

const Tree = () => {
  const {
    appState: { adminSecret },
  } = useContext(AppContext);
  const {
    treeState: { children, allDonated },
  } = useContext(TreeContext);
  const history = useHistory();

  const handleAdmin = () => history.push(adminSecret ? '/admin' : '/login');
  const snow = useRef(
    <>
      <Snow layer='front' />
      <Snow layer='mid' />
      <Snow layer='back' />
    </>
  );
  const jingleBellsRef = useRef(null);
  const [played, setPlay] = useState(false);
  const handlePlaySound = () => {
    if (!played) {
      setPlay(true);
      jingleBellsRef.current.play();
    }
  };
  const handleInstructionClick = () => {
    setModalOpen(true);
    handlePlaySound();
  };
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  useEffect(() => {
    allDonated && setSnackbarOpen(true);
  }, [allDonated]);
  return (
    <Container>
      <SiteTitle variant='h6' color='primary' onClick={handleAdmin}>
        Mater Academy Bonanza Angel Tree 2020
      </SiteTitle>
      {children &&
        (allDonated ? (
          <TopRightButton
            size='small'
            variant='outlined'
            onClick={() => history.push('/waitlist')}
          >
            Join Waitlist
          </TopRightButton>
        ) : (
          <TopRightButton
            variant='outlined'
            size='small'
            onClick={handleInstructionClick}
          >
            Instructions
          </TopRightButton>
        ))}
      <TreeContainer onClick={handlePlaySound}>
        <TreeImage src={TreeSvg} />
        <BranchesWithPaddings>
          <LeftPadding />
          <RightPadding />
          <OrnamentArea />
        </BranchesWithPaddings>
      </TreeContainer>

      {snow.current}

      {allDonated && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          TransitionComponent={Transition}
          transitionDuration={800}
          open={isSnackbarOpen}
          onClose={handleSnackbarClose}
          autoHideDuration={5000}
          message='All children donated!'
        />
      )}
      <InstructionModal {...{ isModalOpen, setModalOpen }} />
      <audio
        src='https://firebasestorage.googleapis.com/v0/b/xmas2020.appspot.com/o/bells.mp3?alt=media&token=3b680f62-840f-4063-8165-6f8820624ca3'
        preload='auto'
        ref={jingleBellsRef}
      />
    </Container>
  );
};

const Transition = props => {
  return <Slide {...props} direction='left' />;
};

const Container = styled.section`
  height: 100vh;
  max-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  z-index: 0;
  background: linear-gradient(
    rgb(0, 96, 145),
    rgb(137, 188, 202) 61%,
    rgb(225, 230, 239) 72%,
    rgb(245, 251, 255)
  );
`;

const SiteTitle = styled(Typography)`
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  z-index: 100;
  padding: 0.2rem 1rem;
  background-color: rgba(251, 245, 233, 0.85);
`;
const TopRightButton = styled(Button)`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  margin: 5% 3%;
  color: white;
  border-color: white;
`;

const TreeContainer = styled.ul`
  position: absolute;
  max-width: calc(100vh / 1.31);
  top: 0;
  width: 100%;
  max-height: 100vh;
  z-index: 50;
`;
const TreeImage = styled.img`
  width: 100%;
  filter: drop-shadow(0 3px 3px rgba(255, 255, 255, 0.5));
`;

const BranchesWithPaddings = styled.div`
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 74%;
  //background-color: rgba(200, 200, 200, 0.4);
`;

const leftPolygon = `polygon(0 0, 94% 0, 51.86% 21.83%, 63.32% 21.92%, 39.33% 37.43%, 52.12% 37.53%, 30% 53.3%, 38.53% 53.26%, 22.27% 68.63%, 32.14% 69.14%, 12.94% 84.64%, 25.46% 85.05%, 1.5% 100%)`;
const LeftPadding = styled.div`
  shape-outside: ${leftPolygon};
  clip-path: ${leftPolygon};
  //background-color: rgba(100, 100, 100, 0.5);
  width: 50%;
  height: 100%;
  float: left;
`;
const rightPolygon = `polygon(5% 0px, 47% 21.83%, 36% 21.92%, 60% 37.43%, 46.73% 37.94%, 68.47% 53.71%, 60% 53.26%, 77% 69.09%, 66.67% 69.5%, 86% 85%, 74.20% 84.78%, 96% 100%, 100% 0px)`;
const RightPadding = styled.div`
  shape-outside: ${rightPolygon};
  clip-path: ${rightPolygon};
  //background-color: rgba(100, 100, 100, 0.5);
  width: 50%;
  height: 100%;
  float: right;
`;

export default Tree;
