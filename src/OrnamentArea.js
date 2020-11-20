import React, { useContext, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components/macro';
import Ornament from './Ornament';
import { children as mockChildren } from './mock/mock';
import ChildDetailModal from './modals/ChildDetailModal';
import { getTreeData } from './services/api';
import { actions, initialState, reducer } from './services/state';
import { Context } from './App';
import {
  getOrnamentsFromChildren,
  getOrnamentWidth,
} from './services/ornament';

const OrnamentArea = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentChildInfo, setChildInfo] = useState(null);
  const handleOpenModal = child => {
    setChildInfo(child);
    setModalOpen(true);
  };
  const { state, dispatch } = useContext(Context);
  useEffect(() => {
    let abort = false;
    getTreeData().then(
      data =>
        !abort && dispatch({ type: actions.receiveTreeData, payload: data })
    );
    return () => {
      abort = true;
    };
  }, []);
  console.log(state);

  const children = getOrnamentsFromChildren(state.tree?.children);
  const ornamentWidth = getOrnamentWidth(children?.length);

  return (
    <>
      <Container>
        {state.tree?.children?.map(child => (
          <Ornament
            key={child.id}
            width={ornamentWidth}
            child={child}
            onDetailsClick={() => handleOpenModal(child)}
          />
        ))}
      </Container>

      {currentChildInfo && (
        <ChildDetailModal
          {...{ currentChildInfo, isModalOpen, setModalOpen }}
        />
      )}
    </>
  );
};

const Container = styled.ul`
  width: 100%;
  height: 100%;
  text-align: center;
`;

export default OrnamentArea;
