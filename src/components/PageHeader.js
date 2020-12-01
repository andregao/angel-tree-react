import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const PageHeader = ({ text }) => {
  return (
    <Header>
      <Typography variant='h3' gutterBottom>
        {text}
      </Typography>
    </Header>
  );
};

const Header = styled.header`
  padding-top: 2rem;
  text-align: center;
`;

export default PageHeader;
