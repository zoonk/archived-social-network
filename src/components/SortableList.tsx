import { useRouter } from 'next/router';
import { Button, List } from '@material-ui/core';
import { theme } from '@zoonk/utils';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import SortableListItem from './SortableListItem';
import useTranslation from './useTranslation';

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
  onDelete?: (id: string) => void;
  onSave: () => void;
}

const SortableList = ({
  category,
  items,
  saving,
  onCancel,
  onDelete,
  onMove,
  onSave,
}: SortableListProps) => {
  const translate = useTranslation();
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
            onDelete={onDelete ? () => onDelete(item.id) : undefined}
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
