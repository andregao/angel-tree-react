import React, { useState } from 'react';
import styled from 'styled-components/macro';
import Ornament from './Ornament';
import { children } from './mock/mock';
import ChildDetailModal from './modals/ChildDetailModal';

const OrnamentArea = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentChildInfo, setChildInfo] = useState(null);
  const handleOpenModal = child => {
    setChildInfo(child);
    setModalOpen(true);
  };
  return (
    <>
      <Container>
        {children.map(child => (
          <Ornament
            key={child.id}
            width='4%'
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
