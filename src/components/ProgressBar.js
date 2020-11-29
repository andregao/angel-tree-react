import styled from 'styled-components/macro';
import LinearProgress from '@material-ui/core/LinearProgress';

const ProgressBar = styled(LinearProgress)`
  width: 100%;
  position: ${props => props.position};
  left: 0;
  bottom: 0;
`;

export default ProgressBar;
