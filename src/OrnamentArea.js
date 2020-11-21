import React, { useContext, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components/macro';
import Ornament from './Ornament';
import { children as mockChildren } from './mock/mock';
import ChildInfoModal from './modals/ChildInfoModal';
import { getChildInfo, getTreeData } from './services/api';
import { actions, initialState, treeReducer } from './services/state';
import { ChildrenContext, TreeContext } from './App';
import { limitChildren, getOrnamentWidth } from './services/ornament';

const OrnamentArea = () => {
  const { treeState, treeDispatch } = useContext(TreeContext);
  const { childrenState, childrenDispatch } = useContext(ChildrenContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentChildId, setCurrentChildId] = useState(null);
  const handleOpenModal = child => {
    childrenDispatch({ type: actions.receiveChildInfo, payload: child });
    getChildInfo(child.id).then(data =>
      childrenDispatch({ type: actions.receiveChildInfo, payload: data })
    );
    setCurrentChildId(child.id);
    setModalOpen(true);
  };
  useEffect(() => {
    let abort = false;
    getTreeData().then(
      data =>
        !abort && treeDispatch({ type: actions.receiveTreeData, payload: data })
    );
    return () => {
      abort = true;
    };
  }, []);
  console.log('tree state', treeState);
  console.log('children state', childrenState);

  const children =
    treeState.children?.length > 100
      ? limitChildren(treeState.children)
      : treeState.children;
  const ornamentWidth = getOrnamentWidth(children?.length);

  return (
    <>
      <Container>
        {treeState.children?.map(child => (
          <Ornament
            key={child.id}
            width={ornamentWidth}
            child={child}
            onDetailsClick={() => handleOpenModal(child)}
          />
        ))}
      </Container>

      {currentChildId && (
        <ChildInfoModal
          {...{
            currentChildInfo: childrenState[currentChildId],
            isModalOpen,
            setModalOpen,
          }}
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
