import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Button, List } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import SortableListItem from './SortableListItem';

interface ListContent {
  id: string;
  title: string;
}

interface SortableListProps {
  category: 'chapters' | 'posts';
  items: ListContent[];
  saving: boolean;
  onMove: (drag: number, hover: number) => void;
  onCancel?: () => void;
  onSave: () => void;
}

/**
 * Sortable list.
 */
const SortableList = ({
  category,
  items,
  saving,
  onCancel,
  onMove,
  onSave,
}: SortableListProps) => {
  const { translate } = useContext(GlobalContext);
  const { back } = useRouter();

  return (
    <DndProvider backend={Backend}>
      <List disablePadding>
        {items.map((item, index) => (
          <SortableListItem
            category={category}
            key={item.id}
            index={index}
            divider={index !== items.length - 1}
            id={item.id}
            title={item.title}
            moveItem={onMove}
          />
        ))}
      </List>

      <Button
        variant="contained"
        color="primary"
        style={{ margin: theme.spacing(3, 0, 0) }}
        disabled={saving}
        onClick={onSave}
      >
        {translate('save_changes')}
      </Button>

      <Button
        type="reset"
        color="secondary"
        style={{ margin: theme.spacing(3, 2, 0) }}
        disabled={saving}
        onClick={onCancel || back}
      >
        {translate('cancel')}
      </Button>
    </DndProvider>
  );
};

export default SortableList;
