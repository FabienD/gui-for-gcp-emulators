import React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type CloseButtonProps = {
  onClick: () => void;
};

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <IconButton onClick={onClick} aria-label="close">
      <CloseIcon color="primary" />
    </IconButton>
  );
};

export default CloseButton;
