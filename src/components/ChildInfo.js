import React from 'react';
import styled from 'styled-components/macro';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CardContent from '@material-ui/core/CardContent';
import Skeleton from '@material-ui/lab/Skeleton';

const ChildInfo = ({ childInfo }) => {
  const { sizes, wishes } = childInfo;
  return (
    <Container>
      <Card variant='outlined'>
        <CardContent>
          <Typography color='textSecondary'>Wish List</Typography>
          <List component='ul' aria-label="child's wish list">
            {wishes ? (
              childInfo.wishes.map(item => (
                <ListItem key={item}>
                  <ListItemText primary={item} />
                </ListItem>
              ))
            ) : (
              <ListSkeleton />
            )}
          </List>
        </CardContent>
      </Card>
      <Card variant='outlined'>
        <CardContent>
          <Typography color='textSecondary'>Sizes</Typography>
          <List component='ul' aria-label="child's wish list">
            {sizes ? (
              childInfo.sizes.map(item => (
                <ListItem key={item}>
                  <ListItemText primary={item} />
                </ListItem>
              ))
            ) : wishes ? (
              <Typography variant='body2'>No Sizing Info</Typography>
            ) : (
              <ListSkeleton />
            )}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};
const Container = styled.article`
  display: grid;
  grid-gap: 0.8rem;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  & > * {
    flex: 1 1 10rem;
  }
`;

const SkeletonContainer = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  > * {
    flex-basis: 24px;
    margin: 8px 16px;
  }
`;
const ListSkeleton = () => (
  <SkeletonContainer>
    <Skeleton variant='text' />
    <Skeleton variant='text' />
  </SkeletonContainer>
);
export default ChildInfo;
