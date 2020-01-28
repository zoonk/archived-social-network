import { useContext, useRef } from 'react';
import NextLink from 'next/link';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Edit, Reorder } from '@material-ui/icons';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { Post } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';

interface LessonSortableItemProps {
  divider?: boolean;
  index: number;
  item: Post.Get;
  moveItem: (drag: number, hover: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

/**
 * Sortable lesson item.
 */
const LessonSortableItem = ({
  divider,
  index,
  item,
  moveItem,
}: LessonSortableItemProps) => {
  const { translate } = useContext(GlobalContext);
  const { id, title } = item;
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: 'list',
    hover(dragItem: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = dragItem.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current!.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      dragItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'list', id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <ListItem
      alignItems="center"
      divider={divider}
      button
      disableGutters
      style={{ opacity, cursor: 'move' }}
      ref={ref}
    >
      <ListItemIcon>
        <Reorder />
      </ListItemIcon>
      <ListItemText primary={title} />
      <ListItemSecondaryAction>
        <NextLink href="/posts/[id]/edit" as={`/posts/${id}/edit`} passHref>
          <IconButton component="a" edge="end" aria-label={translate('edit')}>
            <Edit />
          </IconButton>
        </NextLink>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default LessonSortableItem;
