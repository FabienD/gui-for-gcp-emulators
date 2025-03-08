import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { IconButton, Tooltip, Box } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';

type CopyableSyntaxHighlighterProps = {
  language: string;
  value: string;
};

const CopyableSyntaxHighlighter: React.FC<CopyableSyntaxHighlighterProps> = ({
  language,
  value,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box position="relative">
      <Tooltip title="Copy">
        <IconButton
          onClick={handleCopy}
          style={{ position: 'absolute', top: 0, right: 0 }}
        >
          <FileCopyIcon color="primary" />
        </IconButton>
      </Tooltip>
      <SyntaxHighlighter
        language={language}
        style={solarizedLight}
        wrapLines={true}
        wrapLongLines={true}
        codeTagProps={{ className: 'text-sm' }}
        customStyle={{
          backgroundColor: copied
            ? 'rgb(21, 101, 192, 0.08)'
            : 'rgb(253, 246, 227)',
          transition: 'background-color 0.3s ease',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </Box>
  );
};

export default CopyableSyntaxHighlighter;
