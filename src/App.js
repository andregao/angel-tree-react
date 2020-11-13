import React from 'react';
import styled from 'styled-components/macro';
import TreeSvg from './assets/tree.svg';
import OrnamentArea from './OrnamentArea';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

function App() {
  return (
    <Container>
      <TreeContainer>
        <TreeImage src={TreeSvg} />
        <BranchesWithPaddings>
          <LeftPadding />
          <RightPadding />
          <OrnamentArea />
        </BranchesWithPaddings>
      </TreeContainer>
      <div style={{ position: 'absolute', right: 10, bottom: 30 }}>
        <Button
          variant='contained'
          component={Link}
          to='/admin'
          color='primary'
        >
          Admin
        </Button>
      </div>
    </Container>
  );
}

const Container = styled.section`
  height: 100vh;
  max-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
`;

const TreeContainer = styled.ul`
  position: absolute;
  max-width: calc(100vh / 1.31);
  top: 0;
  width: 100%;
  max-height: 100vh;
`;
const TreeImage = styled.img`
  width: 100%;
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

export default App;
