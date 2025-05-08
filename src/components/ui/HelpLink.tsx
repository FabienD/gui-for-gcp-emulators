import React from 'react';

import HelpIcon from '@mui/icons-material/Help';
import { Box, IconButton } from '@mui/material';


import { openDocumentation } from '../../utils/openlink';

type HelpProps = {
  readonly linkUrl: string;
};

const handleHelpClick = async (linkUrl: string) => {
  await openDocumentation(linkUrl);
};

function HelpLink({ linkUrl }: HelpProps): React.ReactElement {
  return (
    <Box className="absolute right-4">
      <IconButton onClick={() => handleHelpClick(linkUrl)}>
        <HelpIcon color="primary" />
      </IconButton>
    </Box>
  );
}

export default HelpLink;
