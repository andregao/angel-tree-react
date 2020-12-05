import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Ornament from './Ornament';
import ChildInfoModal from './modals/ChildInfoModal';
import { getTreeData } from './services/api';
import { actions } from './services/state';
import { TreeContext } from './App';
import { getOrnamentWidth, limitChildren } from './services/ornament';
import Twinkle from './components/Twinkle';

const OrnamentArea = () => {
  const { treeState, treeDispatch } = useContext(TreeContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentChildId, setCurrentChildId] = useState(null);
  const handleOpenModal = child => {
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

  const children =
    treeState.children?.length > 100
      ? limitChildren(treeState.children)
      : treeState.children;
  const ornamentWidth = getOrnamentWidth(children?.length);
  // check if all donated
  useEffect(() => {
    if (children?.length > 0) {
      const result = !children.filter(child => !child.donated).length;
      treeDispatch({ type: actions.checkAllDonated, payload: result });
    }
  }, [treeState.updated]);
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
            currentChildId,
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
