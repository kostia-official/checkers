import React from 'react';
import styled from 'styled-components';
import { Loader } from '@mantine/core';
import { LoaderProps } from '@mantine/core/lib/Loader/Loader';

const CenteredContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export interface CenteredLoaderProps {
  size?: LoaderProps['size'];
}

export const CenteredLoader: React.FC<CenteredLoaderProps> = ({ size = 'xl' }) => {
  return (
    <CenteredContainer>
      <Loader variant="dots" size={size} />
    </CenteredContainer>
  );
};
