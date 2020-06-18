import { useState } from 'react';
import { Node, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { Divider, makeStyles, TextField } from '@material-ui/core';
import AlignToolbar from './AlignToolbar';
import { AlignOption } from './types';
import useTranslation from '../useTranslation';

interface ImageToolbarProps {
  element: Node;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(0.5),
    },
  },
  imgSize: { width: '100px' },
  divider: { margin: theme.spacing(1, 0.5) },
}));

const ImageToolbar = ({ element }: ImageToolbarProps) => {
  const translate = useTranslation();
  const [align, setAlign] = useState<AlignOption>(
    (element.align as AlignOption) || 'center',
  );
  const classes = useStyles();
  const editor = useSlate();

  const handleChange = (prop: string, value: string) => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { [prop]: value }, { at: path });
  };

  return (
    <div className={classes.root}>
      <TextField
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => handleChange('width', e.target.value)}
        variant="outlined"
        id="image-width"
        label={translate('width')}
        name="width"
        type="text"
        className={classes.imgSize}
        defaultValue={element.width}
      />
      <TextField
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => handleChange('height', e.target.value)}
        variant="outlined"
        id="image-height"
        label={translate('height')}
        name="height"
        type="text"
        className={classes.imgSize}
        defaultValue={element.height}
      />
      <Divider flexItem orientation="vertical" className={classes.divider} />
      <AlignToolbar
        align={align}
        onChange={(newValue) => {
          setAlign(newValue);
          handleChange('align', newValue);
        }}
      />
      <Divider flexItem orientation="vertical" className={classes.divider} />
      <TextField
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => handleChange('title', e.target.value)}
        variant="outlined"
        id="image-title"
        label={translate('caption')}
        name="width"
        type="text"
        defaultValue={element.title}
      />
    </div>
  );
};

export default ImageToolbar;
