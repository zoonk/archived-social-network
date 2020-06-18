import { useSlate } from 'slate-react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import {
  BorderAll,
  BorderHorizontal,
  Code,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatSize,
} from '@material-ui/icons';
import { isBlockActive, toggleBlock } from './blocks';
import { isMarkActive, toggleMark } from './marks';
import { insertTable } from './tables';
import SubIcon from '../SubIcon';
import SupIcon from '../SupIcon';
import useTranslation from '../useTranslation';

const FormatButtons = () => {
  const translate = useTranslation();
  const editor = useSlate();
  const { selection } = editor;
  const isBlock = selection?.anchor.offset === 0;

  const handleBlock = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    format: string,
  ) => {
    event.preventDefault();
    toggleBlock(editor, format);
  };

  const handleMark = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    format: string,
  ) => {
    event.preventDefault();
    toggleMark(editor, format);
  };

  const handleCode = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    return isBlock ? toggleBlock(editor, 'code') : toggleMark(editor, 'code');
  };

  return (
    <ToggleButtonGroup size="small" aria-label={translate('formatting_blocks')}>
      <ToggleButton
        value="h2"
        aria-label={translate('formatting_header')}
        title={translate('formatting_header')}
        selected={isBlockActive(editor, 'h2')}
        onMouseDown={(e) => handleBlock(e, 'h2')}
      >
        <FormatSize />
      </ToggleButton>
      <ToggleButton
        value="blockquote"
        aria-label={translate('formatting_quote')}
        title={translate('formatting_quote')}
        selected={isBlockActive(editor, 'blockquote')}
        onMouseDown={(e) => handleBlock(e, 'blockquote')}
      >
        <FormatQuote />
      </ToggleButton>
      <ToggleButton
        value="ul"
        aria-label={translate('formatting_ul')}
        title={translate('formatting_ul')}
        selected={isBlockActive(editor, 'ul')}
        onMouseDown={(e) => handleBlock(e, 'ul')}
      >
        <FormatListBulleted />
      </ToggleButton>
      <ToggleButton
        value="ol"
        aria-label={translate('formatting_ol')}
        title={translate('formatting_ol')}
        selected={isBlockActive(editor, 'ol')}
        onMouseDown={(e) => handleBlock(e, 'ol')}
      >
        <FormatListNumbered />
      </ToggleButton>
      <ToggleButton
        value="code"
        aria-label={translate('formatting_code')}
        title={translate('formatting_code')}
        selected={isBlockActive(editor, 'code') || isMarkActive(editor, 'code')}
        onMouseDown={handleCode}
      >
        <Code />
      </ToggleButton>
      <ToggleButton
        value="hr"
        aria-label={translate('formatting_hr')}
        title={translate('formatting_hr')}
        selected={isBlockActive(editor, 'hr')}
        onMouseDown={(e) => handleBlock(e, 'hr')}
      >
        <BorderHorizontal />
      </ToggleButton>
      <ToggleButton
        value="table"
        aria-label={translate('formatting_table')}
        title={translate('formatting_table')}
        selected={isBlockActive(editor, 'table')}
        onMouseDown={(e) => {
          e.preventDefault();
          insertTable(editor);
        }}
      >
        <BorderAll />
      </ToggleButton>
      <ToggleButton
        value="table"
        aria-label={translate('formatting_superscript')}
        title={translate('formatting_superscript')}
        selected={isMarkActive(editor, 'sup')}
        onMouseDown={(e) => handleMark(e, 'sup')}
      >
        <SupIcon />
      </ToggleButton>
      <ToggleButton
        value="table"
        aria-label={translate('formatting_subscript')}
        title={translate('formatting_subscript')}
        selected={isMarkActive(editor, 'sub')}
        onMouseDown={(e) => handleMark(e, 'sub')}
      >
        <SubIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default FormatButtons;
