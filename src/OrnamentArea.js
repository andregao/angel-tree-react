import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import Ornament from './Ornament';
import ChildInfoModal from './modals/ChildInfoModal';
import { getChildInfo, getTreeData } from './services/api';
import { actions } from './services/state';
import { ChildrenContext, TreeContext } from './App';
import { getOrnamentWidth, limitChildren } from './services/ornament';
import Twinkle from './components/Twinkle';

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
        {treeState.children ? (
          treeState.children.map(child => (
            <Ornament
              key={child.id}
              width={ornamentWidth}
              child={child}
              onDetailsClick={() => handleOpenModal(child)}
            />
          ))
        ) : (
          <Twinkle />
        )}
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
