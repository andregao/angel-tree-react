import React from 'react';
import styled from 'styled-components/macro';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CardContent from '@material-ui/core/CardContent';

const ChildInfo = ({ childInfo }) => {
  return (
    <Container>
      <Card variant='outlined'>
        <CardContent>
          <Typography color='textSecondary'>Wish List</Typography>
          <List component='ul' aria-label="child's wish list">
            {childInfo.wishes?.map(item => (
              <ListItem key={item}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Card variant='outlined'>
        <CardContent>
          <Typography color='textSecondary'>Sizes</Typography>
          <List component='ul' aria-label="child's wish list">
            {childInfo.sizes?.map(item => (
              <ListItem key={item}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};
const Container = styled.article`
  padding: 0 9%;
  display: grid;
  grid-gap: 0.8rem;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  & > * {
    flex: 1 1 10rem;
  }
`;
export default ChildInfo;
